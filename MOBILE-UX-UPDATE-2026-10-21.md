# Mobile browsing update — 21 October 2026

## Delivered

- Homepage: compact mobile header, grouped collection/type navigation, larger touch controls, and a swipeable collection carousel with a glimpse of the next collection. Collections remain the first shopping content.
- Homepage, seven collection pages and full catalogue: existing filter controls appear in a mobile panel, with clear/apply actions and removable selected-filter chips. Desktop retains inline controls. Search terms also appear as removable chips where search is available.
- Collection and product pages: compact mobile menu with real links to collections, jewellery types, appointments, the Journal and diamond pricing.
- Shared product cards: clearer spacing and ordering labels distinguishing online customisation, fixed designs with full payment, and appointment-only pieces.
- Product page: improved mobile option grids, readable form fields, summary spacing, touch targets, and an unobstructed square product image.
- Keyboard support: modal filter/menu panels, Escape closing, focus return, and focus containment in the homepage menu.

## Files

New shared assets: `mobile-browsing.js`, `mobile-browsing.css`.

Updated behaviour/styles: `landing-page.js`, `victoria-diamonds.js`, `product-cards.js`, `product-page.css`.

Asset integration/cache versions: `index.html`, `daily-sparkle.html`, `high-note-collection.html`, `forever-bond.html`, `silver-collection.html`, `aura-collection.html`, `mens-collection.html`, `keepsake-collection.html`, `view-catalogue.html`, `product.html`.

## Verification

- All 27 existing automated tests passed, including product identity/assets, custom pricing, fixed designs, deposits, Silver prices, stacking set/design fees, SEO and Journal metadata.
- Browser checked all seven collection pages, homepage, catalogue and an Atlas Band product page on mobile. No horizontal overflow in those tested views.
- Product page also checked at 320 px and 430 px widths; homepage and catalogue checked at 1280 px with inline filters restored.
- Homepage ring filtering displayed all 86 matching rings across collections; removing the chip restored the carousel.
- Collection search and Clear all verified; keyboard Escape and focus return verified on the homepage menu.
- Existing homepage SEO heading, metadata, structured data, visible diamond pricing and real product/collection URLs retained. Brand palette and payment logic unchanged.

## Boundaries

No calculator/backend changes, new subscriptions, cart or payment provider changes were required. No real order, payment or newsletter submission was made.

The localhost product preview could not obtain a live quote. The calculator's existing CORS list permits the production domains and localhost:3000, but not this preview's 127.0.0.1:8894 origin. Server pricing regression tests passed; live transaction completion was not tested in this visual update.
