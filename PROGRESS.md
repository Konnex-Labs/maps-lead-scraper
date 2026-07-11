---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont5-phase3-monitor
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-11T14:10:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/grace/phase3_delete.log (on konnex-ops; Grace's loop log — READ, do not touch)
  branches:
    - build/tier3-dedup-runner (Grace; PROGRESS e42f553 has full loop state + DO-NOT-RE-FIRE)
  collaborators: [matt, grace, rajesh, olivia]
---

## CURRENT JOB (monitor-only — do NOT re-fire, do NOT count mid-run)

Phase-3 hard-purge DELETE is running DETACHED on prod under a fresh Matt Phase-3 GO (sig 8d0da96a, matt->grace). Grace owns it; Rajesh two-person present. My role (per Rajesh brief sig e3ac52c93b8059fa, 14:03Z): non-interfering watch for completion, then post-delete verify + cleanup + confirm Matt.

- Loop: /home/grace/phase3-delete-loop.sh **PID 2091232 on konnex-ops** (NOT konnex-data — DB is remote there). cum=1.4M deleted @14:04Z, ~25k/75s per chunk, delete-set ~3.4M, ETA ~15:45Z.
- Harness background watcher **br2ydp7wr** armed — notifies me on PID 2091232 exit. Do NOT poll it.
- ON COMPLETION (delete conn closed + VACUUM done):
  1. Verify prod market_intelligence (konnex-data, `ssh konnex-data 'sudo -n -u postgres psql market_intelligence'`): keep-set (archived_at IS NULL) == **387,024** exact SSOT + total row count.
  2. Confirm result to Matt via team-chat-send.
  3. Drop **phase3_restore_test** scratch DB + remove temp pg_hba entries.

## Done (this arc, ground-truthed — do NOT redo)

- **Item 5 A' ops-deploy COMPLETE.** own-fetcher #7 (0626d82) live BOTH hosts (konnex-ops + konnex-data), both /health ok. verification-worker #98 live both. new-parser-live emitted to Grace. **Do NOT re-restart.**
- **mig024 + mig026 live + verified** on prod market_intelligence. **Do NOT re-apply.**
- **PRs #31 + #67 merged.** **Do NOT re-open.**
- **Phase-B GO** already issued by me to Grace (sig 6cc4b8bedf0271bc) under Matt delegation (528cb6ff1e6eb021 + c2713f719cf4ead7); Rajesh verified. Scope = 415 same-entity merges; Phase-A complement stayed DISABLED until this gated Phase-3.
- **Tier-3 Phase-A ruling** delivered + team-aligned (contract §12, commit b9222eb). Matt GO'd direction (sig 45ea4b7c9d4da3e5).

## HELD (not my action / awaiting Matt)

- **Item-5 backfill WRITE** (UPDATE businesses.website_verified over Grace's 175,982 keep-set): scope=Grace's (175,982 = archived_at NULL + is_active + merged_into NULL + website_url NOT NULL). SPEND + START = Matt's DIRECT grace->GO (Grace probation-gated, won't self-start). Sequences AFTER Phase-3 delete completes + my verify (no concurrent businesses writes). Grace routing to Matt.
- **Item 4 (T6 uat->main d0aa4672)** held for Matt's OWN direct GO to Olivia (frontend freeze). Grace declined to lift.
- **konnex-ops orchestrator dev-branch drift** (pipeline-resilience/dup-crawl-reap-pidlock, not main; Layer-C likely stuck): flagged to Matt, awaiting a/b/c call. Do NOT blind-fix.

## Resume notes

- MID-WORK context-exit: NEVER run agent-offline.
- Injected resume body has been STALE twice this arc — ALWAYS ground-truth (git + live PID + agent-messages.jsonl) before acting.
- If watcher br2ydp7wr already fired / PID gone on relaunch: check /home/grace/phase3_delete.log tail + pg_stat_activity for open delete/vacuum before declaring done, then run the verify.
