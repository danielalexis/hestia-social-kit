"use strict";

const fs = require("fs");
const path = require("path");
const { TEMPLATES } = require("../templates");

// Inlined so <use href="#icon-id"> resolves to a same-document fragment.
// Referencing the external assets/textile-icons.svg file via <use> works
// fine over http (web UI preview) but silently fails under file:// (the
// CLI/export path) because Chromium treats each file:// document as its own
// origin and blocks the cross-document SVG fetch — the icon just renders
// as an empty box with no error. Inlining sidesteps that entirely.
const ICONS_SVG = fs.readFileSync(path.join(__dirname, "..", "assets", "textile-icons.svg"), "utf8");

function deepMerge(base, override) {
  if (Array.isArray(base)) return override !== undefined ? override : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    for (const k of Object.keys(override || {})) {
      out[k] = deepMerge(base[k], override[k]);
    }
    return out;
  }
  return override !== undefined ? override : base;
}

/**
 * Build the fields for a template: template defaults for `lang`, with any
 * fields in `data` overriding (deep-merged, so e.g. passing `{steps: [...]}`
 * replaces the steps array, but omitting it keeps the default steps).
 */
function resolveFields(templateId, lang, data) {
  const tpl = TEMPLATES[templateId];
  if (!tpl) {
    throw new Error(`Unknown template "${templateId}". Available: ${Object.keys(TEMPLATES).join(", ")}`);
  }
  const langDefaults = tpl.defaults[lang] || tpl.defaults.en;
  return { tpl, fields: deepMerge(langDefaults, data) };
}

/**
 * Render one post to a full standalone HTML document.
 * @param {object} opts
 * @param {string} opts.template - template id (see templates/index.js)
 * @param {string} [opts.lang] - "en" | "pt" (default "en")
 * @param {object} [opts.data] - field overrides, merged over the template's
 *   language defaults
 * @param {string} [opts.assets] - base path to the assets/ directory as seen
 *   from wherever the HTML is loaded from. Default "../assets" matches
 *   output/*.html (CLI/file export); the web UI passes "/assets".
 * @param {string} [opts.cssHref] - href for the design-tokens stylesheet.
 *   Default "../src/colors_and_type.css" matches output/*.html; the web UI
 *   passes "/src/colors_and_type.css".
 * @returns {{ html: string, width: number, height: number, tpl: object }}
 */
function renderPost({ template, lang = "en", data = {}, assets = "../assets", cssHref = "../src/colors_and_type.css" }) {
  const { tpl, fields } = resolveFields(template, lang, data);
  const inner = tpl.render(fields, assets);

  const containerStyle = [
    "position:relative",
    `width:${tpl.width}px`,
    `height:${tpl.height}px`,
    `background:${tpl.background}`,
    tpl.border ? "border:1px solid var(--border)" : "",
    `padding:${tpl.padding ?? "88px"}`,
    "box-sizing:border-box",
    "overflow:hidden",
    "display:flex",
    tpl.row ? "flex-direction:row" : "flex-direction:column",
    tpl.gap ? `gap:${tpl.gap}` : "",
  ]
    .filter(Boolean)
    .join(";");

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${cssHref}">
<style>html,body{margin:0;background:#E9E5DD}</style>
</head>
<body>
${ICONS_SVG}
<div id="artboard" style="${containerStyle}">${inner}</div>
</body>
</html>
`;

  return { html, width: tpl.width, height: tpl.height, tpl };
}

module.exports = { renderPost, resolveFields, TEMPLATES };
