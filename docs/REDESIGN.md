# Lensmart India — Redesign Notes

## 1. Audit (summary)
Next.js 15 App Router, ~60 legacy per-component stylesheets, each with its own hard-coded teal (#1b6b6a), white/grey surfaces, mixed fonts (Jost/Assistant, duplicate Google Fonts @imports), nested `<main>` elements on ~28 pages, no skip link, no shared tokens, infinite icon/marquee loops, no reveal or route feedback.

## 2. Creative direction
"Quiet optical boutique": warm ivory paper, charcoal ink, deep teal (the existing brand colour) as the single accent, a brass hairline for detail. Editorial serif display type over a clean UI sans. Motion is slow, transform/opacity only, and never loops except the announcement marquee.

## 3. Design system (src/styles/lm/tokens.css)
- Colour: ivory/paper/sand/stone/line, ink/ink-2/muted/faint, teal/teal-deep/teal-ink/teal-soft, brass, sale, ok.
- Type: Cormorant Garamond (display), Jost (UI/caps), Assistant (text — existing).
- Space scale, container 1320px, fluid gutter, radii xs→pill, shadows 1–4, focus ring.
- Breakpoints inherited from legacy (1351/1201/1025/768/600/480).
- Legacy variables (--teal, --nav-*, …) are bridged to the tokens.

## 4. Motion spec (src/components/MotionProvider.jsx + lm/motion.css)
- Easings: out (0.16,1,0.3,1), in-out, soft, spring. Durations 120/220/380/720/1100ms.
- Scroll reveals (rise / fade / mask / clip) with stagger via `--lm-d`; below-the-fold only.
- Hero progress dots, sticky-header state, FAQ photo parallax (only parallax on site).
- Route progress bar + soft fade of `#main-content`; skeleton shimmer.
- Hover lifts, CTA ink-fill, underline slides — all gated by `(hover: hover)` where it matters.
- `prefers-reduced-motion`: the `lm-motion` class is never added; all reveals visible, animations off.

## 5. Files changed
- New: `src/styles/lm/{tokens,base,motion,header,home,catalog,product,commerce,pages,footer}.css`, `src/components/MotionProvider.jsx`.
- `src/app/layout.jsx`: imports the layer, one font link, skip link, `<main id="main-content">`, viewport theme colour.
- `src/components/HeroSlider.jsx`: progress dot fill + decorative "01 — 03" counter (aria-hidden).
- ~28 pages/components: nested `<main>` → `<div>` (same classes).
- Legacy CSS: duplicate Google Fonts `@import` lines removed.

## 6. Preserved
No change to copy, product data, prices, offers, links, routes, API routes, cart/checkout/payment logic, lib/context/data. Verified by diff: only `.jsx` (the edits above) and `.css` files differ; no data/lib/api/context file differs.

## 7. Known issues / untested
- `npm install` and `next build` were not possible in the authoring environment; the app was not built or run under Next. Components were bundled with esbuild and checked in Chromium. Run `npm install && npm run build` before deploying.
- Display fonts could not be loaded in the test browser (network allowlist); typography was verified with fallback serif/sans only.
- WebGL sections (Perfect Shape, Exclusive Deals, lens showcase) were not visually verified; their canvas backgrounds are transparent so they sit on the ivory page.
- Not individually screenshot-checked: checkout, payment, confirmation, account/register, blog detail, policies, search, filled cart, cart drawer states.
- Added UI-chrome strings: "Skip to content" and the hero "01 — 03" counter.
- Tested widths 390/768/1100/1280/1440 for horizontal overflow on home, catalog, PDPs, and content pages; keyboard and screen-reader passes were not done with real assistive tech.

## 8. Cinematic hero + banner system (round 2, rebuilt)
Products and text are untouched; the banner *artwork* was replaced as permitted.

- **Live typography.** The hero headline, supporting line, brand line and button label are now real text, using the exact wording from the original banners ("Buy sunglasses, / See a brighter tomorrow", "Eyeglasses collection / Your world, clear and refined.", "Find your contact lenses / From the world's most trusted brands."). Links unchanged (/sunglasses, /eyeglasses, /contact-lenses). The Alcon / Johnson & Johnson / CooperVision / Bausch + Lomb logo row is an exact crop of the original artwork.
- **Imagery.** The original campaign photos are cropped from the same files and framed as optical shapes — a circular lens (sunglasses), an arch window (eyeglasses), a full-height feathered photograph (contact lenses). Real catalogue cutouts (tortoise sunglasses, blue eyeglasses, from /public/images) float in front of them.
- **Entrance (about 1.5 s, no loading delay):** page layout is immediate → the frame opens like an iris while the photo pulls into focus (a blurred twin fades out — opacity only) → headline words rise out of masks, staggered → supporting copy → button → lens rings draw in → product cutout flies in → one light glint. The slide direction (next/previous) flips the entry side.
- **Depth, not loops.** Three layers (atmosphere, photo frame, product) shift with the pointer on desktop and drift at different rates as you scroll out of the hero, so it hands off smoothly to the feature strip and categories. Nothing loops. Values are written as CSS variables in rAF, transform-only, scroll handler runs only while the hero is visible.
- **CTA:** ink fill sweeps in, arrow glides, soft shadow; full keyboard focus ring.
- **Carousel accessibility:** semantic `<article>` slides (inactive ones are `inert`), prev/next, dots with progress, ←/→ keys, Pause/Play, swipe, autoplay pauses on hover/focus/touch, live region goes polite when paused. Autoplay is 6.5 s (was 5 s) to let the sequence finish. With reduced motion: no autoplay, no animation, no pointer/scroll depth, pause button hidden.
- **Performance:** hero photos are 60–100 KB WebP crops (the old 2–4 MB PNGs are no longer loaded by the hero), cutouts ~55–70 KB, only transform/opacity animate, grid-stacked slides keep stage height stable (no layout shift), non-active slides are not interactive.
- **Scroll rhythm:** reveals vary by section — up (headings, features), clip-mask (category cards), scale-in (bestsellers, shape picker), from-right (deals, blog), from-left (lens showcase panel, FAQ photo), fade (brand strip), wipe (before/after).
- Files: `HeroSlider.jsx`, `styles/lm/hero.css`, `MotionProvider.jsx`, `styles/lm/motion.css`, `public/images/hero-*.webp` (new). The original hero PNG/JPEGs remain in /public/images, unused by the hero.
- Limits: verified by scrubbing the animation timeline in headless Chromium (desktop + 390px), not on a real phone; display fonts weren't available in the test browser (fallback serif shown); WebGL banners (deals, lens showcase) only get a container reveal; the three hero photographs are crops of existing photography — no new photography was possible.

## 9. Motion & interaction system (round 3)
See `docs/INTERACTION_AUDIT.md` for the full component-by-component table. Summary: unified tokens (durations, delays, stagger, distances, scale, easing), reusable primitives in `src/lib/motion.js`, a shared state layer `src/styles/lm/states.css`, real cart/wishlist feedback, animated exits for the cart drawer and discount popup, error/success/loading states, result-card entrance, loading screen that no longer blocks the header, and full `prefers-reduced-motion` support.

## 10. Carousel auto-advance (every 3 s)

Every carousel that has previous / next arrows now moves by itself every 3 seconds. The arrows, dots and swipe are unchanged.

| Carousel | Behaviour |
|---|---|
| Hero | cycles every 3 s (had its own timer; pause/play button kept) |
| Shop by Category | advances one card, wraps to the start at the end |
| Best Sellers, Lens Bestseller, Exclusive Deals, Perfect Shape, Perfect Sunglasses | already auto-played; timing unified to 3 s |
| Similar products / More from brand (all PDPs) | advances one step, wraps to the start |
| Sale page slider | 3 s |

Shared hook: `useAutoAdvance` in `src/lib/motion.js`. It pauses while the pointer hovers, while focus is inside, for 8 s after touch / wheel / key input, when the carousel is off-screen or the tab is hidden, and always under `prefers-reduced-motion: reduce`.

Testimonial slider: auto-advances every 5 s (longer, because it is text people need to read; change `delay` in `TestimonialSlider.jsx`). The blog slider is commented out on the home page, so it is not rendered.
