---
task_id: API-SELF-SERVE-01-S3-op4
agent: jack
session_id: 7d48998d-8694-42cd-a52c-509659b3f9b0
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-02T12:41:00Z
notion_task_id: none (Telegram request 2b24ef10; 40b2300f-81d6 = LIVING-PROFILE-API-01)
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- OBS-DATES: kapi #190 MERGED 8e84ad6, UAT deployed. kdp #423 MERGED 7bad4a3, mig 277 APPLIED 11:4xZ, T1-T5 t. A7 re-probe 11:49Z PASS-ready: H1/H2/H9/S1c/S4a/S5 maps 2026-10-25 + licence 2026-11-01 = DB; keyless set OK; 27/15/2/0err. Sent Raj 2152b4ad (+ cache finding: nsw-plumbers.js 10-min cache keeps null date for 10 min after a failed read; non-blocking, note on #190 prod deploy). Grace/Olivia FYI. Ticket 40b2300f reset In Progress + Archived unticked 11:50Z. A7 PROBE PASS Raj 9cf5dd78 (UAT DONE). #190 PROD CONDITION (Raj 9ee7bd4d): probe prod API role, dates non-null = DB. Optional: failed date read -> transient 30s TTL.
- 11:30Z: UAT hub catalog null (Olivia c38eb724) = site never calls API (no Vercel hits in uat/prod Caddy logs). Asked Olivia 3d98fdd9 to check Vercel env/logs; offered to mint UAT site catalog key (D3) on her "mint". Marcus answered c379facf (no S4 ticket; hold lifted for www profile 928f76fb/36a9119c/6eadf9ff + hub ecc36f93; TEAM-N1 done #111).
- RESUME HERE FIRST = DATA API LAUNCH: Matt GO d5d3b4e0 + 0d6ad8d7. Plan kapi #182 MERGED c15d47f (Raj APPROVED 55ae9e44; footer = S2 ticket 4072300f-2ecb-81a3 for the UUID check -> RESET S2 to In Progress if watcher flips it Done). Raj plan nits to fold in later: key-hash mig one-way rollback, uncharged credits at Phase 5 rollback, AEDT times, gate Phase 2 on the UAT-reads-prod fix; 14 persona gaps in the PR review comment. GST: Matt 43a4e411 = prices A$10/20/50 GST-INCLUSIVE, Konnex WILL be GST registered (G1 closed); asked Matt: is registration in effect + which ABN (go-live only). Margin answer sent. getChange S3-op4 CONTRACT MERGED kapi 3622520 (#183, Raj re-approve 1f390bb0); ticket 40a2 set In Progress 09:01Z (re-check watcher didn't flip Done). B9 VIEW = Grace mig 276, kdp PR #421 (br grace/276-licence-change-window @7c063d1, Raj QA; apply = Jack as postgres; footer 40a2 -> reset after merge). Decided: view ok/partial, profile stays ok-only; AC12 match on view row sweep_run_id = profile run (write into flip PR). Marcus DONE 447ee497: ticket ACs 2-4 now = contract; flip-PR wording in /home/shared/marcus-getchange-wording-20261102.md (def/cadence change -> b636de9c signer re-sign before flip merge); reopen: restatement labelling when a served change is restated. NEXT = BUILD B1-B8 + AC1-11 + A2 in new branch off origin/main (session est 2-3). NEXT SESSION (while Raj reviews #183): Stripe test-mode packs (tax-inclusive) + rate-card gst.registered + retire legacy plans G5.
- SEGMENT: kapi #187 MERGED 6e379b5 by Matt 12:16Z. Ticket 40b2300f flipped Done by watcher, reset In Progress 12:22Z (Archived false). AFTER MERGE: reset footer ticket (LIVING-PROFILE-API-01 uuid, as #179) to In Progress. Launch plan v1.2 MERGED kapi #189 10b495c; S2 4072300f-2ecb-81a3-a5ec-f58cc3c2a355 reset In Progress 11:22Z (re-check watcher). Raj plan nits (a) header v1.1 line lacks v1.2 pointer (b) state table 'getChange: Not built' stale: fix next plan touch. Worktrees ~/projects/kapi-wt-segdec, kapi-wt-plan12 removable.
- Grace 49731ed6: C1 key sweep_kind=monthly_full AND status=ok (API side). MV nsw_plumber_supply_change_mv refreshes daily 22:00Z. Matt 221aacdd authority through UAT; landing page (hub) in build (told Matt).

- RESUME HERE 2b = DESIGN BUILD -> UAT: Matt standing authority 9001f96c. Olivia handoff 83f2efb0 (/home/shared/jack-design-package-review-20261031.md sec A; UAT only; env flag hides sign-up/pay in prod). Olivia DATA-API-BUILD-01 (konnex-website br olivia/data-api-build-contract) OK a1339fc2; Phase 1 + 2 Raj PASS(Q), uat @d470bd4; Phase 3 portal uat 7fd92a38 Raj PASS; Phase 4 AskCredits UAT-only confirmed to Olivia d648881e (S2b endpoints only). NEVER set DATA_API_ENV in Vercel Preview (QA F5). W0 details: see RESUME HERE FIRST (UAT Supabase FREE org, Mumbai, auto-expose OFF -> GRANT service_role explicitly).

## Remaining
- RESUME HERE FIRST = UAT-PROD SPLIT + G7: ticket 40c2300f-2ecb-8130-9c3a-d754cce983e2 (Marcus 97f2ab14: exists since 08:51Z, AC1-8, est 2-3, TODO -> set In Progress when starting; PR footers point here). Scope done read-only: /home/shared/jack-uat-prod-split-scope-20261102.md (UAT only prod login = konnex_uat_ro, SELECT-only + default read-only; writes -> UAT Supabase, Inferred). Marcus: DEFAULT = UAT cannot read prod; read-only exception only as recorded decision (reason, col grants, no PII) and he takes it to Matt first -> tell Marcus which option. Next: read ticket ACs, decide option, Raj proof (UAT signup+purchase = 0 prod rows), G7 single-process spend-counter check. Matt owes only: G2 legal route; later company entity details (Phase 3).
- Archiver sweep before 13:00Z daily.
- TELL MATT: GH req-reviews; revoke Raj old PAT
- ACTIVE-TRADING-SHARE (Grace 4f7d970e): my lane API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md; wait Grace view + Marcus ACs.
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.

## Resume notes
- Living-profile r3/r4 + getMeasure prod-batch notes moved to overflow file (2 Nov 09:05Z section).
- Overflow (S2 cutover, living-profile r2, UAT-QA-KEYS/#171 AC8/SUBURB-STATS lines moved 2 Nov 09:15Z): /home/shared/jack-progress-overflow-20261101.md
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
