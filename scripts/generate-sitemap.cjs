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
const pages = ['', 'view-catalogue.html', ...Object.values(registry.collections).map(collection => collection[1]), 'newsletter.html', 'privacy-policy.html', 'cookie-policy.html'];
const urls = [...pages.map(page => base + page), ...registry.products.map(product => base + 'product.html?item=' + encodeURIComponent(product.id))];
if (new Set(urls).size !== urls.length) throw Error('Duplicate sitemap URLs');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls.map(url => '  <url><loc>' + escape(url) + '</loc></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
console.log('Generated sitemap with ' + urls.length + ' URLs (' + registry.products.length + ' products).');
