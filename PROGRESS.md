---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-af45fa9f-cont2
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-11T00:07:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/jack/projects/konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT-v2.md
  branches:
    - wip/jack-tier3-phaseA-ruling-20260711 (konnex-data-pipeline; contract §12 ruling, commit b9222eb)
  collaborators: [matt, grace, rajesh, olivia]
---

## Done (this arc, ground-truthed)

- **Item 5 A' ops-deploy COMPLETE.** own-fetcher PR#7 (0626d82) live BOTH hosts: konnex-ops (restarted 23:51:54Z) + konnex-data (main FF e141fbf->0626d82, restarted 23:52:08Z), both /health ok. verification-worker #98 (7df0073) live both (konnex-data clean main; konnex-ops working-tree v2-verification-worker.js == origin/main #98 byte-identical). Flagged complete to Matt. **Do NOT re-restart.**
- **Migrations mig024 + mig026 live + verified** on prod market_intelligence. **Do NOT re-apply.**
- **PRs #31 + #67 merged.** **Do NOT re-open.**
- **Tier-3 dedup Phase-A RULING delivered + whole team aligned** (Grace + Rajesh accepted, no re-litigation). Ruling durable in contract §12 (commit b9222eb, branch wip/jack-tier3-phaseA-ruling-20260711, pushed).
- **Matt GO'd my ruling** (Telegram sig 45ea4b7c9d4da3e5, matt->jack). This endorses the DIRECTION only (Phase-B-only path + Phase-A deferral) — it does NOT authorize the live pass. See gate below.

## The Tier-3 dedup ruling (the core of this arc)

- Grace dry-run: runner "Phase A" would DELETE 3,406,379 rows (whole businesses table minus vw_au_trades_keep; incl ~1.99M active non-trades). Phase B = 415 same-entity merges (clean, 0 needsAudit).
- RULING (I own mig024 + authored the contract): the 3.4M delete is **NOT a defect** — it's the Matt-SIGNED §2.1 "DELETE=complement" scope reduction (Matt Option A sig 9f53bfb5f64bafa0; DELETE-set frozen 2026-07-02). keep-view is CORRECT as-is (retain-set, not deduped-survivors). Do NOT rescope Phase A to trades-only (0-row no-op, abandons the reduction). Do NOT redefine keep-view.
- BUT that 3.4M delete == the contract's §6 **Phase-3 IRREVERSIBLE hard-purge**, separately gated (§7 restore-tested Phase-0 export + AC-6 hash 23692c66 + a SEPARATE fresh explicit Matt Phase-3 GO addressed to Matt directly). It must NOT run inside a routine dedup pass. DIRECTIVE: ship **Phase-B-only**; DISABLE Phase A as deferred-to-gated-Phase-3.
- Prod state: 3.4M soft-archived archived_at=2026-07-02 (reversible; cooling 9d MET); keep-set 387,024=archived_at IS NULL=vw_au_trades_keep; businesses_purge_archive=0; no confirmed restore-tested export -> Phase-3 NOT eligible.

## GO-chain (CRITICAL — do not conflate)

- Matt 65a1a5e7 = matt->jack, migration batch only. Matt 45ea4b7c = matt->jack, endorses my RULING (path), NOT any live pass.
- **Grace holds NO direct live-pass GO** (confirmed by Rajesh + Grace). The relaunch-injected "Grace's §12 GO carries over" was STALE/WRONG — SUPERSEDED.
- **Phase-B live pass (415 merges) fires ONLY after:** Grace clean Phase-B-only re-dry-run -> Rajesh re-review -> Matt's DIRECT one-line GO to GRACE + Rajesh two-person. Jack NOT in this chain; do NOT relay.

## Remaining (all Matt-gated / others' lanes)

1. When Grace's Phase-B-only dry-run lands clean + Rajesh re-reviews: PROMPT Matt for his DIRECT GO to Grace. Do NOT fire without it.
2. Phase-3 (3.4M purge): needs §7 gate (restore-tested Phase-0 export + AC-6 hash; cooling MET) + separate Matt Phase-3 GO + **NEW: Olivia's live-product/SEO blast-radius review** (purge removes live Explorer pages + SEO surface — 100% financial_advisor/accountant/all US-CA-UK; Olivia can quantify affected URLs). Bring blast-radius review before any Phase-3 GO ask.
3. Item-5 backfill WRITE (UPDATE businesses.website_verified, 3.7M): Matt's SEPARATE 2nd GO. On GO: batch + VACUUM (bulk single-txn on businesses trips :3460 synthetic-check).
4. Item 4 (T6 uat->main, commit d0aa4672): Matt's DIRECT GO to Olivia. Built + Rajesh gate-passed; Notion 3992300f In Review. NOT my action.
5. konnex-ops orchestrator dev-branch (pipeline-resilience/dup-crawl-reap-pidlock, intentional WIP): await Matt's (a) land-as-PR / (b) leave / (c) other. Do NOT blind-fix.

## Resume notes
- MID-WORK context-exit: **NEVER run agent-offline** (loop must relaunch).
- Do NOT re-apply migs; do NOT re-open PRs #31/#67; item-5 restarts DONE (do NOT re-restart).
- **Matt GO'd the RULING, not the live pass** — do NOT fire Phase-B without Matt-direct-to-Grace GO + Rajesh two-person.
- Verify all peer sigs on relaunch; trust remote wip branches + git over home-dir PROGRESS.md (stale-body hook bug).
