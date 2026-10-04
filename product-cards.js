/* Shared product presentation for collection pages and landing-page filtered results. */
(() => {
 'use strict';
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const categories={Ring:['Rings','戒指'],Earring:['Earrings','耳環'],'Earring Stud':['Stud earrings','耳釘'],Necklace:['Necklaces','項鏈'],Bracelet:['Bracelets','手鏈'],Pendant:['Pendants','吊墜'],Anklet:['Anklets','腳鏈'],Brooch:['Brooches','胸針'],Tiara:['Tiaras','冠冕']};
 const categoryName=category=>t(...(categories[category]||[category,category]));
 const name=product=>document.documentElement.lang.startsWith('zh')&&typeof translations!=='undefined'?(translations['zh-HK']?.['product-'+product.name]||product.name):product.name;
 const price=product=>product.mode==='enquiry'?null:Number(product.preset?.price??product.price);
 const money=amount=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(amount);
 const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 function create(product){
  const link=element('a','showcase-card');link.href=window.VDProducts.url(product);link.target='_blank';link.rel='noopener';link.dataset.productId=product.id;
  const frame=element('div','showcase-image'),img=element('img');img.src='images/'+product.image;img.alt=name(product);img.loading='lazy';img.decoding='async';frame.append(img);
  const copy=element('div','showcase-copy');copy.append(element('p','showcase-kicker',categoryName(product.category)),element('h3','',name(product)));
  const metal=product.metal||{gold:'18K Gold',platinum:'Platinum',silver:'Silver'}[product.preset?.metal];if(metal)copy.append(element('p','showcase-metal',metal));
  const stones=product.preset?.diamonds?.map(d=>`${d.carat} ct × ${d.qty}`).join(' · ')||product.details?.filter(d=>['centreStone','totalKarat'].includes(d.key)).map(d=>d.value).join(' · ');
  if(stones)copy.append(element('p','showcase-stones',stones+(product.category.startsWith('Earring')?t(' · per pair',' · 每對'):'')));
  const bottom=element('div','showcase-bottom'),amount=element('span','showcase-price'),value=price(product);
  amount.append(element('small','',product.mode==='enquiry'?t('Private consultation','私人諮詢'):product.mode==='silver'?t('Full price','全額價格'):t('Starting configuration','起始規格')),element('strong','',value===null?t('By appointment','只限預約'):money(value)));
  const action=product.mode==='enquiry'?t('Book appointment ↗','預約諮詢 ↗'):product.mode==='silver'?t('View & buy ↗','查看及購買 ↗'):t('View & customise ↗','查看及訂製 ↗');
  bottom.append(amount,element('span','showcase-cta',action));copy.append(bottom);link.append(frame,copy);return link;
 }
 window.VDProductCards={create,name,price,categoryName};
})();
