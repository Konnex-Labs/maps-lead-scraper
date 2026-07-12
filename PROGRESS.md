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

## RELAUNCH cont8b (2026-07-12 00:18Z): CANARY 2692 LIVE + HEALTHY, MONITORING TO TERMINAL. I emit NO GO. DO NOT agent-offline (mid-work).

### !!! CANARY 2692 (au-painters/painter_au, 8,835 keep-set) is RUNNING + HEALTHY — DO NOT RE-FIRE, DO NOT PANIC ON records_processed=0.
- **records_processed is ALWAYS 0 for V2 jobs** (Rajesh QA flag 125246831153e55c VALID) — it is NEVER incremented for v2_verification. A relaunch that reads records_processed=0 must NOT conclude "stalled" and must NOT re-enqueue.
- **REAL progress signal = pipeline_events (job_id=2692) + businesses.website_verified flips.** As of 00:18Z: 546 v2.verification.record + 5 batch.complete events, latest event seconds-fresh, worker pid alive + heartbeating, own-fetcher /health ok. Throughput ~42 rows/min -> ETA ~3.5h (~03:30Z).
- **WATCH ITEM for the report:** 57 v2.verification.extraction.llm_failed events (vs 72 fetch_ok_no_changes) — quantify final llm-failure rate + own-fetcher-vs-BD cost split in the numbers to Grace.
- **Watchers:** tool-tracked bjqsrfy4s (blocks until job status!=running, then dumps) + detached nohup -> /tmp/canary-2692-watch.log. On relaunch, re-establish a terminal watcher if neither survived; trigger = pipeline_jobs.status != 'running'.
- **TERMINAL CAPTURE (my next action at completion):** query pipeline_events aggregate by event_type for job 2692 + count(website_verified IS TRUE) flips for painter_au + cost -> relay to Grace (+ alert Rajesh to witness FIRST). Grace reports numbers to Matt. I emit NO GO.
- Job 2691 (au-handyman) auto-cancelled pre-claim, $0 (is_active=f dispatch gate).

### ‼️ PHASE-B DEDUP TOKEN GUARD (do NOT blindly deliver on relaunch) — SEPARATE from the reverify task.
- Rajesh (35595b3c) asked me to securely deliver **TIER3_MATT_GO_TOKEN** to Grace to unblock **Phase B = 415-business dedup MERGE** (destructive, irreversible prod write; db-guard.js assertWriteAllowed() blocks until token in env). Rajesh then DEFERRED it (930d53a3): "no action needed yet — Grace brings canary terminal numbers first." So I deliver NOTHING now.
- **BLOCKERS before ANY token delivery:** (a) Matt's standing directive today (sig 4c1c1dfd, 23:22Z) = "website reverify is the ONLY allowed work today, then stand the team down" — firing Phase-B dedup CONFLICTS with it. (b) I did NOT find an explicit Matt message issuing the token or a direct fire-GO for Phase-B in agent-messages.jsonl (only Rajesh's assertion of the chain: Jack GO 52177e00, Matt delegation 528cb6ff, routing c0da17a8, Rajesh two-person 468a57f5/f0aaa34d). (c) unconfirmed whether I even HOLD the token / its provenance. → Require GROUND-TRUTHED direct Matt fire-GO CONTENT (not sig-chain) + reconciliation with the reverify-only directive BEFORE releasing anything. Do not release a destructive-op token on an assembled sig-chain alone.
- Memory project_matt_grant_inflight_go_merge_authority claims 528cb6ff "extended to Phase-B, Jack fires it" — treat as UNVERIFIED for a destructive fire; my in-flight/merge authority does NOT auto-cover a destructive dedup merge under a conflicting same-day directive. Verify with Matt.

### GATE ATTRIBUTION (corrected to Grace+Rajesh this turn): reverify FULL-PASS paid GO = **MATT's, DIRECT to Grace** — NOT Jack's. My in-flight/merge authority does NOT extend to the reverify paid pass. I provide READY + firm canary numbers + Jack+Rajesh two-person only. Peers drifted to "your [Jack's] direct GO" — corrected.

### FULL 9-TRADE REVERIFY — decisions locked this turn (Matt confirmed scope = ALL 9 incl 5 inactive; sig 46f65d79 [Telegram], not locally verifiable -> Matt still owns final full-pass GO direct to Grace):
- **MECHANISM = verification-only dispatch-gate exemption (eng-agreed: Grace ae620ed7 + me).** Scoped patch to orchestrator.js:~533 auto-cancel gate: exempt stage=v2_verification so inactive-INDUSTRY (pipeline_industries.is_active=f) jobs aren't cancelled pre-claim. NO global is_active flip (would wake full crawl/enrichment = blast radius). I OWN this; it goes PR -> Rajesh QA -> Matt gate, NO hot-edit of prod orchestrator (konnex-ops). NOT yet built (awaiting Matt mechanism-confirm; won't build speculatively).
- **KEEP-SET GUARD CONSTRAINT (Grace, must state in PR):** exemption touches ONLY the dispatch gate. Worker per-industry SELECT keeps R1 §2 guards (archived_at IS NULL + businesses.is_active + merged_into IS NULL + website_url IS NOT NULL). Two is_active layers differ: dispatch gate = pipeline_industries.is_active (INDUSTRY, exempting); R1 guard = businesses.is_active (ROW, preserved). Inactive-INDUSTRY reverify never touches Phase-3 delete-set.
- **COST-CAP SEMANTICS (VERIFIED in worker code):** V2V_CYCLE_COST_CAP_AUD is PER-CYCLE = PER-INDUSTRY-JOB. shouldHaltOnCap (worker:187) halts when cumulative cost WITHIN one --industry run >= cap; accumulates across batches of ONE industry only. One job=one industry. 9-trade pass = 9 jobs, each independently capped -> single env cap does NOT bound total (worst case ~9x). HARD-TOTAL-CEILING options given to Grace: A (lean) external aggregate stop in dispatch driver, no worker change; B per-job cap override in worker (re-touches guarded worker). Grace picks w/ Rajesh+Matt.
- **COST PROJECTIONS (from 2692 batch.complete):** ~$0.02/100 rows. painter ~$1.77 (near $2 cap), 5 inactive (~92,880) ~$19, full 9-trade ~$35 (TOTALS, not the enforced cap). Live cap must be resized from real per-site cost at canary terminal; do NOT leave at 2.00.
- Grace context-exited 00:24Z (task dedup-remediation-nsw-trades-v1); my options + firm numbers wait for her relaunch. I hold canary to terminal.

### PRIOR cont8 note (dispatch history, reference only): handyman BLOCKED (is_active gate) -> switched to au-painters under two-person GO (Grace 236f231a + Rajesh 38915f9f VALID). Substrate intact (rev 6f55708, timer stopped, cap 2.00).

### CANARY BLOCKER (root-caused, ZERO spend):
- I enqueued job **2691** (au-handyman v2_verification, cap 2.00, worker_count 1). Orchestrator AUTO-CANCELLED it pre-claim in 110ms via **orchestrator.js:533** — `if (!industry.is_active) cancelJob(job.id)`. pipeline_industries.**au-handyman is_active=f**. Zero workers, $0 spend, job terminal (cancelled). Gate is in orchestrator.js (runs on konnex-ops), NOT queue/agent — see memory reference-orchestrator-is-active-gate-cancels-jobs.
- **5 of 9 keep-set trades are is_active=f** in V1 registry: electrician_au/carpenter_au/pest_control_au/hvac_au/handyman_service_au. Active: builder/plumber/landscaper/painter.
- **CANARY FIX (Rajesh concurred 7076e990 VALID; Grace pending):** switch canary to smallest ACTIVE keep-set trade = **au-painters** (industryId=au-painters -> businesses.industry=painter_au, 8,835 keep-set, ALL with website_url, is_active=t). $2 cap still bounds spend. NO registry mutation. Two-person GO (Grace 83f7a98c + Rajesh 6a4777a4) EXTENDS to au-painters same terms per Rajesh. Option B (is_active flip) REJECTED for canary.
- **FULL-PASS BLOCKER escalated to Matt (decision gate):** the same gate blocks 5 of 9 industries (~113k rows) in the full 175,982 pass. Needs a plan BEFORE full pass: (a) bulk-reactivate 5 industries (prod change, two-person+Matt), (b) bypass orchestrator dispatch, or (c) Grace direct-DB outside orchestrator. NOT for me/Rajesh to decide — Matt's call. Canary validates worker+cost model regardless.

### !! CANARY IS LIVE — DO NOT RE-FIRE. Job **2692** (au-painters/painter_au) enqueued 00:04:52Z under two-person GO (Grace 236f231a + Rajesh 38915f9f, both VALID; standing canary GO 83f7a98c+6a4777a4). CAP GATE PASSED: first worker log line shows `cycle_cost_cap_aud:2` before rows; 8,835 eligible counted; running on konnex-data. Background watcher bpid2x98f waits for terminal status -> final records_processed/new + cost. On relaunch: read that watcher output / job 2692 status; if running, keep monitoring; if terminal, capture flip numbers + cost and relay to Grace (she reports to Matt). Then MUST-RESTORE (timer + cap 500). I emit no GO.

### RE-ENQUEUE LINE (ALREADY FIRED as 2692 — reference only):
`cd ~/projects/pipeline-orchestrator && set -a && . /home/jack/.env && set +a && node -e "require('./lib/queue').enqueueJob({industryId:'au-painters',stage:'v2_verification',targetServer:'data',workerCount:1}).then(j=>console.log('JOB',JSON.stringify(j)))"`
Then: confirm worker first log `cycle_cost_cap_aud: 2` (KILL if absent), relay job id + log line to Grace+Rajesh, monitor to completion, capture flip numbers+cost -> Grace reports to Matt.

## (prior) RELAUNCH cont7 (23:40Z): CANARY SUBSTRATE DEPLOYED. Two-person canary GO issued (Grace 83f7a98c2fb1cc00 + Rajesh 6a4777a4149c48bd, both VALID). I completed the host deploy. I emit NO GO. DO NOT agent-offline (mid-work).

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
