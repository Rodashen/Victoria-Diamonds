const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('homepage metadata, heading and local business data are consistent',()=>{
 const title=html.match(/<title[^>]*>([^<]+)<\/title>/)[1],description=html.match(/<meta name="description" content="([^"]+)"/)[1];
 assert.ok(title.length<60);assert.ok(description.length<155);assert.match(description,/Hatton Garden/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/<h1[^>]*>Bespoke Jewellery Workshop in London<\/h1>/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json" id="atelierSchema">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@type'],'JewelryStore');assert.equal(schema.address.streetAddress,'59 Leather Lane');assert.equal(schema.address.postalCode,'EC1N 7TJ');assert.equal(schema.telephone,'+447594442577');
});
test('diamond pricing is visible semantic content and navigation uses real anchors',()=>{
 assert.ok(!html.includes('id="transparencyModal"'));
 const section=html.match(/<section class="transparency-section"[^>]*>([\s\S]*?)<\/section>/)[1];
 assert.match(section,/Lab-Grown Diamonds/);assert.match(section,/<caption>/);assert.match(section,/£594/);assert.ok(!section.includes('aria-hidden'));assert.ok(!section.includes('role="dialog"'));
 assert.equal((html.match(/href="#diamond-pricing"/g)||[]).length,2);
});
test('scripts and all HTML inline scripts parse; all active images have alt attributes',()=>{
 for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.js')&&!n.startsWith('test_')))new vm.Script(fs.readFileSync(path.join(root,name),'utf8'),{filename:name});
 for(const name of fs.readdirSync(root).filter(n=>n.endsWith('.html'))){
  const s=fs.readFileSync(path.join(root,name),'utf8');
  for(const [,attrs,script]of s.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g))if(!attrs.includes('application/ld+json'))new vm.Script(script,{filename:name});
  for(const [tag]of s.matchAll(/<img\b[^>]*>/g))assert.match(tag,/\balt\s*=/,name+': '+tag);
 }
});
test('all 205 product photos have distinct catalogue-based descriptions',()=>{
 const c={window:{},document:{documentElement:{lang:'en'}}};
 for(const f of ['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c);
 const {products,imageAlt}=c.window.VDProducts;assert.equal(new Set(products.map(imageAlt)).size,205);
 assert.match(imageAlt(products.find(p=>p.id==='silver_link_charm')),/Sterling 925/);
});
