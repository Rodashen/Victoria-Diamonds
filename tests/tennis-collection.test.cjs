const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),calculator=path.resolve(root,'../../calculator'),{quoteDaily}=require(calculator+'/daily-checkout'),pricing=require(calculator+'/pricing');
const c={window:{},document:{documentElement:{lang:'en'}}};for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js','diamond-prices.js'])vm.runInNewContext(fs.readFileSync(root+'/'+f,'utf8'),c);
const products=c.window.VDProducts.products,tennis=products.filter(p=>p.collection==='tennisCollection');
test('moving existing tennis bracelets preserves every original starting price and specification',()=>{
 const original={ow_l_lumina:4920,ow_l_arabella:4920,ow_l_classic_round_tennis_gold:5520,ow_l_emerald_cut_tennis:5520,ow_l_marquise_round_alternating_tennis:4920,ow_l_pear_cut_tennis_gold:5520,mens_apex_tennis_bracelet:5220,mens_pillar_tennis_bracelet:6732};
 for(const [id,price]of Object.entries(original)){const p=tennis.find(p=>p.id===id);assert.equal(p.preset.price,price,id);assert.equal(c.window.VDDiamondCatalogue.products[id].lab,price,id);assert.equal(p.preset.braceletMetalTier,id==='mens_pillar_tennis_bracelet'?'supreme':'premium');}
});
test('all tennis styles are moved once, retain stable URLs, and five new designs are orderable',()=>{
 assert.equal(tennis.length,13);assert.equal(tennis.filter(p=>p.id.startsWith('tennis_')).length,5);
 assert.equal(products.filter(p=>p.category==='Bracelet'&&/tennis/i.test(p.name)&&p.collection!=='tennisCollection').length,0);
 assert.equal(new Set(products.map(p=>p.id)).size,180);
 for(const p of tennis){assert.equal(p.mode,'custom');assert.equal(p.preset.collection,'tennis');assert.equal(p.preset.route,'tennis');assert.equal(p.preset.braceletMetalTier,p.id==='mens_pillar_tennis_bracelet'?'supreme':'premium');assert.equal(p.preset.lockBraceletTier,true);assert(fs.existsSync(root+'/images/'+p.image));}
 assert.equal(products.find(p=>p.id==='ds_m_aurea_bracelet').collection,'dailySparkle');assert.equal(products.find(p=>p.id==='sl_b_diamond_paperclip_link_bracelet').collection,'singleLady');
});
test('every tennis carat option quotes authoritative design-specific prices across metals and deposits',()=>{
 for(const p of tennis)for(const metal of ['gold','platinum','silver'])for(const carat of ['0.25','0.50','0.75','1.00'])for(const paymentPercentage of [30,50,100]){
  const input={productId:p.id,metal,karat:18,purity:925,quantity:1,paymentPercentage,braceletMetalTier:'essential',diamonds:[{quality:'luxe',carat,qty:99}]};
  const q=quoteDaily(input,'tennis');assert.equal(q.params.braceletMetalTier,p.preset.braceletMetalTier);assert.equal(q.params.diamonds[0].qty,1);assert.equal(q.total,pricing.PRICING_PACKAGE_MATRIX[p.preset.braceletMetalTier][metal==='gold'?'18K':metal]+p.preset.diamondPriceOptions[carat]);assert.equal(q.due,Math.round(q.total*paymentPercentage)/100);
 }
});
test('legacy collection requests stay compatible; invalid options cannot reach payment',()=>{
 for(const p of tennis.filter(p=>!p.id.startsWith('tennis_'))){const body={productId:p.id,metal:'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,braceletMetalTier:'supreme',diamonds:p.preset.diamonds};assert.equal(quoteDaily(body,p.id.startsWith('mens_')?'mens':'occasionWear').total,quoteDaily(body,'tennis').total);}
 const p=tennis[0];assert.throws(()=>quoteDaily({productId:p.id,metal:'gold',karat:18,quantity:1,paymentPercentage:100,diamonds:[{quality:'select',carat:'2.00',qty:1}]},'tennis'),/available bracelet diamond size/);
});
test('collection is crawlable, self-canonical and connected from homepage',()=>{
 const html=fs.readFileSync(root+'/tennis-collection.html','utf8');assert.match(html,/rel="canonical" href="https:\/\/victoria-diamonds.com\/tennis-collection.html"/);assert.match(html,/"@type":"CollectionPage"/);for(const p of tennis)assert(html.includes('product.html?item='+p.id));assert(fs.readFileSync(root+'/index.html','utf8').includes('href="tennis-collection.html"'));
});
