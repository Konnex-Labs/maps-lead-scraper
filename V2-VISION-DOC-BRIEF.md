# Konnex Strategy Brief — Matt / ChatGPT Conversation Condensation

Source: `/home/shared/media/1783235720911-matt-to-jack.md` (696KB). Conversation is a ChatGPT
"AI Mode" strategy session between Matt (founder) and the AI (lines 1-223), followed by a
"Chat with Jack" operational dialogue between Matt and Jack/HOE (lines 224-302). Faithful
extraction only. Labels: (Matt:) = Matt's stated position; (AI:) = the AI's suggestion;
(Jack:) = Jack/HOE's position in the ops dialogue.

---

## 1. Product Vision & Positioning

- **Core one-liner (Matt's framing, opening prompt):** Konnex is *"Intelligence infrastructure
  for the local service economy — serving verified, last-mile context back into the tools you
  already use."* Mechanism: raw data source combined with facts + provenance, aggregated and
  updated **weekly** in a **RAG (vector) intelligence layer**, served back via an **LLM trained
  on Konnex's proprietary corpus.**
- Target domain: **the trades and housing market** (Australia). Note the explicit **pivot**:
  Matt states "we have now pivoted to the trades and housing market instead" and says to
  **ignore the earlier focus on real estate and mortgage brokers** (line 181/185).
- (AI:) The value proposition solves the **"last-mile" data problem** for real estate,
  construction, and property management. Positioning shift: from a **search engine** to an
  **"analytical oracle"** — reactive search tool → **proactive advisory engine.**
- (AI:) Market pain points the product addresses:
  - **Data Fragmentation** — local zoning, permit histories, trade availability live in
    separate, outdated government portals.
  - **Information Decay** — building codes, material costs, labor rates change weekly; static
    data is useless.
  - **Tool Fatigue** — professionals don't want another dashboard; they want intelligence
    **injected into their existing CRM, ERP, or bidding software.**
- (AI:) The three-layer packaging overcomes "the churn of static data" — the standard problem
  plaguing basic data companies.

## 2. The Three-Tier Model (Fact / Signals / Pulse)

Matt's own definition (line 51): "Ultimately I want Konnex to provide 3 things." Stacked model
(Pulse on top → Signals → Fact as basal layer):

- **1. THE FACT (Basal Layer — "Core Grounded Data": Zoning, Permits, Codes)**
  - (Matt:) Value = **convenience.** This is public information anyone could get manually, but
    it is fragmented and time-consuming to assemble.
  - (AI:) Core value = convenience, centralization, frictionless speed. Framed as an automated
    "Freedom of Information Act analyst" — e.g. instead of a developer spending three hours
    parsing a 200-page municipal document for a setback rule, Konnex serves it in three seconds.
  - (AI:) The **time tax** to find free info is the real barrier. Grounding heavily in this
    layer builds the initial trust to make Konnex an **everyday utility.**

- **2. INTELLIGENCE SIGNALS (Analytical Layer — Trends, Anomaly Alerts)**
  - (Matt:) Aggregated historical insight, directional trends, anomaly detection.
  - (AI:) Value = predictive visibility, de-risking high-stakes choices. Raw facts →
    metadata patterns. Example flags: *"Permit approval times in Suburb X have slowed by 42%
    over the last 90 days"*; detecting anomalies like an unusual spike in commercial zoning
    applications in a residential border zone.
  - (AI:) High-margin **enterprise** tier — professionals pay premiums to avoid hidden delays
    or catch localized growth spikes before competitors.

- **3. MARKET PULSE (Volatility Layer — Weekly Live +/- Stats, Labor Flux)**
  - (Matt:) Live stats, updated weekly with a "+/-" kind of thing. "Think trades movement."
  - (AI:) Value = immediate operational agility, live cost-tracking. A rolling **weekly
    dashboard** of real-time market friction. Examples: *"Plumbing trade availability: -8% this
    week"*; *"Concrete supply delivery times: +2 days."* Maps the "heartbeat" of the local
    supply chain and subcontractor availability.
  - (AI:) Bids/estimations fail due to weekly price and labor inflation; a local **"+/- index"**
    lets estimators bake accurate volatility margins into contracts.

- **How the tiers relate — the retention/upgrade loop (AI:):**
  1. Users **come for the Fact** (convenience).
  2. They **stay for the Pulse** (weekly retention hook).
  3. They **upgrade for the Signals** (high-margin enterprise value).
  - Captures three distinct business timelines: daily operational convenience (Fact), weekly
    market adjustments (Pulse), monthly strategic planning (Signals).

## 3. Data Sources Discussed

All data-source references are at the **category** level; the conversation names types, not
specific named portals/APIs, on the strategy side. The ops dialogue names concrete pipeline
sources.

- **Assumed-available / core targets (Fact layer):**
  - Local **zoning** codes, setbacks, environmental restrictions.
  - **Permit histories / permit approval times** (electrical permits called out as an example).
  - **Building codes.**
  - **Municipal codes** (county/city government portals).
  - **Trade availability**, regional **labor rates**, **material/lumber costs**, subcontractor
    pricing, material pipeline / supply delivery times.
  - **Warranty data** (referenced in the property-management triaging use case).
- **Concrete sources named in the ops (Jack) dialogue:**
  - **DataForSEO (DFS) Maps API** — the live sourcing path for trades business records.
    Flagged limitation: **DFS does not return suburb**, so historical NULLs must be
    reverse-geocoded (backfill needed regardless of a full sweep). Also coverage-limited by
    **DFS locality resolution.**
  - **Legacy Google-crawl path (v1 crawler)** — built most existing `businesses` rows; flagged
    as **"legacy shit and noise"** to be cleaned up.
  - **Google `business_status`** field (drives active/closed state) and **`google_place_id`**
    (used to re-match/reactivate rows).
- **Explicitly flagged as speculative / execution-risk (AI:):**
  - **Automated web scraping of county/city portals "often breaks"** — needs robust pipelines
    for clean, legally-compliant weekly updates. Public data formats "break constantly" →
    requires **self-healing ingestion.**
  - Public agencies **overwrite or delete past live stats** (this is framed as a moat
    opportunity, but implies the raw source is unreliable/ephemeral).
  - The specific correlation claims (e.g. zoning change → electrical-permit spike 6 months
    later) are presented as **future corpus outputs, not validated facts.**

## 4. Architecture & Technical Ideas

- **RAG / vector layer (Fact):** proprietary corpus served via LLM; must **cite sources
  perfectly** — in housing/construction a wrong answer risks a "million-dollar building
  violation" (hallucination = liability). Provenance/citation is treated as mandatory, not
  optional.
- **Time-series database (Signals/Pulse):** (AI:) pair a **vector DB (text corpus)** with a
  **time-series DB (weekly numbers)**. HOE agent's job is preventing **architectural drift**
  between RAG pipelines (Fact) and time-series aggregations (Signals).
- **Snapshotting / no-overwrite discipline (AI, "immediate action item"):** every weekly Pulse
  pull must be **permanently timestamped and stored** to feed Signals later. "Do not overwrite
  anything." This weekly-archive is the core of the moat (data that no longer exists on public
  portals).
- **Ground-truth QA suite (AI):** automated benchmark — test the RAG engine **daily against 50
  known, hard-to-parse local building codes** to measure hallucination rates. Deterministic
  validation against RAG outputs.
- **Programmatic SEO (AI):** structure the Fact layer into **schema-rich public-facing pages**
  so Konnex becomes the foundational source **other LLMs cite** — capture high-intent Google
  searches organically without ad spend.
- **API integration into existing tools (AI):** serve intelligence back into legacy software —
  **Procore, Salesforce, PropertyMe**, plus generic **CRM / ERP / bidding software**;
  construction enterprise ERPs as a target for direct permit/compliance streaming.
- **Delivery channels — the "How It Works" homepage section (Matt's mockup, refined w/ AI).**
  Move from 4 to **5 pillars** (3-over-2 or 6-slot grid; slot 6 = "Coming Soon"):
  1. **Ask Konnex** — conversational web app (copy: "local zoning codes, setbacks, and trade
     availability").
  2. **Market Pulse SMS / Alerts** — live SMS & WhatsApp broadcasts (weekly text updates on
     local trade volatility, labor capacity shifts, material cost updates). *(Matt flagged this
     alert channel as missing from the mockup, to be added later.)*
  3. **Insights Hub** — macro trends & data ("labor density shifts, subcontractor pricing
     anomalies, material pipeline spikes").
  4. **Developer API** — raw data integration (pitch to construction ERPs for permit/compliance
     streaming).
  5. **MCP Server** — AI-agent connection layer ("keep exactly as is"; a major selling point
     for AI-driven developers).
- **Environment / data-model discipline (Jack, ops dialogue):**
  - Separate **two kinds of prod writes**: (1) **code/schema changes** (migrations, ETL logic)
    must NEVER first-run against prod → use staging/dev DB; (2) **data ingestion** (pipeline
    writing scraped records into `businesses`) IS the product's core function — a
    write-to-UAT-then-sync model for every crawl doubles storage/compute and adds a reconcile
    layer that becomes its own bug source; wrong shape for a data-ingestion product.
  - Real risk hit was an **irreversible backfill mutating existing rows**; mitigation = a
    **safety envelope** (dry-run + pre-image/reversibility + batched writes), lighter and
    higher-leverage than a full duplicate environment.
  - **NOW (Tier 2):** stand up a **staging DB mirroring prod schema** with sampled/subset data
    (NOT a full 3.7M-row clone); formalize the prod-write safety envelope (dry-run default,
    collision pre-check, pre-image capture, batched writes + VACUUM); enable **PITR / automated
    snapshots** on prod (recoverability as north star).
  - **MEDIUM:** fold into the in-flight CI/CD overhaul (Phase 4/5) — CI runs ETL integration
    tests against an ephemeral containerized Postgres + a **staging deploy gate** before prod.
  - **NOT yet:** full duplicate prod DB w/ write-to-UAT-then-sync for pipeline data (real $ on
    3.7M+ rows, unneeded pre-revenue). Revisit at paying-customer / real-blast-radius stage.
- **`is_active` data model (Jack):** `is_active` = "last seen in a crawl AND not marked closed"
  (not a freshness %). DFS path: `is_active=true` unless Google returns
  `business_status=CLOSED_PERMANENTLY`; reactivates rows on re-sight, does NOT deactivate rows
  it fails to find. Legacy Google-crawl path: deactivated any business not re-sighted in a
  cycle (`is_active=false` + `closed_at` stamped). Full re-sight auto-reactivates by
  `google_place_id`.

## 5. Use Cases / Target Customers

- **Segments named:** contractors / solo contractors, enterprise home builders, developers,
  large property managers, estimators/bidders, suppliers, construction enterprise ERPs,
  proptech platforms, AI-driven developers (via MCP). (AI asked Matt to pick a **primary target
  audience** — enterprise home builders vs solo contractors vs proptech platforms — Matt did
  not lock one in this transcript.)
- **Card-copy audience (Matt's pivot):** "builders, estimators, and suppliers."
- **Use cases (AI:):**
  - **Hyper-Local Bidding** — contractors query localized material costs, historical permit
    approval times, regional labor rates to build accurate, competitive bids.
  - **Automated Zoning Compliance** — developers upload a land plot; RAG checks it against
    latest local municipal codes, setbacks, environmental restrictions instantly.
  - **Property Management Triaging** — large property managers cross-reference incoming
    maintenance requests with real-time local trade availability, historical pricing, warranty
    data to automate dispatching.

## 6. Business Model / Monetization

- **Tiering maps to the three layers (AI:):** Fact = free/low-cost convenience utility
  (adoption hook); Pulse = weekly retention hook; **Signals = high-margin enterprise premium**
  ("professionals will pay high enterprise premiums").
- **MCP positioning question (open):** AI asked whether MCP is pitched to non-technical
  construction enterprises or **strictly reserved for a high-end developer tier** — Matt did not
  answer in-transcript.
- **Programmatic SEO** as a zero-ad-spend organic acquisition channel (see Architecture).
- No explicit pricing numbers were stated for the product tiers.

## 7. Risks, Constraints, Open Questions

- **Data sourcing / provenance (AI):** automated portal scraping breaks; pipelines must be
  clean and **legally compliant.**
- **API integration friction (AI):** building/maintaining stable secure APIs for legacy
  software (Procore, Salesforce, PropertyMe) is ongoing cost.
- **Hallucination liability (AI):** wrong answer → building violation / structural mistake;
  perfect source citation is mandatory. QA (the Senior QA agent) is "the absolute critical line
  of defense."
- **Legacy-data noise (Matt/Jack):** v1 crawler left "legacy shit and noise"; ~50% of trade
  rows show inactive — Jack determined this is a **re-crawl COVERAGE artifact, not real
  closures** (100% of inactive rows are old Google-crawl records, last_seen 15-28 April,
  deactivated mid-May by a legacy sweep, with BLANK Google `business_status`). Partial DFS NSW
  re-post only re-sighted ~half.
- **Spend gate / coverage limits:** full NSW+3 ingest is spend-gated (~USD 100-150, epic
  38a2300f) and coverage-limited by DFS locality resolution. A small residual of inactive rows
  are intentional dedup / cross-industry-pollution soft-deletes (e.g. plumber ~1.7k) that
  should stay off.
- **Irreplaceable-signal risk (Jack):** a blind TRUNCATE would lose the **review-velocity t0
  baseline (Apr-May)** + `crawl_snapshots` history = the **tradie work-spike signal that IS the
  differentiation**; re-crawling cannot recover past velocity.
- **Open questions the AI posed (unanswered by Matt in-transcript):** which of the 3 layers is
  the primary early-adoption hook; which trade/property data type to test first; the specific DB
  architecture being spun up; how MCP is positioned/tiered; primary target audience;
  geographic market.

## 8. Concrete Decisions / Strong Positions Matt Stated

- **Business name is Konnex.** The three-tier product (Fact / Signals / Pulse) is Matt's own
  articulated framework (line 51), not the AI's — Matt: *"Ultimately I want Konnex to provide 3
  things."*
- **Pivot locked:** *"we have now pivoted to the trades and housing market instead"* — ignore
  earlier real-estate / mortgage-broker framing.
- **Team is 6 Claude Code agents** (Matt): core engineering of 3 — Head of Engineering, Senior
  Data Engineer, Senior QA Engineer — plus Lead Front End Dev, Discoverability (SEO & AI
  Citations), and Head of Growth & Strategy. Matt: *"I am already building this right now."*
- **Moat thesis (Matt's hypothesis, AI-endorsed):** a **12-month run rate on ingested data**
  plus a maturing proprietary corpus = a defensible moat (time-lag barrier + context moat +
  high cost-to-copy; weekly snapshots preserve data public portals overwrite).
- **Delivery via 5 channels** with SMS/chat alerts to be added (Matt's mockup direction).
- **First ingestion pilot = NSW + 3 trades** (carpenter, electrician, plumber). Current AU
  totals: carpenter 48,733 (24.3k active), electrician 63,366 (45.8k active), plumber 33,693
  (22.0k active). Matt raised **wiping the whole market_intelligence table** to start fresh;
  Jack's position: **broadly FOR a clean slate, but NOT a blind wipe** — a full TRUNCATE is
  Tier-3 destructive (needs full backup + written plan + Matt's gated GO). Recommended clean-cut
  sequence: (a) build foundations, (b) full export/backup, (c) preserve velocity baselines +
  verified/licence data, (d) truncate legacy noise, (e) re-run full NSW+3 through the new
  disciplined flow as the clean pilot (supersedes the 07-02 piecemeal AU-trades-only delete).
- **Enterprise-grade discipline endorsed by Matt** (raised the UAT/DEV-vs-prod question); Jack's
  net: enterprise-grade **safety** (backups + reversibility + staged schema/code) **without** an
  enterprise-grade duplicate-environment bill.
- **Backfill still required** even after a full sweep because **DFS doesn't return suburb** →
  historical NULLs must be reverse-geocoded.
- **Path to "100% active" (Jack):** the honest target is 100% of *still-operating* businesses
  active (genuine closures stay inactive — that's a product signal). Lever = coverage; a full
  NSW+3 re-crawl auto-reactivates still-operating rows by `google_place_id`. *"only 50% active"*
  is mostly stale-crawl bookkeeping from May, not 50% of tradies shut.
