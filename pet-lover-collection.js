document.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('mensLanguage');
 let language=new URLSearchParams(location.search).get('lang');if(!language)try{language=localStorage.getItem('victoriaLanguage');}catch{}
 if(language)document.documentElement.lang=language.startsWith('zh')?'zh-HK':'en';
 const refresh=()=>{const zh=document.documentElement.lang.startsWith('zh');select.value=zh?'zh-HK':'en';document.getElementById('mensTitle').textContent=zh?'寵物之愛系列':'Pet Lover Collection';};
 select.addEventListener('change',()=>{document.documentElement.lang=select.value;try{localStorage.setItem('victoriaLanguage',select.value);}catch{}});
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});refresh();
 document.querySelectorAll('.pet-audience-links a').forEach(link=>link.addEventListener('click',event=>{const jump=[...document.querySelectorAll('.showcase-jumps a')].find(a=>a.hash===link.hash);if(jump){event.preventDefault();jump.click();}}));
});
