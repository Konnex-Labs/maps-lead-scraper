---
task_id: v2-phase-1-read-model-build
agent: jack
session_id: 2026-07-08T22Z-phase1-kickoff
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-08T22:52:00Z
notion_task_id: TBD-confirm-or-create
context_needed:
  files: ["konnex-data-api/server.js", "konnex-data-api/lib/brand-explorer.js", "konnex-data-api/lib/tool-handlers/", "konnex-data-pipeline/explorer-api.js"]
  branches: [main]
  collaborators: [matt, rajesh]
---

# 🟢 PHASE-1 READ-MODEL BUILD — KICKED OFF 2026-07-08T22:46Z (Matt GO, sig e12b7484b3163626 VALID)

Phase-2 entity archive is CLOSED + QA-PASSED (history at bottom). This task is the next gate: build the
thin read models feeding the 4 new surfaces (Ask Konnex / Developer API / MCP Server / Insights Hub), with
Step B `archived_at IS NULL` scoping built in from the start.

## Done
- Phase-1 GO received from Matt 2026-07-08T22:46Z (sig e12b7484b3163626 VALID). Rajesh notified + aligned.
- Apprentice/capacity-layer scope call made: keep OUT of Phase-1 entity schema, design dimensions extensibly,
  discovery-spike-first. Rec sent to Matt; Rajesh agreed from QA standpoint.
- State captured: memory `capacity-layer-vision` written; Phase-2 archive record folded to history below.

## In Progress / Awaiting
- **Apprentice spike CLOSED** — Matt GO (0b6b9c3eccbc6106) + confirm (e0e5f7e75a3db1c7, 884c4c34b5683125). Hook-only in Phase-1, ingest built later.
- **Session estimate to Notion = MANDATORY before build proper.** Phase-1 read-model build = 4+ estimate. Post before coding. Notion task TBD (candidate: [V2-Trades][DFS] Phase-1 branch integration, or new; SP-3 mig019 = "Phase-1 sub-phase 3 of 4 done").
- **AWAITING Matt confirm** on the NSW+3 footprint reading below before locking the contract.

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
