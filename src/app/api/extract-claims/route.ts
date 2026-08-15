import { NextRequest, NextResponse } from 'next/server';
import { callGroqLLM, isGroqConfigured } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text prompt is required' }, { status: 400 });
    }

    if (isGroqConfigured()) {
      const systemPrompt = `You are VerbatimAI's Claim Extraction Engine.
Analyze the input conversation text and determine if it contains a verifiable factual claim or opinion.
Categories: Science, Technology, Statistics, History, Opinion, General.
Return JSON with this exact schema:
{
  "containsClaim": boolean,
  "claim": string,
  "type": "factual" | "opinion" | "casual",
  "category": string,
  "confidence": number,
  "highlight": string
}
Only extract specific, concrete factual or opinion statements. Ignore casual greetings or questions.`;

      const userPrompt = `Input Text: "${text}"`;

      const llmOutput = await callGroqLLM(userPrompt, systemPrompt);

      if (llmOutput) {
        try {
          const parsed = JSON.parse(llmOutput);
          return NextResponse.json(parsed);
        } catch {
          // JSON parse fallback
        }
      }
    }

    // Heuristic Fallback
    const lower = text.toLowerCase();
    const numberRegex = /\b\d+(\.\d+)?%?\b|increased|decreased|invented|doubled|tripled|billion|million|percent/i;
    const isFactual = numberRegex.test(text);

    return NextResponse.json({
      containsClaim: isFactual || text.length > 20,
      claim: text.trim(),
      type: lower.includes('opinion') || lower.includes('think') || lower.includes('believe') ? 'opinion' : 'factual',
      category: lower.includes('temp') || lower.includes('climate') ? 'Science' : lower.includes('ai') ? 'Technology' : 'General',
      confidence: 85,
      highlight: text.trim(),
    });
  } catch (error) {
    console.error('Extract claims API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
