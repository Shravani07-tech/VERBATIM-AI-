'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search, Filter, Sparkles, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';
import { Claim, ClaimVerdict, SessionStats } from '@/types';
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

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top: Session Trust Score Widget */}
      <TrustScoreWidget stats={stats} />

      {/* Trust Feed Command Container */}
      <div className="flex-1 glass-panel rounded-2xl p-4 border border-slate-800/80 flex flex-col min-h-[450px]">
        {/* Feed Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Live Trust Feed</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-slate-800 text-slate-300 font-semibold">
              {filteredClaims.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['ALL', 'VERIFIED', 'FLAGGED', 'FALSE', 'OPINION'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950/50'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search claims, evidence topics, or categories..."
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Claim Cards Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 max-h-[calc(100vh-340px)]">
          {filteredClaims.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-8 text-slate-500 my-auto">
              <Sparkles className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
              <p className="font-medium text-sm text-slate-400">No claims matched current criteria</p>
              <p className="text-xs text-slate-600 mt-1">Claims will appear in real-time as speech is processed.</p>
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
