/* Public sale information only; quote and payment prices remain server-owned. */
(()=>{
 'use strict';
 function create(product,starting){
  const url='https://victoria-diamonds.com/product.html?item='+encodeURIComponent(product.id);
  const schema={'@context':'https://schema.org','@type':product.mode==='enquiry'?'CreativeWork':'Product',name:product.name,image:'https://victoria-diamonds.com/images/'+product.image.split('/').map(encodeURIComponent).join('/'),url};
  if(product.mode==='enquiry')return schema;
  Object.assign(schema,{sku:product.id,category:product.category,brand:{'@type':'Brand',name:'Victoria Diamonds'}});
  if(product.mode==='silver'&&Number.isFinite(product.price)&&product.price>0)schema.offers={'@type':'Offer',priceCurrency:'GBP',price:product.price,url,seller:{'@type':'Organization',name:'Victoria Diamonds'}};
  else if(starting&&Number.isFinite(starting.lab)&&starting.lab>0)schema.offers={'@type':'AggregateOffer',priceCurrency:'GBP',lowPrice:Math.min(starting.lab,Number.isFinite(starting.natural)&&starting.natural>0?starting.natural:Infinity),url};
  return schema;
 }
 window.VDProductSchema={create};
})();
