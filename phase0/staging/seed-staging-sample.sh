#!/usr/bin/env bash
# Phase 0 Safety Spine — WS-i stratified sampled seed.
# Streams a deterministic, bounded, stratified sample from prod (READ-ONLY) into staging.businesses.
# Never writes prod (AC-i-4). Idempotent: truncates + reseeds to the same state (AC-i-3).
set -euo pipefail

: "${MARKET_INTEL_DB_URI:?set MARKET_INTEL_DB_URI (read-only prod source)}"
STAGING_DB="${STAGING_DB:-konnex_staging_v2}"
BASE_SAMPLE="${BASE_SAMPLE:-60000}"
NULLSUB_SAMPLE="${NULLSUB_SAMPLE:-5000}"
CLUSTERS="${CLUSTERS:-25}"
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "[1/3] Truncate staging.businesses (idempotent reseed)"
# CASCADE: businesses is FK-referenced (business_events, business_merges, crawl_snapshots).
# WS-i seeds only businesses, so those stay empty; CASCADE keeps the reseed idempotent.
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c "TRUNCATE businesses CASCADE;"

echo "[2/3] Stream stratified sample from prod (READ-ONLY) -> staging"
# Disable USER triggers during the load so we mirror prod rows faithfully: prod's
# trg_enforce_industry_country_match is enabled but ~52.8k grandfathered rows predate it
# (it fires only on new DML), so re-inserting them here would wrongly reject valid prod data.
# RI/FK triggers stay active. Trap re-enables even if the load fails mid-stream.
restore_triggers() { sudo -u postgres psql -d "$STAGING_DB" -c "ALTER TABLE businesses ENABLE TRIGGER USER;" >/dev/null 2>&1 || true; }
trap restore_triggers EXIT
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c "ALTER TABLE businesses DISABLE TRIGGER USER;"
# Server-side COPY (...) TO STDOUT is permitted for any role (only COPY TO/FROM file needs superuser).
psql "$MARKET_INTEL_DB_URI" -v ON_ERROR_STOP=1 \
  -v CLUSTERS="$CLUSTERS" -v BASE="$BASE_SAMPLE" -v NULLS="$NULLSUB_SAMPLE" \
  -f "$HERE/sample-query.sql" \
  | sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c "\copy businesses FROM STDIN"
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c "ALTER TABLE businesses ENABLE TRIGGER USER;"

echo "[3/3] Verify strata landed"
sudo -u postgres psql -d "$STAGING_DB" -Atc "
  SELECT 'total_rows='||count(*) FROM businesses;
"
sudo -u postgres psql -d "$STAGING_DB" -Atc "
  SELECT 'distinct_industries='||count(DISTINCT industry) FROM businesses;
"
sudo -u postgres psql -d "$STAGING_DB" -Atc "
  SELECT 'null_suburb_rows='||count(*) FROM businesses WHERE address_suburb IS NULL;
"
sudo -u postgres psql -d "$STAGING_DB" -Atc "
  SELECT 'coord_bearing_rows='||count(*) FROM businesses WHERE lat IS NOT NULL AND lng IS NOT NULL;
"
sudo -u postgres psql -d "$STAGING_DB" -Atc "
  SELECT 'max_dedup_cluster='||COALESCE(max(n),0)
  FROM (SELECT count(*) n FROM businesses WHERE google_place_id IS NOT NULL
        GROUP BY google_place_id HAVING count(*) >= 10) g;
"

echo
echo "✓ Staging seeded. READ-ONLY on prod (verify: no INSERT/UPDATE/DELETE against \$MARKET_INTEL_DB_URI above)."
