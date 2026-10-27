---
task_id: AGENT-API-TRIAL-01
agent: jack
session_id: 98099df6-9eec-43b6-a3dc-53f0253099d8
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-27T09:20:00Z
notion_task_id: 4032300f-2ecb-81e5-8658-fa215ff0c827
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = board-sweep first real run 27 Oct 19:00Z: check /home/shared/board-sweep/ + journalctl -u board-sweep; then confirm tickets PLAN-CADENCE 4032300f-2ecb-8137-bcb8-cd426e05a2e0 + MARCUS-ROLE Done/stamped. MARCUS-ROLE-01 LIVE: #358 merged 1eddef4 (Raj re-PASS 786978e208c9a894 @6dbe09a); claude-md-push global 8/8 = c861d04736bd, marcus personal 797437e3d619, --verify 8 ok; Matt + Raj told. FOLLOW-UP ticket: add marcus/ada to summon-offline-agents KNOWN_AGENTS (Matt reply doesn't wake Marcus). PLAN-CADENCE-01 LIVE: #357 merged fbdc09b, scripts md5 OK, timers enabled (sweep 19:00Z daily, weekly Sun 20:00Z). RAJ LEDGER: Console 07:44Z org bal USD 68.40, agent-runtime 30d $34.23; re-anchor /etc/konnex/agent-api-ledger-rajesh.json (68.40, as_of 05:30Z) DENIED by auto-mode; awaiting Matt OK. TODO ticket: agent-settings-deploy reject unknown flags + keep owner. BOARD-RESET-01 = Marcus.
- RESUME HERE = BOARD-SWEEP-WAKE (Matt GO 7c4eb36e4599755f, 09:14Z 27 Oct): build daily wake of Marcus for NEW serious board problems only (stale/blocked: E1/E2-class, new vs previous sweep), default OFF via flag in /home/shared/config/board-sweep.env (e.g. BOARD_SWEEP_WAKE=1); keep --quiet note otherwise. Activate ONLY after BOARD-RESET-01 clears backlog. Same PR: fix agent-claude-md/jack.md Marcus row 'woken by ... board-sweep exceptions' -> 'woken for Monday planning; daily sweep note is quiet (wake on new serious problems after BOARD-RESET-01)'. PR in ops (Ticket footer), tests, Raj QA, then install. AGENT-OPS-DOC DONE 27 Oct (Matt GO c16ae6c4f0ded798): internal 1cc2300f-2ecb-82d8-8b1a-01457218c00b full update; outward 4032300f-2ecb-811f-a498-f9e5351da377 light update; Superseded banners on 31f2300f, 33f2300f (Alex told quietly), 3192300f. Matt sent links. Needs board ticket.
- RAJ ALERT LIVE 07:29Z 27 Oct: ops #356 merged 2e294db, installed + timer. Ledger re-anchor pending Matt OK (see above). Follow-up: USD text (non-blocking). Check trial ticket 4032300f-...-81e5 stays In Progress. COMMITTED THIS WEEK: PLAN-CADENCE-01 (live) + MARCUS-ROLE-01 + BOARD-RESET-01; LEAN CLAUDE.md shrink, re-measure 28 Oct. Matt open: 2nd vendor, fleet plan after ~31 Oct invoice.
- RESUME HERE = mig 266 DONE: #410 MERGED 2c50f13 14:09Z 26 Oct (Raj PASS+GH approve, Ada cond-3 OK d0493019, verify /home/shared/jack-mig266-postapply-20261026.txt). SIG B Raj 2190af1b (99466d9; month 2026-10 only, 115 tasks est $10.35, max-cost 12). NEXT (Prod Verified already stamped 14:06Z, ticket Done): live DFS balance >= $12.81 read right before drop-in (needs DFS creds: auto-mode blocked me, operator decides) -> cap-12 drop-in -> re-enable demand timer before 20 Nov; Ada reconciles. Raj budget 100k DEPLOYED 06:30Z (Matt GO 2d745143; settings env, bak .pre-deploy-2026-10-26T06-30-03-209Z); live at his next session (verify agent-stats/rajesh-latest.json context_budget_tokens=100000); re-measure 28 Oct. OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d). DFS bal $30.70 (covers 22 Nov sweep; Matt told).
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping. 308 redirect DONE 10:42Z.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also konnex-qa (Rajesh push, c7eea71e); same fix.

- INSIGHTS-HUB-01 3fc2300f-2ecb-81ca-a097-fe6cb019fae7: live; follow-ups in /home/shared/jack-insights-hub-01-followups-2026-10-27.md.
- MAPS TIMER now 28-day (Matt 2a9f1fe3, Grace 144ca335) LIVE 13:15Z: 25 Oct 14:30Z then Sun 14:00Z from 22 Nov; explicit dates END 2028-12-17 (extend before). konnex-ops 'restart required' (OS update): plan a quiet window with Marcus, not unilateral.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 FOLLOW-UP PR (mine, one): full item list in /home/shared/jack-ps01-v2-followups-2026-10-27.md (ticket PIPELINE-STATE-01 3fb2300f-2ecb-81ab-9a65-c615331b5f8f).

## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39): tracker 4032300f-2ecb-819d-9943-d99722b2ff95; week: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. Fleet re-mint HELD.
- API TRIAL LIVE 24 Oct 05:12Z (Raj auth=api-key, #349 03dd0ca; rollback: loop .bak-pre-pr349-* or move key + restart @rajesh). Console 25 Oct: ~$14/day pace. Week-end tab vs Console ~31 Oct.
- AGENT-LEAN-01 (4032300f-2ecb-8163-af43-f9578ec41e9b): (1) 150k budget LIVE 12:50Z (ops #355 c39172e, CLAUDE.md pushed 8/8; rollback agent-statusline.sh.bak-pre-pr355-*). Olivia on subscription (token fixed 13:01Z); Carlos -> API key (one key per agent in agent-runtime workspace, Matt creates 'carlos' key) + on-demand. (3) on-demand spec /home/shared/jack-agent-lean-on-demand-seats-spec-2026-10-24.md (now Alex+Carlos only; Olivia out). (2) my MEMORY.md shrunk 99->41KB; CLAUDE.md shrink TODO. Then measure.
- MATT-DB-RO-01 follow-ups: H1-H4, sshd PasswordAuthentication ticket, conn limit 6 if asked.
- Later: PLANNING timer 5 Nov 03:00Z (MONTHLY_HC_URL TODO).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs #261-263/#241 await Rajesh.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
