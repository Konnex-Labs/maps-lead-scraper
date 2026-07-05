---
task_id: v2-phase-0-safety-spine
agent: jack
session_id: 2026-07-05T09Z-phase0-spec
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-05T11:26:00Z
notion_task_id: null
context_needed:
  files: ["/home/jack/projects/konnex-data-api/google-maps-scraper/PHASE-0-SAFETY-SPINE-SPEC.md", "Notion arch doc 3942300f-2ecb-8149-9d15-cb8326007871 (arch doc, Phase 0 def)", "/home/jack/projects/konnex-data-pipeline/schema.sql", "/home/jack/projects/pipeline-orchestrator/v2-pilot/staging-setup/setup-staging.sh", "/home/jack/projects/konnex-data-pipeline/scripts/one-off/backfill-merge-lineage.js", "/home/jack/projects/konnex-data-pipeline/scripts/one-off/backfill-au-suburb-mapping.js"]
  branches: []
  collaborators: [matt, rajesh, grace]
---

# CURRENT STATE = Phase 0 EXECUTION GO (Matt sig 03f159c0e56a728a + Rajesh QA PASS). BUILDING PITR-first. Spec = PHASE-0-SAFETY-SPINE-SPEC.md. Q1/Q2 LOCKED (Jack's call): pgBackRest primary (WAL-G fallback); local separate-volume repo first cut + off-box fast-follow. Recon DONE — do NOT re-run. NO prod data mutation in Phase 0; the ONE prod-touch = enabling archive_mode/archive_command on prod, must FLAG MATT immediately before applying (promised).

## Done (this session — all VERIFIED)
- **Suburb backfill (thread d) CLOSED.** Grace ran LIVE (4c1752c) 08:39Z: net prod writes = 0; all 2,008 matched rows hit 23505 dedup-skip (safe, non-destructive); 233 no-geo-match. Grace + Rajesh both cross-checked at 0 writes. Coord-repost arc fully closed. Residual 2,008 NULL-suburb rows are dedup-BLOCKED → only closeable via dedup remediation (ticket 3932300f-2ecb-8197).
- **Deletion-artifact recovery (Matt item 2) CLOSED — nothing lost.** Verified every artifact flagged at-risk from Matt's accidental delete of /home/jack/projects/google-maps-scraper is present + intact in THIS cwd (konnex-data-api/google-maps-scraper): 8 WIP specs, ~30 screenshots, both QSR CSVs, V2-VISION-DOC-BRIEF.md. No recovery needed.
- **Mermaid fix DONE + render-validated.** Notion arch doc §5 erDiagram was failing (semicolon-separated attrs on one line). Fixed all 8 entity blocks to newline-separated form via update-page-markdown targeted find/replace (block f9e0364e-b255-463c-9e18-fbc9770927b6). Render-validated locally with mermaid-cli (--no-sandbox): clean erDiagram SVG, exit 0.
- **Matt's 3 decisions logged:** (1) arch doc APPROVED + Phase 0 GO (sig d6ca81527c7ba201); (2) deletion recovery = close, nothing to recover; (3) dedup remediation = do AFTER Phase 0 / PITR-first (sig 3c8637e0c945f55a).

## Phase 0 RECON FINDINGS (read-only, done this session — DO NOT re-research)
Phase 0 = 3 parts (arch doc §10): (i) staging DB (schema mirror + SAMPLED data, not a 3.7M clone); (ii) prod-write safety envelope as DEFAULT (dry-run default, pre-image, collision pre-check, batched + VACUUM); (iii) PITR / automated snapshots on prod.

- **Prod DB:** `market_intelligence` on konnex-data **204.168.198.203**, Postgres 16.14. Addressed via `MARKET_INTEL_DB_URI` (in /home/jack/.env, or repo `.env.crawl` checked first; both gitignored). Resolution: `MARKET_INTEL_DB_URI || PIPELINE_DB_URI`. crawl-1/crawl-2 boxes DECOMMISSIONED 2026-07-03 (DFS pivot); konnex-data is the only enrichment box now. Explorer was `:6432/explorer` (pgbouncer) — pipeline prod likely same box, separate DB.
- **Pipeline repo:** /home/jack/projects/konnex-data-pipeline (GitHub Konnex-Labs/konnex-data-pipeline). REPO-MAPs exist there + in pipeline-orchestrator. READ konnex-data-pipeline/REPO-MAP.md before any DB work (my rule).
- **(iii) PITR = GREENFIELD / MISSING ENTIRELY.** No PITR, WAL archiving, pgBackRest/barman/wal-g, or cron backup anywhere in repos. Only ad-hoc `pg_dump` runbook step (konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT.md:78-79). Must build from scratch — this is the biggest Phase 0 lift.
- **(i) Staging ~50% done but THROWAWAY.** `konnex_staging_v2` on 127.0.0.1:5432 (konnex-ops box), user konnex_staging, built by pipeline-orchestrator/v2-pilot/staging-setup/setup-staging.sh (drops/recreates public, loads schema-prod-snapshot.sql = 25KB pg_dump --schema-only, applies migrations). Self-labeled "throwaway, not for production use — see Phase 1b permanent staging hardening." SCHEMA-MIRROR ONLY — no sampled-data seeding beyond a 30-row test harness. Phase 0 work = harden into a documented durable staging + add representative sampled-data seeding.
- **(ii) Safety-envelope building blocks EXIST but scattered across 2 one-off scripts (no single script has all 5; VACUUM in ZERO scripts):**
  - scripts/one-off/backfill-merge-lineage.js — dry-run DEFAULT (`--live` to write); per-batch BEGIN/COMMIT/ROLLBACK; reversibility log written BEFORE any write (JSONL to reports/); idempotency skip-set; ambiguity guard.
  - scripts/one-off/backfill-au-suburb-mapping.js — batched keyset writes (BATCH_SIZE=1000, `id > lastId`); resumable checkpoint; 23505 catch-skip (reactive).
  - GAPS to build for a generalized default envelope: (a) per-row PRE-IMAGE capture; (b) collision PRE-CHECK (currently only reactive 23505 catch); (c) VACUUM. Goal = extract these into a shared reusable module, not per-script copies.
- **Migrations:** home-grown (no sqitch/flyway). konnex-data-pipeline/migrations/ (001-013) + pipeline-orchestrator/migrations/ (001-022, `npm run migrate`). Canonical schema: konnex-data-pipeline/schema.sql.
- **CAVEAT:** commit 4c1752c is NOT in pushed konnex-data-pipeline history (Grace's local/unpushed worktree). Backfill DID run live + forward-path is merged; not a Phase 0 blocker, but don't cite 4c1752c as pushed.

## Done (this session — spec)
- **Phase 0 spec WRITTEN** from recon → `PHASE-0-SAFETY-SPINE-SPEC.md`, committed + pushed (maps-lead-scraper main **17fb4db**). Sprint contract, infra Tier 2, Session estimate 4+. 3 workstreams w/ per-workstream ACs (§4.3 PITR / §5.3 envelope module / §6.3 staging). PITR-first sequencing. Execution-gate section (Matt GO + per-workstream Rajesh QA before any prod-touch).
- Read the 2 envelope source scripts to ground §5.1 gap table: merge-lineage.js (dry-run default, per-batch txn, reversibility-log-before-write, idempotency skip-set) + au-suburb-mapping.js (keyset batching BATCH_SIZE=1000, resumable checkpoint, reactive 23505). Confirmed the 3 real gaps: generalized pre-image, PROACTIVE collision pre-check, VACUUM (in zero scripts).
- Matt notified w/ spec summary + 4 open questions; Rajesh handoff-notified (spec in review, 2 Qs tagged for him).

## In Progress
- **BUILDING Phase 0, WS-iii (PITR) FIRST.** REPO-MAP read (done). **Prod box identity VERIFIED read-only:** market_intelligence LIVE at 204.168.198.203:5432, PG 16.14, 26 GB, 3,776,477 rows (`inet_server_addr`=204.168.198.203). The SSH-config "204.168.x decommissioned" comment = the crawl-1/crawl-2 cpx62 boxes, NOT this DB box. (Also noted drift: EXPLORER_DB_URL now → Supabase, no longer aliased to MARKET_INTEL_DB_URI as REPO-MAP claims.)
- **Archiving baseline VERIFIED read-only:** archive_mode=off, archive_command=disabled, wal_level=replica (already OK for PITR — no change), pg_stat_archiver 0/0. **⚠️ enabling archive_mode = postmaster-context → needs a FULL PROD DB RESTART (brief blip), not a reload.** This is THE prod-touch → FLAGGED to Matt for a maintenance window (do NOT apply autonomously).
- **BLOCKED on Matt:** scheduling the prod-restart window for archive_mode enable. Next steps that DON'T need it: SSH konnex-data to check pgBackRest packaging (read-only), scaffold stanza config + restore-drill script, and start WS-i staging (which can proceed in parallel + hosts the restore drill).
- notion_task_id null — Phase 0 Notion task likely needs creating for the Session estimate (4+) per protocol. TODO before/at first prod-touch.

## Remaining (BUILD — GO received)
1. **WS-iii PITR (SEQUENCE FIRST):** pgBackRest stanza on prod + systemd-timer snapshots + `pg_stat_archiver` proof + RE-RUNNABLE restore drill w/ named-row spot-check (AC-iii-1..6). Archive-config = the one prod-touch → flag Matt first. Hand to Rajesh QA on landing.
2. **WS-i staging harden:** durable + documented staging + stratified sampled seed ~50-100k incl. ≥1 dedup cluster ≥10 rows (AC-i-1..5). Hosts the restore drill.
3. **WS-ii envelope module** `lib/prod-write-envelope.js`: dry-run default + per-batch txn + fsync'd pre-image-before-COMMIT + proactive collision pre-check + VACUUM; refactor au-suburb-mapping.js onto it as reference caller (AC-ii-1..7). Built/tested on staging.
4. Per-workstream Rajesh QA at each handoff (not blanket). No prod data mutation anywhere.
5. After Phase 0 lands → **dedup remediation** (queued fast-follow, ticket 3932300f-2ecb-8197): ~492 dup place_id groups → survivor selection → merge attrs incl. suburb → delete/tombstone (FK-safe) → re-attribute suburbs. Needs spec + dry-run + pre-image + Rajesh QA. Blocked-by Phase 0.

## Resume notes
- Recon subagent is resumable: SendMessage to agent id `a36df81df1efa758e` for deeper infra digs.
- Autonomy: Matt Phase 0 GO covers safety-spine build (no spend, no destructive ops). Phase 2 clean-cut/truncate + ~USD100-150 NSW+3 = Tier-3, needs SEPARATE explicit Matt GO. Do NOT self-authorize truncate/spend.
- DO NOT agent-offline on this exit (mid-work; want auto-relaunch). Rajesh + Grace both aware; Rajesh verifying exit lands clean.
- $60 re-post = STALE CONFLATION (already-done $1.78 job), retracted by Rajesh + Matt-notified. If it resurfaces, it's either stale or a fresh Matt-gated spend — never autonomous.
