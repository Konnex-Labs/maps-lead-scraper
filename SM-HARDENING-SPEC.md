# Agent State Machine Hardening (L2) — Sprint Contract / Spec

**Ticket:** 37e2300f-2ecb-81cb-ada5-cfe37ca521f0 (L2 — consolidated home)
**Owner:** Jack · **Reviewer:** Rajesh · **Matt GO:** sig e50bb08a33bb3b41 (contract) + sig 2146073a63f3a377 (narrowed full build, 2026-06-27 15:33Z)
**Status:** NARROWED — pending Rajesh re-gate (post-#83 reconciliation)
**Consolidates:** L2 placeholder + 4 Phase-2 Finding tickets (A/B/C/EXIT_REASONS) + 2 write-side findings (#4, D/D-bis) + today's checkpoint-staleness incident.

## Narrowing note (2026-06-27, post ground-truth)
PR #83 (commit 1fb8623, ticket 37f2300f "checkpoint-freshness") is already MERGED to `/home/jack/projects/ops` main AND deployed to `/home/shared/bin`. Reconciliation:
- **AC4 → DROPPED.** #83's `progress-extract.js` already derives the `memory.json` checkpoint FROM `PROGRESS.md` at exit (single-source). No further work; no regression test owed here.
- **AC6 → NARROWED** to the residual gap only (see AC6 below). #83's `clearStaleMemoryOnPickup` fires only on dispatcher NEW-task pickup (different `task_id`); the same-arc context-exit auto-relaunch case is still uncovered.
- AC1/2/3, AC5, AC7/8/9 unchanged — not touched by #83.

## Problem / Why
Matt's goal: stop agents losing time to **staleness, confusion, wrong-direction, and rework**. Live evidence today: Jack relaunched on a STALE checkpoint 3× (~30 min lost) because the `memory.json` checkpoint content lagged `PROGRESS.md`. Separately, mid-session context-exits sometimes do NOT auto-restart (exit-reason mislabeled), and restart storms can go silent. These are correctness/observability gaps in the EXISTING state machine — distinct from (and prerequisite to) Phase 4 auto-recovery.

## Scope (4 themes)

### Theme 1 — Exit-reason classification correctness
- **AC1** `EXIT_REASONS` enum/set includes `context-exit` as a first-class value (root fix for the missing-enum Finding). Any code branching on exit reason recognizes it.
- **AC2** The auto-relaunch path records the exit reason as its true cause (`context-exit`), NOT `sigterm-external` (Finding C). Telemetry/logs reflect the real reason.
- **AC3** Two-exit-mode contract enforced: `intentionallyOffline=true` is set ONLY for END-of-work `agent-offline` exits; a MID-work `context-exit` leaves it `false` so the loop relaunches. A mid-session context-exit RELIABLY auto-restarts; an intentional offline does NOT. **RAJESH RULING (sig 4f4bbbad8bb0f4b8): largely satisfied already — `agent-exit-observed` keeps `intentionallyOffline=false` on the summoning branch and sets `true` only on no-remaining-work→offline. Do NOT force `false` unconditionally on all context-exits (would regress the D-bis presence fix). SCOPE = REGRESSION TEST ONLY: assert a context-exit with `hasRemainingWork=true` leaves `intentionallyOffline=false`. The 3× stale-relaunch traced to `hasRemainingWork`=false → AC5/AC6 domain, not this flag.**

### Theme 2 — Checkpoint / PROGRESS.md write-side correctness
- **AC4** ~~Immediately after a `context-exit`, the `memory.json` last-entry body content reflects the `PROGRESS.md` state at that exit.~~ **DROPPED — delivered by PR #83 (`progress-extract.js` single-sources checkpoint from PROGRESS.md).**
- **AC5** The Stop hook does NOT clobber the `PROGRESS.md` `task_id` (Finding #4). **Regression test required.**
- **AC6 (NARROWED)** On a **context-exit auto-relaunch of the SAME task arc** (same `task_id`), the startup protocol reconciles `memory.json` against `PROGRESS.md` by content timestamp (`PROGRESS.md last_updated` vs `memory.json` entry timestamp, NOT file mtime). If `PROGRESS.md` is more recent, its state is the resume basis AND the session-start gate message (team-chat-send to Matt) reflects PROGRESS.md content. (Residual gap not covered by #83's `clearStaleMemoryOnPickup`, which fires only on dispatcher NEW-task pickup with a different `task_id`.) **Regression test required** (Rajesh re-gate addition, sig 5b27130efdd71fe8 — same-arc relaunch staleness is a repeat offender).

### Theme 3 — Relaunch safety + observability
- **AC7** Rate-cap + backoff on `context-exit` auto-relaunch (Finding A), per agent: allow up to **3 auto-relaunches per rolling 10-minute window**. On the 4th within the window, apply exponential backoff before relaunch — **60s → 120s → 240s, capped at 600s**. Window resets after a session runs >10 min without exiting. (Deterministically testable by forcing repeated context-exits and asserting the delays.)
- **AC8** The restart-rate alarm fires via `team-chat-send` to Matt when **≥4 auto-relaunches occur for a single agent within 10 minutes** (i.e. the AC7 cap is tripped). Auto-relaunches are counted (Finding B) — not blind.
- **AC9** Summoning reliably transitions an agent to `online` (Finding D); the presence gate is not bypassed (D-bis). If a summoned agent does **not** transition to `online` within **5 minutes**, an alert fires via `team-chat-send`.

## Out of scope
- Phase 4 auto-recovery (NEW capability — depends on this hardening landing first).
- Phase 3 (undefined for this epic).

## Verification (Rajesh QA)
Each AC needs a concrete, observable pass condition (log line, state-file value, or repro). Rajesh to confirm AC wording is testable BEFORE build. Where feasible, add a regression test (the throttle ticket had no unit test — avoid repeating).

## Session estimate
**2-3** — 7 open ACs (AC4 dropped, AC6 narrowed) across exit-reason lib, Stop/exit hooks, same-arc relaunch reconcile, relaunch backoff, restart alarm, and summoning; regression tests for AC3, AC5, AC6-narrowed, plus AC7 deterministic throttle assertion.
