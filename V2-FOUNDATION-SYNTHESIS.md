# Konnex v2 Foundation — Architecture Synthesis (working draft)

Author: Jack (HOE). Date: 2026-07-05. Status: pre-alignment (open questions out to Matt).
Purpose: seed for the Notion architecture doc. Synthesizes 4 inputs into one spine.

## Inputs digested
1. **Vision doc** (AI-mode conversation) — Fact/Signals/Pulse three-tier; 5 delivery channels
   (Ask Konnex / Pulse SMS / Insights Hub / Developer API / MCP); moat = weekly snapshots;
   NSW+3 pilot. Brief: /tmp/chatgpt-strategy-brief.md
2. **My prior 5-part response** — coherent-with-v2 (not a re-pivot); snapshotting is THE
   load-bearing decision; one-Postgres-core / three read-models; provenance first-class;
   RAG (cited) NOT fine-tune; Phase 0/1/2 skeleton.
3. **Two morning ops conversations** — clean-slate-not-blind-wipe; NSW+3 ingest = 3 payoffs
   (clean pilot + coverage fix via google_place_id re-sight + first corpus week);
   is_active semantics; safety envelope.
4. **ChatGPT handoff doc** (2026-06-20, pre-pivot RE/mortgage) — event-driven intelligence
   system; entity-as-living-record; evidence/provenance; confidence scoring; one-graph-many-
   layers with graph-views-on-demand-from-relational (Apache AGE later, no new infra);
   Graph+Map+Timeline; concrete candidate data model.

## THE CONVERGENT SPINE (all 4 agree)
- Konnex = **event-driven intelligence system**, NOT a directory/CRM. Core asset = change
  over time ("the movie, not the snapshot").
- **Moat = immutable historical memory** — snapshots of data public sources overwrite.
  Un-backfillable → must start accumulating from week 1.
- **Provenance/evidence is first-class**: every fact/event carries source_id, observed_at,
  confidence, evidence_url. Ties to anti-hallucination QA (Rajesh) + silver/gold verified tiers.
- **ONE Postgres core, many thin read-models/serving surfaces.** Defer polyglot (standalone
  vector DB / TSDB / graph DB) until scale forces. pgvector already live (Cortex).
- Serving surfaces are thin query layers over the one core: Ask Konnex (RAG), Pulse (weekly
  +/- suburb metrics), Insights Hub, Developer API, MCP. Graph+Map+Timeline = the UX framing (T6).
- Build in phases: **Phase 0 safety spine → Phase 1 schema → Phase 2 gated clean-cut + NSW+3 pilot.**

## WHAT THE CHATGPT DOC ADDS (net-new beyond my prior response)
- **Concrete event model + entity-as-living-record**: store current state + prior state +
  observed events + confidence + source + timestamp + evidence. Operationalizes change-detection.
  Schema becomes: crawl_snapshots (immutable raw) → change-detection → events (typed, timestamped,
  evidence-linked) → derived market_metrics.
- **"One graph, many layers" + graph-views-on-demand-from-relational.** Relational source of
  truth first; generate graph views per suburb/business/time on demand; add in-place graph
  (Apache AGE on Postgres) later only if scale justifies. Confirms one-Postgres-core.
- **Candidate tables/fields**: sources, crawl_runs, crawl_snapshots, entities, entity_aliases,
  entity_matches, events, relationships, confidence_scores, market_metrics. Real schema head-start.
- **Change-detection-first build order**: "what changed since last crawl?" before "complete DB".

## RE→TRADES REMAP (what does NOT transfer cleanly)
- Verticals: RE/mortgage/adviser/accountant → trades (carpenter/electrician/plumber, NSW+3).
  Central nodes shift: Business(tradie) + Licence + Suburb + Trade. Person(agent/broker) node
  de-emphasized.
- **Relationship/trust-network graph** (broker↔lender↔agent referral) is RE-specific + PII-heavy.
  For trades it's thinner and LATER (Signals tier). v1 trades value = Fact (entity+licence) +
  Pulse (review-velocity work-spike proxy). DEFER the referral/trust graph.
- **PII**: RE doc exposed person movement; the trades pivot was partly to REDUCE PII risk.
  → Hold individual PII internal; expose business-entity + aggregate only. No exposed Person
  product.
- Property/listing/transaction/lender entities are RE-specific — not in trades v1. Keep
  source/evidence model extensible so future verticals slot in, but don't build them now.

## PROVISIONAL PHASE PLAN (from my prior skeleton, enriched)
- **PHASE 0 — SAFETY SPINE (now, cheap, first):** staging DB (schema mirror + sampled data,
  not a 3.7M clone); prod-write safety envelope as default (dry-run default, pre-image,
  collision pre-check, batched + VACUUM); PITR/automated snapshots on prod. Must land before
  any destructive clean-cut.
- **PHASE 1 — SCHEMA FOR THE VISION:** append-only weekly-snapshot + provenance-first columns
  (source_id / retrieved_at / confidence_tier) on the one-Postgres-core (relational Fact /
  partitioned Pulse+Signals substrate / pgvector RAG). Event table + change-detection.
  PRESERVE velocity baselines + crawl_snapshots.
- **PHASE 2 — CLEAN-CUT + PILOT (Tier-3, gated on Matt GO):** full backup → preserve
  baselines/verified/licence → truncate legacy v1 noise → re-run full NSW+3 (epic 38a2300f,
  ~USD100-150) through the disciplined flow as the clean pilot (= coverage fix + first corpus
  week). Supersedes 07-02 piecemeal delete.

## PROVISIONAL CORE SCHEMA SKETCH (to refine post-alignment)
- `sources` (source_id, kind [maps/licence/website/review], base_url, trust_tier)
- `crawl_runs` (run_id, source_id, started_at, params, cost)
- `crawl_snapshots` (snapshot_id, run_id, entity_ref, observed_at, raw_payload_ref, checksum) — IMMUTABLE, append-only, partitioned by week
- `entities` (entity_id, type [business/suburb/trade/licence], canonical fields, current_state, first_seen_at, last_seen_at, is_active, verification_tier [silver/gold])
- `entity_aliases` / `entity_matches` (entity resolution + merge lineage — ties to dedup debt)
- `events` (event_id, event_type, entity_id, related_entity_id, suburb_id, observed_at, effective_at, source_id, confidence, evidence_url, raw_payload_ref, summary) — typed change stream
- `market_metrics` (metric_id, suburb_id, trade, metric, value, delta, period, computed_at) — Pulse/Signals substrate, partitioned by period
- provenance columns (source_id, observed_at, confidence, evidence_url) on every fact-bearing row

## LOCKED DECISIONS (Matt confirmed 2026-07-05, sig 0ce148691d643626)
1. **Graph layer**: DEFER relationship/trust-network graph to a later Signals iteration. v1 =
   entity + snapshot + event + provenance + market_metrics; graph-views-on-demand only once we
   have relationships worth graphing (Apache AGE in-place later, no new infra). Ship Fact+Pulse
   first. **CONFIRMED.**
2. **PII/person**: hold individual PII internal for trades (business-entity + aggregate exposure
   only) — no exposed Person node / professional-movement product. **CONFIRMED.**
3. **Event model depth**: start FOCUSED trades event set (business_opened/closed,
   review_velocity_changed, professional_density_changed, licence_status_changed) on the general
   events table pattern; generalize as verticals expand. **CONFIRMED.**
4. **Deliverable/sequencing**: NO Phase 0 execution this session. Write the Notion architecture
   doc (this/next session), THEN start Phase 0 next session. **CONFIRMED.**

### DOC AUTHORING INSTRUCTION (Matt, explicit)
- The Notion doc must CAPTURE the "build now vs defer for later" split AND my recommendations/
  reasoning as we "grow into the doc" — i.e. record not just the final design but the thinking
  and what we consciously deferred (graph layer, extra verticals, property/listing/lender
  entities, polyglot DBs, full RE event taxonomy) and WHY. Preserve the rationale, not just the
  conclusion.
- Deliverable = new Notion doc with mermaid diagrams: architecture, one-Postgres-core /
  three-read-models, snapshot+event+provenance schema, Phase 0/1/2 roadmap, build-now-vs-defer
  table, risks/mitigations.

---
> **RECOVERY NOTE (2026-07-05T08:0xZ):** This file was restored by Jack after the
> `google-maps-scraper` working dir was accidentally deleted in VSCode (Matt). Content is the
> exact locked synthesis (verbatim from the pre-deletion read). The DELIVERABLE it seeds — the
> Notion architecture doc — was already written and is safe:
> https://app.notion.com/p/Konnex-v2-Foundation-Architecture-Data-Model-Design-Doc-3942300f2ecb81499d15cb8326007871
