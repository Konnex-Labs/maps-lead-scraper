---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-cont5-phase3-monitor
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-11T15:47:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/grace/phase3_delete.log (on konnex-ops; Grace's loop log — READ, do not touch)
  branches:
    - build/tier3-dedup-runner (Grace; PROGRESS e42f553 has full loop state + DO-NOT-RE-FIRE)
  collaborators: [matt, grace, rajesh, olivia]
---

## STATUS 15:42Z — PHASE-3 DONE + VERIFIED (PASS). Now HOLDING for Matt's backfill start-GO.

- Purge loop PID 2091232 EXITED 15:41:04Z (watcher bp4zzjtkf fired). VERIFY PASS on prod market_intelligence: businesses total=387,024 = EXACT SSOT; keep-set(archived_at NULL)=387,024; archived=0; no open delete/vacuum. ~3.4M hard-deleted.
- READY status posted to Matt+group 15:42Z. Backfill scope live = **175,984** (predicate archived_at NULL + is_active + website_url NOT NULL) — +2 vs Matt's signed 175,982 (point-in-time drift, flagged NOT amended, predicate self-scopes).
- **DO NOT DROP phase3_restore_test** — ground-truthed: it holds FULL pre-purge businesses copy (3,793,403 rows, 6GB) = the ONLY rollback net (archive table empty). My old completion step said drop it; that was WRONG. RETAIN until backfill verified + Matt explicitly OKs dropping the safety copy. Temp pg_hba cleanup deferred with it.
- NEXT: nothing to execute. Wait for Matt's direct start-GO to Grace + Rajesh two-person. I emit NO GO.

## (historical) CURRENT JOB (monitor-only — do NOT re-fire, do NOT count mid-run)

Phase-3 hard-purge DELETE is running DETACHED on prod under a fresh Matt Phase-3 GO (sig 8d0da96a, matt->grace). Grace owns it; Rajesh two-person present. My role (per Rajesh brief sig e3ac52c93b8059fa, 14:03Z): non-interfering watch for completion, then post-delete verify + cleanup + confirm Matt.

- Loop: /home/grace/phase3-delete-loop.sh **PID 2091232 on konnex-ops** (NOT konnex-data — DB is remote there). cum=1.4M deleted @14:04Z, ~25k/75s per chunk, delete-set ~3.4M, ETA ~15:45Z.
- Harness background watcher **bp4zzjtkf** armed (re-armed post-relaunch 15:12Z) — notifies me on PID 2091232 exit. Do NOT poll it. NOTE: use `[ -d /proc/2091232 ]` for liveness, NOT `kill -0` — the loop is grace-owned; `kill -0` on a cross-user PID returns EPERM → false "exited" (bit the first re-arm br-watcher).
- ON COMPLETION (delete conn closed + VACUUM done):
  1. Verify prod market_intelligence (konnex-data, `ssh konnex-data 'sudo -n -u postgres psql market_intelligence'`): keep-set (archived_at IS NULL) == **387,024** exact SSOT + total row count.
  2. Confirm result to Matt via team-chat-send.
  3. ~~Drop phase3_restore_test scratch DB + remove temp pg_hba entries.~~ **CANCELLED — it's the 6GB pre-purge rollback net (3.79M rows). DO NOT DROP until backfill verified + Matt OKs. See STATUS block above.**
  4. POST-WRAP HYGIENE (need Notion write; MCP not loaded this session): (a) file stage-2 website-verify wiring ticket [task #4]; (b) resolve 3 PR-audit exceptions from Rajesh 15:07Z [task #5] — konnex-ops PR#123 ticket 9634929c-...4bcf8e 404s (investigate/re-link/orphan); konnex-data-pipeline PR#61 (mv_trades_footprint) + PR#59 (sp4 mig020) have no ticket ref (create+Done if complete). Board otherwise CLEAN (49 Done). Ground-truth git+Notion (full UUID, squash-merge) before asserting.

## Done (this arc, ground-truthed — do NOT redo)

- **Item 5 A' ops-deploy COMPLETE.** own-fetcher #7 (0626d82) live BOTH hosts (konnex-ops + konnex-data), both /health ok. verification-worker #98 live both. new-parser-live emitted to Grace. **Do NOT re-restart.**
- **mig024 + mig026 live + verified** on prod market_intelligence. **Do NOT re-apply.**
- **PRs #31 + #67 merged.** **Do NOT re-open.**
- **Phase-B GO** already issued by me to Grace (sig 6cc4b8bedf0271bc) under Matt delegation (528cb6ff1e6eb021 + c2713f719cf4ead7); Rajesh verified. Scope = 415 same-entity merges; Phase-A complement stayed DISABLED until this gated Phase-3.
- **Tier-3 Phase-A ruling** delivered + team-aligned (contract §12, commit b9222eb). Matt GO'd direction (sig 45ea4b7c9d4da3e5).
- **SP-2 flow-violation review (ticket 3952300f-2ecb-8196) RESOLVED 15:34Z.** Verdict = APPROVED valid-DONE, violation is FALSE POSITIVE (Rajesh's cosmetic status-color normalization tripped the watcher; not a real transition). Ground-truthed PR #56 MERGED + QA PASS. Posted verdict COMMENT via Notion REST (env NOTION_TOKEN works this session, HTTP 200 — NOT 401 as old note claimed). Did NOT move to TODO (would reopen done work), did NOT touch status (collision w/ Rajesh's live normalization). See [[reference_bulk_status_normalization_trips_flow_watcher]] — expect a FLOOD of these false tickets from Rajesh's bulk cleanup.

## HELD (not my action / awaiting Matt)

- **Item-5 backfill WRITE** (UPDATE businesses.website_verified over 175,982 keep-set = archived_at NULL + is_active + website_url NOT NULL). **Matt GO'd 14:27Z (Telegram sig 27f1e97e2fb60bea, matt->jack): scope=175,982 CONFIRMED, FREE via own-fetcher (no paid spend), Grace owns.** STILL PENDING before start: (i) direct matt->grace start-GO to close Grace's probation gate (I asked Matt to send it to her); (ii) Phase-3 delete complete + my post-delete verify (no concurrent businesses writes). Grace at 65% ctx, restart imminent — will likely execute in a fresh window post-Phase-3. I ping Matt+Grace the moment verify passes. Do NOT self-run this (Grace's action, Rajesh two-person). **MATT AWAY sleeping from 15:24Z for a few hours (Telegram sig 7597145148a8a676); he will give Grace the DIRECT start-GO on his return IF backfill is READY.** So my job in his absence = get to READY (Phase-3 verify pass + scratch cleanup) and leave a clear 'BACKFILL READY/NOT' status ping. Authorizer sequence LOCKED w/ Rajesh (my sig 3bff88a58f19e500 + c65e03c31165854f): Step 4 = MATT direct-to-Grace ONLY; I emit NO start-GO (only a status ping); Rajesh = two-person presence. NAME Matt explicitly (not 'your') — team-chat fan-out self-attributes 'your' per-recipient (slipped twice this arc).
- **FORWARD DESIGN (Matt 14:27Z) — stage-2 website-verify after DFS Maps pull.** Consolidated eng+Grace recommendation relayed to Matt (awaiting his TTL call): do BOTH — verify new/changed each cycle + re-verify existing on last_verified_at STALENESS TTL (~30-60d, amortized oldest-first, NOT full weekly sweep); every pass scoped to keep-set guards (archived_at NULL + is_active + merged_into NULL + website_url NOT NULL) so delete-set is never touched; reuses worker's last_verified_at idempotency; own-fetcher free; mind UV_THREADPOOL_SIZE=32 under concurrency=10 + 0.7 canary. **TTL = 30d MAX** (Matt override 14:49Z sig 38527987f9199847; was Grace 45d — bake 30d as config default+ceiling, tunable downward only). Matt approved do-BOTH + explicitly asked to file the stage-wiring ticket. DEFERRED to post-Phase-3 wrap (task #4) — Notion MCP not loaded in this workspace session + env token 401s; told Matt honestly. SEPARATE from the one-off backfill. **Matt will send the direct matt->grace item-5 start-GO once I ping him+Grace on my post-delete verify-pass.**
- **Item 4 (T6 uat->main d0aa4672)** held for Matt's OWN direct GO to Olivia (frontend freeze). Grace declined to lift.
- **konnex-ops orchestrator dev-branch drift** (pipeline-resilience/dup-crawl-reap-pidlock, not main; Layer-C likely stuck): flagged to Matt, awaiting a/b/c call. Do NOT blind-fix.

## Resume notes

- MID-WORK context-exit: NEVER run agent-offline.
- Injected resume body has been STALE twice this arc — ALWAYS ground-truth (git + live PID + agent-messages.jsonl) before acting.
- If watcher bp4zzjtkf already fired / PID gone on relaunch: /home/grace/phase3_delete.log is PERMISSION-DENIED to jack — skip it; the authoritative check is prod DB. Verify via `ssh konnex-data 'sudo -n -u postgres psql market_intelligence'`: keep-set (archived_at IS NULL) == 387,024 + no open delete/vacuum in pg_stat_activity, before declaring done.
