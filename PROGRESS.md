---
task_id: v2-phase-1-sp3-entity-resolution-membership-backfill
agent: jack
session_id: 2026-07-07T22Z-resume
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-07T23:12:00Z
status_note: SP-3 (entity resolution + membership backfill) GO'd by Matt (sig 9832327213b794cf), session estimate 2-3. Groundwork done — live data shape characterized, backfill plan written (SP-3-BACKFILL-PLAN.md). BLOCKER surfaced = GRANT gap (market_intel role lacks privileges on mig-015 entity tables; needs postgres superuser GRANT before staging/prod backfill). Also this session: sprint-rotation.service fix built + PR'd (konnex-ops #129, deploy HELD for Rajesh QA); Schema-Hardening-C confirmed design-complete (subsumed by mig 015). Rajesh online, assigned PR #129 QA. Next: apply staging GRANT, author migration 019 (catalog+entities+aliases+memberships+matches, INSERT..SELECT idempotent+reversible), run on konnex_staging_v2.
notion_task_id: 3942300f-2ecb-8161-99e6-d5eb8ea2bf65
context_needed:
  files: ["SP-3-BACKFILL-PLAN.md", "PHASE-1-SCHEMA-SPEC.md", "/home/jack/projects/konnex-data-pipeline/migrations/015_v2_entity_core_foundation.sql", "/home/jack/projects/konnex-data-pipeline/db.js"]
  branches: ["konnex-ops: fix/sprint-rotation-status-drift (PR #129, awaiting Rajesh QA)"]
  collaborators: [matt, rajesh, grace]
---

# SESSION 2026-07-07T22Z — resume after Matt's 1-day offline; Phase-1 SP-3 kicked off

## Done this session
- **State verified vs git+PROGRESS.md**: no drift from EOD 2026-07-06. Critical path (SP-2 live emission +681, dedup live DML 22 merges, mig 014 + SP-2 017/018 on prod) all still landed + verified. Stale 2026-07-05 injected checkpoint superseded.
- **Schema-Hardening-C = design-complete**, NOT a fresh design task. Realized by `entities` + `entity_memberships` (mig 015 on prod) per PHASE-1-SCHEMA-SPEC §4.1, which Matt's arch-doc approval (sig f959024cc39320ef) covers. Standalone C + A Notion tickets → to close as superseded-by-doc (board hygiene, pending).
- **sprint-rotation.service fix** — root cause: hardcoded emoji Status strings (`📋 TODO`,`⛔ Blocked`) sent to Notion select-equals filter died when Status property got polluted with duplicate variants → 400 → 3 failed weekly runs (06-22/06-29/07-06). Fix: query by Sprint only + exclude terminal statuses client-side via emoji-stripped normalizeStatus. Unit-tested 17/17. Put the previously git-untracked root script under source control (ops repo). **PR #129** (konnex-ops), deploy to /usr/local/bin HELD for Rajesh QA + deploy OK. Next run Monday 13:30Z.
- **SP-3 GO + estimate** relayed to Matt (2-3 sessions; build on staging first; Raj-offline doesn't block build). Confirmed phase structure to Matt: 3 phases (0 safety spine / 1 schema foundation of 4 sub-phases / 2 destructive clean-cut+pilot); we're mid-Phase-1 at SP-3 of 4.
- **SP-3 groundwork**: live data characterized (read-only prod), backfill plan written → `SP-3-BACKFILL-PLAN.md`.
- **Rajesh online**, assigned PR #129 QA (Matt's designated idle-time hygiene task) + heads-up on SP-3 handoff + design Q D2.

## SP-3 live data shape (prod, read-only 2026-07-07)
- businesses 3,776,477 total / 2,179,260 active / 22 merged_away / 142 industries / 2,323,227 place_ids / 122,658 NULL place_id.
- Per-industry duplication: 281,968 place_ids span >1 industry; **358,191 collapsible dup rows**; max 19 industries/place_id.

## BLOCKER (flagged to Matt)
- GRANT gap: `market_intel` role → `permission denied for table entities` (mig-015 tables). GO-B granted only sources+entity_aliases. Need postgres-superuser GRANT (SELECT + backfill INSERT) on entities/entity_memberships/entity_matches/market_metrics/crawl_runs, on staging first then prod. Blocks backfill execution, not authoring.

## Remaining (SP-3)
1. Apply staging GRANT (konnex_staging_v2) — postgres superuser.
2. Resolve open design decisions D1 (Grace: entity_matches lineage contract) / D2 (Rajesh: NULL-place_id handling) / D3 (industry vs trade type) / D4 (batching) — see SP-3-BACKFILL-PLAN.md.
3. Author migration 019: catalog(142) + business entities (~2.32M+122,658) + aliases + memberships + entity_matches projection. All INSERT..SELECT, idempotent, reversible DOWN. `businesses` untouched.
4. Run on konnex_staging_v2 → validate AC (parity, FK integrity, zero associations lost) → Rajesh QA.
5. Prod GRANT + additive backfill under Phase-0 envelope + PITR on SEPARATE go-live GO.

## Parked (non-SP-3)
- Close Schema-Hardening C + A Notion tickets as superseded-by-doc.
- PR #129 deploy after Rajesh QA + deploy OK.
- Legacy-agent cleanup (ada/brian/maria/priya/sarah) — Matt GO'd "after phase-1"; still held (mid Phase-1).
- Follow-up: sprint-rotation notifyBrian() targets decommissioned brian agent.

## Resume notes
- DO NOT: mutate `businesses` in SP-3 (additive only); self-authorize prod backfill (needs separate go-live GO); self-deploy PR #129 (Rajesh QA + deploy OK first).
- Session estimate 2-3 given to Matt via Telegram (cost-exposure channel). Notion Notes estimate TODO (need C-ticket id).
- Autonomy: Matt GO to write estimate + implement SP-3 on staging (sig 9832327213b794cf). Prod go-live is a separate GO.
