---
task_id: release-121-127-followups-2026-10-02
agent: jack
session_id: 06c4f22a-d94a-4100-817b-29af86a854e5
model: claude-opus-5-5
status: context-exit
last_updated: 2026-10-14T06:55:19Z
notion_task_id: 3eb2300f-2ecb-81c9-a9a5-d6fbc267c23a
context_needed:
  files: [/home/shared/jack-grafana-ro-157/NOTES.md, /home/shared/jack-case5-dry/, /home/shared/ada-plumber-nsw-monthly-run-plan-20261003.md]
  branches: [konnex-data-pipeline:jack/grafana-ro-role PR #237 (worktree /home/jack/projects/kdp-wt-grafana-ro), konnex-ops:jack/exec-report-01 (merged; worktree /home/jack/projects/ops-wt-exec-report removable)]
  collaborators: [matt, marcus, rajesh, grace, ada]
---

## Done

## In Progress (RESUME FIRST)
- AK-WWW-RELEASE-01 DONE 14 Oct 06:51Z (www #51 b3eb65b; Matt confirmed via Marcus c515c62e; ticket Done+stamped). API prod konnex-api f8bac68 (on c258c93 incident fix #97, base 4575564; rollback c258c93 / 4575564), env in /home/jack/.env (ASK_KONNEX_DAILY_LIMIT_USD=10, ASK_KONNEX_PUBLIC_KEY_IDS=daed5ed0-362a-4fa5-a1ad-40b5d5027f3b). Vercel konnex-labs-website env: ASK_KONNEX_KX_API_KEY/AK_VISITOR_SALT/ASK_KONNEX_API_BASE (secrets /home/jack/.secrets/). Usage dashboard AK-USAGE-DASH-01 live.
  FOLLOW-UPS (mine): (1) port #97+#98 server.js to konnex-api main (main differs from prod line; PRs #97/#98 target main but must NOT merge as-is: build a main-based PR, Rajesh QA). (2) #97 nits: int range <=2147483647, transient error in row loop re-queue, class-42. (3) uat branch lacks proxy #50 9d793f8/8593912: open uat PR so UAT = www code. (4) remove worktrees kapi-wt-ak-guards, kapi-wt-events-fix, kw-wt-ak-guards, kdp-wt-ak-dash, ops-wt-purge-qq + konnex-data-api/.claude/worktrees/agent-a550ce456eee4aec2. (5) check purge RESULT lines (privacy-retention 03:40Z, query-log 17:10Z) include query_question. (6) Matt may revoke Vercel token jack-ak-www-release-2026-10-14 (/home/jack/.secrets/vercel-token).
- NOW 02:55Z: AK #91+#92+#93 LIVE prod 57373f38 (rollback chain 038d4941<-90db7a40<-4f34fb12; deploy = git bundle ff on konnex-api, restart, /api/health). WEBSITE DONE 13 Oct (RELEASE STEP: scripts/www-strip-held-links.js after copy-from-uat). Apex 307->308 = Matt. Listed-only rename + ACTIVITY-FLAG-01 DONE 13 Oct (AK prod 4575564a, rollback a32f306c). LIVENESS TIMER LIVE (2 Nov 06:00Z). NEXT: kdp #330 MERGED 1d5e6fe 15:3xZ (Rajesh be03f3f8; MI ff); REVIEW TOP-UP: kdp #332 MERGED 209b5f6 (Rajesh ffa884f9), MI ff, unit+timer installed in /etc DISABLED; dry-run-only OK (9,595 places, <=US$23.51). ENABLE only after Grace confirms 2 Nov manual run reconciled. OnFailure DONE: kdp #333 merged 8579d66, installed + verified (backup /root/unit-backup-20261013T1541Z). Grace mig 212 = sort-17 row for #331. PANEL 31 + MIG 212 + DFS GUARD LIVE 16:16Z (kdp #334/#331/#335; tickets Done + stamped; mi-weekly-cron at b3d7370; dashboard backup .bak-pre-pr331-20261013T161609Z).
- ESD-01 MIG 213 LIVE 18:27Z (kdp #336 8f88d8b; ticket Done+stamped; map v48 7,566; tiers 1,057/2,091/2,626 = 5,774; snapshots 18:38Z; CHECK validated). 
- TODO: rotate market_intel pw + ask_konnex_app RO pw (exposed 14 Oct). Rajesh konnex-qa push 401 = agents PAT (Matt).
- OPEN BUILDS: AK 'off' mode = withhold all Verified (Marcus 9299de21, low pri); ticket api_usage logging broken since 7 Apr; kdp #321 extractor v2 (Rajesh) before Mon 19 Oct 05:00Z; PROFILE_WEBSITE_CHANGES flip after Olivia's uat page; apex 307 -> Matt (Vercel). Use REST, never 'gh pr edit'.
- ONEGOV-DETAILS (kdp #313 merged): AFTER 1 NOV pin PR: capture first live details response; exact licensee-path allowlist instead of BFS (nominee ABN risk), tighten cabn regex, holder_name object guard; flip DETAILS_SHAPE_CONFIRMED.
- PLANNING: konnex-monthly@planning.timer live; watch 5 Nov 03:00Z first real month (2026-10). TODO: MONTHLY_HC_URL in /home/shared/config/konnex-monthly-planning.env. GOV-D1 = Ada.
- EXEC-REPORT-01 (3ed2300f-2ecb-814f-a15e-d211fe8a7298): live; TODO IVI freshness flag (Marcus b711acc1), exit-4 alert, EXEC_REPORT_HC_URL; Rajesh closes.
- DEMAND TIMER: DONE + LIVE 14:14Z (kdp #314 157c6aa, mig 202, pg_hba line 152 Matt OK 4b4aede1, ticket Done). WATCH first fire Tue 20 Oct 03:11Z (expect exit 75 if Sep unpublished; quiet <27th; re-read DFS balance 19 Oct, need >= US$10.81, was 37.10). TODO: RESULT line for 27/28 alert (Rajesh note 4); Nov run needs new DEMAND_RUN_APPROVED sig in /home/shared/config/konnex-monthly-demand.env; remove worktree kdp-wt-demand-runner.
- Agents GitHub PAT (/home/shared/secrets/github-pat-agents.token) = 401. Asked Matt: (a) agents use konnex-agents App (/etc/konnex/github-app.pem root:jack 640) or (b) new PAT. Meanwhile I open agents' PRs. Also hits konnex-qa: Rajesh push fails since fe2a845 (c7eea71e, 3 Oct 16:58Z); same fix.



- ops #329 pgBackRest repo2 (INCIDENT 3e82300f-2ecb-8133-8af2-f928075eaf9e): head 06cccba (Rajesh PASS abc89b8c on 00fd7c8, nits fixed; re-approve asked; diff Mon..Sat, 4h bound, exact-deb install by sha, archiver fails = box blips). repo1 verify OK 6 Oct. window Sun 11 Oct 03:00Z; merge LAST (closes incident). F2 alert ticket TODO.



- ONEGOV-NOV1-SWEEP-01 INSTALLED: kdp #299 merged a8dff73 (Rajesh PASS 245aa30c), units == QA head 5aade74, timer enabled, next elapse 2026-11-01 00:00Z. ON 1 NOV: check licence_recheck_run (mode rolling, ~00:00Z) <= 1100 onegov calls, 0 WorkClear, 1 Oct batch re-checked; tell Marcus + Grace. Marcus 4db674e1: KEEP 00:00Z (move only if Grace confirms onegov resets on Sydney time). LATER: WorkClear fallback on the nightly expiring job.


- AGENT TOKENS (po #340): alex + jack lack token files (Matt runs save-agent-token; I restart konnex-agent-tmux@<agent>).
- WATCH/TODO (condensed 13 Oct): GOV-D2 silo timer first real fire 5 Nov; ROUTER next contract touch reword 3f32300f basis (Grace 010d2eb9); kdp #279 Grace docs -> Rajesh light review -> merge + ff MI; SUPPLY-PANELS-02 3f22300f-2ecb-81fa-8d89-c5b6b060c8e4; AK cost Haiku test ~16 Oct if spend >US$100/mo; WorkClear probes w/ Grace; website-facts weekly run check + 131 re-snapshot per Grace/Marcus.
## Remaining
- CARLOS PR: konnex-seo docs/nsw-plumbers-seo-review-2026-10-10 (c9e2615); waits Matt adding konnex-seo to the App; then open (Rajesh light) + merge.
- ABR sweep: abn-status-sweep-weekly.service --min-days 7->6 (12:26Z, backup .bak-20261010T1226Z); Grace verifies after Tue 13 Oct 21:00Z. TODO: put this /etc unit under source control.
- TODO: token-cost dashboard weekly "use freely" card + carlos=Sonnet mis-attribution.
- ENTITY-MAP-TWIN-GUARD-01 3f22300f-2ecb-816a-b80e-d887a45453c8: scope -> PR -> Rajesh.
- Ada DEMAND-EVIDENCE-01: ~25 Oct (before 1 Nov 03:07Z) 124 dry run -> apply -> merge kdp #191 -> cherry-pick konnex-api #70 onto prod (rollback #70 before 124).
- Backlog bundle ticket 3ed2300f-2ecb-81f5-9049-dc04e0634c43 (dispatcher false REWORK, disk alert 90%, secret sweep, key hashing #40, etc.). SUPPLY-UNIVERSE-01 follow-ups on its ticket. Vercel bypass secret rotation = Matt.

## Resume notes
- Standing: stamp Prod Verified At on every migration applied. Docs PRs kdp #261-#263 + #241 still await Rajesh light review.
- Times to Matt in AEST; Telegram eats underscores (spell them out). Long msgs via file.
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = forced rollback; scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
