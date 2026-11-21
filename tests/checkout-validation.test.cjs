const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const Stripe = require('stripe');
function load(name, stripe, client) {
  let handler;
  const src=readFileSync(path.join(__dirname,'../supabase/functions',name,'index.ts'),'utf8').replace(/^import .*;\r?\n/gm,'');
  const context={ Deno:{env:{get:k=>({STRIPE_SECRET_KEY:'sk_test_fake',SUPABASE_URL:'https://example.invalid',SUPABASE_SERVICE_ROLE_KEY:'test_only'})[k]},serve:fn=>{handler=fn;}},
    Stripe:stripe,createClient:client,Request,Response,crypto:globalThis.crypto,TextEncoder,Uint8Array,Map,Set,Date,console:{error(){},log(){}} };
  vm.createContext(context); vm.runInContext(ts.transpileModule(src,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,context);
  return { call: (body,headers={})=>handler(new Request('https://example.invalid',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)})),context };
}
test('Checkout rejects non-object JSON payloads without creating a payment',async()=>{
  for(const name of ['create-checkout','milestone-checkout','dfp-website-checkout','create-subscription-checkout']){
    const {call}=load(name,Stripe,()=>({auth:{async getUser(){return {data:{user:{id:'user'}},error:null};}}}));
    for(const payload of [null,[],42]){
      // Authenticated endpoints intentionally reject missing auth before parsing.
      const response=await call(payload); assert.ok([400,401].includes(response.status));
    }
  }
});
test('server price validation rejects a mismatched recurring amount',async()=>{
  let sessions=0;
  class FakeStripe extends Stripe { constructor(key){super(key);this.prices.list=async()=>({data:[{id:'price_existing',active:true,type:'recurring',currency:'gbp',unit_amount:1,recurring:{interval:'month',interval_count:1},billing_scheme:'per_unit'}]});this.checkout.sessions.create=async()=>{sessions++;return {};};} }
  const response=await load('create-subscription-checkout',FakeStripe).call({lookup_key:'starter_plan_monthly',quantity:100,amount:1});
  assert.ok(response.status>=500);assert.equal(sessions,0);
});
test('the published plan uses its existing price and a stable retry key',async()=>{
  const captured=[];
  class FakeStripe extends Stripe { constructor(key){super(key);this.prices.list=async()=>({data:[{id:'price_existing',active:true,type:'recurring',currency:'gbp',unit_amount:2000,recurring:{interval:'month',interval_count:1},billing_scheme:'per_unit'}]});this.checkout.sessions.create=async(args,options)=>{captured.push({args,options});return {url:'https://checkout.stripe.com/test',id:'cs_test_one'};};} }
  const h=load('create-subscription-checkout',FakeStripe);
  const body={lookup_key:'starter_plan_monthly',quantity:100,amount:1,request_id:'00000000-0000-4000-8000-000000000001'};
  assert.equal((await h.call(body)).status,200);assert.equal((await h.call(body)).status,200);
  assert.equal(captured[0].args.line_items[0].price,'price_existing');assert.equal(captured[0].args.line_items[0].quantity,1);
  assert.equal(captured[0].options.idempotencyKey,captured[1].options.idempotencyKey);
});
test('email knowledge cannot recover a different guest checkout request',async()=>{
  const {context}=load('dfp-website-checkout',Stripe);
  const derive=(key)=>vm.runInContext(`checkoutOrderId('customer@example.invalid','launch',123,${JSON.stringify(key)})`,context);
  const one=await derive('00000000-0000-4000-8000-000000000001');
  assert.equal(await derive('00000000-0000-4000-8000-000000000001'),one);
  assert.notEqual(await derive('00000000-0000-4000-8000-000000000002'),one);
});

 test('a refunded milestone cannot be charged again through the original milestone', async()=>{
  let stripeCalls=0;
  class FakeStripe { constructor(){stripeCalls++;} }
  const milestone={id:'00000000-0000-4000-8000-000000000001',payment_status:'refunded',stripe_payment_id:'pi_already_paid'};
  const createClient=()=>({auth:{async getUser(){return {data:{user:{id:'user'}},error:null};}},from(){const q={select(){return q;},eq(){return q;},async maybeSingle(){return {data:milestone,error:null};}};return q;}});
  const h=load('milestone-checkout',FakeStripe,createClient);
  const response=await h.call({milestoneId:milestone.id},{Authorization:'Bearer verified-by-test-client'});
  assert.equal(response.status,409);assert.equal(stripeCalls,0);
});
