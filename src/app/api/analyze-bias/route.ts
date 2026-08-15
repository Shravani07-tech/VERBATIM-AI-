import { NextRequest, NextResponse } from 'next/server';
import { isGroqConfigured, callGroqLLM } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text string is required' }, { status: 400 });
    }

    if (isGroqConfigured()) {
      const systemPrompt = `You are a Rhetorical & Bias Detection Engine.
Analyze input text for bias indicators such as absolute language, emotional loading, false certainty, or cherry-picked statistics.
Return JSON with this schema:
{
  "hasBiasSignal": boolean,
  "biasType": string,
  "explanation": string,
  "severity": "low" | "medium" | "high"
}`;

      const userPrompt = `Input Text: "${text}"`;
      const llmOutput = await callGroqLLM(userPrompt, systemPrompt);

      if (llmOutput) {
        try {
          const parsed = JSON.parse(llmOutput);
          return NextResponse.json(parsed);
        } catch {
          // Fallback
        }
      }
    }

    // Heuristic detection
    const lower = text.toLowerCase();
    const absoluteTerms = ['always', 'never', 'completely', 'everyone', 'nobody', '100%', '0%'];
    const foundTerm = absoluteTerms.find((term) => lower.includes(term));

    if (foundTerm) {
      return NextResponse.json({
        hasBiasSignal: true,
        biasType: 'Absolute Language Detected',
        explanation: `Statement uses extreme framing ("${foundTerm}") which often masks nuance.`,
        severity: 'medium',
      });
    }

    return NextResponse.json({
      hasBiasSignal: false,
      biasType: 'None',
      explanation: 'No strong rhetorical bias signals detected.',
      severity: 'low',
    });
  } catch (error) {
    console.error('Analyze bias API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
