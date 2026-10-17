---
task_id: MARKET-PULSE-WWW-01
agent: jack
session_id: 92171f1c-d0d7-4b2f-9c37-1e8b52aed6cf
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-17T00:46:00Z
notion_task_id: 3fa2300f-2ecb-8102-b961-e98e3555e03a
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME 17 Oct ~00:46Z: (1) Matt does the 13 prod applies ~02:00Z (1pm AEDT): either he adds a /permissions allow rule (then I apply in list order via hash-check, verify each, merge PRs, provision dashboard + collector/snapshot units, restart grafana for jit, ff runner after 230) or he runs them. (2) Build PS01 v2 C1/C4/C5 (spec v0.2). (3) #375 in Rajesh QA. Dry runs ONLY via kdp main scripts/prod-dry-run.sh.
- !! DEPLOY-ORDER HAZARD: do NOT ff /home/jack/projects/market-intelligence (runner checkout) until Grace mig 230 (PIPELINE-STATE G1/G3) is APPLIED on prod; her code needs its table/view or the 18:00Z/20:00Z recheck timers fail. Applies to every ff (incl. after #357).
- RESUME FIRST (23:58Z): MARKET PULSE on uat with ALL 3 layers LIVE (feed api.konnexlabs.com; prod konnex-api 5bc984d tree 87b94f0; flag on; Marcus UAT GO e4b9c6ee). Migs 222/225/223/227 applied+QA'd; pulse_api login (NOINHERIT, member pulse_ro, pg_hba 151 hostssl 77.42.94.228). Rajesh: feed live probe PASS bdb49550, J4 uat page PASS c4721226, Olivia bundle c2d8832 on uat (edge age capped 300s VERIFIED). J5 stale-check expects 3 layers. Runbook rev3 /home/shared/jack-market-pulse-feed-golive-runbook-20261015.md (s4 off switch: flag + empty-commit Vercel redeploy; uat Olivia / www Jack). NEXT: off-switch DRILL on uat after Marcus shows Matt (I flip flag, Olivia 4.2, Rajesh verifies at edge). www OFF until drill + Matt.
- AK-PRESENTATION-P1-01 parent 3fa2300f-2ecb-81a3-b07e-da77bbaa344c (Matt 6021cf9d; contract www docs/briefs v1.1 #62; fixtures /home/shared/rajesh-ak-p1-fixtures-2026-10-15.md). Phase 1 built+live (see below). Open on parent: step 3 = ad hoc allowlist on mig 217 coarse view (Grace) + registry entry nsw_plumber_business_coarse_counts.
- website-facts v2 + abr_link + R1 merged, runner ff'd; W43 Mon 19 Oct 05:00Z (Grace checks exit + PII_SCAN). www HOLD (Matt via Marcus 1012d862, answer this evening). OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page; apex 307 -> Matt (Vercel). Use REST, never 'gh pr edit'.
- PLANNING timer: watch 5 Nov 03:00Z (first real month); TODO MONTHLY_HC_URL in konnex-monthly-planning.env.
- EXEC-REPORT-01 3ed2300f-2ecb-814f-a15e-d211fe8a7298: TODO IVI freshness flag, exit-4 alert, EXEC_REPORT_HC_URL.
- www releases 16 Oct DONE: ABOUT-V2-01 (f6747fc) + FOOTER-MATCH-01 (bbd6433), both Rajesh post-deploy PASS, tickets Done + Prod Verified.
- !! INCIDENT 19:02Z: my no-BEGIN dry run committed 244's VIEW on prod (comment not). 0/0 diff, no reader impact. Not reverted; reported to Matt (Telegram) + Ada/Rajesh/Marcus. Marcus: KEEP (94d7a678); 244 = kdp #374 PASS @4e14a0e (on pending list; apply needs human). Guard tool #373 MERGED a097470 (scripts/prod-dry-run.sh). #372 PASS-pending: needs a 243 tool dry run AFTER 244 is applied.
- V2.3 BUILD (Ada): kdp #372 DRAFT, DO NOT MERGE before 20 Oct v2.2 validates; needs Ada coverage-view filter mig BEFORE 243 (579ac1ae).
- DEMAND TIMER live: first fire Tue 20 Oct 03:11Z (exit 75 if Sep unpublished); re-read DFS balance 19 Oct (need >= US$10.81). Nov = v2.3 (#372): Rajesh verifies DEMAND_RUN_APPROVED v2.3/116/cap 12 + G3 probe (~US$3.60), then DFS >= US$12.81, then timer PR; v2.3 merges only after Oct run validates.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.

- PS01 v2 (Walter 17 Oct, spec v0.2 Marcus 76d2a458): C2+C3+C6 = kdp #375 (mig 245 + panels, branch jack/pipeline-state-06 @a58cbdb, sub-ticket 3fc2300f-2ecb-811b-b7fc-c0f1f09a1ee6) with Rajesh. NEXT: C1 issues model (owner + next action; resolved visible 30d; Grace usage_mismatch), C4 quota provider vs internal + cost labels, C5 Published intelligence (profile + AK, lineage 'declared'). Then tell Matt -> he sends the pilot readiness brief. Panel generator = /home/shared/jack-ps01-work/panel-gen.js (writes into kdp-wt-ps01 JSON; node it from that worktree).
- SEAM-UNIVERSE-01 (3fb2300f-2ecb-81c9-b919-cc2cb555da51): mig 233 #360 PASS (sha 533959ae @afd41a0); apply needs human; then merge, Ada swaps 3 panels.
- PS01: ALL PRs PASSED QA (17:35Z). Stack #361(232)->#362(234)->#365(237)->#366(238)->#368 panels; Grace #363(235)->#364(236)->#370(241)->#371(242), #367(240) on #358; Ada #369(239) on 01. 12 applies waiting for human: /home/shared/jack-pending-prod-applies-2026-10-16.md (heads + sha256 there). After applies: merge in order (retarget to main), provision dashboard, install collector + snapshot units, restart grafana (jit), ff runner after 230.  TODO: collector retention, runner job_run_finish (G2/G5), 238 N1 (abs _current).
- PIPELINE-STATE-01 parent 3fb2300f-2ecb-81ab-9a65-c615331b5f8f (est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md; Matt GO e769d579). My gaps G2,G4,G5,G7,G12. SVI-RETIRE done; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.

- AGENT TOKENS (po #340): alex + jack lack token files (Matt runs save-agent-token; I restart konnex-agent-tmux@<agent>).
- MARKET PULSE parent 3fa2300f-2ecb-8102-b961-e98e3555e03a (Matt GO e39baaf6): www when Marcus done-list a-f met; Market Pulse www HELD by Matt. MARKET-PULSE-REVIEWS-01 later (mine).
- AK follow-ups (Marcus a381952f): held-region UNSUPPORTED state; www flip rollback rehearsal; 217 allowlist; plumber_count withhold into source control; de-dupe 5,773 paragraph.
- NEXT CARDS (Matt 1c38546d): NSW total via v1 measures template, website presence, recent activity; MARKET-PULSE-REVIEWS-01 3fa2300f-2ecb-81af-a5b1-ed35bc9d3801.
## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture details response, licensee allowlist, flip DETAILS_SHAPE_CONFIRMED.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle 3ed2300f-2ecb-81f5-9049-dc04e0634c43; SUPPLY-UNIVERSE-01 follow-ups on its ticket; Vercel bypass rotation = Matt.

## Resume notes
- Other open: AGENT-DEPLOY-API-01 (TODO), GRAFANA-SERVER-RESOURCES-01 (blocked on Phase-2 sweep), CLAUDE.md tier cleanup (via Marcus).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs kdp #261-#263 + #241 still await Rajesh light review.
- Times to Matt in AEST; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
