// Tests for app/yoga.js · run with: node --test
const test = require("node:test");
const assert = require("node:assert/strict");
const Y = require("../app/yoga.js");

const at = (y, m, d, h) => new Date(y, m - 1, d, h, 0).getTime();

test("every session has an id, a name, lengths and valid steps", () => {
  const ids = new Set();
  for (const s of Y.SESSIONS) {
    assert.ok(s.id && !ids.has(s.id), s.id); ids.add(s.id);
    assert.ok(s.n && s.desc && s.where);
    assert.ok([1, 2, 3].includes(s.level));
    assert.ok(s.lens.length >= 1 && s.lens.every(n => n > 0));
    if (s.id === "vinyasa") { assert.equal(s.steps, null); continue; }
    for (const x of s.steps) {
      assert.ok(x.n && x.i && x.pose, `${s.id}: ${x.n}`);
      assert.ok(x.d >= Y.MIN_STEP, `${s.id}: ${x.n} too short`);
    }
  }
});

test("each session's steps add up to about its default length", () => {
  for (const s of Y.SESSIONS) {
    if (!s.steps) continue;
    const m = Y.minutes(Y.stepsFor(s.id, s.lens[0]));
    assert.ok(Math.abs(m - s.lens[0]) <= 1, `${s.id}: ${m} min instead of ${s.lens[0]}`);
  }
});

test("the study break takes 5 minutes and needs no mat", () => {
  const s = Y.byId("study");
  assert.equal(s.where, "Chair");
  assert.equal(Y.minutes(Y.stepsFor("study", 5)), 5);
  assert.ok(!s.steps.some(x => ["dog", "plank", "cobra", "sava"].includes(x.pose)));
});

test("stepsFor scales holds to the chosen length, never below 15 s", () => {
  const long = Y.stepsFor("winddown", 20), short = Y.stepsFor("winddown", 10);
  assert.ok(Math.abs(Y.minutes(long) - 20) <= 1);
  assert.ok(Math.abs(Y.minutes(short) - 10) <= 1);
  assert.ok(short.every(x => x.d >= 15 && x.d % 5 === 0));
  assert.ok(long[0].d > short[0].d);
});

test("stepsFor changes the number of Sun Salutation rounds with the length", () => {
  const rounds = st => new Set(st.filter(x => x.fix && /round \d+ of/.test(x.s)).map(x => x.s.match(/of (\d+)/)[1]));
  assert.deepEqual([...rounds(Y.stepsFor("morning", 10))], ["2"]);
  assert.deepEqual([...rounds(Y.stepsFor("morning", 15))], ["3"]);
});

test("expandSun: one step per breath, in order, with inhale/exhale", () => {
  const st = Y.expandSun([{ n: "Arrive", i: "x", d: 60, pose: "seat" }, { n: "Sun Salutation A, 2 rounds", i: "y", d: 120, pose: "up" }, { n: "Child", i: "z", d: 30, pose: "child" }]);
  assert.equal(st[0].n, "Arrive"); assert.equal(st[st.length - 1].n, "Child");
  const sun = st.slice(1, -1);
  assert.equal(sun.length, 2 * (Y.SUN.A.length + 1));
  assert.deepEqual(sun.slice(0, 4).map(x => x.pose), ["up", "fold", "half", "plank"]);
  assert.match(sun[0].s, /round 1 of 2 · Inhale/);
  assert.match(sun[1].s, /Exhale/);
  assert.ok(sun.every(x => x.fix && x.d >= 5));
  assert.match(sun[sun.length - 1].n, /hands to your heart/);
});

test("expandSun handles Sun Salutation B and a single round", () => {
  const st = Y.expandSun([{ n: "Sun Salutation B, 1 round", i: "", d: 60, pose: "up" }]);
  assert.equal(st.length, Y.SUN.B.length + 1);
  assert.ok(st.some(x => x.pose === "w1-"));
});

test("steps without a Sun Salutation stay as they are", () => {
  const st = [{ n: "Tree", i: "", d: 30, pose: "tree" }];
  assert.deepEqual(Y.expandSun(st), st);
  assert.deepEqual(Y.expandSun(null), []);
});

test("a length the session doesn't offer falls back to its default", () => {
  assert.equal(Y.lengthFor("study", 45), 5);
  assert.equal(Y.lengthFor("study", "10"), 10);
  assert.equal(Y.lengthFor("nope", 10), 0);
  assert.deepEqual(Y.stepsFor("nope", 10), []);
  assert.deepEqual(Y.stepsFor("vinyasa", 30), []);
});

test("stepsFor does not change the stored sessions", () => {
  const before = Y.byId("back").steps[0].d;
  Y.stepsFor("back", 20);
  assert.equal(Y.byId("back").steps[0].d, before);
});

test("suggest: evening wind down, after a run, morning, study break in exam weeks", () => {
  assert.equal(Y.suggest(at(2026, 11, 17, 22), false), "winddown");
  assert.equal(Y.suggest(at(2026, 11, 17, 2), true), "winddown");
  assert.equal(Y.suggest(at(2026, 11, 17, 18), true), "afterrun");
  assert.equal(Y.suggest(at(2026, 11, 17, 7), false), "morning");
  assert.equal(Y.suggest(at(2026, 11, 17, 15), false), "");
  assert.equal(Y.suggest(at(2026, 12, 9, 15), false), "study");
  assert.equal(Y.suggest(at(2026, 12, 21, 19), false), "study");
  assert.equal(Y.suggest(at(2026, 12, 22, 15), false), "");
});

test("examWeek includes the first and last day", () => {
  assert.equal(Y.examWeek(at(2026, 12, 7, 9)), true);
  assert.equal(Y.examWeek(at(2026, 12, 6, 23)), false);
  assert.equal(Y.examWeek(at(2027, 1, 5, 12), [["2027-01-04", "2027-01-15"]]), true);
});

test("easier: one option per pose, mirrored poses too", () => {
  assert.match(Y.easier("dog"), /knees/);
  assert.equal(Y.easier("lunge-"), Y.easier("lunge"));
  assert.equal(Y.easier("sava"), "");
  assert.equal(Y.easier(undefined), "");
});

test("every pose in the sessions that is hard for beginners has an easier option", () => {
  for (const id of ["basics", "afterrun", "morning"])
    for (const x of Y.stepsFor(id, Y.byId(id).lens[0]).filter(x => !x.fix && ["dog", "lunge", "pigeon", "w2", "tree", "chair"].includes(x.pose.replace(/-$/, ""))))
      assert.ok(Y.easier(x.pose), `${id}: ${x.n}`);
});

test("cue: new shows instruction and easier option, known only the name", () => {
  const st = { n: "Downward Dog", i: "Hips up and back.", d: 45, pose: "dog" };
  const a = Y.cue(st, "new");
  assert.equal(a.text, "Hips up and back.");
  assert.match(a.easy, /knees/);
  assert.match(a.say, /^Downward Dog\. Hips up and back\. Easier: /);
  assert.doesNotMatch(a.say, /\.\./);
  assert.deepEqual(Y.cue(st, "known"), { text: "", easy: "", say: "Downward Dog" });
});

test("cue: breath steps stay short on every level", () => {
  const st = Y.expandSun([{ n: "Sun Salutation A, 1 round", i: "", d: 60, pose: "up" }]);
  assert.equal(Y.cue(st[0], "new").say, "Arms up, inhale");
  assert.equal(Y.cue(st[1], "known").say, "Forward fold, exhale");
  assert.equal(Y.cue(st[1], "new").easy, "");
  assert.deepEqual(Y.cue(null, "new"), { text: "", easy: "", say: "" });
});

test("validTension accepts whole numbers from 1 to 5 only", () => {
  for (const v of [1, 3, 5]) assert.equal(Y.validTension(v), true);
  for (const v of [0, 6, 2.5, "3", null, undefined, NaN]) assert.equal(Y.validTension(v), false);
});

test("tension averages only complete checks, rounded to one decimal", () => {
  assert.deepEqual(Y.tension([{ b: 4, a: 2 }, { b: 3, a: 2 }, { b: 4, a: 3 }, { b: 5 }, null, { b: 9, a: 1 }]),
    { n: 3, before: 3.7, after: 2.3, diff: 1.4 });
  assert.equal(Y.tension([]), null);
  assert.equal(Y.tension([{ b: 3 }]), null);
  assert.equal(Y.tension(undefined), null);
});

test("tensionText says down, same or up", () => {
  assert.equal(Y.tensionText(4, 2), "From 4 down to 2. Nice.");
  assert.match(Y.tensionText(3, 3), /^Still 3/);
  assert.match(Y.tensionText(2, 3), /^Up from 2 to 3/);
  assert.equal(Y.tensionText(4, null), "");
});

/* ---------- suggestions that follow your goals ---------- */
test("goals: sleep brings wind down from 20:00, back and toes fill the free hours", () => {
  const day = (h) => at(2026, 11, 17, h);
  assert.equal(Y.suggest(day(20), false), "", "no goal, 20:00: nothing special");
  assert.equal(Y.suggest(day(20), false, undefined, ["sleep"]), "winddown");
  assert.equal(Y.suggestWhy(day(22), false, undefined, ["sleep"]).why, "For your goal: sleep better");
  assert.equal(Y.suggest(day(15), false, undefined, ["back"]), "back");
  assert.equal(Y.suggest(day(15), false, undefined, ["toes"]), "afterrun");
  assert.equal(Y.suggest(day(15), false, undefined, ["toes", "back"]), "afterrun", "the goal picked first wins");
  assert.equal(Y.suggest(day(15), false, undefined, ["run10k", "pullup"]), "", "other goals are ignored");
});

test("goals: exam stress brings the study break in the afternoon, time of day still comes first", () => {
  assert.equal(Y.suggest(at(2026, 11, 17, 14), false, undefined, ["exam"]), "study");
  assert.equal(Y.suggest(at(2026, 11, 17, 11), false, undefined, ["exam"]), "");
  assert.equal(Y.suggest(at(2026, 11, 17, 8), false, undefined, ["exam", "back"]), "morning");
  assert.equal(Y.suggest(at(2026, 11, 17, 15), true, undefined, ["back"]), "afterrun");
  assert.match(Y.suggestWhy(at(2026, 11, 17, 15), true, undefined, ["toes"]).why, /touch your toes/);
  assert.equal(Y.suggestWhy(at(2026, 12, 9, 15), false, undefined, ["exam"]).why, "For your goal: less exam stress");
});

test("every goal points to a session that exists", () => {
  Object.values(Y.GOAL_SESSION).forEach(id => assert.ok(Y.byId(id), id));
});

/* ---------- flexibility check ---------- */
test("flexibility: only levels 1 to 5", () => {
  assert.equal(Y.validFlex(3), 3);
  assert.equal(Y.validFlex("4"), 4);
  [0, 6, 2.5, "x", null].forEach(v => assert.equal(Y.validFlex(v), 0));
  assert.equal(Y.flexName(4), "Toes");
  assert.equal(Y.addFlex([], 9, Date.now()).ok, false);
});

test("flexibility: one check per day, sorted, last 60 kept", () => {
  const t0 = at(2026, 11, 1, 9);
  let l = Y.addFlex([], 2, t0).list;
  l = Y.addFlex(l, 3, t0 + 3600e3).list;                 // same day: replaces
  assert.deepEqual(l.map(c => c.v), [3]);
  l = Y.addFlex(l, 4, t0 + 14 * 864e5).list;
  assert.deepEqual(l.map(c => c.v), [3, 4]);
  let many = [];
  for (let i = 0; i < 70; i++) many = Y.addFlex(many, 1 + (i % 5), t0 + i * 864e5).list;
  assert.equal(many.length, 60);
  assert.ok(many[0].t < many[59].t);
});

test("flexibility: due every 14 days, first one right away", () => {
  const t0 = at(2026, 11, 1, 9);
  assert.equal(Y.flexDueIn([], t0), 0);
  const l = Y.addFlex([], 2, t0).list;
  assert.equal(Y.flexDueIn(l, t0 + 864e5), 13);
  assert.equal(Y.flexDueIn(l, t0 + 14 * 864e5), 0);
  assert.equal(Y.flexDueIn(l, t0 + 30 * 864e5), 0);
});

test("flexibility: progress since the start and toes reached", () => {
  const t0 = at(2026, 10, 1, 9);
  assert.equal(Y.flexTrend([]), null);
  let l = [];
  [2, 3, 3, 4].forEach((v, i) => { l = Y.addFlex(l, v, t0 + i * 14 * 864e5).list; });
  const tr = Y.flexTrend(l);
  assert.equal(tr.n, 4);
  assert.equal(tr.first.v, 2);
  assert.equal(tr.last.v, 4);
  assert.equal(tr.prev.v, 3);
  assert.equal(tr.gained, 2);
  assert.equal(tr.toes, true);
  assert.equal(Y.flexTrend([{ t: t0, v: 7 }, { t: t0, v: 2 }]).n, 1, "invalid entries are ignored");
});
