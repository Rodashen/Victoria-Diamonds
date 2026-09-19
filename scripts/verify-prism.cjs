const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.resolve(__dirname,'..');
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
let scripts=0,assets=0;
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8');
 assert(s.includes('href="prism.css"')&&s.includes('src="prism.js"'),f+' shared design missing');
 for(const m of s.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){new vm.Script(m[1],{filename:f});scripts++;}
 for(const m of s.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
  const p=m[1].split(/[?#]/)[0];if(!p||/^(https?:|mailto:|tel:|data:)/.test(p)||p.includes(" + ")||p.includes('\\'))continue;
  assert(fs.existsSync(path.join(root,p)),f+': missing '+p);assets++;
 }
 const forms=[...s.matchAll(/<form id="emailSubscriptionForm"[\s\S]*?<\/form>/g)];
 if(!f.includes('policy')){
  assert.equal(forms.length,1,f+' newsletter form count');
  for(const name of ['xnQsjsdp','xmIwtLD','actionType','Last Name','Email','aG9uZXlwb3Q'])assert(forms[0][0].includes('name="'+name+'"'),f+' missing '+name);
  assert(forms[0][0].includes('type="email"')&&forms[0][0].includes('required'),f+' email validation');
 }
}
for(const f of ['prism.js','victoria-diamonds.js','translations.js'])new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const inventory=f=>{let out=[];const s=fs.readFileSync(path.join(root,f),'utf8');for(const m of s.matchAll(/renderProducts\('[^']+', \[[\s\S]*?\], '[^']+'\);/g)){vm.runInNewContext(m[0],{renderProducts:(id,items,cat)=>out.push(...items.map(item=>({...item,collection:id,category:cat}))) });}return out;};
let expected=[];for(const [file,count] of [['daily-sparkle.html',31],['high-note-collection.html',26],['forever-bond.html',20],['silver-collection.html',16],['aura-collection.html',19]]){
 const products=inventory(file);assert.equal(products.length,count,file+' inventory count');expected.push(...products);
 for(const p of products){assert(fs.existsSync(path.join(root,'images',p.image)),p.name+' original missing');assert(fs.existsSync(path.join(root,'images/optimized',p.image.replace(/\.[^.]+$/,'.webp'))),p.name+' optimized missing');}
}
const combined=inventory('view-catalogue.html');assert.equal(combined.length,112);
for(const p of expected){const match=combined.find(x=>x.name===p.name&&x.collection===p.collection);assert(match,p.name+' missing from combined catalogue');assert.equal(match.price,p.price,p.name+' price mismatch');assert.equal(match.image,p.image,p.name+' image mismatch');}
const silver=fs.readFileSync(path.join(root,'silver-collection.html'),'utf8');assert(silver.includes('paymentPercentage: 100'),'Full-payment request missing');assert(!/name="paymentType" value="(?:30|50)"/.test(silver),'Deposit choice returned');
console.log(`PASS: ${files.length} pages, ${scripts} inline scripts, shared scripts, ${assets} local references, eight newsletter forms, all 112 products and images, catalogue prices, Silver full-payment contract.`);
