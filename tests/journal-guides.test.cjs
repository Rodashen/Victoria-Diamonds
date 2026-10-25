const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),slugs=['tennis-necklace','tennis-bracelet','diamond-gifting','yellow-white-gold','diamond-shapes','gold-purity'];
test('six new journal guides are discoverable with valid article metadata and local resources',()=>{
 const journal=fs.readFileSync(path.join(root,'journal.html'),'utf8'),sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
 const published=fs.readdirSync(root).filter(file=>/^journal-.+\.html$/.test(file)&&!/<meta\b[^>]*content=["'][^"']*noindex/i.test(fs.readFileSync(path.join(root,file),'utf8')));
 assert.equal((journal.match(/class="journal-card"/g)||[]).length,published.length);
 for(const slug of slugs){
  const file='journal-'+slug+'.html',source=fs.readFileSync(path.join(root,file),'utf8');
  assert.ok(journal.includes('href="'+file+'"'));assert.ok(sitemap.includes('/'+file));
  assert.equal((source.match(/<h1>/g)||[]).length,1);
  assert.ok(source.match(/<title>(.*?)<\/title>/)[1].length<=60);
  assert.ok(source.match(/name="description" content="([^"]+)"/)[1].length<=155,slug+' description');
  const schema=JSON.parse(source.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@type'],'Article');assert.equal(schema.datePublished,'2026-10-18');assert.equal(schema.mainEntityOfPage,'https://victoria-diamonds.com/'+file);
  for(const [,anchor] of source.matchAll(/href="#([^"]+)"/g))assert.ok(source.includes('id="'+anchor+'"'),anchor);
  for(const [,resource] of source.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^(https?:|mailto:|tel:)/.test(resource))assert.ok(fs.existsSync(path.join(root,resource.split(/[?#]/)[0])),resource);
  for(const [,attrs] of source.matchAll(/<img\b([^>]+)>/g))assert.match(attrs,/alt="[^"]+"/);
  assert.ok(source.includes('AI-created editorial illustration'));
 }
});
