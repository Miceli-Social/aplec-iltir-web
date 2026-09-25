import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

// Load the pure TypeScript modules without Next.js or external services.
function load(name) {
  const source = readFileSync(new URL(`../src/lib/${name}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loaded = { exports: {} };
  new Function("require", "module", "exports", outputText)(
    (path) => load(path.replace("./", "")), loaded, loaded.exports,
  );
  return loaded.exports;
}
const { getUpcomingAplecActivities: upcoming } = load("aplec-2026-upcoming");
const { aplec2026Program: program } = load("aplec-2026-program");

test("includes the October 8 activity first with its place and municipality", () => {
  const { slots } = upcoming(new Date("2026-09-25T10:00:00Z"));
  assert.equal(slots.length, 3);
  assert.equal(slots[0].startsAt, "2026-10-08T19:30:00");
  assert.equal(slots[0].activities[0].title, "Jornada informativa d’habitatge");
  assert.equal(slots[0].activities[0].municipality, "Lladó");
  assert.equal(slots[0].activities[0].location, "Sindicat de Lladó");
});

test("uses Madrid time and removes a slot after its start", () => {
  assert.equal(upcoming(new Date("2026-10-08T17:30:00Z")).slots[0].date, "2026-10-08");
  assert.equal(upcoming(new Date("2026-10-08T17:30:01Z")).slots[0].date, "2026-10-16");
});

test("simultaneous activities take one slot", () => {
  const { slots } = upcoming(new Date("2026-10-16T17:59:00Z"));
  assert.equal(slots[0].startsAt, "2026-10-16T20:00:00");
  assert.equal(slots[0].activities.length, 2);
  assert.equal(slots[1].startsAt, "2026-10-16T21:00:00");
  assert.equal(slots[2].activities.length, 2);
});

test("Friday midnight is Saturday and DJ is a continuation without an invented hour", () => {
  const { slots } = upcoming(new Date("2026-10-16T21:59:00Z"));
  assert.equal(slots[0].startsAt, "2026-10-17T00:00:00");
  assert.deepEqual(slots[0].activities.map(({ title, time }) => [title, time]), [
    ["Txaranga Bufant Fort", "00.00 h"], ["DJ Ivanote", "Tot seguit"],
  ]);
  assert.equal(slots[0].activities[1].municipality, "Lladó");
  assert.equal(upcoming(new Date("2026-10-16T22:00:01Z")).slots[0].startsAt, "2026-10-17T09:30:00");
});

test("returns fewer slots near closing and no past activities after the event", () => {
  const nearEnd = upcoming(new Date("2026-10-18T14:59:00Z"));
  assert.equal(nearEnd.slots.length, 2);
  assert.equal(nearEnd.slots[0].activities.length, 2);
  assert.equal(upcoming(new Date("2026-10-18T17:00:01Z")).slots.length, 0);
  assert.equal(upcoming(new Date("2026-10-18T17:00:01Z")).finished, false);
  const ended = upcoming(new Date("2026-10-18T22:00:00Z"));
  assert.deepEqual(ended, { slots: [], finished: true });
});

test("preserves official times, both poetry descriptions and jazz without extra information", () => {
  const activities = program.flatMap((day) => day.activities);
  for (const [name, time] of [["Mini-Stress", "12.30 h"], ["Wave Ensemble", "17.00–18.00 h"], ["Jordi Tonietti", "17.15 h"], ["LaDinamo", "19.00–20.00 h"], ["Essències.cat", "17.00 h"]]) {
    assert.equal(activities.find((activity) => activity.title.includes(name)).time, time);
  }
  const poetry = activities.filter((activity) => activity.title.includes("Poesia Cinètica"));
  assert.equal(poetry.length, 2);
  assert.ok(poetry[0].moreInfo);
  assert.equal(poetry[0].moreInfo, poetry[1].moreInfo);
  assert.equal(activities.find((activity) => activity.title.includes("Concert de Jazz")).moreInfo, undefined);
});
