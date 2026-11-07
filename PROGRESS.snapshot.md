---
task_id: JACK-QUEUE-2026-11-06
agent: jack
session_id: b0a2901f-6b72-4118-b354-d4715e040e8f
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-07T10:15:00Z
notion_task_id: 4102300f-2ecb-81ef-a0cf-c8eb8c391818
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE FIRST (10:15Z): RUNNER DEPLOY. Raj PASS 60289ea2 on pipeline-orchestrator grace/verify-engine-runner @8949c46 (release authorised; Jack does deploy-class + rollback check). DO: ground-truth branch head, open PR for Grace (Ticket 4112300f-2ecb-81d3-96c1-cd5171f65a2d VERIFY-ENGINE footer, reset ticket to TODO+Archived false after flip), merge --match-head-commit, then on host: copy systemd/ units to /etc/systemd/system, daemon-reload, check persistent-timer catch-up BEFORE enable --now (memory: persistent timer), manual restart pipeline-alerter.service (pipeline-deploy.sh only restarts pipeline-agent). First live run = engine proof (Raj note 6): send run_id/counts/output_hash to Raj+Grace. Raj notes for Grace: delta joins on rule_key (key on rule_version before promotion); REMEDIATION 'stale' wording overstated; pgpass undeclared dep. FORWARD DEP: PR3 mig 310 makes execute_run refuse empty obs_watermarks; runner must pass them before 310 applies or run.error fires daily.
- EARLIER (09:58Z): 308 DONE: Raj PASS 399d50ef @ae84f6c, #450 squash-merged bbc4e83, APPLIED 09:51:49Z md5-gated (mig 114fc653, test ae3d3ce0), live test 10/10 t; out /home/shared/jack-308/apply-308-20261107T095149Z.txt; Raj+Grace told (b3805695). Raj post-apply PASS dab8d69b (308 + 307). TODO: watcher will flip VERIFY-ENGINE-01 (81d3, Status was TODO 09:57Z) to Done from #450 footer: check + reset Status + Archived false. 309+: Marcus ticket note says non-final PRs use a non-closing 'Refs' line, not a Ticket footer; 308 is VERIFY-PROVE scope, not VERIFY-ENGINE (Marcus scoped 81d3 to 301-307). Grace advisories: A1 test-header fix rides a follow-up PR. 309 DONE: Raj PASS afd631b6, #451 merged 5d0c6d1 (Ticket footer 81cd: PR-UUID required check accepts ONLY Ticket/Closes/Fixes, no non-closing form), APPLIED 10:06:45Z md5-gated, live T1-T7 t (/home/shared/jack-309/apply-309-20261107T100645Z.txt); Raj/Grace/Matt told. Raj post-apply PASS c6e7e939 (asof_floor priv q -> Grace). VERIFY-ENGINE-01 flipped by #450, RESET 10:07Z. CHECK VERIFY-PROVE-01 (81cd, was TODO, not yet flipped 10:08Z) after #451 -> reset Status '📋 TODO' + Archived false. Next Grace PR3 (verify_asof/open_run/execute_run): same flow, Ticket 81cd footer + reset. MINE latent: businesses_purge_archive (mig 024 LIKE businesses) positional copy breaks after 309 (xid8 col): add ingest_txid xid8 or explicit col list before Tier-3 purge un-gated. 307 APPLIED 09:53:13Z by Matt, 9/9 t (/home/shared/jack-307/apply-307-20261107T095313Z.txt), Raj+Grace told; Raj post-apply PASS dab8d69b; #449 merge after chain.
- 307 (grace/verify-runner-baseline-307 @6e2943a, mig md5 a2cfc53a, test e3b0bba9, rb ca777a25): Raj code PASS d99f1e3a 09:13Z; prod dry run 9/9 t + rollback dry run clean (/home/shared/jack-307-*dryrun-6e2943a-2026-11-07.txt), sent Raj bde74115 09:16Z. STAGED /home/shared/jack-307/run-307.sh (md5-gated apply + test). Raj RELEASE PASS 8fb4ff42 09:14Z; ASKED Matt 09:17Z to paste `! bash /home/shared/jack-307/run-307.sh`, check output, tell Raj+Grace. Grace has NO gh auth (94adacca): 307 PR #449 OPENED by me (base grace/verify-runner-306), Grace told. Chain #437/#438/#439/#446/#447/#448 all lack Ticket footer: footer Ticket: 4112300f-2ecb-81d3-96c1-cd5171f65a2d (VERIFY-ENGINE-01, Marcus 9a087185) ADDED to #437-#449 09:2xZ. After EACH merge reset ticket In Progress + Archived false; keep open until VERIFY-PROVE-01 Raj PASS. NEVER footer VERIFY-PROVE id. Runner WIP grace/verify-engine-runner @f8816f4 /home/grace/projects/po-wt-verify-runner: I pull + PR when Grace says ready (alerter+Grafana pending); daily 15:00Z User=grace. Raj A1: runner QA checks real class_diffs row has no business ids.
- VERIFY-PROVE-01 ticket 4112300f-2ecb-81cd-94e7-eab575e80b9b (Marcus caae8e56; Grace owner, Raj reviewer, TODO, est 2-3). Marcus added: empty-watermark rejection test, AC3 negative control (rule change -> hash change), AC2 input-relation list ratified by Raj BEFORE AC3 build. Shadow->live blocked until Raj PASS. My role: review/apply Grace migrations when they come. AC3 spec /home/shared/grace-verify-prove-ac3-spec-2026-11-07.md: I OK'd businesses.ingest_txid xid8 (5159519f) w/ conditions: 2-step add + lock_timeout, NO xmin backfill (NULL=pre-add, open_run refuses earlier as_at), pin trigger, grep SELECT */positional writers.
- 298 PARKED (Matt 931fbbca via Grace cbdeaace 01:45Z: park elec/carp, focus plumbing gaps). run-298.sh -> run-298.sh.PARKED, PR #436 draft, Raj PASS 69a8d514 @47c5d80 kept; re-pin self-gate on un-park. Do NOT ask Matt to run it.


## Remaining
- VERIFY-ENGINE chain merges #438 -> #439 -> #446 -> #447 -> #448 -> #449 still open (details + match-head shas in overflow file, Moved 10:15Z/09:50Z sections); Raj queue has 448/449.
- RUNBOOK/G-C rehearsal (kapi #199): detail in overflow file. Before acting, VERIFY live whether the G-C run inputs (temp Supabase project + prod dump) exist; do not assume a pending party.
- WEB-CHANGE-02 40d2300f-2ecb-8180-8934-d48bd5908b75 (change view + AK/API route) mine, BLOCKED on Grace: step 1 NOT PASS (Raj 25c9bd9b: added 71%/removed 50% vs 75% bar). Grace fixing matcher + removal stability, fresh blind sample. Do NOT build on current website_fact_change_event service_area rows (Grace f3398e5b).
- Archiver sweep before 13:00Z daily.
- MINE: S3a privacy (ticket 4072300f-2ecb-8167-8bae-e0f867153614, Backlog): br draft/s3a-privacy-account-data 399cb3d in ~/projects/konnex-website (worktree removed 30 Oct for disk; re-add with git worktree add); see In Progress line. Prod HELD = sign-up flag-on precondition.

## Resume notes
- Overflow (also #202 prod-deploy probe line, DATA API LAUNCH, SEGMENT/DESIGN-BUILD, OBS-DATES, living-profile r3/r4; S2 cutover, living-profile r2, UAT-QA-KEYS/#171 AC8/SUBURB-STATS lines moved 2 Nov 09:15Z): /home/shared/jack-progress-overflow-20261101.md
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
