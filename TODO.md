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
