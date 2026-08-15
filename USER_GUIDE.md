# VerbatimAI — User Guide

Complete reference for the VerbatimAI Truth Intelligence Workspace.

**Production:** https://verbatimai-olive.vercel.app
**Repository:** https://github.com/Shravani07-tech/VERBATIM-AI-

> This guide documents only what the shipped code actually does. Where a feature is simulated, partial, or decorative, it says so.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [What Problem VerbatimAI Solves](#2-what-problem-verbatimai-solves)
3. [Who It Is For](#3-who-it-is-for)
4. [Getting Started](#4-getting-started)
5. [Dashboard Overview](#5-dashboard-overview)
6. [Live Session](#6-live-session)
7. [Simulation / Demo Mode](#7-simulation--demo-mode)
8. [Manual Claim Verification](#8-manual-claim-verification)
9. [Trust Index](#9-trust-index)
10. [Trust Feed](#10-trust-feed)
11. [Claims Catalog](#11-claims-catalog)
12. [Evidence Nodes](#12-evidence-nodes)
13. [Evidence Assistant](#13-evidence-assistant)
14. [Bias Analysis](#14-bias-analysis)
15. [History Archive](#15-history-archive)
16. [Session Reports](#16-session-reports)
17. [Settings](#17-settings)
18. [Help & Support](#18-help--support)
19. [Session Persistence](#19-session-persistence)
20. [Reset / Clear Session](#20-reset--clear-session)
21. [Troubleshooting](#21-troubleshooting)
22. [Security & Privacy](#22-security--privacy)
23. [Architecture Overview](#23-architecture-overview)
24. [Limitations](#24-limitations)
25. [Quick Reference](#25-quick-reference)

---

## 1. Product Overview

VerbatimAI is a browser-based workspace that fact-checks conversation as it happens.

It listens (or reads typed input), identifies statements that make a checkable factual assertion, searches the live web for evidence about each one, asks a fast LLM to judge the claim against that evidence, and presents the result as a verdict card with cited sources. Every verdict feeds a single running **Trust Index** for the session.

**What it is built from:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4. Claim reasoning runs on **Groq**; web evidence comes from **Tavily**. Speech capture uses the browser's native Web Speech API.

**What it is not:** there is no user account, no server-side database, no team workspace, and no stored history beyond the single session cached in your own browser.

### The five verdicts

| Verdict | Meaning |
|---|---|
| **VERIFIED** | Evidence supports the claim as stated. |
| **MISLEADING** | Partially true, but framed in a way that distorts — wrong timeframe, missing context, overstated scope. |
| **FALSE** | Evidence contradicts the claim. |
| **UNVERIFIED** | No sufficient evidence was found either way. |
| **OPINION** | Subjective judgement or future prediction — not empirically checkable. |

A sixth state, **ANALYZING**, appears on a card while verification is still in flight.

---

## 2. What Problem VerbatimAI Solves

In a live lecture, panel, interview, standup, or negotiation, factual claims arrive faster than anyone can check them. A statistic gets quoted, an attribution gets made, a trend gets asserted — and the conversation has already moved on three sentences before anyone could open a search tab.

The practical consequences: wrong numbers get repeated as settled fact; misleading framings pass unchallenged because nobody can articulate *why* they feel off in the two seconds available; and afterwards nobody has a record of which claims were actually load-bearing.

Manual fact-checking has a latency problem, not a capability problem. VerbatimAI attacks the latency. It runs the search-and-evaluate loop continuously in the background so the check arrives while the claim is still relevant, and it leaves an auditable trail of what was asserted, what the evidence said, and where that evidence came from.

**The honest framing:** VerbatimAI is a research assistant that surfaces evidence fast. It is not an arbiter of truth. Every verdict ships with its sources precisely so a human can overrule it.

---

## 3. Who It Is For

- **Students and researchers** — checking claims during lectures, seminars, and reading groups.
- **Journalists and interviewers** — flagging claims worth following up on, with sources already attached.
- **Meeting participants and analysts** — catching misquoted statistics in business discussions before they enter a deck.
- **Debate and public-speaking teams** — reviewing recorded arguments for factual accuracy and rhetorical framing.
- **Educators** — demonstrating what live fact-checking and evidence evaluation actually look like.

**Prerequisite:** a Chromium-based browser (Chrome or Edge) for microphone capture. Everything else in the app works in any modern browser.

---

## 4. Getting Started

### Using the production app

1. Open **https://verbatimai-olive.vercel.app** in Chrome or Edge.
2. The workspace loads on the **Dashboard**, with **Simulation Mode already ON**.
3. Click **Initiate Stream** in the header.
4. Watch the scripted conversation stream in and get verified.

That is the entire setup. No sign-up, no configuration.

### Running locally

```bash
git clone https://github.com/Shravani07-tech/VERBATIM-AI-.git
```

```bash
cd VERBATIM-AI- && npm install
```

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Add your keys:

```
GROQ_API_KEY=your_groq_key
TAVILY_API_KEY=your_tavily_key
```

Then:

```bash
npm run dev
```

Open http://localhost:3000.

**Without keys the app still runs.** Live verification is disabled, the header shows `FALLBACK`, and claim verdicts come from a built-in keyword heuristic instead of real evidence. This is a deliberate design choice so the app is never broken — but it is not fact-checking. See [§7](#7-simulation--demo-mode) and [§24](#24-limitations).

An optional `GROQ_MODEL` environment variable overrides the default model (`llama-3.3-70b-versatile`). It is not listed in `.env.example`.

---

## 5. Dashboard Overview

The default landing workspace. Three regions.

### Header (persistent across all workspaces)

- **Title** — "Truth Intelligence Workspace"
- **GROQ** and **TAVILY** status pills — green `ONLINE` when both API keys are configured on the server, amber `FALLBACK` when they are not. Both pills read from the same single health check, so they always agree with each other.
- **Session controls** — `Initiate Stream` → `Pause` → `Resume` → `Abort`
- **Trash icon** — purge the session ([§20](#20-reset--clear-session))
- **Simulation** — toggle scripted mode ([§7](#7-simulation--demo-mode))

### KPI cards

| Card | What it means |
|---|---|
| **Session Trust** | The Trust Index, with a status chip: *Stable* (≥80), *Warning* (60–79), *Critical* (<60) |
| **Claims Analyzed** | Total claims logged this session, including ones still analyzing |
| **Verified Claims** | Count with a VERIFIED verdict |
| **Flagged Skews** | MISLEADING + FALSE combined |

### Three working panels

- **Live Conversation** (left) — the transcript stream and manual input box
- **Trust Feed** (centre) — the Trust orb, pipeline stepper, and claim cards
- **Evidence Assistant** (right) — detail for whichever claim you select

**What to expect:** with Simulation ON and the stream running, all four KPI cards update every few seconds as scripted claims resolve. The Trust Index will fall from 100% — the scripted conversation deliberately contains two FALSE claims and one MISLEADING claim, so the demo shows the score reacting.

---

## 6. Live Session

A focused variant of the Dashboard for when you want the transcript large and the metrics glanceable.

**Layout:** a wide **Live Conversation** panel on the left; on the right, a large circular **Live Trust Index** dial and a **Session Diagnostics** card.

**Session Diagnostics** shows three fields:

- **Duration Elapsed** — `MM:SS`, counting only while the stream is live and not paused
- **Assertions Captured** — total claim count
- **Status** — `ONLINE`, `PAUSED`, or `STANDBY`

**How to use it:** this is the workspace to project during an actual live conversation. It has the least visual noise and the largest transcript area.

**Note:** the timer stops during pause and resumes on resume. It resets only on a full session purge, not on Abort.

---

## 7. Simulation / Demo Mode

The single most important thing to understand about the app.

### What it does

Simulation Mode replays a **pre-scripted five-statement conversation** hard-coded in `src/lib/demo-data.ts`. When it is ON and the stream is live:

- A new transcript segment appears every **4 seconds**
- Its claim card shows `ANALYZING` for **1.5 seconds**
- The card then resolves to a verdict that was written by hand, not computed

The five scripted claims cycle in order and loop:

| # | Claim | Verdict | Confidence |
|---|---|---|---|
| 1 | Global surface temperature has risen ~1.5°C above pre-industrial levels | VERIFIED | 96% |
| 2 | AI frontier models doubled in capability every 6 months for 3 years | MISLEADING | 84% |
| 3 | 90% of startups fail within their first year | FALSE | 91% |
| 4 | The Internet was invented in the 1990s | FALSE | 98% |
| 5 | AI will completely replace software engineers within 5 years | OPINION | 89% |

Each carries a real explanation and real, clickable source URLs (IPCC, NASA, Stanford AI Index, Epoch AI, US BLS, Harvard Business School, Internet Society, W3C, MIT CSAIL) — but those sources were curated in advance and written into the code. They were not retrieved at runtime.

### What it is honestly

**Simulation Mode is scripted playback. It performs no verification and makes no network calls whatsoever.** Nothing in it can fail: not the API keys, not the network, not the microphone, not rate limits.

That reliability is the entire point. It exists so a demonstration cannot be derailed by infrastructure.

### How to use it

- **It is ON by default.** New visitors get an instantly working demo.
- Click **Simulation** in the header to toggle it.
- Toggling it ON while the session is stopped **automatically starts the session**.
- Toggling it OFF **reveals the microphone button** in the Live Conversation panel — the mic button is hidden entirely while Simulation is ON.

### The critical exception

**The manual input box always runs the real pipeline, regardless of Simulation Mode.** Typing a claim and pressing Verify calls the live APIs even with Simulation ON. This is the intended way to demonstrate genuine verification without giving up the scripted feed's reliability. See [§8](#8-manual-claim-verification).

---

## 8. Manual Claim Verification

The text box at the bottom of the **Live Conversation** panel: *"Submit an assertion to verify manually…"*

### How to use it

1. Type or paste any factual statement.
2. Press **Verify** (or Enter).
3. The statement appears in the transcript tagged `USER`.
4. If it is judged to contain a claim, a claim card appears as `ANALYZING` and resolves when verification returns.

### What happens under the hood

1. The text is sent to `/api/extract-claims`. Groq decides whether it contains a verifiable assertion, and if so isolates the claim and the exact span to highlight.
2. If a claim is found, it is sent to `/api/verify-claim`.
3. That route runs a Tavily web search (top 3 results), passes the claim plus the retrieved evidence to Groq, and returns a verdict, confidence, explanation, category, and any bias signal.
4. The card updates in place.

### What to expect

- **Latency:** typically a few seconds — two sequential LLM calls plus a web search.
- **Not everything becomes a claim.** Greetings, questions, and casual remarks are filtered out by design. The transcript segment still appears; no claim card follows.
- **Highlighting:** when a claim is detected, the exact claim span is highlighted in cyan inside the transcript segment.

### When keys are missing or the call fails

There are three distinct fallback layers, and they behave differently:

| Situation | What happens | How you can tell |
|---|---|---|
| Both keys configured, everything works | Real Tavily evidence, real Groq judgement | Header pills green `ONLINE`; sources are real domains |
| Keys **not** configured on the server | The route returns a **keyword-heuristic verdict** with one placeholder source titled *"VerbatimAI Knowledge Benchmark"* | Header pills amber `FALLBACK`; the source domain reads `verbatim-ai.org` |
| The API call itself **fails** (network down, route error) | The browser applies a **client-side keyword matrix** with hard-coded verdicts for a handful of topics | Source domain is `verbatim-ai.org`, or a plausible-looking curated source |

**Be clear about this in any presentation:** the second and third rows are not verification. They are keyword pattern matches designed to keep the interface alive. A source card reading `verbatim-ai.org` is the tell.

---

## 9. Trust Index

A single 0–100% score summarising the factual health of the session.

### How it is calculated

```
if no claims yet:
    score = 100

otherwise:
    penalty = (MISLEADING × 12) + (FALSE × 25) + (UNVERIFIED × 5)
    score   = round( 100 − (penalty ÷ total_claims) × 1.5 )
    score   = clamp(score, 10, 100)
```

### What the design choices mean

- **FALSE costs roughly twice MISLEADING.** A fabrication is treated as worse than a distortion.
- **OPINION and VERIFIED cost nothing.** Opinions are explicitly excluded so open discussion and honest speculation don't degrade the score — this is stated on the Bias Analysis screen.
- **Claims still `ANALYZING` count toward the UNVERIFIED penalty.** The score therefore dips slightly while verification is in flight and recovers when the verdict lands. This is expected behaviour, not a bug.
- **The penalty is averaged, not accumulated.** It measures the *rate* of bad claims, not the count. Ten verified claims after one false claim will pull the score back up.
- **The floor is 10%, never 0%.** Even a session of pure fabrication bottoms out at 10.

### Reading the score

| Range | Label | Colour |
|---|---|---|
| 80–100 | Stable / *Credibility Confirmed* | Cyan |
| 60–79 | Warning / *Signal Warning* | Amber |
| 10–59 | Critical / *Anomaly Detected* | Rose |

### Where it appears

The Dashboard KPI card, the Trust Feed orb, the large Live Session dial, the Bias Analysis panel, and the Session Reports brief — all reading the same computed value.

> **One inconsistency to be aware of:** the History Archive screen recalculates the score with its own inline formula that omits the UNVERIFIED penalty and does not round the result. It can therefore display a long decimal and differ slightly from the live score. Cosmetic, but visible.

---

## 10. Trust Feed

The live claim stream — the centre of the Dashboard, and a full-width workspace of its own.

### Components

**Trust orb** — an animated score readout with the Trust Index, a status description, a **Bias Signals** count, and a **System State** indicator (`STANDBY` / `VERIFYING`). Small coloured nodes appear on the orb when verified claims, flagged claims, and cited references exist.

**Pipeline stepper** — five stages with a flowing light animation:

`SPEECH → DETECTION → SCANNING → EVALUATION → REALIGNED`

The stepper is an **animated status indicator, not instrumented telemetry**. When a claim is analyzing it cycles through the middle stages on a timer; once verdicts have landed it rests on the final stage. It communicates that work is happening — it does not report which specific stage the request is in.

**Filters** — `ALL`, `VERIFIED`, `FLAGGED` (misleading + false), `FALSE`, `OPINION`. The count pill next to the header reflects the filtered count.

**Search** — matches against claim text, explanation, and category.

**Claim cards** — newest first. Each shows the verdict badge, a category signal code (`SIG-Sci`, `SIG-Tec`, `SIG-Sta`…), confidence percentage, the claim, the explanation, speaker, timestamp, and a source count (`2 NODES`) or `NO CITES`.

### How to use it

Click any card to load it into the Evidence Assistant. The selected card takes a cyan border. Press **Escape** to deselect.

---

## 11. Claims Catalog

The audit view: every claim in the session as a two-column card grid.

**Controls:** the same five verdict filters as the Trust Feed, plus a keyword search across claim text and explanation.

**Difference from the Trust Feed:** the Catalog is built for reviewing an accumulated body of claims — denser, no orb, no live pipeline animation. The Trust Feed is for watching claims arrive; the Catalog is for going back through them.

Clicking a card loads it into the Evidence Assistant beside it. When nothing matches, you get an *"Catalog Empty"* state.

---

## 12. Evidence Nodes

Source-level auditing. Only claims that actually carry cited sources appear here.

**Left column** — selectable list of claims that have evidence, each with its verdict.

**Right panel**, for the selected claim:

- The target statement
- A **node graph** panel with the caption *"Verified against N index nodes"*
- **Node Details** — every cited source with its title, domain badge, snippet, and an external link icon

**On the node graph, honestly:** it is a **fixed decorative schematic** — two icons joined by an animated dashed line. It does not lay out one node per source, and its shape does not change with the data. The count in the caption below it *is* real. The list of sources beneath it *is* real. Treat the graphic as a visual motif, not a data visualisation.

**What is genuinely useful here:** the source list. In live mode these are real URLs retrieved from Tavily, and you should click through to verify them. In Simulation Mode they are the curated URLs from the demo script.

---

## 13. Evidence Assistant

The detail panel for a single selected claim. Present on the Dashboard, Trust Feed, and Claims Catalog.

### What it shows

1. **Verdict and confidence** — side by side at the top
2. **Target Statement** — the claim as extracted
3. **Relational Audit Map** — an SVG diagram: `ASSERT` at top, `SRC 01` and `SRC 02` in the middle, `VERDICT` at bottom, with animated flow lines. The verdict node is colour-coded to the actual verdict.
4. **Bias Signal** — an amber alert, shown only when the claim carries one
5. **Fact Check Rationale** — the LLM's explanation of *why* it reached this verdict
6. **Citational References** — every source with title, domain badge, snippet, and an *"Inspect Source Reference"* link that opens in a new tab

**On the audit map, honestly:** like the Evidence Nodes graph, it is a **fixed two-source schematic**. It always draws exactly two source nodes regardless of how many sources the claim actually has. Only the verdict node's colour is data-driven. The authoritative source list is the *Citational References* section below it.

### What to actually read

The **rationale** and the **references**. Those are the product. The rationale is where an LLM that has seen the retrieved evidence explains its reasoning, and the references are where you go to check whether it read them correctly.

**Empty state:** *"Assistant Dormant"* until you select a claim. **Clear** in the top-right, or **Escape**, deselects.

---

## 14. Bias Analysis

Aggregate distribution across the session.

### Left panel — Factual Distribution

Four labelled progress bars with counts and percentages: **Verified Facts** (cyan), **False Claims** (rose), **Misleading Accents** (amber), **Subjective Opinions** (purple).

### Right panel — Diagnostics Evaluation

| Metric | How it's derived |
|---|---|
| **Verification Trust Rating** | The Trust Index |
| **Dialogue Fact Density** | `(total − opinions) ÷ total` — what share of the conversation was empirically checkable |
| **Factual Correction Ratio** | `(false + misleading) ÷ total` — what share needed correcting |

A footnote explains that opinions are excluded from Trust Index calculations to avoid penalising open discourse.

### What this screen is and is not

Despite its name, this workspace charts the **distribution of verdicts**, not an analysis of rhetorical bias. Bias signals — phrases like *"Absolute Speculation"*, *"False Certainty & Cherry-Picked Metric"*, *"Unsupported Generalization"* — are detected per-claim during verification and surface in the **Evidence Assistant** and in the **Bias Signals** counter on the Trust orb. They are not broken down or charted here.

The app does contain a dedicated bias-analysis API route (`/api/analyze-bias`), fully implemented with both LLM and heuristic paths. **It is not wired to any part of the interface.** It exists as a working endpoint awaiting a UI.

---

## 15. History Archive

Reads back the session cached in your browser's localStorage.

**Summary strip:** File Type (`LOCAL_CACHE_v1`), Claims Logged, Trust Index Score, Active Duration.

**Restored Assertions:** a numbered list of every cached claim with its verdict.

**Read the on-screen notice carefully.** It states plainly that multi-session historical databases are disabled and only the active session is persisted in your local client sandbox.

### What this means

This is **not an archive of past sessions.** There is exactly **one** storage slot (`verbatimai_session_v1`), and it holds the current session. Starting fresh overwrites it. There is no list of previous sessions because previous sessions are not retained.

Clearing your browser data, using a different browser, or opening the app on another device gives you an empty archive. Empty state: *"Archive Clear"*.

**Naming caveat:** the displayed Trust Index here is recalculated with a slightly different formula than the live score — see the note in [§9](#9-trust-index).

---

## 16. Session Reports

A formatted verification brief for the current session.

**Header:** `VERBATIMAI VERIFICATION BRIEF`

**Metrics row:** Session Score, Total Scans, Time Elapsed.

**Factual Alerts:** every FALSE and MISLEADING claim, with verdict, timestamp, claim text, and explanation — shown only if such claims exist.

**Verified Telemetry:** every VERIFIED claim with its explanation.

**Footer:** a build identifier, `VERBATIMAI_CLIENT_ENGINE_v0.1`.

### Important

The screen is labelled *"Export-ready fact-checking briefings"*, but **there is no export or download button.** The brief renders on screen only. To capture it, use your browser's print-to-PDF or take a screenshot. Report export is a roadmap item, not a shipped feature.

Empty state: *"Report Inactive"* until claims exist.

---

## 17. Settings

A read-only status panel. **There are no configurable options** — nothing on this screen can be changed from the UI. It reports operational state.

| Row | What it reports |
|---|---|
| **Groq Llama-3 Node** | `ONLINE` if the server has both API keys configured; otherwise `OFFLINE // FALLBACK` |
| **Tavily Search Engine** | Same source as above — both rows read the same single health flag, so they always match |
| **Speech Recognition Service** | `AVAILABLE` if your browser exposes the Web Speech API; `UNSUPPORTED` otherwise |
| **Telemetry Simulation Engine** | `ACTIVE` / `INACTIVE` — mirrors the Simulation toggle |

**Use this screen to diagnose before demonstrating.** If Groq and Tavily read `OFFLINE // FALLBACK`, live verification will return heuristic results. If Speech Recognition reads `UNSUPPORTED`, the microphone will not work in this browser — switch to Chrome or Edge.

The status comes from `GET /api/health`, which is called once when the app loads. It reports only whether keys are *present*, never their values, and it does not test whether the providers are actually reachable.

---

## 18. Help & Support

In-app documentation, titled *Documentation Center*.

Contains a short "What is VerbatimAI?" explanation and a five-step walkthrough of the verification pipeline:

1. **Speech Ingestion** — browser microphone capture into the conversation panel
2. **Claim Extraction** — LLM isolation of testable assertions from opinions
3. **Evidence Scraping** — reference retrieval via Tavily search
4. **Consensus Analysis** — verdict assignment with rationale
5. **Telemetry Realignment** — Trust Index recalculation

This is a static explainer. There is no contact form, support ticketing, or live chat behind it.

---

## 19. Session Persistence

### How it works

The entire session state — transcript, claims, selected claim, elapsed duration, live/paused flags, and the Simulation setting — is written to browser **localStorage** under the key `verbatimai_session_v1`. The write happens on every state change, so the cache is always current.

On page load, the app reads that key back. If valid data is found, the session restores and a *"Telemetry Session Restored"* toast appears for three seconds. The demo sequence position resyncs to the restored claim count so reopening the page doesn't replay claims you already have.

If the cached data is corrupt, the app clears the key and starts clean rather than crashing.

### What it is and is not

**Is:** durable across page reloads, browser restarts, and crashes — on the same browser and device.

**Is not:** a database, a backup, or shared state. There is **one slot**. No cloud sync. No cross-device access. No multi-session history. No sharing a session with a colleague. Clear your browser data and it is gone permanently.

**Practical note:** localStorage has a per-origin quota of roughly 5–10 MB. A very long session with many claims and long source snippets could theoretically approach it. The app logs a console error if a write fails, but shows no user-facing warning.

---

## 20. Reset / Clear Session

The **trash icon** in the header (tooltip: *"Purge Console Buffer"*).

### What it does

- Stops the session and clears the paused flag
- Empties the transcript and all claims
- Clears the selected claim
- Resets the duration timer to `00:00`
- Resets the demo sequence to statement 1
- Stops the microphone if it is running
- **Switches Simulation Mode back ON**
- **Deletes the `verbatimai_session_v1` localStorage key**

### What to expect

Instant and total. **There is no confirmation dialog and no undo.** Once purged, the session is unrecoverable — including from the History Archive, which reads the very key that was just deleted.

**Distinguish from Abort:** `Abort` stops the stream and the microphone but *keeps* the transcript, claims, and elapsed time. The trash icon erases everything. Use Abort to stop; use the trash icon to start over.

---

## 21. Troubleshooting

### The microphone button isn't visible

Simulation Mode is ON. The mic button is hidden while Simulation is active. Toggle **Simulation** off in the header.

### "Web Speech API is not supported in this browser"

You are on Firefox or Safari. Switch to **Chrome or Edge**. Confirm on the **Settings** screen — *Speech Recognition Service* should read `AVAILABLE`.

### The microphone is enabled but nothing appears

- Check that the browser granted microphone permission (padlock icon in the address bar).
- Speech is only committed on a **final** recognition result — pause between sentences rather than speaking continuously.
- On production, speech recognition requires HTTPS. The deployed app is served over HTTPS, so this only affects unusual local setups.
- Check the browser console for a speech recognition error. On error the app silently deactivates the mic.

### Header pills say FALLBACK

The server does not have both `GROQ_API_KEY` and `TAVILY_API_KEY` configured. **Both** are required — one alone still reads `FALLBACK`. On Vercel, set them as Environment Variables and redeploy; environment variable changes do not take effect until a new deployment.

### Verdicts look generic, sources say "verbatim-ai.org"

You are seeing the fallback heuristic, not real verification. Confirm on the **Settings** screen. See the fallback table in [§8](#8-manual-claim-verification).

### Manual verification takes several seconds

Expected. It is two sequential LLM calls plus a web search. There is no timeout configured, so a slow provider means a slow card — it will stay on `ANALYZING` until the response arrives.

### My typed statement didn't produce a claim card

Claim extraction filters out greetings, questions, and casual remarks by design. Rephrase it as a concrete assertion with specifics — a number, a date, an attribution.

### The Trust Index dipped for no reason

Claims still `ANALYZING` count toward the UNVERIFIED penalty. The score recovers when the verdict lands.

### Everything vanished after a reload

Either the trash icon was clicked, or browser data was cleared. There is no server-side copy. Sessions cannot be recovered.

### Claim cards repeat during a long demo

The scripted sequence has five statements and loops. After roughly 20 seconds of Simulation you will see statement 1 again.

---

## 22. Security & Privacy

### API keys

Both `GROQ_API_KEY` and `TAVILY_API_KEY` are read **server-side only**, inside Next.js API routes. They have no `NEXT_PUBLIC_` prefix, so Next.js never inlines them into the client bundle. They are not reachable from the browser.

The `/api/health` endpoint returns only `{ status, live_verification }` — a boolean-equivalent availability flag. It never returns key values, key fragments, or raw environment data. This is enforced by an explicit comment and check in the route.

**Verified:** no API keys, tokens, or secrets appear anywhere in the committed repository. `.env*` files are gitignored and none are tracked in git.

### Your conversation data

**Stays in your browser.** Transcript and claims are held in React state and cached in your own localStorage. VerbatimAI has no database and no server-side storage — there is nowhere for your conversation to be retained.

**What does leave your browser:** the text of each statement you submit or speak is sent to VerbatimAI's own API routes, and from there to **Groq** (for claim extraction and evaluation) and **Tavily** (as a web search query). Those providers' own data-handling policies apply to that text.

**In Simulation Mode, nothing leaves your browser at all** — no network calls are made.

### Audio

Speech recognition uses the browser's native Web Speech API. In Chrome this typically routes audio through Google's speech servers. **VerbatimAI never receives, stores, or transmits raw audio** — it only receives the transcribed text the browser hands back.

### Authentication

**There is none.** No login, no accounts, no roles, no session tokens. The application is entirely public and entirely client-local. Anyone with the URL gets the same app with their own isolated browser-local state.

**Practical implication:** do not use VerbatimAI for confidential or regulated conversations. Claim text is transmitted to third-party AI and search providers, and there are no access controls of any kind.

---

## 23. Architecture Overview

```
Browser (React 19 client)
        │
        ▼
Next.js 15 App Router  ──────────────► localStorage (session cache)
        │
        ▼
Server-side API Routes (Vercel serverless)
        ├── /api/health          → key availability check
        ├── /api/extract-claims  → Groq
        ├── /api/verify-claim    → Tavily ──► Groq
        └── /api/analyze-bias    → Groq  (implemented, not wired to UI)
        │
        ▼
Verdict + Sources ──► Trust Index ──► Workspace
```

**Full-stack Next.js.** One application. The React front end and the API routes are the same deployment. **There is no Python or FastAPI backend** — the "backend" is Next.js route handlers running as serverless functions on Vercel.

**Client/server boundary:** the entire UI is a client component tree (`'use client'`). API routes are the only server-side code, and they exist specifically to keep API keys off the client.

**Views without routing:** all ten workspaces render from a single page. Switching views changes React state and pushes a `?view=` query parameter so browser Back and Forward work. There are no separate page routes.

Full detail in [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md).

---

## 24. Limitations

Summary — full treatment with impact and remediation in [LIMITATIONS.md](LIMITATIONS.md).

- **Chrome/Edge only for speech.** The Web Speech API is not reliably available in Firefox or Safari.
- **Speech quality gates everything.** A misheard word becomes a misverified claim; there is no confirmation step between transcription and verification.
- **Simulation Mode is not verification.** It is scripted playback with pre-written verdicts.
- **Fallback heuristics are not verification.** Keyword matching produces confident-looking verdicts backed by a placeholder source.
- **Three sources per claim.** Tavily is called with `maxResults: 3` at basic search depth, and snippets are truncated to 200 characters.
- **A parse failure can produce a false VERIFIED.** If Tavily returns results but the Groq response cannot be parsed, the route returns `VERIFIED` at 85% confidence based on the *existence* of sources rather than their content. This is the most consequential correctness gap in the system.
- **LLM reasoning is fallible.** Groq can misread evidence or express high confidence on a wrong verdict. Confidence percentages are the model's self-assessment, not a calibrated statistic.
- **No cloud persistence, no accounts, no collaboration.** One session, one browser, no login, no sharing.
- **No report export.** Session Reports renders on screen only.
- **Two SVG diagrams are decorative schematics,** not data-driven graphs.
- **The bias-analysis endpoint is unused.** Fully implemented, not connected to the UI.
- **No rate limiting on the API routes.** They are public and unauthenticated.

---

## 25. Quick Reference

### Controls

| Action | Where |
|---|---|
| Start session | `Initiate Stream` — header |
| Pause / resume | `Pause` / `Resume Stream` — header |
| Stop (keeps data) | `Abort` — header |
| Purge everything | Trash icon — header |
| Toggle scripted mode | `Simulation` — header |
| Enable microphone | Mic button — Live Conversation panel *(Simulation must be OFF)* |
| Verify a statement | Text box — bottom of Live Conversation panel |
| Inspect a claim | Click any claim card |
| Deselect a claim | `Escape`, or `Clear` in the Evidence Assistant |

### Verdicts

`VERIFIED` · `MISLEADING` · `FALSE` · `UNVERIFIED` · `OPINION` · `ANALYZING` *(in progress)*

### Trust Index

`100 − ((MISLEADING×12 + FALSE×25 + UNVERIFIED×5) ÷ total) × 1.5`, clamped to 10–100.
≥80 Stable · 60–79 Warning · <60 Critical.

### Timings

Scripted statement interval **4s** · Simulated verification delay **1.5s** · Restore toast **3s** · Scripted sequence length **5 statements, looping**

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | For live verification | Claim extraction and evaluation |
| `TAVILY_API_KEY` | For live verification | Web evidence retrieval |
| `GROQ_MODEL` | Optional | Override the default model |
| `NEXT_PUBLIC_APP_URL` | Optional | Base URL |

Both `GROQ_API_KEY` and `TAVILY_API_KEY` must be set for the app to report live verification as available.

### API endpoints

| Endpoint | Method | Used by UI |
|---|---|---|
| `/api/health` | GET | Yes — on load |
| `/api/extract-claims` | POST | Yes |
| `/api/verify-claim` | POST | Yes |
| `/api/analyze-bias` | POST | **No** |

### Storage

localStorage key `verbatimai_session_v1` — one slot, current session only.

### Browser support

Full experience: **Chrome, Edge**. Everything except the microphone works in Firefox and Safari.

---

*Documentation reflects the code-frozen production release. No screenshots are included because the repository contains none.*
