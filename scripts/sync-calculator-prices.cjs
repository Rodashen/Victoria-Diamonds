// Refresh public starting prices from the local calculator, without exposing internal pricing data.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),calculator=process.env.CALCULATOR_ROOT||path.resolve(root,'../../calculator');
const {quoteDaily}=require(path.join(calculator,'daily-checkout'));
const natural=require(path.join(calculator,'natural-diamonds-data')),rules=require(path.join(calculator,'order-configuration-rules.json'));
const context={window:{},document:{documentElement:{lang:'en'}}};
const sources=['catalogue-data.js','daily-products.js','high-note-products.js','remaining-products.js','mens-products.js','product-registry.js'];
for(const file of sources)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const registry=context.window.VDProducts,changes=[];
for(const [file,key] of [['daily-products.js','DailyProducts'],['high-note-products.js','HighNoteProducts'],['remaining-products.js','RemainingProducts'],['mens-products.js','MensProducts']]){
 const data=context.window[key];if(!data)throw Error('Missing catalogue '+key);
 let source=fs.readFileSync(path.join(root,file),'utf8');
 let changed=false;
 for(const item of data.products){
  const product=registry.products.find(p=>p.id===item.id&&p.mode==='custom');if(!product)continue;
  const preset=product.preset;
  const body={productId:product.id,metal:preset.defaultMetal||'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,braceletMetalTier:preset.braceletMetalTier,diamonds:preset.diamonds,...(preset.initialRequired?{initial:'A'}:{})};
  const price=quoteDaily(body,preset.collection).total;
  if(price!==item.price||item.designFee){
   changes.push({id:item.id,name:item.name,before:item.price,after:price});
   source=source.replace(new RegExp('("id"\\s*:\\s*"'+item.id+'"[\\s\\S]*?"price"\\s*:\\s*)[\\d.]+'),(_,prefix)=>prefix+price);
   source=source.replace(new RegExp('("id"\\s*:\\s*"'+item.id+'"[\\s\\S]*?"designFee"\\s*:\\s*)[\\d.]+'),(_,prefix)=>prefix+'0');
   item.price=price;item.designFee=0;changed=true;
  }
 }
 if(changed)fs.writeFileSync(path.join(root,file),source);
}
// Reload after updating presets, so both full and lightweight snapshots use the same configurations.
for(const file of sources)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const items=natural.items.map(({id,shape,carat,colour,clarity,cut,price})=>({id,shape,carat,colour,clarity,cut,price}));
const products={};
for(const p of context.window.VDProducts.products.filter(p=>p.mode==='custom')){
 const preset=p.preset,diamonds=preset.diamonds.map(d=>({...d,quality:'select'}));
 const body={productId:p.id,metal:preset.defaultMetal||'gold',karat:18,purity:925,quantity:1,paymentPercentage:100,braceletMetalTier:preset.braceletMetalTier,diamonds,...(preset.initialRequired?{initial:'A'}:{})};
 const lab=quoteDaily(body,preset.collection).total;
 let naturalDesign=diamonds;
 if(preset.diamondPriceOptions){
  const listed=(p.details||[]).filter(d=>['centreStone','mainDiamond','mainSide','secondarySide','finishingSide','sideStone','eachDiamond'].includes(d.key)).map(d=>{const match=d.value.match(/([\d.]+)\s*(?:ct\s*)?[x×]\s*(\d+)/i);return match?{carat:Number(match[1]),qty:Number(match[2])}:{carat:parseFloat(d.value),qty:1};}).filter(d=>d.carat>0);
  const total=parseFloat(p.details?.find(d=>d.key==='totalKarat')?.value);
  naturalDesign=listed.length?listed:Number.isFinite(total)&&Number.isInteger(total/Number(diamonds[0].carat))?[{carat:Number(diamonds[0].carat),qty:total/Number(diamonds[0].carat)}]:[];
 }
 const selected=naturalDesign.map(d=>{const stone=items.filter(i=>i.carat===Number(d.carat)).sort((a,b)=>a.price-b.price)[0];return stone?{naturalId:stone.id,qty:d.qty}:null;});
 const available=!rules[p.id]?.labOnly&&selected.length>0&&selected.every(Boolean);
 products[p.id]={lab,natural:available?quoteDaily({...body,diamondOrigin:'natural',diamonds:selected},preset.collection).total:null,labOnly:!!rules[p.id]?.labOnly,diamonds,naturalDesign};
}
const date='2026-10-28';
fs.writeFileSync(path.join(root,'diamond-catalogue.js'),'/* Calculator catalogue snapshot, '+date+'. Final prices are confirmed by the payment server. */\nwindow.VDDiamondCatalogue='+JSON.stringify({date,currency:'GBP',items,products})+';\n');
fs.writeFileSync(path.join(root,'diamond-prices.js'),'/* Lightweight collection starting prices; full stone catalogue loads only on product pages. */\nwindow.VDDiamondCatalogue='+JSON.stringify({date,currency:'GBP',products})+';\n');
console.log(JSON.stringify({updatedPresets:changes.length,products:Object.keys(products).length,changes},null,2));
