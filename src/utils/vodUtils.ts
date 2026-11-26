import { VodItem, VodEpisode, VodPlaybackProgress, SoundMode, SoundModeProfile } from '../types';
import { INITIAL_VOD_CATALOG } from '../data/vodData';

const VOD_PROGRESS_KEY = 'whytv_vod_progress_v1';

/**
 * Sound mode presets (EQ gain settings for Web Audio API or audio profiles)
 */
export const SOUND_MODE_PROFILES: SoundModeProfile[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Balanced studio mix for general TV viewing',
    bassGain: 0,
    midGain: 0,
    trebleGain: 0,
  },
  {
    id: 'stadium',
    label: 'Stadium Mode',
    description: 'Boosted deep bass & ambient crowd acoustics for live sports',
    bassGain: 6.5,
    midGain: -1.0,
    trebleGain: 3.0,
  },
  {
    id: 'dialogue',
    label: 'Clear Commentary',
    description: 'Amplified vocal clarity (1kHz - 3kHz) to clearly hear announcers',
    bassGain: -3.0,
    midGain: 7.0,
    trebleGain: 2.5,
  },
  {
    id: 'cinema',
    label: 'Cinema Boost',
    description: 'Wide dynamic range with punchy low-end and crystal highs',
    bassGain: 5.0,
    midGain: 1.5,
    trebleGain: 4.5,
  },
];

/**
 * Filter VOD catalog items by category, type (movie/series), or search query
 */
export function filterVodCatalog(
  items: VodItem[] = INITIAL_VOD_CATALOG,
  selectedCategory: string = 'All',
  typeFilter: 'all' | 'movie' | 'series' = 'all',
  searchQuery: string = ''
): VodItem[] {
  const trimmed = searchQuery.trim().toLowerCase();

  return items.filter((item) => {
    // Type Filter
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;

    // Category Filter
    if (selectedCategory === 'Featured' && !item.featured) return false;
    if (selectedCategory === 'Movies' && item.type !== 'movie') return false;
    if (selectedCategory === 'TV Series' && item.type !== 'series') return false;
    if (
      selectedCategory !== 'All' &&
      selectedCategory !== 'Featured' &&
      selectedCategory !== 'Movies' &&
      selectedCategory !== 'TV Series' &&
      item.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }

    // Search Query
    if (trimmed) {
      const matchTitle = item.title.toLowerCase().includes(trimmed);
      const matchDesc = item.description.toLowerCase().includes(trimmed);
      const matchCast = (item.cast || []).some((actor) => actor.toLowerCase().includes(trimmed));
      const matchDirector = (item.director || '').toLowerCase().includes(trimmed);
      const matchCategory = item.category.toLowerCase().includes(trimmed);
      if (!matchTitle && !matchDesc && !matchCast && !matchDirector && !matchCategory) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Resolves the next episode for a TV series binge session
 */
export function getNextEpisode(series: VodItem, currentEpisodeId: string): VodEpisode | null {
  if (series.type !== 'series' || !series.episodes || series.episodes.length === 0) {
    return null;
  }

  const sorted = [...series.episodes].sort((a, b) => {
    if (a.seasonNumber !== b.seasonNumber) return a.seasonNumber - b.seasonNumber;
    return a.episodeNumber - b.episodeNumber;
  });

  const currentIndex = sorted.findIndex((ep) => ep.id === currentEpisodeId);
  if (currentIndex === -1 || currentIndex >= sorted.length - 1) {
    return null;
  }

  return sorted[currentIndex + 1];
}

/**
 * Calculates playback progress object
 */
export function calculateVodProgress(
  vodId: string,
  positionSec: number,
  durationSec: number,
  episodeId?: string
): VodPlaybackProgress {
  const safeDuration = durationSec > 0 ? durationSec : 1;
  const percent = Math.min(100, Math.round((positionSec / safeDuration) * 100));
  const completed = percent >= 92; // Considered completed when >= 92% watched

  return {
    vodId,
    episodeId,
    positionSec: Math.floor(positionSec),
    durationSec: Math.floor(durationSec),
    percent,
    lastWatchedIso: new Date().toISOString(),
    completed,
  };
}

/**
 * Get all saved playback progress items from localStorage
 */
export function getAllVodProgress(): Record<string, VodPlaybackProgress> {
  try {
    const raw = localStorage.getItem(VOD_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load VOD progress', e);
  }
  return {};
}

/**
 * Save playback position for a movie or episode
 */
export function saveVodProgress(progress: VodPlaybackProgress): void {
  try {
    const all = getAllVodProgress();
    const key = progress.episodeId ? `${progress.vodId}_${progress.episodeId}` : progress.vodId;
    all[key] = progress;
    localStorage.setItem(VOD_PROGRESS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save VOD progress', e);
  }
}

/**
 * Get saved progress for a specific movie or episode
 */
export function getVodProgressForItem(vodId: string, episodeId?: string): VodPlaybackProgress | null {
  const all = getAllVodProgress();
  const key = episodeId ? `${vodId}_${episodeId}` : vodId;
  return all[key] || null;
}

/**
 * Formats duration in minutes into e.g. "1h 48m" or "48m"
 */
export function formatVodDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return 'Duration N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}
