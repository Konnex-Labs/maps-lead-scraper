-- Phase 0 Safety Spine — WS-i stratified staging sample. READ-ONLY on prod.
-- Deterministic (no random()): re-running yields the same row set (AC-i-3).
-- Streams to STDOUT for a piped \copy into staging.businesses.
-- Strata (AC-i-2): dedup clusters (>=10 rows, >=2 active) + a broad base sample + NULL-suburb rows.
-- psql vars: :CLUSTERS (# dedup clusters), :BASE (base sample size), :NULLS (null-suburb rows).
COPY (
  WITH clusters AS (
    SELECT google_place_id
    FROM businesses
    WHERE google_place_id IS NOT NULL
    GROUP BY google_place_id
    HAVING count(*) >= 10 AND count(*) FILTER (WHERE is_active) >= 2
    ORDER BY count(*) DESC, google_place_id
    LIMIT :CLUSTERS
  ),
  cluster_ids AS (
    SELECT b.id FROM businesses b JOIN clusters c USING (google_place_id)
  ),
  base_ids AS (
    SELECT id FROM businesses ORDER BY id LIMIT :BASE
  ),
  null_ids AS (
    SELECT id FROM businesses WHERE address_suburb IS NULL ORDER BY id LIMIT :NULLS
  ),
  keep AS (
    SELECT id FROM cluster_ids
    UNION SELECT id FROM base_ids
    UNION SELECT id FROM null_ids
  )
  SELECT b.* FROM businesses b JOIN keep k USING (id)
) TO STDOUT;
