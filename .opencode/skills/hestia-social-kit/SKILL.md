---
name: hestia-social-kit
description: Use when generating, customizing, or exporting social media graphics (LinkedIn/Instagram) using the Hestia Social Kit CLI (cli.js, createPost, templates, batch post JSON).
---

# Hestia Social Kit CLI & Templates Reference

The **Hestia Social Kit** is an automated graphic generation engine and CLI designed for producing branded LinkedIn and Instagram post graphics for **Hestia Technology** (AI-native factory operating system for textile manufacturers).

It renders parameterized HTML/CSS designs and uses Playwright to capture pixel-perfect, supersampled high-resolution PNGs (`@2x` by default).

---

## 1. Quick CLI Reference

From the project root (`/home/danielpereira/Documents/SocialMedia`):

```bash
# List all 13 available templates with dimensions
node cli.js --list

# Render a post with language defaults
node cli.js --template statement --lang en
node cli.js --template statement --lang pt

# Render with inline custom JSON data
node cli.js --template statement --lang en --data '{"kicker":"Update","headline":"Smarter Dye-House Operations"}' --name custom-statement

# Run a batch file containing one or more post configs
node cli.js --file posts/example.json

# Export HTML only (skip Playwright PNG render)
node cli.js --template link-card --no-png

# Change scale (default is 2 for crisp 2x supersampling; 1 for 1x native size)
node cli.js --template stat-hero --scale 1
```

### Command Flags

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--template <id>` | `string` | *(required unless `--file` or `--list`)* | ID of the template to render. |
| `--lang <en\|pt>` | `string` | `"en"` | Language preset for default text values (`"en"` or `"pt"`). |
| `--data '<json>'` | `string` | `{}` | JSON string overriding specific fields in the template schema. |
| `--file <path>` | `string` | — | Path to a `.json` file containing a post object or an array of post objects. |
| `--name <string>` | `string` | `<template>-<lang>-<timestamp>` | Custom basename for output files (no extension). |
| `--scale <n>` | `number` | `2` | Device pixel ratio / supersampling factor. `2` outputs sharp `@2x` PNGs (e.g. `2400x2400`). `1` outputs native template dimensions. |
| `--no-png` | `boolean` | `false` | When passed, only generates the standalone `.html` file, skipping PNG capture. |
| `--list` | `boolean` | `false` | Prints all available templates, human labels, and resolution. |
| `-h`, `--help` | `boolean` | `false` | Prints CLI usage guide. |

### Output Artifacts
All generated assets are written to the `output/` directory:
- `output/<name>.html` — Standalone HTML file with embedded fonts, CSS, and inlined SVGs.
- `output/<name>.png` — High-resolution rendered image.

---

## 2. Programmatic Node.js API

You can also import and trigger rendering programmatically:

```javascript
const { createPost, closeBrowser } = require("./src/createPost");

async function generate() {
  try {
    const result = await createPost({
      template: "statement",
      lang: "pt",
      data: {
        kicker: "Lançamento",
        headline: "Controlo de Qualidade Automático no Tear.",
      },
      name: "qc-tear-pt",
      scale: 2,   // 2x supersampled PNG
      png: true,  // set to false for HTML only
    });

    console.log("HTML:", result.htmlPath);
    console.log("PNG:", result.pngPath);
    console.log("Dimensions:", result.width * result.scale, "x", result.height * result.scale);
  } finally {
    await closeBrowser();
  }
}

generate();
```

---

## 3. Web UI & Live Preview

A local Express server provides a live visual preview and interactive editor:

```bash
npm run web
# Or: node server.js
```
- Opens at: `http://localhost:4173`
- API Endpoints:
  - `GET /api/templates` — JSON dictionary of all templates, schemas, and default values.
  - `GET /api/preview?template=<id>&lang=<en|pt>&data=<encoded-json>` — Returns raw HTML for an `<iframe>`.
  - `POST /api/export` — Body: `{ template, lang, data, name, format: "png"|"html", scale }`.

---

## 4. Templates Catalog & Data Schemas

There are **13 distinct templates** categorized by aspect ratio and layout.

### A. Square Feed Graphics (1200 x 1200 px — 1:1)
Ideal for **LinkedIn feed posts** and **Instagram feed carousels/singles**.

#### 1. `statement` — Statement Headline (Light)
- **Background**: Light Cream (`var(--background)` / `#FBFAF7`) with border.
- **Visuals**: Hestia primary logo + website footer.
- **Fields**:
  - `kicker` (`string`): Upper-case category badge (e.g. `"Platform"` or `"Plataforma"`).
  - `headline` (`string`): Bold hero statement (700 weight, 92px).
  - `subhead` (`string`): Secondary explanatory copy (400 weight, 34px).
- **Example Data**:
  ```json
  {
    "kicker": "Platform",
    "headline": "The Factory Operating System for Textile Manufacturers.",
    "subhead": "AI-native. EU-compliant. DPP-ready. Built for the factory floor, not the back office."
  }
  ```

#### 2. `stat-hero` — Stat Hero (Dark)
- **Background**: Deep Dark Navy (`#060E24`) with subtle grid pattern and radial blue blur glow.
- **Visuals**: Giant typographic stat + white logo.
- **Fields**:
  - `kicker` (`string`): Upper-case accent tag.
  - `statBig` (`string`): Prominent numeral/stat (800 weight, 216px, e.g. `"2–4"`, `"99.4%"`).
  - `statLabel` (`string`): Subtitle under stat (600 weight, 72px, e.g. `"weeks to go live"`).
  - `body` (`string`): Comparison or proof body paragraph (32px).
- **Example Data**:
  ```json
  {
    "kicker": "Compare",
    "statBig": "2–4",
    "statLabel": "weeks to go live",
    "body": "Legacy on-premise ERPs take 2–4 months, a perpetual licence, and no Digital Product Passport support."
  }
  ```

#### 3. `quote` — Testimonial / Point of View (Light)
- **Background**: Light Cream (`#FBFAF7`) with border.
- **Visuals**: Executive portrait (`assets/CEO.jpg`, 132x132 rounded) + brand footer.
- **Fields**:
  - `kicker` (`string`): Category tag (e.g. `"Point of view"`).
  - `quote` (`string`): Main quotation text in quotation marks (68px).
  - `name` (`string`): Author title / name (30px).
  - `role` (`string`): Company name & location (26px).
- **Example Data**:
  ```json
  {
    "kicker": "Point of view",
    "quote": "“Textile plants don't need another ERP. They need a system that already speaks their language — lots, shades, GSM, dye baths.”",
    "name": "CEO & Co-Founder",
    "role": "Hestia Technology · Barcelos, PT"
  }
  ```

#### 4. `dpp-pillar` — Digital Product Passport (Light)
- **Background**: Light Cream (`#FBFAF7`) with border.
- **Visuals**: DPP Official Seal SVG (`assets/dpp-seal.svg`), green status badge with indicator dot.
- **Fields**:
  - `kicker` (`string`): Tag (e.g. `"Compliance"` / `"Conformidade"`).
  - `headline` (`string`): Primary header (84px).
  - `body` (`string`): Explanation of EU DPP regulation and readiness (32px).
  - `badge` (`string`): Monospace pill badge (e.g. `"DPP READY · LOT 2A-0094"`).
- **Example Data**:
  ```json
  {
    "kicker": "Compliance",
    "headline": "Digital Product Passport, built in.",
    "body": "The EU textile DPP lands in 2027. Hestia already writes a verified passport for every lot you produce.",
    "badge": "DPP READY · LOT 2A-0094"
  }
  ```

#### 5. `cta-square` — CTA Feed (Dark)
- **Background**: Deep Navy (`#060E24`) with grid pattern and blue blur glow.
- **Visuals**: High-contrast white CTA button + white logo.
- **Fields**:
  - `kicker` (`string`): Tag (e.g. `"Next step"`).
  - `headline` (`string`): Strong invitation headline (84px).
  - `body` (`string`): Supporting context / early access details (32px).
  - `cta` (`string`): Button text (e.g. `"Book a demo"` / `"Marcar demonstração"`).
- **Example Data**:
  ```json
  {
    "kicker": "Next step",
    "headline": "Ready to modernize your textile plant?",
    "body": "Join the Hestia ERP early access program. Limited capacity for Portuguese textile manufacturers.",
    "cta": "Book a demo"
  }
  ```

---

### B. Square List Graphics (1080 x 1080 px — 1:1)
Perfect for **multi-item breakdowns, workflows, and modules** on Instagram and LinkedIn.

#### 6. `three-steps` — Three Steps (Light)
- **Background**: Light Cream (`#FBFAF7`) with border.
- **Visuals**: Stacked cards with monospace counter numbers (`01`, `02`, `03`).
- **Fields**:
  - `kicker` (`string`): Category tag.
  - `headline` (`string`): Header title (72px).
  - `steps` (`array` of objects): Array of 3 step items:
    - `title` (`string`): Step title (38px).
    - `body` (`string`): Step description (26px).
- **Example Data**:
  ```json
  {
    "kicker": "The process",
    "headline": "Live in three steps.",
    "steps": [
      { "title": "Connect Your Data", "body": "Machines, orders and stock, in hours — not weeks." },
      { "title": "Analyze in Real-Time", "body": "Output, downtime and rejects on one live board." },
      { "title": "Scale with Compliance", "body": "DPP and EU rules update themselves. You keep shipping." }
    ]
  }
  ```

#### 7. `modules` — System Modules (Light)
- **Background**: Light Cream (`#FBFAF7`) with border.
- **Visuals**: 3 feature rows with rounded blue SVG textile icons.
- **Fields**:
  - `kicker` (`string`): Category tag.
  - `headline` (`string`): Header title (76px).
  - `modules` (`array` of objects): Array of 3 module items:
    - `icon` (`string`): One of the 12 supported textile SVG icons (see list below).
    - `title` (`string`): Module name (40px).
    - `body` (`string`): Description (26px).
- **Example Data**:
  ```json
  {
    "kicker": "Platform",
    "headline": "Three modules. One factory OS.",
    "modules": [
      { "icon": "loom", "title": "Production", "body": "Looms, shifts, lots and live output." },
      { "icon": "roll", "title": "Inventory", "body": "Rolls, shades and GSM, traced by lot." },
      { "icon": "dpp", "title": "Compliance", "body": "DPP, EU reporting, audit trail included." }
    ]
  }
  ```

#### 8. `traceability` — Traceability Journey (Light)
- **Background**: Light Cream (`#FBFAF7`) with border.
- **Visuals**: 3-step production traceability timeline with SVG textile icons.
- **Fields**:
  - `kicker` (`string`): Tag (e.g. `"Traceability"` / `"Rastreabilidade"`).
  - `headline` (`string`): Header title (76px).
  - `items` (`array` of objects): Array of 3 items:
    - `icon` (`string`): Textile SVG icon ID.
    - `title` (`string`): Phase title.
    - `body` (`string`): Phase explanation.
- **Example Data**:
  ```json
  {
    "kicker": "Traceability",
    "headline": "Every roll tells a story.",
    "items": [
      { "icon": "lot", "title": "Fiber & Spinning Lot", "body": "Raw material origin, supplier certificates, and lot traceability." },
      { "icon": "dye-bath", "title": "Dyeing & Fabric", "body": "Real-time bath parameters, shade matching, and GSM verification." },
      { "icon": "dpp", "title": "Digital Passport", "body": "Automatic DPP creation at packaging, audit-ready for EU rules." }
    ]
  }
  ```

---

### C. Landscape Cards (1200 x 627 px — 1.91:1)
Standard OpenGraph aspect ratio. Ideal for **LinkedIn link previews, blog headers, webinar promos, and feature announcements**.

#### 9. `link-card` — Product Link Card (Dark)
- **Background**: Deep Navy (`#060E24`) split row.
- **Visuals**: Left column copy + CTA button; right column featuring `dashboard-dark.png` screenshot.
- **Fields**:
  - `eyebrow` (`string`): Badge tag (e.g. `"New"` / `"Novo"`).
  - `headline` (`string`): Feature title (54px).
  - `body` (`string`): Description (24px).
  - `cta` (`string`): Button text (e.g. `"Book a demo"`).
- **Example Data**:
  ```json
  {
    "eyebrow": "New",
    "headline": "Real-time shop-floor monitoring",
    "body": "Every machine, lot and shift on one live board — IoT in, decisions out.",
    "cta": "Book a demo"
  }
  ```

#### 10. `shop-floor` — Shop-floor Operations (Light)
- **Background**: Light Cream (`#FBFAF7`) split row with border.
- **Visuals**: Left column copy + blue CTA button; right column featuring `dashboard-light.png` screenshot.
- **Fields**:
  - `eyebrow` (`string`): Badge tag (e.g. `"Operations"` / `"Operações"`).
  - `headline` (`string`): Headline (52px).
  - `body` (`string`): Description (24px).
  - `cta` (`string`): Button text (e.g. `"Book a demo"`).
- **Example Data**:
  ```json
  {
    "eyebrow": "Operations",
    "headline": "From loom to tablet. Zero paper.",
    "body": "Digital work orders, live downtime tracking, and shift analytics in real time — built for the plant floor.",
    "cta": "Book a demo"
  }
  ```

#### 11. `event-promo` — Event / Webinar Promo (Light)
- **Background**: Light Cream (`#FBFAF7`) split row with border.
- **Visuals**: Prominent calendar date card on the left + event details and CTA on the right.
- **Fields**:
  - `month` (`string`): Short month name (e.g. `"Nov"`, `"Dez"`).
  - `day` (`string`): Day number (e.g. `"12"`, `"03"`).
  - `time` (`string`): Event time and timezone (e.g. `"15:00 WET"`).
  - `eyebrow` (`string`): Tag (e.g. `"Live demo"` / `"Webinar"`).
  - `headline` (`string`): Event title (56px).
  - `body` (`string`): Event description (24px).
  - `cta` (`string`): Button text (e.g. `"Save your seat"` / `"Inscrever"`).
  - `meta` (`string`): Format / language details (e.g. `"Online · EN"`, `"Online · PT"`).
- **Example Data**:
  ```json
  {
    "month": "Nov",
    "day": "12",
    "time": "15:00 WET",
    "eyebrow": "Live demo",
    "headline": "DPP for textile lots, end to end",
    "body": "30 minutes: connect a machine, run a lot, publish its passport. Questions welcome throughout.",
    "cta": "Save your seat",
    "meta": "Online · EN"
  }
  ```

---

### D. Vertical Story Graphics (1080 x 1920 px — 9:16)
Optimized for **Instagram Stories, Facebook Stories, and mobile vertical feeds**.

#### 12. `cta-story` — CTA Story (Dark)
- **Background**: Deep Navy (`#060E24`) vertical with grid and blue blur glow.
- **Visuals**: Large white CTA pill button, brand logo header.
- **Fields**:
  - `kicker` (`string`): Tag.
  - `headline` (`string`): Towering headline (104px).
  - `body` (`string`): Value proposition (36px).
  - `cta` (`string`): Button text (34px).
- **Example Data**:
  ```json
  {
    "kicker": "Take the next step",
    "headline": "Ready to transform your factory?",
    "body": "Join the early access program. Limited spots available.",
    "cta": "Book a demo"
  }
  ```

#### 13. `proof-story` — Proof / Switch Story (Light)
- **Background**: Light Cream (`#FBFAF7`) vertical with border.
- **Visuals**: Stacked key metric rows with large blue numbers and dividers.
- **Fields**:
  - `kicker` (`string`): Tag (e.g. `"Why they switch"` / `"Porque mudam"`).
  - `headline` (`string`): Header (88px).
  - `stats` (`array` of objects): Array of 3 stat comparisons:
    - `value` (`string`): Big stat numeral (84px, e.g. `"2–4"`, `"100%"`, `"2027"`).
    - `label` (`string`): Explanatory label (32px).
- **Example Data**:
  ```json
  {
    "kicker": "Why they switch",
    "headline": "Subscription, cloud, and ready for 2027.",
    "stats": [
      { "value": "2–4", "label": "weeks to go live, not months" },
      { "value": "100%", "label": "EU-hosted, EU-compliant by default" },
      { "value": "2027", "label": "DPP deadline, already covered" }
    ]
  }
  ```

---

## 5. Supported Textile SVG Icons

When using templates with icon fields (`modules` and `traceability`), use any of these valid icon IDs:

| Icon ID | Concept | Visual Representation |
| :--- | :--- | :--- |
| `loom` | Weaving / Knitting | Loom frame with vertical warps and shuttle |
| `roll` | Fabric Rolls | Textile fabric bolt rolled up |
| `lot` | Production Lot | Industrial tag with lot punch hole and string |
| `shade` | Color / Shade Matching | Color swatch cards with varying values |
| `gsm` | Grammage / Weight | Fabric piece on an industrial scale pan |
| `dye-bath` | Dyeing & Finishing | Liquid vat container with droplet |
| `quality-hold` | Quality Control & Inspection | Shield with check indicators |
| `dpp` | Digital Product Passport | Document passport with QR/barcode data matrix |
| `thread` | Yarn & Spinning | Spool of spun thread with fibers |
| `pattern` | Textile Weave & Grid | Interlaced warp and weft weave pattern |
| `cut-piece` | Cutting & Confection | Tailor shears cutting along dashed pattern lines |
| `order-tag` | Manufacturing Work Order | Factory production order luggage tag |

---

## 6. Batch JSON File Format (`--file`)

You can create a `.json` file containing multiple posts to generate an entire social campaign in one run:

```json
[
  {
    "template": "statement",
    "lang": "en",
    "name": "q3-statement-en",
    "scale": 2,
    "data": {
      "kicker": "Product Launch",
      "headline": "Automated Quality Control at the Loom.",
      "subhead": "Real-time fault detection before fabric reaches the inspection table."
    }
  },
  {
    "template": "event-promo",
    "lang": "pt",
    "name": "webinar-outubro-pt",
    "data": {
      "month": "Out",
      "day": "28",
      "time": "14:30 WET",
      "eyebrow": "Webinar Prático",
      "headline": "Como Implementar o DPP em Empresas Têxteis",
      "body": "Demonstração ao vivo de emissão de passaporte digital de lote com o Hestia ERP.",
      "cta": "Garantir vaga",
      "meta": "Online · PT"
    }
  }
]
```

Run it via:
```bash
node cli.js --file posts/my-campaign.json
```

---

## 7. Design System & Copywriting Rules

- **Brand Colors**:
  - `Hestia Blue`: `#003DA5` (primary brand accent, kickers, numerals, primary buttons).
  - `Deep Navy`: `#060E24` (dark template backgrounds, primary dark text).
  - `Light Cream`: `#FBFAF7` (main light canvas background).
  - `Border Gray`: `#E4E1DA` (subtle framing borders).
- **Fonts**:
  - Headings & Body: `Geist` (clean geometric grotesque sans-serif).
  - Kickers, Codes, Timestamps, URLs: `Geist Mono`.
- **Copy Guidelines**:
  - Write with an authoritative, modern B2B SaaS tone tailored to textile plant owners and production directors.
  - Reference concrete factory terms: *teares, tecelagem, fiação, tinturaria, banhos, lotes, rolos, gramagem (GSM), shading, ordens de fabrico, Passaporte Digital do Produto (DPP)*.
  - Highlight the contrast between slow, rigid legacy on-premise ERPs and fast, AI-native cloud software.
