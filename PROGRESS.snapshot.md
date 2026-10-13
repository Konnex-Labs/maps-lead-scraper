---
task_id: release-121-127-followups-2026-10-02
agent: jack
session_id: 71f6bf3c-a2eb-4228-b977-f36214216d9f
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-13T02:19:01Z
notion_task_id: 3eb2300f-2ecb-81c9-a9a5-d6fbc267c23a
context_needed:
  files: [/home/shared/jack-grafana-ro-157/NOTES.md, /home/shared/jack-case5-dry/, /home/shared/ada-plumber-nsw-monthly-run-plan-20261003.md]
  branches: [konnex-data-pipeline:jack/grafana-ro-role PR #237 (worktree /home/jack/projects/kdp-wt-grafana-ro), konnex-ops:jack/exec-report-01 (merged; worktree /home/jack/projects/ops-wt-exec-report removable)]
  collaborators: [matt, marcus, rajesh, grace, ada]
---

## Done

## In Progress (RESUME FIRST)
- RESUME 02:18Z 13 Oct. DONE today: #88 verified-mode (AK==profile 1,057), mig 207+snapshot set 15, mig 208 + konnex-api #90 DEMAND-12M (prod 4f34fb12; rollback reset fb1e4495), #89 closed superseded, tickets closed. FIRST RELEASE (Marcus fe7d03c6, Matt 5d252c5243e9e11c VALID, plan /home/shared/marcus-first-release-plan-2026-10-13.md): (1) website #33/#38: Rajesh verified but his GitHub approve is BLOCKED by his classifier -> he retries; if still blocked escalate to Matt; never merge w/o approval; #38 is draft (undraft via REST). (2) processor list DONE /home/shared/jack-privacy-processor-list-2026-10-13.md; Marcus privacy [TO CONFIRM] facts: subagent running -> verify + relay (b017456e); my steer = stop collecting raw lat/lng if unused. (3) #39 redirects (head 482d57f9, ticket 3f82300f-2ecb-81fc-9e85-c86e76ab5976) Rajesh QUALIFIED PASS a75a9dce; F1 da472486: NEVER ship #39 alone -> ONE combined main vercel.json = #39 + Carlos explorer-410 (seo/explorer-410-2026-10-13 @47c30d66, .vercelignore + api/gone.js) + main /data->/ 301; gate = post-main probe /home/shared/carlos-explorer-410-probe-urls.txt (+/sitemaps,/au/data,/data/x; controls). Approval blocker applies. (4) apex 307 -> Matt (Vercel dashboard). UPDATE 02:20Z: TWO branches carry item 7: Carlos seo/explorer-410-main @1109555 (stacked on #39; 301s + 410 rewrites + /data; in Rajesh QA) AND Olivia olivia/first-release d22fb019 (host-scoped). Asked Marcus to pick (5183db27; my lean A = Carlos's combined branch, Olivia drops her item-7 entries). GO on dependencies given. Privacy-facts subagent result may not reach next session -> rerun read-only (answers for Marcus b017456e). NEXT BUILDS: key_stat.target(+period) when all demand rows share one target (Olivia 30243662); 'off' mode = AK withholds all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr. Use REST, never 'gh pr edit'. OTHER: kdp #321 extractor v2 (Rajesh) before Mon 19 Oct 05:00Z; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page.
- 12 Oct: labels COMPLETE; DISK-GUARD-01 LIVE; W42 PII PASSED (kdp #317). 131 snapshot invalid on carry epochs until 204 (see RESUME). W42 feeds no surface beyond 204/205. Open: Vercel 308 + konnex-seo App (Matt).
- ONEGOV-DETAILS: kdp #313 MERGED 9a5b2e4 (Rajesh PASS 051499f8), MI ff. AFTER 1 NOV pin PR: capture first live details response; swap BFS for exact licensee-path allowlist (Rajesh: BFS can return nominee ABN when licensee has none), tighten key regex (cabn), holder_name object guard; flip DETAILS_SHAPE_CONFIRMED.
- DFS: topped up 10 Oct (~US$50-60). No sweep until 1 Nov. Guard ticket DFS-BALANCE-GUARD-01 3ee2300f-2ecb-81a4-bb32-f367992f6b6d (due 18 Oct; add appendix 6/min per-account limit).
- PLANNING: 202609-a validated (row id 2); kdp #305 merged 9b8f6bb, MI ff; konnex-monthly@planning.timer INSTALLED+ENABLED 06:52Z (next Sun 11 Oct ~03:11Z, expect no-op). Watch 5 Nov 03:00Z first real month (2026-10). TODO: MONTHLY_HC_URL in /home/shared/config/konnex-monthly-planning.env. GOV-D1 = Ada's to close.
- EXEC-REPORT-01 (3ed2300f-2ecb-814f-a15e-d211fe8a7298): live; TODO IVI freshness flag in Decisions (Marcus b711acc1), exit-4 alert, EXEC_REPORT_HC_URL; Rajesh to close.
- DEMAND TIMER: DONE + LIVE 14:14Z (kdp #314 157c6aa, mig 202, pg_hba line 152 Matt OK 4b4aede1, ticket Done). WATCH first fire Tue 20 Oct 03:11Z (expect exit 75 if Sep unpublished; quiet <27th; re-read DFS balance 19 Oct, need >= US$10.81, was 37.10). TODO: RESULT line for 27/28 alert (Rajesh note 4); Nov run needs new DEMAND_RUN_APPROVED sig in /home/shared/config/konnex-monthly-demand.env; remove worktree kdp-wt-demand-runner.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.



- ops #329 pgBackRest repo2 (INCIDENT 3e82300f-2ecb-8133-8af2-f928075eaf9e): head 06cccba (Rajesh PASS abc89b8c on 00fd7c8, nits fixed; re-approve asked; diff Mon..Sat, 4h bound, exact-deb install by sha, archiver fails = box blips). repo1 verify OK 6 Oct. window Sun 11 Oct 03:00Z; merge LAST (closes incident). F2 alert ticket TODO.



- ONEGOV-NOV1-SWEEP-01 INSTALLED: kdp #299 merged a8dff73 (Rajesh PASS 245aa30c), units == QA head 5aade74, timer enabled, next elapse 2026-11-01 00:00Z. ON 1 NOV: check licence_recheck_run (mode rolling, ~00:00Z) <= 1100 onegov calls, 0 WorkClear, 1 Oct batch re-checked; tell Marcus + Grace. Marcus 4db674e1: KEEP 00:00Z (move only if Grace confirms onegov resets on Sydney time). LATER: WorkClear fallback on the nightly expiring job.


- AGENT TOKENS (po #340): alex + jack lack token files; Matt runs save-agent-token <agent>, I restart konnex-agent-tmux@<agent> + check auth=token-file.
- WATCH/TODO (condensed 13 Oct): GOV-D2 silo timer first real fire 5 Nov; ROUTER next contract touch reword 3f32300f basis (Grace 010d2eb9); kdp #279 Grace docs -> Rajesh light review -> merge + ff MI; SUPPLY-PANELS-02 3f22300f-2ecb-81fa-8d89-c5b6b060c8e4; AK cost Haiku test ~16 Oct if spend >US$100/mo; WorkClear probes w/ Grace; website-facts weekly run check + 131 re-snapshot per Grace/Marcus.
## Remaining
- CARLOS PR: konnex-seo docs/nsw-plumbers-seo-review-2026-10-10 (c9e2615); waits Matt adding konnex-seo to the App; then open (Rajesh light) + merge.
- ABR sweep: abn-status-sweep-weekly.service --min-days 7->6 (12:26Z, backup .bak-20261010T1226Z); Grace verifies after Tue 13 Oct 21:00Z. TODO: put this /etc unit under source control.
- TODO: token-cost dashboard (:3464, ops checkout) weekly-aware "use freely" card + carlos=Sonnet row mis-attribution (ask Rajesh to dedupe his transcripts).
- ENTITY-MAP-TWIN-GUARD-01 3f22300f-2ecb-816a-b80e-d887a45453c8: scope -> PR -> Rajesh.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle ticket 3ed2300f-2ecb-81f5-9049-dc04e0634c43 (dispatcher false REWORK, disk alert 90%, secret sweep, key hashing #40, etc.). SUPPLY-UNIVERSE-01 follow-ups on its ticket. Vercel bypass secret rotation = Matt.

## Resume notes
- Standing: stamp Prod Verified At on every migration applied. Docs PRs kdp #261-#263 + #241 still await Rajesh light review.
- Times to Matt in AEST; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = forced rollback; scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
