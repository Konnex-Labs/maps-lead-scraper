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
`google_place_id` is used ONLY to *group candidates*, never to auto-merge. Each group is classified:

- **AUTO-MERGE (high confidence true dup):** all rows in the group agree on normalized **name + street/address + phone** AND share the same `(industry, country)`. These are genuine `idx_businesses_dedup` duplicates.
- **QUARANTINE (manual adjudication — NOT auto-merge, NOT discarded):**
  - group has >1 distinct normalized name (e.g. the 10-name CID cluster — may be distinct co-located businesses OR name variants; **unproven either way**);
  - group spans multiple countries (`unreliable-place_id` — flag "investigate", do not discard);
  - cluster size ≥ 4;
  - the 2 ambiguous-survivor groups from D2.
  Quarantined groups are written to a report table/JSONL for human review; **no DML applied to them in v1.**

### 4.2 Survivor selection (auto-merge groups only)
Deterministic, tie-broken in order: `enrichment completeness (enriched flag) > field completeness score > review_count > most-recent crawl`. Deterministic + logged per group so a reviewer can replay the choice.

### 4.3 FK-safe merge (per auto-merge group, inside the envelope)
For each loser row, BEFORE tombstone, re-point children to the survivor:
1. `crawl_snapshots.business_id` → survivor (497 rows).
2. `business_events.business_id` → survivor (24 rows).
3. **`business_merges` where `canonical_id` = loser** → survivor (36 rows) — preserves earlier merge lineage.
4. Merge any survivor-null attributes fillable from losers (do NOT overwrite non-null survivor fields; record every field-level change in the pre-image).
5. Tombstone the loser (soft-delete / `merged_into = survivor_id`), NOT hard-delete in v1 — keeps reversibility. Hard-delete is a separate later GC pass if ever needed.

### 4.4 Execution via Phase-0 envelope (hard requirement)
All writes run through `konnex-data-pipeline/lib/prod-write-envelope.js`:
dry-run DEFAULT, per-batch txn, fsync'd per-row pre-image BEFORE commit, proactive
collision pre-check, resumable checkpoint. A full pre-image (survivor + all losers +
all re-pointed child rows) is captured so the entire merge is reversible from the log.

## 5. Acceptance criteria
- **AC-1** Dry-run on staging reproduces the classification counts exactly: 399 groups → (N auto-merge, M quarantine), 431 losers accounted for, 0 unclassified.
- **AC-2** Quarantine set contains every >1-distinct-name, cross-country, size≥4, and ambiguous-survivor group; ZERO auto-merge of any quarantined group (proven on the 10-name CID cluster + a cross-country CID).
- **AC-3** FK re-point complete before every tombstone: post-merge, 0 `crawl_snapshots`/`business_events`/`business_merges` rows point at a tombstoned loser.
- **AC-4** Reversibility: pre-image log ⊇ every mutated row; a restore script reconstructs pre-merge state on staging byte-for-byte.
- **AC-5** No survivor non-null field overwritten; every attribute change is in the pre-image.
- **AC-6** Envelope invariants hold (dry-run zero-write, crash-consistency log-superset, resumable). Reuses Phase-0 WS-ii guarantees.
- **AC-7** Idempotent: a second run over already-merged groups is a no-op (planSkipped), 0 double-merge.

## 6. Execution gate
1. Spec → **Rajesh review** (QA lane).
2. **Grace dry-run on staging** (via envelope) → produces classification + pre-image + reversibility proof. Read-only against prod.
3. Rajesh QA of dry-run (AC-1..7 on staging).
4. **Matt explicit GO for live prod DML** — a fresh signed GO, addressed so Grace can verify it. (The Phase-0 sequencing sig 3c8637e0 is NOT a prod-apply GO.)
5. Live apply on prod, batched via envelope, Grace-run under the verified GO, pre-image retained.
- No spend at any stage. No prod writes before step 4.

## 7. Out of scope / follow-ons
- v2: all-NSW 239-group delta.
- Null-suburb residual (~32,340) — separate track.
- Quarantine adjudication tooling / manual-review workflow — separate, if the quarantine set is large.
- Hard-delete GC of tombstoned rows — separate, only if ever needed.
