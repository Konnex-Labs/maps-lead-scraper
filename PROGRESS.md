---
task_id: MARKET-PULSE-WWW-01
agent: jack
session_id: 4de99c83-7839-4a67-b461-63df54cbebb5
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-17T23:18:00Z
notion_task_id: 3fa2300f-2ecb-8102-b961-e98e3555e03a
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- website-facts v2 + abr_link + R1 merged, runner ff'd; W43 Mon 19 Oct 05:00Z (Grace checks exit + PII_SCAN). www HOLD (Matt via Marcus 1012d862, answer this evening). OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page; apex 307 -> Matt (Vercel).
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- kdp #372 (Ada v2.3) PASS 603c9478 @8136d55: HOLD till 20 Oct v2.2 run validates; then 252 (Ada; kdp #383 PASS 879e3ca1 @b1a74e9, mig sha256 9a35a23a.., rollback b01b9af7..; apply as postgres via tool, merge AFTER apply so ticket isn't Done early; Rajesh+Ada post-apply check) -> 243 (postgres) -> merge -> timer PR (--max-cost 12, Rajesh diffs). 227 stays v2.2. Details: /home/shared/rajesh-qa-kdp-372-2026-10-17.md
- DEMAND TIMER live: first fire Tue 20 Oct 03:11Z (after it validates: save feed JSON witness to /home/shared, Ada s9) (exit 75 if Sep unpublished); re-read DFS balance 19 Oct (need >= US$10.81). Nov (v2.3): DEMAND_RUN_APPROVED v2.3/116/cap 12 + G3 probe (~US$3.60), DFS >= US$12.81.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.

- DONE 17 Oct (history in git/Notion): PS01 v2 release, migs 249/251/253 (FP-READINESS live, ticket Done). ABOUT-EXAMPLE-01 (#70 Matt merge) + LAYOUT-WIDTH-01 (#71) live, Rajesh post-deploy PASS 3dfeb8a7. api.latency_sla 75f69ed1 auto-resolved (profile endpoint structural ~860ms p95; triage /tmp/pipeline-incident-75f69ed1-*/triage.md) -> ticket: cache profile payload in konnex-api or own SLA. Open from them: close #375/#376 (Matt); relabel CC panels 5/14 WorkClear calls->units; FP N3/N5/N6 + G4; Grace F1/F2 after W43.
- INSIGHTS-HUB-01 (3fc2300f-2ecb-81ca-a097-fe6cb019fae7; Matt a87d75b6, Marcus 4869c489): my section 9 (serving view/endpoint + publication registry entry per AVAILABLE row) in /home/shared/marcus-insights-hub-step1-inventory-v0.1-2026-10-18.md rows 1-7 filled; section 9 WRITTEN 17 Oct ~17:15Z (J1-J6). Marcus rulings 9c5fba1d DONE 22:28Z: top_service_suburbs WITHHELD (konnex-api /home/jack/.env, bak .env.bak-20261017-ak-withhold); apprentice_count + recent_activity KEPT live; J1 DONE: konnex-api #117 deployed 22:36Z (prod 00b96ec = 5bc984d + git am; rollback git revert 00b96ec + restart); live AK answer has attribution x1; Rajesh live gate pending. Rajesh live gate PASS 699f656c. AK-SOURCE-LABELS-01 DONE: #117+#118 live (prod c00df70) + on main (d3ff13a); live gate PASS d14ccbb6. Follow-ups on ticket: website caveat can double (prose + code; make check semantic), badge date = snapshot, Verified wording vs Grace Q12; Olivia AK page copy (www).
- SoD RULED: Matt a87ef392 option A: I may deploy my own builds iff Rajesh PASS bound to exact hash + hash-gated + Rajesh post-deploy check + rollback ready; my www builds = Matt's click (memory project_sod_exception_jack_deploys_own_builds); written into Notion Charter as Amendment A1 to s5 (Matt 14d86cbb); Cortex: active authority record now :1.3+A1 (id 22372c33, supersedes 1.3 row); v1.4 = Matt/Marcus.
- MAPS WEEKLY (Matt 175690ef/0ac89a3f): sweep RUNNING crawl 6426 (service started by me 22:48:00Z, pid 4164550, ~US$19.68 proj, cap $30; Grace watches + reads back). Timer v2 UTC INSTALLED 22:50Z (Rajesh 928f4ab2; NEXT Sun 25 Oct 14:30Z; bak .timer.bak-20261017-monthly). Then: run-monthly-maps.sh header 'Monthly'->weekly (cosmetic), PIPELINE-STATE maps_sweep cadence/registry + FP inputs_due unaffected (25 Oct/1 Nov before 10 Nov).
- FP gate events from the Step 1 audit inserted 23:15Z (rows 1, 3, R, P; Marcus f517c505). PS01 follow-up mig: maps_sweep registry cadence monthly->weekly. Verify crawl 6426 writes maps_sweep checked result on completion; abn_sweep first verdict Tue 20 Oct 21:00Z (mig 249).
- DOCS: #72 (Matt brief) + #73 (Step 1 audit, merged 1a005f9) on main; folder link sent. Next docs PR when Marcus sends refreshed outputs (C2 base 3,149 still 4x in v1.2) / Step 2 pack.
- PS01 v2 SHIPPED (245/246/247 live, #377). MY FOLLOW-UP PR (one): 246 F2/F3/F6; 247 N1-N5 (conditional seed, link TRUNCATE guard, issue_id check, hermetic A15/A17, RETIRED lineage) + G4 (state snapshot table, 9s views); automated serving_probe in ops-timer-collector (probes age out 24 Oct -> UNKNOWN); collector retention; 238 N1; entity_map stale_after (hourly, OK on 13 Oct check: Rajesh 29d7d15f); #375 nits (grid cols, freshness 90d, re-grant runbook). MY G2: run-website-crawl.sh job_run start+finish + website_crawl adapter -> validated (next crawl Mon 19 Oct; ':r2' re-run keys); supply change refresh ledger+adapter (ed.2). AK follow-up: Q9/Q13 'we don't have' wording for withheld views.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.

## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- Later: PLANNING timer 5 Nov 03:00Z (MONTHLY_HC_URL TODO); alex+jack agent token files (Matt save-agent-token, then restart konnex-agent-tmux@).
- Other open: AGENT-DEPLOY-API-01, GRAFANA-SERVER-RESOURCES-01 (blocked), CLAUDE.md tier cleanup (Marcus).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs #261-263/#241 await Rajesh.
- Times to Matt in AEDT; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
