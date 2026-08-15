import { NextResponse } from 'next/server';
import { isGroqConfigured } from '@/lib/groq';
import { isTavilyConfigured } from '@/lib/tavily';

export async function GET() {
  const hasGroq = isGroqConfigured();
  const hasTavily = isTavilyConfigured();

  const isLiveAvailable = hasGroq && hasTavily;

  // STRICT SECURITY REQUIREMENT: Never expose keys, secrets, or raw env values
  return NextResponse.json({
    status: 'ok',
    live_verification: isLiveAvailable ? 'available' : 'unavailable',
  });
}
