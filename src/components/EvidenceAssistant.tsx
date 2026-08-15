'use client';

import React from 'react';
import { ShieldCheck, ExternalLink, Layers, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { Claim, ClaimVerdict } from '@/types';

interface EvidenceAssistantProps {
  claim: Claim | null;
  onClearSelection: () => void;
}

export const EvidenceAssistant: React.FC<EvidenceAssistantProps> = ({ claim, onClearSelection }) => {
  const getVerdictLabelColor = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'VERIFIED':
        return 'text-cyan-400';
      case 'MISLEADING':
        return 'text-amber-400';
      case 'FALSE':
        return 'text-rose-400';
      case 'OPINION':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  const getVerdictNodeColor = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'VERIFIED':
        return 'fill-cyan-500 stroke-cyan-400';
      case 'MISLEADING':
        return 'fill-amber-500 stroke-amber-400';
      case 'FALSE':
        return 'fill-rose-500 stroke-rose-400';
      case 'OPINION':
        return 'fill-purple-500 stroke-purple-400';
      default:
        return 'fill-slate-700 stroke-slate-600';
    }
  };

  return (
    <div className="saas-card rounded-2xl p-5 flex flex-col h-full shadow-xl min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-900 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-sm text-slate-200 font-sans">Evidence Assistant</h3>
        </div>
        {claim && (
          <button 
            onClick={onClearSelection}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {!claim ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 my-auto">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            {/* Pulsing ring background */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-500/10 animate-spin-slow"></div>
            <div className="w-10 h-10 rounded-full bg-slate-950 border border-slate-900 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-slate-700 animate-pulse" />
            </div>
          </div>
          <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Assistant Dormant</p>
          <p className="text-[10px] text-slate-600 mt-1 font-sans leading-relaxed">
            Select any claim card from the Trust Feed stream to load audit paths, sources, and verification networks.
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between space-y-5 animate-fadeIn">
          <div>
            {/* Overview Meta Tags */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#080c14] border border-slate-900 mb-3.5">
              <div>
                <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">Verdict</span>
                <span className={`text-xs font-black uppercase tracking-wider font-sans ${getVerdictLabelColor(claim.verdict)}`}>
                  {claim.verdict}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-0.5">Confidence</span>
                <span className="font-mono text-sm font-extrabold text-slate-200">
                  {claim.confidence}%
                </span>
              </div>
            </div>

            {/* Claim text block */}
            <div className="mb-4">
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Target Statement</span>
              <p className="text-xs text-slate-200 font-bold leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 font-sans">
                "{claim.claim}"
              </p>
            </div>

            {/* Visual SVG spatial connection network */}
            <div className="mb-4">
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Relational Audit Map</span>
              <div className="bg-slate-950/70 border border-slate-900 rounded-lg p-2 flex items-center justify-center shadow-inner relative">
                <svg className="w-full max-w-[240px] h-[130px] overflow-visible" viewBox="0 0 240 130">
                  {/* Definition for neon glows */}
                  <defs>
                    <filter id="glow-node" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Connecting Line Paths */}
                  {/* Claim -> Source 1 */}
                  <line x1="120" y1="25" x2="60" y2="65" className="stroke-slate-800" strokeWidth="1.5" />
                  <line x1="120" y1="25" x2="60" y2="65" className="stroke-cyan-500/30 path-flow" strokeWidth="1.5" />

                  {/* Claim -> Source 2 */}
                  <line x1="120" y1="25" x2="180" y2="65" className="stroke-slate-800" strokeWidth="1.5" />
                  <line x1="120" y1="25" x2="180" y2="65" className="stroke-cyan-500/30 path-flow" strokeWidth="1.5" />

                  {/* Source 1 -> Verdict */}
                  <line x1="60" y1="65" x2="120" y2="105" className="stroke-slate-800" strokeWidth="1.5" />
                  <line x1="60" y1="65" x2="120" y2="105" className="stroke-cyan-500/20 path-flow" strokeWidth="1.5" />

                  {/* Source 2 -> Verdict */}
                  <line x1="180" y1="65" x2="120" y2="105" className="stroke-slate-800" strokeWidth="1.5" />
                  <line x1="180" y1="65" x2="120" y2="105" className="stroke-cyan-500/20 path-flow" strokeWidth="1.5" />

                  {/* Nodes circles */}
                  {/* Claim Node */}
                  <circle cx="120" cy="25" r="8" className="fill-slate-900 stroke-cyan-500/60 node-pulse" strokeWidth="2" filter="url(#glow-node)" />
                  <text x="120" y="28" textAnchor="middle" className="fill-cyan-400 font-sans font-bold text-[7px]">ASSERT</text>

                  {/* Source 1 Node */}
                  <circle cx="60" cy="65" r="7" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                  <text x="60" y="68" textAnchor="middle" className="fill-slate-400 font-sans text-[6.5px]">SRC 01</text>

                  {/* Source 2 Node */}
                  <circle cx="180" cy="65" r="7" className="fill-slate-900 stroke-slate-700" strokeWidth="1.5" />
                  <text x="180" y="68" textAnchor="middle" className="fill-slate-400 font-sans text-[6.5px]">SRC 02</text>

                  {/* Verdict Node */}
                  <circle cx="120" cy="105" r="10" className={`${getVerdictNodeColor(claim.verdict)} node-pulse`} strokeWidth="2.5" filter="url(#glow-node)" />
                  <text x="120" y="108" textAnchor="middle" className="fill-slate-950 font-sans font-black text-[7.5px]">VERDICT</text>
                </svg>
              </div>
            </div>

            {/* Bias Alert */}
            {claim.biasSignal && (
              <div className="mb-4 flex items-start gap-2 p-2.5 rounded bg-amber-950/20 border border-amber-900/35 text-amber-200 text-[10px] font-sans">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase tracking-wider text-[8px] text-amber-400 mb-0.5">Bias Signal Flagged</span>
                  <p className="text-slate-300 leading-normal">{claim.biasSignal}</p>
                </div>
              </div>
            )}

            {/* Rationale explanation */}
            <div className="mb-4">
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Fact Check Rationale</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#080c14] p-3 rounded-lg border border-slate-900 font-sans">
                {claim.explanation}
              </p>
            </div>
          </div>

          {/* Sources List */}
          {claim.sources && claim.sources.length > 0 && (
            <div>
              <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider block mb-2">Citational References ({claim.sources.length})</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {claim.sources.map((src, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-900 flex flex-col justify-between gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-200 truncate font-sans">{src.title}</span>
                      <span className="text-[8px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {src.domain}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal font-sans">
                      "{src.snippet}"
                    </p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold font-sans uppercase tracking-wider transition-colors"
                    >
                      Inspect Source Reference <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
