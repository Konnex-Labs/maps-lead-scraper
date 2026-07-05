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

## Restore / PITR (⚠️ destructive to the TARGET cluster — never run against prod without an explicit GO)
pgBackRest restore overwrites the target `pg1-path`. The re-runnable **restore drill** (AC-iii-4) exercises
this against the **staging** box, never prod. Point-in-time example:
```bash
# On the RESTORE TARGET (staging), with its own stanza pointing at the target pg1-path:
pgbackrest --stanza=market_intelligence --type=time \
  --target="2026-07-05 11:45:00+00" --target-action=promote restore
```
Then start PG, and spot-check named rows to confirm the recovery landed at the intended point.

## DR follow-up (Phase 0.x)
Repo is currently same-disk with prod (`/var/lib/pgbackrest` on `/dev/sda1`). A disk loss takes prod AND the
repo. **Off-box / off-host repo is the prioritized Phase 0.x fast-follow** (Matt Q2 note).
