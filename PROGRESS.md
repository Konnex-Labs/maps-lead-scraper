---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-af45fa9f-cont
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-10T23:45:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/jack/projects/pipeline-orchestrator/v2-pilot/lib/own-fetcher-caller.js
    - /home/jack/projects/pipeline-orchestrator/lib/stage-executors.js
  branches: []
  collaborators: [matt, grace, rajesh, olivia]
---

## Done (this session, ground-truthed)

### Both relaunch merges were ALREADY merged (verified via gh, did NOT re-open)
- PR #31 (konnex-dispatcher flow-violation dedup) = MERGED. No deploy-on-merge (only CI + UUID checks). Ticket auto-closed.
- PR #67 (konnex-data-pipeline sp3 mig026) = MERGED squash 9a94fd3b. Rajesh Gate-1 PASS.

### Matt GO (Telegram 2026-07-10T23:33:55Z, sig 65a1a5e7b5d9f506, matt->jack, VALID — independently verified by Rajesh + Grace): "GO on all except 4"
- GO on items 1,2,3,5. Item 4 (T6 uat->main) HELD in uat until Matt's own green light.

### mig024 + mig026 APPLIED + VERIFIED on prod market_intelligence (konnex-data / 204.168.198.203)
- mig024 (applied AS market_intel via MARKET_INTEL_DB_URI): vw_au_trades_keep = 387,024 keep-rows (exact SSOT match), businesses_purge_archive created EMPTY (0 rows), DO 0-drift invariant PASSED. Nothing deleted.
- mig026 (applied AS postgres superuser via `ssh konnex-data 'sudo -n -u postgres psql market_intelligence'` — REQUIRED because sp3_entity_key_map + entities are postgres-owned; market_intel lacks SELECT): sp3_business_entity_resolve, owner=postgres, GRANT SELECT to market_intel. market_intel reads 2,199,674 resolvable rows. Entity gap CLOSED (was ~1.856M seed-only).
- Applied from origin/main via `git show origin/main:migrations/NNN...sql`. Both idempotent + transactional.

### Item 3 (Grace Tier-3 dedup EXECUTION = the 3.7M-row purge) — DEFERRED by Grace to her fresh window
- All preconditions cleared (migs applied, Rajesh two-person present). Grace stood down near her context ceiling (won't start long irreversible op mid-window). Her verified §12 GO + Rajesh two-person state CARRY OVER — NO re-ask from me. Grace state @ commit f00e304 on build/tier3-dedup-runner. NOTHING destructive ran. She relaunches -> re-verify -> dry-run -> Rajesh confirm -> live pass. NOT my action.

## In Progress

### Item 5 — A' ops-deploy (own-fetcher #7 + pipeline-orchestrator #98). STATE = INVESTIGATION DONE, NO RESTARTS YET (clean, nothing partial/half-deployed).
RELAUNCH: complete the deploy. Findings:
- own-fetcher-caller.js: worker POSTs to `http://127.0.0.1:3475/fetch` (OWN_FETCHER_URL) = the LOCAL own-fetcher on whichever host the worker runs. own-fetcher is NOT Layer-C auto-deployed (drift-check covers only market-intelligence + pipeline-orchestrator) -> MANUAL restart/pull needed.
- v2-verification-worker = a STAGE-EXECUTOR command (lib/stage-executors.js:111 -> 'v2-pilot/lib/v2-verification-worker.js'), spawned on-demand by pipeline-agent from the agent's working tree. No long-running proc (idle; queues empty).
- po #98: konnex-data pipeline-agent = 7df0073 (#98) on main, restarted 2026-07-10 15:47 via Layer-C -> #98 DEPLOYED on konnex-data. So verification-worker code (#98) is live on konnex-data.
- own-fetcher instances (BOTH stale for the #7 fix):
  * konnex-ops (localhost): working tree AT #7 (0626d82) but konnex-own-fetcher.service running since Jun-9 = OLD code in memory. FIX: `sudo systemctl restart konnex-own-fetcher` then curl 127.0.0.1:3475/health.
  * konnex-data: own-fetcher HEAD = 0dcf91b (STALE, pre-#7, "remove domain whitelist gate"), service restarted Jun-10. FIX: `ssh konnex-data 'cd ~/projects/konnex-own-fetcher && git pull origin main && sudo systemctl restart konnex-own-fetcher'` then health-check.
- OPEN Q (resolve on relaunch): which host runs the LIVE v2_verification stage worker? BOTH konnex-ops + konnex-data have pipeline-agent.service active. SAFEST: bring BOTH own-fetcher instances to #7 (above) so whichever host runs the worker calls #7 code. Confirm each /health OK after.
- ANOMALY (SEPARATE issue, do NOT conflate with A'): konnex-ops po working tree is on DEV branch pipeline-resilience/dup-crawl-reap-pidlock (HEAD 20dcaf7), NOT main; pipeline-orchestrator.service (konnex-ops) running since Jun-25 on that dev code; Layer-C likely stuck (tree off main). Investigate WHY before switching (may be intentional WIP resilience deploy) — flag to Matt, don't blind-fix.

## Remaining
1. FINISH item 5: restart konnex-ops own-fetcher (#7 already in tree) + pull+restart konnex-data own-fetcher to #7. Health-check both (127.0.0.1:3475/health). Confirm po #98 live on konnex-data (done).
2. THEN emit 'new-parser-live in ops' to Grace (precond for her item-5 readiness check).
3. STOP. Item-5 backfill WRITE (UPDATE businesses.website_verified, 3.7M table) = Matt's SEPARATE 2nd GO AFTER Grace readiness check. NOT covered by the §12 GO. Batch the write + VACUUM (memory: bulk single-txn on businesses trips :3460 synthetic-check).
4. Item 4 (T6 uat->main d0aa4672) still HELD for Matt's OWN direct GO to Olivia.
5. Flag konnex-ops orchestrator dev-branch drift anomaly to Matt (hygiene, non-blocking).

## Resume notes
- MID-WORK context-exit: NEVER run agent-offline (loop must relaunch).
- Nothing in item 5 is half-done — safe to just execute the restarts on relaunch.
- Do NOT re-apply mig024/mig026 (both live + verified). Do NOT re-open PR #31/#67 (merged).
- Grace item-3 purge + item-5 readiness check are HERS in her fresh window; GO carries over.
