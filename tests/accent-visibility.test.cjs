const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),c={window:{},document:{documentElement:{lang:'en'}}};
for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js','design-rules.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
const rules=c.window.VDDesignRules,products=c.window.VDProducts.products;

test('all custom ring designs keep their catalogue stone counts fixed',()=>{
 const rings=products.filter(p=>p.category==='Ring'&&p.mode==='custom');
 assert(rings.length>80);
 for(const p of rings){
  assert.equal(rules.hasFixedRingCounts(p),true,p.id);
  assert.equal(rules.hasFixedRingCounts(p.preset),true,p.id+' checkout preset');
  for(const stone of p.preset.diamonds)assert(Number.isInteger(stone.qty)&&stone.qty>0,p.id);
 }
 assert.equal(products.find(p=>p.id==='ow_m_eternelle').preset.diamonds[0].qty,14);
 for(const p of products.filter(p=>p.category==='Bracelet'))assert.equal(rules.hasFixedRingCounts(p),false,p.id);
});
test('all small secondary presets are internal while principal stones stay available',()=>{
 let checked=0;
 for(const p of products.filter(p=>p.preset?.diamonds?.length)){
  assert.equal(rules.isAccent(p,0),false,p.id);
  p.preset.diamonds.forEach((d,i)=>{if(i>0&&Number(d.carat)<=.2){assert.equal(rules.isAccent(p,i),true,p.id);checked++;}});
 }
 assert(checked>20);
 for(const id of ['ds_s_princess','mens_current_band','sl_r_three_stone_round_classic'])assert.equal(rules.isAccent(products.find(p=>p.id===id),1),false,id);
});
test('halo public facts omit accent counts, sizes and calculated total',()=>{
 for(const p of products.filter(p=>p.haloDesign)){
  assert(rules.hasAccents(p));
  assert(rules.publicDetails(p).every(d=>!['hiddenHalo','paveBand','stoneCount','totalKarat'].includes(d.key)));
  assert(p.preset.diamonds[1].qty>0,'internal pricing preset retained');
 }
});
test('browser and first-response product facts share the same disclosure policy',()=>{
 for(const f of ['product-page.js','scripts/generate-product-html.cjs'])assert.match(fs.readFileSync(path.join(root,f),'utf8'),/VDDesignRules.publicDetails\(p\)/);
 for(const f of ['daily-checkout.js','natural-shopping.js','product-cards.js'])assert.match(fs.readFileSync(path.join(root,f),'utf8'),/VDDesignRules.isAccent/);
});
