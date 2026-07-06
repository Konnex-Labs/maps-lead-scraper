---
task_id: v2-phase-1-sp2-change-detection
agent: jack
session_id: 2026-07-06T13Z-relaunch-post-014
model: claude-opus-4-8
status: handoff
last_updated: 2026-07-06T16:14:00Z
status_note: END-OF-DAY STAND-DOWN (Matt GO sig 7dec9e964a6ec646, 16:13Z — resume in morning). Going offline. CRITICAL PATH COMPLETE — both live actions landed + independently verified. Matt GO sig e9ff1d6890466c52 VALID (both). GO-1 SP-2 first live emission DONE (business_events 40,469→41,150, +681 exact; reversibility logs fsync'd /home/jack/sp2-live-2026-07-06/). GO-2 dedup live DML DONE by Rajesh (two-person gate Matt+Jack 71bab3f4; 22 merged / 88 units / 7285 quarantine zero-DML; AC-7 idempotency re-run written=0; log /tmp/konnex-dedup-live/reports/dedup/dedup-merge-live-2026-07-06T14-12-33-149Z.jsonl). MY INDEPENDENT PROD CHECK PASS: 0 orphaned snapshots to tombstones, all 22 tombstones→live survivor (no chains), business_events untouched by dedup. GO-B done earlier (grants sources+entity_aliases). Migration 014 + SP-2 017/018 on prod. Remaining = parked follow-ups only (see below); no critical-path work outstanding.
notion_task_id: 3942300f-2ecb-8161-99e6-d5eb8ea2bf65
context_needed:
  files: ["/home/jack/projects/konnex-data-pipeline/temporal-diff.js", "/home/jack/projects/konnex-data-pipeline/migrations/017_business_events_density_uniq.sql", "/home/jack/projects/konnex-data-pipeline/migrations/018_business_events_event_type_taxonomy.sql", "/home/shared/specs/DEDUP-REMEDIATION-SPEC.md"]
  branches: ["svi/sp2-change-detection (local build branch — envelope+014+015+016+017+018; PR #56 already merged clean subset)"]
  collaborators: [matt, rajesh, grace]
---

# ===================== SESSION 2026-07-06T14Z — RELAUNCH POST-014, AT BLAST-RADIUS GATE =====================

## Done (verified this session against git + agent-messages)
- **Migration 014 LIVE on prod** market_intelligence (204.168.198.203:5432, role market_intel): column businesses.merged_into (uuid) + FK fk_businesses_merged_into (self-ref ON DELETE SET NULL) + partial idx idx_businesses_merged_into all present. Sig 90a5e0e755248aec VALID (Rajesh independently verified). Zero data mutation, no spend. DO NOT re-apply.
- **SP-2 prod-apply**: PR #56 MERGED (squash 935c671289e6c2ab, Matt GO 41fd0885). Migrations 017 (partial-unique event-dedup idx) + 018 (event_type CHECK 4→7 superset) applied to prod + verified; business_events row count unchanged 40,469. Zero mutation.
- **Grace read-only prod classify — COMPLETE + CLEAN** (post-014, zero DML, zero spend, sig 1033da5c). Both audit anchors reproduced EXACTLY: 7307 place_id-alone groups / 399 (place_id,industry), unclassified=0 on both, all AC-1 completeness checks pass. **Auto-merge universe under canonical key (place_id-alone, same-industry only) = just 22 pairs.** Other 7285 groups → QUARANTINE (6982 are cross-industry place_id collisions the runner correctly does NOT merge = Schema-Hardening-C entity-model work, separate). Reports handed to Rajesh for the prod dry-run gate. Numbers match my own prod anchor 1:1 → integrity confirmed.
- **Ops flag raised** (not my critical path): sprint-rotation.service FAILED 3 consecutive weekly runs (06-22/06-29/07-06 13:30Z). Root cause: script filters Notion tickets by hardcoded Status option strings ('⛔ Blocked','📋 TODO') that no longer exist — Notion Status property polluted with duplicate variants. Weekly rotation (ticket migration + dispatcher restart) hasn't run ~3 weeks. Flagged to Rajesh (sig 6a7b13f3) to ticket; I can own the sprint-rotation.js fix once dedup/SP-2 gate clears.

## GOs EXECUTED — Matt GO sig e9ff1d6890466c52 VALID (14:09Z), both authorized
- ✅ **GO-1 SP-2 FIRST LIVE EMISSION — DONE + VERIFIED (14:10Z).** Ran origin/main emitter `--live` for 3 pairs. business_events 40,469 → 41,150 (delta 681 exact). By type: 334 review_velocity + 334 review_count + 13 rating. Single persisted source 2505376d (kind=maps). Reversibility logs (mode=live, fsync'd) at /home/jack/sp2-live-2026-07-06/ (3 files). Zero errors.
- ✅ **GO-2 DEDUP LIVE DML — DONE + VERIFIED (14:13Z, Rajesh executed, sig ace3b17d VALID).** 22 merges / 88 units / 7285 quarantine zero-DML; AC-7 idempotency re-run written=0. Log /tmp/konnex-dedup-live/reports/dedup/dedup-merge-live-2026-07-06T14-12-33-149Z.jsonl (fsync'd). My independent prod check PASS (0 orphans, all 22 tombstones→live survivor, business_events untouched). Both GOs relayed done to Matt.
- GO-B DONE (grants on sources + entity_aliases). SP-2 emitter dry-run DONE.
- ✅ **SP-2 flow-violation review CLOSED** (Rajesh independent QA PASS, ticket 3952300f-2ecb-8196 → Done; all 3 flow-violation tickets now Done, board clean). Sig-provenance flag on PR #56 body RESOLVED: embedded '53bd665b' was an 8-char truncation of VALID full sig 53bd665b7d1db4c5 (grep-confirmed in ledger) — no integrity issue. PR #56 merged/historical, body left as-is. Lesson saved to memory (full-16-char-sigId always).

## Remaining — parked follow-ups only (no critical-path work left)
1. ✅ DONE (14:41Z): Matt picked option 3. Provisioned read-only 'matt' role on market_intelligence — CONNECT+USAGE(public)+SELECT on all current/future public tables, NO write/DDL. Verified login_ok / read=t / write=f / 3,776,477 rows. Password in /home/jack/projects/market-intelligence/.matt-readonly.env (chmod 600, gitignored — confirmed check-ignore). Password NOT sent over chat (only the file path). Perms: 0600 jack-owned — Matt reads it over konnex-jack SSH session so no perms change needed. FOLLOW-UP (14:52Z): Matt's first connect failed 'no pg_hba entry for 89.167.72.210, user matt' — added `host market_intelligence matt 89.167.72.210/32 scram-sha-256`, pg_reload_conf (live, no restart), verified in pg_hba_file_rules. His IP was whitelisted for market_intel but not the new matt role.
2. File low-pri follow-up: pg DeprecationWarning (client.query concurrency) in Grace's dedup runner — cosmetic, zero op impact.
3. DFS Phase-1 branch integration (Notion 3952300f-2ecb-8111): rebase contract/dataforseo-nsw-trades → PR → Rajesh GH-approve → Matt Phase-1 GO.
4. sprint-rotation.service fix (Ops/Med) — Notion Status option drift; I own the script fix now that dedup/SP-2 gate cleared.
5. Legacy-agent cleanup (ada/brian/maria/priya/sarah) — Matt GO'd "after phase-1 priority"; phase-1 live actions now DONE, so this is unblocked. Destructive (agent removal) → do carefully, confirm scope with Matt before executing. (Notion 3952300f-2ecb-8111, TODO): rebase contract/dataforseo-nsw-trades (19 ahead/14 behind) → fresh PR → Rajesh GH-approve → Matt Phase-1 GO. Parked; not critical path.
5. Legacy-agent cleanup (ada/brian/maria/priya/sarah): Matt GO'd "after phase-1 priority". PR #56 merged but dedup/SP-2 still active phase-1 — keep HELD until this gate clears. Involves destructive agent removal → do carefully, not autonomously mid-flight.

## Resume notes
- **DO NOT**: re-apply migration 014 (live); self-authorize live dedup DML or SP-2 live emission (both = explicit Matt+Jack GO each); give Grace a live-merge GO before Rajesh's prod dry-run + review.
- Dedup live run is bounded to ~22 auto-merge groups (Grace classify). Quarantine (7285 groups) = zero DML by design.
- SIG VERIFICATION: `tmux-message-verify` needs the FULL 16-char sigId; 8-char prefixes always return 'no accepted message' (NOT proof of absence). Never call a sig 'phantom' off a truncated prefix.
- PROGRESS.md body persistence has repeatedly gone stale on relaunch (Rajesh flagged 2x). This body was hand-refreshed to current state 14:00Z to break that loop. Frontmatter status_note is the authoritative one-liner.
- Fresh context (~relaunched from 72%). Rajesh + Grace online. Matt on Telegram.
- **EOD 2026-07-06T16:14Z**: Matt called stand-down (sig 7dec9e964a6ec646), resume in morning. Jack going offline (agent-offline + exit). This session also: provisioned read-only 'matt' DB role on market_intelligence (pg_hba host entry for 89.167.72.210 added, Matt connected OK, creds in /home/jack/projects/market-intelligence/.matt-readonly.env gitignored); filed parked Notion DB-audit ticket 3952300f-2ecb-819f-974e-d82f67ea327f (Icebox). Morning first move: check Matt's arch-doc review verdict → Phase-1 next piece (Schema-Hardening-C).
