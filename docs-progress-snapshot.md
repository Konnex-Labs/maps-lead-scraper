---
task_id: AGENT-API-TRIAL-01
agent: jack
session_id: 8a64690a-f8e7-43de-919e-be4a4a6c9e9d
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-24T04:02:00Z
notion_task_id: 4032300f-2ecb-81e5-8658-fa215ff0c827
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- ENG-OVERVIEW-01 (ticket 4032300f-2ecb-81d7-a94b-d90ad2176bc0): external 4032300f-2ecb-8146-b27a-e7361450dac6 (Matt happy); internal copy w/ Go deeper links 4032300f-2ecb-81b3-9928-f420f1213cc7 (route B). Open: draft banner on external (asked Matt), Rajesh security read before sharing.
- Missed exec report 23 Oct (Notion 502, no retry): TODO add retry to daily-exec-report.
- COMMAND CENTRE: #394 + #396 LIVE (backup .bak-pre-pr396-20261018T124857Z; rollback = re-install), NCVER-MAR26-01 done (#395). NEXT dashboard PR (bundle): Needs-attention column trim (C1 test pins columns), Derived jobs to action-first columns, Next run due overdue -> 'overdue' not '0 secs' (Rajesh 13a2ad00), nested Outcome colour.
- OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page; apex 307 -> Matt (Vercel).
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- kdp #372 (Ada v2.3) PASS 603c9478 @8136d55: HOLD till 20 Oct v2.2 run validates; then 252 (Ada; kdp #383 PASS 879e3ca1 @b1a74e9, mig sha256 9a35a23a.., rollback b01b9af7..; apply as postgres via tool, merge AFTER apply so ticket isn't Done early; Rajesh+Ada post-apply check) -> 243 (postgres) -> merge -> timer PR (--max-cost 12, Rajesh diffs). 227 stays v2.2. Details: /home/shared/rajesh-qa-kdp-372-2026-10-17.md
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.

- Open from 17 Oct: api.latency_sla ticket (cache profile payload or own SLA); close #375/#376 (Matt); relabel CC panels 5/14; FP N3/N5/N6 + G4; Grace F1/F2 after W43.
- INSIGHTS-HUB-01 3fc2300f-2ecb-81ca-a097-fe6cb019fae7: J1 + AK-SOURCE-LABELS-01 live (prod c00df70, gates PASS). Follow-ups on ticket: website caveat can double (make check semantic), badge date = snapshot, Verified wording vs Grace Q12; Olivia AK page copy (www). Docs #74/#75/#76 merged, links with Marcus.
- MAPS WEEKLY: 6426 + v49 + migs 254/255 all DONE (tickets Done). Next sweep Sun 25 Oct 14:30Z (Matt tops up DFS first, 773b357b). konnex-ops 'restart required' (OS update): plan a quiet window with Marcus, not unilateral.
- AK-SNAPSHOT-ALIGN-01 3fc2300f-2ecb-818b-840c-f8b69d8fbf18: 02:47Z re-check Rajesh PASS cc59b1ef. D2 fix kdp #387 LIVE (merged 83d3d8f; now @8e93af0 (wrapper blob e3f721d726c5); rollback b3d7370). VERIFY Sun 25 Oct 14:30Z run (log 4 steps OK + supply_snapshot_set cause_ref post-sweep + AK Q1=Q3) with Rajesh after 15:15Z.
- PS01 v2 SHIPPED (245/246/247 live, #377). MY FOLLOW-UP PR (one): 246 F2/F3/F6; 247 N1-N5 (conditional seed, link TRUNCATE guard, issue_id check, hermetic A15/A17, RETIRED lineage) + G4 (state snapshot table, 9s views); automated serving_probe in ops-timer-collector (probes age out 24 Oct -> UNKNOWN); collector retention; 238 N1; entity_map stale_after (hourly, OK on 13 Oct check: Rajesh 29d7d15f); #375 nits (grid cols, freshness 90d, re-grant runbook). MY G2: run-website-crawl.sh job_run start+finish + website_crawl adapter -> validated (next crawl Mon 19 Oct; ':r2' re-run keys); supply change refresh ledger+adapter (ed.2). AK follow-up: Q9/Q13 'we don't have' wording for withheld views.
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.
- VENDOR-NAME-OFF-01 DONE: #122 (0b3c2b42) + #123 (277b54e1) merged, prod konnex-api = 26f147a (rollback 3a4b565, then 17c1521); www #83 live. Rajesh live PASS 4b90c8d0. Open: AK-WC-IDENTIFIER-01 3fd2300f-2ecb-81ff-899e-ebeab38cafbc (bundle w/ next konnex-api change); Ada drops '(DataForSEO)' from 12m basis (scrubbed meanwhile).
- MAPS-CLOSURE-01 LIVE: 256 applied (Matt ~07:00Z, Rajesh live PASS), #390 + #389 merged, mi-weekly-cron @8e93af0 (rollback 83d3d8f). 25 Oct check: ce317efc leaves cohort (-1).

## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- AGENT PLAN (Matt GO 76bf8d39/fd59b64f): tracker on review 4032300f-2ecb-819d-9943-d99722b2ff95. THIS WEEK: AGENT-LEAN-01, AGENT-API-TRIAL-01, BOARD-RESET-01, PLAN-CADENCE-01, MARCUS-ROLE-01. API trial: Console steps sent to Matt 03:58Z; verify the key file exists (ls -l ~rajesh/.config/konnex/anthropic-api-key, mode 600) before acting; then loop change (/usr/local/bin/konnex-agent-claude-loop load_oauth_token): docs say ANTHROPIC_API_KEY > apiKeyHelper > CLAUDE_CODE_OAUTH_TOKEN, BUT interactive sessions prompt once to approve an env API key (our tmux agents are interactive = hang). Plan: per-agent settings.json apiKeyHelper reading the key file + loop unsets the OAuth token when the key file is valid (AUTH_SRC=api-key-helper). TEST no-prompt in a throwaway tmux session first. Ops PR + Rajesh QA. ENG-OVERVIEW: cleared to share (Rajesh 051b6c47); Maps raw-responses line = Matt's call. Fleet re-mint HELD.
- Later: PLANNING timer 5 Nov 03:00Z (MONTHLY_HC_URL TODO); alex+jack agent token files (Matt save-agent-token, then restart konnex-agent-tmux@).
- Other open: AGENT-DEPLOY-API-01, GRAFANA-SERVER-RESOURCES-01 (blocked), CLAUDE.md tier cleanup (Marcus).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs #261-263/#241 await Rajesh.
- Times to Matt in AEDT; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
