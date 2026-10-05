const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context={window:{},document:{documentElement:{lang:'en'}}};
for(const file of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const {products,find,url}=context.window.VDProducts;
test('all 133 pieces have unique stable links and real assets',()=>{
 assert.equal(products.length,133);assert.equal(new Set(products.map(p=>p.id)).size,133);
 for(const p of products){assert.ok(p.id);assert.equal(new URL(url(p),'https://example.test').searchParams.get('item'),p.id);assert.ok(fs.existsSync(path.join(root,'images',p.image)));}
 assert.equal(products.filter(p=>p.mode==='custom').length,113);assert.equal(products.filter(p=>p.mode==='silver').length,17);assert.deepEqual(Array.from(products.filter(p=>p.mode==='enquiry'),p=>p.name).sort(),['Celestia Broche','Lunaria Tiara','Éternelle Broche'].sort());
});
test('same-named pieces keep their collection and checkout identity',()=>{
 const a=find('dailySparkle','Fiora Earrings'),b=find('occasionalWear','Fiora Earrings');assert.notEqual(a.id,b.id);assert.equal(a.preset.route,'daily-sparkle');assert.equal(b.preset.route,'high-note');
 assert.equal(find('silverCollection','Link Charm Bracelet').id,'silver_link_charm');assert.equal(find('silverCollection','Link Charm Bracelet II').id,'silver_link_charm_ii');
 assert.equal(find('silverCollection','Link Charm Bracelet').price,113);assert.equal(find('silverCollection','Link Charm Bracelet II').price,159);
 assert.notEqual(find('foreverBond','Eternal Promise').id,find('foreverBond','Eternal Promise Ring Set').id);
});
test('every customizable piece quotes correctly for all metals and payment options',()=>{
 const {quoteDaily}=require(path.resolve(root,'../../calculator/daily-checkout'));
 for(const p of products.filter(p=>p.mode==='custom'))for(const metal of ['gold','silver','platinum'])for(const paymentPercentage of [30,50,100]){
  const preset=p.preset,body={productId:p.id,metal,karat:18,purity:925,quantity:1,diamonds:preset.diamonds,braceletMetalTier:preset.braceletMetalTier,paymentPercentage};
  const q=quoteDaily(body,preset.collection);assert.ok(q.total>0,p.name);assert.equal(q.due,Math.round(q.total*paymentPercentage)/100);assert.equal(Math.round((q.due+q.balance)*100),Math.round(q.total*100));
  if(metal===(preset.defaultMetal||'gold'))assert.equal(q.total,preset.price,p.name);
  assert.equal(quoteDaily({...body,discount:100,profit:-100,designFee:-10000},preset.collection).total,q.total);
 }
 const bands=find('foreverBond','Wedding Bands');assert.ok(quoteDaily({productId:bands.id,metal:'gold',karat:18,purity:925,quantity:1,diamonds:[],paymentPercentage:100},'foreverBond').total>0);
 for(const p of products.filter(p=>p.mode==='enquiry'))assert.equal(p.collection,'occasionalWear');
});
test('Silver catalogue prices agree with server-owned fixed prices',()=>{
 const pricing=require(path.resolve(root,'../../calculator/pricing'));
 for(const p of products.filter(p=>p.mode==='silver')){
  const quote=pricing.computePricing({productId:p.id,collection:'silver',metal:'silver',quantity:1,paymentPercentage:100});
  assert.equal(quote.finalTotal,p.price,p.name);
 }
});
test('product page scripts and inline scripts parse, local references exist',()=>{
 for(const file of ['product-registry.js','product-links.js','product-page.js','daily-checkout.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
 const html=fs.readFileSync(path.join(root,'product.html'),'utf8');
 for(const [,ref]of html.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g))if(!ref.includes(':'))assert.ok(fs.existsSync(path.join(root,ref)),ref);
});
