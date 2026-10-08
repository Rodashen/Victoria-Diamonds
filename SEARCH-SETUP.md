# Search setup

Public pages are allowed by `robots.txt`. `sitemap.xml` lists the homepage, six collections, catalogue, newsletter, policy pages, and every product in the shared registry. Product URLs retain the canonical format already used by `product-page.js`: `product.html?item=PRODUCT_ID`. Collection pages use their `.html` address as canonical; both existing URL forms remain working.

After adding, removing, or renaming products, regenerate the sitemap:

```
node scripts/generate-sitemap.cjs
```

After deployment, verify `https://victoria-diamonds.com/robots.txt` and `https://victoria-diamonds.com/sitemap.xml` return 200. In the owner's Google Search Console property, submit `sitemap.xml`, then inspect the homepage, a collection, and a product URL. Use the live test to confirm Google renders the product name and details. Request indexing for those representative pages if appropriate. Search Console verification and submission require access to the owner's account; repository changes alone do not perform these steps or guarantee indexing.

The sitemap excludes language, search, sorting and filtering variants to avoid duplicating the preferred addresses. It does not invent last-modified dates. Metadata changes do not change navigation, prices or checkout.
