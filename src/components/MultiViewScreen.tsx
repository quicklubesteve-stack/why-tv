import React, { useState } from 'react';
import {
  Grid,
  Columns,
  Maximize2,
  Volume2,
  VolumeX,
  Plus,
  Tv,
  Check,
  X,
  Play,
  Trophy,
  Flame,
  Zap,
} from 'lucide-react';
import { Channel, MultiViewLayout, TimeZoneSetting } from '../types';
import { Player } from './Player';

interface MultiViewScreenProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  timeZone: TimeZoneSetting;
  onOpenSportsBar?: () => void;
}

export const MultiViewScreen: React.FC<MultiViewScreenProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  timeZone,
  onOpenSportsBar,
}) => {
  const [layout, setLayout] = useState<MultiViewLayout>('4-grid');
  // Store up to 4 channel slots
  const [slotChannels, setSlotChannels] = useState<(Channel | null)[]>([
    channels.find((c) => c.group === 'Sports') || channels[0] || null,
    channels.find((c) => c.name.includes('Red Bull')) || channels[1] || null,
    channels.find((c) => c.group === 'News') || channels[2] || null,
    channels.find((c) => c.group === 'Movies') || channels[3] || null,
  ]);
  const [activeAudioSlot, setActiveAudioSlot] = useState<number>(0);
  const [pickingSlotIndex, setPickingSlotIndex] = useState<number | null>(null);

  const slotCount = layout === '2-split' ? 2 : 4;

  const handlePickChannel = (slotIndex: number, channel: Channel) => {
    const updated = [...slotChannels];
    updated[slotIndex] = channel;
    setSlotChannels(updated);
    setPickingSlotIndex(null);
  };

  // Sportsnet+ Style Dual Stream Preset
  const handleSportsnetDualPreset = () => {
    const sportsCh1 = channels.find((c) => c.channelNumber === 108) || channels.find((c) => c.group === 'Sports') || channels[0];
    const sportsCh2 = channels.find((c) => c.channelNumber === 104) || channels[1];
    setSlotChannels([sportsCh1 || null, sportsCh2 || null, null, null]);
    setLayout('2-split');
    setActiveAudioSlot(0);
  };

  // DAZN Style Quad Matchday Preset
  const handleDaznQuadPreset = () => {
    const s1 = channels.find((c) => c.channelNumber === 108) || channels[0];
    const s2 = channels.find((c) => c.channelNumber === 104) || channels[1];
    const s3 = channels.find((c) => c.channelNumber === 115) || channels[2];
    const s4 = channels.find((c) => c.channelNumber === 101) || channels[3];
    setSlotChannels([s1 || null, s2 || null, s3 || null, s4 || null]);
    setLayout('4-grid');
    setActiveAudioSlot(0);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-cable-900 border border-cable-border p-3.5 rounded-2xl shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white">SPORTS MULTI-SCREEN</h3>
              <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                DAZN & SPORTSNET+ MODE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Watch multiple live sporting events & news feeds simultaneously with independent audio focus.
            </p>
          </div>
        </div>

        {/* Quick Sports Presets & Layout Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Preset Buttons */}
          <button
            onClick={handleSportsnetDualPreset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cable-950 hover:bg-cable-800 text-slate-200 text-xs font-semibold border border-cable-border cable-focus-ring"
            title="Sportsnet+ Dual Stream: 2 Sports Channels side-by-side"
          >
            <Columns className="w-3.5 h-3.5 text-blue-400" />
            <span>Dual Sports</span>
          </button>

          <button
            onClick={handleDaznQuadPreset}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-cable-950 hover:bg-cable-800 text-slate-200 text-xs font-semibold border border-cable-border cable-focus-ring"
            title="DAZN Matchday Quad: 4 live sporting feeds"
          >
            <Grid className="w-3.5 h-3.5 text-amber-400" />
            <span>Matchday Quad</span>
          </button>

          {/* Open Live Sports Bar */}
          {onOpenSportsBar && (
            <button
              onClick={onOpenSportsBar}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black shadow-cable-focus cable-focus-ring"
              title="Open Rogers Xfinity Live Scores Companion Bar"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Live Scores Bar</span>
            </button>
          )}

          {/* Layout Switcher */}
          <div className="flex items-center space-x-1 pl-2 border-l border-cable-border">
            <button
              onClick={() => setLayout('2-split')}
              className={`p-1.5 rounded-lg border transition ${
                layout === '2-split'
                  ? 'bg-amber-400 text-black border-amber-300 font-bold'
                  : 'bg-cable-950 text-slate-400 border-cable-border hover:bg-cable-800'
              }`}
              title="2-Screen Split"
            >
              <Columns className="w-4 h-4" />
            </button>

            <button
              onClick={() => setLayout('4-grid')}
              className={`p-1.5 rounded-lg border transition ${
                layout === '4-grid'
                  ? 'bg-amber-400 text-black border-amber-300 font-bold'
                  : 'bg-cable-950 text-slate-400 border-cable-border hover:bg-cable-800'
              }`}
              title="4-Screen Quad"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Screen Video Grid */}
      <div
        className={`grid gap-3.5 ${
          layout === '2-split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {Array.from({ length: slotCount }).map((_, idx) => {
          const ch = slotChannels[idx];
          const hasAudio = activeAudioSlot === idx;

          return (
            <div
              key={idx}
              className={`relative bg-black rounded-2xl overflow-hidden border-2 transition-all shadow-xl group flex flex-col justify-between aspect-video ${
                hasAudio
                  ? 'border-amber-400 shadow-cable-focus ring-2 ring-amber-400/40'
                  : 'border-cable-border/70 hover:border-slate-500'
              }`}
            >
              {ch ? (
                <>
                  <Player
                    channel={ch}
                    timeZone={timeZone}
                  />

                  {/* Slot Header Overlay */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto z-20">
                    <div className="flex items-center space-x-2 bg-neutral-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-700/80 shadow">
                      <span className="font-mono text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded">
                        CH {ch.channelNumber}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[130px]">
                        {ch.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-neutral-950/90 backdrop-blur-md p-1 rounded-lg border border-neutral-700/80 shadow">
                      {/* Audio Selector Button */}
                      <button
                        onClick={() => setActiveAudioSlot(idx)}
                        className={`p-1 rounded transition flex items-center space-x-1 ${
                          hasAudio
                            ? 'bg-amber-400 text-black font-bold px-2'
                            : 'text-slate-400 hover:text-white px-1.5'
                        }`}
                        title={hasAudio ? 'Audio active for this screen' : 'Click to hear audio'}
                      >
                        {hasAudio ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] uppercase font-mono font-black">ON</span>
                          </>
                        ) : (
                          <VolumeX className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Swap Channel Button */}
                      <button
                        onClick={() => setPickingSlotIndex(idx)}
                        className="px-2 py-0.5 text-[10px] bg-cable-800 hover:bg-cable-700 text-slate-200 rounded font-bold"
                      >
                        Swap
                      </button>

                      {/* Maximize to Single Player */}
                      <button
                        onClick={() => onSelectChannel(ch)}
                        className="p-1 text-slate-400 hover:text-amber-400"
                        title="Watch full screen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  onClick={() => setPickingSlotIndex(idx)}
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-cable-900 transition text-slate-400 space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-cable-800 flex items-center justify-center text-amber-400">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">Screen {idx + 1}: Select Channel</span>
                  <span className="text-[10px] text-slate-400">Click to assign a live stream here</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Channel Picker Modal for Slot */}
      {pickingSlotIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cable-900 border border-cable-border rounded-2xl max-w-lg w-full max-h-[75vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-cable-border flex items-center justify-between bg-cable-950">
              <h4 className="text-sm font-bold text-white">
                Assign Channel to Screen {pickingSlotIndex + 1}
              </h4>
              <button
                onClick={() => setPickingSlotIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 max-h-[50vh]">
              {channels.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handlePickChannel(pickingSlotIndex, ch)}
                  className="p-2.5 rounded-xl bg-cable-950 hover:bg-cable-800 border border-cable-border/60 cursor-pointer flex items-center justify-between text-xs transition"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="font-mono text-xs font-black text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                      {ch.channelNumber}
                    </span>
                    <span className="font-bold text-white truncate">{ch.name}</span>
                    <span className="text-[10px] text-slate-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                      {ch.group}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
