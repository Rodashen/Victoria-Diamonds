const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),c={window:{},document:{documentElement:{lang:'en'}}};
for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js','diamond-catalogue.js','product-schema.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
test('all purchasable products expose real GBP offers, with no invented reviews or stock',()=>{
 for(const p of c.window.VDProducts.products){const r=c.window.VDDiamondCatalogue.products[p.id],s=c.window.VDProductSchema.create(p,r);assert.equal(s.name,p.name);assert.equal(s.review,undefined);assert.equal(s.aggregateRating,undefined);
  if(p.mode==='enquiry'){assert.notEqual(s['@type'],'Product');assert.equal(s.offers,undefined);continue;}
  assert.equal(s['@type'],'Product');assert.equal(s.offers.priceCurrency,'GBP',p.id);assert.ok((s.offers.price??s.offers.lowPrice)>0,p.id);assert.equal(s.offers.availability,undefined);
  if(p.mode==='silver')assert.equal(s.offers.price,p.price);else assert.equal(s.offers.lowPrice,Math.min(r.lab,r.natural??Infinity));
 }
});
test('reported Link Charm and Knot URLs resolve to valid offers and a shared canonical identity',()=>{
 for(const id of ['silver_link_charm','fb_m_knot']){const p=c.window.VDProducts.products.find(p=>p.id===id),s=c.window.VDProductSchema.create(p,c.window.VDDiamondCatalogue.products[id]);assert.ok(s.offers);assert.equal(s.url,'https://victoria-diamonds.com/product.html?item='+id);}
});
