const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8'),html=read('artist.html');
test('Artist profile has crawlable biography, gallery, canonical URL and matching structured data',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(html.match(/<title>(.*?)<\/title>/s)[1].length<60);
 assert.ok(html.match(/name="description" content="([^"]+)"/)[1].length<155);
 assert.match(html,/rel="canonical" href="https:\/\/victoria-diamonds.com\/artist.html"/);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@graph'][0]['@type'],'ProfilePage');
 assert.equal(schema['@graph'][1].name,'Rachel Gemma Tan');
 assert.equal((html.match(/data-artwork /g)||[]).length,3);
 assert.ok(html.includes('Nanyang Academy of Fine Arts'));
 for(const [,attrs] of html.matchAll(/<img\b([^>]+)>/g)) {
  if(!attrs.includes('src='))continue; // The dialog image is populated only when opened.
  assert.match(attrs,/alt="[^"]+"/);assert.match(attrs,/width="\d+"/);assert.match(attrs,/height="\d+"/);
 }
 for(const [,resource] of html.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^(https?:|mailto:|tel:)/.test(resource))assert.ok(fs.existsSync(path.join(root,resource.split(/[?#]/)[0])),resource);
 for(const [,anchor] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes('id="'+anchor+'"'),anchor);
});
test('Artist page is discoverable through the homepage, Journal headers, mobile menu and sitemap',()=>{
 const home=read('index.html');assert.match(home,/<a href="artist.html"[^>]*class="btn-primary"[^>]*id="craftArtistBtn"/);
 assert.ok(home.includes('<a href="artist.html" class="nav-catalog">Know Our Artist</a>'));
 for(const file of fs.readdirSync(root).filter(n=>/^journal(?:-.*)?\.html$/.test(n)))assert.match(read(file).match(/<header[\s\S]*?<\/header>/)[0],/href="artist.html"/,file);
 assert.ok(read('sitemap.xml').includes('<loc>https://victoria-diamonds.com/artist.html</loc>'));
 assert.ok(read('mobile-browsing.js').includes("link('artist.html'"));
 assert.ok(!read('landing-page.js').includes("getElementById('craftArtistBtn').addEventListener"));
});
