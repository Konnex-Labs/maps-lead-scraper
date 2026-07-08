---
task_id: v2-phase-2-clean-cut-au-trades-scope-reduction
agent: jack
session_id: 2026-07-08T15Z-phase2-clean-cut-build
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-08T16:18:00Z
notion_task_id: 3912300f-2ecb-8159-a300-ec7bd5009746
context_needed:
  files:
    - "/home/jack/projects/konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT-v2.md"
    - "/home/jack/projects/konnex-data-pipeline/migrations/021_v2_entities_archived_at.sql"
    - "/home/jack/projects/konnex-data-pipeline/scripts/one-off/tier3-phase2-archive.sql"
    - "/home/jack/projects/konnex-data-pipeline/scripts/one-off/tier3-phase0-export.sh"
    - "/home/jack/projects/konnex-data-pipeline/docs/runbooks/tier3-phase2-clean-cut-staging-dryrun.md"
  branches: [v2/phase2-clean-cut-build]
  collaborators: [matt, rajesh, grace]
---

# 🔴 PHASE 2 — PROD PHASE-0/1 EXECUTION — MATT GO RECEIVED → EXECUTE IN FRESH CONTEXT

> **⏭️ CONTEXT-EXIT for a fresh-context prod run. This is the DOCUMENTED plan (contract execution =
> "FRESH SESSION recommended") + 70% discipline: Tier-3 prod DML at ~5M rows must NOT run deep in a
> session where mid-op compaction could corrupt state tracking. DO NOT agent-offline — auto-relaunch
> is DESIRED to execute the runbook below with clean headroom.**
>
> **✅ Matt prod Phase-0/1 execution GO: sig `54248e8e3859546f` VALID (2026-07-08T16:16Z, "PR#60 GO").**
> Scope = reversible only (export + PITR + AC-6 verify + soft-archive both layers). NOT hard-purge
> (Phase 3 = SEPARATE 3rd Matt GO after ≥7-day cooling). NO spend.

## Authority (all VALID, full 16-char)
- Prod Phase-0/1 execution: Matt `54248e8e3859546f` ← THE GO to act on
- Phase-2 phase gate: Matt `4a1a16ae1897d78a` · Build+staging: Matt `2c556fdd3cba0c1b`
- entity-scope extension: Matt `96d90de23d72bcdb` · businesses keep-set: Matt `9f53bfb5f64bafa0`
- Contract v2 QA: Rajesh PASS `5b1fc24e2b0e8ce3` (11 ACs, staging) + `b6860903b6e32535` (spec)
- PR #60: rajesh-konnex GH-approved (16:11Z), merge gate CLEAR.

## ⛔ PROD DISCIPLINE — read before ANY prod write
- Every prod-write under the Phase-0 prod-write envelope + a LIVE PITR named restore point (like SP-4's `sp4_pre_apply_...`).
- STOP + escalate to Matt on ANY unexplained count drift OR AC-6 hash mismatch. Do not "proceed anyway".
- Soft-archive is REVERSIBLE (archived_at→NULL) + atomic (verify-before-commit). Hard-purge is NOT in scope.
- DDL applies as postgres/superuser (mig 021 header). market_intel/serving roles are NOT table owners.
- NO DFS spend. NO hard-purge.

## ▶️ ORDERED PROD EXECUTION RUNBOOK (fresh session runs this top-to-bottom)
**Pre-flight:** re-verify Matt GO `54248e8e3859546f`; re-read contract v2 §6/§7/§11; confirm target = prod market_intelligence on konnex-data (NOT staging).

- **A. Merge PR #60 → main** (code-only, reviewer-approved, Matt GO'd): `gh pr merge 60 --squash` in konnex-data-pipeline. Lands mig 021 + scripts + runbook on main.
- **B. NOTE-3 read-path scoping (contract §11, cross-repo — its OWN PR + Rajesh review).** Add `AND archived_at IS NULL` to every path serving businesses/entities:
    - prod views/MVs: `nsw_trades_stats`, `v_verified_active_silver` (confirmed on staging); re-enumerate on prod incl. `explorer_suburb_agg` + any others (`pg_matviews`/`pg_views` where def references businesses/entities).
    - konnex-data-api serving queries. · pipeline stage filters.
    - Sequencing note: Phase-1 archive is reversible and "archived rows still served" is the SAFE direction (nothing vanishes), so scoping may follow the archive — but it MUST be LIVE before Phase-1 is declared go-live. Decide order in the fresh session; both are safe.
- **C. Apply migration 021 on PROD** as postgres, under envelope + live PITR. Additive (entities.archived_at + partial index) — fast, reversible.
- **D. Phase-0 export on PROD** (read-only): `DB_URI=<prod> OUT_DIR=<off-box> scripts/one-off/tier3-phase0-export.sh`. Reconcile `rowcount_manifest.csv` vs live. **AC-6 hash MUST == `23692c660633e5d66059b8036272e428`** (abort if not).
- **E. Named PITR restore point** BEFORE any DML (e.g. `sp_phase2_pre_archive_<ts>`), record the LSN/label for Matt.
- **F. Re-reconcile prod delete-set counts** (drift check): compute live businesses delete-set (~3,406,379) + entities delete-set (~1,661,449). Use the EXACT current numbers as `-v expected_biz_delete=<N> -v expected_ent_delete=<N>`.
- **G. Re-run NOTE-1 + NOTE-2 on PROD** (staging showed 0 on subset — prod scale differs). Document real N for crawl_snapshots/business_events → delete-set businesses, and business_merges cross-boundary. Acknowledge before archiving.
- **H. Phase-1 soft-archive on PROD**: `psql <prod> -v ON_ERROR_STOP=1 -v expected_biz_delete=<N> -v expected_ent_delete=<N> -f scripts/one-off/tier3-phase2-archive.sql` as postgres (needs UPDATE on businesses+entities). Verify-before-commit gate enforces AC1/AC6/partition; confirm NOTICE counts before it COMMITs.
- **I. Post-archive verify**: AC-6 hash STILL == `23692c66…` (market_metrics/review_velocity untouched); every keep-set row `archived_at IS NULL`; counts match F.
- **J. Notify Matt + hand Rajesh the prod archive for QA.** Begin **≥7-day cooling**. Hard-purge (Phase 3) = SEPARATE 3rd Matt GO after cooling.

## Remaining after Phase-1 (all separately gated)
- Hard-purge (Phase 3, IRREVERSIBLE) — 3rd explicit Matt GO after ≥7-day cooling (contract §9).
- DFS NSW+3 pilot SPEND (~USD100-150) — SEPARATE spend GO after clean-cut lands.

## Resume notes
- Staging creds (for reference only; PROD is the target now): konnex_staging_v2 @127.0.0.1:15432, DDL via `sudo -u postgres`.
- Build artifacts are on branch `v2/phase2-clean-cut-build` (commits 2b321d9 + 502800b), PR #60.
- Rajesh online (session F), standing by; will QA the prod archive. Grace available for schema-fit.
