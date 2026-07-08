---
task_id: v2-phase-2-clean-cut-au-trades-scope-reduction
agent: jack
session_id: 2026-07-08T16Z-phase2-prod-exec
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-08T16:56:00Z
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

## In Progress
- **Two-person gate BEFORE archive COMMIT (MANDATORY).** Next actions gated on: (1) run dry-run to capture verify-gate NOTICE counts, (2) present dry counts + businesses-already-archived finding to BOTH Matt AND Rajesh, (3) Rajesh ACK numbers + Matt confirm, THEN commit. Rajesh hard req: "Do not COMMIT until I've seen and ACK'd those numbers." Archive is NOT committed; no open transaction.

## Remaining
- **H0 dry-run (from CORRECT dir!)**: `cd /home/jack/projects/konnex-data-pipeline` then `git show origin/main:scripts/one-off/tier3-phase2-archive.sql | sed 's/^COMMIT;/ROLLBACK;/' | ssh konnex-data "sudo -u postgres psql -d market_intelligence -v expected_biz_delete=3406379 -v expected_ent_delete=1661449 -v ON_ERROR_STOP=1 -f -"`. (Earlier attempt ran from wrong dir → empty file → NO-OP, prod untouched.)
- **H real archive**: same but ORIGINAL sql (COMMIT). Single tx, verify-before-commit gate self-aborts (0 rows) on any AC1/AC6/partition RAISE → escalate Matt, do NOT proceed.
- **I** Post-archive verify: AC-6 hash STILL == `23692c66…`; keep-set rows archived_at IS NULL both layers; ent_archived==1,661,449, biz_archived==3,406,379.
- **B** NOTE-3 read-path scoping (own cross-repo PR + Rajesh QA): add `AND archived_at IS NULL` to prod views/MVs (nsw_trades_stats, v_verified_active_silver, explorer_suburb_agg + pg_matviews/pg_views scan), konnex-data-api serving queries, pipeline stage filters. LIVE before Phase-1 go-live. Safe order: archive first (archived rows still served), then scope.
- **J** Notify Matt + hand Rajesh prod archive for QA (AC4-AC8). Begin ≥7-day cooling. Hard-purge (Phase 3, IRREVERSIBLE) = SEPARATE 3rd Matt GO after cooling. DFS NSW+3 pilot spend (~USD100-150) = separate spend GO.

## Resume notes
- Prod: `ssh konnex-data` (204.168.198.203) → `sudo -u postgres psql -d market_intelligence` (peer auth). DB 31GB, / has 451G free.
- Recovery if archive wrong: (a) reversible `UPDATE entities SET archived_at=NULL;`; (b) PITR to `sp_phase2_pre_archive_20260708T165254Z`; (c) off-box dump.
- Local konnex-data-pipeline main was 7/7 diverged (superseded pre-squash) — preserved on `backup/local-main-presquash-20260708`. Non-blocking; read scripts via origin/main.
- market-intelligence spike WIP committed+pushed 697247d (wip/t6-ws1-market-pulse). Rajesh online, monitoring relaunch; two-person gate is his hard requirement.
