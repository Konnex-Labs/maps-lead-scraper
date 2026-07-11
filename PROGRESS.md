---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont6-reverify-start
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-11T23:15:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /tmp/po-guard (worktree off origin/main; branch fix/v2-reverify-keepset-guard)
    - v2-pilot/lib/v2-verification-worker.js (pipeline-orchestrator; the reverify worker)
  branches:
    - fix/v2-reverify-keepset-guard (pushed, awaits Grace verify + Rajesh QA)
    - build/tier3-dedup-runner (Grace)
  collaborators: [matt, grace, rajesh, olivia]
---

## Live state @ 23:15Z — reverify (item-5) STARTED under Matt's GO. R1 guard pushed; awaiting Grace verify + Rajesh QA -> canary -> Matt full-pass GO.

## Done (this arc, ground-truthed — do NOT redo)

- **Phase-3 AU-trades purge DONE + VERIFIED.** prod market_intelligence: businesses total=387,024 = keep-set (archived_at NULL), archived=0, ~3.4M hard-deleted. Exactly 9 distinct active industries, all AU trades (electrician 52,649 / builder 41,269 / carpenter 32,651 / plumber 26,843 / landscaper 18,771 / pest_control 16,352 / painter 8,835 / hvac 7,298 / handyman 4,707).
- **Item-5 A' ops-deploy COMPLETE** (prior session): own-fetcher #7 (0626d82) live both hosts; verification-worker #98 (7df0073) live on konnex-data. Do NOT re-restart.
- **Matt backfill START-GO received** — sig **ad0e4060f25b0798**, from=matt to=grace, 23:03:44Z, VALID (Grace + Rajesh both independently tmux-verified; the Telegram GO is on the agent bus with a valid HMAC, so tmux-verify DOES cover it here). Content: "delete job finished... bring jack and raj back online to now run the website reverify task with you [Grace]."
- **Scope CORRECTED to 175,982** (Matt's signed number). My earlier 175,984 dropped `merged_into IS NULL`; the +2 were 2 merged-loser rows (merged_into NOT NULL, is_active, have website_url) — NOT point-in-time drift. 4-guard = archived_at NULL + is_active + merged_into IS NULL + website_url NOT NULL.
- **Semantics locked: fetch-driven, NOT a SQL flag-flip.** Confirmed by reading the worker: own-fetcher #7 -> callOwnFetcher/callBdFallback -> urlNormalisedEqual -> mergePerField, sets website_verified PER-ROW from the actual fetch, with verification_failure_count + website_url archival. A blind UPDATE would mint false verified=true.
- **R1 keep-set guard PUSHED.** Branch `fix/v2-reverify-keepset-guard` (konnex-pipeline-orchestrator), off origin/main @ 7df0073 (#98 live). Added `archived_at IS NULL / is_active = true / merged_into IS NULL` to BOTH the eligible-count and batch-claim SELECTs in v2-pilot/lib/v2-verification-worker.js. Validated read-only on prod: guarded = 175,982 exact; merged_into guard removes exactly the 2 losers; node -c clean.
- **Resolved benign critical alert** 673b3a92 (synthetic overview.missing_industries, fired 300+x): overview correctly shows 9 industries = the 9 AU trades left post-purge; the check's "120 active in DB" baseline is stale pre-purge. Overview is correct. NOT a fault.

## In Progress / Remaining

1. **Grace verifies R1 branch + builds R2** (open Q asked: is R2 a WRITE-side guard in applyRecordUpdate? — awaiting her answer, will add if so). Rajesh QAs the patch.
2. **Gate-1 canary** (Grace, sampled from guarded keep-set) -> real cost numbers.
3. **Corrected gate flow (locked, Rajesh+Grace concur):** canary numbers -> **MATT** -> Matt gives the full-pass GO direct to Grace -> live 175,982 fetch-driven pass under Jack+Rajesh two-person. **I emit engineering READY/status ONLY — never the GO.** (Retracted my earlier e0b06d6b over-step.) My in-flight merge authority does NOT extend to this reverify paid pass.
4. **Run hygiene:** batched commits + VACUUM, no single mega-txn (:3460 synthetic-check note).
5. **Post-reverify:** verify results, THEN Matt-gated teardown of `phase3_restore_test` (6GB pre-purge rollback net, 3.79M rows — the ONLY rollback net; archive table empty). DO NOT DROP until backfill verified + Matt explicitly OKs. Temp pg_hba cleanup deferred with it.
6. **Ticket hygiene (needs Notion; MCP not loaded — use REST if actioning):** (a) stage-2 website-verify wiring ticket [#4]; (b) re-baseline synthetic overview.missing_industries (expected 120 -> post-purge 9 AU trades); (c) 3 PR-audit exceptions from Rajesh 15:07Z [#5].
7. **Item 4 (T6 uat->main d0aa4672)** HELD for Matt's OWN direct GO to Olivia (frontend freeze). Olivia stood down; tooltip-clamp at her discretion (UAT-only).
8. **Anomaly (non-blocking, flag to Matt):** local pipeline-orchestrator tree is on dev branch `pipeline-resilience/dup-crawl-reap-pidlock`, not main; konnex-ops po service may be running dev code + Layer-C stuck. Investigate WHY before switching (may be intentional WIP resilience deploy) — do not blind-fix.

## Resume notes

- MID-WORK context-exit: NEVER run agent-offline (loop must relaunch).
- I emit NO backfill GO — that's Matt->Grace direct after canary. I only provide READY/verification + two-person.
- Do NOT re-restart own-fetcher #7 / verification-worker #98 (deployed). Do NOT drop phase3_restore_test.
- R1 patch is on branch fix/v2-reverify-keepset-guard (NOT merged) — awaits Grace verify + Rajesh QA. Worktree at /tmp/po-guard.
