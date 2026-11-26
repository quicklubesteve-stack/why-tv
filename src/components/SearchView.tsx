import React, { useState } from 'react';
import { Search, Hash, Tv, Play, Delete, ArrowRight } from 'lucide-react';
import { Channel, EpgProgram, TimeZoneSetting } from '../types';
import { formatTimeInZone } from '../utils/dateUtils';

interface SearchViewProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
}

export const SearchView: React.FC<SearchViewProps> = ({
  channels,
  onSelectChannel,
  epgPrograms,
  timeZone,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [numpadInput, setNumpadInput] = useState<string>('');

  const handleNumpadPress = (digit: string) => {
    if (numpadInput.length < 4) {
      const next = numpadInput + digit;
      setNumpadInput(next);
      setSearchTerm(next);
    }
  };

  const handleNumpadClear = () => {
    setNumpadInput('');
    setSearchTerm('');
  };

  const handleNumpadBackspace = () => {
    const next = numpadInput.slice(0, -1);
    setNumpadInput(next);
    setSearchTerm(next);
  };

  const handleNumpadTune = () => {
    const chNum = parseInt(numpadInput, 10);
    if (!isNaN(chNum)) {
      const found = channels.find((c) => c.channelNumber === chNum);
      if (found) {
        onSelectChannel(found);
      }
    }
  };

  const filteredChannels = channels.filter((ch) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    return (
      ch.name.toLowerCase().includes(q) ||
      ch.channelNumber.toString().includes(q) ||
      (ch.group && ch.group.toLowerCase().includes(q))
    );
  });

  const getChannelNowProgram = (channel: Channel): EpgProgram | undefined => {
    const now = Date.now();
    return epgPrograms.find(
      (p) =>
        (p.channelId === channel.tvgId || p.channelId === channel.id) &&
        new Date(p.start).getTime() <= now &&
        new Date(p.end).getTime() > now
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Left 2 Cols: Search Bar & Results */}
      <div className="lg:col-span-2 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type channel name, category, or channel number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setNumpadInput(e.target.value.replace(/\D/g, ''));
            }}
            autoFocus
            className="w-full bg-cable-900 border border-cable-border pl-12 pr-4 py-3.5 rounded-xl text-base text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/50 shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={handleNumpadClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 bg-cable-800 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {searchTerm ? `Results for "${searchTerm}"` : 'All Available Channels'}
            </span>
            <span>{filteredChannels.length} matches</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredChannels.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-cable-900/40 rounded-xl border border-cable-border">
                <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p>No matching channels found.</p>
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const nowProg = getChannelNowProgram(channel);
                return (
                  <div
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between p-3 rounded-xl bg-cable-900 hover:bg-cable-800 border border-cable-border/70 hover:border-amber-400 cursor-pointer transition shadow cable-focus-ring group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <span className="w-12 h-10 flex items-center justify-center font-mono font-black text-xs rounded bg-neutral-950 text-amber-400 border border-neutral-800 group-hover:border-amber-400 shrink-0">
                        {channel.channelNumber}
                      </span>

                      <div className="w-9 h-9 rounded bg-neutral-950 p-1 flex items-center justify-center shrink-0">
                        {channel.logo ? (
                          <img
                            src={channel.logo}
                            alt=""
                            className="max-h-7 max-w-7 object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Tv className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white truncate group-hover:text-amber-300">
                            {channel.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 bg-neutral-800 px-1.5 py-0.2 rounded">
                            {channel.group}
                          </span>
                        </div>
                        <p className="text-xs text-amber-400 truncate mt-0.5">
                          {nowProg ? nowProg.title : 'Live Broadcast'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-amber-400 font-bold shrink-0">
                      <span className="hidden sm:inline">Tune</span>
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Lean-Back Cable Remote Keypad */}
      <div className="bg-cable-900 border border-cable-border p-5 rounded-2xl shadow-xl space-y-4 h-fit">
        <div className="flex items-center justify-between border-b border-cable-border pb-3">
          <div className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Quick Dial Pad</h3>
          </div>
          <span className="text-[10px] uppercase font-mono text-slate-400">Cable Remote</span>
        </div>

        {/* Dial Display */}
        <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-xl text-center shadow-inner">
          <span className="text-[10px] font-mono uppercase text-slate-400 block">Dial Channel</span>
          <div className="text-2xl font-mono font-black text-amber-400 min-h-[36px] flex items-center justify-center tracking-widest">
            {numpadInput ? `CH ${numpadInput}` : '___'}
          </div>
        </div>

        {/* 10-Key Dial Grid */}
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleNumpadPress(digit)}
              className="py-3 rounded-xl bg-cable-800 hover:bg-cable-700 text-white font-mono font-bold text-lg border border-cable-border shadow active:scale-95 transition cable-focus-ring"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={handleNumpadClear}
            className="py-3 rounded-xl bg-cable-950 hover:bg-neutral-900 text-slate-400 hover:text-white font-mono text-xs border border-cable-border"
          >
            CLR
          </button>
          <button
            onClick={() => handleNumpadPress('0')}
            className="py-3 rounded-xl bg-cable-800 hover:bg-cable-700 text-white font-mono font-bold text-lg border border-cable-border shadow active:scale-95 transition cable-focus-ring"
          >
            0
          </button>
          <button
            onClick={handleNumpadBackspace}
            className="py-3 rounded-xl bg-cable-950 hover:bg-neutral-900 text-slate-400 hover:text-white font-mono flex items-center justify-center border border-cable-border"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Tune Button */}
        <button
          onClick={handleNumpadTune}
          disabled={!numpadInput}
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-cable-focus cable-focus-ring ${
            numpadInput
              ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 cursor-pointer'
              : 'bg-neutral-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Tune to Channel</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Tip: You can also dial channel numbers directly anywhere in the app using physical number keys 0-9 on your Acer laptop keyboard!
        </p>
      </div>
    </div>
  );
};
