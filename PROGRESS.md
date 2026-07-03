---
task_id: 3912300f-2ecb-814a-88f7-d05a8e41dd56
agent: jack
session_id: 2026-07-03T15Z-dfs-coord-health-writeup-cx5c-start
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-03T15:05:00Z
context_needed:
  files:
    - /home/jack/projects/google-maps-scraper/PROGRESS.md
    - /home/jack/projects/google-maps-scraper/SCHEMA-STANDARDS-HEALTH.md
    - /home/jack/projects/ops/shared-bin/konnex-memory-query
    - /home/jack/projects/ops/shared-bin/test/konnex-memory-query.test.js
    - /home/jack/projects/ops/shared-bin/test/konnex-memory-query-ck1-integration.test.js
  branches: []
  collaborators: ["matt", "rajesh", "grace"]
---

# Context-exit at 74% (3rd exit today, auto-relaunch armed). DFS coord done + health write-up delivered + A/B/C tickets filed + CX-5c STARTED (investigation complete, not yet built)

## Done (this session)
- Session-start: online, state grounded, briefing, Cortex confirm, Matt gate.
- **DFS trade-attribution fix** coordination: Grace audit confirmed (34,902 biz / 49,543 snaps; 3,504 multi-trade collapsed = re-split; 451 pre-existing overlaps). Relayed 4 architect guards + Matt's rate-limiting add-on. Grace relaunched 14:59Z, scope-locked (ack 6b07075a), building the re-split + fail-loud/rate-limited runner. Re-post HELD, USD0.
- **Schema/standards HEALTH assessment** DELIVERED: SCHEMA-STANDARDS-HEALTH.md + Telegram. Ground-truthed live (industry has NO CHECK/enum though data_source does; dedup UNIQUE idx_businesses_dedup on (industry,lower(name),address...); crawl_snapshots UNIQUE (place_id,industry,crawl_id); 143 distinct industries incl bogus nsw-trades_au). Verdict: NOT flaky at schema level.
- **Matt GO (sig f191f9f37e9a52e0): Plan 1-4 + CX-4.** Hardening shape GO'd (sig 5e3499391f75583b). **A/B/C tickets FILED** on Sprint Boards (Sprint 17, Owner Jack/Reviewer Rajesh): A=3922300f-2ecb-81ce (industry_catalog allowlist+FK), B=3922300f-2ecb-81ea (doc SEARCH-TRADE convention), C=3922300f-2ecb-8124 (canonical-entity design review). A/B mine, C joint Jack-led w/ Grace.
- **Matt directed (sig 16ccc478): work the Cortex queue in parallel** (don't idle through the several-hour re-post). Order confirmed: CX-5c -> CX-7 -> CX-4 -> CK-2 (CK-3 parked on ORG-3).

## In Progress
- **CX-5c investigation COMPLETE, build NOT started.** Ticket 3922300f-2ecb-81d1 (High/Bug, Owner Jack/Reviewer Rajesh, est 2-3). It is a Tier-2 ranking-semantics change to a shared prod tool → contract-first Rajesh QA + Matt GO before deploy.
  - **Regression diagnosed:** in `rankConfirm` (konnex-memory-query lines 288-314) the CX-5b within-tier FTS lift is comparator STEP 2 — ABOVE source_type (step 4) and recency*similarity (step 5). So within a provenance tier an FTS-matched row ALWAYS outranks a non-FTS row, even a higher-similarity human-curated one. Breaks CK-1 AC3.1 (curated human pipeline_knowledge doc must outrank FTS-matched git_commit when both land in the `direct` tier and the human doc is not FTS-matched).
  - **Floor context:** classifyProvenanceWithFloor (lines 336-341) clamps FTS-matched cosine up to PROVENANCE_INDIRECT_FLOOR=0.35 → admits exact-token docs to `indirect` (not `direct`, since direct needs >=0.4). CX-5b intent = RECALL (don't bury exact-token docs); must be preserved (AC1 seed doc must stay in top-5).
  - **Verification gate:** CK-1 integration test AC3.2 topology probe (konnex-memory-query-ck1-integration.test.js, queries "what is the konnex data pipeline topology" / "what does a healthy pipeline run look like"), RUN_DB_TESTS=1 + MARKET_INTEL_DB_URI. Existing CX-5b lift unit tests: konnex-memory-query.test.js lines 481-528 (must not regress; AC6 byte-stability line ~530).

## Remaining
1. **DFS: architect-review Grace's dry-run diff** when it lands (next DFS checkpoint) → Rajesh QA → Matt structure look → re-post (HELD, ~USD60.9, throttled). Do NOT fire re-post on any prior GO.
2. **CX-5c NEXT STEP = write the fix spec/contract** (short, like other CX contracts) with the exact comparator change + AC, send to Rajesh for contract-first QA BEFORE building. Candidate fix direction (VALIDATE, don't blind-implement): bound the FTS lift so it does not outrank a non-FTS row of higher source_type-priority AND/OR higher similarity within the same provenance tier — i.e. subordinate step 2 to the human-curated case. Must keep AC1 recall + AC6 byte-stability. Then build + unit test + run CK-1 gate under RUN_DB_TESTS=1. Tier-2 → Matt GO before deploy to /home/shared/bin.
3. CX queue after CX-5c: CX-7 -> CX-4 (GO'd) -> CK-2. CK-3 parked on ORG-3.
4. Schema hardening A (fast-follow after clean re-post), B (doc), C (joint design review) — all sequenced AFTER re-post.

## Resume notes
- Do NOT fire the DFS re-post — HELD pending fix + Rajesh QA + Matt look. Do NOT build Grace's label fix (her lane).
- CX-5c is contract-first (Rajesh) + Matt-GO-before-deploy (Tier-2 ranking change). Do the SPEC next, not code.
- Work happens in /home/jack/projects/ops (shared-bin); deploy to /home/shared/bin is a separate gated step. No ops code changed yet this session (reads only) — nothing uncommitted there.
- Rajesh ONLINE holding continuity on both DFS + CX-5c. Re-sync with him on relaunch.
