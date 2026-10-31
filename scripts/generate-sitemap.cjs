// Run after changing the product inventory: node scripts/generate-sitemap.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const context = {window: {}, document: {documentElement: {lang: 'en'}}};
for (const file of ['catalogue-data.js', 'daily-products.js', 'high-note-products.js', 'remaining-products.js', 'mens-products.js', 'product-registry.js']) {
 vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}
const base = 'https://victoria-diamonds.com/';
const registry = context.window.VDProducts;
// Discover published static journal pages so new guides survive regeneration.
const articles = fs.readdirSync(root).filter(file => /^journal-.+\.html$/.test(file) && !/<meta\b[^>]*content=["'][^"']*noindex/i.test(fs.readFileSync(path.join(root, file), 'utf8'))).sort();
const pages = ['', 'view-catalogue.html', ...Object.values(registry.collections).map(collection => collection[1]), 'artist.html', 'newsletter.html', 'privacy-policy.html', 'cookie-policy.html', 'returns-policy.html', 'journal.html', ...articles];
const urls = [...pages.map(page => base + page), ...registry.products.map(product => base + 'product.html?item=' + encodeURIComponent(product.id))];
if (new Set(urls).size !== urls.length) throw Error('Duplicate sitemap URLs');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
// Use actual editorial dates, never the generation time or a checkout asset update.
const modified = new Map(articles.map(file => {
 const html = fs.readFileSync(path.join(root, file), 'utf8');
 const article = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(data => data['@type'] === 'Article');
 const date = article?.dateModified || article?.datePublished;
 return [base + file, /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : null];
}));
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(url => '  <url><loc>' + escape(url) + '</loc>' + (modified.get(url) ? '<lastmod>' + modified.get(url) + '</lastmod>' : '') + '</url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('Generated sitemap with ' + urls.length + ' URLs (' + registry.products.length + ' products).');
