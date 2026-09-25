import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const dependency = createRequire(import.meta.url);
const { outputText } = ts.transpileModule(
  readFileSync(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } },
);

async function renderedDate(now, date) {
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
  }
  const loaded = { exports: {} };
  const imports = (name) => {
    if (name === "react/jsx-runtime") return dependency(name);
    if (name === "@/lib/remote-content") return { getCircles: async () => [] };
    if (name === "@/lib/aplec-2026-upcoming") return {
      getUpcomingAplecActivities: () => ({
        finished: false,
        slots: [{ startsAt: `${date}T19:30:00`, date, activities: [] }],
      }),
    };
    return {};
  };
  new Function("require", "module", "exports", "Date", outputText)(imports, loaded, loaded.exports, Clock);
  const tree = await loaded.exports.default();
  function findTime(node) {
    if (!node || typeof node !== "object") return undefined;
    if (Array.isArray(node)) return node.map(findTime).find(Boolean);
    if (node.type === "time") return node.props;
    return findTime(node.props?.children);
  }
  return findTime(tree);
}

for (const [description, now, date, label] of [
  ["Avui after Madrid midnight while UTC is still yesterday", "2026-10-15T22:30:00Z", "2026-10-16", "Avui"],
  ["Demà from the Madrid calendar date", "2026-10-15T22:30:00Z", "2026-10-17", "Demà"],
  ["normal future date keeps the existing Catalan format", "2026-10-08T10:00:00Z", "2026-10-16", "16 d’octubre del 2026"],
  ["Demà across the spring clock change", "2026-03-28T23:30:00Z", "2026-03-30", "Demà"],
  ["Demà across the autumn clock change", "2026-10-24T22:30:00Z", "2026-10-26", "Demà"],
  ["Demà across the year boundary", "2026-12-31T12:00:00Z", "2027-01-01", "Demà"],
]) {
  test(description, async () => {
    const time = await renderedDate(now, date);
    assert.equal(time.children, label);
    assert.equal(time.dateTime, date);
  });
}
