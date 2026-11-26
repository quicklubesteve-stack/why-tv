import React, { useState } from 'react';
import {
  X,
  Server,
  Key,
  User,
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { XtreamAccountInfo, XtreamCredentials } from '../types';
import { authenticateXtream, fetchXtreamLiveChannels, generateXtreamM3uUrl } from '../utils/xtreamClient';

interface XtreamLoginModalProps {
  onAddXtreamSource: (
    account: XtreamAccountInfo,
    credentials: XtreamCredentials,
    channelsCount: number
  ) => void;
  onClose: () => void;
}

export const XtreamLoginModal: React.FC<XtreamLoginModalProps> = ({
  onAddXtreamSource,
  onClose,
}) => {
  const [serverUrl, setServerUrl] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [useProxy, setUseProxy] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [accountResult, setAccountResult] = useState<XtreamAccountInfo | null>(null);

  const handleTestAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverUrl.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Please fill in Server URL, Username, and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setAccountResult(null);

    const creds: XtreamCredentials = {
      serverUrl: serverUrl.trim(),
      username: username.trim(),
      password: password.trim(),
    };

    try {
      // 1. Authenticate with Xtream API
      const accountInfo = await authenticateXtream(creds, useProxy);
      setAccountResult(accountInfo);

      // 2. Fetch Live Streams
      const channels = await fetchXtreamLiveChannels(
        creds,
        `xtream_${Date.now()}`,
        `${accountInfo.username} (Xtream)`,
        500,
        useProxy
      );

      // 3. Callback to parent to persist
      onAddXtreamSource(accountInfo, creds, channels.length);
    } catch (err: any) {
      console.error('Xtream connection error:', err);
      setErrorMsg(
        err.message ||
          'Could not connect to Xtream Codes server. Check URL, credentials, or enable CORS Proxy.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setServerUrl('http://iptv-demo-portal.com:8080');
    setUsername('demo_subscriber');
    setPassword('demo_pass_2026');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-cable-900 border border-cable-border rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-cable-border bg-cable-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-neutral-950 font-black">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Xtream Codes IPTV Login</h3>
              <p className="text-xs text-slate-400">
                Connect your standard IPTV provider account (Server, Username & Password).
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

        {/* Form Body */}
        <form onSubmit={handleTestAndConnect} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Server URL / Portal DNS</span>
            </label>
            <input
              type="text"
              placeholder="http://your-provider.dns:8080"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="w-full bg-cable-950 border border-cable-border px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-400 block">
              Include the port number (e.g. :8080, :2095, or :25461) provided by your IPTV service.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                placeholder="IPTV username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cable-950 border border-cable-border px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                placeholder="IPTV password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cable-950 border border-cable-border px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* CORS Proxy Helper Toggle */}
          <div className="bg-cable-950 p-3.5 rounded-xl border border-cable-border/80 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                <span>Web CORS Proxy Fallback</span>
              </span>
              <p className="text-[11px] text-slate-400">
                Enable if your IPTV provider server blocks browser requests without CORS headers.
              </p>
            </div>
            <input
              type="checkbox"
              checked={useProxy}
              onChange={(e) => setUseProxy(e.target.checked)}
              className="w-4 h-4 rounded text-amber-400 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Connection Error:</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Success Status Display */}
          {accountResult && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Xtream Codes Account Verified & Connected!</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono pt-1">
                <div>Status: <span className="text-emerald-400">{accountResult.status}</span></div>
                <div>Expiry: <span className="text-amber-300">{accountResult.expDate}</span></div>
                <div>Max Connections: <span>{accountResult.maxConnections}</span></div>
                <div>User: <span>{accountResult.username}</span></div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-slate-400 hover:text-amber-400 transition"
            >
              Fill Sample Credentials
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-cable-800 text-slate-300 text-xs font-semibold hover:bg-cable-700 flex-1 sm:flex-none"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-neutral-800 disabled:text-slate-500 text-neutral-950 font-black text-xs shadow-cable-focus cable-focus-ring flex-1 sm:flex-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Connect & Import</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
