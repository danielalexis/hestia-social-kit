# Hestia Social Kit

Programmatic renderer for Hestia Technology's LinkedIn/Instagram post graphics,
plus an experimental Remotion pipeline for short brand videos.

Templates are parameterized HTML/CSS, captured to pixel-perfect PNGs with
Playwright — no design tool round-trips needed to ship a new post.

## Quick start

```bash
npm install
node cli.js --list                              # see all templates
node cli.js --template statement --lang en       # render one
node cli.js --file posts/example.json            # render a batch
npm run web                                      # local editor UI at :4173
```

## Templates

| id | size |
| --- | --- |
| `statement` | 1200x1200 |
| `stat-hero` | 1200x1200 |
| `quote` | 1200x1200 |
| `dpp-pillar` | 1200x1200 |
| `link-card` | 1200x627 |
| `event-promo` | 1200x627 |
| `three-steps` | 1080x1080 |
| `modules` | 1080x1080 |
| `cta-story` | 1080x1920 |
| `proof-story` | 1080x1920 |
| `shop-floor` | 1200x627 |
| `traceability` | 1080x1080 |
| `cta-square` | 1200x1200 |
| `comparison-table` | 1080x1080 |
| `stat-bars` | 1080x1080 |
| `screenshot-feature` | 1200x627 |
| `roadmap` | 1080x1080 |

Each template exports EN and PT copy defaults (see `templates/index.js`) and
can be overridden per-field via `--data '<json>'` or a batch file in `posts/`.

## Video (experimental)

`video/` is a small [Remotion](https://www.remotion.dev/) project that
animates the same brand system (fonts, colors, copy) into short MP4 reels.

```bash
cd video
npm install
npm run preview   # opens Remotion Studio
npm run render    # renders out/brand-reel.mp4
```

## Project layout

```
cli.js            CLI entry point
server.js         Local web UI (template picker + live preview + export)
templates/        Template definitions (schema, defaults, render())
src/               Rendering pipeline (HTML build, Playwright capture)
assets/           Brand assets used by templates (logo, screenshots, icons)
fonts/            Self-hosted brand typeface
posts/            Batch job configs (arrays of {template, lang, data})
output/           Rendered HTML/PNG output
video/            Remotion video pipeline (separate npm project)
```

## License

Proprietary — see [LICENSE](./LICENSE). © Hestia Technology.
