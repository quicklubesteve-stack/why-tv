import { TimeZoneSetting } from '../types';

/**
 * Format date in user's selected time zone
 */
export function formatTimeInZone(
  date: Date | string,
  timeZone: TimeZoneSetting = 'device',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '--:--';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...(timeZone === 'America/Toronto' ? { timeZone: 'America/Toronto' } : {}),
    ...options,
  };

  try {
    return new Intl.DateTimeFormat('en-US', defaultOptions).format(d);
  } catch (e) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
}

/**
 * Format date header (e.g. Wednesday, Nov 25)
 */
export function formatDateInZone(
  date: Date | string,
  timeZone: TimeZoneSetting = 'device'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(timeZone === 'America/Toronto' ? { timeZone: 'America/Toronto' } : {}),
  };

  try {
    return new Intl.DateTimeFormat('en-US', options).format(d);
  } catch (e) {
    return d.toLocaleDateString();
  }
}

/**
 * Get current time in specified zone as Date object
 */
export function getNowInZone(timeZone: TimeZoneSetting = 'device'): Date {
  if (timeZone === 'America/Toronto') {
    const torontoString = new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' });
    return new Date(torontoString);
  }
  return new Date();
}

/**
 * Calculate program progress percentage (0 - 100)
 */
export function getProgramProgress(startIso: string, endIso: string): number {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  const now = Date.now();

  if (now <= start) return 0;
  if (now >= end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

/**
 * Format relative time (e.g. "12m ago", "2h ago")
 */
export function formatRelativeTime(dateIso: string): string {
  const d = new Date(dateIso);
  const diffMs = Date.now() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}
