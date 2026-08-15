import { Claim, TranscriptSegment } from '@/types';

export interface DemoItem {
  speaker: string;
  timestamp: string;
  transcriptText: string;
  claimHighlight: string;
  claimData: Omit<Claim, 'id' | 'timestamp' | 'speaker'>;
}

export const DEMO_SEQUENCE: DemoItem[] = [
  {
    speaker: 'SPEAKER 01',
    timestamp: '10:42:15',
    transcriptText: 'Welcome everyone. As we analyze the latest climate data, global surface temperature has increased by approximately 1.5°C since pre-industrial times.',
    claimHighlight: 'global surface temperature has increased by approximately 1.5°C since pre-industrial times.',
    claimData: {
      claim: 'Global surface temperature has increased by approximately 1.5°C above pre-industrial levels.',
      verdict: 'VERIFIED',
      confidence: 96,
      category: 'Science',
      explanation: 'Extensive scientific consensus from IPCC AR6 Synthesis Report and NASA climate data confirms global temperatures have risen by ~1.1°C to 1.5°C relative to 1850-1900 baseline.',
      sources: [
        {
          title: 'IPCC AR6 Climate Change Synthesis Report',
          domain: 'ipcc.ch',
          url: 'https://www.ipcc.ch/report/ar6/syr/',
          snippet: 'Human activities, principally through emissions of greenhouse gases, have unequivocally caused global warming, with global surface temperature reaching 1.1°C to 1.5°C above pre-industrial levels.',
        },
        {
          title: 'NASA Global Climate Change Indicators',
          domain: 'climate.nasa.gov',
          url: 'https://climate.nasa.gov/vital-signs/global-temperature/',
          snippet: 'The average surface temperature of the Earth has risen about 1.2 degrees Celsius since the late 19th century.',
        },
      ],
      isDemo: true,
      rawText: 'global surface temperature has increased by approximately 1.5°C since pre-industrial times.',
    },
  },
  {
    speaker: 'SPEAKER 02',
    timestamp: '10:42:32',
    transcriptText: 'Regarding artificial intelligence benchmarks, AI frontier models have doubled in capability every six months over the last three years.',
    claimHighlight: 'AI frontier models have doubled in capability every six months over the last three years.',
    claimData: {
      claim: 'AI frontier models have doubled in capability every 6 months over the last 3 years.',
      verdict: 'MISLEADING',
      confidence: 84,
      category: 'Technology',
      biasSignal: 'Unsupported Generalization',
      explanation: 'While training compute and parameter counts have scaled rapidly, standardized benchmark performance shows non-linear growth rather than a strict 6-month doubling rule.',
      sources: [
        {
          title: 'Stanford AI Index Report 2024',
          domain: 'aiindex.stanford.edu',
          url: 'https://aiindex.stanford.edu/report/',
          snippet: 'Evaluation performance on complex benchmarks demonstrates task saturation and diminishing returns rather than exponential doubling across all domains.',
        },
        {
          title: 'Epoch AI Computations Trends Analysis',
          domain: 'epochai.org',
          url: 'https://epochai.org/blog/compute-trends',
          snippet: 'Notable AI training compute doubled every ~6 months from 2010 to 2022, but raw model capability performance metrics vary widely by benchmark domain.',
        },
      ],
      isDemo: true,
      rawText: 'AI frontier models have doubled in capability every six months over the last three years.',
    },
  },
  {
    speaker: 'SPEAKER 01',
    timestamp: '10:42:55',
    transcriptText: 'If we look at venture funding statistics, 90% of startups fail within their first year of operation.',
    claimHighlight: '90% of startups fail within their first year of operation.',
    claimData: {
      claim: '90% of startups fail within their first year of operation.',
      verdict: 'FALSE',
      confidence: 91,
      category: 'Statistics',
      biasSignal: 'False Certainty & Cherry-Picked Metric',
      explanation: 'US Bureau of Labor Statistics data indicates approximately 20% of new businesses fail in year 1. The 90% failure rate applies over a 10-year horizon, not the first year.',
      sources: [
        {
          title: 'US Bureau of Labor Statistics Business Survival Rates',
          domain: 'bls.gov',
          url: 'https://www.bls.gov/bdm/entrepreneurship/entrepreneurship.htm',
          snippet: 'About 20% of private sector businesses fail during the first year. By year 5, around 50% fail, and ~70% fail by year 10.',
        },
        {
          title: 'Harvard Business School Startup Failure Research',
          domain: 'hbs.edu',
          url: 'https://www.hbswk.hbs.edu/',
          snippet: 'Venture-backed startup failure rates reach 75% to 90% over a 5 to 10 year window, misattributed often to year one.',
        },
      ],
      isDemo: true,
      rawText: '90% of startups fail within their first year of operation.',
    },
  },
  {
    speaker: 'SPEAKER 03',
    timestamp: '10:43:18',
    transcriptText: 'Looking back historically, the global Internet network was originally invented in the 1990s.',
    claimHighlight: 'the global Internet network was originally invented in the 1990s.',
    claimData: {
      claim: 'The global Internet network was originally invented in the 1990s.',
      verdict: 'FALSE',
      confidence: 98,
      category: 'History',
      explanation: 'ARPANET introduced packet switching in 1969, and TCP/IP protocol suite was standardized in 1983. The 1990s saw Tim Berners-Lee invent the World Wide Web, not the Internet itself.',
      sources: [
        {
          title: 'Internet Society History of the Internet',
          domain: 'internetsociety.org',
          url: 'https://www.internetsociety.org/internet/history-of-internet/',
          snippet: 'The first successful message sent over ARPANET occurred in October 1969. TCP/IP was adopted as standard on January 1, 1983.',
        },
        {
          title: 'W3C History of the World Wide Web',
          domain: 'w3.org',
          url: 'https://www.w3.org/History.html',
          snippet: 'Tim Berners-Lee invented the World Wide Web in 1989-1990 as an application running on top of the pre-existing Internet.',
        },
      ],
      isDemo: true,
      rawText: 'the global Internet network was originally invented in the 1990s.',
    },
  },
  {
    speaker: 'SPEAKER 02',
    timestamp: '10:43:40',
    transcriptText: 'In my personal opinion, AI systems will completely replace human software engineers within five years.',
    claimHighlight: 'AI systems will completely replace human software engineers within five years.',
    claimData: {
      claim: 'AI systems will completely replace human software engineers within 5 years.',
      verdict: 'OPINION',
      confidence: 89,
      category: 'Opinion',
      biasSignal: 'Absolute Speculation',
      explanation: 'This statement represents subjective technological speculation about future workforce displacement rather than a verifiable empirical fact.',
      sources: [
        {
          title: 'MIT Computer Science & AI Lab Workforce Analysis',
          domain: 'csail.mit.edu',
          url: 'https://www.csail.mit.edu/',
          snippet: 'Economic feasibility studies show AI automates specific coding subtasks but complements software architecture, verification, and engineering roles.',
        },
      ],
      isDemo: true,
      rawText: 'AI systems will completely replace human software engineers within five years.',
    },
  },
];
