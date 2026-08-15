'use client';

import React from 'react';
import { Play, Pause, Square, Trash2, Sparkles, Cpu, Globe, User, Radio } from 'lucide-react';
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
  return (
    <header className="w-full bg-[#03050a]/60 backdrop-blur-md border-b border-slate-900 sticky top-0 z-20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Space Mission Control Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100 font-sans flex items-center gap-2">
          Truth Intelligence Workspace
        </h1>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
          Real-time claims analysis & evidence verification console
        </p>
      </div>

      {/* Right Controls & Connection Status */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Connection status pills as spacecraft telemetry signals */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950/80 border border-slate-900 text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase select-none">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>GROQ</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${liveVerificationAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' : 'bg-amber-400'}`} />
              <span className={liveVerificationAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                {liveVerificationAvailable ? 'ONLINE' : 'FALLBACK'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-950/80 border border-slate-900 text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase select-none">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>TAVILY</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${liveVerificationAvailable ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' : 'bg-amber-400'}`} />
              <span className={liveVerificationAvailable ? 'text-emerald-400' : 'text-amber-400'}>
                {liveVerificationAvailable ? 'ONLINE' : 'FALLBACK'}
              </span>
            </span>
          </div>
        </div>

        {/* Separator line */}
        <div className="h-5 w-px bg-slate-900 hidden md:block" />

        {/* Tactical stream controls */}
        <div className="flex items-center gap-2">
          {!isLive ? (
            <button
              onClick={onStartSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Initiate Stream
            </button>
          ) : isPaused ? (
            <button
              onClick={onStartSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Resume Stream
            </button>
          ) : (
            <button
              onClick={onPauseSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" /> Pause
            </button>
          )}

          {isLive && (
            <button
              onClick={onStopSession}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-950 hover:bg-rose-950/40 text-slate-450 hover:text-rose-400 border border-slate-900 hover:border-rose-900/40 text-xs font-bold tracking-wider uppercase transition-all active:scale-95 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> Abort
            </button>
          )}

          <button
            onClick={onClearSession}
            title="Purge Console Buffer"
            className="p-1.5 rounded bg-slate-950/80 hover:bg-slate-900 text-slate-500 hover:text-slate-350 border border-slate-900 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleDemoMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold tracking-wider uppercase transition-all border cursor-pointer ${
              isDemoMode
                ? 'bg-purple-950/40 text-purple-300 border-purple-900/60 shadow-[0_0_12px_rgba(168,85,247,0.12)]'
                : 'bg-slate-950 text-purple-450 hover:bg-slate-900 border-purple-900/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulation</span>
          </button>

          <div className="h-7 w-7 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-500 hover:text-slate-350 cursor-pointer">
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
