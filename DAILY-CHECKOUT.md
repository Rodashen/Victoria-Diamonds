# Daily Sparkle online checkout

Adds customization on `daily-sparkle.html` and the Daily Sparkle section of `view-catalogue.html`. The existing catalogue and product photographs are retained.

## Customer flow

- Open a product, then choose **Customise & buy**.
- Choose gold (9K, 14K, 18K, 22K), silver (925, 990, 999), or platinum; Select/Luxe diamonds; carat and stone quantity; up to four diamond specifications; and piece quantity.
- Bracelets also offer the calculator's metal specification tiers.
- Choose 30%, 50%, or full payment. The server supplies the GBP total, amount due, and balance.
- Enter a name and email to request a secure Airwallex payment link. The form itself does not charge a card.

`daily-products.js` maps the 31 website products to calculator IDs and supplies their initial configurations and catalogue price snapshots. Quotes and payment amounts are recalculated by the calculator server; browser-supplied prices, discounts, profit, and design fees are not trusted by the new customer endpoints.

## Deployment dependency

Deploy the calculator changes **before** publishing this website change. Required endpoints:

- `POST /daily-sparkle/quote`
- `POST /daily-sparkle/payment-link`

The payment route rejects a changed expected total before creating a payment link. Existing Silver products remain fixed-price, full-payment-only purchases. Calculator changes also ensure bracelet tiers reach payment pricing and selected metal/purity appear in order receipts.

## Default specifications awaiting owner review

Aurora still has a conflicting total. Its local customization default follows the listed individual stones; its original description has not been corrected:

| Piece | Existing stated total | Total of listed stones used in preview |
| --- | --- | --- |
| Aurora Necklace | 2.7 ct | 2.2 ct |

Resolve these before publishing. Default 18K prices are recalculated for the selected stones and bracelet tier, so some differ from the previous static catalogue figures.

Owner confirmed the earring counts apply per pair and approved correcting Luminéa to 0.60 ct (6 × 0.10 ct) and Fiora to 1.60 ct (4 × 0.25 ct plus 4 × 0.15 ct). Both website pages and calculator presets now agree with checkout. Quantity one means one pair for these products. Default 18K Select prices are £1,263 and £1,625 respectively. Calculator preset loading supports an additional stone group for Fiora while retaining existing single-group presets.

## Verification

Run `node --test tests/daily-checkout.test.cjs` from this repository. Set `CALCULATOR_ROOT` to the calculator checkout path if it is not located at `../../calculator` relative to this repository.

Also run the calculator's `tests/daily-checkout.test.cjs` and `tests/silver-collection.test.js`. Payment-route tests substitute the external provider and email requests; they create no real payments or messages.

Local browser checks covered both catalogue entry points, metal and deposit changes, full-payment zero balance, bracelet tier changes, keyboard closing/focus return, phone layout, hiding the purchase action outside Daily Sparkle, and payment-service failure recovery. No live transaction was performed.
