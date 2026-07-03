# Schema & Standards Health Assessment

**Author:** Jack (Head of Eng) · **For:** Matt · **Date:** 2026-07-03
**Trigger:** Matt asked (sig b31f1ce4) — after the DataForSEO NSW+3 mislabel incident, are we on "flaky ground" needing a schema / table / naming redesign?
**Method:** Ground-truthed live against `market_intelligence` DB (businesses + crawl_snapshots constraints, indexes, industry value distribution). Not written from memory.

---

## Verdict

**NOT flaky at the schema level.** Core tables are structurally sound, and the data is real. Today's incident was an **ingest-code defect** (a global `--trade` default stamped across three crawl_ids), NOT a schema defect. The schema did what it was told; nothing enforced that what it was told made sense.

That said, the incident exposed **three hardening gaps** worth scoping as a short, serial, NON-blocking review (same shape as the Cortex queue). None is on fire. None blocks the DFS fix or the re-post.

### What's healthy (verified)
- `businesses` has a surrogate PK (`id`) plus a real dedup key: `UNIQUE idx_businesses_dedup (industry, lower(name), address_street, address_city, address_state)`. Deduplication is enforced at the DB, not just in app code.
- `crawl_snapshots` has per-crawl lineage: `UNIQUE idx_snap_place_ind_crawl (google_place_id, industry, crawl_id)`. Crawl membership is authoritative and correctly keyed — which is exactly why Grace's re-split can trust `crawl_id` and only needs to fix the `industry` label.
- The schema already practices enum discipline where it matters: `data_source` and `data_source_type` both carry CHECK-enum constraints.
- Data is real: NSW electrician/plumber/carpenter true universe ~25-30k active rows, consistent with external proxies.

---

## Hardening item A — no validity guard or naming standard on `industry`  (severity: MEDIUM — direct cause enabler)

**Evidence.** `businesses.industry` is `NOT NULL varchar` with **zero** CHECK/enum/FK constraint. Any arbitrary string is accepted. The schema *already* guards `data_source` and `data_source_type` with CHECK-enums — `industry` was simply never given the same treatment. That is precisely how the bogus `nsw-trades_au` bucket (18,445 rows) was created without any DB-level objection.

Compounding it, there is **no naming standard**. Live distinct industries = 143, and they are inconsistent:
- `electrician_au` (49,767) coexists with un-suffixed `electrician` (46,862) and `electrician_ca / _uk / _nz / _us`.
- A pure regex pattern (`{trade}_{cc}`) would NOT have caught `nsw-trades_au` — it matches the shape. Catching it requires an **allowlist of valid trade slugs**.

**Because `industry` is part of BOTH unique keys** (dedup + snapshot), a single bad label doesn't just mislabel a row — it forks a whole phantom bucket and phantom snapshot lineage. High blast radius for a cheap-to-prevent error.

**Proposed fix.** An `industry_catalog` reference table (valid `{trade, country_code, canonical_label}` rows) + FK from `businesses.industry` and `crawl_snapshots.industry`. This rejects `nsw-trades_au` at write time and normalizes the suffix inconsistency. Cheaper interim: an app-layer validator in the ingest/runner path (fail-loud, no default) — which Grace's forward runner fix already delivers for the DFS path specifically. The catalog+FK generalizes that guard to every writer.

## Hardening item B — the `industry = SEARCH-TRADE` convention is undocumented  (severity: LOW — standards/documentation)

**Evidence.** `industry` records the **search trade the row was crawled under**, NOT the business's `maps_category`. Existing `electrician_au` is ~70% non-electrician by maps_category; buckets legitimately include adjacent categories. This is a real, intended convention — but it is nowhere written down, which is exactly why the mislabel fix was almost misrouted as "re-derive from maps_category" (wrong: that would destroy the search-trade semantics).

**Proposed fix.** Document the convention (one short standards note). Separately, decide whether we want an *optional* maps_category noise-filter as a DQ view — this is a **product/DQ decision for Matt**, kept DECOUPLED from the label fix.

## Hardening item C — per-industry row duplication for multi-trade businesses  (severity: MEDIUM — structural, non-urgent)

**Evidence.** Because `industry` is in the dedup key, a business that legitimately operates as multiple trades is stored as **N separate rows** with no shared identity or lineage. Grace's audit found 3,504 such multi-trade-collapsed businesses in today's scope alone. This ties directly to the already-flagged dedup-no-lineage issue (616 orphaned verified records / 18.3%, remediation already Matt-gated — see [[project_dedup_no_lineage_verified_data_loss]]).

**Proposed fix (examine, don't build yet).** Evaluate a canonical-entity + membership model (one business identity, N trade memberships) vs. today's per-industry duplication. This is a design evolution, not a correctness bug — largest of the three, and should be scoped as its own review alongside the existing dedup remediation, not bundled into this incident.

---

## Recommendation

1. **No redesign needed now.** The schema is correct, observable, and recoverable. Ship the DFS label fix (Grace) + re-post on the current plan.
2. **Open a short serial "Schema Standards Hardening" review** — items A → B → C, in that order, NON-blocking, sequenced AFTER the DFS fix and behind the Cortex queue. A is the cheap high-value win (prevents recurrence); B is a documentation task; C folds into the existing dedup-remediation conversation.
3. Nothing here changes the re-post economics or timing.
