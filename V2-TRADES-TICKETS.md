# Konnex V2 — Trades Ticket Set

**Author:** Jack | **Date:** 2026-06-20 | **Status:** Draft for Matt prioritisation
Companion to V2-TRADES-STRATEGY.md. Each ticket → Notion task + dispatcher per protocol. Session estimates included for cost exposure.

Legend: **P0** = do now / unblocks others · **P1** = near · **P2** = later. Siz = session estimate (1 / 2-3 / 4+).

---

## Phase 0 — De-risk & foundation

### T1 — National trades source-feasibility scan  · P0 · Siz 2-3 · read-only, no gate
Scan all state trade regulators (NSW/QLD confirmed bulk; VIC/SA/WA/TAS/ACT/NT unknown) + sample council DA portals + ABS approvals endpoint. Output: a bulk/search-only/blocked matrix like the agency-botwall scan. **Owner: Jack.** No prod impact.

### T2 — Arm the review-velocity refresh (t1 vs existing Apr-May t0)  · P0 · Siz 1
Schedule a one-off + then recurring re-pull of the 106k AU trades base; diff `review_count` against the Apr-May snapshot to produce the first velocity delta. Confirms the engine end-to-end on real data. **Owner: Jack.** (Cheap; ~$ negligible.)

### T3 — Event schema + crawl_snapshots + change-detection spine  · P0 · Siz 4+ · THE engine
Define `events`, `crawl_snapshots`; implement diff-between-crawls producing typed events (review_count_changed, business_opened/closed, etc.) with source/confidence/observed_at/evidence. This is the load-bearing temporal engine — review-velocity AND licence-issuance both ride it. **Owner: Jack.** Needs Rajesh contract-first QA (tool spec + acceptance criteria before build).

### T4 — Confirm `is_active` semantics  · P0 · Siz 1 · investigation
Determine what drives active vs inactive (builder 84k total / 30k active). If genuine churn → wire as business_open/close events. Gates whether we treat the inactive pile as signal. **Owner: Jack.**

### T13 — "Verified active" SILVER tier: composite + parse hardening  · P0 · Siz 2-3 · TODO
Define the PII-free "verified active" composite — `is_active=true` AND `maps_business_status='operational'` AND recent review velocity (~12-18mo) — and harden the `business_status` parse so a parse-miss no longer silently coerces to `operational` (`crawl-google.js:264/351`). T4 only *investigates* `is_active`; T13 *defines the composite + fixes the parse*. Ships ahead of the gold tier (T7). **Owner: Jack.** Sprint contract: `ops/sprint-contract-v2-trades-t13-verified-active-silver.md`. Needs Rajesh contract-first QA.

---

## Phase 1 — Demand signal (fast win)

### T5 — ABS building-approvals ingestion  · P1 · Siz 2-3
Ingest ABS approvals (free, aggregate, PII-clean, LGA-level, new-build vs reno) → suburb demand metric. First non-Maps sensor. **Owner: Jack.**

---

## Phase 2 — Market Pulse prototype

### T6 — Konnex Market Pulse (suburb metric + Map + Timeline)  · P1 · Siz 4+
One geography, validated trades. Suburb-level pulse (review velocity + ABS), Map heatmap + Timeline of changes. Define the index. **Owner: Jack + Olivia (frontend).**

---

## Phase 3 — Supply signal + verification

### T7 — NSW/QLD licence-register ingestion + verified-licensed badge (GOLD tier)  · P1 · Siz 4+
Bulk-load QBCC + NSW Home Building registers; snapshot-diff for new-licence (supply) signal; cross-ref against scraped base → verified-licensed badge + ABN match. **Gold tier of "verified active"** = silver-qualified (T13) ∧ active-licence-matched; stronger public claim ("N licensed tradies in suburb"). The ONE PII-bearing layer → licensee names/addresses internal-store only, surface badge + aggregate count only; never discrete leads (lane boundary). **Owner: Jack.** Gated on T1 (confirm bulk access — QLD QBCC confirmed, NSW TBC) + PII spec (T11, signed). Sprint contract: `ops/sprint-contract-v2-trades-t7-licence-gold.md`. Needs Rajesh contract-first QA + Alex lane scope-verify.

---

## Phase 4 — Ask Konnex

### T8 — Ask Konnex over the signal store  · P2 · Siz 4+
Evidence-backed answers across businesses + events + metrics; professional + institutional use cases separated. **Owner: Jack.**

---

## Phase 5 — Paid packaging

### T9 — Billing/entitlement layer  · P2 · Siz 4+
Metering/quota (free Ask Konnex 3-5/day, 24h reset), never-expire credit ledger, subscription entitlement gating, market-pulse alert delivery. **Owner: Jack.**

### T10 — Insights/Research Hub publishing pipeline  · P2 · Siz 4+
Publish aggregate research with schema/structured markup optimised for AI citation (the SEO/GEO engine). PII-clean by construction. **Owner: Jack + Olivia + Carlos (SEO).**

---

## Cross-cutting / coverage

### T11 — PII & Compliance Spec: trades-lens re-review + sign-off  · P0 · Siz 2-3 · GATING
Re-review the in-review spec through the trades/sole-trader-collapse lens; sign. Unlocks the email enrichment lanes (T7, T10). **Owner: Jack.** Blocks T7, T10.

### T12 — Close trades coverage gaps  · P1 · Siz 2-3
Crawl roofer_au (missing); add categories (concreter, tiler, plasterer, bricklayer, fencing, glazier, flooring…); fix handyman phone coverage. **Owner: Jack.**

---

## Suggested critical path
**T11 (sign spec) ∥ T1 (feasibility) ∥ T2 (velocity t1)** → **T3 (engine)** → **T5 (ABS) ∥ T7 (licences, needs T1+T11)** → **T6 (pulse)** → **T8 (Ask Konnex)** → **T9/T10 (packaging)**. T4 and T12 fold in opportunistically.
