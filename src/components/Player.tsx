import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  AlertTriangle,
  Radio,
  Tv,
  Subtitles,
  Activity,
  List,
  Rewind,
  Zap,
  X,
  Check,
  Clock,
  Trophy,
  Disc,
  History,
  PictureInPicture,
  Languages,
} from 'lucide-react';
import { Channel, EpgProgram, PlaybackState, TimeZoneSetting, StreamDiagnostics } from '../types';
import { formatTimeInZone, getProgramProgress } from '../utils/dateUtils';
import {
  createDefaultDiagnostics,
  formatBitrate,
  formatBuffer,
  calculateStreamHealth,
} from '../utils/streamDiagnostics';
import { calculateProgramTimeshift, formatDuration } from '../utils/catchupUtils';

interface PlayerProps {
  channel: Channel | null;
  currentProgram?: EpgProgram;
  nextProgram?: EpgProgram;
  timeZone: TimeZoneSetting;
  allChannels?: Channel[];
  onSelectChannel?: (channel: Channel) => void;
  onOpenSportsBar?: () => void;
  onClose?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  onRecallLastChannel?: () => void;
  lastChannel?: Channel | null;
  onRecordLive?: () => void;
  isRecording?: boolean;
}

export const Player: React.FC<PlayerProps> = ({
  channel,
  currentProgram,
  nextProgram,
  timeZone,
  allChannels = [],
  onSelectChannel,
  onOpenSportsBar,
  onClose,
  onNextChannel,
  onPrevChannel,
  onRecallLastChannel,
  lastChannel,
  onRecordLive,
  isRecording = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [audioTracks, setAudioTracks] = useState<{ id: number; name: string; lang?: string }[]>([]);
  const [selectedAudioTrack, setSelectedAudioTrack] = useState<number>(-1);
  const [subtitleTracks, setSubtitleTracks] = useState<{ id: number; name: string; lang?: string }[]>([]);
  const [selectedSubtitleTrack, setSelectedSubtitleTrack] = useState<number>(-1);
  const [showTrackMenu, setShowTrackMenu] = useState<boolean>(false);
  const [isPipAvailable, setIsPipAvailable] = useState<boolean>(false);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [showOsd, setShowOsd] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<'fit' | 'cover' | 'standard'>('fit');
  const [captionsActive, setCaptionsActive] = useState<boolean>(false);
  const [availableSubtitles, setAvailableSubtitles] = useState<number>(0);

  // Phase 1 Features:
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);
  const [diagnostics, setDiagnostics] = useState<StreamDiagnostics>(createDefaultDiagnostics);
  const [showMiniGuide, setShowMiniGuide] = useState<boolean>(false);
  const [isRestarted, setIsRestarted] = useState<boolean>(false);
  const [restartedOffsetSec, setRestartedOffsetSec] = useState<number>(0);

  const [errorState, setErrorState] = useState<{
    type: 'cors' | 'offline' | 'codec' | 'generic';
    message: string;
    details: string;
  } | null>(null);

  // Auto-hide OSD after 5.5 seconds of inactivity
  const osdTimerRef = useRef<number | null>(null);
  const pingOsd = () => {
    setShowOsd(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = window.setTimeout(() => {
      setShowOsd(false);
    }, 6000);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Diagnostics Poller
  useEffect(() => {
    if (!videoRef.current) return;
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      // Calculate buffer length
      let bufferLength = 0;
      if (video.buffered && video.buffered.length > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
          if (
            video.currentTime >= video.buffered.start(i) &&
            video.currentTime <= video.buffered.end(i)
          ) {
            bufferLength = video.buffered.end(i) - video.currentTime;
            break;
          }
        }
      }

      // Dropped frames check
      let dropped = 0;
      const vq = (video as any).getVideoPlaybackQuality?.();
      if (vq) {
        dropped = vq.droppedVideoFrames || 0;
      }

      setDiagnostics((prev) => ({
        ...prev,
        bufferLengthSec: bufferLength,
        droppedFrames: dropped,
        resolution:
          video.videoWidth && video.videoHeight
            ? `${video.videoWidth}x${video.videoHeight}`
            : prev.resolution,
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Main stream loading & HLS lifecycle
  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const video = videoRef.current;
    setErrorState(null);
    setIsBuffering(true);
    setIsRestarted(false);
    setRestartedOffsetSec(0);
    pingOsd();

    // Reset default diagnostics
    setDiagnostics(createDefaultDiagnostics());

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = channel.url;

    // Check if browser has native HLS support (Safari / iOS)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsBuffering(false);
        })
        .catch((err) => {
          console.warn('Native video play failed:', err);
          setIsBuffering(false);
        });
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setIsBuffering(false);
        setAvailableSubtitles(data.subtitleTracks?.length || 0);
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.log('Auto-play blocked by browser policy, user interaction required', e);
            setIsPlaying(false);
          });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setDiagnostics((prev) => ({
            ...prev,
            resolution: `${level.width}x${level.height}`,
            bitrateKbps: Math.round(level.bitrate / 1000),
            videoCodec: level.videoCodec || 'H.264',
            audioCodec: level.audioCodec || 'AAC',
            fps: level.frameRate || 30,
            levelIndex: data.level,
          }));
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        const stats = (data as any)?.stats || (data as any)?.frag?.stats;
        if (stats && stats.bwEstimate) {
          const estKbps = Math.round(stats.bwEstimate / 1000);
          setDiagnostics((prev) => ({
            ...prev,
            bitrateKbps: prev.bitrateKbps > 0 ? prev.bitrateKbps : estKbps,
          }));
        }
      });

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
        setAvailableSubtitles(data.subtitleTracks?.length || 0);
        if (data.subtitleTracks && data.subtitleTracks.length > 0) {
          setSubtitleTracks(
            data.subtitleTracks.map((t, idx) => ({
              id: idx,
              name: t.name || `Subtitles ${idx + 1}`,
              lang: t.lang || '',
            }))
          );
        }
      });

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
        if (data.audioTracks && data.audioTracks.length > 0) {
          setAudioTracks(
            data.audioTracks.map((t, idx) => ({
              id: idx,
              name: t.name || `Audio ${idx + 1}`,
              lang: t.lang || '',
            }))
          );
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsBuffering(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (data.response && data.response.code === 0) {
                setErrorState({
                  type: 'cors',
                  message: 'Provider blocked browser playback (CORS Restriction)',
                  details:
                    'This IPTV provider does not allow direct cross-origin playback in web browsers. Use the CORS Proxy toggle in Settings or upload the playlist as a file.',
                });
              } else {
                setErrorState({
                  type: 'offline',
                  message: 'Stream is offline or unreachable',
                  details: `The streaming server returned status ${data.response?.code || 'timeout'}. Please try switching channels or verify your network.`,
                });
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setErrorState({
                type: 'codec',
                message: 'Unsupported format or corrupted media segment',
                details: 'The audio/video codec in this stream is not supported by your browser.',
              });
              hls.recoverMediaError();
              break;
            default:
              setErrorState({
                type: 'generic',
                message: 'Stream playback error',
                details: data.details || 'An unexpected error occurred while loading this stream.',
              });
              hls.destroy();
              break;
          }
        }
      });
    } else {
      setErrorState({
        type: 'codec',
        message: 'HLS streaming not supported in this browser',
        details: 'Please use a modern browser such as Chrome, Edge, or Firefox on Windows.',
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel?.url]);

  // Restart TV (Bell Fibe / VMedia Lookback style)
  const timeshift = currentProgram
    ? calculateProgramTimeshift(currentProgram.start, currentProgram.end)
    : null;

  const handleRestartTv = () => {
    if (!videoRef.current || !timeshift) return;
    const video = videoRef.current;

    // Seek back to start of current program or beginning of available buffer
    if (video.seekable && video.seekable.length > 0) {
      const seekStart = video.seekable.start(0);
      video.currentTime = seekStart;
    } else {
      video.currentTime = Math.max(0, video.currentTime - timeshift.elapsedSec);
    }

    setIsRestarted(true);
    setRestartedOffsetSec(timeshift.elapsedSec);
    pingOsd();
  };

  const handleGoLive = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.seekable && video.seekable.length > 0) {
      video.currentTime = video.seekable.end(video.seekable.length - 1);
    }
    setIsRestarted(false);
    setRestartedOffsetSec(0);
    pingOsd();
  };

  // Video event handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    pingOsd();
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    pingOsd();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
    pingOsd();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  const retryPlayback = () => {
    if (!channel) return;
    setErrorState(null);
    setIsBuffering(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
    if (hlsRef.current) {
      hlsRef.current.loadSource(channel.url);
    }
  };

  const toggleSubtitles = () => {
    if (!hlsRef.current) return;
    const nextState = !captionsActive;
    setCaptionsActive(nextState);
    hlsRef.current.subtitleTrack = nextState ? 0 : -1;
    pingOsd();
  };

  useEffect(() => {
    if (typeof document !== 'undefined' && 'pictureInPictureEnabled' in document) {
      setIsPipAvailable(document.pictureInPictureEnabled);
    }
  }, []);

  const handleSwitchAudio = (trackId: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.audioTrack = trackId;
    setSelectedAudioTrack(trackId);
    pingOsd();
  };

  const handleSwitchSubtitle = (trackId: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.subtitleTrack = trackId;
    setSelectedSubtitleTrack(trackId);
    setCaptionsActive(trackId >= 0);
    pingOsd();
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('Picture-in-Picture error:', err);
    }
    pingOsd();
  };

  const toggleAspectRatio = () => {
    const modes: ('fit' | 'cover' | 'standard')[] = ['fit', 'cover', 'standard'];
    const next = modes[(modes.indexOf(aspectRatio) + 1) % modes.length];
    setAspectRatio(next);
    pingOsd();
  };

  if (!channel) {
    return (
      <div className="w-full aspect-video bg-cable-900 border border-cable-border rounded-xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Tv className="w-16 h-16 text-slate-600 mb-3 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-200">No Channel Selected</h3>
        <p className="text-sm mt-1 max-w-md">
          Pick a channel from Live TV, your Favourites, or the TV Guide to start watching.
        </p>
      </div>
    );
  }

  const progress = currentProgram ? getProgramProgress(currentProgram.start, currentProgram.end) : 0;
  const health = calculateStreamHealth(diagnostics.bufferLengthSec, diagnostics.droppedFrames);

  return (
    <div
      ref={containerRef}
      onMouseMove={pingOsd}
      onClick={pingOsd}
      className={`relative w-full bg-black overflow-hidden group select-none shadow-2xl transition-all ${
        isFullscreen ? 'h-screen w-screen fixed inset-0 z-50 rounded-none' : 'aspect-video rounded-xl border border-cable-border/80'
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full ${
          aspectRatio === 'cover'
            ? 'object-cover'
            : aspectRatio === 'standard'
            ? 'object-fill'
            : 'object-contain'
        }`}
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && !errorState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-cable-focus" />
          <span className="mt-3 text-amber-300 font-mono text-sm tracking-wider uppercase font-semibold">
            Tuning CH {channel.channelNumber}...
          </span>
        </div>
      )}

      {/* Stream Diagnostics HUD (TiviMate style technical metrics) */}
      {showDiagnostics && (
        <div className="absolute top-16 right-4 z-40 bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 p-3.5 rounded-xl shadow-2xl font-mono text-xs text-slate-200 max-w-xs space-y-2 pointer-events-auto">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-1.5 text-amber-400 font-bold">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>STREAM DIAGNOSTICS</span>
            </div>
            <button
              onClick={() => setShowDiagnostics(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Resolution:</span>
              <span className="font-bold text-white">{diagnostics.resolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bitrate:</span>
              <span className="font-bold text-white">{formatBitrate(diagnostics.bitrateKbps)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Buffer Health:</span>
              <span className={`font-bold ${health.color}`}>
                {formatBuffer(diagnostics.bufferLengthSec)} ({health.label})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Video / Audio:</span>
              <span>{diagnostics.videoCodec} / {diagnostics.audioCodec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dropped Frames:</span>
              <span className={diagnostics.droppedFrames > 0 ? 'text-amber-400' : 'text-slate-300'}>
                {diagnostics.droppedFrames}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Surfing Mini-Guide Drawer (TiviMate & Pluto TV style) */}
      {showMiniGuide && allChannels.length > 0 && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-cable-border p-4 shadow-2xl pointer-events-auto space-y-2 max-h-[48%] flex flex-col">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <List className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                Quick Surfing Mini-Guide
              </span>
              <span className="text-[10px] text-slate-400">
                (Click or press Enter to zap channel)
              </span>
            </div>
            <button
              onClick={() => setShowMiniGuide(false)}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-neutral-800"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto flex items-center space-x-3 py-1 no-scrollbar">
            {allChannels.map((ch) => {
              const isCur = ch.id === channel.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    onSelectChannel?.(ch);
                    setShowMiniGuide(false);
                  }}
                  role="button"
                  tabIndex={0}
                  className={`shrink-0 w-44 p-2.5 rounded-xl border cursor-pointer transition flex items-center space-x-2.5 ${
                    isCur
                      ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold shadow-cable-focus'
                      : 'bg-cable-900 border-neutral-800 hover:bg-cable-800 text-white'
                  }`}
                >
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded font-black shrink-0 ${
                      isCur ? 'bg-black text-amber-400' : 'bg-black text-amber-400'
                    }`}
                  >
                    {ch.channelNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold truncate">{ch.name}</h5>
                    <span
                      className={`text-[10px] block truncate ${
                        isCur ? 'text-neutral-900' : 'text-slate-400'
                      }`}
                    >
                      {ch.group}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plain Language Error Overlay */}
      {errorState && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 shadow-lg animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-mono px-2.5 py-1 rounded bg-red-950/90 text-red-300 border border-red-800 mb-2">
            Playback Error ({errorState.type.toUpperCase()})
          </span>
          <h3 className="text-xl font-bold text-white max-w-lg">{errorState.message}</h3>
          <p className="text-sm text-slate-300 mt-2 max-w-md leading-relaxed">{errorState.details}</p>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={retryPlayback}
              className="flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg shadow-cable-focus cable-focus-ring"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Stream</span>
            </button>
            {onNextChannel && (
              <button
                onClick={onNextChannel}
                className="flex items-center space-x-2 px-4 py-2.5 bg-cable-800 hover:bg-cable-700 text-slate-200 rounded-lg border border-cable-border cable-focus-ring"
              >
                <span>Next Channel</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Cable Box On-Screen Display (OSD) Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 flex flex-col justify-between p-4 sm:p-6 ${
          showOsd || !isPlaying || errorState ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top OSD Bar: Channel Branding & Stream Status */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 p-2.5 px-4 rounded-xl shadow-xl pointer-events-auto">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-10 h-10 object-contain rounded bg-black/40 p-1"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                CH
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-black bg-amber-400 text-neutral-950 px-2 py-0.5 rounded shadow">
                  CH {channel.channelNumber}
                </span>
                <span className="text-base font-extrabold text-white tracking-wide">{channel.name}</span>
                <span className="text-[11px] font-semibold text-slate-300 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                  {channel.group}
                </span>
                {isRestarted && (
                  <span className="text-[10px] font-mono font-bold bg-amber-400 text-black px-1.5 py-0.2 rounded animate-pulse">
                    RESTARTED (-{formatDuration(restartedOffsetSec)})
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Source: {channel.sourceName}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pointer-events-auto">
            {/* Live Sports Companion Bar Trigger */}
            {onOpenSportsBar && (
              <button
                onClick={onOpenSportsBar}
                className="bg-neutral-950/80 hover:bg-neutral-800 text-amber-300 hover:text-white px-2.5 py-2 rounded-lg border border-neutral-700 shadow text-xs flex items-center space-x-1.5 cable-focus-ring"
                title="Live Sports Companion Bar (Rogers Xfinity / Sportsnet+)"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Scores</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </button>
            )}

            {/* Quick Surfing Drawer Button */}
            <button
              onClick={() => setShowMiniGuide((prev) => !prev)}
              className="bg-neutral-950/80 hover:bg-neutral-800 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-neutral-700 shadow text-xs flex items-center space-x-1.5 cable-focus-ring"
              title="Channel Surfing Mini-Guide (G)"
            >
              <List className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Channels</span>
            </button>

            {/* Diagnostics HUD Toggle */}
            <button
              onClick={() => setShowDiagnostics((prev) => !prev)}
              className={`p-2 rounded-lg border shadow cable-focus-ring ${
                showDiagnostics
                  ? 'bg-amber-400 text-black border-amber-300'
                  : 'bg-neutral-950/80 hover:bg-neutral-800 text-slate-300 hover:text-white border-neutral-700'
              }`}
              title="Stream Diagnostics HUD (D)"
            >
              <Activity className="w-4 h-4" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="bg-neutral-950/80 hover:bg-neutral-800 text-slate-300 hover:text-white p-2 rounded-lg border border-neutral-700 shadow cable-focus-ring"
                title="Close Player"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Bottom OSD Bar: Program Info & Player Controls */}
        <div className="space-y-3 pointer-events-auto">
          {/* Cable Program Banner with Restart TV Button */}
          {currentProgram && (
            <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 p-4 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                    <span className="uppercase font-bold tracking-wider">
                      {isRestarted ? 'RESTART PLAYBACK' : 'NOW PLAYING'}
                    </span>
                    <span>•</span>
                    <span>
                      {formatTimeInZone(currentProgram.start, timeZone)} - {formatTimeInZone(currentProgram.end, timeZone)}
                    </span>
                    {currentProgram.category && (
                      <>
                        <span>•</span>
                        <span className="text-slate-300">{currentProgram.category}</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-white truncate mt-0.5">
                    {currentProgram.title}
                  </h4>
                  {currentProgram.description && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {currentProgram.description}
                    </p>
                  )}
                </div>

                {/* Restart TV & Go Live Button (Bell Fibe / VMedia style) */}
                <div className="flex items-center space-x-2 shrink-0">
                  {isRestarted ? (
                    <button
                      onClick={handleGoLive}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg shadow cable-focus-ring animate-pulse"
                      title="Jump back to live broadcast edge"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>GO LIVE</span>
                    </button>
                  ) : timeshift && timeshift.canRestart ? (
                    <button
                      onClick={handleRestartTv}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-mono text-xs font-bold rounded-lg shadow-cable-focus cable-focus-ring"
                      title="Restart show from the beginning (Bell Fibe style)"
                    >
                      <Rewind className="w-3.5 h-3.5 fill-current" />
                      <span>Restart Show</span>
                    </button>
                  ) : null}

                  {nextProgram && (
                    <div className="hidden lg:block text-right pl-3 border-l border-neutral-700 shrink-0">
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        UP NEXT ({formatTimeInZone(nextProgram.start, timeZone)})
                      </span>
                      <p className="text-xs font-semibold text-slate-200 truncate max-w-[180px] mt-0.5">
                        {nextProgram.title}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Program Timeline Progress Bar */}
              <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-cable-focus"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cable Controls Toolbar */}
          <div className="flex items-center justify-between bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 px-4 py-2.5 rounded-xl shadow-2xl">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold transition shadow-cable-focus cable-focus-ring"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              {onPrevChannel && (
                <button
                  onClick={onPrevChannel}
                  className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-slate-200 border border-neutral-700 cable-focus-ring"
                  title="Channel Down"
                >
                  CH -
                </button>
              )}
              {onNextChannel && (
                <button
                  onClick={onNextChannel}
                  className="px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-slate-200 border border-neutral-700 cable-focus-ring"
                  title="Channel Up"
                >
                  CH +
                </button>
              )}

              {/* Last Channel Recall (Bell Fibe / Rogers Jump button) */}
              {onRecallLastChannel && lastChannel && (
                <button
                  onClick={onRecallLastChannel}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-cable-800 hover:bg-cable-700 text-xs font-mono font-bold text-amber-400 border border-neutral-700 cable-focus-ring"
                  title={`Recall last channel: CH ${lastChannel.channelNumber} ${lastChannel.name} (Key: L)`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Last {lastChannel.channelNumber}</span>
                </button>
              )}

              {/* Instant Record Button */}
              {onRecordLive && (
                <button
                  onClick={onRecordLive}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-bold border cable-focus-ring ${
                    isRecording
                      ? 'bg-red-950 text-red-300 border-red-800 animate-pulse'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-slate-300 border-neutral-700'
                  }`}
                  title="Record current live broadcast to Cloud PVR (Key: R)"
                >
                  <Disc className={`w-3.5 h-3.5 ${isRecording ? 'text-red-400 animate-spin' : 'text-red-500'}`} />
                  <span>{isRecording ? 'REC' : 'Record'}</span>
                </button>
              )}

              {/* Volume & Mute */}
              <div className="flex items-center space-x-2 ml-2 pl-3 border-l border-neutral-700">
                <button
                  onClick={handleMuteToggle}
                  className="text-slate-300 hover:text-white p-1.5 rounded hover:bg-neutral-800 cable-focus-ring"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-24 accent-amber-400 cursor-pointer"
                  title="Volume"
                />
              </div>
            </div>

            {/* Right: Aspect, Audio/Subs, PiP, Fullscreen */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAspectRatio}
                className="px-2.5 py-1 text-xs font-mono uppercase bg-neutral-800 hover:bg-neutral-700 text-slate-300 rounded border border-neutral-700 cable-focus-ring"
                title="Aspect Ratio"
              >
                Aspect: {aspectRatio}
              </button>

              {/* Multi-Track Audio & Subtitle Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowTrackMenu(!showTrackMenu)}
                  className={`p-2 rounded border cable-focus-ring ${
                    showTrackMenu || selectedAudioTrack >= 0 || captionsActive
                      ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold'
                      : 'bg-neutral-800 text-slate-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                  title="Audio & Subtitles Tracks"
                >
                  <Languages className="w-4 h-4" />
                </button>

                {showTrackMenu && (
                  <div className="absolute bottom-12 right-0 w-64 bg-neutral-950/95 backdrop-blur-md border border-neutral-700 p-3 rounded-xl shadow-2xl text-xs space-y-3 z-50">
                    <div className="font-bold text-amber-400 flex items-center justify-between border-b border-neutral-800 pb-1.5">
                      <span>Audio & Subtitles</span>
                      <button onClick={() => setShowTrackMenu(false)} className="text-slate-400 hover:text-white">✕</button>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Audio Tracks</span>
                      {audioTracks.length === 0 ? (
                        <span className="text-[11px] text-slate-500 italic">Default Stereo (Auto)</span>
                      ) : (
                        <div className="space-y-1">
                          {audioTracks.map((tr) => (
                            <button
                              key={tr.id}
                              onClick={() => handleSwitchAudio(tr.id)}
                              className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                                selectedAudioTrack === tr.id ? 'bg-amber-400 text-black font-bold' : 'hover:bg-neutral-800 text-slate-200'
                              }`}
                            >
                              <span>{tr.name}</span>
                              {selectedAudioTrack === tr.id && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Subtitles / Closed Captions</span>
                      <div className="space-y-1">
                        <button
                          onClick={() => handleSwitchSubtitle(-1)}
                          className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                            selectedSubtitleTrack === -1 ? 'bg-amber-400 text-black font-bold' : 'hover:bg-neutral-800 text-slate-200'
                          }`}
                        >
                          <span>Off</span>
                          {selectedSubtitleTrack === -1 && <Check className="w-3 h-3" />}
                        </button>
                        {subtitleTracks.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSwitchSubtitle(sub.id)}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between ${
                              selectedSubtitleTrack === sub.id ? 'bg-amber-400 text-black font-bold' : 'hover:bg-neutral-800 text-slate-200'
                            }`}
                          >
                            <span>{sub.name}</span>
                            {selectedSubtitleTrack === sub.id && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Picture-in-Picture Button */}
              {isPipAvailable && (
                <button
                  onClick={togglePiP}
                  className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white border border-neutral-700 cable-focus-ring"
                  title="Picture-in-Picture (Key: P)"
                >
                  <PictureInPicture className="w-4 h-4" />
                </button>
              )}

              {availableSubtitles > 0 && (
                <button
                  onClick={toggleSubtitles}
                  className={`p-2 rounded border cable-focus-ring ${
                    captionsActive
                      ? 'bg-amber-400 text-black border-amber-300 font-bold'
                      : 'bg-neutral-800 text-slate-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                  title="Toggle Captions"
                >
                  <Subtitles className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white border border-neutral-700 cable-focus-ring"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
