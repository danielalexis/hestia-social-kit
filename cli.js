#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { createPost, closeBrowser } = require("./src/createPost");
const { TEMPLATES } = require("./templates");

function usage() {
  console.log(`Usage:
  node cli.js --template <id> [--lang en|pt] [--data '<json>' | --file <post.json>] [--name <out-name>] [--scale <n>] [--no-png]
  node cli.js --list

--scale <n>  PNG pixel density (default 2 = "@2x" supersampled export; use 1 for
             the exact platform pixel size, e.g. 1200x1200 instead of 2400x2400).

Templates:
${Object.keys(TEMPLATES)
  .map((id) => `  ${id.padEnd(14)} ${TEMPLATES[id].label} (${TEMPLATES[id].width}x${TEMPLATES[id].height})`)
  .join("\n")}

A --file post.json may instead contain a full { template, lang, data, name } object,
or an array of such objects to create several posts in one run.
`);
}

function parseArgs(argv) {
  const args = { png: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--template") args.template = argv[++i];
    else if (a === "--lang") args.lang = argv[++i];
    else if (a === "--data") args.data = JSON.parse(argv[++i]);
    else if (a === "--file") args.file = argv[++i];
    else if (a === "--name") args.name = argv[++i];
    else if (a === "--scale") args.scale = Number(argv[++i]);
    else if (a === "--no-png") args.png = false;
    else if (a === "--list") args.list = true;
    else if (a === "--help" || a === "-h") args.help = true;
  }
  return args;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) return usage();
  if (args.list) {
    for (const [id, t] of Object.entries(TEMPLATES)) {
      console.log(`${id.padEnd(14)} ${t.label} (${t.width}x${t.height})`);
    }
    return;
  }

  let jobs;
  if (args.file) {
    const parsed = JSON.parse(fs.readFileSync(args.file, "utf8"));
    jobs = Array.isArray(parsed) ? parsed : [parsed];
  } else {
    if (!args.template) {
      usage();
      process.exitCode = 1;
      return;
    }
    jobs = [{ template: args.template, lang: args.lang, data: args.data, name: args.name, png: args.png, scale: args.scale }];
  }

  try {
    for (const job of jobs) {
      const result = await createPost({
        template: job.template,
        lang: job.lang || "en",
        data: job.data || {},
        name: job.name,
        png: job.png !== false && args.png !== false,
        scale: job.scale ?? args.scale ?? 2,
      });
      console.log(`✓ ${job.template} (${job.lang || "en"}) -> ${result.htmlPath}${result.pngPath ? ` , ${result.pngPath} (${result.width * result.scale}x${result.height * result.scale} @${result.scale}x)` : ""}`);
    }
  } finally {
    await closeBrowser();
  }
}

run().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
