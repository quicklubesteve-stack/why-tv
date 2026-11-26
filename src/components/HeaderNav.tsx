import React, { useEffect, useState } from 'react';
import {
  Tv,
  Home,
  Star,
  Search,
  Settings,
  Calendar,
  Clock,
  Radio,
  Grid,
  Layout,
  Server,
  Trophy,
  HardDrive,
  Film,
} from 'lucide-react';
import { TimeZoneSetting, UiThemeMode } from '../types';
import { formatTimeInZone } from '../utils/dateUtils';

interface HeaderNavProps {
  activeTab: 'home' | 'live' | 'guide' | 'ondemand' | 'multiview' | 'favourites' | 'search' | 'settings';
  setActiveTab: (tab: 'home' | 'live' | 'guide' | 'ondemand' | 'multiview' | 'favourites' | 'search' | 'settings') => void;
  uiTheme: UiThemeMode;
  onSetUiTheme: (theme: UiThemeMode) => void;
  timeZone: TimeZoneSetting;
  currentChannelName?: string;
  currentChannelNumber?: number;
  dialedNumber?: string;
  favouritesCount: number;
  onOpenXtreamModal: () => void;
  onOpenSportsBar?: () => void;
  onOpenPvrModal?: () => void;
  onOpenQuickSearch?: () => void;
  activeRecordingsCount?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  uiTheme,
  onSetUiTheme,
  timeZone,
  currentChannelName,
  currentChannelNumber,
  dialedNumber,
  favouritesCount,
  onOpenXtreamModal,
  onOpenSportsBar,
  onOpenPvrModal,
  onOpenQuickSearch,
  activeRecordingsCount = 0,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      setCurrentTime(
        formatTimeInZone(new Date(), timeZone, {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  const navItems: {
    id: 'home' | 'live' | 'guide' | 'ondemand' | 'multiview' | 'favourites' | 'search' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live TV', icon: Tv },
    { id: 'guide', label: 'TV Guide', icon: Calendar },
    { id: 'ondemand', label: 'On Demand', icon: Film },
    { id: 'multiview', label: 'Multi-View', icon: Grid },
    { id: 'favourites', label: 'Favourites', icon: Star, badge: favouritesCount > 0 ? favouritesCount : undefined },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const cycleUiTheme = () => {
    const themes: UiThemeMode[] = ['tivimate', 'smarters', 'cable'];
    const next = themes[(themes.indexOf(uiTheme) + 1) % themes.length];
    onSetUiTheme(next);
  };

  const getThemeLabel = (theme: UiThemeMode) => {
    switch (theme) {
      case 'tivimate':
        return 'TiviMate UI';
      case 'smarters':
        return 'Smarters UI';
      case 'cable':
        return 'Cable Box';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e17]/95 backdrop-blur-md border-b border-cable-border/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Cable Indicator */}
        <div className="flex items-center space-x-3">
          <div
            onClick={() => setActiveTab('home')}
            role="button"
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-3 py-1.5 rounded-lg font-black tracking-wider shadow-md cursor-pointer hover:scale-105 transition"
          >
            <Radio className="w-5 h-5 animate-pulse text-neutral-950" />
            <span className="text-lg font-black uppercase tracking-widest">WHY TV</span>
          </div>

          {/* Current Tuned OSD Pill */}
          {currentChannelNumber && (
            <div className="hidden lg:flex items-center space-x-2 bg-cable-800/90 border border-cable-border px-3 py-1 rounded text-xs text-amber-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CH {currentChannelNumber}</span>
              <span className="text-slate-400 truncate max-w-[130px]">{currentChannelName}</span>
            </div>
          )}

          {/* Dialing OSD indicator */}
          {dialedNumber && (
            <div className="bg-amber-400 text-black font-mono font-bold px-3 py-1 rounded animate-bounce shadow-cable-focus">
              TUNING: CH {dialedNumber}...
            </div>
          )}
        </div>

        {/* Cable Menu Items */}
        <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap cable-focus-ring ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-cable-focus ring-2 ring-amber-300'
                    : 'text-slate-300 hover:text-white hover:bg-cable-800/80'
                }`}
                aria-current={isActive ? 'page' : undefined}
                data-nav-id={item.id}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                      isActive ? 'bg-black text-amber-300' : 'bg-cable-700 text-amber-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: UI Theme Switcher, Sports Bar & Xtream / Clock */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Quick Search Spotlight Trigger */}
          {onOpenQuickSearch && (
            <button
              onClick={onOpenQuickSearch}
              className="flex items-center space-x-1.5 bg-cable-850 hover:bg-cable-800 border border-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white shadow cable-focus-ring"
              title="Search live football, games & channels (Key: /)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Search</span>
              <span className="hidden lg:inline text-[9px] bg-neutral-900 px-1 py-0.2 rounded text-slate-400 border border-neutral-700">/</span>
            </button>
          )}

          {/* Sports Companion Bar Trigger */}
          {onOpenSportsBar && (
            <button
              onClick={onOpenSportsBar}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-red-950/80 to-amber-950/80 hover:from-red-900 hover:to-amber-900 border border-amber-500/50 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-300 shadow cable-focus-ring"
              title="Rogers Xfinity & Sportsnet+ Live Scores Companion Bar (Key: S)"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Sports</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </button>
          )}

          {/* Cloud PVR Trigger */}
          {onOpenPvrModal && (
            <button
              onClick={onOpenPvrModal}
              className="flex items-center space-x-1.5 bg-cable-850 hover:bg-cable-800 border border-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-300 hover:text-white shadow cable-focus-ring"
              title="Bell Fibe / Rogers Cloud PVR Recordings"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">PVR</span>
              {activeRecordingsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          )}

          {/* UI Layout Switcher Button */}
          <button
            onClick={cycleUiTheme}
            className="flex items-center space-x-1.5 bg-cable-850 hover:bg-cable-800 border border-amber-400/50 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-amber-300 hover:text-amber-200 shadow cable-focus-ring"
            title="Switch UI Style (TiviMate Tri-Pane / Smarters Hub / Cable Grid)"
          >
            <Layout className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{getThemeLabel(uiTheme)}</span>
          </button>

          {/* Xtream Login Quick Button */}
          <button
            onClick={onOpenXtreamModal}
            className="hidden md:flex items-center space-x-1 bg-cable-900 hover:bg-cable-800 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-cable-border text-xs cable-focus-ring"
            title="Xtream Codes Login"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Xtream</span>
          </button>

          {/* LED Clock */}
          <div className="hidden lg:flex items-center space-x-2 bg-cable-950 border border-cable-border/70 px-3 py-1.5 rounded-lg font-mono text-amber-400 text-xs shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-bold tracking-widest">{currentTime}</span>
            <span className="text-[9px] uppercase text-slate-400 bg-cable-800 px-1 py-0.2 rounded">
              {timeZone === 'America/Toronto' ? 'TOR' : 'LOC'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
