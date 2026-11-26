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
  ExternalLink,
  Info,
} from 'lucide-react';
import { Channel, EpgProgram, PlaybackState, TimeZoneSetting } from '../types';
import { formatTimeInZone, getProgramProgress } from '../utils/dateUtils';

interface PlayerProps {
  channel: Channel | null;
  currentProgram?: EpgProgram;
  nextProgram?: EpgProgram;
  timeZone: TimeZoneSetting;
  onClose?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const Player: React.FC<PlayerProps> = ({
  channel,
  currentProgram,
  nextProgram,
  timeZone,
  onClose,
  onNextChannel,
  onPrevChannel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const [errorState, setErrorState] = useState<{
    type: 'cors' | 'offline' | 'codec' | 'generic';
    message: string;
    details: string;
  } | null>(null);

  // Auto-hide OSD after 5 seconds of inactivity
  const osdTimerRef = useRef<number | null>(null);
  const pingOsd = () => {
    setShowOsd(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = window.setTimeout(() => {
      setShowOsd(false);
    }, 5500);
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Main stream loading & HLS lifecycle
  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const video = videoRef.current;
    setErrorState(null);
    setIsBuffering(true);
    pingOsd();

    // Clean up previous HLS instance
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

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
        setAvailableSubtitles(data.subtitleTracks.length);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsBuffering(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Typical CORS or 404/offline failure
              if (data.response && data.response.code === 0) {
                setErrorState({
                  type: 'cors',
                  message: 'Provider blocked browser playback (CORS Restriction)',
                  details:
                    'This IPTV provider does not allow direct cross-origin playback in web browsers. Use a CORS proxy or an authorized stream URL.',
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
          <div className="w-14 h-14 border-4 border-amber-400 border-t-transparent rounded-full animate-spin shadow-cable-focus" />
          <span className="mt-3 text-amber-300 font-mono text-sm tracking-wider uppercase font-semibold">
            Tuning CH {channel.channelNumber}...
          </span>
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
          <p className="text-xs text-slate-400 mt-4">
            Tip: You can continue browsing the TV Guide or switch channels below anytime.
          </p>
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
            {/* Channel Logo */}
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
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Source: {channel.sourceName}
              </span>
            </div>
          </div>

          {/* Close / Minimize button if modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="pointer-events-auto bg-neutral-950/80 hover:bg-neutral-800 text-slate-300 hover:text-white p-2 rounded-lg border border-neutral-700 shadow cable-focus-ring"
              title="Close Player"
            >
              ✕
            </button>
          )}
        </div>

        {/* Bottom OSD Bar: Program Info & Player Controls */}
        <div className="space-y-3 pointer-events-auto">
          {/* Cable Program Banner */}
          {currentProgram && (
            <div className="bg-neutral-950/90 backdrop-blur-md border border-neutral-700/80 p-4 rounded-xl shadow-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                    <span className="uppercase font-bold tracking-wider">NOW PLAYING</span>
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

                {/* Next Program Teaser */}
                {nextProgram && (
                  <div className="hidden lg:block text-right pl-4 border-l border-neutral-700 shrink-0">
                    <span className="text-[10px] uppercase font-mono text-slate-400">UP NEXT ({formatTimeInZone(nextProgram.start, timeZone)})</span>
                    <p className="text-xs font-semibold text-slate-200 truncate max-w-[200px] mt-0.5">
                      {nextProgram.title}
                    </p>
                  </div>
                )}
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
            {/* Play/Pause & Channel Flippers */}
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

            {/* Right: Aspect, Captions, Fullscreen */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAspectRatio}
                className="px-2.5 py-1 text-xs font-mono uppercase bg-neutral-800 hover:bg-neutral-700 text-slate-300 rounded border border-neutral-700 cable-focus-ring"
                title="Aspect Ratio"
              >
                Aspect: {aspectRatio}
              </button>

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
