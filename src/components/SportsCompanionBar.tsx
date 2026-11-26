import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Flame,
  Radio,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Channel, SportsGame, SportLeague } from '../types';
import { INITIAL_SPORTS_GAMES, SPORTS_LEAGUES } from '../data/sportsData';

interface SportsCompanionBarProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  currentChannelNumber?: number;
}

export const SportsCompanionBar: React.FC<SportsCompanionBarProps> = ({
  isOpen,
  onClose,
  channels,
  onSelectChannel,
  currentChannelNumber,
}) => {
  const [selectedLeague, setSelectedLeague] = useState<SportLeague | 'ALL'>('ALL');
  const [games, setGames] = useState<SportsGame[]>(INITIAL_SPORTS_GAMES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'live' | 'upcoming'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Gentle live score ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setGames((prev) =>
        prev.map((g) => {
          if (g.status !== 'live') return g;
          // Random slight updates to shots / stats
          return {
            ...g,
            homeTeam: { ...g.homeTeam },
            awayTeam: { ...g.awayTeam },
          };
        })
      );
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredGames = games.filter((g) => {
    if (selectedLeague !== 'ALL' && g.league !== selectedLeague) return false;
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    return true;
  });

  const handleTuneGame = (game: SportsGame) => {
    if (game.channelNumber) {
      const found = channels.find((c) => c.channelNumber === game.channelNumber);
      if (found) {
        onSelectChannel(found);
      }
    } else {
      // Default to sports channel
      const sportsCh = channels.find((c) => c.group === 'Sports') || channels[0];
      if (sportsCh) onSelectChannel(sportsCh);
    }
  };

  const liveCount = games.filter((g) => g.status === 'live').length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-cable-950/95 backdrop-blur-xl border-l border-cable-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Top Header: Rogers Xfinity / Sportsnet+ Companion Bar */}
      <div className="p-4 border-b border-cable-border bg-cable-900 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-400 text-neutral-950 font-black">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white tracking-wide">
                SPORTS COMPANION
              </h3>
              <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-ping" />
                {liveCount} LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time scores, period clocks, and instant broadcast tuning
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-cable-800 transition"
            title="Refresh Live Scores"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-cable-800 transition"
            title="Close Sports Bar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* League Selection Tabs */}
      <div className="p-3 border-b border-cable-border/70 bg-cable-900/50 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        {SPORTS_LEAGUES.map((league) => {
          const isSel = selectedLeague === league.id;
          return (
            <button
              key={league.id}
              onClick={() => setSelectedLeague(league.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cable-focus-ring ${
                isSel
                  ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                  : 'bg-cable-950 text-slate-300 hover:bg-cable-800'
              }`}
            >
              {league.label}
            </button>
          );
        })}
      </div>

      {/* Filter Tabs (All / Live / Upcoming) */}
      <div className="px-4 py-2 bg-neutral-950/80 border-b border-cable-border/50 flex items-center justify-between text-xs font-mono">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-2 py-0.5 rounded ${statusFilter === 'ALL' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            ALL ({games.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-2 py-0.5 rounded ${statusFilter === 'live' ? 'text-red-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            LIVE NOW ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-2 py-0.5 rounded ${statusFilter === 'upcoming' ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            UPCOMING
          </button>
        </div>

        <span className="text-[10px] text-slate-400 uppercase">Auto-updating</span>
      </div>

      {/* Live Matchups List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 pr-2">
        {filteredGames.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No games found matching this filter.
          </div>
        ) : (
          filteredGames.map((game) => {
            const isTuned = currentChannelNumber === game.channelNumber;
            const isLive = game.status === 'live';

            return (
              <div
                key={game.id}
                className={`p-3.5 rounded-2xl border transition-all shadow-md space-y-2.5 ${
                  isLive
                    ? 'bg-cable-900 border-cable-border hover:border-amber-400/80'
                    : 'bg-cable-950 border-cable-border/60'
                }`}
              >
                {/* Header: League & Period Clock */}
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="font-black px-2 py-0.5 rounded bg-black/60 text-amber-400">
                      {game.league}
                    </span>
                    {isLive && (
                      <span className="flex items-center text-red-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mr-1" />
                        {game.periodOrTime}
                      </span>
                    )}
                    {!isLive && (
                      <span className="text-slate-400">{game.periodOrTime}</span>
                    )}
                  </div>

                  {game.broadcaster && (
                    <span className="text-[10px] text-slate-400 font-sans">
                      {game.broadcaster}
                    </span>
                  )}
                </div>

                {/* Scoreboard Teams */}
                <div className="bg-cable-950/80 p-3 rounded-xl border border-neutral-800/80 space-y-2">
                  {/* Away Team */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-bold text-white truncate">{game.awayTeam.name}</span>
                      {game.awayTeam.record && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({game.awayTeam.record})
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-base font-black ${
                        isLive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {game.awayTeam.score}
                    </span>
                  </div>

                  {/* Home Team */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-bold text-white truncate">{game.homeTeam.name}</span>
                      {game.homeTeam.record && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ({game.homeTeam.record})
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-mono text-base font-black ${
                        isLive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {game.homeTeam.score}
                    </span>
                  </div>
                </div>

                {/* Live Stats Snippet */}
                {game.statsSnippet && (
                  <p className="text-[11px] text-slate-300 font-mono flex items-center space-x-1.5 bg-neutral-900/60 px-2.5 py-1 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{game.statsSnippet}</span>
                  </p>
                )}

                {/* Instant Tune Button (Rogers Xfinity / Sportsnet+ companion action) */}
                {game.channelNumber && (
                  <button
                    onClick={() => handleTuneGame(game)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition ${
                      isTuned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-cable-800 hover:bg-amber-400 hover:text-black text-slate-200 border border-cable-border cable-focus-ring'
                    }`}
                  >
                    {isTuned ? (
                      <>
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Currently Watching on CH {game.channelNumber}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Tune Live on CH {game.channelNumber}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-cable-900 border-t border-cable-border text-center text-[11px] text-slate-400 font-mono">
        Companion stats bar inspired by Rogers Xfinity & Sportsnet+
      </div>
    </div>
  );
};
