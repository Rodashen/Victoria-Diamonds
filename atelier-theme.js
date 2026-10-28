/* Progressive visual enhancement. Existing content, URLs and checkout own the behaviour. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 function brand(){document.querySelectorAll('.brand-signature :is(.logo,.wordmark,.brand),.footer-logo,header>.brand').forEach(el=>{
  if(el.querySelector('.brand-victoria'))return;
  for(const text of [...el.childNodes]){if(text.nodeType!==Node.TEXT_NODE||!text.textContent.includes('Victoria'))continue;const parts=text.textContent.split('Victoria');const span=document.createElement('span');span.className='brand-victoria';span.textContent='Victoria';text.replaceWith(document.createTextNode(parts.shift()),span,document.createTextNode(parts.join('Victoria')));break;}
 });}
 brand();new MutationObserver(brand).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const editorial=document.querySelector('.collection-editorial'),rail=editorial?.querySelector('.collection-rail');
 if(editorial&&rail){
  editorial.prepend(rail);
  const menu=document.createElement('details');menu.className='collection-mobile-menu';
  const summary=document.createElement('summary');summary.textContent='Explore all collections';
  const links=document.createElement('nav');links.setAttribute('aria-label','All jewellery collections');
  rail.querySelectorAll('a').forEach(row=>{const a=document.createElement('a');a.href=row.href;a.textContent=row.querySelector('strong').textContent;links.append(a);});menu.append(summary,links);editorial.append(menu);
  const labels=()=>{summary.textContent=document.documentElement.lang.startsWith('zh')?'探索全部系列':'Explore all collections';rail.querySelectorAll('strong').forEach((name,i)=>links.children[i].textContent=name.textContent);};
  new MutationObserver(labels).observe(rail,{childList:true,subtree:true,characterData:true});labels();
 }
 const filters=document.querySelector('.landing-collection-filters'),actions=document.querySelector('.collection-browse-actions');
 if(filters&&actions){const toggle=document.createElement('button');toggle.type='button';toggle.className='atelier-filter-toggle';toggle.textContent='Filters';toggle.setAttribute('aria-expanded','false');filters.id='collectionFilters';toggle.setAttribute('aria-controls',filters.id);filters.hidden=true;toggle.onclick=()=>{filters.hidden=!filters.hidden;toggle.setAttribute('aria-expanded',String(!filters.hidden));};actions.append(toggle);const mobileTrigger=document.querySelector('.ux-filter-bar .ux-filter-trigger');if(mobileTrigger){mobileTrigger.classList.add('atelier-mobile-filter');actions.append(mobileTrigger);}}
});
