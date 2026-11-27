import {
  Channel,
  PlaylistSource,
  EpgProgram,
  EpgSource,
  CategoryConfig,
  RecentChannel,
  ContinueWatchingItem,
  UserPreferences,
  PvrRecording,
  ParentalControlsConfig,
} from '../types';
import {
  DEMO_CHANNELS,
  DEMO_PLAYLIST_SOURCE,
  DEMO_SOURCE_ID,
  generateDynamicDemoEpg,
} from '../data/demoData';

const KEYS = {
  SOURCES: 'whytv_sources_v1',
  CHANNELS: 'whytv_channels_v1',
  FAVOURITES: 'whytv_favourites_v1',
  RECENTS: 'whytv_recents_v1',
  CONTINUE: 'whytv_continue_v1',
  CATEGORIES: 'whytv_categories_v1',
  EPG_SOURCES: 'whytv_epg_sources_v1',
  EPG_PROGRAMS: 'whytv_epg_programs_v1',
  EPG_MAPPINGS: 'whytv_epg_mappings_v1', // Record<channelId, xmltvId>
  PREFERENCES: 'whytv_preferences_v1',
  XTREAM_ACCOUNTS: 'whytv_xtream_accounts_v1',
  MULTIVIEW: 'whytv_multiview_v1',
  RECORDINGS: 'whytv_recordings_v1',
  PARENTAL: 'whytv_parental_v1',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  timeZone: 'device',
  uiTheme: 'tivimate',
  volume: 0.85,
  isMuted: false,
  activeTab: 'home',
  selectedCategory: 'All',
  hasWarnedSharedDevice: false,
  corsProxyEnabled: false,
};

export class StorageService {
  /**
   * Load sources or initialize with demo source
   */
  static getSources(): PlaylistSource[] {
    try {
      const data = localStorage.getItem(KEYS.SOURCES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load sources from localStorage', e);
    }
    return [DEMO_PLAYLIST_SOURCE];
  }

  static saveSources(sources: PlaylistSource[]): void {
    localStorage.setItem(KEYS.SOURCES, JSON.stringify(sources));
  }

  /**
   * Load all channels or initialize with demo channels
   */
  static getChannels(): Channel[] {
    try {
      const data = localStorage.getItem(KEYS.CHANNELS);
      if (data) {
        const parsed: Channel[] = JSON.parse(data);
        if (parsed.length > 0) {
          // Upgrade demo channels whose stream URLs were old cartoon test streams (test_001) or need canonical update
          const canonicalMap = new Map(DEMO_CHANNELS.map((c) => [c.channelNumber, c]));
          const upgraded = parsed.map((c) => {
            const canonical = canonicalMap.get(c.channelNumber);
            if (canonical && (c.url.includes('test_001') || c.sourceId === DEMO_SOURCE_ID || c.channelNumber === 108 || c.channelNumber === 126 || c.channelNumber === 124)) {
              return {
                ...c,
                url: canonical.url,
                name: canonical.name,
                logo: canonical.logo,
                group: canonical.group,
                tvgId: canonical.tvgId,
                tvgName: canonical.tvgName,
                sourceName: canonical.sourceName,
              };
            }
            return c;
          });

          // Merge any demo channels that aren't present yet so expanded channels (Phase 5) automatically appear
          const existingIds = new Set(upgraded.map((c) => c.id));
          const missingDemoChannels = DEMO_CHANNELS.filter((c) => !existingIds.has(c.id));
          const finalChannels = missingDemoChannels.length > 0 ? [...upgraded, ...missingDemoChannels] : upgraded;

          this.saveChannels(finalChannels);
          return finalChannels;
        }
      }
    } catch (e) {
      console.error('Failed to load channels from localStorage', e);
    }
    return DEMO_CHANNELS;
  }

  static saveChannels(channels: Channel[]): void {
    localStorage.setItem(KEYS.CHANNELS, JSON.stringify(channels));
  }

  /**
   * Favourites (array of channel IDs)
   */
  static getFavourites(): string[] {
    try {
      const data = localStorage.getItem(KEYS.FAVOURITES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load favourites', e);
    }
    // Default demo favourites
    return [
      DEMO_CHANNELS[0].id,
      DEMO_CHANNELS[2].id,
      DEMO_CHANNELS[4].id,
    ];
  }

  static saveFavourites(favourites: string[]): void {
    localStorage.setItem(KEYS.FAVOURITES, JSON.stringify(favourites));
  }

  /**
   * Recent Channels
   */
  static getRecents(): RecentChannel[] {
    try {
      const data = localStorage.getItem(KEYS.RECENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load recents', e);
    }
    // Default initial recents for immediate testing
    return [
      {
        channelId: DEMO_CHANNELS[0].id,
        channelNumber: DEMO_CHANNELS[0].channelNumber,
        name: DEMO_CHANNELS[0].name,
        logo: DEMO_CHANNELS[0].logo,
        group: DEMO_CHANNELS[0].group,
        lastWatched: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        lastProgramTitle: 'Global News Hour Live',
      },
      {
        channelId: DEMO_CHANNELS[3].id,
        channelNumber: DEMO_CHANNELS[3].channelNumber,
        name: DEMO_CHANNELS[3].name,
        logo: DEMO_CHANNELS[3].logo,
        group: DEMO_CHANNELS[3].group,
        lastWatched: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        lastProgramTitle: 'Mountain Bike World Cup Highlights',
      },
      {
        channelId: DEMO_CHANNELS[2].id,
        channelNumber: DEMO_CHANNELS[2].channelNumber,
        name: DEMO_CHANNELS[2].name,
        logo: DEMO_CHANNELS[2].logo,
        group: DEMO_CHANNELS[2].group,
        lastWatched: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        lastProgramTitle: 'NASA Space Station Live Link',
      },
    ];
  }

  static saveRecents(recents: RecentChannel[]): void {
    localStorage.setItem(KEYS.RECENTS, JSON.stringify(recents.slice(0, 15)));
  }

  /**
   * Continue Watching
   */
  static getContinueWatching(): ContinueWatchingItem[] {
    try {
      const data = localStorage.getItem(KEYS.CONTINUE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load continue watching', e);
    }
    return [
      {
        channelId: DEMO_CHANNELS[4].id,
        channelNumber: DEMO_CHANNELS[4].channelNumber,
        name: DEMO_CHANNELS[4].name,
        logo: DEMO_CHANNELS[4].logo,
        group: DEMO_CHANNELS[4].group,
        programTitle: 'Tears of Steel: Directors Cut',
        programStart: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        programEnd: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
        lastWatched: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        channelId: DEMO_CHANNELS[1].id,
        channelNumber: DEMO_CHANNELS[1].channelNumber,
        name: DEMO_CHANNELS[1].name,
        logo: DEMO_CHANNELS[1].logo,
        group: DEMO_CHANNELS[1].group,
        programTitle: 'Prime Business & Financial Markets',
        programStart: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        programEnd: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        lastWatched: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      }
    ];
  }

  static saveContinueWatching(items: ContinueWatchingItem[]): void {
    localStorage.setItem(KEYS.CONTINUE, JSON.stringify(items.slice(0, 10)));
  }

  /**
   * Category configurations (renaming, hiding)
   */
  static getCategories(): CategoryConfig[] {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return [
      { originalName: 'Local', displayName: 'Local & Regional', hidden: false },
      { originalName: 'Sports', displayName: 'Sports 24/7', hidden: false },
      { originalName: 'News', displayName: 'Breaking News', hidden: false },
      { originalName: 'Movies', displayName: 'Movies & Cinema', hidden: false },
      { originalName: 'Kids', displayName: 'Kids & Family', hidden: false },
      { originalName: 'International', displayName: 'International', hidden: false },
    ];
  }

  static saveCategories(categories: CategoryConfig[]): void {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  }

  /**
   * EPG Programs
   */
  static getEpgPrograms(channels: Channel[]): EpgProgram[] {
    try {
      const data = localStorage.getItem(KEYS.EPG_PROGRAMS);
      if (data) {
        const parsed: EpgProgram[] = JSON.parse(data);
        if (parsed && parsed.length > 0) {
          const nowMs = Date.now();
          // Count active channels with programs running right now
          const activeChannelIds = new Set(
            parsed
              .filter((p) => new Date(p.start).getTime() <= nowMs && new Date(p.end).getTime() > nowMs)
              .map((p) => p.channelId)
          );

          // Check if football is represented and ensure no outdated Prime Sports / Chiefs on Ch 108
          const hasStaleCh108 = parsed.some(
            (p) => (p.channelId.includes('108') && p.title.toLowerCase().includes('chiefs')) || p.channelId.includes('Prime.Sports.Arena')
          );
          const coversFootball = parsed.some(
            (p) =>
              p.title.toLowerCase().includes('clemson') ||
              p.title.toLowerCase().includes('football') ||
              p.title.toLowerCase().includes('ncaa') ||
              p.title.toLowerCase().includes('nfl')
          );

          // If at least 70% of channels have currently active programs, football is covered, and no stale 108, keep cache
          if (!hasStaleCh108 && activeChannelIds.size >= Math.min(channels.length * 0.7, 10) && coversFootball) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load EPG programs', e);
    }
    // Return freshly generated dynamic programs with aligned live shows and persist
    const fresh = generateDynamicDemoEpg(channels);
    this.saveEpgPrograms(fresh);
    return fresh;
  }

  static saveEpgPrograms(programs: EpgProgram[]): void {
    // Keep reasonable chunk in localStorage (at most 2500 entries)
    localStorage.setItem(KEYS.EPG_PROGRAMS, JSON.stringify(programs.slice(0, 2500)));
  }

  /**
   * EPG Manual Channel Mappings (channelId -> xmltvChannelId)
   */
  static getEpgMappings(): Record<string, string> {
    try {
      const data = localStorage.getItem(KEYS.EPG_MAPPINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load EPG mappings', e);
    }
    return {};
  }

  static saveEpgMappings(mappings: Record<string, string>): void {
    localStorage.setItem(KEYS.EPG_MAPPINGS, JSON.stringify(mappings));
  }

  /**
   * User Preferences
   */
  static getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(KEYS.PREFERENCES);
      if (data) return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch (e) {
      console.error('Failed to load preferences', e);
    }
    return DEFAULT_PREFERENCES;
  }

  static savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(preferences));
  }

  /**
   * Xtream Accounts
   */
  static getXtreamAccounts(): any[] {
    try {
      const data = localStorage.getItem(KEYS.XTREAM_ACCOUNTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load Xtream accounts', e);
    }
    return [];
  }

  static saveXtreamAccounts(accounts: any[]): void {
    localStorage.setItem(KEYS.XTREAM_ACCOUNTS, JSON.stringify(accounts));
  }

  /**
   * Multi-View Channel IDs
   */
  static getMultiViewIds(): string[] {
    try {
      const data = localStorage.getItem(KEYS.MULTIVIEW);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load multiview channels', e);
    }
    return [DEMO_CHANNELS[0].id, DEMO_CHANNELS[1].id, DEMO_CHANNELS[2].id, DEMO_CHANNELS[3].id];
  }

  static saveMultiViewIds(ids: string[]): void {
    localStorage.setItem(KEYS.MULTIVIEW, JSON.stringify(ids.slice(0, 4)));
  }

  /**
   * Cloud PVR Recordings
   */
  static getRecordings(): PvrRecording[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load recordings', e);
    }
    // Return sample demo recordings so user has instant data
    const now = Date.now();
    return [
      {
        id: 'rec_demo_1',
        channelId: DEMO_CHANNELS[0].id,
        channelNumber: DEMO_CHANNELS[0].channelNumber,
        channelName: DEMO_CHANNELS[0].name,
        channelLogo: DEMO_CHANNELS[0].logo,
        programTitle: 'Global News Hour: Evening Edition',
        programDescription: 'Comprehensive live coverage of international and national headlines.',
        startTime: new Date(now - 3 * 3600 * 1000).toISOString(),
        endTime: new Date(now - 2 * 3600 * 1000).toISOString(),
        durationMinutes: 60,
        status: 'completed',
        sizeMb: 1450,
        createdAt: new Date(now - 3 * 3600 * 1000).toISOString(),
      },
      {
        id: 'rec_demo_2',
        channelId: DEMO_CHANNELS[2].id,
        channelNumber: DEMO_CHANNELS[2].channelNumber,
        channelName: DEMO_CHANNELS[2].name,
        channelLogo: DEMO_CHANNELS[2].logo,
        programTitle: 'NHL Prime Time: Leafs vs Canadiens',
        programDescription: 'Saturday night hockey showdown live from Scotiabank Arena.',
        startTime: new Date(now - 90 * 60 * 1000).toISOString(),
        endTime: new Date(now + 60 * 60 * 1000).toISOString(),
        durationMinutes: 150,
        status: 'recording',
        sizeMb: 3600,
        createdAt: new Date(now - 90 * 60 * 1000).toISOString(),
      },
      {
        id: 'rec_demo_3',
        channelId: DEMO_CHANNELS[1].id,
        channelNumber: DEMO_CHANNELS[1].channelNumber,
        channelName: DEMO_CHANNELS[1].name,
        channelLogo: DEMO_CHANNELS[1].logo,
        programTitle: 'Night at the Cinema: Sci-Fi Premiere',
        programDescription: 'Critically acclaimed modern science fiction thriller feature.',
        startTime: new Date(now + 4 * 3600 * 1000).toISOString(),
        endTime: new Date(now + 6 * 3600 * 1000).toISOString(),
        durationMinutes: 120,
        status: 'scheduled',
        sizeMb: 2900,
        createdAt: new Date(now).toISOString(),
      },
    ];
  }

  static saveRecordings(recordings: PvrRecording[]): void {
    localStorage.setItem(KEYS.RECORDINGS, JSON.stringify(recordings));
  }

  static addRecording(recording: PvrRecording): PvrRecording[] {
    const list = this.getRecordings();
    // Prevent duplicate recording of identical program and start time
    const exists = list.some(
      (r) => r.channelId === recording.channelId && r.startTime === recording.startTime
    );
    if (!exists) {
      const updated = [recording, ...list];
      this.saveRecordings(updated);
      return updated;
    }
    return list;
  }

  static deleteRecording(id: string): PvrRecording[] {
    const list = this.getRecordings();
    const updated = list.filter((r) => r.id !== id);
    this.saveRecordings(updated);
    return updated;
  }

  /**
   * Parental Controls & Channel PIN Lock
   */
  static getParentalControls(): ParentalControlsConfig {
    try {
      const data = localStorage.getItem(KEYS.PARENTAL);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load parental controls', e);
    }
    return {
      enabled: false,
      pin: '0000',
      lockedChannelIds: [],
      lockedCategories: ['Adult', 'Late Night'],
    };
  }

  static saveParentalControls(config: ParentalControlsConfig): void {
    localStorage.setItem(KEYS.PARENTAL, JSON.stringify(config));
  }

  /**
   * Factory Reset / Clear Saved Data
   */
  static clearAll(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
