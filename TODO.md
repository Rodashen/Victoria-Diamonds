# TODO: Remove "Total Carat" (total ct) text from all rings

## Plan
Remove `{key:'totalKarat', value:'...'}` detail entries from RING data arrays only on all collection pages. This removes the visible "Total Carat: X ct" text from ring cards and popups. Non-ring categories (necklaces, bracelets, earrings, etc.) are left untouched.

## Steps
- [x] daily-sparkle.html — remove totalKarat from ring entries
- [x] occasional-wear.html — remove totalKarat from ring entries
- [x] forever-bond.html — remove totalKarat from ring entries
- [x] silver-collection.html — remove totalKarat from ring entries
- [x] view-catalogue.html — remove totalKarat from ring entries

## Additional Fix (forever-bond.html)
- [x] Reconstructed the corrupted `renderProducts('foreverBond', [...])` ring data array. The original array had broken object braces, missing commas, and a partial 20th ring missing its name/image. Rebuilt all 20 rings into valid JS objects (matching the format used on the other collection pages), removed the `total:`/`totalKarat` data from ring entries, and restored the missing 20th entry as "Eternal Connection Ring Set" (image `62.png`).
