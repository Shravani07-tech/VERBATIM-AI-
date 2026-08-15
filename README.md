# VerbatimAI — Real-Time Truth Intelligence Copilot

> VerbatimAI is a real-time AI fact-checking and bias-detection copilot that listens to live conversations, extracts factual claims, verifies them against live web sources, and displays an instant trust feed.

---

## 🎯 Problem Statement

During live lectures, business meetings, panel discussions, interviews, and public debates, factual claims are made at high velocity. Audiences and participants rarely have the bandwidth to pause the conversation, search the web, evaluate source credibility, and identify misleading statistics or rhetorical bias in real time. Misinformation spreads unverified during critical live discussions.

---

## 💡 Solution

**VerbatimAI** operates as a real-time intelligence command center:
1. **Listens** continuously to speech via browser Web Speech API.
2. **Extracts** concrete verifiable factual claims using Groq LLMs (`llama-3.3-70b-versatile`).
3. **Searches** live web evidence via Tavily Search API.
4. **Evaluates** source credibility and returns an instant verdict (**VERIFIED**, **MISLEADING**, **FALSE**, **UNVERIFIED**, **OPINION**).
5. **Calculates** a dynamic Session Trust Index score meter.
6. **Detects** rhetorical bias signals (e.g., absolutist language, false certainty).
7. **Provides** a 100% reliable offline **Demo Mode** fallback for presentation & testing readiness without requiring live credentials or microphone permissions.

---

## 🏗️ Architecture & Data Pipeline

```
     ┌────────────────┐
     │  Live Audio    │
     └───────┬────────┘
             │
             ▼
 ┌──────────────────────┐
 │ Web Speech API / Mic │
 └───────────┬──────────┘
             │
             ▼
 ┌──────────────────────┐
 │  Transcript Stream   │
 └───────────┬──────────┘
             │
             ▼
 ┌──────────────────────┐      ┌───────────────────────────┐
 │ Groq Claim Extraction├─────►│ Categorize: Factual/Opinion│
 └───────────┬──────────┘      └───────────────────────────┘
             │
             ▼
 ┌──────────────────────┐
 │  Tavily Web Search   │
 └───────────┬──────────┘
             │
             ▼
 ┌──────────────────────┐
 │ Groq LLM Evaluation  │
 └───────────┬──────────┘
             │
             ▼
 ┌──────────────────────┐
 │  Live Trust Feed &   │
 │ Session Trust Score  │
 └──────────────────────┘
```

---

## ✨ Features

- **Split-Screen Intelligence Command Center**: Palantir-style cyber intelligence UI with dark slate aesthetics, subtle gradients, and glassmorphism cards.
- **Live Conversation Stream**: Speaker tags, timestamps, text stream, and pulsing `CLAIM DETECTED` highlights.
- **Dynamic Session Trust Meter**: Circular radial visualization calculating real-time credibility (0-100%).
- **Interactive Trust Feed**: Filterable claim cards showing verdict pills, confidence gauges, rationale explanations, bias signals, and cited evidence links.
- **Evidence Assistant Panel**: Deep dive panel detailing claim statement, speaker context, detailed AI rationale, supporting evidence snippets, and search queries.
- **Rhetorical Bias Signals**: Identifies extreme framing, false certainty, and unsupported generalizations.
- **Demo Mode**: Instant 2-minute pre-scripted demonstration flow running completely client-side without external dependencies.
- **Secure Health Endpoint**: `GET /api/health` exposes system operational status without exposing secret environment keys.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4, Lucide React icons
- **LLM Engine**: Groq SDK (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`)
- **Search Engine**: Tavily Search API (`@tavily/core`)
- **Speech Recognition**: Browser Web Speech API (`SpeechRecognition`)
- **Deployment**: Vercel Serverless Platform

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js 18+ and npm installed.

### 2. Clone Repository
```bash
git clone https://github.com/Shravani07-tech/VERBATIM-AI-.git
cd VERBATIM-AI-
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

*Note: If `GROQ_API_KEY` or `TAVILY_API_KEY` are not provided, VerbatimAI automatically activates Fallback / Demo Evidence Mode so the application remains 100% functional out of the box!*

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Demo Mode Instructions

1. Open the VerbatimAI dashboard.
2. Click the **Demo Mode** toggle button in the top header.
3. The dashboard will automatically stream pre-scripted live conversation text.
4. Watch claims get extracted, verified, classified, and cited in real time.
5. Click any claim card to load its details into the **Evidence Assistant Panel**.

---

## 🔒 Security & Privacy

- All API calls (Groq & Tavily) are executed server-side within Next.js API routes (`/api/extract-claims`, `/api/verify-claim`, `/api/analyze-bias`).
- No API keys or credentials are ever exposed to the client bundle or `GET /api/health` response.

---

## 🌐 Deployed Application & Repository

- **GitHub Repository**: [https://github.com/Shravani07-tech/VERBATIM-AI-](https://github.com/Shravani07-tech/VERBATIM-AI-)
- **Live Demo URL**: [Deployed Vercel URL]

---

## 🔮 Future Roadmap

1. **Video Conference Integration**: Native Zoom, Google Meet, and Microsoft Teams audio bots.
2. **Multilingual Fact-Checking**: Support for real-time translation and verification in 20+ languages.
3. **Persistent Session Analytics**: Export session reports as PDF / Markdown intelligence briefs.
4. **Browser Extension**: Fact-checking overlay for YouTube live streams, webinars, and news broadcasts.

---

## 👥 Contributors

- **Surudmahajan** - [surudmahajan3@gmail.com](mailto:surudmahajan3@gmail.com)
