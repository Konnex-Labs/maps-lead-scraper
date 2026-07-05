#!/usr/bin/env bash
# Phase 0 Safety Spine — WS-i durable staging rebuild.
# Mirrors the CURRENT prod schema (pg_dump --schema-only, READ-ONLY on prod) into staging.
# Successor to pipeline-orchestrator/v2-pilot/staging-setup/setup-staging.sh (throwaway WS5 harness).
# Idempotent: drops + recreates public each run. Documented in README.md.
set -euo pipefail

: "${MARKET_INTEL_DB_URI:?set MARKET_INTEL_DB_URI (read-only prod source)}"
STAGING_DB="${STAGING_DB:-konnex_staging_v2}"
STAGING_APP_USER="${STAGING_APP_USER:-konnex_staging}"

echo "[1/4] Reset public schema on ${STAGING_DB}"
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c \
  "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO ${STAGING_APP_USER}, postgres;"
# pg_dump --schema=public omits database-level CREATE EXTENSION, so pre-create what prod uses
# (uuid-ossp for the businesses id default, pg_trgm for trigram indexes, vector for the corpus tables).
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c \
  "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"; CREATE EXTENSION IF NOT EXISTS pg_trgm; CREATE EXTENSION IF NOT EXISTS vector;"

echo "[2/4] Dump CURRENT prod schema (read-only) and load into staging"
# --no-owner/--no-privileges: prod roles don't exist on staging. --schema=public: pipeline + corpus DDL.
# Strip the dump's own "CREATE SCHEMA public;" — we manage public in step 1 (avoids collision).
pg_dump "$MARKET_INTEL_DB_URI" --schema-only --no-owner --no-privileges --schema=public \
  | grep -vxF 'CREATE SCHEMA public;' \
  | sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -q

echo "[3/4] Grant app user on mirrored objects"
sudo -u postgres psql -d "$STAGING_DB" -v ON_ERROR_STOP=1 -c \
  "GRANT ALL ON ALL TABLES IN SCHEMA public TO ${STAGING_APP_USER}; \
   GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO ${STAGING_APP_USER}; \
   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${STAGING_APP_USER};"

echo "[4/4] Verify schema mirror"
sudo -u postgres psql -d "$STAGING_DB" -Atc \
  "SELECT 'base_tables='||count(*) FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"
sudo -u postgres psql -d "$STAGING_DB" -Atc \
  "SELECT 'businesses_columns='||count(*) FROM information_schema.columns WHERE table_name='businesses';"

echo
echo "✓ Schema mirror ready on ${STAGING_DB}."
echo "  Seed representative data with: MARKET_INTEL_DB_URI=... $(dirname "$0")/seed-staging-sample.sh"
