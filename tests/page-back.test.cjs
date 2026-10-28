const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),source=fs.readFileSync(path.join(root,'page-back.js'),'utf8');
function run({referrer='',entries,historyLength=2,product=false,page}={}){
 const events={},calls=[],location={href:'https://victoria-diamonds.com/product.html?item=test#order',origin:'https://victoria-diamonds.com',pathname:'/product.html',search:'?item=test',assign:url=>calls.push(['assign',url])};
 const document={documentElement:{lang:'en'},body:{},referrer,querySelectorAll:()=>[],addEventListener:(name,fn)=>events[name]=fn};
 if(page){location.pathname=page;location.href=location.origin+page;location.search='';}
 const history={length:historyLength,go:delta=>calls.push(['go',delta])};
 const window={VDProducts:product?{products:[{id:'test',collection:'dailySparkle'}],collections:{dailySparkle:['Daily Sparkle','daily-sparkle.html']}}:undefined,navigation:entries?{entries:()=>entries,currentEntry:{index:entries.length-1},traverseTo:key=>calls.push(['traverse',key])}:undefined};
 vm.runInNewContext(source,{document,window,location,history,URL,URLSearchParams,MutationObserver:class{observe(){}}});events.DOMContentLoaded();
 return {calls,history,click:()=>events.click({target:{closest:()=>({closest:()=>null})},preventDefault(){}})};
}
test('Back skips product #order history and returns to preceding page',()=>{
 const s=run({entries:[{index:0,key:'collection',url:'https://victoria-diamonds.com/daily-sparkle.html'},{index:1,key:'product',url:'https://victoria-diamonds.com/product.html?item=test'},{index:2,key:'order',url:'https://victoria-diamonds.com/product.html?item=test#order'}]});s.click();assert.deepEqual(s.calls,[['traverse','collection']]);
});
test('Legacy history skips anchors created after arrival',()=>{const s=run({referrer:'https://victoria-diamonds.com/aura-collection.html'});s.history.length=4;s.click();assert.deepEqual(s.calls,[['go',-3]]);});
test('New-tab product returns to referring catalogue including its filters',()=>{const s=run({historyLength:1,referrer:'https://victoria-diamonds.com/view-catalogue.html?type=Ring'});s.click();assert.deepEqual(s.calls,[['assign','https://victoria-diamonds.com/view-catalogue.html?type=Ring']]);});
test('Direct product entry falls back to its own collection',()=>{const s=run({historyLength:1,product:true});s.click();assert.deepEqual(s.calls,[['assign','daily-sparkle.html']]);});

test('Every collection returns to the homepage showcase regardless of previous page',()=>{
 for(const name of ['daily-sparkle','high-note-collection','forever-bond','silver-collection','aura-collection','mens-collection','keepsake-collection','tennis-collection','view-catalogue']){
  for(const suffix of ['.html','','/']){
   const s=run({page:'/'+name+suffix,referrer:'https://victoria-diamonds.com/product.html?item=test',entries:[{index:0,key:'product',url:'https://victoria-diamonds.com/product.html?item=test'},{index:1,key:'collection',url:'https://victoria-diamonds.com/'+name+suffix}]});
   s.click();assert.deepEqual(s.calls,[['assign','index.html#collections']],name+suffix);
  }
 }
});
test('New-tab blank entries never send customers to an empty page',()=>{const s=run({referrer:'https://victoria-diamonds.com/high-note-collection.html',entries:[{index:0,key:'blank',url:'about:blank'},{index:1,key:'piece',url:'https://victoria-diamonds.com/product.html?item=test'}]});s.click();assert.deepEqual(s.calls,[['assign','https://victoria-diamonds.com/high-note-collection.html']]);});
test('Every public page includes Back assets; only the homepage omits the Back control',()=>{
 for(const file of fs.readdirSync(root).filter(name=>name.endsWith('.html'))){const html=fs.readFileSync(path.join(root,file),'utf8');for(const asset of ['page-back.js','page-back.css','class="page-back-bar"'])assert.equal(html.split(asset).length-1,file==='index.html'&&asset==='class="page-back-bar"'?0:1,file+' '+asset);}
});
