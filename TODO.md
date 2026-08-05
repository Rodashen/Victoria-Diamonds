# Index Page Updates — TODO

## Plan Approved ✅

### Files to Edit:
1. `index.html`
2. `victoria-diamonds.css`
3. `victoria-diamonds.js`
4. `translations.js`

### Steps:

- [x] 1. **Plan created & approved**
- [x] 2. **`index.html` — Replace floating transparency button with WhatsApp + Book Appointment floating buttons**
- [x] 3. **`index.html` — Move transparency modal to bottom (before Footer)**
- [x] 4. **`index.html` — Add VD Transparency link in mobile hamburger menu**
- [x] 5. **`index.html` — Add "The Victoria Diamonds Promise" section (6 guarantee points) between Hero and Featured Piece**
- [x] 6. **`victoria-diamonds.css` — Add styles for new floating buttons and guarantee section**
- [x] 7. **`victoria-diamonds.js` — Update event handlers for new floating buttons and transparency modal trigger**
- [x] 8. **`translations.js` — Add translation keys for:** 
     - Guarantee section title & all 6 points (title + body)
     - VD Transparency mobile nav link
- [x] 9. **Test/verify all changes** — opened in browser

## Summary of Changes

### 1. Floating buttons (desktop)
- Removed old `floating-transparency-btn` button
- Added `.floating-buttons` container with two buttons:
  - **WhatsApp** → links to `wa.me/447594442577` with the site's standard message
  - **Book Appointment** → links to `calendly.com/general-victoria-diamonds/30min`
- Both styled as rounded pills matching the site design (glassmorphism, gold accents)
- Instagram link in `top-social-links` left untouched

### 2. VD Transparency relocation
- Moved the transparency modal (`#transparencyModal`) to just before the Footer
- Kept as a modal (opens via mobile nav link)

### 3. Mobile hamburger menu
- Added "VD Transparency" link (`#mobileTransparencyLink` with class `js-transparency-trigger`) in the mobile nav
- Opens the transparency modal and closes the hamburger menu

### 4. The Victoria Diamonds Promise section
- Added between Hero and Featured Piece
- 6 promise cards in a responsive grid (3-col → 2-col → 1-col)
- Each card: title + short body, hover effects matching site design language

### 5. Translations
- Added `nav-transparency` key
- Added `guarantee-label`, `guarantee-title`, `guarantee-subtitle`, and `guarantee-1..6-title/text` keys (zh-TW)

---

# Our Guarantee Button + Floating Window — TODO

## Plan Approved ✅

### Files to Edit:
1. `index.html`
2. `victoria-diamonds.css`
3. `victoria-diamonds.js`
4. `translations.js`

### Steps:

- [x] 1. **Plan created & approved**
- [x] 2. **`index.html` — Add "Our Guarantee" button after Instagram & WhatsApp in `.top-social-links`**
- [x] 3. **`index.html` — Add centered guarantee modal (`#guaranteeModal`) before Footer, reusing `.modal-overlay`/`.modal-popup` pattern**
- [x] 4. **`victoria-diamonds.css` — Add styles for header guarantee button and guarantee modal grid**
- [x] 5. **`victoria-diamonds.js` — Add open/close event handlers for the guarantee modal (incl. Escape key)**
- [x] 6. **`translations.js` — Add `nav-our-guarantee` translation key (modal reuses existing `guarantee-*` keys)**
- [x] 7. **Test/verify all changes** — opened in browser

## Summary of Changes

### 1. Header button
- Added a "Our Guarantee" button (`header-guarantee-btn` + `js-guarantee-trigger`) after the WhatsApp link in `.top-social-links`
- Styled to match the site's nav button language (charcoal border, hover fill)

### 2. Floating window (centered modal)
- Added `#guaranteeModal` reusing the existing `.modal-overlay`/`.modal-popup` centered modal pattern
- Contains the header ("The Victoria Diamonds Promise"), subtitle, and all 6 guarantee cards in a responsive 2-col grid
- Closes via the × button, Close button, clicking the overlay, or the Escape key

### 3. Translations
- Added `nav-our-guarantee` key (zh-TW: 我們的保證)
- Modal content reuses existing `guarantee-label`, `guarantee-title`, `guarantee-subtitle`, and `guarantee-1..6-title/text` keys

### 4. Removed standalone guarantee section
- Removed the full-width "Our Guarantee" section (`#guarantee`) that appeared between the Hero and Featured Piece sections
- The Hero section now flows directly into the Featured Piece section
- Guarantee content is now accessible only via the header "Our Guarantee" button → centered floating modal
