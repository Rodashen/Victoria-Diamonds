# Victoria Diamonds — Task List

## Fix Hero Slideshow (victoria-diamonds.js)
- [x] Remove `heroPrice` references from the slideshow code so it no longer throws an error on a non-existent element.
- [x] Keep only the title (`heroTitle`) updating — no price display.

## Remove Silver Collection from "Our Collections" (index.html)
- [x] Delete the Silver Collection `<a>` card from the `.collections-grid`.
- [x] Confirm remaining collections (Daily Sparkle, Occasional Wear, Forever Bond) display correctly.

## Fix Featured Piece text and image touching (victoria-diamonds.css)
- [x] Remove the stray `gi` typo after `--space-lg: 4rem;` in the `:root` block (introduced in commit V4.1.3).
- [x] Restore proper tab indentation for the `:root` custom properties.
- [x] Confirm `--space-lg`, `--space-xl`, and `--space-md` resolve correctly so the `.featured-grid` gap and `.featured-content` padding separate the image and text again.
