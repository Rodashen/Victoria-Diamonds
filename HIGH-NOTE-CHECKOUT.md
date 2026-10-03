# High Note online ordering

Local implementation, 3 October 2026. Do not push without owner approval.

The shared daily-checkout.js now supports both Daily Sparkle and High Note, including the combined catalogue. Matching includes the collection so the two Fiora Earrings designs remain distinct. High Note defaults and product IDs are in high-note-products.js. Starting custom selections use calculator presets; where no preset exists, the listed main stone is used if available. Customers can adjust all stone groups and materials before a server-confirmed price. Original catalogue descriptions and starting prices are retained; custom configurations can differ from the photographed piece.

22 pieces support customisation, quantity, 30%/50% deposits or full payment, and emailed secure payment links. Celestia Broche, Éternelle Broche and Lunaria Tiara remain price-on-request because the calculator does not price brooches or tiaras. Marquise and Round Tennis Bracelet has no matching calculator product and remains available by enquiry. No price has been invented for these four pieces.

Calculator changes were explicitly approved and applied locally to daily-checkout.js and server.js. New routes: POST /high-note/quote and POST /high-note/payment-link. They use the server's occasionWear collection, ignore client pricing/discount fields, and reject changed totals before payment-link creation. Daily Sparkle routes retain their existing behaviour. Deploy the calculator before publishing the website changes. Nothing is committed or pushed.

Verification: 22 products across 198 metal/payment combinations; altered prices; wrong-collection IDs; personal-quote exclusions; quote routes with no external side effects; mocked payment-link creation. Existing website and calculator Daily Sparkle tests pass. Local preview disables all real payment/email operations.

Local quote-enabled preview: http://127.0.0.1:8883/high-note-collection.html (design-review/highnote-preview.cjs). The ordinary 8882 static preview cannot obtain High Note quotes until the new backend is deployed.
