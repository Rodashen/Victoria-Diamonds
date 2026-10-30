/* Customer customization; the payment server confirms all prices. */
(() => {
 'use strict';
 const API=document.querySelector('meta[name=checkout-api]')?.content || 'https://calculator-oofl.onrender.com';
 const sources=[['dailySparkle','daily-sparkle',window.DailyProducts],['occasionWear','high-note',window.HighNoteProducts],['mens','mens',window.MensProducts]];
 const catalogue={carats:(window.MensProducts||window.DailyProducts||window.HighNoteProducts)?.carats,products:sources.flatMap(([collection,route,data])=>(data?.products||[]).map(p=>({...p,collection,route})))};
 catalogue.products.push(...(window.RemainingProducts?.products||[]));
 if(!catalogue.products.length)return;
 const t=(en,cn)=>document.documentElement.lang.startsWith('zh')?cn:en;
 const money=n=>'£'+Number(n).toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const find=card=>catalogue.products.find(p=>p.collection===(card.closest('#occasionalWear')?'occasionWear':'dailySparkle')&&p.name===card.querySelector('[data-product-name]')?.dataset.productName);
 const name=p=>typeof getProductName==='function'?getProductName(p.name):p.name;
 let selected=null,lastFocus=null,quote=null,controller=null,timer=null,version=0,busy=false;
 let diamondOrigin='lab',naturalGroups=[];
 const inline=['product','product.html'].includes(location.pathname.split('/').filter(Boolean).pop());
 const dialog=document.createElement(inline?'div':'dialog');
 dialog.id='dailyCheckout';dialog.className='daily-checkout';dialog.setAttribute('aria-labelledby','dailyCheckoutTitle');if(!inline)document.body.append(dialog);
 const close=()=>{if(busy)return;window.VDLoading?.set('checkout',false);controller?.abort();clearTimeout(timer);version++;dialog.close();lastFocus?.focus();};
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close();});
 const field=id=>dialog.querySelector('#'+id);
 const read=()=>({productId:selected.id,collection:selected.collection,...(selected.initialRequired?{initial:field('dailyInitial').value}:{}),metal:field('dailyMetal').value,karat:Number(field('dailyKarat').value),purity:Number(field('dailyPurity').value),braceletMetalTier:field('dailyTier').value,quantity:Number(field('dailyQuantity').value),paymentPercentage:Number(field('dailyPayment').value),diamondOrigin:diamondOrigin||'lab',diamonds:diamondOrigin==='natural'?naturalGroups.map(({naturalId,qty})=>({naturalId,qty})):[0,1,2,3].map(i=>({quality:field('dailyQuality'+i).value,carat:field('dailyCarat'+i).value,qty:Number(field('dailyQty'+i).value)})).filter(d=>d.carat!=='0')});
 const valid=b=>(!selected.initialRequired||/^[A-Z]$/.test(b.initial||''))&&Number.isInteger(b.quantity)&&b.quantity>=1&&b.quantity<=10&&b.diamonds.every(d=>Number.isInteger(d.qty)&&d.qty>=1&&d.qty<=100);
 function status(message,error=false,loading=false){window.VDLoading?.set('checkout',loading,message);field('dailyStatus').textContent=message;field('dailyStatus').classList.toggle('error',error);if(error){const price=document.getElementById('productQuote');if(price)price.textContent=t('Complete your selections for a price','完成選擇以查看價格');}}
 function totals(q){field('dailyTotal').textContent=q?money(q.total):'—';field('dailyDue').textContent=q?money(q.due):'—';field('dailyBalance').textContent=q?money(q.balance):'—';const price=document.getElementById('productQuote');if(price)price.textContent=q?money(q.total)+' GBP':diamondOrigin===null?t('Choose your diamond type','選擇您的鑽石種類'):diamondOrigin==='natural'&&!naturalGroups.length?t('Natural diamonds by appointment','天然鑽石版本請預約諮詢'):t('Confirming price…','正在確認價格…');}
 async function refreshQuote(){
  const current=++version;controller?.abort();const request=new AbortController();controller=request;quote=null;field('dailySubmit').disabled=true;totals(null);
  if(diamondOrigin===null){status(t('Choose lab-grown or natural diamonds to begin.','請先選擇培育或天然鑽石。'));return;}
  if(diamondOrigin==='natural'&&!naturalGroups.length){status(t('Choose a priced natural diamond for every stone group, or book an appointment.','請為每組鑽石選擇已定價的天然鑽石，或預約諮詢。'));return;}
  const body=read();if(selected.initialRequired&&!/^[A-Z]$/.test(body.initial||'')){status(t('Choose your initial from A to Z to confirm the price.','請選擇 A 至 Z 字母以確認價格。'));return;}if(diamondOrigin!=='natural'&&field('dailyCarat0').value===''){status(t('Choose the main stone size, or choose no diamonds for a plain design.','請選擇主石大小，或為素面設計選擇無鑽石。'),true);return;}if(!valid(body)){status(t('Please enter whole-number quantities within the stated limits.','請輸入有效範圍內的整數數量。'),true);return;}
  status(t('Checking your price…','正在核對價格…'),false,true);const timeout=setTimeout(()=>request.abort(),20000);
  try{
   const res=await fetch(API+'/'+selected.route+'/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:request.signal});
   const data=await res.json();if(current!==version)return;
   if(!res.ok)throw Error(data.error||'Quote unavailable');
   if(![data.total,data.due,data.balance].every(Number.isFinite)||data.currency!=='GBP'||data.total<=0||data.due<=0||data.due>data.total)throw Error('Invalid quote');
   quote={...data,selection:JSON.stringify(body)};totals(data);status(t('Price confirmed in GBP. Your payment link will be sent by email.','已確認英鎊價格。付款連結將發送至您的電郵。'));field('dailySubmit').disabled=false;
  }catch(error){if(current!==version)return;status(t('We could not confirm the price. Please retry or book an appointment.','暫時無法確認價格。請重試或預約諮詢。'),true);field('dailyRetry').hidden=false;}
  finally{clearTimeout(timeout);}
 }
 function changed(){
  const confirmation=field('configurationConfirm');if(confirmation)confirmation.checked=false;
  quote=null;version++;controller?.abort();field('dailySubmit').disabled=true;totals(null);field('dailyRetry').hidden=true;
  status(t('Checking your price…','正在核對價格…'),false,diamondOrigin!==null&&(diamondOrigin!=='natural'||naturalGroups.length>0));
  field('dailyCaratTotal').textContent=(read().diamonds.reduce((sum,d)=>sum+Number(d.carat??window.VDDiamondCatalogue?.items?.find(stone=>stone.id===d.naturalId)?.carat??0)*d.qty,0)*(selected.stackingSetMultiplier||1)).toFixed(2)+' ct';
  const count=field('dailyBraceletStoneCount');if(count){const carat=Number(field('dailyCarat0').value),qty=selected.stoneCount,total=qty*carat;count.hidden=diamondOrigin==='natural';count.textContent=Number.isInteger(qty)?t('Configured diamonds per bracelet: ','每條手鏈設定鑽石數量：')+qty+' × '+carat.toFixed(2)+' ct · '+total.toFixed(2)+' ct '+t('total. Final fit and construction require atelier confirmation.','總重。最終尺寸及結構須由工作室確認。'):t('Stone count requires atelier confirmation.','鑽石數量須由工作室確認。');const legend=field('dailyCarat0').closest('.configuration-options')?.querySelector('legend');if(legend)legend.textContent=t('Carat per stone · Total: ','每顆克拉 · 總重：')+total.toFixed(2)+' ct';}
  field('dailyKaratWrap').hidden=field('dailyMetal').value!=='gold';field('dailyPurityWrap').hidden=field('dailyMetal').value!=='silver';
  syncChoices();
  clearTimeout(timer);timer=setTimeout(refreshQuote,250);
 }
 function syncChoices(){
  dialog.querySelectorAll('.configuration-choice input').forEach(input=>{input.checked=field(input.dataset.select).value===input.value;});
  const gold=dialog.querySelector('[data-metal-badge="gold"]'),silver=dialog.querySelector('[data-metal-badge="silver"]');
  if(gold)gold.textContent=field('dailyKarat').value+'K';
  if(silver)silver.textContent=field('dailyPurity').value;
 }
 function visualChoices(){
  dialog.querySelectorAll('#dailyControls select').forEach(select=>{
   if(select.disabled)return;
   const original=select.parentElement,group=document.createElement('fieldset'),legend=document.createElement('legend');
   group.className='configuration-options';if(original.id)group.id=original.id;group.hidden=original.hidden;
   legend.textContent=original.firstChild.textContent.trim();group.append(legend);
   const choices=document.createElement('div');choices.className='configuration-choices';
   const metal=select.id==='dailyMetal',diamond=select.id.startsWith('dailyCarat');
   if(select.id==='dailyInitial')group.classList.add('initial-options');
   if(metal)group.classList.add('metal-options');if(diamond)group.classList.add('diamond-options');
   [...select.options].filter(option=>option.value!=='').forEach(option=>{
    const label=document.createElement('label');label.className='configuration-choice';
    const input=document.createElement('input');input.type='radio';input.name=select.id+'Choice';input.value=option.value;input.dataset.select=select.id;input.checked=option.selected;input.disabled=option.disabled;
    const face=document.createElement('span');face.className='choice-face';
    if(metal){const swatch=document.createElement('span');swatch.className='metal-swatch metal-'+option.value;swatch.setAttribute('aria-hidden','true');const badge=document.createElement('span');badge.dataset.metalBadge=option.value;badge.textContent=option.value==='platinum'?'Pt':option.value==='gold'?field('dailyKarat').value+'K':field('dailyPurity').value;swatch.append(badge);face.append(swatch);}
    if(diamond&&Number(option.value)>0){const illustration=document.createElement('span');illustration.className='diamond-size';illustration.setAttribute('aria-hidden','true');const size=43*Math.cbrt(Number(option.value));illustration.style.setProperty('--stone-size',size+'px');illustration.innerHTML=window.VDDiamondVisuals.icon(selected.haloDesign&&select.id==='dailyCarat0'?'Oval':'Round');face.append(illustration);}
    const text=document.createElement('span');text.textContent=metal?{gold:t('Yellow gold','黃金'),silver:t('Silver','白銀'),platinum:t('Platinum','鉑金')}[option.value]:option.textContent;
    face.append(text);
    if(diamond&&Number(option.value)>0&&['bracelet','necklace'].includes(selected.type)){const width=document.createElement('small');width.className='stone-width-guide';width.textContent=t('Stone guide ≈ ','鑽石參考直徑約 ')+(6.5*Math.cbrt(Number(option.value))).toFixed(1)+t(' mm (round equivalent)',' 毫米（等效圓形）');face.append(width);}

    if(selected.diamondPriceOptions&&select.id==='dailyCarat0'){const price=document.createElement('small');price.textContent=money(selected.diamondPriceOptions[option.value]);face.append(price);}
    if(select.id==='dailyKarat'){const purity=document.createElement('small');purity.textContent=({9:'375',14:'585',18:'750',22:'916'})[option.value]+' '+t('purity','純度');face.append(purity);}
    label.append(input,face);choices.append(label);
    input.addEventListener('change',()=>{if(input.checked){select.value=input.value;select.dispatchEvent(new Event('input',{bubbles:true}));}});
   });
   select.hidden=true;group.append(select,choices);original.replaceWith(group);
   if(diamond){const note=document.createElement('p');note.className='choice-note';note.textContent=t('Approximate stone diameters are round-equivalent guides, not finished jewellery widths. Shape, cut and setting affect the finished width; confirm with the atelier. Carat is the weight of each stone.','相對大小僅供參考，並非實際尺寸。克拉為每顆鑽石的重量；此設計的切工固定。');group.append(note);}
  });
 }
 function open(p){
  selected=p;lastFocus=document.activeElement;quote=null;busy=false;
  diamondOrigin=inline&&window.VDDiamondCatalogue?null:'lab';naturalGroups=[];
  const options=(p.diamondPriceOptions?Object.keys(p.diamondPriceOptions):catalogue.carats).map(c=>`<option value="${c}">${c} ct</option>`).join('');
  const tierNames=['essential','signature','atelier','premium','supreme'],minimumTier=tierNames.indexOf(p.minBraceletTier||'essential');
  const tierOptions=tierNames.map((tier,index)=>`<option value="${tier}" ${index<minimumTier?'disabled':''}>${tier[0].toUpperCase()+tier.slice(1)}</option>`).join('');
  const diamond=i=>`<fieldset class="daily-diamond"><legend>${i===0?t('Main diamonds','主鑽'):t('Diamond specification ','鑽石規格 ')+(i+1)}</legend><div class="daily-fields"><label>${t('Quality','級別')}<select id="dailyQuality${i}"><option value="select">Select</option><option value="luxe">Luxe</option></select></label><label>${t('Carat per stone','每顆克拉')}<select id="dailyCarat${i}">${i||['foreverBond','singleLady'].includes(p.collection)?`<option value="0">${t('None','無')}</option>`:''}${options}</select></label><label>${t('Number of stones','鑽石數量')}<input id="dailyQty${i}" type="number" min="1" max="100" step="1" value="1" required></label></div></fieldset>`;
  dialog.innerHTML=`<button type="button" class="daily-close" aria-label="${t('Close customization','關閉訂製')}" id="dailyClose">×</button>
   <div class="daily-heading"><img src="images/${esc(p.thumbnail||p.image)}" alt="${esc(name(p)+' — original jewellery design by Victoria Diamonds')}"><div><p class="daily-eyebrow">${selected.collection==='occasionWear'?t('HIGH NOTE · CUSTOMISE & BUY','華麗樂章 · 訂製及購買'):selected.collection==='mens'?t('MEN’S COLLECTION · CUSTOMISE & BUY','男士系列 · 訂製及購買'):t('DAILY SPARKLE · CUSTOMISE & BUY','日常閃耀 · 訂製及購買')}</p><h2 id="dailyCheckoutTitle">${esc(name(p))}</h2><p>${t('Choose your materials and diamonds. The photograph shows the original design; your selections define your order.','選擇材質及鑽石。照片展示原始設計，訂單以您所選的規格為準。')}</p></div></div>
   <form id="dailyForm"><fieldset id="dailyControls"><legend class="daily-sr">${t('Your configuration','您的訂製規格')}</legend>
   <h3>${t('Precious metal','貴金屬')}</h3><div class="daily-fields"><label>${t('Metal','材質')}<select id="dailyMetal"><option value="gold">${t('Gold','黃金')}</option><option value="silver">${t('Silver','白銀')}</option><option value="platinum">${t('Platinum','鉑金')}</option></select></label><label id="dailyKaratWrap">${t('Gold karat','黃金純度')}<select id="dailyKarat"><option value="9">9K</option><option value="14">14K</option><option value="18" selected>18K</option><option value="22">22K</option></select></label><label id="dailyPurityWrap" hidden>${t('Silver purity','白銀純度')}<select id="dailyPurity"><option value="925">Sterling 925</option></select></label><label ${p.type!=='bracelet'?'hidden':''}>${t('Bracelet specification','手鏈規格')}<select id="dailyTier">${tierOptions}</select></label></div>
   <h3>${t('Diamonds','鑽石')}</h3>${diamond(0)}<details id="dailyAdditional"><summary>${t('Additional diamond specifications','其他鑽石規格')}</summary>${diamond(1)+diamond(2)+diamond(3)}</details>
   <div class="daily-fields daily-order"><label>${p.soldAsPair?t('Order quantity · complete pairs (1–10)','訂購數量 · 完整對數（1–10）'):p.soldAsSet?t('Order quantity · complete sets (1–10)','訂購數量 · 完整套數（1–10）'):t('Order quantity · complete pieces (1–10)','訂購數量 · 完整件數（1–10）')}<input id="dailyQuantity" type="number" min="1" max="10" step="1" value="1" required></label><label>${t('Payment option','付款方式')}<select id="dailyPayment"><option value="30">${t('30% down payment','30% 訂金')}</option><option value="50" selected>${t('50% down payment','50% 訂金')}</option><option value="100">${t('Pay in full','全額付款')}</option></select></label></div>
   <div class="daily-summary" aria-live="polite"><div><span>${t('Order total','訂單總額')}</span><strong id="dailyTotal">—</strong></div><div><span>${t('Due now','現在支付')}</span><strong id="dailyDue">—</strong></div><div><span>${t('Remaining balance','剩餘款項')}</span><strong id="dailyBalance">—</strong></div></div><p class="daily-note">${t('All payments are in GBP. For a deposit, the remaining balance is due before dispatch or collection.','所有付款均以英鎊結算。如支付訂金，餘款須於發貨或取貨前付清。')}</p>
   <p class="daily-note">${t('Order quantity counts complete jewellery pieces, pairs or sets, not individual diamonds.','訂購數量是完整珠寶、對或套的數量，並非鑽石顆數。')}</p><h3>${t('Your details','聯絡資料')}</h3><div class="daily-fields"><label>${t('Full name','姓名')}<input id="dailyCustomer" name="name" autocomplete="name" maxlength="120" required></label><label>${t('Email','電郵')}<input id="dailyEmail" name="email" autocomplete="email" type="email" maxlength="254" required></label></div>
   <p id="dailyStatus" role="status"></p><button type="button" id="dailyRetry" hidden>${t('Retry price check','重新核對價格')}</button><button type="submit" id="dailySubmit" class="daily-primary" disabled>${t('Email my secure payment link','發送安全付款連結至電郵')}</button><p class="daily-note">${t('Continue to payment using the link in your email. Submitting this form does not charge your card.','使用電郵中的連結完成付款。提交此表格不會扣款。')}</p></fieldset></form><div id="dailySuccess" hidden role="status"></div>`;
  if(p.initialRequired){
   const wrap=document.createElement('div');wrap.className='daily-fields';wrap.innerHTML='<label>'+t('Choose your initial','選擇字母')+'<select id="dailyInitial" required><option value="">'+t('Choose A–Z','選擇 A–Z')+'</option>'+Array.from({length:26},(_,i)=>'<option>'+String.fromCharCode(65+i)+'</option>').join('')+'</select></label>';
   field('dailyControls').querySelector('h3').before(wrap);
   const note=document.createElement('p');note.className='daily-note';note.textContent=t('A and B photographs are examples. Your chosen A–Z initial will be engraved and included in your order details.','A 及 B 圖片僅為示例，所選 A–Z 字母將刻於吊飾並記錄於訂單。');wrap.after(note);
  }
  if(p.collection!=='dailySparkle'){const note=document.createElement('p');note.className='daily-note';note.textContent=p.stackingSetMultiplier===3?t('Three-piece stacking set: the complete configured ring price is multiplied by 3. Diamond selections below apply to each ring. Quantity counts complete sets.','三件疊戴戒指套裝：完整訂製戒指價格乘以 3。以下鑽石選項適用於每枚戒指，數量以完整套裝計算。'):t('The initial selections are a starting point for your custom piece. Check the stone sizes and counts below before ordering.','初始選項是訂製作品的起點。下單前請確認以下鑽石大小及數量。');dialog.querySelector('.daily-heading').after(note);}
  const caratSummary=document.createElement('p');caratSummary.className='daily-note';caratSummary.innerHTML=(p.soldAsPair?t('Configured diamond total per pair: ','每對訂製鑽石總重：'):p.soldAsSet?t('Configured diamond total per set: ','每套訂製鑽石總重：'):t('Configured diamond total per piece: ','每件訂製鑽石總重：'))+'<strong id="dailyCaratTotal"></strong>';field('dailyAdditional').after(caratSummary);
  field('dailyTier').value=p.braceletMetalTier||'essential';field('dailyMetal').value=p.defaultMetal||'gold';p.diamonds.forEach((d,i)=>{field('dailyQuality'+i).value=d.quality;field('dailyCarat'+i).value=d.carat;field('dailyQty'+i).value=d.qty;});
  if(p.diamonds.length>1)field('dailyAdditional').open=true;
  if(p.needsStoneSelection){const option=document.createElement('option');option.value='';option.textContent=t('Choose a stone size','選擇鑽石大小');option.disabled=true;field('dailyCarat0').prepend(option);field('dailyCarat0').value='';}
  if(p.needsReview){const label=document.createElement('label');label.className='configuration-confirm';label.innerHTML='<input type="checkbox" required id="configurationConfirm">'+t('I have checked the stone sizes and counts above for my custom order.','我已確認此訂製訂單的鑽石大小及數量。');field('dailySubmit').before(label);}
  if(p.lockDiamonds){
   dialog.querySelector('.daily-heading > div > p:last-child').textContent=t('Choose your metal. This piece has a fixed diamond design.','選擇金屬材質，此作品的鑽石設計已固定。');
   dialog.querySelectorAll('.daily-diamond input,.daily-diamond select').forEach(control=>control.disabled=true);
   dialog.querySelectorAll('.daily-diamond').forEach(group=>group.hidden=true);
   field('dailyAdditional').hidden=true;
   const note=document.createElement('p');note.className='daily-note lab-design-note';note.textContent=t('Fixed diamond design: ','固定鑽石設計：')+p.diamonds.map(d=>`${d.carat} ct × ${d.qty}`).join(' · ')+t(p.soldAsPair?' per pair. Diamond sizes, quantities and quality are predetermined. You can choose your metal.':' per piece. Diamond sizes, quantities and quality are predetermined. You can choose your metal.','（每對）。鑽石大小、數量及級別已固定，您可選擇金屬材質。');field('dailyAdditional').before(note);
  }
  if(p.lockBraceletTier){field('dailyTier').disabled=true;field('dailyTier').parentElement.hidden=true;}
  if(p.type==='bracelet'){
   const summary=document.createElement('section');summary.className='bracelet-specification';summary.setAttribute('aria-label',t('Bracelet specification','手鏈規格'));
   const title=document.createElement('h3');title.textContent=t('Your bracelet specification','您的手鏈規格');
   const value=document.createElement('p'),scale=document.createElement('div'),note=document.createElement('p');scale.className='bracelet-tier-scale';scale.setAttribute('aria-hidden','true');note.className='daily-note';
   const update=()=>{const tier=field('dailyTier').value,index=tierNames.indexOf(tier);value.textContent=tier[0].toUpperCase()+tier.slice(1)+' · '+t(p.lockBraceletTier?'Fixed for this design':'Selected specification',p.lockBraceletTier?'此設計規格固定':'已選規格');scale.replaceChildren();tierNames.forEach((name,i)=>{const bar=document.createElement('span');bar.className=i===index?'is-selected':'';bar.textContent=name[0].toUpperCase()+name.slice(1);scale.append(bar);});};
   note.textContent=t('The specification is fixed for this design. Final dimensions are confirmed with the atelier.','重量範圍表示金屬規格級別，並非鑽石重量或成品確切重量。最終尺寸及重量由工作室確認。');
   summary.append(title,value,scale,note);field('dailyTier').closest('.daily-fields').after(summary);field('dailyTier').addEventListener('change',update);update();
  }
  if(p.diamondPriceOptions){
   const first=field('dailyCarat0').closest('.daily-diamond');first.querySelector('legend').textContent=t('Bracelet diamond size option','手鏈鑽石大小選項');
   const total=window.VDProducts?.products.find(product=>product.id===p.id)?.details?.find(detail=>detail.key==='totalKarat')?.value;
   field('dailyCarat0').parentElement.firstChild.textContent=t('Carat per stone','每顆克拉');
   [field('dailyQuality0'),field('dailyQty0')].forEach(control=>{control.disabled=true;control.parentElement.hidden=true;});
   field('dailyAdditional').hidden=true;caratSummary.hidden=true;
   const count=document.createElement('p');count.id='dailyBraceletStoneCount';count.className='daily-note lab-design-note';count.setAttribute('aria-live','polite');first.after(count);
   const note=document.createElement('p');note.className='daily-note lab-design-note';note.textContent=t('Choose the diamond carat option for this bracelet. The diamond portion is added to your selected metal price. The bracelet design and specification are fixed.','選擇此手鏈的鑽石克拉選項。鑽石部分價格加上所選金屬價格，手鏈設計及規格已固定。');first.before(note);
  }
  if(window.VDDesignRules?.isPerStone(p)){
   dialog.querySelectorAll('.daily-diamond').forEach((group,i)=>{
    group.hidden=i>=p.diamonds.length;
    group.querySelector('legend').textContent=t('Diamond size per stone','每顆鑽石大小')+(p.diamonds.length>1?' · '+(i+1):'');
    const quantity=field('dailyQty'+i);quantity.disabled=true;quantity.parentElement.hidden=false;quantity.parentElement.firstChild.textContent=t('Diamonds per ring · fixed count','每枚戒指鑽石數量 · 固定');
    if(i<p.diamonds.length)field('dailyCarat'+i).querySelector('option[value="0"]')?.remove();
   });
   field('dailyAdditional').hidden=p.diamonds.length<2;field('dailyAdditional').open=true;
   const note=document.createElement('p');note.className='daily-note';note.textContent=t('Carat is the weight of each stone. The configured stone count is fixed for this design.','克拉為每顆鑽石的重量，此設計的鑽石數量已固定。');field('dailyAdditional').before(note);
  }
  if(p.lockStoneCounts){
   p.diamonds.forEach((d,i)=>{const qty=field('dailyQty'+i);qty.disabled=true;qty.parentElement.hidden=false;qty.parentElement.firstChild.textContent=i===0?t('Centre stones · fixed count','主石數量 · 固定'):t('Halo and band stones · fixed count','光環及戒臂鑽石數量 · 固定');if(i>0&&p.lockAccentSize){field('dailyCarat'+i).disabled=true;field('dailyCarat'+i).parentElement.hidden=true;const size=document.createElement('p');size.className='daily-note';size.textContent=t('Fixed round accents: 0.05 ct per stone','固定圓形配石：每顆 0.05 ct');field('dailyQty'+i).parentElement.before(size);}});
   dialog.querySelectorAll('.daily-diamond legend').forEach((legend,i)=>legend.textContent=i===0?t('Oval centre diamond','橢圓形主鑽'):t('Round halo and pavé diamonds','圓形光環及密鑲鑽石'));
  }
  if(p.type==='ring'){
   dialog.querySelectorAll('.daily-diamond').forEach((group,i)=>{if(i>=p.diamonds.length){group.hidden=true;field('dailyCarat'+i).value='0';field('dailyQty'+i).value=1;}});
   field('dailyAdditional').hidden=p.diamonds.length<2;
  }
  visualChoices();
  if(p.diamondPriceOptions&&field('configurationConfirm'))field('configurationConfirm').parentElement.lastChild.textContent=t('I have checked the bracelet diamond size option for my order.','我已確認訂單的手鏈鑽石大小選項。');
  field('dailyClose').onclick=close;field('dailyRetry').onclick=()=>{field('dailyRetry').hidden=true;refreshQuote();};
  field('dailyControls').addEventListener('input',e=>{if(!e.target.dataset.select&&!['dailyCustomer','dailyEmail','configurationConfirm'].includes(e.target.id))changed();});
  field('dailyForm').addEventListener('submit',submit);if(!inline){dialog.showModal();field('dailyClose').focus();}changed();
 }
 async function submit(e){
  e.preventDefault();if(busy)return;const body=read();if(!quote||quote.selection!==JSON.stringify(body)){changed();return;}
  const customerName=field('dailyCustomer').value.trim(),customerEmail=field('dailyEmail').value.trim();
  if(!customerName||!customerEmail){status(t('Please enter your name and email.','請輸入姓名及電郵。'),true);return;}
  busy=true;field('dailyControls').disabled=true;field('dailyClose').disabled=true;status(t('Preparing your payment link…','正在準備付款連結…'),false,true);
  const request=new AbortController(),timeout=setTimeout(()=>request.abort(),45000);
  try{
   const res=await fetch(API+'/'+selected.route+'/payment-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,customerName,customerEmail,expectedTotal:quote.total}),signal:request.signal});
   const data=await res.json();if(!res.ok)throw Object.assign(Error(data.error||'Payment link unavailable'),{httpStatus:res.status});if(data.success!==true)throw Error('Payment link not confirmed');
   field('dailyForm').hidden=true;field('dailySuccess').hidden=false;field('dailySuccess').textContent=t(`Your payment link for ${money(data.amount)} has been sent to ${customerEmail}. Check your inbox and spam folder.`,`已將 ${money(data.amount)} 的付款連結發送至 ${customerEmail}。請查看收件箱及垃圾郵件。`);
  }catch(error){
   status(error.httpStatus===409?t('The price changed. Please check the updated quote and submit again.','價格已變更。請重新核對報價後提交。'):t('The payment link could not be confirmed. Check your email before trying again, or contact us for help.','未能確認付款連結。再次嘗試前請先查看電郵，或聯絡我們。'),true);quote=null;field('dailySubmit').disabled=true;field('dailyRetry').hidden=false;
  }finally{window.VDLoading?.set('checkout',false);clearTimeout(timeout);busy=false;field('dailyControls').disabled=false;field('dailyClose').disabled=false;}
 }
 window.VDCheckout={setOrigin(origin,groups=[]){if(busy)return;diamondOrigin=origin;naturalGroups=groups;dialog.querySelectorAll('.daily-diamond,#dailyAdditional,.lab-design-note').forEach(node=>{if(!node.hasAttribute('data-lab-hidden'))node.dataset.labHidden=String(node.hidden);node.hidden=origin==='natural'||node.dataset.labHidden==='true';});const total=field('dailyCaratTotal')?.parentElement;if(total)total.hidden=origin!=='natural'&&!!selected.diamondPriceOptions;changed();},mount(p){const host=document.getElementById('productCheckout');if(!inline||!host)return;dialog.id='productCheckout';dialog.className='daily-checkout inline-checkout';dialog.removeAttribute('aria-labelledby');host.replaceWith(dialog);open(p);}};
 if(inline)return;
 const action=document.createElement('button');action.type='button';action.className='daily-buy';action.hidden=true;document.querySelector('#productModal .modal-actions')?.prepend(action);
 document.addEventListener('click',e=>{const card=e.target.closest('#dailySparkle .product-card, #occasionalWear .product-card');if(e.target.closest('.product-card')){selected=card?find(card):null;action.hidden=!selected;if(selected)action.textContent=t('Customise & buy','訂製及購買');}});
 document.addEventListener('click',e=>{if(e.target.closest('.daily-buy')&&selected)open(selected);});
 document.querySelectorAll('#dailySparkle .product-card, #occasionalWear .product-card').forEach(card=>{const p=find(card);if(p){if(p.collection==='dailySparkle')card.dataset.price=p.price;card.setAttribute('tabindex','0');card.setAttribute('role','button');card.setAttribute('aria-label',t('View ','查看 ')+name(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}});}});
 if(typeof refreshMeta==='function')refreshMeta();
})();
