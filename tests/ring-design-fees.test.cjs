const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),calculator=path.resolve(root,'../../calculator');
const pricing=require(path.join(calculator,'pricing')),fees=require(path.join(calculator,'ring-design-fees')), {quoteDaily}=require(path.join(calculator,'daily-checkout'));
test('removed automatic ring charges stay zero and customer requests cannot alter quotes',()=>{
 let checked=0;
 for(const collection of ['dailySparkle','occasionWear','foreverBond','singleLady'])for(const p of pricing.getProductsForCollection(collection,'all'))if(fees[p.id]){
  const body={productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,diamonds:[{quality:'select',carat:'1.00',qty:1}],paymentPercentage:50};
  const q=quoteDaily(body,collection), tampered=quoteDaily({...body,designFee:-fees[p.id],discount:100,price:1},collection);
  assert.equal(pricing.computePricing(q.params).designFee,0,p.id);
  assert.equal(q.total,tampered.total,p.id);assert.equal(q.due+q.balance,q.total,p.id);
  assert.equal(quoteDaily({...body,quantity:2},collection).total,q.total*2,p.id);checked++;
 }
 assert.equal(checked,35);
});
test('online custom orders offer only Sterling 925 silver',()=>{
 const body={productId:'ds_s_solenne',metal:'silver',purity:925,quantity:1,diamonds:[{quality:'select',carat:'1.00',qty:1}],paymentPercentage:100};
 assert.ok(quoteDaily(body,'dailySparkle').total>0);
 for(const purity of [990,999])assert.throws(()=>quoteDaily({...body,purity},'dailySparkle'),/purity/);
});
