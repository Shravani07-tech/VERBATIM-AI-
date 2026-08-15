# VerbatimAI — Limitations

An honest accounting of what this system cannot do, where it can be wrong, and what it would take to fix.

> **Why this document exists.** Every limitation below is a real property of the shipped code. Nothing is softened. A team that names its own gaps precisely is more trustworthy than one that waits to be caught — and this list is also the engineering roadmap.

---

## Severity Index

| # | Limitation | Severity |
|---|---|---|
| 1 | [Parse-failure produces false VERIFIED](#1-parse-failure-produces-a-false-verified) | **Critical** |
| 2 | [Fallback defaults to VERIFIED](#2-fallback-verdicts-default-to-verified) | **Critical** |
| 3 | [Fallbacks are indistinguishable in the UI](#3-fallback-results-are-nearly-indistinguishable-from-real-verification) | **High** |
| 4 | [Browser SpeechRecognition dependency](#4-browser-speechrecognition-dependency) | **High** |
| 5 | [Provider and API dependency](#5-provider-and-api-dependency) | **High** |
| 6 | [Search evidence is shallow](#6-search-evidence-is-shallow) | **High** |
| 7 | [LLM reasoning is fallible](#7-llm-reasoning-is-fallible) | **High** |
| 8 | [Demo Mode is scripted playback](#8-demo-mode-is-scripted-playback) | **Medium** |
| 9 | [localStorage is not a database](#9-localstorage-is-not-a-database) | **Medium** |
| 10 | [No cloud persistence](#10-no-cloud-persistence) | **Medium** |
| 11 | [No authentication](#11-no-authentication) | **Medium** |
| 12 | [No multi-user collaboration](#12-no-multi-user-collaboration) | **Medium** |
| 13 | [No rate limiting, caching, or cost control](#13-no-rate-limiting-caching-or-cost-control) | **Medium** |
| 14 | [Evidence graphs are decorative](#14-evidence-graphs-are-decorative-schematics) | **Low** |
| 15 | [No report export](#15-no-report-export) | **Low** |
| 16 | [Unwired bias-analysis endpoint](#16-unwired-bias-analysis-endpoint) | **Low** |
| 17 | [Dead component in the codebase](#17-dead-component-in-the-codebase) | **Low** |
| 18 | [Duplicated Trust Index formula](#18-duplicated-trust-index-formula) | **Low** |
| 19 | [Trust Index weights are uncalibrated](#19-trust-index-weights-are-uncalibrated) | **Low** |
| 20 | [Lint is broken](#20-lint-is-broken) | **Low** |
| 21 | [Prompt injection is unmitigated](#21-prompt-injection-is-unmitigated) | **Low** |

---

## 1. Parse-failure produces a false VERIFIED

**Severity: Critical**

### Current state

In `/api/verify-claim`, if Tavily returns sources but the Groq response cannot be parsed as JSON, the route returns:

```js
verdict: 'VERIFIED', confidence: 85,
explanation: 'Verified against live web search results.'
```

The verdict is inferred from search results *existing*, not from what they say.

### Impact

Search results existing tells you nothing about whether they support the claim — they might flatly contradict it. This path can label a demonstrably false statement `VERIFIED` at 85% confidence, complete with real, authoritative-looking sources attached.

**This is the most consequential correctness gap in the system.** Every other limitation degrades usefulness; this one produces confident misinformation, which is precisely the harm the product exists to prevent.

Mitigating factors: it only triggers when Groq returns unparseable output, which `response_format: json_object` makes uncommon, and the sources shown are real so a user who reads them can catch it.

### Future solution

Return `UNVERIFIED` when the reasoning layer is unavailable, with an explanation stating that evidence was retrieved but could not be evaluated. **A few lines of code.** It is the first thing to fix after the code freeze lifts.

---

## 2. Fallback verdicts default to VERIFIED

**Severity: Critical**

### Current state

When API keys are absent, `/api/verify-claim` runs a keyword heuristic against the claim text — matching fragments like `90%`, `fail`, `1990`, `double`, `every`, `think`, `replace`, `climate`. Anything that matches nothing falls through to the initialised default:

```js
verdict = 'VERIFIED', confidence = 88
explanation = 'Verified using analytical baseline knowledge...'
```

The client-side matrix in `page.tsx` has the same defaulting behaviour.

### Impact

An unknown claim gets a confident `VERIFIED` at 88%. It is a wrong answer to a question the system did not even attempt to answer.

`UNVERIFIED` exists as a first-class verdict specifically for this situation, and the fallback path does not use it.

### Future solution

Change the default to `UNVERIFIED` with confidence near zero and an explanation stating that live verification is unavailable. Keep the keyword matches only where they are genuinely reliable — or remove them entirely in favour of an honest "cannot verify" state.

---

## 3. Fallback results are nearly indistinguishable from real verification

**Severity: High**

### Current state

A fallback verdict renders in the same card, with the same badge, the same confidence percentage, and the same layout as a real one. The only differences are the header status pills reading `FALLBACK` and a source domain of `verbatim-ai.org`.

Every fallback result already carries `isDemo: true` in its data — **the flag exists and reaches the UI, but nothing renders from it.**

### Impact

A user who does not know to check the header pills or read the source domain cannot tell heuristic output from evidence-backed verification. In a demonstration, a judge could reasonably believe they watched real fact-checking.

### Future solution

Render `isDemo: true` as an unmissable badge on the card — *"SIMULATED — not live verification"* — plus a persistent banner while any fallback layer is active. **The data is already flowing; only the UI treatment is missing.** This is a small change with outsized honesty value.

---

## 4. Browser SpeechRecognition dependency

**Severity: High**

### Current state

Speech capture uses the browser-native Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`), configured for `en-US`, continuous, final results only. The app checks availability and alerts if unsupported; the Settings workspace reports status.

### Impact

- **Chromium-only in practice.** Firefox and Safari users cannot use voice input at all.
- **Transcription quality is entirely outside our control.** Accents, background noise, cross-talk, and technical vocabulary all degrade it, and we have no tuning surface.
- **Errors compound.** A misheard word becomes a misextracted claim becomes a misverified verdict. There is no confirmation step between transcription and verification.
- **Single language.** Hard-coded `en-US`.
- **No speaker diarisation.** Every microphone input is labelled `SPEAKER (LIVE MIC)`.
- **Requires HTTPS** in production.
- **Chrome silently times out** long sessions; the app restarts recognition on `onend`, which mostly works but can drop a phrase.

### Future solution

Replace with a server-side speech API (Whisper, Deepgram, AssemblyAI) for cross-browser support, higher accuracy, multi-language, and real speaker diarisation. Longer term, integrate directly with Zoom, Meet, and Teams so audio comes from the meeting platform rather than a browser microphone — which removes this dependency entirely and is what turns this from a tool into a product.

Interim: a transcript editing step so a user can correct a misheard claim before it is verified.

---

## 5. Provider and API dependency

**Severity: High**

### Current state

Verification requires both **Groq** and **Tavily**. Groq has a model-level fallback (`llama-3.3-70b-versatile` → `llama-3.1-8b-instant`); Tavily has none. No timeouts are configured on any external call. No retry logic beyond the single Groq model retry.

### Impact

- **Both providers are single points of failure.** No Groq means no reasoning; no Tavily means no evidence.
- **No timeouts** means a slow provider leaves a card on `ANALYZING` indefinitely, with no user-facing cancel.
- **Their outages are our outages**, and their rate limits are our ceiling.
- **Their pricing changes are our cost changes**, with no ability to shift load.
- **`/api/health` only checks that keys exist**, not that providers are reachable — a revoked key still reports `available`, so the UI promises live verification it cannot deliver.

### Future solution

Add explicit timeouts with user-visible cancellation. Add a second search provider (Brave, Serper, Exa) behind an interface so evidence retrieval can fail over. Add a second LLM provider for the same reason. Extend the health check to a real reachability probe with a short cached TTL. Add exponential-backoff retry on transient failures.

---

## 6. Search evidence is shallow

**Severity: High**

### Current state

```js
searchDepth: 'basic', maxResults: 3, includeAnswer: false
```

Snippets are truncated to 200 characters. There is no source-credibility weighting, no recency filter, and no domain preference.

### Impact

- **Three sources is thin** for a contested or nuanced claim. A genuine scientific dispute cannot be represented in three basic-depth results.
- **200-character excerpts** mean the model reasons over fragments, not documents. Critical qualifying context frequently sits outside the excerpt.
- **All sources carry equal weight in the prompt.** A personal blog and a national statistics agency are presented identically. Nothing tells the model which to trust.
- **No recency handling.** A stale article can outrank current data on a time-sensitive claim.
- **Single query, no reformulation.** If the claim's phrasing retrieves poorly, there is no second attempt.

### Future solution

Raise result count and use advanced search depth for claims flagged as high-stakes. Add a **domain-authority ranking layer** — government, academic, and established news sources weighted above general web — and surface that weighting in the UI. Fetch full page content for the top results rather than relying on snippets. Add query reformulation: if the first search returns weak results, rephrase and retry. Add recency weighting for time-sensitive categories.

**Source-credibility weighting is the single highest-leverage quality improvement available to this product.**

---

## 7. LLM reasoning is fallible

**Severity: High**

### Current state

Groq evaluates each claim against retrieved evidence at `temperature: 0.1` with a constrained five-verdict JSON schema. It returns a confidence score.

### Impact

- **The model can misread evidence** — miss a negation, invert a statistic, over-weight a weak source, or conflate two similar claims.
- **Confidence is self-assessed, not calibrated.** A 95% is the model's expression of certainty, not a validated probability. It can be 95% confident and wrong.
- **The fact/opinion boundary is genuinely fuzzy.** *"This policy will hurt the economy"* is partly predictive and partly checkable. The classification is one LLM judgement with no confirmation step.
- **Nuance compresses badly into five buckets.** A claim that is true in one jurisdiction and false in another has no natural verdict.
- **Evidence-context inheritance.** The claim is verified in isolation; surrounding conversational context is not passed in, even though the route accepts a `context` field the client never populates.
- **Model behaviour drifts** as providers update models. A verdict reproducible today may not be in six months.

### Future solution

Multi-model consensus — run evaluation across two or three models and flag disagreement as low confidence, which is a far better calibration signal than self-reported certainty. Calibrate confidence against a labelled benchmark of human fact-checker judgements. Add explicit uncertainty verdicts (`DISPUTED`, `CONTEXT-DEPENDENT`). Populate the `context` field so claims are evaluated in conversational context. Pin model versions for reproducibility.

**The framing that stays true regardless:** VerbatimAI accelerates research and shows its sources. It is not an oracle, which is exactly why every citation is visible and clickable.

---

## 8. Demo Mode is scripted playback

**Severity: Medium** *(by design, but must always be disclosed)*

### Current state

Simulation Mode replays five hard-coded statements from `src/lib/demo-data.ts` on a 4-second interval, each resolving after a 1.5-second simulated delay to a hand-written verdict, confidence, explanation, and source list. **Zero network calls.** It is **ON by default**.

### Impact

- **It performs no verification whatsoever.** Nothing is checked.
- **Being the default state** means a first-time visitor may believe they are watching live fact-checking.
- **It cycles after five statements**, which becomes visible in a demo longer than ~20 seconds.
- **Its sources, while real and authoritative, were curated in advance** — they were never retrieved.
- **It can mask a broken live pipeline.** The app looks perfectly healthy with no keys configured at all.

### Why it exists anyway

Demo reliability, and the trade is worth it. Simulation Mode cannot fail on keys, network, microphone permissions, or rate limits. For a hackathon presentation that is a real engineering decision, not a shortcut.

### Future solution

Keep it — but label it unmistakably in the UI while active, and add a first-run explainer stating that the default view is a simulation with a one-click path to live verification. Expand the sequence beyond five items so looping is less visible.

**Presenter obligation:** always state that the demo is scripted *before* being asked, then demonstrate real verification via the manual input box — which runs the live pipeline even with Simulation ON.

---

## 9. localStorage is not a database

**Severity: Medium**

### Current state

The entire session persists as one JSON blob under `verbatimai_session_v1`, written on every state change and restored on mount.

### Impact

- **One slot.** A new session overwrites the previous one. The History Archive shows one session because there is only ever one.
- **One browser, one device.** No sync of any kind.
- **~5–10 MB quota.** A long session with many claims and long snippets could approach it. Write failures log to the console with **no user-facing warning** — a user could believe their session is saved when it is not.
- **Trivially lost.** Clearing browser data destroys it permanently, with no recovery path.
- **No integrity guarantees.** Any script on the origin can read or modify it.
- **Synchronous writes** on every state change; negligible at demo scale, but it would become a jank source in a multi-hour session.

### Future solution

Postgres (via Supabase, Neon, or Vercel Postgres) with localStorage demoted to an offline cache that syncs when connectivity returns. Add a visible save indicator and a real quota warning. This is the gateway to multi-session history, and it arrives with authentication as a single piece of work.

---

## 10. No cloud persistence

**Severity: Medium**

### Current state

There is no server-side storage of any kind. Route handlers are stateless. Nothing is written to disk or database anywhere.

### Impact

- **No cross-device access.** Start on a laptop, and it does not exist on your phone.
- **No session history.** Past sessions are unrecoverable — they were never stored.
- **No sharing.** A session cannot be sent to a colleague.
- **No analytics.** We cannot measure verdict accuracy over time, identify commonly repeated false claims, or improve the system from usage data.
- **No compliance story.** Regulated industries need retained, auditable records. There are none.

### Future solution

Server-side session storage with user-scoped access, a real session list, shareable read-only links, and export. This unlocks the enterprise use cases described in [JUDGE_QA.md](JUDGE_QA.md) §22.

---

## 11. No authentication

**Severity: Medium**

### Current state

No login, no accounts, no roles, no tokens, no route-level authorisation. Fully public.

### Impact

- **API routes are open.** Anyone can call `/api/verify-claim` directly and consume our Groq and Tavily quota. Combined with [#13](#13-no-rate-limiting-caching-or-cost-control), this is a real cost-exposure risk on a public URL.
- **No per-user anything** — no settings, no history, no attribution.
- **No enterprise viability.** SSO, roles, and audit logs are table stakes for organisational buyers.
- **No abuse controls.** No way to block a bad actor.

**Mitigating factor:** with no server-side data, there is nothing to protect *between users* — every session is already isolated by being client-local. The risk is quota abuse, not data exposure.

### Future solution

NextAuth or Clerk with OAuth, session-scoped API authorisation, per-user quotas, and SSO for enterprise. Arrives together with cloud persistence.

---

## 12. No multi-user collaboration

**Severity: Medium**

### Current state

Single user, single browser, single session. No sharing, no real-time sync, no team features.

### Impact

The natural use cases are inherently collaborative. A newsroom fact-checking a debate wants the whole desk seeing the same feed. A meeting wants participants seeing the same flags. Today, everyone would have to run their own instance and independently verify the same claims — duplicating cost and producing potentially divergent verdicts.

### Future solution

Shared session rooms over WebSockets or server-sent events, with one verification pipeline broadcasting to many viewers — which also *reduces* cost by deduplicating work. Add roles (host, viewer), collaborative annotation, and human overrides of AI verdicts.

---

## 13. No rate limiting, caching, or cost control

**Severity: Medium**

### Current state

No rate limiting. No caching. No usage metering. No budget caps. Every claim triggers two LLM calls and a web search, every time.

### Impact

- **Repeated claims cost full price.** In a conference where the same statistic is quoted five times, we pay five times for an identical result.
- **Public unauthenticated routes** can be scripted against to drain provider quota.
- **Unbounded input length** means an arbitrarily long payload becomes an arbitrarily long — and expensive — prompt.
- **No visibility into spend.** No metering means no way to know cost per session.

### Future solution

Redis-backed claim cache keyed on a normalised hash of the claim text — likely the single largest cost reduction available. Per-IP and per-user rate limits. Input length caps. Usage metering with per-tenant budget alerts.

---

## 14. Evidence graphs are decorative schematics

**Severity: Low**

### Current state

Two SVG visualisations are presented as evidence graphs:

- **Evidence Nodes** — a fixed two-icon diagram joined by an animated dashed line
- **Evidence Assistant "Relational Audit Map"** — always exactly `ASSERT` → `SRC 01` / `SRC 02` → `VERDICT`, regardless of the claim's real source count

Only the verdict node's colour is data-driven.

### Impact

They look like data visualisations and are not. A claim with five sources still shows two nodes. A viewer could reasonably conclude the graph reflects the evidence structure.

**Mitigating factor:** the source *lists* beneath both graphics are fully real and complete, and the caption *"Verified against N index nodes"* uses the true count.

### Future solution

Render one node per actual source, sized by credibility weight and coloured by whether the source supports or contradicts the claim. Add supports/refutes edge typing. This becomes genuinely valuable once source-credibility ranking ([#6](#6-search-evidence-is-shallow)) exists — at which point the graph would visualise something real.

**Presenter note:** never point at these diagrams as data. Point at the source lists.

---

## 15. No report export

**Severity: Low**

### Current state

Session Reports renders a formatted brief on screen. The workspace subtitle reads *"Export-ready fact-checking briefings"* but **there is no export or download control anywhere in the application.**

### Impact

A user who wants to keep a verification record must screenshot or print-to-PDF from the browser. The subtitle promises a capability that does not exist, which is the kind of small gap a judge notices.

### Future solution

PDF export via a client-side generator, and Markdown or JSON export for programmatic use. **The data is already assembled and rendered** — this is close to purely additive work and one of the highest value-per-effort items on the list.

---

## 16. Unwired bias-analysis endpoint

**Severity: Low**

### Current state

`/api/analyze-bias` is fully implemented with a Groq path and an absolute-language heuristic path, returning `hasBiasSignal`, `biasType`, `explanation`, and `severity`. **Nothing in the UI calls it.**

Bias signals shown on claim cards come from the `biasSignal` field of the verify-claim response, not this endpoint.

### Impact

Built capability delivering zero user value. The Bias Analysis workspace — the natural consumer — instead displays verdict distribution, so its name overpromises relative to what it shows.

### Future solution

Call it during transcript ingestion for a per-segment bias read independent of factual verification, and surface the `severity` field, which has no UI representation at all today. Then make the Bias Analysis workspace actually analyse bias: signal types, frequency, severity distribution, per-speaker patterns.

---

## 17. Dead component in the codebase

**Severity: Low**

### Current state

`src/components/ClaimDetailModal.tsx` exists, is fully written, and is **never imported or rendered anywhere.** Claim detail is delivered by the `EvidenceAssistant` panel instead.

### Impact

Maintenance confusion — a developer could reasonably assume a modal exists. It is also a documentation hazard: the repository README lists a *"Claim Intelligence Detail Modal"* as a feature and instructs users to click a claim card to open it. **That instruction does not match the shipped application.** Clicking a card populates the side panel; no modal opens.

### Future solution

Delete the component, or wire it in as a full-screen detail view. Correct the README. Documented here so nobody demonstrates or documents a modal that does not appear.

---

## 18. Duplicated Trust Index formula

**Severity: Low**

### Current state

The Trust Index is computed in `calculateStats()` in `page.tsx`. `HistoryArchiveView` recomputes it with its own inline expression that **omits the UNVERIFIED penalty and does not round the result.**

### Impact

The History Archive can display a long decimal (e.g. `93.66666666666667%`) and a value that differs from the live score for the same session. Purely cosmetic, but visible and undermining — two screens disagreeing about the same number invites doubt about the number.

### Future solution

Extract the formula into a single shared utility and call it from both. Trivial refactor.

---

## 19. Trust Index weights are uncalibrated

**Severity: Low**

### Current state

`MISLEADING × 12`, `FALSE × 25`, `UNVERIFIED × 5`, averaged over total claims and scaled by 1.5, clamped to 10–100.

### Impact

The weights are reasoned but arbitrary. There is no dataset behind "25 versus 12" — the ratios encode a defensible intuition, not a measured relationship. Scores are therefore comparable *within* the system but have no external meaning. A 73% does not correspond to any validated notion of conversational reliability.

The scaling factor of 1.5 is similarly unexplained, and the 10% floor means a session of pure fabrication and a session of mostly-fabrication can be indistinguishable at the bottom.

### Future solution

Calibrate against human fact-checker ratings of real conversations. Weight by claim significance — a false claim central to an argument should cost more than an incidental aside. Consider a confidence-weighted penalty so a low-confidence FALSE costs less than a high-confidence one. Publish the methodology so the number is interpretable.

---

## 20. Lint is broken

**Severity: Low**

### Current state

`eslint.config.mjs` exists, but ESLint is **not** in `devDependencies`. `npm run lint` fails, and `next build` prints *"ESLint must be installed in order to run during builds"* and proceeds without linting.

### Impact

No automated code-quality enforcement. The production build itself compiles and deploys cleanly, so this affects development hygiene rather than the shipped artefact — but it means style and correctness regressions would go uncaught in CI.

### Future solution

`npm install --save-dev eslint eslint-config-next`, then fix whatever it surfaces. Deferred here only because the code freeze prohibits dependency changes.

---

## 21. Prompt injection is unmitigated

**Severity: Low** *(today; rises with adoption)*

### Current state

Claim text is interpolated directly into the Groq prompt with no sanitisation, delimiting, or instruction-hierarchy defence. Retrieved Tavily snippets are also passed in verbatim.

### Impact

A crafted statement — spoken or typed — could in principle instruct the model to return a chosen verdict. More subtly, a **web page in the retrieved evidence** could contain injected text targeting the evaluator, meaning an adversary who controls a page ranking for a claim could influence its verdict.

**Low severity today** because there is no authentication, no stored data, and no privileged action a successful injection could reach — the worst outcome is one wrong verdict on one user's screen. It rises sharply in severity the moment verdicts are shared, stored, or acted upon.

### Future solution

Clear delimiting of untrusted content in prompts, explicit instruction-hierarchy framing, and output validation that rejects verdicts outside the allowed set. Treat retrieved web content as untrusted input rather than as trusted evidence.

---

## What This List Says About the Project

The pipeline architecture is sound: retrieval before reasoning, structured constrained output, visible citations, graceful degradation, and credentials that never cross the client boundary. Those are the right decisions and they are correctly implemented.

The gaps cluster in three places:

1. **Fallback paths default toward `VERIFIED` when they should default to `UNVERIFIED`** — items 1, 2, and 3. These are small code changes with disproportionate correctness value, and they are the first work to do.
2. **Persistence and identity were deliberately scoped out** — items 9 through 12. Not oversights; a scope decision that kept the demo robust. They form one coherent next phase.
3. **Evidence depth and calibration are where quality improves next** — items 6, 7, and 19. Source-credibility ranking is the highest-leverage single change available.

Everything else is polish: a dead component, a duplicated formula, a missing dev dependency, an unwired endpoint.

**The distinction worth holding onto:** items 1, 2, 3, 17, 18, and 20 are defects. Items 9 through 13 are scope decisions. Both belong on this list, but they are different kinds of thing, and saying which is which is part of being honest about them.
