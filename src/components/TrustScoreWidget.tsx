'use client';

import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { SessionStats } from '@/types';

interface TrustScoreWidgetProps {
  stats: SessionStats;
}

export const TrustScoreWidget: React.FC<TrustScoreWidgetProps> = ({ stats }) => {
  const score = stats.sessionTrustScore;
  
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 stroke-emerald-500';
    if (val >= 60) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-xl font-extrabold font-mono ${getScoreColor(score).split(' ')[0]}`}>
              {score}%
            </span>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">Trust</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Session Trust Index</h3>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mt-0.5 leading-relaxed">
            Dynamic real-time credibility metric computed from extracted evidence and verified claims.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-xl px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </div>
          <span className="font-mono text-base font-bold text-emerald-300">{stats.verifiedCount}</span>
        </div>

        <div className="bg-amber-950/40 border border-amber-800/50 rounded-xl px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" /> Misleading
          </div>
          <span className="font-mono text-base font-bold text-amber-300">{stats.misleadingCount}</span>
        </div>

        <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-rose-400 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> False
          </div>
          <span className="font-mono text-base font-bold text-rose-300">{stats.falseCount}</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" /> Unverified
          </div>
          <span className="font-mono text-base font-bold text-slate-300">{stats.unverifiedCount + stats.opinionCount}</span>
        </div>
      </div>
    </div>
  );
};
