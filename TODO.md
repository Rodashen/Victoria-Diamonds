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
