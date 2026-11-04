---
task_id: API-RECON-G8-01
agent: jack
session_id: cfe34ada-c360-4b7c-9cac-88326a3997b8
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-04T12:56:00Z
notion_task_id: 40e2300f-2ecb-8134-ab36-d0f120dda2ff
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE (12:56Z) = BUILD API-RECON-G8-01 (40e2300f-2ecb-8134-ab36-d0f120dda2ff, TODO, owner Jack, reviewer Rajesh, est 1; Marcus 40ecb941). Set In Progress + session estimate. Worktree off origin/main in konnex-data-api (wt ~/projects/kapi-wt-recon-g8). ACs (read ticket body): (1) data-v1 measure.js/change.js emit a settled event per charged-path response (request_id, credits_used, held, replay flag); (2) lib/credits-reconcile.js:63 covers both channels (now only 'credits.ask_settled', emitted at server.js:5958); (3) tests: paid data-v1 call reconciles clean, forced mismatch flags, replay not double counted (node test, test/*.test.js); (4) UAT reconcile run clean for a probe day; (5) 3 Nov mismatch cleared or recorded as known false positive. PR footer Ticket: full uuid; Raj QA; UAT deploy then prod later with charging cutover. Must land before Phase 2 sim (G8).
- RESUME HERE (12:58Z) = UAT-PROD-SPLIT-01 CLOSED (Raj AC7 PASS 319095c4 posted on ticket; #194 merged 6da19e65; ticket Done+Archived; Matt/Raj/Marcus told). OPEN: (1) QA key kx_live_29c0313b revoke HELD: very likely also the UAT Vercel Preview KX_API_KEY/CATALOG key (my 3 Nov key log; Matt e217c671). vercel-jack.env token is EMPTY (deleted). Asked Matt A keep through Phase 2 / B rotate now. (2) RECONCILE GAP (Inferred, code): data-v1 measure/change settle in ledger but emit no credits.ask_settled; credits-reconcile.js:63 counts only that -> every paid data-v1 call = missing_event (3 Nov: 2 = my AC4 probe). Asked Marcus 49f38fe8 for ticket (owner Jack, 4 ACs, before Phase 2 G8); Raj told 8108da69. Build when ticket exists. AC3 Matt decision via Marcus (not mine).


## Remaining
- ALERT dbe469d2 CLOSED 12:25Z: deploys green since 11:19Z (13 runs); already resolved when I went to resolve it. TODO later: add deploy.sustained_failure section to REMEDIATION.md.
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
