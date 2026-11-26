import { ProviderConnection, Channel, ProviderCategory } from '../types';
import { INITIAL_PROVIDERS, PROVIDER_CHANNELS } from '../data/providerData';

const PROVIDER_STORAGE_KEY = 'whytv_providers_v1';

/**
 * Load persisted provider connections, merging default catalog
 */
export function getStoredProviders(): ProviderConnection[] {
  try {
    const raw = localStorage.getItem(PROVIDER_STORAGE_KEY);
    if (raw) {
      const parsed: ProviderConnection[] = JSON.parse(raw);
      if (parsed.length > 0) {
        // Ensure any newly added catalog providers appear
        const existingIds = new Set(parsed.map((p) => p.id));
        const missing = INITIAL_PROVIDERS.filter((p) => !existingIds.has(p.id));
        if (missing.length > 0) {
          const combined = [...parsed, ...missing];
          saveStoredProviders(combined);
          return combined;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load stored providers', e);
  }
  return INITIAL_PROVIDERS;
}

/**
 * Save provider connections to local storage
 */
export function saveStoredProviders(providers: ProviderConnection[]): void {
  try {
    localStorage.setItem(PROVIDER_STORAGE_KEY, JSON.stringify(providers));
  } catch (e) {
    console.error('Failed to save providers', e);
  }
}

/**
 * Import a provider's channel roster into existing channels
 */
export function importProviderChannels(
  providerId: string,
  existingChannels: Channel[],
  customOffset?: number
): { updatedChannels: Channel[]; importedCount: number } {
  const providerChannels = PROVIDER_CHANNELS.filter((c) => c.providerId === providerId);

  // Filter out any existing channels from this same provider first to avoid duplicates
  const cleanedChannels = existingChannels.filter((c) => c.providerId !== providerId);

  // Apply custom offset if specified
  const offset = customOffset ?? (providerChannels[0]?.channelNumber ? 0 : 100);
  const adjusted = providerChannels.map((ch, idx) => ({
    ...ch,
    channelNumber: offset > 0 && ch.channelNumber < offset ? offset + idx : ch.channelNumber,
  }));

  const merged = [...cleanedChannels, ...adjusted];
  merged.sort((a, b) => a.channelNumber - b.channelNumber);

  return {
    updatedChannels: merged,
    importedCount: adjusted.length,
  };
}

/**
 * Disconnect a provider and remove its channels from the active roster
 */
export function disconnectProviderChannels(
  providerId: string,
  existingChannels: Channel[]
): Channel[] {
  return existingChannels.filter((c) => c.providerId !== providerId);
}

/**
 * Filter provider list by category and search query
 */
export function filterProviders(
  providers: ProviderConnection[],
  category: ProviderCategory | 'ALL' = 'ALL',
  query: string = ''
): ProviderConnection[] {
  const q = query.trim().toLowerCase();

  return providers.filter((p) => {
    // Category check
    if (category !== 'ALL' && p.category !== category) {
      return false;
    }

    // Search query check
    if (q) {
      const matchName = p.name.toLowerCase().includes(q);
      const matchBadge = p.badge.toLowerCase().includes(q);
      const matchServer = p.originServer.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchModel = p.licensedModel.toLowerCase().includes(q);
      return matchName || matchBadge || matchServer || matchDesc || matchModel;
    }

    return true;
  });
}

/**
 * Resolves channel number conflicts across multi-provider rosters
 */
export function resolveChannelNumberConflicts(channels: Channel[]): Channel[] {
  const usedNumbers = new Set<number>();
  return channels.map((ch) => {
    let num = ch.channelNumber;
    while (usedNumbers.has(num)) {
      num += 1;
    }
    usedNumbers.add(num);
    return {
      ...ch,
      channelNumber: num,
    };
  });
}

/**
 * Calculate aggregate statistics across all providers
 */
export function calculateProviderMetrics(providers: ProviderConnection[]) {
  const connected = providers.filter((p) => p.status === 'connected');
  const totalChannels = connected.reduce((acc, p) => acc + p.channelCount, 0);
  const fastSyndicators = providers.filter((p) => p.category === 'FAST_SYNDICATOR').length;
  const licensedBdus = providers.filter((p) => p.category === 'LICENSED_BDU').length;
  const sportsD2c = providers.filter((p) => p.category === 'SPORTS_D2C').length;
  const middleware = providers.filter((p) => p.category === 'XTREAM_MIDDLEWARE').length;

  return {
    totalProviders: providers.length,
    connectedCount: connected.length,
    totalChannels,
    fastSyndicators,
    licensedBdus,
    sportsD2c,
    middleware,
  };
}
