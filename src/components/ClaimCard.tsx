'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle, MessageSquareQuote, ExternalLink, Sparkles, ShieldAlert } from 'lucide-react';
import { Claim, ClaimVerdict } from '@/types';

interface ClaimCardProps {
  claim: Claim;
  onSelectClaim: (claim: Claim) => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onSelectClaim }) => {
  const getVerdictStyle = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300',
          badge: 'bg-emerald-500 text-slate-950',
          icon: <CheckCircle2 className="w-3.5 h-3.5 fill-current" />,
        };
      case 'MISLEADING':
        return {
          bg: 'bg-amber-950/80 border-amber-800/80 text-amber-300',
          badge: 'bg-amber-500 text-slate-950',
          icon: <AlertCircle className="w-3.5 h-3.5 fill-current" />,
        };
      case 'FALSE':
        return {
          bg: 'bg-rose-950/80 border-rose-800/80 text-rose-300',
          badge: 'bg-rose-500 text-slate-950',
          icon: <XCircle className="w-3.5 h-3.5 fill-current" />,
        };
      case 'OPINION':
        return {
          bg: 'bg-purple-950/80 border-purple-800/80 text-purple-300',
          badge: 'bg-purple-500 text-slate-950',
          icon: <MessageSquareQuote className="w-3.5 h-3.5 fill-current" />,
        };
      case 'ANALYZING':
        return {
          bg: 'bg-cyan-950/80 border-cyan-800/80 text-cyan-300 animate-pulse',
          badge: 'bg-cyan-500 text-slate-950 animate-pulse',
          icon: <Sparkles className="w-3.5 h-3.5 animate-spin" />,
        };
      default:
        return {
          bg: 'bg-slate-900/80 border-slate-800 text-slate-400',
          badge: 'bg-slate-700 text-slate-200',
          icon: <HelpCircle className="w-3.5 h-3.5" />,
        };
    }
  };

  const style = getVerdictStyle(claim.verdict);

  return (
    <div
      onClick={() => onSelectClaim(claim)}
      className="group glass-card rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer hover:shadow-2xl hover:border-cyan-500/30"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase ${style.badge}`}>
            {style.icon}
            {claim.verdict}
          </span>

          {claim.category && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700">
              {claim.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-300">{claim.confidence}%</span>
            <span className="text-[9px] text-slate-500 block uppercase font-sans">Confidence</span>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
              claim.isDemo
                ? 'bg-purple-950/60 text-purple-400 border-purple-800/50'
                : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50'
            }`}
          >
            {claim.isDemo ? 'DEMO EVIDENCE' : 'LIVE VERIFICATION'}
          </span>
        </div>
      </div>

      <blockquote className="text-sm font-semibold text-slate-100 mb-3 leading-snug group-hover:text-cyan-300 transition-colors">
        "{claim.claim}"
      </blockquote>

      {claim.biasSignal && (
        <div className="mb-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span>BIAS SIGNAL: {claim.biasSignal}</span>
        </div>
      )}

      <p className="text-xs text-slate-300/90 leading-relaxed mb-4 font-sans bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
        {claim.explanation}
      </p>

      {claim.sources && claim.sources.length > 0 && (
        <div className="border-t border-slate-800/80 pt-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">
            Evidence Sources ({claim.sources.length})
          </span>
          <div className="space-y-2">
            {claim.sources.slice(0, 2).map((src, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-semibold text-slate-200 truncate block">{src.title}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{src.domain}</span>
                </div>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 rounded bg-slate-800 hover:bg-cyan-900/40 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span>{claim.speaker}</span>
        <span>{claim.timestamp}</span>
      </div>
    </div>
  );
};
