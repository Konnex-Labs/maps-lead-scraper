# SP-4 — Read-model + market_metrics wiring (CORRECTED SPEC)

**Author:** Jack (Head of Engineering)  
**Date:** 2026-07-08  
**Status:** CORRECTED FOR RAJESH QA GATE RE-REVIEW  
**Tier:** 2 (schema/infra, additive-only)  
**Session estimate:** 1 session  
**Authority:** Matt approval (sig 2a1461d86f1a2915, all Q1-7 locked)  
**QA Gate:** Rajesh blockers + gaps addressed (sig 761691cd2793d60c)

---

## Specification (All 7 Implementation Details — CORRECTED)

### Q1 — Table Schema ✅ (UPDATED DDL)
**New table creation:** `market_metrics` (migration mig020)  
**Rationale:** Derived aggregate substrate (not transactional), Pulse domain separate from core entity/event schema, needs period-based partitioning with independent retention policy.

**DDL (CORRECTED — includes pulses schema creation):**
```sql
CREATE SCHEMA IF NOT EXISTS pulses;

CREATE TABLE market_metrics (
  metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suburb_id UUID NOT NULL REFERENCES entities(entity_id),
  trade TEXT NOT NULL,  -- canonical trade code (e.g., 'carpenter_au'), plain TEXT (no FK to entities)
  metric TEXT NOT NULL,
  value NUMERIC NOT NULL,
  delta NUMERIC,
  period TEXT NOT NULL,  -- ISO 8601 week string 'YYYY-Www', e.g. '2026-W28'
  computed_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (period);

-- Weekly partitions (ISO 8601)
CREATE TABLE market_metrics_2026_W27 PARTITION OF market_metrics
  FOR VALUES FROM ('2026-W27') TO ('2026-W28');

CREATE INDEX idx_market_metrics_suburb_trade_period 
  ON market_metrics (suburb_id, trade, period);
```

**Columns:**
- `metric_id` (PK, UUID, default gen_random_uuid())
- `suburb_id` (FK to entities(entity_id), not null)
- `trade` (TEXT, not null — canonical trade code, NO FK)
- `metric` (TEXT, not null — metric name: e.g., 'review_velocity_delta')
- `value` (NUMERIC, not null — computed metric value)
- `delta` (NUMERIC — week-over-week change, nullable)
- `period` (TEXT, not null — ISO 8601 week string, e.g., '2026-W28')
- `computed_at` (TIMESTAMPTZ, not null — timestamp when metric was computed)

### Q2 — Baseline Definition ✅ (CORRECTED QUERY)
**Baseline source:** Aggregate `review_velocity_changed` events from `business_events` table

**CORRECTED Baseline query:**
```sql
-- CORRECTED: 'industry' (not 'trade'), EXTRACT()::int::text (not ::text), no 'period' column in business_events
SELECT 
  suburb_id,
  industry as trade,  -- business_events.industry → market_metrics.trade (alias for clarity)
  EXTRACT(ISOYEAR FROM observed_at)::int::text || '-W' || 
  LPAD(EXTRACT(WEEK FROM observed_at)::int::text, 2, '0') as period,
  COUNT(*) as review_velocity_count
FROM business_events
WHERE event_type = 'review_velocity_changed'
  AND suburb_id IS NOT NULL
  AND industry IS NOT NULL
GROUP BY suburb_id, industry, period
```

**Key fixes:**
- `industry` (not `trade`) — business_events has 'industry' column
- `EXTRACT()::int::text` (not `::text`) — EXTRACT returns double, must cast to int first to avoid '2026.0-W28.0'
- Removed reference to 'e.period' column (doesn't exist) — period computed from observed_at

### Q3 — Read-model Endpoint ✅ (NO CHANGES)
**Implementation:** Postgres function (MVP)  
**Function signature:**
```sql
CREATE OR REPLACE FUNCTION pulses.get_suburb_trade_metrics(
  p_suburb_id UUID,
  p_trade TEXT,
  p_start_period TEXT,  -- e.g., '2026-W27'
  p_end_period TEXT     -- e.g., '2026-W30'
)
RETURNS TABLE (
  metric_id UUID,
  suburb_id UUID,
  trade TEXT,
  metric TEXT,
  value NUMERIC,
  delta NUMERIC,
  period TEXT,
  computed_at TIMESTAMPTZ
)
AS $$
  SELECT metric_id, suburb_id, trade, metric, value, delta, period, computed_at
  FROM market_metrics
  WHERE suburb_id = p_suburb_id
    AND trade = p_trade
    AND period >= p_start_period
    AND period <= p_end_period
  ORDER BY period
$$ LANGUAGE SQL STABLE;
```

### Q4 — Period Partitioning ✅ (NO CHANGES)
**Partition grain:** Weekly (ISO 8601, Monday-Sunday)  
**Partition key:** `period` column (TEXT format 'YYYY-Www')  
**Examples:** '2026-W27', '2026-W28', '2026-W29'

### Q5 — Coverage Floor ✅ (CORRECTED VERIFICATION)
**Expected coverage:** Zero-gap expected within active universe  
**Definition:** Market_metrics should have rows for exactly those (suburb_id, industry) pairs that have `review_velocity_changed` events in that week.

**CORRECTED Verification test (AC):**
```sql
-- CORRECTED: 'industry' (not 'trade'), EXTRACT for period (not column), no 'e.period'
-- Should return 0 rows (perfect coverage)
SELECT DISTINCT e.suburb_id, e.industry
FROM business_events e
WHERE e.event_type = 'review_velocity_changed'
  AND EXTRACT(ISOYEAR FROM e.observed_at)::int::text || '-W' ||
      LPAD(EXTRACT(WEEK FROM e.observed_at)::int::text, 2, '0') = '2026-W28'
EXCEPT
SELECT DISTINCT suburb_id, trade
FROM market_metrics
WHERE period = '2026-W28'
```

**Key fixes:**
- `industry` (not `trade`) — business_events column name
- EXTRACT period computed from observed_at (no 'e.period' column)
- `EXTRACT()::int::text` for correct format

### Q6 — Idempotency Test ✅ (CORRECTED: DATA COLUMNS ONLY, NOT metric_id)
**Idempotency definition:** Running SP-4 twice on same week range produces identical data results (ignoring metric_id UUID which regenerates on truncate+re-run).

**CORRECTED Test procedure:**
```sql
-- CORRECTED: hash DATA columns only (suburb_id, trade, metric, value, delta, period), NOT metric_id
-- First run: SP-4 populates week W
-- Take baseline snapshot
SELECT COUNT(*) as row_count,
       MD5(STRING_AGG(suburb_id::text || trade || metric || value::text || 
           COALESCE(delta::text,'') || period, ',' 
           ORDER BY suburb_id, trade, metric, period)) as data_hash
FROM market_metrics
WHERE period = '2026-W28'
INTO baseline_count, baseline_hash;

-- Second run: SP-4 re-runs on week W (or after truncate+re-run)
-- Compare data (NOT metric_id which regenerates)
SELECT COUNT(*) as row_count,
       MD5(STRING_AGG(suburb_id::text || trade || metric || value::text || 
           COALESCE(delta::text,'') || period, ',' 
           ORDER BY suburb_id, trade, metric, period)) as data_hash
FROM market_metrics
WHERE period = '2026-W28'
INTO rerun_count, rerun_hash;

-- Assertion
ASSERT baseline_count = rerun_count, 'Row count mismatch on idempotency';
ASSERT baseline_hash = rerun_hash, 'Row data changed on second run (not idempotent)';
```

**Key fixes:**
- Hash DATA columns only: suburb_id, trade, metric, value, delta, period
- Exclude metric_id (random UUID regenerates on each run)
- ORDER BY data columns for consistent hashing
- This test now works correctly even after truncate+re-run

### Q7 — Rollback Path ✅ (NO CHANGES)
**Rollback strategy:** Truncate partition + re-run

**Procedure if metrics wrong post-population:**
1. Identify root cause:
   - (A) Wrong aggregation logic → fix code, re-run
   - (B) Upstream data changed → rare (snapshots/events immutable)
2. Truncate week partition:
   ```sql
   DELETE FROM market_metrics WHERE period = '2026-W28';
   ```
3. Fix logic/code (if A) or re-run aggregation (if B)
4. Re-run SP-4 on same week range

**Rationale:** Market_metrics is derived (not source of truth). No reversibility log needed because data is fully reproducible from immutable sources (events + snapshots). Simpler, more resilient, no extra bookkeeping overhead.

---

## Acceptance Criteria (All Corrected)

1. **Schema & table:** pulses schema created, market_metrics table created (mig020) with corrected DDL
2. **Baseline reproduction:** review_velocity_changed events aggregated by suburb+industry (as trade)+period, EXTRACT()::int::text for correct format
3. **Function endpoint:** pulses.get_suburb_trade_metrics() created and queryable
4. **Partitioning:** Weekly ISO 8601 (Mon-Sun) partitions created, period TEXT format 'YYYY-Www'
5. **Coverage:** All (suburb_id, industry) pairs with events in week W have metrics row (verified with corrected EXCEPT query)
6. **Idempotency:** Run twice on same week, data hash unchanged (metric_id excluded from hash, as it regenerates)
7. **Rollback:** Truncate partition, re-run produces identical data metrics

---

## Changes Summary (Blocker Fixes + Gap Fills)

**BLOCKER-1 FIX:** Replaced 'trade' → 'industry' in Q2 baseline query and Q5 coverage check. Fixed period filtering to use EXTRACT, not nonexistent 'period' column.

**BLOCKER-2 FIX:** Changed EXTRACT()::text → EXTRACT()::int::text to avoid '2026.0-W28.0' malformed period strings. Applied to Q2, Q5, Q6.

**BLOCKER-3 FIX:** Corrected Q6 idempotency test to hash data columns only (suburb_id, trade, metric, value, delta, period), excluding metric_id (random UUID). Test now survives truncate+re-run correctly.

**GAP-1 FIX:** Added CREATE SCHEMA IF NOT EXISTS pulses to mig020 DDL.

**GAP-2 FIX:** Clarified market_metrics.trade is plain TEXT (canonical trade code), NOT a FK to entities. Distinct from entity model; maps from business_events.industry.

---

## Ready for Rajesh QA Gate Re-Review

All 3 blockers fixed. All 2 gaps addressed. Ready for fast-track re-review and PASS.

