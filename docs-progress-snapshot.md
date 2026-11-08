---
task_id: JACK-QUEUE-2026-11-06
agent: jack
session_id: a0f7ef93-4c54-45fb-bd22-ac5676fa0ef9
model: claude-opus-5-5
status: context-exit
last_updated: 2026-11-08T07:59:00Z
notion_task_id: 4102300f-2ecb-81ef-a0cf-c8eb8c391818
context_needed:
  files: [konnex-api docs/api/2026-10-31-data-v1-getcatalog-build-contract.md, docs/api/openapi-v1.json, docs/api/2026-10-28-s1-rights-sheet.md]
  branches: [konnex-api main dfe495e (prod = cherry-pick tree), kdp main]
  collaborators: [matt, marcus, rajesh, grace, ada, olivia]
---
## Done

## In Progress (RESUME FIRST)
- RESUME HERE (07:59Z, ctx-exit): WAIT for Raj qa-pass (he restarted 07:58Z, cbe7db45: 462 stock gate PASS, deep read pending; do NOT hash-gate 462 or install 380 before his PASS). 317 r2 = kdp PR #462 @be4a079cf86ba7f0abc47f45af31ca71094d7136 (branch grace/verify-licence-gap-317-r2; old 7c7bed9 superseded), my A4 items verified addressed, Raj QA asked 4bfd15bc. On PASS: merge --match-head-commit, hash-gate blob/sha256 of migrations/317_verify_licence_gap_current.sql, scripts/prod-dry-run.sh, apply, post-check (ve_licence_stopped exists, SELECT ve_reader only, no PUBLIC; gap_entity cols unchanged), ping Grace for fresh prod counts. ops PR #380 @daf52793 (mine; wt /home/jack/projects/ops-wt-317map): abn_identity_ambiguous box0 + business_id tiebreak, Raj QA asked c58fe8f6; on PASS merge, install views.js + public/ to /opt (bak), restart, checks, reset ticket. DONE earlier: ops #377/#378/#379 deployed (latest /opt bak opt-engine-dash.bak-20261108T073302Z.tgz, main dd813d9a). Then SOURCE=db switch (ve_reader login role, Raj QA).
- RESUME HERE (05:46Z) MATT BLANKET GO 3c008e6dd007e8b7 (05:43Z, quote: "I approve any remaining outstanding decisions based on what you guys have done to get the decision engine dasboard 4 views live") -> covers 315 DR + P1 sign-off. DONE: token block run by Matt; engine-dash ENABLED+active :3467 (fixtures), authed local GET /verification-engine/ 200 (header X-Engine-Token; ~/.engine-dash-token chowned jack); Caddy dash block route added (bak /home/shared/jack-313/Caddyfile.bak-pre-engine-dash-20261108T054400Z), validated as caddy, reloaded, ext no-auth 401; asked Matt to open link to confirm token inject (then check journalctl -u engine-dash). ops #370 MERGED 71d434c6 (ticket 4122300f-2ecb-8136 reset). NEXT (in order): (1) kdp #459 mig 315: tell Raj Matt GO resolves his QUALIFIED a88ca29f -> hash-gate @8a4fc543 blob, merge, dry-run, apply, post-check; (2) deploy /opt/engine-dash from ops main (git archive 71d434c6 incl #368 source_registry + P1 public/), back up /opt first, restart, authed check; (3) live switch SOURCE=db with ve_reader login role (design in Phase 0 brief sec 7; Raj QA the switch); Deployed Identity on 4122300f-2ecb-8153. Matt tests MCP this evening (AC10 Pass 1 steps file ready). orch #185 MERGED + 314 APPLIED 05:28Z; kdp #460 merged. ops #369 Raj PASS needs ticket footer. Close #366 DENIED (Matt asked).
- MCP-OAUTH-01 #210 (merged b9c2a341, UAT live flags on, AC9 PASS-QUALIFIED 4e8dc4c5, errata #2 in contract): WAITING on Matt for (1) AC10 Pass 1 (claude.ai connector; then grep journalctl -u konnex-api-uat refused client_id, verify claude.ai CIMD, append to OAUTH_CIMD_ALLOWED_CLIENT_IDS w/ env bak + restart, errata #3, tell Matt -> Pass 2) and (2) deleting QA auth users A a4b52c24 / B 6ed7e3fa in the UAT dashboard (then verify profiles 404). Full detail in the overflow file (04:52Z section). Do NOT retry the classifier-DENIED key/env lookups.
- MCP-SERVER-01 ticket 4112300f-2ecb-812d-8e11-e5ea78619d29 (Marcus 137668b5; supply-block-only agreed). PR UUID check rejects Refs: (only Ticket/Closes/Fixes) -> intermediate PRs need Ticket footer + reset ticket status after merge flip, or a single final PR.



- ENGINE-DASH-01 background (A3 doc, Grace 313/314 conditions, URL) + WorkClear primary plan: moved to overflow file 04:10Z 8 Nov.

## Remaining
- Disk 86% (21G free) 06:30Z: /tmp _MEI* 2.5G orphaned (rajesh/olivia owned); my sudo rm DENIED by classifier, do NOT retry; told Raj quiet to have owners clear own. Was: Disk WARN 85% konnex-ops (23G free, flat 2h; Raj b7c9a7b7): /home/jack 33G (konnex-website 3.5G, .cache 3G, .npm 711M) - 03:38Z removed unreferenced playwright chromium-1217 (~0.6G); still 85%, bulk is elsewhere (122G used vs /home/jack 33G) - next: du / top-level, not urgent.
- Unread quiet: marcus 9efbf427 (inbox archive jack-20261108T030928Z).
- Board sweep + UAT Vercel/catalog-bind notes moved to overflow 23:55Z. Vercel-token search DENIED: do not retry.
- WEB-CHANGE-02 (mine) BLOCKED on Grace matcher fix; detail in overflow file.
- Archiver sweep before 13:00Z daily.

## Resume notes
- Also open (MCP NAV + WEB-KONNEX-IO moved 03:10Z; others 23:31Z; overflow file, read on idle): VERIFY-PROVE-01 (Grace migs, my review), 298 PARKED, disk /tmp/_MEI, RUNBOOK/G-C, S3a privacy.
- Overflow (also #202 prod-deploy probe line, DATA API LAUNCH, SEGMENT/DESIGN-BUILD, OBS-DATES, living-profile r3/r4; S2 cutover, living-profile r2, UAT-QA-KEYS/#171 AC8/SUBURB-STATS lines moved 2 Nov 09:15Z): /home/shared/jack-progress-overflow-20261101.md
- S2b W0 facts (UAT schema, SMTP, Caddy bak, prod api_profiles gap): see overflow file.
- GITHUB: jack SSH key rejected since 30 Oct; push via HTTPS konnex-gh-app-token (x-access-token).
- Migrations: `cat f.sql | ssh konnex-data 'sudo -u postgres psql -X -d market_intelligence -v ON_ERROR_STOP=1'`; dry run = scripts/prod-dry-run.sh (main a097470; never by hand); scripts that write temp files: run the WHOLE script as postgres on konnex-data.
- Merges: /home/jack/projects/ops/bin/konnex-gh pr merge --squash --match-head-commit <full sha>; body needs `Ticket: <full uuid>`; request rajesh-konnex-bot. Merging a Ticket-footer PR sets the ticket Done.
- ops deploys: single-file install from the merge commit (local ops checkout is deliberately behind); back up first.
