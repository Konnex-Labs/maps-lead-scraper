# Schema Hardening A — `industry_catalog` allowlist + FK guard — Sprint Contract / Spec

**Ticket:** 3922300f-2ecb-81ce-9b6c-fe4e10fcb30e
**Owner:** Jack · **Reviewer:** Rajesh (contract-first QA) · **Matt GO:** sig 5e3499391f75583b
**Sprint:** 17 · **Epic:** Data Pipeline · **Session estimate:** 2–3
**Status:** DRAFT — pending Rajesh contract re-gate + Matt apply-GO. Ref: `SCHEMA-STANDARDS-HEALTH.md` item A.

## Problem / Why
`businesses.industry` and `crawl_snapshots.industry` are `varchar(100) NOT NULL` with **zero** validity constraint, while sibling columns `data_source` / `data_source_type` are already guarded by CHECK-enums. That gap is how the bogus `nsw-trades_au` bucket (18,445 rows) was accepted without DB objection. Because `industry` is a member of **both** unique keys, a single bad label forks a whole phantom dedup bucket + phantom snapshot lineage — high blast radius for a cheap-to-prevent error. This item generalizes the fail-loud guard (which Grace's DFS runner already delivers for the re-post path) to **every** writer.

## Ground truth (live, 2026-07-03)
- `businesses`: 3,774,067 rows, **142 distinct** industries. `industry` = varchar(100) NOT NULL, no constraint.
- `crawl_snapshots.industry` = varchar(100) NOT NULL, no constraint.
- Enum precedent: `businesses_data_source_check` + `chk_data_source` (DUPLICATE — same predicate; drop one), `businesses_data_source_type_check`.
- Unique keys containing `industry`:
  - `idx_businesses_dedup` = UNIQUE(industry, lower(name), lower(coalesce(street)), lower(coalesce(city)), lower(coalesce(state)))
  - `idx_snap_place_ind_crawl` = UNIQUE(google_place_id, industry, crawl_id)
- Landscape is inconsistent: unsuffixed legacy buckets (`accountant` 303k, `financial_advisor` 447k, `electrician` 46.8k) coexist with suffixed `{trade}_{cc}` (`_au/_us/_ca/_uk/_nz`). Large `_us/_ca/_uk` buckets are still present → **the AU-trades-only delete pivot has NOT executed yet** ([[project_au_trades_only_delete_pivot]]).
- A pure regex (`{slug}_{cc}`) is insufficient: `nsw-trades_au` matches the shape. Catching it **requires an allowlist**.

## Design
`industry_catalog` reference table + FK from both `industry` columns:

```
industry_catalog(
  canonical_label  varchar(100) PRIMARY KEY,   -- exact string stored in businesses.industry
  trade_slug       varchar(80)  NOT NULL,      -- e.g. 'electrician'
  country_code     char(2)      NOT NULL,      -- 'AU','US','CA','UK','NZ'
  active           boolean      NOT NULL DEFAULT true,
  notes            text
)
```
FK (both NOT VALID first, then VALIDATE — online-safe on 3.7M rows):
- `businesses.industry` → `industry_catalog.canonical_label`
- `crawl_snapshots.industry` → `industry_catalog.canonical_label`

## Open decisions — resolve BEFORE build (Rajesh gate + Matt where noted)
1. **Catalog scope vs the AU-trades-only delete.** If the delete lands first, seed AU-only (small, clean). If not, the catalog must cover every surviving CC or VALIDATE fails. **Recommend:** sequence A *after* both the clean DFS re-post AND the delete pivot; seed the catalog from post-delete `SELECT DISTINCT industry`. (Product/spend sequencing — Matt.)
2. **Suffix normalization (unsuffixed → `_au`).** OUT of scope for A. It is a data migration on the dedup unique key → collision risk. Track as a separate item (relates to item B naming standard). A only *prevents new* bad writes; it does not retro-normalize.
3. **Existing-row reconciliation.** FK VALIDATE fails on any row whose `industry` ∉ catalog. Options: (a) seed catalog with *all* surviving distinct values incl. bad ones — defeats the purpose; (b) seed the canonical allowlist, then remap/quarantine non-conforming rows (`nsw-trades_au` → correct trade) **before** VALIDATE. **Recommend (b).** Remap rows are lineage-touching → coordinate with Grace; quarantine (not silent delete) preserves recoverability.

## Acceptance criteria
*(Revised 2026-07-03 per Rajesh contract review 7cf96fad198381d1 — AC1/AC3/AC4/AC5 tightened; AC2/AC6 passed as-was.)*

- **AC1** `industry_catalog` exists with columns (`canonical_label`, `trade_slug`, `country_code`, `active`), seeded from a **documented seed-source query** whose output **row count is recorded at seed time**. *Testability of "complete vs partial catalog" is explicitly gated on open-decision 1 (catalog scope):* until the delete-pivot sequencing is resolved, the seed query defines the catalog's declared scope, and QA verifies the seeded set == the seed-query output at that point in time (not an absolute count).
- **AC2** Validated FK on `businesses.industry` AND `crawl_snapshots.industry` → `industry_catalog.canonical_label`, observable as `pg_constraint.convalidated = true` on both tables (state = VALIDATED, not NOT VALID). *(Rajesh: PASS.)*
- **AC3** Committed repro proving an INSERT/UPDATE with an off-allowlist industry (`'nsw-trades_au'`) is **rejected at the DB level** (fail-loud). **Format:** a `node:test` file under `tests/` (consistent with repo test style) — not an ad-hoc SQL snippet — so it runs in CI.
- **AC4** *(split — no OR gate)*: **(4a) PRIMARY** — a pre-VALIDATE count query returns **zero** rows whose `industry` ∉ `industry_catalog` on both tables. **(4b) CONDITIONAL** — IF a quarantine path was taken for non-conforming rows, a quarantine table/view exists with documented schema + recorded row count, independently observable. 4a is the pass gate; 4b is additional documentation when applicable.
- **AC5** Rollback path documented and tested. **Substrate:** since `market_intelligence` has no dedicated staging clone, test on a `pg_dump`-restored temp schema (or a throwaway temp DB), stated explicitly in the test. **Assertion:** after rollback, `pg_constraint` shows **no** FK on `businesses.industry`/`crawl_snapshots.industry` AND a previously-rejected insert (`'nsw-trades_au'`) now **succeeds** — proving prior behavior restored. Recoverable.
- **AC6 (optional bundled cleanup)** Resolve the duplicate `data_source` CHECK (`businesses_data_source_check` vs `chk_data_source`) — drop one — or explicitly defer. *(Rajesh: PASS.)*

## Migration strategy (online-safe)
1. `CREATE TABLE industry_catalog (...)` + seed.
2. Reconcile non-conforming rows (per open-decision 3) — batched, off-peak.
3. `ALTER TABLE businesses ADD CONSTRAINT fk_industry ... NOT VALID;` (brief lock only).
4. `ALTER TABLE businesses VALIDATE CONSTRAINT fk_industry;` (scan, non-blocking) — off-peak; watch :3460 (large scans can trip the synthetic check — see [[feedback_bulk_write_businesses_trips_synthetic_check]]).
5. Repeat 3–4 for `crawl_snapshots`.

## Gating / sequencing
- Matt GO sig 5e3499391f75583b authorizes the ticket. **Prod DDL APPLY on `businesses` (3.7M) remains Matt-gated** per policy ([[feedback_no_self_merge_prod_matt_gated]], [[feedback_broad_ownership_grant_is_literal_scope]]) — path is contract → Rajesh QA → Matt apply-GO. Autonomy grant 60b0ab4d256283fa covers DFS+Cortex streams only, NOT this DDL.
- **Fast-follow AFTER** the clean DFS re-post (and ideally after the delete pivot — see open-decision 1). Non-blocking, serial hardening A → B → C.

## Out of scope
- Suffix/naming normalization of existing rows (item B territory).
- Canonical-entity / multi-trade membership model (item C).
- Any change to dedup key structure.
