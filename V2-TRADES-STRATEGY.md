# Konnex V2 — Trades Intelligence Strategy & Build Plan

**Author:** Jack (Head of Engineering)
**Date:** 2026-06-20
**Status:** APPROVED by Matt 2026-06-21 (sig be404b5de7f8107d)
**Sources synthesised:** Matt strategy session 2026-06-20 (trades pivot); ChatGPT strategy handoff (RE-era, sector-agnostic architecture); businesses-table audit 2026-06-20.

---

## 1. Thesis (one line)

> **Konnex is the intelligence infrastructure for the local service economy — starting with trades. We sell interpreted change, not data. Our moat is memory: a competitor can scrape a snapshot; we have the movie.**

We are pivoting the V2 primary vertical from Real Estate to **Trades**. Everything we'd built in thinking transfers — the sector changed, the architecture didn't.

---

## 2. Why trades (the pivot rationale)

1. **PII is solvable here.** RE exposed individual agent PII with no clean business-contact exemption; trades is business-entity-level. Sole-trader collapse still applies (most tradies *are* sole traders), but the surfaceable asset is business contact + aggregate signal, which is defensible.
2. **Access economics work.** Newcastle pilot: 91.3% clean-crawl, **zero bot-walls** — own-fetcher only (Maps/DataForSEO lookup → website → crawl), **no BrightData**. RE sites were botwalled (Belle/RayWhite/KW behind Cloudflare/AWS-WAF). BD cost: ~$0/biz for trades vs ~$0.0225/biz/yr on the RE path.
3. **The market is huge and structurally short.** AU trades & construction ≈ **$293B/yr, 11.7% of GDP**, 2nd-largest industry, 1.3M+ employed, **~462,000 businesses, 98%+ small (<20 staff)**. Demand outpaces supply for the foreseeable future (54.3% fill rate, 1.2M new-homes target, renewables build-out, 2032 Brisbane Olympics). The worker shortage is itself a sellable signal.
4. **Unit economics.** All-in data COGS ≈ **$0.0048/biz/yr** → the **whole 462k AU set ≈ $2.1k/yr recurring**. 99%+ gross margin vs $20-80 trades lead value. We can afford to serve the entire industry.

---

## 3. Product model

### 3.1 Delivery = intelligence infra, NOT a SaaS tool
We sell **signal**. Even the tradie side is signal delivery (their local competition, where work is moving, growing-suburb opportunities) — not a get-found dashboard. Same underlying signal store, sliced per-audience. The temporal-refresh engine + signal store **are** the product; the surfaces are thin clients.

### 3.2 Surfaces (v2 four-surface model)
- **Ask Konnex** — conversational answer surface (hero for professionals)
- **API** — programmatic signal access
- **MCP** — agent-native access
- **Insights / Research Hub** — published aggregate research; **this is the indexable, AI-citation-optimised SEO surface** (schema markup so LLMs/AI-overviews cite Konnex as "the source"). NOT profile/suburb SEO pages.

Free business + suburb profiles surface **inside Ask Konnex output**, not as a dedicated indexable page corpus. (We are not rebuilding the v1 Explorer SEO-page model.)

### 3.3 Free vs gated
- **Free forever:** verified business profiles + suburb profiles (+ aggregate stats), surfaced in Ask Konnex; free Ask Konnex tier (below); the Insights Hub.
- **Gated/paid:** the intelligence layer on top — trends, velocity, opportunity/competitive cuts, forecasts, market-pulse alerts.
- **The boundary does three jobs at once:** distribution (free + Insights Hub = the funnel), monetisation (paid = the temporal/derived signal the engine produces — the expensive bit is the paid bit), compliance (free = entity + aggregate = PII-clean by construction; individual/derived stays internal or gated). **Free/paid ≈ surface/internal ≈ static/temporal.** One line, three jobs.

### 3.4 Pricing (3 tiers)
1. **Free:** Ask Konnex, 3-5 questions/day, resets every 24h (top-of-funnel hook).
2. **Credits:** packages, **credits never expire** (competitive moat + low-commitment expansion).
3. **Monthly subscriptions:** where **market-pulse alerts** live (recurring temporal-signal product).

### 3.5 Two paying audiences (same graph, different packaging)
- **Professionals (tradies / firms):** tactical opportunity. "Where's the work moving? Which suburbs are heating up? Who's growing near me?" → Ask Konnex is the hero.
- **Analysts / institutions (councils, training bodies, insurers, govt-adjacent, aggregators):** aggregate market intelligence. "Where is the shortage closing? Which suburbs are becoming construction hubs? Supply vs demand by region." → Konnex Intelligence (dashboards/API/reports).

---

## 4. The signal architecture

Three complementary, independent layers on the same local-economy pulse:

| Layer | Source | Signal | Status |
|---|---|---|---|
| **Demand** | ABS building approvals | construction cycle (new-build vs reno, by LGA) | Free, aggregate, PII-clean. **Do first.** |
| **Supply** | State licence registers (QBCC/NSW etc.) | new tradies entering = capacity leading indicator; also a **verification** layer (verified-licensed badge) | NSW/QLD bulk confirmed; VIC/SA/WA TBD (feasibility scan) |
| **Realised demand** | Maps review velocity | recent completed jobs (new reviews/month) | Validated; dense for service trades, aggregate-only for review-sparse construction |

**The temporal-refresh engine is the load-bearing build.** Monthly refresh stops being "freshness" and becomes a time-series engine. The same snapshot-diff machinery powers **review-velocity diffing AND licence-issuance diffing** — one build, two signals. This is the first thing to build.

**Review-velocity nuance (validated):** density ~7x higher for maintenance trades (plumber/sparky/HVAC ~71/biz) than new-build (builder/carpenter ~9.7/biz). So per-business velocity is a clean pulse for the *service* economy; *construction* must be read at **aggregate** level + complemented with ABS.

---

## 5. Data foundation — what we already have (audit 2026-06-20)

We are **not starting from zero.** v1 already crawled a national AU trades base:

- **106,291 active core-trades businesses** (builder 29.8k, electrician 19.7k, landscaper 16.3k, plumber 11.1k, painter 7.5k, carpenter 7.0k, hvac 6.9k, pest_control 4.3k, handyman 3.8k).
- Coverage: **89.9% phone, 53.4% email, 78% with reviews** (avg 44 reviews each). All Google-sourced (own-fetcher/DataForSEO, zero BD).
- **Crawled 12 Apr – 3 May 2026 → effectively an existing t0 baseline.** A refresh now yields an immediate ~6-7 week review-velocity delta. **We can start the time-series today, not wait 3-4 weeks for a fresh t0.**

**Gaps to close:**
1. **roofer_au missing entirely** (core trade) — needs a crawl.
2. Only ~9 categories — full play wants concreter, tiler, plasterer, bricklayer, fencing, glazier, flooring, etc.
3. handyman phone coverage weak (30%).
4. Large inactive pile (builder: 84k total vs 30k active) — confirm `is_active` semantics; genuine churn = business-open/close event signal (fits the event-stream model), not waste.

---

## 6. Architecture (re-cast from the handoff, trades-tuned)

### 6.1 Core principle — crawling is sensing
Crawler = sensor, not product. Value chain: **collect signals → resolve entities → detect change → build events → generate intelligence → answer questions.**

### 6.2 Entities as living records
Store not just current state but **current + previous state + observed events + confidence + source + timestamp + evidence**. Every intelligence claim traces to evidence (crawl snapshot, source URL, observed_at).

### 6.3 Event-stream model (the moat)
Treat the local economy as an event stream. Trades event types:
`business_opened`, `business_closed`, `business_rebranded`, `relocated`, `review_count_changed` (→ velocity), `licence_issued`, `licence_lapsed`, `new_trade_category_in_suburb`, `suburb_density_changed`, `approvals_changed` (ABS).

### 6.4 Data model (relational source of truth first, graph later)
Postgres as source of truth. Core: `businesses` (exists), plus `crawl_snapshots`, `events`, `suburbs`, `licences`, `abs_approvals`, `market_metrics`, `sources`/evidence. Every event + relationship carries `source, confidence, observed_at, last_seen_at, evidence_url`.

**Graph:** the rich agent→broker→lender trust graph was RE-finance-specific. Trades is sole-trader-heavy = thinner relationship density. **Lead with economic-activity + suburb market-pulse layers; defer the trust/referral (subcontractor-network) graph to a later phase.** Build graph *views on demand* from relational data; a graph DB is not the product and is not MVP.

### 6.5 Interface framing
**Map + Timeline first** (the local service economy is geographic + temporal); graph later. Map = suburb density/activity heatmap; Timeline = "what changed this month, who/where, why it matters."

---

## 7. Defensibility

A competitor can scrape today's web. They cannot backfill **what changed last month, which businesses opened/closed over time, which suburbs gained activity, how the shortage moved.** Moat = **verified signals + entity resolution + change history + interpretation.** The real moat is **memory** — Konnex has the movie, not the snapshot. Time moat compounds with every refresh.

---

## 8. PII & compliance posture

- **Surfaceable spine:** phone (89.9%, B2B Spam-Act carve-out) + website + business entity.
- **Internal enrichment (gated on spec):** website-sourced email (53%, published on their own site).
- **Parked behind spec sign-off + Meta-ToS review:** social/Meta-scraped email (separate ToS risk lane).
- **Sole-trader collapse bites harder in trades** (98% sub-20-staff). Licence data is PII-bearing (names+addresses) → internal-store/aggregate-surface; ABS is PII-clean.
- **The PII & Compliance Spec (In Review, awaiting my sign-off) gates the enrichment lanes.** Must be re-reviewed through the trades/sole-trader lens before signing — not inherited from the RE framing.

---

## 9. MVP roadmap (phased)

**Phase 0 — De-risk & foundation (now)**
- National source-feasibility scan (state regulators bulk-vs-search + sample council DA portals).
- Arm the t1 review-velocity re-pull / refresh against the existing Apr-May t0 (start the time-series clock).
- Define event schema + `crawl_snapshots` + change-detection between crawls (the engine spine).

**Phase 1 — Demand signal (fast win)**
- ABS building-approvals ingestion (free, aggregate, PII-clean) → suburb-level demand metric.

**Phase 2 — Market Pulse prototype**
- One geography, the validated trades. Suburb-level metrics (review velocity + ABS) + Map + Timeline. Define "Konnex Market Pulse" / Local Economic Connectivity Index.

**Phase 3 — Supply signal + verification**
- NSW/QLD licence-register ingestion → new-licence (supply) signal + verified-licensed badge (cross-ref against scraped base).

**Phase 4 — Ask Konnex over the signal store**
- Evidence-backed answers; professional + institutional use cases.

**Phase 5 — Paid packaging**
- Free Ask Konnex tier (metering/quota), credit ledger (never-expire), subscription tiers + alerts; Insights Hub publishing pipeline with schema markup.

---

## 10. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Review velocity noisy for small/construction trades | Read construction at aggregate; complement w/ ABS; 3-4 week diff window not 1-week |
| PII spec not yet ratified, gating enrichment | Re-review through trades lens + sign before turning on email lanes |
| State licence data fragmented (VIC/SA/WA) | Feasibility scan first; national = "more plumbing", not a blocker |
| Distribution if no profile SEO pages | Insights Hub AI-citation play is the SEO engine; deliberate top-of-funnel answer |
| `is_active` semantics unclear | Confirm definition before treating inactive as closure signal |
| Billing/entitlement layer is new build surface | Scope explicitly (metering, never-expire ledger, entitlement gating, alert delivery) |

---

## 11. Ticket set — see V2-TRADES-TICKETS.md
