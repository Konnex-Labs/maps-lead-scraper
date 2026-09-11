---
task_id: Ask Konnex UAT Q&A backend (WP 3d82300f-2ecb-81a5-b549-f6e2a2d1e7e8, epic 81a3)
agent: jack
session_id: 3f3b9266-129c-4e4a-87c3-a627670148ed
model: claude-opus-4-8
status: context-exit
last_updated: 2026-09-11T06:56:00Z
notion_task_id: 3d82300f-2ecb-81a5-b549-f6e2a2d1e7e8
context_needed:
  files: [lib/ask-konnex.js, lib/tool-handlers/get_supply_stat.js, /home/shared/uat-supply-readiness/SERVICED-AREA-KOGARAH-CONFIRMATION.md]
  branches: [konnex-api main@0c6624d (PR #31+#32 MERGED+DEPLOYED); konnex-website PR #21 (Olivia FE) APPROVED, merging to uat]
  collaborators: [rajesh (QA closed+APPROVED, context-exited), olivia (FE #21 merge to uat), grace (serviced-area data, context-exited), marcus (§8 routing), matt (§8 serviced-area pick)]
---

## RESUME HERE (do this first)
>>> ASK KONNEX UAT DEMO = LIVE ✅ (06:47Z). FULL CHAIN SHIPPED: backend 3 PRs (/v2/ask + 5 metrics incl service_area, main@18d8be6, prod :3457) + FE PR #21 merged to uat (commit 5f7ea00, Rajesh QA PASS+APPROVE). UAT health GREEN. Matt celebrated (screenshot: 42.7% website-presence grounded answer rendering live). NO open backend items.
>>> NEXT = TWO MATT-OWNED DECISIONS (both routed, awaiting his word — do NOT self-issue):
>>>   (1) WC-failover canary SEQUENCING GO — precondition (UAT go-live) now MET; I routed to Matt 06:47Z (no-rush). On his GO: green-light Grace -> harness build -> Rajesh 3-pt QA PASS -> numbers-GO -> only THEN WC_API_KEY spend (≤$30/run, $0 to date). Grace+Rajesh standing by, NOT self-starting.
>>>   (2) PROD/main promotion of Ask Konnex — §8-HELD per Matt's standing hold. His call when ready; on GO I do the in-contract prod deploy.
>>> GOTCHAS: local box can't resolve konnex-data-api.konnexlabs.com (sandbox egress) — verify via ssh konnex-api :3457. market_intel DB via MARKET_INTEL_DB_URI (role 'jack' does NOT exist — use the URI creds, not peer auth). §8 canonical serviced-area query: /home/shared/serviced-area-declared-only-query-grace-2026-09-11.md.
>>> FOLLOW-UP (mine, post-demo): ghost-recovery hardening — 2nd occurrence tonight (Carlos+Olivia). Ghost-check must SKIP intentionallyOffline=true OR offline transition must always set state=offline (stale state=online + parked = 641-fire loop). Root watchdog = agent-zombie-reaper. Matt agreed post-demo priority.

## Done
- PR #31 (backend: /v2/ask Haiku-routed grounded Q&A + /v2/tools/get_supply_stat, 4 metrics, never-fabricate, loop-cap 3) merged f605aaa. Rajesh QA CLOSED (20/20 + 5-Q E2E PASS).
- PR #32 (vintage-anchor fix: SYSTEM_PROMPT echoes as_of verbatim, no training-year hallucination; keeps only fixed licence-snapshot 2023-12-04 as format example, apprentice stays dynamic) merged 0c6624d + DEPLOYED. Q4 re-run PASS.
- Supabase auth outage (project dvdaabdlerqrdezhqwvd auto-paused -> all authed 500) RESOLVED by Matt unpause 04:49Z. [[reference_konnex_api_auth_pool_is_supabase_explorer_only]]
- Anthropic credit CLEARED ($49.98). Contract: /home/shared/ask-konnex-endpoint-contract-jack-2026-09-11.md.

## In Progress
- Olivia: live-verify FE #21 preview -> merge askkonnex-uat-live -> uat (demo go-live). Her lane, not mine.
- Olivia RESTARTED per MATT go (FULL sig 4fadcbfa102bfb59, matt->jack verb=question 'restart olivia', verified VALID 06:39Z): claude live (opus-4.8), state=online, task retained. NOTE attribution: my '[Olivia] per your go' broadcast read ambiguously -> Grace audited thinking I cited HER; corrected on record 06:4xZ = it was MATT's go, Grace gave none. (Lesson reinforced: name role-holder, not 'your', in group sends.)
- Olivia live-verified backend 06:42Z: apprentice prose now 'reference period ending 2025-12-31' (5,960), all 5 grounded cases PASS. Her earlier Q4 '2021' FAIL was a STALE pre-deploy preview — PR #32 (0c6624d, live :3457) already derives as_of dynamically from latest ref_quarter; NO backend patch needed. Grace data confirms latest=2025Q4, no 2021 row.
- ASK KONNEX UAT GO-LIVE = COMPLETE ✅ (06:47Z): Rajesh formal QA GATE PASS + GitHub APPROVE (E2E Q1-Q5b all PASS), Olivia merged FE PR #21 -> uat (commit 5f7ea00) under in-contract authority. Post-merge UAT health GREEN (plumber 20,182, apprentice 5,960@2025-12-31, out-of-set answerable:false). Full chain shipped: backend 3 PRs (/v2/ask + 5 metrics) + FE #21. Reported to Matt. PROD/main promotion = §8-HELD per Matt's standing hold — untouched, his call.

## Remaining (standby)
- WC-failover gap-closing probe (Grace-built, criterion ii): precondition (UAT go-live) NOW MET. Sequencing START = MATT's explicit on-record GO (NOT inferred from demo-live). ROUTED to Matt 06:47Z (framed no-rush, his call). Grace + Rajesh standing by; Grace will NOT self-start. On Matt GO: I green-light Grace -> harness build -> Rajesh 3-point QA PASS -> numbers-GO -> only THEN any WC_API_KEY spend (≤$30/run). $0 to date. Do NOT self-issue the sequencing GO.
- CARLOS agent crash-loop (Tier-2 infra, mine): CONTAINED — RCA = OAuth token expired 2026-06-25, refresh token dead, can't auto-renew → 401 loop; ghost-recovery re-fired every 10min because health had state="online" while intentionallyOffline=true (ghost check keys off state, not flag). Ran agent-offline carlos (state=offline) → noise stops. IRREDUCIBLE FIX escalated to Matt: fresh claude login/setup-token on his Max acct (alex also dead, expired 06-14). WP-L2 supply-split blocked until re-auth. [[reference_konnex_fleet_oauth_and_ghost_recovery]]
- OLIVIA ghost-loop (2026-09-11 06:3xZ, mine): CONTAINED. 641 ghost-recovery fires. RCA = she cleanly context-exited 04:53Z (31% budget, FE #21 code-complete@961b888a not merged), then parked offline 05:01Z but state field left STALE=online -> ghost-watchdog keys off state, force-recovered ~every 10min. NOT dead-token (her OAuth valid exp 11:30Z). Fixed via agent-offline olivia -> state=offline consistent, noise stopped, currentTaskId retained for resume. This is the 2nd hit of the ghost-hardening bug below -> raised priority w/ Matt.
- GHOST-RECOVERY HARDENING (follow-up, mine, NOW 2ND OCCURRENCE Carlos+Olivia -> bumped): ghost-check must SKIP agents with intentionallyOffline=true (OR the offline transition must always set state=offline) so a parked/dead-token agent can't loop forever. Root-run watchdog (likely agent-zombie-reaper in /home/shared/bin). Recommended to Matt: prioritize post-demo.
- §8 serviced-area service_area metric: SHIPPED + DEPLOYED + PROD-VERIFIED (PR #33, main@18d8be6). CLOSED.
- SECURITY (post-demo, low pri): rotate UAT key ask-konnex-uat@konnexlabs.com (shared on agent bus, sha-only store, free key). `UPDATE api_profiles SET api_key='kx_live_'||encode(gen_random_bytes(24),'hex') WHERE email='ask-konnex-uat@konnexlabs.com'` on EXPLORER_DB_URL after demo.
- Jack ACL PENDING (Rajesh req): rajesh:r on /home/grace + /home/marcus.
- Canary (Grace-led, gated). Ops-Monitoring Dashboard /changes gated on Grace's obs_change_*.

## Resume notes
- Role canon: Jack authors+deploys / Rajesh QAs (release gate) / Marcus routes / Matt decides §8. [[feedback_s8_role_canon_dont_drift_peer_roles_in_relays]]
- VPS deploy = git bundle (no GH key on box); secrets in /home/jack/.env not repo. [[reference_konnex_api_vps_deploy_bundle_and_env_file]]
- PR-UUID CI gate needs full 32-hex Ticket: UUID; reviewer = request rajesh-konnex-bot via REST. [[reference_kdp_pr_uuid_check_needs_full_notion_uuid]]
- MID-work exit: NO agent-offline (want auto-relaunch on Matt §8 ruling / Olivia merge confirm).
