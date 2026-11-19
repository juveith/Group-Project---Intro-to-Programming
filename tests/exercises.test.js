// Tests for app/exercises.js · run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const X = require("../app/exercises.js");
const P = require("../app/plan.js");

const visible = X.LIBRARY.filter(e => !e.hidden);

/* ---------- library ---------- */
test("the library has well over 100 exercises with unique ids", () => {
  assert.ok(visible.length >= 120, `only ${visible.length}`);
  assert.equal(new Set(X.LIBRARY.map(e => e.id)).size, X.LIBRARY.length);
  assert.equal(new Set(visible.map(e => e.n.toLowerCase())).size, visible.length); // no duplicate names
});

test("every exercise has a known body part, equipment, log type and pattern", () => {
  for (const e of X.LIBRARY) {
    assert.ok(X.PARTS.includes(e.part), e.id);
    assert.ok(X.EQUIP.includes(e.eq), e.id);
    assert.ok(X.TYPES[e.type], e.id);
    assert.ok(X.PATTERNS[e.pat], e.id);
    assert.ok(e.s > 0 && e.r[0] > 0 && e.r[0] <= e.r[1] && e.rest > 0, e.id);
  }
  for (const part of X.PARTS) assert.ok(visible.some(e => e.part === part), part);
});

test("ids from before v2.8 still exist, so older sessions keep their names", () => {
  for (const id of ["squat", "rdl", "bulgarian", "hip", "legcurl", "calf", "add", "kick", "legpress", "gobletsq", "smithsq", "seatcurl", "split", "revlunge",
    "cableadd", "smithhip", "glutebridge", "dbhip", "dbrdl", "hyper", "kickm", "abd", "lat", "latclose", "latone", "incl", "inclm", "flatdb",
    "lra", "lracable", "lram", "bic", "hammer", "cablecurl", "tri", "pushdown", "ohtri"]) assert.ok(X.BY_ID[id], id);
});

test("time is logged in seconds, cardio in minutes", () => {
  assert.equal(X.unitOf(X.BY_ID.plank), "s");
  assert.equal(X.unitOf(X.BY_ID.rowing), "min");
  assert.equal(X.unitOf(X.BY_ID.pushup), "reps");
  assert.equal(X.unitOf(X.BY_ID.bench), "kg");
  assert.equal(X.BY_ID.apullup.type, "a");
});

/* ---------- search ---------- */
test("search finds exercises by words in any order, ignoring case and brackets", () => {
  const names = r => r.map(e => e.n);
  assert.ok(names(X.search("bench press")).includes("Bench Press (Barbell)"));
  assert.ok(names(X.search("DUMBBELL bench")).includes("Bench Press (Dumbbell)"));
  assert.ok(names(X.search("pull up")).includes("Pull-up"));
  assert.deepEqual(X.search("zzz"), []);
  assert.equal(X.search("").length, visible.length);             // empty search lists everything
  assert.ok(!X.search("").some(e => e.hidden));                    // legacy entries stay hidden
});

test("search filters by body part and equipment", () => {
  const legs = X.search("", { part: "Legs" });
  assert.ok(legs.length > 20 && legs.every(e => e.part === "Legs"));
  const cable = X.search("", { part: "Back", eq: "Cable" });
  assert.ok(cable.length > 0 && cable.every(e => e.part === "Back" && e.eq === "Cable"));
  assert.ok(X.search("row", { eq: "Dumbbell" }).every(e => e.eq === "Dumbbell"));
});

test("custom exercises show up in the search", () => {
  const c = X.makeCustom({ n: "Cossack Squat", eq: "Bodyweight", part: "Legs", type: "r" }, "c1");
  assert.equal(X.search("cossack", { custom: [c] })[0].id, "c1");
  assert.equal(X.search("cossack").length, 0);
});

test("alternatives share the movement pattern and never include the exercise itself", () => {
  const alts = X.alternatives("squat");
  assert.ok(alts.length >= 4);
  assert.ok(alts.every(e => e.pat === "squat" && e.id !== "squat"));
  assert.ok(alts.map(e => e.id).includes("legpress"));
  assert.deepEqual(X.alternatives("nope"), []);
});

/* ---------- custom exercises ---------- */
const ok = { name: "Cossack Squat", part: "Legs", eq: "Bodyweight", type: "r" };

test("a valid custom exercise is accepted and named like the library", () => {
  const r = X.validateCustom(ok, []);
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, { n: "Cossack Squat", eq: "Bodyweight", part: "Legs", type: "r" });
  assert.equal(X.validateCustom(Object.assign({}, ok, { eq: "Kettlebell", type: "w" })).value.n, "Cossack Squat (Kettlebell)");
  assert.equal(X.validateCustom(Object.assign({}, ok, { name: "  Cossack   Squat " })).value.n, "Cossack Squat"); // spaces tidied
});

test("custom exercises reject empty, short, long and markup names", () => {
  const e = name => X.validateCustom(Object.assign({}, ok, { name })).errors.name;
  assert.ok(e(""));
  assert.ok(e("Sq"));
  assert.ok(e("x".repeat(41)));
  assert.ok(e("<b>Squat</b>"));
  assert.equal(e("x".repeat(40)), undefined);
});

test("custom exercises need a body part, equipment and log type from the lists", () => {
  const r = X.validateCustom({ name: "Cossack Squat" });
  assert.equal(r.ok, false);
  assert.ok(r.errors.part && r.errors.eq && r.errors.type);
  assert.ok(X.validateCustom(Object.assign({}, ok, { part: "Toes" })).errors.part);
  assert.ok(X.validateCustom(Object.assign({}, ok, { eq: "Spoon" })).errors.eq);
  assert.ok(X.validateCustom(Object.assign({}, ok, { type: "x" })).errors.type);
});

test("custom exercises can't duplicate the library or each other", () => {
  assert.ok(X.validateCustom({ name: "Bench Press", part: "Chest", eq: "Barbell", type: "w" }).errors.name);
  assert.ok(X.validateCustom({ name: "push-up", part: "Chest", eq: "Bodyweight", type: "r" }).errors.name);
  const mine = [X.makeCustom(X.validateCustom(ok).value, "c1")];
  assert.ok(X.validateCustom(ok, mine).errors.name);
  assert.equal(X.validateCustom(Object.assign({}, ok, { eq: "Dumbbell" }), mine).ok, true);  // other equipment is a new exercise
});

test("makeCustom gives sensible defaults for each log type", () => {
  const timed = X.makeCustom({ n: "Plank Walk", eq: "Bodyweight", part: "Core", type: "t" }, "c2");
  assert.deepEqual(timed.r, [30, 45]);
  assert.equal(timed.custom, true);
  const cardio = X.makeCustom({ n: "Ski Erg", eq: "Machine", part: "Cardio", type: "t" }, "c3");
  assert.equal(X.unitOf(cardio), "min");
  assert.ok(X.makeCustom({ n: "Cable Fly Low", eq: "Cable", part: "Chest", type: "w" }, "c4").m.chest > 0);
});

/* ---------- templates ---------- */
test("every template uses library exercises and has at least one main exercise", () => {
  for (const k of X.TEMPLATE_ORDER) {
    const ex = X.templateExercises(k);
    if (k === "empty") { assert.equal(ex.length, 0); continue; }
    assert.ok(ex.filter(e => !e.opt).length >= 5, k);
    assert.equal(new Set(ex.map(e => e.id)).size, ex.length, k); // no exercise twice
    for (const e of ex) assert.ok(X.BY_ID[e.id] && e.s > 0 && e.r[0] <= e.r[1], `${k}: ${e.id}`);
  }
});

test("every workout a split uses has a template", () => {
  for (const n of Object.keys(P.SPLITS)) for (const sp of P.SPLITS[n]) for (const w of sp.workouts) assert.ok(X.TEMPLATES[w], `${sp.id}: ${w}`);
  for (const k of Object.keys(P.WORKOUTS)) assert.equal(X.TEMPLATES[k].group, P.WORKOUTS[k].group, k);
});

test("focusOf names the main muscles", () => {
  assert.equal(X.focusOf(X.BY_ID.hip), "Glutes");
  assert.ok(X.focusOf(X.BY_ID.bench).startsWith("Chest"));
  assert.equal(X.focusOf(null), "");
});

test("every drawing frame exists, has a caption and a credited source", () => {
  const fs = require("node:fs"), path = require("node:path");
  const ids = Object.keys(X.DRAWINGS), dir = path.join(__dirname, "..", "app", "img", "ex");
  assert.ok(ids.length >= 120);
  const sources = fs.readFileSync(path.join(dir, "SOURCES.md"), "utf8");
  for (const id of ids) {
    const e = X.BY_ID[id];
    assert.ok(e && !e.hidden, id);
    assert.ok(e.img.length >= 1 && e.img.length <= 3 && e.img.every(c => c.trim()), id);
    assert.ok(["ek", "wg"].includes(e.imgSrc), id);
    assert.ok(sources.includes(`| ${id} – `), `${id} missing in SOURCES.md`);
    e.img.forEach((c, i) => assert.ok(fs.existsSync(path.join(dir, `${id}-${i + 1}.svg`)), `${id}-${i + 1}.svg`));
    assert.ok(!fs.existsSync(path.join(dir, `${id}-${e.img.length + 1}.svg`)), `${id}: extra frame`);
  }
  assert.ok(fs.existsSync(path.join(__dirname, "..", "app", "img", "ex", "SOURCES.md"))); // licence credit
});

test("every exercise in the library has a drawing, retired ones stay hidden", () => {
  for (const e of visible) assert.ok(e.img, `${e.id} has no drawing`);
  for (const id of X.RETIRED) assert.ok(X.BY_ID[id] && X.BY_ID[id].hidden && !X.search("").some(e => e.id === id), id);
  assert.ok(!X.alternatives("squat").some(e => e.hidden));
  // a retired name can be created as your own exercise
  assert.equal(X.validateCustom({ name: "Turkish Get-up", part: "Full body", eq: "Kettlebell", type: "w" }).ok, true);
});

test("every workout template only uses exercises with a drawing", () => {
  for (const k of X.TEMPLATE_ORDER) for (const e of X.templateExercises(k)) assert.ok(e.img && !e.hidden, `${k}: ${e.id}`);
});

/* ---------- text from storage, backups and the cloud sync ---------- */
test("safeText removes markup and quotes, keeps apostrophes", () => {
  assert.equal(X.safeText('<img src=x onerror=alert(1)>Row', 60), "img src=x onerror=alert(1)Row");
  assert.equal(X.safeText('Farmer\'s  "walk"', 60), "Farmer's walk");
  assert.equal(X.safeText("   ", 40, "Own workout"), "Own workout");
  assert.equal(X.safeText("x".repeat(100), 40).length, 40);
});

test("safeCustom keeps only well-formed custom exercises from a backup file", () => {
  const list = X.safeCustom([
    { id: "c1", n: "<b>Sled</b> push", type: "w", eq: "Other", part: "Legs" },
    { id: "c1", n: "Duplicate", type: "w" },
    { id: "bad id!", n: "Nope", type: "w" },
    { id: "c2", n: "No type" },
    { id: X.LIBRARY[0].id, n: "Takes over a library id", type: "w" },
    null, "text"
  ]);
  assert.deepEqual(list.map(c => [c.id, c.n]), [["c1", "bSled/b push"]]);
  assert.deepEqual(X.safeCustom("not a list"), []);
});

test("the custom exercise form refuses quotes and markup", () => {
  ["Sled <push>", 'Sled "push"', "Sled {push}", "Sled `push`"].forEach(name => {
    const r = X.validateCustom({ name, eq: "Other", part: "Legs", type: "w" }, []);
    assert.equal(r.ok, false, name);
  });
  assert.equal(X.validateCustom({ name: "Farmer's carry", eq: "Other", part: "Legs", type: "w" }, []).ok, true);
});
