document.addEventListener('DOMContentLoaded', () => {
 'use strict';
 const t=(en,cn)=>document.documentElement.lang.startsWith('zh')?cn:en;
 const header=document.querySelector('.site-header');
 new ResizeObserver(()=>document.documentElement.style.setProperty('--landing-header-height',header.offsetHeight+'px')).observe(header);
 const menu=document.querySelector('.collection-menu');
 document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
 const mobileCollections=document.createElement('div'); mobileCollections.className='mobile-collections';
 document.querySelectorAll('.collection-menu-links a').forEach(link=>mobileCollections.append(link.cloneNode(true)));
 document.querySelector('.mobile-nav-links li').append(mobileCollections);
 const sectionLinks=Array.from(document.querySelectorAll('.section-nav a'));
 const observer=new IntersectionObserver(entries=>{
  const entry=entries.find(entry=>entry.isIntersecting);if(!entry)return;
  sectionLinks.forEach(link=>{if(link.hash==='#'+entry.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 },{rootMargin:'-25% 0px -55% 0px',threshold:0});
 sectionLinks.forEach(link=>{const section=document.querySelector(link.hash);if(section)observer.observe(section);});

 // Existing artist content and information dialogs gain focus containment and return focus.
 const artist=document.getElementById('artistModal');
 function closeArtist(){artist.classList.remove('active');artist.setAttribute('aria-hidden','true');document.body.style.overflow='';}
 document.getElementById('craftArtistBtn').addEventListener('click',()=>{artist.classList.add('active');artist.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});
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
 // Show automatically only after browsing and a cookie choice, once per session.
 const started=Date.now();let browsed=false;
 window.addEventListener('scroll',()=>{if(window.scrollY>250)browsed=true;},{passive:true});
 const read=(store,key)=>{try{return store.getItem(key);}catch{return null;}};
 const timer=setInterval(()=>{
  if(read(sessionStorage,'emailPopupShown')){clearInterval(timer);return;}
  if(!window.vdNewsletterReady||Date.now()-started<30000||!browsed||document.visibilityState!=='visible')return;
  if(!['all','essential'].includes(read(localStorage,'vdCookieConsent')))return;
  if(document.querySelector('.modal-overlay.active,dialog[open],.mobile-nav.active,.collection-menu[open]'))return;
  if(document.activeElement?.matches('input,textarea,select'))return;
  window.openVictoriaNewsletter();clearInterval(timer);
 },2000);
 window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
 // Defer offscreen imagery, retaining immediate collection photo loading.
 document.querySelectorAll('section:not(#collections) img').forEach(img=>{img.loading='lazy';img.decoding='async';});
});
