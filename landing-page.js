document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const t=(en,cn)=>document.documentElement.lang.startsWith('zh')?cn:en;
 const mobilePromos=matchMedia('(max-width:760px)');
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const promos=document.querySelector('.homepage-promos');
 const slides=promos.querySelector('.promo-slides');
 const christmas=slides.querySelector('.christmas-promo');
 const usp=document.getElementById('bespoke-advantage');
 const design=document.querySelector('.home-customisation');
 const introduction=usp.querySelector('[data-i18n="home-hk-38"]');
 const benefitDetails=promos.querySelector('.promo-benefits');
 const controls=promos.querySelector('.promo-controls');
 const choices=[...controls.querySelectorAll('[data-promo-slide]')];
 const toggle=controls.querySelector('.promo-toggle');
 let current=0, promoTimer, paused=reduceMotion.matches;

 function showSlide(index){
  current=index;
  [usp,christmas].forEach((slide,i)=>{slide.inert=i!==index;});
  choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 }
 function schedulePromo(){
  clearTimeout(promoTimer);
  toggle.textContent=paused?t('Play','播放'):t('Pause','暫停');
  benefitDetails.firstElementChild.textContent=t('About our London atelier','關於我們的倫敦工作室');
  if(mobilePromos.matches||paused||document.hidden||slides.contains(document.activeElement))return;
  promoTimer=setTimeout(()=>{showSlide(1-current);schedulePromo();},4000);
 }
 function followPromoLink(){
  if(location.hash!=='#bespoke-advantage')return;
  if(mobilePromos.matches){usp.scrollIntoView();return;}
  paused=true;
  showSlide(0);
  usp.scrollIntoView();
  schedulePromo();
 }
 function positionSellingPoint(){
  if(mobilePromos.matches){
   usp.querySelector('.bespoke-advantages').before(introduction);
   design.before(usp);
   usp.inert=false;
   promos.classList.remove('promo-ready');
  }else{
   benefitDetails.append(introduction);
   slides.prepend(usp);
   showSlide(current);
   promos.classList.add('promo-ready');
  }
  controls.hidden=mobilePromos.matches;
  followPromoLink();
  schedulePromo();
 }
 choices.forEach((button,index)=>button.addEventListener('click',()=>{showSlide(index);schedulePromo();}));
 toggle.addEventListener('click',()=>{paused=!paused;schedulePromo();});
 slides.addEventListener('focusin',schedulePromo);
 slides.addEventListener('focusout',()=>setTimeout(schedulePromo,0));
 new MutationObserver(schedulePromo).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 document.addEventListener('visibilitychange',schedulePromo);
 window.addEventListener('hashchange',followPromoLink);
 mobilePromos.addEventListener('change',positionSellingPoint);
 reduceMotion.addEventListener('change',()=>{paused=reduceMotion.matches;schedulePromo();});
 positionSellingPoint();
 const header=document.querySelector('.site-header');
 new ResizeObserver(()=>document.documentElement.style.setProperty('--landing-header-height',header.offsetHeight+'px')).observe(header);
 const menu=document.querySelector('.collection-menu');
 document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
 const mobileCollections=document.createElement('details'); mobileCollections.className='mobile-collections ux-menu-group';
 const collectionSummary=document.createElement('summary');collectionSummary.textContent=t('Shop by collection','按系列選購');mobileCollections.append(collectionSummary);
 document.querySelectorAll('.collection-menu-links > :not([href$="collection=tennis"])').forEach(link=>mobileCollections.append(link.cloneNode(true)));
 const shopping=document.querySelector('[data-mobile-shopping]');
 shopping.replaceChildren(mobileCollections);
 const tennisItem=document.createElement('li'),tennis=document.createElement('details'),tennisTitle=document.createElement('summary');
 tennis.className='ux-menu-group';tennis.append(tennisTitle);tennisItem.dataset.mobileShopping='';tennisItem.append(tennis);mobileCollections.closest('li').after(tennisItem);
 const tennisLinks=[['','All tennis pieces','所有網球珠寶'],['Bracelet','Tennis bracelets','網球手鏈'],['Necklace','Tennis necklaces','網球項鏈']].map(([type,en,cn])=>{const a=document.createElement('a');a.href='view-catalogue.html?collection=tennis'+(type?'&type='+type:'');tennis.append(a);return [a,en,cn];});
 const updateTennis=()=>{tennisTitle.textContent=t('Tennis','網球珠寶');tennisLinks.forEach(([a,en,cn])=>a.textContent=t(en,cn));};
 updateTennis();
 const typeItem=document.createElement('li'),typeGroup=document.createElement('details'),typeSummary=document.createElement('summary');typeGroup.className='ux-menu-group';typeSummary.textContent=t('Shop by jewellery type','按珠寶類型選購');typeGroup.append(typeSummary);
 const typeLinks=[];[['Ring','Rings','戒指'],['Earring','Earrings','耳環'],['Necklace','Necklaces','項鏈'],['Bracelet','Bracelets','手鏈'],['Pendant','Pendants','吊墜'],['Key Charm','Initial charms','字母吊飾']].forEach(([type,en,cn])=>{const link=document.createElement('a');link.href='view-catalogue.html?type='+encodeURIComponent(type);link.textContent=t(en,cn);typeLinks.push([link,en,cn]);typeGroup.append(link);});typeItem.dataset.mobileShopping='';typeItem.append(typeGroup);tennisItem.after(typeItem);
 new MutationObserver(()=>{updateTennis();collectionSummary.textContent=t('Shop by collection','按系列選購');typeSummary.textContent=t('Shop by jewellery type','按珠寶類型選購');typeLinks.forEach(([link,en,cn])=>link.textContent=t(en,cn));}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const sectionLinks=Array.from(document.querySelectorAll('.section-nav a'));
 const observer=new IntersectionObserver(entries=>{
  const entry=entries.find(entry=>entry.isIntersecting);if(!entry)return;
  sectionLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 },{rootMargin:'-25% 0px -55% 0px',threshold:0});
 sectionLinks.forEach(link=>{const section=document.querySelector(link.hash);if(section)observer.observe(section);});

 // Existing artist content and information dialogs gain focus containment and return focus.
 const artist=document.getElementById('artistModal');
 function closeArtist(){artist.classList.remove('active');artist.setAttribute('aria-hidden','true');document.body.style.overflow='';}
 // Know Our Artist is now a normal link to the shareable artist gallery.
 artist.querySelectorAll('button').forEach(button=>button.addEventListener('click',closeArtist));
 artist.addEventListener('click',event=>{if(event.target===artist)closeArtist();});
 const focusable='a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select,summary,[tabindex="0"]';
 document.querySelectorAll('.modal-overlay').forEach(modal=>{
  modal.querySelectorAll('[role="dialog"]').forEach(inner=>{inner.removeAttribute('role');inner.removeAttribute('aria-modal');});
  modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
  const title=modal.querySelector('h2,h3');if(title){if(!title.id)title.id=modal.id+'Title';modal.setAttribute('aria-labelledby',title.id);}
  if(!modal.classList.contains('active'))modal.setAttribute('aria-hidden','true');
  let previous=null, wasOpen=false;
  new MutationObserver(()=>{
   const isOpen=modal.classList.contains('active');if(isOpen===wasOpen)return;wasOpen=isOpen;
   if(isOpen){previous=document.activeElement;modal.querySelector(focusable)?.focus();}
   else if(previous?.isConnected)previous.focus();
  }).observe(modal,{attributes:true,attributeFilter:['class']});
  modal.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&modal===artist)closeArtist();
   if(event.key!=='Tab')return;
   const items=Array.from(modal.querySelectorAll(focusable)).filter(el=>el.getClientRects().length);
   const first=items[0],last=items.at(-1);if(!first)return;
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
 });
 const photo=document.createElement('dialog');photo.className='photo-dialog';photo.setAttribute('aria-label','Customer photograph');
 photo.innerHTML='<button type="button">Close ×</button><img alt="">';document.body.append(photo);
 document.querySelectorAll('.testimonial-photos a').forEach(link=>link.addEventListener('click',event=>{
  event.preventDefault();photo.querySelector('img').src=link.href;photo.querySelector('img').alt=link.querySelector('img').alt;photo.querySelector('button').textContent=t('Close ×','關閉 ×');photo.showModal();
 }));
 photo.querySelector('button').addEventListener('click',()=>photo.close());photo.addEventListener('click',event=>{if(event.target===photo)photo.close();});
 const faqGroups={bespoke:[1,2,3,4,9,10],shopping:[5,6,7,8,12,15],delivery:[14],care:[11,13,16]};
 const questions=Array.from(document.querySelectorAll('.faq-question'));
 questions.forEach((button,i)=>{const answer=button.nextElementSibling;answer.id='faq-answer-'+(i+1);button.setAttribute('aria-controls',answer.id);});
 document.querySelectorAll('[data-faq-topic]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-faq-topic]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  questions.forEach((question,i)=>{const item=question.closest('.faq-item');item.hidden=button.dataset.faqTopic!=='all'&&!faqGroups[button.dataset.faqTopic].includes(i+1);});
 }));
 // A permanent route to the existing form, without a second CRM integration.
 document.querySelectorAll('[data-newsletter-open]').forEach(button=>button.addEventListener('click',()=>window.openVictoriaNewsletter()));
 document.getElementById('newsletterInlineForm').addEventListener('submit',event=>{
  event.preventDefault();window.openVictoriaNewsletter(document.getElementById('newsletterInlineEmail').value,true);
 });
 // Five seconds from page opening, independent of the cookie choice.
 const read=(store,key)=>{try{return store.getItem(key);}catch{return null;}};
 const timer=setTimeout(()=>{
  if(!read(sessionStorage,'emailPopupShown'))window.openVictoriaNewsletter();
 },Math.max(0,5000-performance.now()));
 window.addEventListener('pagehide',()=>clearTimeout(timer),{once:true});
 // Defer offscreen imagery, retaining immediate collection photo loading.
 document.querySelectorAll('section:not(#collections) img').forEach(img=>{img.loading='lazy';img.decoding='async';});
});
