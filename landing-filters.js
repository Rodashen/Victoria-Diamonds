document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const registry=window.VDProducts,browser=window.VDCatalogueBrowser,cards=window.VDProductCards;if(!registry||!browser||!cards)return;
 const collection=document.getElementById('landingCollection'),type=document.getElementById('landingType'),max=document.getElementById('landingPrice'),reset=document.getElementById('landingClear');
 if(!collection)return;
 const results=document.getElementById('landingProductResults'),grid=results.querySelector('.showcase-grid'),status=document.getElementById('landingFilterStatus'),browse=document.getElementById('landingBrowseMatches'),track=document.getElementById('collectionCarousel'),controls=document.querySelector('.collection-carousel-controls');
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const label=(id,text)=>document.querySelector(`label[for="${id}"] span`).textContent=text;
 function options(select,values){const selected=select.value;select.replaceChildren();values.forEach(([value,text])=>{const option=document.createElement('option');option.value=value;option.textContent=text;select.append(option);});select.value=selected;}
 function labels(){
  label('landingCollection',t('Collection','系列'));label('landingType',t('Jewellery type','珠寶類別'));label('landingPrice',t('Starting price','起始價格'));reset.textContent=t('Clear filters','清除篩選');
  options(collection,[['',t('All collections','所有系列')],...Object.entries(registry.collections).map(([key,value])=>[key,value[document.documentElement.lang.startsWith('zh')?2:0]])]);
  const types=[...new Set(registry.products.map(product=>product.category==='Earring Stud'?'Earring':product.category))];
  options(type,[['',t('All types','所有類別')],...types.map(value=>[value,cards.categoryName(value)])]);
  options(max,[['',t('Any price','所有價格')],['200',t('Up to £200','£200 以下')],['1000',t('Up to £1,000','£1,000 以下')],['2500',t('Up to £2,500','£2,500 以下')],['5000',t('Up to £5,000','£5,000 以下')]]);
 }
 function update(){
  const active=!!(collection.value||type.value||max.value),filters={collection:collection.value,type:type.value,max:max.value};
  track.hidden=active;controls.hidden=active;results.hidden=!active;reset.hidden=!active;status.hidden=!active;
  grid.replaceChildren();if(!active)return;
  const matches=registry.products.filter(product=>browser.filterProduct({...product,price:cards.price(product)},filters));
  matches.slice(0,6).forEach(product=>grid.append(cards.create(product)));
  status.textContent=matches.length?t(`${matches.length} matching pieces · Showing ${Math.min(6,matches.length)}.`,`${matches.length} 件符合條件的作品 · 顯示 ${Math.min(6,matches.length)} 件。`):t('No pieces match these filters. Try another combination or clear the filters.','沒有符合篩選條件的作品。請嘗試其他條件或清除篩選。');
  const url=new URL('view-catalogue.html',location.href);Object.entries(filters).forEach(([key,value])=>{if(value)url.searchParams.set(key,value);});browse.href=url.pathname.split('/').pop()+url.search;browse.hidden=!matches.length;browse.textContent=t(`Browse all ${matches.length} matching pieces →`,`瀏覽所有 ${matches.length} 件符合條件的作品 →`);
 }
 [collection,type,max].forEach(select=>select.addEventListener('change',update));reset.addEventListener('click',()=>{collection.value='';type.value='';max.value='';update();collection.focus();});
 new MutationObserver(()=>{labels();update();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});labels();update();
});
