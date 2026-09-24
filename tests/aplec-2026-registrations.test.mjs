import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { registrationHarness } from "./registration-harness.mjs";
import { renderToStaticMarkup } from "react-dom/server";

const input = (extra = {}) => ({ requestId: randomUUID(), firstName: "Núria", lastName: "Prova", email: " PROVA@EXAMPLE.COM ", phone: "+34 600 000 000", consent: true, website: "", people: "2", vegetarian: "1", ...extra });
function request(body, path = "lunch", origin = "http://localhost:3027") {
  return new Request(`http://localhost:3027/api/aplec-2026/${path}`, { method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body) });
}
async function submit(h, body, kind = "lunch") { return h.load("src/app/api/aplec-2026/[kind]/route.ts").POST(request(body, kind), { params: Promise.resolve({ kind }) }); }

test("validates consent, honeypot, lengths, integer counts, availability and normalized contact", async () => {
  const h = registrationHarness();
  const { validateRegistration } = h.load("src/lib/aplec-2026-registration.ts");
  const valid = validateRegistration("lunch", input());
  assert.equal(Object.keys(valid.errors).length, 0); assert.equal(valid.input.email, "prova@example.com"); assert.equal(valid.input.phone, "+34600000000");
  for (const bad of [{ consent: false }, { people: "0" }, { people: "1.5" }, { vegetarian: "-1" }, { vegetarian: "3" }, { website: "bot" }, { email: "invalid" }, { firstName: "x".repeat(81) }, { phone: "abc" }]) assert.equal((await submit(h, input(bad))).status, 400);
  assert.equal((await submit(h, input({ age: "30", days: [], availability: "Matí" }), "volunteers")).status, 400);
  assert.equal(h.blobs.size, 0);
  assert.equal((await h.load("src/app/api/aplec-2026/[kind]/route.ts").POST(request(input(), "lunch", "https://evil.invalid"), { params: Promise.resolve({ kind: "lunch" }) })).status, 400);
});

test("concurrent requests never exceed people capacity; retries do not duplicate; cancellations release places", async () => {
  const h = registrationHarness(); const store = h.load("src/lib/aplec-2026-registration-store.ts");
  const first = input({ people: "118", vegetarian: "0" });
  assert.equal((await submit(h, first)).status, 200);
  assert.equal((await submit(h, input({ people: "3" }))).status, 409);
  const outcomes = await Promise.all([submit(h, input()), submit(h, input())]);
  assert.deepEqual(outcomes.map(r => r.status).sort(), [200,409]);
  assert.equal((await store.getLunchAvailability()).remaining, 0);
  const replay = await submit(h, first); assert.equal(replay.status, 200);
  assert.equal((await store.getRegistrations("lunch")).length, 2);
  assert.equal((await submit(h, { ...first, firstName: "Changed" })).status, 409);
  const record = (await store.getRegistrations("lunch"))[0];
  await store.updateLunchStatus(record.id, "cancelled"); assert.equal((await store.getLunchAvailability()).remaining, 118);
  await submit(h, input({ people: "118", vegetarian: "0" }));
  await assert.rejects(store.updateLunchStatus(record.id, "paid"));
  assert.equal((await store.getLunchAvailability()).remaining, 0);
});

test("simultaneous first writes, double submits, physical sales and deadline", async () => {
  const h = registrationHarness(); const store = h.load("src/lib/aplec-2026-registration-store.ts");
  const body = input();
  const results = await Promise.all([submit(h,body),submit(h,body),submit(h,input())]);
  assert(results.every(r=>r.status===200)); assert.equal((await store.getRegistrations("lunch")).length,2);
  await store.updatePhysicalPlaces(116); assert.equal((await store.getLunchAvailability()).remaining,0);
  await assert.rejects(store.updatePhysicalPlaces(117)); await store.updatePhysicalPlaces(0);
  h.options.now = Date.parse("2026-10-17T21:59:59.000Z"); assert.equal((await submit(h,input())).status,200);
  h.options.now = Date.parse("2026-10-17T22:00:00.000Z"); assert.equal((await submit(h,input())).status,409);
  assert.equal((await store.getLunchAvailability()).closed,true);
});

test("save before email; missing and failed mail never lose a registration", async () => {
  const h=registrationHarness(); const store=h.load("src/lib/aplec-2026-registration-store.ts");
  await submit(h,input({age:"25",days:["Divendres 16 d’octubre"],availability:"Matí",observations:""}),"volunteers");
  await h.flush(); let record=(await store.getRegistrations("volunteers"))[0];
  assert.equal(record.notifications.organization,"pending"); assert.equal(record.consentVersion,"2026-09-24-v1"); assert(record.createdAt); assert(!("ip" in record));
  h.env.RESEND_API_KEY="test";h.env.REGISTRATION_FROM_EMAIL="test@example.com";h.options.mailStatus=500;
  await h.load("src/lib/aplec-2026-registration-mail.ts").notifyRegistration(record);
  record=(await store.getRegistrations("volunteers"))[0]; assert.equal(record.notifications.organization,"failed");
  h.options.mailStatus=200;await h.load("src/lib/aplec-2026-registration-mail.ts").notifyRegistration(record);
  assert.equal((await store.getRegistrations("volunteers"))[0].notifications.participant,"sent");
  assert.equal(h.emails[0].to[0],"carla@resilience.earth"); assert(h.emails.every(e=>e.text&&!e.html));
  h.options.failWrites=true; assert.equal((await submit(h,input())).status,503);
  assert.equal((await store.getRegistrations("lunch")).length,0);
});

test("ticket credentials isolate records, real PDF downloads and private response headers", async () => {
  const h=registrationHarness(); const submitted=await (await submit(h,input())).json();
  const [id,token]=submitted.ticketUrl.split("#")[1].split("/");
  const ticketRoute=h.load("src/app/api/aplec-2026/ticket/route.ts");
  const response=await ticketRoute.POST(request({id,token},"ticket")); assert.equal(response.status,200); assert.equal(response.headers.get("cache-control"),"private, no-store");
  const ticket=(await response.json()).ticket; assert.equal(ticket.firstName,"Núria");assert(!("email" in ticket));assert(!("ticketToken" in ticket));
  assert.equal((await ticketRoute.POST(request({id,token:"a".repeat(64)},"ticket"))).status,404);
  const pdf=await ticketRoute.POST(request({id,token,format:"pdf"},"ticket"));assert.equal(pdf.status,200);assert.equal(pdf.headers.get("content-type"),"application/pdf");
  const bytes=Buffer.from(await pdf.arrayBuffer());assert.equal(bytes.subarray(0,4).toString(),"%PDF");
  mkdirSync("tmp",{recursive:true});writeFileSync("tmp/registration-ticket.pdf",bytes);
});

test("admin exports and mutations require auth, CSV neutralizes formulas", async () => {
  const h=registrationHarness(); await submit(h,input({ firstName:"=1+1" }));
  const route=h.load("src/app/admin/aplec-2026/route.ts");
  const req=new Request("http://localhost:3027/admin/aplec-2026?kind=lunch");assert.equal((await route.GET(req)).status,401);
  assert.equal((await route.POST(new Request(req.url,{method:"POST"}))).status,401);
  h.options.admin=true; const csv=await route.GET(req);assert.equal(csv.status,200);const text=await csv.text();assert(text.includes("'=1+1"));assert(!text.includes("ticketToken"));assert(!text.includes("private.blob"));
  const store=h.load("src/lib/aplec-2026-registration-store.ts");const id=(await store.getRegistrations("lunch"))[0].id;
  const form=new FormData();form.set("id",id);form.set("status","paid");
  const change=()=>new Request("http://localhost:3027/admin/aplec-2026",{method:"POST",headers:{origin:"http://localhost:3027"},body:form});
  assert.equal((await route.POST(change())).status,303);assert.equal((await store.getRegistrations("lunch"))[0].status,"paid");
});

test("43 main activities retain schedules with requested replacements", () => {
  const h=registrationHarness();const days=h.load("src/lib/aplec-2026-program.ts").aplec2026Program;
  assert.deepEqual(Array.from(days,d=>d.activities.length),[12,21,10]);
  assert.equal(days[0].activities.at(-1).time,"01.00 h");assert.equal(days[1].activities.find(a=>a.title==="Dinar").time,"14.00 h");assert.equal(days[1].activities.find(a=>a.title.includes("Primer partit")).time,"16.00 h");
  for(const name of ["Rafel Ortiz","Poesia Cinètica amb Albert Cuevas"])assert.deepEqual(Array.from(days[1].activities.filter(a=>a.title.includes(name)),a=>a.time),["10.30 h","16.00 h"]);
  assert.equal(days[1].activities.find(a=>a.title.includes("Casa meva")).time,"16.30 h");
  assert(!/Custòdia|Custodia|xxx|Sense hora indicada|Properament|Plaça Major [12]|Correfoc|Interactiu sensorial|Durant tot el dia/.test(JSON.stringify(days)));
  assert(readFileSync("src/app/globals.css","utf8").includes("::first-letter { text-transform:uppercase; }"));
});

test("admin section renders personal data only with authenticated access", async () => {
  const h=registrationHarness();await submit(h,input());await h.flush();
  const component=h.load("src/components/aplec-2026-registration-admin.tsx").RegistrationAdmin;
  assert.equal(await component({}),null);
  h.options.admin=true;const html=renderToStaticMarkup(await component({}));
  assert(html.includes("Núria"));assert(html.includes("2 / 120"));assert(html.includes("prova@example.com"));assert(html.includes("Exporta reserves CSV"));assert(html.includes("Reintenta els correus pendents"));
  const token=(await h.load("src/lib/aplec-2026-registration-store.ts").getRegistrations("lunch"))[0].ticketToken;
  assert(!html.includes(token));
});

test("missing private configuration fails closed without using the editorial token", async () => {
  const h=registrationHarness();delete h.env.REGISTRATION_BLOB_READ_WRITE_TOKEN;h.env.BLOB_READ_WRITE_TOKEN="public-editorial-token";
  assert.equal((await submit(h,input())).status,503);assert.equal(h.blobs.size,0);
  h.env.REGISTRATION_BLOB_READ_WRITE_TOKEN=h.env.BLOB_READ_WRITE_TOKEN;
  assert.equal((await submit(h,input())).status,503);assert.equal(h.blobs.size,0);
});

test("walk validates four fields and consent; stores only relevant data with idempotency and no lunch limit", async () => {
  const h=registrationHarness(); const store=h.load("src/lib/aplec-2026-registration-store.ts");
  for (const key of ["firstName","lastName","email","phone"]) {
    const response=await submit(h,input({[key]:""}),"walk");
    assert.equal(response.status,400);assert((await response.json()).errors[key]);
  }
  for (const extra of [{consent:false},{website:"bot"},{requestId:"invalid"},{lastName:"x".repeat(101)},{email:"invalid"},{phone:"abc"}]) assert.equal((await submit(h,input(extra),"walk")).status,400);
  assert.equal((await submit(h,input({observations:"x".repeat(20000)}),"walk")).status,400);
  assert.equal(h.blobs.size,0);
  await store.updatePhysicalPlaces(120);
  const body=input();const results=await Promise.all([submit(h,body,"walk"),submit(h,body,"walk")]);
  assert(results.every(r=>r.status===200));assert.equal((await store.getRegistrations("walk")).length,1);
  assert.equal((await submit(h,{...body,lastName:"Changed"},"walk")).status,409);
  // More than 120 independent people can register, even when lunch is full.
  for(let i=0;i<120;i++) assert.equal((await submit(h,input(),"walk")).status,200);
  const records=await store.getRegistrations("walk");assert.equal(records.length,121);
  for(const record of records) {
    for(const key of ["people","vegetarian","age","days","observations","status","ticketToken","ip"]) assert(!(key in record));
    assert(record.consentText.includes("caminada"));assert(record.createdAt);assert(record.consentVersion);
  }
  assert(h.blobs.has("iltir-2026/walk/registrations.json"));
});

test("walk mail has its own recipient and admin supports private CSV and mail retries", async () => {
  const h=registrationHarness();await submit(h,input(),"walk");await h.flush();
  const store=h.load("src/lib/aplec-2026-registration-store.ts");const record=(await store.getRegistrations("walk"))[0];
  assert.equal(record.notifications.organization,"pending");
  const route=h.load("src/app/admin/aplec-2026/route.ts"), url="http://localhost:3027/admin/aplec-2026";
  assert.equal((await route.GET(new Request(`${url}?kind=walk`))).status,401);
  h.options.admin=true;const csv=await route.GET(new Request(`${url}?kind=walk`));assert.equal(csv.status,200);
  assert.equal(csv.headers.get("cache-control"),"private, no-store");
  const text=await csv.text();assert(text.includes("Núria"));assert(text.includes("prova@example.com"));assert(text.includes("+34600000000"));assert(!text.includes("ticketToken"));
  const component=h.load("src/components/aplec-2026-registration-admin.tsx").RegistrationAdmin;
  const html=renderToStaticMarkup(await component({}));assert(html.includes("Caminada"));assert(html.includes("Exporta caminada CSV"));assert(html.includes('value="walk"'));assert(html.includes("Núria"));
  h.env.RESEND_API_KEY="test";h.env.REGISTRATION_FROM_EMAIL="test@example.com";
  h.env.REGISTRATION_NOTIFY_EMAIL="carla@resilience.earth";
  const form=new FormData();form.set("action","notify");form.set("kind","walk");form.set("id",record.id);
  const retry=()=>route.POST(new Request(url,{method:"POST",headers:{origin:"http://localhost:3027"},body:form}));
  assert.equal((await retry()).status,303);
  assert.equal(h.emails[0].to[0],"lluis.arambilet@gmail.com");assert.equal(h.emails[1].to[0],"prova@example.com");
  assert(h.emails[1].text.includes("inscripció"));assert(!/plaça confirmada/i.test(h.emails[1].text));
  assert.equal((await store.getRegistrations("walk"))[0].notifications.participant,"sent");
  await retry();assert.equal(h.emails.length,2);
  h.env.REGISTRATION_WALK_NOTIFY_EMAIL="walk-override@example.com";
  await submit(h,input(),"walk");await h.flush();assert.equal(h.emails[2].to[0],"walk-override@example.com");
});

test("all PDF ticket states show only the appropriate payment message", async () => {
  const h=registrationHarness();await submit(h,input());
  const store=h.load("src/lib/aplec-2026-registration-store.ts");const record=(await store.getRegistrations("lunch"))[0];
  const {ticketHeadings,pendingPaymentNotice}=h.load("src/lib/aplec-2026-registration.ts");
  const route=h.load("src/app/api/aplec-2026/ticket/route.ts");
  for(const status of ["pending","paid","cancelled"]) {
    await store.updateLunchStatus(record.id,status);h.pdfTexts.length=0;
    const response=await route.POST(request({id:record.id,token:record.ticketToken,format:"pdf"},"ticket"));assert.equal(response.status,200);
    const bytes=Buffer.from(await response.arrayBuffer());assert.equal(bytes.subarray(0,4).toString(),"%PDF");
    const text=h.pdfTexts.join(" ");assert(text.includes(ticketHeadings[status]));assert.equal(text.includes(pendingPaymentNotice),status==="pending");
    for(const other of ["pending","paid","cancelled"].filter(s=>s!==status))assert(!text.includes(ticketHeadings[other]));
    mkdirSync("tmp",{recursive:true});writeFileSync(`tmp/registration-ticket-${status}.pdf`,bytes);
  }
});

test("admin distinguishes capacity, missing records, cancellation and store outage", async () => {
  const h=registrationHarness();await submit(h,input());h.options.admin=true;
  const store=h.load("src/lib/aplec-2026-registration-store.ts"), route=h.load("src/app/admin/aplec-2026/route.ts");
  const record=(await store.getRegistrations("lunch"))[0];
  async function post(values) {const body=new FormData();for(const [key,value]of Object.entries(values))body.set(key,value);return route.POST(new Request("http://localhost:3027/admin/aplec-2026",{method:"POST",headers:{origin:"http://localhost:3027"},body}));}
  assert((await post({action:"physical",physicalPlaces:"120"})).headers.get("location").includes("registrations=capacity"));
  assert((await post({id:"missing",status:"paid"})).headers.get("location").includes("registrations=not-found"));
  await store.updateLunchStatus(record.id,"cancelled");
  assert((await post({action:"notify",kind:"lunch",id:record.id})).headers.get("location").includes("registrations=cancelled"));assert.equal(h.emails.length,0);
  await submit(h,input(),"walk");
  const walk=(await store.getRegistrations("walk"))[0];h.options.failWrites=true;
  assert.equal((await post({action:"notify",kind:"walk",id:walk.id})).status,503);
  h.options.failWrites=false;
  h.options.failReads=true;
  assert.equal((await submit(h,input(),"walk")).status,503);
  assert.equal((await post({id:record.id,status:"paid"})).status,503);
  assert.equal((await route.GET(new Request("http://localhost:3027/admin/aplec-2026?kind=walk"))).status,503);
});

test("programme replacements and separate other activity use only requested details", () => {
  const h=registrationHarness();const {aplec2026Program:days,aplec2026OtherActivities:other}=h.load("src/lib/aplec-2026-program.ts");
  assert.equal(days[0].activities.find(a=>a.title==="Txaranga · Bufant Fort").time,"24.00 h");
  assert.equal(days[0].activities.find(a=>a.title==="DJ Ivanote").time,"01.00 h");
  const housing=days[1].activities.find(a=>a.time==="11.30 h");assert.equal(housing.title,"Què està funcionant per l’habitatge als pobles");assert.equal(housing.information,"Conversa oberta entre diversos alcaldes per compartir casos d’èxit i iniciatives.");
  assert.equal(days[2].activities[0].registration.url,"/aplecs/2026/caminada");
  assert.deepEqual(other,[{date:"8 d’octubre",time:"19.30 h",title:"Jornada informativa d’habitatge",location:"Sindicat de Lladó"}]);
  assert(readFileSync("src/app/aplecs/2026/page.tsx","utf8").includes("Altres activitats…"));
});


