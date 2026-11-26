import React from 'react';
import {
  Tv,
  Film,
  Calendar,
  Grid,
  Star,
  Layers,
  Settings,
  ShieldCheck,
  Clock,
  Radio,
  Play,
  Server,
  Zap,
} from 'lucide-react';
import { Channel, ContinueWatchingItem, RecentChannel, XtreamAccountInfo, TimeZoneSetting } from '../types';
import { formatTimeInZone, formatRelativeTime } from '../utils/dateUtils';

interface SmartersHubViewProps {
  channels: Channel[];
  continueWatching: ContinueWatchingItem[];
  recents: RecentChannel[];
  favouritesCount: number;
  xtreamAccount?: XtreamAccountInfo;
  timeZone: TimeZoneSetting;
  onNavigateTab: (tab: 'home' | 'live' | 'guide' | 'multiview' | 'favourites' | 'search' | 'settings') => void;
  onSelectChannel: (channel: Channel) => void;
  onOpenXtreamModal: () => void;
}

export const SmartersHubView: React.FC<SmartersHubViewProps> = ({
  channels,
  continueWatching,
  recents,
  favouritesCount,
  xtreamAccount,
  timeZone,
  onNavigateTab,
  onSelectChannel,
  onOpenXtreamModal,
}) => {
  const movieCount = channels.filter((c) => (c.group || '').toLowerCase().includes('movie')).length;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Top Provider Status Bar (Smarters Pro Header) */}
      <div className="bg-gradient-to-r from-cable-900 via-cable-850 to-cable-900 border border-cable-border p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-amber-400 text-neutral-950 rounded-xl shadow font-black">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black text-white tracking-wide">
                {xtreamAccount ? xtreamAccount.username : 'WHY TV IPTV Core'}
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping" />
                {xtreamAccount?.status || 'CONNECTED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Provider: {xtreamAccount ? xtreamAccount.serverUrl : 'Public Verified Streams & Xtream Engine'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex flex-col items-end text-xs font-mono text-slate-300 pr-3 border-r border-cable-border">
            <span className="text-[10px] uppercase text-slate-400">Account Expiration</span>
            <span className="font-bold text-amber-300">
              {xtreamAccount?.expDate || 'Lifetime / Active'}
            </span>
          </div>

          <button
            onClick={onOpenXtreamModal}
            className="flex items-center space-x-2 px-4 py-2 bg-cable-800 hover:bg-cable-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-cable-border cable-focus-ring"
          >
            <Server className="w-4 h-4 text-amber-400" />
            <span>Xtream Codes Login</span>
          </button>
        </div>
      </div>

      {/* Primary Smarters Pro Grid Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Tile 1: LIVE TV */}
        <div
          onClick={() => onNavigateTab('live')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-cable-900 to-cable-950 border border-blue-900/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:bg-amber-400 group-hover:text-black transition">
              <Tv className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs font-black text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800">
              {channels.length} CHANNELS
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              LIVE TV
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Browse categories, stream live news, sports, entertainment & regional broadcasts.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Tv className="w-36 h-36 text-blue-400" />
          </div>
        </div>

        {/* Tile 2: TV GUIDE (EPG) */}
        <div
          onClick={() => onNavigateTab('guide')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-purple-950/40 via-cable-900 to-cable-950 border border-purple-900/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:bg-amber-400 group-hover:text-black transition">
              <Calendar className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs font-black text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-800">
              EPG GRID
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              TV GUIDE
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Interactive 30-min schedule grid with Jump to Now & manual channel linking.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Calendar className="w-36 h-36 text-purple-400" />
          </div>
        </div>

        {/* Tile 3: MULTI-VIEW SCREEN */}
        <div
          onClick={() => onNavigateTab('multiview')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-cable-900 to-cable-950 border border-emerald-900/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-amber-400 group-hover:text-black transition">
              <Grid className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              QUAD SCREEN
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              MULTI-SCREEN
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Watch 2 or 4 live streams simultaneously. The gold standard for sports & breaking news.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Grid className="w-36 h-36 text-emerald-400" />
          </div>
        </div>

        {/* Tile 4: MOVIES & FAST STREAMS */}
        <div
          onClick={() => onNavigateTab('live')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-rose-950/40 via-cable-900 to-cable-950 border border-rose-900/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:bg-amber-400 group-hover:text-black transition">
              <Film className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs font-black text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">
              {movieCount} CHANNELS
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              CINEMA & MOVIES
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              24/7 continuous movies, action blockbusters, sci-fi thrillers, and open cinema streams.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Film className="w-36 h-36 text-rose-400" />
          </div>
        </div>

        {/* Tile 5: FAVOURITES */}
        <div
          onClick={() => onNavigateTab('favourites')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-cable-900 to-cable-950 border border-amber-900/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition">
              <Star className="w-8 h-8 fill-amber-400" />
            </div>
            <span className="font-mono text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800">
              {favouritesCount} SAVED
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              FAVOURITES
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Quick access to your curated favorite channels.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Star className="w-36 h-36 text-amber-400" />
          </div>
        </div>

        {/* Tile 6: SETTINGS & PROVIDER HUB */}
        <div
          onClick={() => onNavigateTab('settings')}
          role="button"
          tabIndex={0}
          className="group relative p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-cable-900 to-cable-950 border border-slate-700/60 hover:border-amber-400 cursor-pointer shadow-2xl transition-all duration-200 cable-focus-ring flex flex-col justify-between h-48 overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="p-3.5 rounded-2xl bg-slate-500/10 border border-slate-500/30 text-slate-300 group-hover:bg-amber-400 group-hover:text-black transition">
              <Settings className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs font-black text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-700">
              CONFIG
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white group-hover:text-amber-300 tracking-wide">
              SETTINGS & SOURCES
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              M3U playlists, Xtream credentials, time zones, categories, and browser privacy.
            </p>
          </div>

          <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none group-hover:opacity-20 transition">
            <Settings className="w-36 h-36 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Continue Watching / Recents Row */}
      {recents.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Recently Watched Channels</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recents.slice(0, 4).map((rc) => {
              const ch = channels.find((c) => c.id === rc.channelId);
              return (
                <div
                  key={rc.channelId}
                  onClick={() => ch && onSelectChannel(ch)}
                  role="button"
                  tabIndex={0}
                  className="p-3.5 bg-cable-900 hover:bg-cable-800 border border-cable-border/80 hover:border-amber-400 rounded-xl cursor-pointer transition flex items-center space-x-3 cable-focus-ring"
                >
                  <span className="font-mono text-xs font-black text-amber-400 bg-black/50 px-2 py-1 rounded">
                    {rc.channelNumber}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate">{rc.name}</h5>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {formatRelativeTime(rc.lastWatched)}
                    </span>
                  </div>
                  <Play className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-current" />
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
