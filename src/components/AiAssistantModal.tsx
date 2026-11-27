import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Tv,
  Flame,
  Film,
  Zap,
  Globe,
  CheckCircle2,
  X,
  Play,
  Copy,
  Layers,
  Brain,
  Sliders,
  TrendingUp,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { Channel, EpgProgram, SportsGame, RecentChannel } from '../types';
import {
  queryAiAssistant,
  detectDuplicateChannels,
  categorizeChannelsWithAi,
  AiQueryResult,
  DuplicateDetectionResult,
  ChannelCategorizationResult,
} from '../utils/aiEngine';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  epgPrograms: EpgProgram[];
  recents?: RecentChannel[];
  favourites?: string[];
  onSelectChannel: (channel: Channel) => void;
}

const SAMPLE_QUESTIONS = [
  'What can I watch right now?',
  'Show me Canadian news channels.',
  'Find hockey programmes.',
  'What sports are available tonight?',
  'Recommend an action movie.',
  'Show me programmes similar to what I normally watch.',
  'Find all available sports channels.',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  channels,
  epgPrograms,
  recents = [],
  favourites = [],
  onSelectChannel,
}) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'duplicates' | 'categorization'>('assistant');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<AiQueryResult>(() =>
    queryAiAssistant('What can I watch right now?', channels, epgPrograms, recents, favourites)
  );
  const [duplicateResults, setDuplicateResults] = useState<DuplicateDetectionResult[]>([]);
  const [hasScannedDuplicates, setHasScannedDuplicates] = useState<boolean>(false);
  const [categoryResults, setCategoryResults] = useState<ChannelCategorizationResult[]>([]);
  const [hasCategorized, setHasCategorized] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAskQuestion = (question: string) => {
    setInputPrompt(question);
    const res = queryAiAssistant(question, channels, epgPrograms, recents, favourites);
    setCurrentResult(res);
  };

  const handleScanDuplicates = () => {
    const dups = detectDuplicateChannels(channels);
    setDuplicateResults(dups);
    setHasScannedDuplicates(true);
  };

  const handleRunCategorization = () => {
    const cats = categorizeChannelsWithAi(channels.slice(0, 30));
    setCategoryResults(cats);
    setHasCategorized(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans select-none">
      <div className="bg-[#1B2432] border border-[#263447] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#263447] bg-[#10151F] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#195F9E] to-[#42AAFF] flex items-center justify-center shadow-lg shadow-[#42AAFF]/20 shrink-0">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-xl font-black text-white tracking-wide">
                  WHY-AI Programme Discovery
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#195F9E]/30 text-[#42AAFF] px-2 py-0.5 rounded-full border border-[#42AAFF]/40">
                  COLLEGE AI PROTOTYPE
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Real-time semantic neural discovery engine across all authorized IPTV feeds.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#263447] hover:bg-[#195F9E] text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-[#263447] bg-[#10151F]/60">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'assistant'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Natural Language Assistant</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('duplicates');
              if (!hasScannedDuplicates) handleScanDuplicates();
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'duplicates'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Copy className="w-4 h-4" />
            <span>AI Duplicate Channel Detection</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('categorization');
              if (!hasCategorized) handleRunCategorization();
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 flex items-center space-x-2 ${
              activeTab === 'categorization'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>AI ML Categorization & Tags</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {/* --------------------------------------------------------- */}
          {/* TAB 1: AI NATURAL LANGUAGE ASSISTANT                      */}
          {/* --------------------------------------------------------- */}
          {activeTab === 'assistant' && (
            <div className="space-y-5">
              {/* Quick Sample Questions Bar */}
              <div>
                <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block mb-2">
                  Academic Evaluation Questions (Click to Ask):
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAskQuestion(q)}
                      className={`text-xs px-3 py-1.5 rounded-xl border transition text-left flex items-center space-x-1.5 ${
                        inputPrompt === q
                          ? 'bg-[#195F9E] border-[#42AAFF] text-white shadow-md'
                          : 'bg-[#10151F] border-[#263447] text-slate-300 hover:border-[#42AAFF] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#42AAFF] shrink-0" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Bar */}
              <div className="flex items-center space-x-3 bg-[#10151F] border border-[#263447] rounded-2xl p-2">
                <Search className="w-5 h-5 text-[#94A3B8] ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Ask anything (e.g. Find live football games, Canadian news, or action films)..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputPrompt.trim()) {
                      handleAskQuestion(inputPrompt);
                    }
                  }}
                  className="w-full bg-transparent text-sm text-white placeholder-[#94A3B8] outline-none"
                />
                <button
                  onClick={() => {
                    if (inputPrompt.trim()) handleAskQuestion(inputPrompt);
                  }}
                  className="px-5 py-2 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white font-bold text-xs rounded-xl transition shadow-md shrink-0"
                >
                  Analyze with AI
                </button>
              </div>

              {/* AI Response Card */}
              <div className="bg-[#10151F] border border-[#263447] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Neural Analysis Result
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {currentResult.aiBadges.map((b) => (
                      <span
                        key={b}
                        className="text-[10px] bg-[#263447] text-[#42AAFF] font-mono px-2 py-0.5 rounded-md border border-[#42AAFF]/30"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-base font-bold text-white leading-relaxed">
                  {currentResult.summary}
                </p>

                <div className="p-3 rounded-xl bg-[#1B2432]/80 border border-[#263447] text-xs text-[#94A3B8] leading-relaxed">
                  <strong className="text-slate-200 block mb-0.5">AI Reasoning & Data Sources:</strong>
                  {currentResult.reasoning}
                </div>

                {/* Matched Live Channels with 1-Click Tuning */}
                <div>
                  <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
                    Recommended Channels ({currentResult.matchedChannels.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentResult.matchedChannels.map((ch) => (
                      <div
                        key={ch.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1B2432] border border-[#263447] hover:border-[#42AAFF] transition group"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-9 h-9 rounded-lg bg-[#10151F] p-1 flex items-center justify-center shrink-0 border border-white/10">
                            {ch.logo ? (
                              <img
                                src={ch.logo}
                                alt={ch.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <Tv className="w-4 h-4 text-[#42AAFF]" />
                            )}
                          </div>
                          <div className="truncate">
                            <span className="font-bold text-xs text-white block truncate">
                              Ch {ch.channelNumber} • {ch.name}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] block truncate">
                              {ch.providerBadge || ch.group || 'Live Stream'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectChannel(ch);
                            onClose();
                          }}
                          className="px-3 py-1.5 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white font-bold text-xs rounded-lg transition shrink-0 ml-2 flex items-center space-x-1"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Sports Games if applicable */}
                {currentResult.matchedSports.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
                      Matched Live / Upcoming Sports Fixtures:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentResult.matchedSports.map((game) => (
                        <div
                          key={game.id}
                          className="p-3 rounded-xl bg-[#1B2432] border border-[#263447] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-black text-[#42AAFF]">{game.league}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                game.status === 'live'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                                  : 'bg-[#263447] text-slate-300'
                              }`}
                            >
                              {game.status === 'live' ? `LIVE • ${game.periodOrTime}` : game.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="font-bold text-sm text-white">
                            {game.homeTeam.name} vs {game.awayTeam.name}
                          </div>
                          <div className="text-xs text-slate-300 flex items-center justify-between">
                            <span>Score: {game.homeTeam.score} - {game.awayTeam.score}</span>
                            <span className="text-[#94A3B8]">Ch {game.channelNumber}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB 2: AI DUPLICATE CHANNEL DETECTION                     */}
          {/* --------------------------------------------------------- */}
          {activeTab === 'duplicates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#10151F] border border-[#263447]">
                <div>
                  <h3 className="text-sm font-bold text-white">Multi-Provider Deduplication Cluster</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Algorithms analyze normalized titles, provider CDN origins, and XMLTV guides to identify overlapping broadcasts.
                  </p>
                </div>
                <button
                  onClick={handleScanDuplicates}
                  className="px-4 py-2 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white font-bold text-xs rounded-xl transition"
                >
                  Re-Scan Catalogue
                </button>
              </div>

              {duplicateResults.length === 0 ? (
                <div className="p-8 text-center text-[#94A3B8]">
                  Scanning {channels.length} channels across connected providers...
                </div>
              ) : (
                <div className="space-y-3">
                  {duplicateResults.map((dup) => (
                    <div
                      key={dup.clusterId}
                      className="p-4 rounded-2xl bg-[#10151F] border border-[#263447] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-white">
                          Cluster: {dup.canonicalName}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                          {(dup.similarityScore * 100).toFixed(0)}% Similarity Score
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">{dup.reason}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {dup.channels.map((c) => (
                          <span
                            key={c.id}
                            className="text-xs bg-[#263447] text-white px-2.5 py-1 rounded-lg border border-white/10 flex items-center space-x-1.5"
                          >
                            <span>Ch {c.channelNumber}: {c.name}</span>
                            <span className="text-[10px] text-[#42AAFF]">({c.sourceName || 'Provider'})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --------------------------------------------------------- */}
          {/* TAB 3: AI ML CATEGORIZATION                               */}
          {/* --------------------------------------------------------- */}
          {activeTab === 'categorization' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#10151F] border border-[#263447]">
                <div>
                  <h3 className="text-sm font-bold text-white">Predictive Channel Taxonomy & Tagging</h3>
                  <p className="text-xs text-[#94A3B8]">
                    Natural language classification pipeline parsing raw XMLTV metadata into normalized genres, language, and regional tags.
                  </p>
                </div>
                <button
                  onClick={handleRunCategorization}
                  className="px-4 py-2 bg-[#195F9E] hover:bg-[#42AAFF] hover:text-[#10151F] text-white font-bold text-xs rounded-xl transition"
                >
                  Run Classification Pipeline
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryResults.map((item) => (
                  <div
                    key={item.channelId}
                    className="p-3 rounded-xl bg-[#10151F] border border-[#263447] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate max-w-[200px]">
                        {item.channelName}
                      </span>
                      <span className="text-[10px] font-mono text-[#42AAFF] bg-[#195F9E]/20 px-2 py-0.5 rounded border border-[#42AAFF]/30">
                        {item.inferredCategory} ({(item.confidence * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] bg-[#263447] text-slate-300 px-2 py-0.5 rounded"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
