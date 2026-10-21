/* Progressive mobile presentation. Existing controls, product links and checkout remain authoritative. */
document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const mobile=matchMedia('(max-width:760px)'),zh=()=>document.documentElement.lang.startsWith('zh'),t=(en,cn)=>zh()?cn:en;
 const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
 const dialogs=[];
 function sheet(title){
  const dialog=el('dialog','ux-sheet'),head=el('div','ux-sheet-heading'),heading=el('h2','',title),close=el('button','ux-sheet-close','×');
  heading.id='uxSheetTitle'+dialogs.length;dialog.setAttribute('aria-labelledby',heading.id);close.type='button';close.setAttribute('aria-label',t('Close','關閉'));head.append(heading,close);dialog.append(head);document.body.append(dialog);dialogs.push(dialog);
  let opener=null;close.onclick=()=>dialog.close();dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});dialog.addEventListener('close',()=>{document.documentElement.classList.remove('ux-sheet-open');if(opener?.isConnected)opener.focus();});
  return {dialog,heading,open(button){dialogs.forEach(other=>{if(other!==dialog&&other.open)other.close();});opener=button;dialog.showModal();document.documentElement.classList.add('ux-sheet-open');close.focus();}};
 }
 // Put the same filter elements in a mobile sheet; desktop and no-JS retain inline controls.
 const toolbar=document.querySelector('.landing-collection-filters,.showcase-toolbar,.catalogue-filters');
 if(toolbar){
  const summary=toolbar.querySelector('.showcase-count');if(summary)toolbar.after(summary);
  const fields=[...toolbar.children].filter(node=>node.matches('label,.showcase-filter,button'));
  if(document.querySelector('.catalogue-filters')){document.body.classList.add('ux-catalogue-page');const sort=document.getElementById('sortSelect');if(sort){const wrap=el('label','ux-sort-field',t('Sort','排序'));wrap.append(sort);toolbar.append(wrap);fields.push(wrap);document.querySelector('.catalogue-sort-wrapper')?.classList.add('ux-original-sort');}}
  if(fields.length){
   const bar=el('div','ux-filter-bar'),button=el('button','ux-filter-trigger'),chips=el('div','ux-filter-chips');button.type='button';button.setAttribute('aria-haspopup','dialog');chips.setAttribute('aria-label',t('Selected filters','已選篩選'));bar.append(button);toolbar.before(bar);toolbar.after(chips);
   const panel=sheet(t('Filter & sort','篩選及排序')),body=el('div','ux-filter-fields'),actions=el('div','ux-filter-actions'),clear=el('button','ux-clear',t('Clear all','清除全部')),done=el('button','ux-apply',t('Show pieces','顯示作品'));clear.type=done.type='button';actions.append(clear,done);panel.dialog.append(body,actions);
   const slots=fields.map(field=>{const marker=document.createComment('filter position');field.before(marker);return {field,marker};});
   const selects=()=>[...toolbar.querySelectorAll('select'),...body.querySelectorAll('select')];
   function update(){
    chips.replaceChildren();let count=0;
    [...toolbar.querySelectorAll('input[type=search]'),...body.querySelectorAll('input[type=search]')].forEach(input=>{if(!input.value.trim())return;count++;const chip=el('button','ux-filter-chip',input.value.trim()+' ×');chip.type='button';chip.setAttribute('aria-label',t('Remove search: ','移除搜尋：')+input.value.trim());chip.onclick=()=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));update();};chips.append(chip);});
    selects().forEach(select=>{if(!select.value||select.value==='default')return;count++;const chip=el('button','ux-filter-chip',(select.selectedOptions[0]?.textContent||select.value)+' ×');chip.type='button';chip.setAttribute('aria-label',t('Remove filter: ','移除篩選：')+(select.selectedOptions[0]?.textContent||select.value));chip.onclick=()=>{select.value=select.options[0].value;select.dispatchEvent(new Event('change',{bubbles:true}));update();};chips.append(chip);});
    button.textContent=t('Filter & sort','篩選及排序')+(count?' ('+count+')':'');panel.heading.textContent=t('Filter & sort','篩選及排序');clear.textContent=t('Clear all','清除全部');done.textContent=t('Show pieces','顯示作品');chips.hidden=!count;
   }
   function move(){if(panel.dialog.open)panel.dialog.close();slots.forEach(({field,marker})=>mobile.matches?body.append(field):marker.after(field));toolbar.classList.toggle('ux-filters-in-sheet',mobile.matches);update();}
   button.onclick=()=>panel.open(button);done.onclick=()=>panel.dialog.close();
   clear.onclick=()=>{[...body.querySelectorAll('input[type=search]')].forEach(input=>{input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));});selects().forEach(select=>{select.value=select.options[0].value;select.dispatchEvent(new Event('change',{bubbles:true}));});update();};
   [toolbar,body].forEach(node=>{node.addEventListener('change',update);node.addEventListener('input',update);});new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});mobile.addEventListener('change',move);move();
  }
 }
 // Collection and product headers use a native modal menu, sharing the real registry links.
 const header=!document.querySelector('.site-header')?document.querySelector('header'):null;
 if(header&&window.VDProducts){
  header.classList.add('ux-mobile-header');const button=el('button','ux-menu-button',t('Menu','選單'));button.type='button';button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-expanded','false');header.append(button);
  const menu=sheet(t('Explore Victoria Diamonds','探索 Victoria Diamonds')),nav=el('nav','ux-menu-links');nav.setAttribute('aria-label',t('Mobile navigation','手機導覽'));
  function link(href,label){const a=el('a','',label);a.href=href;return a;}
  function links(){nav.replaceChildren();menu.heading.textContent=t('Explore Victoria Diamonds','探索 Victoria Diamonds');button.textContent=t('Menu','選單');nav.append(link('view-catalogue.html',t('Browse all pieces →','瀏覽全部作品 →')));const collections=el('details','ux-menu-group'),summary=el('summary','',t('Shop by collection','按系列選購'));collections.open=true;collections.append(summary);Object.values(VDProducts.collections).forEach(value=>collections.append(link(value[1],value[zh()?2:0])));nav.append(collections);
   const types=el('details','ux-menu-group');types.append(el('summary','',t('Shop by jewellery type','按珠寶類型選購')));[['Ring','Rings','戒指'],['Earring','Earrings','耳環'],['Necklace','Necklaces','項鏈'],['Bracelet','Bracelets','手鏈'],['Pendant','Pendants','吊墜'],['Key Charm','Initial charms','字母吊飾']].forEach(([type,en,cn])=>types.append(link('view-catalogue.html?type='+encodeURIComponent(type),t(en,cn))));nav.append(types,link('index.html#contact',t('Bespoke & appointments →','訂製及預約 →')),link('journal.html',t('Journal & diamond guides','珠寶日誌及鑽石指南')),link('index.html#diamond-pricing',t('Diamond pricing','鑽石價格')));
  }
  links();menu.dialog.append(nav);button.onclick=()=>{button.setAttribute('aria-expanded','true');menu.open(button);};menu.dialog.addEventListener('close',()=>button.setAttribute('aria-expanded','false'));mobile.addEventListener('change',()=>{if(!mobile.matches&&menu.dialog.open)menu.dialog.close();});new MutationObserver(links).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 }
});
