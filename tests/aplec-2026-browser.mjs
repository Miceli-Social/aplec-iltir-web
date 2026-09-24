// Run against a local production server. All registration requests use real
// route/store code through the in-memory provider harness; no external writes.
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { registrationHarness } from "./registration-harness.mjs";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH ? pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href : "playwright");
const base = process.env.TEST_BASE_URL || "http://localhost:3027";
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  for (const width of [1440, 390]) {
    const h = registrationHarness();
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    await context.route("**/api/aplec-2026/**", async route => {
      const incoming = route.request(), kind = new URL(incoming.url()).pathname.split("/").at(-1);
      const request = new Request(incoming.url(), { method: incoming.method(), headers: { ...incoming.headers(), origin: base }, ...(incoming.method() === "POST" ? { body: incoming.postData() } : {}) });
      const handler = h.load(kind === "ticket" ? "src/app/api/aplec-2026/ticket/route.ts" : "src/app/api/aplec-2026/[kind]/route.ts");
      const response = await handler[incoming.method()](request, { params: Promise.resolve({ kind }) });
      await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
      await h.flush();
    });
    const page = await context.newPage(); const errors=[];page.on("pageerror", error=>errors.push(error.message));
    await page.goto(base); const reject=page.getByRole("button",{name:"Rebutjar-ho tot",exact:true});if(await reject.count())await reject.click();
    assert.equal(await page.locator("a a").count(),0);
    assert.equal(await page.locator("header a[href='/aplecs/2026/voluntariat']").count(),0);
    await page.getByRole("link",{name:"Participa com a voluntari/ària",exact:true}).click();
    await page.getByLabel("Nom",{exact:true}).fill("Núria");await page.getByLabel("Cognoms",{exact:true}).fill("Prova local");
    await page.getByLabel("Correu electrònic",{exact:true}).fill("prova@example.com");await page.getByLabel("Telèfon",{exact:true}).fill("600000000");await page.getByLabel("Edat",{exact:true}).fill("32");
    assert.equal(await page.locator("#consent").isChecked(),false);assert.equal(await page.locator("input[name='dni']").count(),0);
    await page.getByLabel("Disponibilitat aproximada / franges horàries",{exact:true}).fill("De 9 a 13 h");await page.locator("#consent").check();
    await page.getByRole("button",{name:"Envia la disponibilitat",exact:true}).click();await page.locator("#days-error").waitFor();
    assert.equal(await page.locator("#firstName").inputValue(),"Núria");
    await page.getByLabel("Divendres 16 d’octubre",{exact:true}).check();
    await page.screenshot({path:`tmp/volunteer-form-${width}.png`,fullPage:true});
    await page.getByRole("button",{name:"Envia la disponibilitat",exact:true}).click();await page.getByRole("heading",{name:"Hem rebut la teva disponibilitat"}).waitFor();
    assert.equal((await h.load("src/lib/aplec-2026-registration-store.ts").getRegistrations("volunteers")).length,1);
    await page.goto(`${base}/aplecs/2026/dinar`);
    await page.getByLabel("Nom",{exact:true}).fill("Núria");await page.getByLabel("Cognoms",{exact:true}).fill("Prova local");await page.getByLabel("Correu electrònic",{exact:true}).fill("prova@example.com");await page.getByLabel("Telèfon",{exact:true}).fill("600000000");
    await page.getByLabel("Nombre total de persones",{exact:true}).fill("2");await page.getByLabel("Nombre de menús vegetarians",{exact:true}).fill("3");await page.locator("#consent").check();
    await page.getByRole("button",{name:"Reserva el dinar",exact:true}).click();await page.locator("#vegetarian-error").waitFor();await page.getByLabel("Nombre de menús vegetarians",{exact:true}).fill("1");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:`tmp/lunch-form-${width}.png`,fullPage:true});
    await page.getByRole("button",{name:"Reserva el dinar",exact:true}).click();await page.getByRole("heading",{name:"Reserva registrada — pendent de pagament"}).waitFor();
    await page.getByRole("link",{name:"Veure i descarregar el tiquet"}).click();await page.locator(".aplec-2026-ticket").waitFor();
    assert.equal(await page.locator("script[src*='googletagmanager']").count(),0);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const download=page.waitForEvent("download");await page.getByRole("button",{name:"Descarrega el tiquet PDF"}).click();const file=await download;assert(file.suggestedFilename().endsWith(".pdf"));await file.saveAs(`tmp/browser-ticket-${width}.pdf`);
    await page.screenshot({path:`tmp/ticket-${width}.png`,fullPage:true});
    const store=h.load("src/lib/aplec-2026-registration-store.ts");
    const record=(await store.getRegistrations("lunch"))[0];
    const {ticketHeadings,pendingPaymentNotice}=h.load("src/lib/aplec-2026-registration.ts");
    for(const status of ["pending","paid","cancelled"]) {
      await store.updateLunchStatus(record.id,status);await page.reload();
      await page.getByText(ticketHeadings[status],{exact:true}).waitFor();
      const text=await page.locator(".aplec-2026-ticket").innerText();
      assert.equal(text.includes(pendingPaymentNotice),status==="pending");
      for(const other of ["pending","paid","cancelled"].filter(s=>s!==status))assert(!text.includes(ticketHeadings[other]));
    }
    await page.goto(`${base}/aplecs/2026`);assert.equal(await page.locator(".aplec-2026-activity").count(),43);
    await page.getByRole("heading",{name:"Altres activitats…",exact:true}).waitFor();
    assert.equal(await page.locator(".aplec-2026-other-activities").getByText("Jornada informativa d’habitatge",{exact:true}).count(),1);
    assert(!/Correfoc|Interactiu sensorial|Durant tot el dia/.test(await page.locator("main").innerText()));
    const details=page.locator("details").filter({hasText:"els infants de l'escola de Lladó"});await details.locator("summary").focus();await page.keyboard.press("Enter");
    assert.equal(await details.locator("p").evaluate(p=>getComputedStyle(p,"::first-letter").textTransform),"uppercase");assert((await details.locator("p").textContent()).startsWith("els infants"));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
    await page.getByRole("link",{name:"Inscripció prèvia",exact:true}).click();
    assert.equal(await page.locator("#consent").isChecked(),false);
    assert.equal(await page.locator("input[type='number'], textarea").count(),0);
    assert.equal(await page.locator("form input:not([type='checkbox']):not([name='website'])").count(),4);
    await page.getByLabel("Nom",{exact:true}).fill("Núria");await page.getByLabel("Cognoms",{exact:true}).fill("Prova caminada");
    await page.getByLabel("Correu electrònic",{exact:true}).fill("prova@example.com");await page.getByLabel("Telèfon",{exact:true}).fill("600000000");
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.screenshot({path:`tmp/walk-form-${width}.png`,fullPage:true});
    await page.locator("#consent").check();await page.getByRole("button",{name:"Envia la inscripció",exact:true}).click();
    await page.getByRole("heading",{name:"Hem rebut correctament la teva inscripció",exact:true}).waitFor();
    assert.equal((await store.getRegistrations("walk")).length,1);assert.deepEqual(errors,[]);
    console.log(JSON.stringify({width,volunteer:true,lunch:true,walk:true,ticketStates:3,pdfDownload:true,keyboard:true,activities:43,otherActivity:true,overflow:false,errors}));
    await context.close();
  }
} finally { await browser.close(); }

