/* Native links preserve the catalogue tab and its filters. */
document.addEventListener('DOMContentLoaded',()=>{
 const registry=window.VDProducts;if(!registry)return;
 const linked=[];
 document.querySelectorAll('.product-card').forEach(card=>{
  const collection=card.closest('[data-grid]')?.dataset.grid||Object.keys(registry.collections).find(id=>card.closest('#'+id));
  const name=card.querySelector('[data-product-name]')?.dataset.productName;
  const product=registry.find(collection,name);if(!product)return;
  const link=document.createElement('a');
  for(const attribute of card.attributes)if(!['role','tabindex','aria-label'].includes(attribute.name))link.setAttribute(attribute.name,attribute.value);
  link.href=registry.url(product);link.target='_blank';link.rel='noopener';link.style.color='inherit';link.style.textDecoration='none';
  link.setAttribute('aria-label',(card.querySelector('[data-product-name]')?.textContent||name)+(document.documentElement.lang.startsWith('zh')?' — 在新分頁開啟':' — opens in a new tab'));
  link.append(...card.childNodes);card.replaceWith(link);linked.push({link,product});
  // The original reveal observer watched the replaced element.
  link.classList.add('revealed');
  const action=document.createElement('span');action.style.cssText='display:block;margin:12px 16px;font-size:12px;text-decoration:underline;text-underline-offset:4px';
  const update=()=>{const zh=document.documentElement.lang.startsWith('zh');action.textContent=product.mode==='enquiry'?(zh?'預約諮詢 ↗':'Book appointment ↗'):product.mode==='silver'?(zh?'查看及購買 ↗':'View & buy ↗'):(zh?'查看及訂製 ↗':'View & customise ↗');link.href=registry.url(product);};
  link.append(action);update();document.getElementById('langSelect')?.addEventListener('change',update);
 });
 const legacy=()=>{
  const piece=new URLSearchParams(location.search).get('piece');
  let hash;try{hash=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const match=linked.find(({product})=>piece?product.name===piece:hash&&registry.slug(product.name)===hash);
  if(match)location.replace(registry.url(match.product));
 };
 legacy();window.addEventListener('hashchange',legacy);
});
