---
task_id: v2-phase-2-clean-cut-au-trades-scope-reduction
agent: jack
session_id: 2026-07-08T15Z-phase2-clean-cut-kickoff
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-08T15:52:00Z
notion_task_id: 3912300f-2ecb-8159-a300-ec7bd5009746
context_needed:
  files:
    - "/home/jack/projects/konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT.md"
    - "/home/jack/projects/konnex-data-api/google-maps-scraper/V2-FOUNDATION-SYNTHESIS.md"
    - "/home/jack/projects/konnex-data-pipeline/migrations/015_v2_entity_core_foundation.sql"
    - "/home/jack/projects/konnex-data-pipeline/migrations/019_v2_entity_membership_backfill.sql"
    - "/home/jack/projects/konnex-data-pipeline/migrations/020_v2_velocity_baseline_preservation.sql"
  branches: []
  collaborators: [matt, rajesh, grace]
---

# 🟢 PHASE 2 — CLEAN-CUT + PILOT (Tier-3 destructive) — RESUME HERE

> **⏭️ CONTEXT-EXIT @64% (mid-work, 2026-07-08T15:52Z). MATT INSTRUCTED restart-with-fresh-context. DO NOT agent-offline — auto-relaunch is DESIRED to continue the build.**
> **NEXT ACTION ON RELAUNCH:** author the export + soft-archive migration + runbook, then run the STAGING dry-run on konnex_staging_v2 (both layers). Spec is LOCKED + Rajesh-QA-PASSED (contract v2, branch `v2/phase2-clean-cut-contract` commit b145ab0). Recommend a FRESH large-build pass. Details in "SPEC LOCKED" + Remaining sections below.
> **Matt GO to proceed with the BUILD+STAGING: sig `2c556fdd3cba0c1b` VALID (2026-07-08).** NOTE: this GO covers the migration build + staging dry-run only. **PROD Phase 0/1 (export + soft-archive) STILL needs a SEPARATE Matt execution GO** (contract §10); hard-purge = a THIRD separate GO after 7-day cooling. Do NOT self-authorize prod writes off this build GO.


**Matt GO'd Phase 2** 2026-07-08T15:14Z — sig **4a1a16ae1897d78a VALID** ("you have permission to go on Phase 2").
This clears the PHASE gate. Internal safety gates REMAIN: spec → Rajesh QA → staging dry-run → full backup + PITR + AC-6 hash verify → prod on a SEPARATE final go-live GO. NO prod writes / NO spend yet.

Prior task **SP-4 / V2 Foundation Phase 1 is COMPLETE** (mig020 prod-applied, all 7 ACs PASS, 4/4 sub-phases). AC-6 prod preservation hash = **3 rows / MD5 23692c660633e5d66059b8036272e428** — Phase-2 clean-cut MUST verify this pre-truncate (do not truncate market_metrics nor review_velocity_changed events).

## Key discovery this session
A **Matt-signed** Tier-3 clean-cut contract ALREADY EXISTS: `konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT.md` (2026-07-02, Notion ticket 3912300f-2ecb-8159-a300-ec7bd5009746). Do NOT author from scratch — RECONCILE + EXTEND it.
- **Keep-set predicate = Matt-signed Option A, sig 9f53bfb5f64bafa0**: `industry IN ('builder_au','electrician_au','landscaper_au','handyman_service_au','painter_au','carpenter_au','plumber_au','pest_control_au','hvac_au')`. DELETE = complement. (Suffix, not country_code='AU' — country_code is corrupted on ~9.6k real AU trades; suffix is the reliable signal.)
- Mechanism is STAGED + REVERSIBLE: Phase-0 full export → Phase-1 soft-archive (add `archived_at`, NOTHING removed) → 7-day cooling → Phase-3 hard-purge behind a SEPARATE explicit Matt GO. Keep this discipline.

## RECONCILIATION GAP (the real work — old contract predates SP-3/SP-4)
Live-verified 2026-07-08T15:1xZ on prod market_intelligence (read-only, as postgres):
- businesses: total **3,776,477** / KEEP (9 trades) **370,098** / DELETE-set **3,406,379** (delete-set identical to 2026-07-02 — frozen/static; all growth is in trades).
- **v2 entities: total 1,837,437; linked to DELETE-set businesses = 1,665,660 (~90%).** The 2026-07-02 contract only scoped the `businesses` table + its FK children (crawl_snapshots, business_events, business_merges) — it does NOT cover the v2 entity layer built by SP-3.
- FK delete behavior (confdeltype): all FKs referencing `businesses` = SET NULL (n) — incl. `entities.legacy_business_id`. So purging businesses would leave 1.66M ORPHANED non-trade entities (link NULLed, rows remain).
- FKs referencing `entities`: entity_memberships CASCADE, entity_matches CASCADE, entity_aliases CASCADE, market_metrics SET NULL, business_events SET NULL. So purging a non-trade entity CASCADE-removes its memberships/matches/aliases; market_metrics link only NULLs.
- **AC-6 safety**: market_metrics → entities is SET NULL; the 3 baseline rows are all keep-set trades (carpenter/electrician/plumber), so safe. Still MUST verify hash 23692c66 pre AND post.

**Therefore the reconciled clean-cut must be a 2-LAYER scope reduction**: businesses (delete-set) AND the derived non-trade entities (+ CASCADE children). Soft-archive must extend to the entity layer.

## DONE this session
- Matt confirmed BOTH scope questions (keep-set stands + extend to derived non-trade entities) — sig **96d90de23d72bcdb VALID**.
- Authoritative membership-based entity counts locked (entities use member_type='industry', member_code — NOT an `industry` col): entities KEEP **175,988** (>=1 trade membership) / DELETE **1,661,449** / total 1,837,437; memberships 2,176,230; aliases 6,928,276; entity_matches 22.
- **Reconciled contract v2 WRITTEN + PUSHED**: konnex-data-pipeline branch `v2/phase2-clean-cut-contract` (commit 9b6c83f), file `TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT-v2.md`. Supersedes v1; extends scope to entity layer; adds AC-6 hash gate + AC7 (baseline untouched) + AC8 (zero orphaned non-trade entities).
- Handed to Rajesh for QA (handoff sig dd9c1f3218796fe5). Matt notified.
- **Rajesh QA PASS** — sig **b6860903b6e32535 VALID**, all 8 ACs, authority chain independently verified. 3 non-blocking impl notes FOLDED into contract (commit b145ab0): NOTE-1 §7 gate 4b (count delete-set-referencing snapshots/events on staging); NOTE-2 §11 (business_merges cross-boundary staging AC); NOTE-3 §11 (pre-Phase-1 read-path enumeration). Matt notified of PASS + plan; asked if he wants changes before the build.

## SPEC LOCKED — next is the execution build (Task #4, FRESH SESSION recommended)
Author export + soft-archive migration + runbook → staging dry-run on konnex_staging_v2 (both layers: businesses + entities). Staging ACs = keep/delete counts + soft-archive reversibility + Rajesh's 3 notes as explicit tests. NO prod, NO spend.

## Remaining (all gated, nothing fires without the gate)
1. Staging dry-run PASS (Rajesh QA) → PROD Phase 0/1 needs **Matt execution GO** (contract §10): full export + PITR + AC-6 hash verify (23692c66) → soft-archive (reversible, archived_at on businesses AND entities, NOTHING removed) → 7-day cooling (task #5).
2. Hard-purge (Phase 3, irreversible) = **SEPARATE explicit Matt GO** after cooling. Never bundled with archive.
3. DFS NSW+3 pilot SPEND (~USD100-150 + DFS top-up) — SEPARATE spend GO AFTER clean-cut lands (task #2).

## Resume notes
- Matt Phase-2 GO sig 4a1a16ae1897d78a (VALID) = PHASE gate only; hard-purge needs its OWN fresh Matt GO (contract §9).
- NO self-authorized spend; NO prod writes before Rajesh QA + staging PASS + final go-live GO.
- Rajesh online + holding (his Notion MCP restored, effective next his restart). Grace available for schema-fit.
- Keep the Remaining section clean — the relauncher reads stale Remaining items (Rajesh-flagged ghost-relaunch loop).
