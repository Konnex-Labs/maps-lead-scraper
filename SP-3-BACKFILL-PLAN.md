# SP-3 — Entity Resolution + Membership Backfill (Implementation Plan)

Author: Jack — Date: 2026-07-07
Parent spec: `PHASE-1-SCHEMA-SPEC.md` §5 (SP-3) — this is the concrete build plan.
Authority: Matt GO to write estimate + implement, 2026-07-07 (Telegram sig `9832327213b794cf`).
Session estimate: **2-3**. Build on `konnex_staging_v2` FIRST → Rajesh QA → additive prod
backfill under Phase-0 envelope + PITR needs a SEPARATE go-live GO.

## Goal
Collapse the per-industry row duplication in `businesses` into the canonical-entity + membership
model (mig 015 tables): one physical business = one `entities(type=business)` row carrying N
`entity_memberships`, instead of N duplicated `businesses` rows. Project the dedup lineage into
`entity_matches`. Additive only — `businesses` is not mutated in SP-3.

## Live data shape (prod market_intelligence, read-only, 2026-07-07)
- businesses: **3,776,477** total / **2,179,260** active / **22** merged_away (`merged_into` set).
- **142** distinct industries → the `entity(type=industry)` catalog.
- **2,323,227** distinct `google_place_id`; **122,658** rows with NULL place_id.
- Per-industry duplication (active, non-merged): **281,968** place_ids span >1 industry; **287,304**
  place_ids have >1 row; **358,191 collapsible duplicate rows**; max **19** industries on one place_id.
- Entity layer (mig 015): tables exist, currently empty (backfill target).

## BLOCKER found — GRANT gap
`market_intel` app role gets `permission denied for table entities` (also expect memberships/matches).
GO-B yesterday granted only `sources` + `entity_aliases`. Backfill + serving need SELECT (and the
backfill writer needs INSERT) on `entities`, `entity_memberships`, `entity_matches`, `market_metrics`,
`crawl_runs`. Fix via postgres superuser GRANT (SSH konnex-data + `sudo -u postgres`). Must land before
prod backfill; needed on staging too. → flag to Matt, apply on staging first.

## Backfill design (staging first)
1. **Industry catalog** — 142 `entities(type=industry)`, `canonical={code:<industry>}`. Idempotent on code.
2. **Business entities** — one `entities(type=business)` per identity. **⚠ CORRECTED per Grace
   2026-07-07 (sig d20dbf14fe745315): place_id is NOT a unique entity key** — prod has 6,982
   cross-industry place_id collisions (one place_id = multiple DISTINCT businesses across trades).
   Grouping business entities by place_id alone would wrongly merge distinct entities. Identity key
   must match the dedup runner's canonical key (place_id + same-industry only for auto-merge; cross-
   industry same-place_id rows are SEPARATE entities). Revise the grouping accordingly next pass:
   - merged_away (22, `merged_into` set): loser gets its OWN entity with `is_active=false` (contract (a)).
   - NULL place_id: 1 entity per row (122,658), low-confidence identity.
   - Do NOT collapse cross-industry place_id collisions into one entity.
3. **entity_aliases** — place_id / name / phone / website per row → resolution inputs (place_id alias is
   the business→entity resolution path, since `legacy_business_id` is only 1 representative).
4. **entity_memberships** — one row per distinct (business-entity, industry): `member_type=industry`,
   `member_ref`=industry-catalog entity. This is the collapse: N dup rows → 1 entity + N memberships.
   AC: zero industry associations lost (membership count == distinct (identity,industry) pairs).
5. **entity_matches** — ⚠ CORRECTED per Grace (sig d20dbf14fe745315): project off
   **`businesses.merged_into`** (authoritative, 22 real merges), NOT `business_merges` (31,551 rows,
   fully DECOUPLED from live merge state — 0 of the 22 merged_away rows have a business_merges loser
   row; per-business_merge projection would emit 31,551 wrong rows AND miss all 22 real merges). For
   each `b` with `merged_into` set: `entity_matches(entity_id_a=entity(loser b), entity_id_b=entity(survivor),
   merged_into=survivor)`. `business_merge_id` = NULLABLE ref only (NULL for the 22), never a driver.
   **entity_matches is SP-3's table exclusively** (Grace's runner never writes it — zero double-write).
   Forward sync via an entity-layer projection/trigger keyed on `businesses.merged_into` (single writer
   = SP-3). TODO before wiring: audit what the 31,551 `business_merges` rows reference (reversed/hard-
   deleted merges?). Grace offered to co-review the entity_matches DDL vs runner merged_into semantics.

## Open design decisions (need sign-off before authoring migration 019)
- **D1 (Grace) — RESOLVED 2026-07-07 (sig d20dbf14fe745315):** contract (a) — loser gets its own
  entity, `is_active=false`; faithful projection. entity_matches driven off `businesses.merged_into`
  (NOT business_merges), SP-3 sole writer. Plus the identity-key correction (step 2): place_id is NOT
  unique (6,982 cross-industry collisions) — do not group entities by place_id alone.
- **D2 (Rajesh):** NULL-place_id rows — 1 entity each (conservative, chosen) vs name+suburb grouping
  (fewer entities, dedup risk). Chosen = conservative; confirm.
- **D3:** industry vs trade `type` split for the 142 codes — keep all `type=industry` for v1, revisit
  when trades taxonomy lands. Chosen = all industry.
- **D4:** batching — 2.32M entity inserts + ~2.5M membership inserts. Chunked INSERT…SELECT in a single
  additive migration on staging; measure timing; PITR + envelope for prod.

## Sequencing
staging GRANT → author migration 019 (catalog+entities+aliases+memberships+matches, all INSERT…SELECT,
idempotent, reversible DOWN) → run on `konnex_staging_v2` → validate AC (parity counts, FK integrity,
zero associations lost) → Rajesh QA → prod GRANT + backfill under Phase-0 envelope + PITR on SEPARATE GO.

## Reversibility
All INSERT-only into the new (currently empty) entity tables. DOWN = `TRUNCATE`/`DELETE` the backfilled
rows (tables were empty pre-SP-3). `businesses` untouched. PITR live on prod as the outer safety net.
