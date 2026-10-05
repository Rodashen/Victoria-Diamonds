const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
const path=require('node:path');
const site=path.resolve(__dirname,'..');
const calculator=process.env.CALCULATOR_ROOT||path.resolve(site,'../../calculator');
const pricing=require(path.join(calculator,'pricing'));
const {quoteDaily}=require(path.join(calculator,'daily-checkout'));
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(site,'daily-products.js'),'utf8'),context);
const products=JSON.parse(JSON.stringify(context.window.DailyProducts.products));
const body=p=>({productId:p.id,metal:'gold',karat:18,purity:925,braceletMetalTier:p.braceletMetalTier||'essential',quantity:1,paymentPercentage:50,diamonds:p.diamonds});
test('confirmed earring pair presets load every stone group and match website checkout',()=>{
 const controls={},ctx=vm.createContext({document:{addEventListener(){},getElementById(id){return controls[id]||(controls[id]={value:''});}},window:{},console});
 for(const m of fs.readFileSync(path.join(calculator,'index.html'),'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],ctx);
 vm.runInContext('updateLiveTotal = function(){}',ctx);
 for(const [id,ct] of [['ds_s_luminea',0.6],['ds_s_fiora',1.6]]){
  const web=products.find(p=>p.id===id),back=pricing.getProductsForCollection('dailySparkle','all').find(p=>p.id===id);
  const front=vm.runInContext(`Object.values(PRODUCTS_BY_COLLECTION.dailySparkle).flat().find(p=>p.id===${JSON.stringify(id)}).diamondPreset`,ctx);
  assert.deepEqual(JSON.parse(JSON.stringify(front)),back.diamondPreset);
  ctx.preset=front;vm.runInContext('applyDiamondPreset(preset)',ctx);
  const diamonds=[0,1,2,3].map(i=>({quality:controls['dq'+i].value,carat:controls['dc'+i].value,qty:Number(controls['dqt'+i].value)})).filter(d=>d.carat!=='0');
  assert.deepEqual(diamonds,web.diamonds);assert.equal(web.soldAsPair,true);
  assert.equal(Math.round(diamonds.reduce((sum,d)=>sum+Number(d.carat)*d.qty,0)*100)/100,ct);
  assert.equal(quoteDaily({...body(web),diamonds}).total,web.price);
 }
});
test('all 31 website pieces map uniquely to backend and their default price',()=>{
 assert.equal(products.length,31);assert.equal(new Set(products.map(p=>p.id)).size,31);
 for(const p of products){const q=quoteDaily(body(p));assert.equal(q.total,p.price,p.name);assert.ok(fs.existsSync(path.join(site,'images',p.image)));}
});
test('all products, metals, qualities and payment choices agree with server pricing',()=>{
 for(const p of products)for(const metal of ['gold','silver','platinum'])for(const quality of ['select','luxe'])for(const paymentPercentage of [30,50,100]){
  const input={...body(p),metal,karat:14,paymentPercentage,diamonds:[{carat:'0.05',qty:3,quality}],quantity:2};
  const q=quoteDaily(input),computed=pricing.computePricing(q.params);
  assert.equal(q.total,Math.round(computed.finalTotal*100)/100);assert.equal(q.due,Math.round(q.total*paymentPercentage)/100);assert.equal(Math.round((q.due+q.balance)*100),Math.round(q.total*100));
 }
});
test('every offered diamond size and gold karat matches the calculator frontend',()=>{
 const controls={},context=vm.createContext({document:{addEventListener(){},getElementById(id){return controls[id]||(controls[id]={value:''});}},window:{},console});
 const html=fs.readFileSync(path.join(calculator,'index.html'),'utf8');
 for(const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 for(const p of products)for(const karat of [9,14,18,22])for(const carat of pricing.DIAMOND_CARATS)for(const quality of ['select','luxe']){
  const input={...body(p),karat,diamonds:[{quality,carat,qty:1}]};
  for(const [key,value] of Object.entries({collection:'dailySparkle',typeFilter:'all',product:p.id,metal:'gold',karat,quantity:1,braceletMetalTier:input.braceletMetalTier,dc0:carat,dq0:quality,dqt0:1}))controls[key]={value:String(value)};
  const front=vm.runInContext('computePricing()',context);
  if(front.hasUnpricedDiamond)assert.throws(()=>quoteDaily(input));else assert.equal(quoteDaily(input).total,front.finalTotal,`${p.name} ${karat} ${carat} ${quality}`);
 }
});
test('bracelet tiers affect both quote and checkout rather than ignoring selection',()=>{
 const p=products.find(p=>p.type==='bracelet');
 for(const tier of Object.keys(pricing.PRICING_PACKAGE_MATRIX)){
  const q=quoteDaily({...body(p),braceletMetalTier:tier});
  assert.equal(pricing.computePricing(q.params).packageKey,tier);
  assert.equal(q.total,pricing.PRICING_PACKAGE_MATRIX[tier]['18K']+pricing.computePricing(q.params).diamondPrice);
 }
});
test('tampered prices and internal discounts cannot change customer quote',()=>{
 const p=products[0],q=quoteDaily(body(p));
 const altered=quoteDaily({...body(p),collection:'silver',discount:100,profit:-100,designFee:-100000,price:.01,total:.01});
 assert.equal(altered.total,q.total);assert.equal(altered.params.discount,0);assert.equal(altered.params.collection,'dailySparkle');
});
test('invalid products, diamonds, quantities, and deposits fail closed',()=>{
 for(const patch of [{productId:'missing'},{productId:'silver_link_charm'},{metal:'invalid'},{karat:10},{quantity:-1},{quantity:1.5},{quantity:Infinity},{paymentPercentage:0},{paymentPercentage:49},{diamonds:[]},{diamonds:[{quality:'fake',carat:'1.00',qty:1}]},{diamonds:[{quality:'select',carat:'0.001',qty:1}]},{diamonds:[{quality:'select',carat:'1.00',qty:-2}]}])assert.throws(()=>quoteDaily({...body(products[0]),...patch}));
});
test('HTML inline and new scripts parse; both collection pages include checkout',()=>{
 for(const file of ['daily-sparkle.html','view-catalogue.html']){
  const source=fs.readFileSync(path.join(site,file),'utf8');assert.match(source,/src="daily-checkout\.js(?:\?v=[^"]+)?"/);assert.match(source,/src="daily-products.js"/);
  for(const m of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
 }
 new vm.Script(fs.readFileSync(path.join(site,'daily-checkout.js'),'utf8'));
});
