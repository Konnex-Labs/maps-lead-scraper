---
task_id: S2B-W0-UAT-INSTANCE
agent: jack
session_id: e5979c4e-0dd6-48c4-95da-4c5ed0535103
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-31T15:15:55Z
notion_task_id: 40a2300f-2ecb-81e3-bd57-edce9632dcbb
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE FIRST (15:20Z): AC16 answered Raj dd34ecbc (9ad69d60 row = cutover:trial; untestable; compare = auth.users.created_at; offered to find profile-less pre-cutover auth user). kapi #177 MERGED 58bd23d (S2b footer; RECHECK S2b 4072300f stays In Progress). AC3 PASS (ledger id2 grant_trial 50). D3 FIXED: konnex_uat_ro r2 column-level grants /home/shared/jack-s2b-w0-uat-schema-20261031/03-uat-ro-supply-stat-grants.sql (bf64967d) APPLIED prod 15:10:18Z (Raj PASS 640b4abc, Matt 463a9c9e), smoke OK. AC5 free-5 PASS. 503 on ask 6 = charging OFF (api_settings credits_charging_enabled=false; webAskBackstop, not a defect; Raj told 4210bad1). Raj READY (052f99ad). WAIT Matt OK for UAT write (asked 15:17Z), then -> UPDATE api_settings set value='true' where key='credits_charging_enabled' (10s cache) -> Raj charged ACs -> flip back off. Open: api_usage + pipeline_events missing in UAT DB (Raj checking, maybe AC7). AC14: Raj will ask for UAT restart. UAT DB reads: Matt OK 21a25787 (read-only, EXPLORER_DB_URL on konnex-api /opt/konnex-api-uat/.env).
- UAT key row: kx_ key, api_key_hash=sha256 hex, prefix=first16+... . S2b UAT QA w/ Raj (report /home/shared/rajesh-qa-s2b-uat-2026-10-31.md). Steps A/B/C done 14:35-14:37Z (confirm-email env off, cutover 14:36:38Z, wallet ON, charging off; .env baks stepA/stepC). AC3: generate_link offer; AC11 4242. RO login rajesh_uat_ro sees 0 rows (RLS); BYPASSRLS guard-denied, Matt asked; I run his SQL.

- S2b W0 facts: UAT schema files /home/shared/jack-s2b-w0-uat-schema-20261031/; UAT Supabase SMTP=Resend noreply@ (verified 13:07Z); Caddy bak /etc/caddy/Caddyfile.bak-20261031T1310Z-uat-api. UAT email NOT NULL -> s3a D4 tombstone WARNING. PROD: api_profiles lacks api_key_hash/prefix (09-27 mig unapplied) -> apply before any main-based prod deploy. Olivia still needs KONNEX_API_BASE/CATALOG_KEY (UAT key row).
- RESUME HERE 0 = AK-ABOUT-N-PLACEHOLDER-01 (81e3-bd57). kapi #174 MERGED fefde41 05:01Z (Raj PASS 5539943c + GH approval). Raj cond 1 DONE: kapi #176 MERGED 419c6dd (Raj PASS e810766c45985b89). NUM_PLACEHOLDER counted in UAT soak. Contract PR #172 still unmerged (merge it, footer resets?). B5 files /home/shared/jack-ak-b5-apibox-0a45fea-20261031.
- #171 AC8: kapi #175 head 921bb6c (Q1 times fixed), Raj QUALIFIED c073f180. HOLD merge until AC8 UAT done (Ticket 813b footer flips Done). Re-run Part C on UAT DB before UAT (Raj checks).
- RESUME HERE 2b = DESIGN BUILD -> UAT: Matt standing authority 9001f96c. Olivia handoff 83f2efb0 (/home/shared/jack-design-package-review-20261031.md sec A; UAT only; env flag hides sign-up/pay in prod). Olivia DATA-API-BUILD-01 (konnex-website br olivia/data-api-build-contract) OK a1339fc2; Phase 1 + 2 Raj PASS(Q), uat @d470bd4; Phase 3 portal waits on my W0 values (KONNEX_API_BASE/CATALOG_KEY). NEVER set DATA_API_ENV in Vercel Preview (QA F5). W0 details: see RESUME HERE FIRST (UAT Supabase FREE org, Mumbai, auto-expose OFF -> GRANT service_role explicitly).
- RESUME HERE 1 = getMeasure 8147: build kapi #170 MERGED 4e0ad0c 03:30Z (Raj PASS d9d6c0782b2fb311; tree = 162aa1c + docs #168/#169 only). Ticket reset In Progress 03:31Z (recheck footer flip). LEFT: prod deploy batched with catalog #161 + profile #165 behind DATA_V1_ENABLED (prod is c88e146+patch, NOT main: plan the batch as prod-tree patch, exclude held #157 docs); UAT AC14 after S2b W0.
- getProfile 40a2300f-...-e586a8eac71c: kapi #165+#166 MERGED (Raj PASS); prod deploy batched w/ #161, then Raj AC12; UAT AC12 after W0.
- kapi #157 + #156 MERGED 30 Oct, not deployed (S2 81a3, S3a 8167). #157 ships with docs; #156 next = UAT AC6 incl R7 grant.
- RESUME HERE = SUBURB-STATS-UAT-01 4082300f-2ecb-81b6-b454-e64bc14b124c. kapi #152 MERGED 0797132 (tree = Raj PASS head 71517f2, a387163d). Ticket reset In Progress 07:43Z. Prod-tree patch /home/shared/jack-kapi152-prodtree-onto-c88e146-20261029.patch sha256 f0d9f3f063d51d8f17332fbbd1d86c1da2c314e38dc3db2c73ca4f50f0dd269d (wt ~/projects/kapi-wt-deploy152). RAJ PASS abfc784f74163093 (conds: tracked-clean OK; sha256sum -c /home/shared/rajesh-qa-152/prodtree-patched-file-sha256-20261029.txt after apply; env KEY_SCOPED_* unset check = guard DENIED me, asked Matt for count-only 0/0; 662 expected-fail in deploy record). ON MATT 0/0: sha256-gated scp + git apply on konnex-api, backup, commit, restart, health + Raj probe cells. Rollback reset --hard c88e146. Still gated: step 5 env (KEY_SCOPED_RELEASE_*) needs B2 key-id inventory (Raj/Matt; my prod env read DENIED); N4 AC8 after step 5; SA1 PENDING-REVIEW (Matt rights). Contract #151 r4 HOLD until Marcus accepts AC2 deviation (3589ecca). dqi SQL apply after release.
- RESUME HERE = S2b (ticket 4072300f-2ecb-81b5-a0d2-c09fe08131c2): ALL MERGED, nothing deployed. #147 8e4d37c (Raj QUALIFIED 1d88808762f9317f), #148 Q1 06831d0 + contract #146 r4 f98d0e9 (Raj PASS 2aeb598d33b8ad6c).
- S2 CUTOVER: B2 ledger mig APPLIED prod 29 Oct 06:31Z (Matt GO 3bde8481). Raj QUALIFIED 69a3229a (service_role ALL on 3 tables + PUBLIC EXECUTE 2 fns; blocks flag-on only). Revoke follow-up kapi #149 head 847e9b4 (sha 6fd61215), wt ~/projects/kapi-wt-s2-revoke, Raj PASS f690d473. Apply guard-DENIED; WAIT Matt 'go apply #149' -> sha+blob gated apply of konnex-api:/tmp/s2revoke-dry-20261029/sql -> rerun Raj probe into /home/shared -> send Raj (s7/s8 0 rows) -> reset 81a3 In Progress. NEXT: prod code deploy flag OFF. Open w/ Matt: G1 tax, G2 legal, D7 pool.
- DFS NEXT: read DFS balance >= $12.81 -> cap-12 drop-in -> re-enable demand timer before 20 Nov. OneGov GSD-331572 10k/mo ask drafted to Matt; on approval raise NSW_TRADES_QUOTA_CAP (2500). HELD: Bondi Junction 9060915 -> Ada amendment PR -> Raj QA -> I install cap-12 drop-in before 1 Nov 00:00Z. 5,983 overstated ~47: Grace mig -> Raj -> I apply.

## Remaining
- OWE Matt (857c1203): follow-up ticket via Marcus: UAT reads prod market data (konnex_uat_ro r2 grants); revisit before first paying customer (own UAT data copy or masked views).
- Re-sweep archiver-closed live tickets before 13:00Z daily.
- TELL MATT: GH required-reviews; revoke Raj old PAT.
- ONEGOV-NOV1-SWEEP-01 1 Nov 00:00Z: <=1100 onegov, 0 WorkClear; tell Marcus+Grace.
- ACTIVE-TRADING-SHARE (Grace 4f7d970e, Matt e7235e2a): my lane = API/AK wiring; spec /home/shared/grace-active-trading-share-spec-2026-10-27.md. Wait for Grace metric view (after mig 267) + Marcus ticket/ACs (Thu). UAT first; prod s8 hold.
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.
- Ada DEMAND-EVIDENCE-01 (<1 Nov 03:07Z): 124 dry run->apply->merge kdp #191->cherry-pick kapi #70 to prod.

## Resume notes
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
- PIPELINE-STATE-01 3fb2: SVI briefing line + search-volume 410 PR left.
