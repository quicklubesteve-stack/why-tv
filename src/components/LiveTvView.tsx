import React, { useState, useMemo } from 'react';
import {
  Tv,
  Star,
  Search,
  SlidersHorizontal,
  Play,
  Layers,
  Radio,
  EyeOff,
  Filter,
} from 'lucide-react';
import { Channel, CategoryConfig, EpgProgram, TimeZoneSetting } from '../types';
import { formatTimeInZone } from '../utils/dateUtils';

interface LiveTvViewProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  categories: CategoryConfig[];
  favourites: string[];
  onToggleFavourite: (channelId: string) => void;
  onOpenCategoryManager: () => void;
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
}

export const LiveTvView: React.FC<LiveTvViewProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  categories,
  favourites,
  onToggleFavourite,
  onOpenCategoryManager,
  epgPrograms,
  timeZone,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Build category display map and hidden lookup
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

  // Extract all distinct categories present in channels
  const availableCategoryTabs = useMemo(() => {
    const groups = new Set<string>();
    channels.forEach((c) => {
      if (c.group) groups.add(c.group);
    });

    // Ensure standard categories are known
    ['Local', 'Sports', 'News', 'Movies', 'Kids', 'International'].forEach((std) => groups.add(std));

    const tabs: { original: string; label: string; count: number; hidden: boolean }[] = [];

    groups.forEach((groupName) => {
      const config = categoryMap.get(groupName.toLowerCase());
      const isHidden = config ? config.hidden : false;
      const label = config ? config.displayName : groupName;
      const count = channels.filter(
        (c) => (c.group || 'Other').toLowerCase() === groupName.toLowerCase()
      ).length;

      tabs.push({
        original: groupName,
        label,
        count,
        hidden: isHidden,
      });
    });

    // Sort tabs with All first, then by count / alphabetical
    return tabs;
  }, [channels, categoryMap]);

  // Filter channels by category, hidden status, and search query
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      const groupLower = (ch.group || 'Other').toLowerCase();
      const config = categoryMap.get(groupLower);

      // Category filter
      if (selectedCategory !== 'All') {
        if (groupLower !== selectedCategory.toLowerCase()) {
          return false;
        }
      } else {
        // In "All Channels", respect hidden categories unless searching
        if (!searchQuery && config?.hidden) {
          return false;
        }
      }

      // Search filter (by name or channel number)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = ch.name.toLowerCase().includes(query);
        const matchesNumber = ch.channelNumber.toString().includes(query);
        const matchesGroup = (ch.group || '').toLowerCase().includes(query);
        return matchesName || matchesNumber || matchesGroup;
      }

      return true;
    });
  }, [channels, selectedCategory, searchQuery, categoryMap]);

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

  return (
    <div className="space-y-6 pb-12">
      {/* Category Pills & Channel Search Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar inside Live TV */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by channel name, category, or number (e.g. 101)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cable-900 border border-cable-border pl-10 pr-4 py-2 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Customizer Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenCategoryManager}
              className="flex items-center space-x-2 px-3.5 py-2 bg-cable-800 hover:bg-cable-700 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold border border-cable-border cable-focus-ring"
              title="Rename or Hide Categories"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Customize Categories</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {/* All Channels Tab */}
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cable-focus-ring ${
              selectedCategory === 'All'
                ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                : 'bg-cable-900 hover:bg-cable-800 text-slate-300 border border-cable-border/60'
            }`}
          >
            All Channels ({channels.length})
          </button>

          {/* Specific Categories */}
          {availableCategoryTabs
            .filter((tab) => !tab.hidden)
            .map((tab) => {
              const isSelected = selectedCategory.toLowerCase() === tab.original.toLowerCase();
              return (
                <button
                  key={tab.original}
                  onClick={() => setSelectedCategory(tab.original)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition cable-focus-ring ${
                    isSelected
                      ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                      : 'bg-cable-900 hover:bg-cable-800 text-slate-300 border border-cable-border/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-black text-amber-300' : 'bg-cable-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
        </div>
      </div>

      {/* Channels List / Grid */}
      {filteredChannels.length === 0 ? (
        <div className="p-12 rounded-2xl bg-cable-900/60 border border-cable-border text-center text-slate-400 space-y-3">
          <Tv className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No channels found</h3>
          <p className="text-sm max-w-md mx-auto">
            {searchQuery
              ? `No channels matching "${searchQuery}". Try searching by another keyword or channel number.`
              : `There are currently no visible channels in this category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredChannels.map((channel) => {
            const isSelected = selectedChannel?.id === channel.id;
            const isFav = favourites.includes(channel.id);
            const nowProg = getChannelNowProgram(channel);
            const catConfig = categoryMap.get((channel.group || '').toLowerCase());
            const displayGroup = catConfig ? catConfig.displayName : channel.group;

            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel)}
                role="button"
                tabIndex={0}
                className={`group relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-150 cable-focus-ring ${
                  isSelected
                    ? 'bg-cable-800/90 border-amber-400 shadow-cable-focus ring-2 ring-amber-400/50'
                    : 'bg-cable-900 hover:bg-cable-850 border-cable-border/80 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  {/* Channel Number Badge */}
                  <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-800 font-mono font-black text-amber-400 text-sm shadow-inner group-hover:border-amber-400/50 transition">
                    <span>{channel.channelNumber}</span>
                  </div>

                  {/* Channel Logo */}
                  <div className="w-10 h-10 rounded bg-neutral-950/60 p-1 flex items-center justify-center shrink-0 border border-neutral-800">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt=""
                        className="max-h-8 max-w-8 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Tv className="w-5 h-5 text-slate-500" />
                    )}
                  </div>

                  {/* Name and Current Program */}
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-amber-300">
                        {channel.name}
                      </h3>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 truncate mt-0.5">
                      <span className="text-amber-400 font-medium truncate">
                        {nowProg ? nowProg.title : 'Live Broadcast'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400">
                      <span className="bg-neutral-800 px-1.5 py-0.2 rounded text-slate-300 font-medium">
                        {displayGroup}
                      </span>
                      <span className="truncate">via {channel.sourceName}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions: Favourite Star & Play */}
                <div className="flex items-center space-x-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavourite(channel.id);
                    }}
                    className={`p-2 rounded-lg transition cable-focus-ring ${
                      isFav
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-slate-500 hover:text-slate-200 hover:bg-neutral-800'
                    }`}
                    title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  <div className="p-2 rounded-lg bg-amber-400/10 group-hover:bg-amber-400 text-amber-400 group-hover:text-neutral-950 transition">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
