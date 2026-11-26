import { Channel, XtreamAccountInfo, XtreamCredentials } from '../types';

/**
 * Clean and normalize server URL (removes trailing slash, ensures http/https)
 */
export function normalizeServerUrl(url: string): string {
  let clean = url.trim().replace(/\/+$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'http://' + clean;
  }
  return clean;
}

/**
 * Proxy helper if provider blocks direct browser CORS
 */
export function getProxiedUrl(url: string, useProxy: boolean = false, customProxy?: string): string {
  if (!useProxy) return url;
  if (customProxy) {
    return `${customProxy}${encodeURIComponent(url)}`;
  }
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

/**
 * Authenticates with Xtream Codes server and retrieves account status
 */
export async function authenticateXtream(
  creds: XtreamCredentials,
  useProxy: boolean = false
): Promise<XtreamAccountInfo> {
  const base = normalizeServerUrl(creds.serverUrl);
  const endpoint = `${base}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
  const fetchUrl = getProxiedUrl(endpoint, useProxy);

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Xtream server responded with HTTP ${res.status}`);
  }

  const data = await res.json();
  const userInfo = data?.user_info;

  if (!userInfo || userInfo.auth === 0 || userInfo.status === 'Disabled') {
    throw new Error(userInfo?.message || 'Authentication failed: Invalid Xtream Codes username or password.');
  }

  let expFormatted: string | undefined;
  if (userInfo.exp_date && userInfo.exp_date !== 'null') {
    const expNum = parseInt(userInfo.exp_date, 10);
    if (!isNaN(expNum) && expNum > 0) {
      expFormatted = new Date(expNum * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  return {
    username: userInfo.username || creds.username,
    status: userInfo.status || 'Active',
    expDate: expFormatted || 'Unlimited / Lifetime',
    isTrial: userInfo.is_trial === '1',
    maxConnections: parseInt(userInfo.max_connections || '1', 10),
    serverUrl: base,
  };
}

/**
 * Fetches Live TV categories from Xtream Codes server
 */
export async function fetchXtreamCategories(
  creds: XtreamCredentials,
  useProxy: boolean = false
): Promise<Map<string, string>> {
  const base = normalizeServerUrl(creds.serverUrl);
  const endpoint = `${base}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&action=get_live_categories`;
  const fetchUrl = getProxiedUrl(endpoint, useProxy);

  const categoryMap = new Map<string, string>();
  try {
    const res = await fetch(fetchUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((cat: any) => {
          if (cat.category_id && cat.category_name) {
            categoryMap.set(cat.category_id.toString(), cat.category_name);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Failed to load Xtream categories, fallback to defaults', e);
  }
  return categoryMap;
}

/**
 * Fetches Live TV channels from Xtream Codes server
 */
export async function fetchXtreamLiveChannels(
  creds: XtreamCredentials,
  sourceId: string,
  sourceName: string,
  startChannelNumber: number = 100,
  useProxy: boolean = false
): Promise<Channel[]> {
  const base = normalizeServerUrl(creds.serverUrl);
  const categories = await fetchXtreamCategories(creds, useProxy);

  const endpoint = `${base}/player_api.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&action=get_live_streams`;
  const fetchUrl = getProxiedUrl(endpoint, useProxy);

  const res = await fetch(fetchUrl);
  if (!res.ok) {
    throw new Error(`Failed to load Xtream channels: HTTP ${res.status}`);
  }

  const streams = await res.json();
  if (!Array.isArray(streams)) {
    throw new Error('Unexpected Xtream streams format: Expected array of channel objects.');
  }

  const channels: Channel[] = [];
  let chNum = startChannelNumber;

  streams.forEach((item: any) => {
    const streamId = item.stream_id?.toString();
    if (!streamId) return;

    const streamUrl = `${base}/live/${encodeURIComponent(creds.username)}/${encodeURIComponent(creds.password)}/${streamId}.m3u8`;
    const categoryName = categories.get(item.category_id?.toString()) || 'General';

    channels.push({
      id: `${sourceId}_${streamId}`,
      channelNumber: item.num ? parseInt(item.num, 10) : chNum++,
      name: item.name || `Channel ${streamId}`,
      logo: item.stream_icon || undefined,
      url: streamUrl,
      group: categoryName,
      tvgId: item.epg_channel_id || item.name,
      tvgName: item.name,
      sourceId,
      sourceName,
      streamId,
    });
  });

  return channels;
}

/**
 * Generate standard Xtream M3U Plus URL
 */
export function generateXtreamM3uUrl(creds: XtreamCredentials): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `${base}/get.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}&type=m3u_plus&output=m3u8`;
}

/**
 * Generate standard Xtream XMLTV EPG URL
 */
export function generateXtreamEpgUrl(creds: XtreamCredentials): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `${base}/xmltv.php?username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
}
