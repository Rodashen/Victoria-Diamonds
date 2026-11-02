const test=require('node:test'),assert=require('node:assert/strict'),path=require('node:path');
const calc=path.resolve(__dirname,'../../../calculator'),{quoteDaily}=require(calc+'/daily-checkout');
const designs=require('../tennis-necklace-designs.json'),{estimateStoneCount}=require('../scripts/tennis-sizing-draft.cjs');
test('all five necklaces quote Supreme metal and length-dependent stone prices',()=>{
 const rates={'0.05':12.5,'0.10':23,'0.15':35,'0.20':62.5};
 for(const p of designs.products)for(const length of [16,18,20])for(const [carat,rate]of Object.entries(rates)){
  const body={productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,necklaceLength:length,braceletMetalTier:'essential',diamonds:[{quality:'select',carat,qty:1}]};
  assert.equal(quoteDaily(body,'tennis').total,4032+estimateStoneCount(length,carat)*rate);
  assert.throws(()=>quoteDaily({...body,necklaceLength:999},'tennis'));
 }
});
