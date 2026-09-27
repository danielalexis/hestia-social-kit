"use strict";

const fs = require("fs");
const path = require("path");
const { renderPost } = require("./render");

const OUTPUT_DIR = path.join(__dirname, "..", "output");

let sharedBrowser = null;

async function getBrowser() {
  if (!sharedBrowser) {
    const { chromium } = require("playwright");
    sharedBrowser = await chromium.launch();
  }
  return sharedBrowser;
}

/** Close the shared Playwright browser (call once when a script is done). */
async function closeBrowser() {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
  }
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Programmatically create a new social post from one of the Hestia Social
 * Kit templates.
 *
 * @param {object} opts
 * @param {string} opts.template - template id, e.g. "statement", "stat-hero",
 *   "quote", "dpp-pillar", "link-card", "event-promo", "three-steps",
 *   "modules", "cta-story", "proof-story"
 * @param {"en"|"pt"} [opts.lang="en"]
 * @param {object} [opts.data={}] - field overrides (see templates/index.js
 *   for each template's field names and defaults)
 * @param {string} [opts.name] - output file basename (default:
 *   "<template>-<lang>-<timestamp>")
 * @param {boolean} [opts.png=true] - also export a PNG at the template's
 *   true pixel size (requires `npx playwright install chromium` once)
 * @param {number} [opts.scale=2] - device pixel ratio to render the PNG at.
 *   The CSS layout stays at the template's true size (e.g. 1200x1200); scale
 *   only supersamples the capture, so a scale of 2 produces a 2400x2400 PNG
 *   with the same design, sharper text/edges — like a Figma "@2x" export.
 *   Pass 1 for the exact platform pixel size with no supersampling.
 * @returns {Promise<{ htmlPath: string, pngPath: string|null, width: number, height: number, scale: number }>}
 */
async function createPost({ template, lang = "en", data = {}, name, png = true, scale = 2 }) {
  const { html, width, height } = renderPost({ template, lang, data });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const baseName = name || `${slugify(template)}-${lang}-${Date.now()}`;
  const htmlPath = path.join(OUTPUT_DIR, `${baseName}.html`);
  fs.writeFileSync(htmlPath, html, "utf8");

  let pngPath = null;
  if (png) {
    const browser = await getBrowser();
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
    try {
      await page.goto(`file://${htmlPath}`);
      await page.waitForLoadState("networkidle");
      pngPath = path.join(OUTPUT_DIR, `${baseName}.png`);
      const el = await page.$("#artboard");
      await el.screenshot({ path: pngPath });
    } finally {
      await page.close();
    }
  }

  return { htmlPath, pngPath, width, height, scale };
}

module.exports = { createPost, closeBrowser };
