---
task_id: v2-phase-2-clean-cut-au-trades-scope-reduction
agent: jack
session_id: 2026-07-08T16Z-phase2-prod-exec
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-08T17:05:00Z
notion_task_id: 3912300f-2ecb-8159-a300-ec7bd5009746
context_needed:
  files: ["konnex-data-pipeline/scripts/one-off/tier3-phase2-archive.sql", "konnex-data-pipeline/scripts/one-off/tier3-phase0-export.sh", "/home/jack/backups/tier3-au-trades/tier3-phase0-20260708T164635Z"]
  branches: [main]
  collaborators: [matt, rajesh]
---

# 🔴 PHASE 2 PROD EXEC — CONTEXT-EXIT @~71% BEFORE ARCHIVE. Fresh session resumes at Step H (entity archive).

Clean exit point: C/D/E/F/G ALL DONE, archive NOT started, NO open transaction, prod verified untouched
(ent_archived=0, biz_archived=3,406,379). Per 70% protocol + runbook ("Tier-3 prod DML must not run deep in
a session where compaction could corrupt state"). DO NOT agent-offline — auto-relaunch DESIRED to run the
archive with clean headroom under the two-person gate.

Authority (VALID): Matt original Phase-0/1 GO `54248e8e3859546f`; Matt LIVE 'go prod' (fresh, post-exit)
`30713a274039d357` (both matt→jack VALID). Rajesh relay-confirmed GO unrevoked + two-person gate agreed.

## Done
- **A** PR #60 MERGED → konnex-data-pipeline main (squash `bfad0e4`). mig021 + scripts + runbook on main. (Fixed uuid CI check via `gh api PATCH`; `gh pr edit` aborts on projectCards GraphQL.)
- **C** mig021 applied on PROD market_intelligence (entities.archived_at + idx_entities_archived_at). Reversible.
- **AC-6 HASH GATE PASS**: prod hash = `23692c660633e5d66059b8036272e428` (3 baseline rows). Velocity baseline preserved.
- **D** Phase-0 export DONE (exit 0), reconciled, sha256 OK. Off-box: `/home/jack/backups/tier3-au-trades/tier3-phase0-20260708T164635Z` (schema.sql + tier3_tables.dump 1.9G + manifests, verified). Full set incl delete-set CSVs (3.8G+571M) durable on `konnex-data:/home/jack/tier3-phase0-backup/…`. Restore = load schema.sql then `pg_restore --data-only --disable-triggers` (circular-FK warning on data-only dump).
- **E** PITR restore point BEFORE any DML: label `sp_phase2_pre_archive_20260708T165254Z`, LSN `8F7/246A32F0`, at 2026-07-08 16:52:55Z. archive_mode=on, wal_level=replica, PG 16.14.
- **F** Delete-set reconciled at prod scale, EXACT + clean partition. businesses: 3,776,477 = 370,098 keep + **3,406,379 delete** (0 NULL-industry). entities: 1,837,437 = 175,988 keep + **1,661,449 delete**. Archive vars: `expected_biz_delete=3406379 expected_ent_delete=1661449`.
- **G** NOTE-1/2 CLEAN: NOTE-1 snap_ref_delete=0, evt_ref_delete=0 (delete-set is legacy, predates temporal/event tables). NOTE-2 = 0 cross-boundary merges (all 31,551 within-boundary: 21,508 del/del + 10,043 keep/keep).
- **KEY FINDING — businesses layer ALREADY archived on prod (EXPECTED, not drift).** `businesses.archived_at` set on EXACTLY 3,406,379 rows, single tx at 2026-07-02 09:02:49.783561Z = the v1 businesses-only clean-cut (matches backups/tier3-au-trades/20260702T084334Z). CLEAN: keep_wrongly_archived=0, delete_NOT_archived=0. Per mig021 header, businesses = v1 layer; Phase-2 adds ENTITY layer. On PROD the script's businesses UPDATE touches 0 rows (`WHERE archived_at IS NULL`), only entities archive fresh (1,661,449). Gate still validates both (b_arch=3,406,379==expected). By design/idempotent — surface in gate, NOT a stop (counts exact, AC-6 held).

## Done (archive)
- **TWO-PERSON GATE SATISFIED** (2026-07-08T17:04Z): Rajesh CLEAR (sig 2f60f069a6cbf087 VALID) + Matt LIVE GO (sig fdb60ed7d62bff14 VALID), both verified.
- **H REAL ARCHIVE COMMITTED** (single tx, verify-before-commit gate passed, COMMIT ok): UPDATE 0 businesses (already archived 07-02), UPDATE 1,661,449 entities (fresh). Gate NOTICEs: biz total=3,776,477 archived=3,406,379 keep_live=370,098 keep_wrongly_archived=0; ent total=1,837,437 archived=1,661,449 keep_live=175,988 keep_wrongly_archived=0.
- **I POST-ARCHIVE VERIFY PASS** (independent re-query): ent_archived=1,661,449; biz_archived=3,406,379; ent_keep_live=175,988; ent_keep_wrongly_archived=0. **AC-6 velocity hash STILL = 23692c660633e5d66059b8036272e428** (recomputed via SP-4 query, UNCHANGED — baseline preserved).

## Done (archive) — cont.
- **J RAJESH QA PASS ✅ (2026-07-08T17:12Z, sig 15089728409c8a62 VALID).** AC4-AC8 independently verified on prod: counts exact both layers, partition exact, keep_wrongly_archived=0 both, AC-6/AC7 velocity hash 23692c66… exact SP-4 match. Benign note: biz keep_live=370,098 vs contract 331,940 = +38,158 pipeline ingests since 07-02 (NOT a defect). **7-day cooling started 2026-07-08T17:12Z → Phase-3 hard-purge earliest 2026-07-15, needs SEPARATE 3rd Matt GO.** Matt notified.

## Remaining
- **Cooling (passive):** ≥7-day window running; Phase-3 hard-purge (IRREVERSIBLE) = separate 3rd Matt GO after 2026-07-15. DFS NSW+3 pilot spend (~USD100-150) = separate spend GO.
- **B** NOTE-3 read-path scoping (own cross-repo PR + Rajesh QA). DISCOVERY DONE 2026-07-08T17:1x:
  - **Prod pg scan → exactly 3 objects reference businesses/entities (all served off `businesses`, filtered `is_active=true` only, NOT archived_at):**
    - `explorer_suburb_agg` (MATVIEW): NO industry filter → **LEAKS archived**. Needs `AND b.archived_at IS NULL` in main WHERE + in `sab_attribution` CTE.
    - `v_verified_active_silver` (VIEW): NO WHERE archived filter (emits all businesses) → **LEAKS archived**. Add `WHERE b.archived_at IS NULL`.
    - `nsw_trades_stats` (VIEW): filters industry to 3 KEEP trades (electrician/plumber/carpenter) which the delete-set excludes → effectively safe, but add `AND businesses.archived_at IS NULL` to biz CTE for correctness/defence.
  - **KEY FINDING (leak is real & LIVE):** archive sets `archived_at` only, NOT `is_active`. 1,989,884 archived businesses still `is_active=true` → currently served by explorer_suburb_agg + v_verified_active_silver (pre-existing since 07-02 v1 cut). Explorer suburb counts inflated by archived non-trade rows.
  - **Entities layer:** none of the 3 prod views read `entities`. STILL TODO: grep konnex-data-api serving queries + pipeline stage filters for direct `entities` reads (1,661,427 archived entities also is_active=true).
  - **Code surface (grep done):** broad. Serving-read candidates needing per-file triage: konnex-data-api `server.js`, `lib/brand-explorer.js`, `lib/tool-handlers/{search_records,aggregate_records,filter_records,get_record_detail,compare_records,find_recent_activity}.js`; pipeline `explorer-api.js`. Many other matches are write/enrichment/one-off scripts (out of scope). Per-file read = the PR-authoring work itself.
  - **Remaining B work:** (1) triage serving-read files above vs write scripts; (2) author cross-repo PR (view/MV redefs + code filters); (3) Rajesh QA; (4) deploy + REFRESH explorer_suburb_agg. LIVE before Phase-1 go-live.
  - **DECIDED (b) — Matt sig 1578b2807800a6c8 VALID 2026-07-08T17:20:50Z.** Fold read-path scoping into Phase-1 go-live read-model build; NO isolated PR / NO explorer_suburb_agg refresh now. Rajesh concurs (sig 1f933cf4bbe142f3 VALID). **STRATEGIC REFRAME (Matt, screenshot uat.konnexlabs.com):** no paying customers yet; current build = thin read models feeding 4 surfaces (Ask Konnex / Developer API / MCP Server / Insights Hub). So archived_at IS NULL scoping gets built INTO the new-surface read models from the start — not retrofitted onto deprecated Explorer v1 MVs. Discovery above is captured + ready to slot into Phase-1. Rajesh will QA the cross-repo PR when Phase-1 read-model work kicks off.
  - **Phase-1 carry-forward flags:** (1) scoping drops headline 'live metrics' (620K+ businesses → in-scope) — Matt APPROVED (sig d704a7b34034dc5e VALID 17:26Z, "not concerned about home page stats decreasing"); (2) Explorer v1 live pages untouched until Phase-1.
  - **SCOPE REFINEMENT (Matt, sig d704a7b34034dc5e 17:26Z):** archive keeps ALL national AU trades as the superset, but Phase-1 read models (4 surfaces + home 'live metrics') should INITIALLY surface only the **live-ingested NSW+3 trades footprint, then grow region-by-region** as sources come online. NOT a re-cut of the archive — a growing subset over the stable foundation. **Build read-model defs region/industry-parameterised (not hardcoded) so expansion is data-driven, no schema churn.** Matt validated the v2-foundation architecture ("which you have designed") — foundation/data-model/easy-add-sources was the whole project goal.
  - **QA REQUIREMENT (Rajesh, sig 701c221ab5ee5637 VALID 17:27Z):** Phase-1 sprint contract ACs MUST pin the initial footprint as fixed ground-truth (parameterised filter is scope-opaque to QA): (a) exact trade industries live at launch, (b) exact NSW+3 regions/states named, (c) expected in-scope row counts per industry×region at hand-off, (d) the exact parameter values the read models are instantiated with (so query-scope == documented-scope provably). Bake into contract BEFORE the PR lands so Rajesh has a concrete expected-set to verify.
  - **Design note (not a defect):** is_active (liveness: resighted/operational) and archived_at (out-of-scope) are ORTHOGONAL by design — archive correctly did NOT flip is_active. Fix = read-path archived_at IS NULL filter (Step B), NOT a schema change. Rajesh raised as possible 'gap'; Jack pushed back — **RESOLVED 2026-07-08T17:17Z (Rajesh sig 753e99db2ced525a VALID): Rajesh concurs, withdrew ticket suggestion. NO separate Notion ticket; fold orthogonality note into Step B PR description.**

## Resume notes
- Prod: `ssh konnex-data` (204.168.198.203) → `sudo -u postgres psql -d market_intelligence` (peer auth). DB 31GB, / has 451G free.
- Recovery if archive wrong: (a) reversible `UPDATE entities SET archived_at=NULL;`; (b) PITR to `sp_phase2_pre_archive_20260708T165254Z`; (c) off-box dump.
- Local konnex-data-pipeline main was 7/7 diverged (superseded pre-squash) — preserved on `backup/local-main-presquash-20260708`. Non-blocking; read scripts via origin/main.
- market-intelligence spike WIP committed+pushed 697247d (wip/t6-ws1-market-pulse). Rajesh online, monitoring relaunch; two-person gate is his hard requirement.
