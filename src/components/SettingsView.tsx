import React, { useState } from 'react';
import {
  Upload,
  Link as LinkIcon,
  RefreshCw,
  Trash2,
  ShieldAlert,
  SlidersHorizontal,
  Clock,
  Layers,
  Info,
  Server,
  AlertTriangle,
  FolderOpen,
  Globe,
  Layout,
  Zap,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import {
  PlaylistSource,
  CategoryConfig,
  TimeZoneSetting,
  UiThemeMode,
  PresetProvider,
  XtreamAccountInfo,
  XtreamCredentials,
} from '../types';
import { PRESET_PROVIDERS } from '../data/demoData';

interface SettingsViewProps {
  sources: PlaylistSource[];
  onAddM3uUrl: (name: string, url: string, isPrivate: boolean) => Promise<void>;
  onAddM3uFile: (name: string, content: string, isPrivate: boolean) => void;
  onRefreshSource: (sourceId: string) => Promise<void>;
  onDeleteSource: (sourceId: string) => void;
  onAddXmltvUrl: (url: string) => Promise<void>;
  onAddXmltvFile: (content: string) => void;
  onOpenCategoryManager: () => void;
  onOpenMappingModal: () => void;
  onOpenXtreamModal: () => void;
  timeZone: TimeZoneSetting;
  onSetTimeZone: (tz: TimeZoneSetting) => void;
  uiTheme: UiThemeMode;
  onSetUiTheme: (theme: UiThemeMode) => void;
  onClearAllData: () => void;
  unmatchedCount: number;
  xtreamAccount?: XtreamAccountInfo;
  onConnectPreset: (preset: PresetProvider) => Promise<void>;
  corsProxyEnabled: boolean;
  onToggleCorsProxy: () => void;
  onOpenProviderHub?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  sources,
  onAddM3uUrl,
  onAddM3uFile,
  onRefreshSource,
  onDeleteSource,
  onAddXmltvUrl,
  onAddXmltvFile,
  onOpenCategoryManager,
  onOpenMappingModal,
  onOpenXtreamModal,
  timeZone,
  onSetTimeZone,
  uiTheme,
  onSetUiTheme,
  onClearAllData,
  unmatchedCount,
  xtreamAccount,
  onConnectPreset,
  corsProxyEnabled,
  onToggleCorsProxy,
  onOpenProviderHub,
}) => {
  // M3U Add states
  const [m3uName, setM3uName] = useState<string>('');
  const [m3uUrl, setM3uUrl] = useState<string>('');
  const [m3uIsPrivate, setM3uIsPrivate] = useState<boolean>(true);
  const [m3uLoading, setM3uLoading] = useState<boolean>(false);
  const [m3uMessage, setM3uMessage] = useState<string | null>(null);

  // XMLTV Add states
  const [xmltvUrl, setXmltvUrl] = useState<string>('');
  const [xmltvLoading, setXmltvLoading] = useState<boolean>(false);
  const [xmltvMessage, setXmltvMessage] = useState<string | null>(null);

  // Preset connecting state
  const [connectingPresetId, setConnectingPresetId] = useState<string | null>(null);

  // Refresh loading state per source
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

  // Reset confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleM3uUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uUrl.trim()) return;
    setM3uLoading(true);
    setM3uMessage(null);
    try {
      await onAddM3uUrl(m3uName.trim() || 'My IPTV Playlist', m3uUrl.trim(), m3uIsPrivate);
      setM3uUrl('');
      setM3uName('');
      setM3uMessage('Playlist successfully added and parsed!');
    } catch (err: any) {
      setM3uMessage(`Error: ${err.message || 'Failed to fetch playlist'}`);
    } finally {
      setM3uLoading(false);
    }
  };

  const handleM3uFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onAddM3uFile(file.name.replace(/\.[^/.]+$/, ''), content, m3uIsPrivate);
        setM3uMessage(`Loaded playlist from ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleXmltvUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xmltvUrl.trim()) return;
    setXmltvLoading(true);
    setXmltvMessage(null);
    try {
      await onAddXmltvUrl(xmltvUrl.trim());
      setXmltvUrl('');
      setXmltvMessage('XMLTV EPG listings imported and matched!');
    } catch (err: any) {
      setXmltvMessage(`Error: ${err.message || 'Failed to fetch XMLTV data'}`);
    } finally {
      setXmltvLoading(false);
    }
  };

  const handleXmltvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onAddXmltvFile(content);
        setXmltvMessage(`Imported XMLTV listings from ${file.name}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRefresh = async (sourceId: string) => {
    setRefreshingId(sourceId);
    try {
      await onRefreshSource(sourceId);
    } finally {
      setRefreshingId(null);
    }
  };

  const handlePresetClick = async (preset: PresetProvider) => {
    setConnectingPresetId(preset.id);
    try {
      await onConnectPreset(preset);
      setM3uMessage(`Connected ${preset.name} successfully!`);
    } catch (err: any) {
      setM3uMessage(`Failed to connect preset: ${err.message}`);
    } finally {
      setConnectingPresetId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      <div className="border-b border-cable-border pb-4">
        <h2 className="text-2xl font-black text-white">WHY TV Settings & Providers</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure Xtream Codes, M3U8 playlists, modern UI themes, timezones, and browser privacy.
        </p>
      </div>

      {/* 1. Modern UI Layout & Theme Switcher */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 text-amber-400 border-b border-cable-border pb-3">
          <Layout className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold text-white">IPTV User Interface Layout</h3>
            <p className="text-xs text-slate-400">
              Select between industry-standard IPTV layouts: TiviMate, Smarters Pro, or Classic Cable Box.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* TiviMate Tri-Pane */}
          <div
            onClick={() => onSetUiTheme('tivimate')}
            role="button"
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 cable-focus-ring ${
              uiTheme === 'tivimate'
                ? 'bg-amber-950/40 border-amber-400 shadow-cable-focus'
                : 'bg-cable-950 border-cable-border hover:bg-cable-850'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">TiviMate Tri-Pane</span>
                {uiTheme === 'tivimate' && (
                  <span className="text-[10px] font-mono bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Category Drawer + Channel List + Embedded Live Video & Multi-Hour Timeline. The #1 modern layout.
              </p>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">Recommended</span>
          </div>

          {/* Smarters Pro Hub */}
          <div
            onClick={() => onSetUiTheme('smarters')}
            role="button"
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 cable-focus-ring ${
              uiTheme === 'smarters'
                ? 'bg-amber-950/40 border-amber-400 shadow-cable-focus'
                : 'bg-cable-950 border-cable-border hover:bg-cable-850'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">IPTV Smarters Hub</span>
                {uiTheme === 'smarters' && (
                  <span className="text-[10px] font-mono bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Dashboard hub with large Live TV, Multi-Screen, Cinema, TV Guide, and Account Info tiles.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Dashboard style</span>
          </div>

          {/* Classic Cable Box */}
          <div
            onClick={() => onSetUiTheme('cable')}
            role="button"
            className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between space-y-2 cable-focus-ring ${
              uiTheme === 'cable'
                ? 'bg-amber-950/40 border-amber-400 shadow-cable-focus'
                : 'bg-cable-950 border-cable-border hover:bg-cable-850'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Classic Cable Box</span>
                {uiTheme === 'cable' && (
                  <span className="text-[10px] font-mono bg-amber-400 text-black px-1.5 py-0.2 rounded font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Lean-back 10-foot home view with full-width video stage, OSD banners, and classic cable guide.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Traditional Set-Top</span>
          </div>
        </div>
      </section>

      {/* 2. Universal Authorized IPTV Provider Integrations */}
      {onOpenProviderHub && (
        <section className="bg-gradient-to-r from-cable-900 via-cable-900 to-emerald-950/40 border border-emerald-500/50 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cable-border pb-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-400 text-neutral-950 flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">Authorized IPTV Provider Connections</h3>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    12 INFRASTRUCTURES
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Integrate existing B2B FAST syndicators (Amagi, Wurl), Canadian BDUs (VMedia, TekSavvy), and live sports.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenProviderHub}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold rounded-xl text-xs shadow-lg cable-focus-ring shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Open Provider Hub</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-cable-950/80 p-3 rounded-lg border border-cable-border/70">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Amagi & Wurl</span>
              <span className="text-amber-300 font-bold">FAST Syndication</span>
            </div>
            <div className="bg-cable-950/80 p-3 rounded-lg border border-cable-border/70">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">VMedia & RiverTV</span>
              <span className="text-emerald-300 font-bold">White-Label BDU</span>
            </div>
            <div className="bg-cable-950/80 p-3 rounded-lg border border-cable-border/70">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">TekSavvy TV</span>
              <span className="text-sky-300 font-bold">Independent BDU</span>
            </div>
            <div className="bg-cable-950/80 p-3 rounded-lg border border-cable-border/70">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">DAZN & Sportsnet+</span>
              <span className="text-purple-300 font-bold">Sports Connectors</span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Xtream Codes Provider Connection */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-cable-border pb-3">
          <div className="flex items-center space-x-3">
            <Server className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Xtream Codes API Provider</h3>
              <p className="text-xs text-slate-400">
                Connect directly using Server URL, Username, and Password (the standard IPTV format).
              </p>
            </div>
          </div>

          <button
            onClick={onOpenXtreamModal}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold rounded-xl text-xs shadow-cable-focus cable-focus-ring"
          >
            <Server className="w-4 h-4" />
            <span>{xtreamAccount ? 'Manage Xtream Account' : 'Connect Xtream Account'}</span>
          </button>
        </div>

        {xtreamAccount ? (
          <div className="p-4 bg-cable-950 rounded-xl border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{xtreamAccount.username}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                  {xtreamAccount.status}
                </span>
              </div>
              <div className="text-slate-400 flex items-center space-x-3 font-mono text-[11px]">
                <span>Server: {xtreamAccount.serverUrl}</span>
                <span>•</span>
                <span>Expires: {xtreamAccount.expDate}</span>
                <span>•</span>
                <span>Max Connections: {xtreamAccount.maxConnections}</span>
              </div>
            </div>

            <button
              onClick={onOpenXtreamModal}
              className="text-xs text-amber-400 hover:underline"
            >
              Switch Account
            </button>
          </div>
        ) : (
          <div className="p-4 bg-cable-950 rounded-xl border border-dashed border-cable-border flex items-center justify-between text-xs text-slate-400">
            <span>No Xtream Codes account connected. Click above to login with your provider.</span>
            <button
              onClick={onOpenXtreamModal}
              className="text-amber-400 hover:underline font-bold"
            >
              Login now
            </button>
          </div>
        )}
      </section>

      {/* 3. 1-Click Popular Curated Free IPTV Providers */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 text-amber-400 border-b border-cable-border pb-3">
          <Zap className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold text-white">1-Click Curated Free & FAST Providers</h3>
            <p className="text-xs text-slate-400">
              One-click instant load for popular legal public IPTV channels and rolling schedules.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_PROVIDERS.map((preset) => (
            <div
              key={preset.id}
              className="bg-cable-950 p-4 rounded-xl border border-cable-border flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-cable-800 text-amber-300 px-2 py-0.5 rounded border border-cable-border">
                    {preset.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ~{preset.channelCount} Channels
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <button
                onClick={() => handlePresetClick(preset)}
                disabled={connectingPresetId === preset.id}
                className="w-full py-2 bg-cable-800 hover:bg-cable-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-cable-border flex items-center justify-center space-x-1.5 transition cable-focus-ring"
              >
                {connectingPresetId === preset.id ? (
                  <>
                    <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Importing Channels...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Connect & Load</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Active Playlist Sources (M3U / M3U8) */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-cable-border pb-3">
          <div className="flex items-center space-x-3">
            <Layers className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Active Channel Sources</h3>
              <p className="text-xs text-slate-400">
                Manage your playlists. Refresh anytime without losing your favourite channels.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-cable-border/70 border border-cable-border/80 rounded-xl overflow-hidden bg-cable-950">
          {sources.map((src) => (
            <div key={src.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-white">{src.name}</span>
                  <span className="text-[10px] uppercase font-mono bg-cable-800 text-amber-300 px-2 py-0.5 rounded border border-cable-border">
                    {src.type}
                  </span>
                  {src.isPrivate && (
                    <span className="text-[10px] uppercase font-mono bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded border border-rose-900">
                      Private
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-3">
                  <span>{src.channelCount} Channels</span>
                  <span>•</span>
                  <span>Updated {new Date(src.lastUpdated).toLocaleDateString()}</span>
                  {src.url && <span className="truncate max-w-xs text-slate-400">({src.url})</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {src.type === 'url' && (
                  <button
                    onClick={() => handleRefresh(src.id)}
                    disabled={refreshingId === src.id}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cable-800 hover:bg-cable-700 text-slate-200 text-xs font-semibold border border-cable-border cable-focus-ring"
                    title="Refresh channel playlist while keeping favourites"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${refreshingId === src.id ? 'animate-spin text-amber-400' : ''}`}
                    />
                    <span>Refresh</span>
                  </button>
                )}

                {src.id !== 'demo_why_tv' && (
                  <button
                    onClick={() => onDeleteSource(src.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-neutral-900 transition"
                    title="Delete source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add M3U URL / File Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <form onSubmit={handleM3uUrlSubmit} className="space-y-3 bg-cable-950/60 p-4 rounded-xl border border-cable-border">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase font-mono">
              <Globe className="w-4 h-4" />
              <span>Add M3U / M3U8 Playlist URL</span>
            </div>

            <input
              type="text"
              placeholder="Source Name (e.g. My Provider)"
              value={m3uName}
              onChange={(e) => setM3uName(e.target.value)}
              className="w-full bg-cable-900 border border-cable-border px-3 py-2 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />

            <input
              type="url"
              placeholder="https://example.com/playlist.m3u8"
              value={m3uUrl}
              onChange={(e) => setM3uUrl(e.target.value)}
              className="w-full bg-cable-900 border border-cable-border px-3 py-2 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={m3uIsPrivate}
                  onChange={(e) => setM3uIsPrivate(e.target.checked)}
                  className="rounded text-amber-400 focus:ring-amber-400"
                />
                <span>Private URL (never sent to telemetry)</span>
              </label>

              <button
                type="submit"
                disabled={m3uLoading || !m3uUrl.trim()}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-slate-500 text-neutral-950 font-bold rounded-lg text-xs cable-focus-ring"
              >
                {m3uLoading ? 'Fetching...' : 'Add URL'}
              </button>
            </div>
          </form>

          <div className="space-y-3 bg-cable-950/60 p-4 rounded-xl border border-cable-border flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <Upload className="w-4 h-4" />
                <span>Upload .M3U File Directly</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Direct file upload avoids browser CORS restrictions.
              </p>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-cable-border hover:border-amber-400 rounded-xl p-4 cursor-pointer bg-cable-900/50 hover:bg-cable-900 transition">
              <FolderOpen className="w-6 h-6 text-amber-400 mb-1" />
              <span className="text-xs font-semibold text-slate-200">Click to Select M3U File</span>
              <input
                type="file"
                accept=".m3u,.m3u8,text/plain"
                onChange={handleM3uFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {m3uMessage && (
          <div className="p-3 bg-cable-950 rounded-lg border border-amber-400/40 text-xs text-amber-300 flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{m3uMessage}</span>
          </div>
        )}
      </section>

      {/* 5. XMLTV EPG Management */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-cable-border pb-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-lg font-bold text-white">XMLTV Programme Guide (EPG)</h3>
              <p className="text-xs text-slate-400">
                Import XMLTV schedule files to populate show titles, times, descriptions, and categories.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMappingModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cable-800 hover:bg-cable-700 text-amber-300 text-xs font-semibold border border-amber-400/40 cable-focus-ring"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Manual Link ({unmatchedCount} unmatched)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleXmltvUrlSubmit} className="space-y-3 bg-cable-950/60 p-4 rounded-xl border border-cable-border">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase font-mono">
              <Globe className="w-4 h-4" />
              <span>Import XMLTV URL</span>
            </div>
            <input
              type="url"
              placeholder="https://example.com/epg.xml"
              value={xmltvUrl}
              onChange={(e) => setXmltvUrl(e.target.value)}
              className="w-full bg-cable-900 border border-cable-border px-3 py-2 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={xmltvLoading || !xmltvUrl.trim()}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-slate-500 text-neutral-950 font-bold rounded-lg text-xs cable-focus-ring"
            >
              {xmltvLoading ? 'Loading XMLTV...' : 'Fetch XMLTV'}
            </button>
          </form>

          <div className="space-y-3 bg-cable-950/60 p-4 rounded-xl border border-cable-border flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <Upload className="w-4 h-4" />
                <span>Upload XMLTV File</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload your provider's .xml guide file directly.
              </p>
            </div>

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-cable-border hover:border-amber-400 rounded-xl p-4 cursor-pointer bg-cable-900/50 hover:bg-cable-900 transition">
              <FolderOpen className="w-6 h-6 text-amber-400 mb-1" />
              <span className="text-xs font-semibold text-slate-200">Click to Select .XML File</span>
              <input
                type="file"
                accept=".xml,.xmltv,text/xml"
                onChange={handleXmltvFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {xmltvMessage && (
          <div className="p-3 bg-cable-950 rounded-lg border border-amber-400/40 text-xs text-amber-300 flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>{xmltvMessage}</span>
          </div>
        )}
      </section>

      {/* 6. Regional Preferences & CORS Proxy */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="border-b border-cable-border pb-3">
          <h3 className="text-lg font-bold text-white">Regional Timezone & CORS Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time Zone */}
          <div className="space-y-2 bg-cable-950/60 p-4 rounded-xl border border-cable-border">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono">TV Guide Time Zone</span>
            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => onSetTimeZone('device')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  timeZone === 'device'
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-cable-focus'
                    : 'bg-cable-900 text-slate-300 border-cable-border hover:bg-cable-800'
                }`}
              >
                Device Time
              </button>
              <button
                onClick={() => onSetTimeZone('America/Toronto')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  timeZone === 'America/Toronto'
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-cable-focus'
                    : 'bg-cable-900 text-slate-300 border-cable-border hover:bg-cable-800'
                }`}
              >
                America / Toronto (ET)
              </button>
            </div>
          </div>

          {/* CORS Proxy Toggle */}
          <div className="space-y-2 bg-cable-950/60 p-4 rounded-xl border border-cable-border flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase font-mono">Global CORS Proxy Fallback</span>
              <p className="text-[11px] text-slate-400 mt-1">
                Route stream requests through a proxy when provider servers do not send cross-origin headers.
              </p>
            </div>
            <button
              onClick={onToggleCorsProxy}
              className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center justify-center space-x-2 ${
                corsProxyEnabled
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                  : 'bg-cable-900 border-cable-border text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{corsProxyEnabled ? 'CORS Proxy: ENABLED' : 'CORS Proxy: DISABLED (Direct)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Privacy & Factory Reset */}
      <section className="bg-cable-900 border border-cable-border rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-3 text-amber-400 border-b border-cable-border pb-3">
          <ShieldAlert className="w-6 h-6" />
          <h3 className="text-lg font-bold text-white">Privacy & Local Storage</h3>
        </div>

        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            All IPTV provider logins, playlists, and view histories remain strictly on this Acer laptop in your browser's private local storage.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h4 className="text-sm font-bold text-white">Clear Saved Data</h4>
            <p className="text-xs text-slate-400">
              Erase all custom playlists, favourites, recents, and reset to defaults.
            </p>
          </div>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 font-bold text-xs rounded-xl border border-red-800 cable-focus-ring"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Saved Data</span>
          </button>
        </div>
      </section>

      {/* Reset Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cable-900 border border-red-500/60 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Reset & Clear All Data?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will permanently delete all added playlist sources, custom channel categories, favourites, and viewing history.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg bg-cable-800 text-slate-300 text-xs font-semibold hover:bg-cable-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowClearConfirm(false);
                  onClearAllData();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                Yes, Clear All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
