'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, MessageSquareQuote, Sparkles, HelpCircle, ChevronRight, Radio } from 'lucide-react';
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
          textColor: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/20',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />,
        };
      case 'MISLEADING':
        return {
          textColor: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'FALSE':
        return {
          textColor: 'text-rose-400',
          bgColor: 'bg-rose-500/10 border-rose-500/20',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'OPINION':
        return {
          textColor: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/20',
          icon: <MessageSquareQuote className="w-3.5 h-3.5 text-purple-400" />,
        };
      case 'ANALYZING':
        return {
          textColor: 'text-slate-400',
          bgColor: 'bg-slate-500/10 border-slate-500/20',
          icon: <Sparkles className="w-3.5 h-3.5 text-slate-400 animate-spin" />,
        };
      default:
        return {
          textColor: 'text-slate-400',
          bgColor: 'bg-slate-800/40 border-slate-800/60',
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const style = getVerdictStyle(claim.verdict);
  const sourcesCount = claim.sources ? claim.sources.length : 0;

  return (
    <div
      onClick={() => onSelectClaim(claim)}
      className="group saas-card rounded-xl p-4.5 border border-slate-900/65 cursor-pointer flex flex-col justify-between relative overflow-hidden"
    >
      {/* Absolute corner telemetry ticks */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-slate-700/35 pointer-events-none group-hover:border-cyan-500/40 transition-colors"></div>
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-slate-700/35 pointer-events-none group-hover:border-cyan-500/40 transition-colors"></div>
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-slate-700/35 pointer-events-none group-hover:border-cyan-500/40 transition-colors"></div>
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-slate-700/35 pointer-events-none group-hover:border-cyan-500/40 transition-colors"></div>

      {/* Holographic scanner line overlay on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="scanner-line" />
      </div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase font-sans ${style.bgColor} ${style.textColor}`}>
            {style.icon}
            {claim.verdict}
          </span>
          {claim.category && (
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              SIG-{claim.category.substring(0, 3)}
            </span>
          )}
        </div>
        
        <span className="text-xs font-mono font-extrabold text-slate-350 flex items-center gap-1">
          {claim.confidence}% <span className="text-[9px] font-bold text-slate-550 font-sans">CONF</span>
        </span>
      </div>

      {/* Claim statement text */}
      <h4 className="text-[13px] font-bold text-slate-100 leading-snug tracking-tight mb-2 hover:text-cyan-400 transition-colors relative z-10">
        {claim.claim}
      </h4>

      {/* Explanation summary */}
      <p className="text-xs text-slate-400 leading-relaxed font-sans mb-3.5 relative z-10">
        {claim.explanation}
      </p>

      {/* Bottom Metadata Info */}
      <div className="flex items-center justify-between text-[10px] font-sans border-t border-slate-900/50 pt-2.5 text-slate-500 relative z-10">
        <div className="flex items-center gap-2">
          {/* Signal status bars */}
          <div className="flex items-end gap-0.5 h-3.5 pr-1.5" title="Signal Strength">
            <div className="w-0.75 h-1.5 rounded-sm bg-cyan-500/40"></div>
            <div className="w-0.75 h-2.5 rounded-sm bg-cyan-500/75"></div>
            <div className="w-0.75 h-3.5 rounded-sm bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.4)] animate-pulse"></div>
          </div>
          <span className="uppercase font-semibold tracking-wider font-mono text-[9px] text-slate-450">{claim.speaker}</span>
          <span>·</span>
          <span className="font-mono text-[9px]">{claim.timestamp}</span>
        </div>
        
        {sourcesCount > 0 ? (
          <span className="flex items-center gap-0.5 font-bold text-cyan-400/90 hover:text-cyan-300 transition-colors uppercase tracking-widest text-[9px] font-mono">
            {sourcesCount} NODES <ChevronRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </span>
        ) : (
          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest font-mono">
            NO CITES
          </span>
        )}
      </div>
    </div>
  );
};
