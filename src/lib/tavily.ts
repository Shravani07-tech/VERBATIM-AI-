import { tavily } from '@tavily/core';
import { EvidenceSource } from '@/types';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export function isTavilyConfigured(): boolean {
  return Boolean(TAVILY_API_KEY && TAVILY_API_KEY.trim() !== '');
}

export async function searchWebEvidence(query: string): Promise<EvidenceSource[]> {
  if (!TAVILY_API_KEY) {
    return [];
  }

  try {
    const tvly = tavily({ apiKey: TAVILY_API_KEY });
    const response = await tvly.search(query, {
      searchDepth: 'basic',
      maxResults: 3,
      includeAnswer: false,
    });

    if (!response || !response.results) {
      return [];
    }

    return response.results.map((item: { title: string; url: string; content?: string; snippet?: string }) => {
      let domain = 'web';
      try {
        domain = new URL(item.url).hostname.replace(/^www\./, '');
      } catch {
        domain = 'web';
      }

      return {
        title: item.title || domain,
        url: item.url,
        domain: domain,
        snippet: (item.content || item.snippet || 'Evidence source retrieved from web search.').substring(0, 200) + '...',
      };
    });
  } catch (error) {
    console.error('Tavily search error:', error);
    return [];
  }
}
