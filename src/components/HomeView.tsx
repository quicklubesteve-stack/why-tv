import React from 'react';
import {
  Play,
  Star,
  Clock,
  Tv,
  Film,
  Radio,
  ChevronRight,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import {
  Channel,
  ContinueWatchingItem,
  RecentChannel,
  EpgProgram,
  TimeZoneSetting,
} from '../types';
import { formatTimeInZone, formatRelativeTime, getProgramProgress } from '../utils/dateUtils';
import { INITIAL_SPORTS_GAMES } from '../data/sportsData';

interface HomeViewProps {
  continueWatching: ContinueWatchingItem[];
  favourites: Channel[];
  recents: RecentChannel[];
  channels: Channel[];
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
  onSelectChannel: (channel: Channel) => void;
  onNavigateTab: (tab: 'live' | 'guide' | 'favourites' | 'search') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  continueWatching,
  favourites,
  recents,
  channels,
  epgPrograms,
  timeZone,
  onSelectChannel,
  onNavigateTab,
}) => {
  // Find currently airing program for a channel
  const getChannelNowProgram = (channel: Channel): EpgProgram | undefined => {
    const now = Date.now();
    return epgPrograms.find(
      (p) =>
        (p.channelId === channel.tvgId || p.channelId === channel.id) &&
        new Date(p.start).getTime() <= now &&
        new Date(p.end).getTime() > now
    );
  };

  const heroChannel = favourites[0] || channels[0];
  const heroProgram = heroChannel ? getChannelNowProgram(heroChannel) : undefined;

  return (
    <div className="space-y-8 pb-12">
      {/* Cable Hero Banner: Direct Tune Hero */}
      {heroChannel && (
        <div className="relative rounded-2xl overflow-hidden border border-cable-border/80 bg-gradient-to-r from-neutral-950 via-cable-900 to-cable-850 p-6 sm:p-10 shadow-cable-card">
          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="flex items-center space-x-3">
              <span className="bg-amber-400 text-neutral-950 font-mono font-black text-xs px-2.5 py-1 rounded shadow">
                CH {heroChannel.channelNumber}
              </span>
              <span className="text-amber-300 font-mono text-xs uppercase tracking-wider font-semibold">
                Featured Live Broadcast
              </span>
              <span className="text-slate-400 text-xs">• {heroChannel.group}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {heroProgram?.title || heroChannel.name}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base line-clamp-2 leading-relaxed">
              {heroProgram?.description ||
                `Tune directly into ${heroChannel.name} streaming live in full HD on WHY TV.`}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => onSelectChannel(heroChannel)}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-base rounded-xl transition shadow-cable-focus cable-focus-ring"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Watch Live Now</span>
              </button>

              <button
                onClick={() => onNavigateTab('guide')}
                className="flex items-center space-x-2 px-5 py-3 bg-cable-800 hover:bg-cable-700 text-slate-200 font-semibold rounded-xl border border-cable-border cable-focus-ring text-sm"
              >
                <span>Browse TV Guide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative Glow & Visual Logo */}
          <div className="absolute right-4 bottom-4 sm:right-12 sm:top-1/2 sm:-translate-y-1/2 opacity-20 pointer-events-none">
            {heroChannel.logo ? (
              <img
                src={heroChannel.logo}
                alt=""
                className="w-48 h-48 sm:w-64 sm:h-64 object-contain filter grayscale"
              />
            ) : (
              <Tv className="w-48 h-48 text-amber-500" />
            )}
          </div>
        </div>
      )}

      {/* Live Sports & Football Matchday Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Live Sports & Football Matchday</h2>
            <span className="text-[10px] font-mono font-bold bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-ping" />
              LIVE NOW
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('sports' as any)}
            className="text-xs text-amber-400 hover:underline flex items-center font-medium"
          >
            <span>All Sports Fixtures</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_SPORTS_GAMES.filter((g) => g.status === 'live' || g.status === 'final').slice(0, 6).map((game) => {
            const ch =
              channels.find((c) => c.channelNumber === game.channelNumber) ||
              channels.find((c) => c.group === 'Sports');
            return (
              <div
                key={game.id}
                onClick={() => ch && onSelectChannel(ch)}
                role="button"
                tabIndex={0}
                className="group relative bg-cable-900 hover:bg-cable-800 border border-cable-border/70 hover:border-amber-400 p-4 rounded-xl cursor-pointer shadow-md transition-all duration-150 cable-focus-ring flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded">
                      {game.league}
                    </span>
                    <span className={`flex items-center font-bold ${game.status === 'live' ? 'text-red-400' : 'text-emerald-400'}`}>
                      <Clock className="w-3 h-3 mr-1 text-amber-400" />
                      {game.periodOrTime}
                    </span>
                  </div>

                  <div className="space-y-1.5 my-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white group-hover:text-amber-300 truncate">
                        {game.awayTeam.name}
                      </span>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {game.awayTeam.score}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-800">
                      <span className="text-sm font-bold text-white group-hover:text-amber-300 truncate">
                        {game.homeTeam.name}
                      </span>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {game.homeTeam.score}
                      </span>
                    </div>
                  </div>

                  {game.statsSnippet && (
                    <p className="text-[11px] text-slate-300 font-mono truncate mt-1">
                      {game.statsSnippet}
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-cable-border/60 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    CH {game.channelNumber} • {game.broadcaster}
                  </span>
                  <span className="text-xs font-bold text-neutral-950 bg-amber-400 group-hover:bg-amber-300 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Watch</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 1. Continue Watching Section */}
      {continueWatching.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Continue Watching</h2>
            </div>
            <span className="text-xs text-slate-400">Recently active streams</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueWatching.map((item) => {
              const channel = channels.find((c) => c.id === item.channelId);
              const progress = getProgramProgress(item.programStart, item.programEnd);
              return (
                <div
                  key={item.channelId}
                  onClick={() => channel && onSelectChannel(channel)}
                  role="button"
                  tabIndex={0}
                  className="group relative bg-cable-900 hover:bg-cable-800 border border-cable-border/70 hover:border-amber-400 p-4 rounded-xl cursor-pointer shadow-md transition-all duration-150 cable-focus-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      {item.logo ? (
                        <img
                          src={item.logo}
                          alt=""
                          className="w-10 h-10 object-contain rounded bg-neutral-950 p-1"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
                          CH
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            CH {item.channelNumber}
                          </span>
                          <span className="text-xs text-slate-400">• {item.name}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate mt-0.5 group-hover:text-amber-300">
                          {item.programTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="p-2 rounded-full bg-amber-400/10 group-hover:bg-amber-400 text-amber-400 group-hover:text-black transition">
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1.5">
                      <span>{formatTimeInZone(item.programStart, timeZone)}</span>
                      <span>Watched {formatRelativeTime(item.lastWatched)}</span>
                      <span>{formatTimeInZone(item.programEnd, timeZone)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. Favourite Channels Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Favourite Channels</h2>
          </div>
          <button
            onClick={() => onNavigateTab('favourites')}
            className="text-xs text-amber-400 hover:underline flex items-center font-medium"
          >
            <span>View All ({favourites.length})</span>
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {favourites.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-cable-border bg-cable-950 text-center text-slate-400">
            <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm">No favourite channels marked yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Click the star icon next to any channel in Live TV or TV Guide to pin it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {favourites.map((ch) => {
              const nowProg = getChannelNowProgram(ch);
              return (
                <div
                  key={ch.id}
                  onClick={() => onSelectChannel(ch)}
                  role="button"
                  tabIndex={0}
                  className="group bg-cable-900 hover:bg-cable-800 border border-cable-border/70 hover:border-amber-400 p-3.5 rounded-xl cursor-pointer shadow-md transition-all duration-150 cable-focus-ring flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black bg-amber-400 text-neutral-950 px-2 py-0.5 rounded">
                      CH {ch.channelNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-neutral-950 px-1.5 py-0.5 rounded">
                      {ch.group}
                    </span>
                  </div>

                  <div className="my-3 flex justify-center h-14 items-center">
                    {ch.logo ? (
                      <img
                        src={ch.logo}
                        alt={ch.name}
                        className="max-h-12 max-w-full object-contain filter drop-shadow group-hover:scale-105 transition"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Tv className="w-10 h-10 text-slate-600 group-hover:text-amber-400 transition" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white truncate text-center group-hover:text-amber-300">
                      {ch.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate text-center mt-0.5">
                      {nowProg ? nowProg.title : 'Live Broadcast'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Recently Watched Section */}
      {recents.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Recently Watched</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {recents.map((item) => {
              const channel = channels.find((c) => c.id === item.channelId);
              return (
                <div
                  key={item.channelId}
                  onClick={() => channel && onSelectChannel(channel)}
                  role="button"
                  tabIndex={0}
                  className="group flex items-center space-x-3 bg-cable-900/90 hover:bg-cable-800 border border-cable-border/70 hover:border-amber-400 p-3 rounded-xl cursor-pointer transition shadow cable-focus-ring"
                >
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt=""
                      className="w-10 h-10 object-contain rounded bg-neutral-950 p-1 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center text-amber-400 font-bold font-mono text-xs shrink-0">
                      CH
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        CH {item.channelNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(item.lastWatched)}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white truncate mt-0.5 group-hover:text-amber-300">
                      {item.name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
