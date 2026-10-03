/* Shared search and catalogue filters. Prices shown here never determine payment amounts. */
(() => {
 'use strict';
 const collections = {
  dailySparkle: ['Daily Sparkle', 'daily-sparkle.html', '日常閃耀'],
  occasionalWear: ['High Note', 'high-note-collection.html', '華麗樂章'],
  foreverBond: ['Forever Bond', 'forever-bond.html', '永恆之約'],
  silverCollection: ['Silver Collection', 'silver-collection.html', '純銀系列'],
  singleLady: ['Aura', 'aura-collection.html', 'Aura 系列']
 };
 const types = {Ring:['Rings','戒指'], Earring:['Earrings','耳環'], Necklace:['Necklaces','項鏈'], Bracelet:['Bracelets','手鏈'], Anklet:['Anklets','腳鏈'], Brooch:['Brooches','胸針'], Tiara:['Tiaras','冠冕']};
 const typeOf = category => category === 'Earring Stud' ? 'Earring' : category;
 const zh = () => document.documentElement.lang.startsWith('zh');
 const t = (en, cn) => zh() ? cn : en;
 const normal = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const translatedName = name => typeof translations !== 'undefined' && zh() ? translations['zh-HK']['product-'+name] || name : name;
 function productURL(product) {
  const registered=window.VDProducts?.find(product.collection,product.name);
  if(registered)return VDProducts.url(registered);
  const url = new URL(collections[product.collection][1], location.href);
  url.searchParams.set('piece', product.name);
  url.searchParams.set('lang', zh() ? 'zh-HK' : 'en');
  return url.href;
 }
 function inventory() {
  return (window.VDCatalogueGroups || []).flatMap(group => group.items.map(item => {
   const daily = group.collection === 'dailySparkle' && window.DailyProducts?.products.find(p => p.name === item.name);
   return {...item, price: daily ? daily.price : item.price, collection: group.collection, category: group.category};
  }));
 }
 function matches(product, query) {
  const text = normal([product.name, translatedName(product.name), collections[product.collection][0], collections[product.collection][2], product.category, ...(types[typeOf(product.category)] || [])].join(' '));
  return normal(query).trim().split(/\s+/).every(word => text.includes(word));
 }
 function money(product) {
  if (!Number.isFinite(Number(product.price)) || product.price === '') return t('Price on request','價格請洽詢');
  const amount = new Intl.NumberFormat('en-GB', {style:'currency',currency:product.currency || 'GBP', maximumFractionDigits:0}).format(Number(product.price));
  return (product.collection==='dailySparkle' ? t('Shown configuration: ','所示配置：') : product.fixedPrice ? '' : t('From ','起價 ')) + amount;
 }
 function element(tag, text, className) { const el=document.createElement(tag); if(text!==undefined)el.textContent=text; if(className)el.className=className; return el; }
 document.addEventListener('DOMContentLoaded', () => {
  const products=inventory();
  window.VDCatalogueBrowser={products, matches, productURL};
  const openers=document.querySelectorAll('[data-search-open]');
  if(openers.length) {
   const dialog=document.createElement('dialog'); dialog.className='catalogue-search'; dialog.id='catalogueSearch'; dialog.setAttribute('aria-labelledby','catalogueSearchTitle');
   dialog.innerHTML='<div class="search-heading"><h2 id="catalogueSearchTitle"></h2><button type="button" class="search-close"></button></div><label for="jewellerySearch"></label><input id="jewellerySearch" type="search" autocomplete="off"><p class="search-status" role="status" aria-live="polite"></p><div class="search-results"></div><a class="search-all" href="view-catalogue.html"></a>';
   document.body.append(dialog);
   const input=dialog.querySelector('input'), results=dialog.querySelector('.search-results'), status=dialog.querySelector('.search-status');
   let opener=null;
   function render() {
    dialog.querySelector('h2').textContent=t('Find your piece','尋找您的珠寶');
    dialog.querySelector('.search-close').textContent=t('Close ×','關閉 ×');
    dialog.querySelector('label').textContent=t('Search by piece, collection or jewellery type','搜尋作品、系列或珠寶類別');
    input.placeholder=t('Try “link charm” or “bracelets”','例如「link charm」或「手鏈」');
    const query=input.value.trim(), found=query ? products.filter(p=>matches(p,query)) : [];
    results.replaceChildren();
    status.textContent=query ? found.length ? t(found.length+' matching pieces','找到 '+found.length+' 件作品') : t('No pieces found. Try a collection or a shorter name.','未找到作品，請嘗試系列名稱或較短的名稱。') : t('Start typing to explore all five collections.','輸入關鍵字以探索五個系列。');
    found.slice(0,8).forEach(p=>{
     const a=element('a',undefined,'search-result'); a.href=productURL(p); a.target='_blank'; a.rel='noopener';
     const img=new Image(); img.src='images/'+p.image; img.alt=''; img.loading='lazy'; img.width=70; img.height=80;
     const copy=element('span'); copy.append(element('strong',translatedName(p.name)),element('small',collections[p.collection][zh()?2:0]+' · '+money(p)));
     a.append(img,copy,element('span','→')); results.append(a);
    });
    const all=dialog.querySelector('.search-all'); all.href='view-catalogue.html?q='+encodeURIComponent(query); all.textContent=t('Browse all matching pieces →','瀏覽所有符合的作品 →');
   }
   openers.forEach(button=>button.addEventListener('click',()=>{opener=button;document.querySelectorAll('.collection-menu[open]').forEach(d=>d.open=false);render();dialog.showModal();input.focus();}));
   dialog.querySelector('.search-close').addEventListener('click',()=>dialog.close());
   dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
   dialog.addEventListener('close',()=>opener?.focus());
   input.addEventListener('input',render);
   input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();location.href='view-catalogue.html?q='+encodeURIComponent(input.value.trim());}});
  }
  const sort=document.getElementById('sortSelect');
  if(!sort) return;
  const controls=element('section',undefined,'catalogue-filters'); controls.setAttribute('aria-label','Find jewellery');
  const makeSelect=(id,label,options)=>{const wrap=element('label',label);const select=element('select');select.id=id;options.forEach(([value,name])=>{const option=element('option',name);option.value=value;select.append(option);});wrap.append(select);controls.append(wrap);return select;};
  const label=element('label',t('Search pieces','搜尋作品'));const query=element('input');query.type='search';query.id='catalogueQuery';label.append(query);controls.append(label);
  const collection=makeSelect('collectionFilter',t('Collection','系列'),[['',t('All collections','所有系列')],...Object.entries(collections).map(([key,value])=>[key,value[zh()?2:0]])]);
  const type=makeSelect('typeFilter',t('Jewellery type','珠寶類別'),[['',t('All types','所有類別')],...Object.entries(types).map(([key,value])=>[key,value[zh()?1:0]])]);
  const price=makeSelect('priceFilter',t('Displayed price (GBP)','顯示價格（英鎊）'),[['',t('Any price','所有價格')],['200',t('Up to £200','£200 以下')],['1000',t('Up to £1,000','£1,000 以下')],['2500',t('Up to £2,500','£2,500 以下')],['5000',t('Up to £5,000','£5,000 以下')]]);
  const reset=element('button',t('Clear filters','清除篩選'));reset.type='button';controls.append(reset);
  const status=element('p',undefined,'filter-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  const empty=element('div',t('No pieces match these filters. Try another search or clear the filters.','沒有符合篩選的作品。請嘗試其他關鍵字或清除篩選。'),'filter-empty');empty.hidden=true;
  document.querySelector('.catalogue-sort-wrapper').before(controls,status,empty);
  const grids=Array.from(document.querySelectorAll('.product-grid'));
  grids.forEach(grid=>Array.from(grid.children).forEach((card,index)=>card.dataset.browseOrder=index));
  function fromURL() {
   const params=new URLSearchParams(location.search);
   query.value=params.get('q') || '';collection.value=params.get('collection') || '';type.value=params.get('type') || '';price.value=params.get('max') || '';sort.value=params.get('sort') || 'default';
   if(!sort.value)sort.value='default';
  }
  function update(persist=true) {
   let count=0;
   grids.forEach(grid=>{
    const group=grid.dataset.grid, category=grid.dataset.category; const cards=Array.from(grid.querySelectorAll('.product-card'));
    cards.forEach(card=>{
     const name=card.querySelector('[data-product-name]').dataset.productName;
     const p=products.find(p=>p.collection===group&&p.name===name);
     const show=!!p&&(!collection.value||group===collection.value)&&(!type.value||typeOf(category)===type.value)&&matches(p,query.value)&&(!price.value||(Number.isFinite(Number(p.price))&&p.price!==''&&(!p.currency||p.currency==='GBP')&&Number(p.price)<=Number(price.value)));
     card.hidden=!show;if(show)count++;
    });
    cards.sort((a,b)=>{
     if(sort.value==='default')return Number(a.dataset.browseOrder)-Number(b.dataset.browseOrder);
     const pa=Number(a.dataset.price),pb=Number(b.dataset.price);
     const aKnown=a.dataset.price!==''&&Number.isFinite(pa),bKnown=b.dataset.price!==''&&Number.isFinite(pb);
     if(aKnown!==bKnown)return aKnown?-1:1;
     return sort.value==='price-desc'?pb-pa:pa-pb;
    }).forEach(card=>grid.append(card));
    grid.hidden=!cards.some(card=>!card.hidden);
    if(grid.previousElementSibling?.classList.contains('category-label'))grid.previousElementSibling.hidden=grid.hidden;
   });
   document.querySelectorAll('.collection-section').forEach(section=>{
    const visible=Array.from(section.querySelectorAll('.product-card')).filter(card=>!card.hidden).length;
    section.hidden=!visible;
    const counter=section.querySelector('.count');
    if(counter){counter.removeAttribute('data-i18n');counter.textContent=t(visible+' pieces',visible+' 件作品');}
   });
   status.textContent=t(count+' pieces · Prices are for the displayed configuration. Sorting applies within each category.','共 '+count+' 件作品 · 價格為所示配置，排序按每個類別進行。');
   empty.hidden=count>0;
   if(persist){const url=new URL(location.href);[['q',query.value.trim()],['collection',collection.value],['type',type.value],['max',price.value],['sort',sort.value==='default'?'':sort.value]].forEach(([key,value])=>value?url.searchParams.set(key,value):url.searchParams.delete(key));history.replaceState(null,'',url);}
  }
  fromURL();update(false);
  query.addEventListener('input',()=>update());[collection,type,price,sort].forEach(el=>el.addEventListener('change',()=>update()));
  reset.addEventListener('click',()=>{query.value='';collection.value='';type.value='';price.value='';sort.value='default';update();query.focus();});
  window.addEventListener('popstate',()=>{fromURL();update(false);});
  document.getElementById('langSelect')?.addEventListener('change',()=>location.reload());
 });
})();
