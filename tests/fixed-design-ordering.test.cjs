const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),calc=path.resolve(root,'../../calculator'),{quoteDaily}=require(path.join(calc,'daily-checkout')),pricing=require(path.join(calc,'pricing'));
const c={window:{},document:{documentElement:{lang:'en'}}};
for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const products=c.window.VDProducts.products;
const body=p=>({productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:50,diamonds:p.preset.diamonds,braceletMetalTier:p.preset.braceletMetalTier});
test('Fiora and Luminea diamond specifications cannot be changed through checkout requests',()=>{
 for(const id of ['ds_s_fiora','ds_s_luminea','ow_m_fiora']){
  const p=products.find(p=>p.id===id);assert.equal(p.preset.lockDiamonds,true);
  const q=quoteDaily(body(p),p.preset.collection),changed=quoteDaily({...body(p),diamonds:[{quality:'luxe',carat:'5.00',qty:99}]},p.preset.collection);
  assert.equal(changed.total,q.total);assert.deepEqual(changed.params.diamonds,q.params.diamonds);
  assert.ok(quoteDaily({...body(p),metal:'platinum'},p.preset.collection).total>0);
 }
 assert.equal(products.find(p=>p.id==='ow_m_fiora').preset.diamonds[0].qty,2);
 assert.equal(products.find(p=>p.id==='ds_s_fiora').preset.diamonds[0].qty,4);
});
test('all custom bracelets use four diamond budgets with fixed metal specifications and correct deposits',()=>{
 for(const p of products.filter(p=>p.preset?.diamondPriceOptions)){
  assert.equal(p.preset.lockBraceletTier,true,p.name);
  for(const metal of ['gold','silver','platinum'])for(const [carat,amount]of Object.entries(p.preset.diamondPriceOptions)){
   const input={...body(p),metal,braceletMetalTier:'essential',diamonds:[{quality:'luxe',carat,qty:99}],quantity:2};
   const q=quoteDaily(input,p.preset.collection),r=pricing.computePricing(q.params);
   assert.equal(r.diamondPrice,amount);assert.equal(r.packageKey,p.preset.braceletMetalTier);
   assert.equal(q.total,(r.jewelleryPrice+amount)*2);assert.equal(q.due,q.total/2);
   assert.equal(q.params.diamonds[0].qty,1);assert.equal(q.params.diamonds[0].quality,'select');
  }
  assert.throws(()=>quoteDaily({...body(p),diamonds:[{quality:'select',carat:'5.00',qty:1}]},p.preset.collection));
 }
 assert.equal(products.find(p=>p.id==='ow_l_lumina').name,'Lumina Tennis');
});
