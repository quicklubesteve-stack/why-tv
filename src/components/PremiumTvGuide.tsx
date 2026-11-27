import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Tv,
  Star,
  Search,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Radio,
  SlidersHorizontal,
  Flame,
  Film,
  Zap,
  Trophy,
  ExternalLink,
  ShieldCheck,
  Disc,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Check,
  Settings,
  Menu,
  Activity,
  Globe,
  Smile,
  Video,
  MonitorPlay,
  RadioTower,
  Smartphone,
} from 'lucide-react';
import {
  Channel,
  CategoryConfig,
  EpgProgram,
  TimeZoneSetting,
  ProviderConnection,
  PvrRecording,
} from '../types';
import { formatTimeInZone, formatDateInZone, getProgramProgress } from '../utils/dateUtils';
import { Player } from './Player';
import { DEDICATED_CHANNEL_SCHEDULES } from '../data/demoData';
import { INITIAL_SPORTS_GAMES } from '../data/sportsData';
import { INITIAL_PROVIDERS } from '../data/providerData';

export interface PremiumTvGuideProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  categories: CategoryConfig[];
  favourites: string[];
  onToggleFavourite: (channelId: string) => void;
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
  onOpenSettings?: () => void;
  onOpenSportsBar?: () => void;
  onOpenProviderHub?: () => void;
  onOpenSearch?: () => void;
  onScheduleRecording?: (program: EpgProgram, channel: Channel) => void;
  recordedProgramKeys?: Set<string>;
}

// 19 standard categories required by the prompt
export type GuideNavCategoryId =
  | 'all'
  | 'favourites'
  | 'canadian'
  | 'american'
  | 'sports'
  | 'nhl'
  | 'nfl'
  | 'nba'
  | 'mlb'
  | 'combat'
  | 'movies'
  | 'series'
  | 'news'
  | 'kids'
  | 'international'
  | 'pluto'
  | 'plex'
  | 'providers'
  | 'settings';

interface GuideCategoryItem {
  id: GuideNavCategoryId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
}

const MINUTE_WIDTH = 5.0; // 5px per minute = 150px per 30-minute block

export const PremiumTvGuide: React.FC<PremiumTvGuideProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
  categories,
  favourites,
  onToggleFavourite,
  epgPrograms,
  timeZone,
  onOpenSettings,
  onOpenSportsBar,
  onOpenProviderHub,
  onOpenSearch,
  onScheduleRecording,
  recordedProgramKeys = new Set(),
}) => {
  // Navigation State
  const [activeCategoryId, setActiveCategoryId] = useState<GuideNavCategoryId>('all');
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const [channelSearch, setChannelSearch] = useState<string>('');
  const [singleClickPlayback, setSingleClickPlayback] = useState<boolean>(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Active channel in preview
  const activeChannel = selectedChannel || channels[0] || null;

  // Selected cell focus in horizontal grid
  const [focusedChannelIndex, setFocusedChannelIndex] = useState<number>(0);
  const [focusedProgramIndex, setFocusedProgramIndex] = useState<number>(0);
  const [selectedProgramModal, setSelectedProgramModal] = useState<{
    program: EpgProgram;
    channel: Channel;
  } | null>(null);

  // Video element ref for embedded preview
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const channelListRef = useRef<HTMLDivElement>(null);
  const timelineHeaderRef = useRef<HTMLDivElement>(null);

  // 19 Categories Definition
  const guideCategories: GuideCategoryItem[] = useMemo(() => [
    { id: 'all', label: 'All Channels', icon: Tv },
    { id: 'favourites', label: 'Favourites', icon: Star, badge: favourites.length > 0 ? `${favourites.length}` : undefined },
    { id: 'canadian', label: 'Canadian Channels', icon: Globe },
    { id: 'american', label: 'American Channels', icon: RadioTower },
    { id: 'sports', label: 'Live Sports', icon: Flame },
    { id: 'nhl', label: 'NHL', icon: Trophy },
    { id: 'nfl', label: 'NFL', icon: Trophy },
    { id: 'nba', label: 'NBA', icon: Trophy },
    { id: 'mlb', label: 'MLB', icon: Trophy },
    { id: 'combat', label: 'UFC and Boxing', icon: Flame },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'series', label: 'Television Series', icon: Video },
    { id: 'news', label: 'News', icon: Zap },
    { id: 'kids', label: 'Kids', icon: Smile },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'pluto', label: 'Pluto TV', icon: Radio },
    { id: 'plex', label: 'Plex', icon: MonitorPlay },
    { id: 'providers', label: 'Other Connected Providers', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings },
  ], [favourites.length]);

  // Filter channels based on selected category & search query
  const filteredChannels = useMemo(() => {
    return channels.filter((ch) => {
      // Search query filter
      if (channelSearch.trim()) {
        const q = channelSearch.toLowerCase().trim();
        const matchesName = ch.name.toLowerCase().includes(q);
        const matchesNum = ch.channelNumber.toString().includes(q);
        const matchesGroup = (ch.group || '').toLowerCase().includes(q);
        if (!matchesName && !matchesNum && !matchesGroup) return false;
      }

      const nameLower = ch.name.toLowerCase();
      const groupLower = (ch.group || '').toLowerCase();
      const sourceLower = (ch.sourceName || '').toLowerCase();
      const badgeLower = (ch.providerBadge || '').toLowerCase();
      const provId = (ch.providerId || '').toLowerCase();

      switch (activeCategoryId) {
        case 'all':
          return true;
        case 'favourites':
          return favourites.includes(ch.id);
        case 'canadian':
          return (
            groupLower === 'local' ||
            nameLower.includes('cbc') ||
            nameLower.includes('ctv') ||
            nameLower.includes('citytv') ||
            nameLower.includes('tsn') ||
            nameLower.includes('sportsnet') ||
            nameLower.includes('toronto') ||
            nameLower.includes('vancouver') ||
            sourceLower.includes('canada') ||
            sourceLower.includes('canadian') ||
            badgeLower.includes('vmedia') ||
            badgeLower.includes('teksavvy') ||
            badgeLower.includes('bell') ||
            badgeLower.includes('rogers') ||
            badgeLower.includes('gem') ||
            provId.includes('vmedia') ||
            provId.includes('teksavvy') ||
            provId.includes('cbc')
          );
        case 'american':
          return (
            nameLower.includes('dw news') ||
            nameLower.includes('nasa') ||
            nameLower.includes('sportsgrid') ||
            nameLower.includes('cinema 24') ||
            nameLower.includes('epic movie') ||
            nameLower.includes('red bull') ||
            nameLower.includes('acc') ||
            nameLower.includes('cbs') ||
            nameLower.includes('pga') ||
            badgeLower.includes('pluto') ||
            badgeLower.includes('amagi') ||
            badgeLower.includes('wurl') ||
            badgeLower.includes('frequency') ||
            sourceLower.includes('usa') ||
            sourceLower.includes('america')
          );
        case 'sports':
          return (
            groupLower === 'sports' ||
            nameLower.includes('sports') ||
            nameLower.includes('football') ||
            nameLower.includes('hockey') ||
            nameLower.includes('soccer') ||
            nameLower.includes('combat') ||
            nameLower.includes('dazn') ||
            nameLower.includes('tsn') ||
            nameLower.includes('golf')
          );
        case 'nhl':
          return (
            nameLower.includes('hockey') ||
            nameLower.includes('tsn 4') ||
            nameLower.includes('sportsnet') ||
            ch.channelNumber === 120 ||
            ch.channelNumber === 121 ||
            ch.channelNumber === 123
          );
        case 'nfl':
          return (
            nameLower.includes('nfl') ||
            nameLower.includes('football') ||
            nameLower.includes('sportsgrid') ||
            nameLower.includes('redzone') ||
            ch.channelNumber === 108 ||
            ch.channelNumber === 126 ||
            ch.channelNumber === 503
          );
        case 'nba':
          return (
            nameLower.includes('basketball') ||
            nameLower.includes('sportsnet') ||
            nameLower.includes('tsn 1') ||
            ch.channelNumber === 120 ||
            ch.channelNumber === 122
          );
        case 'mlb':
          return (
            nameLower.includes('baseball') ||
            nameLower.includes('sportsnet') ||
            nameLower.includes('sportsgrid') ||
            ch.channelNumber === 121 ||
            ch.channelNumber === 126
          );
        case 'combat':
          return (
            nameLower.includes('combat') ||
            nameLower.includes('boxing') ||
            nameLower.includes('ufc') ||
            nameLower.includes('fight') ||
            ch.channelNumber === 125 ||
            ch.channelNumber === 502 ||
            ch.channelNumber === 763
          );
        case 'movies':
          return (
            groupLower === 'movies' ||
            nameLower.includes('movie') ||
            nameLower.includes('cinema') ||
            nameLower.includes('film') ||
            nameLower.includes('thriller') ||
            nameLower.includes('hollywood')
          );
        case 'series':
          return (
            groupLower === 'entertainment' ||
            nameLower.includes('entertainment') ||
            nameLower.includes('series') ||
            nameLower.includes('citytv') ||
            nameLower.includes('binge') ||
            nameLower.includes('sitcom') ||
            nameLower.includes('crime')
          );
        case 'news':
          return (
            groupLower === 'news' ||
            nameLower.includes('news') ||
            nameLower.includes('dw') ||
            nameLower.includes('france 24') ||
            nameLower.includes('al jazeera') ||
            nameLower.includes('euronews')
          );
        case 'kids':
          return (
            groupLower === 'kids' ||
            nameLower.includes('kids') ||
            nameLower.includes('toon') ||
            nameLower.includes('cartoon') ||
            nameLower.includes('family')
          );
        case 'international':
          return (
            groupLower === 'international' ||
            nameLower.includes('tv5') ||
            nameLower.includes('monde') ||
            nameLower.includes('al jazeera') ||
            nameLower.includes('dw') ||
            nameLower.includes('france 24')
          );
        case 'pluto':
          return (
            provId.includes('pluto') ||
            badgeLower.includes('pluto') ||
            nameLower.includes('pluto') ||
            sourceLower.includes('pluto')
          );
        case 'plex':
          return (
            provId.includes('plex') ||
            badgeLower.includes('plex') ||
            nameLower.includes('plex') ||
            sourceLower.includes('plex')
          );
        case 'providers':
          return (
            Boolean(ch.providerId) ||
            sourceLower.includes('vmedia') ||
            sourceLower.includes('teksavvy') ||
            sourceLower.includes('amagi') ||
            sourceLower.includes('wurl') ||
            sourceLower.includes('samsung') ||
            sourceLower.includes('lg') ||
            sourceLower.includes('xumo') ||
            sourceLower.includes('roku')
          );
        case 'settings':
          return true;
        default:
          return true;
      }
    });
  }, [channels, activeCategoryId, channelSearch, favourites]);

  // Keep focused channel in range
  useEffect(() => {
    if (focusedChannelIndex >= filteredChannels.length) {
      setFocusedChannelIndex(Math.max(0, filteredChannels.length - 1));
    }
  }, [filteredChannels.length, focusedChannelIndex]);

  // Define guide timeline range: 2 hours ago to 26 hours ahead, snapped to 30 min boundaries
  const { startTime, endTime, timeSlots } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    start.setMinutes(start.getMinutes() < 30 ? 0 : 30, 0, 0);

    const end = new Date(start.getTime() + 28 * 60 * 60 * 1000);

    const slots: Date[] = [];
    let cur = new Date(start);
    while (cur < end) {
      slots.push(new Date(cur));
      cur = new Date(cur.getTime() + 30 * 60 * 1000);
    }

    return { startTime: start, endTime: end, timeSlots: slots };
  }, []);

  // Jump grid scroll to target timestamp
  const scrollToTimestamp = useCallback((targetMs: number) => {
    if (!gridContainerRef.current) return;
    const diffMinutes = Math.max(0, (targetMs - startTime.getTime()) / (60 * 1000));
    const targetScroll = Math.max(0, diffMinutes * MINUTE_WIDTH - 240);
    gridContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, [startTime]);

  const scrollToNow = useCallback(() => {
    scrollToTimestamp(Date.now());
  }, [scrollToTimestamp]);

  useEffect(() => {
    const timer = setTimeout(scrollToNow, 300);
    return () => clearTimeout(timer);
  }, [scrollToNow]);

  // Programs helper for any channel
  const getProgramsForChannel = useCallback((ch: Channel | null) => {
    if (!ch) return { current: undefined, upcoming: [], all: [] };
    const now = Date.now();
    const mappedId = ch.tvgId || ch.id;

    const list = epgPrograms.filter((p) => p.channelId === mappedId || p.channelId === ch.id);
    list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    let current = list.find((p) => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now);
    let upcoming = list.filter((p) => new Date(p.start).getTime() > now).slice(0, 8);

    // Fallback to high-fidelity dedicated schedule
    if (!current && DEDICATED_CHANNEL_SCHEDULES[ch.channelNumber]) {
      const sched = DEDICATED_CHANNEL_SCHEDULES[ch.channelNumber];
      current = {
        id: `sched_live_${ch.id}`,
        channelId: mappedId,
        title: sched.liveTitle,
        description: sched.liveDesc,
        category: sched.category,
        start: new Date(now - 45 * 60 * 1000).toISOString(),
        end: new Date(now + 75 * 60 * 1000).toISOString(),
      };
      if (upcoming.length === 0 && sched.upcoming.length > 0) {
        upcoming = sched.upcoming.slice(0, 8).map((u, i) => ({
          id: `sched_fut_${ch.id}_${i}`,
          channelId: mappedId,
          title: u.title,
          description: u.desc,
          category: sched.category,
          start: new Date(now + (75 + i * 60) * 60 * 1000).toISOString(),
          end: new Date(now + (75 + (i + 1) * 60) * 60 * 1000).toISOString(),
        }));
      }
    }

    // Full chronological schedule covering the timeline
    let fullSchedule: EpgProgram[] = [];
    if (list.length > 0) {
      fullSchedule = list;
    } else {
      // Build synthetic program blocks for display across the horizontal timeline
      let progTime = new Date(startTime).getTime();
      let idx = 0;
      while (progTime < endTime.getTime()) {
        const durationMin = 30 + ((idx % 3) * 30); // 30, 60, or 90 minutes
        const blockEnd = Math.min(endTime.getTime(), progTime + durationMin * 60 * 1000);
        const isCurrentBlock = now >= progTime && now < blockEnd;
        
        let title = `${ch.name} Broadcast`;
        let desc = `Standard scheduled programming from ${ch.sourceName || 'WHY IPTV Network'}. High definition digital stream.`;
        let cat = ch.group || 'General';

        if (isCurrentBlock && current) {
          title = current.title;
          desc = current.description || desc;
          cat = current.category || cat;
        } else if (idx < upcoming.length) {
          title = upcoming[idx].title;
          desc = upcoming[idx].description || desc;
          cat = upcoming[idx].category || cat;
        }

        fullSchedule.push({
          id: `gen_${ch.id}_${progTime}`,
          channelId: mappedId,
          title,
          description: desc,
          category: cat,
          start: new Date(progTime).toISOString(),
          end: new Date(blockEnd).toISOString(),
        });

        progTime = blockEnd;
        idx++;
      }
    }

    return { current, upcoming, all: fullSchedule };
  }, [epgPrograms, startTime, endTime]);

  // Current channel's programs
  const activePrograms = useMemo(() => {
    return getProgramsForChannel(activeChannel);
  }, [activeChannel, getProgramsForChannel]);

  // Current-time red vertical line position in pixels
  const nowOffsetPx = Math.max(
    0,
    ((Date.now() - startTime.getTime()) / (60 * 1000)) * MINUTE_WIDTH
  );

  // Handle click on a channel:
  // First click: plays in preview & highlights.
  // Second click (if already selected) or double click: launches fullscreen.
  const handleChannelClick = (channel: Channel) => {
    if (activeChannel?.id === channel.id) {
      if (singleClickPlayback) {
        setIsFullscreenPreview(true);
      } else {
        setIsFullscreenPreview(true);
      }
    } else {
      onSelectChannel(channel);
      if (singleClickPlayback) {
        setIsFullscreenPreview(true);
      }
    }
  };

  // Keyboard / Television Remote Navigation (Up, Down, Left, Right, Enter, Back, Space, Menu, PageUp/Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in search input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          setFocusedChannelIndex((prev) => {
            const next = Math.max(0, prev - 1);
            if (filteredChannels[next]) {
              onSelectChannel(filteredChannels[next]);
            }
            return next;
          });
          break;

        case 'ArrowDown':
          e.preventDefault();
          setFocusedChannelIndex((prev) => {
            const next = Math.min(filteredChannels.length - 1, prev + 1);
            if (filteredChannels[next]) {
              onSelectChannel(filteredChannels[next]);
            }
            return next;
          });
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (gridContainerRef.current) {
            gridContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (gridContainerRef.current) {
            gridContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
          }
          break;

        case 'Enter':
          e.preventDefault();
          if (filteredChannels[focusedChannelIndex]) {
            const targetChannel = filteredChannels[focusedChannelIndex];
            if (activeChannel?.id === targetChannel.id) {
              setIsFullscreenPreview(true);
            } else {
              onSelectChannel(targetChannel);
            }
          }
          break;

        case 'Escape':
        case 'Backspace':
          if (isFullscreenPreview) {
            e.preventDefault();
            setIsFullscreenPreview(false);
          } else if (selectedProgramModal) {
            e.preventDefault();
            setSelectedProgramModal(null);
          }
          break;

        case 'PageUp':
          e.preventDefault();
          setFocusedChannelIndex((prev) => {
            const next = Math.max(0, prev - 5);
            if (filteredChannels[next]) onSelectChannel(filteredChannels[next]);
            return next;
          });
          break;

        case 'PageDown':
          e.preventDefault();
          setFocusedChannelIndex((prev) => {
            const next = Math.min(filteredChannels.length - 1, prev + 5);
            if (filteredChannels[next]) onSelectChannel(filteredChannels[next]);
            return next;
          });
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          setIsMenuCollapsed((prev) => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    filteredChannels,
    focusedChannelIndex,
    activeChannel,
    onSelectChannel,
    isFullscreenPreview,
    selectedProgramModal,
  ]);

  // Compute streaming quality label based on channel properties
  const streamingQuality = useMemo(() => {
    if (!activeChannel) return '1080p Full HD';
    if (activeChannel.name.includes('4K')) return '4K UHD 2160p';
    if (activeChannel.name.includes('HD') || activeChannel.streamProtocol === 'HLS') {
      return '1080p Full HD • 60 FPS';
    }
    return '1080p Full HD • 60 FPS';
  }, [activeChannel]);

  // Content provider badge
  const providerBadgeText = useMemo(() => {
    if (!activeChannel) return 'WHY IPTV';
    if (activeChannel.providerBadge) return activeChannel.providerBadge;
    if (activeChannel.sourceName) return activeChannel.sourceName;
    return 'Authorized IPTV';
  }, [activeChannel]);

  // Current program progress percentage
  const currentProgramProgress = useMemo(() => {
    if (!activePrograms.current) return 45;
    return getProgramProgress(activePrograms.current.start, activePrograms.current.end);
  }, [activePrograms.current]);

  return (
    <div className="flex h-screen w-full bg-[#10151F] text-white overflow-hidden font-sans select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT-HAND NAVIGATION MENU (PERMANENT & COLLAPSIBLE)         */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`flex flex-col bg-[#1B2432] border-r border-[#263447] transition-all duration-300 z-30 shrink-0 ${
          isMenuCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#263447]">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#195F9E] to-[#42AAFF] flex items-center justify-center shadow-lg shadow-[#42AAFF]/20 shrink-0">
              <Tv className="w-5 h-5 text-white" />
            </div>
            {!isMenuCollapsed && (
              <div className="truncate">
                <span className="font-black text-lg tracking-wider text-white">WHY</span>
                <span className="font-light text-lg tracking-wider text-[#42AAFF] ml-1">IPTV</span>
                <div className="text-[10px] text-[#94A3B8] font-medium tracking-widest uppercase">
                  Cable Guide
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsMenuCollapsed((prev) => !prev)}
            title="Toggle Menu (Shortcut: M)"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#263447] transition shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Scrollable List (19 Required Categories) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar">
          {guideCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'settings' && onOpenSettings) {
                    onOpenSettings();
                  } else {
                    setActiveCategoryId(cat.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                  isSelected
                    ? 'bg-[#195F9E] text-white shadow-md shadow-[#195F9E]/40 border border-[#42AAFF]/50 ring-1 ring-[#42AAFF]'
                    : 'text-[#94A3B8] hover:bg-[#263447] hover:text-white'
                }`}
                title={cat.label}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-5 h-5 shrink-0 transition ${
                      isSelected ? 'text-[#42AAFF]' : 'text-[#94A3B8] group-hover:text-white'
                    }`}
                  />
                  {!isMenuCollapsed && (
                    <span className="truncate text-left">{cat.label}</span>
                  )}
                </div>

                {!isMenuCollapsed && cat.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-[#42AAFF] text-[#10151F]'
                        : 'bg-[#263447] text-[#94A3B8]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Remote Navigation Hint Footer */}
        {!isMenuCollapsed && (
          <div className="p-3 border-t border-[#263447] bg-[#10151F]/60 text-[11px] text-[#94A3B8] space-y-1">
            <div className="flex items-center justify-between text-white font-semibold">
              <span>Remote Control Ready</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[10px] leading-tight">
              Use D-pad arrows to navigate channels & timeline. Enter to watch.
            </p>
          </div>
        )}
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN CONTAINER: TOP PREVIEW PANE + BOTTOM EPG GRID         */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col h-screen min-w-0 bg-[#10151F] overflow-hidden">
        {/* TOP TOOLBAR: Quick Search, Jump Time, Viewport controls */}
        <header className="flex items-center justify-between px-6 py-3 bg-[#1B2432] border-b border-[#263447] shrink-0">
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search channels, numbers, sports or shows..."
                value={channelSearch}
                onChange={(e) => setChannelSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#10151F] border border-[#263447] focus:border-[#42AAFF] rounded-xl text-sm text-white placeholder-[#94A3B8] outline-none transition"
              />
              {channelSearch && (
                <button
                  onClick={() => setChannelSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Time Navigation Buttons */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={scrollToNow}
                className="px-3 py-1.5 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white text-xs font-bold rounded-lg transition border border-[#42AAFF]/40 shadow-sm flex items-center space-x-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Jump to Now</span>
              </button>
              <button
                onClick={() => scrollToTimestamp(Date.now() + 2 * 60 * 60 * 1000)}
                className="px-2.5 py-1.5 bg-[#263447] hover:bg-[#195F9E] text-white text-xs font-medium rounded-lg transition"
              >
                +2 Hours
              </button>
              <button
                onClick={() => {
                  const prime = new Date();
                  prime.setHours(20, 0, 0, 0);
                  if (Date.now() > prime.getTime() + 30 * 60 * 1000) prime.setDate(prime.getDate() + 1);
                  scrollToTimestamp(prime.getTime());
                }}
                className="px-2.5 py-1.5 bg-[#263447] hover:bg-[#195F9E] text-white text-xs font-medium rounded-lg transition"
              >
                Prime Time (8 PM)
              </button>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3 ml-4">
            {/* Single-Click vs Double-Click Playback toggle */}
            <button
              onClick={() => setSingleClickPlayback((prev) => !prev)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                singleClickPlayback
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  : 'bg-[#263447] border-[#263447] text-[#94A3B8] hover:text-white'
              }`}
              title="Toggle single-click direct fullscreen playback"
            >
              <span>Single-Click Fullscreen: {singleClickPlayback ? 'ON' : 'OFF'}</span>
            </button>

            {/* Live Sports Center button */}
            {onOpenSportsBar && (
              <button
                onClick={onOpenSportsBar}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#263447] hover:bg-[#195F9E] text-white text-xs font-bold rounded-lg transition border border-[#42AAFF]/30"
              >
                <Flame className="w-3.5 h-3.5 text-[#42AAFF]" />
                <span className="hidden sm:inline">Sports Center</span>
              </button>
            )}

            {/* Provider Hub */}
            {onOpenProviderHub && (
              <button
                onClick={onOpenProviderHub}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#263447] hover:bg-[#195F9E] text-white text-xs font-bold rounded-lg transition border border-[#42AAFF]/30"
              >
                <Layers className="w-3.5 h-3.5 text-[#42AAFF]" />
                <span className="hidden sm:inline">Providers</span>
              </button>
            )}
          </div>
        </header>

        {/* ----------------------------------------------------------- */}
        {/* 3. LIVE TELEVISION PREVIEW (TOP SECTION ABOVE GUIDE)         */}
        {/* ----------------------------------------------------------- */}
        <section className="bg-[#10151F] border-b border-[#263447] p-4 flex flex-col md:flex-row gap-5 items-stretch shrink-0">
          {/* Embedded Video Player Box with Click to Fullscreen */}
          <div
            onClick={() => setIsFullscreenPreview(true)}
            className="group relative w-full md:w-[460px] lg:w-[520px] aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border-2 border-[#263447] hover:border-[#42AAFF] transition-all cursor-pointer shrink-0"
            title="Click to expand full screen"
          >
            {activeChannel ? (
              <Player
                channel={activeChannel}
                currentProgram={activePrograms.current}
                nextProgram={activePrograms.upcoming[0]}
                timeZone={timeZone}
                allChannels={channels}
                onSelectChannel={onSelectChannel}
                onOpenSportsBar={onOpenSportsBar}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                <Tv className="w-12 h-12 stroke-[1.5]" />
              </div>
            )}

            {/* Fullscreen Overlay Hint on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
              <div className="flex items-center space-x-2 px-4 py-2 bg-[#195F9E]/90 text-white rounded-xl font-bold text-sm shadow-xl backdrop-blur-sm border border-[#42AAFF]">
                <Maximize2 className="w-4 h-4 text-[#42AAFF]" />
                <span>Click for Fullscreen Mode</span>
              </div>
            </div>
          </div>

          {/* Metadata Card: Channel Details, Current Programme, Next Show */}
          <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
            {activeChannel ? (
              <>
                {/* Top Channel Header Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-[#1B2432] border border-[#263447] p-1 flex items-center justify-center shrink-0">
                        {activeChannel.logo ? (
                          <img
                            src={activeChannel.logo}
                            alt={activeChannel.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <Tv className="w-5 h-5 text-[#42AAFF]" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-xl text-white">
                            Ch {activeChannel.channelNumber}
                          </span>
                          <span className="text-lg font-bold text-slate-200 truncate">
                            {activeChannel.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavourite(activeChannel.id);
                            }}
                            className="p-1 rounded-lg hover:bg-[#263447] transition"
                            title="Toggle Favourite"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                favourites.includes(activeChannel.id)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-[#94A3B8] hover:text-white'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Badges: Streaming Quality & Content Provider */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-md bg-[#263447] text-white text-xs font-semibold border border-white/10 flex items-center space-x-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#42AAFF]" />
                        <span>{streamingQuality}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#195F9E] text-white text-xs font-bold border border-[#42AAFF]/50 shadow-sm">
                        {providerBadgeText}
                      </span>
                    </div>
                  </div>

                  {/* Current Program Title & Times */}
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-black text-white tracking-tight">
                        {activePrograms.current?.title || `${activeChannel.name} Live Stream`}
                      </span>
                      {activePrograms.current?.category?.toLowerCase().includes('sport') && (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-red-600/30 border border-red-500/50 text-red-400 font-black text-[10px] tracking-wider uppercase animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span>LIVE</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-[#94A3B8] mt-1 font-medium">
                      {activePrograms.current ? (
                        <>
                          <span>
                            {formatTimeInZone(activePrograms.current.start, timeZone)} -{' '}
                            {formatTimeInZone(activePrograms.current.end, timeZone)}
                          </span>
                          <span>•</span>
                          <span>{activePrograms.current.category || activeChannel.group || 'Live TV'}</span>
                        </>
                      ) : (
                        <span>Continuous 24/7 Broadcast</span>
                      )}
                    </div>

                    {/* Elapsed Time Progress Bar */}
                    <div className="w-full bg-[#1B2432] h-1.5 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#195F9E] to-[#42AAFF] rounded-full transition-all duration-500"
                        style={{ width: `${currentProgramProgress}%` }}
                      ></div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs text-[#94A3B8] mt-2 line-clamp-2 leading-relaxed">
                      {activePrograms.current?.description ||
                        `Live linear stream delivered over authorized high-bitrate multi-CDN infrastructure from ${activeChannel.sourceName || 'WHY IPTV Network'}.`}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Next Programme Preview */}
                <div className="mt-3 pt-2.5 border-t border-[#263447] flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-[#94A3B8] font-bold uppercase text-[10px] tracking-wider">
                      UP NEXT:
                    </span>
                    <span className="font-semibold text-slate-200 truncate">
                      {activePrograms.upcoming[0]?.title || 'Upcoming Broadcast Programming'}
                    </span>
                    {activePrograms.upcoming[0] && (
                      <span className="text-[#94A3B8]">
                        ({formatTimeInZone(activePrograms.upcoming[0].start, timeZone)})
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsFullscreenPreview(true)}
                    className="flex items-center space-x-1.5 px-3 py-1 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white text-xs font-bold rounded-lg transition"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Watch Fullscreen</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-[#94A3B8]">
                Select a channel from the guide below to tune in.
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* 4. ELECTRONIC PROGRAMME GUIDE (EPG HORIZONTAL CABLE GRID)     */}
        {/* ------------------------------------------------------------- */}
        <section className="flex-1 flex flex-col min-h-0 bg-[#263447] relative overflow-hidden">
          {/* Main Grid Viewport with Sticky Header & Sticky First Column */}
          <div
            ref={gridContainerRef}
            className="flex-1 overflow-auto custom-scrollbar relative"
          >
            {/* STICKY TIME HEADER ROW */}
            <div className="sticky top-0 z-20 flex bg-[#1B2432] border-b border-[#263447] shadow-md min-w-max">
              {/* Sticky Top-Left Corner: Channel Info Header */}
              <div className="sticky left-0 z-30 w-72 bg-[#1B2432] border-r border-[#263447] px-4 py-3 flex items-center justify-between font-bold text-xs text-[#94A3B8] uppercase tracking-wider shrink-0">
                <div className="flex items-center space-x-2">
                  <Tv className="w-4 h-4 text-[#42AAFF]" />
                  <span>Channel ({filteredChannels.length})</span>
                </div>
                <span className="text-[10px] bg-[#10151F] px-2 py-0.5 rounded text-white font-mono">
                  {formatTimeInZone(new Date().toISOString(), timeZone)}
                </span>
              </div>

              {/* 30-Minute Schedule Increments Header */}
              <div className="flex items-center relative">
                {timeSlots.map((slot, i) => (
                  <div
                    key={slot.toISOString()}
                    className="flex items-center px-3 py-3 border-r border-[#263447]/60 text-xs font-bold text-[#94A3B8] shrink-0"
                    style={{ width: `${30 * MINUTE_WIDTH}px` }}
                  >
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#42AAFF]/70" />
                    <span>{formatTimeInZone(slot.toISOString(), timeZone)}</span>
                  </div>
                ))}

                {/* RED VERTICAL CURRENT-TIME LINE INDICATOR (HEAD ARROW) */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none z-30"
                  style={{ left: `${nowOffsetPx}px` }}
                >
                  <div className="w-0.5 h-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></div>
                  <div className="w-2.5 h-2.5 bg-[#EF4444] rounded-full -ml-1 -mt-1 shadow-md"></div>
                </div>
              </div>
            </div>

            {/* CHANNEL ROWS WITH HORIZONTAL PROGRAMME CELLS */}
            <div className="relative min-w-max">
              {/* RED VERTICAL LINE SPANNING ALL CHANNEL ROWS */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none z-10"
                style={{ left: `${288 + nowOffsetPx}px` }}
              >
                <div className="w-0.5 h-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"></div>
              </div>

              {filteredChannels.length === 0 ? (
                <div className="p-12 text-center text-[#94A3B8]">
                  <p className="text-base font-semibold">No channels match the selected category.</p>
                  <p className="text-xs mt-1">Select "All Channels" or clear your search.</p>
                </div>
              ) : (
                filteredChannels.map((ch, chIdx) => {
                  const isSelectedChannel = activeChannel?.id === ch.id;
                  const isFocusedChannel = focusedChannelIndex === chIdx;
                  const progData = getProgramsForChannel(ch);

                  return (
                    <div
                      key={ch.id}
                      className={`flex border-b border-[#10151F]/40 transition group ${
                        isSelectedChannel
                          ? 'bg-[#195F9E]/30'
                          : isFocusedChannel
                          ? 'bg-[#195F9E]/20'
                          : 'hover:bg-[#10151F]/20'
                      }`}
                    >
                      {/* STICKY FIRST COLUMN: Channel Number, Logo & Name */}
                      <div
                        onClick={() => handleChannelClick(ch)}
                        className={`sticky left-0 z-20 w-72 flex items-center justify-between px-3 py-3 border-r border-[#10151F]/50 transition cursor-pointer shrink-0 ${
                          isSelectedChannel
                            ? 'bg-[#195F9E] text-white shadow-lg ring-1 ring-[#42AAFF]'
                            : 'bg-[#1B2432] text-white hover:bg-[#263447]'
                        }`}
                      >
                        <div className="flex items-center space-x-3 truncate">
                          {/* Channel Number */}
                          <span className="font-mono font-black text-sm text-[#42AAFF] w-9 text-right shrink-0">
                            {ch.channelNumber}
                          </span>

                          {/* Channel Logo */}
                          <div className="w-8 h-8 rounded-lg bg-[#10151F] border border-white/10 p-0.5 flex items-center justify-center shrink-0">
                            {ch.logo ? (
                              <img
                                src={ch.logo}
                                alt={ch.name}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Tv className="w-4 h-4 text-[#42AAFF]" />
                            )}
                          </div>

                          {/* Channel Title */}
                          <div className="truncate">
                            <span className="font-bold text-sm block truncate leading-tight">
                              {ch.name}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] block truncate">
                              {ch.providerBadge || ch.group || 'Live Feed'}
                            </span>
                          </div>
                        </div>

                        {/* Star Favourite Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavourite(ch.id);
                          }}
                          className="p-1 rounded hover:bg-[#10151F]/40 transition text-[#94A3B8] hover:text-white shrink-0 ml-1"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              favourites.includes(ch.id)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-[#94A3B8]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* PROGRAMME SCHEDULE CELLS */}
                      <div className="flex items-center relative py-1 px-1">
                        {progData.all.map((prog, pIdx) => {
                          const progStart = new Date(prog.start).getTime();
                          const progEnd = new Date(prog.end).getTime();

                          // Clamp to timeline viewport boundaries
                          const clampedStart = Math.max(progStart, startTime.getTime());
                          const clampedEnd = Math.min(progEnd, endTime.getTime());
                          const durationMin = Math.max(15, (clampedEnd - clampedStart) / (60 * 1000));
                          const widthPx = durationMin * MINUTE_WIDTH;

                          const now = Date.now();
                          const isNowLive = now >= progStart && now < progEnd;
                          const isSports =
                            prog.category?.toLowerCase().includes('sport') ||
                            ch.group?.toLowerCase().includes('sport');

                          return (
                            <div
                              key={prog.id || `${ch.id}_${pIdx}`}
                              onClick={() => {
                                handleChannelClick(ch);
                                setSelectedProgramModal({ program: prog, channel: ch });
                              }}
                              style={{ width: `${widthPx}px` }}
                              className={`h-14 px-3 py-1.5 mr-1.5 rounded-xl border flex flex-col justify-between transition cursor-pointer shrink-0 ${
                                isSelectedChannel && isNowLive
                                  ? 'bg-[#195F9E] border-[#42AAFF] shadow-md shadow-[#42AAFF]/20 text-white ring-1 ring-[#42AAFF]'
                                  : isNowLive
                                  ? 'bg-[#263447] border-[#42AAFF]/40 text-white hover:border-[#42AAFF]'
                                  : 'bg-[#1B2432]/90 border-[#10151F]/60 text-slate-300 hover:bg-[#263447] hover:text-white'
                              }`}
                              title={`${prog.title}\n${formatTimeInZone(prog.start, timeZone)} - ${formatTimeInZone(prog.end, timeZone)}\n${prog.description}`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs truncate leading-tight">
                                  {prog.title}
                                </span>
                                {isNowLive && isSports && (
                                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[9px] uppercase tracking-wider shrink-0 animate-pulse">
                                    LIVE
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                                <span>
                                  {formatTimeInZone(prog.start, timeZone)} -{' '}
                                  {formatTimeInZone(prog.end, timeZone)}
                                </span>
                                {recordedProgramKeys.has(`${ch.id}_${prog.start}`) && (
                                  <span className="flex items-center space-x-0.5 text-red-400 font-bold">
                                    <Disc className="w-2.5 h-2.5 animate-spin" />
                                    <span>REC</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* 5. FULL-SCREEN PLAYBACK MODAL / RESTORE STATE                 */}
      {/* ------------------------------------------------------------- */}
      {isFullscreenPreview && activeChannel && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-200">
          {/* Top Bar for Exit Fullscreen */}
          <div className="absolute top-4 right-4 z-50 flex items-center space-x-3">
            <button
              onClick={() => setIsFullscreenPreview(false)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1B2432]/90 hover:bg-[#195F9E] text-white rounded-xl font-bold text-sm shadow-2xl backdrop-blur-md border border-[#42AAFF]/50 transition"
              title="Return to TV Guide (Esc)"
            >
              <Minimize2 className="w-4 h-4 text-[#42AAFF]" />
              <span>Return to TV Guide (Esc)</span>
            </button>
          </div>

          <div className="w-full h-full">
            <Player
              channel={activeChannel}
              currentProgram={activePrograms.current}
              nextProgram={activePrograms.upcoming[0]}
              timeZone={timeZone}
              allChannels={channels}
              onSelectChannel={onSelectChannel}
              onOpenSportsBar={onOpenSportsBar}
              onClose={() => setIsFullscreenPreview(false)}
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. PROGRAM DETAILS & SCHEDULE RECORDING MODAL                 */}
      {/* ------------------------------------------------------------- */}
      {selectedProgramModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1B2432] border border-[#263447] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#42AAFF] uppercase tracking-wider">
                  Ch {selectedProgramModal.channel.channelNumber} • {selectedProgramModal.channel.name}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedProgramModal.program.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProgramModal(null)}
                className="text-[#94A3B8] hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center space-x-3 text-xs text-[#94A3B8]">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[#42AAFF]" />
                <span>
                  {formatTimeInZone(selectedProgramModal.program.start, timeZone)} -{' '}
                  {formatTimeInZone(selectedProgramModal.program.end, timeZone)}
                </span>
              </span>
              <span>•</span>
              <span>{selectedProgramModal.program.category || 'General Programming'}</span>
            </div>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              {selectedProgramModal.program.description ||
                'No detailed synopsis provided for this programme.'}
            </p>

            <div className="pt-4 border-t border-[#263447] flex items-center justify-end space-x-3">
              {onScheduleRecording && (
                <button
                  onClick={() => {
                    onScheduleRecording(
                      selectedProgramModal.program,
                      selectedProgramModal.channel
                    );
                    setSelectedProgramModal(null);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-[#263447] hover:bg-[#195F9E] text-white text-xs font-bold rounded-xl transition border border-[#42AAFF]/30"
                >
                  <Disc className="w-4 h-4 text-red-400" />
                  <span>Schedule Cloud Recording</span>
                </button>
              )}

              <button
                onClick={() => {
                  handleChannelClick(selectedProgramModal.channel);
                  setSelectedProgramModal(null);
                  setIsFullscreenPreview(true);
                }}
                className="flex items-center space-x-1.5 px-5 py-2 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white text-xs font-bold rounded-xl transition shadow-lg shadow-[#195F9E]/30"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Stream</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
