# Product Card/Modal Fixes — TODO

## Plan Approved ✅

### Files to Edit:
1. `view-catalogue.html`
2. `silver-collection.html`
3. `daily-sparkle.html`
4. `occasional-wear.html`
5. `forever-bond.html`

### Steps:
- [ ] 1. **Remove "Details" label** — delete the `meta-details-label` line inside `getMetaHTML()` in all 5 pages (removes heading from product cards + modals, keeps detail rows)
- [ ] 2. **Add mobile CSS** — add `@media (max-width: 768px)` block to each page's `<style>` forcing all meta spans (incl. `.meta-detail-row`) to `display: block` so each field stacks on its own line on mobile
- [ ] 3. **Test/verify** — confirm on mobile each meta field is on its own line and no "Details" heading appears
