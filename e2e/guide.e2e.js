// End-to-end: the guided tour after sign-up · run with: npm run e2e
const test = require("node:test");
const assert = require("node:assert/strict");
const { setup, signedIn } = require("./helpers");

let app;
test.before(async () => { app = await setup(); });
test.after(async () => { await app.close(); });

// Walks the tour like a person: Next on info steps, the highlighted button on tap steps,
// anywhere on pauses, "Continue tour" on the free library step
async function walk(page) {
  const seen = [];
  for (let k = 0; k < 140; k++) {
    const st = await page.evaluate(() => {
      if (!TOUR) return { done: true };
      const s = TOUR.steps && TOUR.steps[TOUR.i];
      return { i: TOUR.i, busy: !!TOUR.busy, kind: TOUR.i < 0 ? "welcome" : !s ? "end" : s.pause ? "pause" : s.free ? "free" : s.tap ? "tap" : "info",
        t: s ? (s.t || s.pause || s.free) : "", card: !!document.querySelector("#guide .tg-card, #guide .tg-bar, #guide .tg-pill, #guide .tg-full"), rect: TOUR.rect || null };
    });
    if (st.done) return seen;
    if (st.busy || !st.card) { await page.waitForTimeout(200); continue; }
    if (st.kind === "welcome") await page.click("[data-tg=go]");
    else if (st.kind === "end") await page.click("[data-tg=done]");
    else if (st.kind === "pause") await page.click(".tg-bar");
    else if (st.kind === "free") await page.click(".tg-pill");
    else if (st.kind === "tap") await page.mouse.click(st.rect.l + st.rect.w / 2, st.rect.t + Math.min(st.rect.h, 60) / 2);
    else await page.click(".tg-next");
    if (seen[seen.length - 1] !== st.t) seen.push(st.t);
    await page.waitForTimeout(450);
  }
  throw new Error("tour did not end: " + seen.join(" › "));
}

test("the tour starts after sign-up, walks every page and leaves no trace", async () => {
  const page = await app.open();
  await signedIn(page, { trainKinds: ["s", "r", "y"] });
  await page.evaluate(() => { OB.mode = "new"; finishOnboarding(); });
  await page.waitForSelector("#guide [data-tg=go]");
  const seen = await walk(page);
  for (const t of ["Your day at a glance", "Lift a bit more", "New record!", "Just upload a screenshot", "Guided, pose by pose", "Your week as a story", "Collect them all"])
    assert.ok(seen.includes(t), `missing step: ${t}`);
  const after = await page.evaluate(() => ({ n: S.history.length, active: !!S.active, seen: S.settings.guideSeen, snap: localStorage.getItem("nf-guide-snap"), tab: TAB }));
  assert.deepEqual(after, { n: 0, active: false, seen: true, snap: null, tab: "today" });
  // signing up again later doesn't start it again; the menu does
  await page.evaluate(() => { OB.mode = "new"; finishOnboarding(); });
  await page.waitForTimeout(600);
  assert.equal(await page.$("#guide"), null);
  assert.deepEqual(await page.done(), []);
});

test("skipping the tour keeps the account as it was", async () => {
  const page = await app.open();
  await signedIn(page);
  await page.evaluate(() => startGuide());
  await page.click("[data-tg=end]");
  assert.deepEqual(await page.evaluate(() => ({ n: S.history.length, seen: S.settings.guideSeen, open: !!TOUR })), { n: 0, seen: true, open: false });
  assert.deepEqual(await page.done(), []);
});

test("profile photo: add with the + on the menu, change or remove it by tapping the photo", async () => {
  const page = await app.open();
  await signedIn(page);
  await page.evaluate(() => { screen = "me"; render(); });
  assert.ok(await page.$(".meav .meplus"));
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click("[data-act=avatar]")]);
  await chooser.setFiles(require("path").join(__dirname, "..", "app", "icon-192.png"));
  await page.waitForSelector(".meav img");
  assert.match(await page.evaluate(() => S.settings.avatar.slice(0, 23)), /^data:image\/jpeg;base64/);
  assert.equal(await page.$(".meav .meplus"), null);
  await page.click("[data-act=avatar]");
  await page.click("[data-act=avatardel]");
  await page.waitForSelector(".meav .meplus");
  assert.equal(await page.evaluate(() => S.settings.avatar), undefined);
  // something else stored as a photo is thrown away when the data is loaded
  assert.equal(await page.evaluate(() => normalize({ settings: { avatar: "javascript:alert(1)" } }).settings.avatar), undefined);
  assert.deepEqual(await page.done(), []);
});

test("tour: after scrolling during a tap step, the ring follows and tapping the button goes on", async () => {
  const page = await app.open();
  await signedIn(page);
  await page.evaluate(() => startGuide());
  await page.click('#guide [data-tg="go"]');
  // go on to the first tap step whose page can scroll (Running › Outdoor is far enough down)
  let i = -1;
  for (let n = 0; n < 120; n++) {
    await page.waitForTimeout(250);
    const s = await page.evaluate(() => TOUR && !TOUR.busy && { i: TOUR.i, tap: !!TOUR.steps[TOUR.i].tap, ring: !!document.querySelector("#guide .tg-ring"),
      canScroll: document.documentElement.scrollHeight - innerHeight - scrollY > 200, t: TOUR.steps[TOUR.i].t });
    if (!s) continue;
    if (s.tap && s.ring && s.canScroll && s.i > 20) { i = s.i; break; }
    if (s.tap && s.ring) { const r = await page.evaluate(() => { const b = TOUR.target.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }); await page.mouse.click(r.x, r.y); }
    else { const b = await page.$('#guide .tg-next, #guide .tg-pill'); if (b) await b.click(); else await page.mouse.click(195, 420); }
  }
  assert.ok(i > 0, "found a tap step on a page that scrolls");
  await page.mouse.move(195, 420);
  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => { const b = TOUR.target.getBoundingClientRect(), ring = document.querySelector("#guide .tg-ring").getBoundingClientRect();
    return { moved: Math.abs(b.top - ring.top), x: b.left + b.width / 2, y: b.top + Math.min(b.height, 40) / 2 }; });
  assert.ok(g.moved < 12, `ring ${g.moved}px away from the button`);
  await page.mouse.click(g.x, g.y);
  await page.waitForFunction(i => TOUR && TOUR.i > i, i, { timeout: 3000 });
  await page.evaluate(() => guideEnd());
  assert.deepEqual(await page.done(), []);
});

test("tour on a small phone and in landscape: the card never covers the part to tap", async () => {
  for (const viewport of [{ width: 320, height: 568 }, { width: 844, height: 390 }]) {
    const page = await app.open({ context: { viewport } });
    await signedIn(page);
    await page.evaluate(() => startGuide());
    await page.click('#guide [data-tg="go"]');
    const covered = []; let taps = 0;
    for (let n = 0; n < 160; n++) {
      await page.waitForTimeout(200);
      const s = await page.evaluate(() => {
        if (!TOUR) return { done: true };
        if (TOUR.busy) return {};
        const st = TOUR.steps && TOUR.steps[TOUR.i] || {}, ring = document.querySelector("#guide .tg-ring"), card = document.querySelector("#guide .tg-card");
        if (!st.tap || !ring) return { i: TOUR.i, tap: false };
        const b = TOUR.target.getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + Math.min(b.height, 44) / 2, c = card && card.getBoundingClientRect();
        return { i: TOUR.i, tap: true, t: st.t, x, y, onCard: !!c && x >= c.left && x <= c.right && y >= c.top && y <= c.bottom, onScreen: y > 0 && y < innerHeight };
      });
      if (s.done) break;
      if (s.i === undefined) continue;
      if (await page.$('#guide [data-tg="done"]')) { await page.click('#guide [data-tg="done"]'); continue; }
      if (s.tap) {
        if (s.onCard || !s.onScreen) covered.push(`${viewport.width}×${viewport.height} #${s.i} ${s.t}`);
        taps++; await page.mouse.click(s.x, s.y);
        await page.waitForFunction(i => !TOUR || TOUR.i !== i, s.i, { timeout: 4000 }).catch(() => covered.push(`stuck at #${s.i} ${s.t}`));
      } else { const b = await page.$('#guide .tg-next, #guide .tg-pill'); if (b) await b.click(); else await page.mouse.click(viewport.width / 2, viewport.height / 2); }
    }
    assert.deepEqual(covered, []);
    assert.ok(taps >= 10, `${taps} tap steps`);
    assert.equal(await page.evaluate(() => !!TOUR), false, "tour finished");
    assert.deepEqual(await page.done(), []);
  }
});
