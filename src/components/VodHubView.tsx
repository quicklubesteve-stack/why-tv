import React, { useState, useMemo } from 'react';
import {
  Film,
  Play,
  Info,
  Search,
  Star,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  RotateCcw,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { VodItem, VodEpisode } from '../types';
import { INITIAL_VOD_CATALOG, VOD_CATEGORIES } from '../data/vodData';
import { filterVodCatalog, formatVodDuration, getVodProgressForItem } from '../utils/vodUtils';

interface VodHubViewProps {
  onPlayVod: (vod: VodItem, episode?: VodEpisode) => void;
  onOpenXtreamModal?: () => void;
}

export const VodHubView: React.FC<VodHubViewProps> = ({ onPlayVod, onOpenXtreamModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalItem, setActiveModalItem] = useState<VodItem | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  // Filtered titles
  const filteredItems = useMemo(() => {
    return filterVodCatalog(INITIAL_VOD_CATALOG, selectedCategory, 'all', searchQuery);
  }, [selectedCategory, searchQuery]);

  // Featured billboard hero
  const featuredItem = useMemo(() => {
    return INITIAL_VOD_CATALOG.find((v) => v.featured && v.backdrop) || INITIAL_VOD_CATALOG[0];
  }, []);

  const movies = useMemo(() => filteredItems.filter((i) => i.type === 'movie'), [filteredItems]);
  const series = useMemo(() => filteredItems.filter((i) => i.type === 'series'), [filteredItems]);

  const handleOpenDetails = (item: VodItem) => {
    setActiveModalItem(item);
    setSelectedSeason(1);
  };

  const handleCloseModal = () => {
    setActiveModalItem(null);
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* 1. Hero Spotlight Billboard (Netflix Style) */}
      {!searchQuery && selectedCategory === 'All' && featuredItem && (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cable-border/70 group min-h-[380px] sm:min-h-[440px] flex items-end">
          {/* Background Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${featuredItem.backdrop || featuredItem.poster})`,
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-cable-950 via-cable-950/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-cable-950/90 via-cable-950/40 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 p-6 sm:p-10 max-w-2xl space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-400 text-neutral-950 flex items-center shadow">
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                FEATURED SPOTLIGHT
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-black/60 text-amber-300 border border-neutral-700">
                {featuredItem.category}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                {featuredItem.rating}
              </span>
              <span className="text-xs font-mono text-slate-300">{featuredItem.releaseYear}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {featuredItem.title}
            </h1>

            <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed drop-shadow">
              {featuredItem.description}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  if (featuredItem.type === 'movie') {
                    onPlayVod(featuredItem);
                  } else if (featuredItem.episodes && featuredItem.episodes.length > 0) {
                    onPlayVod(featuredItem, featuredItem.episodes[0]);
                  }
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-xl shadow-cable-focus cable-focus-ring text-sm transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{featuredItem.type === 'movie' ? 'Play Movie' : 'Watch Series'}</span>
              </button>

              <button
                onClick={() => handleOpenDetails(featuredItem)}
                className="flex items-center space-x-2 px-5 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold rounded-xl border border-neutral-700 text-sm transition cable-focus-ring"
              >
                <Info className="w-4 h-4 text-slate-300" />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Search & Category Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies, series, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cable-900 border border-cable-border pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* VOD Mode Badges */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 self-end md:self-center">
            <span className="px-2.5 py-1 bg-cable-900 border border-cable-border rounded-lg">
              {filteredItems.length} Titles Available
            </span>
            {onOpenXtreamModal && (
              <button
                onClick={onOpenXtreamModal}
                className="px-3 py-1 bg-cable-800 hover:bg-amber-400 hover:text-black text-slate-200 rounded-lg border border-cable-border font-bold transition"
              >
                Connect Xtream VOD
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {VOD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cable-focus-ring ${
                selectedCategory === cat
                  ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                  : 'bg-cable-900 text-slate-300 hover:bg-cable-800 hover:text-white border border-cable-border/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Movies On Demand Section */}
      {movies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-cable-border/80 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <Film className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-white tracking-wide">
                Movies On Demand ({movies.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((mov) => {
              const progress = getVodProgressForItem(mov.id);
              return (
                <div
                  key={mov.id}
                  onClick={() => handleOpenDetails(mov)}
                  role="button"
                  tabIndex={0}
                  className="group relative bg-cable-900 rounded-2xl overflow-hidden border border-cable-border hover:border-amber-400 shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col cable-focus-ring"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-cable-950">
                    <img
                      src={mov.poster}
                      alt={mov.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-cable-focus transform scale-75 group-hover:scale-100 transition">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-mono font-bold bg-black/70 text-amber-300 px-1.5 py-0.5 rounded border border-neutral-700">
                        {mov.rating}
                      </span>
                    </div>

                    {progress && (
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/60">
                        <div
                          className="h-full bg-amber-400"
                          style={{ width: `${progress.percent}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition truncate">
                        {mov.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                        <span>{mov.releaseYear}</span>
                        <span>•</span>
                        <span>{formatVodDuration(mov.durationMinutes)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TV Series & Binge Section */}
      {series.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-cable-border/80 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <Tv className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-black text-white tracking-wide">
                TV Series & Binge Sets ({series.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.map((ser) => (
              <div
                key={ser.id}
                onClick={() => handleOpenDetails(ser)}
                role="button"
                tabIndex={0}
                className="group relative bg-cable-900 rounded-2xl overflow-hidden border border-cable-border hover:border-amber-400 shadow-lg hover:shadow-2xl transition cursor-pointer flex flex-col cable-focus-ring"
              >
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-cable-950">
                  <img
                    src={ser.poster}
                    alt={ser.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-cable-focus transform scale-75 group-hover:scale-100 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-2 right-2">
                    <span className="text-[10px] font-mono font-bold bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                      {ser.totalSeasons} {ser.totalSeasons === 1 ? 'SEASON' : 'SEASONS'}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition truncate">
                      {ser.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
                      <span>{ser.releaseYear}</span>
                      <span>•</span>
                      <span>{ser.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Rich Title Details Modal (Netflix Style) */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="relative bg-cable-900 border border-cable-border rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Backdrop */}
            <div className="relative h-64 sm:h-80 w-full overflow-hidden">
              <img
                src={activeModalItem.backdrop || activeModalItem.poster}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cable-900 via-cable-900/60 to-transparent" />

              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-400 text-neutral-950">
                    {activeModalItem.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700 bg-black/60">
                    {activeModalItem.rating}
                  </span>
                  <span className="text-xs font-mono text-slate-300">{activeModalItem.releaseYear}</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-white">{activeModalItem.title}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Play Buttons Bar */}
              <div className="flex items-center space-x-3">
                {activeModalItem.type === 'movie' ? (
                  <button
                    onClick={() => {
                      onPlayVod(activeModalItem);
                      handleCloseModal();
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-xl shadow-cable-focus cable-focus-ring text-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Movie</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const firstEp = activeModalItem.episodes?.[0];
                      if (firstEp) onPlayVod(activeModalItem, firstEp);
                      handleCloseModal();
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-xl shadow-cable-focus cable-focus-ring text-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start S1:E1</span>
                  </button>
                )}
              </div>

              {/* Description & Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Synopsis
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {activeModalItem.description}
                  </p>
                </div>

                <div className="space-y-3 text-xs bg-cable-950 p-4 rounded-xl border border-cable-border/60">
                  {activeModalItem.director && (
                    <div>
                      <span className="text-slate-400 block font-mono">Director:</span>
                      <span className="text-white font-bold">{activeModalItem.director}</span>
                    </div>
                  )}

                  {activeModalItem.cast && activeModalItem.cast.length > 0 && (
                    <div>
                      <span className="text-slate-400 block font-mono">Starring Cast:</span>
                      <span className="text-slate-200">{activeModalItem.cast.join(', ')}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block font-mono">Format & Audio:</span>
                    <span className="text-amber-400 font-bold">1080p HD • Dolby Audio</span>
                  </div>
                </div>
              </div>

              {/* Series Episodes List (If Series) */}
              {activeModalItem.type === 'series' && activeModalItem.episodes && (
                <div className="space-y-4 pt-4 border-t border-cable-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-white">Episodes</h3>
                    <span className="text-xs font-mono text-slate-400">
                      Season {selectedSeason} ({activeModalItem.episodes.length} Episodes)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeModalItem.episodes.map((ep) => (
                      <div
                        key={ep.id}
                        onClick={() => {
                          onPlayVod(activeModalItem, ep);
                          handleCloseModal();
                        }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-cable-950 hover:bg-cable-800 border border-cable-border hover:border-amber-400 cursor-pointer transition gap-3"
                      >
                        <div className="flex items-start space-x-3 min-w-0">
                          {ep.thumbnail && (
                            <img
                              src={ep.thumbnail}
                              alt={ep.title}
                              className="w-20 h-12 object-cover rounded-lg shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono font-black text-amber-400">
                                E{ep.episodeNumber}
                              </span>
                              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 truncate">
                                {ep.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                              {ep.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs font-mono text-slate-400">
                            {ep.durationMinutes}m
                          </span>
                          <button className="p-2 rounded-lg bg-amber-400 text-black hover:bg-amber-300">
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
