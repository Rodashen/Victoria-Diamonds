/* Stable product identity shared by browsing and ordering. Payment prices remain server-owned. */
(() => {
 'use strict';
 const collections={dailySparkle:['Daily Sparkle','daily-sparkle.html','日常閃耀'],occasionalWear:['High Note','high-note-collection.html','華麗樂章'],foreverBond:['Forever Bond','forever-bond.html','永恆之約'],silverCollection:['Silver Collection','silver-collection.html','純銀系列'],singleLady:['Aura','aura-collection.html','Aura 系列'],mensCollection:["Men’s Collection",'mens-collection.html','男士系列']};
 const silverIds={'Everyday Silver Ring':'silver_everyday_ring','Twisted Silver Band':'silver_twisted_band','Round Silver Ring':'silver_round_ring','Classic Silver Ring':'silver_classic_ring','Curved Silver Band':'silver_curved_band','Dainty Silver Ring':'silver_dainty_ring','Crescent Silver Ring':'silver_crescent_ring','Loop Silver Ring':'silver_loop_ring','Simple Chain Necklace':'silver_simple_chain','Little Drop Necklace':'silver_little_drop','Everyday Pendant Necklace':'silver_everyday_pendant','Open Cuff Bracelet':'silver_open_cuff','Link Charm Bracelet':'silver_link_charm','Link Charm Bracelet II':'silver_link_charm_ii','Round Stud Earrings':'silver_round_studs','Flower Drop Earrings':'silver_flower_drop','Everyday Silver Anklet':'silver_anklet'};
 const slug=name=>name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const products=(window.VDCatalogueGroups||[]).flatMap(group=>group.items.map(item=>{
  const source=group.collection==='dailySparkle'?window.DailyProducts:group.collection==='occasionalWear'?window.HighNoteProducts:group.collection==='mensCollection'?window.MensProducts:null;
  const preset=source?.products.find(p=>p.name===item.name)||window.RemainingProducts?.products.find(p=>p.name===item.name&&p.collection===(group.collection==='occasionalWear'?'occasionWear':group.collection));
  const silver=group.collection==='silverCollection';
  return {...item,collection:group.collection,category:group.category,id:preset?.id||(silver?silverIds[item.name]:group.collection+'-'+slug(item.name)),mode:preset?'custom':silver?'silver':'enquiry',preset:preset?{...preset,collection:preset.collection||(group.collection==='dailySparkle'?'dailySparkle':group.collection==='mensCollection'?'mens':'occasionWear'),route:preset.route||(group.collection==='dailySparkle'?'daily-sparkle':group.collection==='mensCollection'?'mens':'high-note')}:null};
 }));
 const find=(collection,name)=>products.find(p=>p.collection===collection&&p.name===name);
 const url=p=>'product.html?item='+encodeURIComponent(p.id)+'&lang='+(document.documentElement.lang.startsWith('zh')?'zh-HK':'en');
 window.VDProducts={products,collections,find,url,slug};
})();
