---
task_id: phase4-personal-claude-md-seed-sync-2026-07-12
agent: jack
session_id: 0abd78d6-c7fb-4773-b83c-cd965eab45eb
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-12T15:31:30Z
notion_task_id: (NOT CREATED — see Remaining)
context_needed:
  files:
    - /home/shared/specs/PHASE4-PERSONAL-CLAUDE-MD-SPEC.md
    - /home/jack/projects/ops/claude-md-push.js
    - /home/jack/projects/ops/claude-md-git-sync.js
    - /home/jack/projects/ops/hooks/post-merge
    - /home/jack/projects/ops/agent-claude-md/README.md
  branches: []
  collaborators: [rajesh, matt, grace]
---

## Done (this session)
- PR #102 (reaper timeout durable fix, pipeline-orchestrator) MERGED to origin/main squash 3d0b064 on Matt GO sig a81671ebb401727c (verified). queue.js now derives per-stage timeout via resolveTimeoutMinutes (?? not ||) instead of silent 360.
- Phase-4 SPEC written + all 4 Rajesh contract issues resolved: /home/shared/specs/PHASE4-PERSONAL-CLAUDE-MD-SPEC.md. Rajesh CONTRACT PASS + BUILD GO sig 6bc2f3114dbab236. Matt scope GO sig 29c0372f953f6fd4 (A+B).
- Corrected earlier Wave-1 "idle" error to Matt (briefing observability gap — jobs 2696/97/98 ARE running to cap 02:52Z).

## In Progress
- Phase-4 build: NOT STARTED (no code written). Have BUILD GO. Next action = implement per spec.

## Remaining
1. REAPER DEPLOY — BLOCKED, escalated to Matt, awaiting his A-vs-B decision. Verified drift NOT cleared: konnex-ops orchestrator tree on dev branch pipeline-resilience/dup-crawl-reap-pidlock, 4 commits AHEAD of main (unmerged dup-crawl resilience, Rajesh-approved contract + chaos), 10 BEHIND main, 6 files uncommitted local prod edits (orchestrator.js, lib/config.js, alerter.js, synthetic-monitor.js, 2 v2-pilot). Live orchestrator PID 2645025 runs from this dirty tree serving Wave-1. drift-check.service FAILED. queue.js itself CLEAN, fix applies conflict-free. Options: (A) Grace reconciles full drift then trivial pull+restart [Grace offline]; (B) surgical `git checkout origin/main -- lib/queue.js` + orchestrator restart in post-Wave-1 window ~02:52Z [PROD RESTART — Matt-gated, Rajesh CANNOT authorize]. NOT urgent (Wave-1 manually capped; fix only affects future enqueues). Do NOT force pull/checkout main (clobbers 4 commits + 6 uncommitted files). Do NOT restart orchestrator without Matt GO.
2. Phase-4 BUILD (A): add --personal mode to claude-md-push.js (per-agent source agent-claude-md/personal/<agent>.md -> /home/<agent>/CLAUDE.md home-root; generalize pushAll to per-agent sourcePath + explicit homeDir; per-agent error isolation; reuse existing safety/sudoFs). Extend claude-md-git-sync.js inbound for personal files reading AS-TARGET (sudo -n -u <agent> cat; carlos/grace homes are 750; loud skip on fail). Wire hooks/post-merge to also run --personal --all. Extend claude-md-push.test.js (node --test, temp dirs + injected fsFactory, NO real home/sudo/PID).
3. Phase-4 BUILD (B): archive+remove orphaned /home/shared/agent-base.md; fix agent-claude-md/README.md line 19 stale "future extraction" note + document personal-file coverage. Only ref is README:19 (grep-verified).
4. Pre-seed reconciliation (AC8 manual gate): dry-run must show only would-create (carlos/grace missing) + up-to-date (jack/olivia/rajesh/alex present); jack confirmed identical; capture any divergence live->repo in reviewed commit FIRST. NO clobber.
5. Create Phase-4 Notion ticket + session estimate 1-2. BLOCKED: .mcp.json GONE from /home/jack (only /home/olivia + /home/alex have one); no working Notion token confirmed (env NOTION_TOKEN in task-dispatcher/.env + konnex-status/.env, latter historically 401). Resolve token (try olivia/alex .mcp.json OPENAPI_MCP_HEADERS) before creating via POST /v1/pages to Sprint Boards DB 3132300f-2ecb-81f8-9081-c8d0cc30d0b6.
6. Then: PR footered FULL Phase-4 ticket UUID -> Rajesh QA -> Matt merge GO (fleet-wide, no self-merge). AC8 rollout via ops allowlist.

## Resume notes
- Rajesh STANDING RULE: loop him in BEFORE touching any agent's personal /home/<agent>/CLAUDE.md during deploy (per-agent review in spec). Ping when PR ready for QA.
- Wave-1 liveness: query pipeline_jobs directly, NOT daily-briefing (V2 observability gap shows false "0 running").
- Verified GOs this session (tmux-message-verify, full 16-char agent-bus sigs). Matt: 29c0372f (Phase-4 scope), a81671eb (PR#102 merge), 37e5ffb2 (deploy verify-then-do). Rajesh BUILD GO 6bc2f311.
- MID-WORK exit: do NOT agent-offline. Auto-relaunch resumes here.
