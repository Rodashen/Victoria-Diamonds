const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'victoria-diamonds.js'),'utf8');
function element(){const classes=new Set();return {hidden:false,style:{},classList:{add:v=>classes.add(v),remove:v=>classes.delete(v),contains:v=>classes.has(v)},setAttribute(k,v){this[k]=v;}};}
test('newsletter success hides signup and announces confirmation; reopening restores the original form',()=>{
 const form=element(),success=element(),error=element(),heading=element(),description=element(),popup=element();
 const nodes={'.email-subscription-form-state':form,'.email-subscription-success':success,'.email-subscription-error':error,'.email-subscription-text-column h2':heading,'.email-subscription-text-column > p':description};
 popup.querySelector=s=>nodes[s];popup.querySelectorAll=()=>[heading,description];
 const c={emailSubscriptionPopup:popup,emailSubscriptionSubmissionPending:true,emailSubscriptionSuccessTimer:null,clearTimeout(){}};
 const functions=source.slice(source.indexOf('function resetEmailSubscriptionStates()'),source.indexOf('// FAQ Accordion',source.indexOf('function resetEmailSubscriptionStates()')));vm.createContext(c);vm.runInContext(functions,c);
 c.showEmailSubscriptionSuccess();assert.equal(form.hidden,true);assert.equal(heading.style.display,'none');assert.equal(description.style.display,'none');assert.equal(success.role,'status');assert.ok(popup.classList.contains('subscription-confirmed'));assert.ok(success.classList.contains('show'));
 c.resetEmailSubscriptionStates();assert.equal(form.hidden,false);assert.equal(heading.style.display,'');assert.equal(description.style.display,'');assert.ok(!success.classList.contains('show'));assert.ok(!popup.classList.contains('subscription-confirmed'));
});
