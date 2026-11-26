import {
  Channel,
  PlaylistSource,
  EpgProgram,
  EpgSource,
  CategoryConfig,
  RecentChannel,
  ContinueWatchingItem,
  UserPreferences,
} from '../types';
import {
  DEMO_CHANNELS,
  DEMO_PLAYLIST_SOURCE,
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
        if (parsed.length > 0) return parsed;
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
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load EPG programs', e);
    }
    // Return generated dynamic programs
    return generateDynamicDemoEpg(channels);
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
   * Factory Reset / Clear Saved Data
   */
  static clearAll(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  }
}
