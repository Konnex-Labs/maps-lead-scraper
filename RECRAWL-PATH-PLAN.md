# AU Trades Re-Crawl Path — Decision Plan

**Author:** Jack (Head of Eng) · **Date:** 2026-06-25 · **Status:** AWAITING MATT DECISION
**Reviewers:** Matt (decision), Rajesh (QA, contract-first once path chosen)
**Do-nothing gate:** No spend, no dispatch, no ticket written until Matt steers (per Matt 2026-06-25 04:09Z).

---

## 1. Problem statement

There is **no live fresh-crawl path for AU trades.** The "proxy-first Decodo re-crawl" workstream we'd been running for several sessions was built on a false premise:

- `crawl-1` + `crawl-2` (the boxes that ran the legacy `crawl` stage) were **terminated 2026-05-24**. The orchestrator server registry (`pipeline-orchestrator/lib/config.js:30-49`) now holds only `data`/`ops`/`api`.
- The legacy `crawl` stage still hardcodes `server:'crawl-1'` (`stage-executors.js:145/167`), so any `crawl`-stage dispatch throws `Unknown server: crawl-1` and fails. Confirmed live 2026-06-25 (7× failures, alert `28369408`, since remediated).
- The Decodo proxy-wire (PR #26 / `d81b074` into `crawl-google.js`) targeted this **decommissioned** infra. It has never carried real crawl traffic.
- The "au-plumbers/painters/landscapers crawling healthily through Decodo" reported in prior checkpoints were **enrichment passes over existing records** (enrich_mode_b/c, playwright, smtp, cleanup), **not new crawls.**

**Impact on T2:** "4/7 done" means 4 industries *enriched*, not *crawled*. The temporal-diff/refresh gate is further out than tracked, because we have no current mechanism producing fresh sightings for trades.

**Provenance caveat:** the two Matt sigs cited in `config.js` for the termination (`61407409934d4a4d`) and vendor-fed pivot (`9871aa88a3c34829`) do not resolve on Jack's or Rajesh's keystore — most likely aged out of the verify window. Independent evidence (registry contents, dispatch failures, DB job history) confirms the boxes are gone regardless. **Open Q1 for Matt: confirm the 2026-05-24 crawl-box termination was your call.**

---

## 2. What exists today (the building blocks)

- **V2 own-fetcher + BD Web Unlocker** on konnex-ops — the vendor-fed fetch path. Runs under the `v2_verification` stage (grouped with `crawl` for concurrency: `config.js:71`, maxCrawlsPerGroup=1). Last ran 2026-06-10 (RE agents). Tuning note: needs `UV_THREADPOOL_SIZE=32` at concurrency=10.
- **Enrichment chain** (dedup_qa → mode_a/b/c → playwright → smtp_verify → final_cleanup) — healthy, operates on *existing* records.
- **Legacy `crawl` stage** — dead (points at terminated boxes). The `crawl-google.js` + Decodo proxy-wire belong to this dead path.

---

## 3. Options

### Option A — Route trades through V2 own-fetcher/BD; retire the legacy crawl stage  *(Jack's recommendation)*
Make `v2_verification` (own-fetcher on konnex-ops) the fresh-data path for AU trades, and formally retire the dead `crawl` stage.

- **Pros:** No new infra, no new spend beyond existing BD/own-fetcher budget. Aligns with the 2026-05-24 vendor-fed decision. Removes a live foot-gun (any `resume au-<trade>` currently dispatches into dead infra). Reuses a path already validated on RE.
- **Cons:** Need to confirm own-fetcher coverage/throughput is adequate for trade volumes (it was sized for RE/V2 verification, not full-industry crawl). BD per-fetch cost model needs a sanity check against trade record counts. v2_verification dormant since 06-10 — needs a re-validation run.
- **Work (contract-first, QA by Rajesh):**
  1. Map each AU trade industry's stage routing from `crawl` → `v2_verification` (industry-sync QUEUE_ORDER / pipeline_industries config).
  2. Remove/guard the dead `crawl` hardcode (`stage-executors.js:145/167`) so it can't dispatch to a non-existent server — fail-fast or drop the stage.
  3. Single-industry validation run (e.g. au-pest-control) through own-fetcher; verify fresh sightings land + cost is within budget.
  4. Decommission the Decodo proxy-wire workstream (PR #26/`d81b074`) as dead-path code — or repurpose its proxy logic for own-fetcher if BD needs residential egress.
  5. Roll out remaining trades; re-baseline T2 against *crawled* (not enriched) counts.

### Option B — Stand up new crawl infra (resurrect a crawl-server pair)
Provision replacement crawl boxes, re-point the `crawl` stage, wire the Decodo proxy (the existing PR becomes useful again).

- **Pros:** Reuses the existing crawl-google.js + proxy-wire investment directly. Full control over crawl volume/topology (the old 24-worker model).
- **Cons:** New infra spend (2× boxes) + ongoing Decodo proxy spend. Reverses the 2026-05-24 vendor-fed decision. Re-introduces the SERP soft-block exposure that triggered the original incident. Higher ops surface (box health, worker reaping, the dup-crawl class of bugs).

### Option C — Accept enrichment-only for now
Stop trying to crawl trades; keep enriching the existing record base; defer the fresh-data question.

- **Pros:** Zero work, zero spend. Buys time to decide properly.
- **Cons:** No fresh sightings → the trades "market pulse / verified-active" signal goes stale; T2 temporal-diff gate cannot be met. Only viable as a short-term holding position.

---

## 4. Recommendation

**Option A.** It matches the vendor-fed direction you already set, needs no new infra/spend, removes a live foot-gun, and reuses a validated path. The main unknown — whether own-fetcher/BD throughput + cost works at trade volumes — is exactly what step A.3 (single-industry validation) de-risks before any broad rollout. If A.3 shows own-fetcher can't carry the volume economically, that's the trigger to reconsider B.

**Suggested immediate next step if you pick A:** I write the sprint contract (ACs + cost-validation gate), Rajesh reviews contract-first, then we do the single-industry validation run before committing the rollout.

---

## 5. Open questions for Matt
1. Confirm the 2026-05-24 crawl-box termination was your decision (closing the unverifiable-sig loop).
2. Path choice: A, B, or C?
3. If A: any BD/own-fetcher monthly budget ceiling I should design the cost-validation gate against?

## 6. Current safe state (no action pending decision)
All 4 AU trades paused (`is_active=false`). Incident `28369408` resolved. No spend, no dispatch, no ticket until you respond.
