const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),base='https://victoria-diamonds.com/';
const canonicalTags=html=>[...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/gi)].map(m=>m[0].match(/href="([^"]+)"/)[1].replaceAll('&amp;','&'));
const c={window:{},document:{documentElement:{lang:'en'}}};
for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js','diamond-prices.js','product-schema.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const generated=import(pathToFileURL(path.join(root,'_generated/product-pages.mjs')).href);
const edge=import(pathToFileURL(path.join(root,'netlify/edge-functions/product-seo.js')).href);

test('every public static page has one self-canonical and one generated alias redirect',()=>{
 const redirects=fs.readFileSync(path.join(root,'_redirects'),'utf8'),headers=fs.readFileSync(path.join(root,'_headers'),'utf8');
 for(const f of fs.readdirSync(root).filter(f=>f.endsWith('.html')&&f!=='product.html')){
  const html=fs.readFileSync(path.join(root,f),'utf8'),expected=f==='index.html'?base:base+f;
  assert.deepEqual(canonicalTags(html),[expected],f);
  assert.ok(headers.includes('Link: <'+expected+'>; rel="canonical"'),f);
  if(f!=='index.html')assert.ok(redirects.includes('/'+f.slice(0,-5)+' /'+f+' 301!'),f);
 }
 assert.match(fs.readFileSync(path.join(root,'netlify.toml'),'utf8'),/pretty_urls = false/);
 assert.match(redirects,/\/index\.html \/ 301!/);
});

test('all product first responses contain unique content, a single canonical and matching real offers',async()=>{
 const pages=(await generated).default.products;
 assert.equal(Object.keys(pages).length,c.window.VDProducts.products.length);
 const titles=new Set();
 for(const p of c.window.VDProducts.products){
  const page=pages[p.id],expected=base+'product.html?item='+encodeURIComponent(p.id),html=page.html;
  assert.deepEqual(canonicalTags(html),[expected],p.id);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,p.id);
  assert.ok(!html.includes('Loading your piece'),p.id);
  assert.ok(html.includes('id="order"'),p.id);
  const title=html.match(/<title>(.*?)<\/title>/s)[1];assert.ok(!titles.has(title),p.id);titles.add(title);
  const schema=JSON.parse(html.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)[1]);
  const expectedSchema=JSON.parse(JSON.stringify(c.window.VDProductSchema.create(p,c.window.VDDiamondCatalogue.products[p.id])));
  assert.deepEqual(schema,expectedSchema,p.id);
  for(const [,ref] of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^(https?:|mailto:|tel:)/.test(ref))assert.ok(fs.existsSync(path.join(root,ref.split(/[?#]/)[0])),p.id+' '+ref);
 }
});

test('product aliases preserve configuration and language; invalid IDs return a real non-indexable 404',async()=>{
 const handle=(await edge).default;
 const fail={next(){throw Error('GET must be served with complete HTML');}};
 for(const query of ['item=keepsake_atlas_circle_initial_key_charm&lang=en','item=keepsake_lunara_crescent_key_ring&lang=zh-HK','item=fb_m_knot&utm_source=example']){
  const alias=await handle(new Request(base+'product?'+query),fail);
  assert.equal(alias.status,301);assert.equal(alias.headers.get('location'),base+'product.html?'+query);
  const response=await handle(new Request(base+'product.html?'+query),fail),html=await response.text();
  assert.equal(response.status,200);assert.equal(canonicalTags(html).length,1);
  assert.equal(response.headers.get('cache-control'),'no-store');
  assert.ok(response.headers.get('link').includes(canonicalTags(html)[0]));
 }
 for(const id of ['missing-piece','__proto__','constructor','']){
  const response=await handle(new Request(base+'product.html?item='+id),fail);
  assert.equal(response.status,404);assert.equal(response.headers.get('x-robots-tag'),'noindex');
 }
 const head=await handle(new Request(base+'product.html?item=fb_m_knot',{method:'HEAD'}),fail);assert.equal(head.status,200);assert.equal(await head.text(),'');
});

test('sitemap URLs and English browsing links use the preferred product identity',async()=>{
 const pages=(await generated).default.products,xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
 assert.equal(new Set(urls).size,urls.length);
 for(const url of urls){
  const u=new URL(url);assert.equal(u.origin,base.slice(0,-1));assert.equal(u.hash,'');assert.equal(u.searchParams.has('lang'),false);
  if(u.pathname==='/product.html')assert.equal(pages[u.searchParams.get('item')]?.canonical,url);
  else{const f=u.pathname==='/'?'index.html':u.pathname.slice(1);assert.deepEqual(canonicalTags(fs.readFileSync(path.join(root,f),'utf8')),[url]);}
 }
 for(const p of c.window.VDProducts.products)assert.equal(base+c.window.VDProducts.url(p),pages[p.id].canonical);
});
