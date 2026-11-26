import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Tv, Flame, Trophy, Radio, Clock, Sparkles } from 'lucide-react';
import { Channel, EpgProgram, LiveSearchResult, TimeZoneSetting } from '../types';
import { searchLiveContent } from '../utils/searchEngine';
import { INITIAL_SPORTS_GAMES } from '../data/sportsData';
import { formatTimeInZone } from '../utils/dateUtils';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  epgPrograms: EpgProgram[];
  onSelectChannel: (channel: Channel) => void;
  timeZone: TimeZoneSetting;
}

const TRENDING_SEARCHES = [
  { label: '🏈 Football (Live)', query: 'football' },
  { label: '🏒 Hockey (NHL)', query: 'hockey' },
  { label: '⚽ Soccer', query: 'soccer' },
  { label: '🏀 Basketball (NBA)', query: 'basketball' },
  { label: '🏎️ Motorsport (F1)', query: 'racing' },
  { label: '📰 Breaking News', query: 'news' },
  { label: '🎬 Movies', query: 'movies' },
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  channels,
  epgPrograms,
  onSelectChannel,
  timeZone,
}) => {
  const [query, setQuery] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results: LiveSearchResult[] = query.trim()
    ? searchLiveContent(query, channels, epgPrograms, INITIAL_SPORTS_GAMES)
    : [];

  const handleTune = (channel: Channel) => {
    onSelectChannel(channel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-cable-900 border border-amber-400/60 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-cable-border bg-cable-950 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-400 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search keywords, e.g. 'football', 'hockey', 'chiefs', 'leafs', 'news'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-cable-800 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-cable-800"
            title="Close Search (Escape)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Keyword Pills */}
        <div className="px-5 py-2.5 bg-neutral-950/80 border-b border-cable-border flex items-center space-x-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-mono text-slate-400 uppercase shrink-0 flex items-center mr-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 mr-1" />
            Quick:
          </span>
          {TRENDING_SEARCHES.map((item) => (
            <button
              key={item.label}
              onClick={() => setQuery(item.query)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition ${
                query.toLowerCase() === item.query.toLowerCase()
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-cable-focus'
                  : 'bg-cable-800 text-slate-300 hover:bg-cable-700 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Sparkles className="w-10 h-10 mx-auto text-amber-400/60 animate-pulse" />
              <h4 className="text-base font-bold text-slate-200">Live Universal Keyword Search</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Type any sport like <strong className="text-amber-400">"football"</strong>, team like <strong className="text-amber-400">"chiefs"</strong>, league like <strong className="text-amber-400">"NFL"</strong>, or topic like <strong className="text-amber-400">"news"</strong> to see which channels are broadcasting live games right now.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-600" />
              <h4 className="text-base font-bold text-slate-300">No live games or channels found</h4>
              <p className="text-xs text-slate-400">
                Try searching for "football", "hockey", "soccer", "nfl", "news", or "sports".
              </p>
            </div>
          ) : (
            results.map((res) => {
              const isLive = res.isLive;
              return (
                <div
                  key={res.id}
                  onClick={() => handleTune(res.channel)}
                  role="button"
                  tabIndex={0}
                  className="group bg-cable-800/80 hover:bg-cable-800 border border-cable-border hover:border-amber-400/80 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition cursor-pointer shadow-sm cable-focus-ring"
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className="shrink-0 mt-0.5">
                      {res.type === 'live_game' ? (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition">
                          <Trophy className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-slate-300 group-hover:bg-amber-400 group-hover:text-black transition">
                          <Tv className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {isLive && (
                          <span className="text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded-full flex items-center animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1 animate-ping" />
                            LIVE NOW
                          </span>
                        )}
                        <span className="font-mono text-[10px] font-black bg-black text-amber-400 px-2 py-0.5 rounded border border-neutral-700">
                          CH {res.channel.channelNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{res.channel.name}</span>
                        {res.scoreSummary && (
                          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                            {res.scoreSummary}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition truncate">
                        {res.title}
                      </h4>

                      {res.description && (
                        <p className="text-xs text-slate-300 line-clamp-1">
                          {res.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Watch Button */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTune(res.channel);
                      }}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg shadow-cable-focus cable-focus-ring text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Live</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
