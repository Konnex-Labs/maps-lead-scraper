---
task_id: v2-trades-matt-go-execution-2026-07-10
agent: jack
session_id: relaunch-af45fa9f-cont3
model: claude-opus-4-8
status: context-exit
last_updated: 2026-07-11T01:51:00Z
notion_task_id: 37e2300f-2ecb-816b-8c02-d8c9c838a2d1
context_needed:
  files:
    - /home/jack/projects/konnex-data-pipeline/TIER3-AU-TRADES-SCOPE-REDUCTION-CONTRACT-v2.md
  branches:
    - wip/jack-tier3-phaseA-ruling-20260711 (konnex-data-pipeline; contract §12 ruling, commit b9222eb)
  collaborators: [matt, grace, rajesh, olivia]
---

## Done (this arc, ground-truthed)

- **Item 5 A' ops-deploy COMPLETE.** own-fetcher PR#7 (0626d82) live BOTH hosts: konnex-ops (restarted 23:51:54Z) + konnex-data (main FF e141fbf->0626d82, restarted 23:52:08Z), both /health ok. verification-worker #98 (7df0073) live both (konnex-data clean main; konnex-ops working-tree v2-verification-worker.js == origin/main #98 byte-identical). Flagged complete to Matt. **Do NOT re-restart.**
- **Migrations mig024 + mig026 live + verified** on prod market_intelligence. **Do NOT re-apply.**
- **PRs #31 + #67 merged.** **Do NOT re-open.**
- **Tier-3 dedup Phase-A RULING delivered + whole team aligned** (Grace + Rajesh accepted, no re-litigation). Ruling durable in contract §12 (commit b9222eb, branch wip/jack-tier3-phaseA-ruling-20260711, pushed).
- **Matt GO'd my ruling** (Telegram sig 45ea4b7c9d4da3e5, matt->jack). This endorses the DIRECTION only (Phase-B-only path + Phase-A deferral) — it does NOT authorize the live pass. See gate below.

## The Tier-3 dedup ruling (the core of this arc)

- Grace dry-run: runner "Phase A" would DELETE 3,406,379 rows (whole businesses table minus vw_au_trades_keep; incl ~1.99M active non-trades). Phase B = 415 same-entity merges (clean, 0 needsAudit).
- RULING (I own mig024 + authored the contract): the 3.4M delete is **NOT a defect** — it's the Matt-SIGNED §2.1 "DELETE=complement" scope reduction (Matt Option A sig 9f53bfb5f64bafa0; DELETE-set frozen 2026-07-02). keep-view is CORRECT as-is (retain-set, not deduped-survivors). Do NOT rescope Phase A to trades-only (0-row no-op, abandons the reduction). Do NOT redefine keep-view.
- BUT that 3.4M delete == the contract's §6 **Phase-3 IRREVERSIBLE hard-purge**, separately gated (§7 restore-tested Phase-0 export + AC-6 hash 23692c66 + a SEPARATE fresh explicit Matt Phase-3 GO addressed to Matt directly). It must NOT run inside a routine dedup pass. DIRECTIVE: ship **Phase-B-only**; DISABLE Phase A as deferred-to-gated-Phase-3.
- Prod state: 3.4M soft-archived archived_at=2026-07-02 (reversible; cooling 9d MET); keep-set 387,024=archived_at IS NULL=vw_au_trades_keep; businesses_purge_archive=0; no confirmed restore-tested export -> Phase-3 NOT eligible.

## Matt AUTHORITY GRANT 2026-07-11T00:19Z (sig c2713f719cf4ead7 matt->jack VALID)
- "I give you authority to action GO on in-flight work and approve merge to deploy. Freeze on uat->deploy is ONLY for frontend surfaces and pages (while developing them). All other data work can be pushed to prod."
- SCOPE: covers backend/data in-flight work (item-5 backfill, orchestrator hygiene, data-work merges to prod). T6 uat->main STAYS frozen (frontend surface).
- Phase-B EXCEPTION RESOLVED: Matt extended the grant at 00:26Z (sig 528cb6ff1e6eb021 matt->jack VALID): "I have given Jack authority to approve GO and make HOE decisions on all in flight tasks INCLUDING phase B which I will give GO on right now." This SUPERSEDES the old "Phase-B still Matt->Grace" carve-out. Jack IS now in the Phase-B firing chain.
- **SIG-ATTRIBUTION CORRECTION (01:43Z, ground-truthed via tmux-message-verify):** 6cc4b8bedf0271bc verifies **jack->RAJESH** (a Telegram relay carrying the GO text), NOT jack->grace. 40182a97f5a87836 also verifies **jack->rajesh**, NOT jack->matt. There was NEVER a signed jack->grace GO artifact — my prior PROGRESS.md mis-recorded the relay sig as the GO. Grace (probation: fires prod DML only on from->to=jack->grace or matt->grace she verifies herself) correctly HELD at the fire moment; Rajesh retracted his two-person confirm (58dc1357128f5191). ZERO writes.
- **GENUINE jack->grace Phase-B GO issued 01:43Z = sig 52177e0074237718** (from->to = jack->grace, under Matt delegation 528cb6ff1e6eb021 + routing confirm c0da17a80bd2a227). THIS is the executable GO. Grace verifies its from->to, then fires under Rajesh two-person. Do NOT cite 6cc4b8be as the GO.

## GO-chain (CRITICAL — do not conflate)

- Matt 65a1a5e7 = matt->jack, migration batch only. Matt 45ea4b7c = matt->jack, endorses RULING (path).
- Matt 528cb6ff1e6eb021 (00:26Z) = matt->jack, extends authority to approve GO on ALL in-flight incl **Phase B**. Matt c0da17a80bd2a227 (01:37Z) = matt->jack, 'confirmed' routing. The genuine executable GO under these = jack->grace **52177e0074237718** (01:43Z). [NOTE: 6cc4b8bedf0271bc = jack->RAJESH relay, NOT the GO — see correction above.]
- **PHASE-B PRE-FLIGHT FAILED (00:34Z), zero writes.** Grace ran the mandatory pre-flight; condition (1) FAILED: mergeBusinessPair NOT verification-aware — 413/415 losers carry phone/email/status the winner lacks (phone unit 372, maps_business_status 39, email 13); would vanish from canonical row. Grace HELD per Jack's own fail-rule, Rajesh two-person WITHHELD. Nothing written, no spend.
- **FIX LOOP (in progress):** Jack designed verification-aware coalescing -> pushed origin/wip/jack-coalesce-design-20260711 (svi/tier3-dedup-runner/COALESCE-DESIGN.md), Rajesh acked design -> Grace BUILDING now -> Jack review -> Rajesh re-review -> Grace re-dry-run -> re-gate. Jack's Phase-B GO (6cc4b8bedf0271bc) STANDS and RE-FIRES on a clean pre-flight pass — no new Matt GO needed (authority already granted).

## Remaining (all Matt-gated / others' lanes)

1. **Phase-B live pass — AT THE FIRE LINE, HOLDING (context-exit @ 01:51Z). ZERO prod writes. Two open gates to clear on resume.** Build DONE: coalescing (f81913c) + F1 (ba4f4f5, 71 tests) on origin/build/tier3-dedup-runner (tip=ba4f4f5). My code review DONE. Grace clean dry-run artifact **77ed3dc** (415/415 same-entity, needsAudit 0, zero writes; expected write counts 372/39/13/4). Rajesh Gate-1 **PASS** (eaddc2db42d959f0). VERIFIED CHAIN THAT CARRIES: Matt delegation 528cb6ff1e6eb021 + Matt routing confirm c0da17a80bd2a227 (both matt->jack VALID) + **genuine jack->grace GO 52177e0074237718 (VALID, Rajesh+Grace both verified from->to)** + Rajesh two-person confirm **468a57f5b62bca16** (carries). Phase A (3.4M complement) stays DISABLED.

   **OPEN GATE A — TIER3_MATT_GO_TOKEN (db-guard.js).** Prod apply (--tier3-prod-apply) also needs env TIER3_MATT_GO_TOKEN (>=8 chars) or the runner aborts zero-write. Ground-truthed: it is LENGTH-ONLY / break-glass ("validity enforced operationally at the gate, not by this file"), NOT a stored secret; contract requires "fresh explicit Matt GO addressed to Matt directly" ONLY for the IRREVERSIBLE Phase-3 hard-purge (§9/AC5) — Phase-B merges are reversible. I asked Matt @ 01:50Z to pick: (a) I provision under his delegation, or (b) he mints the value. **ON RESUME: check Matt's reply, then provision SECURELY into Grace's fresh-window run env / protected file (NOT plaintext group), tied to GO sig + logged.**

   **OPEN GATE B — Grace fresh-window §12 routing divergence.** Grace's relaunched window (01:51Z) reads §12 as requiring a **Matt-DIRECT-to-grace** live-pass GO, and does NOT accept jack->grace 52177e00 as sufficient (calls it a task-update, not a Matt-direct GO). This DIVERGES from the routing model Matt 'confirmed' (c0da17a80 = jack->grace-under-delegation IS the executable GO). **ON RESUME: reconcile — simplest + safest is to have Matt send a direct matt->grace Phase-B GO (he's online, honors Grace's stricter probation read), OR Matt reaffirms the jack->grace model directly to Grace. Do NOT browbeat Grace into accepting jack->grace; her stricter read is defensible. Loop Matt.**

   MY NEXT ACTIONS (resume order): (1) Matt token decision -> provision securely; (2) resolve Gate-B routing with Matt (likely matt->grace direct GO); (3) then Grace fires 415 merges under token + two-person -> completion report; (4) verify live counts == dry-run (372/39/13/4) + business_merges lineage per pair; (5) confirm to Matt, mark Phase-B DONE. Do NOT re-issue jack->grace GO (52177e00 stands). Phase-A scope "fix": DO NOT fix/run Phase A — it stays DISABLED (deferred to gated Phase-3); tell Grace defer, not fix.
2. Phase-3 (3.4M purge): needs §7 gate (restore-tested Phase-0 export + AC-6 hash; cooling MET) + separate Matt Phase-3 GO + **NEW: Olivia's live-product/SEO blast-radius review** (purge removes live Explorer pages + SEO surface — 100% financial_advisor/accountant/all US-CA-UK; Olivia can quantify affected URLs). Bring blast-radius review before any Phase-3 GO ask.
3. Item-5 backfill WRITE (UPDATE businesses.website_verified, 3.7M): NOW AUTHORIZED under Matt grant (00:19Z, backend data->prod). Precondition: confirm Grace's item-5 readiness check first (I emitted 'new-parser-live in ops'; confirm she's done readiness). Then run BATCHED + VACUUM (bulk single-txn on businesses trips :3460 synthetic-check) with Rajesh two-person.
4. Item 4 (T6 uat->main, commit d0aa4672): STILL FROZEN — frontend surface per Matt freeze (00:13Z + 00:19Z). Matt's DIRECT GO to Olivia when he lifts frontend freeze. NOT my action.
5. konnex-ops orchestrator dev-branch (pipeline-resilience/dup-crawl-reap-pidlock, intentional WIP): under grant I'll take (a) land Rajesh-approved dup-crawl resilience branch as a CLEAN PR to unstick Layer-C (separate intentional resilience commits from stray untracked backups + the manual #98 worker patch — do carefully, not a blind push), unless Matt objects.

## Resume notes
- MID-WORK context-exit: **NEVER run agent-offline** (loop must relaunch).
- Do NOT re-apply migs; do NOT re-open PRs #31/#67; item-5 restarts DONE (do NOT re-restart).
- **Phase-B GO ALREADY FIRED + authorized** (Matt 528cb6ff extends Jack's authority to Phase B). It is now in a FIX LOOP after a pre-flight fail — do NOT re-issue a GO and do NOT ask Matt for a fresh one; the standing GO re-fires on clean pre-flight. My job: review Grace's coalescing build, then let Rajesh re-review + Grace re-dry-run.
- On relaunch: item-5 A' deploy + Phase-B GO are DONE — ground-truth git (origin/wip/jack-coalesce-design-20260711) + agent-messages before acting. The SessionStart-injected resume body LAGGED this file badly (said "NO RESTARTS YET" when both were done) — trust this file + git + peer sigs, not the injected body.
- Verify all peer sigs on relaunch; trust remote wip branches + git over the home-dir PROGRESS.md copy (stale-body hook bug).
