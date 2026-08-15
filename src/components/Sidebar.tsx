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

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#080c14] border-r border-slate-900 flex flex-col h-screen sticky top-0 py-5 px-4 z-20">
      {/* Brand Identity */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/40">
          <ShieldCheck className="w-4.5 h-4.5 text-white animate-pulse" />
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
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2">
            Overview
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold nav-item-active transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-slate-500" />
              <span>Live Session</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <Radio className="w-4 h-4 text-slate-500" />
              <span>Trust Feed</span>
            </a>
          </nav>
        </div>

        {/* Section: Intelligence */}
        <div>
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2">
            Intelligence
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Claims Catalog</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <Link2 className="w-4 h-4 text-slate-500" />
              <span>Evidence Nodes</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>Bias Analysis</span>
            </a>
          </nav>
        </div>

        {/* Section: Session */}
        <div>
          <h4 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase px-2 mb-2">
            Session
          </h4>
          <nav className="space-y-1.5">
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>History Archive</span>
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Session Reports</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Footer Options */}
      <div className="border-t border-slate-900 pt-4 space-y-1.5">
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </a>
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold text-slate-400 nav-item-hover transition-all cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Help Support</span>
        </a>
      </div>
    </aside>
  );
};
