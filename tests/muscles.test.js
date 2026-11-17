// Tests for app/muscles.js · run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../app/muscles.js");

const sets = n => Array.from({ length: n }, () => ({ r: 10, kg: 20 }));
const gym = obj => ({ type: "gym", sets: Object.fromEntries(Object.entries(obj).map(([id, n]) => [id, sets(n)])) });
const head = (H, when = "week") => M.headline(M.load(H), when);

test("no sessions: no muscle slide", () => {
  assert.equal(head([]), null);
  assert.equal(M.headline(null, "week"), null);
});

test("the muscle with the most volume is in the headline", () => {
  assert.equal(head([gym({ hip: 6 })]).title, "Glutes on fire 🔥");
  assert.equal(head([gym({ lat: 6 })]).title, "Back on fire 🔥");
  assert.equal(head([gym({ lra: 6 })]).title, "Shoulders on fire 🔥");
  assert.equal(head([gym({ legcurl: 6 })]).title, "Hamstrings on fire 🔥");
  assert.equal(head([gym({ bic: 6, lat: 1 })]).title, "Biceps on fire 🔥");
});

test("text names the same muscle, its share and the period", () => {
  const h = head([gym({ incl: 6 })]);
  assert.equal(h.top, "chest");
  assert.match(h.text, /^\d+ % of your training this week went to your chest 💪$/);
  assert.match(head([gym({ hip: 4 })], "October").text, /in October went to your glutes 🍑$/);
});

test("two muscles that are almost even share the headline", () => {
  const h = head([gym({ lat: 5, incl: 5 })]);
  assert.match(h.title, /^(Back & chest|Chest & back) on fire 🔥$/);
  assert.match(h.text, /went to your (back and chest|chest and back)/);
});

test("a clear winner stands alone", () => {
  assert.equal(head([gym({ lat: 10, incl: 2 })]).title, "Back on fire 🔥");
});

test("runs and yoga count too", () => {
  assert.equal(head([{ type: "lauf", run: { km: 10, min: 60 } }]).title, "Quads & calves on fire 🔥");
  assert.equal(head([{ type: "yoga", yoga: { min: 45 } }]).title, "Core on fire 🔥");
});

test("sets without reps don't count", () => {
  const e = { sets: { hip: [{ r: "", kg: 60 }, { r: 0, kg: 60 }], lat: sets(3) } };
  assert.equal(head([e]).top, "back");
});

test("hint only for the half of the body that was left out", () => {
  assert.match(head([gym({ lat: 6, incl: 6 })]).hint, /legs got a bit less attention this week/);
  assert.match(head([gym({ squat: 6, hip: 6 })], "May").hint, /upper body got a bit less attention this month/);
  assert.equal(head([gym({ squat: 4, hip: 4, lat: 3, incl: 3 })]).hint, "");
  // runners without any strength sets are not told to train their upper body
  assert.equal(head([{ run: { km: 8 } }]).hint, "");
});

test("glutes are no longer special: no glute nudge when other muscles lead", () => {
  const h = head([gym({ legpress: 6, legcurl: 2, lat: 3 })]);
  assert.equal(h.title, "Quads on fire 🔥");
  assert.doesNotMatch(h.title + h.text + h.hint, /glute/i);
});
