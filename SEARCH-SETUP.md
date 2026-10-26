# Search setup

Public pages are allowed by `robots.txt`. `sitemap.xml` lists the homepage, seven collections, catalogue, artist, newsletter, policy pages, journal, ten articles, and all 175 products in the shared registry. Product URLs retain their established canonical format: `product.html?item=PRODUCT_ID`. Static pages use `.html`; extensionless aliases now redirect permanently to the preferred address. Journal articles are static HTML with descriptions, canonical addresses and Article structured data. The sitemap generator discovers published `journal-*.html` files and uses their actual editorial dates for `lastmod`; it excludes pages marked noindex.

After adding, removing, or renaming products or public pages, run the required release gate:

```
node scripts/prepare-release.cjs
```

After deployment, verify `https://victoria-diamonds.com/robots.txt` and `https://victoria-diamonds.com/sitemap.xml` return 200. Submit only `sitemap.xml` in Search Console, then inspect representative canonical product and page URLs with the live test. Request indexing for important changed pages if appropriate. Search Console submission requires the owner's account; repository changes do not guarantee indexing or immediately clear historical reports.

The sitemap excludes language, search, sorting and filtering variants. English product links omit redundant `lang=en`; Chinese links retain `lang=zh-HK` so language selection works. Alternate/filter URLs declaring the primary page as canonical can legitimately appear as **Alternative page with proper canonical tag**.

## Product content in the first response

`scripts/generate-product-html.cjs` builds complete public product HTML from the shared registry and published price snapshot. Netlify's `product-seo` edge function serves this HTML equally to every visitor and crawler. Names, original design details, images, starting prices, canonical tags and matching structured data are present before JavaScript runs. Browser scripts reuse those metadata elements and mount the existing checkout. No payment code runs in the edge function; the calculator remains authoritative for quotes and payment links. Responses cannot be cached across product query strings. Unknown product IDs return a real HTTP 404 with noindex.

## Preventing release regressions

Netlify runs `scripts/prepare-release.cjs` on every build; failed checks stop deployment. GitHub Actions repeats the same checks for pushes and pull requests. Node 22 is pinned in `.nvmrc`. The gate regenerates product HTML, `_redirects`, `_headers` and the sitemap, then verifies canonical uniqueness, static product content, real schema prices, local assets, alias routing, language preservation and sitemap consistency. It requires no calculator checkout or credentials.

Commit regenerated `_redirects`, `_headers` and `sitemap.xml` with source changes. `_generated/` is disposable build output ignored by Git. Refresh public prices separately using `scripts/sync-calculator-prices.cjs` when the calculator changes. Netlify Pretty URLs is disabled in configuration to prevent link rewriting from contradicting `.html` canonicals.

**Crawled – currently not indexed** remains a Google selection decision. For **Duplicate, Google chose different canonical**, URL Inspection must identify the actual Google-selected document; the report category alone does not reveal it. These release checks prevent the covered technical regressions, but cannot guarantee that every page is indexed or that legitimate alternate URLs disappear from Search Console.
