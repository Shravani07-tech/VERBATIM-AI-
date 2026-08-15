'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle, MessageSquareQuote, ShieldAlert, Sparkles, User, Clock, FileText, Share2, Layers } from 'lucide-react';
import { Claim, ClaimVerdict } from '@/types';

interface ClaimDetailModalProps {
  claim: Claim | null;
  onClose: () => void;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose }) => {
  if (!claim) return null;

  const getVerdictBadge = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'VERIFIED':
        return 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.4)]';
      case 'MISLEADING':
        return 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.4)]';
      case 'FALSE':
        return 'bg-rose-500 text-slate-950 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
      case 'OPINION':
        return 'bg-purple-500 text-slate-950 shadow-[0_0_12px_rgba(168,85,247,0.4)]';
      default:
        return 'bg-slate-700 text-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl tactical-panel rounded-xl border border-slate-900 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bracket-corner bracket-tl"></div>
        <div className="bracket-corner bracket-tr"></div>
        <div className="bracket-corner bracket-bl"></div>
        <div className="bracket-corner bracket-br"></div>

        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-900 bg-slate-950/80 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-950/50 border border-cyan-800/40 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.15)]">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-slate-100 uppercase tracking-widest font-mono">Claim Analysis Dossier</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Verification Node Report & Evaluation Matrix</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 z-10">
          {/* Verdict Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 items-center justify-between gap-4 p-4 rounded bg-slate-950 border border-slate-900 relative shadow-inner">
            <div className="bracket-corner bracket-tl opacity-40"></div>
            <div className="bracket-corner bracket-tr opacity-40"></div>
            <div className="bracket-corner bracket-bl opacity-40"></div>
            <div className="bracket-corner bracket-br opacity-40"></div>
            
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-widest block mb-1">Status Verdict</span>
              <span
                className={`inline-flex items-center px-3.5 py-1 rounded text-xs font-black tracking-widest uppercase font-mono ${getVerdictBadge(claim.verdict)}`}
              >
                {claim.verdict}
              </span>
            </div>

            <div className="sm:text-center">
              <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-widest block mb-1">Confidence Score</span>
              <span className="font-mono text-xl font-black text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]">{claim.confidence}%</span>
            </div>

            <div className="sm:text-right">
              <span className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-widest block mb-1">Analysis Mode</span>
              <span className="font-mono text-xs font-black text-purple-400 uppercase">
                {claim.isDemo ? 'SIMULATED DATA' : 'LIVE CONSOLE'}
              </span>
            </div>
          </div>

          {/* Extracted Claim Statement */}
          <div className="relative">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-cyan-500" /> Extracted Claim Statement
            </h3>
            <blockquote className="text-sm font-bold text-slate-100 p-4 rounded bg-slate-950 border border-slate-900 leading-relaxed">
              "{claim.claim}"
            </blockquote>
          </div>

          {/* Speaker & Context Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded bg-slate-950/80 border border-slate-900 flex items-center gap-2.5">
              <User className="w-4 h-4 text-slate-600" />
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block">Source Speaker</span>
                <span className="text-slate-200 font-bold uppercase">{claim.speaker}</span>
              </div>
            </div>
            <div className="p-3 rounded bg-slate-950/80 border border-slate-900 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-slate-600" />
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block">Timestamp Log</span>
                <span className="text-slate-200 font-bold">{claim.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Bias Signal Alert */}
          {claim.biasSignal && (
            <div className="p-4 rounded bg-amber-950/20 border border-amber-900/40 text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1 uppercase font-mono text-[10px] tracking-wider text-amber-400">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Rhetorical Bias Signal Flagged
              </div>
              <p className="font-sans text-slate-300">{claim.biasSignal}</p>
            </div>
          )}

          {/* Rationale Explanation */}
          <div>
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Fact Check Rationale
            </h3>
            <div className="p-4 rounded bg-slate-950 border border-slate-900 text-xs text-slate-300 leading-relaxed font-sans shadow-inner">
              {claim.explanation}
            </div>
          </div>

          {/* Evidence Sources Connection Diagram */}
          {claim.sources && claim.sources.length > 0 && (
            <div>
              <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
                <Layers className="w-3.5 h-3.5 text-cyan-500" /> Web Evidence Mapping Diagram
              </h3>
              
              {/* Telemetry connector flow diagram */}
              <div className="bg-slate-950 p-3 rounded border border-slate-900 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase relative mb-4">
                <div className="bracket-corner bracket-tl opacity-30"></div>
                <div className="bracket-corner bracket-tr opacity-30"></div>
                <div className="bracket-corner bracket-bl opacity-30"></div>
                <div className="bracket-corner bracket-br opacity-30"></div>
                
                <div className="text-cyan-400">CLAIM NODE</div>
                <div className="text-slate-800">-----------------</div>
                <div className="text-cyan-500/80 animate-pulse">TAVILY SEARCH APERTURE</div>
                <div className="text-slate-800">-----------------</div>
                <div className="text-cyan-400">CITED SOURCES ({claim.sources.length})</div>
              </div>

              <div className="space-y-3">
                {claim.sources.map((src, idx) => (
                  <div key={idx} className="p-4 rounded bg-slate-950/80 border border-slate-900 space-y-2.5 relative">
                    <div className="flex items-center justify-between gap-2 z-10 relative">
                      <span className="font-bold text-xs text-slate-200 font-sans">{src.title}</span>
                      <span className="text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {src.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic z-10 relative bg-slate-950/60 p-2.5 rounded border border-slate-900">
                      "{src.snippet}"
                    </p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 font-bold font-mono uppercase tracking-wider z-10 relative transition-colors"
                    >
                      Retrieve Source Node <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/90 text-right z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold font-mono uppercase tracking-wider border border-slate-800 transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
