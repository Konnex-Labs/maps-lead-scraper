---
task_id: market-intel-schema-diagram-v2-rework
agent: jack
session_id: 2026-07-09-schema-diagram-rework
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-09T11:31:00Z
context_needed:
  files:
    - /home/shared/media/1783593795039-matt-to-jack.md  # Vision & Product Strategy doc (== 1783594009952, identical). Fact/Signals/Pulse framework; 5 delivery channels (L198-203); Gemini 09-07 section (L304-489)
  branches:
    - main
  collaborators:
    - matt   # requester; watching my context, approved scope A/B + both follow-ups; suggested this clean stop at 67%
    - rajesh # reviewer
  notion:
    - 3792300f-2ecb-8148-9087-ee9195eb2953  # Market Intelligence DB — Schema Diagram (THE doc being reworked)
    - 3942300f-2ecb-8149-9d15-cb8326007871  # Konnex v2 Foundation — Architecture & Data Model design doc (§5 diagram = style ref + reconciliation target; design-LOCKED)
---

# Market Intelligence DB — Schema Diagram V2 rework (ad-hoc Matt request, 2026-07-09)

NB: prior PROGRESS.md content (v2-phase-1-read-model-build) is FULLY CLOSED — WS1 #26, WS2 #61, WS3 #27 all merged + QA'd (Rajesh re-confirmed 2026-07-09 ~10:40Z). Superseded; not resumed here.

## Done

- **Full V2 rework of Notion "Market Intelligence DB — Schema Diagram" (page 3792300f) — COMPLETE + live.** 7 sections: Fact/Signals/Pulse framing → V2 event-driven data spine (flowchart + core-table reference + provenance) → ingest sources (LIVE vs PLANNED) → derived signals → 5 delivery surfaces → RETIRED/legacy (Phase-2 clean-cut gated) → end-to-end data-flow Mermaid.
- **Added "Core-table schema (ER diagram)"** under §2 — Mermaid erDiagram grounded in LIVE market_intelligence DDL (subagent reached DB), styled to match design-doc §5.
- Scope proposed + gated on Matt GO before editing (A = include planned sources/surfaces as "planned"; B = full rewrite, legacy only as RETIRED list). All Matt signed msgs HMAC-VALID + acked via Telegram.

## In Progress

(none — clean stop at Matt's suggestion, 67% ctx, before 70% ceiling)

## Remaining — TWO follow-ups Matt approved (sig ddd8a8575d6506d8 VALID), deferred to restart

1. **Tighten §2 prose core-tables table to match LIVE DDL** (page 3792300f; mcp__notion__API-update-page-markdown type=update_content — BATCH all edits in ONE call, echo returns full page ~7k tok):
   - `crawl_snapshots` note: keys on id + crawl_id + business_id; the immutable weekly-partition + checksum design lives on the DEFERRED `crawl_runs` table, NOT crawl_snapshots yet — move the "checksummed/weekly-partitioned" claim there. (Optional: soften the §2 flowchart RAW node label "weekly-partitioned, checksummed" to design-intent.)
   - `entities` note: `first_seen`/`last_seen` → `first_seen_at`/`last_seen_at`; add `canonical` jsonb + `legacy_business_id` (v1 bridge).
   - GOTCHA: stored markdown escapes ~ as "\~" (e.g. "\~1.84M rows"); match small unique substrings, avoid ~ in old_str. Suggested old_str for entities: "`current_state` jsonb, `first_seen` / `last_seen`, `is_active`".
2. **Flag design-doc §5 for reconciliation** (page 3942300f): add a Notion COMMENT (mcp__notion__API-create-a-comment, parent.page_id = 3942300f-2ecb-8149-9d15-cb8326007871). Do NOT edit the body — it is design-LOCKED (Matt sig 2026-07-05). Comment = the deltas below.

### Live-vs-design schema deltas (ground-truth DDL — content for follow-up #2 comment)
- `business_events` is crawl-diff shaped: from_crawl_id/to_crawl_id + google_place_id, with entity_id/source_id/suburb_id provenance FKs retrofitted. Design doc calls this table `events`.
- `crawl_snapshots` keys on id + crawl_id + business_id (not snapshot_id/checksum — those on deferred `crawl_runs`).
- `entity_matches` is SYMMETRIC: entity_id_a / entity_id_b / merged_into (not parent/child).
- `entities` adds `canonical` + `legacy_business_id` (v1 bridge).
- `entity_memberships` and `market_pulse` are LIVE but absent from design-doc §5 diagram.

## Resume notes

- Deliverable is fully in Notion (no local code/file WIP) — safely persisted independent of this repo.
- Both follow-ups are small — est <0.5 session. On restart: do #1 (single update_content call) → #2 (comment on 3942300f) → Telegram Matt done.
- Re-deriving DDL if needed: source MARKET_INTEL_DB_URI from /home/shared/config/*.env, `psql "$MARKET_INTEL_DB_URI" -c "\d <table>"` (or ssh konnex-data → sudo -u postgres psql market_intelligence).
