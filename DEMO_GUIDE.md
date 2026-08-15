# VerbatimAI — Demo Guide

**For the presenter. 3 minutes. Optimised for reliability over spectacle.**

---

## Before You Walk Up

### Setup checklist — do this 10 minutes before

- [ ] **Chrome or Edge**, full screen, one tab only
- [ ] Load **https://verbatimai-olive.vercel.app** and confirm it renders
- [ ] Click **Settings** in the sidebar. Confirm **Groq** and **Tavily** read `ONLINE`
- [ ] Click the **trash icon** to purge any leftover session — you want a clean 100% Trust Index on screen
- [ ] Confirm **Simulation** is ON (it is ON by default after a purge)
- [ ] Zoom the browser to **100%** — the layout is dense at smaller sizes
- [ ] Have a **second tab** with the app already loaded as an instant backup
- [ ] Close notifications, Slack, and email

### The one rule

**Do not use the microphone.** It depends on browser permissions, room acoustics, ambient noise, and a live network round-trip. In a demo room, all four will fail you. Mention that it exists; do not stake the demo on it.

Your reliable pair is **Simulation Mode** (zero network calls, cannot fail) plus **the manual input box** (real verification, one call, you control the input).

### If Settings shows FALLBACK

Live verification is unavailable. **Run the demo entirely in Simulation Mode** and skip the manual verification step — a fallback verdict cites `verbatim-ai.org`, and a judge who clicks it will see a placeholder. Adjust your 1:45–2:15 section to describe the architecture rather than demonstrate it live, and say honestly that live keys are not configured on this deployment.

---

## 0:00–0:20 — Hook

> "Every meeting, every lecture, every panel — somebody quotes a statistic and the room just… accepts it. Because by the time you've opened a tab to check, the conversation is three topics away.
>
> This is VerbatimAI. It listens to the conversation, pulls out the factual claims, searches the live web for evidence, and tells you whether each claim holds up — while the conversation is still happening."

**On screen:** the Dashboard, clean, Trust Index at 100%.

**Don't** open with your tech stack. Open with the problem the judges have personally experienced.

---

## 0:20–0:45 — Problem

> "Fact-checking isn't hard because the information is hidden. It's hard because it's *slow*. Search, read, evaluate the source, work out whether the framing is misleading — that's two minutes of work, and you get about four seconds.
>
> So misleading claims don't get challenged. Not because nobody noticed — because nobody could check fast enough to say something useful before the moment passed.
>
> VerbatimAI closes that gap. And critically, it doesn't just say true or false. It shows you the evidence and tells you *why*."

---

## 0:45–1:45 — Live Product Demo

### Step 1 — Start the scripted stream (0:45)

**Click `Initiate Stream`** in the header.

> "I'm running in Simulation Mode — this is a scripted conversation so the demo is deterministic. I'll show you real live verification in a moment."

**Say that out loud.** Judges reward honesty about what is scripted, and they punish discovering it themselves.

### Step 2 — Narrate the stream (0:50–1:20)

Statements arrive every 4 seconds. Each shows `ANALYZING`, then resolves. **Don't narrate every card** — pick the moments.

**When the climate claim resolves VERIFIED (96%):**
> "Claim extracted, evidence retrieved, verdict VERIFIED — cited to IPCC and NASA."

**When the AI-capability claim resolves MISLEADING (84%) — slow down here:**
> "This one's the interesting case. It's not false — training compute really did scale fast. But the framing overstates it. **MISLEADING**, with a bias signal: *Unsupported Generalization*. That distinction is the whole product. A binary true/false checker can't make it."

**When the startup claim resolves FALSE (91%):**
> "'90% of startups fail in year one.' Everyone's heard it. It's wrong — the Bureau of Labor Statistics puts year-one failure near 20%. The 90% figure is a ten-year number. Watch the Trust Index."

**Point at the Trust Index.** It has been dropping from 100% as flagged claims land. That live reaction is your strongest passive visual.

### Step 3 — Open the evidence (1:20–1:35)

**Click the FALSE startup claim card.** The Evidence Assistant loads on the right.

> "Every verdict is auditable. Here's the rationale, and here are the actual sources — Bureau of Labor Statistics, Harvard Business School. These are real links. The system never asks you to just trust it."

**Hover a source link** so judges see it is a genuine URL. Don't click through — you lose your tab.

### Step 4 — Real verification, live (1:35–1:45)

**This is your credibility moment.** Type into the manual input box at the bottom of the Live Conversation panel:

```
The Eiffel Tower is taller than the Statue of Liberty
```

**Press Verify.**

> "That box always runs the real pipeline — live Tavily search, live Groq evaluation — even with Simulation on. Nothing scripted. Let's see what it comes back with."

**A verdict card appears within a few seconds, cited to real sources.**

> "Real search, real evaluation, real sources — live, right now."

**Backup claims** (pick one, keep it factual and unambiguous):
- `Mount Everest is the tallest mountain above sea level`
- `The Great Wall of China is visible from space with the naked eye` *(a satisfying FALSE)*
- `Python was released before Java`

**If it takes longer than ~8 seconds:** keep talking through the architecture — that is your next section anyway. Don't stand in silence watching a spinner.

**If it errors or returns a `verbatim-ai.org` source:** say *"that's the fallback layer engaging — the system degrades gracefully instead of breaking"* and move straight on. That is a true statement and it turns a failure into a design point.

---

## 1:45–2:15 — Technical Explanation

Stay on the app — no slides.

> "Five stages.
>
> **Speech.** The browser's Web Speech API transcribes audio to text — no audio ever reaches our servers.
>
> **Claim extraction.** That text goes to **Groq** running Llama 3.3 70B. Groq matters here because it's the fastest inference available — and this whole product only works if verification lands *while the claim is still relevant*. Groq decides whether a statement contains a checkable assertion at all, and isolates it. Greetings and questions get filtered out.
>
> **Evidence.** The claim goes to **Tavily**, a search API built for AI agents. It returns real web sources with content snippets.
>
> **Evaluation.** Claim plus retrieved evidence go back to Groq, which returns a verdict, a confidence score, a plain-language rationale, and any rhetorical bias signal — as structured JSON.
>
> **Trust Index.** Every verdict feeds one running score. False claims cost more than misleading ones. Opinions cost nothing — we don't penalise people for having views.
>
> Architecturally it's a single Next.js 15 application. React front end, server-side API routes, deployed on Vercel. **The API keys live server-side only — they never reach the browser.** That's why there's a `/api/health` endpoint: it reports whether verification is available without ever exposing what the keys are."

---

## 2:15–2:45 — WOW Moment

**Click `Bias Analysis` in the sidebar.**

> "Here's what a whole conversation looks like once it's been analysed."

Four coloured distribution bars — verified, false, misleading, opinion — plus **Dialogue Fact Density** and **Factual Correction Ratio**.

> "This is a credibility profile of a conversation. Not one claim — the whole discussion. What fraction was actually checkable, and what fraction needed correcting.
>
> And notice: opinions are counted separately and cost nothing. That's a deliberate design decision. A fact-checker that punishes people for having opinions is a censorship tool. This one only flags claims that assert something checkable and get it wrong."

**Then click `Session Reports`.**

> "And it all compiles into a verification brief — every flagged claim, every verified claim, with the reasoning attached. Auditable after the fact."

**Why this is the closer:** it moves the story from *"a clever gadget"* to *"a system with a point of view about how fact-checking should work."* The opinion-exclusion argument is the strongest intellectual moment in the demo — judges remember a defensible design decision far longer than an animation.

**Alternative if you're running long:** skip Session Reports, stay on Bias Analysis, and go straight to closing.

---

## 2:45–3:00 — Closing

> "VerbatimAI turns fact-checking from something you do afterwards into something that happens *during*.
>
> It's live at verbatimai-olive.vercel.app — no login, no setup, it works the moment you open it.
>
> Speech, to claim, to evidence, to verdict, to trust — in real time.
>
> Thank you."

**Land on the Dashboard** with claims visible and the Trust Index showing a non-100% score. Let that sit on screen while judges ask questions.

---

## Timing at a Glance

| Time | Section | Action |
|---|---|---|
| 0:00–0:20 | Hook | Dashboard, Trust Index 100% |
| 0:20–0:45 | Problem | Talk over the clean dashboard |
| 0:45–1:20 | Scripted stream | `Initiate Stream`, narrate 3 of 5 claims |
| 1:20–1:35 | Evidence | Click the FALSE card, show sources |
| 1:35–1:45 | **Live verification** | Type a claim, press Verify |
| 1:45–2:15 | Architecture | Narrate the five stages |
| 2:15–2:45 | **WOW** | Bias Analysis → Session Reports |
| 2:45–3:00 | Close | Return to Dashboard |

---

## Recovery Plans

| If this breaks | Do this |
|---|---|
| Live verification errors | *"Fallback layer engaging — graceful degradation."* Continue with Simulation |
| App won't load | Switch to your pre-loaded backup tab |
| Both tabs dead | Present the architecture verbally from [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md); the pipeline story stands without the screen |
| Trust Index looks wrong | Trash icon, purge, restart — 5 seconds |
| Cards repeat | Expected — the sequence is 5 statements and loops. Don't mention it; move to the next section |
| Running over time | Cut Session Reports and the Evidence-Assistant hover; keep the live verification and the Bias Analysis close |
| A judge asks to try the mic | Say yes, but frame it: *"browser speech recognition, so room acoustics are the variable here."* Have them speak one short, clear sentence |

---

## Claims You Must Not Make

Judges verify. These are the traps:

| Don't say | Say instead |
|---|---|
| "It has a database" | "Sessions persist in browser localStorage — one session, client-side" |
| "It's multi-user" | "Single-user today. Cloud persistence is the next build" |
| "The demo is verifying live" | "Simulation is scripted. **This** box runs live" — then demonstrate |
| "It's always accurate" | "It surfaces evidence fast and shows its sources so you can check the reasoning" |
| "There's a Python backend" | "Full-stack Next.js — React front end, server-side API routes on Vercel" |
| "The graph maps every source" | Just don't reference the SVG diagrams as data. Point at the **source list** instead |
| "It exports reports" | "Reports render in-app; export is on the roadmap" |
| "It has authentication" | "No auth — that's a deliberate scope decision for the hackathon build" |

**The general rule:** every capability you claim, be ready to demonstrate on the spot. Judges ask *"can you show me that?"* far more often than presenters expect.

---

## Anticipated Follow-Ups

Full answers in [JUDGE_QA.md](JUDGE_QA.md). The three you will almost certainly get:

**"How is this different from just asking ChatGPT?"**
> "ChatGPT answers from training data and you have to ask it. This retrieves live web evidence per claim, cites it, and runs continuously without being prompted."

**"What stops the AI from hallucinating a verdict?"**
> "It doesn't judge from memory — it judges retrieved evidence, and every source is shown so you can check it. It's a constraint, not a guarantee. That's exactly why the sources are always visible."

**"Is the demo real?"**
> "The scripted stream isn't — I said so up front. The manual box is, and I ran it live in front of you."

---

**Rehearse the full 3 minutes at least twice, out loud, with the app open.** The timing above is tight, and the live-verification step is the one that most often runs long.
