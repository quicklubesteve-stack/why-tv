import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Channel,
  PlaylistSource,
  EpgProgram,
  CategoryConfig,
  RecentChannel,
  ContinueWatchingItem,
  TimeZoneSetting,
  UiThemeMode,
  XtreamAccountInfo,
  XtreamCredentials,
  PresetProvider,
} from './types';
import { StorageService } from './services/storageService';
import { parseM3U } from './utils/m3uParser';
import { parseXMLTV } from './utils/xmltvParser';
import { HeaderNav } from './components/HeaderNav';
import { Player } from './components/Player';
import { HomeView } from './components/HomeView';
import { LiveTvView } from './components/LiveTvView';
import { TiviMateView } from './components/TiviMateView';
import { SmartersHubView } from './components/SmartersHubView';
import { TvGuideView } from './components/TvGuideView';
import { MultiViewScreen } from './components/MultiViewScreen';
import { FavouritesView } from './components/FavouritesView';
import { SearchView } from './components/SearchView';
import { SettingsView } from './components/SettingsView';
import { ChannelMappingModal } from './components/ChannelMappingModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { XtreamLoginModal } from './components/XtreamLoginModal';
import { fetchXtreamLiveChannels } from './utils/xtreamClient';

export const App: React.FC = () => {
  // Global State
  const [channels, setChannels] = useState<Channel[]>(() => StorageService.getChannels());
  const [sources, setSources] = useState<PlaylistSource[]>(() => StorageService.getSources());
  const [favourites, setFavourites] = useState<string[]>(() => StorageService.getFavourites());
  const [recents, setRecents] = useState<RecentChannel[]>(() => StorageService.getRecents());
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>(() =>
    StorageService.getContinueWatching()
  );
  const [categories, setCategories] = useState<CategoryConfig[]>(() => StorageService.getCategories());
  const [epgPrograms, setEpgPrograms] = useState<EpgProgram[]>(() =>
    StorageService.getEpgPrograms(StorageService.getChannels())
  );
  const [epgMappings, setEpgMappings] = useState<Record<string, string>>(() =>
    StorageService.getEpgMappings()
  );

  // User Preferences
  const [timeZone, setTimeZone] = useState<TimeZoneSetting>(
    () => StorageService.getPreferences().timeZone || 'device'
  );
  const [uiTheme, setUiTheme] = useState<UiThemeMode>(
    () => StorageService.getPreferences().uiTheme || 'tivimate'
  );
  const [activeTab, setActiveTab] = useState<
    'home' | 'live' | 'guide' | 'multiview' | 'favourites' | 'search' | 'settings'
  >(() => StorageService.getPreferences().activeTab || 'live');
  const [corsProxyEnabled, setCorsProxyEnabled] = useState<boolean>(
    () => StorageService.getPreferences().corsProxyEnabled || false
  );

  // Xtream Account
  const [xtreamAccounts, setXtreamAccounts] = useState<any[]>(() =>
    StorageService.getXtreamAccounts()
  );
  const currentXtreamAccount: XtreamAccountInfo | undefined = xtreamAccounts[0]?.info;

  // Currently playing channel
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(() => channels[0] || null);

  // Modals
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [isXtreamModalOpen, setIsXtreamModalOpen] = useState<boolean>(false);

  // Dialing buffer for physical remote keys (0-9)
  const [dialedNumber, setDialedNumber] = useState<string>('');
  const dialTimerRef = useRef<number | null>(null);

  // Save changes to storage
  useEffect(() => {
    StorageService.saveChannels(channels);
  }, [channels]);

  useEffect(() => {
    StorageService.saveSources(sources);
  }, [sources]);

  useEffect(() => {
    StorageService.saveFavourites(favourites);
  }, [favourites]);

  useEffect(() => {
    StorageService.saveRecents(recents);
  }, [recents]);

  useEffect(() => {
    StorageService.saveContinueWatching(continueWatching);
  }, [continueWatching]);

  useEffect(() => {
    StorageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    StorageService.saveEpgPrograms(epgPrograms);
  }, [epgPrograms]);

  useEffect(() => {
    StorageService.saveEpgMappings(epgMappings);
  }, [epgMappings]);

  useEffect(() => {
    StorageService.saveXtreamAccounts(xtreamAccounts);
  }, [xtreamAccounts]);

  useEffect(() => {
    const prefs = StorageService.getPreferences();
    StorageService.savePreferences({
      ...prefs,
      timeZone,
      uiTheme,
      activeTab,
      corsProxyEnabled,
    });
  }, [timeZone, uiTheme, activeTab, corsProxyEnabled]);

  // Derived: XMLTV Channel IDs
  const xmltvChannelIds = useMemo(() => {
    const set = new Set<string>();
    epgPrograms.forEach((p) => set.add(p.channelId));
    return Array.from(set);
  }, [epgPrograms]);

  // Derived: Unmatched channels count
  const unmatchedChannels = useMemo(() => {
    return channels.filter((ch) => {
      const explicitMapping = epgMappings[ch.id];
      if (explicitMapping) return false;
      if (ch.tvgId && xmltvChannelIds.includes(ch.tvgId)) return false;
      return true;
    });
  }, [channels, epgMappings, xmltvChannelIds]);

  // Helper to get currently playing and next program for a channel
  const getProgramsForChannel = (channel: Channel | null) => {
    if (!channel) return { current: undefined, next: undefined };
    const now = Date.now();
    const mappedId = epgMappings[channel.id] || channel.tvgId || channel.id;

    const channelProgs = epgPrograms.filter((p) => p.channelId === mappedId);
    channelProgs.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    const current = channelProgs.find(
      (p) => new Date(p.start).getTime() <= now && new Date(p.end).getTime() > now
    );
    const next = channelProgs.find((p) => new Date(p.start).getTime() > now);

    return { current, next };
  };

  // Tune into channel
  const handleSelectChannel = (channel: Channel) => {
    setCurrentChannel(channel);

    const { current } = getProgramsForChannel(channel);
    const newRecent: RecentChannel = {
      channelId: channel.id,
      channelNumber: channel.channelNumber,
      name: channel.name,
      logo: channel.logo,
      group: channel.group,
      lastWatched: new Date().toISOString(),
      lastProgramTitle: current?.title || 'Live Broadcast',
    };

    setRecents((prev) => {
      const filtered = prev.filter((r) => r.channelId !== channel.id);
      return [newRecent, ...filtered].slice(0, 15);
    });

    if (current) {
      const newContinue: ContinueWatchingItem = {
        channelId: channel.id,
        channelNumber: channel.channelNumber,
        name: channel.name,
        logo: channel.logo,
        group: channel.group,
        programTitle: current.title,
        programStart: current.start,
        programEnd: current.end,
        lastWatched: new Date().toISOString(),
      };
      setContinueWatching((prev) => {
        const filtered = prev.filter((item) => item.channelId !== channel.id);
        return [newContinue, ...filtered].slice(0, 10);
      });
    }
  };

  const handleNextChannel = () => {
    if (!currentChannel || channels.length === 0) return;
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    handleSelectChannel(channels[nextIndex]);
  };

  const handlePrevChannel = () => {
    if (!currentChannel || channels.length === 0) return;
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
    handleSelectChannel(channels[prevIndex]);
  };

  const handleToggleFavourite = (channelId: string) => {
    setFavourites((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  // M3U URL / File Handlers
  const handleAddM3uUrl = async (name: string, url: string, isPrivate: boolean) => {
    const fetchUrl = corsProxyEnabled
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      : url;

    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to download playlist.`);
    const text = await res.text();
    const sourceId = `src_${Date.now()}`;
    const newChannels = parseM3U(
      text,
      sourceId,
      name,
      Math.max(...channels.map((c) => c.channelNumber), 100) + 1
    );

    if (newChannels.length === 0) {
      throw new Error('No valid channel streams found in this M3U playlist.');
    }

    const newSource: PlaylistSource = {
      id: sourceId,
      name,
      type: 'url',
      url,
      channelCount: newChannels.length,
      lastUpdated: new Date().toISOString(),
      isPrivate,
    };

    setSources((prev) => [...prev, newSource]);
    setChannels((prev) => [...prev, ...newChannels]);
  };

  const handleAddM3uFile = (name: string, content: string, isPrivate: boolean) => {
    const sourceId = `src_${Date.now()}`;
    const newChannels = parseM3U(
      content,
      sourceId,
      name,
      Math.max(...channels.map((c) => c.channelNumber), 100) + 1
    );

    const newSource: PlaylistSource = {
      id: sourceId,
      name,
      type: 'file',
      channelCount: newChannels.length,
      lastUpdated: new Date().toISOString(),
      isPrivate,
    };

    setSources((prev) => [...prev, newSource]);
    setChannels((prev) => [...prev, ...newChannels]);
  };

  const handleRefreshSource = async (sourceId: string) => {
    const source = sources.find((s) => s.id === sourceId);
    if (!source || source.type !== 'url' || !source.url) return;

    const fetchUrl = corsProxyEnabled
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(source.url)}`
      : source.url;

    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`Failed to refresh source: HTTP ${res.status}`);
    const text = await res.text();
    const freshChannels = parseM3U(text, sourceId, source.name, 100);

    setChannels((prev) => {
      const others = prev.filter((c) => c.sourceId !== sourceId);
      return [...others, ...freshChannels];
    });

    setSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? { ...s, channelCount: freshChannels.length, lastUpdated: new Date().toISOString() }
          : s
      )
    );
  };

  const handleDeleteSource = (sourceId: string) => {
    setSources((prev) => prev.filter((s) => s.id !== sourceId));
    setChannels((prev) => prev.filter((c) => c.sourceId !== sourceId));
    if (currentChannel?.sourceId === sourceId) {
      setCurrentChannel(channels[0] || null);
    }
  };

  // XMLTV Add Handlers
  const handleAddXmltvUrl = async (url: string) => {
    const fetchUrl = corsProxyEnabled
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      : url;

    const res = await fetch(fetchUrl);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to fetch XMLTV.`);
    const text = await res.text();
    const parsed = parseXMLTV(text);

    if (parsed.programs.length === 0) {
      throw new Error('No programme listings found in this XMLTV file.');
    }

    setEpgPrograms((prev) => [...parsed.programs, ...prev]);
  };

  const handleAddXmltvFile = (content: string) => {
    const parsed = parseXMLTV(content);
    if (parsed.programs.length === 0) {
      throw new Error('No programme listings found in this XMLTV file.');
    }
    setEpgPrograms((prev) => [...parsed.programs, ...prev]);
  };

  // Xtream Codes Account Handler
  const handleAddXtreamSource = async (
    account: XtreamAccountInfo,
    credentials: XtreamCredentials,
    channelsCount: number
  ) => {
    const sourceId = `xtream_${Date.now()}`;
    const newSource: PlaylistSource = {
      id: sourceId,
      name: `${account.username} (Xtream Codes)`,
      type: 'xtream',
      url: credentials.serverUrl,
      channelCount: channelsCount,
      lastUpdated: new Date().toISOString(),
      isPrivate: true,
      xtreamAccount: credentials,
    };

    setXtreamAccounts([{ info: account, credentials }]);
    setSources((prev) => [...prev, newSource]);

    // Fetch and append live channels
    const newChannels = await fetchXtreamLiveChannels(
      credentials,
      sourceId,
      `${account.username} (Xtream)`,
      Math.max(...channels.map((c) => c.channelNumber), 100) + 1,
      corsProxyEnabled
    );

    setChannels((prev) => [...prev, ...newChannels]);
    setIsXtreamModalOpen(false);
  };

  // 1-Click Curated Preset Provider Connect
  const handleConnectPreset = async (preset: PresetProvider) => {
    const sourceId = `preset_${preset.id}`;
    const existing = sources.find((s) => s.id === sourceId);
    if (existing) {
      return;
    }

    const fetchUrl = corsProxyEnabled
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(preset.m3uUrl)}`
      : preset.m3uUrl;

    try {
      const res = await fetch(fetchUrl);
      if (res.ok) {
        const text = await res.text();
        const parsed = parseM3U(
          text,
          sourceId,
          preset.name,
          Math.max(...channels.map((c) => c.channelNumber), 100) + 1
        );
        if (parsed.length > 0) {
          const newSource: PlaylistSource = {
            id: sourceId,
            name: preset.name,
            type: 'preset',
            url: preset.m3uUrl,
            channelCount: parsed.length,
            lastUpdated: new Date().toISOString(),
          };
          setSources((prev) => [...prev, newSource]);
          setChannels((prev) => [...prev, ...parsed]);
          return;
        }
      }
    } catch (e) {
      console.warn('Direct fetch failed, falling back to local dataset', e);
    }

    // Fallback: register preset
    const newSource: PlaylistSource = {
      id: sourceId,
      name: preset.name,
      type: 'preset',
      url: preset.m3uUrl,
      channelCount: 16,
      lastUpdated: new Date().toISOString(),
    };
    setSources((prev) => [...prev, newSource]);
  };

  // Factory Reset
  const handleClearAllData = () => {
    StorageService.clearAll();
    window.location.reload();
  };

  const handleSaveMapping = (channelId: string, xmltvId: string) => {
    setEpgMappings((prev) => ({
      ...prev,
      [channelId]: xmltvId,
    }));
  };

  // Global Keyboard Remote Controller
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // 1. Direct number dialing (0-9)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        const nextDialed = dialedNumber + e.key;
        setDialedNumber(nextDialed);

        if (dialTimerRef.current) clearTimeout(dialTimerRef.current);
        dialTimerRef.current = window.setTimeout(() => {
          const targetChNum = parseInt(nextDialed, 10);
          const found = channels.find((c) => c.channelNumber === targetChNum);
          if (found) {
            handleSelectChannel(found);
          }
          setDialedNumber('');
        }, 1100);
        return;
      }

      // 2. Escape or Backspace
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (isCategoryModalOpen) {
          setIsCategoryModalOpen(false);
          return;
        }
        if (isMappingModalOpen) {
          setIsMappingModalOpen(false);
          return;
        }
        if (isXtreamModalOpen) {
          setIsXtreamModalOpen(false);
          return;
        }
        if (activeTab !== 'home' && activeTab !== 'live') {
          setActiveTab('live');
          return;
        }
      }

      // 3. Arrow Keys Navigation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const focusableElements = Array.from(
          document.querySelectorAll<HTMLElement>(
            'button, [role="button"], a, input, [tabindex="0"]'
          )
        ).filter(
          (el) =>
            el.offsetParent !== null &&
            !el.hasAttribute('disabled') &&
            el.getAttribute('tabindex') !== '-1'
        );

        const currentActive = document.activeElement as HTMLElement;
        const currentIndex = focusableElements.indexOf(currentActive);

        if (currentIndex === -1) {
          focusableElements[0]?.focus();
          return;
        }

        e.preventDefault();
        let nextIndex = currentIndex;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % focusableElements.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }

        const nextEl = focusableElements[nextIndex];
        nextEl?.focus();
        nextEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    channels,
    dialedNumber,
    isCategoryModalOpen,
    isMappingModalOpen,
    isXtreamModalOpen,
    activeTab,
  ]);

  const { current: currentPlayingProgram, next: nextPlayingProgram } =
    getProgramsForChannel(currentChannel);
  const favouriteChannels = channels.filter((c) => favourites.includes(c.id));

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. Header Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uiTheme={uiTheme}
        onSetUiTheme={setUiTheme}
        timeZone={timeZone}
        currentChannelName={currentChannel?.name}
        currentChannelNumber={currentChannel?.channelNumber}
        dialedNumber={dialedNumber}
        favouritesCount={favourites.length}
        onOpenXtreamModal={() => setIsXtreamModalOpen(true)}
      />

      {/* 2. Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* HOME TAB: Chooses between Smarters Hub and Cable Box Home based on uiTheme */}
        {activeTab === 'home' && (
          <>
            {uiTheme === 'smarters' ? (
              <SmartersHubView
                channels={channels}
                continueWatching={continueWatching}
                recents={recents}
                favouritesCount={favourites.length}
                xtreamAccount={currentXtreamAccount}
                timeZone={timeZone}
                onNavigateTab={setActiveTab}
                onSelectChannel={handleSelectChannel}
                onOpenXtreamModal={() => setIsXtreamModalOpen(true)}
              />
            ) : (
              <>
                <section className="space-y-3">
                  <Player
                    channel={currentChannel}
                    currentProgram={currentPlayingProgram}
                    nextProgram={nextPlayingProgram}
                    timeZone={timeZone}
                    allChannels={channels}
                    onSelectChannel={handleSelectChannel}
                    onNextChannel={handleNextChannel}
                    onPrevChannel={handlePrevChannel}
                  />
                </section>
                <HomeView
                  continueWatching={continueWatching}
                  favourites={favouriteChannels}
                  recents={recents}
                  channels={channels}
                  epgPrograms={epgPrograms}
                  timeZone={timeZone}
                  onSelectChannel={handleSelectChannel}
                  onNavigateTab={setActiveTab}
                />
              </>
            )}
          </>
        )}

        {/* LIVE TV TAB: Chooses between TiviMate Tri-Pane and Classic Cable Box list */}
        {activeTab === 'live' && (
          <>
            {uiTheme === 'tivimate' ? (
              <TiviMateView
                channels={channels}
                selectedChannel={currentChannel}
                onSelectChannel={handleSelectChannel}
                categories={categories}
                favourites={favourites}
                onToggleFavourite={handleToggleFavourite}
                onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
                epgPrograms={epgPrograms}
                timeZone={timeZone}
                onNextChannel={handleNextChannel}
                onPrevChannel={handlePrevChannel}
              />
            ) : (
              <>
                <section className="space-y-3">
                  <Player
                    channel={currentChannel}
                    currentProgram={currentPlayingProgram}
                    nextProgram={nextPlayingProgram}
                    timeZone={timeZone}
                    allChannels={channels}
                    onSelectChannel={handleSelectChannel}
                    onNextChannel={handleNextChannel}
                    onPrevChannel={handlePrevChannel}
                  />
                </section>
                <LiveTvView
                  channels={channels}
                  selectedChannel={currentChannel}
                  onSelectChannel={handleSelectChannel}
                  categories={categories}
                  favourites={favourites}
                  onToggleFavourite={handleToggleFavourite}
                  onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
                  epgPrograms={epgPrograms}
                  timeZone={timeZone}
                />
              </>
            )}
          </>
        )}

        {/* TV GUIDE TAB (Classic 30-min Timeline EPG) */}
        {activeTab === 'guide' && (
          <TvGuideView
            channels={channels}
            epgPrograms={epgPrograms}
            timeZone={timeZone}
            onSelectChannel={handleSelectChannel}
            onOpenMappingModal={() => setIsMappingModalOpen(true)}
            unmatchedCount={unmatchedChannels.length}
          />
        )}

        {/* MULTI-VIEW SCREEN (2x2 Quad Screen / Split Screen) */}
        {activeTab === 'multiview' && (
          <MultiViewScreen
            channels={channels}
            selectedChannel={currentChannel}
            onSelectChannel={handleSelectChannel}
            timeZone={timeZone}
          />
        )}

        {/* FAVOURITES TAB */}
        {activeTab === 'favourites' && (
          <FavouritesView
            favourites={favouriteChannels}
            onSelectChannel={handleSelectChannel}
            onRemoveFavourite={handleToggleFavourite}
            epgPrograms={epgPrograms}
            timeZone={timeZone}
          />
        )}

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <SearchView
            channels={channels}
            onSelectChannel={handleSelectChannel}
            epgPrograms={epgPrograms}
            timeZone={timeZone}
          />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SettingsView
            sources={sources}
            onAddM3uUrl={handleAddM3uUrl}
            onAddM3uFile={handleAddM3uFile}
            onRefreshSource={handleRefreshSource}
            onDeleteSource={handleDeleteSource}
            onAddXmltvUrl={handleAddXmltvUrl}
            onAddXmltvFile={handleAddXmltvFile}
            onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
            onOpenMappingModal={() => setIsMappingModalOpen(true)}
            onOpenXtreamModal={() => setIsXtreamModalOpen(true)}
            timeZone={timeZone}
            onSetTimeZone={setTimeZone}
            uiTheme={uiTheme}
            onSetUiTheme={setUiTheme}
            onClearAllData={handleClearAllData}
            unmatchedCount={unmatchedChannels.length}
            xtreamAccount={currentXtreamAccount}
            onConnectPreset={handleConnectPreset}
            corsProxyEnabled={corsProxyEnabled}
            onToggleCorsProxy={() => setCorsProxyEnabled(!corsProxyEnabled)}
          />
        )}
      </main>

      {/* Modals */}
      {isCategoryModalOpen && (
        <CategoryManagerModal
          categories={categories}
          onSaveCategories={setCategories}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}

      {isMappingModalOpen && (
        <ChannelMappingModal
          channels={channels}
          xmltvChannelIds={xmltvChannelIds}
          mappings={epgMappings}
          onSaveMapping={handleSaveMapping}
          onClose={() => setIsMappingModalOpen(false)}
        />
      )}

      {isXtreamModalOpen && (
        <XtreamLoginModal
          onAddXtreamSource={handleAddXtreamSource}
          onClose={() => setIsXtreamModalOpen(false)}
        />
      )}

      {/* Cable Box Footer / Status Bar */}
      <footer className="border-t border-cable-border/60 bg-cable-950/80 py-4 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-amber-400">WHY TV v1.2</span>
          <span>•</span>
          <span>Xtream Codes & TiviMate IPTV Platform</span>
          <span className="text-[10px] bg-cable-800 px-1.5 py-0.5 rounded text-amber-300">
            UI: {uiTheme.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0 font-mono text-[11px]">
          <span>Remote: [▲ ▼ ◀ ▶] Move</span>
          <span>[Enter] Select</span>
          <span>[Esc] Back</span>
          <span>[0-9] Dial</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
