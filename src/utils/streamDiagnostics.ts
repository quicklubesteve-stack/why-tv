import { StreamDiagnostics } from '../types';

/**
 * Formats bitrate in Kbps or Mbps
 */
export function formatBitrate(kbps: number): string {
  if (!kbps || kbps <= 0) return 'Auto';
  if (kbps >= 1000) {
    return `${(kbps / 1000).toFixed(1)} Mbps`;
  }
  return `${Math.round(kbps)} Kbps`;
}

/**
 * Formats buffer health in seconds
 */
export function formatBuffer(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0.0s';
  return `${seconds.toFixed(1)}s`;
}

/**
 * Calculates overall stream health score based on buffered segments and dropped frames
 */
export function calculateStreamHealth(
  bufferSec: number,
  droppedFrames: number = 0
): { status: 'excellent' | 'good' | 'fair' | 'poor'; label: string; color: string } {
  if (bufferSec >= 10 && droppedFrames < 5) {
    return { status: 'excellent', label: 'Optimal Buffer', color: 'text-emerald-400' };
  }
  if (bufferSec >= 5 && droppedFrames < 20) {
    return { status: 'good', label: 'Stable Stream', color: 'text-emerald-300' };
  }
  if (bufferSec >= 2) {
    return { status: 'fair', label: 'Low Buffer', color: 'text-amber-400' };
  }
  return { status: 'poor', label: 'Rebuffering Risk', color: 'text-red-400' };
}

/**
 * Creates default initial diagnostics
 */
export function createDefaultDiagnostics(): StreamDiagnostics {
  return {
    resolution: 'Auto (Detecting...)',
    bitrateKbps: 0,
    fps: 30,
    bufferLengthSec: 0,
    videoCodec: 'H.264 (AVC)',
    audioCodec: 'AAC-LC',
    droppedFrames: 0,
    latencySec: 0,
  };
}
