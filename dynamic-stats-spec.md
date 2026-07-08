# Dynamic Stats Hydration — Explorer SEO Pages

**Owner**: Carlos (SEO pages) + Olivia (app.js if needed)
**Reviewer**: Rajesh
**Approved by**: Matt (2026-05-05)
**Tier**: 2

## Problem

16,257 static Explorer HTML pages have business counts, ratings, and FAQ answers baked in at build time. When data changes (purges, new crawls, enrichment), these numbers go stale until a full page regeneration + Vercel redeploy. This breaks trust — Matt spotted "6,598 conveyancers in NSW" after a purge brought the real count to 1,155.

## Goal

All numeric stats on Explorer SEO pages must update dynamically from the API without requiring a rebuild. Data changes should propagate site-wide within 15 minutes (matview refresh cycle).

## Scope — What Needs Dynamic Hydration

### 1. Hero Stats Bar (3-4 numbers at top of every page)
- Total businesses count
- Average rating
- Total reviews
- Contact coverage %

**Current**: Baked in `<span class="stat-value">6,802</span>`
**Already dynamic**: YES — app.js already overwrites these from API (lines 482-521)
**Action needed**: None

### 2. Related Businesses Section (Type B cards)
- Count per related industry at current geo level (state/city/suburb)

**Current**: Baked in `<span class="ri-count">6,598 businesses in New South Wales</span>`
**Source API**: `GET /api/v1/industries/:industry/related?country_code=AU&state=NSW`
**Action needed**: Client-side fetch + DOM update on page load

### 3. FAQ Answers (4 questions per page)
- "How many X in Y?" — total count + area count + top areas
- "Average rating?" — rating + review count
- "Which suburb has the most?" — top suburb + count
- "How does Y compare nationally?" — state vs national comparison

**Current**: Baked in `<p class="faq-answer">There are 6,802 solicitors...</p>`
**Source API**: `GET /api/explorer/faq-data/:country/:industry?level=state&state=NSW`
**Action needed**: Client-side fetch + DOM update, OR regenerate FAQ from the same API data already fetched for hero stats

### 4. Comparison Stats
- Parent comparison values (national avg when viewing state, state avg when viewing city)

**Current**: Baked in `<span class="comparison-value">4.6</span>`
**Source API**: Already in aggregates response (`parent_comparison` object)
**Action needed**: Client-side update from existing API response

### 5. JSON-LD Structured Data
- FAQ schema has baked counts in `acceptedAnswer` text
- ItemList schema has baked counts

**Current**: Baked in `<script type="application/ld+json">`
**Action needed**: Update JSON-LD script tags dynamically after hydration

## Page Levels Affected

| Level | Page Count | Example URL |
|-------|-----------|-------------|
| National | ~30 | /au/explorer/solicitors-lawyers |
| State | ~238 | /au/explorer/solicitors-lawyers/new-south-wales |
| City | ~10,762 | /au/explorer/solicitors-lawyers/new-south-wales/parramatta |
| Suburb | ~5,227 | /au/explorer/solicitors-lawyers/new-south-wales/parramatta/harris-park |
| US equiv | TBD | /us/explorer/... |

## Implementation Approach

### A. Hydration Script (new: `explorer/components/stats-hydrator.js`)

Single script that runs on DOMContentLoaded:

1. **Parse page context** from existing data attributes or URL path:
   - country, industry slug, state, city, suburb

2. **Fetch aggregates** (already happens in app.js — reuse the response):
   - The main `fetchExplorerAPI()` call already returns `summary`, `parent_comparison`, `cities`

3. **Update DOM elements** by class name:
   - `.stat-value` — already handled by app.js
   - `.ri-count` — NEW: update related industry counts
   - `.faq-answer` — NEW: rebuild FAQ text from API data
   - `.comparison-value` — NEW: update from `parent_comparison`

4. **Fetch related industries** (separate call):
   - `GET /api/v1/industries/:industry/related?country_code=AU&state=NSW`
   - Update `.ri-count` spans with fresh counts

5. **Update JSON-LD** (optional, low priority):
   - Find `<script type="application/ld+json">` tags
   - Parse, update counts, re-serialize

### B. Static HTML Changes (Carlos — page generators)

The baked numbers serve as **SSR fallback / initial render** for:
- SEO crawlers that don't execute JS
- First paint before JS hydrates

Two options:
1. **Keep baked numbers as fallback** — they'll be slightly stale but close enough for SEO. JS hydrates correct numbers for real users. This is the standard ISR pattern.
2. **Replace baked numbers with placeholders** — e.g. `<span class="stat-value" data-hydrate="total_count">—</span>`. Cleaner but risks showing dashes to Googlebot.

**Recommendation**: Option 1 (keep baked as fallback). Regenerate pages periodically (weekly or after major data changes) to keep fallbacks reasonably fresh.

### C. Page Generator Update (Carlos)

Update generator scripts to add `data-*` attributes that the hydrator uses:

```html
<!-- Before -->
<span class="ri-count">6,598 businesses in New South Wales</span>

<!-- After -->
<span class="ri-count"
      data-related-industry="conveyancer"
      data-geo="NSW">6,598 businesses in New South Wales</span>
```

This lets the hydrator know which related industry count to update without parsing text.

## API Endpoints (Already Exist — No Backend Work)

| Endpoint | Returns | Used For |
|----------|---------|----------|
| `/api/explorer/aggregates/AU/solicitor_au?state=NSW` | summary, parent_comparison, cities | Hero stats, FAQ, comparison |
| `/api/v1/industries/solicitor/related?country_code=AU&state=NSW` | related industry counts | Related businesses section |
| `/api/explorer/faq-data/AU/solicitor_au?level=state&state=NSW` | pre-built FAQ data | FAQ answers |

## Acceptance Criteria

1. Change a count in the DB → visible on live page within 15 min (matview refresh) without any rebuild
2. Related businesses counts match API response, not baked HTML
3. FAQ answers reflect current data
4. No layout shift (baked fallback shows immediately, JS updates in place)
5. Works at all 4 geo levels (national, state, city, suburb)
6. JSON-LD structured data reflects current counts
7. No impact on page load performance (defer hydration, don't block render)

## Effort Estimate

- Carlos: Update page generators to add data attributes + hydrator script — 1-2 sessions
- Olivia: Wire hydrator into app.js load cycle (may already be partially there) — 1 session
- Jack: No backend work needed (all APIs exist)
- Rajesh: QA across page levels — 1 session

## Layer 2: Static HTML Freshness for SEO (Googlebot + Content Signals)

Dynamic JS hydration (Layer 1 above) handles real users. But Google also values content freshness — updated stats signal an active, authoritative page. Three mechanisms ensure Googlebot sees fresh numbers too:

### 2A. Scheduled Weekly Regeneration (cron)

**What**: Carlos's page generators re-run weekly on a systemd timer.
**How**:
1. Timer runs every Sunday 02:00 UTC (low-traffic window)
2. Generators fetch fresh data from API, regenerate all HTML pages
3. Sitemaps regenerated with updated `<lastmod>` dates
4. Auto-commit + push to Vercel deploy branch → triggers Vercel rebuild
5. Google sees updated `<lastmod>` in sitemaps → prioritises recrawl

**Implementation**:
```bash
# /etc/systemd/system/konnex-page-regen.timer
[Timer]
OnCalendar=Sun *-*-* 02:00:00 UTC
Persistent=true

# /etc/systemd/system/konnex-page-regen.service
ExecStart=/home/carlos/projects/konnex-labs-site/scripts/regen-and-deploy.sh
```

The `regen-and-deploy.sh` script:
1. `node scripts/generate-au-state-pages.js --env production`
2. `node scripts/generate-au-city-pages.js --env production` (per industry)
3. `node scripts/generate-au-type-c-pages.js --env production`
4. Regenerate sitemaps with today's date as `<lastmod>`
5. `git add . && git commit -m "[auto] Weekly page regen $(date +%F)" && git push`
6. Vercel auto-deploys on push

**Effort**: Carlos 1 session to build the wrapper script + timer

### 2B. Event-Triggered Regeneration (on data change)

**What**: After pipeline completion, data purge, or enrichment, regenerate only the affected industry's pages.
**How**:
1. Pipeline orchestrator emits `industry.pipeline.completed` event (already exists)
2. New hook listens for completion → runs generator for that single industry
3. Only ~200-500 pages regenerated per industry (not all 16K)
4. Commit + push triggers targeted Vercel deploy

**Trigger points**:
- Pipeline `final_cleanup` stage completion → auto-regen pages for that industry
- Manual data operations (purge/dedup) → Jack or Carlos runs `regen-industry.sh solicitor_au`

**Implementation**: Add post-completion hook in orchestrator:
```javascript
// After final_cleanup completes for an industry:
events.on('industry.pipeline.completed', async ({ industry_id }) => {
  exec(`/home/carlos/projects/konnex-labs-site/scripts/regen-industry.sh ${industry_id}`);
});
```

**Effort**: Carlos 1 session for `regen-industry.sh`, Jack 30 min for orchestrator hook

### 2C. Google Indexing API Pings (proactive recrawl)

**What**: After page regeneration, submit updated URLs to Google's Indexing API for priority recrawl within hours (vs days/weeks for organic recrawl).
**How**:
1. After regen, collect list of updated page URLs
2. Submit to Google Indexing API: `POST https://indexing.googleapis.com/v3/urlNotifications:publish`
3. Use existing GSC OAuth credentials (already in `/home/jack/credentials/`)
4. Rate limit: 200 URLs/day (batch by priority — state pages first, then cities)

**Priority queue for submissions**:
1. National pages (~30 URLs) — highest SEO value
2. State pages (~238 URLs) — high SEO value
3. City pages with >50 businesses (~2K URLs) — medium value
4. Remaining pages — organic recrawl is fine

**Implementation**: Carlos adds to SEO tooling — `submit-to-indexing-api.js`

**Effort**: Carlos 1 session

### Combined Flow (recommended steady-state)

```
Data Change (purge/pipeline/enrichment)
    │
    ├── Layer 1: JS hydration updates live page in <15 min (automatic)
    │
    ├── Layer 2B: Event hook regenerates affected industry pages (automatic)
    │   └── Layer 2C: Submit regenerated URLs to Indexing API (automatic)
    │
    └── Layer 2A: Weekly full regen catches anything missed (safety net)
```

## Effort Summary

| Who | Task | Sessions |
|-----|------|----------|
| Carlos | Stats hydrator script (Layer 1) | 1-2 |
| Carlos | Page generator data attributes (Layer 1) | 1 |
| Carlos | Weekly regen timer + deploy script (Layer 2A) | 1 |
| Carlos | Per-industry regen script (Layer 2B) | 1 |
| Carlos | Indexing API submission tool (Layer 2C) | 1 |
| Jack | Orchestrator post-completion hook (Layer 2B) | 0.5 |
| Olivia | Wire hydrator into app.js (Layer 1) | 1 |
| Rajesh | QA across all page levels | 1 |

**Total**: Carlos ~5 sessions, Olivia 1, Jack 0.5, Rajesh 1
**Session estimate**: 3-4 (Carlos can parallelise some work)

## Priority Order

1. **Immediate**: Carlos re-runs AU page generators to fix stale numbers NOW
2. **Week 1**: Stats hydrator (Layer 1) — real users always see live data
3. **Week 1**: Weekly regen timer (Layer 2A) — safety net for SEO
4. **Week 2**: Event-triggered regen (Layer 2B) — automatic freshness on data change
5. **Week 2**: Indexing API pings (Layer 2C) — accelerated Google recrawl

## Quick Win (Today)

While the full solution is built, Carlos re-runs the AU page generators to update all baked numbers to current values. Gets the numbers correct now.
