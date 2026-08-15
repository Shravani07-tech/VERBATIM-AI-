'use client';

import React from 'react';
import { SessionStats } from '@/types';

interface TrustScoreWidgetProps {
  stats: SessionStats;
}

export const TrustScoreWidget: React.FC<TrustScoreWidgetProps> = ({ stats }) => {
  const score = stats.sessionTrustScore;

  const getScoreDescription = (val: number) => {
    if (val >= 80) return 'Credibility Confirmed';
    if (val >= 60) return 'Signal Warning';
    return 'Anomaly Detected';
  };

  const getScoreColorClass = (val: number) => {
    if (val >= 80) return 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]';
    if (val >= 60) return 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]';
    return 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]';
  };

  const getScoreRGB = (val: number) => {
    if (val >= 80) return '6, 182, 212'; // Cyan
    if (val >= 60) return '245, 158, 11'; // Amber
    return '244, 63, 94'; // Rose
  };

  const rgb = getScoreRGB(score);

  return (
    <div className="saas-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
      {/* Background atmospheric orbital line gradient */}
      <div 
        className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-all duration-500"
        style={{ background: `radial-gradient(circle, rgba(${rgb}, 0.08) 0%, transparent 70%)` }}
      />
      
      <div className="flex items-center gap-6 w-full md:w-auto">
        {/* Concentric Orbital Intelligence Scanner */}
        <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0 select-none">
          
          {/* Layered Rotating Concentric Telemetry Circles */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
            {/* 1. Outer dashed orbital scanner ring */}
            <circle
              cx="64"
              cy="64"
              r="58"
              fill="none"
              stroke={`rgba(${rgb}, 0.12)`}
              strokeWidth="1"
              strokeDasharray="6 4"
              className="animate-spin-ring-fast origin-center"
            />
            {/* 2. Middle reverse-rotating tracking ring */}
            <circle
              cx="64"
              cy="64"
              r="50"
              fill="none"
              stroke={`rgba(${rgb}, 0.22)`}
              strokeWidth="1.5"
              strokeDasharray="10 32"
              className="animate-spin-ring-reverse-medium origin-center"
            />
            {/* 3. Inner pulsing solid telemetry line */}
            <circle
              cx="64"
              cy="64"
              r="44"
              fill="none"
              stroke={`rgba(${rgb}, 0.3)`}
              strokeWidth="0.75"
              className="animate-pulse"
            />
            
            {/* Tracking coordinates ticker marks */}
            <line x1="64" y1="4" x2="64" y2="8" stroke={`rgba(${rgb}, 0.4)`} strokeWidth="1" />
            <line x1="64" y1="120" x2="64" y2="124" stroke={`rgba(${rgb}, 0.4)`} strokeWidth="1" />
            <line x1="4" y1="64" x2="8" y2="64" stroke={`rgba(${rgb}, 0.4)`} strokeWidth="1" />
            <line x1="120" y1="64" x2="124" y2="64" stroke={`rgba(${rgb}, 0.4)`} strokeWidth="1" />
          </svg>

          {/* Central Glass Orb Sphere Body */}
          <div className="absolute w-20 h-20 rounded-full glass-orb flex items-center justify-center z-10">
            {/* Inner orbital shadow ring */}
            <div className="absolute inset-1.5 rounded-full border border-white/5 bg-slate-950/20"></div>

            {/* Central Trust score readout */}
            <div className="flex flex-col items-center justify-center text-center z-15">
              <span className={`text-2xl font-black font-sans leading-none tracking-tight transition-all duration-500 ${getScoreColorClass(score)}`}>
                {score}%
              </span>
              <span className="text-[7px] font-bold uppercase tracking-widest text-slate-450 mt-1 font-mono">
                Trust Score
              </span>
            </div>
          </div>

          {/* Floating Spatial Signal Nodes */}
          {stats.verifiedCount > 0 && (
            <div 
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] node-pulse z-15"
              style={{ animationDelay: '0s' }}
              title="Verified Claims Detected"
            />
          )}

          {(stats.misleadingCount > 0 || stats.falseCount > 0) && (
            <div 
              className="absolute bottom-3 -left-0.5 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)] node-pulse z-15"
              style={{ animationDelay: '0.8s' }}
              title="Anomalies Flagged"
            />
          )}

          {stats.totalClaims > 0 && (
            <div 
              className="absolute bottom-2 right-3 w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)] node-pulse z-15"
              style={{ animationDelay: '1.4s' }}
              title="Cited Verification Points"
            />
          )}
        </div>

        {/* Text descriptions */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full animate-ping`} style={{ backgroundColor: `rgb(${rgb})` }} />
            <span className="text-[10px] font-bold uppercase tracking-widest font-mono" style={{ color: `rgb(${rgb})` }}>
              Telemetry Active
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1 font-sans">
            {getScoreDescription(score)} Detected
          </h3>
          <p className="text-xs text-slate-450 mt-1 leading-relaxed font-sans max-w-sm">
            Dynamic system credibility calculations mapped instantly across claims extraction channels and cited references.
          </p>
        </div>
      </div>

      {/* Overview indicators */}
      <div className="flex items-center gap-6 border-t border-slate-900/60 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto justify-around md:justify-end">
        <div className="text-center md:text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bias Signals</span>
          <span className="font-sans text-lg font-bold text-slate-200">{stats.biasSignalsCount}</span>
        </div>
        <div className="h-8 w-px bg-slate-900/80 hidden md:block" />
        <div className="text-center md:text-right">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">System State</span>
          <span className="font-mono text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            {stats.verifiedCount === 0 && stats.totalClaims === 0 ? 'STANDBY' : 'VERIFYING'}
          </span>
        </div>
      </div>
    </div>
  );
};
