/* Collection copy follows the shared site language without changing product identity. */
document.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('mensLanguage');
 const refresh=()=>{const zh=document.documentElement.lang.startsWith('zh');select.value=zh?'zh-HK':'en';document.getElementById('mensTitle').textContent=zh?'網球手鏈系列':'Tennis Collection';document.querySelector('.tennis-hero .intro').textContent=zh?'連綿閃耀的鑽石。探索圓形及花式切割網球手鏈，配備各款設計的固定手鏈規格，並可選擇金屬及每顆鑽石克拉重量。':'An unbroken line of brilliance. Explore round and fancy-cut diamond tennis bracelets, with design-specific bracelet specifications and your choice of metal and carat per stone.';};
 select.addEventListener('change',()=>{document.documentElement.lang=select.value;try{localStorage.setItem('victoriaLanguage',select.value);}catch{}});
 let language=new URLSearchParams(location.search).get('lang');if(!language)try{language=localStorage.getItem('victoriaLanguage');}catch{}
 if(language)document.documentElement.lang=language.startsWith('zh')?'zh-HK':'en';
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});refresh();
});
