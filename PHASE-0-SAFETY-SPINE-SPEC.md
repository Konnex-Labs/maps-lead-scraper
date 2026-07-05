# Phase 0 — Safety Spine (Sprint Contract)

> **Status:** DRAFT for review — Matt (product/GO) + Rajesh (QA).
> **Author:** Jack (Head of Engineering) · **Reviewer/QA:** Rajesh
> **Tier:** Infra Tier 2 · **Session estimate:** 4+
> **Depends on:** v2-foundation arch doc (Notion `3942300f-2ecb-8149-9d15-cb8326007871`), §10 Phase roadmap.
> **Matt GO on Phase 0 concept:** sig `d6ca81527c7ba201` (arch doc approved + Phase 0 GO). **This spec adds nothing that touches prod until Matt reviews it and Rajesh QAs it.**

---

## 1. Why this exists

Phase 0 is the **safety net that the entire v2 clean-cut depends on**. The v2 foundation
plan (Phase 2) involves destructive, hard-to-reverse prod operations on
`market_intelligence` (3.7M+ rows): truncate/clean-cut, re-ingestion, dedup remediation.
Today we have **no way to recover** if one of those goes wrong:

- **No PITR, no WAL archiving, no automated snapshots** anywhere in the repos (recon
  finding — greenfield). The only backup mechanism is an ad-hoc `pg_dump` runbook line.
- **No durable staging** — `konnex_staging_v2` is a self-labelled *throwaway* schema
  mirror with no representative data.
- **Safety-envelope logic for prod writes is scattered** across two one-off scripts; no
  single reusable module, and the three most important guards (pre-image, collision
  pre-check, VACUUM) are missing or only partially present.

Phase 0 closes all three gaps **before** any Phase 2 destructive work is authorized.
Nothing in Phase 0 itself is destructive or spends money.

## 2. Scope

**In scope (build this):**
- (i) Harden `konnex_staging_v2` into a documented, durable staging DB + representative
  sampled-data seeding.
- (ii) Extract the prod-write safety envelope into a **single shared, reusable module**,
  adding the three missing guards.
- (iii) Stand up **PITR from scratch** on `market_intelligence` prod: WAL archiving +
  automated snapshots + a documented, *tested* restore drill.

**Explicitly OUT of scope (separate Matt-gated GO required):**
- Phase 2 clean-cut / truncate of prod.
- The ~USD100–150 NSW+3 re-ingestion spend.
- Dedup remediation (ticket `3932300f-2ecb-8197`) — queued fast-follow, blocked-by Phase 0.
- Any schema/entity-model change (that is Phase 1).

## 3. Environment (recon — verified read-only, do not re-research)

| Thing | Value |
|---|---|
| Prod DB | `market_intelligence` on **konnex-data 204.168.198.203**, Postgres **16.14** |
| Prod addressing | `MARKET_INTEL_DB_URI` (in `/home/jack/.env` or repo `.env.crawl`; both gitignored) → falls back to `PIPELINE_DB_URI` |
| Staging DB | `konnex_staging_v2` on `127.0.0.1:5432` (konnex-ops box), user `konnex_staging` |
| Staging builder | `pipeline-orchestrator/v2-pilot/staging-setup/setup-staging.sh` (drops/recreates `public`, loads `schema-prod-snapshot.sql` = ~25KB `pg_dump --schema-only`, applies migrations) |
| Canonical schema | `konnex-data-pipeline/schema.sql` |
| Migrations | home-grown (no sqitch/flyway): `konnex-data-pipeline/migrations/` (001–013) + `pipeline-orchestrator/migrations/` (001–022, `npm run migrate`) |
| Envelope source A | `konnex-data-pipeline/scripts/one-off/backfill-merge-lineage.js` |
| Envelope source B | `konnex-data-pipeline/scripts/one-off/backfill-au-suburb-mapping.js` |

> **My rule:** before any DB-touching execution, READ `konnex-data-pipeline/REPO-MAP.md` first.
> crawl-1/crawl-2 boxes were DECOMMISSIONED 2026-07-03 (DFS pivot); konnex-data is the only enrichment box now.

---

## 4. Workstream (iii) — PITR + backups **[SEQUENCE FIRST]**

This is the biggest lift and the safety net everything else leans on, so it lands first.

### 4.1 Current state
Greenfield. No PITR, no WAL archiving, no pgBackRest/barman/wal-g, no cron backup. Only an
ad-hoc `pg_dump` runbook step (`konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT.md:78-79`).

### 4.2 Design
- **Tool:** pgBackRest (preferred over raw `archive_command` + cron for retention,
  parallelism, and a first-class `restore --type=time` PITR path). Fallback to WAL-G if a
  pgBackRest package is unavailable on the box — decide during build, note in the PR.
- **Repo target:** local disk on a *separate volume* from PGDATA for the first cut; document
  the off-box/object-store follow-up as a Phase 0.x nice-to-have (do not block on it).
- **WAL archiving:** enable `archive_mode=on`, `archive_command` via pgBackRest, confirm
  WAL is shipping (non-destructive — a config reload, not a restart, where possible).
- **Automated snapshots:** daily full + intra-day incremental via `pgbackrest backup`,
  scheduled through systemd timer (durable across reboot — mirrors the cgroup-containment
  lesson) rather than a bare crontab.
- **Retention:** start with 7 days full + WAL to cover the Phase 2 window with margin; make
  it a documented config knob.

### 4.3 Acceptance criteria
- **AC-iii-1:** `pgbackrest check` passes on prod stanza (archive + repo reachable).
- **AC-iii-2:** A full backup completes and is logged; `pgbackrest info` shows it.
- **AC-iii-3:** WAL segments are being archived continuously (verify `pg_stat_archiver`:
  `archived_count` increasing, `failed_count` = 0).
- **AC-iii-4 (THE ONE THAT MATTERS):** **Documented restore drill executed against
  STAGING, not prod** — restore prod's latest backup + replay to a chosen `--type=time`
  point on the staging box, and prove row counts/checksums match the target timestamp.
  This proves recoverability without risking prod.
- **AC-iii-5:** Runbook written: how to trigger PITR, expected RTO/RPO, who authorizes it.
- **AC-iii-6:** Scheduled snapshot survives a simulated reboot of the timer (durability).

### 4.4 Safety
Enabling archiving + taking backups is **additive and non-destructive**. The only prod-side
change is Postgres config (archive_mode/command) — applied via reload where possible, and if
a restart is unavoidable it is Matt-scheduled, not autonomous. **The restore drill runs on
staging only.** No prod data is mutated in this workstream.

---

## 5. Workstream (ii) — Shared prod-write safety-envelope module

### 5.1 What exists today (recon)
Building blocks are proven but scattered; **no single script has all five, and VACUUM is in zero.**

| Guard | `backfill-merge-lineage.js` | `backfill-au-suburb-mapping.js` |
|---|---|---|
| Dry-run **default** | ✅ (`--live` to write) | ⚠️ opt-in `--dry-run` (writes by default) |
| Per-batch txn (BEGIN/COMMIT/ROLLBACK) | ✅ | ❌ (autocommit per UPDATE) |
| Reversibility log **before** write | ✅ (JSONL to `reports/`) | ⚠️ post-hoc report only |
| Idempotency skip-set / resumable | ✅ skip-set | ✅ keyset checkpoint (`id > lastId`, `BATCH_SIZE=1000`) |
| Batched keyset writes | ❌ (per-industry) | ✅ |
| Pre-image capture | ⚠️ domain `loser_snapshot` | ⚠️ dedicated `*_pre_geocode` columns (schema-specific) |
| Collision pre-check | ❌ reactive `23505` catch | ❌ reactive `23505` catch |
| VACUUM after large delete/update | ❌ | ❌ (does `REFRESH MATVIEW` only) |

### 5.2 Design — `lib/prod-write-envelope.js` (shared)
Extract into ONE reusable module (not per-script copies). Public contract:

```
runEnvelope({
  pool,
  selectBatch,     // (client, lastKey, batchSize) -> rows   (keyset, ORDER BY pk ASC)
  keyOf,           // row -> primary key (for keyset + skip-set + pre-image id)
  plan,            // row -> { sql, params, preImageSelect }  (the intended write + how to snapshot it)
  collisionCheck,  // (client, row) -> bool  (PROACTIVE unique/FK check; skip+log if would collide)
  opts: { live=false, batchSize=1000, vacuum=false, reportDir }
})
```

Defaults and guarantees:
- **Dry-run by DEFAULT** (`live: false`) — the safe default from source A becomes the module default.
- **Per-row PRE-IMAGE capture (NEW, generalized):** before each write, `SELECT` the current
  row state via `preImageSelect` and append it to a JSONL reversibility log **before** the
  write commits. Generalizes source-A's `loser_snapshot` and source-B's `*_pre_geocode`
  columns into one row-agnostic mechanism — enables a mechanical row-level revert.
- **Collision PRE-CHECK (NEW, proactive):** run `collisionCheck` *before* the write; if it
  would violate a unique/FK constraint, **skip + log**, don't rely on catching `23505` after
  the fact. Keep the reactive `23505` catch as a belt-and-braces backstop.
- **Batched keyset writes** wrapped in **per-batch BEGIN/COMMIT/ROLLBACK** (unifies A's txn
  discipline with B's keyset batching + resumable checkpoint).
- **VACUUM (NEW):** on `vacuum: true`, run `VACUUM (ANALYZE)` on affected tables after a
  large delete/update run completes (dead-tuple reclamation — matters for the Phase 2 dedup
  deletes). Opt-in per-run so read-mostly updates don't pay for it.
- **Reversibility log** (JSONL to `reportDir`) written **before** any write, per source A.

### 5.3 Acceptance criteria
- **AC-ii-1:** Module dry-runs by default; a caller with no `live:true` writes ZERO rows
  (assert via a staging table row-count delta of 0).
- **AC-ii-2:** Pre-image log contains one entry per intended write with full prior row state,
  written before the corresponding COMMIT (crash mid-run ⇒ log ⊇ actual writes, never fewer).
- **AC-ii-3:** Collision pre-check skips a row that *would* 23505 and logs it; the reactive
  catch never fires in the happy path (proves the pre-check is doing the work).
- **AC-ii-4:** Keyset resume: kill mid-run, re-run, and it resumes from checkpoint with no
  double-write (skip-set + `id > lastId`).
- **AC-ii-5:** `vacuum:true` issues `VACUUM (ANALYZE)` on the target table(s); `vacuum:false` does not.
- **AC-ii-6:** One of the two existing scripts is refactored onto the module as a **reference
  caller** and reproduces its prior dry-run numbers exactly (regression proof) — I propose
  `backfill-au-suburb-mapping.js` since it's the weaker of the two (writes-by-default, no txn).
- **AC-ii-7:** Unit tests for each guard; integration test against staging.

### 5.4 Safety
Built + tested entirely against **staging**. The module's whole purpose is to make prod
writes safer; it is not itself pointed at prod in Phase 0. The reference-caller refactor
(AC-ii-6) is validated by reproducing dry-run numbers — no prod write.

---

## 6. Workstream (i) — Staging hardening + sampled-data seeding

### 6.1 Current state (recon)
`setup-staging.sh` drops/recreates `public`, loads a `--schema-only` prod snapshot, applies
migrations — **schema mirror only**, seeded with a 30-row test harness. Self-labelled
"throwaway, not for production use." Good enough for migration smoke-tests, useless for
validating a data migration or the safety-envelope module at realistic scale.

### 6.2 Design
- **Promote to durable + documented:** move it out of `v2-pilot/`-implied throwaway status
  into a named, documented staging with a README (connection, refresh cadence, what it is/isn't).
  Keep the drop/recreate idempotency — durability is about *documentation + repeatability*,
  not permanence of data.
- **Representative sampled-data seeding (the real add):** seed from prod with a **bounded,
  stratified sample**, NOT a 3.7M clone. Stratify by `industry` + `is_active` + presence of
  `google_place_id` so the sample exercises: dedup groups (multi-active + inactive losers),
  NULL-suburb rows, coordinate-bearing rows, and the long tail of small industries.
  Target ~50–100k rows.
- **Sampling method:** `pg_dump` a filtered/`TABLESAMPLE`'d extract, or a repeatable seed
  script that pulls via `MARKET_INTEL_DB_URI` (read-only) into staging. **Read-only on prod**
  — sampling never writes prod.
- **PII/scope:** businesses data is already the product surface (public Explorer), so no
  masking needed, but the seed script honours the same provenance scope gate — no
  `address_state` mutation, read-only source.

### 6.3 Acceptance criteria
- **AC-i-1:** `setup-staging.sh` (or successor) runs clean end-to-end and is documented in a
  staging README.
- **AC-i-2:** Sampled seed loads ~50–100k rows that include ≥1 of each stratum (dedup
  multi-active group, NULL-suburb row, coord-bearing row, ≥3 distinct industries).
- **AC-i-3:** Seed is repeatable/idempotent (re-run ⇒ same staging state).
- **AC-i-4:** Seeding is **read-only against prod** (verified: no prod write in the seed path).
- **AC-i-5:** The safety-envelope integration tests (§5.3) and the PITR restore drill
  (AC-iii-4) both run against this staging successfully — i.e. staging is proven fit for
  purpose by the other two workstreams.

### 6.4 Safety
Sampling reads prod, writes staging. No prod mutation. No spend.

---

## 7. Sequencing & gates

1. **(iii) PITR first** — it's the recoverability net; nothing destructive should ever be
   possible without it in place.
2. **(i) Staging hardening** — needed as the proving ground for (ii) and for the (iii)
   restore drill (AC-iii-4 runs on staging). In practice (i) and (iii) interleave: stand up
   staging early enough to host the restore drill.
3. **(ii) Envelope module** — built and tested on the hardened staging.

**Hard gate before ANY prod-touching execution beyond additive PITR config:**
- Matt reviews this spec + gives explicit GO on execution.
- Rajesh QAs each workstream (ACs above) — sign-off per workstream, not one blanket sign-off.
- I flag to Matt before anything writes to prod infra (promised).

**Autonomy boundary (restated):** Matt's Phase 0 GO covers this safety-spine *build* — no
spend, no destructive ops. Phase 2 clean-cut/truncate + the USD100–150 NSW+3 re-ingestion
are **Tier-3, separate explicit Matt GO**. I will NOT self-authorize truncate or spend.

## 8. Rollback / reversibility per workstream

| Workstream | If it goes wrong | Rollback |
|---|---|---|
| (iii) PITR | archive_command misconfigured | revert config reload; archiving is additive, no data risk |
| (ii) module | bug in a guard | dry-run default means the failure mode is "wrote nothing"; pre-image log enables row-level revert if a `live` run ever misbehaves on staging |
| (i) staging | bad seed | `setup-staging.sh` drops/recreates — staging is disposable by design |

## 9. Open questions for Matt / Rajesh

- **Q1 (Matt):** pgBackRest vs WAL-G — any infra preference, or leave to my call during build
  based on what packages the konnex-data box has?
- **Q2 (Matt):** Backup repo target for the first cut — local separate-volume acceptable, with
  off-box/object-store as a documented follow-up? Or do you want off-box from day one?
- **Q3 (Rajesh):** Do you want the restore-drill (AC-iii-4) as a scripted, repeatable QA
  artifact (so we can re-run it before Phase 2), or is a one-time documented proof enough?
- **Q4 (Rajesh):** Sampled-seed size — is ~50–100k the right proving-ground scale, or do you
  want a larger stratified sample to stress the envelope's batching?

---

## 10. Deliverables checklist

- [ ] `lib/prod-write-envelope.js` + unit tests + one reference-caller refactor (WS ii)
- [ ] pgBackRest (or WAL-G) stanza on prod + systemd-timer schedule + `pg_stat_archiver` proof (WS iii)
- [ ] Restore-drill script + documented proof on staging (WS iii, AC-iii-4)
- [ ] Hardened staging + sampled-seed script + staging README (WS i)
- [ ] PITR runbook (RTO/RPO, trigger, authorization) (WS iii)
- [ ] Session estimate added to Notion task Notes (4+) before build starts
