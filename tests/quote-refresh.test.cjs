const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../daily-checkout.js'),'utf8');
const code=source.slice(source.indexOf(' let quoteRetries=0;'),source.indexOf(' function changed()'));
function setup(responses){
 const fields={},timers=new Map();let id=0,calls=0;
 const c={version:0,controller:null,quote:null,diamondOrigin:'lab',naturalGroups:[],selected:{},timer:null,AbortController,
  field:key=>fields[key]||(fields[key]={value:'3.00',disabled:false,hidden:true,textContent:''}),
  read:()=>({diamonds:[{quality:'select',carat:'3.00',qty:1}],quantity:1}),valid:()=>true,
  status:message=>{c.message=message;},totals:q=>{c.total=q?.total??null;},t:en=>en,money:n=>'£'+n,
  API:'https://example.test',setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:key=>timers.delete(key),
  fetch:async()=>{calls++;return responses.shift();}};
 vm.createContext(c);vm.runInContext(code,c);
 return{c,fields,timers,calls:()=>calls};
}
const success=()=>({ok:true,status:200,json:async()=>({total:1975,due:987.5,balance:987.5,currency:'GBP'})});
const limited=()=>({ok:false,status:429,headers:{get:()=> '15'},json:async()=>{throw Error('Non-JSON rate-limit response');}});
test('3 ct quote confirms totals and enables checkout',async()=>{const {c,fields}=setup([success()]);await c.refreshQuote();assert.equal(c.total,1975);assert.equal(fields.dailySubmit.disabled,false);});
test('non-JSON rate limit respects retry delay and then confirms price',async()=>{const {c,fields,timers,calls}=setup([limited(),success()]);await c.refreshQuote();assert.match(c.message,/retry shortly/);assert.equal(fields.dailySubmit.disabled,true);const retry=[...timers.values()].find(t=>t.ms===15000);assert(retry);await retry.fn();assert.equal(calls(),2);assert.equal(c.total,1975);assert.equal(fields.dailySubmit.disabled,false);});
test('a changed selection cancels its stale delayed quote retry',async()=>{const {c,timers,calls}=setup([limited(),success()]);await c.refreshQuote();const retry=[...timers.values()].find(t=>t.ms===15000);c.version++;await retry.fn();assert.equal(calls(),1);assert.equal(c.total,null);});
