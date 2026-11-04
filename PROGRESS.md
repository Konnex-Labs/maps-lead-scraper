---
task_id: DATA-API-LAUNCH-STRIPE-GST
agent: jack
session_id: cb79edbb-4367-4c50-a950-8c9192a2062b
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-04T22:47:12Z
notion_task_id: 40e2300f-2ecb-8186-ad14-dc9e1e371bd8
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE (22:20Z) = STRIPE-GST-01 40e2300f-2ecb-8112-8d2a-ec2c9979dfc9: Raj PASS a171fb71, #198 MERGED eb2da8c. UAT PREP DONE: script staged in /opt/konnex-api-uat/scripts (sha def3eb26), wrapper uat-s3a-run gained stripe-gst-check (bak .bak-20261104T2215Z), test txr_1UYCPzLEc394graPWg8hjjLp created, env var appended (env bak .bak-20261104T2218Z), check PASS. Code NOT on UAT (UAT server.js/stripe-webhooks.js = pre-#196). AT 01:00Z 5 Nov (12pm AEDT), after the reconcile: back up, deploy main tree (#196+#198) to /opt/konnex-api-uat, restart, then (a) #196 checks (api_key_ref on a settled row) -> DASH-01 Done; (b) one test-card pack purchase on UAT -> uat-s3a-run stripe-gst-check --session cs_test_... -> evidence to Raj -> STRIPE-GST-01 Done. Also send Raj the G8 4 Nov reconcile row. NEXT: prod move-to-main rehearsal runbook for Raj.
- TIER CARD (Grace/Olivia): unit agreed (net real change per tier per month, base change in footnote). Shape = section 8 of /home/shared/grace-homepage-tier-delta-design-2026-11-04.md + share_pct (numeric 1dp, % of segment_base; Matt afb8dcff, Grace 428a7ada). Expose in API once mig 281 is applied on UAT; no +/- unless state='clean'. After 281 applies: pull Grace's alert rule branch grace/281-tier-card-alert @dc9a648 (/home/grace/projects/po-wt-281-alert).
- RESUME HERE (14:35Z) = API-USAGE-DASH-01 40e2300f-2ecb-8186-ad14-dc9e1e371bd8, Status In Review (reset after both footer flips; Archived=false). kapi #196 Raj PASS, MERGED 1c90e178, NOT deployed: deploy to UAT straight after the 01:00Z 5 Nov reconcile (back up /opt/konnex-api-uat first, as for #195); prod goes with the charging cutover, and before that check prod credit_ledger kind=purchase rows (Raj A1). kdp #429 Raj APPROVE, MERGED 9974d3f2; dashboard INSTALLED 14:32Z on konnex-ops /var/lib/grafana/dashboards/konnex/api-usage.json (sha256 04ffef17, no prior file; rollback = rm). Raj AC9(d) PASS f205e378 (Grafana API, Verified 14:36Z); his manual-closure record is written. Ticket kept In Review on purpose until #196 is on UAT. Evidence: ac9-prod, ac9a-seqscan, ac9c-uat files in /home/shared. LAST STEP: after the #196 UAT deploy, verify api_key_ref on a settled row (and credits.purchased if a pack is bought), then set Status Done and tell Raj.
- RESUME HERE (13:14Z) = API-RECON-G8-01 (40e2300f-2ecb-8134-ab36-d0f120dda2ff): Raj PASS 1500bd34; #195 MERGED 3c6a1ef; UAT DEPLOYED 13:08Z (bak /opt/konnex-api-uat-bak-pre195-20261104.tar). Ticket In Review (footer had flipped Done). Raj asked raw AC4 (306b52f4): sent /home/shared/jack-api-recon-g8-01-ac4-raw-20261104.txt (sig 01563223): 4 Nov 3/3/3/3 clean, replay 0cr not counted, 3 Nov only 2 FP. Gaps told: UAT measures all held (no paid measure), no refusal run, api_key_id null on data_settled (flag). NEXT: after 01:00Z 5 Nov send Raj the credits.reconcile row for 4 Nov (+ no reconcile_mismatch) from UAT API_EVENTS_DB_URL read-only -> on his close set Done. Prod rides with charging cutover.
- UAT-PROD-SPLIT-01 CLOSED (Matt 96c584c2: UAT keeps read-only prod access; QA key kx_live_29c0313b rotates at end of Phase 2, mine).


## Remaining
- po PR #179 (wt ~/projects/po-wt-remed-deploy): Raj QUALIFIED PASS c6e79650 w/ 2 fixes -> fixed, new head 657756aa pushed, Raj asked to diff-check+approve (6af3cec1). Merge on his approve (konnex-gh --match-head-commit).
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
