#!/usr/bin/env node
'use strict';

const { Pool } = require('/home/jack/projects/konnex-data-api/node_modules/pg');
const fs = require('fs');

const pool = new Pool({ connectionString: process.env.MARKET_INTEL_DB_URI });

const BRAND_NAMES = {
  'mcdonalds_au': "McDonald's",
  'kfc_au': 'KFC',
  'hungry_jacks_au': 'Hungry Jacks',
  'guzman_y_gomez_au': 'Guzman y Gomez',
  'el_jannah_au': 'El Jannah',
};

// Brand-name filters: business name must match at least one pattern to be included
const BRAND_FILTERS = {
  'mcdonalds_au': [/\bmcdonald'?s?\b/i],
  'kfc_au': [/\bkfc\b/i, /\bkentucky fried/i],
  'hungry_jacks_au': [/\bhungry jack'?s?\b/i],
  'guzman_y_gomez_au': [/\bguzman/i, /\bgyg\b/i],
  'el_jannah_au': [/\bel jannah\b/i],
};

const INDUSTRY_MAP = {
  'mcdonalds_au': 'au-mcdonalds',
  'kfc_au': 'au-kfc',
  'hungry_jacks_au': 'au-hungry-jacks',
  'guzman_y_gomez_au': 'au-guzman-y-gomez',
};

function escape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return (s.includes(',') || s.includes('"') || s.includes('\n')) ? '"' + s + '"' : s;
}

(async () => {
  // 1. Load geo_reference_au for suburb → postcode mapping
  const geo = await pool.query('SELECT zip, suburb, state_code FROM geo_reference_au WHERE is_active = TRUE');
  const suburbToZip = {};
  for (const g of geo.rows) {
    const key = (g.suburb || '').toUpperCase() + ':' + (g.state_code || '').toUpperCase();
    if (!suburbToZip[key]) suburbToZip[key] = g.zip;
  }
  console.log('Geo suburb→zip entries:', Object.keys(suburbToZip).length);

  // 2. Load SVI data — latest period per industry+postcode
  const svi = await pool.query(`
    SELECT DISTINCT ON (industry_id, location_postcode)
      industry_id, location_postcode, search_volume, cpc, competition_level, period
    FROM search_volumes
    WHERE search_volume IS NOT NULL
    ORDER BY industry_id, location_postcode, period DESC
  `);
  const sviMap = {};
  for (const row of svi.rows) {
    sviMap[row.industry_id + ':' + row.location_postcode] = row;
  }
  console.log('SVI entries indexed:', Object.keys(sviMap).length);

  // 3. Load population movement — latest year per SA2
  const pop = await pool.query(`
    SELECT DISTINCT ON (sa2_name, state_code)
      sa2_name, state_code, year, population, population_change, growth_pct
    FROM population_movement
    WHERE country_code = 'AU'
    ORDER BY sa2_name, state_code, year DESC
  `);
  const popMap = {};
  for (const row of pop.rows) {
    popMap[(row.sa2_name || '').toLowerCase() + ':' + (row.state_code || '').toUpperCase()] = row;
  }
  console.log('Population entries indexed:', Object.keys(popMap).length);

  // 4. Load QSR businesses
  const businesses = await pool.query(`
    SELECT
      id, industry, name, address_street, address_suburb, address_city,
      address_state, address_zip, lat, lng, phone, email,
      website_url, rating, review_count, maps_url, maps_opening_hours,
      location_type, google_place_id, country_code,
      enrichment_data->>'business_status' AS business_status,
      enrichment_data->>'total_reviews_google' AS total_reviews_google,
      enrichment_data->>'review_velocity_monthly' AS review_velocity_monthly,
      enrichment_data->>'estimated_opening_date' AS estimated_opening_date,
      enrichment_data->>'newest_review_date' AS newest_review_date,
      enrichment_data->>'review_enrich_date' AS review_enrich_date,
      enrichment_data->>'brand_suburb_keyword' AS brand_suburb_keyword,
      enrichment_data->>'brand_suburb_search_volume' AS brand_suburb_search_volume,
      enrichment_data->>'brand_suburb_cpc' AS brand_suburb_cpc,
      enrichment_data->>'brand_suburb_competition' AS brand_suburb_competition,
      enrichment_data->>'brand_suburb_trend_3m' AS brand_suburb_trend_3m
    FROM businesses
    WHERE is_active = TRUE
      AND industry IN ('mcdonalds_au','kfc_au','hungry_jacks_au','guzman_y_gomez_au','el_jannah_au')
    ORDER BY industry, address_state, address_suburb
  `);
  console.log('Total QSR businesses:', businesses.rows.length);

  // 5. Build CSV
  const headers = [
    'brand','name','address_street','suburb','city','state','postcode','lat','lng',
    'phone','email','website','rating','review_count','opening_hours',
    'location_type','google_place_id','maps_url',
    'business_status','total_reviews_google','review_velocity_monthly',
    'estimated_opening_date','newest_review_date','review_enrich_date',
    'brand_suburb_keyword','brand_suburb_search_volume','brand_suburb_cpc',
    'brand_suburb_competition','brand_suburb_trend_3m',
    'svi_search_volume','svi_cpc','svi_competition','svi_period',
    'pop_sa2_name','pop_year','pop_population','pop_change','pop_growth_pct',
  ];

  const rows = [headers.join(',')];
  let sviMatches = 0, popMatches = 0;

  let skippedBrand = 0;
  for (const b of businesses.rows) {
    // Skip records whose name doesn't match the brand filter
    const filters = BRAND_FILTERS[b.industry];
    if (filters && !filters.some(re => re.test(b.name))) {
      skippedBrand++;
      continue;
    }
    // Resolve postcode via suburb lookup
    const subKey = (b.address_suburb || '').toUpperCase() + ':' + (b.address_state || '').toUpperCase();
    const postcode = b.address_zip || suburbToZip[subKey] || '';

    // SVI match
    const sviId = INDUSTRY_MAP[b.industry];
    const sviData = sviId && postcode ? sviMap[sviId + ':' + postcode] : null;
    if (sviData) sviMatches++;

    // Population match
    const popKey = (b.address_suburb || '').toLowerCase() + ':' + (b.address_state || '').toUpperCase();
    const popData = popMap[popKey] || null;
    if (popData) popMatches++;

    rows.push([
      escape(BRAND_NAMES[b.industry] || b.industry),
      escape(b.name), escape(b.address_street), escape(b.address_suburb),
      escape(b.address_city), escape(b.address_state), escape(postcode),
      escape(b.lat), escape(b.lng), escape(b.phone), escape(b.email), escape(b.website_url),
      escape(b.rating), escape(b.review_count), escape(b.maps_opening_hours),
      escape(b.location_type), escape(b.google_place_id), escape(b.maps_url),
      escape(b.business_status), escape(b.total_reviews_google),
      escape(b.review_velocity_monthly), escape(b.estimated_opening_date),
      escape(b.newest_review_date), escape(b.review_enrich_date),
      escape(b.brand_suburb_keyword), escape(b.brand_suburb_search_volume),
      escape(b.brand_suburb_cpc), escape(b.brand_suburb_competition),
      escape(b.brand_suburb_trend_3m),
      escape(sviData ? sviData.search_volume : ''),
      escape(sviData ? sviData.cpc : ''),
      escape(sviData ? sviData.competition_level : ''),
      escape(sviData ? new Date(sviData.period).toISOString().slice(0, 10) : ''),
      escape(popData ? popData.sa2_name : ''),
      escape(popData ? popData.year : ''),
      escape(popData ? popData.population : ''),
      escape(popData ? popData.population_change : ''),
      escape(popData ? popData.growth_pct : ''),
    ].join(','));
  }

  const outPath = '/home/jack/projects/google-maps-scraper/qsr-full-export.csv';
  fs.writeFileSync(outPath, rows.join('\n'));
  if (skippedBrand) console.log('Skipped (brand filter):', skippedBrand);
  console.log('\nCSV written:', outPath);
  console.log('Total rows:', rows.length - 1);
  console.log('SVI matches:', sviMatches, '/', businesses.rows.length);
  console.log('Pop matches:', popMatches, '/', businesses.rows.length);
  await pool.end();
})();
