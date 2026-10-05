/* One collection browsing layout; product identity and checkout stay in the registry. */
document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const registry=window.VDProducts;
 const page=location.pathname.split('/').filter(Boolean).pop();
 const collection=Object.keys(registry?.collections||{}).find(key=>{const file=registry.collections[key][1];return file===page||file.slice(0,-5)===page;});
 if(!collection)return;
 const host=collection==='mensCollection'?document.getElementById('mensProducts'):document.querySelector('.collection-section');
 if(!host)return;
 const inventory=registry.products.filter(product=>product.collection===collection);
 const categories=[...new Set(inventory.map(product=>product.category))];
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const translated=window.VDProductCards.name;
 const categoryName=window.VDProductCards.categoryName;
 const normalize=value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const price=window.VDProductCards.price;
 const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 document.body.classList.add('collection-browsing');host.classList.add('collection-showcase');host.replaceChildren();
 document.querySelector('.catalogue-sort-wrapper')?.remove();
 document.querySelector('.mens-toolbar')?.remove();
 document.querySelector('.mens-hero .category-nav')?.remove();
 const jumps=element('nav','showcase-jumps');jumps.setAttribute('aria-label','Jump to jewellery category');
 const toolbar=element('section','showcase-toolbar');toolbar.id='pieces';toolbar.setAttribute('aria-label','Find and filter pieces');
 const searchLabel=element('label','',t('Find a piece','尋找作品'));searchLabel.htmlFor='collectionSearch';
 const search=element('input');search.type='search';search.id='collectionSearch';
 const typeLabel=element('label','',t('Category','類別'));typeLabel.htmlFor='collectionType';
 const type=element('select');type.id='collectionType';
 const sortLabel=element('label','',t('Sort','排序'));sortLabel.htmlFor='collectionSort';
 const sort=element('select');sort.id='collectionSort';
 const status=element('p','showcase-count');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 toolbar.append(searchLabel,search,typeLabel,type,sortLabel,sort,status);
 const results=element('div','showcase-results');
 const empty=element('div','showcase-empty');empty.hidden=true;
 const reset=element('button');reset.type='button';reset.addEventListener('click',()=>{search.value='';type.value='';sort.value='default';render();search.focus();});
 empty.append(element('p','',t('No matching pieces. Try another name or category.','沒有符合條件的作品。請嘗試其他名稱或類別。')),reset);
 host.append(jumps,toolbar,results,empty);
 const categoryId=category=>collection==='mensCollection'?'mens-'+registry.slug(category)+'s':'pieces-'+registry.slug(category);
 function labels(){
  searchLabel.textContent=t('Find a piece','尋找作品');search.placeholder=t('Search this collection','搜尋此系列');typeLabel.textContent=t('Category','類別');sortLabel.textContent=t('Sort','排序');reset.textContent=t('Clear filters','清除篩選');
  const selected=type.value,sorted=sort.value||'default';type.replaceChildren();sort.replaceChildren();jumps.replaceChildren();
  [['',t('All pieces','所有作品')],...categories.map(category=>[category,categoryName(category)])].forEach(([value,name])=>{const option=element('option','',name);option.value=value;type.append(option);});type.value=selected;
  [['default',t('Featured order','精選排序')],['asc',t('Price: low to high','價格：由低至高')],['desc',t('Price: high to low','價格：由高至低')]].forEach(([value,name])=>{const option=element('option','',name);option.value=value;sort.append(option);});sort.value=sorted;
  categories.forEach(category=>{const link=element('a','',categoryName(category)+' ');link.href='#'+categoryId(category);link.append(element('span','',inventory.filter(product=>product.category===category).length));link.addEventListener('click',()=>{search.value='';type.value='';render();});jumps.append(link);});
 }
 function render(){
  results.replaceChildren();const query=normalize(search.value.trim());let count=0;
  categories.filter(category=>!type.value||type.value===category).forEach(category=>{
   const products=inventory.filter(product=>product.category===category&&normalize(product.name+' '+translated(product)+' '+categoryName(category)).includes(query));
   if(sort.value!=='default')products.sort((a,b)=>{const pa=price(a),pb=price(b);if(pa===null)return pb===null?0:1;if(pb===null)return -1;return sort.value==='asc'?pa-pb:pb-pa;});
   if(!products.length)return;count+=products.length;
   const section=element('section','showcase-category');section.id=categoryId(category);section.append(element('h2','',categoryName(category)));
   const grid=element('div','showcase-grid');
   products.forEach(product=>grid.append(window.VDProductCards.create(product)));
section.append(grid);results.append(section);
  });
  status.textContent=t(`${count} pieces · Select a piece to open in a new tab.`,`${count} 件作品 · 選擇作品即可在新分頁開啟。`);empty.hidden=count!==0;
 }
 search.addEventListener('input',render);type.addEventListener('change',render);sort.addEventListener('change',render);
 new MutationObserver(()=>{labels();render();empty.firstChild.textContent=t('No matching pieces. Try another name or category.','沒有符合條件的作品。請嘗試其他名稱或類別。');}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 labels();render();
 if(location.hash&&categories.some(category=>'#'+categoryId(category)===location.hash))document.getElementById(location.hash.slice(1))?.scrollIntoView();
});
