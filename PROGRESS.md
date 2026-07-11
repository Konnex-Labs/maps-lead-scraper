---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont7-reverify-hold
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-11T23:50:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /tmp/po-guard (my worktree off origin/main; branch fix/v2-reverify-keepset-guard)
    - v2-pilot/lib/v2-verification-worker.js (in repo konnex-pipeline-orchestrator — the reverify worker)
  branches:
    - fix/v2-reverify-keepset-guard @ 6f55708 (R1 75da768 PASS + R2 6f55708 awaiting QA)
    - build/tier3-dedup-runner (Grace)
  collaborators: [matt, grace, rajesh, olivia]
---

## RELAUNCH cont7 (23:40Z): CANARY SUBSTRATE DEPLOYED. Two-person canary GO issued (Grace 83f7a98c2fb1cc00 + Rajesh 6a4777a4149c48bd, both VALID). I completed the host deploy; Grace now executing the capped handyman canary. I emit NO GO. DO NOT agent-offline (mid-work).

### DEPLOY DONE (konnex-data /home/jack/projects/pipeline-orchestrator):
- on-host rev == **6f55708c2e7e** (detached checkout; was main/7df0073 = ROLLBACK ANCHOR). Keep-set guard present in deployed worker. pipeline-agent restarted (active). own-fetcher #7 (0626d82) /health ok:true.
- Deploy transport: git bundle /tmp/reverify-guard.bundle (tag canary-reverify-6f55708) from my worktree /tmp/po-guard -> fetched on konnex-data (its origin is a LOCAL bare mirror, lacks my branch, so bundle not GitHub).
- **!! MUST-RESTORE: I STOPPED konnex-data `pipeline-deploy.timer`** (Layer-C) to hold the detached guarded tree — else it reverts to main/7df0073 within 5min. **Auto-deploy on konnex-data is SUSPENDED. I own restoring it (`sudo systemctl start pipeline-deploy.timer`) after the canary/live decision + returning tree to the right rev.**
- HOST-AFFINITY VERIFIED (ops anomaly is NOT a canary risk): getTargetServers('v2_verification') -> ['data'] only (lib/stage-executors.js:166). konnex-ops agent claims target_server='ops' -> can NEVER claim reverify. Deterministic guarded run on konnex-data.

### INVOCATION CONTRACT (answered to Grace):
- Worker REQUIRED_ENV = PIPELINE_JOB_ID + MARKET_INTEL_DB_URI + V2V_CYCLE_COST_CAP_AUD (fail-fast) + --industry (fail 2). Canary-safe path = orchestrator dispatch (enqueueJob stage=v2_verification target_server='data' industry=handyman) -> real PIPELINE_JOB_ID from pipeline_jobs row (honors "no manual launches"). NO --limit arg (parseArgs = --industry,--workers); row bound = industry size (handyman ~4,707), spend bound = V2V_CYCLE_COST_CAP_AUD (set LOW for canary).

### CONTEXT-EXIT cont7 @ ~70% (23:50Z, mid-work, NO agent-offline). Canary substrate + cap fully staged; Grace unblocked to dispatch. Two-person GO holds; nothing fires while I cycle.

### !!! TWO MUST-RESTORE ITEMS I OWN (konnex-data) — restore after canary/live decision:
1. **`pipeline-deploy.timer` STOPPED** (Layer-C auto-deploy suspended) — restore: `ssh konnex-data 'sudo systemctl start pipeline-deploy.timer'` AND return tree to correct rev (currently detached 6f55708; rollback anchor = 7df0073/main).
2. **`V2V_CYCLE_COST_CAP_AUD` = 2.00** (was 500) in konnex-data /home/jack/.env line 15 — restore to 500 (backup: /home/jack/.env.canary-bak-1783813661) + restart pipeline-agent.

### CAP BIND DONE (Grace's pre-dispatch blocker cleared): cap inherited from agent process env (EnvironmentFile=/home/jack/.env), NOT per-job. Set 500->2.00, pipeline-agent restarted active. Runtime proof at dispatch = worker's first log line 'cycle_cost_cap_aud: 2'; worker fails-closed if var absent.

### ENQUEUE PATH (given to Grace): cli.js 'start' = WRONG (full pipeline). Single-stage canary = `node -e "require('./lib/queue').enqueueJob({industryId:'<handyman V1 industry_id>', stage:'v2_verification', targetServer:'data', workerCount:1})"` from guarded tree on konnex-data. INDUSTRY BRIDGE: pass V1 pipeline_industries.industry_id; v2_verification stage-executor (stage-executors.js:97-109) auto-bridges to dbIndustry=industry.config.industry (V2 businesses.industry form) at spawn. Canary spec (Grace, per Rajesh delegation): handyman, workers=1, target=data, cap 2.00.

### RESUME ACTIONS (on relaunch):
1. Check bus for Grace's dispatch confirmation / canary result. If Grace couldn't enqueue from her box, RUN her exact enqueue line on-host (konnex-data guarded tree) under two-person (Grace+Rajesh present) — I execute the dispatch, I emit no GO.
2. When canary runs: confirm worker logs cycle_cost_cap_aud:2 (spend guard), watch flip numbers + cost; Grace reports numbers to Matt.
3. Matt full-pass GO direct to Grace -> live 175,982 fetch-driven pass under Jack+Rajesh two-person (batched, cost cap raised to live value — coordinate with Matt on the live cap; do NOT leave it at 2.00 for the full pass).
4. Post-canary/live: execute BOTH MUST-RESTORE items above. Then Matt-gated teardown of phase3_restore_test (6GB rollback net) — do NOT drop until backfill verified + Matt OKs.
5. Bundle artifacts: /tmp/reverify-guard.bundle + tag canary-reverify-6f55708 (konnex-ops + konnex-data /tmp).

### HOLDING FOR: Grace's dispatch -> canary numbers -> she reports to Matt -> Matt full-pass GO direct to Grace -> live pass under two-person. I provide infra + two-person + post-verify only; I emit NO GO.

## Done (this arc, ground-truthed — do NOT redo)

- **Phase-3 AU-trades purge DONE + VERIFIED.** prod market_intelligence: businesses=387,024 = keep-set (archived_at NULL), archived=0, ~3.4M hard-deleted. Exactly 9 active industries, all AU trades (electrician 52,649 / builder 41,269 / carpenter 32,651 / plumber 26,843 / landscaper 18,771 / pest_control 16,352 / painter 8,835 / hvac 7,298 / handyman 4,707).
- **Item-5 ops-deploy COMPLETE** (prior session): own-fetcher #7 (0626d82) live both hosts; verification-worker #98 (7df0073) live on konnex-data. Do NOT re-restart.
- **Matt backfill START-GO** — sig **ad0e4060f25b0798**, matt->grace, 23:03:44Z, VALID (Grace + Rajesh both tmux-verified; the Telegram GO is on the agent bus with a valid HMAC, so tmux-verify DOES cover it).
- **Scope = 175,982** (Matt's signed number). 4-guard = archived_at NULL + is_active + merged_into IS NULL + website_url NOT NULL. My earlier 175,984 dropped merged_into; the +2 were 2 merged-loser rows, NOT drift.
- **Semantics: fetch-driven, NOT a SQL flag-flip** (own-fetcher #7 -> callOwnFetcher/callBdFallback -> urlNormalisedEqual -> mergePerField, per-row website_verified from actual fetch).
- **R1 keep-set guard PUSHED** = commit **75da768** — added archived_at IS NULL / is_active / merged_into IS NULL to BOTH SELECTs (count L1104, batch-claim L1178). Validated read-only on prod = 175,982 exact; merged_into removes exactly the 2 losers; node -c clean. **Rajesh QA PASS** (AC1-AC5).
- **R2 write-side guards PUSHED** = commit **6f55708** (on top of R1) — same 3 guards on all 3 UPDATE WHEREs: failure-CTE (L858), resetVerificationFailureCount (L918), applyRecordUpdate (L968). No-ops any write if a row leaves keep-set mid-cycle; failure-CTE safe via existing row-null guard; node -c clean. Grace approved folding it in. **Rajesh QA PASS (R2 AC1-AC5). FULL BRANCH VERDICT R1+R2 = PASS — ready for two-person canary GO once Grace independently verifies.**
- **Resolved benign critical alert** 673b3a92 (synthetic overview.missing_industries, 300+x): overview's 9 industries = the 9 AU trades post-purge; the check's "120" baseline is stale. Not a fault.

## In Progress / Remaining (RESUME HERE)

1. **Branch access for Grace:** the branch is on repo **Konnex-Labs/konnex-pipeline-orchestrator** (NOT konnex-data-pipeline/market-intelligence — that's where Grace was looking). @ 6f55708. I offered: (a) she fetches from that GitHub repo if she has org read; (b) I paste the full diff if she just needs to read-verify; (c) I deploy the branch to her named canary host (pipeline-agent's pipeline-orchestrator tree) under Rajesh's two-person canary GO. **Awaiting Grace: canary host + whether she has read access.**
2. **Terminology clash resolved (awaiting Grace confirm):** Grace's "R2" = PER-INDUSTRY ITERATION = a DISPATCH concern (worker already takes industry=$1; canary driver iterates the 9 keep-set industries) = HERS, not in the patch. Rajesh's "R2" = UPDATE-path guards = DONE (6f55708). Confirm alignment on relaunch.
3. **Rajesh QA of R2 delta (6f55708) = PASS; full branch PASS.** Only gate left before canary = Grace's INDEPENDENT code verify (needs branch access, item 1) + her canary orchestration -> then Rajesh's two-person **canary GO**.

**MATT DIRECTIVE (sig 4c1c1dfdc1cc3731, 23:22Z):** the website reverify is the ONLY allowed work for the team today. Once it's COMPLETE, **stand the team down** (agent-offline all) — Matt will then discuss the next focus. So: no picking up other tickets; after reverify completes + verifies, run team stand-down. (Item 4 T6 stays HELD regardless.)
4. **Gate flow (LOCKED, Rajesh+Grace concur):** canary numbers -> **MATT** -> Matt gives full-pass GO direct to Grace -> live 175,982 fetch-driven pass under Jack+Rajesh two-person. **I emit READY/status ONLY — never the GO.** My in-flight merge authority does NOT extend to this reverify paid pass.
5. **Run hygiene:** batched commits + VACUUM, no mega-txn (:3460 note).
6. **Post-reverify:** verify results, THEN Matt-gated teardown of `phase3_restore_test` (6GB, 3.79M-row pre-purge rollback net — the ONLY rollback net; archive empty). DO NOT DROP until backfill verified + Matt OKs. Temp pg_hba cleanup deferred with it.
7. **Ticket hygiene (needs Notion; MCP not loaded — use REST):** (a) stage-2 website-verify wiring ticket [#4]; (b) re-baseline synthetic overview.missing_industries (120 -> 9); (c) 3 PR-audit exceptions from Rajesh 15:07Z [#5].
8. **Item 4 (T6 uat->main d0aa4672)** HELD for Matt's OWN direct GO to Olivia (frontend freeze). Olivia stood down; tooltip-clamp at her discretion.
9. **Anomaly (non-blocking, flag Matt):** local pipeline-orchestrator tree on dev branch `pipeline-resilience/dup-crawl-reap-pidlock`; konnex-ops po service may run dev code + Layer-C stuck. Investigate before switching (may be intentional WIP).

## Resume notes

- MID-WORK context-exit: NEVER agent-offline (loop relaunches).
- I emit NO backfill GO — Matt->Grace direct after canary. I provide READY/verification + two-person only.
- Do NOT re-restart own-fetcher #7 / worker #98. Do NOT drop phase3_restore_test.
- Branch fix/v2-reverify-keepset-guard @ 6f55708 = R1 (PASS) + R2 (awaiting QA). Worktree /tmp/po-guard. NOT merged.
- Next inbound to expect: Grace's canary host + read-access answer + per-industry-iteration confirm; Rajesh's R2 QA verdict + canary GO.
