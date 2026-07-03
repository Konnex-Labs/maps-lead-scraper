---
task_id: 3912300f-2ecb-814a-88f7-d05a8e41dd56
agent: jack
session_id: 2026-07-03T14Z-cortex-queue-plus-dfs-ingest-bug
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-03T14:36:00Z
context_needed:
  files:
    - /home/jack/projects/google-maps-scraper/PROGRESS.md
  branches: []
  collaborators: ["matt", "rajesh", "grace"]
---

# Cortex queue ordered (Matt-confirmed) + DFS ingest trade-attribution bug found/confirmed → label fix GO'd, paid re-post HELD

Mid-work context-exit at ~71% (Rajesh flagged). NOT agent-offline — auto-relaunch continues.
Rajesh remains ONLINE and holds the fort. Grace also context-exited 14:34Z (owns the DFS fix, relaunching).

## Done (this session)
- **Session-start reconcile**: resumed from repo PROGRESS.md (prior task 38d2300f UUID rollout = COMPLETE, all
  4 PRs merged). Ignored stale injected CX-7 context + old memory.json. Sent Matt status gate.
- **Cortex queue prioritized + Matt-CONFIRMED order**: CX-5c → CX-7 → CX-4 → CK-2; **CK-3 PARKED** (blocked_by
  ORG-3, Matt agreed not to pull ORG-3 forward). CX-7 already approved (sig 827b64da). CX-4 = 1212-row corpus
  migration, GO routed to Matt. Order sigs: Matt c638c6fd (1→4 + park CK-3).
- **DFS ingest trade-attribution BUG — discovered by Grace, INDEPENDENTLY CONFIRMED by me in DB**:
  - Evidence (my queries, market_intelligence DB): industry `nsw-trades_au` = 18,445 rows today / **0 pre-today**
    (bogus new bucket). `carpenter_au` today = 15,044 rows but only 867 (~6%) are real carpenters by maps_category
    (rest: 9,217 other / 2,530 plumber / 2,430 electrician). `electrician_au` + `plumber_au` = **0** correct new rows.
  - Root cause (Grace, confirmed): retrieveByIdSweep passes ONE global `--trade=nsw-trades` across all 3 crawl_ids
    → industry stamped = trade+'_au'; never derived per-business/crawl_id. Silent global default.
  - Convention check (my query): `industry` = SEARCH-TRADE, not maps_category (existing electrician_au is ~70%
    non-electrician maps_category). So fix = attribute by search-trade, NOT re-derive from maps_category.
- **Matt decisions (all VALID sigs)**: converted DFS re-post GO → HOLD (2e591ea0); **GO'd the label fix** (fe97649c);
  re-post re-sequences AFTER fix (his ~USD60.9 / Week-1-envelope approval stands). Wants "good naming/structure".
- **Ledger facts (verified)**: crawl 6387/6388/6389 = electrician/plumber/carpenter. 116,250 tasks (3,875 localities
  ×3 ×10 pages). retrieved 14,744 (dfs 20000) / not_created 101,460 (dfs **40401** phantom, interleaved across the
  42-min post burst, cost USD0) / failed 46 (40102). Re-post = 101,460 × USD0.0006 ≈ USD60.9. Charged to date USD8.87.
  Existing NSW E+P+C: 27,526 rows (20,666 active), data_source=google → true universe proxy ~25-30k.

## In Progress
- Nothing building by me (architect-review + coordination role). CX-5c NOT started (Matt paused, DFS took priority).

## Remaining
1. **DFS label fix** — Grace OWNS (relaunching). Design locked (my architect review, sig 06e843e3 to Grace):
   attribute by crawl_id→trade (source `SELECT DISTINCT crawl_id,trade FROM dataforseo_task_ledger`, NOT hardcoded);
   crawl_snapshots = authoritative per-trade membership (crawl_id right, industry wrong); it's a **RE-SPLIT not a
   flat UPDATE** (multi-trade rows collapsed → reconstruct per-trade via dedup/merge + collision handling); labels
   `{trade}_au`, KILL `nsw-trades_au`; GUARD = no default fallback (fail loud); DECOUPLE maps_category noise-filter
   (separate DQ decision → tee to Matt); backup before delete; USD0 (no new DFS). PR → Jack + Rajesh QA.
2. **My next actions on relaunch**: (a) re-sync w/ Grace on relaunch, architect-review her fix PR; (b) show Matt
   corrected structure BEFORE the paid re-post fires (he wants a look / standing GO); (c) after re-post clears,
   START CX-5c (first in Cortex queue).
3. **Paid ~USD60.9 re-post** — HELD until fix built + Rajesh QA-clears. Throttled + monitored (Matt's terms).
4. **CX-4 corpus migration GO** — still pending Matt (routed, not answered).
5. Housekeeping: 2 dup flow-violation tickets on DFS mi-010 in Rajesh's queue (holding for Matt).
6. **OWED to Matt (relaunch deliverable): full written SCHEMA/STANDARDS HEALTH assessment.** Matt asked
   (sig b31f1ce4) if we're on "flaky ground" needing schema/table/naming redesign. My preliminary answer sent:
   NOT flaky at schema level (today's bug = ingest-code global-default, not schema); core tables sound, data real.
   But 3 hardening items to scope as a short serial review (like Cortex), NON-blocking:
   (a) no CHECK/enum guard on valid `industry` values (how bogus nsw-trades_au slipped in) + naming standard;
   (b) document the industry=SEARCH-TRADE convention (buckets include adjacent cats) + optional noise-filter;
   (c) businesses key (industry,name,address) forces per-industry row duplication for multi-trade businesses —
       examine vs canonical+membership model (ties to Grace's dedup-lineage flag [[project_dedup_no_lineage_verified_data_loss]]).
   Deliver the full write-up on relaunch. (NB: team-chat-send content must NOT use backticks — shell runs them.)

## Resume notes
- Do NOT re-issue the DFS re-post GO — it's HELD pending the label fix + Rajesh QA. Matt's ~USD60.9 stands for AFTER.
- Do NOT build the label fix yourself — Grace's pipeline lane; you are architect-review only.
- Rajesh is oriented for QA (per-trade re-split, decoupled filter). He held the fort during the dual exit.
- Correct the record if anyone says "re-derive from maps_category" — that misroutes; the fix is crawl_id→trade re-split.
- Cortex order to resume once DFS clears: CX-5c → CX-7 → CX-4 → CK-2 (CK-3 parked on ORG-3).
