# RidgeVia Health

Public site for **RidgeVia Health**, served at [ridgevia.co](https://ridgevia.co).

RidgeVia LLC builds modern software for medical practices. The page presents RidgeVia Health
and its flagship product, **Base Camp** ([basecamp.ridgevia.co](https://basecamp.ridgevia.co)).

## What's here

```
index.html        Vite entry: meta, social tags, icons, a no-JS fallback.
src/              The page. React 19, Tailwind v4, Motion.
  App.jsx           Sections and copy.
  Console.jsx       The product demo shell (Triage, clinOS, Onboarding).
  ClinOS.jsx        Three conversations that play as you scroll to them.
  clinosData.js     Deterministic sample data and the box-plot and rank-test math.
  charts.jsx        The medication timeline and the box plot, drawn from theme tokens.
  useScrollPlay.js  Scroll-triggered, play-once timeline hook.
  Backdrop.jsx      The living gradient behind the page.
  design.jsx        The shipped design tokens (Graphite) applied as CSS variables.
  schemes.json      Graphite color tokens and the three wash colors.
  neu.js            Raised and inset shadow states, animatable.
  Wordmark.jsx      The wordmark and the flame mark.
  fonts.css         Self-hosted fonts (see below).
public/assets/    Favicons and the mark, copied to the site root untouched.
render.yaml       Render static-site blueprint.
```

## Run locally

Node 22 (see `.node-version`).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # writes dist/
npm run preview    # serves dist/
```

## Deploy

Render builds and publishes on every push to `main` of `ridgeviallc-source/RidgeVia`.

- Build command: `npm ci --ignore-scripts && npm run build`
- Publish directory: `dist`

Pull requests get Render preview builds. Open PRs against `ridgeviallc-source/RidgeVia`, the repo
Render watches. A PR into any other copy of the repo will not deploy.

## Design

- **Look:** soft, raised and inset surfaces on a single ground (neumorphism), with one light source
  top-left. Every color, shadow and font is a CSS variable, set once in `design.jsx`.
- **Palette (Graphite):** ground `#E8E9EC`, ink `#15171A`, red `#D92D20` for red flags only, and deep
  mint `#087F5B` for "Health". True mint is 1.4:1 on a light ground, so the deep step is used.
- **Background:** a slow-moving gradient from three wash colors. Each wash keeps every text color at
  4.5:1 or better (7:1 for headings) even at full opacity, so it cannot hurt legibility. It moves with
  transforms only and stays still for visitors who prefer reduced motion.
- **Type:** Mona Sans (headings), Geist (body), Geist Mono (numbers, times, chart figures), Urbanist and
  Caveat (wordmark). All are open-source (OFL-1.1) variable fonts from Fontsource, Latin subset, self-hosted.
- **Wordmark:** **RidgeVia** in Urbanist 800, pure black, and *Health* in hand-lettered Caveat 700,
  deep mint with a glossy finish (`.health-gloss` in `index.css`). Urbanist is an open-source stand-in
  for SK Modernist, which is commercial. The flame is the mark, drawn in black. The wordmark lives
  in `Wordmark.jsx`.
- **Demo data:** everything in the Base Camp demo (messages, conversations, files, charts) is synthetic
  and is labeled as sample or illustrative on the page. Do not present it as real results.

## Brand notes

- The name is written **RidgeVia** (capital V). Base Camp's legal pages still say "Ridgevia" and
  should be brought in line.
- The mark is the Base Camp campfire flame rotated 180°: two ridges with a river, the "via", running
  between them. The source raster is `public/assets/mark.png` (transparent). No vector exists yet.
