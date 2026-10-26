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

async function homeTree() {
  const loaded = { exports: {} };
  const imports = (name) => {
    if (name === "react/jsx-runtime") return dependency(name);
    if (name === "@/lib/remote-content") return { getCircles: async () => [] };
    if (name === "@/lib/content-store") return { getAplecReturns: async () => ({}) };
    if (name === "@/lib/aplec-2026-upcoming") throw new Error("Home must not depend on the past activity schedule");
    return {};
  };
  new Function("require", "module", "exports", outputText)(imports, loaded, loaded.exports);
  return loaded.exports.default();
}
function flatten(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return [node, ...flatten(node.props?.children)];
}
test('Home keeps historical programme and general agenda without expired event calls', async () => {
  const nodes = flatten(await homeTree());
  const links = nodes.filter(node => node.props?.href).map(node => node.props.href);
  assert.ok(links.includes('/aplecs/2026'));
  assert.ok(links.includes('/agenda'));
  assert.ok(links.includes('/governanca'));
  assert.ok(!links.some(href => /voluntariat|dinar|futbol|caminada|activitats/.test(href)));
  const html = JSON.stringify(nodes);
  assert.ok(html.includes('Consulta el Programa 2026'));
  assert.ok(html.includes('Edició celebrada'));
  assert.ok(!html.includes('Properes activitats'));
  assert.ok(!html.includes('Gràcies per ser-hi'));
  assert.ok(nodes.some(node => node.props?.id === 'home-albums-title'));
});
