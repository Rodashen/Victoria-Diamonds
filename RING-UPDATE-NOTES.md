# Local ring and browsing update — 13 October 2026

Deploy the calculator before the website so server-confirmed prices include the new design fees. Calculator files changed: `pricing.js`, `daily-checkout.js`, `index.html`, and new `ring-design-fees.js`. Unrelated calculator `output/` files are excluded from this update.

The fixed design fees are £200 for the requested list, £100 for Athena and Tranquility, and £300 for Venus. The short name “Pear Solitaire” was mapped to both Pear Solitaire Tapered and Pear Solitaire Chevron; 35 distinct product IDs have fees. Fees apply per item, including silver/platinum customisations, and are included in the payment total and percentage deposit. They are server-owned and cannot be removed through website request fields.

Custom central-stone rings default their first diamond group to one 1.00 ct stone. Existing additional groups remain configurable. Fixed Silver designs and bands/eternity/alternating designs retain their existing specifications pending any separate instruction. Original detail panels show metal and 1.00 ct centre stone for central-stone rings. Known metals are preserved; missing metal labels use the supplied 18K White Gold description. Fae's former 0.50 × 3 was the calculator preset; it has been replaced.

Homepage filters show all 86 rings when Rings is selected with no collection or price restriction. Touch spacing/filter controls were refined without changing brand colours. All HTML pages now link the same ICO/PNG favicon and Apple touch icon.

With explicit user approval, VD marks and the accompanying brand text were removed from 90 active product image files. Clean product images were retained. Original branded images are backed up at `../design-review/original-branded-products/`. The header identity remains intact. Autumn content was cancelled by the user.

Verification: 16 product/checkout tests passed, including mandatory fee/tampering/quantity tests and rejecting 990/999 online silver. Calculator inline scripts parse. Journal metadata/links/sitemap checks passed. Browser checks confirmed 86 ring results, Fae's 1 ct default, only Sterling 925, and no mobile horizontal overflow at 390 px. Live calculator is still the previous deployment; local website previews therefore do not prove the new live quote total until calculator deployment.
