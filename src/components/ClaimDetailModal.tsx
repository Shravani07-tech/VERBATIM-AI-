'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle, MessageSquareQuote, ShieldAlert, Sparkles, User, Clock, FileText } from 'lucide-react';
import { Claim } from '@/types';

interface ClaimDetailModalProps {
  claim: Claim | null;
  onClose: () => void;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({ claim, onClose }) => {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Claim Intelligence Analysis</h2>
              <p className="text-xs text-slate-400">Deep-dive verification report & evidence evaluation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Verdict Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status Verdict</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-xl text-sm font-black tracking-wider uppercase ${
                  claim.verdict === 'VERIFIED'
                    ? 'bg-emerald-500 text-slate-950'
                    : claim.verdict === 'MISLEADING'
                    ? 'bg-amber-500 text-slate-950'
                    : claim.verdict === 'FALSE'
                    ? 'bg-rose-500 text-slate-950'
                    : claim.verdict === 'OPINION'
                    ? 'bg-purple-500 text-slate-950'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                {claim.verdict}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Verification Confidence</span>
              <span className="font-mono text-xl font-extrabold text-cyan-400">{claim.confidence}%</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Mode</span>
              <span className="font-mono text-xs font-semibold text-purple-300">
                {claim.isDemo ? 'DEMO EVIDENCE' : 'LIVE VERIFICATION'}
              </span>
            </div>
          </div>

          {/* Extracted Claim Statement */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Extracted Claim Statement
            </h3>
            <blockquote className="text-base font-semibold text-slate-100 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 leading-relaxed">
              "{claim.claim}"
            </blockquote>
          </div>

          {/* Speaker & Context Metadata */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-500 block">Speaker</span>
                <span className="text-slate-200 font-bold">{claim.speaker}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-500 block">Timestamp</span>
                <span className="text-slate-200 font-bold">{claim.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Bias Signal (if present) */}
          {claim.biasSignal && (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs">
              <div className="flex items-center gap-2 font-bold mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Rhetorical Bias Alert
              </div>
              <p>{claim.biasSignal}</p>
            </div>
          )}

          {/* Rationale Explanation */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Fact Check Rationale
            </h3>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
              {claim.explanation}
            </div>
          </div>

          {/* Evidence Sources */}
          {claim.sources && claim.sources.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Cited Evidence Sources ({claim.sources.length})
              </h3>
              <div className="space-y-3">
                {claim.sources.map((src, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-100">{src.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-slate-800">
                        {src.domain}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic">"{src.snippet}"</p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      View Source Reference <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
