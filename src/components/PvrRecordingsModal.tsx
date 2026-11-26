import React, { useState } from 'react';
import {
  X,
  HardDrive,
  Clock,
  Play,
  Trash2,
  Calendar,
  AlertCircle,
  Disc,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import { PvrRecording, Channel, TimeZoneSetting } from '../types';
import { calculatePvrQuota, filterRecordings } from '../utils/pvrUtils';
import { formatTimeInZone, formatDateInZone } from '../utils/dateUtils';

interface PvrRecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordings: PvrRecording[];
  onPlayRecording: (recording: PvrRecording) => void;
  onDeleteRecording: (id: string) => void;
  onInstantRecordCurrent?: () => void;
  currentChannel: Channel | null;
  timeZone: TimeZoneSetting;
}

export const PvrRecordingsModal: React.FC<PvrRecordingsModalProps> = ({
  isOpen,
  onClose,
  recordings,
  onPlayRecording,
  onDeleteRecording,
  onInstantRecordCurrent,
  currentChannel,
  timeZone,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled'>('all');

  if (!isOpen) return null;

  const quota = calculatePvrQuota(recordings, 100);
  const filteredList = filterRecordings(recordings, filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-cable-900 border border-cable-border rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-cable-border bg-cable-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-wide">Cloud PVR Recordings</h2>
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-neutral-950 px-2 py-0.5 rounded shadow">
                  BELL FIBE / ROGERS TIER
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage your scheduled series, live recorded games, and completed shows.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onInstantRecordCurrent && currentChannel && (
              <button
                onClick={onInstantRecordCurrent}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg shadow cable-focus-ring"
                title={`Record live broadcast on ${currentChannel.name}`}
              >
                <Disc className="w-3.5 h-3.5 animate-pulse" />
                <span>Record CH {currentChannel.channelNumber}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-cable-800"
              title="Close PVR Modal (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cloud PVR Storage Quota Bar */}
        <div className="p-4 bg-neutral-950/80 border-b border-cable-border px-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <div className="flex items-center space-x-2 text-slate-300">
              <HardDrive className="w-4 h-4 text-amber-400" />
              <span>Storage Used: <strong className="text-white">{quota.usedHours} hrs</strong> of {quota.maxHours} hrs</span>
            </div>
            <span className={`font-bold ${quota.percentUsed > 80 ? 'text-red-400' : 'text-amber-400'}`}>
              {quota.percentUsed}% Capacity ({recordings.length} total titles)
            </span>
          </div>

          <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quota.percentUsed > 80 ? 'bg-red-500 shadow-md' : 'bg-amber-400 shadow-cable-focus'
              }`}
              style={{ width: `${quota.percentUsed}%` }}
            />
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center space-x-2 px-6 pt-4 border-b border-cable-border pb-3 bg-cable-900">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                : 'bg-cable-800 text-slate-300 hover:bg-cable-700'
            }`}
          >
            All Recordings ({recordings.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'completed'
                ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                : 'bg-cable-800 text-slate-300 hover:bg-cable-700'
            }`}
          >
            Completed ({recordings.filter((r) => r.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              filter === 'scheduled'
                ? 'bg-amber-400 text-neutral-950 shadow-cable-focus'
                : 'bg-cable-800 text-slate-300 hover:bg-cable-700'
            }`}
          >
            Scheduled & Live ({recordings.filter((r) => r.status !== 'completed').length})
          </button>
        </div>

        {/* Recordings List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Clock className="w-12 h-12 mx-auto text-slate-600" />
              <h4 className="text-base font-bold text-slate-200">No recordings in this folder</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Select an upcoming show in the TV Guide and click "Record Show", or tap the Record button while watching live TV.
              </p>
            </div>
          ) : (
            filteredList.map((rec) => {
              const isRec = rec.status === 'recording';
              const isCompleted = rec.status === 'completed';

              return (
                <div
                  key={rec.id}
                  className="bg-cable-800/80 hover:bg-cable-800 border border-cable-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition shadow-sm"
                >
                  <div className="flex items-start space-x-3.5 min-w-0">
                    {/* Status Badge Icon */}
                    <div className="shrink-0 mt-1">
                      {isRec ? (
                        <div className="w-9 h-9 rounded-lg bg-red-950/80 border border-red-500/80 flex items-center justify-center text-red-400 animate-pulse">
                          <Disc className="w-5 h-5 fill-current" />
                        </div>
                      ) : isCompleted ? (
                        <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/80 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-amber-400">
                          <Calendar className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="font-mono text-[10px] font-black bg-black text-amber-400 px-2 py-0.5 rounded border border-neutral-700">
                          CH {rec.channelNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{rec.channelName}</span>
                        <span className="text-slate-500">•</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            isRec
                              ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-slate-300 border border-neutral-700'
                          }`}
                        >
                          {rec.status}
                        </span>
                        {rec.sizeMb && isCompleted && (
                          <span className="text-[10px] font-mono text-slate-400">
                            {rec.sizeMb >= 1000 ? `${(rec.sizeMb / 1024).toFixed(1)} GB` : `${rec.sizeMb} MB`}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white truncate">{rec.programTitle}</h4>

                      <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>
                          {formatDateInZone(rec.startTime, timeZone)} • {formatTimeInZone(rec.startTime, timeZone)} - {formatTimeInZone(rec.endTime, timeZone)} ({rec.durationMinutes} min)
                        </span>
                      </div>

                      {rec.programDescription && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {rec.programDescription}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onPlayRecording(rec)}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg shadow-cable-focus cable-focus-ring text-xs"
                      title="Play Recording"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Watch' : 'Tune Channel'}</span>
                    </button>
                    <button
                      onClick={() => onDeleteRecording(rec.id)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 border border-neutral-700/60"
                      title="Delete Recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
