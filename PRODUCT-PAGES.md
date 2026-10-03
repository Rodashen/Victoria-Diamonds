# Dedicated product pages — local implementation

All 113 catalogue entries have stable product links. Cards, search results and the Hideo review open `product.html?item=<id>` in a new tab. Original catalogue filters and scroll position are retained. Legacy collection `?piece=<name>` and product-name hashes redirect to their product page.

## Checkout coverage

- Daily Sparkle: 31 custom products.
- High Note: 23 custom products. Celestia Broche, Éternelle Broche and Lunaria Tiara are appointment-only, explicitly confirmed by the owner on 2026-10-03. No payment controls for these three.
- Forever Bond: 20 custom products.
- Aura: 19 custom products.
- Silver: 17 fixed-price products, quantity one and full payment only.

Custom checkout offers calculator-supported metal, karat/purity, stone quality, size/count, bracelet tier and quantity, with 30%, 50% or full payment. The server determines prices and collection identity and rejects stale totals before creating an emailed payment link. Existing original photos and brand colours are retained. No invented stock, reviews or gallery angles.

## Specification handling

`remaining-products.js` maps Forever Bond/Aura to calculator IDs and adds High Note's Marquise and Round Tennis Bracelet using the calculator's matching alternating-tennis preset. Explicit catalogue stone groups are loaded where available, without using total carats as a per-stone size. Nine products without a usable breakdown require the customer to select a stone size or no diamonds before quoting. New custom configurations require review of stone sizes/counts. Ring sets use set labels.

Original catalogue details and historic display prices are preserved; they are not authoritative checkout quotes. Some catalogue total weights do not agree with listed individual stones. The product page distinguishes original design details from selected order specifications and quotes the latter. Do not silently reconcile physical specifications from price arithmetic.

Homepage featured Solstice retains its enquiry link because its description differs from the Daily Sparkle catalogue item. Do not route it to a potentially different product without owner clarification.

## Local preview and release

From the parent workspace run `node design-review/highnote-preview.cjs 8884` for real local calculator quotes with all payment/email POST requests blocked. Static preview on port 8882 uses this local quote server; the preview server permits only loopback origins on 8882–8884. A `checkout-api` meta tag can override the local API. Production uses the existing Render API.

Calculator changes in `../calculator/daily-checkout.js` and `../calculator/server.js` are local and must be deployed before publishing the website: new quote/payment routes are `/high-note`, `/forever-bond`, `/aura` alongside `/daily-sparkle`. No changes to pricing tables were made.

Nothing committed or pushed. User approval is required before release.

## Verification

- 14 automated tests passed, including 113 unique product links/assets, 17 fixed Silver prices, all 93 custom pieces across three metals and three payment choices (837 combinations), tampering protections, collection isolation and mocked payment creation for the added routes.
- Existing Daily Sparkle and High Note pricing tests pass.
- Browser verified all five individual collection pages (31/26/20/17/19 links), combined catalogue (113 links), new-tab navigation without opening the old modal, live quotes, deposits/full payment, no-diamond wedding bands, mobile layout, Traditional Chinese and booking-only content.
- Local payment failure was tested with the payment-disabled preview; no real payment link or customer email was created.
- Syntax, local references/assets and Git whitespace checks passed.
