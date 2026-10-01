## Overview

This project uses the following tech stack:
- Vite
- Typescript
- React Router v7 (all imports from `react-router` instead of `react-router-dom`)
- React 19 (for frontend components)
- Tailwind v4 (for styling)
- Shadcn UI (for UI components library)
- Lucide Icons (for icons)
- Framer Motion (for animations)
- feral-react-gradient (`Lagoon.jsx`) — the watercolour engine behind the landing hero

All relevant files live in the 'src' directory.

Use bun for the package manager.

![Landing page — fullscreen animated Lagoon watercolour with LoRa signal rings](docs/landing.png)

## Colour and type: CLEAR HANADA + Instrument Serif

The site runs on the CLEAR HANADA stop (`#30A7A0`) from the `Lagoon`
watercolour recipe. The primary is that hue darkened one tonal step to `#157A72`
so white button text keeps AA contrast; chart slots follow the hanada → lagoon
ramp rather than the old pink M3 set.

No surface on the site is pure white. `public/lagoon.jpg` is the full 1920×1080
lagoon render with the "Project Agora" wordmark baked into its middle band;
`public/lagoon-paper.svg` wraps it in a 900×450 `viewBox` that crops to the
wordmark-free upper-left quadrant and lays a 66% white veil over it, so the tile
reads as pale paper. The `body` in `src/index.css` repeats that tile at 720px with
`background-attachment: fixed`, and the base tokens moved off white accordingly
(`--background: #f6fbfa`, `--card: #fbfefe`, surface tiers into the lagoon
family). `prefers-reduced-transparency` drops the image and falls back to the
flat token colour.

Because that paper lives on `body`, nothing opaque may sit on top of it on the
documentation pages, and `AppHeader` is `bg-background/80 backdrop-blur-md`
rather than a solid bar — a fixed opaque header would mask the paper across the
full width of every page. The landing is the one deliberate exception: its hero
is finished artwork, and it is meant to cover the paper.

## The landing is the artwork

`Lagoon.jsx` in the repo root is the generated feral-react-gradient export whose
recipe is `Lagoon`: an animated WATERCOLOR wash — five soft washes laid over
paper grain and driven by its own clock. `src/pages/Landing.tsx` stretches that
component across the whole first viewport (`position: absolute; inset: 0;
aspectRatio: auto`) instead of leaving it in its natural 2048×1506 box, so the
page itself is the piece. `.gradient-lagoon` stays behind it purely as a flat
fallback colour field, and `src/components/site/SignalBurst.tsx` draws the
BrandMark's LoRa arcs at poster scale over the wash — four staggered pulses, a
dashed orbit, a beacon dot — with the keyframes in `src/index.css`, all of them
switched off under `prefers-reduced-motion`.

The copy is deliberately minimal (wordmark, one line, two links) and reveals
with a Framer Motion fade-up that is skipped entirely when the visitor prefers
reduced motion. The guides/range entry cards and the footer band were dropped
from this page; the header nav carries those links. Display type is Instrument
Serif (headings, wordmark); body and code stay on Roboto. Instrument Serif ships
one weight, so headings are pinned to `font-normal` rather than asking for a
synthesised bold.

`src/components/site/LagoonWash.tsx` was the earlier hand-rolled CPU wash. The
generated engine replaced it on the landing, no import referenced it, and the
file has been deleted rather than left to rot.

Below the hero, `src/components/site/LandingIntro.tsx` adds the German project
content: what AGORA is, three live figures, and the list of sections. The hero
itself was not touched — it is only boxed into a fixed-height `<section>` so
something can follow it. `docs/landing.png` still shows the hero as delivered
and says nothing about what is now underneath it.

## The AGORA pages (German)

Nine pages carry the school project, in German, alongside the English guides and
range pages:

| Route | Page | What it is |
| --- | --- | --- |
| `/live` | Live-Daten | Last reading per node, with the age of every measurement |
| `/statistiken` | Statistiken | Series, min/avg/max and the uplink log; node and range live in the query string |
| `/karte` | Karte | Station, nodes and per-spreading-factor range circles |
| `/station` | Funkstation | Hardware, specs, energy budget, and the five-stage signal path |
| `/lorawan` | LoRaWAN | Uplink/downlink, ALOHA, and a real airtime calculation |
| `/funktechnik` | Funktechnik | Frequency, range per SF, link budget, per-node headroom |
| `/glossar` | Glossar | 16 terms, grouped along the signal path |
| `/projekt` | Projekt | Roles, build, current status |
| `/export` | Export | CSV and JSON per node and range |

`src/components/data/ArchitectureDiagram.tsx` is the numbered rail used on both
`/station` and `/projekt`; `src/components/data/StationMap.tsx` is the SVG map.
The map is hand-drawn rather than tiled on purpose — a Leaflet layer would need
the network to answer, which is a bad property for a page demonstrated in a
classroom, and the footprint is under two kilometres across. The projection
carries a cos(latitude) correction so the range circles stay circular; Mercator
would shear them and quietly misstate the reach.

### The 404 is a blue screen on desktop

`src/pages/NotFound.tsx` is a single switch and nothing else:

```tsx
return coarsePointer ? <NotFoundLagoon /> : <NotFoundBlueScreen ... />;
```

On a device with a fine pointer, `NotFoundBlueScreen` fills the viewport with
system blue `#0000AA`, sets monospaced white type, and centres a panel in the
manner of the crash screens a Windows 3.1 or 95 machine used to show — a `STOP:
0x00000404` header, the failing path, and a reverse-video bar at the bottom.
Pressing any key returns to `/`. The handler is bound on `window`, removed on
unmount, and deliberately does not `preventDefault`, so Ctrl+R still reloads.

The panel is `role="alert"`, and it was `alertdialog` until that was looked at
properly. A dialog role promises a focus trap, modality and focus-on-open, and
this page does none of them: it contains no focusable element at all and focus
is never moved into it. `alert` is a live region for an important message, which
is what a route change into "that address does not exist" is, and it carries no
focus contract to break. `aria-describedby` went at the same time, because in a
live region the body text is both the content and the description.

On a touch device that screen would be a trap with no exit, because a keypress
is the one input it cannot produce. There the route renders the lagoon artwork
and two links. `useCoarsePointer` in `src/hooks/use-coarse-pointer.ts` is the
only place the decision is made. It reads `(pointer: coarse)` once per mount
and ignores `navigator.maxTouchPoints` on purpose: a touchscreen laptop reports
touch points but also owns a fine pointer and a keyboard, which is exactly the
machine the blue screen is for.

`SignalBurst` went back to being a plain `<svg>` with no `style` prop once
nothing needed to hand it motion values.

### One hero, two callers

`src/components/site/Hero.tsx` owns the full-screen lagoon composition: the wash
import and its stretch, the signal-ring position, the paper veil, the easing
curve, the reveal variants and the link styling. `Landing.tsx` and
`NotFoundLagoon` render it and supply only words and links. They were 64
identical lines apart before, which meant every hero change had to be written
twice.

`Hero` renders no `main` landmark, because on the landing that belongs to the
project content further down the page; the touch 404 wraps it in a `main`
itself. `AppHeader` is left to the caller so it stays a sibling of the hero
rather than moving inside it. `PageHero` is a different composition on purpose
— a 52svh band with a kicker and a lede for interior pages — and keeps its own
layers.

### Design system additions

The new pages extend the landing's vocabulary rather than inventing a dashboard.
`site/PageHero.tsx` is the hero shortened to 52svh with a title in it, reusing
the same three layers and steering `Lagoon.jsx` only through its props.
`site/Figure.tsx` sets a number like a figure in a report — label, large value,
caption, one hairline above it, **no card**. `site/Reveal.tsx` is the landing's
fade-up lifted out so it stops being copy-pasted; `Landing.tsx` keeps its own
inline variants because that hero arrived finished in one commit and is not worth
re-plumbing. `site/DataTable.tsx` is a ruled table, `site/LiveBadge.tsx` an
age indicator.

`Figure` has a `variant="ticking"` that switches to the sans face with tabular
figures. Instrument Serif has no tabular figures, so a value that rewrites every
few seconds visibly jitters in it — the wrong signal on a page whose job is to
say whether a number changed.

## Where the numbers come from

`src/lib/telemetry.ts` is a pure, deterministic model of the station.
`valueAt(node, ts)` takes a timestamp as an argument, never reads the clock and
never calls `Math.random()`, so the same node and timestamp always produce the
same reading. It contains the physics rather than a lookup table: free-space
path loss with terrain shadowing for RSSI, a diurnal curve plus a slow weather
front for temperature, and the Semtech AN1200.22 formula for airtime. Roughly one
slot in sixteen is a real gap, so the charts show that the data is not a smooth
invention.

`src/data/fixtures.ts` is the one place the station is configured, and the one
place the coordinates are wrong. **The lat/lng there are placeholders**,
roughly central Berlin so the map has a sensible area to project. Replace them
and the range model, the link budget, the map and the airtime table all follow,
because they all read the same numbers.

`src/data/measurements.ts` is the seam every page reads through. Each function
takes `now` rather than reading the clock, so a caller can freeze time and the
export can never disagree with the screen. Today the bodies call the generator;
when a backend is connected they become query calls and no page changes.

### Where a backend would plug in

There is no backend, and the site is built so that adding one is a local change
rather than a rewrite. `src/data/measurements.ts` is the only module a page
imports for readings, so it is the only file that has to change.

The data model the pages already imply: one row per school campus, one row per
battery node belonging to a campus, a readings row per decoded uplink
(temperature, humidity, soil moisture, pressure, plus the link quality measured
on receipt), and a separate uplinks row for raw frame metadata. The two indices
worth having are `(nodeId, ts)` for a node's history and `(ts)` for everything
in a time window. `stations` and `nodes` come straight from
`src/data/fixtures.ts`.

Because the generator is a pure function of (node, timestamp), a backend
serving the same values serves the numbers the site shows today.

![Guides placeholder](docs/guides-placeholder.png)

The guides and range pages are honest placeholders until real build notes and
measured field results exist: `src/data/guides.ts` and `src/data/range.ts` held
invented content and were deleted. Both pages now render the shared
`ComingSoon` component in `src/components/site/ComingSoon.tsx`.

## Setup

`bun install`, then `bun run dev`.

## Environment Variables

None. The site has no backend and no build-time secrets, so there is no `.env`
to configure.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds on every push to `main` and publishes `dist/`. Pages only serves the static frontend, so there is no server component to host.

**The build needs no credentials at all.** Every page answers from the deterministic model in `src/lib/telemetry.ts` over the fixtures in `src/data/`, so there is no backend and nothing to configure.

Repository **Actions → Variables** (both optional):

| Variable | Required | Purpose |
| --- | --- | --- |
| `BASE_PATH` | no | Overrides the mount point. Leave unset unless the derived one is wrong. |
| `PAGES_DOMAIN` | no | When set, the workflow writes `dist/CNAME` for custom-domain hosting. |

In the repository, set **Settings → Pages → Source** to **GitHub Actions** once, before the first run.

### Custom domain vs subpath

The workflow's `Resolve base path` step derives the mount point itself: `/<repo>/` for a project site, `/` when `PAGES_DOMAIN` is set, and `vars.BASE_PATH` when that is set explicitly. This is derived rather than left to a variable because the failure is silent — an unset `BASE_PATH` builds `base: "/"`, every `/assets/*` URL 404s, and the deployed site is a blank page with a green build. A `Verify base path was applied` step then asserts the base reached both `dist/index.html` and the rewritten `dist/404.html` before the artifact is uploaded.

`<BrowserRouter basename={import.meta.env.BASE_URL}>` in `src/main.tsx` reads the same value. Without it a project site served from `/project-agora/` matches no route at all: the router sees `/project-agora/` where it expects `/`, so every URL renders the 404 page. `public/.nojekyll` stops Jekyll from stripping `_`-prefixed build output.

### Deep links

GitHub Pages has no SPA rewrite, so `/glossar` or `/dashboard` would serve its 404 rather than the app. `public/404.html` parks the requested path in `sessionStorage` and redirects to the base; `src/main.tsx` restores it with `history.replaceState` **before** `createRoot`, so the router's first render already sees the right URL and there is no visible redirect. The 404 is rewritten for the base at build time by the `pagesFallback` plugin in `vite.config.ts`, because `public/` is copied verbatim and cannot read `base` at runtime.

### No credentials, and no codegen

The build needs no secrets. There is no backend and no Convex deployment — `src/convex/` was removed along with `convex.json`, and the only remaining mentions of Convex in `src/` are comments about where a backend would plug in. The workflow's `bunx convex codegen` step is gone for that reason; leaving it in made every run fail before the build even started, because `CONVEX_URL`, `CONVEX_DEPLOYMENT` and `CONVEX_DEPLOYMENT_KEY` were never configured. If a backend is ever added, codegen belongs back in the workflow, and the generated types must stop being gitignored if `tsc -b` is to resolve them.

### One known build blocker — resolved

An earlier state passed `2` as the second argument to `formatNumber`, whose
signature in `src/lib/format.ts` was `digits: 0 | 1`. `vite build` does not
typecheck, so the site still ran, but `tsc -b` inside `bun run build` failed and
turned the workflow red. `formatNumber` now accepts `0 | 1 | 2`, which is what
the LoRa data rates need — 0.25 kbit/s at SF12 rounds to "0" at zero decimals
and to a correct "0,3" at two.

`tsc -b` is now clean, with no errors and no exclusions.


# Frontend Conventions

You will be using the Vite frontend with React 19, Tailwind v4, and Shadcn UI.

Generally, pages should be in the `src/pages` folder, and components should be in the `src/components` folder.

Shadcn primitives are located in the `src/components/ui` folder and should be used by default.

## Page routing

Your page component should go under the `src/pages` folder.

When adding a page, update the react router configuration in `src/main.tsx` to include the new route you just added.

## Shad CN conventions

Follow these conventions when using Shad CN components, which you should use by default.
- Remember to use "cursor-pointer" to make the element clickable
- For title text, use the "tracking-tight font-bold" class to make the text more readable
- Always make apps MOBILE RESPONSIVE. This is important
- AVOID NESTED CARDS. Try and not to nest cards, borders, components, etc. Nested cards add clutter and make the app look messy.
- AVOID SHADOWS. Avoid adding any shadows to components. stick with a thin border without the shadow.
- Avoid skeletons; instead, use the loader2 component to show a spinning loading state when loading data.


## Landing Pages

You must always create good-looking designer-level styles to your application. 
- Make it well animated and fit a certain "theme", ie neo brutalist, retro, neumorphism, glass morphism, etc

Use known images and emojis from online.

If the user is logged in already, show the get started button to say "Dashboard" or "Profile" instead to take them there.

## Responsiveness and formatting

Make sure pages are wrapped in a container to prevent the width stretching out on wide screens. Always make sure they are centered aligned and not off-center.

Always make sure that your designs are mobile responsive. Verify the formatting to ensure it has correct max and min widths as well as mobile responsiveness.

- Always create sidebars for protected dashboard pages and navigate between pages
- Always create navbars for landing pages
- On these bars, the created logo should be clickable and redirect to the index page

## Animating with Framer Motion

You must add animations to components using Framer Motion. It is already installed and configured in the project.

To use it, import the `motion` component from `framer-motion` and use it to wrap the component you want to animate.


### Other Items to animate
- Fade in and Fade Out
- Slide in and Slide Out animations
- Rendering animations
- Button clicks and UI elements

Animate for all components, including on landing page and app pages.

## Three JS Graphics

Your app comes with three js by default. You can use it to create 3D graphics for landing pages, games, etc.


## Colors

You can override colors in: `src/index.css`

This uses the oklch color format for tailwind v4.

Always use these color variable names.

Make sure all ui components are set up to be mobile responsive and compatible with both light and dark mode.

Set theme using `dark` or `light` variables at the parent className.

## Styling and Theming

When changing the theme, always change the underlying theme of the shad cn components app-wide under `src/components/ui` and the colors in the index.css file.

Avoid hardcoding in colors unless necessary for a use case, and properly implement themes through the underlying shad cn ui components.

When styling, ensure buttons and clickable items have pointer-click on them (don't by default).

Always follow a set theme style and ensure it is tuned to the user's liking.

## Toasts

You should always use toasts to display results to the user, such as confirmations, results, errors, etc.

Use the shad cn Sonner component as the toaster. For example:

```
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
export function SonnerDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        })
      }
    >
      Show Toast
    </Button>
  )
}
```

Remember to import { toast } from "sonner". Usage: `toast("Event has been created.")`

## Dialogs

Always ensure your larger dialogs have a scroll in its content to ensure that its content fits the screen size. Make sure that the content is not cut off from the screen.

Ideally, instead of using a new page, use a Dialog instead. 

