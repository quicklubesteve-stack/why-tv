import { CatchupCalculation } from '../types';

/**
 * Calculates timeshift progress, elapsed time, and restart feasibility for a live broadcast
 */
export function calculateProgramTimeshift(
  startIso: string,
  endIso: string,
  nowMs: number = Date.now()
): CatchupCalculation {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (isNaN(start) || isNaN(end) || end <= start) {
    return {
      canRestart: false,
      elapsedSec: 0,
      totalSec: 0,
      progressPercent: 0,
      startTimeIso: startIso,
    };
  }

  const totalSec = Math.max(1, Math.round((end - start) / 1000));
  const elapsedSec = Math.max(0, Math.min(totalSec, Math.round((nowMs - start) / 1000)));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSec / totalSec) * 100)));

  // Can restart if show has been running for at least 15 seconds and hasn't ended
  const canRestart = elapsedSec >= 15 && nowMs < end;

  return {
    canRestart,
    elapsedSec,
    totalSec,
    progressPercent,
    startTimeIso: startIso,
  };
}

/**
 * Formats seconds into human-readable MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const sec = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSec = sec % 60;

  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }
  return `${minutes}m ${remainingSec.toString().padStart(2, '0')}s`;
}

/**
 * Generates an Xtream Codes or generic timeshift catchup stream URL
 */
export function generateTimeshiftUrl(
  channelUrl: string,
  startIso: string,
  durationSec: number,
  catchupType: 'xc' | 'flussonic' | 'shift' | 'append' = 'xc'
): string {
  try {
    const url = new URL(channelUrl);
    const startDate = new Date(startIso);

    // Xtream Codes timeshift format: /timeshift.php?username=...&password=...&duration=...&start=YYYY-MM-DD:HH-MM
    if (catchupType === 'xc' && (channelUrl.includes('/live/') || channelUrl.includes('get.php'))) {
      const parts = url.pathname.split('/');
      // Expected path: /live/username/password/streamId.m3u8
      if (parts.length >= 5) {
        const username = parts[2];
        const password = parts[3];
        const streamId = parts[4].replace(/\.[^/.]+$/, '');

        const year = startDate.getUTCFullYear();
        const month = (startDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = startDate.getUTCDate().toString().padStart(2, '0');
        const hour = startDate.getUTCHours().toString().padStart(2, '0');
        const minute = startDate.getUTCMinutes().toString().padStart(2, '0');
        const startParam = `${year}-${month}-${day}:${hour}-${minute}`;
        const durationMin = Math.ceil(durationSec / 60);

        return `${url.origin}/timeshift.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&duration=${durationMin}&start=${startParam}&stream=${streamId}`;
      }
    }

    // Flussonic format: /stream-timeshift_abs-1234567890.m3u8
    if (catchupType === 'flussonic') {
      const startUnix = Math.floor(startDate.getTime() / 1000);
      const cleanPath = url.pathname.replace(/\.m3u8$/, '');
      return `${url.origin}${cleanPath}-timeshift_abs-${startUnix}.m3u8`;
    }

    // Default query append: ?utc=1234567890&lutc=1234567890
    const startUnix = Math.floor(startDate.getTime() / 1000);
    url.searchParams.set('utc', startUnix.toString());
    url.searchParams.set('lutc', Math.floor(Date.now() / 1000).toString());
    return url.toString();
  } catch (e) {
    return channelUrl;
  }
}
