document.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('mensLanguage');
 let language=new URLSearchParams(location.search).get('lang');
 if(!language){try{language=localStorage.getItem('victoriaLanguage');}catch{}}
 const update=()=>{const zh=select.value==='zh-HK';document.documentElement.lang=zh?'zh-HK':'en';document.getElementById('mensTitle').textContent=zh?'珍藏系列':'Keepsake Collection';document.title=(zh?'珍藏系列':'Keepsake Collection')+' | Victoria Diamonds';};
 select.value=language?.startsWith('zh')?'zh-HK':'en';update();select.addEventListener('change',()=>{try{localStorage.setItem('victoriaLanguage',select.value);}catch{}update();});
});
