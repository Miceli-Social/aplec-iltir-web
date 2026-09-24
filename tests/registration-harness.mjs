// In-memory provider boundary for local tests. Never contacts Blob or Resend.
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
const dependency = createRequire(import.meta.url);

export function registrationHarness() {
  const blobs = new Map(), modules = new Map(), jobs = [], emails = [], pdfTexts = [];
  const options = { now: Date.parse("2026-09-24T10:00:00Z"), admin: false, failWrites: false, failReads: false, mailStatus: 200 };
  const env = { REGISTRATION_BLOB_READ_WRITE_TOKEN: "fake-private-test-token", NEXT_PUBLIC_SITE_URL: "http://localhost:3027" };
  class Conflict extends Error {}
  class Clock extends Date { static now() { return options.now; } }
  const blob = {
    BlobPreconditionFailedError: Conflict,
    get: async (path, config) => {
      if (options.failReads) throw new Error("Storage unavailable");
      if (config.access !== "private" || config.useCache !== false || config.token !== env.REGISTRATION_BLOB_READ_WRITE_TOKEN) throw new Error("Unsafe Blob read");
      const found = blobs.get(path);
      return found ? { statusCode: 200, stream: new Response(found.text).body, blob: { etag: found.etag } } : null;
    },
    put: async (path, text, config) => {
      if (config.access !== "private" || config.token !== env.REGISTRATION_BLOB_READ_WRITE_TOKEN) throw new Error("Unsafe Blob write");
      if (options.failWrites) throw new Error("Storage unavailable");
      const current = blobs.get(path);
      if (current && (!config.allowOverwrite || config.ifMatch !== current.etag)) throw new Conflict();
      if (!current && config.ifMatch) throw new Conflict();
      blobs.set(path, { text, etag: String(Number(current?.etag || 0) + 1) });
      return {};
    },
  };
  function load(file) {
    const absolute = resolve(existsSync(file) ? file : file.replace(/\.ts$/, ".tsx"));
    if (modules.has(absolute)) return modules.get(absolute).exports;
    const loaded = { exports: {} }; modules.set(absolute, loaded);
    const source = ts.transpileModule(readFileSync(absolute, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const imports = name => {
      if (name === "server-only") return {};
      if (name === "@vercel/blob") return blob;
      if (name === "pdf-lib") {
        const original = dependency(name);
        return { ...original, PDFDocument: { create: async () => {
          const pdf = await original.PDFDocument.create();
          const addPage = pdf.addPage.bind(pdf);
          pdf.addPage = (...args) => {
            const page = addPage(...args), drawText = page.drawText.bind(page);
            page.drawText = (text, config) => { pdfTexts.push(text); return drawText(text, config); };
            return page;
          };
          return pdf;
        } } };
      }
      if (name === "next/server") return { after: job => jobs.push(job) };
      if (name === "next/cache") return { revalidatePath: () => {} };
      if (name === "next/headers") return { cookies: async () => ({ get: () => ({ value: options.admin ? "valid" : "invalid" }) }) };
      if (name.endsWith("admin-auth")) return { ADMIN_COOKIE: "iltir_admin", isValidAdminToken: value => value === "valid" };
      if (name.startsWith("@/")) return load(`src/${name.slice(2)}.ts`);
      if (name.startsWith(".")) return load(resolve(dirname(absolute), `${name}.ts`));
      return dependency(name);
    };
    vm.runInThisContext(`(function(require,module,exports,mocks){const {process,Date,setTimeout,fetch}=mocks;${source}\n})`, { filename: absolute })(imports, loaded, loaded.exports, {
      process: { env, cwd: () => process.cwd() }, Date: Clock,
      setTimeout: callback => setTimeout(callback, 0),
      fetch: async (url, init) => {
        if (url !== "https://api.resend.com/emails") throw new Error("Unexpected external request");
        emails.push({ ...JSON.parse(init.body), key: init.headers["Idempotency-Key"] });
        return new Response("{}", { status: options.mailStatus });
      },
    });
    return loaded.exports;
  }
  return { load, blobs, env, options, emails, pdfTexts, flush: async () => { while (jobs.length) await jobs.shift()(); } };
}
