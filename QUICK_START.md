# VerbatimAI — Quick Start

**~2 minute read.**

---

## What VerbatimAI Is

VerbatimAI is a real-time **truth intelligence workspace**. It takes spoken or typed statements, isolates the factual claims inside them, searches the live web for evidence, has an LLM judge the claim against that evidence, and rolls every verdict up into a single **Trust Index** for the session.

It is a browser-based Next.js application. Everything runs in your browser plus four server-side API routes. There is no account, no login, and no database.

---

## Production URL

**https://verbatimai-olive.vercel.app**

Use **Chrome or Edge** — microphone capture depends on the browser's Web Speech API, which Firefox and Safari do not reliably support.

---

## How to Start a Session

1. Open the app. You land on **Dashboard**.
2. Click **Initiate Stream** in the top-right header.
3. The session timer starts and the workspace begins accepting claims.

Controls in the header: **Initiate Stream → Pause / Resume → Abort**, plus a **trash icon** that purges the session entirely.

---

## Simulation Mode

The **Simulation** button (purple, top-right) is **ON by default**. This is deliberate — the app is demo-ready the moment it loads.

With Simulation ON and the stream running, VerbatimAI replays a scripted 5-statement conversation. A new statement arrives every **4 seconds**; each claim card shows `ANALYZING` for **1.5 seconds** and then resolves to a pre-written verdict.

**Simulation Mode makes zero network calls.** The verdicts, confidence scores, explanations, and cited sources are all written into the source code (`src/lib/demo-data.ts`). It is a scripted playback, not verification. It cannot fail, which is exactly why it exists.

Turning Simulation **OFF** hides the scripted feed and reveals the **microphone button** in the Live Conversation panel.

---

## Manual Verification

The text box at the bottom of the **Live Conversation** panel — *"Submit an assertion to verify manually…"* — is the most useful control in the app.

**It always runs the real pipeline, even while Simulation Mode is ON.** Type any statement, press **Verify**, and it goes to the live claim-extraction and verification APIs. This is how you demonstrate genuine verification on demand.

---

## Trust Index

One number, 0–100%, shown on the Dashboard, the Trust Feed orb, and the Live Session dial.

- Starts at **100%** with no claims logged.
- Each **FALSE** claim costs 25 penalty points, each **MISLEADING** costs 12, each **UNVERIFIED** or still-analyzing claim costs 5.
- **VERIFIED** and **OPINION** claims cost nothing — opinions are deliberately not penalized, so open discourse doesn't drag the score down.
- The total penalty is averaged across all claims and scaled, then clamped to the range **10–100**.

Because the penalty is averaged, adding verified claims pulls the score back up. Above 80% reads *Stable*, 60–79% *Warning*, below 60% *Critical*.

---

## Evidence Assistant

Click any claim card. The **Evidence Assistant** panel on the right loads that claim's verdict, confidence, full rationale, any bias signal, and every cited source with a clickable link.

Press **Escape** to clear the selection.

---

## Sidebar Workspaces

| Workspace | What it shows |
|---|---|
| **Dashboard** | KPI row + transcript, trust feed, and evidence assistant side by side |
| **Live Session** | Wide transcript with a large Trust Index dial and session diagnostics |
| **Trust Feed** | Full-width claim stream with filters and search |
| **Claims Catalog** | Two-column card grid, filterable by verdict, searchable by keyword |
| **Evidence Nodes** | Per-claim source audit — every cited reference with domain and snippet |
| **Bias Analysis** | Verdict distribution bars and derived fact-density ratios |
| **History Archive** | The one cached session in your browser's localStorage |
| **Session Reports** | An on-screen verification brief for the current session |
| **Settings** | Live status of Groq, Tavily, speech recognition, and Simulation Mode |
| **Help Support** | In-app explanation of the five-stage pipeline |

Navigation writes a `?view=` query parameter, so browser Back and Forward work.

---

## Session Persistence

The session is saved continuously to your browser's **localStorage** under the key `verbatimai_session_v1`. Reload the page and everything comes back, with a *"Telemetry Session Restored"* confirmation.

This is **one session slot in one browser on one device**. There is no cloud sync, no server-side storage, and no multi-session history. A new session overwrites the old one.

---

## Reset Behavior

The **trash icon** in the header purges everything: transcript, claims, selected claim, and the timer all clear, the localStorage key is deleted, the microphone stops, and Simulation Mode switches back ON.

It is instant and irreversible. There is no confirmation dialog and no undo.

---

## The Core Pipeline

```
SPEECH
   ↓
CLAIM
   ↓
EVIDENCE
   ↓
VERDICT
   ↓
TRUST INDEX
```

Speech is captured by the browser. Groq extracts the claim. Tavily retrieves web evidence. Groq evaluates the claim against that evidence. The verdict updates the Trust Index.

---

**Next:** [USER_GUIDE.md](USER_GUIDE.md) for full feature detail · [DEMO_GUIDE.md](DEMO_GUIDE.md) for the presentation script · [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md) for the system design.
