'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Search, Sparkles } from 'lucide-react';
import { Claim, SessionStats } from '@/types';
import { TrustScoreWidget } from './TrustScoreWidget';
import { ClaimCard } from './ClaimCard';

interface TrustFeedProps {
  claims: Claim[];
  stats: SessionStats;
  onSelectClaim: (claim: Claim) => void;
}

export const TrustFeed: React.FC<TrustFeedProps> = ({ claims, stats, onSelectClaim }) => {
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'FLAGGED' | 'FALSE' | 'OPINION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [ticker, setTicker] = useState(0);

  // Re-render periodically for active scanning animation ticks when analyzing
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const filteredClaims = claims.filter((c) => {
    if (filter === 'VERIFIED' && c.verdict !== 'VERIFIED') return false;
    if (filter === 'FLAGGED' && (c.verdict !== 'MISLEADING' && c.verdict !== 'FALSE')) return false;
    if (filter === 'FALSE' && c.verdict !== 'FALSE') return false;
    if (filter === 'OPINION' && c.verdict !== 'OPINION') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.claim.toLowerCase().includes(q) ||
        c.explanation.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate active step index for Space Telemetry Sequence
  const getActiveStep = () => {
    if (claims.length === 0) return 0; // SPEECH / LISTENING
    if (claims[0].verdict === 'ANALYZING') {
      // Rotate steps 1, 2, 3 dynamically to simulate processing
      return (ticker % 3) + 1;
    }
    return 4; // TRUST REALIGNED
  };

  const activeStep = getActiveStep();
  const stages = [
    { label: 'SPEECH', desc: 'Audio Signal Ingestion' },
    { label: 'DETECTION', desc: 'Assertion Captured' },
    { label: 'SCANNING', desc: 'Evidence Search' },
    { label: 'EVALUATION', desc: 'Verdict Analysis' },
    { label: 'REALIGNED', desc: 'Index Synchronized' }
  ];

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Dynamic 3D Glass Orb Centerpiece Card */}
      <TrustScoreWidget stats={stats} />

      {/* Spacecraft Telemetry Stepper Sequence Banner */}
      <div className="saas-card rounded-xl p-3 bg-[#0a101c]/45 border border-slate-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.25)] relative overflow-hidden flex items-center justify-between gap-1.5 flex-nowrap w-full">
        {/* Style block for local pipeline flow arrow animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pipeline-flow {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-pipeline-flow {
            animation: pipeline-flow 1.5s linear infinite;
          }
        `}} />
        
        {stages.map((stage, idx) => {
          const isActive = activeStep === idx;
          const isCompleted = activeStep > idx;
          
          return (
            <React.Fragment key={stage.label}>
              {idx > 0 && (
                <div className="flex-1 h-[1.5px] border-t border-dashed border-slate-800/80 relative min-w-[6px] overflow-hidden select-none">
                  {/* Flowing animated light particles */}
                  {(isActive || isCompleted) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full h-full animate-pipeline-flow" />
                  )}
                </div>
              )}
              <div 
                className={`flex items-center gap-1.5 transition-all duration-300 ${
                  isActive ? 'text-cyan-400 font-bold scale-[1.01]' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}
                title={stage.desc}
              >
                <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isActive 
                    ? 'bg-cyan-500/25 border-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)] animate-pulse' 
                    : isCompleted 
                      ? 'bg-cyan-950/60 border-cyan-800/40' 
                      : 'bg-transparent border-slate-850'
                }`}>
                  {isCompleted && <span className="w-1 h-1 rounded-full bg-cyan-400/80" />}
                </div>
                <span className="text-[9px] uppercase font-mono tracking-wider select-none whitespace-nowrap hidden sm:inline">
                  {stage.label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Live Trust Feed Card */}
      <div className="flex-1 saas-card rounded-2xl p-5 flex flex-col min-h-[450px] shadow-xl relative">
        {/* Feed Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-900 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-200 font-sans">Live Trust Feed</h3>
            <span className="px-2 py-0.5 rounded-full font-mono text-[9px] bg-slate-950 border border-slate-900 text-slate-400 font-semibold">
              {filteredClaims.length}
            </span>
          </div>

          {/* SaaS Tab Navigation pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'VERIFIED', 'FLAGGED', 'FALSE', 'OPINION'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase font-sans transition-all cursor-pointer border ${
                  filter === f
                    ? 'filter-tab-active shadow-inner'
                    : 'bg-transparent text-slate-500 hover:text-slate-300 border-transparent filter-tab-hover'
                }`}
              >
                {f.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search bar input */}
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, evidence or topics..."
            className="w-full bg-[#080c14] border border-slate-900 focus:border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs font-sans text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
          />
        </div>

        {/* Claim Cards Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[calc(100vh-320px)] relative">
          {filteredClaims.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-slate-500 my-auto">
              <Sparkles className="w-5 h-5 text-slate-700 mb-2 animate-pulse" />
              <p className="font-bold text-xs uppercase tracking-widest text-slate-400">No assertions logged</p>
              <p className="text-[10px] text-slate-600 mt-1 font-sans">Verification results will appear as speech is captured.</p>
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} onSelectClaim={onSelectClaim} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
