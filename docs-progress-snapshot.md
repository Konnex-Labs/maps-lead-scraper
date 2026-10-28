---
task_id: BOARD-RESET-01-TRIAGE
agent: jack
session_id: a051fdf1-22c7-4899-a805-570d35cc1a51
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-28T08:48:00Z
notion_task_id: 4032300f-2ecb-81e5-8658-fa215ff0c827
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = MATT BRIEFS (28 Oct 08:46Z, c46f2e21): Matt is sending TWO briefs (from a Walter chat) to Telegram and wants Marcus online. When the docs land: agent-online marcus --reason agent-handoff --prompt '<briefs path + ask>', hand him the planning side, Jack = engineering. Told Matt yes + restart (TG 08:48Z). Also overdue: check 27 Oct 19:00Z board-sweep (journalctl -u board-sweep; Notion 429?).
- BOARD-RESET-01 triage answered (file /home/shared/jack-board-reset-01-triage-35-ANSWER-20261027.md; KEEP 1,2,17; kdp#375/376 closed superseded). Marcus applies. Then set BOARD_SWEEP_WAKE=1 when he says done.
- Then confirm tickets PLAN-CADENCE 4032300f-2ecb-8137-bcb8-cd426e05a2e0 + MARCUS-ROLE Done/stamped. MARCUS-ROLE-01 LIVE: #358 merged 1eddef4 (Raj re-PASS 786978e208c9a894 @6dbe09a); claude-md-push global 8/8 = c861d04736bd, marcus personal 797437e3d619, --verify 8 ok; Matt + Raj told. FOLLOW-UP ticket: add marcus/ada to summon-offline-agents KNOWN_AGENTS (Matt reply doesn't wake Marcus). PLAN-CADENCE-01 LIVE: #357 merged fbdc09b, scripts md5 OK, timers enabled (sweep 19:00Z daily, weekly Sun 20:00Z). RAJ LEDGER: Console 07:44Z org bal USD 68.40, agent-runtime 30d $34.23; ledger re-anchored. TODO ticket: agent-settings-deploy reject unknown flags + keep owner. BOARD-RESET-01 = Marcus.
- BOARD-SWEEP-WAKE-01 LIVE OFF (#359 7031dd0). Set BOARD_SWEEP_WAKE=1 only when Marcus says BOARD-RESET-01 done. ops-wt-bsw rm DENIED 14:39Z (auto-mode); leave. Watch 19:00Z sweep for Notion 429.
- RAJ ALERT LIVE (ops #356 2e294db). Ledger re-anchor pending Matt OK. Follow-up: USD text. Trial ticket 4032300f-...-81e5 stays In Progress. LEAN CLAUDE.md shrink, re-measure 28 Oct. Matt open: 2nd vendor, fleet plan after ~31 Oct invoice.
- mig 266 DONE (#410 2c50f13; verify /home/shared/jack-mig266-postapply-20261026.txt; SIG B Raj 2190af1b). NEXT (Prod Verified already stamped 14:06Z, ticket Done): live DFS balance >= $12.81 read right before drop-in (needs DFS creds: auto-mode blocked me, operator decides) -> cap-12 drop-in -> re-enable demand timer before 20 Nov; Ada reconciles. Raj budget 100k DEPLOYED 06:30Z (Matt GO 2d745143; settings env, bak .pre-deploy-2026-10-26T06-30-03-209Z); live at his next session (verify agent-stats/rajesh-latest.json context_budget_tokens=100000); re-measure 28 Oct. OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d).
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- AGENT-GH-APP-01 DONE 14:55Z (ticket 4062300f-2ecb-8122-bb0f-f1c0e7528c03 Done; Raj remotes restored). Agents run /home/shared/bin/agent-gh-auth when needed. TELL MATT AM: main required-reviews; revoke Raj's old qa PAT.

- MAPS TIMER 28-day LIVE (next Sun 22 Nov 14:00Z; END 2028-12-17, extend before). konnex-ops OS restart: plan quiet window with Marcus.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 FOLLOW-UP PR (mine, one): full item list in /home/shared/jack-ps01-v2-followups-2026-10-27.md (ticket PIPELINE-STATE-01 3fb2300f-2ecb-81ab-9a65-c615331b5f8f).

## Remaining
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
- RESUME HERE = MARCUS WAKE: Thu 29 Oct ~22:00Z 28 Oct (9am AEDT) run `agent-online marcus --reason agent-handoff --prompt "Thu 29 BOARD-RESET-01 wake: resume PROGRESS (edits incl Carlos, ACs on KEEP + SITE-COPY/FP/MMR-01, re-sweep, tell Jack BOARD_SWEEP_WAKE), then agent-offline"`. at-job + /exit of his idle pane both DENIED by auto-mode (13:2xZ 27 Oct); Matt told (TG, offered 'park Marcus'). Loop design OK: health intentionallyOffline=true parks him after exit; weekly brief wakes him. PARKED 14:16Z 27 Oct (Matt OK 08564b24; clean exit, offline+intentionallyOffline). 
- MARCUS FIXED 13:14Z: agent-marcus key (Matt, agent-runtime) + restarted konnex-agent-tmux@marcus; log auth=api-key, working. TODO: his startup = 38% ctx (77k) -> trim; claude.ai connectors off on API key (check his Notion use). TICKET: dedupe Stop-hook ckpt notices; exit banner says 'Agent: jack'.
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39): tracker 4032300f-2ecb-819d-9943-d99722b2ff95; week: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. Fleet re-mint HELD.
- API TRIAL LIVE 24 Oct 05:12Z (Raj auth=api-key, #349 03dd0ca; rollback: loop .bak-pre-pr349-* or move key + restart @rajesh). Console 25 Oct: ~$14/day pace. Week-end tab vs Console ~31 Oct.
- AGENT-LEAN-01 (4032300f-2ecb-8163-af43-f9578ec41e9b): (1) 150k budget LIVE 12:50Z (ops #355 c39172e, CLAUDE.md pushed 8/8; rollback agent-statusline.sh.bak-pre-pr355-*). Olivia on subscription (token fixed 13:01Z); Carlos -> API key (one key per agent in agent-runtime workspace, Matt creates 'carlos' key) + on-demand. (3) on-demand spec /home/shared/jack-agent-lean-on-demand-seats-spec-2026-10-24.md (now Alex+Carlos only; Olivia out). (2) my MEMORY.md shrunk 99->41KB; CLAUDE.md shrink TODO. Then measure.
- Later: PLANNING timer 5 Nov 03:00Z.
- Standing: stamp Prod Verified At on every migration applied. Docs PRs #261-263/#241 await Rajesh.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
