/* Shared navigation: existing page controls remain available on small screens. */
document.addEventListener('DOMContentLoaded',()=>{
 const header=document.querySelector('header');if(!header)return;
 const nativeLanguage=document.querySelector('#productLanguage,#langSelect,#mensLanguage,#langSelectMobile');
 if(!nativeLanguage){
  let preferred=new URLSearchParams(location.search).get('lang');
  if(!preferred)try{preferred=localStorage.getItem('victoriaLanguage');}catch{}
  if(preferred)document.documentElement.lang=preferred.toLowerCase()==='zh-hk'?'zh-HK':'en';
 }
 const syncLanguageURL=()=>{
  const url=new URL(location.href);
  if(document.documentElement.lang.startsWith('zh'))url.searchParams.set('lang','zh-HK');
  else if(url.searchParams.get('lang')?.toLowerCase()==='zh-hk')url.searchParams.delete('lang');
  if(url.href!==location.href)history.replaceState(history.state,'',url);
 };
 syncLanguageURL();
 document.addEventListener('click',event=>{
  const link=event.target.closest?.('a[href]');
  if(!link)return;
  if(!document.documentElement.lang.startsWith('zh')){if(link.dataset.languageCarry){link.href=link.dataset.languageCarry;delete link.dataset.languageCarry;}return;}
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||!(/\.html$/i.test(url.pathname)||url.pathname==='/')||link.getAttribute('href').startsWith('#')||url.searchParams.has('lang'))return;
  link.dataset.languageCarry=link.getAttribute('href');url.searchParams.set('lang','zh-HK');link.href=url.href;
 },true);
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const link=(href,text,cls='')=>{const a=document.createElement('a');a.href=href;a.textContent=text;a.className=cls;return a;};
 const row=document.createElement('div');row.className='vd-header-row';
 const original=header.querySelector('.brand-signature,.logo,.wordmark,.brand');
 const brand=original?original.cloneNode(true):link('index.html','Victoria Diamonds','wordmark');brand.classList.add('vd-header-brand');brand.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));if(brand.id)brand.removeAttribute('id');
 const brandLink=brand.matches('a')?brand:brand.querySelector('a');if(brandLink)brandLink.href='index.html';
 const back=header.querySelector('.page-back-bar');
 row.append(brand);
 const nav=document.createElement('nav');nav.className='vd-primary-navigation';nav.setAttribute('aria-label',t('Main navigation','主要導覽'));
 const details=(title,items)=>{const d=document.createElement('details'),s=document.createElement('summary'),panel=document.createElement('div');d.className='vd-nav-menu';s.textContent=title;panel.className='vd-nav-panel';for(const item of items)panel.append(item);d.append(s,panel);d.addEventListener('toggle',()=>{if(d.open)nav.querySelectorAll('details').forEach(other=>{if(other!==d&&!d.contains(other)&&!other.contains(d))other.open=false;});});return d;};
 function render(){
  nav.replaceChildren();
  const groups=window.VDProducts?.navigationGroups||[{id:'romance',en:'Romance',zh:'浪漫'},{id:'everyday',en:'Everyday',zh:'日常'},{id:'celebration',en:'Celebration',zh:'慶典'},{id:'men',en:'Men’s jewellery',zh:'男士珠寶'}];
  const grouped=groups.filter(group=>group.id!=='tennis').map(group=>link('view-catalogue.html?collection='+group.id,t(group.en,group.zh)));
  const tennis=details(t('Tennis','網球珠寶'),[link('view-catalogue.html?collection=tennis',t('All tennis pieces','所有網球珠寶')),link('view-catalogue.html?collection=tennis&type=Bracelet',t('Tennis bracelets','網球手鏈')),link('view-catalogue.html?collection=tennis&type=Necklace',t('Tennis necklaces','網球項鏈'))]);
  nav.append(details(t('Collections','系列'),[...grouped,link('prism-collection.html',t('Colour Diamond','彩色鑽石')),tennis,link('view-catalogue.html',t('Browse all pieces','瀏覽所有作品'))]));
  nav.append(link('corporate-collaborations.html',t('Corporate gifts','企業禮贈')));
  const guarantee=link('our-guarantee.html',t('Our Guarantee','我們的保證'));
  nav.append(details(t('Discovery','探索'),[link('journal.html',t('Blogs','網誌')),link('igi-certificate.html',t('IGI Certificate','IGI 證書')),link('jewellery-care.html',t('Jewellery care','珠寶保養')),guarantee,link('artist.html',t('Artist Collaborations','藝術家合作')),link('our-story.html',t('Craftsmanship','工藝'))]));
  nav.append(link('index.html#contact',t('Book appointment','預約'),'vd-book-appointment'));
 }
 render();row.append(nav);
 const catalogueLink=nav.querySelector('[href="Catalogue.pdf"]');if(catalogueLink)catalogueLink.download='Victoria-Diamonds-Catalogue.pdf';
 const language=document.createElement('select');language.className='vd-header-language';language.setAttribute('aria-label','Language / 語言');language.innerHTML='<option value="en">EN</option><option value="zh-HK">繁中</option>';language.value=document.documentElement.lang.startsWith('zh')?'zh-HK':'en';
 language.onchange=()=>{const old=document.querySelector('#productLanguage,#langSelect,#mensLanguage,#langSelectMobile');if(old){old.value=language.value;old.dispatchEvent(new Event('change',{bubbles:true}));}else{document.documentElement.lang=language.value;try{localStorage.setItem('victoriaLanguage',language.value);}catch{}}};row.append(language);
 const socials=document.createElement('div');socials.className='vd-header-socials';for(const [href,label,glyph] of [['https://www.instagram.com/victoriadiamondsco/','Instagram','<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".7"/>'],['https://wa.me/447594442577','WhatsApp','<path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z"/><path d="M8 8c0 4 4 8 8 8l1-2-3-1-1 1-3-3 1-1-1-3Z"/>']]){const a=link(href,'');a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',label);a.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">'+glyph+'</svg>';socials.append(a);}row.append(socials);
 const silver=link('silver-collection.html',t('Silver','純銀'),'vd-collection-pill vd-silver-end');row.append(silver);
 header.classList.add('vd-header-ready');header.append(row);
 if(back){const desktop=matchMedia('(min-width:1100px)');const positionBack=()=>{if(desktop.matches)row.prepend(back);else header.prepend(back);};desktop.addEventListener('change',positionBack);positionBack();}
 document.addEventListener('click',e=>{if(!nav.contains(e.target))nav.querySelectorAll('details').forEach(d=>d.open=false);});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=nav.querySelector('details[open]');if(open){open.open=false;open.querySelector('summary').focus();}}});
 // One mobile hierarchy across home, product and collection sheets.
 function mobileInformation(){
  document.querySelectorAll('.mobile-nav-links,.ux-menu-links,.ma-sheet-links').forEach(menu=>{
   const opened=[...menu.querySelectorAll('details[open]')].map(d=>d.dataset.mobileSection).filter(Boolean);
   const types=menu.querySelector('[data-mobile-section="types"]')||[...menu.querySelectorAll('details')].find(d=>d.querySelector('a[href*="?type="]'));
   const wrap=node=>{if(menu.tagName==='UL'){const li=document.createElement('li');li.append(node);return li;}return node;};
   const group=(title,key,items)=>{const d=document.createElement('details'),summary=document.createElement('summary');d.className='ux-menu-group';d.dataset.mobileSection=key;summary.textContent=title;d.append(summary,...items);d.open=opened.includes(key);return d;};
   const groups=window.VDProducts?.navigationGroups||[{id:'romance',en:'Romance',zh:'浪漫'},{id:'everyday',en:'Everyday',zh:'日常'},{id:'celebration',en:'Celebration',zh:'慶典'},{id:'men',en:'Men’s jewellery',zh:'男士珠寶'}];
   const tennis=group(t('Tennis','網球珠寶'),'tennis',[
    link('view-catalogue.html?collection=tennis',t('All tennis pieces','所有網球珠寶')),
    link('view-catalogue.html?collection=tennis&type=Bracelet',t('Tennis bracelets','網球手鏈')),
    link('view-catalogue.html?collection=tennis&type=Necklace',t('Tennis necklaces','網球項鏈'))]);
   const shopping=group(t('Collections','系列'),'collections',[
    ...groups.filter(g=>g.id!=='tennis').map(g=>link('view-catalogue.html?collection='+g.id,t(g.en,g.zh))),
    link('prism-collection.html',t('Colour Diamond','彩色鑽石')),tennis,
    link('view-catalogue.html',t('Browse all pieces','瀏覽所有作品'))]);
   const guarantee=link('our-guarantee.html',t('Our Guarantee','我們的保證'));
   const discover=group(t('Discovery','探索'),'discover',[
    link('journal.html',t('Blogs','網誌')),link('igi-certificate.html',t('IGI Certificate','IGI 證書')),
    link('jewellery-care.html',t('Jewellery care','珠寶保養')),guarantee,
    link('artist.html',t('Artist Collaborations','藝術家合作')),
    link('our-story.html',t('Craftsmanship','工藝'))]);
   discover.classList.add('vd-mobile-info');
   menu.replaceChildren(wrap(shopping));menu.classList.add('vd-mobile-menu');
   menu.append(wrap(link('silver-collection.html',t('Silver','純銀'),'vd-mobile-silver')));
   if(types){types.dataset.mobileSection='types';menu.append(wrap(types));}
   menu.append(wrap(discover),wrap(link('corporate-collaborations.html',t('Corporate gifts','企業禮贈'),'vd-mobile-primary-link')),wrap(link('index.html#contact',t('Book appointment','預約'),'vd-mobile-primary-link')));
  });
 }
 mobileInformation();
 document.addEventListener('vd-mobile-navigation-refresh',mobileInformation);
 new MutationObserver(()=>{syncLanguageURL();render();mobileInformation();language.value=document.documentElement.lang.startsWith('zh')?'zh-HK':'en';}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});
