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
 const inline=location.pathname.endsWith('/product.html');
 const dialog=document.createElement(inline?'div':'dialog');
 dialog.id='dailyCheckout';dialog.className='daily-checkout';dialog.setAttribute('aria-labelledby','dailyCheckoutTitle');if(!inline)document.body.append(dialog);
 const close=()=>{if(busy)return;controller?.abort();clearTimeout(timer);version++;dialog.close();lastFocus?.focus();};
 dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close();});
 const field=id=>dialog.querySelector('#'+id);
 const read=()=>({productId:selected.id,collection:selected.collection,metal:field('dailyMetal').value,karat:Number(field('dailyKarat').value),purity:Number(field('dailyPurity').value),braceletMetalTier:field('dailyTier').value,quantity:Number(field('dailyQuantity').value),paymentPercentage:Number(field('dailyPayment').value),diamonds:[0,1,2,3].map(i=>({quality:field('dailyQuality'+i).value,carat:field('dailyCarat'+i).value,qty:Number(field('dailyQty'+i).value)})).filter(d=>d.carat!=='0')});
 const valid=b=>Number.isInteger(b.quantity)&&b.quantity>=1&&b.quantity<=10&&b.diamonds.every(d=>Number.isInteger(d.qty)&&d.qty>=1&&d.qty<=100);
 function status(message,error=false){field('dailyStatus').textContent=message;field('dailyStatus').classList.toggle('error',error);if(error){const price=document.getElementById('productQuote');if(price)price.textContent=t('Complete your selections for a price','完成選擇以查看價格');}}
 function totals(q){field('dailyTotal').textContent=q?money(q.total):'—';field('dailyDue').textContent=q?money(q.due):'—';field('dailyBalance').textContent=q?money(q.balance):'—';const price=document.getElementById('productQuote');if(price)price.textContent=q?money(q.total)+' GBP':t('Confirming price…','正在確認價格…');}
 async function refreshQuote(){
  const current=++version;controller?.abort();const request=new AbortController();controller=request;quote=null;field('dailySubmit').disabled=true;totals(null);
  const body=read();if(field('dailyCarat0').value===''){status(t('Choose the main stone size, or choose no diamonds for a plain design.','請選擇主石大小，或為素面設計選擇無鑽石。'),true);return;}if(!valid(body)){status(t('Please enter whole-number quantities within the stated limits.','請輸入有效範圍內的整數數量。'),true);return;}
  status(t('Checking your price…','正在核對價格…'));const timeout=setTimeout(()=>request.abort(),20000);
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
  status(t('Checking your price…','正在核對價格…'));
  field('dailyCaratTotal').textContent=read().diamonds.reduce((sum,d)=>sum+Number(d.carat)*d.qty,0).toFixed(2)+' ct';
  field('dailyKaratWrap').hidden=field('dailyMetal').value!=='gold';field('dailyPurityWrap').hidden=field('dailyMetal').value!=='silver';
  clearTimeout(timer);timer=setTimeout(refreshQuote,250);
 }
 function open(p){
  selected=p;lastFocus=document.activeElement;quote=null;busy=false;
  const options=catalogue.carats.map(c=>`<option value="${c}">${c} ct</option>`).join('');
  const tierNames=['essential','signature','atelier','premium','supreme'],minimumTier=tierNames.indexOf(p.minBraceletTier||'essential');
  const tierOptions=tierNames.map((tier,index)=>`<option value="${tier}" ${index<minimumTier?'disabled':''}>${tier[0].toUpperCase()+tier.slice(1)}${tier==='essential'?' · 2.5–4 g':tier==='signature'?' · 4–5.5 g':tier==='atelier'?' · 5.5–8 g':tier==='premium'?' · 8–19 g':' · 16+ g'}</option>`).join('');
  const diamond=i=>`<fieldset class="daily-diamond"><legend>${i===0?t('Main diamonds','主鑽'):t('Diamond specification ','鑽石規格 ')+(i+1)}</legend><div class="daily-fields"><label>${t('Quality','級別')}<select id="dailyQuality${i}"><option value="select">Select</option><option value="luxe">Luxe</option></select></label><label>${t('Carat per stone','每顆克拉')}<select id="dailyCarat${i}">${i||['foreverBond','singleLady'].includes(p.collection)?`<option value="0">${t('None','無')}</option>`:''}${options}</select></label><label>${t('Number of stones','鑽石數量')}<input id="dailyQty${i}" type="number" min="1" max="100" step="1" value="1" required></label></div></fieldset>`;
  dialog.innerHTML=`<button type="button" class="daily-close" aria-label="${t('Close customization','關閉訂製')}" id="dailyClose">×</button>
   <div class="daily-heading"><img src="images/${esc(p.image)}" alt="${esc(name(p))}"><div><p class="daily-eyebrow">${selected.collection==='occasionWear'?t('HIGH NOTE · CUSTOMISE & BUY','華麗樂章 · 訂製及購買'):selected.collection==='mens'?t('MEN’S COLLECTION · CUSTOMISE & BUY','男士系列 · 訂製及購買'):t('DAILY SPARKLE · CUSTOMISE & BUY','日常閃耀 · 訂製及購買')}</p><h2 id="dailyCheckoutTitle">${esc(name(p))}</h2><p>${t('Choose your materials and diamonds. The photograph shows the original design; your selections define your order.','選擇材質及鑽石。照片展示原始設計，訂單以您所選的規格為準。')}</p></div></div>
   <form id="dailyForm"><fieldset id="dailyControls"><legend class="daily-sr">${t('Your configuration','您的訂製規格')}</legend>
   <h3>${t('Precious metal','貴金屬')}</h3><div class="daily-fields"><label>${t('Metal','材質')}<select id="dailyMetal"><option value="gold">${t('Gold','黃金')}</option><option value="silver">${t('Silver','白銀')}</option><option value="platinum">${t('Platinum','鉑金')}</option></select></label><label id="dailyKaratWrap">${t('Gold karat','黃金純度')}<select id="dailyKarat"><option value="9">9K</option><option value="14">14K</option><option value="18" selected>18K</option><option value="22">22K</option></select></label><label id="dailyPurityWrap" hidden>${t('Silver purity','白銀純度')}<select id="dailyPurity"><option value="925">Sterling 925</option><option value="990">Fine 990</option><option value="999">Fine 999</option></select></label><label ${p.type!=='bracelet'?'hidden':''}>${t('Bracelet specification','手鏈規格')}<select id="dailyTier">${tierOptions}</select></label></div>
   <h3>${t('Diamonds','鑽石')}</h3>${diamond(0)}<details id="dailyAdditional"><summary>${t('Additional diamond specifications','其他鑽石規格')}</summary>${diamond(1)+diamond(2)+diamond(3)}</details>
   <div class="daily-fields daily-order"><label>${p.soldAsPair?t('Number of pairs (1–10)','對數（1–10）'):p.soldAsSet?t('Number of sets (1–10)','套數（1–10）'):t('Number of pieces (1–10)','件數（1–10）')}<input id="dailyQuantity" type="number" min="1" max="10" step="1" value="1" required></label><label>${t('Payment option','付款方式')}<select id="dailyPayment"><option value="30">${t('30% down payment','30% 訂金')}</option><option value="50" selected>${t('50% down payment','50% 訂金')}</option><option value="100">${t('Pay in full','全額付款')}</option></select></label></div>
   <div class="daily-summary" aria-live="polite"><div><span>${t('Order total','訂單總額')}</span><strong id="dailyTotal">—</strong></div><div><span>${t('Due now','現在支付')}</span><strong id="dailyDue">—</strong></div><div><span>${t('Remaining balance','剩餘款項')}</span><strong id="dailyBalance">—</strong></div></div><p class="daily-note">${t('All payments are in GBP. For a deposit, the remaining balance is due before dispatch or collection.','所有付款均以英鎊結算。如支付訂金，餘款須於發貨或取貨前付清。')}</p>
   <h3>${t('Your details','聯絡資料')}</h3><div class="daily-fields"><label>${t('Full name','姓名')}<input id="dailyCustomer" name="name" autocomplete="name" maxlength="120" required></label><label>${t('Email','電郵')}<input id="dailyEmail" name="email" autocomplete="email" type="email" maxlength="254" required></label></div>
   <p id="dailyStatus" role="status"></p><button type="button" id="dailyRetry" hidden>${t('Retry price check','重新核對價格')}</button><button type="submit" id="dailySubmit" class="daily-primary" disabled>${t('Email my secure payment link','發送安全付款連結至電郵')}</button><p class="daily-note">${t('Continue to payment using the link in your email. Submitting this form does not charge your card.','使用電郵中的連結完成付款。提交此表格不會扣款。')}</p></fieldset></form><div id="dailySuccess" hidden role="status"></div>`;
  if(p.collection!=='dailySparkle'){const note=document.createElement('p');note.className='daily-note';note.textContent=t('The initial selections are a starting point for your custom piece. Check the stone sizes and counts below before ordering.','初始選項是訂製作品的起點。下單前請確認以下鑽石大小及數量。');dialog.querySelector('.daily-heading').after(note);}
  const caratSummary=document.createElement('p');caratSummary.className='daily-note';caratSummary.innerHTML=(p.soldAsPair?t('Configured diamond total per pair: ','每對訂製鑽石總重：'):p.soldAsSet?t('Configured diamond total per set: ','每套訂製鑽石總重：'):t('Configured diamond total per piece: ','每件訂製鑽石總重：'))+'<strong id="dailyCaratTotal"></strong>';field('dailyAdditional').after(caratSummary);
  field('dailyTier').value=p.braceletMetalTier||'essential';field('dailyMetal').value=p.defaultMetal||'gold';p.diamonds.forEach((d,i)=>{field('dailyQuality'+i).value=d.quality;field('dailyCarat'+i).value=d.carat;field('dailyQty'+i).value=d.qty;});
  if(p.diamonds.length>1)field('dailyAdditional').open=true;
  if(p.needsStoneSelection){const option=document.createElement('option');option.value='';option.textContent=t('Choose a stone size','選擇鑽石大小');option.disabled=true;field('dailyCarat0').prepend(option);field('dailyCarat0').value='';}
  if(p.needsReview){const label=document.createElement('label');label.className='configuration-confirm';label.innerHTML='<input type="checkbox" required id="configurationConfirm">'+t('I have checked the stone sizes and counts above for my custom order.','我已確認此訂製訂單的鑽石大小及數量。');field('dailySubmit').before(label);}
  field('dailyClose').onclick=close;field('dailyRetry').onclick=()=>{field('dailyRetry').hidden=true;refreshQuote();};
  field('dailyControls').addEventListener('input',e=>{if(!['dailyCustomer','dailyEmail','configurationConfirm'].includes(e.target.id))changed();});
  field('dailyForm').addEventListener('submit',submit);if(!inline){dialog.showModal();field('dailyClose').focus();}changed();
 }
 async function submit(e){
  e.preventDefault();if(busy)return;const body=read();if(!quote||quote.selection!==JSON.stringify(body)){changed();return;}
  const customerName=field('dailyCustomer').value.trim(),customerEmail=field('dailyEmail').value.trim();
  if(!customerName||!customerEmail){status(t('Please enter your name and email.','請輸入姓名及電郵。'),true);return;}
  busy=true;field('dailyControls').disabled=true;field('dailyClose').disabled=true;status(t('Preparing your payment link…','正在準備付款連結…'));
  const request=new AbortController(),timeout=setTimeout(()=>request.abort(),45000);
  try{
   const res=await fetch(API+'/'+selected.route+'/payment-link',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,customerName,customerEmail,expectedTotal:quote.total}),signal:request.signal});
   const data=await res.json();if(!res.ok)throw Object.assign(Error(data.error||'Payment link unavailable'),{httpStatus:res.status});if(data.success!==true)throw Error('Payment link not confirmed');
   field('dailyForm').hidden=true;field('dailySuccess').hidden=false;field('dailySuccess').textContent=t(`Your payment link for ${money(data.amount)} has been sent to ${customerEmail}. Check your inbox and spam folder.`,`已將 ${money(data.amount)} 的付款連結發送至 ${customerEmail}。請查看收件箱及垃圾郵件。`);
  }catch(error){
   status(error.httpStatus===409?t('The price changed. Please check the updated quote and submit again.','價格已變更。請重新核對報價後提交。'):t('The payment link could not be confirmed. Check your email before trying again, or contact us for help.','未能確認付款連結。再次嘗試前請先查看電郵，或聯絡我們。'),true);quote=null;field('dailySubmit').disabled=true;field('dailyRetry').hidden=false;
  }finally{clearTimeout(timeout);busy=false;field('dailyControls').disabled=false;field('dailyClose').disabled=false;}
 }
 window.VDCheckout={mount(p){const host=document.getElementById('productCheckout');if(!inline||!host)return;dialog.id='productCheckout';dialog.className='daily-checkout inline-checkout';dialog.removeAttribute('aria-labelledby');host.replaceWith(dialog);open(p);}};
 if(inline)return;
 const action=document.createElement('button');action.type='button';action.className='daily-buy';action.hidden=true;document.querySelector('#productModal .modal-actions')?.prepend(action);
 document.addEventListener('click',e=>{const card=e.target.closest('#dailySparkle .product-card, #occasionalWear .product-card');if(e.target.closest('.product-card')){selected=card?find(card):null;action.hidden=!selected;if(selected)action.textContent=t('Customise & buy','訂製及購買');}});
 document.addEventListener('click',e=>{if(e.target.closest('.daily-buy')&&selected)open(selected);});
 document.querySelectorAll('#dailySparkle .product-card, #occasionalWear .product-card').forEach(card=>{const p=find(card);if(p){if(p.collection==='dailySparkle')card.dataset.price=p.price;card.setAttribute('tabindex','0');card.setAttribute('role','button');card.setAttribute('aria-label',t('View ','查看 ')+name(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();}});}});
 if(typeof refreshMeta==='function')refreshMeta();
})();
