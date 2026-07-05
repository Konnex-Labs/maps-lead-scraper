---
task_id: v2-foundation-architecture-notion-doc
agent: jack
session_id: 2026-07-05T07Z-arch-doc-write
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-05T08:02:00Z
notion_task_id: 3942300f-2ecb-81b8-9b8c-dea9feb9fb02
context_needed:
  files:
    - /home/jack/projects/google-maps-scraper/V2-FOUNDATION-SYNTHESIS.md
    - /home/shared/media/1783235720911-matt-to-jack.md (Vision doc, full)
    - /home/shared/media/1783236531959-matt-to-jack.md (ChatGPT handoff doc, pre-pivot)
  branches: []
  collaborators: [matt, rajesh, grace]
---

# v2 Foundation architecture — Notion doc WRITTEN + in Matt's review. Next = Phase 0 (safety spine) on Matt's OK.

## Done
- **Notion architecture doc WRITTEN + in review.** Page 3942300f-2ecb-8149-9d15-cb8326007871 (child of tracking task 3942300f-2ecb-81b8-9b8c-dea9feb9fb02, Sprint 17, Status In Review, Reviewer Matt). Full sections + mermaid: system arch, one-core/3-read-models, snapshot+event+provenance ER + DDL sketch, focused trades event set, verification tiers, build-now-vs-defer table w/ rationale, Phase 0/1/2 roadmap, risks/mitigations, consciously-deferred+WHY, locked-decisions appendix. Sourced entirely from V2-FOUNDATION-SYNTHESIS.md (design LOCKED, Matt sig 0ce148691d643626).
- Session-start gate sent + Matt GO'd the doc write (sig 1b5d9771cb8b9245).
- **Repo-deletion incident RESOLVED:** Matt accidentally deleted /home/jack/projects/google-maps-scraper in VSCode (sig 768b6b946ebfa6bf). Jack re-cloned from origin (restored to 99cbbbe) + restored V2-FOUNDATION-SYNTHESIS.md (verbatim) + this PROGRESS.md. No OS trash on this Remote-SSH host.

## In Progress / Awaiting
- **Matt reviewing the arch doc.** On his OK → start Phase 0.
- Grace coord-repost split (GO code merge tip 263b5a1 via Rajesh QA gate / HOLD backfill) — awaiting Matt's SEPARATE explicit confirm; untouched.

## Remaining
1. On Matt doc-review OK → **Phase 0 execution** (staging DB schema-mirror + sampled data; prod-write safety-envelope-default; PITR/auto-snapshots). No spend, no destructive ops.
2. Phase 1 schema build follows Phase 0.
3. Phase 2 clean-cut + full NSW+3 pilot (epic 38a2300f, ~USD100-150) = Tier-3, GATED on explicit fresh Matt GO.
4. LOST in the deletion (NOT auto-recovered): last 2 local-only WIP commits c5e1666+d4792ea (content preserved: synthesis restored + doc written); V2-VISION-DOC-BRIEF.md (reconstructable from media Vision doc); untracked WIP artifacts (SCHEMA-HARDENING-A/SM specs, V2-TRADES-STRATEGY/TICKETS, RECRAWL-PATH-PLAN, dynamic-stats-spec, agent-architecture-v3.md, generate-qsr-csv.js, qsr CSVs, ~40 screenshots). Awaiting Matt on whether any need recovery.

## Resume notes
- Autonomy: Matt sig 60b0ab4d256283fa = NSW+3 DFS + Cortex prod autonomy; does NOT cover fresh large spend or Phase 2 clean-cut (Tier-3 = explicit Matt GO).
- Writing/reviewing the doc needs no gate; executing Phase 0/1 needs Matt review of the doc; Phase 2 needs explicit GO.
- DO NOT: self-authorize truncate/spend; self-confirm the Grace split (Matt's call).
- Prior arc (all LANDED): Explorer 5xx (PR#25, 410 Gone); AC7 PR#52 merged; DFS-B coord re-post clean; Tier-2 deploy-authority PR#128 merged.
