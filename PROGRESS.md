---
task_id: v2-phase-0-safety-spine
agent: jack
session_id: 2026-07-05T09Z-phase0-spec
model: claude-opus-4-8
status: in_progress
last_updated: 2026-07-05T12:11:00Z
notion_task_id: null
context_needed:
  files: ["/home/jack/projects/konnex-data-api/google-maps-scraper/PHASE-0-SAFETY-SPINE-SPEC.md", "Notion arch doc 3942300f-2ecb-8149-9d15-cb8326007871 (arch doc, Phase 0 def)", "/home/jack/projects/konnex-data-pipeline/schema.sql", "/home/jack/projects/pipeline-orchestrator/v2-pilot/staging-setup/setup-staging.sh", "/home/jack/projects/konnex-data-pipeline/scripts/one-off/backfill-merge-lineage.js", "/home/jack/projects/konnex-data-pipeline/scripts/one-off/backfill-au-suburb-mapping.js"]
  branches: []
  collaborators: [matt, rajesh, grace]
---

# CURRENT STATE = Phase 0 BUILDING, PITR-first. **WS-iii AC-iii-1..3 DONE — prod PITR is LIVE.** Spec = PHASE-0-SAFETY-SPINE-SPEC.md. Matt cleared both WS-iii blockers 2026-07-05T11:37Z (sig 46e5b05f2e7673ec): Q1 prod-restart = free anytime (no customers, v2 build phase); Q2 = same-disk /var/lib/pgbackrest first cut (Jack's rec), off-box = Phase 0.x DR fast-follow. The one prod-touch (archive_mode enable + restart) DONE + Matt-pinged right before. Remaining WS-iii = systemd backup timer + re-runnable restore drill (needs WS-i staging). NO prod DATA mutation anywhere in Phase 0.

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

## WS-iii PITR — AC-iii-1..3 DONE (2026-07-05T11:47Z, prod PITR LIVE)
- **pgBackRest 2.50 installed** on konnex-data (apt). Stanza config `/etc/pgbackrest/pgbackrest.conf` (stanza=`market_intelligence`, repo1=/var/lib/pgbackrest same-disk, retention full=2/diff=4, compress L3, log /var/log/pgbackrest). Legacy /etc/pgbackrest.conf (PG13 template) is INERT — dir-config takes precedence (verified: info reads my stanza).
- **archive_mode enabled via** `/etc/postgresql/16/main/conf.d/pgbackrest.conf` (include_dir already on): archive_mode=on + archive_command='pgbackrest --stanza=market_intelligence archive-push %p'. wal_level=replica default was already OK. Validated read-only first via pg_file_settings (archive_command applied=t on reload; archive_mode applied=f pending restart).
- **PROD RESTART done 11:42Z** (`systemctl restart postgresql@16-main`) — Matt-pinged right before (promised). Clean: DB healthy, businesses=3,776,477 unchanged. archive_mode=on confirmed.
- **stanza-create + check OK** — check pushed test WAL 00000001000008C3000000FF to repo successfully (full archive path proven).
- **First full backup 20260705-114245F** (~4m53s): db 26.2GB → repo 5.9GB compressed, 2056 files. `pgbackrest info` status=ok, wal min/max 00000001000008C3000000FF..00000001000008C400000001.
- **AC-iii-3 proof:** pg_stat_archiver archived_count=4, **failed_count=0**, last_archived_time 11:47:37Z. Disk 10%/524G free.
- HANDED to Rajesh for QA (handoff-notification cf3c5ca9f6886d57). Matt notified.

## WS-iii STATUS: 5/6 QA-PASS (Rajesh). Only AC-iii-4 (restore drill) left — gated on WS-i staging.
- AC-iii-1..3 PASS, AC-iii-5 (runbook RTO/RPO + Matt-authorizer) PASS, AC-iii-6 (Persistent catch-up EXERCISED via backdated-stamp test) PASS. All committed+pushed: c9a87d8 (PITR + timers + runbook) + 31de4af (runbook fix).
- systemd timers LIVE on konnex-data: pgbackrest-backup@full.timer (Sun 02:00) + @diff.timer (daily 02:30), Persistent=yes, validated end-to-end (diff backup 20260705-114245F_20260705-115219D landed via service).
- notion_task_id still null — Phase 0 Notion task needs creating for Session estimate (4+). TODO.

## WS-i staging — DONE, HANDED TO RAJESH QA (commit ea27941, 2026-07-05T12:11Z)
- **AC-i-1..4 met + evidence sent to Rajesh (handoff sigId 6c0baad7b392a9e3).** AC-i-5 = cross-workstream, proven later by WS-ii envelope + AC-iii-4 restore drill.
- setup-staging.sh GREEN (56 base tables, businesses 94 cols). seed 71,572 rows: 142 industries, 5,000 null-suburb, 41,116 coord, max dedup cluster 614. Idempotent: identical id-set md5 b20183e9ab29588ba3c74698ad19a2cd + count across a full reseed. Read-only prod (pg_dump --schema-only + COPY TO STDOUT only).
- **2 seed fixes this session:** (1) `TRUNCATE businesses CASCADE` (FK-referenced by business_events/business_merges/crawl_snapshots, all empty); (2) disable USER triggers during load (trap-guarded) so ~52,862 grandfathered rows that predate trg_enforce_industry_country_match (ENABLED on prod, fires only on new DML) mirror faithfully; RI/FK stay on.
- **DQ finding flagged to Matt:** ~52,862 prod businesses rows violate the enabled industry/country trigger (grandfathered). Awaiting Matt: file ticket for Grace's lane, or leave.
- Wrote `phase0/staging/`: setup-staging.sh, sample-query.sql, seed-staging-sample.sh, README.md (all committed ea27941).
- **Design:** full-schema mirror. Installed pgvector 0.6.0 on konnex-ops (staging box) — prod uses `vector` (market_intelligence doubles as Cortex corpus). Prod public = 56 base tables, 4 extensions (pg_trgm, plpgsql, uuid-ossp, vector).
- **setup-staging.sh debugging (2 fixes applied, NEEDS a green re-run to confirm):** (1) strip dump's `CREATE SCHEMA public;` (collides with our pre-created public) — DONE via `grep -vxF`; (2) pg_dump --schema=public omits CREATE EXTENSION → pre-create uuid-ossp/pg_trgm/vector in step 1 — DONE. Last run failed at `public.uuid_generate_v4() does not exist` BEFORE fix #2; not yet re-run after fix #2.
- **Seed strata feasibility (verified read-only on prod):** google_place_id EXISTS; 17,442 place_id groups ≥10 rows; null_suburb=58,792; coord_bearing=2,338,509; industries financial_advisor 447k/accountant 303k/mortgage_broker_us 244k/... Sample defaults: 25 clusters (≥10 rows,≥2 active) + 60k base (ORDER BY id) + 5k null-suburb → ~65k deterministic rows.

## Remaining (BUILD — GO received)
1. **WS-iii PITR (SEQUENCE FIRST):** pgBackRest stanza on prod + systemd-timer snapshots + `pg_stat_archiver` proof + RE-RUNNABLE restore drill w/ named-row spot-check (AC-iii-1..6). Archive-config = the one prod-touch → flag Matt first. Hand to Rajesh QA on landing.
2. **WS-i staging harden:** durable + documented staging + stratified sampled seed ~50-100k incl. ≥1 dedup cluster ≥10 rows (AC-i-1..5). Hosts the restore drill.
3. **WS-ii envelope module** `lib/prod-write-envelope.js`: dry-run default + per-batch txn + fsync'd pre-image-before-COMMIT + proactive collision pre-check + VACUUM; refactor au-suburb-mapping.js onto it as reference caller (AC-ii-1..7). Built/tested on staging.
4. Per-workstream Rajesh QA at each handoff (not blanket). No prod data mutation anywhere.
5. After Phase 0 lands → **dedup remediation** (queued fast-follow, ticket 3932300f-2ecb-8197): ~492 dup place_id groups → survivor selection → merge attrs incl. suburb → delete/tombstone (FK-safe) → re-attribute suburbs. Needs spec + dry-run + pre-image + Rajesh QA. Blocked-by Phase 0.

## Resume notes
- **RESUMED clean on fresh context 2026-07-05T12:11Z. Prod PITR is LIVE — do NOT re-run archive setup.** Prod DB = 204.168.198.203:5432 market_intelligence, PG16.14, 26GB, 3.78M rows, archive_mode ON, first full backup taken, timers armed. WS-i staging built + handed to Rajesh QA (ea27941). Do NOT agent-offline.
- **NEXT resume point (WS-i done, awaiting Rajesh QA verdict):**
  1. On Rajesh WS-i PASS → **AC-iii-4 restore drill** (closes WS-iii): restore latest prod pgBackRest backup + PITR replay onto staging (konnex_staging_v2, konnex-ops) w/ named-row spot-check; re-runnable. Measure actual RTO → record in RUNBOOK. This is the WS-i↔WS-iii proof of AC-i-5.
  2. **WS-ii envelope module** `lib/prod-write-envelope.js` (AC-ii-1..7): dry-run default + per-batch txn + fsync'd pre-image-before-COMMIT + proactive collision pre-check + VACUUM; refactor au-suburb-mapping.js as reference caller. Build/test on staging (614-row dedup cluster gives the collision pre-check a real workout). This proves AC-i-5's other half.
  3. Create Phase 0 Notion task (notion_task_id still null) — Session estimate 4+.
  4. If Rajesh flags WS-i fixes → address, re-verify, re-handoff.
- Rajesh board: 3 TODOs incl. a NEW coord-repost suburb-normalization flow-violation ticket — NOT self-start, needs Jack direction (post-Phase-0). Grace also context-exited 12:00Z.
- Matt Q&A this session: GO 03f159c0e56a728a; Q1/Q2 answered 46e5b05f2e7673ec (restart free, same-disk repo).
- **Verified prod businesses columns read-only** for the WS-i stratified seed: has google_place_id (via migration 004), is_active, industry, address_suburb, lat/lng, enrichment_data, country_code, address_*_pre_geocode. schema.sql base table def is STALE/partial (no place_id) — introspect prod at seed time, don't trust schema.sql.
- **Do NOT re-run recon** — prod identity + archiving + pgBackRest all VERIFIED/APPLIED this session.
- Rajesh holds full Phase 0 QA context; AC-iii-1..3 handed to him (cf3c5ca9f6886d57), awaiting QA verdict. Matt GO 03f159c0e56a728a; Q1/Q2 answered 46e5b05f2e7673ec.
- Recon subagent is resumable: SendMessage to agent id `a36df81df1efa758e` for deeper infra digs.
- Autonomy: Matt Phase 0 GO covers safety-spine build (no spend, no destructive ops). Phase 2 clean-cut/truncate + ~USD100-150 NSW+3 = Tier-3, needs SEPARATE explicit Matt GO. Do NOT self-authorize truncate/spend.
- DO NOT agent-offline on this exit (mid-work; want auto-relaunch). Rajesh + Grace both aware; Rajesh verifying exit lands clean.
- $60 re-post = STALE CONFLATION (already-done $1.78 job), retracted by Rajesh + Matt-notified. If it resurfaces, it's either stale or a fresh Matt-gated spend — never autonomous.
