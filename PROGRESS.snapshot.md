---
task_id: release-121-127-followups-2026-10-02
agent: jack
session_id: 9191e8fa-a8a5-4563-ae34-2af0a54ddde5
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-07T12:36:00Z
notion_task_id: 3eb2300f-2ecb-81c9-a9a5-d6fbc267c23a
context_needed:
  files: [/home/shared/jack-grafana-ro-157/NOTES.md, /home/shared/jack-case5-dry/, /home/shared/ada-plumber-nsw-monthly-run-plan-20261003.md]
  branches: [konnex-data-pipeline:jack/grafana-ro-role PR #237 (worktree /home/jack/projects/kdp-wt-grafana-ro), konnex-ops:jack/exec-report-01 (merged; worktree /home/jack/projects/ops-wt-exec-report removable)]
  collaborators: [matt, marcus, rajesh, grace, ada]
---

## Done
- Earlier releases (2 Oct: www draft, migrations 153/155/156, ops #338/#339): see git log and the board.

## In Progress (RESUME FIRST)
- PROD QA: chain STOPPED at exit (prod verified clean 12:35Z: builds 39, map v40, view 75cb4d2c, org 1,643, adj 1,872). STILL TO RUN, ONE AT A TIME as postgres: /home/shared/rajesh-qa-190-2026-10-07/l190_n0.sql (sha 63a937ec) then l190_diag_rb.sql (7c598f96) -> outputs to /home/shared/jack-qa-190-2026-10-07/ -> Rajesh. FIRST THING: apply 188 (cleared).
- REVIEWS-DASH-01: live, CID-deduped (159 applied 01:55Z, #240/#243 merged).
- DFS: US$11.13 (3 Oct); no sweep until 1 Nov; Matt asked to top up US$60 before ~18 Oct. Guard ticket DFS-BALANCE-GUARD-01 3ee2300f-2ecb-81a4-bb32-f367992f6b6d (due 18 Oct).
- HELD docs PR: kdp #241 (DA-APPROVALS-01, merge with last step). #249 IVI sizing merged 6beb47b (Matt ask).
- Follow-up: ask_konnex_ro/app lack SELECT on nsw_plumber_supply_breakdown_latest (only if AK v3 asks Verified). GOV-SOURCES-01 3ee2300f-2ecb-8162-a8c8-d0f05b6b8dcc: Grace S1-S4, Ada D1-D3; me = platform per source (mig, runner/timer, Grafana, apply after Rajesh).
- DA: applied + released (#251-#260), Grafana live. ONLY GATE: planning_runner pw (Matt; host konnex-data) + smoke test (README step 5) -> DA + ABS backfills from MI main, run_ids to Rajesh + Ada. Same pw unblocks GOV-D1. Sub-ticket DA-RELEASE-01 3ee2300f-2ecb-81f1-a854-e9efb6217ec5; parent closes with #241.
- EXEC-REPORT-01 (3ed2300f-2ecb-814f-a15e-d211fe8a7298): live; TODO IVI freshness flag in Decisions (Marcus b711acc1), exit-4 alert, EXEC_REPORT_HC_URL; Rajesh to close.
- STANDING: set Prod Verified At on every migration I apply. Board sweep pass 2 done 3 Oct.
- Ada 154 applied 2 Oct; TODO before 20 Oct: demand monthly timer (konnex-monthly@demand, 20th-28th) + timer DB login with demand_run_checker.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.

- DOCS (Matt rule 9885917d): kdp #261 Marcus (DOCS-GH-MARCUS-01), #262 Grace (DOCS-GH-GRACE-01), #263 Ada (DOCS-GH-ADA-01): Rajesh light review -> I merge. Delete branch jack/matt-steps-20261003 after Matt's pw step (Marcus 8ac80265).

- GOV S1 DEPLOYED: #264 01ad2ec + F1 #265 0325be8 merged, deploy checkout ff'd (0325be8); mig 170 applied 16:38:13Z; timers enabled (rolling 18:00Z daily; watch 2 Nov 21:00Z); manual watch run OK. TODO after 18:00Z: check licence_recheck_run mode='rolling' row + status, tell Rajesh.

- GOV-D1: 169 applied; NEXT full load as planning_runner after Matt pw; close GOV-D1 3ee2300f-2ecb-8138-96a3-c0ff8b6d8883.
- ops #329 pgBackRest repo2 (INCIDENT 3e82300f-2ecb-8133-8af2-f928075eaf9e): head 06cccba (Rajesh PASS abc89b8c on 00fd7c8, nits fixed; re-approve asked; diff Mon..Sat, 4h bound, exact-deb install by sha, archiver fails = box blips). repo1 verify OK 6 Oct. window Sun 11 Oct 03:00Z; merge LAST (closes incident). F2 alert ticket TODO.
- AK closes (sent Rajesh 4d87d4eb, 3 Oct): Rajesh closes AK-VERIFIED-GOVERNED-01 / SUPPLY-UNIVERSE-01; AK-WEBSITE-DISPLAY-01 waits Matt; AK-DEMAND-PLUMBER-01 needs Rajesh QA of api #76/#79. AK harness: answerQuestion with MARKET_INTEL_DB_URI. NOTE Verified moved 790->926+ on 7 Oct; rerun AK Q7.
- GOV-D2: 175 applied 18:23:43Z, #271 merged 8b6c7bb, MI ff, GOV-D2-BUILD-01 stamped. Next: point-set PR (needs D1 load) -> sample (+coastal LGAs) -> backfill; runner env SILO_USERNAME=support@konnexlabs.com. A1/A6 = Rajesh runtime gates.
- mig 179 v2 DONE: applied 12:29:21Z, #277 976fd66, MI ff, ticket stamped (stays In Progress for restatement). Restated via supply_snapshot_set 7 (12:36Z): valid 5,779 = V 789 / ABN-c 2,358 / Obs 2,632 (305 removed = 129 ABN-c + 176 Obs, NOT 'all Observed'). Marcus runs restatement.

- kdp #279 (Grace docs follow-up @b25f801, same ticket): Rajesh light review requested -> merge (--match-head-commit) + ff MI.
- mig 182-187 DONE (d61d491/ad96dd9/295ec09/53166be/470653f/af4891d; #284 closed inert, #286 note merged). Live 5,784 = V 926 / ABN-c 2,216 / Obs 2,642, map v40.
- mig 188: Rajesh QA PASS b062e5f4 (valid entities unchanged; valid listings +1 Fresher Bathrooms via renovator carve-out). NEXT SESSION: APPLY after chain done (org_link lock) (Marcus OK d9f42f6d; +1 listing goes in his live note): head c5260e5, sha256 0487acbd gate, -v expect_a2=46; expect V 972/ABN-c 2,170; merge #290; MI ff; Prod Verified At on 3f22300f-2ecb-813d-a2f2-ef3ec69eee1c; tell Marcus+Grace+Rajesh.
- mig 190: kdp #291 @70b568d (footer 81d4). Dry run ABN-c +17/Obs -17/V 0; Matt notice SENT. Rajesh test DONE: apply all t (+17/-17/0); rollback R4/R5 f n=1 (1 entity regroup, like 183) - sent e4a86c05, await verdict; gate sha256 8ddf3943; no -v vars. 189 footer = 3f22300f-2ecb-81ee-8685-c7fab74eefd7. WP …816a never a footer.
- mig 189: kdp #292 @c4398d1 (footer 81ee). qa189 done (V +26/ABN-c -26; P2+L5 f, sent Rajesh 0c33faab); Matt notice SENT (Marcus 12679601). Apply after Rajesh PASS: -v expect_a2g=27, gate c2b62517; CHECK ALTER may lock_timeout -> retry quiet.
- SA-RESWEEP-01 contract removal: worktree po-wt-rm-sa-resweep (branch jack/remove-sa-resweep-01-contract); block deleted, uncommitted. main validate-contracts FAILs. Regenerating policy.v1.sha256 was DENIED by the classifier; needs the user's OK, don't work around it.

## Remaining
- website-facts: check the Mon 12 Oct 05:00Z run result (WEBSITE-FACTS-ERRTOL-01).
- USAGE (Matt 7 Oct 12:24Z): weekly 82%, projected 107% before reset (~Fri 9 Oct 2:40pm AEDT); told Matt to slow fleet. TODO: token-cost dashboard (:3464, ops checkout) fix 'use freely' card (weekly-aware) + carlos(offline)=Sonnet row looks like Rajesh mis-attribution; ask Rajesh to dedupe-count his own transcripts. F1 footer = 3f22300f-2ecb-81fd-abca-f4c71507189d.
- WorkClear: Grace runs 3 search probes w/ her key (sent 79a0d5ba). licensee_name fix #293 MERGED e9caab5, MI ff. ABN search exists (type=abn), no ACN.
- ENTITY-MAP-TWIN-GUARD-01 3f22300f-2ecb-816a-b80e-d887a45453c8: scope -> PR -> Rajesh.
- PROFILE-NSW-PLUMBERS-01: full page comments due Tue 6 Oct. WALTER-FB-02: wait for Grace + Ada design proposal.
- AK COST: Haiku test trigger ~16 Oct if tracked AK spend > ~US$100/month.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle ticket 3ed2300f-2ecb-81f5-9049-dc04e0634c43 (dispatcher false REWORK, disk alert 90%, secret sweep, key hashing #40, etc.). SUPPLY-UNIVERSE-01 follow-ups on its ticket. Vercel bypass secret rotation = Matt.

## Resume notes
- Times to Matt in AEST; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = forced rollback; scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
