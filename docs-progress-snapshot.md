---
task_id: API-USAGE-DASH-01
agent: jack
session_id: 74fa4912-70d4-4f3b-8a8c-177258aceaab
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-04T13:20:10Z
notion_task_id: 40e2300f-2ecb-8186-ad14-dc9e1e371bd8
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE (13:20Z) = BUILD API-USAGE-DASH-01 40e2300f-2ecb-8186-ad14-dc9e1e371bd8 (Marcus a4660dff; owner Jack, reviewer Raj, TODO, est 1). Set In Progress, read ACs on ticket (8 ACs: per-endpoint, per-account+credits [needs AC6 api_key_id on api.request, prod 0 keys/30d], bought vs spent, refusals 402/429/cap, reconcile status [dep RECON-G8], AC7 find source of ~720/day keyless 401s on /api/explorer/profile/au/plumber-nsw = find only, fix separate, AC8 queries in source control). Existing dashboard: kdp grafana/dashboards/service-health.json reads prod api_events (market_intelligence). Contract-first: send Raj the ACs/plan before building. Matt told (5364d5f1 reply).
- RESUME HERE (13:14Z) = API-RECON-G8-01 (40e2300f-2ecb-8134-ab36-d0f120dda2ff): Raj PASS 1500bd34; #195 MERGED 3c6a1ef; UAT DEPLOYED 13:08Z (bak /opt/konnex-api-uat-bak-pre195-20261104.tar). Ticket In Review (footer had flipped Done). Raj asked raw AC4 (306b52f4): sent /home/shared/jack-api-recon-g8-01-ac4-raw-20261104.txt (sig 01563223): 4 Nov 3/3/3/3 clean, replay 0cr not counted, 3 Nov only 2 FP. Gaps told: UAT measures all held (no paid measure), no refusal run, api_key_id null on data_settled (flag). NEXT: after 01:00Z 5 Nov send Raj the credits.reconcile row for 4 Nov (+ no reconcile_mismatch) from UAT API_EVENTS_DB_URL read-only -> on his close set Done. Prod rides with charging cutover.
- UAT-PROD-SPLIT-01 CLOSED. Matt 96c584c2 (13:03Z): (a) YES UAT keeps READ-ONLY prod aggregate access (as-built konnex_uat_ro) -> sent Marcus c608798e to log as AC3 decision (he was offline; check it landed). (b) Option A: QA key kx_live_29c0313b stays UAT site key through Phase 2; ROTATE at end of Phase 2 (mine). Reconcile gap -> ticket API-RECON-G8-01 (above).


## Remaining
- REMEDIATION deploy.sustained_failure section: po PR #179 (br docs/remediation-deploy-sustained-failure 845ab63, wt ~/projects/po-wt-remed-deploy), docs-only, Raj review requested; merge on PASS.
- After UAT Preview redeploy: attest x-vercel-id+commit (origin/uat 634973f1) -> tell Olivia verify obs-dates 25 Oct/2 Nov (detail in overflow 4 Nov 08:37Z).
- WEB-CHANGE-02 40d2300f-2ecb-8180-8934-d48bd5908b75 (change view + AK/API route) mine, BLOCKED on Grace: step 1 NOT PASS (Raj 25c9bd9b: added 71%/removed 50% vs 75% bar). Grace fixing matcher + removal stability, fresh blind sample. Do NOT build on current website_fact_change_event service_area rows (Grace f3398e5b).
- Archiver sweep before 13:00Z daily.
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.

## Resume notes
- Overflow (also DATA API LAUNCH, SEGMENT/DESIGN-BUILD, OBS-DATES, living-profile r3/r4; S2 cutover, living-profile r2, UAT-QA-KEYS/#171 AC8/SUBURB-STATS lines moved 2 Nov 09:15Z): /home/shared/jack-progress-overflow-20261101.md
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
