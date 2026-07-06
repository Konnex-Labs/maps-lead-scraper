# SP-2 — Change-Detection → Typed Events (Sprint Contract)

Sub-phase of Phase 1 (V2 Foundation). Parent: `PHASE-1-SCHEMA-SPEC.md` §5 (SP-2).
Arch doc: Notion `3942300f-2ecb-8149-9d15-cb8326007871` (event-driven intelligence core).
Prereq migration: `016_business_events_entity_provenance.sql` (Rajesh design sign-off PASS 7/7,
sig `f763047ae2391225`; prod-apply gated on fresh Matt GO + Phase-0 PITR + envelope).
Authority: Matt SP-2 GO 2026-07-06 (Telegram sig `1d63e67e4823074a`).

## 1. Goal

Build the "what changed since the last snapshot?" pass that emits typed, provenance-bearing
events from consecutive `crawl_snapshots`, per the §4 `events` contract. This is **not
greenfield**: `business_events` (40,469 prod rows) already IS the de-facto event stream, emitted
by `konnex-data-pipeline/temporal-diff.js`. SP-2 **extends that emitter** with entity linkage,
typed provenance (`source_id`), the trades event taxonomy, and the Phase-0 write envelope — it
does not create a duplicate `events` table (migration 016 reconciled §4 `events` onto
`business_events` additively).

## 2. Non-goals (consciously deferred)

- **Entity resolution / `businesses`→`entities` backfill** = SP-3. In SP-2 `entity_id` is
  best-effort: populated only where a canonical entity already resolves, else NULL (queryable via
  `IS NULL`). The hard gate is `source_id`, not `entity_id`.
- **Provenance backfill of the 40,469 legacy rows** = migration 018. SP-2 sets provenance on
  *newly emitted* events only; legacy rows keep NULL provenance ("pre-entity-model, unknown").
- **`market_metrics` population / read-model** = SP-4.
- **`licence_status_changed` emission** — taxonomy is defined here, but emission is a no-op until a
  licence **source** feed exists (licence data is not in `crawl_snapshots`; it needs its own
  `sources` row of `kind=licence`). SP-2 ships the contract + the emitter branch guarded on
  source-availability; it emits zero rows today by design (not a gap).
- **`crawl_snapshots` weekly partitioning** = migration 017 (deferred, SP-1 follow-on).

## 3. Design principles

- **Additive, append-only.** Events are INSERTed, never UPDATEd. `ON CONFLICT DO NOTHING` on a
  stable natural key makes every run idempotent (re-running the same crawl pair inserts 0).
- **Provenance is structural, not decorative.** Every emitted event carries a non-NULL `source_id`
  FK → `sources`. The emitter refuses to run if it cannot resolve the source row (hard fail, not a
  NULL insert) — this is what makes "zero events without a source_id" an invariant, not a hope.
- **Confidence is measured, never fabricated.** Status-transition-derived events (maps status
  field flips) are high-confidence; set-difference-derived events (appear/disappear) are
  low-confidence and explicitly labelled as such in `evidence`.
- **Runs on the Phase-0 prod-write envelope** (`lib/prod-write-envelope.js`): dry-run default,
  pre-image capture, collision pre-check, batched commit. For an INSERT-only append the pre-image
  is empty (no row mutated) and the collision pre-check maps to `ON CONFLICT`; wiring the envelope
  keeps SP-2 uniform with the rest of the prod-write surface and gives one reversible audit trail.

## 4. Event taxonomy (v1 trades set)

Per parent §4: `business_opened`, `business_closed`, `review_velocity_changed`,
`professional_density_changed`, `licence_status_changed`. Each row carries `event_type`,
`entity_id` (best-effort), `suburb_id` (for aggregate events), `source_id` (required),
`confidence`, `effective_at`, `evidence_url`, plus the existing `old_value`/`new_value`/`delta`/
`evidence` jsonb and `from_crawl_id`/`to_crawl_id`.

| event_type | trigger | confidence | entity/suburb | notes |
|---|---|---|---|---|
| `business_closed` | `maps_business_status` OPERATIONAL → CLOSED_PERMANENTLY / CLOSED_TEMPORARILY on the same `(google_place_id, industry)` across `from→to` | 0.9 (status flip) | entity=business | **Supersedes** the current set-difference disappearance heuristic as the primary signal. Set-diff disappearance kept only as a 0.5-confidence fallback under `--full-scope`, clearly labelled `rule=disappeared_from_scope`. |
| `business_opened` | status → OPERATIONAL from a prior CLOSED_* state, OR first appearance in scope | 0.9 status flip / 0.6 first-appearance | entity=business | First-appearance (set-diff) requires `--full-scope` (both crawls fully cover the same industry×country), per T3 contract §3. |
| `review_velocity_changed` | change in **normalized** review rate = Δreview_count / Δdays between `f.observed_at`→`t.observed_at`, crossing a materiality threshold | 1.0 | entity=business | Trades signal (demand proxy). Guards against the parse-miss `positive→0` zeroing (existing rule, Rajesh ack `1f37daeda0545afa`). Raw `review_count_changed` remains emitted for continuity; velocity is the derived trades metric. |
| `professional_density_changed` | Δ in count of active businesses for a `(suburb, trade)` cell between the two crawls, crossing a threshold | 0.8 | **suburb_id** set, entity_id NULL | Aggregate/suburb-level event → distinct natural key (no `google_place_id`); needs its own uniqueness constraint (see §6). |
| `licence_status_changed` | licence record state transition | (n/a today) | entity=business, related_entity=licence | **Emission deferred** — no `kind=licence` source feed yet. Contract + guarded emitter branch ship; emits 0 rows until a licence source is wired. |

## 5. Provenance & source_id contract

- Seed/ensure a canonical `sources` row for the maps crawl derivation: `kind='maps'`,
  `name='google_maps_crawl'`, `trust_tier` per policy (proposed `silver`), `is_active=true`. This is
  the `source_id` for all crawl-diff-derived events. Idempotent upsert (`ON CONFLICT (name) DO
  NOTHING` / lookup-then-use); resolved once at emitter start.
- The emitter resolves `source_id` **before** any INSERT and aborts with a non-zero exit if it is
  unresolved — no event is ever inserted with NULL `source_id`. (This is the enforcement mechanism
  for AC-4.)
- `source` (free-text varchar, existing) is preserved as-is (`'crawl_diff'`); `source_id` is the
  new typed complement. Both coexist per migration 016.
- `effective_at` = the `to` snapshot's `observed_at` (when the changed state became true).
- `evidence_url` = canonical Google Maps place URL
  (`https://www.google.com/maps/place/?q=place_id:<google_place_id>`) for per-business events;
  suburb-aggregate events use the Explorer suburb URL (or NULL where none applies, documented).

## 6. Idempotency & uniqueness

- Per-business events keep the existing natural key: `ON CONFLICT (event_type, google_place_id,
  industry, to_crawl_id) DO NOTHING`. Re-running any `from→to` pair inserts 0.
- `professional_density_changed` has no `google_place_id` → needs a distinct partial unique index,
  e.g. `(event_type, suburb_id, industry, to_crawl_id)`. **Flag:** confirm whether this requires a
  small additive index migration (016 did not add it) or whether an existing constraint covers it —
  resolve during build, before any prod write. If a new index is needed it is a 016-follow-on
  additive migration, Rajesh-reviewed.
- Adding `source_id`/`entity_id`/`suburb_id`/`effective_at`/`evidence_url` to the INSERT column
  lists does **not** change the conflict key, so idempotency is preserved for the existing event
  types.

## 7. Acceptance criteria (parent §5 SP-2, made concrete)

- **AC-1 — Deterministic emission.** On a staging fixture of known before/after `crawl_snapshots`
  (status flips, review deltas, density change, appear/disappear), the emitter produces exactly the
  expected event set — counts and types asserted. Fixture committed as the SP-2 test harness.
- **AC-2 — Idempotent.** Re-running the same crawl pair inserts 0 new rows (all event types).
  DOWN/re-UP of any follow-on index is clean.
- **AC-3 — Confidence + evidence_url populated.** Every emitted event has non-NULL `confidence` and
  non-NULL `evidence_url` (except documented suburb-aggregate no-URL case).
- **AC-4 — Zero events without a source_id.** Structurally enforced: emitter aborts if `source_id`
  unresolved; post-run assertion `SELECT count(*) FROM business_events WHERE <this run> AND
  source_id IS NULL` = 0.
- **AC-5 — No legacy mutation.** The 40,469 pre-existing rows are untouched (append-only); legacy
  `source_id` stays NULL (that's migration 018's job, not SP-2's).
- **AC-6 — Envelope.** Runs through `lib/prod-write-envelope.js` with dry-run default; a dry-run on
  the staging fixture reports the intended event set and writes nothing (ROLLBACK).

## 8. Sequencing & gates

1. This spec → Matt review (SP-2 already GO'd; this is the build contract).
2. **016 prod-apply** — push `016` (pipeline local `main b216c38`), apply to prod
   `market_intelligence` under Phase-0 PITR + envelope, open PR, Rajesh GH-approve. **Fresh Matt GO
   required.** Rajesh design sign-off already PASS.
3. Build the change-detection extension to `temporal-diff.js` on staging → staging fixture AC-1..6
   → Rajesh QA PASS.
4. Fresh Matt GO → first prod emission run (dry-run first, then live under envelope).
- **Hard gates:** no prod write without Rajesh QA + fresh Matt GO; no spend (SP-2 is pure
  Postgres, no DFS/API cost); local commits not pushed until the prod-apply PR.

## 9. Deliverables

- Extended `konnex-data-pipeline/temporal-diff.js`: `source_id` resolution + enforcement, entity
  linkage (best-effort), trades taxonomy (status-transition open/close, review_velocity,
  professional_density; licence branch guarded), `effective_at`/`evidence_url` population, envelope
  wiring.
- Staging test fixture + AC harness (deterministic before/after snapshots → expected events).
- (If needed) additive follow-on migration for the `professional_density_changed` uniqueness index.
- Rajesh QA handoff note + prod-apply PR for 016.
