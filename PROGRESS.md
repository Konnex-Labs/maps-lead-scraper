---
task_id: SEGMENT-READINESS-01
agent: jack
session_id: 52b8daf8-789a-44f0-a719-7ec224d7f8bd
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-02T02:05:00Z
notion_task_id: 40b2300f-2ecb-81d6-81f5-d38a55f546bd
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- SEGMENT-READINESS-01: reply SENT to Matt 2 Nov ~02:05Z (draft /home/shared/jack-segment-readiness-telegram-draft-20261102.txt; full map /home/shared/jack-segment-readiness-consolidated-20261102.md). Grace+Ada told. WAIT for Matt decisions (1 shortage claim wording, 2 elec/carp, 3 new sources, 4 public per-business licence check, 5 prod hold lift). OWE: confirm whether ABS entries/exits = cleared A2 source (ABS 8165?). Grafana layout: candidate=question tagged by segment, components=supply/demand/change (FPP mig 253 pattern); Marcus owns board/tickets after Matt reply.
- LIVING-PROFILE r4 pulled 01:43Z /home/shared/jack-living-profile-uat-sample-20261102-r4.json: 27 served/15 held/2 coming_later/0 err; C1/H5/M1/M4 served from run 771089ef (monthly_full ok). Grace CONFIRMED C1 609/2/0 (fda6e089); rolling summary is a different measure, never same card (Olivia told); Olivia FYI fa4e5207. UAT API = https://uat-api.konnexlabs.com/api/explorer/profile/au/plumber-nsw, header Authorization: Bearer. If Grace says figures differ: update Notion page + tell Matt.
- LIVING-PROFILE-API-01 (r4 done, see above): UAT QA key MINTED 16:48Z (Matt GO 368e9073; auth user c6279340 qa-living-profile@konnex.invalid; prefix kx_live_beb38bb8; key in /home/jack/.uat-qa-key.env 600; revoke after Raj AC2). r3 WRITTEN 04-uat-ro-living-profile-grants.sql sha256 22f26965ac6ab31f9d5a039c273ebfeb069328552fb6b9e607a363eee8f6fadc (7 objs + website summary; dry run all 10 reads OK, neg probe denied); Raj PASS 639843da -> APPLIED 16:53Z hash-gated; re-pull /home/shared/jack-living-profile-uat-sample-20261101-r3.json: 0 error, 0 temp_unavail (served 23/held 15/no_recheck_yet 4/coming_later 2); r3 CLOSED by Raj 0dec86cd (P1-P3 confirmed); Olivia BOUND (5b0c705a) -> Raj; wants sample once C1 sweep/T1 lands; UAT site needs KX_API_KEY+ASK_KONNEX_API_BASE. NEXT: after 22:00Z MV refresh re-pull (C1 etc.); revoke UAT QA key after Raj AC2. Raj prod-read (AC2, 274 live, #418, 268/272/273 post-apply) still pending Matt; do not re-fire.
- UAT-QA-KEYS-01 (ticket 40b2300f-2ecb-8107-b6db-f998ae0564e9): Matt GO dbff4d8f standing grant; konnex-ops PR #363 (wt ~/projects/ops-wt-uat-qa-keys) awaiting Raj; merge = push to all agents. Matt also gave harness permission 16:46Z.
- Grace 49731ed6: C1 key sweep_kind=monthly_full AND status=ok (API side). MV nsw_plumber_supply_change_mv refreshes daily 22:00Z. Matt 221aacdd authority through UAT; landing page (hub) in build (told Matt).
- LIVING-PROFILE round 2 context: rec /home/shared/jack-marcus-living-profile-rec-20261101.md; Notion page edited (Matt GO d920d9c9); canvas claude.ai/artifact/KdvV3edt5yjQZy5HRro9aZ = enough, no zip (Olivia bc576aac). LEFT after 22:00Z: Grace C1 confirm (if figures differ, update page + tell Matt); Raj MV spot-check of mig 268 (applied 04:41Z, kdp #411 7843a13, Raj PASS abc11af3) -> stamp Prod Verified on 8128, close.

- RESUME HERE 0 = AK-ABOUT-N-PLACEHOLDER-01 (81e3-bd57). kapi #174 MERGED fefde41 05:01Z (Raj PASS 5539943c + GH approval). Raj cond 1 DONE: kapi #176 MERGED 419c6dd (Raj PASS e810766c45985b89). NUM_PLACEHOLDER counted in UAT soak. Contract #172 unmerged. B5 files /home/shared/jack-ak-b5-apibox-0a45fea-20261031.
- #171 AC8: kapi #175 head 921bb6c (Q1 times fixed), Raj QUALIFIED c073f180. HOLD merge until AC8 UAT done (Ticket 813b footer flips Done). Re-run Part C on UAT DB before UAT (Raj checks).
- RESUME HERE 2b = DESIGN BUILD -> UAT: Matt standing authority 9001f96c. Olivia handoff 83f2efb0 (/home/shared/jack-design-package-review-20261031.md sec A; UAT only; env flag hides sign-up/pay in prod). Olivia DATA-API-BUILD-01 (konnex-website br olivia/data-api-build-contract) OK a1339fc2; Phase 1 + 2 Raj PASS(Q), uat @d470bd4; Phase 3 portal uat 7fd92a38 Raj PASS; Phase 4 AskCredits UAT-only confirmed to Olivia d648881e (S2b endpoints only). NEVER set DATA_API_ENV in Vercel Preview (QA F5). W0 details: see RESUME HERE FIRST (UAT Supabase FREE org, Mumbai, auto-expose OFF -> GRANT service_role explicitly).
- RESUME HERE 1 = getMeasure 8147: build kapi #170 MERGED 4e0ad0c 03:30Z (Raj PASS d9d6c0782b2fb311; tree = 162aa1c + docs #168/#169 only). Ticket reset In Progress 03:31Z (recheck footer flip). LEFT: prod deploy batched with catalog #161 + profile #165 behind DATA_V1_ENABLED (prod is c88e146+patch, NOT main: plan the batch as prod-tree patch, exclude held #157 docs); UAT AC14 after S2b W0.
- getProfile 40a2300f-...-e586a8eac71c: kapi #165+#166 MERGED (Raj PASS); prod deploy batched w/ #161, then Raj AC12; UAT AC12 after W0.
- kapi #157 + #156 MERGED 30 Oct, not deployed (S2 81a3, S3a 8167). #157 ships with docs; #156 next = UAT AC6 incl R7 grant.
- SUBURB-STATS-UAT-01 4082300f-2ecb-81b6-b454-e64bc14b124c: full deploy plan (prodtree patch, Raj PASS conds, gates) in /home/shared/jack-progress-overflow-20261101.md
- S2 CUTOVER: B2 ledger mig APPLIED prod 29 Oct 06:31Z (Matt GO 3bde8481). Raj QUALIFIED 69a3229a (service_role ALL on 3 tables + PUBLIC EXECUTE 2 fns; blocks flag-on only). Revoke follow-up kapi #149 head 847e9b4 (sha 6fd61215), wt ~/projects/kapi-wt-s2-revoke, Raj PASS f690d473. Apply guard-DENIED; WAIT Matt 'go apply #149' -> sha+blob gated apply of konnex-api:/tmp/s2revoke-dry-20261029/sql -> rerun Raj probe into /home/shared -> send Raj (s7/s8 0 rows) -> reset 81a3 In Progress. NEXT: prod code deploy flag OFF. Open w/ Matt: G1 tax, G2 legal, D7 pool.

## Remaining
- OWE Matt (857c1203): follow-up ticket via Marcus: UAT reads prod market data (konnex_uat_ro r2 grants); revisit before first paying customer (own UAT data copy or masked views).
- Archiver sweep before 13:00Z daily (1 Nov done).
- TELL MATT: GH required-reviews; revoke Raj old PAT.
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.

## Resume notes
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
