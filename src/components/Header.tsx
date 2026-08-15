'use client';

import React from 'react';
import { Play, Pause, Square, Trash2, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SessionStats } from '@/types';

interface HeaderProps {
  isLive: boolean;
  isPaused: boolean;
  isDemoMode: boolean;
  liveVerificationAvailable: boolean;
  stats: SessionStats;
  onStartSession: () => void;
  onPauseSession: () => void;
  onStopSession: () => void;
  onClearSession: () => void;
  onToggleDemoMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLive,
  isPaused,
  isDemoMode,
  liveVerificationAvailable,
  stats,
  onStartSession,
  onPauseSession,
  onStopSession,
  onClearSession,
  onToggleDemoMode,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const flaggedCount = stats.misleadingCount + stats.falseCount;

  return (
    <header className="w-full glass-panel border-b border-slate-800/80 sticky top-0 z-30 px-4 py-3 md:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Verbatim<span className="text-cyan-400">AI</span>
              </h1>
              {/* Status Indicator Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                  isDemoMode
                    ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                    : isLive && !isPaused
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 live-pulse'
                    : isPaused
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-purple-400' : isLive && !isPaused ? 'bg-emerald-400' : isPaused ? 'bg-amber-400' : 'bg-slate-500'}`} />
                {isDemoMode ? 'DEMO MODE' : isLive && !isPaused ? 'LIVE' : isPaused ? 'PAUSED' : 'IDLE'}
              </div>
            </div>
            <p className="text-xs text-slate-400 tracking-wide font-medium">
              Real-Time Truth Intelligence Copilot
            </p>
          </div>
        </div>

        {/* Center: Live Session Ticker Stats */}
        <div className="flex items-center justify-around md:justify-center gap-4 bg-slate-900/90 border border-slate-800/80 rounded-xl px-4 py-2 text-xs font-mono text-slate-300">
          <div className="text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Time</span>
            <span className="font-bold text-slate-200">{formatTime(stats.durationSeconds)}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Claims</span>
            <span className="font-bold text-slate-200">{stats.totalClaims}</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Verified</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {stats.verifiedCount}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-slate-500 block text-[10px] uppercase font-sans">Flagged</span>
            <span className="font-bold text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {flaggedCount}
            </span>
          </div>
        </div>

        {/* Right: Controls & Demo Mode Toggle */}
        <div className="flex items-center justify-end gap-2 flex-wrap">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <span className={`w-2 h-2 rounded-full ${liveVerificationAvailable ? 'bg-cyan-400' : 'bg-amber-400'}`} />
            {liveVerificationAvailable ? 'Groq & Tavily Active' : 'Fallback Verification'}
          </div>

          {!isLive ? (
            <button
              onClick={onStartSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-900/30 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Start Session
            </button>
          ) : isPaused ? (
            <button
              onClick={onStartSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Resume
            </button>
          ) : (
            <button
              onClick={onPauseSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/80 hover:bg-amber-500/90 text-white font-medium text-xs border border-amber-500/30 transition-all active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
            </button>
          )}

          {isLive && (
            <button
              onClick={onStopSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 font-medium text-xs border border-slate-700 hover:border-rose-800/60 transition-all active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Stop
            </button>
          )}

          <button
            onClick={onClearSession}
            title="Clear current session data"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isDemoMode
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40'
                : 'bg-slate-900 text-purple-400 hover:bg-slate-800 border-purple-900/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isDemoMode ? 'Demo Mode Active' : 'Demo Mode'}
          </button>
        </div>
      </div>
    </header>
  );
};
