"use strict";

const path = require("path");
const express = require("express");
const { renderPost, TEMPLATES } = require("./src/render");
const { createPost, closeBrowser } = require("./src/createPost");

const PORT = process.env.PORT || 4173;
const ROOT = __dirname;

const app = express();
app.use(express.json({ limit: "2mb" }));

// Static assets referenced by rendered templates (web-preview base paths:
// "/assets" and "/src/colors_and_type.css" — see src/render.js).
app.use("/assets", express.static(path.join(ROOT, "assets")));
app.use("/fonts", express.static(path.join(ROOT, "fonts")));
app.get("/src/colors_and_type.css", (req, res) => {
  res.sendFile(path.join(ROOT, "src", "colors_and_type.css"));
});

// Exported files, downloadable straight from the UI.
app.use("/output", express.static(path.join(ROOT, "output")));

// UI
app.use(express.static(path.join(ROOT, "public")));

// --- API ---------------------------------------------------------------

app.get("/api/templates", (req, res) => {
  const out = {};
  for (const [id, tpl] of Object.entries(TEMPLATES)) {
    out[id] = {
      id,
      label: tpl.label,
      width: tpl.width,
      height: tpl.height,
      schema: tpl.schema,
      defaults: tpl.defaults,
    };
  }
  res.json(out);
});

// GET so the frontend can point an <iframe src> straight at it.
app.get("/api/preview", (req, res) => {
  try {
    const { template, lang } = req.query;
    const data = req.query.data ? JSON.parse(req.query.data) : {};
    const { html } = renderPost({ template, lang: lang || "en", data, assets: "/assets", cssHref: "/src/colors_and_type.css" });
    res.set("Content-Type", "text/html").send(html);
  } catch (err) {
    res.status(400).set("Content-Type", "text/plain").send(String(err.message || err));
  }
});

app.post("/api/export", async (req, res) => {
  try {
    const { template, lang, data, name, format, scale } = req.body || {};
    const png = format !== "html";
    const result = await createPost({ template, lang: lang || "en", data: data || {}, name, png, scale: scale ?? 2 });
    res.json({
      htmlUrl: "/output/" + path.basename(result.htmlPath),
      pngUrl: result.pngPath ? "/output/" + path.basename(result.pngPath) : null,
      width: result.width,
      height: result.height,
      scale: result.scale,
    });
  } catch (err) {
    res.status(400).json({ error: String(err.message || err) });
  }
});

app.listen(PORT, () => {
  console.log(`Hestia Social Kit UI running at http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});
