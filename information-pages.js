document.addEventListener('DOMContentLoaded',()=>{
 const elements=[...document.querySelectorAll('[data-zh]')].map(node=>({node,en:node.textContent,zh:node.dataset.zh}));
 const translate=()=>{const zh=document.documentElement.lang.startsWith('zh');elements.forEach(({node,en,zh:chinese})=>node.textContent=zh?chinese:en);};
 translate();new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
});
