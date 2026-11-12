/* Progressive shopping navigation. Original collection links and checkout remain authoritative. */
window.addEventListener('load',()=>{
 const registry=window.VDProducts,editorial=document.querySelector('.collection-editorial');if(!registry||!editorial)return;
 const zh=()=>document.documentElement.lang.startsWith('zh'),t=(en,cn)=>zh()?cn:en;
 const groups=registry.navigationGroups;
 const make=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls;if(text)e.textContent=text;return e;};
 const nav=make('aside','shopping-collections'),title=make('h3','',t('Discover your style','探索您的風格')),links=make('nav','shopping-links');links.setAttribute('aria-label',t('Collections','珠寶系列'));nav.append(title,links);
 function render(){title.textContent=t('Discover your style','探索您的風格');links.replaceChildren();groups.forEach(group=>{const a=make('a','',t(group.en,group.zh));a.href=registry.groupURL(group.id);links.append(a);});}
 render();editorial.prepend(nav);
 const shortcuts=document.querySelector('.type-links');if(shortcuts){editorial.before(shortcuts);shortcuts.classList.add('shopping-types');const all=make('a','',t('All pieces','所有作品'));all.href='view-catalogue.html';shortcuts.append(all);}
 const rail=editorial.querySelector('.collection-rail');if(rail)rail.hidden=true;
 const section=make('section','shopping-products'),head=make('div','shopping-products-heading'),heading=make('h2','',t('Start with a piece','從一件珠寶開始')),all=make('a','',t('View all pieces →','瀏覽所有作品 →'));all.href='view-catalogue.html';head.append(heading,all);const filters=make('div','shopping-groups'),grid=make('div','shopping-product-grid');filters.setAttribute('role','group');filters.setAttribute('aria-label',t('Jewellery type','珠寶類型'));grid.tabIndex=0;grid.setAttribute('role','region');grid.setAttribute('aria-label',t('Scrollable jewellery pieces','可捲動珠寶作品'));section.append(head,filters,grid);editorial.after(section);
 const category=p=>p.category==='Earring Stud'?'Earring':p.category==='Pendant'?'Necklace':p.category;
 const types=[['','All','全部'],['Ring','Rings','戒指'],['Earring','Earrings','耳環'],['Necklace','Necklaces & pendants','項鏈及吊墜'],['Bracelet','Bracelets','手鏈']];let type='';
 function products(){grid.replaceChildren();grid.scrollLeft=0;const pool=[...registry.products].sort((a,b)=>Number(b.mode==='custom')-Number(a.mode==='custom')).filter(p=>!registry.silverFamily(p)&&p.mode!=='enquiry'&&(!type||category(p)===type));const selected=type?pool.slice(0,20):['Ring','Earring','Necklace','Bracelet'].flatMap(c=>pool.filter(p=>category(p)===c).slice(0,5));selected.forEach(p=>{const a=make('a','shopping-product');a.href=registry.url(p);const img=make('img','');img.src='images/'+(p.thumbnail||p.image);img.alt=registry.imageAlt(p);img.width=480;img.height=480;img.loading='lazy';const copy=make('div','shopping-product-copy'),name=make('h3','',typeof window.getProductName==='function'?getProductName(p.name):p.name),record=window.VDDiamondCatalogue?.products[p.id],price=p.mode==='silver'?p.price:record?Math.min(record.lab??Infinity,record.natural??Infinity):p.preset?.price;copy.append(name,make('p','',p.metal||''));if(Number.isFinite(price))copy.append(make('strong','',new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(price)));copy.append(make('span','shopping-product-action',p.mode==='silver'?t('View & order →','查看及訂購 →'):t('View & customise →','查看及訂製 →')));a.append(img,copy);grid.append(a);});[...filters.children].forEach((b,i)=>{b.textContent=t(types[i][1],types[i][2]);b.setAttribute('aria-pressed',String(type===types[i][0]));});heading.textContent=t('Start with a piece','從一件珠寶開始');all.textContent=t('View all pieces →','瀏覽所有作品 →');}
 const arrows=make('div','shopping-scroll-buttons');
 for(const [step,label,symbol] of [[-1,t('Previous pieces','上一批作品'),'←'],[1,t('Next pieces','下一批作品'),'→']]){
  const arrow=make('button','',symbol);
  arrow.type='button';
  arrow.setAttribute('aria-label',label);
  arrow.onclick=()=>grid.scrollBy({left:step*grid.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  arrows.append(arrow);
 }
 filters.after(arrows);
 types.forEach(([key])=>{const b=make('button','');b.type='button';b.onclick=()=>{type=key;products();};filters.append(b);});products();document.body.classList.add('shopping-navigation-ready');new MutationObserver(()=>{render();products();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});

document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.getElementById('reviewPhotoDialog');
 if(!dialog||typeof dialog.showModal!=='function')return;
 const photo=dialog.querySelector('img');
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 document.querySelectorAll('.review-thumbnails a').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();
  photo.src=link.href;
  photo.alt=link.querySelector('img').alt;
  dialog.showModal();
 }));
});
