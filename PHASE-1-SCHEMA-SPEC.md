# Phase 1 — Schema for the Vision (Sprint Contract)

Author: Jack (Head of Engineering)
Date: 2026-07-05
Status: READY FOR MATT REVIEW + Rajesh review — Session-estimate GO (per sub-phase) before any build
Tier: 2 (schema/infra, additive-only; no destructive ops, no spend)
Session estimate: **4+** (decomposed into 4 gated sub-phases below, each independently estimated + Rajesh-QA-gated)
Authority: Matt GO to write spec + estimate 2026-07-05 (Telegram sig 3ae666ce4d23a207). Build GO is per-sub-phase, pending this spec's review.
References:
- Notion arch doc `3942300f-2ecb-8149-9d15-cb8326007871` (event-driven intelligence core; §5 entity model; Appendix A/C)
- `V2-FOUNDATION-SYNTHESIS.md` (convergent spine, locked decisions sig 0ce148691d643626)
- `PHASE-0-SAFETY-SPINE-SPEC.md` (safety substrate this build runs on)
- Prod: `market_intelligence` @ 204.168.198.203:5432 (PG16.14). Staging: `konnex_staging_v2` @ konnex-ops.

---

## 1. Goal

Lay down the **source-agnostic, event-driven schema** that turns Konnex from a directory
snapshot into an intelligence system whose core asset is *change over time*. Phase 1 is
**additive and non-destructive**: we create the new substrate alongside the live tables,
backfill/mirror where safe, and preserve every existing velocity baseline + `crawl_snapshots`
row. The destructive clean-cut + NSW+3 pilot is **Phase 2** and stays gated behind a separate
Matt GO.

The load-bearing property (Matt's extensibility question, 2026-07-05): **new data sources slot
in without reshaping the core.** Maps API, search volume, state trade licences, new-build/reno
projects, council permits, and full review-text all land as: a row in `sources` → raw payload in
append-only `crawl_snapshots` → typed rows in `events` against canonical `entities`, with
provenance on every fact-bearing row, and review text embedded in pgvector (already live) for
RAG-cited insight generation. Each new source needs only a small connector (fetch + map-to-events),
never a schema rebuild.

## 2. Non-goals (consciously deferred — locked, sig 0ce148691d643626)

Captured so we preserve the *why*, not just the conclusion:
- **Relationship/trust-network graph** (referral edges). Deferred to a later Signals iteration;
  graph-views-on-demand-from-relational (Apache AGE in-place) only once we have relationships worth
  graphing. No new graph infra now.
- **Person/PII product.** Hold individual PII internal; expose business-entity + aggregate only.
  No exposed Person node. (The trades pivot was partly to reduce PII exposure.)
- **Property / listing / transaction / lender entities.** RE-specific. Keep the source/evidence
  model extensible so they *can* slot in later, but do not build them now.
- **Polyglot stores** (standalone vector DB / TSDB / graph DB). One Postgres core; pgvector already
  live. Defer until scale forces it.
- **Full RE event taxonomy.** Start a FOCUSED trades event set; generalize as verticals expand.

## 3. Design principles

1. **Append-only history is the moat.** `crawl_snapshots` is immutable, partitioned by week;
   public sources overwrite, so we must accumulate from week 1. Never UPDATE a snapshot.
2. **Provenance is first-class.** Every fact-bearing row carries `source_id`, `observed_at`,
   `confidence`, `evidence_url`. Ties to anti-hallucination QA + silver/gold verified tiers.
3. **One Postgres core, many thin read-models.** Serving surfaces (Ask Konnex RAG, Pulse, Insights
   Hub, Developer API, MCP) are thin query layers over the core, not separate stores.
4. **Change-detection first.** "What changed since last crawl?" is computed into typed `events`
   before any "complete DB" ambition.
5. **Additive, reversible, staged.** All migrations run on staging first, use the Phase-0
   prod-write-envelope for any data movement, and are individually reversible. No column drops, no
   truncation, no destructive rewrite in Phase 1.

## 4. Core schema (target state)

New/extended tables on the one core. Column lists are the contract; exact types finalized in SP-1
against live prod introspection (schema.sql is stale — introspect, don't trust it).

**SP-1 type finalization (migration 015, Rajesh-QA-approved sig 403b5b4a54a568dc):** all categorical
columns below written as `TEXT + CHECK` constraints, NOT Postgres ENUMs — the load-bearing
extensibility property (§1): a new source kind / member_type is an additive `ALTER ... CHECK`, never
an enum-value migration + table rewrite. The `ENUM[...]` notation in the column lists denotes the
allowed value set, realized as a CHECK. Trivially reversible to ENUMs if preferred.

- `sources` (source_id PK, kind ENUM[maps|licence|website|review|search_volume|permit|other],
  name, base_url, trust_tier ENUM[gold|silver|bronze], created_at, is_active)
- `crawl_runs` (run_id PK, source_id FK, started_at, finished_at, params jsonb, cost_usd, status)
- `crawl_snapshots` (snapshot_id PK, run_id FK, entity_ref, observed_at, raw_payload_ref,
  checksum) — **IMMUTABLE, append-only, partitioned by week.** *Already exists in prod — EXTEND, do
  not recreate; preserve all rows.*
- `entities` (entity_id PK, type ENUM[business|suburb|trade|licence|industry], canonical fields (jsonb or
  typed), current_state jsonb, first_seen_at, last_seen_at, is_active, verification_tier
  ENUM[silver|gold]) — canonical living record. `businesses` maps in as `type=business`.
- `entity_aliases` (alias_id PK, entity_id FK, alias_value, alias_kind, source_id) — entity
  resolution inputs.
- `entity_memberships` (membership_id PK, entity_id FK, member_type ENUM[industry|trade|suburb|
  licence_class], member_ref (FK to catalog entity_id OR canonical code), source_id FK, observed_at,
  confidence, is_active) — **the canonical-entity + membership model.** ONE business entity carries N
  memberships instead of N duplicated `businesses` rows (one per industry). This is the structural
  fix for the current per-industry row duplication. Backfilled from existing per-industry rows during
  SP-3 (collapse duplicate rows → one entity + memberships; merge lineage via `entity_matches`).
- `entity_matches` (match_id PK, entity_id_a FK, entity_id_b FK, method, confidence, decided_at,
  merged_into) — merge lineage; ties to the dedup remediation (`businesses.merged_into`, migration
  014) and the decompose runner. **Reuse, do not duplicate, existing `business_merges` lineage.**
- `events` (event_id PK, event_type, entity_id FK, related_entity_id FK NULL, suburb_id NULL,
  observed_at, effective_at, source_id FK, confidence, evidence_url, raw_payload_ref, summary) —
  **the typed change stream.** New sources = new `event_type`s here.
- `market_metrics` (metric_id PK, suburb_id, trade, metric, value, delta, period, computed_at) —
  Pulse/Signals substrate, partitioned by period. Preserve existing review-velocity baselines.
- **Provenance columns** (`source_id`, `observed_at`, `confidence`, `evidence_url`) added to every
  fact-bearing legacy row that lacks them, backfilled with a `legacy`/`unknown` provenance sentinel
  (never fabricated confidence).

Focused v1 trades `event_type` set (generalize later): `business_opened`, `business_closed`,
`review_velocity_changed`, `professional_density_changed`, `licence_status_changed`.

### 4.1 Schema-Hardening A & C — subsumed by this spec (close the standalone tickets)

Both open Schema-Hardening Notion tickets are realized here; do **not** build them as separate v1
migrations (that would be throwaway work discarded at the Phase 2 clean-cut):

- **Schema Hardening C** (canonical-entity + membership vs per-industry row duplication) → realized
  directly by `entities` + `entity_memberships` above. This IS the canonical-entity model; the
  membership table is the anti-duplication mechanism. Ticket → superseded-by-doc.
- **Schema Hardening A** (industry_catalog allowlist + FK guard on `businesses.industry` /
  `crawl_snapshots.industry`) → folded in: the allowlist becomes the catalog of canonical
  `entities(type=trade|industry)` that `entity_memberships.member_ref` FKs into, so referential
  integrity is enforced structurally at the entity layer rather than via a throwaway string-column
  FK guard on the legacy tables. A pre-clean-cut FK-guard migration on `businesses.industry` is
  **explicitly not built** — it would be dropped at Phase 2. Ticket → superseded-by-doc.

## 5. Sub-phases (each gated: Matt GO to start + Rajesh QA to close)

**SP-1 — Schema & migrations (est. 1-2 sessions).**
Author additive migrations for all new tables + provenance columns + partitioning; extend (not
recreate) `crawl_snapshots`; map `businesses`→`entities(type=business)` view/materialization plan.
Run on `konnex_staging_v2` first (Phase-0 staging), then prod via home-grown migration runner. No
data destroyed. AC: all tables/indexes/partitions created; every migration reversible + idempotent;
staging schema diff clean; zero rows mutated in legacy tables beyond additive provenance backfill;
introspection matches contract in §4.

**SP-2 — Change-detection → events (est. 1-2 sessions).**
Build the "what changed since last snapshot?" pass that emits typed `events` from consecutive
`crawl_snapshots` per entity, with provenance + confidence. Uses Phase-0 prod-write-envelope
(dry-run default, pre-image, collision pre-check). AC: deterministic event emission on a staging
fixture (known before/after snapshots → expected event set); no duplicate events on re-run
(idempotent); confidence + evidence_url populated; zero events without a source_id.

**SP-3 — Entity resolution + membership wiring (est. 1-2 sessions).**
Wire `entity_aliases`/`entity_matches` to the existing merge lineage + dedup decompose runner
(Grace's parallel track); ensure `merged_into` / `business_merges` are the single source of truth
(no duplicate lineage). Backfill `entity_memberships` by collapsing existing per-industry duplicate
`businesses` rows into one canonical entity + N memberships (Schema-Hardening C). AC: dedup
survivor/loser lineage reflected in `entity_matches` with no double-count; per-industry duplicate
rows collapse to one entity with membership parity (zero industry associations lost); every
`entity_memberships.member_ref` resolves to a catalog entity (Schema-Hardening A integrity); FK
integrity; reversible.

**SP-4 — Read-model + market_metrics wiring (est. 1 session).**
Populate `market_metrics` (Pulse substrate) from events + snapshots; stand up the thin read-model
query layer (no new infra). Preserve existing review-velocity baselines. AC: Pulse suburb +/-
metrics reproduce existing baselines exactly on overlap; partitioned by period; recomputation
idempotent.

## 6. Sequencing & gates

1. This spec → Matt review → per-sub-phase Session-estimate GO.
2. SP-1 → SP-2 → SP-3 → SP-4, each: Matt GO to start, build on staging, Rajesh QA at handoff,
   then prod migration (additive) under Phase-0 envelope + PITR.
3. **Phase 2 (destructive clean-cut + NSW+3 pilot, ~USD100-150) stays gated behind ALL of Phase 1
   and a SEPARATE explicit Matt GO.** Nothing in Phase 1 truncates, deletes, or spends.
4. Runs on the Phase-0 safety spine: staging first, prod-write-envelope for data movement, prod
   PITR live for rollback.

## 7. Risks & mitigations

- **Legacy provenance is unknowable** → backfill an explicit `legacy`/`unknown` sentinel; never
  fabricate confidence. Silver/gold tiers only for verified-forward data.
- **Dedup lineage duplication** (entity_matches vs business_merges) → single source of truth =
  existing lineage; entity_matches is a view/projection, coordinated with Grace's runner.
- **crawl_snapshots partitioning on a live table** → additive partition attach on staging first;
  validate row-count parity; PITR before prod apply.
- **Scope creep into deferred verticals** → §2 non-goals are the contract; new entities need a
  separate spec.

## 8. Deliverables

- Migrations (staging-validated, prod-applied additive) for §4 schema.
- Change-detection module (SP-2), on the Phase-0 envelope.
- entity_matches wiring coordinated with the dedup decompose runner (SP-3).
- market_metrics + thin read-model (SP-4).
- Per-sub-phase Rajesh QA evidence + Notion Session estimates.
