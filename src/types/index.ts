export interface Channel {
  id: string; // Unique internal ID (e.g. sourceId_channelNumber_tvgId)
  channelNumber: number;
  name: string;
  logo?: string;
  url: string;
  group: string; // Category (e.g. News, Sports, Movies, etc.)
  tvgId?: string;
  tvgName?: string;
  sourceId: string;
  sourceName: string;
  streamId?: string; // Xtream Codes stream ID if applicable
  catchupDays?: number; // Days of catch-up available (e.g. 7 days like Bell Fibe / VMedia)
  catchupType?: 'shift' | 'flussonic' | 'xc' | 'append';
}

export interface PlaylistSource {
  id: string;
  name: string;
  type: 'url' | 'file' | 'demo' | 'xtream' | 'preset';
  url?: string;
  content?: string; // Stored file content if imported via file
  channelCount: number;
  lastUpdated: string;
  isPrivate?: boolean;
  xtreamAccount?: XtreamCredentials;
}

export interface XtreamCredentials {
  serverUrl: string;
  username: string;
  password: string;
}

export interface XtreamAccountInfo {
  username: string;
  status: string;
  expDate?: string;
  isTrial?: boolean;
  maxConnections?: number;
  serverUrl?: string;
  activeChannelsCount?: number;
}

export interface PresetProvider {
  id: string;
  name: string;
  providerType: 'FAST' | 'Public Index' | 'Network';
  badge: string;
  description: string;
  channelCount: number;
  categories: string[];
  m3uUrl: string;
  epgUrl?: string;
  icon?: string;
}

export interface EpgProgram {
  id: string;
  channelId: string; // Matched channel tvg-id or channel id
  title: string;
  description?: string;
  start: string; // ISO 8601 string
  end: string;   // ISO 8601 string
  category?: string;
  icon?: string;
}

export interface EpgSource {
  id: string;
  name: string;
  type: 'url' | 'file' | 'demo';
  url?: string;
  programCount: number;
  lastUpdated: string;
}

export interface CategoryConfig {
  originalName: string;
  displayName: string;
  hidden: boolean;
  order?: number;
}

export interface RecentChannel {
  channelId: string;
  channelNumber: number;
  name: string;
  logo?: string;
  group: string;
  lastWatched: string; // ISO timestamp
  lastProgramTitle?: string;
}

export interface ContinueWatchingItem {
  channelId: string;
  channelNumber: number;
  name: string;
  logo?: string;
  group: string;
  programTitle: string;
  programStart: string;
  programEnd: string;
  lastWatched: string;
}

export type TimeZoneSetting = 'device' | 'America/Toronto';
export type UiThemeMode = 'tivimate' | 'smarters' | 'cable';
export type MultiViewLayout = '1' | '2-split' | '4-grid';

export interface UserPreferences {
  timeZone: TimeZoneSetting;
  uiTheme: UiThemeMode;
  volume: number;
  isMuted: boolean;
  activeTab: 'home' | 'live' | 'guide' | 'multiview' | 'favourites' | 'search' | 'settings';
  selectedCategory: string;
  hasWarnedSharedDevice?: boolean;
  corsProxyEnabled?: boolean;
  customCorsProxyUrl?: string;
}

export interface PlaybackState {
  currentChannel: Channel | null;
  isPlaying: boolean;
  isBuffering: boolean;
  error: {
    type: 'cors' | 'offline' | 'codec' | 'generic' | null;
    message: string;
    details?: string;
  } | null;
  isFullscreen: boolean;
  volume: number;
  isMuted: boolean;
}

export interface StreamDiagnostics {
  resolution: string;
  bitrateKbps: number;
  fps: number;
  bufferLengthSec: number;
  videoCodec: string;
  audioCodec: string;
  droppedFrames: number;
  latencySec?: number;
  levelIndex?: number;
}

export interface CatchupCalculation {
  canRestart: boolean;
  elapsedSec: number;
  totalSec: number;
  progressPercent: number;
  startTimeIso: string;
  restartUrl?: string;
}

export type SportLeague = 'NHL' | 'NBA' | 'SOCCER' | 'MLB' | 'NFL' | 'MOTORSPORT';

export interface SportsTeam {
  name: string;
  abbreviation: string;
  score: number;
  logo?: string;
  record?: string;
}

export interface SportsGame {
  id: string;
  league: SportLeague;
  homeTeam: SportsTeam;
  awayTeam: SportsTeam;
  status: 'live' | 'upcoming' | 'final';
  periodOrTime: string;
  statsSnippet?: string;
  broadcaster?: string;
  channelNumber?: number;
  channelId?: string;
  startTime?: string;
}
