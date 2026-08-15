'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Radio, Sparkles, AlertCircle } from 'lucide-react';
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
    onAddTranscriptSegment(manualInput.trim(), 'USER (MANUAL)');
    setManualInput('');
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/50 text-cyan-400">
            <Radio className={`w-4 h-4 ${isLive ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-slate-200 tracking-wide">Live Conversation Stream</h2>
            <p className="text-xs text-slate-400">Real-time speech transcription & claim highlights</p>
          </div>
        </div>

        {/* Mic Toggle Button */}
        <div className="flex items-center gap-2">
          {!isDemoMode && (
            <button
              onClick={isMicActive ? onStopMic : onStartMic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isMicActive
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800 live-pulse shadow-md shadow-rose-950/50'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
              }`}
            >
              {isMicActive ? <Mic className="w-3.5 h-3.5 animate-bounce" /> : <MicOff className="w-3.5 h-3.5" />}
              {isMicActive ? 'Mic Active' : 'Enable Mic'}
            </button>
          )}
        </div>
      </div>

      {/* Stream Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-280px)] min-h-[380px]">
        {transcript.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 my-auto">
            <div className="p-4 rounded-full bg-slate-900/80 border border-slate-800 mb-3">
              <Sparkles className="w-8 h-8 text-cyan-500/60 animate-pulse" />
            </div>
            <p className="font-medium text-sm text-slate-300">Conversation Stream Ready</p>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Start session or enable Demo Mode to stream live speech and extract factual claims in real-time.
            </p>
          </div>
        ) : (
          transcript.map((item) => (
            <div
              key={item.id}
              className={`group transition-all duration-300 p-4 rounded-xl border ${
                item.hasClaim
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700/80'
              }`}
            >
              {/* Speaker & Timestamp */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                    {item.speaker}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{item.timestamp}</span>
                </div>

                {item.hasClaim && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 animate-pulse">
                    <Sparkles className="w-3 h-3" /> CLAIM DETECTED
                  </span>
                )}
              </div>

              {/* Speech Text */}
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {item.highlightedText ? (
                  <span>
                    {item.text.split(item.highlightedText)[0]}
                    <mark className="bg-cyan-950/80 text-cyan-200 px-1 py-0.5 rounded border border-cyan-800/60 font-medium">
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

      {/* Manual Input Fallback Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <form onSubmit={handleSubmitManual} className="flex items-center gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type or paste a claim to verify manually..."
            className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/50"
          >
            <Send className="w-3.5 h-3.5" /> Verify
          </button>
        </form>
      </div>
    </div>
  );
};
