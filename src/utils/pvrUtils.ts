import { PvrRecording, PvrQuota, EpgProgram, Channel } from '../types';

/**
 * Calculates Cloud PVR storage usage and quota.
 * Follows Bell Fibe TV (100h / 320h) and Rogers Xfinity Cloud PVR conventions.
 */
export function calculatePvrQuota(
  recordings: PvrRecording[],
  maxHours: number = 100
): PvrQuota {
  // Only completed and in-progress recordings count towards physical storage used
  const activeRecordings = recordings.filter(
    (r) => r.status === 'completed' || r.status === 'recording'
  );

  const totalMinutes = activeRecordings.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
  const usedHours = Math.round((totalMinutes / 60) * 10) / 10;
  const percentUsed = Math.min(100, Math.round((usedHours / maxHours) * 100));

  return {
    maxHours,
    usedHours,
    percentUsed,
    totalRecordingsCount: recordings.length,
  };
}

/**
 * Creates a scheduled or in-progress PVR recording from an EPG program.
 */
export function createRecordingFromProgram(
  program: EpgProgram,
  channel: Channel,
  initialStatus?: 'scheduled' | 'recording'
): PvrRecording {
  const startTimeMs = new Date(program.start).getTime();
  const endTimeMs = new Date(program.end).getTime();
  const now = Date.now();

  const durationMinutes = Math.max(1, Math.round((endTimeMs - startTimeMs) / (60 * 1000)));

  // If start time is already in past, it's currently recording
  const status =
    initialStatus ||
    (startTimeMs <= now && endTimeMs > now
      ? 'recording'
      : startTimeMs > now
      ? 'scheduled'
      : 'completed');

  // Estimate storage: ~25 MB per minute for 1080p H.264 stream (~1.5 GB/hr)
  const sizeMb = Math.round(durationMinutes * 25);

  return {
    id: `rec_${Date.now()}_${channel.id}_${Math.floor(Math.random() * 1000)}`,
    channelId: channel.id,
    channelNumber: channel.channelNumber,
    channelName: channel.name,
    channelLogo: channel.logo,
    programTitle: program.title,
    programDescription: program.description,
    startTime: program.start,
    endTime: program.end,
    durationMinutes,
    status,
    sizeMb,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Creates an instant live recording for the channel currently being watched.
 */
export function createInstantLiveRecording(
  channel: Channel,
  program?: EpgProgram
): PvrRecording {
  const now = new Date();
  const title = program?.title || `Live Broadcast - ${channel.name}`;
  const start = now.toISOString();

  // Default to 60-minute duration or program end time if available
  let endTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
  let durationMinutes = 60;

  if (program && program.end) {
    const endMs = new Date(program.end).getTime();
    if (endMs > now.getTime()) {
      endTime = program.end;
      durationMinutes = Math.max(5, Math.round((endMs - now.getTime()) / (60 * 1000)));
    }
  }

  return {
    id: `rec_${Date.now()}_instant_${channel.id}`,
    channelId: channel.id,
    channelNumber: channel.channelNumber,
    channelName: channel.name,
    channelLogo: channel.logo,
    programTitle: title,
    programDescription: program?.description || `Live broadcast recorded from ${channel.name}`,
    startTime: start,
    endTime,
    durationMinutes,
    status: 'recording',
    sizeMb: Math.round(durationMinutes * 25),
    createdAt: start,
  };
}

/**
 * Lifecycle state machine: transitions scheduled -> recording -> completed
 * as time elapses.
 */
export function updateRecordingsLifecycle(
  recordings: PvrRecording[],
  currentTimeMs: number = Date.now()
): PvrRecording[] {
  return recordings.map((rec) => {
    const startMs = new Date(rec.startTime).getTime();
    const endMs = new Date(rec.endTime).getTime();

    if (rec.status === 'scheduled' && currentTimeMs >= startMs) {
      if (currentTimeMs >= endMs) {
        return { ...rec, status: 'completed' };
      }
      return { ...rec, status: 'recording' };
    }

    if (rec.status === 'recording' && currentTimeMs >= endMs) {
      return { ...rec, status: 'completed' };
    }

    return rec;
  });
}

/**
 * Filter recordings by user tab view
 */
export function filterRecordings(
  recordings: PvrRecording[],
  filter: 'all' | 'completed' | 'scheduled'
): PvrRecording[] {
  if (filter === 'completed') {
    return recordings.filter((r) => r.status === 'completed');
  }
  if (filter === 'scheduled') {
    return recordings.filter((r) => r.status === 'scheduled' || r.status === 'recording');
  }
  return recordings;
}
