---
spec: dedup-remediation-nsw-trades-v1
ticket: 3932300f-2ecb-8197-926f-e0324a317ebf
author: jack
reviewer: rajesh
executor: grace (dry-run + live-apply under Matt GO)
status: draft-for-review
tier: 3 (prod DML, reversible, no spend)
session_estimate: 2-3
last_updated: 2026-07-05T13:24:00Z
depends_on: Phase 0 safety-spine (COMPLETE) — uses lib/prod-write-envelope.js
grounded_in: /tmp/dedup_audit_nsw_trades_2026-07-05.md (Grace read-only audit, 2026-07-05)
---

# Dedup Remediation — NSW Core-Trades v1

## 1. Purpose
Collapse genuine duplicate `businesses` rows within the 9-industry NSW core-trades
scope down to one canonical (survivor) row per real-world business, FK-safely and
reversibly, using the Phase-0 prod-write envelope. This clears the active-collision
debt that blocks clean writes against `idx_businesses_dedup`.

## 2. Scope (RATIFIED)
- **v1 = 9-industry core-trades NSW only: 399 active-collision groups / 830 active rows / 431 redundant ("loser") rows.** 388 groups are simple pairs; tail up to a max cluster of 10 rows.
- **OUT of v1 scope (explicit follow-ons, do NOT widen this ticket):**
  - The 239-group all-NSW delta (psychologist, real_estate, GP, dentist, solicitor, …) → separate v2 pass.
  - **Null-suburb backfill.** Audit D4 proved the ~32,340 NSW-trades null-suburb rows are DISJOINT (zero overlap) from the dedup groups. Dedup does NOT fix null-suburb; that stays its own track.

## 3. Grounding findings (Grace audit)
- **D1** — 399 groups / 431 losers / max cluster 10 / 2 ambiguous-survivor groups.
- **D2** — deterministic survivor heuristic is clean: `enriched > completeness > review_count > recency`.
- **D3 FK fan-out on the 431 losers:** 497 `crawl_snapshots` (across 350 losers), 24 `business_events` (14 losers), and **36 losers are a PRIOR `canonical_id` in `business_merges`** — tombstoning them without re-pointing orphans earlier merge history (reversibility-critical).
- **D4** — dedup debt ⟂ null-suburb backfill (disjoint). Decoupled.
- **D5 (governing constraint)** — `google_place_id` is **NOT a safe standalone merge key**. Co-located businesses share one Google CID (a 10-row builder cluster = 10 DISTINCT names); 1,638 place_ids span multiple countries (e.g. 86 rows on one CID across AU+NZ). Naive place_id merge would FALSE-MERGE distinct businesses.
- The real uniqueness constraint / 23505 source is `idx_businesses_dedup = (industry, name, street, city, state)` — **composite**, not place_id.

## 4. Design

### 4.1 Candidate grouping → classification (D5-driven)
`google_place_id` is used ONLY to *group candidates*, never to auto-merge. Each group is classified into EXACTLY ONE of {AUTO-MERGE, QUARANTINE} — no third/unclassified state (satisfies AC-1 "0 unclassified").

**Corroboration signals** — for each of `name`, `street`, `phone` (all normalized), compare across the group's rows and label the signal:
- **match** = all non-null values are equal;
- **contradiction** = ≥2 non-null values differ;
- **unknown** = value is null on one or more rows (neither match nor contradiction).
- **Null-phone rule (resolves ambiguity):** a null phone is `unknown`, NEVER treated as agreement. Two null phones do NOT corroborate.

- **AUTO-MERGE (high-confidence true dup) — ALL must hold:** `name`=match AND `street`=match AND `phone`∈{match, unknown} AND no signal is a contradiction AND all rows share the same `(industry, country)`. (i.e. name+street must POSITIVELY match; phone must not contradict; null phone is permitted but non-corroborating.) These are genuine `idx_businesses_dedup` duplicates.
- **QUARANTINE (manual adjudication — NOT auto-merge, NOT discarded):** any group that is not AUTO-MERGE. This is a CATCH-ALL and explicitly includes:
  - any corroboration **contradiction** (name/street/phone mismatch among non-null values);
  - group has >1 distinct normalized name (e.g. the 10-name CID cluster — may be distinct co-located businesses OR name variants; **unproven either way**);
  - group spans multiple countries (`unreliable-place_id` — flag "investigate", do not discard);
  - cluster size ≥ 4;
  - the 2 ambiguous-survivor groups from D2.
  Quarantined groups are written to a report table/JSONL for human review; **no DML applied to them in v1.**

### 4.2 Survivor selection (auto-merge groups only)
Deterministic, tie-broken in order: `enrichment completeness (enriched flag) > field completeness score > review_count > most-recent crawl > lowest id`. Final `lowest id` tie-break guarantees total determinism. Logged per group so a reviewer can replay the choice.
- **field completeness score** = count of non-null among `[name, phone, email, website_url, address_suburb, review_count, enrichment_data]` (higher = more complete).

### 4.3 FK-safe merge (per auto-merge group, inside the envelope)
For each loser row, BEFORE tombstone, re-point children to the survivor:
1. `crawl_snapshots.business_id` → survivor (497 rows).
2. `business_events.business_id` → survivor (24 rows).
3. **`business_merges` where `canonical_id` = loser** → survivor (36 rows) — preserves earlier merge lineage.
4. Merge any survivor-null attributes fillable from losers (do NOT overwrite non-null survivor fields; record every field-level change in the pre-image).
5. Tombstone the loser (soft-delete via `merged_into = survivor_id`), NOT hard-delete in v1 — keeps reversibility. Hard-delete is a separate later GC pass if ever needed.

### 4.3.1 PREREQ MIGRATION (Jack's lane) — `businesses.merged_into`
`businesses` has NO `merged_into` column today (confirmed by Rajesh against staging schema). Blocking prereq: a migration in `konnex-data-pipeline/migrations/` adding
`merged_into uuid NULL REFERENCES businesses(id)` + a partial index `WHERE merged_into IS NOT NULL`. Tier-2 (additive, nullable, reversible, no data mutation) — Jack authors, Rajesh QA. All dedup DML (dry-run + live) is blocked on this migration landing on staging (dry-run) then prod (live).

### 4.3.2 EXECUTION NOTE — group-merge decomposition + atomicity (Grace's runner lane; endorsed by Rajesh)
The Phase-0 envelope's `plan(row)` is single-statement with a single-row `preImageSelect`. A group-merge mutates many rows (loser + re-pointed children + survivor null-fill), so it CANNOT run as one plan() call and still satisfy AC-3/AC-4. Resolution (no envelope lib change):
- **Decompose** each group-merge into single-row WRITE-UNITS: each child re-point, each survivor null-fill, each loser tombstone is its own envelope "row" with its own pre-image (satisfies AC-4 pre-image ⊇ every mutated row).
- **Group-boundary batching:** a group NEVER straddles a batch commit (`selectBatch`/`keyOf` are group-aware).
- **Intra-group ordering:** within a group's batch, ALL child re-points precede the loser tombstone (satisfies AC-3 no-orphan-FK).
- **Safe failure mode:** a mid-group crash AFTER child re-points but BEFORE tombstone leaves the loser still active with children pointing at the survivor — consistent, merely not-yet-deduped, and resumable. It is NEVER the dangerous partial-tombstone (orphaned-FK) case.

### 4.4 Execution via Phase-0 envelope (hard requirement)
All writes run through `konnex-data-pipeline/lib/prod-write-envelope.js`:
dry-run DEFAULT, per-batch txn, fsync'd per-row pre-image BEFORE commit, proactive
collision pre-check, resumable checkpoint. Per §4.3.2 the pre-image is captured per
write-unit (survivor null-fills + all re-pointed child rows + loser tombstone) so the
entire merge is reversible from the log.

## 5. Acceptance criteria
- **AC-1** Classification completeness (read-only over the full prod set): all 399 groups → (N auto-merge, M quarantine), 431 losers accounted for, **0 unclassified**. The seeded-staging merge dry-run classifies its seeded groups identically.
- **AC-2** Quarantine set contains every >1-distinct-name, cross-country, size≥4, and ambiguous-survivor group; ZERO auto-merge of any quarantined group (proven on the seeded 10-name CID cluster + a cross-country CID).
- **AC-3** FK re-point complete before every tombstone: on the seeded staging set, post-merge there are **0** `crawl_snapshots`/`business_events`/`business_merges` rows (BOTH FK directions) pointing at a tombstoned loser.
- **AC-4** Reversibility: pre-image log ⊇ every mutated row; a restore script reconstructs pre-merge state on staging byte-for-byte.
- **AC-5** No survivor non-null field overwritten; every attribute change is in the pre-image.
- **AC-6** Envelope invariants hold (dry-run zero-write, crash-consistency log-superset, resumable). Reuses Phase-0 WS-ii guarantees.
- **AC-7** Idempotent: a second run over already-merged groups is a no-op (planSkipped), 0 double-merge.

## 6. Execution gate
0a. **Prereq migration** (§4.3.1) `businesses.merged_into` — Jack authors, Rajesh QA, applied to staging (then prod at step 5). Blocks all dedup DML.
0b. **Staging seed** — staging currently has 0 of the 399 collision groups, so AC-1..4 would be no-ops. Grace produces a READ-ONLY seed MANIFEST (her lane): a representative prod extract (survivor + losers + their crawl_snapshots/business_events/business_merges children) covering EVERY AC branch — a few simple auto-merge pairs, the 10-name + 9-name clusters, a cross-country CID, a size≥4 group, the 2 ambiguous-survivor groups, and ≥1 of the 36 prior-canonical_id cases. **Grace also APPLIES the seed to staging** (staging is non-prod / WS-i throwaway; a staging INSERT is not a prod write, so it stays in Grace's dry-run-fixture lane). Manifest is reviewable by Jack/Rajesh before apply. Zero prod writes.
0c. Grace's staging verification must confirm BOTH FK directions in `business_merges`: loser-as-`canonical_id` (36 rows, audited) AND loser-as-`source`/merged-from side (re-point both, else orphan on the other side).
1. Spec → **Rajesh review** (QA lane). [CONDITIONAL PASS received 2026-07-05T13:26Z; this rev absorbs the 2 blockers + 2 must-fix + decompose note → back to Rajesh for clear-to-build.]
2. **Grace dry-run on staging** (via envelope) → produces classification + pre-image + reversibility proof. Read-only against prod (seed extract) + staging writes only.
3. Rajesh QA of dry-run (AC-1..7 on staging).
4. **Matt explicit GO for live prod DML** — a fresh signed GO, addressed so Grace can verify it. (The Phase-0 sequencing sig 3c8637e0 is NOT a prod-apply GO.)
5. Live apply on prod, batched via envelope, Grace-run under the verified GO, pre-image retained.
- No spend at any stage. No prod writes before step 4.

## 7. Out of scope / follow-ons
- v2: all-NSW 239-group delta.
- Null-suburb residual (~32,340) — separate track.
- Quarantine adjudication tooling / manual-review workflow — separate, if the quarantine set is large.
- Hard-delete GC of tombstoned rows — separate, only if ever needed.
