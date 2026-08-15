'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Radio, Sparkles, Terminal } from 'lucide-react';
import { TranscriptSegment } from '@/types';

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  isLive: boolean;
  isDemoMode: boolean;
  onAddTranscriptSegment: (text: string, speaker?: string) => void;
  onStartMic: () => void;
  onStopMic: () => void;
  isMicActive: boolean;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  transcript,
  isLive,
  isDemoMode,
  onAddTranscriptSegment,
  onStartMic,
  onStopMic,
  isMicActive,
}) => {
  const [manualInput, setManualInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onAddTranscriptSegment(manualInput.trim(), 'USER');
    setManualInput('');
  };

  return (
    <div className="flex flex-col h-full saas-card rounded-2xl overflow-hidden shadow-xl">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-cyan-950/20 border border-cyan-800/10 text-cyan-400">
            <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-200 font-sans">Live Conversation</h3>
              {isLive && (
                <div className="flex items-end gap-[2px] h-3 px-1 mb-0.5" title="Signal feed active">
                  <div className="w-[2px] bg-cyan-400/90 rounded-sm animate-wave-bar-1" />
                  <div className="w-[2px] bg-cyan-400/90 rounded-sm animate-wave-bar-2" />
                  <div className="w-[2px] bg-cyan-400/90 rounded-sm animate-wave-bar-3" />
                  <div className="w-[2px] bg-cyan-400/90 rounded-sm animate-wave-bar-4" />
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Real-time transcript and claim detection</p>
          </div>
        </div>

        {/* Mic Toggle */}
        <div>
          {!isDemoMode && (
            <button
              onClick={isMicActive ? onStopMic : onStartMic}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                isMicActive
                  ? 'bg-rose-950/20 text-rose-400 border-rose-900/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
            >
              {isMicActive ? (
                <>
                  <Mic className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Mic Active</span>
                </>
              ) : (
                <>
                  <MicOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enable Mic</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Transcript Feed Stream */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[calc(100vh-320px)] min-h-[360px]"
      >
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 my-auto">
            <div className="p-3.5 rounded-full bg-slate-950/40 border border-slate-900 mb-3 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-500/20 animate-pulse" />
            </div>
            <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Stream Ready</p>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1 font-sans">
              Start a live stream session or toggle Demo mode to capture assertions.
            </p>
          </div>
        ) : (
          transcript.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-950/20 border border-slate-900/60 hover:border-slate-900 transition-all"
            >
              {/* Speaker Metadata Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-300 font-sans tracking-wide">
                    {item.speaker}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600">{item.timestamp}</span>
                </div>

                {item.hasClaim && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-bold bg-cyan-950/40 text-cyan-400 border border-cyan-800/20 uppercase tracking-widest">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> claim detected
                  </span>
                )}
              </div>

              {/* Transcription Content text */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans font-medium">
                {item.highlightedText ? (
                  <span>
                    {item.text.split(item.highlightedText)[0]}
                    <mark className="bg-cyan-950/40 text-cyan-300 px-1 py-0.5 rounded border border-cyan-850/30 font-bold shadow-[0_0_10px_rgba(6,182,212,0.1)] claim-highlight-active font-sans">
                      {item.highlightedText}
                    </mark>
                    {item.text.split(item.highlightedText)[1]}
                  </span>
                ) : (
                  item.text
                )}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Manual Verification Prompt Input */}
      <div className="p-3.5 border-t border-slate-900 bg-slate-950/40">
        <form onSubmit={handleSubmitManual} className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Terminal className="w-3.5 h-3.5 text-slate-500 absolute left-3" />
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Submit an assertion to verify manually..."
              className="w-full bg-[#080c14] border border-slate-900 focus:border-slate-800 rounded-lg pl-9 pr-3.5 py-2 text-xs font-sans text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-bold text-xs tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Verify
          </button>
        </form>
      </div>
    </div>
  );
};
