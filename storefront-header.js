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
 const details=(title,items)=>{const d=document.createElement('details'),s=document.createElement('summary'),panel=document.createElement('div');d.className='vd-nav-menu';s.textContent=title;panel.className='vd-nav-panel';for(const item of items)panel.append(item);d.append(s,panel);d.addEventListener('toggle',()=>{if(d.open)nav.querySelectorAll('details').forEach(other=>{if(other!==d&&!d.contains(other))other.open=false;});});return d;};
 function render(){
  nav.replaceChildren(link('silver-collection.html',t('Silver Collection','純銀系列'),'vd-collection-pill'),link('prism-collection.html',t('Color Diamond Collection','彩色鑽石系列'),'vd-collection-pill vd-prism-pill'));
  nav.append(link('white-diamond-collection.html',t('White Diamond','白色鑽石'),'vd-collection-pill'));
  nav.append(link('corporate-collaborations.html',t('Corporate gifts','企業禮贈')));
  const groups=window.VDProducts?.navigationGroups||[{"id":"romance","en":"Romance","zh":"浪漫"},{"id":"everyday","en":"Everyday","zh":"日常"},{"id":"celebration","en":"Celebration","zh":"慶典"},{"id":"tennis","en":"Tennis","zh":"網球珠寶"},{"id":"men","en":"Men’s jewellery","zh":"男士珠寶"}];
  const grouped=groups.filter(group=>group.id!=='tennis').map(group=>link('view-catalogue.html?collection='+group.id,t(group.en,group.zh)));
  nav.append(details(t('Collections','系列'),[...grouped,link('view-catalogue.html',t('Browse all pieces','瀏覽所有作品'))]));
  nav.append(details(t('Tennis','網球珠寶'),[link('view-catalogue.html?collection=tennis',t('All tennis pieces','所有網球珠寶')),link('view-catalogue.html?collection=tennis&type=Bracelet',t('Tennis bracelets','網球手鏈')),link('view-catalogue.html?collection=tennis&type=Necklace',t('Tennis necklaces','網球項鏈'))]));
  const guarantee=document.createElement('button');guarantee.type='button';guarantee.textContent=t('Our Guarantee','我們的保證');guarantee.onclick=()=>{const trigger=header.querySelector('.js-guarantee-trigger');if(trigger)trigger.click();else location.href='index.html?panel=guarantee';};
  nav.append(details(t('Discover Victoria','探索 Victoria'),[link('journal.html',t('Blogs','日誌及鑽石指南')),link('Jewelry-Care.pdf',t('Jewellery care','珠寶保養')),link('Catalogue.pdf',t('Download our catalogue','下載目錄')),guarantee,link('artist.html',t('Know Our Artist','認識藝術家')),link('index.html#story',t('Our story','品牌故事')),link('index.html#craftsmanship',t('Craftsmanship','工藝'))]));
  nav.append(link('index.html#contact',t('Book appointment','預約'),'vd-book-appointment'));
 }
 render();row.append(nav);
 const catalogueLink=nav.querySelector('[href="Catalogue.pdf"]');if(catalogueLink)catalogueLink.download='Victoria-Diamonds-Catalogue.pdf';
 const language=document.createElement('select');language.className='vd-header-language';language.setAttribute('aria-label','Language / 語言');language.innerHTML='<option value="en">EN</option><option value="zh-HK">繁中</option>';language.value=document.documentElement.lang.startsWith('zh')?'zh-HK':'en';
 language.onchange=()=>{const old=document.querySelector('#productLanguage,#langSelect,#mensLanguage,#langSelectMobile');if(old){old.value=language.value;old.dispatchEvent(new Event('change',{bubbles:true}));}else{document.documentElement.lang=language.value;try{localStorage.setItem('victoriaLanguage',language.value);}catch{}}};row.append(language);
 const socials=document.createElement('div');socials.className='vd-header-socials';for(const [href,label,glyph] of [['https://www.instagram.com/victoriadiamondsco/','Instagram','<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r=".7"/>'],['https://wa.me/447594442577','WhatsApp','<path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z"/><path d="M8 8c0 4 4 8 8 8l1-2-3-1-1 1-3-3 1-1-1-3Z"/>']]){const a=link(href,'');a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',label);a.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4">'+glyph+'</svg>';socials.append(a);}row.append(socials);
 header.classList.add('vd-header-ready');header.append(row);
 if(back){const desktop=matchMedia('(min-width:1100px)');const positionBack=()=>{if(desktop.matches)row.prepend(back);else header.prepend(back);};desktop.addEventListener('change',positionBack);positionBack();}
 document.addEventListener('click',e=>{if(!nav.contains(e.target))nav.querySelectorAll('details').forEach(d=>d.open=false);});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){const open=nav.querySelector('details[open]');if(open){open.open=false;open.querySelector('summary').focus();}}});
 function mobileInformation(){
  document.querySelectorAll('.mobile-nav-links a,.ux-menu-links a').forEach(a=>{if(a.dataset.i18n==='nav-visit-us'||/^visit us$/i.test(a.textContent.trim())){(a.closest('li')||a).remove();}else if(/book appointment/i.test(a.textContent)){a.href='index.html#contact';a.removeAttribute('target');}});
  document.querySelectorAll('.mobile-nav-links,.ux-menu-links,.ma-sheet-links').forEach(menu=>{
   menu.querySelector('.vd-mobile-info')?.closest('.vd-mobile-info-item')?.remove();menu.querySelector('.vd-mobile-info')?.remove();
   for(const child of [...menu.children]){const a=child.matches('a')?child:child.matches('li')?child.querySelector(':scope > a'):null;if(a&&(a.matches('.js-guarantee-trigger')||/journal\.html|artist\.html|#(?:story|craftsmanship|diamond-pricing)|Jewelry-Care\.pdf|Catalogue\.pdf/.test(a.getAttribute('href')||'')))child.remove();}
   const group=document.createElement('details');group.className='vd-mobile-info';const summary=document.createElement('summary');summary.textContent=t('Discover Victoria','探索 Victoria');group.append(summary);if(!menu.querySelector(':scope > li > a[href="corporate-collaborations.html"]'))group.append(link('corporate-collaborations.html',t('Corporate gifts','企業禮贈')));
   for(const [href,en,zh] of [['journal.html','Blogs','日誌及鑽石指南'],['Jewelry-Care.pdf','Jewellery care','珠寶保養'],['Catalogue.pdf','Download our catalogue','下載目錄'],['index.html?panel=guarantee','Our Guarantee','我們的保證'],['artist.html','Know Our Artist','認識藝術家'],['index.html#story','Our story','品牌故事'],['index.html#craftsmanship','Craftsmanship','工藝']])group.append(link(href,t(en,zh)));
   if(menu.tagName==='UL'){const li=document.createElement('li');li.className='vd-mobile-info-item';li.append(group);menu.append(li);}else menu.append(group);
  });
 }
 mobileInformation();
 document.querySelectorAll('.mobile-nav-links > li > a').forEach(a=>{if(a.dataset.i18n==='nav-collections'){const item=document.createElement('li');item.append(link('white-diamond-collection.html',t('White Diamond','白色鑽石')));a.closest('li').before(item);}});
 new MutationObserver(()=>{syncLanguageURL();render();mobileInformation();language.value=document.documentElement.lang.startsWith('zh')?'zh-HK':'en';}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Keep mobile navigation compact; expose Prism inside each existing menu.
 document.querySelectorAll('.mobile-nav-links,.ma-sheet-links').forEach(menu=>{if(menu.querySelector('[href="prism-collection.html"]'))return;const a=link('prism-collection.html',t('Color diamond','稜彩 · 彩色培育鑽石'));if(menu.tagName==='UL'){const li=document.createElement('li');li.append(a);menu.prepend(li);}else menu.prepend(a);});
 if(new URLSearchParams(location.search).get('panel')==='guarantee')header.querySelector('.js-guarantee-trigger')?.click();
});
