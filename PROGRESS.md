---
task_id: v2-foundation-architecture-notion-doc
agent: jack
session_id: 2026-07-05T07Z-arch-planning
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-05T07:45:00Z
notion_task_id: null
context_needed:
  files:
    - /home/jack/projects/google-maps-scraper/V2-FOUNDATION-SYNTHESIS.md
    - /home/jack/projects/google-maps-scraper/V2-VISION-DOC-BRIEF.md
    - /home/shared/media/1783236531959-matt-to-jack.md (ChatGPT handoff doc, pre-pivot)
    - /home/shared/media/1783235720911-matt-to-jack.md (Vision doc, full)
  branches: []
  collaborators: [matt, rajesh, grace]
---

# v2 Foundation architecture planning w/ Matt (2026-07-05). NEXT-SESSION TASK = WRITE the recommended architecture/schema/data-model as a NEW Notion doc with mermaid diagrams. Design is LOCKED. NO replay needed — everything durably saved (see context_needed files).

## Done (this session)
- Digested ALL 4 inputs: Vision doc, my prior 5-part response, the 2 morning ops conversations, the ChatGPT handoff doc.
- Wrote the full synthesis: V2-FOUNDATION-SYNTHESIS.md (convergent spine + what ChatGPT doc adds + RE→trades remap + provisional phase plan + provisional core schema sketch + LOCKED decisions + doc-authoring instruction). Vision-doc brief durably at V2-VISION-DOC-BRIEF.md.
- Sent Matt combined read (3 chunks) + 4 open questions.
- **Matt LOCKED the design (sig 0ce148691d643626):** Q1 defer graph layer = YES; Q2 hold PII internal = YES; Q3 focused event set on general pattern = YES; Q4 NO Phase 0 this session — write the doc, start Phase 0 NEXT session. Matt add: doc must CAPTURE the build-now-vs-defer split + my recommendations/reasoning ("grow into the doc"), preserve rationale not just conclusion.
- Grace coord-repost decoupled-GO proposed (code merge now via Rajesh gate on tip 263b5a1 / backfill held for Phase-2). Matt NOT yet explicitly confirmed the split.

## In Progress / Awaiting
- Context-exit at 66% (mid-task, doc unwritten). Want AUTO-RELAUNCH to write the doc next session — do NOT agent-offline.
- Grace coord-repost split: awaiting Matt explicit confirm.

## Remaining (NEXT SESSION)
1. **WRITE THE NOTION DOC** — this is the whole next-session job. Source everything from V2-FOUNDATION-SYNTHESIS.md (design is locked). Steps: (a) create Notion task on Sprint Boards DB (id 3132300f-2ecb-81f8) with a Session estimate in Notes per protocol; (b) create the Notion doc with mermaid diagrams: system architecture, one-Postgres-core / three-read-models, snapshot+event+provenance schema (DDL-level), Phase 0/1/2 roadmap, a build-now-vs-defer table with rationale, risks/mitigations. Capture reasoning + consciously-deferred items (graph layer, extra verticals, property/listing/lender entities, polyglot DBs, full RE event taxonomy) and WHY.
2. After the doc lands + Matt reviews: start Phase 0 execution (staging DB mirror + safety-envelope-default + PITR).
3. Grace coord-repost: on Matt confirm, un-park ETL code merge (Grace opens PR → Rajesh QA tip 263b5a1 → merge); backfill stays gated on the Phase-2 truncate-vs-keep decision.

## Resume notes
- Prior arc (all LANDED): Explorer 5xx resolved (PR #25, 410 Gone); AC7 PR #52 merged; DFS-B coord re-post clean; Tier-2 deploy-authority PR #128 merged.
- Autonomy: Matt sig 60b0ab4d256283fa = NSW+3 DFS + Cortex prod autonomy; does NOT cover fresh large spend or Explorer infra. Phase 2 clean-cut (truncate + ~USD100-150 NSW+3) is Tier-3 = explicit Matt GO required.
- DO NOT: self-authorize truncate/spend; self-merge Grace's PR (Rajesh code-owner gate).
- The Notion doc is a design/plan artifact — writing it needs no Matt gate; executing Phase 0/2 does.
