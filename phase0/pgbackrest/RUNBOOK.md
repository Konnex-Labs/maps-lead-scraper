# WS-iii PITR — pgBackRest Runbook (Phase 0 Safety Spine)

**Owner:** Jack · **Prod DB:** `market_intelligence` on konnex-data (204.168.198.203:5432, PG 16.14)
**Stanza:** `market_intelligence` · **Repo:** `/var/lib/pgbackrest` (same-disk first cut, Matt Q2 2026-07-05)
**Status:** PITR LIVE since 2026-07-05T11:42Z (archive_mode enabled + first full backup taken).

## What is deployed on konnex-data
| Artifact | Path on box | Mirror in repo |
|---|---|---|
| pgBackRest config | `/etc/pgbackrest/pgbackrest.conf` | `phase0/pgbackrest/pgbackrest.conf` |
| PG archive config | `/etc/postgresql/16/main/conf.d/pgbackrest.conf` | `phase0/pgbackrest/postgresql-conf.d-pgbackrest.conf` |
| Backup service (templated) | `/etc/systemd/system/pgbackrest-backup@.service` | `phase0/systemd/pgbackrest-backup@.service` |
| Weekly full timer | `/etc/systemd/system/pgbackrest-backup@full.timer` | `phase0/systemd/pgbackrest-backup@full.timer` |
| Daily diff timer | `/etc/systemd/system/pgbackrest-backup@diff.timer` | `phase0/systemd/pgbackrest-backup@diff.timer` |

Legacy `/etc/pgbackrest.conf` (PG13 template) is INERT — the dir-config takes precedence.

## Retention
`repo1-retention-full=2` (2 full backup sets) + `repo1-retention-diff=4`. Expire runs automatically after each backup.

## Schedule (systemd timers)
- **Full:** Sunday 02:00 (`pgbackrest-backup@full.timer`)
- **Diff:** daily 02:30 (`pgbackrest-backup@diff.timer`)
Both `Persistent=true` (catch-up if box was down) + 5-min randomized delay.

## Common operations (run as `postgres` on konnex-data)
```bash
# Health / inventory
sudo -u postgres pgbackrest --stanza=market_intelligence info
sudo -u postgres pgbackrest --stanza=market_intelligence check

# Manual backups
sudo -u postgres pgbackrest --stanza=market_intelligence --type=full backup
sudo -u postgres pgbackrest --stanza=market_intelligence --type=diff backup

# Archiving health
sudo -u postgres psql -c "SELECT archived_count, failed_count, last_archived_wal, last_archived_time FROM pg_stat_archiver;"

# Timer status
systemctl list-timers 'pgbackrest-*'
```

## RTO / RPO / authorization
- **RPO (data-loss window):** WAL archiving is continuous, so under write load RPO ≈ seconds–minutes
  (bounded by WAL segment fill + `pgbackrest archive-push`). The scheduled full/diff backups are the
  **floor** of recoverability, not the ceiling — PITR can target any point covered by archived WAL.
  ⚠️ On an **idle** DB a WAL segment may not switch for a while, widening the effective RPO; set
  `archive_timeout` (e.g. 60s) for a hard RPO ceiling — tracked as a Phase 0.x tune.
- **RTO (time-to-recover):** **MEASURED = 57–59s** (AC-iii-4 drill, 2 consecutive runs, 2026-07-05T12:34–12:36Z):
  restore of the 5.9GB repo → 26GB cluster (~57s) + WAL replay to target + promote, on konnex-data
  (/dev/sda1, 523G free). This is the recover-to-a-new-cluster time; recovering *in place* over a live
  outage would add teardown/cutover. Restore of the base is the dominant term; WAL replay to a recent
  target is sub-second here (idle DB, short WAL span).
- **Authorization:** any prod-touching restore/PITR is authorized by **Matt** only (spec §7). The
  AC-iii-4 drill (Option A) runs an **isolated throwaway cluster ON konnex-data** (separate pg1-path
  `/var/lib/postgresql/16/drill`, port 5433, `archive_mode=off`, torn down after) — it never touches
  the prod cluster/data, but because it runs on the prod box it took an explicit Matt GO
  (`e2f1616f4387fd8e`, 2026-07-05T12:27Z). A cross-box variant (Option B, konnex-ops as repo client
  over SSH) is a Phase 0.x fast-follow, deferred (adds an SSH-trust surface on the prod box).

## Restore / PITR (⚠️ destructive to the TARGET cluster — Matt-authorized only; never run against prod without an explicit Matt GO)
pgBackRest restore overwrites the target `pg1-path`. The re-runnable **restore drill**
(`phase0/pgbackrest/restore-drill.sh`, AC-iii-4) exercises this into an **isolated cluster on
konnex-data** — never the prod `pg1-path`. It restores to a target time, materializes a minimal
Debian config into the restored data dir (recovery-critical `max_*` params read from the restored
control file), starts on port 5433 with archiving off, asserts count + bounded checksum + a named
row at the target point, measures RTO, and tears the cluster down. Point-in-time example:
```bash
# Isolated drill target on konnex-data (NEVER prod's /var/lib/postgresql/16/main):
pgbackrest --stanza=market_intelligence --pg1-path=/var/lib/postgresql/16/drill --type=time \
  --target="2026-07-05 11:50:00+00" --target-action=promote restore
```
Then start PG on port 5433 and spot-check named rows to confirm recovery landed at the intended point.
Run the full drill with precomputed `EXPECTED_COUNT`, `EXPECTED_CKSUM`, `SPOT_ID`, `SPOT_EXPECT`, `TARGET_TIME`.

## DR follow-up (Phase 0.x)
Repo is currently same-disk with prod (`/var/lib/pgbackrest` on `/dev/sda1`). A disk loss takes prod AND the
repo. **Off-box / off-host repo is the prioritized Phase 0.x fast-follow** (Matt Q2 note).
