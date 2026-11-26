import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Tv,
  Play,
  Link as LinkIcon,
  AlertCircle,
  HelpCircle,
  Disc,
  Check,
} from 'lucide-react';
import { Channel, EpgProgram, TimeZoneSetting } from '../types';
import { formatTimeInZone, formatDateInZone } from '../utils/dateUtils';

interface TvGuideViewProps {
  channels: Channel[];
  epgPrograms: EpgProgram[];
  timeZone: TimeZoneSetting;
  onSelectChannel: (channel: Channel) => void;
  onOpenMappingModal: () => void;
  unmatchedCount: number;
  onScheduleRecording?: (program: EpgProgram, channel: Channel) => void;
  recordedProgramKeys?: Set<string>; // channelId + start
}

const MINUTE_WIDTH = 5; // 5px per minute = 150px per 30min block

export const TvGuideView: React.FC<TvGuideViewProps> = ({
  channels,
  epgPrograms,
  timeZone,
  onSelectChannel,
  onOpenMappingModal,
  unmatchedCount,
  onScheduleRecording,
  recordedProgramKeys = new Set(),
}) => {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProgram, setSelectedProgram] = useState<{
    program: EpgProgram;
    channel: Channel;
  } | null>(null);

  // Filter channels by selected category
  const filteredChannels = useMemo(() => {
    if (selectedCategory === 'All') return channels;
    return channels.filter((c) => (c.group || '').toLowerCase() === selectedCategory.toLowerCase());
  }, [channels, selectedCategory]);

  const categories = useMemo(() => {
    const list = ['All', 'Sports', 'News', 'Movies', 'Kids', 'Local'];
    return list.map((cat) => {
      const count = cat === 'All' ? channels.length : channels.filter((c) => (c.group || '').toLowerCase() === cat.toLowerCase()).length;
      return { name: cat, count };
    });
  }, [channels]);

  // Define guide timeline range: 2 hours ago to 28 hours ahead, snapped to 30 min boundaries
  const { startTime, endTime, timeSlots } = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    start.setMinutes(start.getMinutes() < 30 ? 0 : 30, 0, 0);

    const end = new Date(start.getTime() + 30 * 60 * 60 * 1000);

    const slots: Date[] = [];
    let cur = new Date(start);
    while (cur < end) {
      slots.push(new Date(cur));
      cur = new Date(cur.getTime() + 30 * 60 * 1000);
    }

    return { startTime: start, endTime: end, timeSlots: slots };
  }, []);

  const scrollToTimestamp = (targetMs: number) => {
    if (!gridContainerRef.current) return;
    const diffMinutes = Math.max(0, (targetMs - startTime.getTime()) / (60 * 1000));
    const targetScroll = Math.max(0, diffMinutes * MINUTE_WIDTH - 250);
    gridContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
  };

  // Jump grid scroll directly to "Now"
  const scrollToNow = () => {
    scrollToTimestamp(Date.now());
  };

  // Jump grid scroll +2 Hours
  const scrollToPlusTwoHours = () => {
    scrollToTimestamp(Date.now() + 2 * 60 * 60 * 1000);
  };

  // Jump to Prime Time (8:00 PM)
  const scrollToPrimeTime = () => {
    const target = new Date();
    target.setHours(20, 0, 0, 0);
    if (Date.now() > target.getTime() + 30 * 60 * 1000) {
      // If already past 8:30 PM, jump to tomorrow 8:00 PM
      target.setDate(target.getDate() + 1);
    }
    scrollToTimestamp(target.getTime());
  };

  // Jump to Tomorrow (+24 Hours)
  const scrollToTomorrow = () => {
    scrollToTimestamp(Date.now() + 24 * 60 * 60 * 1000);
  };

  useEffect(() => {
    // Initial jump to now
    const timer = setTimeout(scrollToNow, 200);
    return () => clearTimeout(timer);
  }, [startTime]);

  // Map programs by channel tvgId or id
  const programsByChannel = useMemo(() => {
    const map = new Map<string, EpgProgram[]>();
    epgPrograms.forEach((p) => {
      const list = map.get(p.channelId) || [];
      list.push(p);
      map.set(p.channelId, list);
    });

    // Sort programs chronologically
    map.forEach((list) => {
      list.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    });
    return map;
  }, [epgPrograms]);

  // Current time position in pixels
  const nowOffsetPx = Math.max(
    0,
    ((Date.now() - startTime.getTime()) / (60 * 1000)) * MINUTE_WIDTH
  );

  return (
    <div className="space-y-4 pb-12">
      {/* Top Controls: "Now" button, Quick Jump Time navigation, category pills */}
      <div className="flex flex-col gap-3 bg-cable-900 border border-cable-border p-3.5 rounded-2xl shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Time Jump Toolbar */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            <button
              onClick={scrollToNow}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-lg shadow-cable-focus transition text-xs cable-focus-ring shrink-0"
              title="Jump directly to current time"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>NOW</span>
            </button>

            <button
              onClick={scrollToPlusTwoHours}
              className="px-3 py-2 bg-cable-800 hover:bg-cable-700 text-slate-200 hover:text-white font-bold rounded-lg border border-cable-border text-xs transition cable-focus-ring shrink-0"
              title="Fast forward 2 hours"
            >
              +2 HOURS
            </button>

            <button
              onClick={scrollToPrimeTime}
              className="px-3 py-2 bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-800 font-bold rounded-lg text-xs transition cable-focus-ring shrink-0 flex items-center space-x-1"
              title="Jump to Prime Time evening lineup (8:00 PM)"
            >
              <span>🌙 PRIME TIME (8 PM)</span>
            </button>

            <button
              onClick={scrollToTomorrow}
              className="px-3 py-2 bg-cable-800 hover:bg-cable-700 text-slate-200 hover:text-white font-bold rounded-lg border border-cable-border text-xs transition cable-focus-ring shrink-0"
              title="Jump 24 hours ahead"
            >
              TOMORROW
            </button>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-center">
            <span className="text-xs font-semibold text-slate-300">
              {formatDateInZone(new Date(), timeZone)} • {formatTimeInZone(new Date(), timeZone)}
            </span>

            {/* Unmatched Channels Banner Link */}
            {unmatchedCount > 0 && (
              <button
                onClick={onOpenMappingModal}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-cable-800 hover:bg-cable-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-semibold cable-focus-ring"
              >
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>{unmatchedCount} Unmatched</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Sports, News, Movies, Kids, Local) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-1 border-t border-cable-border/60">
          <span className="text-[11px] font-mono text-slate-400 uppercase shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 cable-focus-ring ${
                selectedCategory === cat.name
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-cable-focus'
                  : 'bg-cable-950 text-slate-300 hover:bg-cable-800 hover:text-white border border-cable-border/60'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Cable Grid EPG */}
      <div className="border border-cable-border rounded-xl bg-cable-950 shadow-2xl overflow-hidden flex flex-col">
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Fixed Column: Channels */}
          <div className="w-48 sm:w-60 shrink-0 bg-cable-900 border-r border-cable-border z-20 shadow-lg">
            {/* Corner header */}
            <div className="h-12 border-b border-cable-border p-3 flex items-center justify-between bg-cable-950 font-bold text-xs uppercase text-slate-400 font-mono tracking-wider">
              <span>Channel</span>
              <span className="text-[10px] bg-cable-800 px-1.5 py-0.5 rounded text-amber-400">
                {filteredChannels.length} Shown
              </span>
            </div>

            {/* Channel rows */}
            <div className="divide-y divide-cable-border/60">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  role="button"
                  tabIndex={0}
                  className="h-20 p-2.5 flex items-center space-x-3 hover:bg-cable-800/80 cursor-pointer transition cable-focus-ring group"
                  title={`Tune to ${channel.name}`}
                >
                  <span className="font-mono font-black text-xs px-2 py-1 rounded bg-neutral-950 text-amber-400 border border-neutral-800 group-hover:border-amber-400 shrink-0">
                    {channel.channelNumber}
                  </span>

                  <div className="w-8 h-8 rounded bg-neutral-950 p-1 flex items-center justify-center shrink-0">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt=""
                        className="max-h-6 max-w-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Tv className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-amber-300">
                      {channel.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {channel.group}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Scrollable Timeline & Program Blocks */}
          <div
            ref={gridContainerRef}
            className="flex-1 overflow-x-auto overflow-y-hidden relative select-none scroll-smooth"
            style={{ minHeight: `${filteredChannels.length * 80 + 48}px` }}
          >
            {/* Timeline Header (30-min intervals) */}
            <div
              className="h-12 bg-cable-950 border-b border-cable-border sticky top-0 z-10 flex"
              style={{ width: `${timeSlots.length * 30 * MINUTE_WIDTH}px` }}
            >
              {timeSlots.map((slot, i) => (
                <div
                  key={i}
                  className="shrink-0 border-r border-cable-border/50 px-2 py-3 text-xs font-mono font-bold text-slate-300 flex items-center"
                  style={{ width: `${30 * MINUTE_WIDTH}px` }}
                >
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  <span>{formatTimeInZone(slot, timeZone)}</span>
                </div>
              ))}
            </div>

            {/* Vertical Red "Current Time" Indicator Line */}
            {nowOffsetPx > 0 && nowOffsetPx < timeSlots.length * 30 * MINUTE_WIDTH && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                style={{ left: `${nowOffsetPx}px` }}
              >
                <div className="bg-red-600 text-white text-[9px] font-mono px-1 py-0.5 rounded absolute -top-0 -left-6 uppercase font-bold tracking-tighter">
                  NOW
                </div>
              </div>
            )}

            {/* Program Rows for each channel */}
            <div
              className="divide-y divide-cable-border/60 relative"
              style={{ width: `${timeSlots.length * 30 * MINUTE_WIDTH}px` }}
            >
              {filteredChannels.map((channel) => {
                const programs =
                  programsByChannel.get(channel.tvgId || '') ||
                  programsByChannel.get(channel.id) ||
                  [];

                return (
                  <div key={channel.id} className="h-20 relative bg-cable-950/40">
                    {programs.length === 0 ? (
                      /* Guide Unavailable for this channel */
                      <div
                        onClick={() => onSelectChannel(channel)}
                        className="absolute inset-y-1 left-2 right-2 rounded-lg bg-cable-900/40 border border-dashed border-cable-border flex items-center justify-between px-4 text-slate-400 cursor-pointer hover:bg-cable-900/70 transition"
                      >
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium">
                            Guide unavailable for {channel.name}
                          </span>
                        </div>
                        <span className="text-xs text-amber-400 hover:underline flex items-center">
                          <Play className="w-3.5 h-3.5 mr-1 fill-current" /> Watch Channel
                        </span>
                      </div>
                    ) : (
                      programs.map((prog) => {
                        const progStart = new Date(prog.start).getTime();
                        const progEnd = new Date(prog.end).getTime();

                        // Clip within timeline range
                        const visibleStart = Math.max(startTime.getTime(), progStart);
                        const visibleEnd = Math.min(endTime.getTime(), progEnd);

                        if (visibleEnd <= visibleStart) return null;

                        const leftMin = (visibleStart - startTime.getTime()) / (60 * 1000);
                        const durationMin = (visibleEnd - visibleStart) / (60 * 1000);

                        const leftPx = leftMin * MINUTE_WIDTH;
                        const widthPx = Math.max(60, durationMin * MINUTE_WIDTH);

                        const isNow =
                          Date.now() >= progStart && Date.now() < progEnd;

                        return (
                          <div
                            key={prog.id}
                            onClick={() => {
                              setSelectedProgram({ program: prog, channel });
                            }}
                            onDoubleClick={() => onSelectChannel(channel)}
                            role="button"
                            tabIndex={0}
                            style={{
                              left: `${leftPx}px`,
                              width: `${widthPx - 2}px`,
                            }}
                            className={`absolute inset-y-1 rounded-lg p-2 flex flex-col justify-between border cursor-pointer transition-all duration-150 cable-focus-ring ${
                              isNow
                                ? 'bg-amber-950/40 border-amber-400/80 hover:bg-amber-900/50 shadow'
                                : 'bg-cable-900/80 border-cable-border/70 hover:bg-cable-800'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center space-x-1.5">
                                {isNow && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                                )}
                                <h5 className="text-xs font-bold text-white truncate">
                                  {prog.title}
                                </h5>
                              </div>
                              <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate">
                                {formatTimeInZone(prog.start, timeZone)} - {formatTimeInZone(prog.end, timeZone)}
                              </span>
                            </div>

                            {prog.category && (
                              <span className="text-[9px] uppercase font-mono text-slate-400 truncate">
                                {prog.category}
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Program Details Dialog / Quick Action Card */}
      {selectedProgram && (
        <div className="bg-cable-900 border border-amber-400/50 p-4 sm:p-5 rounded-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400">
              <span className="font-bold">CH {selectedProgram.channel.channelNumber}</span>
              <span>•</span>
              <span>{selectedProgram.channel.name}</span>
              <span>•</span>
              <span>
                {formatTimeInZone(selectedProgram.program.start, timeZone)} -{' '}
                {formatTimeInZone(selectedProgram.program.end, timeZone)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">{selectedProgram.program.title}</h3>
            {selectedProgram.program.description && (
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedProgram.program.description}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => onSelectChannel(selectedProgram.channel)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg shadow-cable-focus cable-focus-ring text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch {selectedProgram.channel.name}</span>
            </button>

            {onScheduleRecording && (
              <button
                onClick={() => {
                  onScheduleRecording(selectedProgram.program, selectedProgram.channel);
                  setSelectedProgram(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-bold text-sm border cable-focus-ring ${
                  recordedProgramKeys.has(`${selectedProgram.channel.id}_${selectedProgram.program.start}`)
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : 'bg-cable-800 hover:bg-cable-700 text-slate-200 border-cable-border'
                }`}
              >
                <Disc className="w-4 h-4 text-red-500 fill-current" />
                <span>
                  {recordedProgramKeys.has(`${selectedProgram.channel.id}_${selectedProgram.program.start}`)
                    ? 'Scheduled to PVR'
                    : 'Record Show'}
                </span>
              </button>
            )}

            <button
              onClick={() => setSelectedProgram(null)}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-cable-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
