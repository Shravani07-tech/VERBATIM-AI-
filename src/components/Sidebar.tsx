'use client';

import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlayCircle, 
  Radio, 
  Layers, 
  Link2, 
  ShieldAlert, 
  History, 
  FileText, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const getNavItemClass = (viewName: string) => {
    return currentView === viewName 
      ? 'flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold nav-item-active transition-all cursor-pointer'
      : 'flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer';
  };

  const getIconColor = (viewName: string) => {
    return currentView === viewName ? 'text-cyan-400' : 'text-slate-500';
  };

  return (
    <aside className="w-60 flex-shrink-0 bg-[#080c14] border-r border-slate-900 flex flex-col h-screen sticky top-0 py-5 px-4 z-20">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5 px-2 mb-8 animate-fadeIn select-none">
        <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center relative">
          {/* Glowing background ring */}
          <div className="absolute inset-0 rounded-lg bg-cyan-500/10 blur-sm opacity-50" />
          
          <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="sidebarNodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="sidebarShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            {/* Spinning radar tracking ring */}
            <circle cx="50" cy="50" r="38" stroke="url(#sidebarShieldGrad)" strokeWidth="2.5" strokeDasharray="10 8" opacity="0.85" className="animate-spin-ring-fast origin-center" />
            {/* Faint outer boundary */}
            <circle cx="50" cy="50" r="44" stroke="#22d3ee" strokeWidth="1" strokeDasharray="3 12" opacity="0.3" />
            {/* Geometric Shield Outline */}
            <path d="M50 20 C62 20 68 24 72 28 C72 45 68 62 50 78 C32 62 28 45 28 28 C32 24 38 20 50 20 Z" stroke="url(#sidebarShieldGrad)" strokeWidth="4.5" strokeLinejoin="round" fill="#03050a" fillOpacity="0.75" />
            {/* Reticle grid coords */}
            <path d="M50 35 L50 65 M35 50 L65 50" stroke="#22d3ee" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.4" />
            {/* Central glowing verification AI core */}
            <circle cx="50" cy="50" r="12" fill="url(#sidebarNodeGlow)" />
            <circle cx="50" cy="50" r="5" fill="#22d3ee" />
          </svg>
        </div>
        <div>
          <h2 className="font-extrabold text-sm tracking-wider text-slate-100 uppercase">
            Verbatim<span className="text-cyan-400">AI</span>
          </h2>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
            Truth Intelligence
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-6 overflow-y-auto px-1 pr-2">
        {/* Section: Overview */}
        <div>
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2 select-none">
            Overview
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}
              className={getNavItemClass('dashboard')}
            >
              <LayoutDashboard className={`w-4 h-4 ${getIconColor('dashboard')}`} />
              <span>Dashboard</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('live-session'); }}
              className={getNavItemClass('live-session')}
            >
              <PlayCircle className={`w-4 h-4 ${getIconColor('live-session')}`} />
              <span>Live Session</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('trust-feed'); }}
              className={getNavItemClass('trust-feed')}
            >
              <Radio className={`w-4 h-4 ${getIconColor('trust-feed')}`} />
              <span>Trust Feed</span>
            </a>
          </nav>
        </div>

        {/* Section: Intelligence */}
        <div>
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2 select-none">
            Intelligence
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('claims-catalog'); }}
              className={getNavItemClass('claims-catalog')}
            >
              <Layers className={`w-4 h-4 ${getIconColor('claims-catalog')}`} />
              <span>Claims Catalog</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('evidence-nodes'); }}
              className={getNavItemClass('evidence-nodes')}
            >
              <Link2 className={`w-4 h-4 ${getIconColor('evidence-nodes')}`} />
              <span>Evidence Nodes</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('bias-analysis'); }}
              className={getNavItemClass('bias-analysis')}
            >
              <ShieldAlert className={`w-4 h-4 ${getIconColor('bias-analysis')}`} />
              <span>Bias Analysis</span>
            </a>
          </nav>
        </div>

        {/* Section: Session */}
        <div>
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2 select-none">
            Session
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('history-archive'); }}
              className={getNavItemClass('history-archive')}
            >
              <History className={`w-4 h-4 ${getIconColor('history-archive')}`} />
              <span>History Archive</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); onViewChange('session-reports'); }}
              className={getNavItemClass('session-reports')}
            >
              <FileText className={`w-4 h-4 ${getIconColor('session-reports')}`} />
              <span>Session Reports</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Footer Options */}
      <div className="border-t border-slate-900 pt-4 space-y-1.5">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onViewChange('settings'); }}
          className={getNavItemClass('settings')}
        >
          <Settings className={`w-4 h-4 ${getIconColor('settings')}`} />
          <span>Settings</span>
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onViewChange('help-support'); }}
          className={getNavItemClass('help-support')}
        >
          <HelpCircle className={`w-4 h-4 ${getIconColor('help-support')}`} />
          <span>Help Support</span>
        </a>
      </div>
    </aside>
  );
};
