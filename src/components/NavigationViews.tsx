'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Link2, 
  ShieldAlert, 
  History, 
  FileText, 
  Settings as SettingsIcon, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  Terminal,
  Search,
  Radio,
  Clock,
  Shield,
  Activity
} from 'lucide-react';
import { Claim, SessionStats, EvidenceSource } from '@/types';

// ==========================================
// 1. CLAIMS CATALOG VIEW
// ==========================================
interface ClaimsCatalogViewProps {
  claims: Claim[];
  onSelectClaim: (claim: Claim) => void;
}

export const ClaimsCatalogView: React.FC<ClaimsCatalogViewProps> = ({ claims, onSelectClaim }) => {
  const [filter, setFilter] = useState<'ALL' | 'VERIFIED' | 'FALSE' | 'FLAGGED' | 'OPINION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = claims.filter(c => {
    if (filter === 'VERIFIED' && c.verdict !== 'VERIFIED') return false;
    if (filter === 'FLAGGED' && (c.verdict !== 'MISLEADING' && c.verdict !== 'FALSE')) return false;
    if (filter === 'FALSE' && c.verdict !== 'FALSE') return false;
    if (filter === 'OPINION' && c.verdict !== 'OPINION') return false;
    
    return c.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
           c.explanation.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">Claims Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">Review, filter, and audit all assertions captured in this session.</p>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(['ALL', 'VERIFIED', 'FLAGGED', 'FALSE', 'OPINION'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer border ${
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

      <div className="relative">
        <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter catalog by keyword or explanation text..."
          className="w-full bg-[#080c14] border border-slate-900 focus:border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs font-sans text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 saas-card rounded-xl min-h-[320px] bg-[#0a101c]/45 border border-slate-900/60 text-center">
          <Layers className="w-7 h-7 text-slate-700 mb-3 animate-pulse" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">Catalog Empty</h4>
          <p className="text-[10px] text-slate-500 font-sans mt-1 max-w-sm leading-relaxed">
            No assertions match the active filters or have been logged in the active session yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((claim) => {
            const getBadgeColor = (verdict: string) => {
              switch (verdict) {
                case 'VERIFIED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                case 'MISLEADING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                case 'FALSE': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                default: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
              }
            };
            return (
              <div 
                key={claim.id} 
                onClick={() => onSelectClaim(claim)}
                className="group saas-card rounded-xl p-4.5 border border-slate-900/65 bg-[#0a101c]/45 hover:border-cyan-500/20 transition-all cursor-pointer flex flex-col justify-between tilt-card"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${getBadgeColor(claim.verdict)}`}>
                      {claim.verdict}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{claim.timestamp}</span>
                  </div>
                  <h4 className="text-[12px] font-bold text-slate-200 group-hover:text-cyan-400 transition-colors mb-1.5 leading-snug">
                    {claim.claim}
                  </h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-2">
                    {claim.explanation}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-900/40 pt-2.5 mt-3 text-[9px] text-slate-500 font-mono">
                  <span>SPEAKER: {claim.speaker}</span>
                  <span className="text-cyan-400/90 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    {claim.sources ? claim.sources.length : 0} NODES <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. EVIDENCE NODES VIEW
// ==========================================
interface EvidenceNodesViewProps {
  claims: Claim[];
}

export const EvidenceNodesView: React.FC<EvidenceNodesViewProps> = ({ claims }) => {
  const claimsWithEvidence = claims.filter(c => c.sources && c.sources.length > 0);
  const [selectedClaimId, setSelectedClaimId] = useState<string>(
    claimsWithEvidence.length > 0 ? claimsWithEvidence[0].id : ''
  );

  useEffect(() => {
    if (claimsWithEvidence.length > 0 && !selectedClaimId) {
      setSelectedClaimId(claimsWithEvidence[0].id);
    }
  }, [claims]);

  const activeClaim = claimsWithEvidence.find(c => c.id === selectedClaimId) || null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">Evidence Nodes</h2>
        <p className="text-xs text-slate-500 mt-1">Audit cited research networks, sources, and node connection coordinates.</p>
      </div>

      {claimsWithEvidence.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 saas-card rounded-xl min-h-[320px] bg-[#0a101c]/45 border border-slate-900/60 text-center">
          <Link2 className="w-7 h-7 text-slate-700 mb-3 animate-pulse" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">No Evidence Logged</h4>
          <p className="text-[10px] text-slate-500 font-sans mt-1 max-w-sm leading-relaxed">
            Evidence analysis runs automatically when live search fetches index sources for claims.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Claim selector */}
          <div className="lg:col-span-4 space-y-2 max-h-[480px] overflow-y-auto pr-1">
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-550 px-1">Source Claims</span>
            {claimsWithEvidence.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedClaimId(c.id)}
                className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedClaimId === c.id
                    ? 'border-cyan-500/40 bg-cyan-950/10 shadow-[0_0_8px_rgba(6,182,212,0.08)]'
                    : 'border-slate-900 bg-[#0a101c]/25 hover:border-slate-800'
                }`}
              >
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  {c.verdict}
                </span>
                <p className="text-[11px] font-bold text-slate-300 line-clamp-2 leading-tight">
                  {c.claim}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Network graph and source nodes detail */}
          <div className="lg:col-span-8 space-y-4">
            {activeClaim ? (
              <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 space-y-5">
                <div className="border-b border-slate-900/60 pb-3">
                  <span className="text-[8px] font-mono font-bold tracking-widest uppercase text-slate-500 block mb-1">Target Statement</span>
                  <h4 className="text-[13px] font-bold text-slate-200 leading-snug">{activeClaim.claim}</h4>
                </div>

                {/* SVG Visual connection logic */}
                <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-900/60 relative overflow-hidden flex flex-col items-center">
                  <span className="text-[8px] font-mono text-slate-650 absolute top-2 right-3">NODE GRAPH RELATION</span>
                  
                  {/* Visual Node Diagram */}
                  <div className="flex items-center justify-between w-full max-w-md my-4 relative z-10">
                    <div className="w-12 h-12 rounded-full border border-cyan-500/35 bg-cyan-950/20 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.15)] flex-shrink-0">
                      <Terminal className="w-5 h-5 text-cyan-400" />
                    </div>

                    <div className="flex-1 h-0.5 border-t border-dashed border-cyan-500/25 relative mx-4">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-[-4px] left-1/2 -translate-x-1/2 animate-ping" />
                    </div>

                    <div className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900/80 flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  <span className="text-[9px] font-mono font-bold text-cyan-400/90 tracking-widest uppercase mt-2">
                    Verified against {activeClaim.sources?.length || 0} index nodes
                  </span>
                </div>

                {/* List of references */}
                <div className="space-y-3">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 block">Node Details</span>
                  {activeClaim.sources?.map((src, index) => (
                    <div key={index} className="p-3.5 bg-slate-950/20 border border-slate-900/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold text-slate-300 font-sans block">{src.title}</span>
                        <a 
                          href={src.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors p-0.5 flex-shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <span className="inline-block text-[8px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-500 uppercase tracking-widest select-none">
                        {src.domain}
                      </span>
                      <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                        {src.snippet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 border border-dashed border-slate-900 rounded-lg">
                <p className="text-xs uppercase tracking-widest font-mono">Select a claim to audit connections</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 3. BIAS ANALYSIS VIEW
// ==========================================
interface BiasAnalysisViewProps {
  claims: Claim[];
  stats: SessionStats;
}

export const BiasAnalysisView: React.FC<BiasAnalysisViewProps> = ({ claims, stats }) => {
  const verifiedCount = claims.filter(c => c.verdict === 'VERIFIED').length;
  const falseCount = claims.filter(c => c.verdict === 'FALSE').length;
  const misleadingCount = claims.filter(c => c.verdict === 'MISLEADING').length;
  const opinionCount = claims.filter(c => c.verdict === 'OPINION').length;
  const total = claims.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">Bias Analysis</h2>
        <p className="text-xs text-slate-500 mt-1">Aggregate fact distribution curves and telemetry skew checks.</p>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 saas-card rounded-xl min-h-[320px] bg-[#0a101c]/45 border border-slate-900/60 text-center">
          <ShieldAlert className="w-7 h-7 text-slate-700 mb-3 animate-pulse" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">Diagnostics Standby</h4>
          <p className="text-[10px] text-slate-500 font-sans mt-1 max-w-sm leading-relaxed">
            Diagnostics and factual skew measurements will run once claims are logged inside the stream.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel: Aggregates bar graph */}
          <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 space-y-5">
            <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-550">Factual Distribution</span>
            
            <div className="space-y-4">
              {/* Verified progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-cyan-400">VERIFIED FACTS</span>
                  <span>{verifiedCount} ({total > 0 ? Math.round((verifiedCount/total)*100) : 0}%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-cyan-400" style={{ width: `${total > 0 ? (verifiedCount/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* False progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-rose-400">FALSE CLAIMS</span>
                  <span>{falseCount} ({total > 0 ? Math.round((falseCount/total)*100) : 0}%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-rose-450" style={{ width: `${total > 0 ? (falseCount/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* Misleading progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-amber-400">MISLEADING ACCENTS</span>
                  <span>{misleadingCount} ({total > 0 ? Math.round((misleadingCount/total)*100) : 0}%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-amber-400" style={{ width: `${total > 0 ? (misleadingCount/total)*100 : 0}%` }} />
                </div>
              </div>

              {/* Opinions progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-purple-400">SUBJECTIVE OPINIONS</span>
                  <span>{opinionCount} ({total > 0 ? Math.round((opinionCount/total)*100) : 0}%)</span>
                </div>
                <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                  <div className="h-full bg-purple-500" style={{ width: `${total > 0 ? (opinionCount/total)*100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Metric analysis description */}
          <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 flex flex-col justify-between">
            <div>
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-550 block mb-4">Diagnostics Evaluation</span>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900/50 pb-2">
                  <span className="text-xs text-slate-450 font-sans">Verification Trust Rating</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">{stats.sessionTrustScore}%</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-900/50 pb-2">
                  <span className="text-xs text-slate-450 font-sans">Dialogue Fact Density</span>
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {total > 0 ? Math.round(((total - opinionCount) / total) * 100) : 0}% Factual
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-900/50 pb-2">
                  <span className="text-xs text-slate-450 font-sans">Factual Correction Ratio</span>
                  <span className="text-xs font-bold text-rose-400 font-mono">
                    {total > 0 ? Math.round(((falseCount + misleadingCount) / total) * 100) : 0}% Skewed
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/30 rounded border border-slate-900/80 mt-4 text-[10px] text-slate-500 font-sans leading-relaxed">
              <strong>Skew Analysis Note:</strong> Subjective assertions (Opinions) are omitted from Trust Index calculations to avoid penalizing open discourse. Factual skews represent active corrections generated by the research network.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. HISTORY ARCHIVE VIEW
// ==========================================
export const HistoryArchiveView: React.FC = () => {
  const [persistedData, setPersistedData] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('verbatimai_session_v1');
        if (saved) {
          setPersistedData(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load local storage session in History Archive:', e);
      }
    }
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">History Archive</h2>
        <p className="text-xs text-slate-500 mt-1">Access cached telemetry files preserved locally in browser storage.</p>
      </div>

      {!persistedData ? (
        <div className="flex flex-col items-center justify-center p-12 saas-card rounded-xl min-h-[320px] bg-[#0a101c]/45 border border-slate-900/60 text-center">
          <History className="w-7 h-7 text-slate-700 mb-3 animate-pulse" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">Archive Clear</h4>
          <p className="text-[10px] text-slate-500 font-sans mt-1 max-w-sm leading-relaxed">
            No local session data found in `localStorage`. Begin a session to populate the browser cache.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">File Type</span>
              <p className="text-xs font-bold text-cyan-400 font-mono mt-0.5">LOCAL_CACHE_v1</p>
            </div>
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Claims Logged</span>
              <p className="text-xs font-bold text-slate-200 font-mono mt-0.5">{persistedData.claims?.length || 0} assertions</p>
            </div>
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Trust Index Score</span>
              <p className="text-xs font-bold text-slate-200 font-mono mt-0.5">{persistedData.claims ? Math.max(10, Math.min(100, 100 - (persistedData.claims.filter((c: any) => c.verdict === 'FALSE').length * 25 + persistedData.claims.filter((c: any) => c.verdict === 'MISLEADING').length * 12) / persistedData.claims.length * 1.5)) : 100}%</p>
            </div>
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500">Active Duration</span>
              <p className="text-xs font-bold text-slate-200 font-mono mt-0.5">{formatDuration(persistedData.durationSeconds || 0)}</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950/20 rounded border border-slate-900 text-[10px] text-slate-550 leading-relaxed font-sans">
            <strong>Sandbox Offline Cache Notice:</strong> Multi-session historical databases are disabled inside this environment. To avoid third-party servers, only the active session is persisted within your local client sandbox.
          </div>

          {/* List of claims from last cached session */}
          {persistedData.claims && persistedData.claims.length > 0 && (
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-500 block px-1">Restored Assertions</span>
              <div className="space-y-2.5">
                {persistedData.claims.map((c: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-950/40 border border-slate-900/60 rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono font-bold text-slate-500">#{idx+1}</span>
                      <p className="text-xs font-medium text-slate-350 line-clamp-1">{c.claim}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wide px-2 py-0.5 rounded bg-slate-900 border border-slate-850">
                      {c.verdict}
                    </span>
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

// ==========================================
// 5. SESSION REPORTS VIEW
// ==========================================
interface SessionReportsViewProps {
  claims: Claim[];
  stats: SessionStats;
  durationSeconds: number;
}

export const SessionReportsView: React.FC<SessionReportsViewProps> = ({ claims, stats, durationSeconds }) => {
  const verifiedCount = claims.filter(c => c.verdict === 'VERIFIED').length;
  const falseCount = claims.filter(c => c.verdict === 'FALSE').length;
  const misleadingCount = claims.filter(c => c.verdict === 'MISLEADING').length;
  const opinionCount = claims.filter(c => c.verdict === 'OPINION').length;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">Session Reports</h2>
        <p className="text-xs text-slate-500 mt-1">Export-ready fact-checking briefings and narrative audits.</p>
      </div>

      {claims.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 saas-card rounded-xl min-h-[320px] bg-[#0a101c]/45 border border-slate-900/60 text-center">
          <FileText className="w-7 h-7 text-slate-700 mb-3 animate-pulse" />
          <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-slate-400">Report Inactive</h4>
          <p className="text-[10px] text-slate-500 font-sans mt-1 max-w-sm leading-relaxed">
            Reports generate dynamically during sessions. Capture claims to review briefing structures.
          </p>
        </div>
      ) : (
        <div className="saas-card rounded-xl p-6 border border-slate-900 bg-slate-950/45 shadow-xl space-y-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="border-b border-slate-900 pb-4 text-center">
            <h3 className="text-sm font-black tracking-widest text-cyan-400 uppercase font-mono">VERBATIMAI VERIFICATION BRIEF</h3>
            <p className="text-[9px] text-slate-500 font-mono mt-1 font-bold">TELEMETRY DIAGNOSTICS REPORT // CLASSIFIED CONSOLE LOG</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 text-center border-b border-slate-900 pb-5">
            <div>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Session Score</span>
              <span className="text-lg font-black text-slate-200 mt-0.5 block font-sans">{stats.sessionTrustScore}%</span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Total Scans</span>
              <span className="text-lg font-black text-slate-200 mt-0.5 block font-sans">{claims.length}</span>
            </div>
            <div>
              <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest block">Time Elapsed</span>
              <span className="text-lg font-black text-slate-200 mt-0.5 block font-sans">{formatDuration(durationSeconds)}</span>
            </div>
          </div>

          {/* SKEWS ACCENTS */}
          {(falseCount + misleadingCount) > 0 && (
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-rose-450 block border-b border-slate-900/60 pb-1">Factual Alerts</span>
              <div className="space-y-2">
                {claims.filter(c => c.verdict === 'FALSE' || c.verdict === 'MISLEADING').map((c, idx) => (
                  <div key={idx} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono font-black text-rose-400 uppercase tracking-widest">
                        {c.verdict}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600">{c.timestamp}</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-350 leading-tight mb-1">{c.claim}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERIFIED ITEMS */}
          {verifiedCount > 0 && (
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-cyan-400 block border-b border-slate-900/60 pb-1">Verified Telemetry</span>
              <div className="space-y-2">
                {claims.filter(c => c.verdict === 'VERIFIED').map((c, idx) => (
                  <div key={idx} className="p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                    <p className="text-[11px] font-bold text-slate-300 leading-tight mb-1">{c.claim}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{c.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-900 pt-4 text-center">
            <p className="text-[9px] font-mono text-slate-600">CONFIRMATION NODE: VERBATIMAI_CLIENT_ENGINE_v0.1</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. SETTINGS VIEW
// ==========================================
interface SettingsViewProps {
  liveVerificationAvailable: boolean;
  isDemoMode: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ liveVerificationAvailable, isDemoMode }) => {
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechRecognitionSupported(Boolean(SpeechRecognition));
    }
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">System Settings</h2>
        <p className="text-xs text-slate-500 mt-1">Review system operational statuses, API configurations, and sandbox integrations.</p>
      </div>

      <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 space-y-5">
        <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-slate-550 block">Capability Status Deck</span>
        
        <div className="space-y-3.5">
          {/* Groq */}
          <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900/50 rounded-lg">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-200 font-sans">Groq Llama-3 Node</h4>
              <p className="text-[10px] text-slate-550 font-medium">Text extraction and claim evaluation services</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-mono border ${
              liveVerificationAvailable ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {liveVerificationAvailable ? 'ONLINE' : 'OFFLINE // FALLBACK'}
            </span>
          </div>

          {/* Tavily */}
          <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900/50 rounded-lg">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-200 font-sans">Tavily Search Engine</h4>
              <p className="text-[10px] text-slate-550 font-medium">Factual reference nodes extraction indexing</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-mono border ${
              liveVerificationAvailable ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              {liveVerificationAvailable ? 'ONLINE' : 'OFFLINE // FALLBACK'}
            </span>
          </div>

          {/* Speech */}
          <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900/50 rounded-lg">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-200 font-sans">Speech Recognition Service</h4>
              <p className="text-[10px] text-slate-550 font-medium">Native browser transcript signals parser</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-mono border ${
              speechRecognitionSupported ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
            }`}>
              {speechRecognitionSupported ? 'AVAILABLE' : 'UNSUPPORTED'}
            </span>
          </div>

          {/* Demo Mode */}
          <div className="flex items-center justify-between p-3 bg-slate-950/30 border border-slate-900/50 rounded-lg">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-200 font-sans">Telemetry Simulation Engine</h4>
              <p className="text-[10px] text-slate-550 font-medium">Offline mock dialogue sequencer controls</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest font-mono border ${
              isDemoMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}>
              {isDemoMode ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. HELP SUPPORT VIEW
// ==========================================
export const HelpSupportView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-100 font-sans uppercase tracking-wide">Documentation Center</h2>
        <p className="text-xs text-slate-500 mt-1">Review operational specifications, architecture pipelines, and guides.</p>
      </div>

      <div className="space-y-5">
        {/* Intro */}
        <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 space-y-2">
          <h4 className="text-sm font-bold text-slate-200 font-sans">What is VerbatimAI?</h4>
          <p className="text-xs text-slate-450 leading-relaxed font-sans">
            VerbatimAI is a premium factual intelligence deck designed to monitor live spoken streams, extract factual declarations, execute automated search indexing across web references, and align a composite truth score in real time.
          </p>
        </div>

        {/* Pipeline Stepper */}
        <div className="saas-card rounded-xl p-5 border border-slate-900/60 bg-[#0a101c]/45 space-y-4">
          <h4 className="text-sm font-bold text-slate-200 font-sans">The Verification Pipeline</h4>
          <div className="space-y-3.5">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">1</div>
              <div>
                <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Speech Ingestion</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Captures audio signals via browser microphones, outputting text blocks to the live conversation panel.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">2</div>
              <div>
                <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Claim Extraction</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Runs linguistic extraction via LLM patterns to isolate testable factual assertions from opinions.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">3</div>
              <div>
                <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Evidence Scraping</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Scrapes references and index snippets across global web domains utilizing Tavily search.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">4</div>
              <div>
                <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Consensus Analysis</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Evaluates assertions against scrapings, assigning verified, false, or misleading labels with rationale details.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-5 h-5 rounded bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0 mt-0.5">5</div>
              <div>
                <h5 className="text-xs font-bold text-slate-350 uppercase tracking-wider font-mono">Telemetry Realignment</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Recalculates active Session Trust Index scoring recursively based on registered skews and assertions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
