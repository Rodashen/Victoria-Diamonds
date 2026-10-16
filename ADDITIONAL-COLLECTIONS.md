# Aura Silver and Keepsake additions

Added locally from the four supplied Word documents on 17 October 2026. No commit or deployment is included in this change.

- Aura: 15 pieces, including five pendants, five earring pairs and five bracelets. Starting prices match the document. Pendant chains are not included. Fixed earring and bracelet diamond arrangements are enforced; bracelet metal tiers retain the document Premium or Supreme package.
- Silver: 15 pieces with fixed Sterling 925 designs and document prices. Full payment only, following the existing Silver checkout.
- Keepsake Collection: 10 fixed-price Sterling 925 key rings and two personalised gold initial-charm designs. A and B are sample photographs of the same heart/circle products. All A–Z initials are selectable and validated on the payment server. The chosen initial is retained in the quote parameters and appended to the product name used for payment and production records. Keys are not included.

Product images are extracted from the documents and exported as square white-background WebP assets with 960 px thumbnails. They are design visualisations, not new photographs; the product pages disclose this. Original document media and source extracts remain outside the repository under `../design-review/new-collections/`.

The generated Keepsake hero is saved at `images/keepsake-collection-hero.webp`. It was made with the built-in image-generation tool, using the supplied silver heart key ring and gold heart initial charm as references. Prompt: preserve the two jewellery designs and their material colours; arrange them on warm ivory limestone with subtle silk and champagne sunlight, with quiet space for the website heading on the left; no added typography, keys or unrelated jewellery.

The new collection uses the shared collection cards, filters, product registry and checkout. It has canonical and social metadata, CollectionPage and ItemList JSON-LD, static product links, descriptive image alt text and sitemap entries. The homepage carousel, collection navigation and catalogue filters include Keepsake.

Calculator changes add `additional-collections.json`, extend the existing fixed-design rules, add the keepsake route and validate A–Z initials. Existing natural-diamond changes were preserved. Deploy the calculator before the website; live quote and payment-link creation depend on the new backend inventory. No real payments or emails were created during testing.
