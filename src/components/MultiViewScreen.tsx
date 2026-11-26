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
} from 'lucide-react';
import { Channel, MultiViewLayout, TimeZoneSetting } from '../types';
import { Player } from './Player';

interface MultiViewScreenProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  timeZone: TimeZoneSetting;
}

export const MultiViewScreen: React.FC<MultiViewScreenProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  timeZone,
}) => {
  const [layout, setLayout] = useState<MultiViewLayout>('4-grid');
  // Store up to 4 channel slots
  const [slotChannels, setSlotChannels] = useState<(Channel | null)[]>([
    channels[0] || null,
    channels[1] || null,
    channels[2] || null,
    channels[3] || null,
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

  return (
    <div className="space-y-4 pb-12">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-cable-900 border border-cable-border p-3.5 rounded-2xl shadow">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Multi-Screen Quad View</h3>
            <p className="text-xs text-slate-400">
              Watch multiple live sports, news, and entertainment streams simultaneously.
            </p>
          </div>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLayout('2-split')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cable-focus-ring ${
              layout === '2-split'
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-cable-focus'
                : 'bg-cable-950 text-slate-300 border-cable-border hover:bg-cable-800'
            }`}
          >
            <Columns className="w-4 h-4" />
            <span>2-Screen Split</span>
          </button>

          <button
            onClick={() => setLayout('4-grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cable-focus-ring ${
              layout === '4-grid'
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-cable-focus'
                : 'bg-cable-950 text-slate-300 border-cable-border hover:bg-cable-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>4-Screen Quad</span>
          </button>
        </div>
      </div>

      {/* Multi-Screen Video Grid */}
      <div
        className={`grid gap-3 ${
          layout === '2-split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {Array.from({ length: slotCount }).map((_, idx) => {
          const ch = slotChannels[idx];
          const hasAudio = activeAudioSlot === idx;

          return (
            <div
              key={idx}
              className={`relative bg-black rounded-xl overflow-hidden border-2 transition-all shadow-xl group flex flex-col justify-between aspect-video ${
                hasAudio
                  ? 'border-amber-400 shadow-cable-focus ring-2 ring-amber-400/30'
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
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-auto z-20">
                    <div className="flex items-center space-x-2 bg-neutral-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-700/80">
                      <span className="font-mono text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded">
                        CH {ch.channelNumber}
                      </span>
                      <span className="text-xs font-bold text-white truncate max-w-[120px]">
                        {ch.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-neutral-950/85 backdrop-blur-md p-1 rounded-lg border border-neutral-700/80">
                      {/* Audio Selector Button */}
                      <button
                        onClick={() => setActiveAudioSlot(idx)}
                        className={`p-1 rounded transition ${
                          hasAudio
                            ? 'bg-amber-400 text-black font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title={hasAudio ? 'Audio active for this screen' : 'Click to hear audio'}
                      >
                        {hasAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
