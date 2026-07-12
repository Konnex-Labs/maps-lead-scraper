---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont14g
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-12T12:51:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/shared/specs/REAPER-TIMEOUT-HARDENING-SPEC.md (finalized, Rajesh CONTRACT PASS + Grace AC1/AC3 notes folded in)
  branches:
    - build reaper fix off konnex-pipeline-orchestrator origin/main (b10bcad)
  collaborators: [matt, grace, rajesh, olivia]
---

## RELAUNCH cont14g context-exit (2026-07-12 ~12:51Z, mid-work at 71%, NO agent-offline — corroborated by Rajesh 8e34c1a0480c53cd). AUTHORITATIVE CURRENT STATE. Clean breakpoint: nothing half-built. NOTE: /home/jack/PROGRESS.md (home dir) is exit-hook-clobbered/stale — THIS repo file + git log are authoritative.

### ✅ UUID-LINKAGE STREAM — FULLY DONE (do NOT re-do)
- **Part A:** konnex-dispatcher PR #32 MERGED squash **eba9de8d** 12:35:59Z, branch deleted. Under **Matt's merge GO 4689dd66835cd479** (matt->jack, verified). Rajesh APPROVED + CI green. Ticket 39b2300f-2ecb-81d5 auto-closes on lifecycle cycle. NOT a Grace GO.
- **Part B:** required check `uuid / PR body carries full ticket UUID` enrolled on ALL 6 repos (dispatcher, ops, api, connect, orchestrator, data-pipeline). Under **Matt's GO e483ac99f648d112**. Every strict repo's `restrictions` manually diffed = zero drift; enforce_admins/code_owner/review_count preserved. Backups in /tmp/bp-backups/. Rajesh confirmed clean. NOT a Grace GO.

### ✅ WAVE-1 TIMEOUT CAP — SETTLED (do NOT touch)
- Jobs 2696/2697/2698 running healthy (heartbeat fresh, started 11:51Z), **timeout_minutes=900 (15h)**, next safety-cap **~02:52Z**. Under **Matt's GO 80d302b615fa7175** (initial 600 bd2a1cd54cc6bcb5). Grace holds Wave-1 terminal (relaunched ~12:50Z, HOLDING for Jack's terminal signal); Rajesh holds continuous co-witness. All cap sigs matt->jack; Grace issued ZERO GOs this session.

### 🟡 REAPER TIMEOUT-RACE FIX — SPEC'd + CONTRACT-PASSED, BUILD NOT STARTED (next session #1)
- **Notion task: 39b2300f-2ecb-813c-867f-c92cac58d19d** (In Progress, owner Jack/reviewer Rajesh, session est 2-3). Spec: **/home/shared/specs/REAPER-TIMEOUT-HARDENING-SPEC.md** (final).
- **Auth:** Matt GO **0fa0de119debc8a1**. Rajesh **CONTRACT PASS 2e3dc08061184e8e**. Grace lane-endorsed **c6835dd46c7777d3**.
- REFRAMED root cause (ground-truthed): v2_verification stage config ALREADY `pipeline_stages.default_timeout_minutes=1440`; crawl=480. The 360 came from `lib/queue.js:15` hardcoded default via a stageConfig-bypassing enqueue path (Grace hypothesis: out-of-repo reverify runner) + retry propagation (`orchestrator.js:88`). NOT a reaper bug — Matt's hard cap STAYS.
- FIX (enqueue/default layer, 5 ACs): enqueueJob derives per-stage timeout from pipeline_stages when omitted — **use `??`/explicit-undefined, NOT `||`** (Grace: `||` also swallows timeoutMinutes=0). Retry re-derives (AC3: manual per-job overrides don't survive retry — 1440>900 harmless; `max(override,stageConfig)`=future). AC4 loud `job.timeout_defaulted` WARN. AC5 reaper unchanged; `tests/reap-timeout.test.js` green.
- Prod enqueue sites: state-machine.js:108/173/200 (use stage config OK) + orchestrator.js:80 (retry). No reverify dispatch script in repo.
- BUILD PLAN: branch off origin/main (b10bcad) — NOT the dirty local `pipeline-resilience/dup-crawl-reap-pidlock` tree; node --test; PR footered full UUID 39b2300f-2ecb-813c -> Rajesh QA -> **merge GO to MATT** (Grace reviewer-gated on probation, NOT hers).

### 🟠 konnex-ops dev-branch drift — GRACE OWNS (do NOT touch)
- konnex-ops runs pipeline-orchestrator on DEV branch pipeline-resilience/dup-crawl-reap-pidlock w/ uncommitted changes since ~Jun-25; Layer-C auto-deploy stuck off-main. Grace (lane owner) owns READ-ONLY investigation + safe reconcile (preserving WIP); any prod-tree touch comes back to Jack for GO. COUPLING: reaper fix DEPLOY to konnex-ops waits on her reconcile (code PR/merge does NOT). I will NOT reconcile/reset/overwrite that prod tree.

### ⚪ Also queued (lower): Agent Spec doc refresh (ticket 37e2300f-2ecb-81cf, GO cf4c3933); Item 4 T6 uat->main (HELD, Matt's own direct GO to Olivia).

## Resume notes
- MID-WORK context-exit: NEVER run agent-offline (loop must relaunch).
- UUID stream DONE — do NOT re-merge/re-enroll. Cap SETTLED 900 — do NOT bump. Reaper Notion task EXISTS (39b2300f-2ecb-813c) — do NOT re-create; build unblocked, start it.
- LABEL HYGIENE: all GOs this session matt->jack; Grace issued ZERO. In group-fanned team-chat-send name "Matt's GO <sig>" explicitly — NEVER bare "your" (fanout self-attributes; Grace flagged repeatedly).
- nucleus-sync-state.json = auto-gen, leave uncommitted (Rajesh note).
