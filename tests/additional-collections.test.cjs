const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),calculator=path.resolve(root,'../../calculator'),pricing=require(path.join(calculator,'pricing')),{quoteDaily}=require(path.join(calculator,'daily-checkout'));
const c={window:{},document:{documentElement:{lang:'en'}}};for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const products=c.window.VDProducts.products,newProducts=products.filter(p=>/^(aura_|silver_new_|keepsake_)/.test(p.id));
test('document additions have correct collections, prices, pair quantities and product assets',()=>{
 assert.equal(newProducts.length,42);assert.equal(newProducts.filter(p=>p.collection==='singleLady').length,15);assert.equal(newProducts.filter(p=>p.collection==='silverCollection').length,15);assert.equal(newProducts.filter(p=>p.collection==='keepsakeCollection').length,12);
 const expected=[['aura_lunara_pear_pendant',1715],['aura_virelia_leaf_pendant',1555],['aura_oriana_oval_pendant',1975],['aura_estelle_trio_pendant',1615],['aura_amelie_heart_pendant',1375],['aura_lunara_pear_earrings',2305],['aura_virelia_leaf_earrings',2225],['aura_oriana_oval_earrings',2125],['aura_estelle_trio_earrings',2105],['aura_amelie_heart_earrings',1425],['aura_lunara_pear_bracelet',5882],['aura_virelia_leaf_bracelet',4020],['aura_oriana_oval_bracelet',5882],['aura_estelle_trio_bracelet',5882],['aura_amelie_heart_bracelet',4020]];
 for(const [id,amount]of expected)assert.equal(products.find(p=>p.id===id).preset.price,amount,id);
 for(const p of newProducts){assert.ok(fs.existsSync(path.join(root,'images',p.image)));assert.ok(fs.existsSync(path.join(root,'images',p.thumbnail)));assert.ok(p.description);if(p.category==='Earring'&&p.preset)assert.equal(p.preset.soldAsPair,true);}
 for(const p of newProducts.filter(p=>p.mode==='silver'))assert.equal(pricing.computePricing({collection:'silver',productId:p.id,metal:'silver',quantity:1}).finalTotal,p.price);
});
test('A to Z initials are required, validated, priced and retained in production names',()=>{
 for(const p of newProducts.filter(p=>p.preset?.initialRequired)){
  const body={productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:50,diamonds:p.preset.diamonds};
  for(const initial of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
   const q=quoteDaily({...body,initial},'keepsake');assert.equal(q.total,1215);assert.equal(q.due,607.5);assert.equal(q.params.initial,initial);assert.match(pricing.computePricing(q.params).prod.name,new RegExp('Initial '+initial+'$'));
  }
  for(const initial of [undefined,'','AB','a','<script>','1','É'])assert.throws(()=>quoteDaily({...body,initial},'keepsake'));
  assert.throws(()=>quoteDaily({...body,initial:'A',diamondOrigin:'natural'},'keepsake'));
 }
 const server=fs.readFileSync(path.join(calculator,'server.js'),'utf8');assert.match(server,/initial: body.initial/);assert.match(server,/keepsake: 'keepsake'/);
});
test('new collection metadata, sitemap and homepage carousel are discoverable',()=>{
 const html=fs.readFileSync(path.join(root,'keepsake-collection.html'),'utf8'),home=fs.readFileSync(path.join(root,'index.html'),'utf8'),sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 assert.match(html,/rel="canonical" href="https:\/\/victoria-diamonds.com\/keepsake-collection.html"/);assert.match(html,/<h1[^>]*>Keepsake Collection<\/h1>/);
 for(const [,json]of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert.equal(JSON.parse(json)['@type'],'CollectionPage');
 assert.match(home,/<a href="keepsake-collection.html" class="collection-item"/);
 for(const p of newProducts)assert.ok(sitemap.includes(p.id));
});
