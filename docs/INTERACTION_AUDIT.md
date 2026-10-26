# Lensmart India — Motion & Interaction System: audit report

Legend: **Implemented** = built · **Tested** = exercised in headless Chromium (desktop 1440 / mobile 390, with and without `prefers-reduced-motion`) · **Blocked** = not possible without changing app logic/architecture.

## 1. Motion language (src/styles/lm/tokens.css)
| Token group | Values |
|---|---|
| Micro / press | `--lm-dur-1` 120 ms, `--lm-dur-2` 200 ms |
| Hover / focus | `--lm-dur-hover` 260 ms (band 180–300) |
| Overlays, menus, drawers, modals | `--lm-dur-3` 320 ms |
| Page transition | `--lm-dur-page` 320 ms (route fade, WAAPI, never blocks navigation) |
| Scroll reveals | `--lm-dur-4` 560 ms (reveal variants 560–650 ms) |
| Photo zoom | `--lm-dur-img` 520 ms |
| Hero only | `--lm-dur-5` 1100 ms (+ hero choreography) |
| Loading loops | `--lm-dur-loop` 1600 ms |
| Delays | 60 / 120 / 200 ms |
| Stagger | 40 (fast) / 70 / 90 ms, capped at 8 items |
| Distances | 4 / 10 / 20 / 28 px |
| Scale | hover 1.02, press 0.97, photo 1.04 |
| Easing | `out` (default), `in-out` (drawers), `soft` (colour/opacity), `spring` (tiny confirmations only) |

Slow legacy transitions (>650 ms) in blog/offers/home/product sheets were retimed to tokens.

## 2. Reusable primitives
- `src/lib/motion.js`: `useBump(value)` (counter that rises only on a real increase), `useStoredCount` / `useStoredUnits` (localStorage-backed counts, single listener pair, cleaned up), `useAnimatedClose(onClosed, ms)` (exit animation for unmounting overlays; instant under reduced motion; timer cleared on unmount).
- `src/components/MotionProvider.jsx`: scroll reveals (up / fade / mask / clip / left / right / scale / wipe), header state, route progress + fade, one observer, MutationObserver rescan, full cleanup.
- `src/styles/lm/states.css`: shared state layer (zero-specificity baseline + specific real states), keyframes `lm-drop-in / rise-in / pop-in / shake / card-in / drawer-out / modal-out`. Press feedback uses the individual `scale` property so it never overwrites a component's own `transform`.

## 3. Component-by-component
| Component | Default | Hover | Pressed | Focus-visible | Loading / Success / Error / Disabled | Status |
|---|---|---|---|---|---|---|
| Announcement bar | static strip, slower marquee | — | — | ring | — (marquee stops under reduced motion) | Implemented |
| Header nav links, mega menus | yes | underline slide, menu rise + column stagger | — | ring; menus open on `:focus-within` | — | Implemented · Tested (earlier pass, keyboard open) |
| Mobile menu drawer | yes | — | scale press | ring | — | Implemented · Tested at 390 |
| Search (desktop / mobile) | pill | border tint | — | ring + expanding focus halo | mobile bar drops in on open | Implemented · Tested |
| Header cart / wishlist | icon | tint | scale | ring | **Success:** cart badge + icon pop only after the cart count really rises (`cartUpdated` fires after the localStorage write); wishlist badge pops on real add | Implemented · Tested (add → badge `1` → icon pop → drawer) |
| Hero slider | cinematic entrance | CTA ink fill + arrow glide | scale | ring | pause/play, autoplay pause on hover/focus/touch | Implemented · Tested |
| Category cards | clip reveal + stagger | lift, image zoom 1.04 | scale | ring | — | Implemented · Tested |
| Product cards (`.lm-card`) | staggered mount animation (capped 8) | image zoom, CTA ink fill | pressed shadow on touch | `:focus-within` border | wishlist heart: pop on real toggle | Implemented · Tested (animation present; none under reduced motion) |
| Product images / thumbnails | multiply on sand | slow zoom, thumb lift | — | ring | — | Implemented |
| Add-to-cart (PDP) | tracked-caps button | ink sweep | scale | ring | success = cart drawer + badge (only after real add) | Implemented · Tested |
| Contact-lens Rx form (selects, pills, switch, upload) | yes | border tint | stepper press | ring (incl. hidden-input boxes) | disabled stepper 55 % opacity | Implemented · Tested (render) |
| Wishlist buttons | heart | scale | scale | ring | pop on active | Implemented |
| Sort dropdown / filters / pagination | yes | tint | press | ring | disabled arrows/reset visibly disabled; drawer slides 320 ms | Implemented · Tested (mobile drawer open/close) |
| Variant selectors (colour / size) | pills | border | scale | ring | active = ink fill | Implemented |
| Quantity controls | yes | ink fill | scale | ring | disabled at minimum | Implemented |
| Forms (checkout, account, contact, newsletter) | inputs | border | — | ring + teal halo | **Error:** field shakes once, message drops in; newsletter loading = disabled "…" button; success pops | Implemented · Tested (checkout empty submit: 7 fields + messages; newsletter invalid) |
| Accordions (FAQ pages, product details) | yes | tint | — | ring | panel rise-in (`[hidden]` panels); grid-row height animation on FAQ pages (existing) | Implemented |
| Dialogs: cart drawer, discount popup | enter | — | — | focus trapped (existing) | **New exit animation**; Esc, overlay, close, continue all animate | Implemented · Tested (open → closing → unmounted; instant under reduced motion) |
| Dialogs that stay mounted: PDP lens panel, size-guide modal, filter drawer, toasts | enter + exit | — | — | ring | timing unified to 320 ms | Implemented |
| Blog modal | existing pop/fade | — | — | ring | — | Existing (unchanged) |
| Route loading screen | ivory, one progress line | — | — | — | appears after 160 ms grace, no longer covers header, non-blocking | Implemented |
| Footer links / newsletter / socials | underline slide | tint/lift | opacity | ring (brass on dark) | newsletter states above | Implemented · Tested |

## 4. Automated checks
- Focus audit across home, all-products, both PDPs, contact, FAQ, cart, checkout, about, how-to-order, shipping: every enabled control showed a visible keyboard focus state (the only non-matches were intentionally disabled controls, which cannot take focus).
- No hover/press transition above 650 ms on any audited control; every button has `cursor: pointer`.
- Reduced motion: no card, hero, reveal, error or drawer animations run; dialogs close instantly; autoplay is off.
- No horizontal overflow at 390 / 768 / 1100 / 1440 on audited pages.

## 5. Blocked / limits
- Sale page could not be rendered in the offline test harness (needs data/network), so its states were reviewed in CSS only.
- Real payment (Razorpay), Shopify login, and the newsletter API success path can't run offline; their success visuals are styled but not exercised.
- An error shake plays when a field *becomes* invalid; a second failed submit on an already-invalid field does not replay it (would need a counter in the page logic).
- Carousel dots keep their delicate look; hit areas were enlarged invisibly (≥24 px) but the audit script measures the visible element only.
- Not verified under `next build`, on real touch hardware, or with a screen reader.
- Added UI: a cart count badge in the header (derived from the same localStorage cart the drawer uses; shown only when the cart has items) and accessible "Pause slideshow" button. No cart logic, pricing, links or checkout code was changed.

## Addendum — carousel auto-advance
Implemented and tested in a browser harness: hero, Shop by Category (3 s steps, hover pause confirmed, reduced motion stops), Similar / Brand rows (advance, wrap to start, reduced motion stops). Reduced-motion guard added to BestSellers and Perfect Sunglasses. Not run under `next build`.
