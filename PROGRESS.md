---
task_id: NSW-SUPPLY gap-closing canary (declared-ID never-blend lane)
agent: jack
session_id: ce1005be-f85b-43a3-8d2f-67cd5b3ee5b2
model: claude-opus-4-8
status: context-exit
last_updated: 2026-09-10T18:05:00Z
notion_task_id: 3d52300f-2ecb-8194
context_needed:
  files: [/tmp/037_gap_closing.sql, /tmp/037_grants.sql, /tmp/037_test.sql]
  branches: [main @4cfa9ba (konnex-data-pipeline, PR #104 merged)]
  collaborators: [rajesh (QA/release gate), grace (corroboration builder/spec), marcus (route/steward), matt (§8 + WC_API_KEY founder cred)]
---

## RESUME HERE (do this first)
>>> PRIORITY 1 — SYSTEMIC AGENT-OPS FIX (Matt-authorized 2026-09-10, sig df49bf4ae4b0a134: "I trust you to resolve both these issues... cut this time and token wastage"). This is the LEAD build. Two parts, both Rajesh-QA'd before deploy:
>>>   (1a) FIX-C strictly-newer gate in /home/shared/bin/agent-session-restore (~line 884-887). ROOT CAUSE FOUND: FIX-C adopts a different-task, override-eligible cwd PROGRESS.md over $HOME "REGARDLESS of timestamp" (its own F3 comment). A COMMITTED stale cwd copy (google-maps-scraper/PROGRESS.md, was commit f05e8a3 Sept-5, diff task) overrode my correct Sept-10 $HOME + memory.json at restart. FIX: never adopt a cwd copy whose last_updated is OLDER than $HOME's; align to "$HOME is the sole resume basis" (Matt's stated design). Edit in the OPS repo, `node --test`, PR, Rajesh QA, then deploy (agent-session-restore deploy is delicate — check its REPO-MAP/deploy pattern first). NOTE the repo re-commits [WIP] PROGRESS.md snapshots on every exit, so deleting the file is NOT durable — the code gate is.
>>>   (1b) progress-md-lint rule: reject unverified external-fact claims in PROGRESS.md, esp. "blocked on Matt for credential/key X". A carried note must be a POINTER-TO-VERIFY, never asserted as current truth. [[feedback_verify_credential_state_before_telling_matt_he_owes_a_key]]
>>>   STOPGAP ALREADY DONE (commit 3b35b55): synced repo google-maps-scraper/PROGRESS.md to canonical $HOME so task_ids match + FIX-C won't override THIS resume. (Do NOT redo.)
>>> PRIORITY 2 — CANARY (unblocked, Grace-led, gated; do NOT re-block on WC_API_KEY): WC_API_KEY IS PROVISIONED at /home/grace/.config/workclear/pro.key (mode-600, fired the 387 Sept-3 WP-4 calls; I can't ls /home/grace = 750, that inability fooled the old "missing" note — I + Grace both wrongly escalated to Matt, corrected). REVISED ROLES (agreed w/ Grace, my konnex-data exec lane STANDS DOWN): Grace runs the WHOLE canary from her process on konnex-ops — DB write is market_intel over MARKET_INTEL_DB_URI (network, verified INSERT on all 3 037 tables), WorkClear/DFS/ABR all callable from konnex-ops, WC key stays in her process (WP-4 precedent). NO token transfer, no konnex-data. MY open eng requirement before LIVE: the caller/harness that wires WC_API_KEY + enforces <=$0.40 hard-cap + dup/retry guards is NOT in PR #104 (only pure modules QA'd) — Grace stages the harness alongside evidence so my + Rajesh's dry-run sanity check covers the ACTUAL firing path. Criterion (ii) sufficiency is RAJESH's call (his independent gate). SEQUENCE: Grace stages Rajesh-(ii) evidence + harness ($0) -> Rajesh full PASS -> Grace dry-run numbers (count, projected cost, <=$0.40 cap, guards) posted for me+Rajesh sanity -> Grace fires LIVE. Under §6 (<=$0.40) no fresh Matt GO. [[feedback_verify_credential_state_before_telling_matt_he_owes_a_key]]

## Done
- Gap-closing never-blend lane MERGED (PR #104, 4cfa9ba; rajesh-konnex-bot code-owner APPROVED + Rajesh qa-pass). Fixed PR-UUID CI check (needs FULL Notion UUID via gh api PATCH). [[reference_kdp_pr_uuid_check_needs_full_notion_uuid]]
- Migration 037 APPLIED to prod (ssh konnex-data + sudo -u postgres): 3 tables (gap_closing_run_log/raw_snapshots/observation), 23 constraints. GRANTs applied+verified = {postgres=arwdDxt, matt=r, market_intel=ar}, EXACTLY matching sibling cap001_corroboration_state ACL; USAGE on both BIGSERIAL seqs. Real market_intel INSERT+ROLLBACK test PASSED (not dry-run), 0 rows persisted. Reported to Rajesh (sig 58b9a468c3a8ab62, GO 5e42f06458444d6f).
- APPRENTICE-SUPPLY WP fully DONE+QA'd earlier: obs_apprentice_supply live. Publication HELD (future §8), $0.

## In Progress
- Systemic agent-ops fix (PRIORITY 1, see RESUME HERE): root-caused + stopgap committed (3b35b55); FIX-C code gate + progress-md-lint rule NOT yet built (deferred to next window per 70% ceiling). No mid-flight build — clean boundary.
- Canary: unblocked, Grace-led from konnex-ops (see RESUME HERE P2). Both Jack + Grace context-exited this window. Grace confirms the spend-governing ORCHESTRATOR/harness does NOT exist yet (PR #104 = pure modules only) and must be BUILT next window (Grace's lane); until it exists there is nothing to dry-run/fire. $0 spent, nothing to roll back.

## Remaining (standby, not blocked on me)
- CANARY ORCHESTRATOR (Grace's lane, next window): build the harness wiring WC_API_KEY + DB + DFS + 200-row spec + <=$0.40 hard-cap + dup/retry guards. My eng requirement: harness staged for my+Rajesh dry-run sanity (spend-cap enforcement lives in the CALLER, not the QA'd pure modules). Then Rajesh 3-point PASS -> dry-run numbers -> Grace fires live.
- Ops-Monitoring Dashboard (3d52300f-2ecb-811b): /funnel + /sources LIVE. REMAINING = per-point deltas + /changes tab, gated on Grace's obs_change_*/snapshot layer (obs_change_* tables NOT yet in prod, verified 2026-09-10).
- §8 ledger: coverage-supply + customer PUBLICATION = FUTURE §8, HELD.
- Phase-2 NSW live-status re-key: gated on NSW Trades quota reset ~2026-10-01.

## Resume notes
- 037 rollback: DOWN block DROPs the 3 tables + deletes sources row 'dfs_gap_closing_serp_lead'; per-run cleanup by run_id. Add-only, no consumer yet, fully reversible.
- workclear-client.js requires WC_API_KEY (env-only, apiKey ctor arg) — but the key is PROVISIONED (see RESUME HERE): /home/grace/.config/workclear/pro.key. It's a wiring step (export env), NOT a missing credential. Never re-assert "blocked on Matt for the key."
- Prod DDL pattern: ssh konnex-data + sudo -u postgres; SET ROLE market_intel; GRANT SELECT TO matt. [[reference_market_intel_db_superuser_path_and_explorer_alias_stale]]
- Role canon: Jack authors+deploys / Rajesh QAs (release gate) / Marcus routes+reconciles / Matt decides §8. [[feedback_s8_role_canon_dont_drift_peer_roles_in_relays]]
- Don't deploy ahead of Rajesh's gate. [[feedback_dont_execute_ahead_of_agreed_failclosed_gate]]
- MID-work exit: NO agent-offline (want auto-relaunch).
