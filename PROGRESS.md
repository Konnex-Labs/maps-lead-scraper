---
task_id: v2-phase-1-read-model-build
agent: jack
session_id: 2026-07-08T22Z-phase1-kickoff
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-09T08:51:00Z
notion_task_id: 3982300f-2ecb-8172-ab8a-c418ea5913b8
context_needed:
  files: ["konnex-data-api/server.js", "konnex-data-api/lib/brand-explorer.js", "konnex-data-api/lib/tool-handlers/", "konnex-data-pipeline/explorer-api.js"]
  branches: [main]
  collaborators: [matt, rajesh]
---

# 🟢 PHASE-1 READ-MODEL BUILD — KICKED OFF 2026-07-08T22:46Z (Matt GO, sig e12b7484b3163626 VALID)

Phase-2 entity archive is CLOSED + QA-PASSED (history at bottom). This task is the next gate: build the
thin read models feeding the 4 new surfaces (Ask Konnex / Developer API / MCP Server / Insights Hub), with
Step B `archived_at IS NULL` scoping built in from the start.

## ✅ CLOSED — session-restore stale-inject fix DEPLOYED + QA-PASSED (2026-07-09T06:49Z)
Spun-off Tier-2 shared-bin ticket. **Matt GO + epic=state-consolidation** (sigs 2c7ed779b68d2bfb, 62566a94953a3cd4). **Rajesh design-concurred** (sig e4c333f18d1fc252). Source repo `/home/jack/projects/ops/shared-bin` (deploy `ops/deploy.sh konnex-ops`; source==deployed verified).

### ✅ DEPLOYED + 6/6 VERIFY PASS — TICKET DONE (fix arc fully closed)
- PR #130 **squash-merged to main `8396137`** ([WIP] stripped; ticket-UUID CI gate green). Notion ticket **3982300f-2ecb-81f2-9df2-df1a77a5426f** (epic=Agent State Machine, est 2-3) → **Done**. Test-hygiene follow-up ticket **3982300f-2ecb-8168-84ea-c6c0ac5d5b33** (TODO, Rajesh non-blocker #1: vacuous stderr assert in stale-non-null test).
- `ops/deploy.sh konnex-ops` ran clean. **source==deployed sha256 MATCH**: agent-checkpoint-save=870da338…, agent-session-restore=ef41336a…; both CHANGED from pre-deploy .bak; both +x & node-syntax-valid. Rollback `.bak`: `/home/jack/deploy-rollback/session-restore-fix-20260709T0636Z/`. Deploy shipped ONLY the 2 fix files (loop wrapper + current-sprint.txt byte-identical → **no service restart needed**).
- **6/6 rollback verify PASS:** Rajesh ran rajesh/olivia/carlos (binaries execute, valid hookSpecificOutput JSON, currentTaskId populated; EPERM cross-user smoke artifacts non-fatal). Jack-self: home==cwd task_id (both v2-phase-1-read-model-build/context-exit) → cwd-override correctly **no-fires** (healthy steady state); deployed module exports all FIX-C helpers. Grace-observed + Alex-self readiness clean. Deployed suite re-run **165/0**.
- **This exit is a LIVE VALIDATION:** FIX C now governs my own next relaunch resume. Do NOT run agent-offline on this exit (Rajesh concurred). Fix design (ROOT CAUSE / FIX A/B/C / TESTS) preserved below as **shipped-reference** (all "REMAINING" items there are DONE).

ROOT CAUSE: `agent-health` jack.currentTaskId=NULL → checkpoint-save adopt guard (task_id-match, sig e4e491715a39b019) falls back to stale canonical task_id → live cwd never adopted. **Blunt "task_id differ ⇒ cwd wins" is UNSAFE** (regresses e4e49171 foreign-cwd-clobber protection) — do NOT do it.

FIX = 3 parts + currentTaskId population, via Rajesh ordering (injection decision made BEFORE + independent of currentTaskId):
- **FIX C — agent-session-restore:** (1) add near L39 `const OVERRIDE_ELIGIBLE = new Set(['in_progress','blocked','context-exit']);` (EXCLUDES handoff/complete; SEPARATE from INJECTABLE_STATUSES@L39 which includes handoff); export at L739+/L763. (2) In `main()` after L567 (progressPath=$HOME): read pickupTaskId early; if `!pickupTaskId`, read cwd/PROGRESS.md; if `fs.existsSync(cwd) && lintOk(cwd) && cwdTaskId && !taskIdsMatch(cwdTaskId, homeTaskId) && OVERRIDE_ELIGIBLE.has(cwdStatus)` → reassign `progressPath = cwdProgress` (LOUD stderr). Reuse helpers: taskIdsMatch@L434, readStatusFromProgressMd@L67, readTaskIdFromProgressMd@L89, lintOk@L117. (3) After status confirmed injectable (L625) + body extracted, if `!pickupTaskId` set `agent-health.currentTaskId = readTaskIdFromProgressMd(progressPath)` via `healthLib.updateAgent(agent, e => ({...e, currentTaskId}))` (do NOT clobber a dispatcher pickup's --task-id).
- **FIX A — agent-checkpoint-save adopt block L779-797:** compute `liveTaskId = taskIdNorm(aHealth.currentTaskId)` (RAW, no canonical fallback), `canonTaskId = taskIdNorm(canonData.task_id)`; `succession = liveTaskId && taskIdsMatch(liveTaskId, cwdData.task_id) && !taskIdsMatch(liveTaskId, canonTaskId)`; if succession → `sourcePath = cwdProgress` (recency-independent), else keep existing taskIdsMatch(refTaskId,…) block. SAFE: succession requires trusted currentTaskId matching cwd but not canon → foreign cwd can't clobber.
- **FIX B — agent-checkpoint-save buildFrontmatter L138 + call L901:** add optional `lastUpdated` param, use if valid-ISO else now(); at L901 pass `lastUpdated: oldData.last_updated` (propagate source's; body==null auto-capture ⇒ oldData={} ⇒ now()). Rajesh: always propagate, no byte-compare.

TESTS (shared-bin/test/, node-assert harness; models: agent-checkpoint-save.test.js, agent-session-restore.test.js, session-restore-ac6-samearc.test.js): (a) diff task_id + currentTaskId=cwd ⇒ adopts cwd recency-independently; (b) same task_id ⇒ recency unchanged; (c) LOOP REPLAY {HOME.task_id=old,lu=now; cwd.task_id=new,lu=earlier; currentTaskId=null} ⇒ restore override injects cwd + sets currentTaskId=new ⇒ next Stop adopts (1-relaunch); (d) HOME-only, no cwd ⇒ unchanged fallback; (e) foreign cwd (task_id != currentTaskId) ⇒ NOT adopted (e4e49171 preserved); (f) heal preserves last_updated; (g) buildFrontmatter propagates source last_updated.

REMAINING: 1) implement A/B/C+currentTaskId; 2) write+run tests (full suite green); 3) Notion ticket (epic=state-consolidation, session-estimate 2-3, note propagate-source-lu detail); 4) WIP branch+commit+push+PR; 5) send Rajesh PR link for GH review; 6) after his approval + Matt GO: .bak snapshot + deploy + 6-agent rollback verify (Jack self; Rajesh self+Olivia+Carlos; Alex self; Grace Jack-observed).
DO NOT: hand-edit `$HOME/PROGRESS.md`; implement the blunt task_id-diff rule; deploy before Rajesh GH approval.

## Done
- Phase-1 GO received from Matt 2026-07-08T22:46Z (sig e12b7484b3163626 VALID). Rajesh notified + aligned.
- Apprentice/capacity-layer scope call made: keep OUT of Phase-1 entity schema, design dimensions extensibly,
  discovery-spike-first. Rec sent to Matt; Rajesh agreed from QA standpoint.
- State captured: memory `capacity-layer-vision` written; Phase-2 archive record folded to history below.

## In Progress / Awaiting
- **✅ Matt GO on all 4 read-model decisions (sig ffa25f93c52f619c, 2026-07-09T08:00Z):** (1) NSW+3={NSW,VIC,QLD,SA}; (2) liveness=is_active=true; (3) ONE shared read-model layer for all 4 surfaces; (4) trade×region×time first-class shared dimensions.
- **✅ CONTRACT APPROVED v1.0 — GREEN TO BUILD** — `/home/jack/projects/konnex-ops/sprint-contract-v2-phase-1-read-models.md`. Rajesh QA PASS (sig d1b372e817122816) + Matt final GO (sig 0701d4c08ac29efa, 2026-07-09T08:15Z). Ground-truth 180,443 exact-verified. v0.2 notes folded (NT 152 context; nsw_trades_stats FOUND as prod VIEW with archived_at leak → WS4 build action).
- **✅ Notion ticket CREATED** = `3982300f-2ecb-8172-ab8a-c418ea5913b8` ("[V2 Foundation] Phase-1 read-model build — 4 surfaces"), parent DB 3132300f-2ecb-81f8-9081-c8d0cc30d0b6. Body has estimate 4+/epic/reviewer/ground-truth/WS list. **STRUCTURED PROPS NOT SET** (Notion integration finicky — data_source search returns empty, known briefing 401 issue): Status/Epic(V2 Pipeline Rebuild)/Owner(Jack)/Reviewer(Rajesh)/Model still NULL on the page — set them via patch-page (props: Status/Epic/Owner/Reviewer are select/multi_select; need exact option names + jack/rajesh Notion user-ids) OR let board-hygiene fill. Est 4+ is in the body + contract header.
- **✅ WS1 CODE COMPLETE + TESTS GREEN (2026-07-09, feat branch `feat/v2-phase-1-read-models` off origin/main 04cfcdd, konnex-data-api repo).** `archived_at IS NULL` now scopes ALL 6 tool-handlers + brand-explorer 7 queries. Full suite **130 pass / 0 fail** (was 122; +6 WS1 regression tests in `tests/ws1_archived_scoping.test.js`, +2 updated exact-SQL asserts).
  - **⚠️ CONTRACT-GAP DISCOVERY (Rajesh flagged, matters for QA):** contract claimed "single where-builder change scopes all 6 handlers" — **FALSE.** Only `filter_records` + `aggregate_records` consume where-builder. The other 4 (`search_records` L77, `get_record_detail` L48, `compare_records` L66, `find_recent_activity` L47) build own SQL → each edited directly.
  - **✅ `find_recent_activity` is_active=TRUE ADDED** (commit 6f28a34) — Rajesh WS1 QA (sig dc1e67ccbcb7a8e5) confirmed: it's a customer surface, Locked-Decision-2 applies, the missing filter was a pre-existing gap WS1 closes. Behavior change (no longer returns inactive rows) is CORRECT, within WS1 mandate.
  - **brand-explorer 7 queries:** grep-verified (count=7), excluded from regression test (deprecated Express routes, no route harness) — Rajesh-approved, noted in WS1 test header.
- **✅ WS1 DONE — PR #26 QA PASS + APPROVED** (Rajesh 08:35:45Z, sigs 9458e8c11859b29b/bf366bed4b0c413a). https://github.com/Konnex-Labs/konnex-api/pull/26 (branch feat/v2-phase-1-read-models @ 6f28a34). Suite 130/0. `archived_at IS NULL` scopes all 6 tool-handlers + brand-explorer 7 queries; find_recent_activity is_active added.
- **✅ WS2 DEPLOYED + VERIFIED IN PROD (2026-07-09T08:47Z).** Migration `konnex-data-pipeline/migrations/017_mv_trades_footprint.sql`, branch `feat/v2-phase-1-ws2-mv-trades-footprint` @ commit **d9deed5**, pushed → **PR #61** https://github.com/Konnex-Labs/konnex-data-pipeline/pull/61. MATERIALIZED VIEW grain (industry, address_state, period), period=date_trunc('month',now())::date=2026-07-01, metric=count(*) in_scope_live_count; scope archived_at IS NULL AND is_active=true; unique idx on grain for REFRESH CONCURRENTLY + period idx. **Data-driven scope via NEW tables read_model_scope_industry/state** (seeded 9 trades + NSW+3; expand = INSERT row + REFRESH, no code change → WS2 AC; carry LOAD-BEARING/not-truncate warning).
  - **QA + deploy:** Rajesh WS2 QA PASS + scope-table design concurrence (sig 59ec5180e5c84628). Matt deploy GO (sig d7e3b602d5ee91ff VALID). Applied clean (additive/reversible via DROP, zero existing rows touched). **REFRESH CONCURRENTLY verified; mv total re-verified from the view = 180,443 ✓, 36 grain rows, all 9 industries exact.**
  - **✅ WS2 FULLY CLOSED.** Rajesh post-apply QA PASS (base-table re-verify 180,443 + migration 017 code review PASS, sig 955002f3db0771a2) + **PR #61 APPROVED** (08:49Z). GRANT prereq RESOLVED: `GRANT SELECT ON mv_trades_footprint TO market_intel` applied to prod + in 017 (commit 9388c17); verified via SET ROLE market_intel (180,443/36). Scope tables stay postgres-only. **Remaining housekeeping: merge PR #61** (Rajesh-approved; not yet merged).
- **▶️ WS3 IN PROGRESS — wire 4 surfaces to mv_trades_footprint** (konnex-data-api, build on `feat/v2-phase-1-read-models` — WS1 not merged). Design CONCURRED by Rajesh (sig dbcd445762420e53), GRANT prereq DONE. **Grain-split (locked):**
  - (1) ROUTE TO mv: industry×state footprint counts (Insights Hub) + `aggregate_records` AC2 grand-total (= SUM(in_scope_live_count) from mv, no businesses scan).
  - (2) KEEP ON WS1-scoped businesses: suburb group-by (`aggregate_records` normalizedKey grain) + all record-level handlers (search/get_record_detail/filter/compare/find_recent_activity) — mv physically can't answer sub-state grain.
  - (3) REGRESSION GUARD: assert mv total == scoped-businesses total == 180,443 (consistency + scope-table-drift sentinel).
  - Files: `lib/tool-handlers/aggregate_records.js` (total query L131 → mv-source), `lib/brand-explorer.js` (Insights Hub aggregate endpoints). Add WS3 regression test. Then PR → Rajesh WS3 QA.
  - **⏭️ AFTER WS2 deploy: WS3** — wire the 4 surfaces (Insights Hub aggregate endpoints + aggregate_records tool-handler) to source counts from mv_trades_footprint, not ad-hoc businesses scans (konnex-data-api repo).
    - **WS1 NOT YET MERGED** — PR #26 approved but origin/main still at base `04cfcdd`. WS3 branch stacks on `feat/v2-phase-1-read-models` (or merge WS1 first). Coordinate WS1+WS3 API deploy with Matt sign-off alongside WS2 DB migration.
    - **⚠️ WS3 GRAIN-MISMATCH FINDING (raised to Rajesh, pre-code):** `aggregate_records.js` groups at SUBURB grain (normalizedKey=suburb, L105-131); `mv_trades_footprint` grain is STATE `(industry, address_state, period)`. The mv CAN serve industry×state footprint totals + the AC2 `total` (=SUM in_scope_live_count); it CANNOT serve suburb-level aggregates → those stay on the WS1-scoped `businesses` table. WS3 wiring routes only the mv-answerable reads to the mv; needs Rajesh/Matt nod on that split before coding (mirrors the WS1 where-builder contract-gap pattern).
- **Recon done (Explore agent):** 3 API surfaces (Ask Konnex/DevAPI/MCP) share ONE chokepoint `konnex-data-api/lib/shared/where-builder.js:111` (is_active=TRUE only, NO archived_at) → add `archived_at IS NULL` there scopes all 3. Insights Hub = `lib/brand-explorer.js` 7 direct businesses queries (L62/112/162/198/244/449/554), own fix. Leaky objects: `v_verified_active_silver` (pipeline mig 004), `mv_verified_active_silver` (mig 005) — is_active only, no archived_at. `nsw_trades_stats` NOT FOUND in either repo (flag). Empty grain table `market_metrics` (mig 015: suburb_id/trade/period) — align new mv grain to it.
- **Apprentice spike CLOSED** — Matt GO (0b6b9c3eccbc6106) + confirm (e0e5f7e75a3db1c7, 884c4c34b5683125). Hook-only in Phase-1, ingest built later.
- **Session estimate = 4+** recorded in contract header. Post to Notion ticket at ticket-creation (contract-approval time, per convention), before coding. NO ticket exists yet (frontmatter notion_task_id points at the CLOSED session-restore fix ticket). New ticket epic = V2 Pipeline Rebuild, reviewer Rajesh.

## Phase-1 footprint ground-truth — PULLED FROM PROD 2026-07-09T00:0xZ (read-only)
Scope predicate for live read-model footprint = `archived_at IS NULL AND is_active = true` (+ industry in trades + state in NSW+3). Region column = `businesses.address_state`.
- **9 live trade industries** (all *_au): electrician 45,848 · builder 41,269 · carpenter 24,341 · plumber 21,955 · landscaper 18,771 · pest_control 16,352 · painter 8,835 · hvac 7,298 · handyman_service 4,707. (industry query returned ONLY these 9 — no other live industries.)
- **State distribution (live):** NSW 92,545 · VIC 41,056 · QLD 31,537 · SA 15,305 || sharp cliff → TAS 3,462 · ACT 3,390 · WA 1,418. **⇒ "NSW+3" reads as {NSW, VIC, QLD, SA}** (top-4, clean cliff after SA). NEEDS Matt confirm.
- **In-scope per industry × {NSW,VIC,QLD,SA}** (= the fixed ground-truth for the contract; total **180,443**):
  builder 39,492 · carpenter 24,062 · electrician 44,065 · handyman 4,149 · hvac 7,014 · landscaper 17,944 · painter 8,437 · pest_control 13,781 · plumber 21,499.
- **DATA-QUALITY FINDING (new):** foreign/garbage states in live set — ON(Ontario) 264, AUK(Auckland) 89, NS 56, QC 3, NA 1, null 98. Geocoding errors. Read models MUST exclude (state IN NSW+3 filter does this); flag a cleanup ticket separately. Note also keep-set (archived_at IS NULL) biz = 370,098 but only 189,376 are is_active=true → ~180k in-scope trades are is_active=false (orthogonal liveness, as designed) — contract must pin whether read models require is_active=true (assume YES = "live").

## Remaining (Phase-1 build)
1. **Author Phase-1 sprint contract** with fixed-footprint ground-truth (Rajesh HARD REQ, sig 701c221ab5ee5637):
   (a) exact trade industries live at launch, (b) exact NSW+3 regions/states named, (c) expected in-scope row
   counts per industry×region at hand-off, (d) exact param values the read models instantiate with. Read-model
   defs region/industry-parameterised (NOT hardcoded) so expansion is data-driven. Send to Rajesh for QA
   ground-truth review BEFORE building.
2. **Design read-model dimensions** (trade industry × region/state × time) as first-class, stable, SHARED join
   keys — the same keys future capacity-layer data (apprentice regs, council permits) will need, so they slot
   in later with no rebuild. See memory `capacity-layer-vision`.
3. **Build the 4 surfaces' read models** with `archived_at IS NULL` scoping baked in (Step B, folded here per
   Matt sig 1578b2807800a6c8). Fold in the Step B leak-fix discovery (below).
4. **Rajesh QA** on the fixed-footprint ground-truth, then deploy.

## Step B carry-forward (folded into Phase-1, NOT a standalone PR)
- Archive sets `archived_at` only, NOT `is_active` (orthogonal by design — RESOLVED, no schema change). 1.99M
  archived businesses + 1.66M archived entities are still `is_active=true` → LEAK if read paths don't filter.
- 3 prod objects leak archived rows (all off `businesses`, filtered `is_active=true` only): `explorer_suburb_agg`
  (MATVIEW, no industry filter), `v_verified_active_silver` (VIEW, no archived filter), `nsw_trades_stats`
  (VIEW, effectively safe via trade filter but add filter for defence). NONE read `entities` — still TODO to
  grep konnex-data-api serving queries + pipeline stages for direct `entities` reads.
- These are DEPRECATED Explorer v1 surfaces — NOT refreshed now. New Phase-1 read models get scoping from the start.
- Serving-read code candidates to triage: konnex-data-api `server.js`, `lib/brand-explorer.js`,
  `lib/tool-handlers/{search_records,aggregate_records,filter_records,get_record_detail,compare_records,find_recent_activity}.js`; pipeline `explorer-api.js`.
- Carry-forward flags (Matt APPROVED, sig d704a7b34034dc5e): headline home 'live metrics' drop as scoping
  narrows to in-scope rows is fine; Explorer v1 live pages untouched until Phase-1. Initial surface = live-ingested
  NSW+3 trades footprint, then grow region-by-region (a growing subset over the stable national-AU-trades archive,
  NOT a re-cut).

## Apprentice / capacity-layer (NEW, raised by Matt 2026-07-08T22:46Z)
- Matt wants a live labour-capacity layer over Cotality's asset snapshot ("movie vs snapshot"). Apprentice
  registrations = leading indicator of trades supply. Also on Matt's radar: council building permits.
- **Spike GO from Matt (sig a18cd711411bd560 VALID) — run in PARALLEL, desk research, no spend.** Assigned to
  JACK only; Rajesh correctly holds (no direct Matt assignment to him). Rajesh stays on Phase-1 contract QA.
- **SPIKE DONE 2026-07-08T23:0xZ. Outcome (full detail in memory `apprentice-data-source`):**
  - Canonical source = **NCVER "Apprentices and trainees" collection**. Covers all 4 flow states Matt named
    (commencements/in-training/cancellations+withdrawals/completions), by state × occupation(ANZSCO+trade flag)
    × quarterly time series. Licence CC BY 3.0 AU (verify live before commercial ingest).
  - **API check (Matt asked): NO usable API at this granularity.** NCVER manual-only (DataBuilder URL rotates
    quarterly); data.gov.au VET files are file-only no datastore; ABS SDMX has zero apprenticeship dataflows;
    JSA/DEWR/state portals = no API or partial. → Manual quarterly CSV drop is the right primary path.
  - Ingest gotchas: recent quarters revised up to 7 qtrs (version by release, not append-only); small-cell
    suppression; LEFT is a combined bucket. Proposed grain: (state × trade × period × flow_state)+release → count.
- **AWAITING Matt confirm** on the manual-CSV path before closing the spike. NOT built now — Phase-1 only builds
  the dimension hook (trade × region × time) so this attaches later with no rebuild.

## Resume notes
- **SESSION-RESTORE STALE-INJECT BUG (found 2026-07-09, caused 3x stale relaunch today).** session-restore hook
  reads canonical `$HOME/PROGRESS.md` (line 567), synced from this cwd copy on Stop via checkpoint-save
  `cwdIsStrictlyNewer` (pure last_updated+mtime recency). `$HOME` held a stale Phase-2 body stamped NEWER than
  this live Phase-1 file → comparator refused to adopt → loop. IMMEDIATE FIX APPLIED: synced this file → `$HOME/PROGRESS.md`
  (lint OK; stale backed up `$HOME/PROGRESS.md.superseded-stale-phase2-*`).
  - **REFINED ROOT CAUSE (after reading source, 2026-07-09):** true trigger = `agent-health.currentTaskId` was NULL, so
    checkpoint-save's EXISTING Rajesh-approved task_id-match adopt guard (sig e4e491715a39b019, ticket 38e2300f, L748-797
    in ops/shared-bin/agent-checkpoint-save) fell back to the stale canonical task_id → live Phase-1 cwd never matched →
    never adopted. Blunt "task_id differs ⇒ cwd wins" would REGRESS that guard (foreign-cwd clobber). Do NOT implement it.
  - **PROPER FIX (Tier 2 shared-bin; Matt GO given, epic=state-consolidation; source repo /home/jack/projects/ops/shared-bin):**
    (A) succession-adopt keyed on currentTaskId — adopt cwd recency-independently when currentTaskId matches cwd but NOT
    canonical; (B) propagate source last_updated on \$HOME sync, no now() stamp (buildFrontmatter L147); (C) session-restore
    OVERRIDE_ELIGIBLE={in_progress,blocked,context-exit} cwd-override gate (separate from INJECTABLE_STATUSES which incl handoff);
    PLUS reliably populate currentTaskId on resume. Deploy via `ops/deploy.sh konnex-ops`; PR → Rajesh GH review → .bak + 6-agent
    rollback verify. AWAITING Rajesh design concurrence on (A)+currentTaskId-population path before coding. DO NOT hand-edit `$HOME/PROGRESS.md`.
- Prod: `ssh konnex-data` (204.168.198.203) → `sudo -u postgres psql -d market_intelligence` (peer auth).
- **Phase-2 cooling still running:** 7-day window from 2026-07-08T17:12Z. Phase-3 hard-purge (IRREVERSIBLE)
  earliest 2026-07-15, needs a SEPARATE 3rd Matt GO. Do NOT purge before then.
- Phase-2 recovery if ever needed: (a) reversible `UPDATE entities SET archived_at=NULL;`; (b) PITR to
  `sp_phase2_pre_archive_20260708T165254Z` (LSN 8F7/246A32F0); (c) off-box dump at konnex-data:/home/jack/tier3-phase0-backup/.
- DO NOT: self-authorize spend (DFS NSW+3 pilot = separate spend GO); run Phase-3 purge before 07-15 + 3rd GO;
  self-merge without Rajesh GH approval.

## Phase-2 archive — CLOSED + QA PASS (history)
- Archive committed 2026-07-08T17:04Z single tx: UPDATE 0 businesses (already archived 07-02 v1 cut),
  UPDATE 1,661,449 entities. Two-person gate: Rajesh CLEAR (2f60f069a6cbf087) + Matt LIVE GO (fdb60ed7d62bff14).
- Verify PASS: ent_archived=1,661,449; biz_archived=3,406,379; ent_keep_live=175,988; keep_wrongly_archived=0
  both layers. AC-6 velocity hash UNCHANGED = 23692c660633e5d66059b8036272e428.
- Rajesh QA PASS 2026-07-08T17:12Z (sig 15089728409c8a62). Prior task_id: v2-phase-2-clean-cut-au-trades-scope-reduction
  (Notion 3912300f-2ecb-8159-a300-ec7bd5009746).
