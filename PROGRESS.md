---
task_id: AGENT-API-TRIAL-01
agent: jack
session_id: 923de99b-0104-42a3-ae69-b1ce96ab792e
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-26T20:00:00Z
notion_task_id: 4032300f-2ecb-81e5-8658-fa215ff0c827
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE = mig 266 DONE: #410 MERGED 2c50f13 14:09Z 26 Oct (Raj PASS+GH approve, Ada cond-3 OK d0493019, verify /home/shared/jack-mig266-postapply-20261026.txt). SIG B Raj 2190af1b (99466d9; month 2026-10 only, 115 tasks est $10.35, max-cost 12). NEXT: stamp Prod Verified (ticket 4042300f-2ecb-8179-97c1-c6748cec6629); live DFS balance >= $12.81 read right before drop-in (needs DFS creds: auto-mode blocked me, operator decides) -> cap-12 drop-in -> re-enable demand timer before 20 Nov; Ada reconciles. Raj 25 Oct spend SENT Matt 06:4xZ: est $23-27 (Sonnet 5 rates, Inferred; script /home/shared/jack-raj-token-usage-by-day.py run by Rajesh). Raj budget 100k DEPLOYED 06:30Z (Matt GO 2d745143; settings env, bak .pre-deploy-2026-10-26T06-30-03-209Z); live at his next session (verify agent-stats/rajesh-latest.json context_budget_tokens=100000); re-measure 28 Oct. OneGov replied 26 Oct (GSD-331572): sent Matt reply draft, 10k/mo ask; on approval raise NSW_TRADES_QUOTA_CAP (now 2500). G3 RECORDED (validation id 7 rejected, Raj G1-G4 PASS 3a0a18e8, recorded_by_role accepted). HELD 1: Bondi Junction 9060915 -> Ada amendment PR (new manifest/registry shas) -> Raj QA -> sig B -> I install cap-12 drop-in before 1 Nov 00:00Z. Nothing on me until Ada PR. Node DB URL needs ?uselibpqcompat=true&sslmode=require; demand_runner from konnex-ops hostssl. 25 Oct maps sweep DONE: Rajesh PASS 678d0a81, AK-SNAPSHOT-ALIGN-01 ticket Done + Prod Verified. 5,983 OVERSTATED ~47 (Grace dcd67507: 123 new entrants unscreened by cohort rules). Grace mig (rerun accepted excl rules + post-sweep step) -> Raj QA -> I apply -> manual snapshot_supply_set. Marcus decides note/hold (I rec none, 6e031c7d). DFS bal $30.70 (covers 22 Nov sweep; Matt told). PRIVACY-CONTACT-01b LIVE (PR 97 7f84026d).
- DISK konnex-ops 85% WARN (system c754689e, Raj d6ab5240; 21G free, stable): prune MY /home/jack: backups 4.4G (check age), stale kdp-wt-*/kapi worktrees, actions-runner(s) 3.6G (check in use), .vscode-server 4.5G old versions. Ask Olivia to prune her 24G projects/.npm. Standing disk authority (dead scratch/caches only).
- WWW 26 Oct: #100 V6 + #101 AK-TALK LIVE (53e338f, 3352fb7); Olivia smoking.
- Olivia -> Sonnet 5.5 on next restart (Matt e4440276; bak-pre-sonnet55-*). Carlos api-key + Sonnet 5.5, OFFLINE (restart on request). Olivia on-demand spec update on Matt OK.
- APEX DNS (Matt, after his domain-host login fix): set konnexlabs.com single A @ -> 216.150.1.1 (remove 216.198.79.1 + 76.76.21.21); verify with dig on his ping. 308 redirect DONE 10:42Z.
- OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also konnex-qa (Rajesh push, c7eea71e); same fix.

- INSIGHTS-HUB-01 3fc2300f-2ecb-81ca-a097-fe6cb019fae7: J1 + AK-SOURCE-LABELS-01 live (prod c00df70, gates PASS). Follow-ups on ticket: website caveat can double (make check semantic), badge date = snapshot, Verified wording vs Grace Q12; Olivia AK page copy (www). Docs #74/#75/#76 merged, links with Marcus.
- MAPS TIMER now 28-day (Matt 2a9f1fe3, Grace 144ca335) LIVE 13:15Z: 25 Oct 14:30Z then Sun 14:00Z from 22 Nov; explicit dates END 2028-12-17 (extend before). Bak *.bak-20261025T1315Z. konnex-ops 'restart required' (OS update): plan a quiet window with Marcus, not unilateral.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- PS01 v2 FOLLOW-UP PR (mine, one): dashboard label probe/G-gate validation rows 'probe - rejected by design' not FAILED (Ada b06c5f67); 246 F2/F3/F6; 247 N1-N5 (conditional seed, link TRUNCATE guard, issue_id check, hermetic A15/A17, RETIRED lineage) + G4 (state snapshot table, 9s views); serving_probe in ops-timer-collector (probes age out 24 Oct -> UNKNOWN); collector retention; 238 N1; entity_map stale_after; #375 nits (grid cols, freshness 90d, re-grant runbook). G2: run-website-crawl.sh job_run + website_crawl adapter; supply change refresh ledger+adapter. AK Q9/Q13 wording for withheld views.

## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39): tracker 4032300f-2ecb-819d-9943-d99722b2ff95; week: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. Fleet re-mint HELD.
- API TRIAL LIVE 05:12Z (Raj auth=api-key, #349 03dd0ca; rollback: loop .bak-pre-pr349-* or move key + restart @rajesh). TODO: low-balance alert; Raj clean full day 25 Oct UTC to Matt Mon AEDT (Console 09:23Z: $15.01 total, ~$9.6 24 Oct, ~$5.3 25 Oct to 08:56Z, pace ~$14/day ~$420/mo; propose session-length cap if >$12/day); week-end tab vs Console.
- AGENT-LEAN-01 (4032300f-2ecb-8163-af43-f9578ec41e9b): (1) 150k budget LIVE 12:50Z (ops #355 c39172e, CLAUDE.md pushed 8/8; rollback agent-statusline.sh.bak-pre-pr355-*). Follow-up N1: (ctx.get('current_usage') or {}) in stats writer. Olivia on subscription (token fixed 13:01Z); Carlos -> API key (one key per agent in agent-runtime workspace, Matt creates 'carlos' key) + on-demand. (3) on-demand spec /home/shared/jack-agent-lean-on-demand-seats-spec-2026-10-24.md (now Alex+Carlos only; Olivia out). (2) my MEMORY.md shrunk 99->41KB; CLAUDE.md shrink TODO. Then measure.
- LEAN TODO: msg-acked helper, nudge text, status cmd, progress/ticket helper, work-tab #12, db-schema N2-N4.
- MATT-DB-RO-01 follow-ups: H1-H4, sshd PasswordAuthentication ticket, conn limit 6 if asked.
- Later: PLANNING timer 5 Nov 03:00Z (MONTHLY_HC_URL TODO); alex+jack agent token files.
- Other open: AGENT-DEPLOY-API-01, GRAFANA-SERVER-RESOURCES-01 (blocked), CLAUDE.md tier cleanup (Marcus).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs #261-263/#241 await Rajesh.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
