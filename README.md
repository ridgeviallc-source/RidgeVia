# RidgeVia Health — landing page

Public landing page for **RidgeVia Health**, served at [ridgevia.co](https://ridgevia.co).

RidgeVia LLC builds AI and software products across verticals. Health is the first.
The page presents RidgeVia Health and its flagship product, **Base Camp**
([basecamp.ridgevia.co](https://basecamp.ridgevia.co)), the AI operating system for
independent practices.

## What's here

```
index.html      The page. Semantic HTML, no framework, no build step.
styles.css      All styling. Palette and type tokens are at the top.
assets/         Mark (transparent PNG) and favicons.
render.yaml     Render static-site blueprint.
```

There is deliberately no bundler. The site is a single page; adding a section is an
edit to `index.html`, not a re-platform. If it ever grows past a few pages, move it to
Vite at that point, not before.

## Run locally

Any static file server works. Two that need no install:

```bash
python3 -m http.server 4173        # then open http://localhost:4173
# or
npx serve -l 4173 .
```

Absolute paths (`/styles.css`, `/assets/...`) are used so the page behaves the same
locally and on Render. Open it through a server, not as a `file://` URL.

## Deploy

`render.yaml` defines one static site. Connect the repo in the Render dashboard and it
picks the blueprint up. Point `ridgevia.co` at the Render service under the service's
Custom Domains tab; the domain currently resolves to a GoDaddy site-builder placeholder.

## Brand notes

- The name is written **RidgeVia** (capital V). Base Camp's legal pages still say
  "Ridgevia" and should be brought in line.
- The mark is the Base Camp campfire flame rotated 180°: two ridges with a river, the
  "via", running between them. Source raster lives in `assets/mark.png`, keyed to
  transparent. No vector exists yet; a flat SVG redraw was explored and parked.
- Palette is Deep Slate: ground `#0B1220`, surface `#121B2C`, text `#FFFFFF`,
  muted `#9AA6B8`, Health accent `#8FC7FF`, action blue `#3D8BFF`. Intentionally cool
  and distinct from Base Camp's warm cream, fig, and clay.
- Type is Instrument Sans throughout, loaded from Google Fonts, except the wordmark.
- The wordmark sets **RidgeVia** in Urbanist 800 and *Health* in Lexend 300, in the Health
  accent. Both are open-source stand-ins for SK Modernist and Nexa Pro, which are commercial.
  It lives in the `.wordmark` rules in `styles.css` and is used in the nav and the footer.
