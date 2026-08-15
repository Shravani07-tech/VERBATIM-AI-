export type ClaimVerdict = 
  | 'VERIFIED'
  | 'MISLEADING'
  | 'FALSE'
  | 'UNVERIFIED'
  | 'OPINION'
  | 'ANALYZING'
  | 'QUEUED';

export interface EvidenceSource {
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface Claim {
  id: string;
  claim: string;
  verdict: ClaimVerdict;
  confidence: number; // 0 - 100
  explanation: string;
  sources: EvidenceSource[];
  timestamp: string;
  speaker: string;
  category?: 'Science' | 'Technology' | 'Statistics' | 'History' | 'Opinion' | 'General';
  biasSignal?: string;
  isDemo?: boolean;
  rawText?: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  timestamp: string;
  text: string;
  hasClaim?: boolean;
  claimId?: string;
  highlightedText?: string;
}

export interface SessionStats {
  totalClaims: number;
  verifiedCount: number;
  misleadingCount: number;
  falseCount: number;
  unverifiedCount: number;
  opinionCount: number;
  averageConfidence: number;
  sessionTrustScore: number;
  biasSignalsCount: number;
  durationSeconds: number;
}

export interface HealthResponse {
  status: string;
  live_verification: 'available' | 'unavailable';
}
