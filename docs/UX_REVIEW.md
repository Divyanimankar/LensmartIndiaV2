# Customer-journey UX review

Reviewed as a first-time shopper on desktop (1440) and phone (390), using real pages: home, eyeglasses/sunglasses/contact-lens listings, product page, add-to-cart drawer, cart, checkout, mobile menu and search.

| Step | Finding | Action |
|---|---|---|
| Homepage discovery | Clear hero, feature strip, categories, bestsellers | none needed |
| Category navigation | Header menus, breadcrumbs and mobile menu are clear | none needed |
| Listing | Full-height banner (400px) pushed the first products below the fold | **Fixed**: banner capped at ~300px, cropped so baked-in headline stays visible (`ux.css`) |
| Search / filter | Filter groups, counts, reset and sort are clear; mobile Filters button is prominent | none needed |
| Product page | Price, discount, colour, size, quantity and Add to cart are well ordered; sticky Add to cart on phones | none needed |
| Add to cart | Drawer confirms with item, savings, subtotal and View cart | none needed |
| Cart / checkout | Clear steps, summary, terms and coupon; error states announced | none needed |
| Header cart icon | **Bug**: with items in the cart the cart icon was drawn twice (duplicate React key from the new badge animation) | **Fixed** in `Navbar.jsx` (desktop and mobile) |
| Animation | Welcome pop-up art floated forever beside a form | **Removed** (`ux.css`) |

## Animation audit
Looping animations that remain, each with a reason: announcement ticker and brand-logo marquee (both pause on hover/focus and stop for reduced motion). Entrance, hover, press, drawer/modal enter-exit, cart-badge pop, error shake and route progress all answer a user action or orient the user; they were kept. Hero depth and carousel motion respect reduced motion.

## Optional future recommendations (not implemented)
- Sticky "Proceed to checkout" on the phone cart (needs the terms checkbox and its error to stay in view).
- Two-up product grid on phones to shorten long listings.
- Virtual try-on, saved prescriptions: not present today, so not added.
