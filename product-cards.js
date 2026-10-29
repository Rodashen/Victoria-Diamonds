/* Shared product presentation for collection pages and landing-page filtered results. */
(() => {
 'use strict';
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?zh:en;
 const categories={'For Furmom':['For Furmom','給寵物媽媽'],'For Furbaby':['For Furbaby','給毛孩'],'Collar Charm':['Collar charms','寵物項圈吊飾'],'Bracelet Charm':['Bracelet charms','手鏈吊飾'],'Key Ring':['Key rings','鑰匙圈'],'Key Charm':['Initial key charms','字母鑰匙吊飾'],Ring:['Rings','戒指'],Earring:['Earrings','耳環'],'Earring Stud':['Stud earrings','耳釘'],Necklace:['Necklaces','項鏈'],Bracelet:['Bracelets','手鏈'],Pendant:['Pendants','吊墜'],Anklet:['Anklets','腳鏈'],Brooch:['Brooches','胸針'],Tiara:['Tiaras','冠冕']};
 const categoryName=category=>t(...(categories[category]||[category,category]));
 const name=product=>document.documentElement.lang.startsWith('zh')&&typeof translations!=='undefined'?(translations['zh-HK']?.['product-'+product.name]||product.name):product.name;
 const price=product=>{const start=window.VDDiamondCatalogue?.products[product.id];return product.mode==='enquiry'?null:start?Math.min(start.lab,start.natural??Infinity):Number(product.preset?.price??product.price);};
 const money=amount=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:Number.isInteger(amount)?0:2,maximumFractionDigits:2}).format(amount);
 const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;};
 function create(product){
  const link=element('a','showcase-card');link.href=window.VDProducts.url(product);link.target='_blank';link.rel='noopener';link.dataset.productId=product.id;
  const frame=element('div','showcase-image'),img=element('img');img.src='images/'+(product.thumbnail||product.image);img.alt=window.VDProducts.imageAlt(product);img.loading='lazy';img.decoding='async';img.width=960;img.height=960;frame.append(img);
  const copy=element('div','showcase-copy');copy.append(element('p','showcase-kicker',categoryName(product.category)),element('h3','',name(product)));
  copy.prepend(element('span','ux-order-badge',product.mode==='enquiry'?t('By appointment','僅限預約'):product.mode==='silver'?t('Fixed design · Full payment','固定設計 · 全額付款'):t('Customise online','網上訂製')));
  const metal=product.metal||{gold:'18K Gold',platinum:'Platinum',silver:'Silver'}[product.preset?.metal];if(metal)copy.append(element('p','showcase-metal',metal));
  const centreRing=product.mode==='custom'&&product.category==='Ring'&&product.preset.diamonds.length&&!window.VDDesignRules?.isPerStone(product)&&!/band|eternity|alternating/i.test(product.name);
  const stones=product.haloDesign?t('Centre stone · ','主石 · ')+product.preset.diamonds[0].carat+' ct · '+product.preset.diamonds[1].qty+t(' round accents',' 顆圓形配石'):product.preset?.diamondPriceOptions?t('Diamond size option · ','鑽石大小選項 · ')+product.preset.diamonds[0].carat+' ct':centreRing?t('Centre stone · 1.00 ct','主石 · 1.00 ct'):(window.VDDiamondCatalogue?.products[product.id]?.diamonds||product.preset?.diamonds)?.map(d=>`${d.carat} ct × ${d.qty}`).join(' · ')||product.details?.filter(d=>['centreStone','totalKarat'].includes(d.key)).map(d=>d.value).join(' · ');
  if(stones)copy.append(element('p','showcase-stones',stones+(product.category.startsWith('Earring')?t(' · per pair',' · 每對'):'')));
  if(product.category==='Bracelet'&&product.preset?.braceletMetalTier){const tier=product.preset.braceletMetalTier;copy.append(element('p','showcase-specification',t('Bracelet specification: ','手鏈規格：')+tier[0].toUpperCase()+tier.slice(1)+(product.preset.lockBraceletTier?t(' · Fixed design',' · 固定設計'):'')));}
  const bottom=element('div','showcase-bottom'),amount=element('span','showcase-price'),value=price(product);
  const starting=window.VDDiamondCatalogue?.products[product.id],origin=starting?.natural!=null&&starting.natural<starting.lab?t('From · Natural diamonds','起價 · 天然鑽石'):t('From · Lab-grown diamonds','起價 · 培育鑽石');
  amount.append(element('small','',product.mode==='enquiry'?t('Private consultation','私人諮詢'):product.mode==='silver'?t('Full price','全額價格'):product.preset?.stackingSetMultiplier===3?t('Three-piece set · starting price','三件套裝 · 起價'):starting?origin:t('Starting configuration','起始規格')),element('strong','',value===null?t('By appointment','只限預約'):money(value)));
  const action=product.mode==='enquiry'?t('Book appointment ↗','預約諮詢 ↗'):product.mode==='silver'?t('View & buy ↗','查看及購買 ↗'):t('View & customise ↗','查看及訂製 ↗');
  bottom.append(amount,element('span','showcase-cta',action));copy.append(bottom);link.append(frame,copy);return link;
 }
 window.VDProductCards={create,name,price,categoryName};
})();
