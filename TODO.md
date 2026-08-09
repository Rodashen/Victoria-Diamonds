# TODO

## Task: Show only Center Stone / Total Carat on product cards; hide extra details behind popup toggle

**Goal:** Product cards should only display `Center Stone` and `Total Carat` detail rows. All other detail keys (mainSide, secondarySide, finishingSide, sideStone, eachDiamond, mainDiamond, secondaryDiamond, diamonds, note, weight) are hidden on the card and only appear in the product popup behind the "View full details" toggle.

### Plan
- [x] Understand the modal popup implementation across all 5 catalogue files
- [x] `getMetaHTML` (product card): filter to only render `centerStone`/`totalKarat` rows in all 5 files
  - [x] view-catalogue.html
  - [x] silver-collection.html
  - [x] daily-sparkle.html
  - [x] occasional-wear.html
  - [x] forever-bond.html
- [x] view-catalogue.html & silver-collection.html: switch popup from `setModalMeta` (copies card HTML) to data-driven `getModalMetaHTML` so the popup still shows ALL details via the toggle
- [x] Ensure the toggle handler sets inline `style.display` (overrides `style="display:none"` on `.modal-details-extra`) in `view-catalogue.html` and `silver-collection.html` so expansion works
- [x] Verify popup behavior: Center Stone + Total Carat visible, "View full details" toggle reveals the rest, price last

## Task: Mobile optimization for catalogue pages

**Goal:** Fix the catalogue header overflow on narrow screens and make the product modal a proper mobile bottom sheet that scrolls independently.

### Plan
- [x] Mobile header: allow the `.catalogue-header .inner` row to wrap; on ≤768px show Back + brand on the first row and move the controls (language selector, icons, Book button) to a full-width second row; on ≤480px hide the Instagram/WhatsApp circular icons and let the Book button fill available width.
  - [x] view-catalogue.html
  - [x] silver-collection.html
  - [x] daily-sparkle.html
  - [x] occasional-wear.html
  - [x] forever-bond.html
- [x] Mobile modal: on ≤600px convert the popup into a bottom sheet (full width, rounded top corners, aligned to bottom, image reduced to 40vh, tighter body padding, and `.modal-body` scrolls independently so expanded details are always reachable).
  - [x] view-catalogue.html
  - [x] silver-collection.html
  - [x] daily-sparkle.html
  - [x] occasional-wear.html
  - [x] forever-bond.html
- [x] Verify desktop layout unchanged; mobile header wraps and modal behaves as a bottom sheet.

## Task: Catalogue price & gem-spec updates

**Goal:** Update product prices, center stone sizes, side stone sizes, and total carat values across the catalogue per the user's change list, while strictly preserving original product names and avoiding duplicate entries.

### Plan
- [x] Silver Collection (view-catalogue.html + silver-collection.html): Curved Silver Band→97, Crescent Silver Ring→129 (center 0.25, side 0.05x4, total 0.45), Simple Chain Necklace→87, Little Drop Necklace→79, Round Stud Earrings→134, Flower Drop Earrings→134
- [x] Daily Sparkle Rings: Aurelia/Elara/Raya/Gianna/Mirabelle/Nova/Solitaire/Diamond Dust→1375 (1ct center), Solenne→1490, Élan→1515 (side 0.15x4, total 1.6), Timeless Classic→1467 (side 0.10x4, total 1.4), Princess→1955 (center 2, side 0.75x2), Aurelle→1625, Eternity Stacking→1499 (0.10x17, total 1.7), Splendor Stacking→1540, Cascade→1375, Nocturne→1375
- [x] Daily Sparkle Necklaces: Luvia→1950 (0.05x30, total 1.5), Virelle→2575 (1 each, total 4), Serenity→2101 (center 1, side 0.10x12, total 2.2), Celeste→1967 (center 1, side 0.10x4 + 0.05x4, total 1.6), Aurora→2286 (center 1, side 0.50x2 + 0.10x7, total 2.7), Solstice→2285 (center 1, side 0.10x20, total 3)
- [x] Daily Sparkle Earrings: Luminéa→1421 (total 1.2), Fiora→1513 (total 1.6), Martini Studs→1625 (total 2)
- [x] Daily Sparkle Bracelets: Auréa→1499 (center 1, 0.15x8, total 2.2), Solenne→1522 (center 0.75, 0.15x4 + 0.10x4, total 1.75), Liora→1735 (center 1, 0.25x4, total 2), Celeste→1832 (total 2.9), Lumière→1401 (0.10x12, total 1.2)
- [x] Occasional Wear Rings: Amour→1965 (0.15x24, total 3.6), Tranquility→1398 (center 1, total 1.1), Athena→1525 (center 1, 0.05x12, total 1.6), Fae→1575 (center 1, 0.05x16, total 1.8), Skylar→1720 (center 1, 0.10x15, total 2.5), Promise of Forever→1525 (center 1, 0.05x12, total 1.6), Celestia→1488 (center 1, 0.05x9, total 1.45), Rosé Bloom→2000 (center 1, 0.05x50, total 2.75), Elysia→1525 (center 1, 0.05x30, total 2.5), Lunelle→1875 (center 1, 0.05x40, total 3), Victorian→1775, Imperial Pavé→3415 (0.01x80, total 8), Venus→3225 (center 3, 0.50x2 + 0.05x40, total 6), Éternelle Grande→2565 (0.25x16, total 4), Amora→1802 (unchanged)
- [x] Occasional Wear Earrings: Round Illusion→1410, Fiora→1475 (total 2.8)
- [x] Occasional Wear Bracelets: Lumina Tennis→1677, Arabella→1825
- [x] Forever Bond Rings: Amour Éternel→1875 (0.50x5, total 2.5), Lumiere Eternity→request, Eternal Connection Set→2590 (r1 0.25, r2 1, total 1.25), Stellar Promise→1467 (0.10x4, total 2.4), Everlasting Embrace→1850 (0.05x18, total 2.9), Destiny Couple (Eternity values)→2296 set (0.10 each, total 0.2), Bound by Destiny→request, Eternal Promise Set→2760 (total 1.6), Eternal Harmony→1625 (0.05x20, total 2), Eternal Promise→1575 (total 1.25), Élégance Unie→1575 (0.05x16, total 1.8), Endless Devotion→1600 (0.05x18, total 1.9), The Knot→1375 (0.05x20, total 1), Moment to Shine→1850 (0.15x10 + 0.05x10, total 3), Celestial Embrace→2928 (0.25x6 + 0.05x25, total 4.75), Luminous Devotion→2305 (0.10x10, total 3), Ethereal Halo→2450 (0.05x30, total 3.5), Elysian→2875 (0.05x36, total 4.8)
- [x] Verify no product names changed; no duplicate entries
- [x] Restore Unbreakable Hearts Ring & Wedding Bands (not in change list)

## Task: Sync mobile/dedicated collection pages with main catalogue (website)

**Goal:** Ensure the dedicated collection pages (silver-collection.html, daily-sparkle.html, occasional-wear.html, forever-bond.html) show the exact same product info and prices as the main catalogue (view-catalogue.html), since the mobile menu links to these dedicated pages.

### Plan
- [x] Recreate missing/incomplete dedicated collection pages with full product data matching view-catalogue.html
  - [x] daily-sparkle.html (31 products: rings, necklaces, earrings, studs, bracelets)
  - [x] occasional-wear.html (22 products: rings, earrings, bracelets, brooches, tiara)
  - [x] forever-bond.html (20 rings, incl. wedding bands)
  - [x] silver-collection.html existed with correct data (16 products)
- [x] Verify all prices, center stone, total carat, and gem-spec details match view-catalogue.html on every page
  - [x] Silver Collection prices (Everyday 79, Simple Chain 98, Little Drop 87, Every Pendant 87, etc.)
  - [x] Daily Sparkle rings (all 1375/1490/1515/1467/1955/1625/1516/1540)
  - [x] Daily Sparkle necklaces (Luvia 1950, Virelle 2575, Serenity 2101, Celeste 1967, Aurora 2240, Solstice 2285)
  - [x] Daily Sparkle bracelets (Auréa 2266, Solenne 1522, Liora 1735, Celeste 1832, Lumière 1401)
  - [x] Occasional Wear (all rings, earrings, bracelets, brooches, tiara)
  - [x] Forever Bond rings (all 20 rings)
- [x] Confirm product counts match (view=89; silver=16, daily=31, occasional=22, forever=20)
- [x] Confirm index.html links to all dedicated collection pages correctly
