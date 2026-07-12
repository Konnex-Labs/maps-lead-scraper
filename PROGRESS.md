---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont14b-wave1-running
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-12T07:48:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /tmp/reverify-wave1-terminal.log (konnex-data detached monitor output, pid 1751256)
    - /home/jack/projects/pipeline-orchestrator/orchestrator.js (dispatch gate + exemption)
  branches:
    - fix/v2-reverify-keepset-guard (PR #101 MERGED b10bcade 06:01Z — guards on origin/main)
  collaborators: [matt, grace, rajesh, olivia]
---

## RELAUNCH cont14b (2026-07-12 ~06:10Z, online, mid-work, NO agent-offline). 9-TRADE REVERIFY EXECUTING under Matt Tier-3. Wave-1 RUNNING+healthy (re-verified: 2693/2694/2695 attempt 1/3, monitor pid 1751256 alive); PR #100 merged+deployed; PR #101 MERGED (b10bcade). Gate msg sent to Matt + Rajesh acked.

### AUTHORITY (still live)
- **Matt Tier-3 GO** (sig 1a7bc8c3ecd5dcea, 05:41Z, VALID): full authority to complete 9-trade AU website reverify, prioritise electrician/plumber/carpenter. LIFTS per-gate Matt approval (merge+deploy+paid passes+cost-cap all covered). RETAIN rails: two-person on paid passes (Grace fires + Rajesh co-witness), row-level keep-set guards, batched writes + VACUUM. Literal scope = the 9-trade reverify only.
- **Jack = PRIMARY decision-maker** (Matt sig a250db53aa2a58ed). Steer end-to-end.
- **[NEW 06:15Z] Wave-2 direct-GO blocker RESOLVED at source:** Matt sent DIRECT matt→grace GO (Grace's sig 923c8be53d6222b5 VALID) = Grace holds direct GO for the reverify REMAINDER, AND delegated Tier-3 GO authority to Jack (matt→jack sig 6794cac18a76b3c2 VALID). A direct jack→grace Tier-3 GO is now valid authorization. Grace scope read-back confirmed EXACT (reverify-only, NOT Phase-3 purge; cap 12/job; pre-flight+double-spend+report-before-fire). No more matt-per-wave GO needed.

### ✅ DONE (this arc, ground-truthed — do NOT redo)
- **Canary 2692 (au-painters) terminal 04:04Z:** 8,835 rows, cost $1.68, GUARDED (Grace audit = 0 out-of-scope touched). Full-pass projection ~$33-35. fetch_failed 46.6% (retryable).
- **WAVE 1 active-3 FIRED 05:51:52Z by Grace** (sig 944f1c58 VALID; DB-confirmed): jobs **2693 au-builders / 2694 au-plumbers / 2695 au-landscapers** RUNNING on guarded konnex-data worker (rev 6f55708). Scope = exactly **74,267** rows (builder 32,543 + plumber 22,953 + landscaper 18,771), ~$14. Two-person: Matt 76d749565be9b46d + Jack primary + Rajesh co-witness 0ef0c979. Idempotent NOT-EXISTS guard + 0 double-spend pre-checked. **DO NOT RE-FIRE.**
- **PR #100 (verification-only dispatch exemption) MERGED** (mergeCommit 88d3776, 05:56:57Z) **+ DEPLOYED to konnex-ops:** surgical `git checkout origin/main -- orchestrator.js` (exemption lines 533-540), backup /tmp/orchestrator.js.bak-pre100-*, node -c OK, `pipeline-orchestrator.service` restarted = active. orchestrator.js was CLEAN (no WIP disturbed). Approvals: Rajesh code-owner + Grace DE scope sign-off (b4c06a71) + Tier-3. **Wave-2 pilots UNBLOCKED.**
- **PR #101 (durability: R1+R2 keep-set guards 6f55708 → main) MERGED** (mergeCommit b10bcade, Rajesh code-owner approve 542101da, under Tier-3). Landmine CLOSED — origin/main now carries the guards. Ticket 39b2300f-2ecb-813a-8810-cbaedd3db316.
- **crawl-1/2 dev-branch flag = FALSE ALARM** (Rajesh: I'm the author of pipeline-resilience/dup-crawl-reap-pidlock; config.js UNCHANGED, crawl-1/2 NOT re-added; diff = alerter.js + REPO-MAP.md + 2 deploy scripts only). Retracted to Matt. No action.

### ▶ IN PROGRESS / MONITORING
- **Wave-1 async run:** detached monitor on konnex-data (**pid 1751256**, script /tmp/reverify-wave1-monitor.sh) polls every 5min, writes **/tmp/reverify-wave1-terminal.log** when all 3 jobs terminal (aggregate pipeline_events by type + cycle.complete cost/split). ETA ~14-15h from 05:51Z. ON RELAUNCH: `ssh konnex-data 'cat /tmp/reverify-wave1-terminal.log'`; if empty/absent, re-check `pipeline_jobs WHERE id IN (2693,2694,2695)` status + re-arm monitor if pid dead. At terminal: capture spend+results, report to Matt.
- **PR #101:** DONE — merged b10bcade 06:01Z (Rajesh approve 542101da), guards on origin/main.
- **Wave-1 TERMINAL NOTIFIER (self-driving post-step):** detached host-side `pgrep -f wave1-terminal-notifier.sh` (was pid 2664202, script /tmp/wave1-terminal-notifier.sh) polls konnex-data for `DONE` in the terminal log every 300s; at terminal it tmux-messages jack (summon: capture+report+signal Grace) + grace (stand-by, await Jack signal). Survives my session exits (nohup). ON RELAUNCH: if this pid is dead AND terminal log absent, re-launch it (or just re-check the log manually per below). Do NOT double-launch if already alive.

### ▶ HTTP-ONLY YIELD BLIND SPOT (Grace finding 06:49Z, VERIFIED by me)
- Live Wave-1: fetch_failed=3,044, of which **non-https=2,625 (86% of failures, ~39% of ALL processed rows)**; network-error only 250 (8%). own-fetcher rejects http:// URLs by policy → those rows NEVER verified. cost_aud=0 on them (fail BEFORE paid bd-fallback = no spend wasted). ~40% of the whole 9-trade reverify scope is this blind spot (Wave-1 ~29k/74k; Wave-2 electrician ~15k + carpenter ~11k).
- **No penalty to proceeding:** idempotent NOT-EXISTS guard → RE-SWEEP http-only rows AFTER a fetcher fix with ZERO double-spend / no re-verify of done rows. Waves proceed as planned.
- **Grace canary DONE (read-only, no-spend):** https-upgrade recovers **~78%** of http-only sites securely. **[CORRECTED 07:00Z — an earlier "+0.2% for raw-http" was WRONG (inferred from https-only redirect scheme, not a real raw-http probe).]** A DIRECT dual-probe (http AND https per URL, same 400 sample) shows raw-http reaches an ADDITIONAL **~7.2%** (~4,000 live sites across 5 trades) that https CANNOT (dead/absent TLS cert, port-80-only); combined **~85.5% alive, ~14.5% genuinely dead**. So handling raw-http is MATERIAL (~7%), not negligible. Population still: Wave-1 ~22,900 of ~29,400 recoverable via https alone, more with raw-http.
- **Matt NODDED the fix (06:54Z) + wants it IN before Wave-2.** Also confirmed sequential waves + expects Wave-1 backfill. Product intent: store+verify ALL sites regardless of scheme (clarified 06:57Z: NOT dropping non-https — we verify them via https).
- **OPEN — A/B to Matt (06:56Z, awaiting):** (A) https-upgrade probe ONLY [my rec + Grace #2], or (B) upgrade + guarded raw-http fallback for the last 0.2%. Build the shared CORE (option A) regardless; add B's guarded raw-http only if Matt picks B.
- **[MERGED+DEPLOYED 07:34Z] FETCHER FIX option-A = PR #8** — Rajesh QA PASS+APPROVED (5/5 ACs, review at 5809cc60), MERGED squash **09e71ef**, DEPLOYED to BOTH own-fetcher hosts (konnex-ops + konnex-data on main 09e71ef, services active, /health OK, fresh restart). Option-A LIVE. Grace signalled (precond cleared for Wave-1 http-only re-sweep, fires at Wave-1 terminal). https-upgrade core: http:// -> https:// attempted first (2xx=verified, reason=verified_via_https_upgrade); genuine https-unavailability = non-https-dead (cost-0, NO BD — worker routes only cf-challenge/http-403 to paid BD, v2-verification-worker.js:517). SSRF-guarded manual redirects (max 5): reject http-downgrade + private/loopback/link-local/CGNAT/metadata IPs; TLS verify on; connect 4s (undici Agent best-effort)/total 8s. Existing https path UNCHANGED (guard upgrade-only, flagged). Tests: 26 new deterministic (tests/https-upgrade.test.js, injected fetch+DNS) all green; full suite 33/34 (1 fail = PRE-EXISTING boundary whitelist test, fails on pristine origin/main too). IN RAJESH QA (contract-first). Branch protection needs Rajesh CODEOWNERS approval. ON RELAUNCH: check PR #8 state (gh pr view 8 -R Konnex-Labs/konnex-own-fetcher); if Rajesh approved -> merge -> DEPLOY (task below). Option B (raw-http) = HELD for Matt A/B pick (still open 07:20Z), NOT in PR #8; code structured for one-flag add.
- **DEPLOY option-A = ✅ DONE 07:34Z (I own):** own-fetcher NOT Layer-C. Both hosts brought to main 09e71ef + `sudo -n systemctl restart konnex-own-fetcher`; konnex-ops + konnex-data both active, /health OK. Grace signalled (sig 762b5393). Do NOT redo.
- **▶ OPTION B — SSRF-guarded raw-http fallback [MERGED 07:46Z = PR #9, squash 6478842f; DEPLOY+ENABLE QUEUED FOR WAVE-1 TERMINAL]:** authorized (matt→grace fe480b3b + my onboard sigs 25374428/7c381314, all Rajesh-verified). Rajesh QA PASS + code-owner APPROVED 07:45Z (PRR_kwDOSlg4b88AAAABFu2wRg): both hard prereqs met — (1) TOCTOU CLOSED = IP-pinned connect (resolve+validate once → connect to pinned IP literal in URL + Host header; no re-resolve gap; per-hop re-pin; https-redirect hands off to secure guard); (2) cost-0/no-BD invariant (raw dead/ssrf/redirect-fail → non-https-dead $0; only real cf-challenge/http-4xx keep BD reason). **Default OFF** via `OWN_FETCHER_RAW_HTTP_FALLBACK=1` (ships dark). Recovers +~7.2% (~4,000 dead-TLS/port-80-only). New reason `verified_via_raw_http`. Tests: 15 new deterministic green; full suite 48/49 (same pre-existing whitelist fail). **SEQUENCING DECISION (Jack, 07:48Z): B-ENABLED-FIRST single-pass re-sweep.** Both Grace (mild pref) + Rajesh concur; 12h buffer easily meets "QA+deploy land comfortably before terminal." DEPLOY+ENABLE DEFERRED TO WAVE-1 TERMINAL (~20:00Z) — NOT now — to keep running Wave-1 pure-A telemetry + incur exactly ONE own-fetcher restart at the clean Wave-1/re-sweep boundary. **ON WAVE-1 TERMINAL (my choreography):** capture Wave-1 results → report Matt → deploy PR #9 (both hosts: `git pull origin main` to 6478842f) + set `OWN_FETCHER_RAW_HTTP_FALLBACK=1` in service env + `sudo -n systemctl restart konnex-own-fetcher` + curl 127.0.0.1:3475/health both → SIGNAL Grace → she pre-flights single-pass A+B re-sweep (idempotent NOT-EXISTS guard, two-person: Grace fires + my ack, Rajesh co-witness) → fires. NOT a closing footer (epic stays open).
- **FETCHER FIX — build contract (Grace's spec, ACCEPTED; Jack owns the code) [DONE — see PR #8 above]:**
  * Repo `/home/jack/projects/konnex-own-fetcher`, file `src/fetch.js`, **gate at lines 56-63** (`if (!url.startsWith('https://')) return non-https`). Branch OFF origin/main.
  * Change: if scheme is `http://`, rewrite to `https://` and attempt FIRST; 2xx = verified (same semantics as existing https path, line 71+). Only fall through to reject/BD-fallback if the https attempt fails. Do NOT fetch raw http (unless Matt picks B).
  * Safety (Grace #3): TLS verify ON; max-redirs 5; connect-timeout 4s / total 8s; SSRF guard = reject redirect hops that downgrade to http OR resolve to private/link-local/loopback IPs. NOTE: existing https path uses `redirect:'follow'` (line 78) w/o per-hop guards — implement manual redirect handling for the guard, decide whether to apply to both paths or upgrade-only (flag in PR).
  * Telemetry (Grace #4): distinct result reason `verified_via_https_upgrade` vs `non-https-dead`.
  * Tests + PR footer full ticket UUID → Rajesh QA (contract-first, standing by) → **MANUAL** own-fetcher restart on the host(s) running the live v2_verification worker (own-fetcher NOT Layer-C; local tree at #7/0626d82). Target LIVE before Wave-1 terminal ~20:00Z.
  * Grace has sample artifacts (311/400) in /tmp on her host for spot-check; she offered a full spec doc.
- **Wave-1 backfill (Grace owns firing):** after fix live, re-sweep the ~29,400 Wave-1 http-only rows; idempotent NOT-EXISTS guard = ZERO double-spend. Her GO, two-person.

### ▶ REMAINING
1. Report Wave-1 spend+results to Matt at terminal (~20:00Z).
2. ~~Merge PR #101~~ DONE (b10bcade).
3. **Wave-2 (post Wave-1):** electrician_au 40,210 + carpenter_au 27,068 = 67,278 rows, cap 12/job (electrician FIRST), then **Wave-3** pest_control + hvac + handyman. Exemption deployed → inactive-industry dispatch works. **FIRING RULE (now UNBLOCKED — see AUTHORITY 06:15Z):** Grace holds direct GO + jack→grace Tier-3 GO valid. Flow: at Wave-1 terminal I SIGNAL Grace w/ results → Grace pre-flights (count/cost/guard + double-spend NOT-EXISTS) + reports numbers to me → I ack (two-person: Grace fires + my ack) → Grace fires under her GO, Rajesh co-witness. Sequencing = sequential waves (my call; Matt offered parallel option, awaiting if he wants speed over cost/observability).
4. **MUST-RESTORE after FULL reverify completes** (I own): (a) konnex-data `pipeline-deploy.timer` restart + return tree to correct rev — SAFE ONCE #101 merged (timer would deploy guarded main); (b) `V2V_CYCLE_COST_CAP_AUD` 12→500 + restart pipeline-agent (backup /home/jack/.env.reverify-bak-*).
5. Post-reverify: Matt-gated teardown of `phase3_restore_test` (6GB, only rollback net) — DO NOT drop until backfill verified + Matt OKs.
6. Item 4 (T6 uat→main d0aa4672) HELD for Matt's OWN direct GO to Olivia.
7. Matt directive 4c1c1dfd: reverify is the only allowed work today; stand team down when it COMPLETES.

### Resume notes
- MID-WORK context-exit: **NEVER agent-offline** (loop relaunches).
- Under Tier-3: execute to completion, NO per-gate Matt ping; report results+spend. I do NOT self-fire paid passes — Grace fires, I'm primary + co-witness (two-person on writes).
- Do NOT re-fire Wave-1 (2693/2694/2695 running). Do NOT re-merge #100 (88d3776). Do NOT re-open #100/#101 if already merged.
- Notion token = NOTION_TOKEN in /home/jack/projects/task-dispatcher/.env; create/patch pages via REST POST/PATCH /v1/pages Bearer (MCP not loaded).
