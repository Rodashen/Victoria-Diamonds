const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),calc=path.resolve(root,'../../calculator'),pricing=require(path.join(calc,'pricing')),{quoteDaily}=require(path.join(calc,'daily-checkout'));
const designs=require('../prism-designs.json'),rules=require(path.join(calc,'order-configuration-rules.json'));
const body=p=>({productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,braceletMetalTier:'essential',diamondOrigin:'lab',diamondColour:'pink',diamonds:[{quality:'select',carat:'1.00',qty:p.stoneCount}]});
test('five Prism designs have all 70 complete image variants and lab-only presets',()=>{
 const c={window:{},document:{documentElement:{lang:'en'}}};for(const file of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),c);
 const products=c.window.VDProducts.products.filter(p=>p.collection==='prismCollection');assert.equal(products.length,5);
 for(const p of products){assert.equal(p.mode,'custom');assert.equal(p.preset.route,'prism');assert.equal(p.preset.labOnly,true);for(const colour of rules[p.id].diamondColours)for(const view of ['front','back'])assert.ok(fs.statSync(path.join(root,`images/products/${p.id}-${colour}-${view}.webp`)).size>1000);}
});
test('Prism charges standard metal plus 120 percent of diamonds across colours, sizes, grades and deposits',()=>{
 for(const p of designs)for(const colour of rules[p.id].diamondColours)for(const carat of rules[p.id].diamondCarats)for(const quality of ['select','luxe']){
  const b={...body(p),diamondColour:colour,diamonds:[{quality,carat,qty:p.stoneCount}]};const q=quoteDaily(b,'prism'),result=pricing.computePricing(q.params);
  assert.equal(result.diamondPrice,Math.round(pricing.DIAMOND_PRICES[quality][carat]*p.stoneCount*1.2*100)/100);
  assert.equal(q.total,Math.round(((result.jewelleryPrice??result.ringPrice??result.designComplexityFee)+result.diamondPrice)*100)/100);
  assert.equal(q.params.diamondColour,colour);assert.equal(q.params.diamondOrigin,'lab');
  for(const paymentPercentage of [30,50,100]){const deposit=quoteDaily({...b,paymentPercentage,quantity:2},'prism');assert.equal(deposit.total,q.total*2);assert.equal(deposit.due,Math.round(deposit.total*paymentPercentage)/100);}
 }
});
test('Prism rejects natural diamonds, invalid colours, changed counts, unavailable sizes and client price overrides',()=>{
 for(const p of designs){const b=body(p);for(const edit of [{diamondOrigin:'natural'},{diamondColour:'purple'},{diamonds:[{quality:'select',carat:'0.05',qty:p.stoneCount}]},{diamonds:[{quality:'select',carat:'1.00',qty:20}]}])assert.throws(()=>quoteDaily({...b,...edit},'prism'));
  assert.equal(quoteDaily({...b,diamondPriceMultiplier:0,discount:100,designFee:-500},'prism').total,quoteDaily(b,'prism').total);
 }
});
