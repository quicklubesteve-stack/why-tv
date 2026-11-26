import React, { useState } from 'react';
import { X, Link as LinkIcon, Check, Search, Tv } from 'lucide-react';
import { Channel } from '../types';

interface ChannelMappingModalProps {
  channels: Channel[];
  xmltvChannelIds: string[];
  mappings: Record<string, string>;
  onSaveMapping: (channelId: string, xmltvId: string) => void;
  onClose: () => void;
}

export const ChannelMappingModal: React.FC<ChannelMappingModalProps> = ({
  channels,
  xmltvChannelIds,
  mappings,
  onSaveMapping,
  onClose,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [targetXmltvId, setTargetXmltvId] = useState<string>('');

  const filteredChannels = channels.filter((ch) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      ch.name.toLowerCase().includes(q) ||
      ch.channelNumber.toString().includes(q) ||
      (ch.tvgId && ch.tvgId.toLowerCase().includes(q))
    );
  });

  const activeChannel = channels.find((c) => c.id === selectedChannelId);
  const currentMapped = activeChannel ? mappings[activeChannel.id] || activeChannel.tvgId || '' : '';

  const handleLink = (xmltvId: string) => {
    if (!activeChannel) return;
    onSaveMapping(activeChannel.id, xmltvId);
    setTargetXmltvId('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cable-900 border border-cable-border rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cable-border bg-cable-950">
          <div className="flex items-center space-x-3">
            <LinkIcon className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Manual TV Guide Channel Mapping</h3>
              <p className="text-xs text-slate-400">
                Link playlist channels to specific XMLTV guide channels when IDs don't match automatically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cable-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cable-border flex-1 overflow-hidden">
          {/* Left Column: Channels */}
          <div className="p-4 flex flex-col space-y-3 overflow-hidden bg-cable-900">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter channels..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-cable-950 border border-cable-border pl-9 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[50vh]">
              {filteredChannels.map((ch) => {
                const isSelected = ch.id === selectedChannelId;
                const hasMapping = mappings[ch.id] || (ch.tvgId && xmltvChannelIds.includes(ch.tvgId));

                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className={`p-2.5 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-cable-950/70 text-slate-300 hover:bg-cable-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                        {ch.channelNumber}
                      </span>
                      <span className="truncate">{ch.name}</span>
                    </div>

                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        hasMapping
                          ? isSelected ? 'bg-black text-amber-300' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : isSelected ? 'bg-black text-red-300' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {hasMapping ? 'Matched' : 'Unmatched'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: XMLTV Channels to Link */}
          <div className="p-4 flex flex-col space-y-3 overflow-hidden bg-cable-950">
            {activeChannel ? (
              <>
                <div className="bg-cable-900 p-3 rounded-xl border border-cable-border">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Selected Channel</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-white">
                      CH {activeChannel.channelNumber}: {activeChannel.name}
                    </span>
                    <span className="text-xs font-mono text-amber-400">
                      Current ID: {currentMapped || 'None'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Select XMLTV Channel ID to link:
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Or enter custom XMLTV ID..."
                      value={targetXmltvId}
                      onChange={(e) => setTargetXmltvId(e.target.value)}
                      className="flex-1 bg-cable-900 border border-cable-border px-3 py-1.5 rounded-lg text-xs text-white"
                    />
                    <button
                      onClick={() => handleLink(targetXmltvId)}
                      disabled={!targetXmltvId.trim()}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 text-neutral-950 font-bold text-xs rounded-lg"
                    >
                      Link
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[40vh] pr-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Available XMLTV IDs ({xmltvChannelIds.length}):
                  </span>
                  {xmltvChannelIds.length === 0 ? (
                    <p className="text-xs text-slate-400 p-4 text-center">
                      No XMLTV sources imported yet. Add an XMLTV file or URL in Settings first.
                    </p>
                  ) : (
                    xmltvChannelIds.map((xId) => (
                      <div
                        key={xId}
                        onClick={() => handleLink(xId)}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs border ${
                          currentMapped === xId
                            ? 'bg-amber-950/60 border-amber-400 text-amber-300'
                            : 'bg-cable-900 border-cable-border/60 hover:bg-cable-850 text-slate-300'
                        }`}
                      >
                        <span className="font-mono text-xs">{xId}</span>
                        {currentMapped === xId ? (
                          <span className="flex items-center text-[10px] text-amber-400 font-bold">
                            <Check className="w-3.5 h-3.5 mr-1" /> Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 hover:text-amber-400">
                            Click to Match
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-400 text-center p-8">Select a channel on the left to map.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cable-950 border-t border-cable-border flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-lg text-xs cable-focus-ring"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
