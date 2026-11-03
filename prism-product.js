document.addEventListener('DOMContentLoaded',()=>{
 const id=new URLSearchParams(location.search).get('item'),product=window.VDProducts?.products.find(p=>p.id===id);if(!product?.prism)return;
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const gallery=document.querySelector('.gallery'),photo=gallery?.querySelector('img'),full=gallery?.querySelector('a');if(!photo)return;
 let colour='pink',view='front';
 const views=document.createElement('div');views.className='prism-view-controls';views.setAttribute('role','group');views.setAttribute('aria-label',t('Product view','產品視圖'));
 const update=()=>{const src='images/products/'+id+'-'+colour+'-'+view+'.webp';photo.src=src;full.href=src;photo.alt=product.name+' — '+colour+' coloured lab-grown diamond, '+view+' design view in yellow gold';views.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));};
 for(const [value,en,zh] of [['front','Front view','正面'],['back','Back view','背面']]){const b=document.createElement('button');b.type='button';b.dataset.view=value;b.textContent=t(en,zh);b.onclick=()=>{view=value;update();};views.append(b);}gallery.querySelector('p').before(views);
 gallery.querySelector('p').textContent=t('Design visualisation in 18K yellow gold at the 1 ct reference size. Select a colour to preview it from both sides. Stone colour and proportions are illustrative; changing metal or carat does not alter the preview.','18K 黃金及 1 ct 參考設計示意圖。可選擇顏色並查看正背面。更改金屬或克拉不會改變預覽圖。');
 document.addEventListener('prism-colour-change',e=>{colour=e.detail.colour;update();});
 const intro=document.querySelector('.product-intro');const badge=document.createElement('p');badge.className='prism-lab-note';badge.textContent=t('Exclusively coloured lab-grown diamonds · Round brilliant','彩色培育鑽石專屬系列 · 圓形明亮式');intro.append(badge);
 update();
});
