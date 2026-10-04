(() => {
 'use strict';
 const params=new URLSearchParams(location.search);
 let language=params.get('lang');
 if(!language){try{language=localStorage.getItem('victoriaLanguage');}catch{}}
 const zh=language?.startsWith('zh');
 document.documentElement.lang=zh?'zh-HK':'en';
 const t=(en,cn)=>zh?cn:en;
 const dictionary=zh?translations['zh-HK']:{};
 const tr=(key,fallback)=>dictionary?.[key]||fallback;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=value=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(Number(value));
 const categories=[
  {name:'Ring',id:'mens-rings',en:'Rings',zh:'戒指',descriptionEn:'Signet and diamond bands, ready to tailor to your own specification.',descriptionZh:'印章戒指與鑽石戒指，可按您的喜好訂製。'},
  {name:'Bracelet',id:'mens-bracelets',en:'Bracelets',zh:'手鏈',descriptionEn:'Tennis and link designs with calculator-verified minimum metal tiers.',descriptionZh:'網球及鏈節設計，金屬規格設有計算器確認的最低級別。'},
  {name:'Pendant',id:'mens-pendants',en:'Pendants',zh:'吊墜',descriptionEn:'Considered gold and diamond forms. Pendants are sold without a chain.',descriptionZh:'精緻黃金與鑽石設計。吊墜不包括項鏈。'}
 ];
 const groupItems=(window.VDCatalogueGroups||[]).filter(group=>group.collection==='mensCollection').flatMap(group=>group.items.map(item=>({...item,category:group.category})));
 const products=groupItems.map(item=>({...item,product:window.VDProducts.find('mensCollection',item.name)})).filter(item=>item.product);
 const container=document.getElementById('mensProducts');
 const count=document.getElementById('mensCount');
 const select=document.getElementById('mensLanguage');
 select.value=zh?'zh-HK':'en';
 select.addEventListener('change',()=>{const url=new URL(location.href);url.searchParams.set('lang',select.value);try{localStorage.setItem('victoriaLanguage',select.value);localStorage.setItem('vd-lang',select.value);}catch{}location.replace(url.href);});
 document.title=t('Men’s Collection — Victoria Diamonds','男士系列 — Victoria Diamonds');
 document.getElementById('mensTitle').textContent=tr('collection-mens',t('Men’s Collection','男士系列'));
 document.querySelector('.eyebrow').textContent=t('Victoria Diamonds · London Atelier','Victoria Diamonds · 倫敦工作室');
 document.querySelector('.intro').textContent=t('Distinctive diamond jewellery, made personal. Choose your piece, adjust its metal and stones, and see the confirmed price before you order.','別具特色的鑽石珠寶，為您而設。挑選作品、調整金屬與鑽石規格，並在下單前查看確認價格。');
 document.querySelector('.mens-toolbar label[for="mensSearch"]').textContent=t('Find a piece','尋找作品');
 document.getElementById('mensSearch').placeholder=t('Search rings, bracelets or pendants','搜尋戒指、手鏈或吊墜');
 document.querySelector('.mens-toolbar label[for="mensType"]').textContent=t('Category','類別');
 document.querySelectorAll('.category-nav a').forEach((link,index)=>{link.firstChild.textContent=[t('Rings ','戒指 '),t('Bracelets ','手鏈 '),t('Pendants ','吊墜 ')][index];});
 const headerLinks=document.querySelectorAll('.mens-header nav a');
 headerLinks[0].textContent=t('Collections','系列');headerLinks[1].textContent=t('All pieces','所有作品');headerLinks[2].textContent=t('Book appointment ↗','預約鑑賞 ↗');
 document.querySelector('#mensType option[value=""]').textContent=t('All pieces','所有作品');
 document.querySelector('#mensType option[value="Ring"]').textContent=t('Rings','戒指');
 document.querySelector('#mensType option[value="Bracelet"]').textContent=t('Bracelets','手鏈');
 document.querySelector('#mensType option[value="Pendant"]').textContent=t('Pendants','吊墜');
 document.querySelector('.mens-note strong').textContent=t('About the displayed prices','價格說明');
 document.querySelector('.mens-note p').textContent=t('Prices show the calculator’s starting configuration. Your chosen metal and diamonds determine the final quote. Some pictured stone counts and production weights remain provisional and are identified in the piece details.','所示價格為計算器的起始規格。最終報價按所選金屬及鑽石而定。部分圖片的鑽石數量及生產重量仍屬暫定，並於作品詳情中標示。');
 document.querySelector('footer span').textContent=t('London Atelier','倫敦工作室');document.querySelector('footer a:last-child').textContent=t('Explore all collections →','探索所有系列 →');
 const categoryName=category=>categories.find(item=>item.name===category);
 categories.forEach(category=>{
  const section=document.createElement('section');section.className='mens-category';section.id=category.id;section.dataset.category=category.name;
  const heading=document.createElement('h2');heading.textContent=zh?category.zh:category.en;
  const description=document.createElement('p');description.className='mens-category-copy';description.textContent=zh?category.descriptionZh:category.descriptionEn;
  const grid=document.createElement('div');grid.className='mens-grid';
  products.filter(item=>item.category===category.name).forEach(item=>{
   const product=item.product,preset=product.preset;
   const link=document.createElement('a');link.className='mens-card';link.href=window.VDProducts.url(product);link.target='_blank';link.rel='noopener';
   link.dataset.category=category.name;link.dataset.search=`${product.name} ${category.name}`.toLowerCase();
   const image=document.createElement('div');image.className='mens-card-image';
   const img=document.createElement('img');img.src='images/'+item.image;img.alt=product.name;img.loading='lazy';image.append(img);
   const copy=document.createElement('div');copy.className='mens-card-copy';
   const kicker=document.createElement('p');kicker.className='mens-card-kicker';kicker.textContent=zh?category.zh:category.en;
   const title=document.createElement('h3');title.textContent=tr('product-'+product.name,product.name);
   const metal=document.createElement('p');metal.className='mens-metal';metal.textContent=item.metal;
   const stone=document.createElement('p');stone.className='mens-stone';stone.textContent=preset.diamonds.map(d=>`${d.carat} ct × ${d.qty}`).join('  ·  ');
   const bottom=document.createElement('div');bottom.className='mens-card-bottom';
   const price=document.createElement('span');price.innerHTML=`<span class="mens-price-label">${escape(t('Starting configuration','起始規格'))}</span><span class="mens-price">${escape(money(preset.price))}</span>`;
   const cta=document.createElement('span');cta.className='mens-cta';cta.textContent=t('View & customise ↗','查看及訂製 ↗');
   bottom.append(price,cta);copy.append(kicker,title,metal,stone,bottom);link.append(image,copy);grid.append(link);
  });
  section.append(heading,description,grid);container.append(section);
 });
 const update=()=>{
  const query=document.getElementById('mensSearch').value.trim().toLowerCase(),category=document.getElementById('mensType').value;
  let visible=0;
  document.querySelectorAll('.mens-card').forEach(card=>{const show=(!category||card.dataset.category===category)&&card.dataset.search.includes(query);card.hidden=!show;if(show)visible++;});
  document.querySelectorAll('.mens-category').forEach(section=>{section.hidden=!section.querySelector('.mens-card:not([hidden])');});
  count.textContent=t(`${visible} pieces · Select a piece to customise in a new tab.`,`${visible} 件作品 · 選擇作品即可在新分頁訂製。`);
 };
 document.getElementById('mensSearch').addEventListener('input',update);document.getElementById('mensType').addEventListener('change',update);update();
})();
