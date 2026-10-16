---
task_id: MARKET-PULSE-WWW-01
agent: jack
session_id: fd4e032e-28af-4b14-84d6-b0f4d9a82f2a
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-16T16:11:00Z
notion_task_id: 3fa2300f-2ecb-8102-b961-e98e3555e03a
context_needed:
  files: [/home/shared/jack-market-pulse-feed-contract-v0.1-20261015.md, /home/shared/jack-market-pulse-feed-fixtures-20261015/, /home/shared/jack-ak-p1-recapture-2026-10-15/]
  branches: [konnex-api main (prod = cherry-pick tree, deploy worktree kapi-wt-deploy106 @6b96a97), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- !! DEPLOY-ORDER HAZARD: do NOT ff /home/jack/projects/market-intelligence (runner checkout) until Grace mig 230 (PIPELINE-STATE G1/G3) is APPLIED on prod; her code needs its table/view or the 18:00Z/20:00Z recheck timers fail. Applies to every ff (incl. after #357).
- RESUME FIRST (23:58Z): MARKET PULSE on uat with ALL 3 layers LIVE (feed api.konnexlabs.com; prod konnex-api 5bc984d tree 87b94f0; flag on; Marcus UAT GO e4b9c6ee). Migs 222/225/223/227 applied+QA'd; pulse_api login (NOINHERIT, member pulse_ro, pg_hba 151 hostssl 77.42.94.228). Rajesh: feed live probe PASS bdb49550, J4 uat page PASS c4721226, Olivia bundle c2d8832 on uat (edge age capped 300s VERIFIED). J5 stale-check expects 3 layers. Runbook rev3 /home/shared/jack-market-pulse-feed-golive-runbook-20261015.md (s4 off switch: flag + empty-commit Vercel redeploy; uat Olivia / www Jack). NEXT: off-switch DRILL on uat after Marcus shows Matt (I flip flag, Olivia 4.2, Rajesh verifies at edge). www OFF until drill + Matt. Grafana '<3' fix DONE (kdp #353 321ef32, installed to /var/lib/grafana/dashboards/konnex, live v2). C2 check 16 Oct 02:30Z.
- AK-PRESENTATION-P1-01 parent 3fa2300f-2ecb-81a3-b07e-da77bbaa344c (Matt 6021cf9d; contract www docs/briefs v1.1 #62; fixtures /home/shared/rajesh-ak-p1-fixtures-2026-10-15.md). Phase 1 built+live (see below). Open on parent: step 3 = ad hoc allowlist on mig 217 coarse view (Grace) + registry entry nsw_plumber_business_coarse_counts.
- website-facts v2 + abr_link + R1 merged, runner ff'd; W43 Mon 19 Oct 05:00Z (Grace checks exit + PII_SCAN). www HOLD (Matt via Marcus 1012d862, answer this evening). OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page; apex 307 -> Matt (Vercel). Use REST, never 'gh pr edit'.
- PLANNING: konnex-monthly@planning.timer live; watch 5 Nov 03:00Z first real month (2026-10). TODO: MONTHLY_HC_URL in /home/shared/config/konnex-monthly-planning.env. GOV-D1 = Ada.
- EXEC-REPORT-01 (3ed2300f-2ecb-814f-a15e-d211fe8a7298): live; TODO IVI freshness flag (Marcus b711acc1), exit-4 alert, EXEC_REPORT_HC_URL; Rajesh closes.
- DEMAND TIMER live: first fire Tue 20 Oct 03:11Z (exit 75 if Sep unpublished); re-read DFS balance 19 Oct (need >= US$10.81); Nov run = v2.3 +40 (Botany replaces Hunters Hill; Ada contract v1.3, Rajesh PASS w/ conditions): before 20 Nov Rajesh verifies new DEMAND_RUN_APPROVED (v2.3/116/cap 12) + G3 probe (~US$3.60), then I re-read DFS >= US$12.81 (12 + 0.72 reserve + 0.09; Rajesh 0ba163b2), then timer PR; v2.3 merges only after Oct run validates; TODO RESULT line for 27/28 alert.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.






- VERIFIED option A (Matt 5f26e7a3): mig 228 APPLIED 16 Oct 10:05Z + Rajesh post-apply PASS; closed (Grace owns ticket + 2 nits; customer wording waits for Regulation read).
- PIPELINE-STATE-01 (ticket 3fb2300f-2ecb-81ab-9a65-c615331b5f8f, est 2-3; spec /home/shared/marcus-pipeline-state-01-spec-v0.1-2026-10-16.md): my gaps G2,G4,G5,G7,G12 + registry/contract (start now, parallel). SVI-RETIRE DONE (timer disabled 16:07Z, mig 231 16:08:59Z, #357 merged 646b9f4, 12 Grafana titles live; left: briefing SVI line + /api/v1/search-volume 410 konnex-api PR). Grace G1/G3 = kdp #358 (229 sha 2ab07522, 230 sha 44e71bf7) in Rajesh QA: apply 230 BEFORE any MI ff. MATT APPROVED MOCK-UP FOR BUILD (e769d579 via Marcus 3f04657b). DO NOW on resume: build ops_source_registry + adapter column contract (spec s-sections; G12 = every run_kind except sample counts, kind shown; health defs from Marcus spec), then G2/G4/G5/G7 + per-host timer collector + ops_source_state; SVI = RETIRED row.
- ONEGOV-NOV1-SWEEP-01: timer next 1 Nov 00:00Z. ON 1 NOV: licence_recheck_run <=1100 onegov calls, 0 WorkClear, Oct batch re-checked; tell Marcus + Grace.


- AGENT TOKENS (po #340): alex + jack lack token files (Matt runs save-agent-token; I restart konnex-agent-tmux@<agent>).
- AK www re-flipped 15 Oct (Marcus 58eca0e7, Rajesh 0464bb35/4676d4d6). Follow-ups: plumber_count withhold into source control/deploy config; de-dupe 5,773 paragraph in next card PR; rollback rehearsal (quiet window).
- MARKET PULSE (parent MARKET-PULSE-WWW-01 3fa2300f-2ecb-8102-b961-e98e3555e03a; Matt GO e39baaf6; www when Marcus done-list a-f met; www-ready ~21-22 Oct AEDT). J1 ABS DONE (run abs8731-202608-a, timer konnex-monthly@abs8731 live). J2 feed = mine NEXT (see RESUME FIRST). J4 page = Olivia (olivia/market-pulse-v2, with Rajesh; uses contract v0.1a). DA layer = Ada mig 222 (kdp #346) + 223 (blocked); pulse_ro role; C2 no totals over suppressed cells. Search layer = Ada (Marcus A: 4 readable/14 too few/16 not measured + 40 targets). Map = colour by demand state only (Marcus da8e0055). Reviews = MARKET-PULSE-REVIEWS-01 later.
- AK P1 follow-ups (Marcus a381952f): held-region q -> UNSUPPORTED offer state (Rajesh e2235584); rollback rehearsal of www flip in quiet window; 217 allowlist.
- NEXT CARDS (Matt 1c38546d, after re-flip): NSW total via new optional v1 'measures' template (Olivia dd73eaf2 shape + per-measure as_at), website presence, recent activity; MARKET-PULSE-REVIEWS-01 3fa2300f-2ecb-81af-a5b1-ed35bc9d3801 (mine, estimate on pickup).
- MIG 224 APPLIED 20:42:34Z (sha c826c5c9 gate, Rajesh PASS 18239860); C1 MET set 22 5,773 20:55:57Z (told); kdp #348 MERGED 880d7c0 (21:00Z); C2 check 02:30Z slot + hourly backstop (set holds entity-map lock ~13 min).
## Remaining
- ONEGOV-DETAILS: after 1 Nov pin PR, capture live details response, licensee-path allowlist, flip DETAILS_SHAPE_CONFIRMED.
- Older watch items (REVIEW TOP-UP + LIVENESS 2 Nov, ENTITY-MAP-TWIN-GUARD-01, ops #329, GOV-D2 5 Nov, kdp #279, SUPPLY-PANELS-02, WorkClear): Cortex / git log 30a17a1.
- MIG 216 (Grace, segment split_publishable): apply ONLY sha 107012a0 (@94b82f9) after Rajesh re-PASS (old gate ca2394ec stale). MIG 217 coarse ad hoc view (Grace) coming for the allowlist.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle ticket 3ed2300f-2ecb-81f5-9049-dc04e0634c43 (dispatcher false REWORK, disk alert 90%, secret sweep, key hashing #40, etc.). SUPPLY-UNIVERSE-01 follow-ups on its ticket. Vercel bypass secret rotation = Matt.

## Resume notes
- Other open: AGENT-DEPLOY-API-01 (TODO), GRAFANA-SERVER-RESOURCES-01 (blocked on Phase-2 sweep), CLAUDE.md tier cleanup (via Marcus).
- Standing: stamp Prod Verified At on every migration applied. Docs PRs kdp #261-#263 + #241 still await Rajesh light review.
- Times to Matt in AEST; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = forced rollback; scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
