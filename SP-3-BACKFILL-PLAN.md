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
2. **Business entities** — one `entities(type=business)` per identity:
   - place_id present + `merged_into IS NULL`: group by place_id → 1 entity (~2.32M). `legacy_business_id`
     = representative (most-complete) row.
   - NULL place_id: 1 entity per row (122,658), flagged low-confidence identity (no safe grouping key).
   - merged_away (22): NO new entity — resolve to survivor's entity via `merged_into`.
3. **entity_aliases** — place_id / name / phone / website per row → resolution inputs (place_id alias is
   the business→entity resolution path, since `legacy_business_id` is only 1 representative).
4. **entity_memberships** — one row per distinct (business-entity, industry): `member_type=industry`,
   `member_ref`=industry-catalog entity. This is the collapse: N dup rows → 1 entity + N memberships.
   AC: zero industry associations lost (membership count == distinct (identity,industry) pairs).
5. **entity_matches** — project the 22 `business_merges` rows: loser-entity → survivor-entity,
   `business_merge_id` ref, no double-count. Single source of truth stays `business_merges`.

## Open design decisions (need sign-off before authoring migration 019)
- **D1 (Grace):** lineage contract for `entity_matches` — do losers get their own entity (so a/b both
  resolve) or is the merge represented business-side only? Affects whether merged_away rows get entities.
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
