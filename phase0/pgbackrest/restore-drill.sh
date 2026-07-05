#!/usr/bin/env bash
# Phase 0 Safety Spine — WS-iii AC-iii-4 PITR restore drill (OPTION A: isolated cluster on konnex-data).
#
# ⚠️ DRAFT pending on-box validation. The box-agnostic core (repo inventory, restore invocation,
#    spot-check, RTO timing, teardown, safety guards) is final. The [4/6] START section is
#    Debian-PG-layout-specific (config lives in /etc, not the data dir) and MUST be validated/iterated
#    ON konnex-data before this is a QA artifact — do not trust it blind.
#
# WHERE: run ON konnex-data (204.168.198.203) — the box with pgbackrest + the same-disk repo.
# WHAT:  restores the prod backup into an ISOLATED cluster (separate pg1-path + port), replays WAL to a
#        target time, promotes, spot-checks a named row, measures RTO, tears down. NEVER touches prod.
# AUTH:  prod-box op → Matt-authorized only. Read konnex-data REPO-MAP.md before running (Jack's rule).
# RE-RUNNABLE: tears down + rebuilds the drill cluster each run (AC-iii-4 requirement).
set -euo pipefail

STANZA="${STANZA:-market_intelligence}"
DRILL_PGDATA="${DRILL_PGDATA:-/var/lib/postgresql/16/drill}"   # isolated — NOT prod's .../16/main
DRILL_PORT="${DRILL_PORT:-5433}"                               # isolated — NOT prod's 5432
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
TARGET_TIME="${TARGET_TIME:-}"                                 # empty = latest recoverable; else "YYYY-MM-DD HH:MM:SS+00"
# A named row whose value we assert survived the restore at the target point (AC-iii-4 spot-check).
# Pick a stable, known business_id + expected name at seed/backup time; override via env.
SPOT_ID="${SPOT_ID:?set SPOT_ID to a known businesses.id present in the backup}"
SPOT_EXPECT="${SPOT_EXPECT:?set SPOT_EXPECT to the expected name of that row at the target time}"
# Aggregate assertions (AC-iii-4a): count + checksum must MATCH the target-time state, not just be logged.
# Precompute both against the source at the target time BEFORE the drill, and pass them in.
EXPECTED_COUNT="${EXPECTED_COUNT:?set EXPECTED_COUNT = businesses count(*) at the target time}"
CKSUM_ROWS="${CKSUM_ROWS:-100000}"   # bounded, deterministic id-window (keeps the checksum lightweight)
EXPECTED_CKSUM="${EXPECTED_CKSUM:?set EXPECTED_CKSUM = md5(string_agg(id ORDER BY id)) over the first CKSUM_ROWS ids at the target time}"

# ---- SAFETY GUARDS: refuse to ever operate on the prod cluster ----------------------------------
[[ "$DRILL_PGDATA" == "/var/lib/postgresql/16/main" ]] && { echo "REFUSE: DRILL_PGDATA points at prod data dir"; exit 1; }
[[ "$DRILL_PORT" == "5432" ]] && { echo "REFUSE: DRILL_PORT is the prod port"; exit 1; }

echo "[0/6] Pre-flight — repo inventory (proves the backup + WAL range we are restoring from)"
sudo -u postgres pgbackrest --stanza="$STANZA" info

echo "[1/6] Tear down any prior drill cluster (idempotent re-run)"
sudo -u postgres bash -c "'$PGBIN/pg_ctl' -D '$DRILL_PGDATA' stop -m immediate" 2>/dev/null || true
sudo rm -rf "$DRILL_PGDATA"
sudo install -d -o postgres -g postgres -m 700 "$DRILL_PGDATA"

echo "[2/6] Restore into the isolated pg1-path (RTO clock starts)"
T0=$(date +%s)
if [[ -n "$TARGET_TIME" ]]; then
  sudo -u postgres pgbackrest --stanza="$STANZA" --pg1-path="$DRILL_PGDATA" \
    --type=time --target="$TARGET_TIME" --target-action=promote --log-level-console=info restore
else
  # Latest: replay all archived WAL, then promote.
  sudo -u postgres pgbackrest --stanza="$STANZA" --pg1-path="$DRILL_PGDATA" \
    --type=default --target-action=promote --log-level-console=info restore
fi

echo "[3/6] Neutralize archiving on the restored cluster (must NOT push WAL into the prod repo)"
# pgbackrest wrote recovery settings to postgresql.auto.conf; we append hard overrides.
sudo -u postgres bash -c "cat >> '$DRILL_PGDATA/postgresql.auto.conf'" <<EOF
# --- restore-drill overrides (isolated cluster) ---
port = $DRILL_PORT
listen_addresses = 'localhost'
archive_mode = off
archive_command = ''
EOF

echo "[4/6] Start the isolated cluster and wait for recovery→promote"
# ⚠️ VALIDATE ON konnex-data: Debian keeps postgresql.conf/pg_hba.conf in /etc, so the restored data
#    dir has none. Confirm the real layout on-box; if a config file is required, materialize a minimal
#    one (port/listen/hba trust local) into $DRILL_PGDATA before starting. Then:
sudo -u postgres "$PGBIN/pg_ctl" -D "$DRILL_PGDATA" \
  -o "-p $DRILL_PORT -c archive_mode=off -c archive_command='' -c listen_addresses=localhost" \
  -w -t 1800 start
T1=$(date +%s)
RTO_SEC=$((T1 - T0))
echo "    RTO (restore start → promoted + accepting connections) = ${RTO_SEC}s"

echo "[5/6] Assertions at the recovered point — count + checksum (AC-iii-4a) + named row (AC-iii-4b)"
PSQL=(sudo -u postgres "$PGBIN/psql" -p "$DRILL_PORT" -d market_intelligence -Atc)
echo -n "    recovery replay reached: "; "${PSQL[@]}" "SELECT pg_last_wal_replay_lsn() IS NOT NULL;"

GOT_COUNT="$("${PSQL[@]}" "SELECT count(*) FROM businesses;")"
echo "    businesses count = $GOT_COUNT (expected $EXPECTED_COUNT)"
[[ "$GOT_COUNT" == "$EXPECTED_COUNT" ]] && echo "    COUNT-ASSERT PASS ✓" || { echo "    COUNT-ASSERT FAIL ✗"; SPOT_FAIL=1; }

GOT_CKSUM="$("${PSQL[@]}" "SELECT md5(string_agg(id::text, ',' ORDER BY id)) FROM (SELECT id FROM businesses ORDER BY id LIMIT $CKSUM_ROWS) s;")"
echo "    checksum(first $CKSUM_ROWS ids) = $GOT_CKSUM (expected $EXPECTED_CKSUM)"
[[ "$GOT_CKSUM" == "$EXPECTED_CKSUM" ]] && echo "    CHECKSUM-ASSERT PASS ✓" || { echo "    CHECKSUM-ASSERT FAIL ✗"; SPOT_FAIL=1; }

GOT="$("${PSQL[@]}" "SELECT name FROM businesses WHERE id='$SPOT_ID';")"
echo "    named-row [$SPOT_ID] name = '$GOT' (expected '$SPOT_EXPECT')"
[[ "$GOT" == "$SPOT_EXPECT" ]] && echo "    NAMED-ROW PASS ✓" || { echo "    NAMED-ROW FAIL ✗"; SPOT_FAIL=1; }

echo "[6/6] Tear down the drill cluster (leave prod + repo untouched)"
sudo -u postgres "$PGBIN/pg_ctl" -D "$DRILL_PGDATA" stop -m fast || true
sudo rm -rf "$DRILL_PGDATA"

echo
echo "✓ Restore drill complete. RTO=${RTO_SEC}s. Record RTO in RUNBOOK.md §RTO/RPO."
[[ "${SPOT_FAIL:-0}" == "1" ]] && { echo "✗ spot-check failed — investigate before recording PASS"; exit 1; }
