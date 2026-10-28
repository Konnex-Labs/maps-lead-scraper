---
task_id: BOARD-RESET-01-TRIAGE
agent: jack
session_id: 6f92b31e-da3e-4f53-b508-cfcf640741ad
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-28T09:20:00Z
notion_task_id: 4032300f-2ecb-81e5-8658-fa215ff0c827
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = SEC #124 DEPLOY: konnex-api PR #124 head e8f9be3d567375e74481596549d0b40b43d89573 (wt /home/jack/projects/kapi-wt-pii410; node_modules symlink untracked, don't commit). 410s 5 record /v2/tools (RECORD_TOOLS_ENABLED=1 rollback) + /api/v1/businesses/:id (V1_BUSINESS_DETAIL_ENABLED=1). Ticket SEC-V2-RECORD-TOOLS-01 4072300f-2ecb-810c-b1c3-e58048e46cd3. Raj QA in progress (old head probed clean). On PASS: merge --match-head-commit, deploy to konnex-api host (77.42.94.228), post-check 410s + aggregate tools + /v2/ask, tell Matt. Matt asked (09:0xZ) for: deploy OK + read-only prod log check (did anyone pull PII?); prod host read was auto-mode DENIED, so need his permission.
- API BRIEF: proposal DELIVERED 28 Oct (/home/shared/jack-self-serve-api-engineering-proposal-2026-10-28.md; audit /home/shared/jack-api-audit-2026-10-28.md); Matt + Marcus told. Matt decision pending: retire Connect contact-reveal routes. Next mine: measure cost per call type for rate card; later docs PR to konnex-api docs/reports. Follow-up tickets (Marcus, Backlog): SEC-V2-HELD-COUNT-01 813f, SEC-V2-ASK-SUPPLY-01 8173, SEC-STRIPE-DEDUPE-01 8107, SEC-PROFILE-RATELIMIT-01 81b2 (all 4072300f-2ecb-...). Marcus online, owns planning for both briefs (/home/shared/media/1793177239292 + 1793177268188 -matt-to-jack.md).
- BOARD-RESET-01 triage answered (file /home/shared/jack-board-reset-01-triage-35-ANSWER-20261027.md; KEEP 1,2,17; kdp#375/376 closed superseded). Marcus applies. Then set BOARD_SWEEP_WAKE=1 when he says done.
- Then confirm tickets PLAN-CADENCE 4032300f-2ecb-8137-bcb8-cd426e05a2e0 + MARCUS-ROLE Done/stamped. MARCUS-ROLE-01 LIVE: #358 merged 1eddef4 (Raj re-PASS 786978e208c9a894 @6dbe09a); claude-md-push global 8/8 = c861d04736bd, marcus personal 797437e3d619, --verify 8 ok; Matt + Raj told. FOLLOW-UP ticket: add marcus/ada to summon-offline-agents KNOWN_AGENTS (Matt reply doesn't wake Marcus). PLAN-CADENCE-01 LIVE: #357 merged fbdc09b, scripts md5 OK, timers enabled (sweep 19:00Z daily, weekly Sun 20:00Z). RAJ LEDGER: Console 07:44Z org bal USD 68.40, agent-runtime 30d $34.23; ledger re-anchored. TODO ticket: agent-settings-deploy reject unknown flags + keep owner. BOARD-RESET-01 = Marcus.
- BOARD-SWEEP-WAKE-01 LIVE OFF (#359). Set BOARD_SWEEP_WAKE=1 when Marcus says BOARD-RESET-01 done.
- RAJ ALERT LIVE (ops #356 2e294db). Ledger re-anchor pending Matt OK. Follow-up: USD text. Trial ticket 4032300f-...-81e5 stays In Progress. LEAN CLAUDE.md shrink, re-measure 28 Oct. Matt open: 2nd vendor, fleet plan after ~31 Oct invoice.
- mig 266 DONE (#410 2c50f13; verify /home/shared/jack-mig266-postapply-20261026.txt; SIG B Raj 2190af1b). NEXT (Prod Verified already stamped 14:06Z, ticket Done): live DFS balance >= $12.81 read right before drop-in (needs DFS creds: auto-mode blocked me, operator decides) -> cap-12 drop-in -> re-enable demand timer before 20 Nov; Ada reconciles. Raj budget 100k DEPLOYED 06:30Z (Matt GO 2d745143; settings env, bak .pre-deploy-2026-10-26T06-30-03-209Z); live at his next session (verify agent-stats/rajesh-latest.json context_budget_tokens=100000); re-measure 28 Oct. OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d).
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- AGENT-GH-APP-01 DONE. TELL MATT: main required-reviews; revoke Raj's old qa PAT (asked TG 08:46Z 28 Oct).

- MAPS TIMER 28-day LIVE (next Sun 22 Nov 14:00Z; END 2028-12-17, extend before). konnex-ops OS restart: plan quiet window with Marcus.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- MARKET-PULSE-REFRESH-01 (c): Raj checked 28 Oct, no new ABS month (last 2026-08); he rechecks after 1-5 Nov timer. Nothing on me.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 FOLLOW-UP PR (mine, one): full item list in /home/shared/jack-ps01-v2-followups-2026-10-27.md (ticket PIPELINE-STATE-01 3fb2300f-2ecb-81ab-9a65-c615331b5f8f).

## Remaining
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
- MARCUS WAKE Thu 29 Oct ~22:00Z (9am AEDT Fri) for BOARD-RESET-01 if not already done this session: agent-online marcus --reason agent-handoff --prompt 'resume BOARD-RESET-01 PROGRESS; tell Jack BOARD_SWEEP_WAKE; then agent-offline'.
- MARCUS TODO: trim his startup ctx (38%); check his Notion use on API key. TICKET: dedupe Stop-hook ckpt notices; exit banner says 'Agent: jack'.
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response + allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39): tracker 4032300f-2ecb-819d-9943-d99722b2ff95; week: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. Fleet re-mint HELD.
- API TRIAL LIVE (Raj api-key, #349). Week-end tab vs Console ~31 Oct.
- AGENT-LEAN-01 (4032300f-2ecb-8163-af43-f9578ec41e9b): (1) 150k budget LIVE 12:50Z (ops #355 c39172e, CLAUDE.md pushed 8/8; rollback agent-statusline.sh.bak-pre-pr355-*). Olivia on subscription (token fixed 13:01Z); Carlos -> API key (one key per agent in agent-runtime workspace, Matt creates 'carlos' key) + on-demand. (3) on-demand spec /home/shared/jack-agent-lean-on-demand-seats-spec-2026-10-24.md (now Alex+Carlos only; Olivia out). (2) my MEMORY.md shrunk 99->41KB; CLAUDE.md shrink TODO. Then measure.
- Standing: stamp Prod Verified At on every migration applied.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
