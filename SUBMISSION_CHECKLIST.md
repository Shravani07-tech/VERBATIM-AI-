# VerbatimAI — Submission Checklist

Pre-submission verification. Work top to bottom.

**Production:** https://verbatimai-olive.vercel.app
**Repository:** https://github.com/Shravani07-tech/VERBATIM-AI-

> Items marked **VERIFY ON HACKATHON PORTAL** depend on rules this repository cannot know. Check the official portal for the real requirements — do not assume the list below is complete.

---

## Technical

- [x] **Production URL works** — https://verbatimai-olive.vercel.app *(re-confirm on the day, on the presentation machine and network)*
- [x] **GitHub repository works** — https://github.com/Shravani07-tech/VERBATIM-AI-
- [x] **Build passes** — `npm run build` compiles cleanly. 22 kB page, 125 kB first-load JS, 4 dynamic API routes
- [x] **No secrets committed** — verified: no API key, token, or secret appears in any tracked file or in git history. `.env*` is gitignored and no environment file is tracked
- [ ] **Groq production variable configured** — `GROQ_API_KEY` set in Vercel → Project → Settings → Environment Variables
- [ ] **Tavily production variable configured** — `TAVILY_API_KEY` set in the same place
- [ ] **Verify both keys are actually live** — open the deployed app → **Settings** workspace → both Groq and Tavily must read `ONLINE`. If either reads `OFFLINE // FALLBACK`, live verification is not working
- [x] **Demo Mode works** — Simulation replays 5 scripted statements on a 4-second interval with zero network calls
- [x] **Manual verification works** — the input box at the bottom of the Live Conversation panel runs the real pipeline, including while Simulation is ON
- [x] **Session persistence works** — session saves to localStorage `verbatimai_session_v1` and restores on reload with a confirmation toast
- [x] **Sidebar navigation works** — all 10 workspaces render; `?view=` query parameter keeps browser Back/Forward functional

### Also worth confirming

- [ ] **Purge control tested** — trash icon clears state and deletes the localStorage key
- [ ] **Tested in the actual presentation browser** on the actual presentation machine
- [ ] **Tested on the venue network**, or on a mobile hotspot as a stand-in

### Known technical gaps — decide whether to disclose or fix

These are documented in [LIMITATIONS.md](LIMITATIONS.md). Under a code freeze, disclose rather than fix.

- [ ] **Aware:** the parse-failure path can return a false `VERIFIED` — the most serious correctness gap
- [ ] **Aware:** fallback verdicts default to `VERIFIED` instead of `UNVERIFIED`
- [ ] **Aware:** `npm run lint` fails — ESLint is not installed as a dependency. The production build is unaffected
- [ ] **Aware:** `ClaimDetailModal.tsx` is dead code, and the README documents it as a shipped feature. **Do not demonstrate or describe a claim modal — none opens.** Clicking a card populates the Evidence Assistant panel
- [ ] **Aware:** `/api/analyze-bias` is fully implemented but not called from the UI
- [ ] **Aware:** 41 non-existent Tailwind colour classes generate no CSS, so some muted text renders brighter than designed

---

## Demo

- [ ] **Browser tested** — Chrome or Edge, full screen, one tab, zoom at 100%
- [ ] **Microphone tested** — confirm it works, then **do not use it in the demo**. Browser speech depends on permissions, room acoustics, and a network round-trip. See [DEMO_GUIDE.md](DEMO_GUIDE.md)
- [ ] **Simulation fallback tested** — start the stream with Simulation ON and confirm claims arrive and resolve
- [ ] **Demo claims prepared** — 2–3 short factual statements ready to type into the manual input box. Suggested: *"The Eiffel Tower is taller than the Statue of Liberty"*, *"Mount Everest is the tallest mountain above sea level"*, *"The Great Wall of China is visible from space with the naked eye"*
- [ ] **Live verification rehearsed end to end** — type a claim, press Verify, confirm a real verdict returns with real sources. **This is the step that most often runs long**
- [ ] **3-minute pitch rehearsed** — out loud, with the app open, at least twice. Timed
- [ ] **Backup demo plan ready** — a second browser tab pre-loaded; know the recovery lines from [DEMO_GUIDE.md](DEMO_GUIDE.md)
- [ ] **Session purged immediately before presenting** so the Trust Index starts at a clean 100%
- [ ] **Notifications, Slack, and email closed**

### Non-negotiable

- [ ] **Disclosure line rehearsed.** State that the streaming demo is scripted **in the first sentence of the demo**, then immediately demonstrate live verification via the manual box. Being caught on this after the fact is the single largest risk to the whole submission

---

## Submission

- [ ] **GitHub URL** — https://github.com/Shravani07-tech/VERBATIM-AI-
- [ ] **Production URL** — https://verbatimai-olive.vercel.app
- [ ] **Project description** — draft below
- [ ] **Tech stack** — draft below
- [ ] **Problem statement** — draft below
- [ ] **Solution** — draft below
- [ ] **Innovation** — draft below
- [ ] **Impact** — draft below
- [ ] **Demo video if required** — **[ ] VERIFY ON HACKATHON PORTAL.** No video exists in the repository. If one is required, check the maximum length, format, and whether it must be publicly accessible
- [ ] **Presentation/deck if required** — **[ ] VERIFY ON HACKATHON PORTAL.** No deck exists in the repository
- [ ] **Repository visibility** — **[ ] VERIFY ON HACKATHON PORTAL.** Confirm whether the repo must be public and whether judges need to be added as collaborators
- [ ] **Submission deadline and timezone** — **[ ] VERIFY ON HACKATHON PORTAL**
- [ ] **Team member registration** — **[ ] VERIFY ON HACKATHON PORTAL**
- [ ] **Category or track selection** — **[ ] VERIFY ON HACKATHON PORTAL**
- [ ] **Licence requirement** — **[ ] VERIFY ON HACKATHON PORTAL.** No `LICENSE` file exists in the repository
- [ ] **Sponsor tool declaration** — **[ ] VERIFY ON HACKATHON PORTAL.** VerbatimAI uses **Groq** and **Tavily**; if there are sponsor prize tracks for either, declare them

---

## Ready-to-Paste Submission Copy

### Project description

> VerbatimAI is a real-time truth intelligence workspace that fact-checks conversation as it happens. It captures speech through the browser, extracts verifiable factual claims using Groq, retrieves live web evidence via Tavily, evaluates each claim against that evidence, and presents a cited verdict — VERIFIED, MISLEADING, FALSE, UNVERIFIED, or OPINION — alongside a running Trust Index for the session. Every verdict ships with its sources, because the goal is to accelerate human judgement, not replace it.

### Tech stack

> **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5, Tailwind CSS v4, Lucide icons
> **Backend:** Next.js Route Handlers deployed as Vercel serverless functions
> **Reasoning:** Groq (`llama-3.3-70b-versatile`, falling back to `llama-3.1-8b-instant`)
> **Evidence retrieval:** Tavily Search API
> **Speech:** browser-native Web Speech API
> **Persistence:** browser localStorage
> **Deployment:** Vercel

### Problem statement

> In live lectures, meetings, panels, and interviews, factual claims arrive faster than anyone can check them. A statistic gets quoted and the conversation has moved on three topics before anyone could open a search tab. Fact-checking doesn't fail because the information is hidden — it fails because it's slow. The result: wrong numbers get repeated as settled fact, misleading framings pass unchallenged, and nobody keeps a record of which claims were load-bearing.

### Solution

> VerbatimAI closes the latency gap by running the search-and-evaluate loop continuously in the background. Speech becomes text, Groq isolates the checkable claim, Tavily retrieves live web evidence, and Groq evaluates the claim against that evidence — returning a verdict, a confidence score, a plain-language rationale, and any rhetorical bias signal. Every verdict feeds a single Trust Index for the conversation. Because the LLM reasons over retrieved documents rather than training data, and because every source is displayed and clickable, the output is auditable rather than authoritative.

### Innovation

> Three design decisions distinguish VerbatimAI from a generic LLM wrapper.
>
> **Retrieval before reasoning.** The model is never asked "is this true?" — it's asked whether specific retrieved evidence supports a specific claim. That converts the task from recall, where LLMs are unreliable, to reading comprehension, where they are much stronger.
>
> **Five verdicts, not two.** MISLEADING captures the most common real-world failure mode — technically true but distorted — that binary true/false checkers cannot express.
>
> **Opinions carry zero Trust Index penalty.** This is a deliberate position: a fact-checker that penalises people for having views becomes a censorship tool. VerbatimAI only scores claims that assert something checkable and get it wrong.

### Impact

> VerbatimAI targets newsrooms live-blogging debates, analysts checking claims in earnings calls and vendor pitches, educators teaching source evaluation, and compliance functions documenting substantiation. Newsrooms are the clearest beachhead — the workflow already exists, the pain is deadline-bound and acute, and the buyer needs no education.
>
> It is deployed and publicly accessible with no login or installation. Current constraints are stated openly: sessions persist in browser localStorage rather than a database, there is no authentication or multi-user collaboration, and speech capture requires a Chromium browser. Cloud persistence with authentication is the next build, followed by source-credibility ranking to improve verdict quality.

---

## Final 15 Minutes Before Presenting

1. [ ] Open the production URL on the presentation machine
2. [ ] **Settings** workspace → confirm Groq and Tavily both read `ONLINE`
3. [ ] Click the **trash icon** → Trust Index resets to 100%
4. [ ] Confirm the **Simulation** button is active
5. [ ] Open a **second tab** with the app loaded as a backup
6. [ ] Test one live verification, then purge again
7. [ ] Set browser zoom to **100%**, go full screen
8. [ ] Close notifications, Slack, and email
9. [ ] Re-read the disclosure line: *"I'm running in Simulation Mode — this is a scripted conversation so the demo is deterministic. I'll show you real live verification in a moment."*

---

**Related:** [DEMO_GUIDE.md](DEMO_GUIDE.md) · [JUDGE_QA.md](JUDGE_QA.md) · [LIMITATIONS.md](LIMITATIONS.md) · [FINAL_PRODUCT_AUDIT.md](FINAL_PRODUCT_AUDIT.md)
