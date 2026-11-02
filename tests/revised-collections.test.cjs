const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const calc=path.resolve(__dirname,'../../../calculator'),pricing=require(calc+'/pricing'),{quoteDaily}=require(calc+'/daily-checkout'),products=require('../revised-collections.json');
test('all twenty revised document prices agree with authoritative checkout',()=>{
 assert.equal(products.length,20);assert.equal(products.filter(p=>p.permanent).length,9);
 for(const p of products){if(p.silver){const q=pricing.computePricing({collection:'silver',productId:p.id,typeFilter:'all',metal:'silver',purity:925,quantity:1,diamonds:[],discount:0,profit:0,designFee:0});assert.equal(q.finalTotal,p.price,p.name);}else{const q=quoteDaily({productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,diamonds:p.diamonds},p.collection);assert.equal(q.total,p.price,p.name);}}
});
