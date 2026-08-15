import { NextRequest, NextResponse } from 'next/server';
import { isGroqConfigured, callGroqLLM } from '@/lib/groq';
import { isTavilyConfigured, searchWebEvidence } from '@/lib/tavily';
import { ClaimVerdict, EvidenceSource } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim, context } = body;

    if (!claim || typeof claim !== 'string') {
      return NextResponse.json({ error: 'Claim string is required' }, { status: 400 });
    }

    const hasLiveKeys = isGroqConfigured() && isTavilyConfigured();

    if (hasLiveKeys) {
      // 1. Fetch live web search evidence via Tavily
      const sources: EvidenceSource[] = await searchWebEvidence(claim);

      // 2. Evaluate evidence via Groq LLM
      const systemPrompt = `You are VerbatimAI's Fact Verification Engine.
Given a factual statement and retrieved web evidence snippets, evaluate the claim's accuracy.
Verdicts allowed: "VERIFIED", "MISLEADING", "FALSE", "UNVERIFIED", "OPINION".
Return JSON with this exact schema:
{
  "verdict": "VERIFIED" | "MISLEADING" | "FALSE" | "UNVERIFIED" | "OPINION",
  "confidence": number (1-100),
  "explanation": "2-3 concise sentences explaining the rationale based on evidence.",
  "category": "Science" | "Technology" | "Statistics" | "History" | "Opinion" | "General",
  "biasSignal": "Short description if rhetorical bias is detected (e.g. Absolutist Language, False Certainty), else empty"
}`;

      const userPrompt = `Claim to Verify: "${claim}"
Context: "${context || ''}"
Web Evidence Sources: ${JSON.stringify(sources, null, 2)}`;

      const llmOutput = await callGroqLLM(userPrompt, systemPrompt);

      if (llmOutput) {
        try {
          const parsed = JSON.parse(llmOutput);
          return NextResponse.json({
            claim,
            verdict: (parsed.verdict || 'UNVERIFIED') as ClaimVerdict,
            confidence: parsed.confidence || 80,
            explanation: parsed.explanation || 'Evaluated against live web sources.',
            category: parsed.category || 'General',
            biasSignal: parsed.biasSignal || undefined,
            sources,
            isDemo: false,
          });
        } catch {
          // Fall through to standard response
        }
      }

      if (sources.length > 0) {
        return NextResponse.json({
          claim,
          verdict: 'UNVERIFIED' as ClaimVerdict,
          confidence: 50,
          explanation: 'Unable to conclusively verify claim. Retrieved evidence exists but evaluation processing failed.',
          category: 'General',
          sources,
          isDemo: false,
        });
      }
    }

    // Graceful Fallback / Simulated verification if live keys are not configured
    const lower = claim.toLowerCase();
    let verdict: ClaimVerdict = 'UNVERIFIED';
    let confidence = 50;
    let explanation = 'Claim evaluation pending. Factual assertion has been logged but verification evidence is currently inconclusive.';
    let category: 'Science' | 'Technology' | 'Statistics' | 'History' | 'Opinion' | 'General' = 'General';

    if (lower.includes('90%') || lower.includes('fail') || lower.includes('1990')) {
      verdict = 'FALSE';
      confidence = 92;
      explanation = 'Claim contains factual inconsistencies or misattributed timelines based on historical records.';
    } else if (lower.includes('double') || lower.includes('every')) {
      verdict = 'MISLEADING';
      confidence = 82;
      explanation = 'Statistically oversimplified generalization that lacks necessary domain context.';
    } else if (lower.includes('think') || lower.includes('opinion') || lower.includes('replace')) {
      verdict = 'OPINION';
      confidence = 90;
      explanation = 'Subjective statement or future projection rather than a verifiable empirical fact.';
      category = 'Opinion';
    } else if (lower.includes('climate') || lower.includes('temp') || lower.includes('1.5')) {
      verdict = 'VERIFIED';
      confidence = 95;
      explanation = 'Confirmed by global climate observation synthesis reports.';
      category = 'Science';
    } else if (lower.includes('earth') || lower.includes('third planet') || lower.includes('sun')) {
      verdict = 'VERIFIED';
      confidence = 98;
      explanation = 'Astrophysical consensus confirms the Earth is the third planet from the Sun.';
      category = 'Science';
    } else if (lower.includes('great wall') || lower.includes('moon') || lower.includes('naked eye')) {
      verdict = 'FALSE';
      confidence = 96;
      explanation = 'NASA astronaut observations confirm that the Great Wall of China is not visible from orbital altitudes with the naked eye.';
      category = 'General';
    }

    return NextResponse.json({
      claim,
      verdict,
      confidence,
      explanation,
      category,
      sources: [
        {
          title: 'VerbatimAI Knowledge Benchmark',
          domain: 'verbatim-ai.org',
          url: 'https://github.com/Shravani07-tech/VERBATIM-AI-',
          snippet: 'Demonstration evidence provided via VerbatimAI fallback evaluation matrix.',
        },
      ],
      isDemo: true,
    });
  } catch (error) {
    console.error('Verify claim API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
