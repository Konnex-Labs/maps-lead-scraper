---
task_id: API-SELF-SERVE-01-S1
agent: jack
session_id: b041f69e-b6ea-4a65-8104-863c30033df0
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-29T06:03:21Z
notion_task_id: 4072300f-2ecb-81f7-a657-c9e35dee1b16
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = SUB SWITCH (Matt f14af033de7ff0fb, 29 Oct 06:00Z): move Raj + Marcus off API keys back to the Max sub; Marcus keeps his role and rhythm. How it works: konnex-agent-claude-loop uses the API key when ~/.config/konnex/anthropic-api-key exists, else claude-oauth-token; the log line 'starting claude ... auth=' in /var/log/konnex/agent-claude-loop-<a>.log shows which. My mv of both key files AND disabling konnex-agent-api-spend-rajesh.timer were DENIED by the auto-mode classifier; do NOT work around this. Sent Matt the 3 commands at 06:05Z. NEXT: check whether the key files are gone (ls as each agent) -> when gone, ask Raj to agent-request-restart at a safe point -> confirm both log lines say auth=token-file, and read the panes for an auth banner (Raj token 24 Oct, Marcus 10 Oct; may need re-minting by Matt) -> tell Matt. Carlos is also on an api-key; Ada and Grace have key files but start on token-file (Matt asked whether to move them).
- RESUME HERE = S2b (ticket 4072300f-2ecb-81b5-a0d2-c09fe08131c2): ALL MERGED, nothing deployed. #147 8e4d37c (Raj QUALIFIED 1d88808762f9317f), #148 Q1 06831d0 + contract #146 r4 f98d0e9 (Raj PASS 2aeb598d33b8ad6c). Ticket reset to In Progress 22:24Z; RECHECK in case the watcher flipped it Done again. BLOCKED on Matt for W0: DNS A uat-api.konnexlabs.com -> 77.42.94.228 + UAT Supabase project. W0 steps: schema-only dump of api_events/api_profiles; check api_key_prefix is nullable; unit /opt/konnex-api-uat :3467 User=jack; CORS_ORIGINS exactly https://uat.konnexlabs.com; Caddy deploy/uat/Caddyfile.uat-api -> UAT deploy -> Raj UAT ACs 3, 11, 13, 14, 20. Docs nits (later, light PR): README row W0-W8/AC1-20; W5(a) wording -> web_free_answer.
- S2 CUTOVER (all S2 build merged #139-#144): NEXT operator prod dry runs (scripts/s2-ledger-dry-run.sh + sql/*precutover-counts_*.sql on konnex-api, post to #139) -> B2 apply, gated on sha 124e4a1f79624db4e0242c265128b39489c184675daa9d1c8d2aa6ed3f161a36 -> prod deploy flag OFF. Flag-on preconditions: Telegram spend alerts, email verification, CORS PUT, B11 systemctl cat, A2/A3/A5. #135 rollback ~/kapi-prod-pre-pr135-20261028T1422Z.tgz. Open with Matt: G1 tax, G2 legal, D7 pool size.
- RECHECK S2 ticket 81a3 still In Progress (#145 footer = S2; watcher may flip Done). Follow-up mine: profile endpoint must consult publication-registry before API reuse. Matt pending: retire Connect contact-reveal routes. SEC follow-ups 813f/8173/8107/81b2 (Marcus, Backlog). TELL MATT: GH main required-reviews; revoke Raj old qa PAT.
- MAPS-CLOSURE cohort label fix = Grace mig 269 (kdp #412, Raj R1 REQUEST_CHANGES ebf9ba76 with Grace); on Raj PASS: dry-run -> apply as postgres -> merge -> stamp.
- RAJ CREDIT CRITICAL 23:00Z (~US$27.58 Inferred, ~0.9 days; Matt nudged 23:01Z to top up or turn on auto-reload; on his new balance, re-anchor the ledger). RAJ ALERT LIVE (ops #356 2e294db). Ledger re-anchor pending Matt OK. Trial ticket 4032300f-...-81e5 stays In Progress. LEAN CLAUDE.md shrink, re-measure 28 Oct. Matt open: 2nd vendor, fleet plan after ~31 Oct invoice.
- DFS NEXT: live DFS balance >= $12.81 read right before drop-in -> cap-12 drop-in -> re-enable demand timer before 20 Nov; OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d).
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.

- MAPS TIMER 28-day LIVE (next Sun 22 Nov 14:00Z; END 2028-12-17, extend before). konnex-ops OS restart: plan quiet window with Marcus.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 follow-up PR (mine): /home/shared/jack-ps01-v2-followups-2026-10-27.md.

## Remaining
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
- MARCUS TODO: trim his startup ctx (38%); check his Notion use on API key. TICKET: dedupe Stop-hook ckpt notices; exit banner says 'Agent: jack'; 28 Oct 20:58Z a Clean Exit hook made an unpushed [WIP] commit f0e93f4 in my kapi main clone. MINE: privacy-policy account-data section + retention (Matt's call, precedent 24mo) = sign-up flag-on precondition; ticket S3a 4072300f-2ecb-8167-8bae-e0f867153614 (Backlog, mine).
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39): tracker 4032300f-2ecb-819d-9943-d99722b2ff95; week: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. Fleet re-mint HELD.
- API TRIAL LIVE (Raj api-key, #349). Week-end tab vs Console ~31 Oct.
- AGENT-LEAN-01 (4032300f-2ecb-8163-af43-f9578ec41e9b): (1) 150k budget LIVE 12:50Z (ops #355 c39172e, CLAUDE.md pushed 8/8; rollback agent-statusline.sh.bak-pre-pr355-*). Olivia on subscription (token fixed 13:01Z); Carlos -> API key (one key per agent in agent-runtime workspace, Matt creates 'carlos' key) + on-demand. (3) on-demand spec /home/shared/jack-agent-lean-on-demand-seats-spec-2026-10-24.md (now Alex+Carlos only; Olivia out). (2) my MEMORY.md shrunk 99->41KB; CLAUDE.md shrink TODO. Then measure.
- Standing: stamp Prod Verified At on every migration applied.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
