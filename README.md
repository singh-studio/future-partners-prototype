# Future Partners — Prototype Preview (unlisted)

A faithful, hosted copy of the **Field Atlas** design prototype for Future Partners, published as an **unlisted** build for stakeholder review (Kirsty) ahead of any production-stack decision. Please don't share the link publicly.

> **This is a design prototype, not production code.** It runs React 18 + JSX transformed in-browser via Babel/CDN — ideal for showing the intended design, behaviour and content, but not how the real site will be built. The production rebuild (CMS, members area, CRM, SEO migration) is a separate, approved-pending workstream.

## Viewing

- Open `index.html` (root entry — a copy of `Future Partners - Field Atlas.html`).
- Requires an internet connection: React, Babel, d3, topojson load from unpkg; the Lexend font from Google Fonts; the world map data is fetched at runtime.
- Imagery (associate portraits, field photos, logos) is self-hosted in `assets/`.

## Privacy

- The repo is **public** — GitHub Free requires a public repo to use Pages. The *live page* is unlisted and unindexed, but the source is open. To keep the source private instead, host on Cloudflare Pages (free) or upgrade to GitHub Pro.
- `robots.txt` disallows all crawlers; `index.html` carries `noindex, nofollow`. This is *soft* privacy — it discourages indexing but does not gate access. For true access control, serve behind a login (e.g. Cloudflare Access).
- Do not share the URL publicly.

## What's inside

| Path | Role |
|---|---|
| `index.html` | Servable root entry (copy of the prototype HTML) |
| `Future Partners - Field Atlas.html` | The original prototype entry, kept verbatim |
| `app/` | All JSX modules + component/view CSS |
| `assets/` | Logos, favicons, associate portraits, field imagery |
| `fp.css` | Base/reset + layout primitives |
| `DESIGN-HANDOFF.md` | The original design handoff documentation |

The canonical design handoff lives untouched in The Forge; this repo is a deployment copy.
