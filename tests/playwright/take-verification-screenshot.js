#!/usr/bin/env node
/**
 * Verification Status Summary Screenshot
 *
 * Generates a clean, tightly cropped screenshot of just the extension popup
 * in the post-extraction complete state with verification summary visible.
 * For use in directory listings, pitch emails, and marketing assets.
 *
 * Usage:
 *   node take-verification-screenshot.js
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const EXTENSION_PATH = path.resolve(__dirname, '../../');
const USER_DATA_DIR = path.join(__dirname, '.verification-screenshot-profile');
const OUTPUT_PATH = path.resolve(__dirname, '../../..', 'assets/verification-status-summary.png');

async function main() {
  console.log('=== Verification Status Summary Screenshot ===\n');

  // Clean profile
  if (fs.existsSync(USER_DATA_DIR)) {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });

  console.log('Launching browser with extension...');
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
      '--no-first-run',
      '--no-sandbox',
      '--disable-default-apps',
      '--disable-search-engine-choice-screen',
      '--no-default-browser-check',
      '--headless=new',
    ],
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    locale: 'en-US',
  });

  // Get extension ID
  let extensionId;
  const workers = context.serviceWorkers();
  if (workers.length > 0) {
    extensionId = workers[0].url().split('/')[2];
  } else {
    const sw = await context.waitForEvent('serviceworker', { timeout: 15_000 });
    extensionId = sw.url().split('/')[2];
  }
  console.log(`Extension ID: ${extensionId}`);
  const sw = context.serviceWorkers()[0];
  await new Promise(r => setTimeout(r, 2000));

  const popupUrl = `chrome-extension://${extensionId}/popup/popup.html`;

  // Generate 47 realistic enriched leads
  const enrichedLeads = [];
  const names = [
    'Von Plumbing & Heating', 'FIXALL Plumbing', 'Maccabi Plumbing', 'Angler Plumbing',
    'Chapman Bros Plumbing', 'Schaaf Plumbing', 'Dean Plumbing', 'Mastropiero Plumbing',
    'Stan\'s Plumbing', 'J&C Plumbing', 'Elite Pipe Works', 'Garden State Plumbing',
    'Jersey Drain Solutions', 'Metro Plumbing NJ', 'Tri-State Heating', 'Liberty Plumbing',
    'Hudson Plumbing Co', 'Newark Pipe & Drain', 'Central NJ Plumbing', 'Shore Plumbing',
    'Summit Plumbing', 'Bayshore Heating', 'Valley Plumbing', 'Horizon Plumbing',
    'Premier Pipe Solutions', 'All County Plumbing', 'First Call Plumbing', 'Pro Flow NJ',
    'East Coast Plumbing', 'Reliable Plumbing NJ', 'Quality Drain Services', 'NJ Master Plumber',
    'Aqua Systems Plumbing', 'Golden Faucet Services', 'Pine Brook Plumbing',
    'Ace Plumbing & Drain', 'Blue Water Plumbing', 'Jersey Shore Plumbing', 'Patriot Plumbing',
    'Garden State Drains', 'Colonial Plumbing', 'First Response Plumbing', 'Sunrise Plumbing',
    'Atlantic Plumbing Co', 'Eagle Plumbing NJ', 'Liberty Bell Plumbing', 'Keystone Plumbing',
  ];

  for (let i = 0; i < 47; i++) {
    const hasEmail = i % 3 !== 0; // ~31 with emails
    const status = hasEmail ? (i % 7 === 0 ? 'Unverified' : (i % 11 === 0 ? 'Invalid' : 'Verified')) : null;
    enrichedLeads.push({
      name: names[i % names.length],
      address: `${100 + i} Main St, NJ`,
      phone: `(${900 + (i % 100)}) 555-${String(1000 + i).slice(-4)}`,
      website: i % 4 === 0 ? null : `https://example${i}.com`,
      rating: (4.0 + (i % 10) / 10).toFixed(1),
      reviewCount: 10 + i * 3,
      category: 'Plumber',
      googleMapsUrl: `https://www.google.com/maps/place/${i}`,
      emails: hasEmail ? [`info@example${i}.com`] : [],
      emailSource: hasEmail ? '🏠 Homepage' : null,
      emailVerificationStatus: status,
    });
  }

  const emailsFound = enrichedLeads.filter(l => l.emails && l.emails.length > 0).length;
  const verified = enrichedLeads.filter(l => l.emailVerificationStatus === 'Verified').length;
  const unverified = enrichedLeads.filter(l => l.emailVerificationStatus === 'Unverified').length;
  const invalid = enrichedLeads.filter(l => l.emailVerificationStatus === 'Invalid').length;
  const totalLeads = enrichedLeads.length;

  console.log(`Mock data: ${totalLeads} leads, ${emailsFound} emails (${verified} verified, ${unverified} unverified, ${invalid} invalid)`);

  // Set up storage state
  await sw.evaluate((leads) => {
    return chrome.storage.local.set({
      licenseStatus: { status: 'active', tier: 'standard', trialScrapesRemaining: 0, licenseKey: 'DEMO-XXXX-XXXX-XXXX', validatedAt: Date.now(), email: 'user@example.com' },
      scrapedData: leads,
      scrapedDataWithEmails: leads,
      isScrapin: false,
      isExtractingEmails: false,
      autoExtractEmails: true,
      notificationsEnabled: true,
      socialSearchEnabled: true,
    });
  }, enrichedLeads);

  // Open popup
  const popup = await context.newPage();
  await popup.route('**/fonts.googleapis.com/**', route => route.abort());
  await popup.route('**/fonts.gstatic.com/**', route => route.abort());
  await popup.goto(popupUrl);
  await popup.waitForLoadState('domcontentloaded');
  await popup.waitForTimeout(1500);

  // Set UI to post-extraction complete state
  await popup.evaluate(({ emailsFound, totalLeads, verified, unverified, invalid }) => {
    // Hide all error messages
    const errorMsg = document.getElementById('errorMessage');
    if (errorMsg) { errorMsg.classList.remove('visible'); errorMsg.style.display = 'none'; }
    document.querySelectorAll('.error-message, [class*="error"], [class*="warning"]').forEach(el => el.style.display = 'none');

    // Status: Complete
    const si = document.querySelector('.status-indicator');
    if (si) { si.classList.remove('error', 'scraping'); si.classList.add('ready'); }
    const st = document.getElementById('statusText');
    if (st) st.textContent = 'Complete';

    // Lead count
    const lc = document.getElementById('leadCount');
    if (lc) lc.textContent = String(totalLeads);

    // Show email section with completion state
    const emailSection = document.getElementById('emailSection');
    if (emailSection) emailSection.style.display = 'block';
    const emailStatus = document.getElementById('emailStatus');
    if (emailStatus) emailStatus.textContent = `Done! Found emails for ${emailsFound} businesses`;
    const emailCount = document.getElementById('emailCount');
    if (emailCount) emailCount.textContent = `${emailsFound}/${totalLeads}`;
    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = '100%';
    const currentBusiness = document.getElementById('currentBusiness');
    if (currentBusiness) currentBusiness.textContent = '';
    const cancelBtn = document.getElementById('cancelEmailBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';

    // Show verification summary
    const summaryEl = document.getElementById('verificationSummary');
    if (summaryEl) {
      summaryEl.innerHTML = `<span class="v-verified">✅ ${verified} Verified</span> <span class="v-unverified">⚠️ ${unverified} Unverified</span> <span class="v-invalid">❌ ${invalid} Invalid</span>`;
      summaryEl.style.display = 'flex';
    }
  }, { emailsFound, totalLeads, verified, unverified, invalid });

  // Take tight crop of just the popup body
  await popup.locator('body').screenshot({ path: OUTPUT_PATH });
  console.log(`\nSaved: ${OUTPUT_PATH}`);

  const stat = fs.statSync(OUTPUT_PATH);
  console.log(`Size: ${(stat.size / 1024).toFixed(0)} KB`);

  await popup.close();
  await context.close();

  // Clean up Chrome profile
  if (fs.existsSync(USER_DATA_DIR)) {
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  }

  console.log('\nDone!');
}

main().catch((err) => {
  console.error('Screenshot failed:', err);
  process.exit(1);
});
