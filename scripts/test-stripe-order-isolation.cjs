const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const source=fs.readFileSync(new URL('../app/api/webhooks/stripe/route.ts',`file://${__filename}`),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
async function run(session,{signature=true}={}){
 const calls={retrieve:0,emails:0,verified:0};
 const stripe={webhooks:{constructEvent(){calls.verified++;return {type:'checkout.session.completed',data:{object:session}};}},checkout:{sessions:{async retrieve(id){calls.retrieve++;assert.equal(id,session.id);return session;}}}};
 const module={exports:{}};
 const context={module,exports:module.exports,process:{env:{STRIPE_WEBHOOK_SECRET:'test-only'}},console,require(name){
  if(name==='next/server')return {NextResponse:{json:Response.json}};
  if(name==='@/lib/stripe-server')return {getStripe:()=>stripe};
  if(name==='@/lib/order-emails')return {sendOrderPaidEmailsFromStripeSession:async received=>{calls.emails++;assert.equal(received,session);}};
  throw new Error('Unexpected import: '+name);
 }};
 vm.runInNewContext(compiled,context);
 const response=await module.exports.POST(new Request('https://example.test/api/webhooks/stripe',{method:'POST',headers:signature?{'stripe-signature':'test-only'}:{},body:'fixture'}));
 return {response,calls};
}
test('paid UNA Guide checkout is acknowledged without any book lookup or email',async()=>{
 const {response,calls}=await run({id:'kit_fixture',payment_status:'paid',metadata:{product:'una_california_planning_kit_v1'}});
 assert.equal(response.status,200);assert.deepEqual(calls,{retrieve:0,emails:0,verified:1});
});
test('paid book checkout retains its existing lookup and confirmation',async()=>{
 const {response,calls}=await run({id:'book_fixture',payment_status:'paid',metadata:{product:'cosmic_tapestry_paperback_direct'}});
 assert.equal(response.status,200);assert.deepEqual(calls,{retrieve:1,emails:1,verified:1});
});
test('legacy paid book checkout without metadata retains existing behavior',async()=>{
 const {response,calls}=await run({id:'legacy_fixture',payment_status:'paid'});
 assert.equal(response.status,200);assert.equal(calls.emails,1);
});
test('unpaid checkout does not send confirmation',async()=>{
 const {response,calls}=await run({id:'pending_fixture',payment_status:'unpaid',metadata:{product:'cosmic_tapestry_paperback_direct'}});
 assert.equal(response.status,200);assert.equal(calls.emails,0);assert.equal(calls.retrieve,0);
});
test('unsigned request is still rejected before any event handling',async()=>{
 const {response,calls}=await run({id:'unsigned_fixture',payment_status:'paid'},{signature:false});
 assert.equal(response.status,400);assert.deepEqual(calls,{retrieve:0,emails:0,verified:0});
});
