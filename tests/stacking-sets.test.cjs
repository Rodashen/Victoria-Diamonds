const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),pricing=require(path.resolve(root,'../../calculator/pricing')),{quoteDaily}=require(path.resolve(root,'../../calculator/daily-checkout'));
const context={window:{}};
for(const file of ['high-note-products.js','remaining-products.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const all=[...context.window.HighNoteProducts.products,...context.window.RemainingProducts.products];
test('three stacking sets charge the whole finished configuration three times, including deposits and quantities',()=>{
 for(const id of ['ow_s_promise','fb_s_unbreakable_hearts','fb_s_bound_by_destiny']){
  const p=all.find(p=>p.id===id),collection=p.collection||'occasionWear';
  assert.equal(p.stackingSetMultiplier,3);assert.equal(p.soldAsSet,true);
  for(const metal of ['gold','silver','platinum'])for(const quantity of [1,2])for(const paymentPercentage of [30,50,100]){
   const body={productId:id,metal,karat:18,purity:925,diamonds:p.diamonds,quantity,paymentPercentage};
   const q=quoteDaily(body,collection),r=pricing.computePricing(q.params);
   assert.equal(r.stackingSetMultiplier,3);
   assert.equal(q.total,Math.round((r.jewelleryPrice+r.diamondPrice+r.designFee)*3*quantity*100)/100);
   assert.equal(q.due,Math.round(q.total*paymentPercentage)/100);
   assert.equal(quoteDaily({...body,stackingSetMultiplier:1,price:1},collection).total,q.total);
   if(metal==='gold'&&quantity===1)assert.equal(p.price,q.total);
  }
 }
 const normal=all.find(p=>p.id==='ow_m_fae');
 assert.equal(pricing.computePricing({collection:'occasionWear',productId:normal.id,metal:'gold',karat:18,diamonds:normal.diamonds,quantity:1}).stackingSetMultiplier,1);
});
