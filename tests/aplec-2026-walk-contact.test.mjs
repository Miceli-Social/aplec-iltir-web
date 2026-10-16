import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { registrationHarness } from "./registration-harness.mjs";

const input = (contact = {}) => ({ requestId: randomUUID(), firstName: "Núria", lastName: "Prova", consent: true, ...contact });
async function submit(h, body) {
  return h.load("src/app/api/aplec-2026/[kind]/route.ts").POST(new Request("http://localhost:3027/api/aplec-2026/walk", {
    method: "POST", headers: { "Content-Type": "application/json", origin: "http://localhost:3027" }, body: JSON.stringify(body),
  }), { params: Promise.resolve({ kind: "walk" }) });
}

test("walk accepts email only, phone only, or both and stores normalized contacts", async () => {
  for (const contact of [
    { email: " PROVA@EXAMPLE.COM " },
    { email: "prova@example.com", phone: "   " },
    { phone: "+34 600 000 000" },
    { email: "   ", phone: "+34 600 000 000" },
    { email: " PROVA@EXAMPLE.COM ", phone: "+34 600 000 000" },
  ]) {
    const h = registrationHarness();
    assert.equal((await submit(h, input(contact))).status, 200);
    const records = await h.load("src/lib/aplec-2026-registration-store.ts").getRegistrations("walk");
    assert.equal(records.length, 1);
    assert.equal(records[0].email, contact.email?.trim() ? "prova@example.com" : "");
    assert.equal(records[0].phone, contact.phone?.trim() ? "+34600000000" : undefined);
  }
});

test("walk rejects missing contacts and invalid supplied email or phone before storing", async () => {
  for (const [contact, field] of [
    [{}, "email"],
    [{ email: "", phone: "" }, "email"],
    [{ email: "   ", phone: "   " }, "email"],
    [{ email: "invalid" }, "email"],
    [{ email: "invalid", phone: "600000000" }, "email"],
    [{ phone: "abc" }, "phone"],
    [{ email: "prova@example.com", phone: "abc" }, "phone"],
    [{ email: "prova@example.com", phone: "()- ." }, "phone"],
    [{ phone: "123456" }, "phone"],
    [{ phone: "1234567890123456" }, "phone"],
  ]) {
    const h = registrationHarness();
    const response = await submit(h, input(contact));
    assert.equal(response.status, 400);
    assert((await response.json()).errors[field]);
    assert.equal(h.blobs.size, 0);
  }
});

test("other kinds still require both contact fields", () => {
  const { validateRegistration } = registrationHarness().load("src/lib/aplec-2026-registration.ts");
  for (const kind of ["volunteers", "lunch", "football"]) {
    assert(validateRegistration(kind, input({ phone: "600000000" })).errors.email);
    assert(validateRegistration(kind, input({ email: "prova@example.com" })).errors.phone);
  }
});

test("only walk renders optional contacts with accessible guidance", () => {
  const { RegistrationForm } = registrationHarness().load("src/components/aplec-2026-registration-form.tsx");
  for (const kind of ["walk", "volunteers", "lunch", "football"]) {
    const html = renderToStaticMarkup(createElement(RegistrationForm, { kind }));
    for (const name of ["email", "phone"]) {
      const tag = html.match(new RegExp(`<input\\b[^>]*name="${name}"[^>]*>`))?.[0];
      assert(tag);
      assert.equal(tag.includes('required=""'), kind !== "walk");
      if (kind === "walk") assert(tag.includes('aria-describedby="walk-contact-help"'));
    }
    if (kind === "walk") {
      assert(html.includes("Cal indicar almenys un correu electrònic o un telèfon de contacte."));
      for (const name of ["firstName", "lastName", "consent"]) {
        assert(html.match(new RegExp(`<input\\b[^>]*name="${name}"[^>]*>`))?.[0].includes('required=""'));
      }
    }
  }
});

test("phone-only walk notifies organization without sending to an empty email address", async () => {
  const h = registrationHarness();
  Object.assign(h.env, { RESEND_API_KEY: "test", REGISTRATION_FROM_EMAIL: "sender@example.com" });
  assert.equal((await submit(h, input({ phone: "600000000" }))).status, 200);
  await h.flush();
  assert.equal(h.emails.length, 1);
  assert.deepEqual(h.emails[0].to, ["lluis.arambilet@gmail.com"]);
  assert(h.emails[0].text.includes("600000000"));
  const [record] = await h.load("src/lib/aplec-2026-registration-store.ts").getRegistrations("walk");
  await h.load("src/lib/aplec-2026-registration-mail.ts").notifyRegistration(record);
  assert.equal(h.emails.length, 1);
});
