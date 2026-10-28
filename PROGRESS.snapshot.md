---
task_id: API-SELF-SERVE-01-S1
agent: jack
session_id: c15294bc-e3ee-4477-b98f-b3ba57bd0d3c
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-28T15:08:21Z
notion_task_id: 4072300f-2ecb-81f7-a657-c9e35dee1b16
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = kapi #138 S2 contract MERGED ffd9011 (Raj PASS 80bae072). S2 ticket 4072300f-2ecb-81a3-a5ec-f58cc3c2a355 set In Progress 15:08Z (AC3 ledger mig spec+dry run open); CHECK the merge watcher did not flip it Done (reset if so). NEXT: build B1+B2 ledger mig (dry run only, no live DDL before Raj PASS); S3 UAT build ticket 4072300f-2ecb-81b5-bdc9-db028be80166. Raj build-PR conditions: C1 B2b wording -> marker rule (3a); C2 B14 sets v1_cutover_at BEFORE row scan, --reverse clears it; runbook: flag-off keeps 403 for marked rows. E1 now 4 In Progress (S1, S2, API-TRIAL, LEAN) vs cap 3: close S1 if its ACs are met. Matt verbatim 397070f3 in /home/shared/jack-matt-397070f3-verbatim-2026-10-28.txt. Owed by Matt: tax adviser (G1), legal route (G2). Nit for next doc: pricing v0.2 warm avg A$0.018 not 0.017. Open: GST/invoice via tax adviser (asked Matt for contact), D6 terms legal review, D7 paid pool size (rec US$25). #135 LIVE c88e146 (rollback ~/kapi-prod-pre-pr135-20261028T1422Z.tgz on konnex-api); Raj probe partial PASS: tell Raj when first post-14:23Z ask_konnex.answer event lands (cost_usd check). Then API S1 (4072300f-2ecb-81f7-a657-c9e35dee1b16, In Progress). Raj non-blocking: ask-konnex.js:80 prompt line still names the metric. PR #135 worktree ~/projects/kapi-wt-pricing-fix (tests need temp node_modules symlink to ~/projects/konnex-data-api/node_modules). Note: lowers recorded cost_usd ~13% -> cap ~439 warm/77 cold per UTC day). Follow-up: paid-Ask guard separate from ASK_KONNEX_DAILY_LIMIT_USD=5 in S2 contract. Then: Stripe live webhook = Matt/dashboard; measured cost per call type. Matt ruling 382bab39: DFS + Data NSW free tier compliant (record as basis). Future briefs: Marcus -> me -> docs/api PR. Later PR nits (#135): Object.hasOwn price lookup; MODEL-in-MODEL_PRICES test.
- OWED: living-state brief eng review by Thu 29 Oct 03:00Z. Matt pending: retire Connect contact-reveal routes. SEC follow-ups 813f/8173/8107/81b2 (Marcus, Backlog). TELL MATT: GH main required-reviews; revoke Raj old qa PAT.
- #126 rollback: CONTACT_REVEAL_ENABLED=1; backup ~/kapi-prod-pre-pr126-20261028T1147Z.tgz on konnex-api. Olivia CONNECT-REVEAL-HIDE-01 in UAT QA.
- BOARD-SWEEP-WAKE: AFTER 28 Oct 19:00Z sweep run /home/jack/bin/board-sweep-wake-gate-20261028.sh (Marcus ba2bbcd6: sets BOARD_SWEEP_WAKE=1 in /home/shared/config/board-sweep.env unless E1-E5 worse than 27 Oct; else tells Marcus). Timer scheduling denied by auto mode; run by hand. E1: parked 3 to Backlog; MAPS-CLOSURE-01 Done (Raj PASS 9358e835; cohort label fix = Grace mig 269, kdp #412 Raj R1 REQUEST_CHANGES ebf9ba76 (kind-qualify comments) handed to Grace on relaunch; on Raj PASS dry-run -> apply as postgres -> merge -> stamp).
- RAJ ALERT LIVE (ops #356 2e294db). Ledger re-anchor pending Matt OK. Follow-up: USD text. Trial ticket 4032300f-...-81e5 stays In Progress. LEAN CLAUDE.md shrink, re-measure 28 Oct. Matt open: 2nd vendor, fleet plan after ~31 Oct invoice.
- mig 266 DONE (#410 2c50f13; verify /home/shared/jack-mig266-postapply-20261026.txt; SIG B Raj 2190af1b). NEXT (Prod Verified already stamped 14:06Z, ticket Done): live DFS balance >= $12.81 read right before drop-in (needs DFS creds: auto-mode blocked me, operator decides) -> cap-12 drop-in -> re-enable demand timer before 20 Nov; Ada reconciles. Raj budget 100k DEPLOYED 06:30Z (Matt GO 2d745143; settings env, bak .pre-deploy-2026-10-26T06-30-03-209Z); live at his next session (verify agent-stats/rajesh-latest.json context_budget_tokens=100000); re-measure 28 Oct. OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d).
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.

- MAPS TIMER 28-day LIVE (next Sun 22 Nov 14:00Z; END 2028-12-17, extend before). konnex-ops OS restart: plan quiet window with Marcus.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 FOLLOW-UP PR (mine, one): full item list in /home/shared/jack-ps01-v2-followups-2026-10-27.md (ticket PIPELINE-STATE-01 3fb2300f-2ecb-81ab-9a65-c615331b5f8f).

## Remaining
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
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
