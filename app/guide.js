/* NOVAFit · guided tour
   Starts once after sign-up (and any time from Menu › Guided tour). It walks through Today, Train
   (Gym, Run, Yoga) and Progress on the real screens: info steps explain one part with Next, tap steps
   wait until the highlighted button is tapped, pauses show a new screen first, free steps let you look around.
   The tour is a sandbox: history, settings and badges are saved before it starts and put back at the end,
   so a workout finished during the tour and the example data never stay. Uses app.js globals. */
"use strict";

const TOUR_SNAP = "nf-guide-snap";
let TOUR = null;   // {steps, i, busy}

/* ---- Steps ---- */
const $q = s => document.querySelector(s);
const notWarm = s => [...document.querySelectorAll(s)].find(x => !x.closest(".warmcard"));
const toTrain = () => { closeSheet(); screen = "home"; TAB = "train"; render(); window.scrollTo(0,0); };
function guideSteps(kinds){
  const has = k => kinds.includes(k);
  const L = [
    // Today
    {ch:"Today", t:"Your day at a glance", b:"Your next session from your plan, your recap every Sunday, and a reminder to back up so your progress is always safe.", el:() => $q("#app .heroset") || $q("#app section.hero"), block:"start",
      before:() => { if(typeof HERO_FIRST==="function") HERO_FIRST(); }},
    {ch:"Today", t:"Your week ahead", b:"The coming days of your plan, plus a heads-up when exams are close: 5-minute study breaks are ready then.", el:() => $q(".nextsec")},
    {ch:"Today", t:"News from campus", b:"The latest from Nova SBE, right where you train.", el:() => $q("#newsec")},
    {ch:"Today", t:"Your settings", b:"Tap the menu to see what you can set up.", el:() => $q("[data-act=menu]"), tap:true, noscroll:true},
    {pause:"Menu"},
    {ch:"Today", t:"Your plan and reminders", b:"Your profile, your plan with how many sessions a week, and your running goal. Below: your calendar and the weather for your runs.", el:() => $q("#me-plan"), block:"start", spanTo:"#me-remind"},
    {ch:"Today", t:"Make it yours", b:"Your own photos, dark mode, your history and badges, and a backup of everything. Every line says what it is for; this tour lives here too.", el:() => $q("#me-look"), block:"start", spanTo:"#me-data"},
    {ch:"Train", t:"On to training", b:"Tap Train.", el:() => $q(".tabbar [data-t=train]"), tap:true, noscroll:true},
    {pause:"Train"},
    {ch:"Train", t:"Your week at a glance", b:"The coloured line shows what's done. Today's session is always on top.", el:() => $q(".trrow") || $q(".trhead"), noscroll:true}
  ];
  if(has("s")) L.push(
    {ch:"Gym", t:"Gym", b:"Tap Gym.", el:() => $q(".tsport.k-s"), tap:true},
    {pause:"Gym"},
    {ch:"Gym", t:"Your way to train", b:"Follow your plan, pick a ready-made split, or create your own template and save it.", el:() => $q(".splist"), noscroll:true},
    {ch:"Gym", t:"Start a workout", b:"Tap a day to start it.", el:() => $q(".splist .sprow[data-act=start]"), tap:true},
    {pause:"Your workout"},
    {ch:"Gym", t:"Warm up first", b:"A guided 5-minute warm-up that fits today's workout, with a timer.", el:() => $q(".warmcard")},
    {ch:"Gym", t:"Lift a bit more", b:"Your sets from last time are filled in. Did them all? Then the app suggests more weight. Tap Apply.", el:() => $q("[data-act=applyup]"), tap:true},
    {ch:"Gym", t:"Not sure how it works?", b:"Tap ⋯ next to the exercise.", el:() => notWarm("[data-act=exmenu]"), tap:true},
    {ch:"Gym", t:"How to do it", b:"Here you see today's whole workout and can change the order with the arrows. Every exercise has drawings and tips, and you can swap it for one that trains the same muscles. Tap How to do it.", el:() => $q("[data-go=guide]"), tap:true},
    {ch:"Gym", t:"Pictures and tips", b:"How to move, what to watch out for, which muscles it trains.", el:() => $q(".sheet"), noscroll:true, maxh:300},
    {ch:"Gym", t:"Done a set?", b:"Tick it off.", el:() => notWarm("[data-act=tick]"), tap:true, before:() => { closeSheet(); window.scrollTo(0,0); }},
    {ch:"Gym", t:"Rest timer", b:"It starts by itself and rings when it's time for the next set.", el:() => $q("#rest"), noscroll:true},
    {ch:"Gym", t:"Something extra today?", b:"Add another exercise in the middle of your workout. Tap + Add exercise.", el:() => $q("[data-act=addex]"), tap:true},
    {free:"All 124 exercises · scroll, filter, have a look", before:() => { const c = [...document.querySelectorAll(".sheet button")].find(b => b.textContent.trim()==="Chest"); if(c) c.click(); }, after:() => closeSheet()},
    {ch:"Gym", t:"All done?", b:"Tap Finish session.", el:() => $q("[data-act=finish]"), tap:true, noscroll:true,
      before:() => { if(S.active && S.active.sets){ Object.values(S.active.sets).forEach(a => a.forEach(s => { s.ok = true; if(!s.r) s.r = "10"; })); save(); renderSession(); } }},
    {ch:"Gym", t:"Save it", b:"Tap Finish and save.", el:() => $q(".sheet [data-act=finishok]"), tap:true, noscroll:true},
    {pause:"Workout saved"},
    {ch:"Gym", t:"New record!", b:"After every workout: your records, the muscles you trained and new badges.", el:() => $q("#app"), nospot:true, noscroll:true},
    {ch:"Gym", t:"Back to training", b:"Tap Back to home.", el:() => [...document.querySelectorAll("#app [data-act=home]")].pop(), tap:true}
  );
  if(has("r")) L.push(
    {ch:"Running", t:"Running", b:"Tap Run.", el:() => $q(".tsport.k-r"), tap:true, before:() => { if(!(screen==="home" && TAB==="train")) toTrain(); }},
    {pause:"Run"},
    {ch:"Running", t:"Make it easy", b:"Outdoor or treadmill: log a run in seconds. Your plan runs for the week are right below.", el:() => $q(".splog"), noscroll:true},
    {ch:"Running", t:"Have a goal?", b:"Tap Set a running goal.", el:() => $q(".spbody [data-act=runplan]"), tap:true},
    {pause:"Running goal"},
    {ch:"Running", t:"Your own running plan", b:"10 km in a target time, a half marathon or your own loop. You get a plan week by week, right on Train.", el:() => $q(".plw") || $q("#app"), noscroll:true, maxh:330},
    {ch:"Running", t:"Just went for a run?", b:"Tap Outdoor.", el:() => $q(".splog [data-act=runout]"), tap:true, noscroll:true,
      before:() => { PLW = null; SPORT = "r"; screen = "sport"; render(); window.scrollTo(0,0); }},
    {pause:"Log a run"},
    {ch:"Running", t:"Just upload a screenshot", b:"From your watch app or Strava: NOVAFit reads km and time for you. Or import a file from your watch.", el:() => { const a = $q(".shotcta"), f = $q(".filebtn"); return a && f && a.parentElement.contains(f) ? a.parentElement : a; }, noscroll:true, maxh:180,
      after:() => { if(S.active && S.active.type==="lauf"){ S.active = null; save(); } }}
  );
  if(has("y")) L.push(
    {ch:"Yoga", t:"Yoga", b:"Tap Yoga.", el:() => $q(".tsport.k-y"), tap:true, before:() => { if(!(screen==="home" && TAB==="train")) toTrain(); }},
    {pause:"Yoga"},
    {ch:"Yoga", t:"Suggested for right now", b:"Calm in the evening, energising in the morning, with sessions from 10 to 45 minutes.", el:() => $q(".trrow.k-y"), noscroll:true},
    {ch:"Yoga", t:"Try it", b:"Tap Start for a few seconds of yoga.", el:() => $q(".trrow.k-y .tstart"), tap:true, noscroll:true},
    {pause:"Yoga session", before:() => { if(S.active && S.active.type==="yoga" && !TM) runYoga(null); }},
    {ch:"Yoga", t:"Guided, pose by pose", b:"A drawing, a timer and a bell at every change. It can read the poses aloud, so you never have to look at your phone. We end it here, nothing is saved.", el:() => $q("#timerlayer"), nospot:true, noscroll:true,
      after:() => { if(TM) finishTimer(false); if(S.active && S.active.type==="yoga"){ S.active = null; save(); } SPORT = "y"; screen = "sport"; render(); window.scrollTo(0,0); }},
    {ch:"Yoga", t:"Study breaks", b:"5-minute routines for neck, back and hips, made for long library days.", el:() => $q(".spchips")},
    {ch:"Yoga", t:"Flexibility check", b:"Every two weeks a 30-second forward fold. See how far you get.", el:() => $q(".spbody [data-act=flexcheck]")}
  );
  L.push(
    {ch:"Progress", t:"See how it's going", b:"Tap Progress.", el:() => $q(".tabbar [data-t=progress]"), tap:true, noscroll:true, before:() => { closeSheet(); if(screen!=="home"){ screen = "home"; render(); } window.scrollTo(0,0); }},
    {pause:"Progress"},
    {ch:"Progress", t:"Your stories", b:"Every Sunday evening your week becomes a short story. Tap This week to see an example.", el:() => $q(".revrow"), tap:true},
    {pause:"Your week", example:true, before:exampleStory},
    {ch:"Progress", t:"Your week as a story", b:"One slide per sport you did: gym, running, yoga.", el:() => $q("#story"), nospot:true, noscroll:true, example:true, compact:true},
    {ch:"Progress", t:"Every kilometre counts", b:"Your runs day by day, your best pace and how far you got.", el:() => $q("#story"), nospot:true, noscroll:true, example:true, compact:true, before:() => { if(STORY){ STORY.i = 1; drawStory(true); } }},
    {ch:"Progress", t:"Your photos, your story", b:"The backgrounds are your own photos: change them any time in Settings › Your photos. Share the story as an image.", el:() => $q("#story"), nospot:true, noscroll:true, example:true, compact:true,
      before:() => { if(STORY){ STORY.i = 2; drawStory(true); } }, after:() => { closeStory(); render(); }},
    {ch:"Progress", t:"Only what you train", b:"Your numbers per sport, for example your strength score: your main lifts added up, as a curve.", el:() => $q(".pblock2 .pc")},
    {ch:"Progress", t:"Make it your own", b:"Choose which numbers you see. Tap Edit cards.", el:() => $q(".pblock2 [data-act=pcards]"), tap:true},
    {ch:"Progress", t:"Your cards", b:"Up to 5 per sport, from estimated max to when you train best.", el:() => $q(".pcopts"), noscroll:true, maxh:300, after:() => { closeSheet(); render(); }}
  );
  if(has("r")) L.push({ch:"Progress", t:"What could you run today?", b:"From your best runs: your 5 km, 10 km and half marathon times, next to your goal.", el:() => [...document.querySelectorAll("#sec-r .pc")].find(x => /raced/i.test(x.textContent))});
  if(has("y")) L.push({ch:"Progress", t:"What yoga does for you", b:"How much your tension drops, and how your flexibility grows.", el:() => $q("#sec-y .pc")});
  L.push(
    {ch:"Progress", t:"Every session", b:"Tap Open calendar & history.", el:() => $q("#sec-cal .pmore"), tap:true},
    {pause:"Calendar & history"},
    {ch:"Progress", t:"Calendar & history", b:"Each day in the colour of its sport. Tap a day for details, or switch to the list for your whole history.", el:() => $q(".cgrid"), noscroll:true},
    {ch:"Progress", t:"‹ Back", b:"Tap ‹ Progress.", el:() => $q(".pghead .spback"), tap:true, noscroll:true},
    {ch:"Progress", t:"Badges", b:"Tap All badges.", el:() => $q("[data-act=badgesopen]"), tap:true},
    {pause:"Badges"},
    {ch:"Progress", t:"Collect them all", b:"From your first session to 100 km. The red ones are special to Nova, and two stay secret until you get them.", el:() => $q(".bgroup.g-special") || $q(".bgroup"), last:"Finish tour"}
  );
  return NFTour.number(L);
}

/* Three made-up slides, one per sport, on the user's own photos (or the Nova ones) */
function exampleStory(){
  const bars = [0,6.2,0,0,0,8.4,0].map((v,i) => `<div class="mbw"><div class="mb${v?"":" lo"}" style="height:${Math.max(4, v/8.4*90)}px">${v?`<em class="tnum">${v}</em>`:""}</div><small>${WD[i]}</small></div>`).join("");
  const name = firstName();
  STORY = {kind:"example", i:0, slides:[
    {c:"s5", h:`<p class="sy-eb">Gym · 3 sessions</p><h2 class="sy-num pop tnum" style="font-size:72px">9,015 kg</h2><p class="sy-p">is what you moved this week.</p><div class="sy-list"><p>🏆 <b>Bench Press</b> 65 kg <span class="sy-pill">+2.5 kg</span></p><p>💪 Most trained: <b>Chest and back</b></p></div>`},
    {c:"s4", h:`<p class="sy-eb">Running · 2 runs</p><h2 class="sy-num pop tnum">14.6 km</h2><p class="sy-p">From Nova SBE almost to Lisbon.</p><div class="sy-panel"><div class="mbars sm" style="height:120px">${bars}</div></div><div class="sy-list"><p>⚡ Best pace: <b>5:43 /km</b> <span class="sy-pill">12 s faster</span></p></div>`},
    {c:"s6", h:`<p class="sy-eb">Yoga · 2 sessions</p><h2 class="sy-num pop tnum">50 min</h2><p class="sy-p">on the mat this week.</p><div class="sy-list"><p>😌 Tension <b>4 → 2</b> on average</p><p>🧘 Most done: <b>Wind down</b></p></div><h2 class="sy-big" style="margin-top:14px;font-size:30px">${name ? `Well done, ${esc(name)}.` : "Well done."}</h2>`}]};
  try{ musicStop(); }catch(e){}
  attachPhotos(STORY); drawStory(true);
}

/* ---- Sandbox: save everything before the tour, put it back afterwards ---- */
function guideSnapshot(){
  const snap = JSON.stringify({history:S.history, badges:S.badges||{}, active:S.active||null, settings:S.settings});
  try{ localStorage.setItem(TOUR_SNAP, snap); }catch(e){}
  return snap;
}
function guideRestore(){
  let raw = null; try{ raw = localStorage.getItem(TOUR_SNAP); }catch(e){}
  if(!raw) return false;
  try{
    const o = JSON.parse(raw);
    const n = normalize({history:o.history, badges:o.badges, active:o.active, settings:o.settings});
    S.history = n.history; S.badges = n.badges; S.active = n.active; S.settings = n.settings; S.settings.guideSeen = true;
  }catch(e){}
  try{ localStorage.removeItem(TOUR_SNAP); }catch(e){}
  save(); return true;
}
function loadExample(){
  const kinds = trainKinds(), p = S.settings.plan;
  const exOf = wk => ((W[wk] && W[wk].ex) || []).filter(e => !e.opt).map(e => ({id:e.id, s:e.s || (EXN[e.id]||{}).s || 3, r:(EXN[e.id]||{}).r, type:exType(e.id), eq:(EXN[e.id]||{}).eq}));
  const gw = (NFEx.TEMPLATE_ORDER || []).find(w => W[w] && w!=="empty" && (W[w].ex||[]).length);
  const d = NFTour.makeDemo({now:Date.now(), kinds, sessions:p && Array.isArray(p.sessions) ? p.sessions.filter(x => x.kind!=="s" || W[x.workout]) : [], exOf, gymWorkout:gw});
  S.history = d.history.concat(S.history).sort((a,b) => a.start-b.start);
  if(d.flex.length && !(S.settings.flex||[]).length) S.settings.flex = d.flex;
  if(d.mob.length) S.settings.mob = (S.settings.mob||[]).concat(d.mob);
  S.active = null; checkBadges(true); save();
}

/* ---- Overlay ---- */
function guideLayer(){
  let el = document.getElementById("guide");
  if(!el){ el = document.createElement("div"); el.id = "guide"; document.body.appendChild(el); el.addEventListener("click", guideClick); }
  return el;
}
function startGuide(){
  if(TOUR) return;
  closeSheet(); if(STORY) closeStory(); if(TM) finishTimer(false);
  screen = "home"; TAB = "today"; render(); window.scrollTo(0,0);
  const name = firstName(), little = S.history.length < 10;
  TOUR = {steps:null, i:-1, example:little};
  guideLayer().innerHTML = `<div class="tg-full" role="dialog" aria-modal="true" aria-labelledby="tg-wt">
    <p class="tg-eb">Welcome to NOVAFit</p><h2 id="tg-wt">${name ? `You're all set, ${esc(name)}.` : "You're all set."}</h2>
    <p>Let's walk through your app together. You tap, we explain. About 5 minutes.</p>
    <ul><li><b>Today</b>what's next, news, settings</li><li><b>Train</b>gym, running and yoga</li><li><b>Progress</b>numbers, stories, badges</li></ul>
    <label class="tg-ex"><input type="checkbox" id="tg-ex" ${little ? "checked" : ""}> Show it with example data (removed after the tour)</label>
    <button class="tg-big" data-tg="go">Show me around</button><button class="tg-ghost" data-tg="end">Skip, I'll explore myself</button></div>`;
}
function guideGo(){
  const ex = document.getElementById("tg-ex"), withEx = ex ? ex.checked : false;
  guideSnapshot();
  if(withEx) loadExample();
  TOUR.steps = guideSteps(trainKinds()); TOUR.i = -1;
  render(); window.scrollTo(0,0);
  guideNext();
}
function guideNext(){
  if(!TOUR || TOUR.busy) return;
  const cur = TOUR.steps && TOUR.steps[TOUR.i];
  try{ cur && cur.after && cur.after(); }catch(e){}
  TOUR.i++;
  if(!TOUR.steps || TOUR.i >= TOUR.steps.length) return guideFinish();
  const st = TOUR.steps[TOUR.i];
  try{ st.before && st.before(); }catch(e){}
  TOUR.busy = true;
  setTimeout(() => { if(!TOUR) return; TOUR.busy = false; guideShow(0); }, 120);
}
const GPAD = 6;
// Where the highlight goes for a step: the element, or down to `spanTo`, never taller than the screen allows
function guideBox(st, el){
  const r = el.getBoundingClientRect(), pad = GPAD, to = st.spanTo && $q(st.spanTo);
  let h = to ? to.getBoundingClientRect().bottom - r.top : r.height;
  h = Math.min(h, st.maxh || 1e5);
  if(to) h = Math.min(h, window.innerHeight - Math.max(r.top, 0) - 250);   // leave room for the card below
  return {r, h, box:`left:${r.left-pad}px;top:${r.top-pad}px;width:${r.width+2*pad}px;height:${h+2*pad}px`};
}
const tapPos = (r, h) => `left:${Math.max(4, Math.min(r.left, window.innerWidth-60))}px;top:${r.top>60 ? r.top-GPAD-26 : r.top+h+GPAD+6}px`;
/* The page moved under the tour (a thumb scrolled, the phone turned, a picture loaded):
   the highlight follows the element, so the ring is always where the button is */
let guideRaf = 0;
function guideReflow(){
  guideRaf = 0;
  if(!TOUR || TOUR.busy) return;
  const st = TOUR.steps && TOUR.steps[TOUR.i], el = TOUR.el;
  if(!st || st.pause || st.free || !el || !el.isConnected || !el.getClientRects().length) return;
  const lay = document.getElementById("guide"); if(!lay) return;
  const {r, h, box} = guideBox(st, el);
  TOUR.rect = {l:r.left-GPAD, t:r.top-GPAD, w:r.width+2*GPAD, h:h+2*GPAD};
  const ring = lay.querySelector(".tg-ring"), spot = lay.querySelector(".tg-spot:not(.soft)"), tap = lay.querySelector(".tg-tap");
  if(ring) ring.setAttribute("style", box);
  if(spot) spot.setAttribute("style", box);
  if(tap) tap.setAttribute("style", tapPos(r, h));
}
const guideReflowSoon = () => { if(TOUR && !guideRaf) guideRaf = requestAnimationFrame(guideReflow); };
window.addEventListener("scroll", guideReflowSoon, {passive:true, capture:true});   // capture: also a sheet that scrolls
window.addEventListener("resize", () => { guideReflowSoon(); setTimeout(() => { const st = TOUR && TOUR.steps && TOUR.steps[TOUR.i]; if(st && TOUR.el && !st.pause && !st.free) guideFit(st, TOUR.el); }, 200); });

// Shows the current step; a missing target is retried for a moment, then the step is skipped
function guideShow(tries){
  if(!TOUR) return;
  const st = TOUR.steps[TOUR.i], lay = guideLayer();
  const exTag = st.example ? `<span class="tg-extag">Example week</span>` : "";
  if(st.pause){ lay.innerHTML = `<div class="tg-block" data-tg="next"></div>${exTag}<div class="tg-bar" data-tg="next"><span>${esc(st.pause)}</span><b>Tap anywhere to continue ›</b></div>`; return; }
  if(st.free){ lay.innerHTML = `<button class="tg-pill" data-tg="next">${esc(st.free)} · <span>Continue tour ›</span></button>`; return; }
  const el = st.el && st.el();
  if(!el || !el.getClientRects().length){
    if(tries < 8){ lay.innerHTML = `<div class="tg-block"></div>`; setTimeout(() => guideShow(tries+1), 150); return; }
    return guideNext();
  }
  if(!st.noscroll && !el.closest(".sheet") && el.id!=="app") el.scrollIntoView({block:st.block || "center"});
  else if(st.noscroll && !el.closest(".sheet")){   // no scrolling wanted, but never a part you can't see (landscape, small phones)
    const b = el.getBoundingClientRect();
    if(getComputedStyle(el).position!=="fixed" && (b.top < 0 || b.bottom > window.innerHeight - 8)) el.scrollIntoView({block:"center"});
  }
  else if(el.closest(".sheet")){ const sh = el.closest(".sheet"), er = el.getBoundingClientRect(), sr = sh.getBoundingClientRect(); if(er.bottom > sr.bottom - 8 || er.top < sr.top) sh.scrollTop += er.top - sr.top - sh.clientHeight/3; }   // a long sheet: bring the button up
  const {r, h, box} = guideBox(st, el), pad = GPAD;
  const tabbar = document.querySelector(".tabbar"), low = tabbar && tabbar.getClientRects().length && !STORY && !TM && screen!=="session";
  const mid = r.top + h/2, onTop = st.nospot ? false : mid > window.innerHeight*0.5;
  const pos = st.compact ? "bottom:14px" : onTop ? "top:12px" : `bottom:${low ? 74 : 14}px`;
  TOUR.target = st.tap ? el : null; TOUR.el = el; TOUR.low = low; TOUR.rect = {l:r.left-pad, t:r.top-pad, w:r.width+2*pad, h:h+2*pad};
  lay.innerHTML = `<div class="tg-block" data-tg="${st.tap ? "tap" : ""}"></div>
    <div class="tg-spot ${st.nospot ? "soft" : ""}" style="${st.nospot ? "left:0;top:0;width:0;height:0" : box}"></div>
    ${st.tap ? `<div class="tg-ring" style="${box}"></div><span class="tg-tap" style="${tapPos(r, h)}">Tap</span>` : ""}
    ${exTag}
    <div class="tg-card ${st.compact ? "compact" : ""}" style="${pos}" role="dialog" aria-live="polite">
      <p class="tg-eb"><span>${esc(st.ch)}</span><span>${st.n} / ${st.of}</span></p><h3>${esc(st.t)}</h3><p>${esc(st.b)}</p>
      <div class="tg-dots">${Array.from({length:st.of}, (_,i) => `<i class="${i<st.n?"on":""}"></i>`).join("")}</div>
      <div class="tg-btns"><button class="tg-skip" data-tg="end">Skip tour</button>${st.tap ? `<span class="tg-hint">● Tap the highlighted part</span>` : `<button class="tg-next" data-tg="next">${esc(st.last || "Next")}</button>`}</div></div>`;
  guideFit(st, el);
}
/* The card must never cover what it talks about (small phones, landscape): try the other side of
   the screen, then move the page so the part sits above the card, then a smaller card */
function guideFit(st, el){
  const lay = document.getElementById("guide"), card = lay && lay.querySelector(".tg-card");
  if(!card || st.nospot || !TOUR || !TOUR.rect) return;
  const hit = () => { const c = card.getBoundingClientRect(), R = TOUR.rect; return c.bottom > R.t + 2 && c.top < R.t + R.h - 2; };
  const place = top => { card.style.top = top ? "12px" : ""; card.style.bottom = top ? "" : `${TOUR.low ? 74 : 14}px`; };
  if(!hit()) return;
  const wasTop = !!card.style.top;
  place(!wasTop); if(!hit()) return;
  // the part scrolls with the page: bring it up under the header, with the card below it
  if(!el.closest(".sheet") && getComputedStyle(el).position!=="fixed" && !el.closest(".tabbar, header, .tg-fixed")){
    place(false);
    const c = card.getBoundingClientRect(), R = TOUR.rect, room = c.top - 12;   // space above the card
    if(R.h < room){ window.scrollBy(0, R.t - Math.max(64, room - R.h)); guideReflow(); if(!hit()) return; }
  }
  // inside a sheet: scroll the sheet so the part sits near its top, the card goes below
  const sh = el.closest(".sheet");
  if(sh){
    place(false);
    const c = card.getBoundingClientRect(), R = TOUR.rect, sr = sh.getBoundingClientRect();
    sh.scrollTop += R.t - Math.max(sr.top + 8, 12); guideReflow(); if(!hit()) return;
  }
  card.classList.add("compact");
  for(const top of [false, true]){ place(top); if(!hit()) return; }
  card.classList.add("mini");   // last resort: title and hint only
  for(const top of [false, true]){ place(top); if(!hit()) return; }
  place(wasTop);
}
function guideClick(ev){
  const b = ev.target.closest("[data-tg]"); if(!b || !TOUR) return;
  const a = b.dataset.tg;
  ev.preventDefault(); ev.stopPropagation();
  if(a==="go") return guideGo();
  if(a==="end") return guideEnd();
  if(a==="done") return guideEnd();
  if(a==="next") return guideNext();
  if(a==="tap"){
    const R = TOUR.rect, t = TOUR.target;
    if(!t || !R) return;
    // inside the ring, or on the button itself wherever it is now (the page may have moved since)
    const inside = (x, y, b, p) => x>=b.left-p && x<=b.right+p && y>=b.top-p && y<=b.bottom+p;
    const now = t.isConnected && t.getBoundingClientRect();
    if((ev.clientX>=R.l && ev.clientX<=R.l+R.w && ev.clientY>=R.t && ev.clientY<=R.t+R.h) || (now && now.width && inside(ev.clientX, ev.clientY, now, GPAD))){
      guideLayer().innerHTML = "";
      TOUR.busy = true; t.click();
      setTimeout(() => { if(!TOUR) return; TOUR.busy = false; guideNext(); }, 350);
    }
  }
}
// During a free step the library can be browsed, but nothing is added to the workout
document.addEventListener("click", ev => {
  const st = TOUR && TOUR.steps && TOUR.steps[TOUR.i];
  if(st && st.free && ev.target.closest('[data-act="libadd"],[data-act="closesheet"],[data-act="scrim"]') && !ev.target.closest("#guide")){ ev.preventDefault(); ev.stopPropagation(); }
}, true);
function guideFinish(){
  const name = firstName(), lay = guideLayer();
  TOUR.i = TOUR.steps.length;
  lay.innerHTML = `<div class="tg-full end" role="dialog" aria-modal="true"><p class="tg-eb">Tour done</p><h2>${name ? `Let's go, ${esc(name)}.` : "Let's go."}</h2>
    <p>Your first session is waiting on Today. Everything from the tour is reset, and you find it again under Menu › Guided tour.</p>
    <button class="tg-big" data-tg="done">Go to Today</button></div>`;
}
function guideEnd(){
  const lay = document.getElementById("guide"); if(lay) lay.remove();
  const was = TOUR; TOUR = null;
  try{ if(STORY) closeStory(); }catch(e){}
  try{ if(TM) finishTimer(false); }catch(e){}
  closeSheet(); rest = null; PLW = null; summary = null;
  if(!guideRestore()){ S.settings.guideSeen = true; save(); }
  CAL = {view:"month", sel:null, f:"all", n:8}; PEXALL = false;
  screen = "home"; TAB = "today"; try{ sessionStorage.setItem("nf-tab", TAB); }catch(e){}
  render(); window.scrollTo(0,0);
  return was;
}
// A tour cut short by closing the app is undone on the next start
if(guideRestore()) render();
