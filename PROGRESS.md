---
task_id: NSW-SUPPLY gap-closing canary (declared-ID never-blend lane)
agent: jack
session_id: ce1005be-f85b-43a3-8d2f-67cd5b3ee5b2
model: claude-opus-4-8
status: context-exit
last_updated: 2026-09-10T17:58:00Z
notion_task_id: 3d52300f-2ecb-8194
context_needed:
  files: [/tmp/037_gap_closing.sql, /tmp/037_grants.sql, /tmp/037_test.sql]
  branches: [main @4cfa9ba (konnex-data-pipeline, PR #104 merged)]
  collaborators: [rajesh (QA/release gate), grace (corroboration builder/spec), marcus (route/steward), matt (§8 + WC_API_KEY founder cred)]
---

## RESUME HERE (do this first)
>>> STATE: gap-closing lane SHIPPED to main (PR #104, squash 4cfa9ba). Migration 037 APPLIED+verified to prod (market_intelligence, konnex-data). Matt §8 canary release CONFIRMED (sig d5319aa68903f5c7). Deploy fully done — clean boundary, nothing in-flight. $0 spent to date.
>>> NEXT-ME = CANARY FIRE. I fire it on konnex-data (my exec lane; Grace has no SSH there). WC_API_KEY IS PROVISIONED — do NOT tell Matt it's missing (I made that mistake 2026-09-10; Grace made it hours earlier; Matt corrected both, pointed at Cortex/history). The key lives at /home/grace/.config/workclear/pro.key (Grace's config, mode-750 so I CAN'T ls it — that inability is what fooled the old "not provisioned" note). It is the SAME key that fired the 387 Sept-3 WP-4 Track-B calls, so it demonstrably works. Runner (licence/gap-closing/workclear-client.js) reads WC_API_KEY env-only. FIX = Jack<->Grace, NO Matt action: Grace exports WC_API_KEY from pro.key at fire time (stays in her process, as WP-4) OR hands me the value securely to stage 600. Awaiting Grace's (a)/(b) choice (my msg 2026-09-10). Rajesh criterion (ii) clears once the run can auth. [[feedback_verify_credential_state_before_telling_matt_he_owes_a_key]]
>>> FIRE SEQUENCE once WC_API_KEY lands: (1) Rajesh clears probe criterion (ii) -> full PASS. (2) I run runner --DRY-RUN on konnex-data, report task-count + projected cost + hard-cap(<=$0.40) + dup/retry guards -> Grace "numbers-go". (3) I fire --LIVE (first live IS the canary). Split: Grace owns spec (200-row, S1:S2 154:46, DFS-SERP-first) + yield/call-count analysis + Marcus report; I own konnex-data exec. Hard stop before cap; loop Rajesh; Grace reconciles actual spend vs DB post-run. Under §6 (<=$0.40 << $30) no fresh Matt GO for the spend.
>>> RESTART-GATE GUARD (FOLLOW-UP #2): HELD on Matt's separate yes/no — NOT covered by the §8 canary GO. Do NOT build yet. Recommendation: make agent-request-restart WARN-and-PROCEED on PROGRESS.md lint-fail (resume side already tolerates malformed frontmatter); a hard-refuse is what stranded me into compaction.

## Done
- Gap-closing never-blend lane MERGED (PR #104, 4cfa9ba; rajesh-konnex-bot code-owner APPROVED + Rajesh qa-pass). Fixed PR-UUID CI check (needs FULL Notion UUID via gh api PATCH). [[reference_kdp_pr_uuid_check_needs_full_notion_uuid]]
- Migration 037 APPLIED to prod (ssh konnex-data + sudo -u postgres): 3 tables (gap_closing_run_log/raw_snapshots/observation), 23 constraints. GRANTs applied+verified = {postgres=arwdDxt, matt=r, market_intel=ar}, EXACTLY matching sibling cap001_corroboration_state ACL; USAGE on both BIGSERIAL seqs. Real market_intel INSERT+ROLLBACK test PASSED (not dry-run), 0 rows persisted. Reported to Rajesh (sig 58b9a468c3a8ab62, GO 5e42f06458444d6f).
- APPRENTICE-SUPPLY WP fully DONE+QA'd earlier: obs_apprentice_supply live. Publication HELD (future §8), $0.

## In Progress
- Canary held on WC_API_KEY (see RESUME HERE). No mid-flight state — nothing to roll back.

## Remaining (standby, not blocked on me)
- Ops-Monitoring Dashboard (3d52300f-2ecb-811b): /funnel + /sources LIVE. REMAINING = per-point deltas + /changes tab, gated on Grace's obs_change_*/snapshot layer.
- §8 ledger: coverage-supply + customer PUBLICATION = FUTURE §8, HELD.
- Phase-2 NSW live-status re-key: gated on NSW Trades quota reset ~2026-10-01.

## Resume notes
- 037 rollback: DOWN block DROPs the 3 tables + deletes sources row 'dfs_gap_closing_serp_lead'; per-run cleanup by run_id. Add-only, no consumer yet, fully reversible.
- workclear-client.js requires WC_API_KEY (env-only, apiKey ctor arg) — but the key is PROVISIONED (see RESUME HERE): /home/grace/.config/workclear/pro.key. It's a wiring step (export env), NOT a missing credential. Never re-assert "blocked on Matt for the key."
- Prod DDL pattern: ssh konnex-data + sudo -u postgres; SET ROLE market_intel; GRANT SELECT TO matt. [[reference_market_intel_db_superuser_path_and_explorer_alias_stale]]
- Role canon: Jack authors+deploys / Rajesh QAs (release gate) / Marcus routes+reconciles / Matt decides §8. [[feedback_s8_role_canon_dont_drift_peer_roles_in_relays]]
- Don't deploy ahead of Rajesh's gate. [[feedback_dont_execute_ahead_of_agreed_failclosed_gate]]
- MID-work exit: NO agent-offline (want auto-relaunch).
