# VerbatimAI — Judge Q&A

Honest answers to the questions judges actually ask.

> **Ground rule:** every answer below is verifiable against the source code. Nothing here overstates what is built. If a judge checks, the answer holds — and a presenter who concedes a limitation cleanly gains more credibility than one who dodges it.

---

## 1. What makes VerbatimAI different from ChatGPT?

Three real differences.

**It's continuous, not prompted.** ChatGPT waits for you to ask. VerbatimAI runs against a live conversation stream — statements arrive, claims get extracted, verification fires automatically. Nobody has to decide to check something.

**It retrieves before it judges.** Ask ChatGPT whether a statistic is true and it answers from training data — which has a cutoff and no citations. VerbatimAI runs a live web search first, then asks the LLM to evaluate the claim *against those retrieved documents*. The model's job is reading evidence, not recalling facts.

**Every verdict is auditable.** Each result ships with the sources it was based on, a plain-language rationale, and a confidence score. You can click through and check the reasoning yourself.

**The honest caveat:** you could build a version of this on top of ChatGPT with browsing. The differentiation is the product architecture — real-time, continuous, structured verdicts, cited evidence, and a rolling trust score — not exclusive access to a capability.

---

## 2. Why real-time verification?

Because fact-checking has a relevance half-life.

A correction delivered while a claim is still under discussion changes the conversation. The same correction delivered an hour later is trivia. In a meeting, a lecture, or a negotiation, the window where a fact-check is actionable is measured in seconds.

That's why the architecture is what it is. Groq was chosen specifically for inference latency — the product only works if the verdict lands while the claim still matters. A fact-checker with a thirty-second latency isn't a slower version of this product; it's a different, less useful product.

---

## 3. How does Groq fit into the architecture?

Groq is the reasoning layer, called at **two** distinct stages.

**Stage 1 — claim extraction** (`/api/extract-claims`). Raw text goes in; Groq decides whether it contains a verifiable assertion, and if so isolates the claim, classifies it (Science / Technology / Statistics / History / Opinion / General), and returns the exact span to highlight. This filters out greetings and questions so we don't waste a search on "how's everyone doing."

**Stage 2 — evidence evaluation** (`/api/verify-claim`). The claim plus the retrieved Tavily documents go to Groq with a system prompt constraining it to five verdicts. It returns structured JSON: verdict, confidence, explanation, category, and any bias signal.

**Implementation details:** the Groq SDK with `response_format: json_object` for guaranteed parseable output, and `temperature: 0.1` for determinism — we want consistency, not creativity. Default model is `llama-3.3-70b-versatile`, overridable via a `GROQ_MODEL` environment variable, with automatic fallback to `llama-3.1-8b-instant` if the primary model errors.

**Why Groq specifically:** latency. Two sequential LLM calls sit in the critical path of every verification. On slower inference this product isn't real-time.

---

## 4. How does Tavily fit into the architecture?

Tavily is the evidence layer — the thing that keeps the LLM from answering from memory.

For each claim, `/api/verify-claim` queries Tavily and gets back the top **3** results at `basic` search depth. Each result is normalised into a source object: title, URL, extracted domain, and a content snippet truncated to 200 characters. Those source objects go to Groq as the evidence to reason over, and the same objects render in the UI as the citations.

**Why a search API rather than scraping:** Tavily is built for AI agents — it returns extracted content rather than raw HTML, which means no parser to maintain and no per-site breakage.

**Honest limitations:** three sources per claim at basic depth is shallow. Snippets are truncated, so the LLM sees an excerpt, not the document. And there's no source-credibility weighting — a personal blog and a government statistics agency carry equal weight in the prompt. Source ranking is a clear next step.

---

## 5. Where are API keys stored?

**Server-side environment variables only.** `GROQ_API_KEY` and `TAVILY_API_KEY` are read inside Next.js API route handlers, which run on the server. Neither has a `NEXT_PUBLIC_` prefix, so Next.js never inlines them into the client bundle. They are not reachable from the browser at any point.

In production they're set as Vercel Environment Variables. Locally, `.env.local` — which is gitignored.

**Verified:** no key, token, or secret appears anywhere in the committed repository. No `.env` file is tracked in git.

That's also why `/api/health` exists. The UI needs to know whether live verification is available, so the endpoint returns exactly one flag — `live_verification: "available" | "unavailable"` — and never the key values or any raw environment data. The route carries an explicit comment stating that requirement.

---

## 6. What happens if the internet goes down?

**Simulation Mode keeps working completely** — it makes zero network calls. The scripted conversation, the verdicts, the Trust Index, and every workspace all function offline once the page is loaded.

**Live verification fails**, and the failure is handled rather than crashing. The browser catches the failed fetch and applies a client-side fallback so the claim card resolves instead of hanging on `ANALYZING` forever.

**Be clear about what that fallback is:** it's a keyword matrix. It pattern-matches the claim text against a handful of known topics and returns a pre-written verdict. It is **not verification** — it's a graceful-degradation layer that keeps the interface coherent. The tell is the source citation, which reads `verbatim-ai.org`.

The session cache also survives, because it's in localStorage — reload offline and your session comes back.

---

## 7. What happens if Groq fails?

There are four layers, and they degrade in order.

1. **Model-level:** if the primary model errors, the Groq client automatically retries with `llama-3.1-8b-instant`.
2. **Extraction-level:** if Groq is entirely unavailable during claim extraction, a regex heuristic takes over — it looks for numbers, percentages, and words like *increased*, *doubled*, *billion*, *percent*. Cruder, but the pipeline keeps moving.
3. **Verification-level:** if Groq fails but Tavily returned sources, the route returns `VERIFIED` at 85% confidence with those real sources attached.
4. **Request-level:** if the whole route fails, the client-side keyword matrix resolves the card.

**Layer 3 is a genuine weakness and I'll name it directly.** It infers a verdict from the *existence* of search results rather than their content. Search results existing doesn't mean they support the claim — they might contradict it. That path can produce a confident `VERIFIED` on a false claim. The correct behaviour is to return `UNVERIFIED` when the reasoning layer is unavailable, and that's a known fix.

---

## 8. What happens if Tavily fails?

The Tavily client catches its own errors and returns an **empty source array** rather than throwing.

Verification then proceeds with zero evidence. Groq receives the claim and an empty evidence list, and — given the system prompt's five allowed verdicts — should return `UNVERIFIED`. The claim card renders with `NO CITES` where the source count normally appears, which is the visible signal that something was checked without evidence.

**Honest gap:** the system relies on the model behaving correctly with empty evidence rather than short-circuiting to `UNVERIFIED` in code before the LLM is ever called. That's a one-line guard that should exist and doesn't.

---

## 9. What happens if microphone access fails?

**Unsupported browser** (Firefox, Safari): the app checks for the Web Speech API before starting, and shows an explicit alert directing you to Chrome or Edge. The **Settings** screen reports speech recognition as `UNSUPPORTED` so you can diagnose it before you're on stage.

**Permission denied or a recognition error:** an error handler deactivates the microphone state cleanly. No crash, no stuck UI.

**Either way, the app remains fully usable.** Speech is one of two input paths — the manual input box runs the identical verification pipeline. Nothing about the product depends on the microphone working.

**And that's precisely why the demo doesn't use it.** Browser speech recognition depends on permissions, room acoustics, and network round-trips. In a demo room those are three ways to fail. Simulation Mode plus manual input covers the same story with none of the risk.

---

## 10. Is this a real backend?

Yes — with an accurate description of what "backend" means here.

There are **four server-side API route handlers** in the Next.js App Router, deployed as serverless functions on Vercel: `/api/health`, `/api/extract-claims`, `/api/verify-claim`, and `/api/analyze-bias`. They run on the server, hold the API credentials, orchestrate the Tavily and Groq calls, own the prompts, and implement the fallback logic. That's real server-side code doing real work.

**What it is not:** a separate long-running service. There's no standalone server, no container, no persistent process. These are serverless handlers that spin up per request.

**Also honest:** the backend is stateless. It stores nothing. Every request is independent, and all state lives in the browser.

---

## 11. Why Next.js instead of Python/FastAPI?

Three reasons.

**One deployment instead of two.** A FastAPI backend means a second service, a second host, CORS configuration, and a second thing that can be down during a demo. Next.js API routes put the front end and the server-side code in one application with one deploy.

**The work is I/O, not computation.** The server-side job is: receive text, call two HTTP APIs, shape the JSON, return it. There's no numerical computing, no ML training, no data-science library in the path. Python's advantages don't apply; Node handles concurrent I/O well.

**Type safety end to end.** The `Claim`, `EvidenceSource`, and `SessionStats` interfaces are defined once in TypeScript and used identically in the API routes and the React components. A verdict shape change is a compile error, not a runtime surprise.

**When Python would win:** custom model fine-tuning, a local embedding or vector store, or heavy numerical analysis. If VerbatimAI grows a claim-similarity index or trains its own classifier, a Python service becomes the right call — but as a companion to this, not a replacement.

---

## 12. Is there a database?

**No.**

Session state persists in the browser's **localStorage** under a single key, `verbatimai_session_v1`. Transcript, claims, elapsed duration, and session flags are written there on every state change and restored on page load.

**I want to be precise, because it's easy to overclaim:** localStorage is not a database. It's one JSON blob, in one browser, on one device, with roughly 5–10 MB of space. There's exactly **one** slot — a new session overwrites the previous one. Clear your browser data and it's gone permanently, with no recovery.

That's also why the **History Archive** screen shows one session rather than a list. It reads that single key. The screen says so on its face.

**The scope decision:** for a hackathon build, adding Postgres would have meant authentication, user accounts, migrations, and connection management — infrastructure that makes the demo more fragile without making the core idea more convincing. Cloud persistence is the first thing to build next.

---

## 13. Is there authentication?

**No.** No login, no accounts, no roles, no session tokens, no API-route authorisation.

The application is fully public. Anyone with the URL gets the same app with their own isolated browser-local state.

**What that implies, stated plainly:** the API routes are unauthenticated and unrate-limited, so anyone could call them and consume our Groq and Tavily quota. And VerbatimAI shouldn't be used for confidential conversations — claim text goes to third-party providers and there are no access controls.

**Why it's scoped out:** with no server-side data, there's nothing to protect *between users* — every session is already isolated by being client-local. Auth becomes necessary the moment cloud persistence arrives, and they're the same piece of work.

---

## 14. How is session persistence implemented?

A React effect watches the session state — transcript, claims, selected claim, duration, live/paused flags, and the Simulation setting — and serialises the whole object to localStorage on every change. The cache is always current; there's no explicit save.

On page load, a mount effect reads the key back, validates that the transcript and claims are arrays, and restores state. A *"Telemetry Session Restored"* toast confirms it for three seconds. The demo sequence pointer resyncs to the restored claim count so reopening the page doesn't replay claims you already have.

If the stored JSON is corrupt, the app catches the error, deletes the key, and starts clean rather than crashing on malformed data.

The purge control deletes the key outright.

**What it survives:** page reloads, browser restarts, tab crashes, and network loss — on the same browser and device. **What it doesn't:** a different device, a different browser, clearing browser data, or any form of sharing.

---

## 15. What prevents hallucinated verification?

Four mechanisms, and then the honest part.

1. **Retrieval before reasoning.** The model isn't asked "is this true?" It's asked "does this evidence support this claim?" That reframes the task from recall to reading comprehension, which is where LLMs are far more reliable.
2. **Constrained output.** The system prompt allows exactly five verdicts, and `response_format: json_object` forces structured output. The model can't invent a verdict category or free-associate.
3. **Low temperature.** `0.1` — near-deterministic. The same claim with the same evidence produces the same verdict.
4. **Visible citations.** Every source is displayed with a clickable link. A fabricated rationale is checkable in one click, which is the actual backstop.

**Now the honest part.** These reduce hallucination; they don't eliminate it. Groq can misread a snippet, over-weight a weak source, or express 95% confidence on a wrong verdict. The confidence number is the model's self-assessment, not a calibrated statistic — treat it as a rough signal.

There's also a specific code path that can produce an unfounded verdict: if Tavily returns sources but the Groq response fails to parse, the route returns `VERIFIED` at 85% based on sources merely *existing*. That's a real bug, it's the most consequential correctness gap in the system, and it should return `UNVERIFIED` instead.

**The design position:** VerbatimAI is a research accelerator that surfaces evidence fast and shows its work. It is not an oracle. The citations are always visible precisely because a human should be able to overrule it.

---

## 16. How does evidence affect the verdict?

Directly and structurally. The retrieved sources are serialised into the user prompt sent to Groq — title, URL, domain, and content snippet for each — alongside the claim. The system prompt instructs the model to evaluate the claim *against those snippets* and to explain its rationale in terms of them.

So evidence isn't decoration added after a verdict is reached. It's the input the verdict is computed from. That's why the explanations reference specific findings — *"US Bureau of Labor Statistics data indicates approximately 20% of new businesses fail in year 1"* — rather than asserting conclusions abstractly.

**The limits:** three sources, basic search depth, 200-character snippets. The model sees excerpts, not documents. And there's no credibility weighting — a blog post and a government agency enter the prompt with equal standing. Deeper retrieval and source-authority ranking are the two highest-value improvements to make here.

---

## 17. How is the Trust Index calculated?

```
if no claims:
    score = 100

otherwise:
    penalty = (MISLEADING × 12) + (FALSE × 25) + (UNVERIFIED × 5)
    score   = round( 100 − (penalty ÷ total_claims) × 1.5 )
    score   = clamp(score, 10, 100)
```

Four design decisions worth defending:

- **FALSE costs roughly twice MISLEADING** — a fabrication is worse than a distortion.
- **OPINION and VERIFIED cost nothing.** Opinions are deliberately excluded so honest speculation doesn't degrade the score. A fact-checker that penalises people for having views is a censorship tool.
- **The penalty is averaged, not accumulated.** It measures the *rate* of unreliable claims, not the count — so a long, accurate conversation isn't punished for being long, and verified claims pull the score back up.
- **The floor is 10, not 0.** Avoids a meaningless absolute-zero state.

**Honest characterisation:** these weights are reasoned, not empirically derived. There's no dataset behind "25 versus 12" — it's a defensible heuristic tuned to feel right. Calibrating it against human fact-checker judgements would be real work worth doing.

One implementation note: claims still `ANALYZING` count toward the UNVERIFIED penalty, so the score dips transiently during verification and recovers when the verdict lands.

---

## 18. How does the system distinguish fact from opinion?

At two stages.

**During extraction,** Groq classifies each statement as `factual`, `opinion`, or `casual`, and the prompt instructs it to ignore greetings and questions entirely.

**During verification,** `OPINION` is one of the five allowed verdicts. The model applies it to subjective judgements and future predictions — statements that can't be checked because there's no fact of the matter yet.

The scripted demo has a clean example: *"AI systems will completely replace human software engineers within 5 years"* returns `OPINION` at 89%, with the explanation that it's technological speculation rather than a verifiable fact — and a bias signal for *Absolute Speculation*.

**Why it matters:** opinions carry zero Trust Index penalty. Without that distinction, a speaker offering forecasts would be scored as though they were making false factual claims, which is both wrong and hostile to normal discourse.

**Honest limits:** the boundary is genuinely fuzzy. *"This policy will hurt the economy"* is partly predictive and partly checkable against economic evidence. The classification is an LLM judgement call with no confirmation step, and it will sometimes be wrong. Fallback mode does far worse — it keyword-matches on words like *think*, *believe*, and *replace*.

---

## 19. Can this scale to enterprise usage?

The stateless parts scale well. The rest needs real work, and here's the honest split.

**Already scales:** the API routes are stateless serverless functions on Vercel — they scale horizontally by default. The UI is entirely client-side, so per-user rendering costs nothing on the server.

**Would break under enterprise load:**

- **No rate limiting.** The routes are public and unauthenticated. Anyone can drain our provider quota.
- **No caching.** Identical claims trigger a fresh search and a fresh LLM call every time. In a conference room where the same statistic is quoted repeatedly, that's pure waste — a claim-level cache would cut cost substantially.
- **No persistence layer.** localStorage doesn't extend to teams, audit logs, or compliance retention.
- **No auth or tenancy.** Enterprise means SSO, roles, and workspace isolation — none of which exists.
- **Cost per claim is unbounded.** Two LLM calls plus a search, with no budget controls, batching, or usage metering.

**Path to enterprise:** authentication and multi-tenancy → Postgres for session persistence → Redis claim cache → per-tenant rate limits and usage metering → source-credibility ranking. That's a sequenced roadmap, not a rewrite — the pipeline itself is sound.

---

## 20. What are the current limitations?

The ones that matter most, without softening:

- **Chrome and Edge only for speech.** The Web Speech API isn't reliably available elsewhere.
- **Speech accuracy gates everything.** A misheard word becomes a misverified claim, with no confirmation step in between.
- **Simulation Mode is scripted playback**, not verification. It makes no network calls at all.
- **Fallback verdicts are keyword matches**, not verification, and they look identical in the UI apart from the `verbatim-ai.org` source.
- **The parse-failure path can return a false VERIFIED** — the single most consequential bug in the system.
- **Three sources per claim, 200-character snippets, no credibility ranking.**
- **No cloud persistence, no accounts, no collaboration, no report export.**
- **Two SVG diagrams are decorative schematics**, not data-driven graphs — the source lists beneath them are the real data.
- **A fully implemented `/api/analyze-bias` endpoint is not wired to the UI.**
- **No rate limiting, no caching, no cost controls.**
- **`npm run lint` fails** — ESLint isn't installed as a dependency, though a config file exists. The production build itself passes cleanly.

Full detail with impact and remediation in [LIMITATIONS.md](LIMITATIONS.md).

---

## 21. What would you build next?

In priority order, by value delivered per unit of work:

1. **Fix the parse-failure verdict path.** Return `UNVERIFIED` instead of `VERIFIED` when reasoning is unavailable. Small change, removes the worst correctness risk.
2. **Source-credibility weighting.** Score domains by authority so a government statistics agency outranks a blog. This is the highest-leverage quality improvement available.
3. **Deeper retrieval.** Advanced search depth, more results, longer snippets. Currently the single biggest constraint on verdict quality.
4. **Claim caching.** Hash the claim, cache the verdict. Cuts cost and latency on repeated claims immediately.
5. **Report export.** PDF and Markdown from the existing Session Reports view — the data is already assembled and rendered.
6. **Wire up the bias-analysis endpoint.** It's fully built. It needs a UI.
7. **Cloud persistence and authentication.** The gateway to multi-session history, team workspaces, and enterprise use.
8. **Meeting-platform integration.** Zoom, Meet, and Teams bots — removes the dependency on browser speech recognition entirely and is what makes this a product rather than a tool.

---

## 22. Who would pay for this product?

**Newsrooms** — the clearest fit. Live-blogging a debate or a press conference means checking claims in real time under deadline. Editorial teams already pay for research tooling, and the value is obvious to them.

**Corporate research and competitive intelligence** — analysts checking claims made in earnings calls, vendor pitches, and industry panels. Getting a supplier's inflated statistic caught before it enters a strategy deck has real, quantifiable value.

**Universities and enterprise training** — verification overlays for lectures and internal training content, sold per seat.

**Compliance and regulated industries** — financial services and healthcare organisations must document that public statements were substantiated. An auditable claim log with cited evidence maps directly onto an existing obligation.

**Realistic pricing model:** per-seat SaaS for individuals and small teams, per-organisation licensing with SSO for enterprise. Marginal cost per verification is small — two LLM calls and a search — so gross margins are healthy once caching is in place.

**Honest assessment:** newsrooms are the beachhead. The workflow already exists, the pain is acute and time-boxed, and the buyer understands the value without needing to be educated. Enterprise is bigger but requires the auth and persistence work first.

---

## 23. What industries could use it?

- **Journalism and media** — live coverage, interview prep, post-broadcast verification
- **Education** — lecture verification, teaching source evaluation and media literacy
- **Legal** — deposition and testimony review, claim substantiation
- **Financial services** — earnings-call analysis, analyst-claim verification, disclosure compliance
- **Healthcare** — checking medical claims in professional discussion against current literature
- **Public policy and government** — hearings, briefings, public consultations
- **Corporate governance** — board meetings, investor relations, vendor evaluation
- **Debate and competitive speaking** — training and adjudication support
- **Conference and event production** — panel and keynote fact-checking

The common shape: **live spoken claims, high stakes, and no time to check.** Wherever those three overlap, this applies.

---

## 24. What happens with an unknown or random claim?

**In live mode**, exactly what should happen. Tavily searches for it. If nothing relevant comes back, the source array is empty, and Groq — constrained to five verdicts with no supporting evidence — should return `UNVERIFIED`. The card renders with `NO CITES`, which is the visible signal that it was checked and nothing was found.

**The point:** the system is designed to say "I don't know." `UNVERIFIED` exists as a first-class verdict, not an error state.

**In fallback mode**, worse, and I'll be straight about it. The keyword heuristic matches on fragments like `90%`, `fail`, `1990`, `every`, `think`, `climate`. An unmatched claim falls through to a default of **`VERIFIED` at 88%** with a placeholder source. That's a confidently wrong answer to an unknown question, and it's the least defensible behaviour in the codebase. The default should be `UNVERIFIED`.

**Test it live if a judge asks** — try something obscure with the API keys configured and you'll get a genuine `UNVERIFIED` or a properly-sourced verdict. That's a good demonstration to volunteer.

---

## 25. Is Demo Mode real verification?

**No. It's scripted playback, and it should always be introduced as such.**

Simulation Mode replays five pre-written statements from a file in the source code. The verdicts, confidence scores, explanations, and source citations were all authored by hand and committed. A statement appears every 4 seconds, shows `ANALYZING` for 1.5 seconds, then resolves to its pre-written result. **It makes zero network calls.**

**Why it exists:** demo reliability. It cannot fail — not on API keys, not on network, not on microphone permissions, not on rate limits. That's why it's the default state on load, so a first-time visitor sees a working product immediately.

**What's genuine about it:** the source URLs are real and clickable — IPCC, NASA, US Bureau of Labor Statistics, Stanford AI Index, Internet Society, W3C. The claims are real misconceptions worth correcting. The explanations are accurate. They were researched in advance rather than retrieved at runtime.

**How to demonstrate real verification instead:** use the manual input box at the bottom of the Live Conversation panel. **It always runs the live pipeline, even with Simulation Mode ON.** Type a claim, press Verify, and it hits Tavily and Groq for real.

**Presenter guidance:** say the demo is scripted *before* a judge asks. Then immediately demonstrate live verification via the manual box. Volunteering the distinction reads as confidence; being caught reads as the opposite.

---

## Answering Well

- **Lead with the honest answer, then the reasoning.** "No, there's no database — here's what we use and why."
- **Name limitations before they're discovered.** A presenter who says "that path can return a false VERIFIED, and here's the fix" is more credible than one who's found out.
- **Distinguish scope decisions from oversights.** No auth is a decision. The parse-failure verdict path is a bug. Different things — say which is which.
- **Offer to demonstrate.** "Want me to try a claim you pick?" is the strongest possible answer to a scepticism question.
- **Never invent a capability under pressure.** If it isn't built, say it isn't built and say what it would take.
