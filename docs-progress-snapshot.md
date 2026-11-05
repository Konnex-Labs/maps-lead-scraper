---
task_id: DATA-API-LAUNCH-STRIPE-GST
agent: jack
session_id: d71ff10d-26a6-42a1-85c0-923f0ae236d6
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-05T01:16:04Z
notion_task_id: 40e2300f-2ecb-8186-ad14-dc9e1e371bd8
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE (01:20Z 5 Nov) = UAT DEPLOYED main 1dbc8983 (#196+#198) 01:09:57Z, health 200, bak /opt/konnex-api-uat-bak-pre196-20261105.tar (rollback: untar + rm 3 new files: 2 email-nullable sql + prod-move-rehearsal.sh). DASH-01 DONE (row 1456 api_key_ref). G8 DONE (Raj PASS 1cac6d58, comment posted). STRIPE-GST-01 purchase: Raj has no login; magiclink needs service-role key = OFF. Olivia: no account. Raj signs up raj-gst1@konnex.invalid; MATT asked (01:17Z) to click Confirm user in UAT Supabase. Then Raj buys 1 x 4242, sends cs_test_ -> I run check. Then: uat-s3a-run stripe-gst-check --session cs_test_..., check credits.purchased row, evidence to Raj -> Done. kapi #199 MERGED 1dbc8983, sub-ticket 40e2300f-2ecb-8141 Done; G-D waits on Matt creds (Raj notes: hand-capture SET ROLE/MANUAL-PENDING, use /home/shared/rajesh-qa-gc-origin-main-hashes-2026-11-04.txt + sha256 prefix).
- STRIPE-GST-01 40e2300f-2ecb-8112-8d2a-ec2c9979dfc9: Raj PASS a171fb71, #198 merged, now on UAT. Test txr_1UYCPzLEc394graPWg8hjjLp + env var set; wrapper check PASS. Only remaining step: one test-card pack purchase (see top line).
- TIER CARD (Grace/Olivia) DEADLINE: API route serving MoM net_change per class from mig 281 monthly view LIVE BEFORE 1 Dec (www card switches 1 Dec; Matt 5526ab43 VALID via Grace 365e5104). Unit agreed (net real change per tier per month, base change in footnote). Shape = section 8 of /home/shared/grace-homepage-tier-delta-design-2026-11-04.md + share_pct (numeric 1dp, % of segment_base; Matt afb8dcff, Grace 428a7ada). Expose in API once mig 281 is applied on UAT; no +/- unless state='clean'. After 281 applies: pull Grace's alert rule branch grace/281-tier-card-alert @dc9a648 (/home/grace/projects/po-wt-281-alert).


## Remaining
- RUNBOOK: G-A CLOSED (Raj PASS 24761927); N1/N2/N4 folded, N3 left; U5+U6 closed. Post-PASS amendments 23:19Z (V4 after M5; M4 re-apply may succeed on PG16+) flagged to Raj. G-C driver = kapi PR #199 (br jack/gc-rehearsal-driver 0663ea6, worktree /home/jack/projects/kapi-wt-gc-rehearsal; NO Ticket footer on purpose, cutover ticket 40c2300f-2ecb-818f-b6b5-ca383dc9581a is Backlog), Raj QUALIFIED PASS f37b3c2e (Q1 V4 detail-conditional, Q2 mandatory REVIEWED_HASHES_FILE, A1 V4 on M4 first-apply, N1); fixes pushed 77274f7 (verified), diff-only re-review asked of Raj. N2 folded in runbook 3.1. G-C RUN BLOCKED on Matt (asked ~23:12Z): Supabase token/temp project + prod dump URL (public+auth), or he runs the dump. Do NOT look for keys myself (auto-mode denied). Real run needs PG17 pg_dump (only PG16 local).
- After UAT Preview redeploy: attest x-vercel-id+commit (origin/uat 634973f1) -> tell Olivia verify obs-dates 25 Oct/2 Nov (detail in overflow 4 Nov 08:37Z).
- WEB-CHANGE-02 40d2300f-2ecb-8180-8934-d48bd5908b75 (change view + AK/API route) mine, BLOCKED on Grace: step 1 NOT PASS (Raj 25c9bd9b: added 71%/removed 50% vs 75% bar). Grace fixing matcher + removal stability, fresh blind sample. Do NOT build on current website_fact_change_event service_area rows (Grace f3398e5b).
- Archiver sweep before 13:00Z daily.
- G1 GST-inclusive decided (e686c33a); Olivia copy UAT PASS (Raj a2c81846); Stripe side = RESUME HERE.
- PERMS (Matt GO 9c69d61d 15:13Z): /home/jack/bin/uat-psql (UAT only) + allow rules in ~/.claude/settings.json (bak settings.json.bak-20261104T1520Z), tested OK. USE uat-psql for all UAT DB work. Stripe readback still BLOCKED (reading the UAT env on konnex-api = Credential Exploration; prices are STRIPE_API_PRICE_<PACK> in the UAT env; local ~/.env key is sk_live with old STARTER-SCALE prices). Raise with Matt 5 Nov.
- Matt 055cc204 (14:55Z): G2 legal pending from him and do NOT block Phases 1-2. Build S3a mechanics now with placeholder wording; the GST line gets a Raj re-check later. Both gate Phase 3 (Stripe live) and G9.
- S3a: kapi #197 on UAT; UAT backfill applied 7/7; AC12 dry run 0; prod by-class sent Raj (SQL MATCH e013d105). His prod gate = public_skipped=2 on first prod dry run after prod migration w/ sign-up flag-on. Full detail: overflow file (S3a, 4 Nov 22:06Z).
- DASH-01 Notion had flipped Done again (edit 14:40Z); reset In Review 15:19Z. Told Raj (he asked to confirm Done).
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.

## Resume notes
- Overflow (also DATA API LAUNCH, SEGMENT/DESIGN-BUILD, OBS-DATES, living-profile r3/r4; S2 cutover, living-profile r2, UAT-QA-KEYS/#171 AC8/SUBURB-STATS lines moved 2 Nov 09:15Z): /home/shared/jack-progress-overflow-20261101.md
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
