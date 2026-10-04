document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const track=document.getElementById('collectionCarousel');if(!track)return;
 const cards=[...track.querySelectorAll('.collection-item')],previous=document.getElementById('collectionPrevious'),next=document.getElementById('collectionNext'),status=document.getElementById('collectionCarouselStatus');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const go=offset=>track.scrollBy({left:offset*(cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap)),behavior:reduced.matches?'instant':'smooth'});
 previous.addEventListener('click',()=>go(-1));next.addEventListener('click',()=>go(1));
 track.addEventListener('keydown',event=>{if(event.target!==track)return;if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();if(event.key==='ArrowLeft')go(-1);else if(event.key==='ArrowRight')go(1);else track.scrollTo({left:event.key==='Home'?0:track.scrollWidth,behavior:reduced.matches?'instant':'smooth'});});
 let timer;
 function update(){
  const box=track.getBoundingClientRect();const visible=cards.map((card,index)=>({index,box:card.getBoundingClientRect()})).filter(card=>card.box.left>=box.left-2&&card.box.right<=box.right+2);
  const first=visible[0]?.index??0,last=visible.at(-1)?.index??first;
  previous.disabled=track.scrollLeft<=2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
  const zh=document.documentElement.lang.startsWith('zh');previous.setAttribute('aria-label',zh?'上一個系列':'Previous collection');next.setAttribute('aria-label',zh?'下一個系列':'Next collection');
  status.textContent=zh?`系列 ${first+1}–${last+1} / ${cards.length} · 滑動以探索`:`Collections ${first+1}–${last+1} of ${cards.length} · Swipe to explore`;
 }
 track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(update,150);},{passive:true});new ResizeObserver(update).observe(track);
 new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});update();
});
