import React, { useState, useMemo } from 'react';
import {
  Tv,
  Star,
  Search,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Clock,
  ChevronRight,
  Radio,
  SlidersHorizontal,
  Flame,
  Film,
  Zap,
} from 'lucide-react';
import { Channel, CategoryConfig, EpgProgram, TimeZoneSetting } from '../types';
import { formatTimeInZone, getProgramProgress } from '../utils/dateUtils';
import { Player } from './Player';

interface TiviMateViewProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  categories: CategoryConfig[];
  favourites: string[];
  onToggleFavourite: (channelId: string) => void;
  onOpenCategoryManager: () => void;
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const TiviMateView: React.FC<TiviMateViewProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  categories,
  favourites,
  onToggleFavourite,
  onOpenCategoryManager,
  epgPrograms,
  timeZone,
  onNextChannel,
  onPrevChannel,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [channelSearch, setChannelSearch] = useState<string>('');

  // Category mapping and counts
  const categoryMap = useMemo(() => {
    const map = new Map<string, { displayName: string; hidden: boolean }>();
    categories.forEach((cat) => {
      map.set(cat.originalName.toLowerCase(), {
        displayName: cat.displayName,
        hidden: cat.hidden,
      });
    });
    return map;
  }, [categories]);

  // Distinct category tabs
  const categoryList = useMemo(() => {
    const groups = new Set<string>();
    channels.forEach((c) => {
      if (c.group) groups.add(c.group);
    });
    ['Local', 'Sports', 'News', 'Movies', 'Kids', 'International'].forEach((std) => groups.add(std));

    const list: { id: string; label: string; count: number; icon: any }[] = [
      { id: 'All', label: 'All Channels', count: channels.length, icon: Tv },
      { id: 'Favourites', label: 'Favourites', count: favourites.length, icon: Star },
    ];

    groups.forEach((grp) => {
      const config = categoryMap.get(grp.toLowerCase());
      if (config?.hidden) return;

      const label = config ? config.displayName : grp;
      const count = channels.filter((c) => (c.group || 'Other').toLowerCase() === grp.toLowerCase()).length;
      list.push({
        id: grp,
        label,
        count,
        icon: grp === 'Sports' ? Flame : grp === 'Movies' ? Film : grp === 'News' ? Zap : Radio,
      });
    });

    return list;
  }, [channels, favourites, categoryMap]);

  // Filter channels based on selected category & search query
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      if (activeCategory === 'Favourites') {
        if (!favourites.includes(ch.id)) return false;
      } else if (activeCategory !== 'All') {
        if ((ch.group || 'Other').toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }

      if (channelSearch.trim()) {
        const q = channelSearch.toLowerCase().trim();
        const matchesName = ch.name.toLowerCase().includes(q);
        const matchesNum = ch.channelNumber.toString().includes(q);
        return matchesName || matchesNum;
      }

      return true;
    });
  }, [channels, activeCategory, favourites, channelSearch]);

  // Channel programs helper
  const getProgramsForChannel = (ch: Channel | null) => {
    if (!ch) return { current: undefined, upcoming: [] };
    const now = Date.now();
    const mappedId = ch.tvgId || ch.id;

    const list = epgPrograms.filter((p) => p.channelId === mappedId);
    list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const current = list.find((p) => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
    const upcoming = list.filter((p) => new Date(p.start).getTime() > now).slice(0, 5);

    return { current, upcoming };
  };

  const activeTargetChannel = selectedChannel || filteredChannels[0] || channels[0] || null;
  const { current: currentProgram, upcoming: upcomingPrograms } = getProgramsForChannel(activeTargetChannel);
  const progress = currentProgram ? getProgramProgress(currentProgram.start, currentProgram.end) : 0;

  return (
    <div className="space-y-4 pb-12">
      {/* TiviMate Brand Sub-Bar */}
      <div className="flex items-center justify-between bg-cable-950 border border-cable-border/70 px-4 py-2.5 rounded-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
            TiviMate Tri-Pane Engine
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Direct-tune layout with live embedded stream & multi-hour timeline
          </span>
        </div>

        <button
          onClick={onOpenCategoryManager}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center space-x-1.5 transition"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Manage Categories</span>
        </button>
      </div>

      {/* Main Tri-Pane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        {/* Pane 1: Category Drawer (col-span-2) */}
        <div className="lg:col-span-3 bg-cable-900 border border-cable-border rounded-2xl p-3 flex flex-col space-y-2 shadow-xl">
          <div className="p-2 border-b border-cable-border/70 flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-bold">
            <span>Groups ({categoryList.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[560px]">
            {categoryList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cable-focus-ring ${
                    isSelected
                      ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                      : 'text-slate-300 hover:bg-cable-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-black' : 'text-slate-400'}`} />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-black text-amber-300' : 'bg-cable-950 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pane 2: Channel List (col-span-4) */}
        <div className="lg:col-span-4 bg-cable-900 border border-cable-border rounded-2xl p-3 flex flex-col space-y-3 shadow-xl">
          {/* Channel Search Filter */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter channels or #..."
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              className="w-full bg-cable-950 border border-cable-border pl-9 pr-3 py-2 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[540px]">
            {filteredChannels.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No channels found in this group.
              </div>
            ) : (
              filteredChannels.map((channel) => {
                const isSelected = activeTargetChannel?.id === channel.id;
                const isFav = favourites.includes(channel.id);
                const { current: nowProg } = getProgramsForChannel(channel);
                const chProgress = nowProg ? getProgramProgress(nowProg.start, nowProg.end) : 0;

                return (
                  <div
                    key={channel.id}
                    onClick={() => onSelectChannel(channel)}
                    role="button"
                    tabIndex={0}
                    className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 cable-focus-ring ${
                      isSelected
                        ? 'bg-cable-800 border-amber-400 shadow-cable-focus ring-2 ring-amber-400/40'
                        : 'bg-cable-950/80 hover:bg-cable-850 border-cable-border/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                        <span className="font-mono text-xs font-black text-amber-400 bg-black/60 px-2 py-1 rounded shrink-0">
                          {channel.channelNumber}
                        </span>

                        <div className="w-8 h-8 rounded bg-black/40 p-1 flex items-center justify-center shrink-0">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt=""
                              className="max-h-6 max-w-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <Tv className="w-4 h-4 text-slate-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {channel.name}
                          </h4>
                          <span className="text-[11px] text-amber-400 truncate block mt-0.5 font-medium">
                            {nowProg ? nowProg.title : 'Live Broadcast'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavourite(channel.id);
                        }}
                        className={`p-1.5 rounded-lg transition ${
                          isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'
                        }`}
                        title={isFav ? 'Unstar' : 'Star'}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Mini Progress */}
                    {nowProg && (
                      <div className="w-full bg-neutral-900 h-1 rounded-full mt-2.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-full rounded-full"
                          style={{ width: `${chProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pane 3: Embedded Live Player & Program Timeline (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Live Player Container */}
          <div className="bg-cable-900 border border-cable-border rounded-2xl overflow-hidden shadow-2xl">
            <Player
              channel={activeTargetChannel}
              currentProgram={currentProgram}
              nextProgram={upcomingPrograms[0]}
              timeZone={timeZone}
              onNextChannel={onNextChannel}
              onPrevChannel={onPrevChannel}
            />
          </div>

          {/* Program Guide / Upcoming Schedule for This Channel */}
          {activeTargetChannel && (
            <div className="bg-cable-900 border border-cable-border rounded-2xl p-4 shadow-xl space-y-3 flex-1">
              <div className="flex items-center justify-between border-b border-cable-border pb-2.5">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase font-mono text-slate-300">
                    Schedule for CH {activeTargetChannel.channelNumber}: {activeTargetChannel.name}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {upcomingPrograms.length + (currentProgram ? 1 : 0)} shows
                </span>
              </div>

              {/* Current Active Show */}
              {currentProgram ? (
                <div className="bg-cable-950 p-3 rounded-xl border border-amber-400/40 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span>ON AIR NOW</span>
                    </span>
                    <span>
                      {formatTimeInZone(currentProgram.start, timeZone)} - {formatTimeInZone(currentProgram.end, timeZone)}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{currentProgram.title}</h4>
                  {currentProgram.description && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {currentProgram.description}
                    </p>
                  )}
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-cable-950 rounded-xl text-xs text-slate-400 text-center">
                  Live broadcast (no guide data for current hour)
                </div>
              )}

              {/* Upcoming Shows Timeline */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block pt-1">
                  COMING UP NEXT
                </span>
                {upcomingPrograms.length === 0 ? (
                  <p className="text-xs text-slate-400">No upcoming guide listings available.</p>
                ) : (
                  upcomingPrograms.map((prog) => (
                    <div
                      key={prog.id}
                      className="p-2.5 rounded-xl bg-cable-950/70 border border-cable-border/50 flex items-start justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <h5 className="font-semibold text-white truncate">{prog.title}</h5>
                        {prog.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {prog.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {formatTimeInZone(prog.start, timeZone)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
