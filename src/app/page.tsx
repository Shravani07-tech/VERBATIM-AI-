'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { TrustFeed } from '@/components/TrustFeed';
import { ClaimDetailModal } from '@/components/ClaimDetailModal';
import { Claim, TranscriptSegment, SessionStats, HealthResponse } from '@/types';
import { DEMO_SEQUENCE } from '@/lib/demo-data';

export default function Dashboard() {
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to Demo Mode for instant hackathon demo readiness
  const [liveVerificationAvailable, setLiveVerificationAvailable] = useState(false);

  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const [durationSeconds, setDurationSeconds] = useState(0);
  const [isMicActive, setIsMicActive] = useState(false);

  const demoStepRef = useRef(0);
  const recognitionRef = useRef<any>(null);

  // 1. Check API Health on Mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data: HealthResponse = await res.json();
          setLiveVerificationAvailable(data.live_verification === 'available');
        }
      } catch (err) {
        console.error('Health check error:', err);
      }
    }
    checkHealth();
  }, []);

  // 2. Session Duration Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLive && !isPaused) {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLive, isPaused]);

  // 3. Process & Verify Factual Claims
  const processClaimVerification = useCallback(
    async (claimText: string, speaker: string, timestamp: string, isDemo: boolean = false, demoClaimObj?: any) => {
      const claimId = `claim-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      // Step 1: Add Analyzing Claim Card to UI immediately
      const initialClaim: Claim = {
        id: claimId,
        claim: claimText,
        verdict: 'ANALYZING',
        confidence: 50,
        explanation: 'Extracting factual claims and querying web evidence...',
        sources: [],
        timestamp,
        speaker,
        isDemo,
      };

      setClaims((prev) => [initialClaim, ...prev]);

      if (isDemo && demoClaimObj) {
        // Simulated Verification timing for Demo Mode
        setTimeout(() => {
          setClaims((prev) =>
            prev.map((c) =>
              c.id === claimId
                ? {
                    ...c,
                    ...demoClaimObj,
                    id: claimId,
                    timestamp,
                    speaker,
                    isDemo: true,
                  }
                : c
            )
          );
        }, 1500);
        return;
      }

      // Live Mode API Call
      try {
        const res = await fetch('/api/verify-claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claim: claimText }),
        });

        if (res.ok) {
          const result = await res.json();
          setClaims((prev) =>
            prev.map((c) =>
              c.id === claimId
                ? {
                    ...c,
                    verdict: result.verdict,
                    confidence: result.confidence,
                    explanation: result.explanation,
                    sources: result.sources || [],
                    category: result.category || 'General',
                    biasSignal: result.biasSignal,
                    isDemo: result.isDemo,
                  }
                : c
            )
          );
        } else {
          setClaims((prev) =>
            prev.map((c) =>
              c.id === claimId
                ? {
                    ...c,
                    verdict: 'UNVERIFIED',
                    explanation: 'Unable to verify against live sources.',
                  }
                : c
            )
          );
        }
      } catch (err) {
        console.error('Claim verification error:', err);
        setClaims((prev) =>
          prev.map((c) =>
            c.id === claimId
              ? {
                  ...c,
                  verdict: 'UNVERIFIED',
                  explanation: 'Network error during live verification.',
                }
              : c
          )
        );
      }
    },
    []
  );

  // 4. Handle Incoming Speech / Transcript Segment
  const handleAddTranscriptSegment = useCallback(
    async (text: string, speaker: string = 'SPEAKER 01') => {
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];
      const segmentId = `seg-${Date.now()}`;

      // Check for claims using extract-claims API if in live mode
      let hasClaim = false;
      let claimText = text;
      let highlightedText = text;

      try {
        const res = await fetch('/api/extract-claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.containsClaim) {
            hasClaim = true;
            claimText = data.claim || text;
            highlightedText = data.highlight || text;
          }
        }
      } catch (err) {
        console.error('Extract claims call failed:', err);
        hasClaim = text.length > 15;
      }

      const segment: TranscriptSegment = {
        id: segmentId,
        speaker,
        timestamp,
        text,
        hasClaim,
        highlightedText: hasClaim ? highlightedText : undefined,
      };

      setTranscript((prev) => [...prev, segment]);

      if (hasClaim) {
        processClaimVerification(claimText, speaker, timestamp, false);
      }
    },
    [processClaimVerification]
  );

  // 5. Automated Demo Mode Controller Loop
  useEffect(() => {
    let demoInterval: NodeJS.Timeout;

    if (isDemoMode && isLive && !isPaused) {
      demoInterval = setInterval(() => {
        const demoItem = DEMO_SEQUENCE[demoStepRef.current % DEMO_SEQUENCE.length];
        demoStepRef.current += 1;

        const segmentId = `demo-seg-${Date.now()}`;
        const segment: TranscriptSegment = {
          id: segmentId,
          speaker: demoItem.speaker,
          timestamp: demoItem.timestamp,
          text: demoItem.transcriptText,
          hasClaim: true,
          highlightedText: demoItem.claimHighlight,
        };

        setTranscript((prev) => [...prev, segment]);
        processClaimVerification(
          demoItem.claimData.claim,
          demoItem.speaker,
          demoItem.timestamp,
          true,
          demoItem.claimData
        );
      }, 4000);
    }

    return () => clearInterval(demoInterval);
  }, [isDemoMode, isLive, isPaused, processClaimVerification]);

  // 6. Web Speech API Microphone Integration
  const startMicTranscription = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const speechText = lastResult[0].transcript.trim();
          if (speechText) {
            handleAddTranscriptSegment(speechText, 'SPEAKER (LIVE MIC)');
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsMicActive(false);
      };

      recognition.onend = () => {
        if (isMicActive) {
          recognition.start();
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsMicActive(true);
      setIsLive(true);
      setIsPaused(false);
    } catch (err) {
      console.error('Failed to start microphone:', err);
      setIsMicActive(false);
    }
  };

  const stopMicTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsMicActive(false);
  };

  // 7. Calculate Real-Time Session Stats
  const calculateStats = (): SessionStats => {
    const totalClaims = claims.length;
    const verifiedCount = claims.filter((c) => c.verdict === 'VERIFIED').length;
    const misleadingCount = claims.filter((c) => c.verdict === 'MISLEADING').length;
    const falseCount = claims.filter((c) => c.verdict === 'FALSE').length;
    const unverifiedCount = claims.filter((c) => c.verdict === 'UNVERIFIED' || c.verdict === 'ANALYZING').length;
    const opinionCount = claims.filter((c) => c.verdict === 'OPINION').length;
    const biasSignalsCount = claims.filter((c) => Boolean(c.biasSignal)).length;

    const totalConfidence = claims.reduce((acc, curr) => acc + (curr.confidence || 0), 0);
    const averageConfidence = totalClaims > 0 ? Math.round(totalConfidence / totalClaims) : 100;

    // Session Trust Index Formula
    let sessionTrustScore = 100;
    if (totalClaims > 0) {
      const penalty = misleadingCount * 12 + falseCount * 25 + unverifiedCount * 5;
      sessionTrustScore = Math.max(10, Math.min(100, Math.round(100 - (penalty / totalClaims) * 1.5)));
    }

    return {
      totalClaims,
      verifiedCount,
      misleadingCount,
      falseCount,
      unverifiedCount,
      opinionCount,
      averageConfidence,
      sessionTrustScore,
      biasSignalsCount,
      durationSeconds,
    };
  };

  const stats = calculateStats();

  // Session Control Handlers
  const handleStartSession = () => {
    setIsLive(true);
    setIsPaused(false);
  };

  const handlePauseSession = () => {
    setIsPaused(true);
  };

  const handleStopSession = () => {
    setIsLive(false);
    setIsPaused(false);
    stopMicTranscription();
  };

  const handleClearSession = () => {
    setTranscript([]);
    setClaims([]);
    setDurationSeconds(0);
    demoStepRef.current = 0;
  };

  const handleToggleDemoMode = () => {
    const nextDemo = !isDemoMode;
    setIsDemoMode(nextDemo);
    if (nextDemo && !isLive) {
      setIsLive(true);
      setIsPaused(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Header Command Bar */}
      <Header
        isLive={isLive}
        isPaused={isPaused}
        isDemoMode={isDemoMode}
        liveVerificationAvailable={liveVerificationAvailable}
        stats={stats}
        onStartSession={handleStartSession}
        onPauseSession={handlePauseSession}
        onStopSession={handleStopSession}
        onClearSession={handleClearSession}
        onToggleDemoMode={handleToggleDemoMode}
      />

      {/* Main Split-Screen Command Center */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Live Transcript Stream (5 cols on lg) */}
        <section className="lg:col-span-5 h-full">
          <TranscriptPanel
            transcript={transcript}
            isLive={isLive}
            isDemoMode={isDemoMode}
            onAddTranscriptSegment={handleAddTranscriptSegment}
            onStartMic={startMicTranscription}
            onStopMic={stopMicTranscription}
            isMicActive={isMicActive}
          />
        </section>

        {/* Right Panel: Live Trust Feed & Intelligence Analytics (7 cols on lg) */}
        <section className="lg:col-span-7 h-full">
          <TrustFeed claims={claims} stats={stats} onSelectClaim={setSelectedClaim} />
        </section>
      </main>

      {/* Interactive Claim Intelligence Detail Modal */}
      <ClaimDetailModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />
    </div>
  );
}
