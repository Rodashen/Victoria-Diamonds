const corporateCopy=[...document.querySelectorAll('[data-gift-hk]')].map(el=>[el,el.textContent]);
function renderCorporateCopy(){
 const chinese=document.documentElement.lang.startsWith('zh');
 for(const [el,english] of corporateCopy)el.textContent=chinese?el.dataset.giftHk:english;
}
renderCorporateCopy();
new MutationObserver(renderCorporateCopy).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
