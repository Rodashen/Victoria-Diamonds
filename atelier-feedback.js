/* Shared decorative feedback. Quotes, CRM submissions and payments keep their existing handlers. */
(()=>{
 'use strict';
 let serial=0,indicator=null,delay=null;
 const tasks=new Map();
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 function ring(){const id='atelierMetal'+(++serial);return `<svg class="atelier-ring" viewBox="0 0 140 150" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8f6424"/><stop offset=".23" stop-color="#f2db9b"/><stop offset=".46" stop-color="#b8860b"/><stop offset=".7" stop-color="#fff0bf"/><stop offset="1" stop-color="#99712d"/></linearGradient></defs><ellipse class="atelier-ring-shadow" cx="70" cy="136" rx="34" ry="5" fill="#8b7559" opacity=".13"/><g class="atelier-ring-jewel"><ellipse cx="70" cy="88" rx="34" ry="39" fill="none" stroke="url(#${id})" stroke-width="9"/><ellipse cx="70" cy="88" rx="29" ry="34" fill="none" stroke="#fff0c2" stroke-width="1.2"/><path d="M50 54 57 44M90 54 83 44" stroke="url(#${id})" stroke-width="5" stroke-linecap="round"/><path d="M47 30 58 17h24l11 13-23 27Z" fill="#fbfaf6" stroke="#8b7757" stroke-width="1.4" stroke-linejoin="round"/><path d="M47 30h46M58 17l5 13 7 27 7-27 5-13M63 30l7-13 7 13" fill="none" stroke="#b8ab94" stroke-width="1.1"/><path d="m51 28 8-8 3 8Z" fill="#fff"/><path class="atelier-ring-glint" d="M105 32v14m-7-7h14M35 61v10m-5-5h10" stroke="#b8860b" stroke-width="1.4" stroke-linecap="round"/></g></svg>`;}
 function ensure(){if(indicator)return;indicator=document.createElement('div');indicator.className='atelier-busy';indicator.hidden=true;indicator.setAttribute('aria-hidden','true');indicator.innerHTML='<div class="atelier-busy-panel">'+ring()+'<span class="atelier-busy-label"></span></div>';document.body.append(indicator);}
 function draw(){
  ensure();clearTimeout(delay);
  if(!tasks.size){indicator.hidden=true;return;}
  const latest=[...tasks.values()].at(-1);indicator.querySelector('.atelier-busy-label').textContent=latest.label;
  // Native dialogs live above body overlays. Keep feedback in that same visual layer.
  const host=[...document.querySelectorAll('dialog[open]')].at(-1)||document.body;if(indicator.parentElement!==host)host.append(indicator);
  if(!indicator.hidden)return;
  delay=setTimeout(()=>{if(tasks.size)indicator.hidden=false;},160);
 }
 function set(key,active,label){
  const old=tasks.get(key);if(old)clearTimeout(old.expiry);tasks.delete(key);
  if(active){const expiry=setTimeout(()=>{tasks.delete(key);draw();},65000);tasks.set(key,{label:label||t('Preparing your piece…','正在準備您的珠寶…'),expiry});}
  draw();
 }
 function newsletterSuccess(element){
  if(!element)return;element.removeAttribute('data-i18n');element.dataset.newsletterConfirmation='';element.classList.add('atelier-confirmation');
  const art=document.createElement('div');art.className='atelier-confirmation-art';art.setAttribute('aria-hidden','true');art.innerHTML=ring();
  const eyebrow=document.createElement('p');eyebrow.className='atelier-confirmation-eyebrow';eyebrow.textContent='VICTORIA DIAMONDS';
  const title=document.createElement('h3');title.textContent=t('A little more sparkle, in your inbox.','為您的收件箱增添一點閃耀。');
  const message=document.createElement('p');message.textContent=t('Thank you for subscribing. You’re part of the Victoria Diamonds community.','感謝您的訂閱，歡迎加入 Victoria Diamonds 社群。');
  const note=document.createElement('p');note.className='atelier-confirmation-note';note.textContent=t('Discover new collections, jewellery stories and moments from our London atelier.','探索全新系列、珠寶故事及倫敦工作室的精彩時刻。');
  const follow=document.createElement('a');follow.href='https://www.instagram.com/victoriadiamondsco/';follow.target='_blank';follow.rel='noopener';follow.className='atelier-confirmation-follow';follow.textContent=t('Follow our story on Instagram ↗','在 Instagram 關注我們 ↗');
  element.replaceChildren(art,eyebrow,title,message,note,follow);element.setAttribute('role','status');
 }
 window.VDLoading={set};window.VDFeedback={ring,newsletterSuccess};
 const start=()=>{ensure();if(document.readyState!=='complete')set('page',true,t('Opening the atelier…','正在開啟工作室…'));};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
 document.addEventListener('DOMContentLoaded',()=>{set('page',false);document.querySelectorAll('.email-subscription-content').forEach(content=>{const column=content.querySelector('.email-subscription-text-column');if(column)content.querySelectorAll('.email-subscription-success,.email-subscription-error').forEach(state=>{if(state.parentElement!==column)column.append(state);});});},{once:true});
 window.addEventListener('pagehide',()=>{tasks.forEach(task=>clearTimeout(task.expiry));tasks.clear();clearTimeout(delay);if(indicator)indicator.hidden=true;});
 new MutationObserver(()=>document.querySelectorAll('[data-newsletter-confirmation]').forEach(newsletterSuccess)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
