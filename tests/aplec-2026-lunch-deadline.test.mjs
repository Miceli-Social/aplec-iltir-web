import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { registrationHarness } from "./registration-harness.mjs";

const deadline = Date.parse("2026-10-16T15:30:00+02:00");
const body = () => ({ requestId: randomUUID(), firstName: "Núria", lastName: "Prova", email: "prova@example.com", phone: "+34600000000", consent: true, website: "", people: "2", vegetarian: "1" });
function submit(h, value) {
  return h.load("src/app/api/aplec-2026/[kind]/route.ts").POST(new Request("http://localhost:3027/api/aplec-2026/lunch", {
    method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost:3027" }, body: JSON.stringify(value),
  }), { params: Promise.resolve({ kind: "lunch" }) });
}

test("Madrid Friday 16 at 15:30 is the exact inclusive online cutoff", async () => {
  const h = registrationHarness();
  const constants = h.load("src/lib/aplec-2026-registration.ts");
  const store = h.load("src/lib/aplec-2026-registration-store.ts");
  assert.equal(Date.parse(constants.LUNCH_DEADLINE), deadline);
  assert.equal(constants.LUNCH_CAPACITY, 120);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", dateStyle: "short", timeStyle: "short" }).format(new Date(deadline));
  assert.equal(parts, "16/10/2026, 15:30");
  for (const [now, closed] of [[deadline - 1, false], [deadline, true], [deadline + 1, true]]) {
    h.options.now = now;
    assert.equal(constants.isLunchClosed(), closed);
    assert.equal((await store.getLunchAvailability()).closed, closed);
  }
});

test("server rejects new reservations at and after cutoff, including a previously opened form", async () => {
  const h = registrationHarness();
  const store = h.load("src/lib/aplec-2026-registration-store.ts");
  const { LUNCH_CLOSED_MESSAGE } = h.load("src/lib/aplec-2026-registration.ts");
  h.options.now = deadline - 1;
  const staleForm = body();
  const accepted = body();
  assert.equal((await store.getLunchAvailability()).closed, false);
  assert.equal((await submit(h, accepted)).status, 200);
  for (const now of [deadline, deadline + 60000]) {
    h.options.now = now;
    const response = await submit(h, staleForm);
    assert.equal(response.status, 409);
    const result = await response.json();
    assert.equal(result.message, LUNCH_CLOSED_MESSAGE);
    assert.match(result.message, /punt d’informació de l’Aplec/);
    assert.match(result.message, /durant divendres i fins dissabte al migdia/);
    assert.equal((await store.getRegistrations("lunch")).length, 1);
  }
  // Preserve idempotent replay and physical sales/admin behaviour after closing.
  assert.equal((await submit(h, accepted)).status, 200);
  await store.updatePhysicalPlaces(3);
  assert.equal((await store.getLunchAvailability()).remaining, 115);
});

test("public lunch page and programme describe Friday cutoff and the information point", () => {
  const h = registrationHarness();
  const page = h.load("src/app/aplecs/2026/dinar/page.tsx").default;
  const html = renderToStaticMarkup(createElement(page));
  for (const phrase of ["divendres 16 d’octubre de 2026", "15.30 h", "Europe/Madrid", "punt d’informació", "dissabte al migdia", "120 persones"]) assert.ok(html.includes(phrase), phrase);
  assert.ok(!html.includes("fins al dissabte 17"));
  const program = h.load("src/lib/aplec-2026-program.ts").aplec2026Program;
  const lunch = program.flatMap(day => day.activities).find(activity => activity.registration?.url === "/aplecs/2026/dinar");
  assert.match(lunch.registration.information, /divendres 16.*15\.30 h/);
  assert.match(lunch.registration.information, /punt d’informació/);
});
