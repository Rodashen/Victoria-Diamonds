const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function fixture(){
 let id=0;const timers=new Map(),events={};const label={textContent:''};const body={append(el){el.parentElement=body;body.indicator=el;}};
 const document={readyState:'complete',body,documentElement:{lang:'en'},createElement(){return {hidden:false,setAttribute(){},querySelector(){return label;}};},querySelectorAll(){return [];},addEventListener(name,fn){events[name]=fn;}};
 const context={window:{addEventListener(name,fn){events[name]=fn;}},document,MutationObserver:class{observe(){}},setTimeout(fn,ms){timers.set(++id,{fn,ms});return id;},clearTimeout(id){timers.delete(id);}};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../atelier-feedback.js'),'utf8'),context);
 return {api:context.window.VDLoading,body,label,events,flush(){for(const [id,timer]of [...timers])if(timer.ms===160){timers.delete(id);timer.fn();}}};
}
test('centred ring follows concurrent operations and disappears only when all finish',()=>{
 const f=fixture();f.api.set('quote',true,'Confirming price');assert.ok(f.body.indicator.hidden);f.flush();assert.equal(f.body.indicator.hidden,false);assert.equal(f.label.textContent,'Confirming price');f.api.set('newsletter',true,'Joining');f.api.set('quote',false);assert.equal(f.body.indicator.hidden,false);f.api.set('newsletter',false);assert.equal(f.body.indicator.hidden,true);
});
test('instant operations do not flash and page navigation clears pending feedback',()=>{
 const f=fixture();f.api.set('quote',true);f.api.set('quote',false);f.flush();assert.ok(f.body.indicator.hidden);f.api.set('payment',true);f.flush();assert.equal(f.body.indicator.hidden,false);f.events.pagehide();assert.ok(f.body.indicator.hidden);
});
