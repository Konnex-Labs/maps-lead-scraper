---
task_id: v2-trades-two-streams-2026-07-10
agent: jack
session_id: 2026-07-10-am
model: opus-4.8
status: context-exit
last_updated: 2026-07-10T01:35:00Z
context_needed:
  files:
    - /home/olivia/projects/konnex-website/api/ask-konnex.js (PRESETS obj ~line 50 — add 3 trade presets)
    - /home/olivia/projects/konnex-website/index.html (#kxQuery chips ~line 102)
    - /home/jack/projects/konnex-data-api/lib/tool-handlers/aggregate_records.js
    - /home/jack/projects/konnex-data-api/server.js (/v2/tools/aggregate_records ~5361)
    - /home/jack/projects/market-intelligence/svi/nsw-trades-ingest-runner.js
  branches:
    - market-intelligence origin/main (HAS DFS runner via PRs #41/#44/#49; newer than branch)
    - market-intelligence origin/contract/dataforseo-nsw-trades (QA'd tip 1c0a7f4, 2026-07-03)
    - worktree /tmp/mi-dfs-integrate on integrate/dataforseo-nsw-trades-onto-main (clean at 1c0a7f4)
  collaborators: [matt, rajesh, olivia, grace]
---

## Done
- Matt authorized 2 parallel streams (2026-07-10). Today's priority = STREAM 2 (Ask Konnex NSW 3-trades facts).
- mig-014 hold CLEARED (migration 014 = businesses.merged_into, live in prod via 2026-07-06 dedup).
- STREAM 2 fully scoped + spec'd + handed off:
  - Ask Konnex NL layer already built + live, PRESET-driven (chips -> canned query -> /v2/tools/aggregate_records). NOT free-text LLM.
  - Matt GO on fast-path (sig 44d37dc8283492a7) + scope (chips-only, counts-first) (sig 08c3922d8860c95f).
  - CONFIRMED (Jack DB query + Rajesh independent prod verify): labels electrician_au / plumber_au / carpenter_au. NSW active counts: electricians 26,501 | plumbers 13,796 | carpenters 19,401. mv_trades_footprint drift=0 vs businesses (computed 2026-07-09T08:46:58Z) -> fast path == proper path numbers.
  - mv_trades_footprint columns: industry, address_state, period, in_scope_live_count, computed_at.
  - Suburb grain EXISTS in businesses via DFS geocoding (PR #53 lat/lng->suburb), PARTIAL for NSW (~61% elec / 45% plumb / 26% carp). 'top NSW suburb' answerable-but-partial; completion looks tied to delta commit 141cd6f.
  - Delivered NSW facts to Matt directly. Handed Olivia the COMPLETE build spec (verbatim presets + chip wiring + expected totals) via tmux — she's unblocked to build+PR in konnex-website today.
- STREAM 1 rebase attempt CONFLICTED. Finding: main already has DFS runner (PRs #41/#44/#49), newer than branch -> 24-commit rebase = false add/add. Approved approach (Matt + Rajesh): CHERRY-PICK the true delta (141cd6f trade-attribution fix + 1c0a7f4 backup-parity/batched-Step-D/re-post runbook), NOT rebase.

## In Progress
- Exiting at 70% ceiling, MID-WORK (want auto-relaunch; do NOT agent-offline).

## Remaining
- STREAM 2 (Olivia building): presets to add to api/ask-konnex.js PRESETS:
    nsw_electrician: { body:{group_by:'suburb',industry:'electrician_au',country:'au',state:'NSW'}, read:'total' }
    nsw_plumber:     { body:{group_by:'suburb',industry:'plumber_au',    country:'au',state:'NSW'}, read:'total' }
    nsw_carpenter:   { body:{group_by:'suburb',industry:'carpenter_au',  country:'au',state:'NSW'}, read:'total' }
  + 3 index.html chips (How many electricians/plumbers/carpenters in NSW?) posting {q:'<id>'}. Rajesh QA vs baselines above. Then: mv-endpoint proper-path follow-up (swap presets, re-verify counts unchanged).
- STREAM 1: awaiting Matt answer — were PRs #41/#44/#49 intentional productionisation (-> is contract branch mostly obsolete)? Then: verify main runner run-ready -> cherry-pick 141cd6f + 1c0a7f4 onto main as small clean PR -> Rajesh approve -> merge -> restart Grace FRESH (was 52% ctx) -> Grace live paid run (~USD150, GO'd sig 109e026b870f10f3) -> Rajesh QA.

## Resume notes
- Next session: check Olivia's konnex-website PR (stream-2 chips) for review; check Matt reply on #41/#44/#49 intent (stream 1).
- Do NOT force-push over origin/contract/dataforseo-nsw-trades (QA'd tip). Worktree /tmp/mi-dfs-integrate held at 1c0a7f4.
- No paid DFS run until PR merged + Grace fresh restart (Jack triggers restart just before run).
- All inbound signed msgs this session verified VALID.
