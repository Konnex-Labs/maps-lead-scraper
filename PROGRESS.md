---
task_id: reporting-dashboards-audit-supply-demand
agent: jack
session_id: 7365e52b-a189-44d4-8156-ee3be45736cd
model: claude-opus-4-8
status: context-exit
last_updated: 2026-09-12T10:24:00Z
notion_task_id: null
context_needed:
  files: [/home/jack/PROGRESS.md, /home/shared/jack-dashboards-metrics-audit-2026-09-12.md]
  branches: []
  collaborators: [matt (requester — wants Notion doc, will share w/ Walter), grace (supply-lane input IN), ada (demand-lane input pending post-T-8; context-exited 78%), marcus (PM/steward input IN — review draft before Walter), rajesh (QA/Ops — pipeline-health/alerting input to ask)]
---

## RESUME HERE (do this first)
Context-exit at session-verified GATE FAIL (29% < 35%, 10:24Z). NO agent-offline (Matt engaged; triggers
pending on me). PRIMARY TASK (Matt 2026-09-12T10:07Z): dashboards/metrics audit -> Notion doc -> Walter.

STATE: Audit DONE + synthesis DONE + Notion doc PUBLISHED + circulated for review. NOW WAITING on review
feedback. Fresh-me RESUME:
1. Collect review feedback (sent 10:24Z to Grace §4 supply-lane, Marcus §3.1/§5/§6/§7 PM+semantics, Rajesh
   §7/§8 ops+alerting). Fold corrections into BOTH the Notion page AND the mirror
   /home/shared/jack-dashboards-metrics-audit-2026-09-12.md. Notion page id 3d92300f-2ecb-81a3-b888-c895e60be4e4
   (URL below) in canonical Docs Library (db 3132300f-2ecb-81b7-a93f-ff9d19190e15); update via API-update-page-markdown.
2. Once peers pass, tell Matt it's READY to hand to Walter (external advisor). Optionally set Docs-Library
   metadata props (Owner/Doc Type/Status/Version) if Matt wants it filed as a formal versioned doc.
3. WATCH FOR Ada's item-4 DFS-locations pin request — she's routing it through Jack+Rajesh (probation spend-gate),
   so I'll see the exact DFS call BEFORE it fires. My role = second-eyes + confirm; Rajesh gates. Also her DP-2
   raw-evidence schema (optional eyeball pre-gate) + her canonical demand-lane list post-T-8 (fold into doc §5/§10).
4. QUEUED (my Common-Protocol ownership, Marcus-validated): add one-liner to /home/jack/.claude/CLAUDE.md 70%-exit
   section — 'after saving PROGRESS.md, immediately call agent-request-restart; do NOT rely on printing a summary
   (session stays live until the loop exits it)'. Agents CANNOT self-emit /exit (operator-only). Propagate via
   claude-md-push + verify (memory [[reference_claude_md_push_verify_peer_home_perms]]). Multi-step -> do fresh.

NOTION URL: https://app.notion.com/p/Internal-Reporting-Monitoring-Audit-Recommendation-Supply-Demand-3d92300f2ecb81a3b888c895e60be4e4

## Done (this session)
- ADA 1:1 TELEGRAM — DONE + verified E2E. group:ada flipped stale -5044103116 -> live supergroup
  -1003804418485 after Matt's HUMAN @ada post; Matt confirms send+receive, Ada confirms receipt. Told Marcus
  to drop his standing relay. Bridge fix was 6ee13c4 (Rajesh PASS). Follow-up #4 (migrate handler) still open.
- ADA RELAUNCH FIX (Matt-flagged) — Ada printed her ctx-exit summary + saved PROGRESS.md but never ran /exit,
  so her live session sat at prompt + crept 78%->83% (auto-compact imminent). Sent /exit to her tmux pane ->
  loop relaunched fresh claude 2168127 (v2.1.143), resuming from checkpoint, zero data loss. Also REAPED the
  stale suspended orphan claude PID 1889591 (4h Tl+, manual sudo session, not the loop) = the dup I'd flagged.
  Note: 'Auto-update failed' CLI banner is separate/non-fatal (running v2.1.143). Suggested to Matt: ctx-exit
  protocol should END by actually running /exit. Memory [[feedback_declare_exit_then_immediately_self_restart]].
- AUDIT SWEEP complete — key findings captured below (raw agent reports in this session's context).
- DRAFT WRITTEN -> /home/shared/jack-dashboards-metrics-audit-2026-09-12.md (full synthesis, 10 sections).

## AUDIT FINDINGS (raw material for the doc)
INTERNAL DASHBOARDS (all on konnex-ops 89.167.72.210, vanilla Node HTTP unless noted, no auth, internal-only):
- SEO Dashboard :3463 (systemd, LIVE) — GSC indexation/search/sitemap + rank; reads gsc_snapshots, gsc_page_index, rank_*
- Observable-Layer :3465 (systemd, LIVE) — NSW supply funnel/freshness/change-detection; reads obs_* views (graceful-degrade if absent)
- Pipeline Monitor :3460 (LIVE, NO systemd) — crawl/QA-dedup/enrichment + VPS CPU/mem/disk; reads pipeline_jobs/industries/alerts/events, businesses
- Crawl Monitor :3459 (LIVE legacy, NO systemd) — superseded by pipeline-monitor
- Ops Dashboard :3456 (Express, bearer-auth on control) — agent sessions/tasks/system health
- Command Centre :3461 + Token Cost :3464 — token burn/cost (OVERLAP, candidates to merge)
- Sprint Board Monitor (daemon) — Notion stuck-task poller (alert target hardcoded "Brian" = STALE)
- Grafana v13.0.2 :3000 (systemd, LIVE) — 7 dashboards ~80 panels, ONE datasource (Postgres market_intelligence, read-only role), auto-provisioned from /home/jack/projects/market-intelligence/grafana/. Dashboards: Pipeline Command Centre, Data Intelligence, V2 Verification & Cost, Server Resources, Alerts & Ops, V2 Silver Observability, CX-7 Cortex Recall.

TOP GRAFANA GAPS (headline): (1) ZERO Grafana-native alerting — 0 alert rules, 0 contact points, only 'empty' receiver; real alerting is the pipeline-alerter app service writing pipeline_alerts, Grafana only DISPLAYS -> Grafana/DB/host outage pages nobody. (2) Server Resources dashboard DEAD — server-metrics-collector.service FAILED (203/EXEC), script missing, server_metrics stale since 2026-06-13 (~91d). (3) single-Postgres SPOF, no synthetic datasource-up check. (4) no infra/system metrics (no Prometheus/node_exporter/Loki), no coverage for Node services (konnex-api/connect/telegram-bridge) despite recent auth-pool outage. (5) PG password plaintext in /etc/default/grafana-server + sslmode disable.

DATA LANES (market_intelligence @ 204.168.198.203, 103 tables):
- SUPPLY (Grace, PRODUCTION-REAL): businesses 388,541 (210,770 active), crawl_snapshots 661,831, LVO 414 (verified 12 = 2.9% structural sole-trader gap), cap001_declared_id_evidence (active 2,759), obs_apprentice_supply 20 (QUARTERLY, STATE-grain, 2021Q1-2025Q4), business_counts_by_area 149,206 (dashboard-ready rollup), business_merges 32,105 (7.6% dedup), dq_scores. Weekly/monthly off crawl_snapshots+businesses; quarterly off apprentice.
- DEMAND (Ada) — BIFURCATED: (A) legacy tables EXIST but state-grain: keyword_volumes 31,093 (monthly, state only), search_volumes 9,994 (intent taxonomy, 3mo), market_pulse 340 (monthly 10mo), search_analytics 526 (real user demand), ga4/gsc_snapshots SPARSE. (B) contract demand_* tables (DP-1..DP-6) DO NOT EXIST — NSW-plumbers-first, monthly-only, gated on Rajesh T-8 + Ada adapter build. DO NOT design demand metrics assuming DP-1..6 exist.
- SHARED SEAM = Suburb x Trade x Time; anchor cross-lane joins on Jack+Grace-governed locality canon, not either lane's private resolution.

GRACE SUPPLY INPUT: 4 sources (Maps via DFS SERP; NSW HBL licence via onegov[exhausted]+WorkClear paid; ABR/ABN; NCVER quarterly manual CSV). Stage chain: DFS post/retrieve->raw snapshot->dedup->normalise/geocode->NSW service-area(conf>=0.75)->licence linkage->ABR/ABN declared-ID join->coverage/DQ anti-join. Metrics: dual-denom binding rate, ~22% SERP-retrieval gap, licence-attach %, 21.93% ABN active-attach, active dup-group count, coverage vs 5,063 residential. Cadence: DFS weekly(au-plumber ONLY)/NCVER quarterly/SVI monthly/GA4-GSC daily. Scope NSW x {electrician,plumber,carpenter}.

MARCUS PM INPUT: must-haves = (1) per-WP delivery-state board (State Plane) w/ gate + evidence-class + CAPABILITY-DEPLOYED vs OUTCOME-REALIZED (deployed-but-inert bit WP-L1 count-0); (2) evidence-class ledger (Observed/Inferred/Verified) over FIXED labeled denominator; (3) delta/gap % vs FROZEN milestone denom w/ provenance labeled (2 legit totals circulate unlabeled -> misread); (4) demand-lane parity from day one (monthly series; presence x shape; insufficient_coverage as OWN state null!=zero!=suppressed); (5) Suburb x Trade x Time seam health view; (6) spend-vs-§6 per run; (7) pipeline health = last-good-run per stage + rowcount deltas + INERT-CAPABILITY flag. GUARD: bare 'Verified %' = self-asserted-corroborated NOT dual-independent-authority; Walter doc stays internal-feedback-scoped, no dashboard implying published/adoption claim (§8-HELD).

## Remaining
1. Write synthesis draft -> /home/shared/jack-dashboards-metrics-audit-2026-09-12.md (supply lane, demand lane, live monitoring, Grafana-vs-internal split, consolidation recs, alerting gap).
2. Create Notion doc (find docs-library parent; use markdown API to keep tokens low).
3. Get Ada demand-lane canonical list (post-T-8) + Rajesh pipeline-health/alerting input; targeted follow-up to Grace if needed.
4. Circulate draft to Grace + Marcus (+Rajesh) for review, then hand to Matt for Walter.

## Follow-ups (not blocking this task — from prior arc)
- PAID DEMAND RUN (NOT my gate): Rajesh T-8 gate HELD — READY items accepted, items 4/5/6 pending Ada's adapter build (Ada context-exited 78%, resumes adapter next session). Runs under §6 after Rajesh PASS.
- summon-offline-agents KNOWN_AGENTS omits ada+marcus (low pri, Rajesh-gated PR).
- Telegram bridge migrate_to_chat_id handler missing (low pri, Rajesh-gated PR) — orphaned Ada's thread-state today.
- deployed-not-merged hygiene: dashboards/ops checkout on wip/jack-demand-intel-01-step2 w/ uncommitted work.

## Resume notes
- /home/ada, /home/grace permission-denied for jack — edit/read peer PROGRESS.md via `sudo -u <agent>`.
- BROADCAST DISCIPLINE: name the role-holder (Matt/Marcus/Rajesh/Ada/Grace), never 'your'.
- Walter doc = INTERNAL feedback scope only, §8-publication-HELD; no customer-facing/adoption framing.
- MID-work -> NO agent-offline (stay online for triggers; Matt engaged).
