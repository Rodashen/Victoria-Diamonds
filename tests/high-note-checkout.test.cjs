const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.env.CALCULATOR_ROOT||path.resolve(__dirname,'../../../calculator'),stage=root,pricing=require(path.join(root,'pricing'));
const mod={exports:{}};vm.runInNewContext(fs.readFileSync(path.join(stage,'daily-checkout.js'),'utf8'),{module:mod,require:()=>pricing});const {quoteDaily}=mod.exports;
const productsContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../high-note-products.js'),'utf8'),productsContext);
const products=productsContext.window.HighNoteProducts.products;
assert.equal(products.length,22);
for(const p of products)for(const metal of ['gold','silver','platinum'])for(const percentage of [30,50,100]){
 const body={productId:p.id,metal,karat:18,purity:925,quantity:1,paymentPercentage:percentage,diamonds:p.diamonds,braceletMetalTier:p.braceletMetalTier};
 const q=quoteDaily(body,'occasionWear');assert.ok(q.total>0);assert.equal(q.due,Math.round(q.total*percentage)/100);if(metal==='gold')assert.equal(q.total,p.price);
 assert.equal(quoteDaily({...body,discount:100,expectedTotal:1},'occasionWear').total,q.total);
 assert.throws(()=>quoteDaily(body),'High Note IDs must not enter the Daily endpoint');
}
const routes=new Map(),calls=[];const app={use(){},get(){},post(paths,handler){for(const p of [].concat(paths))routes.set(p,handler);},listen(){}};
const express=()=>app;express.json=express.static=()=>()=>{};
const axios=async options=>{calls.push(options);return {data:options.url.endsWith('/create')?{id:'test-only',url:'https://example.invalid/payment'}:{}};};axios.post=async()=>({data:{token:'test-only',expires_at:'2099-01-01'}});
const context=vm.createContext({require(id){if(id==='express')return express;if(id==='cors')return ()=>()=>{};if(id==='axios')return axios;if(id==='pdfkit')return function(){};if(id==='dotenv')return {config(){}};if(id==='./pricing')return pricing;if(id==='./daily-checkout')return {quoteDaily};return require(id);},__dirname:root,process:{env:{AIRWALLEX_CLIENT_ID:'test',AIRWALLEX_API_KEY:'test'}},console:{log(){},warn(){},error(){}},Buffer});
vm.runInContext(fs.readFileSync(path.join(stage,'server.js'),'utf8'),context);
async function request(route,body){const res={code:200,status(code){this.code=code;return this;},set(){return this;},json(data){this.data=data;return this;}};await routes.get(route)({path:route,body},res);return res;}
(async()=>{
 const p=products[0],body={productId:p.id,collection:'dailySparkle',metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:30,diamonds:p.diamonds,braceletMetalTier:p.braceletMetalTier,customerName:'Preview',customerEmail:'preview@example.com'};
 const q=await request('/high-note/quote',body);assert.equal(q.code,200);assert.equal(calls.length,0);assert.equal(q.data.params,undefined);
 assert.equal((await request('/high-note/payment-link',{...body,expectedTotal:1})).code,409);assert.equal(calls.length,0);
 const paid=await request('/high-note/payment-link',{...body,expectedTotal:q.data.total});assert.equal(paid.code,200);assert.equal(paid.data.amount,q.data.due);
 const order=vm.runInContext('Array.from(orders.values()).at(-1)',context);assert.equal(order.pricing.collection,'occasionWear');assert.equal(order.pricing.discount,0);
 assert.equal((await request('/high-note/quote',{...body,productId:'ds_s_aurelia'})).code,400);
 assert.equal((await request('/high-note/quote',{...body,productId:'ow_m_celestia_brooch'})).code,400);
 for(const [route,collection,productId]of [['forever-bond','foreverBond','fb_s_wedding_bands'],['aura','singleLady','sl_r_round_nature_vine']]){
  const input={...body,productId,collection:'silver'};
  const quote=await request('/'+route+'/quote',input);assert.equal(quote.code,200);assert.equal(quote.data.params,undefined);
  assert.equal((await request('/'+route+'/payment-link',{...input,expectedTotal:0})).code,409);
  const result=await request('/'+route+'/payment-link',{...input,expectedTotal:quote.data.total});assert.equal(result.code,200);assert.equal(result.data.amount,quote.data.due);
  const last=vm.runInContext('Array.from(orders.values()).at(-1)',context);assert.equal(last.pricing.collection,collection);assert.equal(last.pricing.discount,0);
  assert.equal((await request('/'+route+'/quote',{...input,productId:'ds_s_aurelia'})).code,400);
 }
 console.log('PASS: 22 High Note pieces, 198 metal/payment combinations, price tampering, collection isolation, quote-only endpoint and mocked payment-link creation. No real payments or email.');
})().catch(e=>{console.error(e);process.exitCode=1;});
