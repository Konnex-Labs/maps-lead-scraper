# Phase 0 Safety Spine — WS-i Staging

Durable, documented staging environment for the V2 safety spine. It is the
target for the WS-iii restore drill and the WS-ii prod-write envelope tests, so
prod-write logic is exercised against a faithful schema **before** it ever
touches production.

## What this is

- **Host:** `konnex-ops` box, local Postgres at `127.0.0.1:5432`.
- **Database:** `konnex_staging_v2` — app user `konnex_staging`.
- **Schema:** a full mirror of prod `market_intelligence` (konnex-data,
  `204.168.198.203`, PG 16). 56 base tables, `businesses` with 94 columns,
  extensions `uuid-ossp` / `pg_trgm` / `vector`. Mirrored via
  `pg_dump --schema-only` (read-only on prod).
- **Data:** a bounded, deterministic, **stratified sample** — ~71.5k
  `businesses` rows (not a clone).

## What this is NOT

- **Not a full prod clone.** Prod is ~3.78M businesses / 26 GB; this is a ~71.5k
  representative sample. Do not rely on it for volume/perf numbers.
- **Not a live replica.** It is refreshed on demand, not streamed. Data is a
  point-in-time snapshot from the last `seed` run.
- **Not production.** Never point app/prod traffic here. It exists to test
  migrations, the prod-write envelope, and restore drills safely.

## Layout

| File | Purpose |
|------|---------|
| `setup-staging.sh` | Reset `public` + mirror current prod schema (read-only). Idempotent (drop/recreate each run). |
| `sample-query.sql` | Deterministic stratified sample (`COPY ... TO STDOUT`). No `random()`. |
| `seed-staging-sample.sh` | Truncate + stream the sample from prod into `businesses`. Idempotent. |

## Usage

```bash
export MARKET_INTEL_DB_URI=<read-only prod URI>   # source of the schema + sample

# 1. Rebuild the schema mirror (safe to re-run any time)
./setup-staging.sh

# 2. Seed the stratified sample (truncate + reseed)
./seed-staging-sample.sh
```

Optional seed knobs (env): `BASE_SAMPLE` (default 60000), `NULLSUB_SAMPLE`
(5000), `CLUSTERS` (25), `STAGING_DB` (`konnex_staging_v2`).

## Sample strata (AC-i-2)

The sample deliberately covers the shapes the safety spine must handle:

- **Dedup clusters** — top `CLUSTERS` `google_place_id` groups with ≥10 rows and
  ≥2 active (largest landed cluster: 614 rows) — exercises dedup remediation.
- **Broad base** — first `BASE_SAMPLE` rows by `id` — 140+ industries.
- **NULL-suburb** — `NULLSUB_SAMPLE` rows with `address_suburb IS NULL` —
  exercises suburb backfill / normalization paths.

Last seed: 71,572 rows / 142 industries / 5,000 null-suburb / 41,116 with
coordinates / max dedup cluster 614.

## Guarantees

- **Prod is read-only.** Both scripts only `pg_dump --schema-only` and
  `COPY (...) TO STDOUT` against `MARKET_INTEL_DB_URI`. No INSERT/UPDATE/DELETE
  ever targets prod (AC-i-4).
- **Deterministic + idempotent.** The sample uses `ORDER BY id` (no `random()`);
  re-running `seed-staging-sample.sh` yields an identical row set (verified by
  id-set hash across reseeds — AC-i-3).
- **Faithful load.** User triggers are disabled for the load window so the
  ~52.8k prod rows that predate `trg_enforce_industry_country_match` (a
  grandfathered constraint that fires only on new DML) mirror exactly as they
  exist in prod. RI/FK triggers stay active. Triggers are re-enabled after
  (trap-guarded on failure).

## Refresh cadence

On demand. Re-run `setup-staging.sh` (schema drift) then `seed-staging-sample.sh`
(fresh snapshot) before a restore drill or an envelope test run. There is no
scheduled refresh in Phase 0.
