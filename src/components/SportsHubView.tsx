import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Flame,
  Radio,
  Play,
  Clock,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Zap,
  Filter,
  Tv,
} from 'lucide-react';
import { Channel, SportsGame, SportLeague } from '../types';
import { INITIAL_SPORTS_GAMES, SPORTS_LEAGUES } from '../data/sportsData';

interface SportsHubViewProps {
  channels: Channel[];
  onSelectChannel: (channel: Channel) => void;
  currentChannelNumber?: number;
}

export const SportsHubView: React.FC<SportsHubViewProps> = ({
  channels,
  onSelectChannel,
  currentChannelNumber,
}) => {
  const [selectedLeague, setSelectedLeague] = useState<SportLeague | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'live' | 'upcoming'>('ALL');
  const [games, setGames] = useState<SportsGame[]>(INITIAL_SPORTS_GAMES);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Live score ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setGames((prev) =>
        prev.map((g) => {
          if (g.status !== 'live') return g;
          return {
            ...g,
            homeTeam: { ...g.homeTeam },
            awayTeam: { ...g.awayTeam },
          };
        })
      );
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleTuneGame = (game: SportsGame) => {
    if (game.channelNumber) {
      const found = channels.find((c) => c.channelNumber === game.channelNumber);
      if (found) {
        onSelectChannel(found);
        return;
      }
    }
    const sportsCh = channels.find((c) => c.group === 'Sports') || channels[0];
    if (sportsCh) onSelectChannel(sportsCh);
  };

  const filteredGames = games.filter((g) => {
    if (selectedLeague !== 'ALL' && g.league !== selectedLeague) return false;
    if (statusFilter !== 'ALL' && g.status !== statusFilter) return false;
    return true;
  });

  const liveGames = games.filter((g) => g.status === 'live');
  const featuredGame = liveGames.find((g) => g.league === 'NFL') || liveGames[0] || games[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Marquee Matchday Live Hero */}
      {featuredGame && (
        <div className="relative rounded-3xl overflow-hidden border border-cable-border bg-gradient-to-br from-neutral-950 via-neutral-900 to-red-950/30 p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center shadow">
                <span className="w-2 h-2 rounded-full bg-white mr-1.5 animate-ping" />
                {featuredGame.status === 'live' ? 'LIVE NOW' : featuredGame.status.toUpperCase()}
              </span>
              <span className="bg-amber-400 text-neutral-950 font-black text-xs px-2.5 py-1 rounded font-mono shadow">
                {featuredGame.league}
              </span>
              <span className="text-amber-300 font-mono text-xs font-bold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{featuredGame.periodOrTime}</span>
              </span>
              <span className="text-slate-400 text-xs">• {featuredGame.broadcaster}</span>
            </div>

            {/* Scoreboard Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              {/* Away Team */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 shadow">
                <div>
                  <span className="text-xs text-slate-400 font-mono">{featuredGame.awayTeam.record || 'Away'}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{featuredGame.awayTeam.name}</h3>
                </div>
                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                  {featuredGame.awayTeam.score}
                </span>
              </div>

              {/* Home Team */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 shadow">
                <div>
                  <span className="text-xs text-slate-400 font-mono">{featuredGame.homeTeam.record || 'Home'}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{featuredGame.homeTeam.name}</h3>
                </div>
                <span className="text-3xl sm:text-4xl font-mono font-black text-amber-400">
                  {featuredGame.homeTeam.score}
                </span>
              </div>
            </div>

            {/* Live Stats Snippet */}
            {featuredGame.statsSnippet && (
              <p className="text-slate-300 text-sm font-mono bg-black/50 p-2.5 rounded-xl border border-neutral-800 inline-block">
                📊 {featuredGame.statsSnippet}
              </p>
            )}

            {/* Watch Button */}
            <div className="pt-2 flex items-center space-x-4">
              <button
                onClick={() => handleTuneGame(featuredGame)}
                className="flex items-center space-x-2.5 px-8 py-3.5 bg-red-600 hover:bg-red-500 text-white font-black text-base rounded-2xl shadow-xl transition hover:scale-105 cable-focus-ring"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch {featuredGame.awayTeam.name} vs {featuredGame.homeTeam.name}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. League Filter Tabs & Status Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-black text-white tracking-wide">Live Sports Center</h2>
            <span className="bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {liveGames.length} Games Active
            </span>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-cable-800 hover:bg-cable-700 text-slate-300 hover:text-white rounded-xl text-xs font-mono border border-cable-border transition"
            title="Refresh Scores"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Update Scores</span>
          </button>
        </div>

        {/* League Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {SPORTS_LEAGUES.map((league) => {
            const isSel = selectedLeague === league.id;
            return (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 cable-focus-ring ${
                  isSel
                    ? 'bg-amber-400 text-neutral-950 font-black shadow-cable-focus ring-2 ring-amber-300'
                    : 'bg-cable-900 hover:bg-cable-800 text-slate-300 hover:text-white border border-cable-border'
                }`}
              >
                {league.label}
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs (ALL / LIVE NOW / UPCOMING) */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'ALL' ? 'bg-amber-400/20 text-amber-400 font-bold border border-amber-400/40' : 'text-slate-400 hover:text-white'}`}
          >
            ALL FIXTURES ({games.length})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'live' ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            🔴 LIVE GAMES ({liveGames.length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1 rounded-lg ${statusFilter === 'upcoming' ? 'bg-blue-600/20 text-blue-400 font-bold border border-blue-500/40' : 'text-slate-400 hover:text-white'}`}
          >
            UPCOMING SCHEDULE
          </button>
        </div>
      </div>

      {/* 3. Live Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGames.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 bg-cable-950 rounded-2xl border border-dashed border-cable-border">
            <Trophy className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No sports matches found for this filter</h4>
            <p className="text-xs text-slate-400 mt-1">Try switching leagues or choosing "ALL FIXTURES".</p>
          </div>
        ) : (
          filteredGames.map((game) => {
            const isLive = game.status === 'live';
            const isTuned = currentChannelNumber === game.channelNumber;

            return (
              <div
                key={game.id}
                onClick={() => handleTuneGame(game)}
                role="button"
                tabIndex={0}
                className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 shadow-xl flex flex-col justify-between cable-focus-ring ${
                  isTuned
                    ? 'bg-gradient-to-br from-cable-900 to-amber-950/40 border-amber-400 ring-2 ring-amber-300'
                    : isLive
                    ? 'bg-cable-900/90 hover:bg-cable-800 border-cable-border/80 hover:border-amber-400'
                    : 'bg-cable-950 border-cable-border/60 hover:bg-cable-900'
                }`}
              >
                <div>
                  {/* Top Badge: League & Clock */}
                  <div className="flex items-center justify-between text-xs font-mono mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-black px-2 py-0.5 rounded bg-black/60 text-amber-400">
                        {game.league}
                      </span>
                      {isLive ? (
                        <span className="flex items-center text-red-400 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-ping" />
                          LIVE
                        </span>
                      ) : (
                        <span className="text-slate-400 uppercase font-semibold">
                          {game.status}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 text-slate-300 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{game.periodOrTime}</span>
                    </div>
                  </div>

                  {/* Team Scores Row */}
                  <div className="space-y-2 py-1">
                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-sm font-bold text-white truncate block group-hover:text-amber-300">
                          {game.awayTeam.name}
                        </span>
                        {game.awayTeam.record && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {game.awayTeam.record}
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-mono font-black text-amber-400">
                        {game.awayTeam.score}
                      </span>
                    </div>

                    {/* Home Team */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                      <div className="min-w-0 pr-2">
                        <span className="text-sm font-bold text-white truncate block group-hover:text-amber-300">
                          {game.homeTeam.name}
                        </span>
                        {game.homeTeam.record && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {game.homeTeam.record}
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-mono font-black text-amber-400">
                        {game.homeTeam.score}
                      </span>
                    </div>
                  </div>

                  {/* Stats Snippet */}
                  {game.statsSnippet && (
                    <div className="mt-3 p-2 rounded-xl bg-black/40 border border-neutral-800/80 text-[11px] font-mono text-slate-300 truncate">
                      {game.statsSnippet}
                    </div>
                  )}
                </div>

                {/* Footer: Channel Info & Tune Button */}
                <div className="mt-4 pt-3 border-t border-cable-border/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-black bg-amber-400 text-neutral-950 px-2 py-0.5 rounded shadow">
                      CH {game.channelNumber}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold truncate max-w-[140px]">
                      {game.broadcaster}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTuneGame(game);
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow ${
                      isTuned
                        ? 'bg-emerald-500 text-black font-black'
                        : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isTuned ? 'WATCHING' : 'Watch Live'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
