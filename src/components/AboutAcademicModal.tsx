import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Brain,
  Layers,
  TrendingUp,
  Cpu,
  Tv,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Sparkles,
  Award,
  Globe,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface AboutAcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutAcademicModal: React.FC<AboutAcademicModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'problem_solution' | 'ai_system' | 'business' | 'architecture'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto font-sans select-none">
      <div className="bg-[#1B2432] border border-[#263447] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#263447] bg-[#10151F] flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#195F9E] to-[#42AAFF] flex items-center justify-center shadow-lg shadow-[#42AAFF]/20 shrink-0">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  WHY IPTV – Academic Project Dossier
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#195F9E]/30 text-[#42AAFF] px-2 py-0.5 rounded-full border border-[#42AAFF]/40">
                  FINAL CAPSTONE
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                Senior Software Engineering, AI & Authorized IPTV Aggregation System
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
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-[#263447] bg-[#10151F]/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('problem_solution')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 shrink-0 ${
              activeTab === 'problem_solution'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Problem & Proposed Solution
          </button>
          <button
            onClick={() => setActiveTab('ai_system')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 shrink-0 ${
              activeTab === 'ai_system'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Artificial Intelligence System
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 shrink-0 ${
              activeTab === 'business'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            Business & Licensing Opportunity
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition border-b-2 shrink-0 ${
              activeTab === 'architecture'
                ? 'border-[#42AAFF] text-[#42AAFF] bg-[#1B2432]'
                : 'border-transparent text-[#94A3B8] hover:text-white'
            }`}
          >
            System Architecture
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1 text-sm text-[#94A3B8] leading-relaxed">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#10151F] border border-[#263447] space-y-3">
                <span className="text-xs font-bold text-[#42AAFF] uppercase tracking-wider">
                  Project Title
                </span>
                <h3 className="text-2xl font-black text-white">
                  WHY IPTV: Unified Authorized Streaming & AI-Powered Television Platform
                </h3>
                <p className="text-slate-300">
                  WHY IPTV demonstrates how artificial intelligence and authorized broadcasting infrastructure can unify fragmented streaming applications into one premium, cable-grade television experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <Tv className="w-6 h-6 text-[#42AAFF] mb-2" />
                  <h4 className="font-bold text-white text-sm mb-1">100+ Live Channels</h4>
                  <p className="text-xs">
                    Connected to 18 authorized providers (CBC Gem, Pluto TV, Plex, Samsung Plus, LG, Xumo, VMedia, TekSavvy).
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <Brain className="w-6 h-6 text-emerald-400 mb-2" />
                  <h4 className="font-bold text-white text-sm mb-1">Zero-Hallucination AI</h4>
                  <p className="text-xs">
                    Natural language querying, duplicate feed detection, predictive categorization, and personalized taste graphing.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <ShieldCheck className="w-6 h-6 text-amber-400 mb-2" />
                  <h4 className="font-bold text-white text-sm mb-1">Legal & Compliant</h4>
                  <p className="text-xs">
                    Uses official provider origins, CRTC licensed BDU channels, and authorized FAST syndication networks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problem_solution' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-[#10151F] border border-red-500/20 space-y-2">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span>The Problem: The Streaming Fragmentation Crisis</span>
                </h3>
                <p>
                  Modern television viewers face severe app fatigue. Linear TV and on-demand content are fractured across dozens of closed-garden applications (Netflix, Prime, Pluto TV, Plex, CBC Gem, Sportsnet+, DAZN). Finding a specific live sporting event or programme requires opening multiple apps, navigating different user interfaces, managing multiple billing accounts, and guessing which regional feed carries the broadcast.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#10151F] border border-emerald-500/20 space-y-2">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>The Proposed Solution: Universal Authorized Aggregation</span>
                </h3>
                <p>
                  WHY IPTV establishes a single, unified cable-grade interface. By leveraging authorized M3U playlists, XMLTV guides, and official provider APIs, the user accesses one standardized Electronic Programme Guide, a live preview player, and a unified sports dashboard without ever having to switch applications.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai_system' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#10151F] border border-[#263447] space-y-3">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-[#42AAFF]" />
                  <span>Artificial Intelligence in WHY IPTV</span>
                </h3>
                <p>
                  Rather than using AI merely for superficial text generation, WHY IPTV integrates AI into the core architectural pipeline:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <strong className="text-white block font-bold text-sm mb-1">
                    1. Semantic Natural Language Discovery (Zero-Hallucination)
                  </strong>
                  <p className="text-xs">
                    Users can ask questions like "What can I watch right now?" or "Find hockey programmes". The query engine parses intents and executes semantic searches across the live broadcast schedule, only presenting confirmed, playable streams.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <strong className="text-white block font-bold text-sm mb-1">
                    2. Multi-Provider Channel Deduplication
                  </strong>
                  <p className="text-xs">
                    When connecting multiple FAST and BDU providers, identical channels often appear under slightly different names. The AI clustering algorithm groups overlapping streams, identifies the highest bitrate feed, and removes redundancy.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <strong className="text-white block font-bold text-sm mb-1">
                    3. Dynamic Taxonomy & Category Classification
                  </strong>
                  <p className="text-xs">
                    Unstructured XMLTV metadata is automatically classified into standardized genres (Sports, News, Movies, Canadian BDU) and audio language tags using machine-learning pattern recognition.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <strong className="text-white block font-bold text-sm mb-1">
                    4. Personalized Recommendation Graph
                  </strong>
                  <p className="text-xs">
                    Builds an interest vector based on user session duration, recently watched channels, and favourites to suggest relevant live programming without invasive third-party tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#10151F] border border-[#263447] space-y-3">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span>Commercial Feasibility & White-Label Model</span>
                </h3>
                <p>
                  WHY IPTV adopts a B2B white-label aggregator model rather than acting as an unauthorized pirate stream host:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <h4 className="font-bold text-white text-sm mb-1">Zero Infrastructure Hosting Costs</h4>
                  <p className="text-xs">
                    By pulling from authorized provider CDNs (Akamai, Cloudflare, Fastly), WHY IPTV incurs zero video transcoding or server storage costs.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <h4 className="font-bold text-white text-sm mb-1">B2B Reseller & BDU Agreements</h4>
                  <p className="text-xs">
                    Operators like VMedia and RiverTV already offer white-label reseller programs for ISPs and independent distributors under CRTC exemption orders.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <h4 className="font-bold text-white text-sm mb-1">FAST Ad-Revenue Sharing (SSAI)</h4>
                  <p className="text-xs">
                    Providers like Amagi and Wurl share programmatic ad-insertion revenue generated through connected Smart TV apps.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#10151F] border border-[#263447]">
                  <h4 className="font-bold text-white text-sm mb-1">Future Hardware Ecosystem</h4>
                  <p className="text-xs">
                    Ready to compile into native Android TV (Firestick) APKs for consumer living-room deployment with remote control navigation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#10151F] border border-[#263447] space-y-2">
                <h3 className="text-lg font-black text-white flex items-center space-x-2">
                  <Workflow className="w-5 h-5 text-[#42AAFF]" />
                  <span>Technical System Architecture</span>
                </h3>
                <p className="text-xs">
                  End-to-end pipeline connecting client applications, adaptive HLS engines, and authorized upstream IPTV origins.
                </p>
              </div>

              {/* ASCII / Visual Flow Diagram */}
              <div className="p-5 rounded-2xl bg-[#10151F] border border-[#263447] font-mono text-xs text-slate-300 overflow-x-auto space-y-2">
                <div className="text-emerald-400 font-bold mb-2">
                  +-------------------------------------------------------------------------+
                  <br />
                  |                      WHY IPTV CLIENT ARCHITECTURE                       |
                  <br />
                  +-------------------------------------------------------------------------+
                </div>
                <div>
                  [ User Input: Remote D-Pad / Web GUI / AI Search ]
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼
                  <br />
                  +-------------------------------------------------------------------------+
                  <br />
                  |                   CORE PRESENTATION & STATE LAYER                       |
                  <br />
                  |  * PremiumTvGuide: Horizontal EPG, Sticky 30m Grid, Red Time Indicator  |
                  <br />
                  |  * Player: Hls.js Adaptive Bitrate Engine, Multi-Track Audio & HUD     |
                  <br />
                  |  * SportsCompanionBar & SportsHubView: Real-Time Score Engine           |
                  <br />
                  +-------------------------------------------------------------------------+
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼
                  <br />
                  +-------------------------------------------------------------------------+
                  <br />
                  |               WHY-AI INTELLIGENCE & PROCESSING ENGINE                   |
                  <br />
                  |  * Semantic Intent Parser (queryAiAssistant)                            |
                  <br />
                  |  * Multi-Provider Deduplication Cluster (detectDuplicateChannels)       |
                  <br />
                  |  * Predictive ML Category Classifier (categorizeChannelsWithAi)         |
                  <br />
                  +-------------------------------------------------------------------------+
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼
                  <br />
                  +-------------------------------------------------------------------------+
                  <br />
                  |               AUTHORIZED PROVIDER INTEGRATION LAYER                     |
                  <br />
                  |  * BDU Bridges: VMedia B2B, TekSavvy TV, Bell Fibe SSO, Rogers Xfinity  |
                  <br />
                  |  * Consumer FAST: Pluto TV North America, Plex Live TV, Samsung TV Plus |
                  <br />
                  |  * Broadcasters: CBC Gem, LG Channels, Xumo Play, The Roku Channel     |
                  <br />
                  |  * Cloud Playout Origins: Amagi FAST, Wurl CDN, Frequency Broadcast   |
                  <br />
                  +-------------------------------------------------------------------------+
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
