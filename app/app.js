/* NOVAFit · the app itself: screens, sessions, storage and everything you tap.
   Loaded by index.html after the tested modules (exercises.js, plan.js, run.js, muscles.js, yoga.js).
   It lives in its own file (not inline in index.html) so the site can forbid inline scripts
   with a Content-Security-Policy (see netlify.toml). */
/* ================= Plan ================= */
/* Strength workouts come from the templates in exercises.js (NFEx), exercises from its library */
const INTRO = {
  lower:"Lower body day for legs and glutes. Pick weights where the last 2 reps of each set are hard but your form stays clean.",
  upper:"Upper body day for back, chest, shoulders and arms. Leave one or two reps in the tank on every set.",
  full:"Full-body session: legs, push, pull and core in one go. Add weight once all sets feel clean.",
  push:"Push day: chest, shoulders and triceps. Take the full rest on the first two lifts.",
  pull:"Pull day: back, rear shoulders and biceps. Pull with your elbows, not your hands.",
  legs:"Leg day: quads, hamstrings, glutes and calves. Take the full rest on squats and presses.",
  free:"An empty session. Add the exercises you want from the library."
};
function exHint(e){ return e.type==="a" ? "kg of help from the machine" : e.type==="r" ? "Bodyweight" : e.type==="t" ? (NFEx.unitOf(e)==="min" ? "Time in minutes" : "Time in seconds") : e.eq==="Dumbbell" ? "kg per dumbbell" : ""; }
const exFromLib = e => Object.assign({}, e, {de:exHint(e)});
const W = {};
NFEx.TEMPLATE_ORDER.forEach(k => {
  const t = NFEx.TEMPLATES[k], ex = NFEx.templateExercises(k).map(exFromLib);
  W[k] = {name:t.name, kind:"gym", group:t.group, intro:INTRO[t.group], ex,
    desc:ex.filter(e => !e.opt).slice(0, 4).map(e => e.n.replace(/ \(.*\)$/, "")).join(" · ") || "Build your own session"};
});
W.lauf = {name:"Run", kind:"run", desc:"Outside or on the treadmill"};
W.yoga = {name:"Yoga", kind:"yoga", desc:"Vinyasa flow or mobility",
  intro:"Guided vinyasa flow. A different sequence every time, you choose the length below. A bell counts down the last 3 seconds and rings at each change. Get your mat ready and keep the sound on."};
// Home screen order without a plan; ALL_W lists every workout (history, weekly review)
const ORDER = ["po","lauf","oben","yoga"];
const ALL_W = ["po","oben","loB","upB","fbA","fbB","fbC","push","pull","legs","empty","lauf","yoga"];
function kc(x){ const k = typeof x==="string" ? (W[x]||{}).kind : x.kind; return k==="run" ? "run" : k==="yoga" ? "yoga" : ""; }
const YOGA = [
  {n:"Arrive", s:"Sukhasana", i:"Sit comfortably cross-legged, eyes closed. Breathe deeply in and out through your nose.", d:120},
  {n:"Cat-Cow", s:"Marjaryasana-Bitilasana", i:"On all fours. Inhale: belly drops, gaze up. Exhale: round your back, chin to chest.", d:90},
  {n:"Downward Dog", s:"Adho Mukha Svanasana", i:"Hips up and back, heels toward the floor, knees may bend. Pedal your feet one at a time.", d:60},
  {n:"Sun Salutation A, 3 rounds", s:"Surya Namaskar A", i:"Arms up, forward fold, half lift, plank, chaturanga, upward dog, downward dog. One breath per movement.", d:180},
  {n:"Sun Salutation B, 2 rounds", s:"Surya Namaskar B", i:"Like Sun Salutation A, plus Warrior I on the right and left with a vinyasa in between.", d:180},
  {n:"Child's Pose", s:"Balasana", i:"Knees wide, hips to your heels, forehead down. Rest for a moment.", d:60},
  {n:"Low Lunge right", s:"Anjaneyasana", i:"Right foot forward, left knee down. Hips sink forward, arms up. Stretches the hip flexor.", d:45},
  {n:"Warrior II right", s:"Virabhadrasana II", i:"Right knee over the ankle, arms long to the sides, gaze over your right hand.", d:45},
  {n:"Side Angle right", s:"Utthita Parsvakonasana", i:"Right forearm on your thigh, left arm long over your ear.", d:45},
  {n:"Reverse Warrior right", s:"Viparita Virabhadrasana", i:"Right arm up and back, left hand rests on the back leg.", d:30},
  {n:"Vinyasa", s:"Plank · Chaturanga · Up Dog · Down Dog", i:"Hands down, plank, lower slowly, upward dog and downward dog.", d:30},
  {n:"Low Lunge left", s:"Anjaneyasana", i:"Left foot forward, right knee down. Hips sink forward, arms up.", d:45},
  {n:"Warrior II left", s:"Virabhadrasana II", i:"Left knee over the ankle, arms long to the sides, gaze over your left hand.", d:45},
  {n:"Side Angle left", s:"Utthita Parsvakonasana", i:"Left forearm on your thigh, right arm long over your ear.", d:45},
  {n:"Reverse Warrior left", s:"Viparita Virabhadrasana", i:"Left arm up and back, right hand rests on the back leg.", d:30},
  {n:"Vinyasa", s:"Plank · Chaturanga · Up Dog · Down Dog", i:"Flow once more, then step to the front of your mat and rise up.", d:30},
  {n:"Tree right", s:"Vrksasana", i:"Stand on your left leg, right foot on calf or thigh, hands in front of your chest.", d:45},
  {n:"Tree left", s:"Vrksasana", i:"Stand on your right leg, left foot on calf or thigh.", d:45},
  {n:"Pigeon right", s:"Eka Pada Rajakapotasana", i:"Right knee forward, shin across, left leg long behind you. Torso sinks forward. Stretches the glutes.", d:90},
  {n:"Pigeon left", s:"Eka Pada Rajakapotasana", i:"Left knee forward, right leg long behind you. Breathe calmly and let go.", d:90},
  {n:"Bridge", s:"Setu Bandhasana", i:"Lie on your back, feet hip-width apart. Lift your hips, squeeze your glutes, roll down slowly. 3 to 4 times.", d:60},
  {n:"Happy Baby", s:"Ananda Balasana", i:"Lie on your back, soles to the ceiling, hands on your feet, rock gently side to side.", d:60},
  {n:"Supine Twist right", s:"Supta Matsyendrasana", i:"Lower your knees to the left, right arm long, gaze to the right.", d:45},
  {n:"Supine Twist left", s:"Supta Matsyendrasana", i:"Lower your knees to the right, left arm long, gaze to the left.", d:45},
  {n:"Final Relaxation", s:"Savasana", i:"Lie long on your back, arms by your sides, eyes closed. Do nothing at all. Namaste.", d:240}
];
const YOGA_MIN = Math.round(YOGA.reduce((a,x) => a+x.d, 0)/60);
// Your usual running loop (the stored mode id stays "alster" so older data keeps working)
const LN = () => NFRun.loopName(S.settings.loopName);
/* Every exercise by id: the library plus the user's own exercises (added after loading, see addCustomToEXN) */
const EXN = {}; NFEx.LIBRARY.forEach(e => EXN[e.id] = exFromLib(e));
const customList = () => (S && S.settings && Array.isArray(S.settings.custom)) ? S.settings.custom : [];
/* Own workouts from "Build my own" (S.settings.ownW: key → {name, ex}). Kept after a plan change so
   older sessions still show their name; unknown types in the history get a plain fallback. */
function registerOwn(){
  const m = (S && S.settings && S.settings.ownW) || {};
  Object.keys(m).forEach(k => {
    const d = m[k] || {}, ex = (d.ex||[]).map(id => EXN[id] ? Object.assign(exFromLib(EXN[id]), {opt:false}) : null).filter(Boolean);
    W[k] = {name:d.name || "Own workout", kind:"gym", group:"free", own:true, intro:"Your own workout. You can still swap, add or remove exercises.", ex,
      desc:ex.slice(0, 4).map(e => e.n.replace(/ \(.*\)$/, "")).join(" · ") || "Your own workout"};
    if(!ALL_W.includes(k)) ALL_W.splice(ALL_W.indexOf("lauf"), 0, k);
  });
  ((S && S.history) || []).forEach(e => { if(e && e.type && !W[e.type]){ W[e.type] = {name:"Workout", kind:"gym", group:"free", ex:[], desc:""}; if(!ALL_W.includes(e.type)) ALL_W.splice(ALL_W.indexOf("lauf"), 0, e.type); } });
}
function addCustomToEXN(){ customList().forEach(c => { if(c && c.id && !NFEx.BY_ID[c.id]) EXN[c.id] = exFromLib(c); }); }
const exType = id => (EXN[id] && EXN[id].type) || "w";
const exUnit = id => EXN[id] ? NFEx.unitOf(EXN[id]) : "kg";
// One logged set as text, depending on how the exercise is logged
function setTxt(id, s){
  const t = exType(id), r = fmt(num(s.r)), kg = num(s.kg);
  if(t==="t") return r + " " + exUnit(id);
  if(t==="r") return kg>0 ? `${r} × +${fmt(kg)} kg` : `${r} reps`;
  if(t==="a") return `${r} × −${fmt(kg)} kg`;
  return `${r} × ${fmt(kg)} kg`;
}
const rangeTxt = ex => (ex.r[0]===ex.r[1] ? ex.r[0] : ex.r[0]+"–"+ex.r[1]) + (ex.type==="t" ? " " + NFEx.unitOf(ex) : "");
const WD = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

/* ================= Zustand & Speichern ================= */
const LS = "po-plan-app-v2";
const DEF = {v:2, active:null, history:[], settings:{name:"", goal:3, remDays:[0,2,5], remTime:"18:00", theme:"auto", bodyKg:"", showKcal:true, alsterGoal:40, kmGoal:30, itv:{fast:60, slow:120, rounds:6}}};
const clone = o => JSON.parse(JSON.stringify(o));
function normalize(s){
  const d = clone(DEF);
  if(!s || typeof s!=="object") return d;
  const st = Object.assign(d.settings, (s.settings && typeof s.settings==="object") ? s.settings : {});
  // Text from storage, a backup file or the cloud sync is cleaned before it can reach the screen
  st.custom = NFEx.safeCustom(st.custom);
  if(st.ownW && typeof st.ownW==="object") Object.keys(st.ownW).forEach(k => { const w = st.ownW[k]; if(!w || typeof w!=="object" || !/^[A-Za-z0-9_-]{1,40}$/.test(k)) delete st.ownW[k]; else w.name = NFEx.safeText(w.name, 40, "Own workout"); });
  if(st.loopName != null) st.loopName = NFEx.safeText(st.loopName, 24);
  return {v:2, active:s.active||null, history:Array.isArray(s.history)?s.history:[], settings:st, badges:(s.badges && typeof s.badges==="object") ? s.badges : null};
}
let S = (() => { try{ return normalize(JSON.parse(localStorage.getItem(LS)||"null")); }catch(e){ return clone(DEF); } })();
addCustomToEXN();
registerOwn();
let screen = "home", summary = null, rest = null;
// Home tabs: today · train · progress (kept for this visit only)
let TAB = (() => { try{ return sessionStorage.getItem("nf-tab") || "today"; }catch(e){ return "today"; } })();

let ref = null, saveTimer = null, writing = false, dirty = false, lastSent = "";
/* Speicherort: device = installierte App (auf dem Handy), checking, cloud = Claude-Konto, local = Claude-Link ohne Schreibrecht */
let sync = "checking";
function syncHtml(){
  if(sync==="cloud") return `<span style="color:var(--good)">✓ Saved in your Claude account</span>`;
  if(sync==="device") return `<span style="color:var(--good)">✓ Saved on this phone</span>`;
  if(sync==="local") return `<span style="color:#c4501a">Only saved temporarily on this device. To make sure nothing gets lost, the app must be shared with you as a collaborator.</span>`;
  return `<span class="muted">Checking storage…</span>`;
}
function setSync(v){ sync = v; document.querySelectorAll("[data-sync]").forEach(el => el.innerHTML = syncHtml()); }
function save(){
  try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){}
  if(!ref) return;
  clearTimeout(saveTimer); saveTimer = setTimeout(flush, 800);
}
async function flush(){
  saveTimer = null; if(!ref) return;
  if(writing){ dirty = true; return; }
  const body = JSON.stringify(S); if(body===lastSent) return;
  writing = true;
  try{ await ref.set(JSON.parse(body)); lastSent = body; setSync("cloud"); }
  catch(err){
    if(err && ["invalid_argument","revoked","not_granted"].includes(err.code)){ ref = null; setSync("local"); }
    else if(err && err.code==="unavailable") setTimeout(flush, 1500 + Math.random()*1500);
  }finally{ writing = false; if(dirty){ dirty = false; flush(); } }
}
function merge(local, remote){
  const ids = new Set(), hist = [];
  [...(remote.history||[]), ...(local.history||[])].forEach(e => { if(e && !ids.has(e.id)){ ids.add(e.id); hist.push(e); } });
  hist.sort((a,b) => a.start-b.start);
  let active = local.active || remote.active;
  if(local.active && remote.active) active = local.active.start >= remote.active.start ? local.active : remote.active;
  if(active && ids.has("s"+active.start)) active = null;
  return normalize({active, history:hist, settings:Object.assign({}, local.settings, remote.settings||{}), badges:Object.assign({}, remote.badges||{}, local.badges||{})});
}
async function initCloud(){
  if(!window.claude || !window.claude.use){ setSync("device"); return; }
  try{
    const [user, db] = await Promise.all([window.claude.use("user"), window.claude.use("db")]);
    if(!user || !db){ setSync("local"); return; }
    const uid = await user.id(); if(!uid){ setSync("local"); return; }
    const r = db.doc("data/users/"+uid+"/app");
    let first = true;
    r.onSnapshot(snap => {
      if(first && snap.metadata.fromCache) return;
      if(first){
        first = false; ref = r;
        if(snap.exists && snap.data()){
          setSync("cloud");
          S = merge(S, snap.data()); lastSent = JSON.stringify(snap.data());
          save(); applyTheme(); if(!isTyping()) render();
        }else if(S.history.length || S.active){ save(); }
        return;
      }
      if(snap.metadata.hasPendingWrites || saveTimer || writing || !snap.exists) return;
      const inc = JSON.stringify(snap.data());
      if(inc===lastSent || inc===JSON.stringify(S) || isTyping()) return;
      S = normalize(snap.data()); lastSent = inc;
      try{ localStorage.setItem(LS, inc); }catch(e){}
      applyTheme(); render();
    }, () => { ref = null; setSync("local"); });
  }catch(e){ setSync("local"); }
}
const isTyping = () => document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);

/* ================= Helfer ================= */
const $ = s => document.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const num = v => { const n = parseFloat(String(v==null?"":v).replace(",", ".")); return isFinite(n) ? n : 0; };
// Display only: thousands separators (16,440 kg). Never feed this back into an input that num() reads, use plain numbers there.
const fmt = (n,d=1) => Number(n).toLocaleString("en-GB",{maximumFractionDigits:d, useGrouping:true});
const filled = s => s && String(s.r==null?"":s.r).trim()!=="";
/* Ein Satz zählt, wenn sie ihn abhakt oder selbst etwas einträgt. Vorausgefüllte Werte vom letzten Mal zählen erst danach. */
const isDone = s => s && (s.ok===true || (s.ok===undefined && filled(s)));
function parseMin(v){
  const t = String(v||"").trim(); if(!t) return 0;
  if(t.includes(":")){ const p = t.split(":"); if(p.length>=3) return num(p[0])*60 + num(p[1]) + num(p[2])/60; return num(p[0]) + num(p[1])/60; }
  return num(t);
}
function mmss(min){ if(!(min>0)) return "–"; let m = Math.floor(min), s = Math.round((min-m)*60); if(s===60){m++;s=0;} return m+":"+String(s).padStart(2,"0"); }
function hms(min){ if(min>=60){ const h = Math.floor(min/60); return h+":"+mmss(min-h*60).padStart(5,"0"); } return mmss(min); }
const paceOf = (km,min) => km>0 && min>0 ? min/km : 0;
function durTxt(ms){ const m = Math.max(0, Math.round(ms/60000)); return m<60 ? m+" min" : Math.floor(m/60)+" h "+String(m%60).padStart(2,"0")+" min"; }
/* Gym-Uhr stoppt automatisch nach 60 Minuten (falls das Beenden vergessen wird) */
const GYM_MAX = 60*60000;
function isGym(t){ return !!(W[t] && W[t].kind==="gym"); }
function elapsedOf(a){ const d = Date.now()-a.start; return isGym(a.type) ? Math.min(d, GYM_MAX) : d; }
function elapsedTxt(a){ const c = clock(elapsedOf(a)); return isGym(a.type) && Date.now()-a.start>=GYM_MAX ? c+" · stopped" : c; }
/* Kalorien-Schätzung (MET-Werte bzw. ~1 kcal pro kg und km beim Laufen).
   MET-Teile werden mit dem persönlichen Ruheumsatz aus Geschlecht, Alter, Gewicht und Größe
   angepasst (NFPlan.kcalFactor, getestet in tests/plan.test.js). Laufen nach Strecke und das
   Laufband nach ACSM bleiben, wie sie sind: sie rechnen schon mit Gewicht und Tempo. */
function kcalOn(){ return S.settings.showKcal!==false && num(S.settings.bodyKg)>0; }
function distKcal(km, min, kg){ const v = min>0 ? km/(min/60) : 10; return km*kg*(v<7 ? 0.6 : 1.0); }
/* Laufband: ACSM-Formel mit Steigung (Gehen bis ~7,2 km/h, darüber Laufen) */
function treadKcal(km, min, incl, kg){
  if(!(km>0) || !(min>0)) return 0;
  const s = km*1000/min, g = Math.max(0, Math.min(30, num(incl)))/100;
  const vo2 = s <= 120 ? .1*s + 1.8*s*g + 3.5 : .2*s + .9*s*g + 3.5;
  return vo2*kg*min/1000*5;
}
function kcalOf(e){
  const kg = num(S.settings.bodyKg); if(!(kg>0)) return 0;
  const f = NFPlan.kcalFactor(Object.assign({}, S.settings.body, {kg}));
  let k = 0;
  if(e.run){ const km = num(e.run.km), mn = num(e.run.min); k += e.run.mode==="band" && km>0 && mn>0 ? treadKcal(km, mn, e.run.incline, kg) : km>0 ? distKcal(km, mn, kg) : mn*kg*9.8/60*f; }
  if(e.yoga) k += num(e.yoga.min)*kg*yogaMet(e.yoga)/60*f;
  if(isGym(e.type)){
    const nSets = Object.values(e.sets||{}).reduce((x,a) => x+a.length, 0);
    const tot = Math.min(60, Math.max(((e.end||e.start)-e.start)/60000, nSets*3)), tm = e.tread ? num(e.tread.min) : 0;
    if(e.tread) k += num(e.tread.km)>0 && tm>0 ? treadKcal(num(e.tread.km), tm, e.tread.incline, kg) : tm*kg*(6 + num(e.tread.incline)*.45)/60*f;
    if(e.sets) k += Math.max(0, tot-tm)*kg*5/60*f;
  }
  return Math.round(k/5)*5;
}
function clock(ms){ const s = Math.max(0, Math.floor(ms/1000)); const h = Math.floor(s/3600), m = Math.floor(s%3600/60), x = s%60; return (h? h+":"+String(m).padStart(2,"0") : m)+":"+String(x).padStart(2,"0"); }
const dShort = ts => new Date(ts).toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
function mondayOf(ts){ const d = new Date(ts); d.setHours(0,0,0,0); d.setDate(d.getDate() - (d.getDay()+6)%7); return d.getTime(); }
const WEEK = 7*864e5;
function ago(ts){
  const a = new Date(); a.setHours(0,0,0,0); const b = new Date(ts); b.setHours(0,0,0,0);
  const n = Math.round((a-b)/864e5);
  return n<=0 ? "today" : n===1 ? "yesterday" : n+" days ago";
}
const e1 = (kg,r) => kg>0 && r>0 ? kg*(1+r/30) : 0;
// Volume counts weight × reps; assisted and timed exercises don't add to it
function volOf(e){ let v = 0; Object.entries(e.sets||{}).forEach(([id,a]) => { if(exType(id)==="a" || exType(id)==="t") return; a.forEach(s => v += num(s.r)*num(s.kg)); }); return v; }
function kmOf(e){ return (e.run? num(e.run.km) : 0) + (e.tread? num(e.tread.km) : 0); }
function lastSets(id){ for(let i=S.history.length-1;i>=0;i--){ const a = (S.history[i].sets||{})[id]; if(a && a.length) return a; } return null; }
function lastRun(mode){ for(let i=S.history.length-1;i>=0;i--){ const e = S.history[i]; if(e.run && (!mode || e.run.mode===mode)) return e.run; } return null; }
function lastTread(){ for(let i=S.history.length-1;i>=0;i--){ if(S.history[i].tread) return S.history[i].tread; } return null; }
function toast(t){ const el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2600); }

/* ================= Statistik ================= */
function stats(){
  const H = S.history, now = Date.now(), ws = mondayOf(now), goal = S.settings.goal;
  const weeks = []; for(let i=11;i>=0;i--){ const a = ws - i*WEEK; weeks.push(H.filter(e => e.start>=a && e.start<a+WEEK).length); }
  const thisWeek = weeks[11];
  const typesWeek = new Set(H.filter(e => e.start>=ws).map(e => e.type));
  let streak = 0;
  for(let i = thisWeek>=goal ? 0 : 1; ; i++){
    const a = ws - i*WEEK; const c = H.filter(e => e.start>=a && e.start<a+WEEK).length;
    if(c>=goal) streak++; else break; if(i>520) break;
  }
  const gains = [];
  Object.values(EXN).filter(e => e.type==="w").forEach(ex => {
    const ss = H.filter(e => e.sets && e.sets[ex.id] && e.sets[ex.id].length);
    if(ss.length<2) return;
    const best = a => a.reduce((m,s) => Math.max(m, e1(num(s.kg),num(s.r))), 0);
    const maxKg = a => a.reduce((m,s) => Math.max(m, num(s.kg)), 0);
    const f = best(ss[0].sets[ex.id]); let b = 0, bk = 0;
    ss.forEach(e => { b = Math.max(b, best(e.sets[ex.id])); bk = Math.max(bk, maxKg(e.sets[ex.id])); });
    if(f>0 && b>f) gains.push({n:ex.n, from:maxKg(ss[0].sets[ex.id]), to:bk, pct:Math.round((b-f)/f*100)});
  });
  gains.sort((a,b) => b.pct-a.pct);
  const vol = H.reduce((a,e) => a+volOf(e), 0);
  const km = H.reduce((a,e) => a+kmOf(e), 0);
  const ms = new Date(); ms.setDate(1); ms.setHours(0,0,0,0);
  const kmMonth = H.filter(e => e.start>=ms.getTime()).reduce((a,e) => a+kmOf(e), 0);
  const runs = H.filter(e => e.run && num(e.run.km)>0);
  const alster = runs.filter(e => e.run.mode==="alster" && num(e.run.min)>0);
  const bestAlster = alster.length ? Math.min(...alster.map(e => num(e.run.min))) : 0;
  const paces = runs.map(e => paceOf(num(e.run.km), num(e.run.min))).filter(p => p>0);
  const bestPace = paces.length ? Math.min(...paces) : 0;
  const longest = runs.length ? Math.max(...runs.map(e => num(e.run.km))) : 0;
  const lastBy = {}; H.forEach(e => lastBy[e.type] = e.start);
  const sk = startKeys().filter(t => t!=="yoga");
  let next = sk.find(t => !typesWeek.has(t));
  if(!next) next = sk.slice().sort((a,b) => (lastBy[a]||0)-(lastBy[b]||0))[0];
  // With a personal plan, "next" is the plan's next session (tomorrow's if today is already done)
  const pl = S.settings.plan;
  if(pl && Array.isArray(pl.sessions) && pl.sessions.length && window.NFPlan){
    const tk = dkey(Date.now()), doneToday = H.some(e => dkey(e.start)===tk);
    const ps = NFPlan.nextSession(pl, Date.now() + (doneToday ? 864e5 : 0)); if(ps && W[ps.workout]) next = ps.workout;
  }
  const alsterN = H.filter(e => e.run && e.run.mode==="alster").length;
  return {alsterN, weeks, thisWeek, goal, streak, gains, vol, km, kmMonth, bestAlster, bestPace, longest, lastBy, next, typesWeek, total:H.length};
}
function volumeLine(v){
  if(v<=0) return "";
  if(v<500) return "That's already more than a fridge full of dumbbells.";
  if(v<1500) return "More than a grand piano. Keep it up!";
  if(v<60000){ const c = v/1500; return "That's about "+fmt(c, c<10?1:0)+" cars you've moved."; }
  return "That's about "+fmt(v/6000,0)+" elephants. Amazing.";
}

/* ================= Hauptmenü ================= */
const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const gear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

function ring(done, goal){
  const r = 32, c = 2*Math.PI*r, p = Math.min(1, done/goal);
  return `<svg class="ring" viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--line)" stroke-width="8"/>
  <circle cx="38" cy="38" r="${r}" fill="none" stroke="${p>=1?"var(--good)":"var(--accent)"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c*p} ${c}" transform="rotate(-90 38 38)"/>
  <text x="38" y="44" text-anchor="middle" font-family="Open Sans, sans-serif" font-weight="800" font-size="19" fill="var(--ink)">${done}/${goal}</text></svg>`;
}

/* ================= NOVAFit-Header =================
   Der Header ist immer gleich hoch (kein Verrutschen) und klebt mit negativem top:
   beim Scrollen verschwindet sein oberer Teil, sichtbar bleibt ein Band von hmax bis hmin.
   Wortmarke (N – Balken mit O – VAFit) und Buttons werden pro Frame in diesem Band ausgerichtet. */
const NF_MARK = `<div class="nf-mark" role="img" aria-label="NOVAFit">
  <svg class="nf-n" viewBox="0 0 80 100" aria-hidden="true"><path d="M0 100V0H22L58 60V0H80V100H58L22 40V100Z"/></svg>
  <i class="nf-bar" aria-hidden="true"></i>
  <svg class="nf-o" viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="30.5" fill="none" stroke="#005BAA" stroke-width="19"/></svg>
  <svg class="nf-rest" viewBox="0 0 285 100" aria-hidden="true"><path d="M0 0H23L43 66L63 0H86L54 100H32Z"/><path d="M100 0H122L154 100H131L111 34L91 100H68Z"/><g fill="#000" transform="translate(172 0)"><rect x="0" y="0" width="7" height="100"/><rect x="0" y="0" width="50" height="7"/><rect x="0" y="45" width="42" height="7"/><rect x="64" y="34" width="7" height="66"/><circle cx="67.5" cy="15" r="5.5"/><rect x="94" y="8" width="7" height="92"/><rect x="83" y="34" width="30" height="7"/></g></svg>
</div>`;
const NF = {m:null, raf:0};
const NF_U = 80 + 2*12 + 285;            // Breite ohne Balken, in Einheiten (Versalhöhe = 100)
function nfMount(){
  const h = document.getElementById("nfhead"); if(!h){ NF.m = null; return; }
  const cs = getComputedStyle(document.documentElement), v = n => parseFloat(cs.getPropertyValue(n)) || 0;
  const hmax = v("--nf-hmax"), hmin = v("--nf-hmin");
  const inn = h.querySelector(".nf-in"), ics = getComputedStyle(inn), btns = h.querySelector(".nf-btns");
  const pl = parseFloat(ics.paddingLeft), pr = parseFloat(ics.paddingRight);
  const avail = inn.clientWidth - pl - pr - btns.offsetWidth - 24;
  const fit = avail / (NF_U + 80) * 100;  // Schrift notfalls kleiner, damit nichts kollidiert
  const still = hmax <= hmin;               // reduzierte Bewegung: gleich kompakt, keine Animation
  const lmin = Math.min(v("--nf-lmin"), fit), lmax = still ? lmin : Math.min(v("--nf-lmax"), fit);
  const kx = lmax/100, kn = lmin/100;
  NF.m = { h, x0:pl, hmax, hmin, D:Math.max(0, hmax-hmin), safe:h.offsetHeight - hmax, lmax, lmin,
    barMax: Math.max(80*kx, Math.min(avail - NF_U*kx, 9*lmax)), barMin: 80*kn,
    n:h.querySelector(".nf-n"), bar:h.querySelector(".nf-bar"), o:h.querySelector(".nf-o"), rest:h.querySelector(".nf-rest"), btns };
  nfUpdate();
  h.classList.add("nf-on");
}
function nfUpdate(){
  const m = NF.m; if(!m || !m.h.isConnected) return;
  const lerp = (a, b) => a + (b - a) * p;
  const t = Math.min(Math.max(window.scrollY || 0, 0), m.D), p = m.D > 0 ? t / m.D : 1;
  const k = lerp(m.lmax, m.lmin) / 100, bw = lerp(m.barMax, m.barMin), ob = lerp(82, 28);
  const vis = (ob + 80) * k;                      // sichtbare Höhe: Oberkante O bis Grundlinie
  const dpr = window.devicePixelRatio || 1;
  const B = Math.round((m.safe + t + (m.hmax - t + vis) / 2) * dpr) / dpr;   // Grundlinie im sichtbaren Band
  const xb = m.x0 + 92*k, xr = xb + bw + 12*k;
  m.n.style.transform = `translate(${m.x0}px,${B - 100*k}px) scale(${k})`;
  m.bar.style.transform = `translate(${xb}px,${B - 22*k}px) scale(${bw/100},${k})`;
  m.o.style.transform = `translate(${xb + bw/2 - 40*k}px,${B - (ob + 80)*k}px) scale(${k})`;
  m.rest.style.transform = `translate(${xr}px,${B - 100*k}px) scale(${k})`;
  m.btns.style.transform = `translateY(${t/2}px)`;
}
window.addEventListener("scroll", () => { if(NF.m && !NF.raf) NF.raf = requestAnimationFrame(() => { NF.raf = 0; nfUpdate(); }); }, {passive:true});
window.addEventListener("resize", () => { if(NF.m) nfMount(); });
try{ matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => { if(NF.m) nfMount(); }); }catch(e){}

/* ================= v2.2: Menü, Footer, Fotos, Icons ================= */
/* Campus-Fotos für den großen Kasten oben. Eigene Fotos (Einstellungen → Fotos) haben Vorrang.
   Zum Austauschen: Bilder nach app/img legen und hier eintragen. */
const CAMPUS_PHOTOS = [{url:"img/campus-1.svg"}, {url:"img/campus-2.svg"}];
/* Standard-Fotopaket für Startseite und Rückblicke (img/pack/, siehe img/pack/README.txt).
   Gilt, solange keine eigenen Fotos in den Einstellungen sind. Fehlende Dateien werden übersprungen;
   fehlt das ganze Paket, zeigt die Startseite CAMPUS_PHOTOS und die Rückblicke bleiben ohne Foto.
   pos = Bildausschnitt (wie CSS object-position), damit im Hochformat das Wichtige sichtbar bleibt. */
const PHOTO_PACK = [
  {url:"img/pack/campus-plaza.jpg", pos:"62% 50%"},
  {url:"img/pack/campus-terrace.jpg", pos:"86% 55%"},
  {url:"img/pack/campus-glass-hall.jpg", pos:"62% 55%"},
  {url:"img/pack/gym-cardio.jpg", pos:"40% 60%"},
  {url:"img/pack/gym-weights.jpg", pos:"55% 60%"}
];
let PACK = null;
function packPhotos(){
  return PACK || (PACK = Promise.all(PHOTO_PACK.map(p => new Promise(ok => {
    const im = new Image(); im.onload = () => ok(p); im.onerror = () => ok(null); im.src = p.url;
  }))).then(a => a.filter(Boolean)));
}
// Eigene Fotos haben Vorrang, sonst das Paket
function defaultPhotos(){ return photoUrls().catch(() => []).then(ps => ps.length ? ps : packPhotos()); }
let HERO_STEP = null, REVEALED = false;
const smoothOk = () => !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
const HB_ICON = '<svg viewBox="0 0 30 24" aria-hidden="true"><rect y="1" width="30" height="4.5" fill="currentColor"/><rect y="9.75" width="30" height="4.5" fill="currentColor"/><rect y="18.5" width="30" height="4.5" fill="currentColor"/></svg>';
const pico = d => `<span class="pico" aria-hidden="true"><svg viewBox="0 0 34 30" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg><i></i></span>`;
const PICO = {
  km: pico('<path d="M6 26c4-10 8-14 12-14s6 4 10 4"/><circle cx="8" cy="8" r="4"/><path d="M8 12v5"/>'),
  runde: pico('<ellipse cx="17" cy="16" rx="13" ry="9"/><circle cx="17" cy="7" r="2.5" fill="currentColor"/>'),
  tempo: pico('<circle cx="17" cy="17" r="11"/><path d="M17 17l6-5M14 3h6"/>'),
  kraft: pico('<path d="M4 15h26M7 9v12M11 7v16M23 7v16M27 9v12"/>')
};
const NF_MINI = `<svg class="pf-mark" viewBox="0 -10 469 110" role="img" aria-label="NOVAFit"><path fill="currentColor" d="M0 100V0H22L58 60V0H80V100H58L22 40V100Z"/><rect fill="currentColor" x="92" y="78" width="80" height="22"/><circle cx="132" cy="32" r="30.5" fill="none" stroke="#4d9be6" stroke-width="19"/><g fill="currentColor" transform="translate(184 0)"><path d="M0 0H23L43 66L63 0H86L54 100H32Z"/><path d="M100 0H122L154 100H131L111 34L91 100H68Z"/><g transform="translate(172 0)"><rect x="0" y="0" width="7" height="100"/><rect x="0" y="0" width="50" height="7"/><rect x="0" y="45" width="42" height="7"/><rect x="64" y="34" width="7" height="66"/><circle cx="67.5" cy="15" r="5.5"/><rect x="94" y="8" width="7" height="92"/><rect x="83" y="34" width="30" height="7"/></g></g></svg>`;
/* ================= "You": profile and settings (opened with the button top right) ================= */
function initials(n){ const w = String(n||"").trim().split(/\s+/).filter(Boolean); return ((w[0]||"Y")[0] + (w.length>1 ? w[w.length-1][0] : "")).toUpperCase(); }
function renderMe(){
  const st = stats(), set = S.settings, pr = set.profile || {}, name = pr.name || "You";
  const pct = Math.min(1, st.thisWeek / Math.max(1, st.goal)), C = 2*Math.PI*33;
  const got = BADGES.filter(x => S.badges && S.badges[x.id]).length;
  const row = (attrs, label, val) => `<button class="merow" ${attrs}><span>${label}</span>${val!=null && val!=="" ? `<small>${esc(String(val))}</small>` : ""}<span class="chev" aria-hidden="true">›</span></button>`;
  const grp = (t, rows) => `<section class="megrp"><h2 class="eyeb">${t}</h2><div>${rows}</div></section>`;
  const sp = k => `data-act="setp" data-p="${k}"`;
  const nPh = (PHOTOS||[]).length;
  let h = nfHeadHtml();
  h += `<section class="mehead"><span class="meav" role="img" aria-label="${st.thisWeek} of ${st.goal} sessions this week"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="33" class="trk"/><circle cx="36" cy="36" r="33" class="val" stroke-dasharray="${(C*pct).toFixed(1)} ${C.toFixed(1)}"/></svg><b>${esc(initials(name))}</b></span>
    <div><h1>${esc(name)}</h1><p>Nova SBE${set.plan ? " · " + esc(set.plan.name) : ""}</p><button class="linkbtn" data-act="ob" data-do="edit">Edit profile and plan</button></div></section>`;
  h += countersHtml([[`${st.thisWeek}/${st.goal}`, "this week"], [st.streak, st.streak===1 ? "week in a row" : "weeks in a row"], [got, got===1 ? "badge" : "badges"]]);
  h += grp("You", row(sp("account"), "Account", pr.email || "") + row(sp("profile"), "Profile and body", [num(set.bodyKg)>0 ? fmt(num(set.bodyKg)) + " kg" : "", set.body && set.body.cm ? set.body.cm + " cm" : ""].filter(Boolean).join(" · ")) + row(sp("goal"), "Weekly goal", `${set.goal}×`) + row('data-act="ob" data-do="edit"', "My plan", set.plan ? set.plan.name : "Not set") + row('data-act="runplan"', "Running plan", set.runPlan ? "Active" : "Not set"));
  h += grp("Training", row('data-act="library"', "Exercise library", `${NFEx.LIBRARY.filter(e => !e.hidden).length + customList().length}`) + row('data-act="workouts"', "All workouts", "") + row('data-act="goto" data-id="sec-cal"', "Calendar", "") + row('data-act="goto" data-id="sec-badges"', "Badges", `${got} / ${BADGES.length}`));
  h += grp("Connected", (stravaSettings() ? row(sp("strava"), "Strava", stGet() ? "Connected" : "Not connected") : "") + row(sp("push"), "Notifications", push==="on" ? "On" : "Off") + row(sp("cal"), "Calendar reminders", ""));
  h += grp("App", row(sp("theme"), "Appearance", {auto:"Automatic", light:"Light", dark:"Dark"}[set.theme] || "Automatic") + row(sp("sound"), "Sound", set.restSound===false ? "Off" : "On") + row(sp("weather"), "Running weather", set.wxGeo===true ? "Where I am" : NFRun.WX_HOME.place) + row(sp("photos"), "Your photos", nPh ? `${nPh} ${nPh===1?"photo":"photos"}` : "Nova photos"));
  h += grp("Your data", row('data-act="impsheet"', "Import runs from other apps", "Garmin, Strava, files") + row(sp("data"), "Back up and restore", ""));
  h += footerHtml() + tabBarHtml();
  $("#app").innerHTML = h;
  nfMount();
  if(!PHOTOS) photoUrls().then(ps => { if(ps.length && screen==="me") renderMe(); }).catch(() => {});
}
function footerHtml(){
  return `<footer class="pfoot"><div class="pf-in">${NF_MINI}<div class="pf-cols">
    <div><h4>Training</h4><button data-act="runplan">Running plan</button><button data-act="goto" data-id="sec-cal">Calendar</button><button data-act="goto" data-id="sec-badges">Badges</button></div>
    <div><h4>Data</h4><button data-act="settings">Settings</button><button data-act="export">Create backup</button><button data-act="menutheme">Dark mode ${isDark() ? "off" : "on"}</button></div>
  </div></div></footer>`;
}
/* Abschnitte blenden beim ersten Öffnen sanft ein, wenn sie ins Bild scrollen */
function revealOnce(){
  if(REVEALED) return; REVEALED = true;
  if(!smoothOk() || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.08});
  document.querySelectorAll("#app > section:not(.hero)").forEach(sec => {
    if(sec.getBoundingClientRect().top < window.innerHeight) return;
    sec.classList.add("reveal"); io.observe(sec);
  });
}
window.addEventListener("scroll", () => { const b = document.querySelector(".btt"); if(b) b.classList.toggle("on", window.scrollY > 600); }, {passive:true});

function renderHome(){
  wxLoad();
  const st = stats();
  let h = nfHeadHtml();
  if(TAB==="train") h += trainTabHtml(st);
  else if(TAB==="progress") h += progressTabHtml(st);
  else h += todayTabHtml(st);
  h += footerHtml() + tabBarHtml();
  $("#app").innerHTML = h;
  nfMount();
  if(TAB==="today") heroPhotos();
  revealOnce();
}
// The NOVAFit header: the sign shrinks while scrolling; the button opens "You" (profile and settings)
function nfHeadHtml(){
  return `<header class="nf" id="nfhead"><div class="nf-in">${NF_MARK}
    <div class="topbtns nf-btns"><button class="iconbtn hb" data-act="menu" aria-label="${screen==="me" ? "Close profile and settings" : "You: profile and settings"}" aria-expanded="${screen==="me"}">${HB_ICON}</button></div></div></header>`;
}
const TAB_ICO = {
  today:'<path d="M4 5h16v15H4z"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  train:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
  progress:'<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/>'
};
function tabBarHtml(){
  return `<nav class="tabbar" aria-label="Main">${[["today","Today"],["train","Train"],["progress","Progress"]].map(([k,l]) =>
    `<button data-act="tab" data-t="${k}" aria-current="${screen==="home" && TAB===k ? "page" : "false"}"><svg viewBox="0 0 24 24" aria-hidden="true">${TAB_ICO[k]}</svg>${l}</button>`).join("")}</nav>`;
}
// A row of big numbers, like the research figures on the Nova website
function countersHtml(items){
  return `<div class="counters">${items.map(([n, l, act]) => act
    ? `<button class="ctr" ${act}><b class="tnum">${n}</b><span>${l}</span></button>`
    : `<div class="ctr"><b class="tnum">${n}</b><span>${l}</span></div>`).join("")}</div>`;
}
// Fixed photo per kind of training for the small tiles (your own photos stay on the big card and in reviews)
const KIND_PHOTO = {s:"img/pack/gym-weights.jpg", r:"img/pack/campus-terrace.jpg", y:"img/pack/campus-glass-hall.jpg"};
const kindOfW = t => { const k = (W[t]||{}).kind; return k==="run" ? "r" : k==="yoga" ? "y" : "s"; };
const KIND_LBL = {s:"Strength", r:"Running", y:"Yoga"};
// The next sessions of the plan after today, for "What's next"
function upcoming(n){
  const p = S.settings.plan; if(!p || !Array.isArray(p.sessions) || !p.sessions.length) return [];
  const out = []; let t = Date.now() + 864e5;
  for(let i=0; i<7 && out.length<n; i++, t += 864e5){
    const se = NFPlan.sessionOn(p, t); if(se) out.push(Object.assign({at:t}, se));
  }
  return out;
}
function examNoteHtml(){
  const now = Date.now();
  if(NFYoga.examWeek(now)) return `<button class="note" data-act="study"><span><b>Exam weeks.</b> Take a 5-minute study break at your desk.</span><span aria-hidden="true">›</span></button>`;
  const first = NFYoga.EXAM_WEEKS.map(([a]) => new Date(a + "T00:00").getTime()).filter(t => t > now).sort((a,b) => a-b)[0];
  const days = first ? Math.ceil((first - now)/864e5) : 0;
  return days>0 && days<=21 ? `<button class="note" data-act="study"><span><b>Finals start in ${days} ${days===1?"day":"days"}.</b> 5-minute study breaks are ready.</span><span aria-hidden="true">›</span></button>` : "";
}
function todayTabHtml(st){
  let h = heroHtml(st);
  if(push==="install" && !S.settings.hideInstall){
    h += `<section class="card nudge"><b>Install as an app</b><p class="small muted" style="margin:0">In Safari, tap <b>Share</b> at the bottom and then <b>“Add to Home Screen”</b>. The app then opens full screen and can remind you to train.</p><button class="addset" data-act="hideinstall" style="align-self:flex-end">Hide</button></section>`;
  }else if(push==="off" && !S.settings.hidePush){
    h += `<section class="card nudge"><b>Turn on reminders</b><p class="small muted" style="margin:0">The app reminds you to train on Wednesdays at 18:40, Fridays at 14:00 and Saturdays at 10:00, checks in in the evening if you haven't trained yet, and sends your weekly review on Sundays.</p>
      <div class="row2"><button class="secondary" data-act="hidepush">Later</button><button class="primary" style="height:48px;font-size:17px" data-act="pushon">Allow</button></div></section>`;
  }

  h += weekCardHtml() + recapCardHtml() + yearCardHtml();
  const lr = S.history.filter(e => e.run && num(e.run.km)>0).slice(-1)[0];
  h += countersHtml([
    [`${st.thisWeek}/${st.goal}`, "sessions this week", `data-act="week" data-ws="${mondayOf(Date.now())}" aria-label="This week: ${st.thisWeek} of ${st.goal} sessions. Open weekly review"`],
    lr ? [fmt(num(lr.run.km)), `km on ${WDAY[new Date(lr.start).getDay()]}`] : [fmt(st.kmMonth), "km this month"],
    [st.streak, st.streak===1 ? "week in a row" : "weeks in a row"]
  ]);
  // „Sleep better“: abends ein Hinweis auf Wind down, solange heute noch kein Yoga war
  const hNow = new Date().getHours(), yToday = S.history.some(e => e.yoga && new Date(e.start).toDateString()===new Date().toDateString());
  if(yGoals().includes("sleep") && hNow >= 20 && !yToday && !S.active)
    h += `<section class="card nudge ynudge"><b>Wind down tonight</b><p class="small muted" style="margin:0">For your goal “Sleep better”: quiet stretches on the floor before bed, 10 to 20 minutes.</p><button class="primary yoga" data-act="yogaflow">Start Wind down</button></section>`;
  const up = upcoming(2);
  const tiles = up.length ? up.map(se => `<button class="ntile" data-act="planday" data-d="${se.day}"><img src="${KIND_PHOTO[se.kind]||KIND_PHOTO.s}" alt="" loading="lazy"><span class="nmeta"><span>${KIND_LBL[se.kind]||""}</span><span>${new Date(se.at).toLocaleDateString("en-GB",{weekday:"short", day:"numeric"})}</span></span><b>${esc(se.title)} · ${se.min} min</b></button>`).join("")
    : startKeys().slice(0,2).map(t => `<button class="ntile" data-act="start" data-t="${t}"><img src="${KIND_PHOTO[kindOfW(t)]}" alt="" loading="lazy"><span class="nmeta"><span>${KIND_LBL[kindOfW(t)]}</span><span>${st.lastBy[t] ? "last " + ago(st.lastBy[t]) : "new"}</span></span><b>${esc(W[t].name)}</b></button>`).join("");
  h += `<section class="nextsec"><div class="sechead"><h2 class="sec">What's next</h2><button class="more" data-act="tab" data-t="train">${up.length ? "Full week" : "All sessions"} ›</button></div><div class="ntiles">${tiles}</div>${examNoteHtml()}</section>`;
  const last = S.history.slice(-1)[0];
  if(last){
    const w = W[last.type]; let m = last.yoga ? `${fmt(num(last.yoga.min),0)} min${yogaLabel(last.yoga) ? " " + yogaLabel(last.yoga) : ""}` : last.run ? `${fmt(num(last.run.km))} km · ${hms(num(last.run.min))}` : `${fmt(Math.round(volOf(last)),0)} kg moved`;
    h += `<section><div class="sechead"><h2 class="sec">Last time</h2><button class="more" data-act="tab" data-t="progress">Progress ›</button></div><button class="lastrow" data-act="hist" data-id="${last.id}"><span><small>${KIND_LBL[kindOfW(last.type)]} · ${dShort(last.start)}</small><b>${esc(w.name)} · ${m}</b></span><span aria-hidden="true">›</span></button></section>`;
  }
  return h;
}
function trainTabHtml(st){
  let h = `<section class="tabhead"><p class="eyebrow">Choose your session</p><h1>Train</h1></section>`;
  h += planCardHtml();
  h += `<section><h2 class="sec">Start a session</h2><div class="ttiles">${startKeys().map(t => {
    const w = W[t], last = st.lastBy[t], k = kindOfW(t);
    return `<button class="ttile" data-act="start" data-t="${t}"><img src="${KIND_PHOTO[k]}" alt="" loading="lazy"><span class="nmeta"><span>${KIND_LBL[k]}</span>${t===st.next?`<span class="up">Up next</span>`:""}</span><b>${esc(w.name)}</b><small>${t==="lauf" ? `<span class="wxs" data-wx="short"${WX?"":" hidden"}>${wxShort()}</span>` : last ? "Last done " + ago(last) : "Not done yet"}</small><span class="go">Start ›</span></button>`;
  }).join("")}</div>
  <div class="tlinks"><button class="optrow morew" data-act="workouts"><span>+ <b>More workouts</b> · full body, push, pull, legs or an empty session</span><span>${ALL_W.length - startKeys().length}</span></button>
  <button class="optrow morew" data-act="library"><span>📚 <b>Exercise library</b> · ${NFEx.LIBRARY.filter(e => !e.hidden).length + customList().length} exercises</span><span>›</span></button>
  <button class="optrow morew" data-act="runplan"><span>🏃 <b>Running plan</b> · ${S.settings.runPlan ? "your goal and weeks" : "set a goal"}</span><span>›</span></button>
  <button class="optrow morew" data-act="start" data-t="yoga"><span>🧘 <b>Yoga and short routines</b> · study break, mobility</span><span>›</span></button></div></section>`;
  return h;
}
function progressTabHtml(st){
  let h = `<section class="tabhead"><p class="eyebrow">How it's going</p><h1>Progress</h1></section>`;
  const now = new Date(), mr = recapData(now.getFullYear(), now.getMonth());
  h += countersHtml([[mr.n, `sessions in ${MONTHS[now.getMonth()]}`], [fmt(st.kmMonth), "km this month"], [tons(st.vol), "moved in total"]]);
  // Reviews always reachable here; on Sunday evening they also show up on Today
  const ws = mondayOf(Date.now()), pm = new Date(now.getFullYear(), now.getMonth()-1, 1);
  const rows = [[`data-act="week" data-ws="${ws}"`, "This week", `${st.thisWeek} of ${st.goal} sessions`],
    [`data-act="week" data-ws="${ws-WEEK}"`, "Last week", "and every week before"],
    [`data-act="recap" data-y="${now.getFullYear()}" data-m="${now.getMonth()}"`, `${MONTHS[now.getMonth()]} so far`, "monthly review"],
    [`data-act="recap" data-y="${pm.getFullYear()}" data-m="${pm.getMonth()}"`, `${MONTHS[pm.getMonth()]}`, "monthly review"]];
  const yy = now.getMonth()===0 ? now.getFullYear()-1 : now.getFullYear();
  if(yearData(yy).n) rows.push([`data-act="year" data-y="${yy}"`, `${yy}`, "your year in review"]);
  h += `<section id="sec-reviews"><h2 class="sec">Reviews</h2><div class="revlist">${rows.map(([a, t, sub]) => `<button class="revrow" ${a}><b>${t}</b><span>${sub}</span><span aria-hidden="true">›</span></button>`).join("")}</div></section>`;
  // Stärker geworden + Diagramme
  h += `<section class="pblock c-kraft"><h2 class="sec">Getting stronger</h2><div class="card">${PICO.kraft}`;
  if(st.gains.length){
    h += `<p class="bigline">${esc(st.gains[0].n)} <em>+${st.gains[0].pct} %</em></p><p class="small muted" style="margin:-6px 0 4px">stronger than in your first session</p>`;
  }
  const exs = exIdsWithData();
  if(exs.length){
    h += `<div class="exlist">${exs.map(id => {
      const mt = metricOf(id, seriesFor(id)), vals = mt.vals;
      const g = st.gains.find(x => x.n===EXN[id].n);
      return `<button class="exrow" data-act="chart" data-id="${id}"><span class="n">${esc(EXN[id].n)}<small class="tnum">up to ${fmt(Math.max(...vals))} ${mt.unit}</small></span>${spark(vals)}${g?`<span class="pill good tnum">+${g.pct} %</span>`:`<span class="muted">›</span>`}</button>`;
    }).join("")}</div><p class="small muted" style="margin:0">Tap an exercise to see its curve.</p>`;
  }else{
    h += `<p class="empty">After your first lower or upper body session, your exercises and progress curves show up here.</p>`;
  }
  if(st.vol>0) h += `<p class="small" style="margin:4px 0 0"><b class="tnum">${fmt(Math.round(st.vol),0)} kg</b> moved in total. ${volumeLine(st.vol)}</p>`;
  h += `</div></section>`;

  // Laufen
  h += `<section class="pblock c-run"><h2 class="sec">Running</h2><div class="card"><div class="tiles">
    <div class="tile run">${PICO.km}<small>This month</small><b class="tnum">${fmt(st.kmMonth)} km</b></div>
    <button class="tile run tbtn" data-act="runchart" data-k="alster">${PICO.runde}<small>Best ${esc(LN())}</small><b class="tnum">${st.bestAlster?hms(st.bestAlster):"–"}</b></button>
    <button class="tile run tbtn" data-act="runchart" data-k="pace">${PICO.tempo}<small>Best pace</small><b class="tnum">${st.bestPace?mmss(st.bestPace):"–"}</b></button>
  </div>${runGoalsHtml(st)}<p class="small muted" style="margin:0">Total <b class="tnum" style="color:var(--ink)">${fmt(st.km)} km</b>${st.longest?` · longest run ${fmt(st.longest)} km`:""}</p>${st.alsterN?`<p class="alsterc">🔁 You've run your ${esc(LN())} <b class="tnum">${st.alsterN}×</b>.</p>`:""}</div></section>`;

  // Kalender
  h += flexHtml();
  h += `<section id="sec-cal"><h2 class="sec">Calendar</h2><div class="card" id="calcard">${calendarHtml()}</div>${yearLinkHtml()}</section>`;

  // Abzeichen
  const got = BADGES.filter(x => S.badges && S.badges[x.id]).length;
  h += `<section id="sec-badges"><h2 class="sec">Badges <span class="tnum" style="letter-spacing:0">${got} / ${BADGES.length}</span></h2><div class="card">${nextBadgeHtml()}<div class="badges">${BADGES.map(x => badgeEl(x)).join("")}</div></div></section>`;

  // Verlauf
  const recent = S.history.slice(-8).reverse();
  h += `<section><h2 class="sec">History</h2><div class="card hist">${recent.length ? recent.map(e => {
    const w = W[e.type]; let m = "";
    if(e.yoga) m = `${fmt(num(e.yoga.min),0)} min${yogaLabel(e.yoga) ? " " + yogaLabel(e.yoga) : ""}`;
    else if(e.run) m = `${fmt(num(e.run.km))} km · ${hms(num(e.run.min))}`;
    else m = `${fmt(Math.round(volOf(e)),0)} kg volume`;
    if(e.tread) m += ` · Treadmill ${fmt(num(e.tread.min),0)} min${num(e.tread.incline)?" · "+fmt(num(e.tread.incline))+" %":""}`;
    return `<button class="hrow" data-act="hist" data-id="${e.id}"><span class="dot ${kc(w)}"></span><span><b>${esc(w.name)}</b><small>${dShort(e.start)} · ${m}</small></span><span class="muted">›</span></button>`;
  }).join("") : `<p class="empty">Your sessions show up here once you finish your first one.</p>`}</div></section>`;

  return h;
}

/* ================= Training ================= */
function blank(n){ return Array.from({length:n}, () => ({r:"", kg:"", ok:false})); }
/* Werte vom letzten Training vorausfüllen */
function prefill(id, i, prevRow){
  const last = lastSets(id) || [], p = last[i];
  if(p && num(p.r)>0) return {r:String(num(p.r)), kg:num(p.kg)?fmt(num(p.kg)):"", ok:false};
  if(prevRow && filled(prevRow)) return {r:prevRow.r, kg:prevRow.kg, ok:false};
  if(last.length){ const q = last[last.length-1]; return {r:String(num(q.r)), kg:num(q.kg)?fmt(num(q.kg)):"", ok:false}; }
  return {r:"", kg:"", ok:false};
}
function prefilledSets(ex){ const arr = []; for(let i=0;i<ex.s;i++) arr.push(prefill(ex.id, i, arr[i-1])); return arr; }
function startSession(t, mode){
  const a = {type:t, start:Date.now(), sets:{}, open:{}, tread:null, run:null};
  (W[t].ex||[]).forEach(e => { if(!e.opt) a.sets[e.id] = prefilledSets(e); });
  if(t==="yoga") a.yoga = {min:"", note:"", flow:false};
  if(t==="lauf"){
    a.run = mode==="band" ? {mode:"band", km:"", min:"", note:""} : {mode:"out", km:"", min:"", note:""};
  }
  S.active = a; screen = "session"; rest = null; save(); render(); window.scrollTo(0,0);
}

// Column labels per log type: w = weight × reps, r = reps only, a = assisted, t = time
const COLS = {w:["Reps","Weight"], r:["Reps",""], a:["Reps","Help"], t:["Time",""]};
function setRows(ex){
  const a = S.active, arr = a.sets[ex.id] || [], last = lastSets(ex.id) || [], t = ex.type || "w", u = NFEx.unitOf(ex);
  return arr.map((s,i) => {
    const p = last[i] || last[last.length-1] || {};
    const first = `<div class="field"><input inputmode="${t==="t"?"decimal":"numeric"}" autocomplete="off" id="r-${ex.id}-${i}" data-in="set" data-ex="${ex.id}" data-i="${i}" data-f="r" value="${esc(s.r)}" placeholder="${p.r!=null?esc(p.r):ex.r[1]}" aria-label="${esc(ex.n)} set ${i+1} ${t==="t"?(u==="min"?"minutes":"seconds"):"reps"}"><span class="u">${t==="t"?u:"reps"}</span></div>`;
    const second = t==="w" || t==="a"
      ? `<div class="field"><input inputmode="decimal" autocomplete="off" id="kg-${ex.id}-${i}" data-in="set" data-ex="${ex.id}" data-i="${i}" data-f="kg" value="${esc(s.kg)}" placeholder="${p.kg!=null?esc(fmt(num(p.kg))):""}" aria-label="${esc(ex.n)} set ${i+1} ${t==="a"?"assistance":"weight"}"><span class="u">${t==="a"?"−kg":"kg"}</span></div>`
      : `<span class="nokg">${t==="r"?"bodyweight":""}</span>`;
    return `<div class="setrow ${isDone(s)?"done":filled(s)?"pre":""}" data-row="${ex.id}-${i}">
      ${i>=ex.s?`<button class="rmset" data-act="rmset" data-ex="${ex.id}" data-i="${i}" aria-label="Remove set ${i+1}">−</button>`:`<span class="sn">${i+1}</span>`}
      ${first}${second}
      <button class="tick" data-act="tick" data-ex="${ex.id}" data-i="${i}" aria-label="Set ${i+1} done">✓</button></div>`;
  }).join("");
}

const MORE_ICO = '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>';
// Small drawing of an exercise (end position), else its first letter
function cardPic(e){
  return e && Array.isArray(e.img) && e.img.length && !e.custom
    ? `<span class="pic"><img src="img/ex/${e.id}-${e.img.length}.svg" alt="" loading="lazy"></span>`
    : `<span class="pic lt" aria-hidden="true">${esc(((e && e.n) || "?").charAt(0).toUpperCase())}</span>`;
}
// How often an exercise was done before: the instructions show for the first 3 times, later behind ⋯ › How to
const timesDone = id => S.history.reduce((n, e) => n + (e.sets && e.sets[id] && e.sets[id].length ? 1 : 0), 0);
const allDone = id => { const a = (S.active.sets||{})[id] || []; return a.length>0 && a.every(isDone); };
function exCard(ex, base, pos){
  base = base || ex; pos = pos || {};
  // finished exercises fold into one line (tap to open again)
  if(allDone(ex.id) && !(S.active.unfold||{})[ex.id]){
    const a = S.active.sets[ex.id], top = Math.max(...a.map(x => num(x.kg)));
    return `<button class="exfold" data-act="exunfold" data-ex="${ex.id}" aria-label="${esc(ex.n)}: all sets done, tap to open">${cardPic(ex)}<span class="t"><b>${esc(ex.n.replace(/ \(.*\)$/, ""))}</b> · ${a.length} ${a.length===1?"set":"sets"}${top>0 ? ` · ${fmt(top)} kg` : ""}</span><span class="ok">✓ DONE</span></button>`;
  }
  const last = lastSets(ex.id);
  let ll = "", hint = "";
  if(last){
    ll = `<div class="lastl tnum">Last time: ${last.map(s => setTxt(ex.id, s)).join(" · ")}</div>`;
    const up = upSuggest(ex.id, last, ex);
    if(up){
      const cur = (S.active.sets[ex.id]||[]).filter(x => !isDone(x)), applied = cur.length && cur.every(x => num(x.kg)===up);
      hint = `<div class="hint">💪 You completed all sets last time. Try <b>${fmt(up)} kg</b> today (+${fmt(stepOf(ex.id))} kg).${applied?` <span>✓ applied</span>`:` <button class="linkbtn" data-act="applyup" data-ex="${ex.id}" data-kg="${up}">Apply</button>`}</div>`;
    }
  }
  if(!last && (ex.type||"w")==="w") hint = `<div class="firsthint">First time? Pick a weight you can lift ${String(rangeTxt(ex)).split(/[–-]/).pop()}× cleanly.</div>`;
  const opt = ex.opt, rest = ex.rest>=120 ? "2 min" : ex.rest+" s";
  const menu = `data-act="exmenu" data-ex="${ex.id}" data-base="${base.id}" data-first="${pos.first?1:""}" data-last="${pos.last?1:""}" data-added="${pos.added?1:""}" data-opt="${opt?1:""}"`;
  return `<article class="card ${opt?"opt":""}">
    <div class="exh2">${cardPic(ex)}<span class="nm"><b>${esc(ex.n)}</b><small>${ex.s} × ${rangeTxt(ex)} · rest ${rest}${ex.de?` · ${ex.de}`:""}</small></span>
      <button class="more" ${menu} aria-haspopup="dialog" aria-label="Options for ${esc(ex.n)}">${MORE_ICO}</button></div>
    ${ex.cue && timesDone(ex.id) < 3 ? `<p class="cue">${ex.cue}</p>` : ""}${ll}${hint}
    <div class="colhead"><span>Set</span><span>${COLS[ex.type||"w"][0]}</span><span>${COLS[ex.type||"w"][1]}</span><span></span></div>
    <div class="sets">${setRows(ex)}</div>
  </article>`;
}
// ⋯ per exercise: everything that used to sit under each card
function exMenu(d){
  const ex = EXN[d.ex] || {n:"Exercise"}, it = (act, label, attrs, sub) => `<button class="secondary" data-act="exm" data-go="${act}" ${attrs}>${label}${sub ? `<span class="muted small">${sub}</span>` : ""}</button>`;
  const base = `data-base="${d.base}"`, exa = `data-ex="${d.ex}"`;
  sheet(`<div class="exh2" style="margin-bottom:6px">${cardPic(ex)}<span class="nm"><b>${esc(ex.n)}</b><small>${esc(ex.part || "")}${ex.eq ? " · " + esc(ex.eq) : ""}</small></span></div>
    <div class="exmenu" style="display:flex;flex-direction:column;gap:8px">
    ${it("guide", "How to do it", exa, "pictures and tips")}
    ${it("addset", "Add a set", exa)}
    ${!d.added && altsOf(d.base).length ? it("swap", "Swap exercise", base, "e.g. machine instead") : ""}
    ${d.first ? "" : it("move", "Move up", `${base} data-d="-1"`)}
    ${d.last ? "" : it("move", "Move down", `${base} data-d="1"`)}
    ${d.opt ? it("closeopt", "Skip this exercise", `data-ex="${d.base}"`) : it("rmex", "Remove from today", `${base} data-added="${d.added||""}"`).replace('class="secondary"', 'class="secondary rm"')}
    </div><button class="secondary" data-act="closesheet">Close</button>`);
}

function treadBlock(){
  const a = S.active;
  if(!a.tread) return `<button class="optrow" data-act="opentread"><span>+ <b>Treadmill</b> at the end · optional</span><span>e.g. 30 min</span></button>`;
  const lt = lastTread() || {};
  return `<article class="card opt runcard">
    <div class="exhead"><h3>Treadmill<small>optional finisher</small></h3><div class="target"><b style="color:var(--run)">about 30 min</b></div></div>
    ${lt.min?`<div class="lastl tnum">Last time: ${fmt(num(lt.min),0)} min${num(lt.km)?" · "+fmt(num(lt.km))+" km":""}</div>`:""}
    <div class="rungrid">
      <div><span class="lbl">Duration</span><div class="field"><input inputmode="decimal" id="tr-min" data-in="tread" data-f="min" value="${esc(a.tread.min)}" placeholder="${lt.min?fmt(num(lt.min),0):"30"}" aria-label="Treadmill minutes"><span class="u">min</span></div></div>
      <div><span class="lbl">Distance</span><div class="field"><input inputmode="decimal" id="tr-km" data-in="tread" data-f="km" value="${esc(a.tread.km)}" placeholder="${lt.km?fmt(num(lt.km)):""}" aria-label="Treadmill kilometres"><span class="u">km</span></div></div>
      <div style="grid-column:1/3"><span class="lbl">Incline · number from the display</span><div class="field"><input inputmode="decimal" id="tr-inc" data-in="tread" data-f="incline" value="${esc(a.tread.incline||"")}" placeholder="0" aria-label="Treadmill incline in percent"><span class="u">%</span></div></div>
    </div>
    <div class="exfoot"><button class="addset" data-act="interval" data-target="tread">⏱ Interval timer</button><button class="addset" data-act="closetread">Skip</button></div>
  </article>`;
}

/* ================= Lauf: schnell eintragen ================= */
function alsterKm(){ if(num(S.settings.loopKm)>0) return num(S.settings.loopKm); const lr = lastRun("alster"); return lr && num(lr.km)>0 ? num(lr.km) : NFRun.LOOP_KM; }
function fmtTimeDigits(v){
  const d = String(v||"").replace(/\D/g, "").replace(/^0+(?=\d{3})/, "").slice(0,6);
  if(d.length<=2) return d;
  if(d.length<=4) return d.slice(0,-2) + ":" + d.slice(-2);
  return d.slice(0,-4) + ":" + d.slice(-4,-2) + ":" + d.slice(-2);
}
function runDateTxt(a){ const t = a.runAt || Date.now(); return new Date(t).toLocaleDateString("en-GB", {weekday:"long", day:"numeric", month:"long"}) + (a.runAt ? ", " + new Date(t).toLocaleTimeString("en-GB", {hour:"2-digit", minute:"2-digit"}) : ""); }
function runInfoHtml(){
  const r = S.active.run, min = parseMin(r.min), km = num(r.km), st = stats();
  const isAl = r.mode!=="band" && km>0 && Math.abs(km - alsterKm()) < 1.2, lr = isAl ? lastRun("alster") : lastRun(r.mode);
  const best = isAl ? st.bestAlster : 0;
  const parts = [];
  if(min>0 && km>0) parts.push(`${mmss(min/km)} /km`);
  if(lr && num(lr.min)>0) parts.push(`Last time ${hms(num(lr.min))}`);
  if(!(min>0) && best) parts.push(`Best time ${hms(best)}`);
  let win = "";
  if(min>0 && isAl && best && min < best - 1e-9) win = `<div class="runwin">${rico("race")}<div>New ${esc(LN())} best! ${mmss(best-min)} faster than your previous record.</div></div>`;
  else if(min>0 && lr && num(lr.min)>0 && min < num(lr.min) - 1e-9 && Math.abs(km - num(lr.km)) < .3) win = `<div class="runwin soft">${rico("tempo")}<div>${mmss(num(lr.min)-min)} faster than last time.</div></div>`;
  if(r.mode!=="band" && !(S.active.runAt && S.active.runAt < mondayOf(Date.now()))) win += planHint(km, min);
  return {line:parts.join(" · ") || "Enter the time from your running app.", win};
}
function runBlock(){
  wxLoad();
  const a = S.active, r = a.run, band = r.mode==="band", inf = runInfoHtml(), nx = band ? null : planNext();
  const timeBox = `<label class="runtime" for="run-min"><small>${band ? "Time" : "Your time"}</small><input id="run-min" inputmode="numeric" autocomplete="off" data-in="run" data-f="min" value="${esc(r.min)}" placeholder="00:00" aria-label="Time"><span class="ri tnum" id="runinfo">${inf.line}</span></label>`;
  const kmBox = `<label class="runkm" for="run-km"><small>Distance</small><span><input id="run-km" inputmode="decimal" data-in="run" data-f="km" value="${esc(r.km)}" placeholder="${band?"e.g. 3":"e.g. 7.7"}"><em>km</em></span>${band ? "" : `<button type="button" class="kmchip" data-act="kmalster">${esc(LN())} ${fmt(alsterKm())} km</button>`}</label>`;
  const note = `<details class="runnote"${r.note?" open":""}><summary>+ Add note</summary><textarea id="run-note" data-in="run" data-f="note" placeholder="e.g. easy pace, headwind, lovely sunset …">${esc(r.note)}</textarea></details>`;
  const incBox = `<label class="runkm" for="run-inc"><small>Incline · number from the display</small><span><input id="run-inc" inputmode="decimal" data-in="run" data-f="incline" value="${esc(r.incline||"")}" placeholder="0"><em>%</em></span></label>`;
  if(band) return `<div class="runwrap"><p class="runlead">Enter what the treadmill shows.</p>${kmBox}${timeBox}${incBox}<div id="runwin">${inf.win}</div>
    <button class="secondary" data-act="interval" data-target="run">Start interval timer</button>${note}</div>`;
  return `<div class="runwrap">
    ${nx ? `<div class="plantoday">${rico(nx.type)}<div><small>${nx.today ? "Today per plan" : "Up next in your plan"}</small><b>${esc(nx.label)}</b><span>${esc(nx.desc)}</span></div></div>` : ""}
    <div class="wx1" data-wx="plain"${WX?"":" hidden"}>${wxPlain()}</div>${S.settings.wxGeo===true ? "" : `<button type="button" class="linkbtn small" data-act="wxhere" style="align-self:flex-start">📍 Show the weather where I am</button>`}
    <label class="shotcta"><input type="file" accept="image/*" id="runshot" hidden>${rico("cam")}<span>Upload screenshot</span></label>
    <label class="filebtn"><input type="file" id="runfile" hidden>${rico("watch")}<span><b>Import from your watch</b><small>GPX, FIT or TCX file · also the ZIP from Garmin Connect</small></span></label>
    <details class="runnote filehelp"><summary>How do I get the file?</summary><ul>
      <li><b>Garmin Connect</b> (website): open the run → gear icon → <i>Export Original</i> (ZIP) or <i>Export to GPX</i></li>
      <li><b>Strava</b> (website): open the run → <i>…</i> → <i>Export GPX</i> or <i>Export Original</i></li>
      <li><b>Polar Flow, Coros, Suunto</b>: open the run → <i>Export</i> → GPX or FIT</li>
      <li><b>Apple Watch</b>: export the workout as GPX with an app like HealthFit</li>
    </ul><p class="small muted" style="margin:0">On the phone: save the file to Files, then choose it here.</p></details>
    <p class="orline"><span>or enter it yourself</span></p>
    ${kmBox}${timeBox}<div id="runwin">${inf.win}</div>${note}</div>`;
}

/* ================= Lauf-Welt: Auswahl, Ziel & Plan ================= */
const RSVG = {
  out:`<path d="M5 19c3.5-.5 3-5.5 7-6.5s3.5-6 7-6.5"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="6" r="2"/>`,
  band:`<rect x="3" y="15" width="18" height="4" rx="2"/><path d="M15 15l2.5-9H20"/><circle cx="7" cy="17" r=".6"/>`,
  goal:`<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1" fill="currentColor"/>`,
  cam:`<path d="M4 8.5h3.2L9 6h6l1.8 2.5H20V19H4z"/><circle cx="12" cy="13.3" r="3.4"/>`,
  easy:`<path d="M3 13c3 0 3-3 6-3s3 3 6 3 3-3 6-3"/>`,
  tempo:`<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>`,
  int:`<path d="M5 20v-6M10 20V8M15 20v-9M20 20V5"/>`,
  long:`<path d="M4 18c4 0 4-12 8-12s4 12 8 12"/>`,
  race:`<path d="M6 21V4M6 4h11l-2.5 4L17 12H6"/>`,
  check:`<path d="M5 12.5l4.2 4.2L19 7"/>`,
  watch:`<rect x="6.5" y="6" width="11" height="12" rx="2.5"/><path d="M9 6l.8-3h4.4l.8 3M9 18l.8 3h4.4l.8-3M12 9.5V12l1.8 1.2"/>`,
  fit:`<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>`,
  alster:`<path d="M3 15c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M3 10c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/>`,
  hm:`<circle cx="12" cy="14" r="6"/><path d="M9 3l3 5 3-5"/>`
};
const rico = (k, cls) => `<span class="rico ${cls||""}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${RSVG[k]||RSVG.out}</svg></span>`;
const runName = m => m==="alster" ? LN() : m==="band" ? "Treadmill" : "Run";
const noEmo = s => String(s||"").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]️?/gu, "").replace(/\s+/g, " ").trim();
function wxPlain(){ const w = wxInfo(); return w ? noEmo(`${esc(wxPlace())} ${Math.round(w.t)}° · ${w.v}`) : ""; }

function runSheet(){
  const p = S.settings.runPlan, nx = p ? planNext() : null;
  const lo = [...S.history].reverse().find(e => e.run && e.run.mode!=="band"), lb = [...S.history].reverse().find(e => e.run && e.run.mode==="band");
  const pg = p ? planProgress(p) : null;
  sheet(`<h3>Running</h3>
    <button class="start" data-kind="run" data-act="runout"><span class="stripe"></span><span><b>Outdoor run</b><small>Upload a screenshot or enter it yourself</small><small>${lo?"Last done "+ago(lo.start)+" · "+fmt(num(lo.run.km))+" km":"Not done yet"}</small></span><span class="arrow">›</span></button>
    <button class="start" data-kind="run" data-act="runband"><span class="stripe"></span><span><b>Treadmill at the gym</b><small>Enter km and time from the display</small><small>${lb?"Last done "+ago(lb.start):"Not done yet"}</small></span><span class="arrow">›</span></button>
    ${stravaRow()}
    <button class="start" data-kind="run" data-act="near"><span class="stripe"></span><span><b>Runs near you</b><small>Routes close by, or a loop from where you are</small></span><span class="arrow">›</span></button>
    <button class="start goalc" data-kind="run" data-act="runplan"><span class="stripe"></span><span><b>My running goal</b><small>${p ? esc(planTitle(p)) + (pg.n ? ` · Week ${pg.i+1} of ${pg.n}` : "") : "Set a goal and get your running plan"}</small>${pg && pg.n ? `<span class="gbar"><i style="width:${Math.round(pg.f*100)}%"></i></span>` : ""}</span><span class="arrow">›</span></button>
    ${nx ? `<div class="plantoday">${rico(nx.type)}<div><small>${nx.today ? "Today per plan" : "Up next · " + WDAY[new Date(nx.date).getDay()]}</small><b>${esc(nx.label)}</b></div></div>` : ""}
    <button class="secondary" data-act="closesheet">Cancel</button>`);
}

/* ---- Form & Prognose ---- */
const riegel = (t1, d1, d2) => t1*Math.pow(d2/d1, 1.06);
function runForm(){
  const rs = S.history.filter(e => e.run && e.run.mode!=="band" && num(e.run.km)>=3 && num(e.run.min)>0 && e.start > Date.now()-70*864e5);
  let best = null;
  rs.forEach(e => { const p10 = riegel(num(e.run.min), num(e.run.km), 10); if(!best || p10<best.p10) best = {e, p10, km:num(e.run.km), min:num(e.run.min)}; });
  return best;
}
function predict(d){ const f = runForm(); return f ? riegel(f.min, f.km, d) : 0; }
function planTitle(p){
  if(p.goal==="k10") return `10 km under ${hms(p.target)}`;
  if(p.goal==="hm") return p.target ? `Half marathon under ${hms(p.target)}` : "Finish a half marathon";
  if(p.goal==="alster") return `${LN()} under ${hms(p.target)}`;
  return "Stay fit";
}
function planDist(p){ return p.goal==="k10" ? 10 : p.goal==="hm" ? 21.1 : p.goal==="alster" ? alsterKm() : 0; }

/* ---- Plan berechnen ---- */
function planWeeks(p){
  const ws0 = mondayOf(p.created), ak = alsterKm();
  let n = p.date ? Math.ceil((mondayOf(p.date) + WEEK - ws0)/WEEK) : Math.max(4, Math.ceil((mondayOf(Date.now()) - ws0)/WEEK) + 4);
  n = Math.max(3, Math.min(26, n));
  const f10 = predict(10), cur = f10 ? f10/10 : 6.5;
  const gp = p.goal==="k10" ? p.target/10 : p.goal==="alster" ? p.target/ak : p.goal==="hm" ? (p.target ? p.target/21.1 : riegel(cur*10, 10, 21.1)/21.1) : cur;
  const easy = Math.max(cur, gp) + .55;
  const days = (p.days && p.days.length ? p.days : [2, 0]).slice(0, p.perWeek).sort((a,b) => ((a+6)%7) - ((b+6)%7));
  const W2 = [];
  for(let i=0; i<n; i++){
    const ws = ws0 + i*WEEK, f = n>1 ? i/(n-1) : 1, last = i===n-1, runs = [];
    const tp = p.goal==="hm" ? gp - .1 : cur + (gp-cur)*Math.min(1, f*1.15);
    const longKm = p.goal==="k10" ? Math.round((7 + 4*f)*2)/2 : p.goal==="hm" ? Math.round((8 + 10*Math.min(1, f/.85))*2)/2 : ak;
    const mk = {
      easy:(km) => ({type:"easy", km, pace:easy, label:`Easy · ${fmt(km)} km`, desc:`about ${mmss(easy)} /km, totally relaxed`}),
      tempo:() => ({type:"tempo", km:ak, target:tp*ak, label:`Tempo · ${LN()}`, desc:`Target under ${hms(tp*ak)} (${mmss(tp)} /km)`}),
      int:() => { const r = 4 + Math.round(f*3); return {type:"int", km:6, label:`Intervals · ${r} × 3 min`, desc:`brisk at about ${mmss(Math.max(3.5, gp-.15))} /km, 2 min easy in between`}; },
      long:(km) => ({type:"long", km, pace:easy+.1, label:`Long · ${fmt(km)} km`, desc:`very easy, about ${mmss(easy+.1)} /km`}),
      race:() => p.goal==="alster" ? {type:"race", km:ak, target:p.target, label:`${LN()} test`, desc:`Target under ${hms(p.target)}`} : {type:"race", km:planDist(p), target:p.target, label:p.goal==="hm" ? "Race day · half marathon" : "Race day · 10 km", desc:p.target ? `Target under ${hms(p.target)}` : "Finish and enjoy it"}
    };
    let plan;
    if(p.goal==="fit") plan = p.perWeek===2 ? [mk.easy(5), {...mk.easy(ak), label:`Easy · ${LN()}`}] : [{...mk.easy(ak), label:`Easy · ${LN()}`}];
    else if(last) plan = p.perWeek===2 ? [mk.easy(5), mk.race()] : [mk.race()];
    else if(p.perWeek===2) plan = [i%2===0 ? mk.tempo() : mk.int(), p.goal==="alster" ? {...mk.easy(ak), label:`Easy · ${LN()}`} : mk.long(longKm)];
    else plan = [i%2===0 ? (p.goal==="alster" ? mk.tempo() : mk.long(longKm)) : mk.tempo()];
    plan.forEach((r, j) => {
      const d = days[j] ?? days[days.length-1];
      r.date = ws + ((d+6)%7)*864e5 + 12*3600e3;
      if(r.type==="race" && p.date && p.date>=ws && p.date<ws+WEEK) r.date = p.date;
      runs.push(r);
    });
    runs.sort((a,b) => a.date-b.date);
    const done = S.history.filter(e => e.run && e.run.mode!=="band" && e.start>=ws && e.start<ws+WEEK).sort((a,b) => a.start-b.start);
    runs.forEach((r, j) => { const e = done[j]; if(e){ r.done = e; const km = num(e.run.km), mn = num(e.run.min); r.hit = r.target ? (mn>0 && mn <= r.target + .15) : r.type==="int" ? true : km >= r.km*.85; } });
    W2.push({ws, i, runs});
  }
  return W2;
}
function planProgress(p){
  const W2 = planWeeks(p), now = Date.now(), cw = mondayOf(now);
  let i = W2.findIndex(w => w.ws===cw); if(i<0) i = cw < W2[0].ws ? 0 : W2.length-1;
  return {W:W2, i, n:p.date ? W2.length : 0, f:W2.length>1 ? Math.min(1, (i + (W2[i].runs.filter(r => r.done).length/Math.max(1, W2[i].runs.length)))/W2.length) : 0};
}
function planNext(){
  const p = S.settings.runPlan; if(!p) return null;
  const pg = planProgress(p), today = dkey(Date.now());
  for(let k=pg.i; k<pg.W.length; k++){ const r = pg.W[k].runs.find(x => !x.done && x.date >= mondayOf(Date.now())); if(r) return Object.assign({today:dkey(r.date)===today}, r); }
  return null;
}
function planHint(km, min){
  const nx = planNext(); if(!nx || !(min>0)) return "";
  if(nx.target) return min <= nx.target + .15 ? `<div class="runwin soft">${rico("check")}<div>Plan target reached: ${esc(nx.label)} under ${hms(nx.target)}</div></div>` : `<div class="runwin soft">${rico(nx.type)}<div>The plan for “${esc(nx.label)}” was ${hms(nx.target)}. Good run, you'll get it next time.</div></div>`;
  if(nx.type==="easy" || nx.type==="long"){ const pace = km>0 ? min/km : 0; if(pace && nx.pace && pace < nx.pace - .35) return `<div class="runwin soft">${rico("easy")}<div>That wasn't quite easy – you were faster than planned. Feel free to go slower next time.</div></div>`; return `<div class="runwin soft">${rico("check")}<div>Matches your plan: ${esc(nx.label)}</div></div>`; }
  return `<div class="runwin soft">${rico("check")}<div>Checked off in your plan: ${esc(nx.label)}</div></div>`;
}

/* ---- Laufziel-Screen ---- */
let PLW = null, planAll = false;
const GOALS = [
  ["k10", "10 km in a target time", "e.g. 10 km under 55 minutes", "tempo"],
  ["hm", "Finish a half marathon", "21.1 km, with a plan up to race day", "hm"],
  ["alster", "Faster on your loop", "your usual route, set it under Running goals", "alster"],
  ["fit", "Just stay fit", "Easy running, no pressure", "fit"]
];
function plwDefaults(g){
  const ak = alsterKm(), p10 = predict(10), pa = predict(ak), ph = predict(21.1);
  const r30 = v => Math.max(1, Math.floor(v*2)/2);
  const d = new Date(Date.now() + (g==="hm" ? 12 : 10)*WEEK); const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const target = g==="k10" ? (p10 ? r30(p10-1.5) : 60) : g==="alster" ? (pa ? r30(pa-1.5) : 45) : g==="hm" ? (ph ? r30(ph-2) : 0) : 0;
  return {step:2, goal:g, target:target ? hms(target) : "", date:g==="fit" ? "" : iso, perWeek:2, days:[2, 0]};
}
function renderPlan(){
  const p = S.settings.runPlan;
  let h = `<div class="sbar"><button class="txtbtn" data-act="home">‹ Back</button><div class="ttl"><b>Running goal</b></div><span style="width:64px"></span></div>`;
  if(!p || PLW) h += planWizard();
  else h += planView(p);
  $("#app").innerHTML = h;
}
function planWizard(){
  const w = PLW || {step:1};
  const steps = `<div class="plsteps"><i class="on"></i><i class="${w.step>=2?"on":""}"></i></div>`;
  if(w.step===1) return `<div class="plw">${steps}<h1 class="plh">Your running goal</h1><p class="muted" style="margin:-6px 0 4px">What do you want to work toward?</p>
    ${GOALS.map(g => `<button class="goalopt" data-act="plgoal" data-g="${g[0]}">${rico(g[3])}<span><b>${g[1]}</b><small>${g[2]}</small></span><span class="arrow">›</span></button>`).join("")}</div>`;
  const g = GOALS.find(x => x[0]===w.goal), ak = alsterKm(), dist = w.goal==="k10" ? 10 : w.goal==="hm" ? 21.1 : ak;
  const tgt = parseMin(w.target), pred = w.goal==="fit" ? 0 : predict(dist), f = runForm();
  const weeks = w.date ? Math.round((new Date(w.date).getTime() - Date.now())/WEEK) : 0;
  let info = "";
  if(f) info = `Your current form: <b>${fmt(f.km)} km in ${hms(f.min)}</b>${pred ? ` → ${w.goal==="k10"?"10 km":w.goal==="hm"?"a half marathon":"your loop"} would take about <b>${hms(pred)}</b>.` : "."}`;
  else info = "Once you've uploaded a few runs, the plan adapts to your form.";
  let verdict = "";
  if(pred && tgt){ verdict = tgt >= pred ? " Your goal is well within reach." : tgt >= pred*.94 ? " Very doable with the plan." : " That's ambitious – consider allowing a bit more time."; }
  const warn = [];
  if(w.goal==="hm" && w.perWeek===1) warn.push("For a half marathon, 2 runs per week are recommended.");
  if(w.goal==="hm" && w.date && weeks < 8) warn.push("For a half marathon, plan at least 8–10 weeks.");
  if(w.date && weeks < 3) warn.push("That date is very close – choose at least 3 weeks.");
  const gymDays = Object.keys(trainDays()).map(Number), clash = w.days.filter(d => gymDays.includes(d));
  const order = [1,2,3,4,5,6,0];
  return `<div class="plw">${steps}<h1 class="plh">${g[1]}</h1>
    ${w.goal!=="fit" ? `<div class="plg2">
      <label class="plf"><small>${w.goal==="hm" ? "Wunschzeit (optional)" : "Wunschzeit"}</small><input inputmode="numeric" data-in="plw" data-f="target" value="${esc(w.target)}" placeholder="${w.goal==="hm"?"2:05:00":"55:00"}"></label>
      <label class="plf"><small>${w.goal==="alster" ? "By when (optional)" : "Race day"}</small><input type="date" data-in="plw" data-f="date" value="${esc(w.date)}"></label></div>` : ""}
    ${w.goal!=="fit" ? `<p class="plinfo">${info}${verdict}</p>` : ""}
    <p class="plq">How often do you want to run?</p>
    <div class="plseg">${[1,2].map(n => `<button data-act="plper" data-n="${n}" class="${w.perWeek===n?"on":""}"><b>${n}×</b><small>per week</small></button>`).join("")}</div>
    <p class="plq">On which ${w.perWeek===1?"day":"days"}?</p>
    <div class="pldays">${order.map(d => `<button data-act="plday" data-d="${d}" class="${w.days.includes(d)?"on":""}${gymDays.includes(d)?" gym":""}">${WD[(d+6)%7]}</button>`).join("")}</div>
    <p class="plinfo sm">Gym days are ${gymDays.map(d => WD[(d+6)%7]).join(", ")}.${clash.length ? " On gym days, keep runs short and easy." : " That way running fits in nicely."}</p>
    ${warn.length ? `<p class="plwarn">${warn.join(" ")}</p>` : ""}
    <button class="primary run" data-act="plcreate">Create plan</button>
    <button class="secondary" data-act="plback">‹ Different goal</button></div>`;
}
function planView(p){
  const pg = planProgress(p), W2 = pg.W, cw = W2[pg.i], nw = W2[pg.i+1];
  const dist = planDist(p), pred = dist ? predict(dist) : 0;
  const left = p.date ? Math.max(0, Math.ceil((p.date - Date.now())/WEEK)) : 0;
  const mx = Math.max(...W2.map(w => w.runs.reduce((a,r) => a+r.km, 0)));
  const bars = (p.date ? W2 : W2.slice(Math.max(0, pg.i-6), pg.i+2)).map(w => `<i class="${w.i<pg.i?"d":w.i===pg.i?"c":""}" style="height:${Math.max(18, w.runs.reduce((a,r) => a+r.km, 0)/mx*100)}%"></i>`).join("");
  const row = (r, isCur) => {
    const wd = WD[(new Date(r.date).getDay()+6)%7];
    if(r.done){ const e = r.done; return `<div class="prun done${r.hit?"":" miss"}">${rico(r.hit?"check":r.type, "on")}<div><b>${esc(r.label)}</b><small class="tnum">${WD[(new Date(e.start).getDay()+6)%7]} · ${fmt(num(e.run.km))} km in ${hms(num(e.run.min))}</small></div><em>${r.hit?"done":"ran"}</em></div>`; }
    const nx = isCur && !cw.runs.slice(0, cw.runs.indexOf(r)).some(x => !x.done);
    return `<div class="prun${nx?" next":""}">${rico(r.type)}<div><b>${esc(r.label)}</b><small>${wd} · ${esc(r.desc)}</small></div><em>${nx?"up next":""}</em></div>`;
  };
  const wk = (w, title, cur) => `<section class="card pweek${cur?"":" dim"}"><h3>${title}<span>${cur ? `${w.runs.filter(r => r.done).length} of ${w.runs.length} done` : `${w.runs.length} ${w.runs.length===1?"run":"runs"}`}</span></h3>${w.runs.map(r => row(r, cur)).join("")}</section>`;
  let h = `<div class="plview"><section class="planhd"><small>My running goal</small><h2>${esc(planTitle(p))}</h2>
    <p>${p.date ? `${left} ${left===1?"week":"weeks"} to go` : "no end date"}${pred ? ` · Current forecast: ${hms(pred)}` : ""}</p>
    <div class="pbars">${bars}</div>
    <div class="pfoot"><span>${pg.n ? `Week ${pg.i+1} of ${pg.n}` : `Week ${pg.i+1}`}</span><span>${p.date ? (p.goal==="alster" ? "Test on " : "Race day ") + new Date(p.date).toLocaleDateString("en-GB", {day:"numeric", month:"short"}) : ""}</span></div></section>`;
  h += wk(cw, "This week", true);
  if(nw) h += wk(nw, "Next week", false);
  if(planAll) W2.slice(pg.i+2).forEach(w => h += wk(w, `Week ${w.i+1} · ${weekRange(w.ws)}`, false));
  if(W2.length > pg.i+2 && p.date) h += `<button class="linkbtn plall" data-act="planall">${planAll ? "Show less" : `View all ${W2.length} weeks`}</button>`;
  h += `<button class="primary run" data-act="runout">Log a run</button><div class="row2"><button class="secondary" data-act="planedit">Change goal</button><button class="secondary" data-act="planend">End plan</button></div>
    <p class="small muted" style="margin:0;text-align:center">Runs you upload are checked off automatically. If you miss one, that's okay – the plan just keeps going.</p></div>`;
  return h;
}

/* ================= Strava: Läufe von fast jeder Uhr automatisch übernehmen =================
   Die Anmeldung läuft über die Netlify Function /.netlify/functions/strava (hält das Client Secret).
   Die Zugangsschlüssel liegen nur auf diesem Gerät unter einem eigenen Schlüssel:
   nicht in S, also nicht in Sicherungsdateien und nicht in der Cloud-Synchronisierung. */
const STRAVA_FN = "/.netlify/functions/strava", STRAVA_LS = "novafit-strava", STRAVA_STATE = "novafit-strava-state";
const STRAVA_DAYS = 30;
let STRAVA_CFG;                       // undefined = noch unbekannt, null = auf dieser Seite nicht eingerichtet
function stGet(){ try{ return JSON.parse(localStorage.getItem(STRAVA_LS) || "null"); }catch(e){ return null; } }
function stSet(v){ try{ if(v) localStorage.setItem(STRAVA_LS, JSON.stringify(v)); else localStorage.removeItem(STRAVA_LS); }catch(e){} }
async function stFn(body){
  const r = await fetch(STRAVA_FN, body ? {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)} : {cache:"no-store"});
  const j = await r.json().catch(() => ({}));
  if(!r.ok){ const e = new Error(j.error || "http"); e.status = r.status; throw e; }
  return j;
}
async function stConfig(){
  if(STRAVA_CFG!==undefined) return STRAVA_CFG;
  try{ const c = await stFn(); STRAVA_CFG = c && c.clientId ? c : null; }catch(e){ STRAVA_CFG = null; }
  return STRAVA_CFG;
}
const stOn = () => !!stGet();
async function stConnect(){
  const c = await stConfig();
  if(!c) return shotErr("Strava isn't set up", "This version of NOVAFit can't connect to Strava yet. Import a file from your watch or upload a screenshot instead.");
  const st = Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");
  try{ localStorage.setItem(STRAVA_STATE, st); }catch(e){}
  location.href = NFRun.stravaAuthUrl({clientId:c.clientId, redirect:location.origin + location.pathname, state:st});
}
/* Zurück von Strava: ?code=…&scope=…&state=… */
async function stReturn(){
  const q = new URLSearchParams(location.search);
  if(!q.has("state") || !(q.has("code") || q.has("error"))) return false;
  try{ history.replaceState(null, "", location.pathname + location.hash); }catch(e){}
  let want = null; try{ want = localStorage.getItem(STRAVA_STATE); localStorage.removeItem(STRAVA_STATE); }catch(e){}
  if(!want || q.get("state")!==want){ toast("Strava login expired. Please try again."); return true; }
  if(q.get("error")){ toast("Strava not connected."); return true; }
  if(!NFRun.stravaScopeOk(q.get("scope"))){ shotErr("Strava not connected", "NOVAFit needs permission to view your activities. Connect again and leave “View data about your activities” ticked."); return true; }
  try{
    const t = await stFn({action:"token", code:q.get("code")});
    stSet({access:t.access_token, refresh:t.refresh_token, expires:t.expires_at, name:t.firstname || "", auto:true});
    // kam die Anmeldung von „Bring your training history“? Dann das ganze Jahr zeigen statt 30 Tage
    let year = false; try{ year = localStorage.getItem(HIST_STRAVA)==="1"; localStorage.removeItem(HIST_STRAVA); }catch(e){}
    stLastSync = Date.now();
    if(year) impStravaYear(); else stravaSync(true);
  }catch(e){ shotErr("Strava not connected", "The connection didn't work. Please try again in a moment."); }
  return true;
}
async function stAccess(){
  const t = stGet(); if(!t) throw Object.assign(new Error("unauthorized"), {status:401});
  if(t.expires*1000 > Date.now() + 120000) return t.access;
  const n = await stFn({action:"refresh", refresh_token:t.refresh});
  stSet(Object.assign(t, {access:n.access_token, refresh:n.refresh_token, expires:n.expires_at}));
  return n.access_token;
}
/* Aktivitäten seit `after` (Unix-Sekunden), Seite für Seite. Nach einem abgelaufenen Zugang einmal neu anmelden lassen. */
async function stActs(after, page){
  const call = async () => (await stFn({action:"activities", access_token:await stAccess(), after, page:page||1})).activities || [];
  try{ return await call(); }
  catch(e){
    if(e.status!==401) throw e;
    const t = stGet(); if(t){ t.expires = 0; stSet(t); }
    try{ return await call(); }catch(e2){ if(e2.status===401) stSet(null); throw e2; }
  }
}
/* Neue Läufe der letzten 30 Tage */
async function stNewRuns(){
  return NFRun.stravaNew(S.history, await stActs(Math.floor(Date.now()/1000) - STRAVA_DAYS*86400), alsterKm());
}
function stAdd(list){
  const ids = new Set(S.history.map(e => e.id));
  const add = list.filter(e => !ids.has(e.id));
  if(!add.length) return 0;
  S.history.push(...add); S.history.sort((x, y) => x.start - y.start);
  save(); checkBadges(false); syncTags();
  return add.length;
}
const stErrTxt = e => e && e.status===401 ? "Your Strava connection has ended. Connect again in the run menu."
  : e && e.status===429 ? "Strava is busy right now. Try again in 15 minutes."
  : navigator.onLine===false ? "You're offline." : "Strava can't be reached right now. Try again later.";
/* Beim Öffnen der App: neue Läufe still übernehmen (wenn „automatisch“ an ist), höchstens alle 15 Minuten */
let stLastSync = 0;
async function stravaSync(fromConnect){
  const t = stGet(); if(!t || (!t.auto && !fromConnect) || Date.now()-stLastSync < 15*60000 && !fromConnect) return;
  stLastSync = Date.now();
  try{
    const n = stAdd(await stNewRuns());
    if(n){ toast(`${fromConnect ? "Strava connected ✓ " : ""}Added ${n} ${n===1 ? "run" : "runs"} from Strava 🏃`); if(screen==="home" && !$("#layer").innerHTML) render(); }
    else if(fromConnect) toast("Strava connected ✓ No new runs in the last 30 days.");
  }catch(e){ if(fromConnect) toast("Strava connected ✓ " + stErrTxt(e)); else if(e && e.status===401) toast(stErrTxt(e)); }
}
/* ================= Runs near you: feste Strecken (A) und eine Runde ab hier (B) =================
   A: höchstens 4 Strecken aus run.js (NEARBY_ROUTES), sortiert nach Nähe zur Wetter-Position (auf ~1 km gerundet, sonst Nova SBE).
   B: eine Runde über openrouteservice (netlify/functions/route.mjs). Dafür wird der Standort einmal genauer abgefragt,
      nur für diese Anfrage verwendet und nicht gespeichert. Zusammen nie mehr als 5 Vorschläge. */
const ROUTE_FN = "/.netlify/functions/route";
let ROUTE_OK;                                   // undefined = noch unbekannt
let NEAR = {km:0, seed:1, loop:null, busy:false, err:"", home:false};
async function routeOk(){
  if(ROUTE_OK!==undefined) return ROUTE_OK;
  try{ const r = await fetch(ROUTE_FN, {cache:"no-store"}); ROUTE_OK = r.ok; }catch(e){ ROUTE_OK = false; }
  return ROUTE_OK;
}
const mapsTo = p => `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${p.lat},${p.lon}`;
function nearSheet(){
  const nx = planNext(), target = nx && nx.km>0 ? nx.km : 0, pos = wxPos(), mine = S.settings.wxGeo===true;
  const tk = target ? Math.min(30, Math.max(2, Math.round(target*2)/2)) : 0;   // Länge des nächsten Plan-Laufs
  if(!NEAR.km) NEAR.km = tk || 5;
  const list = NFRun.nearbyRoutes(pos, target, NFRun.MAX_SUGGESTIONS - 1);
  const card = r => `<article class="nearc${r.fits ? " fits" : ""}">
      <div class="nearh"><b>${esc(r.name)}</b>${r.fits ? `<span class="nearfit">Fits your plan</span>` : ""}</div>
      <small class="tnum">about ${fmt(r.km)} km · ${r.away < 0.5 ? "right here" : fmt(r.away) + " km away"}</small>
      <p>${esc(r.desc)}</p>
      <div class="row2"><a class="secondary nearbtn" href="${mapsTo(r.start)}" target="_blank" rel="noopener">Directions</a><button class="secondary nearbtn" data-act="nearstart" data-id="${r.id}">Start this run</button></div></article>`;
  const L = NEAR.loop, shape = L ? NFRun.loopSvg(L.coords, 300, 170, 14) : null;
  const loop = ROUTE_OK===false ? `<p class="small muted" style="margin:0">Needs a one-time setup: a free openrouteservice key in Netlify (see README).</p>`
    : `${L && shape ? `<svg class="nearmap" viewBox="0 0 300 170" role="img" aria-label="Shape of your ${fmt(L.km)} km loop"><path d="${shape.d}"/><circle cx="${shape.start.x}" cy="${shape.start.y}" r="6"/></svg>
        <p class="small" style="margin:0"><b class="tnum">${fmt(L.km)} km loop</b> from ${L.home ? "Nova SBE" : "where you are"}</p>
        <div class="row2"><a class="secondary nearbtn" href="${NFRun.loopMapsUrl(L.coords)}" target="_blank" rel="noopener">Open in Maps</a><button class="secondary nearbtn" data-act="nearstart" data-id="loop">Start this run</button></div>
        <button class="txtbtn" data-act="nearloop" data-seed="next">Show me another loop</button>` : ""}
      <div class="nearkm">${[3, 5, 8, 10].concat(tk && ![3,5,8,10].includes(tk) ? [tk] : []).sort((a,b) => a-b).map(k => `<button data-act="nearkm" data-k="${k}" aria-pressed="${NEAR.km===k}">${fmt(k)} km</button>`).join("")}</div>
      ${NEAR.err ? `<p class="err" role="alert">${esc(NEAR.err)}</p>${NEAR.err.includes("location") ? `<button class="txtbtn" data-act="nearloop" data-home="1">Start at Nova SBE instead</button>` : ""}` : ""}
      <button class="primary run" data-act="nearloop"${NEAR.busy ? " disabled" : ""}>${NEAR.busy ? "Making your loop …" : L ? `Make a new ${fmt(NEAR.km)} km loop` : `Make a ${fmt(NEAR.km)} km loop from here`}</button>
      <p class="small muted" style="margin:0">Uses your location once for this loop. It isn't saved.</p>`;
  sheet(`<h3>Runs near you</h3>
    <p class="small muted" style="margin:0">${mine ? `Near ${esc(wxPlace())}` : `Near Nova SBE · <button class="txtbtn" data-act="nearloc">Use my location</button>`}${target ? ` · your plan: ${esc(nx.label)}` : ""}</p>
    ${list.length ? list.map(card).join("") : `<p class="muted small" style="margin:0">No saved routes close to you yet.</p>`}
    <article class="nearc loopc"><div class="nearh"><b>A loop from here</b></div>${loop}</article>
    <button class="secondary" data-act="closesheet">Close</button>`);
  if(ROUTE_OK===undefined) routeOk().then(() => { if($("#layer .nearc")) nearSheet(); });
}
/* Standort für die Liste: dieselbe Freigabe wie beim Wetter; danach die Liste neu sortieren */
function nearLocate(){
  const t0 = (S.settings.wxPos||{}).t || 0; wxLocate(true);
  let n = 0; const iv = setInterval(() => { n++; const t = (S.settings.wxPos||{}).t || 0;
    if(t!==t0 || n>30){ clearInterval(iv); if($("#layer .nearc")) nearSheet(); } }, 500);
}
const herePos = () => new Promise((res, rej) => {
  if(!navigator.geolocation) return rej(new Error("nogeo"));
  navigator.geolocation.getCurrentPosition(g => res({lat:g.coords.latitude, lon:g.coords.longitude}), rej, {enableHighAccuracy:true, timeout:12000, maximumAge:60e3});
});
async function nearLoop(next, home){
  if(NEAR.busy) return;
  if(!(await routeOk())){ nearSheet(); return; }
  NEAR.busy = true; NEAR.err = ""; if(next) NEAR.seed = NEAR.seed % 99 + 1; nearSheet();
  try{
    let pos;
    if(home) pos = NFRun.WX_HOME;
    else try{ pos = await herePos(); }catch(e){ throw new Error("Couldn't get your location. Allow location for NOVAFit, or start at Nova SBE."); }
    const r = await fetch(ROUTE_FN, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({lat:pos.lat, lon:pos.lon, km:NEAR.km, seed:NEAR.seed})});
    const d = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(d.error==="no_route" ? "There are no foot paths right here. Try a few steps away or another length." : d.error==="rate_limited" ? "Too many loops just now. Try again in a minute." : "The loop couldn't be made right now. Try again later.");
    NEAR.loop = {km:d.km, coords:d.coords, home:!!home};
  }catch(e){ NEAR.err = e.message || "The loop couldn't be made right now."; }
  NEAR.busy = false;
  if($("#layer .nearc")) nearSheet();
}
/* „Start this run“: Lauf draußen öffnen, Distanz und Strecke schon eingetragen */
function nearStart(id){
  const r = id==="loop" ? (NEAR.loop && {name:`${fmt(NEAR.loop.km)} km loop`, km:NEAR.loop.km}) : NFRun.NEARBY_ROUTES.find(x => x.id===id);
  if(!r) return;
  closeSheet();
  if(S.active && S.active.type!=="lauf"){ toast("Finish your open session first."); return; }
  if(!S.active) startSession("lauf", "out");
  const run = S.active.run; run.km = fmt(r.km); run.note = `Route: ${r.name}`;
  save(); screen = "session"; render();
  toast(`${r.name} · have a good run 🏃`);
}

/* ================= Bring your training history: viele Läufe aus anderen Apps auf einmal =================
   Quellen: Garmin-Connect-Liste (CSV), Strava-Archiv (ZIP oder activities.csv), mehrere GPX/FIT/TCX-Dateien,
   oder Strava-Verbindung (ganzes Jahr). Die Logik steckt in run.js (readHistoryCsv, planImport), getestet in tests/history.test.js. */
const HIST_STRAVA = "novafit-hist-strava";
let HI = null;      // laufender Import: {fixed, csvs, otherFixed, badFixed, from, miles, range, walks, noAll, done}
function impChooserHtml(){
  const st = STRAVA_CFG || stOn();
  const card = (icon, title, sub, inner) => `<div class="hsrc">${rico(icon)}<div><b>${title}</b><small>${sub}</small>${inner}</div></div>`;
  const pick = (label, multi) => `<label class="secondary hpick"><input type="file" class="histin" ${multi ? "multiple" : ""} hidden>${label}</label>`;
  return `<div class="hsrcs">
    ${card("watch", "Garmin Connect", "Your activity list as a CSV file", `${pick("Choose CSV file")}
      <details class="runnote"><summary>How do I get it?</summary><ol class="hsteps"><li>Open <b>connect.garmin.com</b> on a computer or in the phone's browser.</li><li><b>Activities → All Activities</b>, filter to <i>Running</i> if you like.</li><li>Scroll down until all runs of this year are loaded.</li><li><b>Export CSV</b> at the top right.</li></ol></details>`)}
    ${card("out", "Strava archive", "The ZIP Strava emails you, or activities.csv from it", `${pick("Choose ZIP or CSV")}
      <details class="runnote"><summary>How do I get it?</summary><ol class="hsteps"><li>Open <b>strava.com</b> → <b>Settings → My Account</b>.</li><li><b>Download or Delete Your Account → Get Started</b>.</li><li><b>Request Your Archive</b>. Strava emails a download link, usually within a few hours.</li><li>Save the ZIP to Files and choose it here.</li></ol></details>`)}
    ${st ? card("check", stOn() ? "Strava · connected" : "Connect Strava", "Gets all your runs since 1 January, no download needed", `<button class="secondary hpick" data-act="histstrava">${stOn() ? "Get this year from Strava" : "Connect and get this year"}</button>`) : ""}
    ${card("fit", "Files from your watch", "GPX, FIT or TCX, choose several at once (Polar, Coros, Suunto …)", pick("Choose files", true))}
  </div>`;
}
function impSheet(){
  sheet(`<h3>Bring your training history</h3><p class="small muted" style="margin:0">Already running with another app? Bring your runs into NOVAFit, so your stats, calendar and badges start where you are. Nothing is uploaded: the files are read on this phone.</p>${impChooserHtml()}<button class="secondary" data-act="closesheet">Close</button>`);
}
/* gepackte Daten entpacken (ZIP-Eintrag mit Methode 0 oder 8, oder .gz) */
async function impUnpack(u8, method){ return method===0 ? u8 : method===8 ? unpack(u8, "deflate-raw") : Promise.reject(new Error("This ZIP is packed in a way NOVAFit can't open. Unpack it first.")); }
const fileBytes = async (f, a, b) => new Uint8Array(await f.slice(a, b).arrayBuffer());
/* Aus einem (auch sehr großen) ZIP nur die Liste der Dateien und die nötigen Einträge lesen */
async function impZip(file, out){
  const end = NFRun.zipEnd(await fileBytes(file, Math.max(0, file.size - 65557), file.size));
  const list = NFRun.zipList(await fileBytes(file, end.cdOffset, end.cdOffset + end.cdSize));
  const read = async e => { const lh = await fileBytes(file, e.lho, e.lho + 30), off = e.lho + NFRun.zipDataOffset(lh); return impUnpack(await fileBytes(file, off, off + e.csize), e.method); };
  const csv = list.find(e => /(^|\/)activities\.csv$/i.test(e.name)) || list.find(e => /\.csv$/i.test(e.name));
  if(csv){ out.csvs.push(new TextDecoder().decode(await read(csv))); return; }
  const acts = list.filter(e => /\.(fit|gpx|tcx)(\.gz)?$/i.test(e.name)).slice(0, 1000);
  if(!acts.length) throw new Error("There is no activity list or activity file in this ZIP.");
  for(const e of acts){ let u8 = await read(e); if(/\.gz$/i.test(e.name)) u8 = await unpack(u8, "gzip"); impActivity(e.name, u8, out); }
}
function impActivity(name, u8, out){
  try{ out.fixed.push(NFRun.fileItem(NFRun.parseActivity(NFRun.fileKind(name, u8), u8), alsterKm())); }
  catch(e){ if(/not a run/.test(e.message)) out.otherFixed++; else out.badFixed++; }
}
async function impFiles(list){
  const files = [...(list||[])]; if(!files.length) return;
  sheet(`<div class="ocrwait"><div class="spin"></div><h3>Reading your history …</h3><p class="muted small" id="histp" style="margin:0">${files.length>1 ? files.length + " files" : esc(files[0].name)}</p></div>`);
  const out = {fixed:[], csvs:[], otherFixed:0, badFixed:0, errors:[]};
  for(let i=0;i<files.length;i++){
    const f = files[i], el = $("#histp"); if(el && files.length>1) el.textContent = `File ${i+1} of ${files.length}`;
    try{
      const head = await fileBytes(f, 0, 600), kind = NFRun.fileKind(f.name, head);
      if(kind==="zip") await impZip(f, out);
      else if(f.size > NFRun.MAX_FILE_MB*1048576) throw new Error("This file is too big. Choose a single activity list or activity file.");
      else if(kind==="gz"){ const u8 = await unpack(await fileBytes(f, 0, f.size), "gzip"); const n = f.name.replace(/\.gz$/i, ""); if(/\.csv$/i.test(n)) out.csvs.push(new TextDecoder().decode(u8)); else impActivity(n, u8, out); }
      else if(kind==="gpx" || kind==="tcx" || kind==="fit") impActivity(f.name, await fileBytes(f, 0, f.size), out);
      else out.csvs.push(await f.text());
    }catch(e){ out.errors.push(`${f.name}: ${e && e.message || "can't be read"}`); }
  }
  // CSV-Dateien jetzt schon prüfen, damit ein falsches Format sofort eine klare Meldung bekommt
  out.csvs = out.csvs.filter((t, i) => { try{ NFRun.readHistoryCsv(t); return true; }catch(e){ out.errors.push(e.message); return false; } });
  if(!out.fixed.length && !out.csvs.length) return impErr(out.errors[0] || "No runs found in the chosen files.", out.otherFixed);
  HI = Object.assign(out, {from: files.length>1 ? `${files.length} files` : files[0].name, miles:false, range:"year", walks:false, noAll:false});
  impPreview();
}
function impErr(msg, other){
  sheet(`<h3>Couldn't import</h3><p class="muted">${esc(msg)}${other ? ` ${other} ${other===1 ? "activity was" : "activities were"} not a run.` : ""}</p><button class="primary run" data-act="histback">Choose another file</button><button class="secondary" data-act="closesheet">Close</button>`);
}
async function impStrava(){
  if(!stOn()){ try{ localStorage.setItem(HIST_STRAVA, "1"); }catch(e){} return stConnect(); }
  impStravaYear();
}
/* Strava: alle Läufe seit 1. Januar bzw. der letzten 12 Monate holen (100 pro Seite) */
async function impStravaYear(){
  sheet(`<div class="ocrwait"><div class="spin"></div><h3>Getting your runs from Strava …</h3><p class="muted small" id="histp" style="margin:0"></p></div>`);
  const after = Math.floor(Math.min(NFRun.rangeStart("year"), NFRun.rangeStart("12m"))/1000), all = [];
  try{
    for(let page=1; page<=20; page++){
      const a = await stActs(after, page); all.push(...a);
      const el = $("#histp"); if(el) el.textContent = `${all.length} activities so far`;
      if(a.length < 100) break;
    }
  }catch(e){ return impErr(stErrTxt(e)); }
  const fixed = NFRun.stravaItems(all, alsterKm());
  HI = {fixed, csvs:[], otherFixed: all.length - fixed.length, badFixed:0, errors:[], from:"Strava", miles:false, range:"year", walks:false, noAll:true};
  impPreview();
}
/* Alle Einträge des laufenden Imports (Garmin-CSV hängt von km/Meilen ab) */
function impAll(){
  const items = HI.fixed.slice(); let other = HI.otherFixed, bad = HI.badFixed, garmin = false;
  HI.csvs.forEach(t => { const r = NFRun.readHistoryCsv(t, {miles:HI.miles, alsterKm:alsterKm()}); items.push(...r.items); other += r.other; bad += r.bad; if(r.source==="garmin") garmin = true; });
  return {items, other, bad, garmin};
}
const impDay = t => new Date(t).toLocaleDateString("en-GB", {day:"numeric", month:"short", year:"numeric"});
function impPreview(){
  const A = impAll(), p = NFRun.planImport(S.history, A.items, {range:HI.range, walks:HI.walks});
  const seg = (act, cur, opts) => `<div class="seg theme" style="grid-template-columns:repeat(${opts.length},1fr)">${opts.map(([k,l]) => `<button data-act="${act}" data-v="${k}" aria-pressed="${cur===k}">${l}</button>`).join("")}</div>`;
  const nb = A.bad + p.noDate, ne = HI.errors.length;
  const skip = [p.dup && `${p.dup} already in NOVAFit`, A.other && `${A.other} ${A.other===1 ? "ride or other sport" : "rides and other sports"} left out`,
    p.outside && `${p.outside} outside the time range`, nb && `${nb} without date, time or distance`, ne && `${ne} ${ne===1 ? "file" : "files"} couldn't be read`].filter(Boolean);
  sheet(`<h3>Your training history</h3><p class="small muted" style="margin:0">From ${esc(HI.from)}</p>
    <div class="hsum"><b class="tnum">${p.add.length}</b> ${p.add.length===1 ? "run" : "runs"} · <b class="tnum">${fmt(p.km)}</b> km<small>${p.add.length ? `${impDay(p.first)} – ${impDay(p.last)}` : "Nothing new in this time range"}</small></div>
    <div><span class="lbl">Time range</span>${seg("histrange", HI.range, [["year", "This year"], ["12m", "Last 12 months"]].concat(HI.noAll ? [] : [["all", "Everything"]]))}</div>
    ${p.walks ? `<label class="hchk"><input type="checkbox" data-act="histwalks"${HI.walks ? " checked" : ""}> Include ${p.walks} ${p.walks===1 ? "walk" : "walks"}</label>` : ""}
    ${A.garmin ? `<div><span class="lbl">Distances in the Garmin file</span>${seg("histunit", HI.miles ? "mi" : "km", [["km", "Kilometres"], ["mi", "Miles"]])}</div>` : ""}
    ${skip.length ? `<ul class="hskip">${skip.map(x => `<li>${x}</li>`).join("")}</ul>` : ""}
    <button class="primary run" data-act="histadd"${p.add.length ? "" : " disabled"}>${p.add.length ? `Add ${p.add.length} ${p.add.length===1 ? "run" : "runs"}` : "Nothing to add"}</button>
    <button class="secondary" data-act="histback">Choose something else</button>`);
}
function impAdd(){
  const p = NFRun.planImport(S.history, impAll().items, {range:HI.range, walks:HI.walks});
  if(!p.add.length) return;
  S.history.push(...p.add); S.history.sort((x, y) => x.start - y.start);
  const fresh = checkBadges(false);
  save(); syncTags();
  HI.done = {n:p.add.length, km:p.km, badges:fresh.length, ids:p.add.map(e => e.id)};
  if(screen==="onboard"){ OB.hist = HI.done; closeSheet(); renderOnboard(); return; }
  render();
  sheet(`<h3>Welcome to your history 🎉</h3><p class="lead" style="margin:0"><b>${p.add.length} ${p.add.length===1 ? "run" : "runs"}</b> · ${fmt(p.km)} km added.</p>
    <p class="muted small" style="margin:0">Your stats, calendar, running plan and reviews now include them.${fresh.length ? ` You also unlocked ${fresh.length} ${fresh.length===1 ? "badge" : "badges"}.` : ""}</p>
    <button class="primary run" data-act="closesheet">Great</button><button class="secondary" data-act="histundo">Undo import</button>`);
}
/* Import rückgängig machen: genau die eben hinzugefügten Einträge entfernen */
function impUndo(){
  const d = HI && HI.done; if(!d) return;
  const ids = new Set(d.ids);
  S.history = S.history.filter(e => !ids.has(e.id));
  save(); syncTags(); HI = null;
  if(screen==="onboard"){ OB.hist = null; closeSheet(); renderOnboard(); } else { closeSheet(); render(); }
  toast(`Import undone, ${d.n} ${d.n===1 ? "run" : "runs"} removed.`);
}

/* Lauf-Menü: Strava von Hand abgleichen und Läufe auswählen */
let ST_LIST = [];
async function stravaSheet(){
  if(!stOn()) return stConnect();
  sheet(`<div class="ocrwait"><div class="spin"></div><h3>Checking Strava …</h3></div>`);
  try{ ST_LIST = await stNewRuns(); }
  catch(e){ return shotErr("Strava", stErrTxt(e)); }
  if(!ST_LIST.length) return sheet(`<h3>All up to date</h3><p class="muted">All your Strava runs from the last ${STRAVA_DAYS} days are already in NOVAFit.</p><button class="primary run" data-act="closesheet">Okay</button>`);
  sheet(`<h3>New on Strava</h3><p class="small muted" style="margin:0">Runs from the last ${STRAVA_DAYS} days that aren't in NOVAFit yet.</p>
    <div class="stlist">${ST_LIST.map((e, i) => `<label class="strow"><input type="checkbox" data-st="${i}" checked><span><b>${fmt(e.run.km, 2)} km · ${hms(e.run.min)}</b><small>${new Date(e.start).toLocaleDateString("en-GB", {weekday:"short", day:"numeric", month:"short"})}, ${new Date(e.start).toLocaleTimeString("en-GB", {hour:"2-digit", minute:"2-digit"})}${e.run.mode==="band" ? " · Treadmill" : e.run.mode==="alster" ? " · " + esc(LN()) : ""}${e.run.note ? " · " + esc(e.run.note) : ""}</small></span></label>`).join("")}</div>
    <button class="primary run" data-act="stadd">Add selected runs</button>
    <button class="secondary" data-act="closesheet">Cancel</button>`);
}
function stravaAddSel(){
  const pick = [...document.querySelectorAll("[data-st]")].filter(c => c.checked).map(c => ST_LIST[+c.dataset.st]).filter(Boolean);
  if(!pick.length){ toast("Select at least one run."); return; }
  const n = stAdd(pick); ST_LIST = []; closeSheet(); render();
  toast(`Added ${n} ${n===1 ? "run" : "runs"} from Strava 🏃`);
}
function stravaRow(){
  if(!STRAVA_CFG && !stOn()) return "";
  const t = stGet();
  return `<button class="start" data-kind="run" data-act="strava"><span class="stripe"></span><span><b>${t ? "Get runs from Strava" : "Connect Strava"}</b><small>${t ? `Connected${t.name ? " as " + esc(t.name) : ""}${t.auto ? " · new runs are added automatically" : ""}` : "Runs from Garmin, Polar, Coros, Apple Watch … come in by themselves"}</small></span><span class="arrow">›</span></button>`;
}
function stravaSettings(){
  if(!STRAVA_CFG && !stOn()) return "";
  const t = stGet();
  return `<div class="card" style="background:var(--bg);border:0"><span class="lbl">Strava</span>
    ${t ? `<p class="small" style="margin:0 0 8px">Connected${t.name ? " as <b>" + esc(t.name) + "</b>" : ""}. Your login stays on this phone and is not part of backups.</p>
      <span class="lbl">Add new runs automatically</span>
      <div class="seg theme">${[["1","On"],["0","Off"]].map(([k,l]) => `<button data-act="stauto" data-v="${k}" aria-pressed="${!!t.auto===(k==="1")}">${l}</button>`).join("")}</div>
      <button class="secondary danger" style="margin-top:10px" data-act="stoff">Disconnect Strava</button>`
    : `<p class="small muted" style="margin:0 0 8px">Connect Strava and runs from your watch come into NOVAFit by themselves. NOVAFit can only read your activities, never change them.</p><button class="secondary" data-act="strava">Connect Strava</button>`}</div>`;
}
async function stravaOff(){
  const t = stGet(); stSet(null);
  if(t) stFn({action:"deauth", access_token:t.access}).catch(() => {});
  toast("Strava disconnected."); settingsSheet();
}

/* ================= Lauf-Screenshot lesen (Texterkennung direkt auf dem Handy) ================= */
const TESS_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
// Subresource Integrity: the browser only runs the file if it is exactly the published 5.1.1
// (hash of dist/tesseract.min.js from the npm package; worker and core are pinned to 5.1.1 by tesseract.js itself)
const TESS_SRI = "sha384-GJqSu7vueQ9qN0E9yLPb3Wtpd7OrgK8KmYzC8T1IysG1bcvxvIO4qtYR/D3A991F";
let OCRW = null, OCRP = null;
function loadScript(src, integrity){ return new Promise((res, rej) => { const s = document.createElement("script"); s.src = src; if(integrity){ s.integrity = integrity; s.crossOrigin = "anonymous"; } s.onload = res; s.onerror = () => { s.remove(); rej(new Error("load")); }; document.head.appendChild(s); }); }
/* Lädt die Texterkennung nur einmal; ein zweiter Aufruf wartet auf denselben Ladevorgang */
function ocrWorker(){
  if(OCRW) return Promise.resolve(OCRW);
  if(!OCRP) OCRP = (async () => {
    if(!window.Tesseract) await loadScript(TESS_URL, TESS_SRI);
    OCRW = await Tesseract.createWorker("eng", 1, {logger: ocrLog});
    return OCRW;
  })().catch(e => { OCRP = null; throw e; });
  return OCRP;
}
function ocrLog(m){
  const el = $("#ocrp"); if(!el || !m || !(m.progress>0)) return;
  const pc = Math.round(m.progress*100) + " %";
  el.textContent = /recogni/i.test(m.status||"") ? `Reading … ${pc}` : `Loading text recognition … ${pc}`;
}
async function shotCanvas(file){
  const url = URL.createObjectURL(file);
  try{
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sc = Math.min(2, 1400/img.naturalWidth), c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth*sc); c.height = Math.round(img.naturalHeight*sc);
    const x = c.getContext("2d"); x.filter = "grayscale(1) contrast(1.4)"; x.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }finally{ URL.revokeObjectURL(url); }
}
/* Die Auswertung des Texts steckt in run.js (NFRun.parseShot) und ist in tests/run.test.js getestet */
let SHOT = null;   // Screenshot, der gerade bestätigt wird: {url, r}
function localDT(t){ return new Date(t - new Date(t).getTimezoneOffset()*60000).toISOString().slice(0,16); }
function shotErr(title, txt){ sheet(`<h3>${title}</h3><p class="muted">${txt}</p><button class="primary run" data-act="closesheet">Enter it myself</button>`); }
function shotDrop(){ if(SHOT && SHOT.url) URL.revokeObjectURL(SHOT.url); SHOT = null; }
async function runShot(file){
  if(!file || !S.active || !S.active.run) return;
  if(file.type && !/^image\//.test(file.type)) return shotErr("Not an image", "Please choose a screenshot (PNG or JPG) from your running app.");
  sheet(`<div class="ocrwait"><div class="spin"></div><h3>Reading screenshot …</h3><p class="muted small" id="ocrp" style="margin:0">${OCRW ? "Just a moment." : "The first time, NOVAFit downloads the text recognition (a few MB). After that it also works offline."}</p><p class="muted small" style="margin:0">The image stays on your phone.</p></div>`);
  let c, w, text;
  try{ c = await shotCanvas(file); }
  catch(e){ return shotErr("Couldn't open the image", "This file can't be read. Take a normal screenshot (PNG or JPG) and try again."); }
  try{ w = await ocrWorker(); }
  catch(e){ return shotErr("Text recognition not available", navigator.onLine===false ? "You're offline. The text recognition has to be downloaded once with internet, after that it works offline." : "The text recognition couldn't be loaded. Check your connection and try again, or enter the run yourself."); }
  try{ text = (await w.recognize(c)).data.text; }
  catch(e){ return shotErr("Couldn't read the image", "Something went wrong while reading the screenshot. Try again or enter the run yourself."); }
  if(!S.active || !S.active.run) return;
  const r = NFRun.parseShot(text);
  shotDrop(); SHOT = {url: URL.createObjectURL(file), r};
  shotConfirm(r ? {km: r.km>0 ? fmt(r.km,2) : "", time: r.min>0 ? hms(r.min) : "", date: r.at ? localDT(r.at) : ""} : {km:"", time:"", date:""}, {});
}
/* ================= Lauf aus einer Datei der Uhr (GPX, TCX, FIT, auch als ZIP) ================= */
async function unpack(u8, format){
  if(typeof DecompressionStream!=="function") throw new Error("Your browser can't unpack this file. Unpack it first and choose the file inside.");
  try{ return new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream(format))).arrayBuffer()); }
  catch(e){ throw new Error("This packed file is damaged. Unpack it first and choose the file inside."); }
}
async function runFile(file){
  if(!file || !S.active || !S.active.run) return;
  if(file.size > NFRun.MAX_FILE_MB*1048576) return shotErr("File too big", `Activity files are usually smaller than 5 MB, this one has ${Math.round(file.size/1048576)} MB. Export a single run.`);
  sheet(`<div class="ocrwait"><div class="spin"></div><h3>Reading file …</h3></div>`);
  let r;
  try{
    let u8 = new Uint8Array(await file.arrayBuffer()), name = file.name, kind = NFRun.fileKind(name, u8);
    if(kind==="zip"){
      const z = NFRun.zipEntry(u8); name = z.name;
      if(z.method===0) u8 = z.data; else if(z.method===8) u8 = await unpack(z.data, "deflate-raw");
      else throw new Error("This ZIP is packed in a way NOVAFit can't open. Unpack it first and choose the file inside.");
      kind = NFRun.fileKind(name, u8);
    }
    if(kind==="gz"){ u8 = await unpack(u8, "gzip"); name = name.replace(/\.gz$/i, ""); kind = NFRun.fileKind(name, u8); }
    r = NFRun.parseActivity(kind, u8);
  }catch(e){ return shotErr("Couldn't import this file", esc(e && e.message || "The file can't be read.")); }
  if(!S.active || !S.active.run) return;
  shotDrop(); SHOT = {src:"file", name:file.name, r};
  shotConfirm({km: r.km>0 ? fmt(r.km,2) : "", time: r.min>0 ? hms(r.min) : "", date: r.at ? localDT(r.at) : ""}, {});
}
/* Erkannte Werte zeigen und bestätigen lassen, statt sie ungefragt zu übernehmen */
function shotConfirm(v, err){
  const r = SHOT && SHOT.r, file = SHOT && SHOT.src==="file";
  const at = v.date ? new Date(v.date).getTime() : 0, dup = NFRun.findDuplicate(S.history, at, num(v.km));
  const miss = !r ? "No run data found in this screenshot. You can fill in the fields yourself."
    : !(r.min>0) ? "The time couldn't be read. Please add it."
    : !(r.km>0) ? "The distance couldn't be read. Add it if you know it." : "";
  const fld = (id, lbl, val, attrs, unit, e) => `<div><label class="lbl" for="${id}">${lbl}</label><div class="field"><input id="${id}" data-in="shot" ${attrs} value="${esc(val)}" aria-invalid="${e?"true":"false"}">${unit?`<span class="u">${unit}</span>`:""}</div><p class="err" role="alert" aria-live="polite">${esc(e||"")}</p></div>`;
  sheet(`<h3>Is this right?</h3>
    <div class="shotok">${SHOT ? `<img src="${SHOT.url}" alt="Your screenshot">` : ""}<div class="shotf">
      ${miss ? `<p class="hint warn">${miss}</p>` : file ? `<p class="small muted" style="margin:0">From <b>${esc(SHOT.name)}</b>${r.name ? ` · ${esc(r.name)}` : ""}. Check the values.</p>` : `<p class="small muted" style="margin:0">Check the values read from your screenshot.</p>`}
      ${dup ? `<p class="hint warn">You already saved a run on ${new Date(dup.start).toLocaleDateString("en-GB", {day:"numeric", month:"short"})}${num(dup.run.km)>0 ? ` (${fmt(num(dup.run.km), 2)} km)` : ""}. Saving it again would count it twice.</p>` : ""}
      ${fld("sh-km", "Distance", v.km, `inputmode="decimal" autocomplete="off" placeholder="e.g. 7.72"`, "km", err.km)}
      ${fld("sh-time", "Time", v.time, `inputmode="numeric" autocomplete="off" placeholder="42:38"`, "", err.time)}
      ${fld("sh-date", "Date · optional", v.date, `type="datetime-local" max="${localDT(Date.now())}"`, "", err.date)}
    </div></div>
    <button class="primary run" data-act="shotuse">Use these values</button>
    <button class="secondary" data-act="shotcancel">Cancel</button>`);
}
function shotUse(){
  const v = {km: $("#sh-km").value, time: $("#sh-time").value, date: $("#sh-date").value};
  const res = NFRun.validateRun(v);
  if(!res.ok){ shotConfirm(v, res.errors); const f = $(res.errors.km ? "#sh-km" : res.errors.time ? "#sh-time" : "#sh-date"); if(f) f.focus(); return; }
  if(!S.active || !S.active.run){ shotDrop(); closeSheet(); return; }
  const run = S.active.run, x = res.value;
  run.min = hms(x.min);
  run.km = x.km>0 ? fmt(x.km, 2) : "";
  if(x.at) S.active.runAt = x.at; else delete S.active.runAt;
  shotDrop(); save(); closeSheet(); renderSession();
  toast(`Added: ${x.km>0 ? fmt(x.km,2)+" km in " : ""}${hms(x.min)} 🏃‍♀️`);
}

/* ================= Yoga: pick a session (sessions in yoga.js) ================= */
const YLEVEL = ["", "Calm", "Medium", "Strong"];
Object.assign(W.yoga, {desc:"Study break, wind down, flow and more",
  intro:"Pick a session below: a 5-minute study break on your chair, a calm wind-down, beginner basics or a sweaty flow. A bell counts down the last 3 seconds and rings at each change, so keep the sound on."});
// Label for a logged yoga session: the session's name, "Vinyasa Flow" for older guided flows, else ""
function yogaLabel(y){
  if(!y) return "";
  const s = y.sid && NFYoga.byId(y.sid);
  return s ? s.n : y.flow ? "Vinyasa Flow" : "";
}
// MET values for calories: calm sessions burn less than a flow
function yogaMet(y){ const s = y && y.sid && NFYoga.byId(y.sid); return s ? [3, 2.5, 3, 3.5][s.level] : y && y.flow ? 3.5 : 3.0; }
const ranToday = () => { const d = new Date().toDateString(); return S.history.some(e => e.run && new Date(e.start).toDateString()===d); };
// Yoga-Ziele aus dem Fragebogen (toes, back, exam, sleep) steuern den Vorschlag mit
const yGoals = () => ((S.settings.answers && S.settings.answers.goals) || []);
const ySuggestWhy = () => NFYoga.suggestWhy(Date.now(), ranToday(), undefined, yGoals());
const ySuggest = () => ySuggestWhy().id;
// Ein passender Vorschlag ist vorausgewählt; sonst die zuletzt gewählte Einheit
function ySid(){ const a = S.active && S.active.yoga; return (a && a.sid) || ySuggest() || S.settings.yogaSid || "vinyasa"; }
function yLen(id){ return id==="vinyasa" ? yogaLen() : NFYoga.lengthFor(id, (S.settings.yogaLens||{})[id]); }
// The steps of a session at its chosen length (vinyasa: the flows taking turns)
function ySteps(id){ return id==="vinyasa" ? NFYoga.expandSun(flowSteps(curFlow())) : NFYoga.stepsFor(id, yLen(id)); }
const yPose = id => { const s = NFYoga.byId(id); return id==="vinyasa" ? "dog" : s.steps[Math.min(2, s.steps.length-1)].pose; };
// "new": instructions and an easier option per pose; "known": just the pose names. Default: new until 5 yoga sessions
const yLevel = () => S.settings.yogaLevel || (S.history.filter(e => e.yoga).length >= 5 ? "known" : "new");
const canSpeak = () => "speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function";
const yVoice = () => S.settings.yogaVoice===true && canSpeak();
// Reads a cue aloud and lowers the music while it speaks
function say(text){
  try{
    if(!text || !canSpeak()) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text), vs = speechSynthesis.getVoices();
    u.lang = "en-GB"; u.rate = .95;
    const v = vs.find(x => /^en[-_]GB/i.test(x.lang)) || vs.find(x => /^en/i.test(x.lang)); if(v) u.voice = v;
    duck(true); u.onend = u.onerror = () => duck(false);
    speechSynthesis.speak(u);
  }catch(e){}
}
// iPhones only allow speech that starts from a tap: speak an empty line right when Start is tapped
function primeVoice(){ if(yVoice()) try{ speechSynthesis.speak(new SpeechSynthesisUtterance("")); }catch(e){} }
const VOICE_ICO = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
function yMeta(s, min){
  const bars = [1,2,3].map(i => `<i class="${i<=s.level?"on":""}"></i>`).join("");
  return `<span class="ymeta"><span>${min} min</span><span>${esc(s.where)}</span><span class="ylvl"><span class="ybars" aria-hidden="true">${bars}</span>${YLEVEL[s.level]}</span></span>`;
}
function yogaBlock(){
  const y = S.active.yoga, sid = ySid(), s = NFYoga.byId(sid), FS = ySteps(sid), FM = stepsMin(FS), sug = ySuggest();
  const n = S.history.filter(e => e.yoga).length;
  // breath-by-breath Sun Salutation steps don't count as separate poses
  const np = FS.filter(x => !x.fix).length, sun = FS.some(x => x.fix) ? " + Sun Salutations, one breath per step" : "";
  const sub = (sid==="vinyasa" ? `Today: ${esc(curFlow().n)} · ` : "") + `${np} poses${sun}`;
  const others = NFYoga.SESSIONS.filter(x => x.id!==sid).map(x => `<button class="yrow" data-act="yogapick" data-id="${x.id}">${poseSvg(yPose(x.id),"thumb")}<span class="ytxt">${x.id===sug?`<span class="ysug">Suggested now</span>`:""}<b>${esc(x.n)}</b><small>${esc(x.desc)}</small>${yMeta(x, x.id==="vinyasa" ? yogaLen() : yLen(x.id))}</span></button>`).join("");
  return `<article class="card yogacard">
    <div class="exhead"><h3>${esc(s.n)}<small>${sid===sug?`${esc(ySuggestWhy().why || "Suggested now")} · `:""}${esc(s.desc)}</small></h3>
      ${y.flow && y.sid===sid?`<span class="pill yoga">✓ done</span>`:""}</div>
    ${yMeta(s, FM)}<p class="small muted" style="margin:0">${sub}</p>
    <button class="primary yoga" data-act="yogago">${y.flow && y.sid===sid?"Start again":"Start"}</button>
    ${s.lens.length>1?`<div class="lenseg" role="group" aria-label="Length" style="grid-template-columns:repeat(${s.lens.length},1fr)">${s.lens.slice().sort((a,b) => a-b).map(m => `<button data-act="yogalen" data-m="${m}" aria-pressed="${yLen(sid)===m}" class="${yLen(sid)===m?"on":""}">${m} min</button>`).join("")}</div>`:""}
    <div><span class="lbl">Level</span><div class="lenseg" role="group" aria-label="Level" style="grid-template-columns:1fr 1fr">${[["new","New to yoga"],["known","I know the poses"]].map(([k,l]) => `<button data-act="yogalevel" data-v="${k}" aria-pressed="${yLevel()===k}" class="${yLevel()===k?"on":""}">${l}</button>`).join("")}</div>
      <p class="small muted" style="margin:6px 0 0">${yLevel()==="new" ? "Every pose explained, with an easier option." : "Just the pose names, less to read."}</p></div>
    ${canSpeak() ? `<button class="yvoice" data-act="yogavoice" aria-pressed="${yVoice()}">${VOICE_ICO}<span>Read the poses aloud</span><b>${yVoice() ? "On" : "Off"}</b></button>` : ""}
    <button class="yvoice" data-act="calmtoggle" aria-pressed="${calmOn()}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg><span>Ask how tense I feel, before and after</span><b>${calmOn() ? "On" : "Off"}</b></button>
    <details class="flowlist"><summary>View sequence</summary><ol>${FS.map((x,i) => `<li>${poseSvg(x.pose,"thumb")}<span>${esc(x.n)}<small>${esc(x.s||"")}</small></span><b class="tnum">${x.d>=60?mmss(x.d/60)+" min":x.d+" s"}</b></li>`).join("")}</ol></details>
  </article>
  <section class="ylist" aria-label="Other yoga sessions"><p class="exn" style="margin:0">Or choose another session</p>${others}</section>
  <article class="card">
    <div class="rungrid"><div><label class="lbl" for="yo-min">Duration</label><div class="field"><input inputmode="decimal" id="yo-min" data-in="yoga" data-f="min" value="${esc(y.min)}" placeholder="${FM}"><span class="u">min</span></div></div>
      <div class="pace" style="background:var(--yoga-soft)"><span>Yoga total</span><b class="tnum" style="color:var(--yoga)">${n}×</b></div></div>
    <p class="small muted" style="margin:0">After the session, the app logs the minutes for you. If you went to a class, enter the duration yourself.</p>
    <div><label class="lbl" for="yo-note">How did you feel?</label><textarea id="yo-note" data-in="yoga" data-f="note" placeholder="e.g. open hips, relaxed, pigeon was tough …">${esc(y.note)}</textarea></div>
  </article>`;
}
/* ---- Tension check: "How tense do you feel?" 1–5 before and after a yoga session or study break ---- */
let CALM = null;
const calmOn = () => S.settings.calmCheck !== false;
// every check with an answer: yoga sessions in the history and study breaks from the home screen
function calmEntries(){
  return S.history.filter(e => e.yoga && e.yoga.calm).map(e => Object.assign({t:e.start}, e.yoga.calm))
    .concat((S.settings.breaks||[]).filter(x => x && typeof x==="object"));
}
function calmScale(was){
  return `<div class="calmscale" role="group" aria-label="1 relaxed, 5 very tense">${[1,2,3,4,5].map(v => `<button data-act="calmpick" data-v="${v}" class="${v===was?"was":""}" aria-label="${v}${v===was?", before":""}">${v===was?`<small>before</small>`:""}${v}</button>`).join("")}</div>
    <div class="calmends"><span>1 · relaxed</span><span>5 · very tense</span></div>`;
}
// before: asks, then cb(answer or null). Skipped right away when the check is turned off.
function askBefore(cb){
  if(!calmOn()){ cb(null); return; }
  CALM = {stage:"before", cb};
  sheet(`<h3>Before you start</h3><p style="margin:0">How tense do you feel right now?</p>${calmScale(0)}
    <button class="secondary" data-act="calmskip">Skip</button><button class="txtbtn" data-act="calmoff" style="align-self:center">Don't ask me again</button>`);
}
// after: only when there was an answer before; cb(answer) then shows the result
function askAfter(b, cb){
  if(!NFYoga.validTension(b)){ cb(null); return; }
  CALM = {stage:"after", cb, b};
  sheet(`<h3>Done. How tense do you feel now?</h3>${calmScale(b)}<button class="secondary" data-act="calmskip">Skip</button>`);
}
// pending: the answer of a yoga session that isn't saved to the history yet
function calmResult(b, a, pending){
  const st = NFYoga.tension(calmEntries().concat(pending ? [{t:Date.now(), b, a}] : []).filter(x => x.t > Date.now() - 60*864e5));
  sheet(`<h3>${esc(NFYoga.tensionText(b, a))}</h3>
    ${st && st.n>=2 ? `<div class="calmstat"><span><b class="tnum">${st.n}</b><small>checks in the last 60 days</small></span><span><b class="tnum">${fmt(st.before)} → ${fmt(st.after)}</b><small>average tension, before → after</small></span></div>` : `<p class="small muted" style="margin:0">After a few sessions you'll see your average here and in your monthly review.</p>`}
    <button class="primary yoga" data-act="closesheet">Done</button>`);
}
function startYoga(){ askBefore(b => runYoga(b)); }
function runYoga(before){
  const startedAt = Date.now(), sid = ySid(), s = NFYoga.byId(sid), FS = ySteps(sid), FM = stepsMin(FS);
  startTimer({title:s.n, flow:sid==="vinyasa" ? curFlow().n : `${FM} min`, calm:true, prep:true, steps:FS.map(x => Object.assign({c:"yoga"}, x)),
    onDone:() => {
      if(sid==="vinyasa") S.settings.yogaFlow = ((S.settings.yogaFlow||0) + 1) % YOGA_FLOWS.length;
      if(S.active && S.active.yoga){ Object.assign(S.active.yoga, {flow:true, sid, min:String(FM)}); }
      save(); if(S.active && S.active.yoga) renderSession();
      askAfter(before, a => {
        if(a==null){ toast(sid==="study" ? "Done. Back to the books." : "Namaste. Session done."); return; }
        if(S.active && S.active.yoga){ S.active.yoga.calm = {b:before, a}; save(); }
        calmResult(before, a, true);
      });
    },
    onStop:() => { const m = Math.round((Date.now()-startedAt)/60000); if(S.active && S.active.yoga && m>0 && !String(S.active.yoga.min).trim()){ S.active.yoga.min = String(m); save(); renderSession(); } }});
}
// Study break from the home screen or a push message: no session clock, doesn't count as a workout
function startStudyBreak(){ askBefore(b => runStudyBreak(b)); }
function runStudyBreak(before){
  const FS = NFYoga.stepsFor("study", yLen("study"));
  startTimer({title:"Study break", flow:`${stepsMin(FS)} min at your desk`, calm:true, prep:true, steps:FS.map(x => Object.assign({c:"yoga"}, x)),
    onDone:() => {
      const log = a => { S.settings.breaks = (S.settings.breaks||[]).concat([a==null ? {t:Date.now()} : {t:Date.now(), b:before, a}]).slice(-300); save(); if(screen==="home") renderHome(); };
      askAfter(before, a => { log(a); if(a==null) toast("Done. Back to the books."); else calmResult(before, a); });
    }});
}

function restBar(){
  if(!rest) return "";
  const left = Math.max(0, rest.end - Date.now());
  return `<div class="rest" id="rest"><b id="restT">${clock(left)}</b><span class="track"><i id="restI" style="width:${left/rest.total*100}%"></i></span><button data-act="skiprest">End rest</button></div>`;
}

function progData(){
  const a = S.active; if(!a || W[a.type].kind!=="gym") return null;
  const pl = sessList().filter(e => !e.opt || a.open[e.id]);
  let done = 0, all = 0;
  pl.forEach(e => { const arr = a.sets[eff(e).id] || []; done += arr.filter(isDone).length; all += arr.length; });
  return {done, all};
}
function updProg(){
  const p = progData(), bar = document.getElementById("sprogbar"), t = document.getElementById("sprogtxt"); if(!p || !bar) return;
  bar.style.width = (p.all ? p.done/p.all*100 : 0) + "%";
  t.textContent = ` · ${p.done} of ${p.all} sets`;
}
function renderSession(){
  const a = S.active, w = W[a.type], pd = progData();
  let h = `<div class="sbar"><button class="txtbtn" data-act="home">‹ Menu</button>
    <div class="ttl"><b>${w.kind==="run" && a.run && a.run.mode==="band" ? "Treadmill" : w.name}</b>${w.kind==="run" ? `<span>${runDateTxt(a)}` : `<span><span class="tnum" data-elapsed>${elapsedTxt(a)}</span>`}${pd?`<span class="tnum" id="sprogtxt"> · ${pd.done} of ${pd.all} sets</span>`:""}</span></div>
    <button class="txtbtn r" data-act="sessopts" aria-haspopup="dialog">Reset</button>${pd?`<i class="sprog" id="sprogbar" style="width:${pd.all?pd.done/pd.all*100:0}%"></i>`:""}</div>`;
  if(w.intro) h += `<p class="intro ${kc(w)}">${w.intro}</p>`;
  if(w.kind==="gym" && warmFor(a.type)){
    h += a.warm ? `<div class="warmdone">✓ Warmed up</div>`
      : `<article class="card warmcard"><div class="exhead"><h3>Warm-up<small>5 minutes, guided with a timer</small></h3><button class="primary" style="width:auto;height:44px;padding:0 18px;font-size:17px" data-act="warmup">Start</button></div>
         <p class="cue">${warmFor(a.type).map(x => x.n).join(" · ")}</p><button class="addset" data-act="warmskip" style="align-self:flex-start">Already warmed up</button></article>`;
  }
  if(w.kind==="yoga"){ h += yogaBlock(); }
  else if(w.kind==="run"){ h += runBlock(); }
  else{
    const pl = planEx(a.type).filter(e => !(a.hidden||[]).includes(e.id)), mains = pl.filter(e => !e.opt);
    mains.forEach(e => {
      const x = eff(e);
      if(!a.sets[x.id]){
        const alt = altsOf(e.id).find(q => a.sets[q.id]);
        if(alt){ a.swap = a.swap || {}; a.swap[e.id] = alt.id; }
        else a.sets[x.id] = prefilledSets(x);
      }
    });
    mains.forEach((e,i) => h += exCard(eff(e), e, {first:i===0, last:i===mains.length-1}));
    (a.added||[]).forEach(id => { const x = addedEx(id); if(!x) return; if(!a.sets[id]) a.sets[id] = prefilledSets(x); h += exCard(x, x, {first:true, last:true, added:true}); });
    if(!mains.length && !(a.added||[]).length) h += `<p class="empty">No exercises yet. Add the first one from the library.</p>`;
    h += `<button class="addex" data-act="addex">+ Add exercise</button>`;
    const opts = pl.filter(e => e.opt), openOpts = opts.filter(e => a.open[e.id]);
    if(opts.length){
      h += `<div style="display:flex;flex-direction:column;gap:8px">`;
      opts.forEach(e => {
        if(a.open[e.id]){ const k = openOpts.indexOf(e); h += exCard(eff(e), e, {first:k===0, last:k===openOpts.length-1}); }
        else h += `<button class="optrow" data-act="openopt" data-ex="${e.id}"><span>+ <b>${esc(e.n)}</b> · optional</span><span>${e.s} ${e.s===1?"set":"sets"}</span></button>`;
      });
      h += treadBlock() + `</div>`;
    }else h += treadBlock();
  }
  $("#app").innerHTML = h + `<div class="bottombar"><div class="in" id="bb">${restBar()}<button class="primary ${kc(w)}" data-act="finish">${w.kind==="run"?"Save run":"Finish session"}</button></div></div>`;
}

function updateBottom(){ const bb = $("#bb"); if(!bb) return; const w = W[S.active.type]; bb.innerHTML = restBar() + `<button class="primary ${kc(w)}" data-act="finish">${w.kind==="run"?"Save run":"Finish session"}</button>`; }

function tick(exId, i){
  const a = S.active, s = a.sets[exId][i], ex = curEx(exId);
  const last = lastSets(exId) || [], p = last[i] || last[last.length-1];
  const row = document.querySelector(`[data-row="${exId}-${i}"]`);
  if(isDone(s)){ s.ok = false; row.classList.remove("done"); row.classList.toggle("pre", filled(s)); save(); return; }
  if(!filled(s)){
    if(p && num(p.r)>0){ s.r = String(p.r); if(String(s.kg).trim()==="") s.kg = fmt(num(p.kg)); }
    else{ row.classList.remove("shake"); void row.offsetWidth; row.classList.add("shake"); const inp = document.getElementById(`r-${exId}-${i}`); inp && inp.focus(); return; }
    document.getElementById(`r-${exId}-${i}`).value = s.r;
    const kgIn = document.getElementById(`kg-${exId}-${i}`); if(kgIn) kgIn.value = s.kg;
  }
  s.ok = true; row.classList.remove("pre"); row.classList.add("done");
  if(document.activeElement) document.activeElement.blur();
  rest = {end:Date.now() + ex.rest*1000, total:ex.rest*1000};
  restAudio(); updateBottom(); save();
}

/* ================= Während des Trainings: Bildschirm an, Ton nach der Pause =================
   Der Bildschirm bleibt vom Start bis zum Ende an (Wake Lock, kommt nach einem App-Wechsel wieder).
   Am Pausenende kurzer Doppelton auf allen Handys (iPhones können aus dem Browser nicht vibrieren),
   dazu Vibration, wo es geht. Der Ton lässt sich in den Einstellungen ausschalten.
   Hinweis: Steht das iPhone auf lautlos, bleibt auch der Ton stumm. */
let SWL = null, RAC = null;
async function keepAwake(on){
  try{
    if(on && !SWL && navigator.wakeLock && document.visibilityState==="visible"){
      SWL = await navigator.wakeLock.request("screen"); SWL.addEventListener("release", () => { SWL = null; });
    } else if(!on && SWL){ const l = SWL; SWL = null; await l.release(); }
  }catch(e){ SWL = null; }
}
document.addEventListener("visibilitychange", () => { if(document.visibilityState==="visible" && screen==="session" && S.active) keepAwake(true); });
// Browsers only allow sound after a tap, so the audio is set up when a set is ticked
function restAudio(){ try{ RAC = RAC || new (window.AudioContext || window.webkitAudioContext)(); if(RAC.state==="suspended") RAC.resume(); }catch(e){} }
function restBeep(){
  if(S.settings.restSound===false || !RAC) return;
  try{
    const t = RAC.currentTime;
    [[880, 0], [1175, .2]].forEach(([f, d]) => {
      const o = RAC.createOscillator(), g = RAC.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t+d); g.gain.exponentialRampToValueAtTime(.4, t+d+.02); g.gain.exponentialRampToValueAtTime(.0001, t+d+.28);
      o.connect(g); g.connect(RAC.destination); o.start(t+d); o.stop(t+d+.32);
    });
  }catch(e){}
}
function restOver(){
  rest = null; updateBottom(); restBeep();
  try{ navigator.vibrate && navigator.vibrate([200,100,200]); }catch(e){}
  toast("Rest over, next set!");
  // bring the next open set into view
  const nx = [...document.querySelectorAll('[data-act="tick"]')].find(b => !b.closest(".done"));
  if(nx){ const r = nx.getBoundingClientRect(); if(r.top < 70 || r.bottom > innerHeight - 150) nx.scrollIntoView({block:"center", behavior:"smooth"}); }
}

/* ================= Beenden & Zusammenfassung ================= */
function buildEntry(withPending){
  const a = S.active, now = Date.now(), e = {id:"s"+a.start, type:a.type, start:a.start, end:isGym(a.type) ? Math.min(now, a.start+GYM_MAX) : now};
  if(isGym(a.type) && now-a.start>GYM_MAX) e.capped = true;
  const sets = {};
  Object.keys(a.sets).forEach(id => {
    const d = a.sets[id].filter(x => isDone(x) || (withPending && filled(x))).map(s => ({r:num(s.r), kg:num(s.kg)}));
    if(d.length) sets[id] = d;
  });
  if(Object.keys(sets).length) e.sets = sets;
  if(a.tread && (parseMin(a.tread.min)>0 || num(a.tread.km)>0)){ e.tread = {min:parseMin(a.tread.min), km:num(a.tread.km)}; if(num(a.tread.incline)>0) e.tread.incline = num(a.tread.incline); }
  if(a.yoga && num(a.yoga.min)>0){ e.yoga = {min:num(a.yoga.min), flow:!!a.yoga.flow, note:String(a.yoga.note||"").trim()}; if(a.yoga.flow && a.yoga.sid) e.yoga.sid = a.yoga.sid; if(a.yoga.calm && NFYoga.validTension(a.yoga.calm.b) && NFYoga.validTension(a.yoga.calm.a)) e.yoga.calm = {b:a.yoga.calm.b, a:a.yoga.calm.a}; }
  if(a.run && (num(a.run.km)>0 || parseMin(a.run.min)>0)){
    let md = a.run.mode; if(md==="out" || md==="alster") md = num(a.run.km)>0 && Math.abs(num(a.run.km) - alsterKm()) < 1.2 ? "alster" : "out";
    e.run = {mode:md, km:num(a.run.km), min:parseMin(a.run.min), note:String(a.run.note||"").trim()};
    if(md==="band" && num(a.run.incline)>0) e.run.incline = num(a.run.incline);
    const d = e.run.min*60000;
    if(a.runAt){ e.start = a.runAt; e.end = a.runAt + d; }
    else if(d>0){ e.start = Math.min(a.start, now - d); e.end = now; }
  }
  return e;
}
function buildSummary(e){
  const prior = S.history, ups = [];
  const prevOf = id => { for(let i=prior.length-1;i>=0;i--){ const a = (prior[i].sets||{})[id]; if(a && a.length) return a; } return null; };
  const plural = (n, one, many) => n===1 ? one : many;
  Object.keys(e.sets||{}).forEach(id => {
    const now = e.sets[id], prev = prevOf(id), ex = EXN[id] || {n:id}, chips = [], ty = exType(id);
    if(ty==="t" || ty==="a"){
      // Time: longer is better. Assisted: less help is better.
      const val = a => ty==="t" ? Math.max(...a.map(s => num(s.r))) : Math.min(...a.map(s => num(s.kg)));
      let rec = false;
      if(prev){
        const d = val(now) - val(prev);
        if(ty==="t" && d>0) chips.push(`+${fmt(d)} ${exUnit(id)} longer`);
        if(ty==="a" && d<0) chips.push(`${fmt(-d)} kg less help <span>(${fmt(val(prev))} → ${fmt(val(now))} kg)</span>`);
        const rn = now.reduce((x,s) => x+s.r, 0), rp = prev.reduce((x,s) => x+num(s.r), 0);
        if(ty==="a" && val(now)<=val(prev) && rn>rp) chips.push(`+${rn-rp} ${plural(rn-rp,"rep","reps")}`);
        const all = prior.filter(p => p.sets && p.sets[id] && p.sets[id].length).map(p => val(p.sets[id]));
        rec = all.length>0 && (ty==="t" ? val(now)>Math.max(...all) : val(now)<Math.min(...all));
      }
      if(chips.length || rec) ups.push({n:ex.n, chips, rec});
      return;
    }
    const mk = Math.max(...now.map(s => s.kg)), be = Math.max(...now.map(s => e1(s.kg,s.r)));
    let pm = -1, pe = -1;
    prior.forEach(p => (p.sets&&p.sets[id]||[]).forEach(s => { pm = Math.max(pm, num(s.kg)); pe = Math.max(pe, e1(num(s.kg),num(s.r))); }));
    const rec = mk>0 && pm>=0 && (mk>pm || (pe>0 && be>pe+0.01));
    if(prev){
      const pk = Math.max(...prev.map(s => num(s.kg)));
      if(mk>pk) chips.push(`+${fmt(mk-pk)} kg <span>(${fmt(pk)} → ${fmt(mk)} kg)</span>`);
      const rn = now.reduce((a,s) => a+s.r, 0), rp = prev.reduce((a,s) => a+num(s.r), 0);
      if(mk>=pk && rn>rp) chips.push(`+${rn-rp} ${plural(rn-rp,"rep","reps")}`);
      if(now.length>prev.length){ const d = now.length-prev.length; chips.push(`+${d} ${plural(d,"set","sets")}`); }
    }
    if(chips.length || rec) ups.push({n:ex.n, chips, rec});
  });
  if(e.run){
    const pr = [...prior].reverse().find(p => p.run && p.run.mode===e.run.mode && num(p.run.km)>0);
    const chips = []; let rec = false;
    const p = paceOf(e.run.km, e.run.min);
    if(pr){
      const pp = paceOf(num(pr.run.km), num(pr.run.min));
      if(p && pp && p<pp){ const sec = Math.round((pp-p)*60); if(sec>0) chips.push(`${sec} s/km faster <span>(${mmss(pp)} → ${mmss(p)})</span>`); }
      if(e.run.km>num(pr.run.km)) chips.push(`+${fmt(e.run.km-num(pr.run.km))} km further`);
    }
    if(e.run.mode==="alster" && e.run.min>0){
      const prev = prior.filter(x => x.run && x.run.mode==="alster" && num(x.run.min)>0).map(x => num(x.run.min));
      if(prev.length && e.run.min<Math.min(...prev)){ rec = true; chips.push(`Fastest ${LN()}: ${hms(e.run.min)}`); }
    }
    const prevKm = prior.filter(x => x.run).map(x => num(x.run.km));
    if(prevKm.length && e.run.km>Math.max(...prevKm)){ rec = true; chips.push(`Longest run: ${fmt(e.run.km)} km`); }
    if(chips.length) ups.push({n:runName(e.run.mode), chips, rec});
  }
  if(e.tread){
    const pt = [...prior].reverse().find(p => p.tread);
    if(pt && e.tread.min>num(pt.tread.min)) ups.push({n:"Treadmill", chips:[`+${fmt(e.tread.min-num(pt.tread.min),0)} min longer`], rec:false});
  }
  const lastSame = [...prior].reverse().find(p => p.type===e.type);
  const vol = volOf(e), lv = lastSame ? volOf(lastSame) : 0;
  if(!e.run && lv>0 && vol>lv) ups.push({n:"Total volume", chips:[`+${Math.max(1,Math.round((vol-lv)/lv*100))} % <span>(${fmt(Math.round(lv),0)} → ${fmt(Math.round(vol),0)} kg)</span>`], rec:false});
  const nSets = Object.values(e.sets||{}).reduce((a,x) => a+x.length, 0);
  const ws = mondayOf(Date.now());
  const weekCount = prior.filter(p => p.start>=ws).length + 1;
  return {e, ups, first:!lastSame, vol, lv, nSets, weekCount, played:false};
}
function pendingCount(){ let n = 0; Object.values(S.active.sets||{}).forEach(a => a.forEach(x => { if(!isDone(x) && filled(x)) n++; })); return n; }
// Which sets are still open, for the finish dialog: "Shoulder Press set 2 and 3"
function pendingList(){
  const out = [];
  Object.entries(S.active.sets||{}).forEach(([id, a]) => {
    const open = a.map((x, i) => !isDone(x) && filled(x) ? i+1 : 0).filter(Boolean);
    if(open.length) out.push(`${(EXN[id] ? EXN[id].n : id).replace(/ \(.*\)$/, "")} set ${open.length>1 ? open.slice(0,-1).join(", ") + " and " + open[open.length-1] : open[0]}`);
  });
  return out;
}
function finishSession(withPending){
  const e = buildEntry(withPending);
  if(!e.sets && !e.run && !e.tread && !e.yoga){
    sheet(`<h3>Nothing logged yet</h3><p class="muted">Log at least one set or your run so the session can be saved.</p>
      <button class="primary" data-act="closesheet">Keep training</button><button class="secondary danger" data-act="discardok">Discard session</button>`);
    return;
  }
  summary = buildSummary(e);
  S.history.push(e); S.history.sort((x, y) => x.start - y.start); S.active = null; rest = null; screen = "summary";
  summary.badges = checkBadges(false);
  save(); closeSheet(); render(); window.scrollTo(0,0); syncTags();
}
function renderSummary(){
  const s = summary, e = s.e, w = W[e.type];
  const anim = !s.played;
  const a = (cls, ms) => anim ? ` class="${cls}" style="animation-delay:${ms}ms"` : "";
  const oldWeek = e.start < mondayOf(Date.now());
  const goalTxt = oldWeek ? `Logged for ${new Date(e.start).toLocaleDateString("en-GB",{weekday:"long", day:"numeric", month:"long"})}.` : `Session ${s.weekCount} of ${S.settings.goal} this week${s.weekCount>=S.settings.goal?". Weekly goal reached!":"."}`;
  let h = `<section class="hero"><p class="eyebrow">${e.run ? runName(e.run.mode) : w.name} · ${dShort(e.start)}</p>
    <h1${a("pop",100)}>Great job!</h1>
    <p${a("fadeup",450)}><b style="color:var(--ink)">Well done.</b> ${goalTxt}</p></section>`;

  h += `<section${a("fadeup",650)}><h2 class="sec">${s.ups.length?"Stronger today":"Today"}</h2><div class="ups">`;
  if(s.ups.length){
    s.ups.forEach((u,i) => {
      h += `<div class="up${u.rec?" rec":""}${anim?" fadeup":""}"${anim?` style="animation-delay:${800+i*140}ms"`:""}>
        <div class="uphead"><b>${esc(u.n)}</b>${u.rec?`<span class="recb">New record</span>`:""}</div>
        ${u.chips.length?`<div class="chips">${u.chips.map(c => `<span class="chip2">${c}</span>`).join("")}</div>`:""}</div>`;
    });
  }else if(e.yoga){
    const n = S.history.filter(x => x.yoga).length;
    h += `<div class="up yogaup"><b>Namasté.</b><p class="small muted" style="margin:0">${n===1?"Your first yoga session! ":`Yoga session no. ${n}. `}Good for hips, glutes and mind.</p></div>`;
  }else if(s.first){
    h += `<div class="up"><b>Your first ${w.name}!</b><p class="small muted" style="margin:0">From next time on, you'll see here where you got stronger.</p></div>`;
  }else{
    h += `<div class="up calm"><b>Showing up counts.</b><p class="small muted" style="margin:0">Today was about getting it done, and you did. Next time you'll beat today's numbers.</p></div>`;
  }
  h += `</div></section>`;
  const cd = addonFor(e);
  if(cd) h += `<section${a("fadeup",670)}><h2 class="sec">Cool down</h2><div class="card"><p style="margin:0"><b>${esc(cd.n)}</b> · ${stepsMin(cd.steps)} min. ${esc(cd.why)}</p><button class="secondary" data-act="mob" data-id="${cd.id}">Start ${esc(cd.n.toLowerCase())}</button></div></section>`;
  const nexts = Object.keys(e.sets||{}).map(id => ({id, up:upSuggest(id, e.sets[id], exIn(e.type, id))})).filter(x => x.up);
  if(nexts.length) h += `<section${a("fadeup",680)}><h2 class="sec">Next time</h2><div class="card nextup">${nexts.map(x => `<p>💪 <b>${esc(EXN[x.id].n)}</b>: all sets done, try <b class="tnum">${fmt(x.up)} kg</b> next time.</p>`).join("")}</div></section>`;
  if(s.badges && s.badges.length){
    h += `<section${a("fadeup",700)}><h2 class="sec">New badge</h2><div class="newbadges">${s.badges.map(x => `<div class="nb">${badgeEl(x,true)}<div><b>${esc(x.t)}</b><p class="small muted" style="margin:0">${esc(x.d)}</p></div></div>`).join("")}</div></section>`;
  }

  h += `<div class="card${anim?" fadeup":""}"${anim?` style="animation-delay:${900+s.ups.length*140}ms"`:""}><div class="tiles">`;
  if(!e.yoga) h += `<div class="tile"><small>Duration</small><b class="tnum">${e.run && num(e.run.min)>0 ? hms(num(e.run.min)) : (e.end-e.start<3*60000 ? "–" : durTxt(e.end-e.start))}</b></div>`;
  if(e.yoga){
    h += `<div class="tile yoga"><small>This week</small><b class="tnum">${s.weekCount}/${S.settings.goal}</b></div>`;
    h += `<div class="tile yoga"><small>Yoga</small><b class="tnum">${fmt(e.yoga.min,0)} min</b></div>`;
    h += `<div class="tile yoga"><small>Total</small><b class="tnum">${S.history.filter(x => x.yoga).length}×</b></div>`;
  }else if(e.run){
    h += `<div class="tile run"><small>Distance</small><b class="tnum">${fmt(e.run.km)} km</b></div>`;
    h += num(e.run.incline) ? `<div class="tile run"><small>Incline</small><b class="tnum">${fmt(e.run.incline)} %</b></div>` : `<div class="tile run"><small>Pace</small><b class="tnum">${mmss(paceOf(e.run.km,e.run.min))}</b></div>`;
  }else{
    h += `<div class="tile"><small>Sets</small><b class="tnum">${s.nSets}</b></div>`;
    h += `<div class="tile"><small>Volume</small><b class="tnum">${fmt(Math.round(s.vol),0)} kg</b></div>`;
  }
  h += `</div>`;
  const kcal = kcalOf(e);
  if(kcalOn() && kcal>0) h += `<p class="kcal">🔥 <span>about <b class="tnum">${fmt(kcal,0)} kcal</b> burned</span><small>Estimate</small></p>`;
  else if(S.settings.showKcal!==false && !(num(S.settings.bodyKg)>0)) h += `<p class="small muted" style="margin:0">🔥 Enter your body weight in <button class="linkbtn" data-act="settings">Settings</button> to see the calories you burned here.</p>`;
  if(e.run && e.run.mode==="alster"){ const n = S.history.filter(x => x.run && x.run.mode==="alster").length; h += `<p class="alsterc">🔁 ${esc(LN())} no. <b class="tnum">${n}</b>${[10,25,50,75,100,150,200].includes(n)?" 🎉 Milestone!":"!"}</p>`; }
  if(e.capped) h += `<p class="small muted" style="margin:0">The clock stopped automatically after 60 minutes.</p>`;
  if(e.tread) h += `<p class="small muted" style="margin:0">Plus treadmill: ${fmt(e.tread.min,0)} min${e.tread.km?" · "+fmt(e.tread.km)+" km":""}${e.tread.incline?" · "+fmt(e.tread.incline)+" % incline":""}</p>`;
  h += `<p class="small" style="margin:0" data-sync>${syncHtml()}</p></div>`;
  h += `<div class="bottombar"><div class="in"><div class="bbrow"><button class="secondary" data-act="share" aria-label="Share result">📤 Share</button><button class="primary" data-act="home">Back to home</button></div></div></div>`;
  $("#app").innerHTML = h;
  prepShare(summaryShareSpec(s));
  if(anim){ s.played = true; confetti(s.ups.some(u => u.rec) || (s.badges && s.badges.length)); }
}
function confetti(big){
  try{ navigator.vibrate && navigator.vibrate([30,50,80]); }catch(e){}
  if(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cs = getComputedStyle(document.documentElement);
  const cols = ["--accent","--run","--good"].map(v => cs.getPropertyValue(v).trim()).concat(["#ED1B34","#FC4C01"]);
  const c = document.createElement("canvas"); c.className = "confetti"; c.setAttribute("aria-hidden","true"); document.body.appendChild(c);
  const dpr = Math.min(2, window.devicePixelRatio||1), Wd = innerWidth, Ht = innerHeight;
  c.width = Wd*dpr; c.height = Ht*dpr; const x = c.getContext("2d"); x.scale(dpr,dpr);
  const n = big ? 220 : 140;
  const P = Array.from({length:n}, (_,i) => {
    const side = i%2 ? 1 : -1;
    return {x: Wd/2 + side*Wd*0.1, y: Ht*0.25, vx: side*(Math.random()*9+1) + (Math.random()-.5)*4, vy: -Math.random()*14-5,
      w: 6+Math.random()*6, h: 9+Math.random()*9, r: Math.random()*6, vr: (Math.random()-.5)*.35, c: cols[i%cols.length], wob: Math.random()*6};
  });
  const t0 = performance.now(), dur = big ? 3800 : 3000;
  (function f(t){
    const el = t - t0; x.clearRect(0,0,Wd,Ht);
    P.forEach(p => {
      p.vy = Math.min(p.vy + 0.3, 7); p.vx *= 0.985; p.wob += 0.1;
      p.x += p.vx + Math.sin(p.wob)*0.6; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x,p.y); x.rotate(p.r); x.globalAlpha = Math.max(0, 1 - Math.max(0, el-dur*0.6)/(dur*0.4));
      x.fillStyle = p.c; x.fillRect(-p.w/2, -p.h/4, p.w, p.h/2*Math.abs(Math.cos(p.wob))+1); x.restore();
    });
    if(el<dur) requestAnimationFrame(f); else c.remove();
  })(t0);
}

/* ================= Sheets: Verlauf, Einstellungen ================= */
function sheet(html){ $("#layer").innerHTML = `<div class="scrim" data-act="scrim"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`; }
function closeSheet(){ const was = !!$("#layer").innerHTML; $("#layer").innerHTML = ""; if(was && screen==="me") renderMe(); }

function histSheet(id){
  const e = S.history.find(x => x.id===id); if(!e) return;
  const w = W[e.type];
  let h = `<h3>${w.name}</h3><p class="muted small">${new Date(e.start).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})} · ${durTxt((e.end||e.start)-e.start)}${kcalOn() && kcalOf(e)>0 ? ` · about ${fmt(kcalOf(e),0)} kcal` : ""}</p><div class="detail">`;
  if(e.yoga) h += `<p class="exn">${esc(yogaLabel(e.yoga) || "Yoga")}</p><p class="sets tnum">${fmt(num(e.yoga.min),0)} min</p>${e.yoga.note?`<p class="sets">${esc(e.yoga.note)}</p>`:""}`;
  if(e.run) h += `<p class="exn">${runName(e.run.mode)}</p><p class="sets tnum">${fmt(num(e.run.km))} km in ${hms(num(e.run.min))} · ${mmss(paceOf(num(e.run.km),num(e.run.min)))} /km${num(e.run.incline)?" · "+fmt(num(e.run.incline))+" % incline":""}</p>${e.run.note?`<p class="sets">${esc(e.run.note)}</p>`:""}`;
  Object.keys(e.sets||{}).forEach(k => h += `<p class="exn">${EXN[k]?esc(EXN[k].n):esc(k)}</p><p class="sets tnum">${e.sets[k].map(s => setTxt(k, s)).join(" · ")}</p>`);
  if(e.tread) h += `<p class="exn">Treadmill</p><p class="sets tnum">${fmt(num(e.tread.min),0)} min${num(e.tread.km)?" · "+fmt(num(e.tread.km))+" km":""}${num(e.tread.incline)?" · "+fmt(num(e.tread.incline))+" % incline":""}</p>`;
  h += `</div><button class="secondary" data-act="closesheet">Close</button><button class="secondary danger" data-act="delask" data-id="${e.id}">Delete session</button>`;
  sheet(h);
}

/* Settings in parts: the "You" page opens one part at a time; settingsSheet() without a part shows all */
let SETP = "";
function settingsSheet(part){
  const st = S.settings;
  if(part !== undefined) SETP = part;
  const P = {
    account: ["Account", () => `
    ${accountHtml()}
`],
    goal: ["Weekly goal", () => `
    <div><span class="lbl">Weekly goal</span><div class="stepper"><button data-act="goal" data-d="-1" aria-label="fewer">−</button><b id="goalv">${st.goal}</b><button data-act="goal" data-d="1" aria-label="more">+</button><span class="muted small">sessions per week</span></div></div>
`],
    profile: ["Profile and body", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl">My profile</span>
      <div class="rungrid"><div><label class="lbl" for="set-kg">Body weight</label><div class="field"><input inputmode="decimal" id="set-kg" data-in="bodykg" value="${esc(st.bodyKg)}" placeholder="e.g. 60"><span class="u">kg</span></div></div>
      <div><label class="lbl" for="set-cm">Height</label><div class="field"><input inputmode="numeric" id="set-cm" data-in="bodycm" value="${esc((st.body && st.body.cm) || "")}" placeholder="e.g. 175"><span class="u">cm</span></div></div></div>
      <p class="small muted" style="margin:6px 0 10px">Only used to estimate calories after a session.</p>
      <span class="lbl">Show calories</span>
      <div class="seg theme" id="kcalseg">${[["1","On"],["0","Off"]].map(([k,l]) => `<button data-act="kcalshow" data-v="${k}" aria-pressed="${(st.showKcal!==false)===(k==="1")}">${l}</button>`).join("")}</div>
    </div>
`],
    sound: ["Sound", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl" >Sound when rest is over</span>
      <div class="seg theme" id="restsoundseg">${[["1","On"],["0","Off"]].map(([k,l]) => `<button data-act="restsound" data-v="${k}" aria-pressed="${(st.restSound!==false)===(k==="1")}">${l}</button>`).join("")}</div>
      <p class="small muted" style="margin:6px 0 0">The screen stays on during a workout. On an iPhone set to silent the sound stays off too.</p>
    </div>
`],
    strava: ["Strava", () => `
    ${stravaSettings()}
`],
    weather: ["Running weather", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl">Running weather</span>
      <div class="seg theme" id="wxseg"><button data-act="wxhere" aria-pressed="${st.wxGeo===true}">Where I am</button><button data-act="wxhome" aria-pressed="${st.wxGeo!==true}">${NFRun.WX_HOME.place}</button></div>
      <p class="small muted" style="margin:6px 0 0">"Where I am" asks your phone for its location, rounded to about 1 km. It is only used for the forecast.</p>
    </div>
`],
    photos: ["Your photos", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl">Your photos <span id="phcount" class="muted" style="text-transform:none;letter-spacing:0"></span></span>
      <p class="small muted" style="margin:0">Shown on the big card on Today and in the background of your reviews. Without your own photos, the Nova photos are used. They stay on this phone and are never uploaded.</p>
      <div class="phgrid" id="phgrid"></div>
      <button class="secondary" data-act="phadd">+ Choose photos</button>
      <input type="file" id="phfile" accept="image/*" multiple hidden>
    </div>
`],
    theme: ["Appearance", () => `
    <div><span class="lbl">Appearance</span><div class="seg theme" style="grid-template-columns:repeat(3,1fr)" id="themeseg">
      ${[["auto","Automatic"],["light","Light"],["dark","Dark"]].map(([k,l]) => `<button data-act="theme" data-v="${k}" aria-pressed="${st.theme===k}">${l}</button>`).join("")}</div>
      <p class="small muted" style="margin-top:6px">Automatic follows your phone's setting.</p></div>
`],
    push: ["Notifications", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl">Notifications</span>
      <div data-push>${pushHtml()}</div>
    </div>
`],
    cal: ["Calendar reminders", () => `
    <div class="card" style="background:var(--bg);border:0">
      <span class="lbl">Calendar reminders (alternative)</span>
      <p class="small muted">Choose your training days and a time. The app turns them into weekly events with reminders for your phone calendar.</p>
      <div class="days" id="days">${WD.map((d,i) => `<button data-act="day" data-i="${i}" aria-pressed="${st.remDays.includes(i)}">${d}</button>`).join("")}</div>
      <div class="row2"><input class="inp" type="time" id="set-time" data-in="time" value="${esc(st.remTime)}" aria-label="Time"><button class="secondary" data-act="ics">Add to calendar</button></div>
    </div>
`],
    data: ["Your data", () => `
    <div><span class="lbl">Your data</span><div class="row2"><button class="secondary" data-act="export">Back up</button><button class="secondary" data-act="import">Load backup</button></div>
      <button class="secondary" style="margin-top:8px;width:100%" data-act="impsheet">Import runs from other apps</button>
      <input type="file" id="importf" accept=".json,application/json" hidden>
      <p class="small" style="margin:8px 0 0" data-sync>${syncHtml()}</p></div>
`],
  };
  const keys = P[SETP] ? [SETP] : Object.keys(P);
  sheet(`<h3>${P[SETP] ? P[SETP][0] : "Settings"}</h3>${keys.map(k => P[k][1]()).join("")}
    <button class="primary" data-act="closesheet">Done</button>`);
  paintPhotos();
}

async function offerFile(name, text, mime){
  if(window.claude && window.claude.use){
    try{
      const dl = await window.claude.use("downloads");
      if(dl){ await dl.save({filename:name, data:text}); return "ok"; }
    }catch(err){ if(err && err.code==="declined") return "declined"; if(err && err.code==="rejected_extension") return "ext"; }
  }
  try{
    const url = URL.createObjectURL(new Blob([text], {type:mime}));
    const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000); return "ok";
  }catch(e){ return "fail"; }
}
function icsText(){
  const st = S.settings, by = ["MO","TU","WE","TH","FR","SA","SU"];
  const [hh,mm] = (st.remTime||"18:00").split(":").map(Number);
  const d = new Date(); d.setHours(hh,mm,0,0);
  for(let i=0;i<8;i++){ const wd = (d.getDay()+6)%7; if(st.remDays.includes(wd) && d>new Date()) break; d.setDate(d.getDate()+1); }
  const p = n => String(n).padStart(2,"0");
  const loc = `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(hh)}${p(mm)}00`;
  const now = new Date(), stamp = `${now.getUTCFullYear()}${p(now.getUTCMonth()+1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}00Z`;
  const days = st.remDays.slice().sort().map(i => by[i]).join(",");
  return ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//NOVAFit//Training//EN","CALSCALE:GREGORIAN","BEGIN:VEVENT",
    "UID:poplan-"+Date.now()+"@po-plan","DTSTAMP:"+stamp,"DTSTART:"+loc,"DURATION:PT1H30M","RRULE:FREQ=WEEKLY;BYDAY="+days,
    "SUMMARY:Training (NOVAFit)","DESCRIPTION:Time to train! Open the app and start your session.",
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Training time is coming up","TRIGGER:-PT15M","END:VALARM",
    "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Training time!","TRIGGER:PT0M","END:VALARM",
    "END:VEVENT","END:VCALENDAR",""].join("\r\n");
}

/* ================= Übungen tauschen ================= */
/* Alternatives for "Swap": exercises with the same movement pattern from the library */
const altsOf = id => NFEx.alternatives(id, customList()).map(e => EXN[e.id]).filter(Boolean);
// A swapped exercise keeps the planned sets, reps (if logged the same way) and rest of the original
function eff(ex){
  const a = S.active, sid = a && a.swap && a.swap[ex.id];
  if(!sid || !EXN[sid]) return ex;
  const x = EXN[sid];
  return Object.assign({}, x, {s:ex.s, r:x.type===ex.type ? ex.r : x.r, rest:ex.rest, opt:ex.opt, base:ex.id});
}
// Planned exercise of a workout (template values), else the library default
function exIn(type, id){ const l = (W[type] && W[type].ex) || []; return l.find(e => e.id===id) || EXN[id]; }
const addedEx = id => EXN[id] ? Object.assign({}, EXN[id]) : null;
// Every exercise of the running session: planned (not removed) and added ones
function sessList(){
  const a = S.active; if(!a || !W[a.type]) return [];
  return planEx(a.type).filter(e => !(a.hidden||[]).includes(e.id)).concat((a.added||[]).map(addedEx).filter(Boolean));
}
function curEx(id){ const hit = sessList().map(eff).find(x => x.id===id); return hit || EXN[id]; }
function planEx(t){
  const list = W[t].ex || [], o = (S.settings.order||{})[t];
  if(!o) return list.slice();
  const idx = id => { const i = o.indexOf(id); return i<0 ? 999 : i; };
  return list.slice().sort((p,q) => idx(p.id)-idx(q.id) || list.indexOf(p)-list.indexOf(q));
}
function moveEx(baseId, d){
  const t = S.active.type, list = planEx(t), all = list.map(e => e.id), optOf = id => !!(list.find(e => e.id===id)||{}).opt, opt = optOf(baseId);
  const group = all.filter(id => optOf(id)===opt), i = group.indexOf(baseId), j = i + d;
  if(i<0 || j<0 || j>=group.length) return;
  [group[i], group[j]] = [group[j], group[i]];
  const main = opt ? all.filter(id => !optOf(id)) : group, opts = opt ? group : all.filter(id => optOf(id));
  S.settings.order = S.settings.order || {}; S.settings.order[t] = main.concat(opts);
  save(); renderSession();
}
function swapSheet(baseId){
  const base = exIn(S.active.type, baseId), cur = eff(base).id, opts = [base, ...altsOf(baseId)];
  const has = (S.active.sets[cur]||[]).some(isDone);
  sheet(`<h3>Swap exercise</h3><p class="muted small">Machine taken? Choose an alternative. ${has?"Sets you already checked off for this exercise will be reset.":""}</p>
    <div class="alts">${opts.map(o => `<button class="altrow ${o.id===cur?"cur":""}" data-act="doswap" data-base="${baseId}" data-id="${o.id}"><b>${esc(o.n)}</b>${o.id===baseId?`<small>Original</small>`:`<small>${esc(o.eq)} · ${NFEx.TYPES[o.type]}</small>`}${o.id===cur?`<span class="pill">current</span>`:""}</button>`).join("")}</div>
    <button class="secondary" data-act="closesheet">Cancel</button>`);
}
function doSwap(baseId, id){
  const a = S.active; a.swap = a.swap || {};
  const cur = eff(exIn(a.type, baseId)).id;
  if(cur!==id){
    delete a.sets[cur];
    if(id===baseId) delete a.swap[baseId]; else a.swap[baseId] = id;
    a.sets[id] = prefilledSets(eff(exIn(a.type, baseId)));
  }
  save(); closeSheet(); renderSession();
}

/* ================= Diagramme ================= */
function seriesFor(id){
  return S.history.filter(e => e.sets && e.sets[id] && e.sets[id].length).map(e => {
    const a = e.sets[id];
    return {t:e.start, kg:Math.max(...a.map(s => num(s.kg))), reps:a.reduce((x,s) => x+num(s.r),0), e1:Math.max(...a.map(s => e1(num(s.kg),num(s.r)))), sets:a};
  });
}
function exIdsWithData(){
  const seen = new Set(); S.history.forEach(e => Object.keys(e.sets||{}).forEach(k => seen.add(k)));
  return Object.keys(EXN).filter(id => seen.has(id));
}
function spark(vals){
  if(vals.length<2) return `<svg class="spark" viewBox="0 0 80 24" aria-hidden="true"></svg>`;
  let mn = Math.min(...vals), mx = Math.max(...vals); if(mn===mx){ mn -= 1; mx += 1; }
  const p = vals.map((v,i) => [2+i*76/(vals.length-1), 21-(v-mn)/(mx-mn)*18]);
  const last = p[p.length-1];
  return `<svg class="spark" viewBox="0 0 80 24" aria-hidden="true"><polyline points="${p.map(q => q.map(n => n.toFixed(1)).join(",")).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="2.8" fill="var(--accent)"/></svg>`;
}
function lineChart(vals, labels, o){
  o = o || {};
  const Wd = 340, Ht = 180, pl = 44, pr = 14, pt = 14, pb = 28, n = vals.length;
  const dmin = Math.min(...vals), dmax = Math.max(...vals);
  let mn = dmin, mx = dmax; if(mn===mx){ mn -= 1; mx += 1; } const pad = (mx-mn)*0.15; mn -= pad; mx += pad;
  const X = i => n===1 ? pl+(Wd-pl-pr)/2 : pl + i*(Wd-pl-pr)/(n-1);
  const Y = v => o.invert ? pt+(v-mn)/(mx-mn)*(Ht-pt-pb) : Ht-pb-(v-mn)/(mx-mn)*(Ht-pt-pb);
  const col = o.color || "var(--accent)";
  const ticks = dmin===dmax ? [dmin] : [dmin, dmax];
  let s = `<svg class="chart" viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="${esc(o.label||"History")}">`;
  ticks.forEach(v => { const y = Y(v).toFixed(1); s += `<line x1="${pl}" x2="${Wd-pr}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${pl-6}" y="${(+y+4).toFixed(1)}" text-anchor="end" font-size="11" fill="var(--muted)">${esc(o.fmt?o.fmt(v):fmt(v))}</text>`; });
  if(n>1){
    const pts = vals.map((v,i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
    const base = o.invert ? pt : Ht-pb;
    s += `<polygon points="${X(0).toFixed(1)},${base} ${pts} ${X(n-1).toFixed(1)},${base}" fill="${col}" opacity=".10"/>`;
    s += `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  }
  vals.forEach((v,i) => { s += `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${i===n-1?5:3}" fill="${i===n-1?col:"var(--surface)"}" stroke="${col}" stroke-width="2"/>`; });
  s += `<text x="${X(0).toFixed(1)}" y="${Ht-8}" text-anchor="${n===1?"middle":"start"}" font-size="11" fill="var(--muted)">${esc(labels[0])}</text>`;
  if(n>1) s += `<text x="${X(n-1).toFixed(1)}" y="${Ht-8}" text-anchor="end" font-size="11" fill="var(--muted)">${esc(labels[n-1])}</text>`;
  return s + `</svg>`;
}
const dTiny = ts => new Date(ts).toLocaleDateString("en-GB",{day:"numeric",month:"numeric"});
// What a progress curve shows: heaviest weight, total reps (bodyweight, assisted) or longest time
function metricOf(id, ser){
  const t = exType(id);
  if(t==="t") return {vals:ser.map(p => Math.max(...p.sets.map(s => num(s.r)))), unit:exUnit(id), label:"Longest time"};
  const bw = t==="a" || ser.every(p => p.kg===0);
  return bw ? {vals:ser.map(p => p.reps), unit:"reps", label:"Total reps"} : {vals:ser.map(p => p.kg), unit:"kg", label:"Heaviest weight"};
}
function chartSheet(id){
  const ex = EXN[id], ser = seriesFor(id); if(!ser.length) return;
  const mt = metricOf(id, ser), bw = mt.unit!=="kg";
  const vals = mt.vals, unit = mt.unit;
  const first = vals[0], best = Math.max(...vals), last = vals[vals.length-1];
  const d = best-first;
  let h = `<h3>${esc(ex.n)}</h3><p class="muted small">${mt.label} per session · ${ser.length} ${ser.length===1?"session":"sessions"}</p>`;
  h += `<div class="tiles"><div class="tile"><small>Start</small><b class="tnum">${fmt(first)} ${unit}</b></div><div class="tile"><small>Best</small><b class="tnum">${fmt(best)} ${unit}</b></div><div class="tile"><small>Progress</small><b class="tnum" style="color:${d>0?"var(--good)":"var(--ink)"}">${d>0?"+":""}${fmt(d)} ${unit}</b></div></div>`;
  h += lineChart(vals, ser.map(p => dTiny(p.t)), {label:`${ex.n}: ${vals.map(v => fmt(v)).join(", ")} ${unit}`, fmt:v => fmt(v)+(bw?"":" kg")});
  h += `<div class="detail">${ser.slice(-6).reverse().map(p => `<p class="exn">${dShort(p.t)}</p><p class="sets tnum">${p.sets.map(s => setTxt(id, s)).join(" · ")}</p>`).join("")}</div>`;
  h += `<button class="secondary" data-act="closesheet">Close</button>`;
  sheet(h);
}
function runChartSheet(kind){
  const runs = S.history.filter(e => e.run && num(e.run.km)>0 && num(e.run.min)>0 && (kind!=="alster" || e.run.mode==="alster"));
  if(!runs.length){ toast(kind==="alster"?`No ${LN()} with a time logged yet.`:"No run with a time logged yet."); return; }
  const vals = runs.map(e => kind==="alster" ? num(e.run.min) : paceOf(num(e.run.km), num(e.run.min)));
  const f = kind==="alster" ? hms : v => mmss(v)+" /km";
  const best = Math.min(...vals), first = vals[0], d = first-best;
  let h = `<h3>${kind==="alster"?`Your ${esc(LN())} times`:"Your running pace"}</h3><p class="muted small">${kind==="alster"?"Time per loop":"Minutes per kilometre"} · higher is faster</p>`;
  h += `<div class="tiles"><div class="tile run"><small>First run</small><b class="tnum">${f(first)}</b></div><div class="tile run"><small>Best</small><b class="tnum">${f(best)}</b></div><div class="tile run"><small>Faster by</small><b class="tnum">${d>0?mmss(d):"–"}</b></div></div>`;
  h += lineChart(vals, runs.map(e => dTiny(e.start)), {invert:true, color:"var(--run)", fmt:f, label:"Running times"});
  h += `<button class="secondary" data-act="closesheet">Close</button>`;
  sheet(h);
}

/* ================= Abzeichen ================= */
const HIP_IDS = ["hip","smithhip","dbhip","glutebridge"];
function facts(){
  const H = S.history, goal = S.settings.goal, weeks = {};
  let km = 0, vol = 0, early = false, hipMax = 0, prs = 0; const maxSoFar = {};
  let bestAlster = Infinity;
  H.forEach(e => {
    const wk = mondayOf(e.start); (weeks[wk] = weeks[wk] || {n:0, types:new Set()}).n++; weeks[wk].types.add(e.type);
    km += kmOf(e); vol += volOf(e);
    if(new Date(e.start).getHours()<8) early = true;
    Object.entries(e.sets||{}).forEach(([id,a]) => {
      if(exType(id)!=="w") return;
      const mk = Math.max(...a.map(s => num(s.kg)));
      if(maxSoFar[id]!=null && mk>maxSoFar[id]) prs++;
      maxSoFar[id] = Math.max(maxSoFar[id]||0, mk);
      if(HIP_IDS.includes(id)) hipMax = Math.max(hipMax, mk);
    });
    if(e.run && e.run.mode==="alster" && num(e.run.min)>0) bestAlster = Math.min(bestAlster, num(e.run.min));
  });
  const keys = Object.keys(weeks).map(Number).sort((a,b) => a-b);
  let streakMax = 0, cur = 0, prev = null;
  keys.forEach(k => { if(weeks[k].n>=goal){ cur = (prev!==null && k-prev<WEEK*1.5 && weeks[prev].n>=goal) ? cur+1 : 1; streakMax = Math.max(streakMax, cur); } prev = k; });
  return {total:H.length, km, vol, early, hipMax, prs, bestAlster, streakMax, yoga:H.filter(e => e.yoga).length,
    flexBest:Math.max(0, ...NFYoga.flexList(S.settings.flex).map(c => c.v)),
    goalWeeks:keys.filter(k => weeks[k].n>=goal).length, allround:keys.some(k => { const g = [...weeks[k].types].map(t => (W[t]||{}).group);
      return weeks[k].types.has("lauf") && g.some(x => ["lower","legs","full"].includes(x)) && g.some(x => ["upper","push","pull","full"].includes(x)); })};
}
const BADGES = [
  {id:"toes", l:"✋", t:"Toes touched", d:"You reached your toes in the flexibility check.", ok:f => f.flexBest>=4},
  {id:"first", l:"1", t:"First session", d:"You finished your very first session.", ok:f => f.total>=1},
  {id:"t10", l:"10", t:"10 sessions", d:"Completed 10 sessions.", ok:f => f.total>=10},
  {id:"t25", l:"25", t:"25 sessions", d:"Completed 25 sessions.", ok:f => f.total>=25},
  {id:"t50", l:"50", t:"50 sessions", d:"Completed 50 sessions.", ok:f => f.total>=50},
  {id:"goal1", l:"3/3", t:"Weekly goal", d:"You reached your weekly goal for the first time.", ok:f => f.goalWeeks>=1},
  {id:"streak4", l:"4W", t:"4 weeks straight", d:"You reached your weekly goal 4 weeks in a row.", ok:f => f.streakMax>=4},
  {id:"streak8", l:"8W", t:"8 weeks straight", d:"You reached your weekly goal 8 weeks in a row.", ok:f => f.streakMax>=8},
  {id:"allround", l:"3×", t:"All-rounder", d:"Lower body, a run and upper body in one week.", ok:f => f.allround},
  {id:"km10", l:"10k", t:"10 km", d:"Ran 10 km in total.", ok:f => f.km>=10, run:true},
  {id:"km50", l:"50k", t:"50 km", d:"Ran 50 km in total.", ok:f => f.km>=50, run:true},
  {id:"km100", l:"100k", t:"100 km", d:"Ran 100 km in total.", ok:f => f.km>=100, run:true},
  {id:"al45", l:"<45", t:"Loop under 45", d:"Your loop in under 45 minutes.", ok:f => f.bestAlster<45, run:true},
  {id:"al40", l:"<40", t:"Loop under 40", d:"Your loop in under 40 minutes.", ok:f => f.bestAlster<40, run:true},
  {id:"ht50", l:"50kg", t:"Hip Thrust 50 kg", d:"Hip thrust with 50 kg.", ok:f => f.hipMax>=50},
  {id:"ht80", l:"80kg", t:"Hip Thrust 80 kg", d:"Hip thrust with 80 kg.", ok:f => f.hipMax>=80},
  {id:"pr5", l:"PR5", t:"5 records", d:"Set a new best weight 5 times.", ok:f => f.prs>=5},
  {id:"pr20", l:"PR20", t:"20 records", d:"Set a new best weight 20 times.", ok:f => f.prs>=20},
  {id:"vol10t", l:"10t", t:"10 tonnes", d:"Moved 10,000 kg in total.", ok:f => f.vol>=10000},
  {id:"yoga1", l:"Om", t:"First yoga", d:"Your first yoga session.", ok:f => f.yoga>=1, yoga:true},
  {id:"yoga10", l:"10×", t:"Yogi", d:"Completed 10 yoga sessions.", ok:f => f.yoga>=10, yoga:true},
  {id:"early", l:"AM", t:"Early bird", d:"A session before 8 am.", ok:f => f.early}
];
function checkBadges(silent){
  if(!S.badges) S.badges = {};
  const f = facts(), fresh = [];
  BADGES.forEach(b => { if(!S.badges[b.id] && b.ok(f)){ S.badges[b.id] = Date.now(); if(!silent) fresh.push(b); } });
  return fresh;
}
/* ================= Abzeichen-Design B: Sechsecke mit Emoji & Fortschritt ================= */
const BEMO = {first:"🌱",t10:"⭐",t25:"🌟",t50:"👑",goal1:"🎯",streak4:"🔥",streak8:"☄️",allround:"🌈",km10:"👟",km50:"🛣️",km100:"🏅",al45:"⏱️",al40:"⚡",ht50:"🍑",ht80:"💎",pr5:"🏆",pr20:"🦾",vol10t:"🐘",yoga1:"🧘‍♀️",yoga10:"🪷",early:"🌅"};
let FCACHE = {k:"", v:null};
function factsC(){ const l = S.history[S.history.length-1], k = S.history.length+":"+(l?l.end:0)+":"+S.settings.goal+":"+(S.settings.flex||[]).length; if(FCACHE.k!==k) FCACHE = {k, v:facts()}; return FCACHE.v; }
function badgeProg(b){
  const f = factsC(), id = b.id;
  const T = {first:[f.total,1],t10:[f.total,10],t25:[f.total,25],t50:[f.total,50],goal1:[f.goalWeeks,1],streak4:[f.streakMax,4," weeks"],streak8:[f.streakMax,8," weeks"],
    km10:[f.km,10," km"],km50:[f.km,50," km"],km100:[f.km,100," km"],ht50:[f.hipMax,50," kg"],ht80:[f.hipMax,80," kg"],pr5:[f.prs,5],pr20:[f.prs,20],vol10t:[f.vol/1000,10," t"],yoga1:[f.yoga,1],yoga10:[f.yoga,10]};
  if(id==="al45" || id==="al40"){
    const goal = id==="al45" ? 45 : 40, best = isFinite(f.bestAlster) ? f.bestAlster : 0;
    return best ? {pct:Math.min(1, goal/best), txt:`Best time ${hms(best)}${best>goal?` · ${hms(best-goal)} faster to go`:""}`} : {pct:0, txt:"No loop with a time yet"};
  }
  if(!T[id]) return {pct:0, txt:""};
  const [c, t, u] = T[id];
  return {pct:Math.min(1, Math.max(0, c/t)), txt:t>1 ? `${fmt(Math.min(c,t), u===" t"?1:0)} / ${t}${u||""}` : ""};
}
function nextBadgeHtml(){
  const cand = BADGES.filter(b => !(S.badges && S.badges[b.id])).map(b => ({b, p:badgeProg(b)})).filter(x => x.p.pct>0 && x.p.pct<1).sort((x,y) => y.p.pct-x.p.pct)[0];
  if(!cand) return "";
  const {b, p} = cand;
  return `<button class="nextb" data-act="badge" data-id="${b.id}"><span class="e">${BEMO[b.id]||"🏅"}</span><span class="nb-t"><b>Almost there: ${esc(b.t)}</b><span>${esc(b.d)}${p.txt?" · "+esc(p.txt):""}</span><span class="bar2"><i style="width:${p.pct*100}%"></i></span></span></button>`;
}

function badgeEl(b, small){
  const got = S.badges && S.badges[b.id];
  const pr = got ? null : badgeProg(b);
  return `<button class="badge ${got?"got":""} ${b.run?"run":b.yoga?"yoga":""} ${small?"sm":""}" data-act="badge" data-id="${b.id}" aria-label="${esc(b.t)}${got?"":" (not yet)"}"><span class="hx"><i></i><em>${BEMO[b.id]||"🏅"}</em></span>${small?"":`<small>${esc(b.t)}</small>`}${!small && pr && pr.pct>0 ? `<span class="bbar"><b style="width:${pr.pct*100}%"></b></span>` : ""}</button>`;
}
function badgeSheet(id){
  const b = BADGES.find(x => x.id===id), got = S.badges && S.badges[id];
  sheet(`<div style="display:flex;gap:14px;align-items:center">${badgeEl(b,true)}<div><h3>${esc(b.t)}</h3><p class="muted small">${got?"Earned on "+new Date(got).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):"Not earned yet"+(badgeProg(b).txt?" · "+esc(badgeProg(b).txt):"")}</p></div></div>
    <p>${esc(b.d)}</p><button class="secondary" data-act="closesheet">Close</button>`);
}

/* ================= Kalender & Monatsrückblick ================= */
let calOff = 0;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const dkey = ts => { const d = new Date(ts); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); };
function calendarHtml(){
  const now = new Date(), ref = new Date(now.getFullYear(), now.getMonth()+calOff, 1);
  const y = ref.getFullYear(), m = ref.getMonth(), days = new Date(y, m+1, 0).getDate(), lead = (ref.getDay()+6)%7;
  const byDay = {}; S.history.forEach(e => (byDay[dkey(e.start)] = byDay[dkey(e.start)] || []).push(e));
  const inMonth = S.history.filter(e => { const d = new Date(e.start); return d.getFullYear()===y && d.getMonth()===m; });
  let cells = ""; for(let i=0;i<lead;i++) cells += `<span></span>`;
  for(let d=1; d<=days; d++){
    const k = y+"-"+(m+1)+"-"+d, list = byDay[k] || [], today = calOff===0 && d===now.getDate();
    const dots = list.map(e => `<i class="${kc(e.type)}"></i>`).join("");
    cells += list.length ? `<button class="cd has ${kc(list[0].type)} ${list.length>1?"multi":""} ${today?"today":""}" data-act="calday" data-k="${k}" aria-label="${d}. ${MONTHS[m]}: ${list.map(e => W[e.type].name).join(", ")}"><span>${d}</span><em>${dots}</em></button>`
                         : `<span class="cd ${today?"today":""}"><span>${d}</span></span>`;
  }
  return `<div class="calhead"><button class="iconbtn sm" data-act="cal" data-d="-1" aria-label="Previous month">‹</button>
    <b>${MONTHS[m]} ${y}</b><button class="iconbtn sm" data-act="cal" data-d="1" aria-label="Next month" ${calOff>=0?"disabled":""}>›</button></div>
    <div class="calgrid">${WD.map(d => `<span class="wd">${d}</span>`).join("")}${cells}</div>
    <div class="callegend"><span><i></i>Gym</span><span><i class="run"></i>Run</span><span><i class="yoga"></i>Yoga</span><span class="tnum">${inMonth.length} ${inMonth.length===1?"session":"sessions"}</span>
    ${inMonth.length?`<button class="addset" data-act="recap" data-y="${y}" data-m="${m}">Monthly review ›</button>`:""}</div>`;
}
function daySheet(k){
  const list = S.history.filter(e => dkey(e.start)===k);
  if(list.length===1) return histSheet(list[0].id);
  sheet(`<h3>${new Date(list[0].start).toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long"})}</h3><div class="hist">${list.map(e => `<button class="hrow" data-act="hist" data-id="${e.id}"><span class="dot ${kc(e.type)}"></span><span><b>${W[e.type].name}</b></span><span class="muted">›</span></button>`).join("")}</div><button class="secondary" data-act="closesheet">Close</button>`);
}
function recapData(y, m){ return rangeData(new Date(y, m, 1).getTime(), new Date(y, m+1, 1).getTime()); }
function rangeData(a, b){
  const inM = S.history.filter(e => e.start>=a && e.start<b), before = S.history.filter(e => e.start<a);
  const km = inM.reduce((x,e) => x+kmOf(e), 0), vol = inM.reduce((x,e) => x+volOf(e), 0);
  const days = new Set(inM.map(e => dkey(e.start))).size;
  const gains = [];
  const ids = new Set(); inM.forEach(e => Object.keys(e.sets||{}).forEach(k => ids.add(k)));
  ids.forEach(id => {
    const mx = arr => arr.reduce((x,e) => Math.max(x, ...((e.sets||{})[id]||[]).map(s => num(s.kg)), 0), 0);
    const pb = mx(before), pm = mx(inM);
    if(pb>0 && pm>pb) gains.push({n:EXN[id]?EXN[id].n:id, d:pm-pb, to:pm});
  });
  gains.sort((p,q) => q.d-p.d);
  const al = inM.filter(e => e.run && e.run.mode==="alster" && num(e.run.min)>0).map(e => num(e.run.min));
  const badges = BADGES.filter(x => S.badges && S.badges[x.id]>=a && S.badges[x.id]<b);
  const types = {}; inM.forEach(e => types[e.type] = (types[e.type]||0)+1);
  const kcal = inM.reduce((x,e) => x+kcalOf(e), 0);
  return {n:inM.length, km, vol, kcal, days, gains, bestAl: al.length?Math.min(...al):0, badges, types};
}
function recapSheet(y, m){
  const r = recapData(y, m);
  let h = `<p class="eyebrow">Monthly review</p><h3 style="font-size:30px">Your ${MONTHS[m]}</h3>`;
  h += `<p class="muted">${r.n===0?"You haven't trained this month yet.":`${r.n} ${r.n===1?"session":"sessions"} on ${r.days} ${r.days===1?"day":"days"}. ${r.n>=12?"What a month!":r.n>=6?"Strong!":"Every session counts."}`}</p>`;
  h += `<div class="tiles"><div class="tile"><small>Sessions</small><b class="tnum">${r.n}</b></div><div class="tile run"><small>Run</small><b class="tnum">${fmt(r.km)} km</b></div><div class="tile"><small>Moved</small><b class="tnum">${fmt(Math.round(r.vol),0)} kg</b></div></div>`;
  if(kcalOn() && r.kcal>0) h += `<p class="kcal">🔥 <span>about <b class="tnum">${fmt(r.kcal,0)} kcal</b> burned</span><small>Estimate</small></p>`;
  const tl = ALL_W.filter(t => r.types[t]).map(t => `${W[t].name} ${r.types[t]}×`).join(" · ");
  if(tl) h += `<p class="small muted" style="margin:0">${tl}${r.bestAl?` · best ${esc(LN())} ${hms(r.bestAl)}`:""}</p>`;
  if(r.gains.length) h += `<p class="exn" style="margin:6px 0 0;font-weight:600">Getting stronger</p><div class="ups">${r.gains.slice(0,5).map(g => `<div class="up"><div class="uphead"><b>${esc(g.n)}</b><span class="chip2">+${fmt(g.d)} kg <span>(now ${fmt(g.to)} kg)</span></span></div></div>`).join("")}</div>`;
  if(r.badges.length) h += `<p class="exn" style="margin:6px 0 0;font-weight:600">New badges</p><div class="badges">${r.badges.map(b => badgeEl(b)).join("")}</div>`;
  h += `<button class="secondary" data-act="closesheet">Close</button>`;
  sheet(h);
}
function defaultWeek(){
  const ws = mondayOf(Date.now());
  const n = S.history.filter(e => e.start>=ws).length;
  return (new Date().getDay()===1 && n===0) ? ws-WEEK : ws;
}
function weekSheet(ws){
  const r = rangeData(ws, ws+WEEK), g = S.settings.goal;
  const end = new Date(ws+WEEK-864e5), st = new Date(ws);
  const range = `${st.getDate()}. ${st.getMonth()!==end.getMonth()?MONTHS[st.getMonth()].slice(0,3)+". ":""}– ${end.getDate()}. ${MONTHS[end.getMonth()]}`;
  const cur = ws===mondayOf(Date.now());
  const msg = r.n>=g ? `Weekly goal reached: ${r.n} of ${g} sessions. Well done!` : r.n>0 ? `${r.n} of ${g} sessions${cur?" so far":""}. Every session counts.` : (cur ? "This week is still wide open. A short session is enough to get going." : "This week was a break. That's part of it too.");
  const st2 = stats();
  let h = `<p class="eyebrow">Weekly review · ${range}</p><h3 style="font-size:30px">${cur?"Your week":"Your last week"}</h3><p class="muted">${msg}</p>`;
  h += `<div class="tiles"><div class="tile"><small>Sessions</small><b class="tnum">${r.n}/${g}</b></div><div class="tile run"><small>Run</small><b class="tnum">${fmt(r.km)} km</b></div><div class="tile"><small>Moved</small><b class="tnum">${fmt(Math.round(r.vol),0)} kg</b></div></div>`;
  if(kcalOn() && r.kcal>0) h += `<p class="kcal">🔥 <span>about <b class="tnum">${fmt(r.kcal,0)} kcal</b> burned</span><small>Estimate</small></p>`;
  const tl = ALL_W.filter(t => r.types[t]).map(t => `${W[t].name} ${r.types[t]}×`).join(" · ");
  if(tl) h += `<p class="small muted" style="margin:0">${tl}${r.bestAl?` · ${esc(LN())} ${hms(r.bestAl)}`:""}${st2.streak>1&&cur?` · ${st2.streak} weeks in a row`:""}</p>`;
  if(r.gains.length) h += `<p class="exn" style="margin:6px 0 0;font-weight:600">Stronger this week</p><div class="ups">${r.gains.slice(0,5).map(x => `<div class="up"><div class="uphead"><b>${esc(x.n)}</b><span class="chip2">+${fmt(x.d)} kg <span>(now ${fmt(x.to)} kg)</span></span></div></div>`).join("")}</div>`;
  if(r.badges.length) h += `<p class="exn" style="margin:6px 0 0;font-weight:600">New badges</p><div class="badges">${r.badges.map(x => badgeEl(x)).join("")}</div>`;
  h += `<div class="row2"><button class="secondary" data-act="week" data-ws="${ws-WEEK}">‹ Previous week</button>${cur?`<button class="secondary" data-act="closesheet">Close</button>`:`<button class="secondary" data-act="week" data-ws="${ws+WEEK}">Next week ›</button>`}</div>`;
  sheet(h);
}
function weekCardHtml(){
  const d = new Date().getDay(); if(d!==0 && d!==1) return "";
  const ws = d===0 ? mondayOf(Date.now()) : mondayOf(Date.now())-WEEK;
  if(S.settings.weekSeen===ws) return "";
  if(!rangeData(ws, ws+WEEK).n) return "";
  return `<button class="resume recap" data-act="week" data-ws="${ws}" data-seen="${ws}"><div><span>New</span><b>Your weekly review</b></div><span class="go">View</span></button>`;
}
function recapCardHtml(){
  const now = new Date(); if(now.getDate()>7 || now.getDate()<=3) return "";
  const p = new Date(now.getFullYear(), now.getMonth()-1, 1), key = p.getFullYear()+"-"+p.getMonth();
  if(S.settings.recapSeen===key) return "";
  if(!recapData(p.getFullYear(), p.getMonth()).n) return "";
  return `<button class="resume recap" data-act="recap" data-y="${p.getFullYear()}" data-m="${p.getMonth()}" data-seen="${key}"><div><span>New</span><b>Your ${MONTHS[p.getMonth()]} review</b></div><span class="go">View</span></button>`;
}

/* ================= Lauf-Ziele ================= */
function runGoalsHtml(st){
  const g = S.settings.alsterGoal, kg = S.settings.kmGoal;
  const al = S.history.filter(e => e.run && e.run.mode==="alster" && num(e.run.min)>0).map(e => num(e.run.min));
  let p1 = 0, t1 = "No loop with a time yet.";
  if(al.length){
    const first = al[0], best = Math.min(...al);
    if(best<=g){ p1 = 1; t1 = `Done! Best time ${hms(best)}`; }
    else{ p1 = first>g ? Math.max(0, Math.min(1, (first-best)/(first-g))) : 0; t1 = `Best time ${hms(best)} · ${mmss(best-g)} faster to go`; }
  }
  const p2 = Math.min(1, st.kmMonth/kg);
  return `<div class="goalbar"><div class="gl"><b>${esc(LN())} under ${hms(g)}</b><span class="tnum">${t1}</span></div><div class="track"><i style="width:${Math.max(p1*100, p1?4:0)}%"></i></div></div>
    <div class="goalbar"><div class="gl"><b>Monthly goal ${fmt(kg,0)} km</b><span class="tnum">${fmt(st.kmMonth)} of ${fmt(kg,0)} km${p2>=1?" · done!":""}</span></div><div class="track"><i style="width:${Math.max(p2*100, p2?4:0)}%"></i></div></div>
    <button class="addset" data-act="rungoals" style="align-self:flex-start">Change goals</button>`;
}
function runGoalsSheet(){
  sheet(`<h3>Running goals</h3>
    <div class="rungrid"><div><label class="lbl" for="g-ln">Your usual loop</label><input class="inp" id="g-ln" maxlength="${NFRun.LOOP_NAME_MAX+6}" autocomplete="off" placeholder="${NFRun.LOOP_DEFAULT}" value="${esc(S.settings.loopName||"")}" aria-describedby="g-ln-err"><p class="err" id="g-ln-err" role="alert" aria-live="polite"></p></div>
      <div><label class="lbl" for="g-lk">Length</label><div class="field"><input class="tnum" id="g-lk" inputmode="decimal" value="${fmt(alsterKm(),2)}" aria-describedby="g-lk-err"><span class="u">km</span></div><p class="err" id="g-lk-err" role="alert" aria-live="polite"></p></div></div>
    <div><label class="lbl" for="g-al">Loop under (mm:ss)</label><input class="inp tnum" id="g-al" inputmode="text" value="${mmss(S.settings.alsterGoal)}"></div>
    <div><label class="lbl" for="g-km">Kilometres per month</label><input class="inp tnum" id="g-km" inputmode="decimal" value="${Math.round(num(S.settings.kmGoal))}"></div>
    <button class="primary run" data-act="rungoalsave">Save</button><button class="secondary" data-act="closesheet">Cancel</button>`);
}

/* ================= Timer: Aufwärmen & Intervalle ================= */
// Warm-up by workout group (lower and legs share one, upper, push and pull share one)
function warmFor(t){ const g = (W[t]||{}).group; return WARMUP[{lower:"po", legs:"po", upper:"oben", push:"oben", pull:"oben", full:"full"}[g]] || null; }
const WARMUP = {
  full:[{n:"Easy cardio", i:"Bike, rowing machine or cross trainer.", d:90},
        {n:"Bodyweight Squats", i:"Slow squats, as deep as is comfortable. About 12 reps.", d:40},
        {n:"Inchworms", i:"Fold forward, walk your hands out to a plank, walk back in. About 6 reps.", d:45},
        {n:"Band Pull-Aparts", i:"Pull the band apart in front of your chest, shoulder blades together.", d:40},
        {n:"Glute Bridges", i:"On your back, push your hips up, pause at the top. About 12 reps.", d:40},
        {n:"Warm-up set", i:"First exercise with a light weight, 10 easy reps.", d:45}],
  po:[{n:"Easy cardio", i:"Bike, cross trainer or brisk walking.", d:90},
      {n:"Bodyweight Squats", i:"Slow squats with your own weight, as deep as is comfortable. About 15 reps.", d:45},
      {n:"Glute Bridges", i:"On your back, push your hips up, pause at the top. About 15 reps.", d:45},
      {n:"Walking Lunges", i:"Long steps forward, back knee close to the floor. About 10 per leg.", d:40},
      {n:"Leg Swings", i:"Hold on to a wall, swing your leg loosely forward and back. Each side.", d:40},
      {n:"Warm-up set", i:"First exercise with a light weight, 10 easy reps.", d:45}],
  oben:[{n:"Easy cardio", i:"Bike, cross trainer or rowing machine.", d:90},
        {n:"Arm Circles", i:"Big circles forward and backward.", d:30},
        {n:"Band Pull-Aparts", i:"Pull the band apart in front of your chest, shoulder blades together.", d:45},
        {n:"Cat-Cow", i:"On all fours, alternate between rounding and arching your back.", d:40},
        {n:"Incline Push-ups", i:"Hands on the bench, 10 slow reps.", d:40},
        {n:"Warm-up set", i:"Lat pulldown with a light weight, 12 easy reps.", d:55}]
};
/* ================= Meditationsmusik für Yoga & Po-Mobility (live erzeugt) ================= */
const MED_CHORDS = [[50,57,62,64,69],[47,54,62,64,69],[43,55,59,62,66],[45,52,57,62,64]];
const MED_CHIMES = [74,76,78,81,83,86,88];
function medStart(){
  if(!TM || !TM.calm || !TM.ac || TM.mus || S.settings.yogaMusic===false) return;
  const c = TM.ac, out = c.createGain(), lp = c.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 2200; out.connect(lp); lp.connect(c.destination);
  out.gain.setValueAtTime(0.0001, c.currentTime); out.gain.linearRampToValueAtTime(.55, c.currentTime + 5);
  const dl = c.createDelay(2), fb = c.createGain(), wet = c.createGain();
  dl.delayTime.value = .85; fb.gain.value = .5; wet.gain.value = .4; dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(out);
  TM.mus = {out, dl, ci:0, nextChord:c.currentTime + .1, nextChime:c.currentTime + 3, timer:null};
  TM.mus.timer = setInterval(medTick, 500); medTick();
}
function medVoice(c, dest, f, t, dur, peak, a, type){
  const o = c.createOscillator(), g = c.createGain(); o.type = type || "sine"; o.frequency.value = f;
  o.connect(g); g.connect(dest);
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, t + Math.max(a, dur - 4)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
  o.start(t); o.stop(t + dur + .1);
}
function medTick(){
  const m = TM && TM.mus; if(!m) return;
  const c = TM.ac; if(c.state!=="running" || TM.paused) return;
  if(m.nextChord < c.currentTime - 1) m.nextChord = c.currentTime + .1;
  while(m.nextChord < c.currentTime + 1.5){
    const ch = MED_CHORDS[m.ci % MED_CHORDS.length], t = m.nextChord;
    ch.forEach((n,k) => { medVoice(c, m.out, mfreq(n), t, 16, k===0 ? .05 : .028, 4.5); medVoice(c, m.out, mfreq(n)*1.004, t, 16, .014, 5, "triangle"); });
    medVoice(c, m.out, mfreq(ch[0]-12), t, 16, .045, 5);
    m.ci++; m.nextChord += 12;
  }
  if(m.nextChime < c.currentTime - 1) m.nextChime = c.currentTime + 2;
  while(m.nextChime < c.currentTime + 1.5){
    const n = MED_CHIMES[Math.floor(Math.random()*MED_CHIMES.length)], t = m.nextChime;
    [[1,.035],[2.76,.008],[5.4,.003]].forEach(([r,v]) => { const o = c.createOscillator(), g = c.createGain(); o.frequency.value = mfreq(n)*r; o.connect(g); g.connect(m.out); g.connect(m.dl);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t+.01); g.gain.exponentialRampToValueAtTime(0.0001, t + (r===1 ? 4 : 1.5)); o.start(t); o.stop(t+4.2); });
    m.nextChime += 4 + Math.random()*6;
  }
}
function medStop(fade){
  const m = TM && TM.mus; if(!m) return; clearInterval(m.timer); TM.mus = null;
  try{ const t = TM.ac.currentTime; m.out.gain.cancelScheduledValues(t); m.out.gain.setValueAtTime(m.out.gain.value, t); m.out.gain.linearRampToValueAtTime(0.0001, t + (fade ? 2 : .2)); }catch(e){}
}

let TM = null, wakeLock = null;
function bell(freq, vol, len, at){
  try{
    if(!TM || !TM.ac) return;
    const c = TM.ac, t = c.currentTime + (at||0), g = c.createGain(); g.connect(c.destination);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .008); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    [[1,1],[2,.35],[3,.12],[4.2,.06]].forEach(([m, a]) => { const o = c.createOscillator(), og = c.createGain(); o.type = "sine"; o.frequency.value = freq*m; og.gain.value = a/1.53; o.connect(og); og.connect(g); o.start(t); o.stop(t + len + .05); });
  }catch(e){}
}
function chime(hi){ bell(hi ? 1175 : 1047, .5, .9); bell(hi ? 1760 : 1568, .42, 1.1, .12); }
function duck(on){ const m = TM && TM.mus; if(!m || !m.out) return; try{ const c = TM.ac, g = m.out.gain; g.cancelScheduledValues(c.currentTime); g.setTargetAtTime(on ? .18 : .55, c.currentTime, on ? .08 : .6); }catch(e){} }
function beep(freq, len, vol){
  try{
    if(!TM || !TM.ac) return;
    const c = TM.ac, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.frequency.value = freq; o.type = "sine";
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.35, t+0.02); g.gain.exponentialRampToValueAtTime(0.0001, t+len);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+len+0.05);
  }catch(e){}
}
async function startTimer(cfg){
  if(cfg.prep){ const f = cfg.steps[0]; cfg = Object.assign({}, cfg, {steps:[{n:"Get ready", s:cfg.flow ? "Today: " + cfg.flow : "Get into position", i:"Take a deep breath – the timer starts in a moment.", d:10, c:f.c, pose:f.pose, prep:true}].concat(cfg.steps)}); }
  TM = Object.assign({i:0, paused:false, beeped:-1}, cfg);
  try{ TM.ac = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){}
  TM.end = Date.now() + TM.steps[0].d*1000;
  try{ if(navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen"); }catch(e){}
  bell(784, TM.calm ? .36 : .45, .6); drawTimer();
  medStart();
}
function drawTimer(){
  let el = document.getElementById("timerlayer");
  if(!TM){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("div"); el.id = "timerlayer"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); document.body.appendChild(el); }
  const st = TM.steps[TM.i], nx = TM.steps[TM.i+1], cu = NFYoga.cue(TM.prep && TM.i===0 ? Object.assign({}, st, {pose:""}) : st, yLevel());  // "Get ready" has no easier option
  const left = TM.paused ? TM.left : TM.end - Date.now();
  if(TM.calm && yVoice() && TM.spokenI !== TM.i && !TM.paused){ TM.spokenI = TM.i; say(cu.say); }
  el.className = "tm " + (st.c||"");
  el.innerHTML = `<div class="tmin">
    <div class="tmtop"><span>${esc(TM.title)}</span><span class="tmr">${TM.calm && canSpeak()?`<button class="tmsnd" data-act="tmvoice" aria-pressed="${yVoice()}" aria-label="${yVoice()?"Voice off":"Voice on"}" style="${yVoice()?"":"opacity:.55"}">${VOICE_ICO}</button>`:""}${TM.calm?`<button class="tmsnd" data-act="tmmusic" aria-label="${S.settings.yogaMusic===false?"Music on":"Music off"}">${S.settings.yogaMusic===false?"🔇":"🎵"}</button>`:""}<span class="tnum">${st.prep ? "Get ready" : (TM.i + (TM.steps[0].prep?0:1)) + " / " + (TM.steps.length - (TM.steps[0].prep?1:0))}</span></span></div>
    <div class="tmmain">${st.pose?poseSvg(st.pose,"tmpose"):""}<p class="tmphase">${esc(st.n)}</p>${st.s?`<p class="tmsub">${esc(st.s)}</p>`:""}<p class="tmtime tnum" id="tmT">${clock(Math.max(0,left)+999)}</p>
      <div class="track"><i id="tmI" style="width:${Math.max(0,left)/(st.d*1000)*100}%"></i></div>
      ${TM.calm ? `${cu.text?`<p class="tminfo">${esc(cu.text)}</p>`:""}${cu.easy?`<p class="tminfo tmeasy"><b>Easier:</b> ${esc(cu.easy)}</p>`:""}` : st.i?`<p class="tminfo">${esc(st.i)}</p>`:""}</div>
    <p class="tmnext">${nx?`Up next: <b>${esc(nx.n)}</b> · ${nx.d>=60?mmss(nx.d/60)+" min":nx.d+" s"}`:"Last section"}</p>
    <div class="tmbtns"><button class="secondary" data-act="tmpause">${TM.paused?"Resume":"Pause"}</button><button class="secondary" data-act="tmskip">Skip ›</button></div>
    <button class="txtbtn" data-act="tmstop" style="align-self:center;color:inherit;opacity:.8">Stop</button></div>`;
}
function tickTimer(){
  if(!TM || TM.paused) return;
  let changed = false;
  while(TM && Date.now() >= TM.end){
    if(TM.i >= TM.steps.length-1){ finishTimer(true); return; }
    TM.i++; TM.end += TM.steps[TM.i].d*1000; TM.beeped = -1; changed = true;
  }
  if(changed){ chime(TM.steps[TM.i].c==="fast"); setTimeout(() => duck(false), 1200); try{ navigator.vibrate && navigator.vibrate(300); }catch(e){} drawTimer(); return; }
  const left = TM.end - Date.now(), sec = Math.ceil(left/1000);
  const t = document.getElementById("tmT"), i = document.getElementById("tmI");
  const cd = sec<=3 && sec>=1 && TM.steps[TM.i].d>5;
  if(cd && TM.beeped!==sec){
    TM.beeped = sec;
    if(sec===3) duck(true);
    bell(sec===1 ? 988 : 880, TM.calm ? .42 : .5, sec===1 ? .5 : .45);
    if(t){ t.classList.remove("cd"); void t.offsetWidth; t.classList.add("cd"); }
  }
  if(t){ if(cd) t.textContent = String(sec); else { t.classList.remove("cd"); t.textContent = clock(left+999); } }
  if(i) i.style.width = (left/(TM.steps[TM.i].d*1000)*100)+"%";
}
function finishTimer(done){
  const cb = TM && TM.onDone, stopCb = TM && TM.onStop, ac = TM && TM.ac, hadMus = !!(TM && TM.mus);
  medStop(true);
  try{ canSpeak() && speechSynthesis.cancel(); }catch(e){}
  setTimeout(() => { try{ ac && ac.close(); }catch(e){} }, hadMus ? 2300 : 0);
  TM = null; drawTimer();
  try{ wakeLock && wakeLock.release(); }catch(e){} wakeLock = null;
  if(done && cb) cb(); else if(!done && stopCb) stopCb();
}
setInterval(tickTimer, 200);
document.addEventListener("visibilitychange", () => { if(document.visibilityState==="visible"){ updateBadge(); if(screen==="home" && !TM && !$("#layer").innerHTML) renderHome(); } });
document.addEventListener("visibilitychange", async () => { if(document.visibilityState==="visible" && TM){ tickTimer(); try{ if(navigator.wakeLock) wakeLock = await navigator.wakeLock.request("screen"); }catch(e){} } });
function startWarmup(){
  const t = S.active.type;
  startTimer({title:"Warm-up", prep:true, steps:warmFor(t).map(s => Object.assign({c:"warm"}, s)), onDone:() => {
    if(S.active){ S.active.warm = true; save(); renderSession(); }
    toast("Warmed up! Let's go.");
  }});
}
function intervalSheet(target){
  const c = S.settings.itv;
  const tot = (c.fast+c.slow)*c.rounds;
  sheet(`<h3>Interval timer</h3><p class="muted small">For the treadmill: alternate fast and easy. The timer beeps at each change, so keep the sound on.</p>
    <div class="row3">
      <div><label class="lbl" for="iv-f">Fast (sec)</label><input class="inp tnum" id="iv-f" inputmode="numeric" value="${c.fast}"></div>
      <div><label class="lbl" for="iv-s">Easy (sec)</label><input class="inp tnum" id="iv-s" inputmode="numeric" value="${c.slow}"></div>
      <div><label class="lbl" for="iv-r">Rounds</label><input class="inp tnum" id="iv-r" inputmode="numeric" value="${c.rounds}"></div>
    </div>
    <p class="small muted" id="iv-tot">Duration: ${Math.round(tot/60)} min</p>
    <button class="primary run" data-act="ivgo" data-target="${target}">Start timer</button><button class="secondary" data-act="closesheet">Cancel</button>`);
}
function startIntervals(target){
  const v = id => Math.max(1, Math.round(num($(id).value)));
  const c = S.settings.itv = {fast:Math.min(900, v("#iv-f")), slow:Math.min(900, v("#iv-s")), rounds:Math.min(30, v("#iv-r"))};
  save(); closeSheet();
  const steps = [];
  for(let r=1; r<=c.rounds; r++){
    steps.push({n:"Fast", i:`Round ${r} of ${c.rounds}. Pick up the pace!`, d:c.fast, c:"fast"});
    steps.push({n:"Easy", i:`Round ${r} of ${c.rounds}. Breathe, keep jogging easy.`, d:c.slow, c:"slow"});
  }
  const mins = Math.max(1, Math.round((c.fast+c.slow)*c.rounds/60));
  startTimer({title:"Intervals", steps, onDone:() => {
    if(S.active){
      if(target==="tread" && S.active.tread && !String(S.active.tread.min).trim()) S.active.tread.min = String(mins);
      if(target==="run" && S.active.run && !String(S.active.run.min).trim()) S.active.run.min = mins+":00";
      save(); if(screen==="session") renderSession();
    }
    toast("Intervals done! Strong.");
  }});
}

/* ================= Yoga-Posen (einfache Strichfiguren) ================= */
const POSES = {
  seat:{h:[100,34], p:[[[100,46],[100,94]], [[100,56],[82,78],[78,96]], [[100,56],[118,78],[122,96]], [[100,98],[68,112],[114,124]], [[100,98],[132,112],[86,124]]]},
  cat:{h:[46,96], p:[[[62,88],[100,68],[138,86]], [[62,88],[61,110],[60,130]], [[138,86],[140,128],[176,130]]]},
  dog:{h:[62,106], p:[[[72,96],[106,54]], [[72,96],[50,130]], [[106,54],[128,92],[150,130]]]},
  up:{h:[100,42], p:[[[100,58],[100,90]], [[87,58],[113,58]], [[87,58],[80,32],[74,8]], [[113,58],[120,32],[126,8]], [[100,90],[93,110],[90,130]], [[100,90],[107,110],[110,130]]]},
  w1:{h:[113,40], p:[[[106,86],[104,50]], [[104,54],[98,30],[94,8]], [[106,86],[66,98],[62,130]], [[106,86],[132,108],[158,130]]]},
  child:{h:[66,120], p:[[[146,100],[112,104],[82,120]], [[84,118],[50,126],[22,128]], [[146,100],[116,128],[158,130]]]},
  lunge:{h:[105,56], p:[[[100,108],[96,66]], [[96,70],[88,46],[84,22]], [[100,108],[66,98],[62,130]], [[100,108],[140,128],[176,130]]]},
  w2:{h:[98,34], p:[[[100,90],[100,48]], [[100,54],[58,54],[18,54]], [[100,54],[142,54],[182,54]], [[100,90],[56,100],[42,130]], [[100,90],[134,110],[166,130]]]},
  side:{h:[60,60], p:[[[114,96],[72,68]], [[78,66],[58,36],[40,12]], [[74,70],[62,98]], [[114,96],[62,102],[54,130]], [[114,96],[148,112],[180,130]]]},
  rev:{h:[118,36], p:[[[100,90],[112,50]], [[110,54],[120,30],[132,8]], [[110,58],[134,88],[150,108]], [[100,90],[56,100],[42,130]], [[100,90],[134,110],[166,130]]]},
  updog:{h:[56,64], p:[[[64,78],[96,106],[128,118]], [[64,78],[64,104],[64,130]], [[128,118],[156,124],[184,128]]]},
  tree:{h:[100,32], p:[[[100,44],[100,86]], [[100,52],[82,66],[97,70]], [[100,52],[118,66],[103,70]], [[100,86],[102,108],[102,130]], [[100,86],[70,102],[96,112]]]},
  pigeon:{h:[98,56], p:[[[98,68],[100,112]], [[98,74],[86,100],[84,128]], [[100,112],[66,126],[104,130]], [[100,112],[146,126],[184,130]]]},
  bridge:{h:[42,122], p:[[[58,126],[118,88]], [[118,88],[150,84],[146,130]], [[60,126],[94,130],[120,130]]]},
  baby:{h:[38,120], p:[[[54,124],[114,124]], [[114,124],[98,92],[112,60]], [[114,124],[136,94],[126,60]], [[58,122],[80,92],[110,64]]]},
  twist:{h:[34,120], p:[[[50,124],[118,124]], [[52,122],[34,98],[24,74]], [[118,124],[148,104],[160,126]], [[118,124],[140,112],[166,128]]]},
  sava:{h:[30,120], p:[[[46,123],[124,125]], [[124,125],[180,127]], [[50,124],[98,129]]]},
  m9090:{h:[98,48], p:[[[100,62],[100,112]], [[100,68],[122,92],[128,120]], [[100,114],[62,124],[86,132]], [[100,114],[138,124],[172,130]]]},
  mfig4:{h:[38,120], p:[[[54,124],[110,124]], [[110,124],[100,90],[128,78]], [[110,124],[140,104],[102,92]], [[60,122],[84,100],[100,92]]]},
  mkneel:{h:[104,46], p:[[[106,104],[104,62]], [[104,68],[90,86],[104,100]], [[106,104],[72,100],[70,132]], [[106,104],[136,132],[172,132]]]},
  mfrog:{h:[64,98], p:[[[84,104],[128,106]], [[84,104],[84,130],[56,130]], [[128,106],[130,132],[166,132]]]}
};
const YOGA_POSE = ["seat","cat","dog","up","w1","child","lunge","w2","side","rev","updog","lunge-","w2-","side-","rev-","updog","tree","tree-","pigeon","pigeon-","bridge","baby","twist","twist-","sava"];
/* ================= Mehrere Abläufe ================= */
const YOGA_FLOWS = [
  {n:"Classic", steps:YOGA.map((x,i) => Object.assign({pose:YOGA_POSE[i]}, x))},
  {n:"Hips and grounding", steps:[
    {n:"Arrive", s:"Sukhasana", i:"Sit comfortably cross-legged, eyes closed. Exhale slowly and settle into your body.", d:120, pose:"seat"},
    {n:"Cat-Cow", s:"Marjaryasana-Bitilasana", i:"On all fours. Inhale: belly drops, gaze up. Exhale: round your back.", d:90, pose:"cat"},
    {n:"Downward Dog", s:"Adho Mukha Svanasana", i:"Hips up and back, knees may bend. Pedal your feet one at a time.", d:60, pose:"dog"},
    {n:"Sun Salutation A, 3 rounds", s:"Surya Namaskar A", i:"Arms up, forward fold, half lift, plank, lower down, cobra, dog. One breath per movement.", d:180, pose:"up"},
    {n:"Chair", s:"Utkatasana", i:"Bend your knees, hips back as if sitting on a chair, arms long forward and up. Weight in your heels.", d:45, pose:"chair"},
    {n:"Standing Forward Fold", s:"Uttanasana", i:"Soft knees, let your torso hang, heavy head. Sway gently side to side.", d:45, pose:"fold"},
    {n:"Low Lunge right", s:"Anjaneyasana", i:"Right foot forward, left knee down. Hips sink forward, arms up.", d:45, pose:"lunge"},
    {n:"Lizard right", s:"Utthan Pristhasana", i:"Hands inside your right foot, hips low. Lower onto your forearms if you like.", d:60, pose:"lizard"},
    {n:"Downward Dog", s:"Adho Mukha Svanasana", i:"Back to downward dog for a few calm breaths.", d:30, pose:"dog"},
    {n:"Low Lunge left", s:"Anjaneyasana", i:"Left foot forward, right knee down. Hips sink forward, arms up.", d:45, pose:"lunge-"},
    {n:"Lizard left", s:"Utthan Pristhasana", i:"Hands inside your left foot, hips low. Breathe calmly into the stretch.", d:60, pose:"lizard-"},
    {n:"Triangle right", s:"Trikonasana", i:"Wide legs, right foot points forward. Tilt your torso to the side, right hand to your shin, left arm up.", d:45, pose:"tri"},
    {n:"Triangle left", s:"Trikonasana", i:"Left foot points forward. Left hand to your shin, right arm to the ceiling.", d:45, pose:"tri-"},
    {n:"Warrior II right", s:"Virabhadrasana II", i:"Right knee over the ankle, arms long to the sides, gaze over your right hand.", d:45, pose:"w2"},
    {n:"Warrior II left", s:"Virabhadrasana II", i:"Left knee over the ankle, gaze over your left hand.", d:45, pose:"w2-"},
    {n:"Plank", s:"Phalakasana", i:"Hands under your shoulders, body in one line, core and glutes tight.", d:30, pose:"plank"},
    {n:"Cobra", s:"Bhujangasana", i:"Lie on your belly, hands beside your chest. Lift your chest gently, shoulders away from your ears.", d:30, pose:"cobra"},
    {n:"Child's Pose", s:"Balasana", i:"Knees wide, hips to your heels, forehead down.", d:60, pose:"child"},
    {n:"Butterfly", s:"Baddha Konasana", i:"Soles together, knees drop outward. Sit tall, then fold gently forward.", d:90, pose:"butterfly"},
    {n:"Seated Forward Fold", s:"Paschimottanasana", i:"Legs long, knees may bend. Fold forward with a long back.", d:90, pose:"paschim"},
    {n:"Bridge", s:"Setu Bandhasana", i:"Lie on your back, feet hip-width apart. Lift your hips, squeeze your glutes, roll down slowly.", d:60, pose:"bridge"},
    {n:"Happy Baby", s:"Ananda Balasana", i:"Soles to the ceiling, hands on your feet, rock gently.", d:60, pose:"baby"},
    {n:"Supine Twist right", s:"Supta Matsyendrasana", i:"Lower your knees to the left, right arm long, gaze to the right.", d:45, pose:"twist"},
    {n:"Supine Twist left", s:"Supta Matsyendrasana", i:"Lower your knees to the right, left arm long, gaze to the left.", d:45, pose:"twist-"},
    {n:"Final Relaxation", s:"Savasana", i:"Lie long on your back, eyes closed. Do nothing at all. Namaste.", d:240, pose:"sava"}
  ]},
  {n:"Strength and balance", steps:[
    {n:"Arrive", s:"Sukhasana", i:"Sit tall, eyes closed, three deep breaths.", d:120, pose:"seat"},
    {n:"Cat-Cow", s:"Marjaryasana-Bitilasana", i:"Move with your breath, back round and long.", d:60, pose:"cat"},
    {n:"Downward Dog", s:"Adho Mukha Svanasana", i:"Hips up, heels toward the floor.", d:60, pose:"dog"},
    {n:"Sun Salutation B, 2 rounds", s:"Surya Namaskar B", i:"Chair, forward fold, plank, lower down, cobra, dog, plus Warrior I right and left.", d:180, pose:"up"},
    {n:"Plank", s:"Phalakasana", i:"Body in one line, glutes and core tight. Keep breathing calmly.", d:45, pose:"plank"},
    {n:"Cobra", s:"Bhujangasana", i:"Lift your chest gently, elbows close to your body.", d:30, pose:"cobra"},
    {n:"Downward Dog", s:"Adho Mukha Svanasana", i:"Take a breath.", d:30, pose:"dog"},
    {n:"Chair", s:"Utkatasana", i:"Sink deep into your knees, hips back, arms up. Hold!", d:45, pose:"chair"},
    {n:"Warrior I right", s:"Virabhadrasana I", i:"Right foot forward, knee bent, hips forward, arms up.", d:45, pose:"w1"},
    {n:"Warrior II right", s:"Virabhadrasana II", i:"Open your hips to the side, arms long.", d:45, pose:"w2"},
    {n:"Reverse Warrior right", s:"Viparita Virabhadrasana", i:"Right arm up and back, left hand on the back leg.", d:30, pose:"rev"},
    {n:"Side Angle right", s:"Utthita Parsvakonasana", i:"Forearm on your thigh, top arm long over your ear.", d:45, pose:"side"},
    {n:"Vinyasa", s:"Plank · lower down · Cobra · Dog", i:"Flow through once and switch sides.", d:30, pose:"plank"},
    {n:"Warrior I left", s:"Virabhadrasana I", i:"Left foot forward, knee bent, arms up.", d:45, pose:"w1-"},
    {n:"Warrior II left", s:"Virabhadrasana II", i:"Open your hips, gaze over your left hand.", d:45, pose:"w2-"},
    {n:"Reverse Warrior left", s:"Viparita Virabhadrasana", i:"Left arm up and back.", d:30, pose:"rev-"},
    {n:"Side Angle left", s:"Utthita Parsvakonasana", i:"Forearm on your thigh, top arm long.", d:45, pose:"side-"},
    {n:"Tree right", s:"Vrksasana", i:"Stand on your left leg, right foot on calf or thigh, arms up.", d:45, pose:"tree"},
    {n:"Tree left", s:"Vrksasana", i:"Stand on your right leg, gaze at a fixed point.", d:45, pose:"tree-"},
    {n:"Bridge", s:"Setu Bandhasana", i:"Hips up, squeeze your glutes, hold.", d:60, pose:"bridge"},
    {n:"Single-Leg Bridge right", s:"Eka Pada Setu Bandhasana", i:"In bridge, extend your right leg long, keep your hips level.", d:30, pose:"sbridge"},
    {n:"Single-Leg Bridge left", s:"Eka Pada Setu Bandhasana", i:"Now extend your left leg. Glutes tight!", d:30, pose:"sbridge-"},
    {n:"Pigeon right", s:"Eka Pada Rajakapotasana", i:"Right knee forward, left leg long behind you, torso sinks forward.", d:60, pose:"pigeon"},
    {n:"Pigeon left", s:"Eka Pada Rajakapotasana", i:"Left knee forward, right leg long behind you.", d:60, pose:"pigeon-"},
    {n:"Seated Forward Fold", s:"Paschimottanasana", i:"Legs long, fold forward with a long back.", d:60, pose:"paschim"},
    {n:"Supine Twist right", s:"Supta Matsyendrasana", i:"Lower your knees to the left, gaze to the right.", d:45, pose:"twist"},
    {n:"Supine Twist left", s:"Supta Matsyendrasana", i:"Lower your knees to the right, gaze to the left.", d:45, pose:"twist-"},
    {n:"Final Relaxation", s:"Savasana", i:"Let go completely. You got a lot done today. Namaste.", d:240, pose:"sava"}
  ]}
];
const MOBILITY_B = [
  {n:"Cat-Cow", i:"On all fours, move gently with your breath.", d:60, pose:"cat"},
  {n:"Donkey Kicks right", i:"On all fours, right knee bent. Press your sole slowly toward the ceiling, squeeze your glutes.", d:45, pose:"kick"},
  {n:"Donkey Kicks left", i:"Now the left leg. Slow and controlled, keep your back flat.", d:45, pose:"kick-"},
  {n:"Lizard right", i:"Right foot forward, hands inside it, back knee down. Hips sink low.", d:45, pose:"lizard"},
  {n:"Lizard left", i:"Left foot forward, hands inside it. Breathe calmly into your hips.", d:45, pose:"lizard-"},
  {n:"Butterfly", i:"Soles together, knees drop outward. Lean gently forward.", d:60, pose:"butterfly"},
  {n:"Single-Leg Bridge right", i:"On your back, hips up, extend your right leg. Squeeze your glutes.", d:30, pose:"sbridge"},
  {n:"Single-Leg Bridge left", i:"Now extend your left leg, keep your hips level.", d:30, pose:"sbridge-"},
  {n:"Happy Baby", i:"Soles to the ceiling, hands on your feet, rock gently.", d:45, pose:"baby"},
  {n:"Seated Forward Fold", i:"Legs long, soft knees. Fold forward with a long back.", d:45, pose:"paschim"},
  {n:"Figure 4 right", i:"On your back. Right ankle on your left knee, gently pull your left leg toward your chest.", d:45, pose:"mfig4"},
  {n:"Figure 4 left", i:"Left ankle on your right knee, pull your right leg toward your chest.", d:45, pose:"mfig4-"},
  {n:"Child's Pose", i:"Knees wide, hips to your heels, forehead down. Nicely done.", d:45, pose:"child"}
];
const yogaLen = () => S.settings.yogaLen || 30;
const curFlow = () => YOGA_FLOWS[(S.settings.yogaFlow||0) % YOGA_FLOWS.length];
const curMob = () => MOB_FLOWS[(S.settings.mobFlow||0) % MOB_FLOWS.length];
function flowSteps(f, len){
  const k = (len || yogaLen())/30;
  return f.steps.map(x => Object.assign({}, x, {d:Math.max(20, Math.round(x.d*k/5)*5), n:k===1 ? x.n : x.n.replace(/(\d) rounds/, (m, r) => { const n = Math.max(1, Math.round(r*k)); return n + (n===1 ? " round" : " rounds"); })}));
}
const stepsMin = st => Math.round(st.reduce((a,x) => a+x.d, 0)/60);
function poseSvgOld(key, cls){
  if(!key) return "";
  const mir = key.endsWith("-"), p = POSES[key.replace("-","")]; if(!p) return "";
  const lines = p.p.map(l => `<polyline points="${l.map(q => q.join(",")).join(" ")}"/>`).join("");
  return `<svg class="${cls||"pose"}" viewBox="0 0 200 140" aria-hidden="true"><g ${mir?'transform="translate(200,0) scale(-1,1)"':""}>
    <line x1="8" y1="134" x2="192" y2="134" stroke="currentColor" stroke-width="2" opacity=".3"/>
    ${p.eq||p.c?`<g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".45">${(p.eq||[]).map(l => `<polyline points="${l.map(q => q.join(",")).join(" ")}"/>`).join("")}${(p.c||[]).map(c => `<circle cx="${c[0]}" cy="${c[1]}" r="${c[2]}"/>`).join("")}</g>`:""}
    <g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${lines}</g>
    <circle cx="${p.h[0]}" cy="${p.h[1]}" r="10" fill="currentColor"/></g></svg>`;
}

/* ================= Figuren (Skelett-Zeichnung) ================= */
// Gelenke in 200×140, Boden y=130. n* = vorderes, f* = hinteres Bein/Arm. toe: Fußrichtung (-1 links, 1 rechts), glow: Dehnung am Po
const P2 = {
  seat:{head:[100,32], sh:[100,50], hip:[100,100], nel:[80,74], nwr:[70,98], fel:[120,74], fwr:[130,98], nkn:[60,116], nan:[114,126], fkn:[140,116], fan:[86,126], nofoot:1},
  cat:{head:[46,92], sh:[64,86], hip:[138,84], bend:[100,66], nel:[63,107], nwr:[62,127], fel:[70,107], fwr:[70,127], nkn:[138,128], nan:[178,129], fkn:[132,128], fan:[172,129], toe:1, glow:1},
  dog:{head:[60,112], sh:[74,98], hip:[118,50], nel:[60,113], nwr:[46,127], fel:[66,114], fwr:[54,127], nkn:[140,88], nan:[160,126], fkn:[134,90], fan:[154,126], toe:-1, glow:1},
  up:{head:[100,32], sh:[100,50], hip:[100,90], nel:[116,31], nwr:[124,9], fel:[84,31], fwr:[76,9], nkn:[104,110], nan:[106,128], fkn:[96,110], fan:[94,128], nofoot:1},
  w1:{head:[98,34], sh:[100,52], hip:[104,90], nel:[96,30], nwr:[94,8], fel:[104,30], fwr:[102,8], nkn:[70,100], nan:[66,128], fkn:[134,108], fan:[166,128], toe:-1},
  child:{head:[72,121], sh:[90,116], hip:[146,104], nel:[62,126], nwr:[34,128], fel:[66,124], fwr:[38,126], nkn:[110,127], nan:[160,129], fkn:[114,126], fan:[162,128], toe:1, glow:1},
  lunge:{head:[98,44], sh:[100,62], hip:[106,100], nel:[96,40], nwr:[94,18], fel:[102,40], fwr:[100,18], nkn:[70,102], nan:[68,128], fkn:[140,127], fan:[178,128], toe:-1},
  mkneel:{head:[105,44], sh:[106,62], hip:[110,100], nel:[94,82], nwr:[78,98], fel:[98,82], fwr:[82,98], nkn:[72,102], nan:[70,128], fkn:[144,127], fan:[180,128], toe:-1, glow:1},
  w2:{head:[100,30], sh:[100,48], hip:[100,88], nel:[140,49], nwr:[180,49], fel:[60,49], fwr:[20,49], nkn:[142,100], nan:[150,128], fkn:[72,108], fan:[46,128], toe:1},
  side:{head:[66,54], sh:[82,64], hip:[112,92], nel:[62,44], nwr:[38,26], fel:[72,84], fwr:[68,104], nkn:[68,102], nan:[62,128], fkn:[148,110], fan:[178,128], toe:-1},
  rev:{head:[118,36], sh:[112,54], hip:[100,90], nel:[106,30], nwr:[96,8], fel:[128,80], fwr:[140,102], nkn:[62,98], nan:[56,128], fkn:[138,108], fan:[164,128], toe:-1},
  updog:{head:[52,64], sh:[62,82], hip:[122,112], nel:[61,105], nwr:[60,127], fel:[66,105], fwr:[66,127], nkn:[152,122], nan:[184,126], fkn:[150,124], fan:[182,128], nofoot:1},
  tree:{head:[100,28], sh:[100,46], hip:[100,88], nel:[112,28], nwr:[102,6], fel:[88,28], fwr:[98,6], nkn:[132,106], nan:[104,100], fkn:[98,110], fan:[98,128], nofoot:1},
  pigeon:{head:[90,46], sh:[96,64], hip:[106,108], nel:[86,88], nwr:[80,126], fel:[92,88], fwr:[88,126], nkn:[70,124], nan:[100,128], fkn:[146,126], fan:[186,128], nofoot:1, glow:1},
  bridge:{head:[30,122], sh:[50,120], hip:[112,80], nel:[74,126], nwr:[98,128], fel:[78,124], fwr:[102,126], nkn:[148,80], nan:[152,127], fkn:[142,82], fan:[146,127], toe:1, glow:1},
  baby:{head:[40,120], sh:[60,118], hip:[118,116], nel:[82,98], nwr:[100,70], fel:[88,100], fwr:[112,70], nkn:[96,94], nan:[102,64], fkn:[106,96], fan:[114,64], nofoot:1, glow:1},
  twist:{head:[34,118], sh:[54,118], hip:[116,118], nel:[78,126], nwr:[100,128], fel:[36,104], fwr:[14,96], nkn:[140,96], nan:[166,118], fkn:[146,102], fan:[170,124], nofoot:1, glow:1},
  sava:{head:[30,121], sh:[50,121], hip:[118,121], nel:[74,126], nwr:[98,128], fel:[72,124], fwr:[96,126], nkn:[148,124], nan:[182,126], fkn:[146,126], fan:[180,128], nofoot:1},
  m9090:{head:[100,52], sh:[100,70], hip:[100,116], nel:[118,92], nwr:[130,114], fel:[82,92], fwr:[70,114], nkn:[146,126], nan:[106,129], fkn:[56,124], fan:[34,110], nofoot:1, glow:1},
  mfig4:{head:[36,120], sh:[56,120], hip:[116,118], nel:[88,100], nwr:[118,90], fel:[92,102], fwr:[122,92], nkn:[150,100], nan:[126,84], fkn:[128,80], fan:[158,88], nofoot:1, glow:1},
  mfrog:{head:[62,106], sh:[82,104], hip:[140,98], nel:[78,127], nwr:[54,128], fel:[84,126], fwr:[60,127], nkn:[132,128], nan:[166,128], fkn:[126,127], fan:[160,127], toe:1, glow:1},
  plank:{head:[46,84], sh:[62,90], hip:[118,98], nel:[61,109], nwr:[60,127], fel:[66,109], fwr:[66,127], nkn:[148,108], nan:[176,124], fkn:[146,110], fan:[174,126], nofoot:1},
  cobra:{head:[50,90], sh:[64,102], hip:[122,120], nel:[82,118], nwr:[66,128], fel:[86,116], fwr:[72,127], nkn:[152,123], nan:[184,126], fkn:[150,125], fan:[182,128], nofoot:1},
  fold:{head:[86,116], sh:[92,98], hip:[112,68], nel:[88,113], nwr:[90,127], fel:[94,112], fwr:[96,126], nkn:[110,98], nan:[108,128], fkn:[114,98], fan:[112,128], toe:-1},
  // Sun Salutation: half lift (long back, hands on the shins) and lowering down (chaturanga)
  half:{head:[60,70], sh:[76,72], hip:[112,68], nel:[84,88], nwr:[100,100], fel:[86,89], fwr:[104,101], nkn:[110,98], nan:[108,128], fkn:[114,98], fan:[112,128], toe:-1},
  low:{head:[46,108], sh:[62,114], hip:[118,118], nel:[78,105], nwr:[66,127], fel:[82,105], fwr:[70,127], nkn:[148,121], nan:[176,124], fkn:[146,122], fan:[174,126], nofoot:1},
  chair:{head:[92,38], sh:[98,56], hip:[118,94], nel:[80,42], nwr:[64,26], fel:[84,40], fwr:[68,24], nkn:[86,104], nan:[100,128], fkn:[90,104], fan:[104,128], toe:-1, glow:1},
  butterfly:{head:[100,52], sh:[100,70], hip:[100,114], nel:[118,96], nwr:[106,122], fel:[82,96], fwr:[94,122], nkn:[146,114], nan:[106,127], fkn:[54,114], fan:[94,127], nofoot:1, glow:1},
  tri:{head:[52,64], sh:[68,72], hip:[100,88], nel:[70,48], nwr:[72,22], fel:[64,94], fwr:[60,114], nkn:[72,108], nan:[46,128], fkn:[128,108], fan:[156,128], nofoot:1},
  paschim:{head:[82,100], sh:[100,98], hip:[146,116], bend:[128,92], nel:[82,112], nwr:[64,120], fel:[84,114], fwr:[66,122], nkn:[106,125], nan:[58,127], fkn:[106,126], fan:[58,128], nofoot:1, glow:1},
  lizard:{head:[56,110], sh:[74,108], hip:[114,100], nel:[70,118], nwr:[66,127], fel:[76,118], fwr:[72,127], nkn:[86,94], nan:[86,128], fkn:[148,127], fan:[182,128], toe:-1, glow:1},
  kick:{head:[46,90], sh:[64,86], hip:[136,84], nel:[63,107], nwr:[62,127], fel:[70,107], fwr:[70,127], nkn:[164,82], nan:[166,52], fkn:[134,128], fan:[170,129], toe:1, glow:1},
  sbridge:{head:[30,122], sh:[50,120], hip:[112,80], nel:[74,126], nwr:[98,128], fel:[78,124], fwr:[102,126], nkn:[142,68], nan:[172,56], fkn:[146,80], fan:[150,127], toe:1, glow:1},
  // on a chair, seen from the front (study break)
  cseat:{head:[100,32], sh:[100,52], hip:[100,90], nel:[118,72], nwr:[112,92], fel:[82,72], fwr:[88,92], nkn:[88,100], nan:[86,127], fkn:[112,100], fan:[114,127], nofoot:1, prop:"chair"},
  cneck:{head:[112,34], sh:[100,52], hip:[100,90], nel:[124,38], nwr:[114,24], fel:[82,72], fwr:[78,92], nkn:[88,100], nan:[86,127], fkn:[112,100], fan:[114,127], nofoot:1, prop:"chair"},
  cside:{head:[84,40], sh:[90,56], hip:[100,90], nel:[102,30], nwr:[82,14], fel:[80,72], fwr:[78,92], nkn:[88,100], nan:[86,127], fkn:[112,100], fan:[114,127], nofoot:1, prop:"chair"},
  creach:{head:[100,34], sh:[100,52], hip:[100,90], nel:[110,30], nwr:[106,8], fel:[90,30], fwr:[94,8], nkn:[88,100], nan:[86,127], fkn:[112,100], fan:[114,127], nofoot:1, prop:"chair"},
  // on the back, legs resting up a wall (wind down)
  legsup:{head:[34,120], sh:[52,121], hip:[118,122], nel:[70,126], nwr:[88,127], fel:[66,124], fwr:[84,126], nkn:[124,90], nan:[130,56], fkn:[128,90], fan:[134,56], nofoot:1, prop:"wall", glow:1}
};
const PROPS = {
  chair:`<g stroke-width="5" opacity=".35"><line x1="68" y1="98" x2="132" y2="98"/><line x1="72" y1="98" x2="72" y2="130"/><line x1="128" y1="98" x2="128" y2="130"/><line x1="74" y1="98" x2="74" y2="58"/><line x1="126" y1="98" x2="126" y2="58"/><line x1="74" y1="60" x2="126" y2="60"/></g>`,
  wall:`<rect x="142" y="8" width="10" height="122" fill="currentColor" stroke="none" opacity=".18"/>`
};
/* Pose drawings: a dark outline around a light body, like the exercise drawings.
   --pf is the body color (the background behind the drawing), --pdot marks where you should feel it. */
function poseSvg(key, cls){
  if(!key) return "";
  const mir = key.endsWith("-"), k = key.replace("-",""), p = P2[k];
  if(!p) return poseSvgOld(key, cls);
  const O = 3.4;
  const ln = (a, b, w) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke-width="${w}"/>`;
  // a set of limbs: outline in the drawing color first, then the body color on top
  const part = (segs, op) => `<g${op?` opacity="${op}"`:""}><g>${segs.map(([a,b,w]) => ln(a, b, w+O)).join("")}</g><g style="stroke:var(--pf)">${segs.map(([a,b,w]) => ln(a, b, w)).join("")}</g></g>`;
  const foot = an => p.nofoot || an[1] < 122 ? [] : [[an, [an[0] + 8*(p.toe||-1), an[1]+.5], 5.5]];
  const mid = [(p.sh[0]+p.hip[0])/2, (p.sh[1]+p.hip[1])/2];
  const dx = p.head[0]-p.sh[0], dy = p.head[1]-p.sh[1], len = Math.hypot(dx,dy) || 1, nk = [p.sh[0]+dx/len*(len-9), p.sh[1]+dy/len*(len-9)];
  const far = part([[p.sh,p.fel,7.5],[p.fel,p.fwr,6],[p.hip,p.fkn,11],[p.fkn,p.fan,8.5], ...foot(p.fan)], .5);
  const legs = [[p.hip,p.nkn,12],[p.nkn,p.nan,9.5], ...foot(p.nan), [p.sh,nk,7]];
  const torso = p.bend
    ? `<path d="M${p.sh} Q${p.bend} ${p.hip}" stroke-width="${18+O}"/>${part(legs)}<path d="M${p.sh} Q${p.bend} ${p.hip}" stroke-width="18" style="stroke:var(--pf)"/>`
    : part(legs.concat([[p.sh, mid, 19], [mid, p.hip, 17]]));
  const head = `<circle cx="${p.head[0]}" cy="${p.head[1]}" r="${10.5+O/2}" fill="currentColor" stroke="none"/><circle cx="${p.head[0]}" cy="${p.head[1]}" r="10.5" stroke="none" style="fill:var(--pf)"/>`;
  const arm = part([[p.sh,p.nel,8],[p.nel,p.nwr,6.5]]);
  const dot = p.glow ? `<circle cx="${p.hip[0]}" cy="${p.hip[1]}" r="4.5" stroke="none" style="fill:var(--pdot)"/>` : "";
  return `<svg class="${cls||"pose"} p2" viewBox="0 0 200 140" aria-hidden="true">
    <rect x="10" y="130" width="180" height="5" rx="2.5" fill="currentColor" opacity=".16"/>
    <g ${mir?'transform="translate(200,0) scale(-1,1)"':""} stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none">${PROPS[p.prop]||""}${far}${torso}${head}${arm}${dot}</g></svg>`;
}

/* ================= Steigerungs-Tipp ================= */
const STEP = {gobletsq:2, calf:5, legpress:5, incl:1, flatdb:1, lra:1, lracable:1.25, bic:1, hammer:1, tri:1, ohtri:1, bulgarian:2, split:2, revlunge:2, dbhip:2, dbrdl:2, add:5, abd:5, glutebridge:5};
function stepOf(id){ const e = EXN[id] || {}; return STEP[id] || (e.eq==="Dumbbell" || e.eq==="Kettlebell" ? 2 : 2.5); }
// ex: the planned exercise (sets and reps of the workout), else the library default
function upSuggest(id, sets, ex){
  ex = ex || EXN[id]; if(!ex || (ex.type && ex.type!=="w") || !sets || sets.length<ex.s) return 0;
  if(!sets.every(s => num(s.r)>=ex.r[1])) return 0;
  const mk = Math.max(...sets.map(s => num(s.kg))); if(!(mk>0)) return 0;
  return Math.round((mk + stepOf(id))*100)/100;
}

/* ================= Übungs-Anleitungen ================= */
Object.assign(POSES, {
  xsquat:{h:[94,40], p:[[[98,52],[118,88]], [[118,88],[82,94],[88,132]], [[88,132],[74,132]], [[100,58],[116,66],[110,52]]], eq:[[[64,50],[148,56]]], c:[[64,50,11],[148,56,11]]},
  xcurl:{h:[30,82], p:[[[42,88],[112,90]], [[112,90],[150,92],[162,62]], [[50,90],[44,104],[40,114]]], eq:[[[28,100],[168,100]],[[40,100],[40,134]],[[156,100],[156,134]]], c:[[164,58,6]]},
  xcalf:{h:[100,24], p:[[[100,36],[100,84]], [[100,84],[96,106],[96,122]], [[100,84],[106,106],[106,122]], [[96,122],[106,124]], [[100,44],[88,66],[86,88]], [[100,44],[112,66],[114,88]]], eq:[[[78,126],[128,126]],[[78,126],[78,134]],[[128,126],[128,134]],[[80,90],[92,90]],[[108,90],[120,90]]]},
  xhip:{h:[42,78], p:[[[58,88],[110,86]], [[110,86],[142,84],[142,132]], [[142,132],[158,132]], [[60,90],[34,92]]], eq:[[[14,94],[66,94]],[[20,94],[20,134]],[[60,94],[60,134]]], c:[[108,70,13]]},
  xbss:{h:[86,40], p:[[[104,96],[92,54]], [[104,96],[66,98],[60,132]], [[60,132],[46,132]], [[104,96],[128,122],[158,100]], [[94,58],[90,82],[90,100]]], eq:[[[150,100],[196,100]],[[156,100],[156,134]],[[190,100],[190,134]],[[83,103],[97,103]]]},
  xrdl:{h:[54,62], p:[[[112,78],[68,68]], [[112,78],[104,104],[100,132]], [[100,132],[84,132]], [[70,70],[74,94],[78,112]]], c:[[78,116,13]]},
  xkick:{h:[50,82], p:[[[64,90],[124,90]], [[64,92],[62,112],[60,132]], [[124,90],[122,130],[158,132]], [[124,90],[156,76],[188,60]]]},
  xadd:{h:[100,30], p:[[[100,42],[100,90]], [[86,92],[114,92]], [[86,92],[56,102],[54,132]], [[114,92],[144,102],[146,132]], [[100,50],[80,72],[76,90]], [[100,50],[120,72],[124,90]]], eq:[[[66,88],[66,114]],[[134,88],[134,114]]]},
  xlat:{h:[100,54], p:[[[100,66],[100,106]], [[84,68],[116,68]], [[84,68],[64,84],[58,42]], [[116,68],[136,84],[142,42]], [[92,108],[84,120],[84,132]], [[108,108],[116,120],[116,132]]], eq:[[[34,40],[166,40]],[[100,40],[100,4]],[[72,108],[128,108]]]},
  xincl:{h:[64,66], p:[[[104,112],[74,78]], [[74,80],[76,56],[78,32]], [[104,112],[138,104],[146,132]]], eq:[[[98,122],[64,86]],[[98,122],[140,122]],[[112,122],[112,134]],[[70,30],[86,30]]]},
  xlra:{h:[100,28], p:[[[100,40],[100,86]], [[100,48],[70,52],[42,54]], [[100,48],[130,52],[158,54]], [[100,86],[92,110],[90,132]], [[100,86],[108,110],[110,132]]], eq:[[[38,46],[38,62]],[[162,46],[162,62]]]},
  xbic:{h:[100,26], p:[[[100,38],[100,86]], [[100,46],[102,72],[120,54]], [[100,86],[96,110],[94,132]], [[100,86],[106,110],[108,132]]], eq:[[[113,54],[127,54]]]},
  xtri:{h:[94,28], p:[[[100,40],[100,86]], [[100,46],[108,16],[86,26]], [[100,86],[96,110],[94,132]], [[100,86],[106,110],[108,132]]], eq:[[[79,21],[91,31]]]}
});
const EXPOSE = {squat:"xsquat", smithsq:"xsquat", gobletsq:"xsquat", legpress:"xsquat", legcurl:"xcurl", seatcurl:"xcurl", calf:"xcalf", hip:"xhip", smithhip:"xhip", glutebridge:"xhip", dbhip:"xhip", bulgarian:"xbss", split:"xbss", revlunge:"xbss",
  rdl:"xrdl", dbrdl:"xrdl", hyper:"xrdl", kick:"xkick", kickm:"xkick", abd:"xadd", add:"xadd", cableadd:"xadd",
  lat:"xlat", latclose:"xlat", latone:"xlat", incl:"xincl", inclm:"xincl", flatdb:"xincl", lra:"xlra", lracable:"xlra", lram:"xlra",
  bic:"xbic", hammer:"xbic", cablecurl:"xbic", tri:"xtri", pushdown:"xtri", ohtri:"xtri"};
const GUIDE = {
  bench:{f:"Chest, front shoulders and triceps", s:["Lie with your eyes under the bar, feet flat on the floor.","Grip slightly wider than shoulder-width, pull your shoulder blades together and down.","Unrack and lower the bar with control to your mid chest.","Press up and slightly back until your arms are straight."],
    x:["Don't bounce the bar off your chest.","Keep your glutes on the bench. Use a spotter or safety bars for heavy sets."]},
  deadlift:{f:"Glutes, hamstrings, back", s:["Feet hip-width, the bar over the middle of your feet.","Hinge down and grip the bar just outside your legs, shins touch the bar.","Chest up, back flat, take the slack out of the bar.","Push the floor away and stand up tall, then lower the bar the same way."],
    x:["Never round your lower back. Lower the weight instead.","Keep the bar close to your legs the whole way."]},
  pullup:{f:"Lats, upper back and biceps", s:["Grip the bar slightly wider than shoulder-width, palms facing away.","Hang with straight arms, core tight.","Pull your elbows down toward your ribs until your chin is over the bar.","Lower slowly until your arms are straight again."],
    x:["No swinging or kicking.","Can't do one yet? Use the assisted machine or a band."]},
  crow:{f:"Middle back and lats", s:["Sit tall, feet on the platform, knees slightly bent.","Hold the handle with straight arms, chest up.","Pull the handle to your belly, elbows close, squeeze your shoulder blades.","Let the weight forward slowly until your arms are long."],
    x:["Don't rock back and forth with your upper body.","Keep your shoulders down, away from your ears."]},
  legpress:{f:"Quads and glutes", s:["Sit with your back flat on the pad, feet hip-width in the middle of the platform.","Release the safety handles, legs almost straight.","Lower the platform until your knees are at about 90°.","Press back up through your heels without locking your knees."],
    x:["Don't let your lower back lift off the pad at the bottom.","Knees follow your toes, don't let them cave in."]},
  squat:{f:"Quads, glutes and inner thighs", s:["Bar on your upper back, not on your neck. Feet about shoulder-width, toes slightly out.","Brace your core, chest up.","Sit back and down until your thighs are at least parallel to the floor.","Push up through your whole foot, knees following your toes."],
    x:["Don't let your knees cave in.","Keep your heels on the floor; if they lift, widen your stance or go less deep."]},
  legcurl:{f:"Hamstrings (back of the thigh)", s:["Lie face down, the pad just above your heels, knees just off the bench.","Hold the handles, press your hips into the pad.","Curl your heels toward your glutes.","Lower slowly until your legs are almost straight."],
    x:["Don't lift your hips.","No swinging, lower with control."]},
  calf:{f:"Calves", s:["Balls of your feet on the edge of a step or the machine plate.","Lower your heels slowly for a stretch.","Rise as high as you can and pause for a second."],
    x:["Use the full range of motion.","Keep your knees almost straight."]},
  hip:{f:"Gluteus maximus (glutes)", s:["Upper back against the edge of the bench, just below your shoulder blades.","Feet hip-width apart and far enough forward that your shins are vertical at the top.","Chin to chest, look forward instead of at the ceiling.","Drive up through your heels, squeeze your glutes hard for 1 second at the top, lower slowly."],
    x:["Don't arch at the top: keep your ribs down, tilt your pelvis slightly back.","Feet too close to your hips? Then your quads work more than your glutes."]},
  bulgarian:{f:"Glutes and hamstrings", s:["Rest the top of your back foot on the bench, front foot far forward.","Lean your torso slightly forward, back straight.","Lower slowly until your back knee almost touches the floor.","Push back up through your front heel."],
    x:["Front foot too close to the bench? Then your knee travels far forward and your quads work more.","Don't let your knee cave in."]},
  rdl:{f:"Glutes and hamstrings", s:["Stand hip-width apart, bend your knees slightly and keep them there.","Push your hips far back, as if closing a door with your glutes.","Slide the bar down close to your legs to just below the knee.","Squeeze your glutes and bring your hips forward again."],
    x:["Keep your back straight: rather go less deep.","It's not a squat, the movement comes from your hips."]},
  kick:{f:"Glutes, especially the upper and outer part", s:["Ankle strap on the cable or the machine pad, hold on firmly.","Torso slightly forward, core tight.","Move your leg back and slightly out.","Pause briefly at the top, return slowly."],
    x:["No swinging from your back, avoid arching.","Better light and clean than heavy and wobbly."]},
  add:{f:"Inner thighs (adductors)", s:["Set the pads on the inside of your knees, sit upright.","Squeeze your legs together slowly.","Hold for 1 second, then open with control.","Only open as far as feels comfortable."],
    x:["Don't let the weight drop back.","Keep your upper body still."]},
  lat:{f:"Latissimus dorsi (lats)", s:["Knees under the pad, grip slightly wider than shoulder-width.","Chest out, lean back slightly.","Pull your elbows toward your pockets until the bar is at chin height.","Let it up slowly until your arms are almost straight."],
    x:["Don't yank back with your whole body.","Keep your shoulders down, away from your ears."]},
  incl:{f:"Upper chest and front shoulders", s:["Set the bench to about 30°, feet firmly on the floor.","Pull your shoulder blades together and down.","Lower the dumbbells with control to chest height, elbows at a slight angle.","Press up without fully locking your arms."],
    x:["Don't flare your elbows all the way out.","Keep your glutes on the bench."]},
  lra:{f:"Side shoulders", s:["Stand tall, dumbbells by your sides, arms slightly bent.","Raise your arms out to shoulder height, leading with your elbows.","Pause briefly at the top, lower slowly."],
    x:["No momentum from your legs.","Don't shrug your shoulders, use a lighter weight instead."]},
  bic:{f:"Biceps", s:["Stand tall, elbows close to your body.","Curl the dumbbells up, palms facing up.","Squeeze briefly at the top, lower slowly."],
    x:["Keep your elbows at your sides.","No swinging from your upper body."]},
  tri:{f:"Triceps (back of the upper arm)", s:["Hold a dumbbell overhead with both hands.","Elbows point forward and stay close.","Lower the dumbbell behind your head and extend again."],
    x:["Don't let your elbows drift far apart.","Core tight, don't arch your back."]}
};
const PAT_POSE = {squat:"xsquat", legcurl:"xcurl", calf:"xcalf", thrust:"xhip", lunge:"xbss", rdl:"xrdl", kick:"xkick", abduct:"xadd", adduct:"xadd",
  vpull:"xlat", pullup:"xlat", ipress:"xincl", hpress:"xincl", raise:"xlra", curl:"xbic", tri:"xtri"};
function guideSheet(id, back){
  const ex = EXN[id]; if(!ex) return;
  const g = GUIDE[id] || {}, focus = g.f || NFEx.focusOf(ex);
  const steps = g.s || [ex.cue].filter(Boolean);
  sheet(`<p class="eyebrow">How to · ${esc(ex.part||"")} · ${esc(NFEx.TYPES[ex.type]||"")}</p><h3 style="margin:-6px 0 0">${esc(ex.n)}</h3>${focus?`<p class="muted small" style="margin:-4px 0 0">🎯 ${esc(focus)}</p>`:""}
    ${ex.img ? `<div class="exdraw n${ex.img.length}">${ex.img.map((c,i) => `<figure><img src="img/ex/${id}-${i+1}.svg" alt="${esc(ex.n)}: ${esc(c.toLowerCase())}" loading="lazy"><figcaption>${ex.img.length>1?`<b>${i+1}</b> `:""}${esc(c)}</figcaption></figure>`).join("")}</div>
      <p class="credit">Drawings: ${ex.imgSrc==="wg" ? `<a href="https://github.com/bryllim/workout-guide" target="_blank" rel="noopener">Workout Guide</a> by Bryl Lim, based on ` : ""}<a href="https://github.com/everkinetic/data" target="_blank" rel="noopener">Everkinetic</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a></p>`
      : poseSvg(EXPOSE[id] || PAT_POSE[ex.pat], "expose")}
    ${steps.length?`<p class="exn" style="margin:0;font-weight:600">How to do it</p><ol class="guide">${steps.map(t => `<li>${esc(t)}</li>`).join("")}</ol>`:""}
    ${(g.x||[]).length?`<p class="exn" style="margin:0;font-weight:600">Watch out for</p><ul class="guide">${g.x.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`:""}
    ${back ? `<button class="secondary" data-act="libback">‹ Back to the list</button>` : `<button class="secondary" data-act="closesheet">Close</button>`}`);
}

/* ================= Po-Mobility (Ruhetage, ohne Trainings-Uhr) ================= */
const MOBILITY = [
  {n:"Cat-Cow", i:"On all fours. Inhale: belly drops. Exhale: round your back. Relax into your breath.", d:60, pose:"cat"},
  {n:"90/90 Hip Rotation", i:"Sit with both knees bent 90° to the same side. Slowly tip your knees to the other side, back and forth.", d:60, pose:"m9090"},
  {n:"Pigeon right", i:"Right knee forward, shin across, left leg long behind you. Torso sinks forward.", d:60, pose:"pigeon"},
  {n:"Pigeon left", i:"Left knee forward, right leg long behind you. Breathe calmly and let go.", d:60, pose:"pigeon-"},
  {n:"Figure 4 right", i:"On your back. Place your right ankle on your left knee and gently pull your left leg toward your chest.", d:45, pose:"mfig4"},
  {n:"Figure 4 left", i:"Place your left ankle on your right knee and gently pull your right leg toward your chest.", d:45, pose:"mfig4-"},
  {n:"Hip Flexor right", i:"Kneeling, right foot forward. Squeeze your glutes and gently push your hips forward.", d:45, pose:"mkneel"},
  {n:"Hip Flexor left", i:"Left foot forward. Squeeze your glutes, hips gently forward.", d:45, pose:"mkneel-"},
  {n:"Bridge Hold", i:"On your back, feet hip-width apart. Hips up, squeeze your glutes and hold. Lower briefly in between.", d:60, pose:"bridge"},
  {n:"Frog", i:"On all fours, knees wide apart. Slowly push your hips back, only as far as feels comfortable.", d:45, pose:"mfrog"},
  {n:"Supine Twist right", i:"Lower your knees to the left, right arm long, gaze to the right.", d:30, pose:"twist"},
  {n:"Supine Twist left", i:"Lower your knees to the right, left arm long, gaze to the left.", d:30, pose:"twist-"},
  {n:"Child's Pose", i:"Knees wide, hips to your heels, forehead down. Breathe. Nicely done.", d:30, pose:"child"}
];
const MOB_MIN = Math.round(MOBILITY.reduce((a,x) => a+x.d, 0)/60);
const MOB_FLOWS = [{n:"Hips and glutes", steps:MOBILITY}, {n:"Glute activation", steps:MOBILITY_B}];
const SHOULDER_MOB = [
  {n:"Arm Circles", i:"Stand tall, big slow circles forward, then backward.", d:45, pose:"up"},
  {n:"Cat-Cow", i:"On all fours, round and arch your back with your breath.", d:45, pose:"cat"},
  {n:"Thread the Needle right", i:"On all fours, slide your right arm under your body, shoulder and ear to the floor.", d:40, pose:"child"},
  {n:"Thread the Needle left", i:"Now the left arm. Breathe into your upper back.", d:40, pose:"child-"},
  {n:"Downward Dog", i:"Hips up and back, press your chest toward your thighs, arms long.", d:45, pose:"dog"},
  {n:"Cobra", i:"On your belly, hands under your shoulders, lift your chest gently, shoulders down.", d:30, pose:"cobra"},
  {n:"Chest Opener right", i:"Arm out to the side at shoulder height, turn your body away until you feel your chest.", d:30, pose:"w2"},
  {n:"Chest Opener left", i:"Now the other side. Keep your shoulder down.", d:30, pose:"w2-"},
  {n:"Child's Pose", i:"Knees wide, arms long in front, sink your hips back. Nicely done.", d:55, pose:"child"}
];
const RUNNER_MOB = [
  {n:"Quad Stretch right", i:"Stand on your left leg, pull your right heel to your glutes, knees together.", d:30, pose:"tree"},
  {n:"Quad Stretch left", i:"Now the other leg. Hold on to something if you need to.", d:30, pose:"tree-"},
  {n:"Low Lunge right", i:"Right foot forward, left knee down, hips sink forward. Stretches your hip flexor.", d:40, pose:"lunge"},
  {n:"Low Lunge left", i:"Left foot forward, right knee down. Tall upper body.", d:40, pose:"lunge-"},
  {n:"Downward Dog", i:"Pedal your heels toward the floor in turn to stretch your calves.", d:40, pose:"dog"},
  {n:"Seated Forward Fold", i:"Legs long, fold forward with a long back. Stretches your hamstrings.", d:40, pose:"paschim"},
  {n:"Figure 4 right", i:"On your back, right ankle on your left knee, pull your left leg toward you.", d:35, pose:"mfig4"},
  {n:"Figure 4 left", i:"Now the left ankle on your right knee.", d:35, pose:"mfig4-"},
  {n:"Butterfly", i:"Soles together, knees drop outward, lean gently forward.", d:25, pose:"butterfly"},
  {n:"Supine Twist right", i:"Lower your knees to the left, gaze to the right.", d:25, pose:"twist"},
  {n:"Supine Twist left", i:"Lower your knees to the right, gaze to the left. Good run!", d:20, pose:"twist-"}
];
const STRETCH_MOB = [
  {n:"Cat-Cow", i:"On all fours, move gently with your breath.", d:45, pose:"cat"},
  {n:"Downward Dog", i:"Hips up and back, heels toward the floor, knees may bend.", d:45, pose:"dog"},
  {n:"Low Lunge right", i:"Right foot forward, left knee down, hips sink forward, arms up.", d:40, pose:"lunge"},
  {n:"Low Lunge left", i:"Left foot forward, right knee down.", d:40, pose:"lunge-"},
  {n:"Pigeon right", i:"Right knee forward, left leg long behind you, sink forward.", d:45, pose:"pigeon"},
  {n:"Pigeon left", i:"Left knee forward, right leg long behind you.", d:45, pose:"pigeon-"},
  {n:"Cobra", i:"Hands under your shoulders, lift your chest gently.", d:30, pose:"cobra"},
  {n:"Seated Forward Fold", i:"Legs long, fold forward with a long back.", d:45, pose:"paschim"},
  {n:"Supine Twist right", i:"Lower your knees to the left, gaze to the right.", d:30, pose:"twist"},
  {n:"Supine Twist left", i:"Lower your knees to the right, gaze to the left.", d:30, pose:"twist-"},
  {n:"Child's Pose", i:"Knees wide, hips to your heels, forehead down. Done.", d:25, pose:"child"}
];
// Short routines without a session clock. Ids match the plan add-ons in plan.js.
const MOB = {
  hips:{id:"hips", n:"Hip mobility", steps:MOBILITY, why:"Loosens your hips after squats, lunges and hip thrusts."},
  shoulders:{id:"shoulders", n:"Shoulder mobility", steps:SHOULDER_MOB, why:"Opens your chest and upper back after pressing and pulling."},
  stretch:{id:"stretch", n:"Full-body stretch", steps:STRETCH_MOB, why:"A calm stretch from hips to shoulders after a full-body session."},
  runner:{id:"runner", n:"Runner's stretch", steps:RUNNER_MOB, why:"Calves, quads, hamstrings and hips after your run."},
  glutes:{id:"glutes", n:"Glute activation", steps:MOBILITY_B, why:"Wakes up your glutes on a rest day."}
};
// Cool-down routine for a finished session (none for yoga)
function addonFor(e){
  if(!e || e.yoga) return null;
  const g = e.run ? "run" : (W[e.type]||{}).group, id = NFPlan.ADDON_FOR[g];
  return id ? MOB[id] : null;
}
function yogaSheet(){
  const ml = S.settings.mob || [], last = ml.length ? ml[ml.length-1] : 0, ly = S.history.filter(e => e.yoga).slice(-1)[0];
  sheet(`<h3>Yoga</h3>
    <button class="start" data-kind="yoga" data-act="yogaflow"><span class="stripe"></span><span><b>Yoga session</b><small>7 sessions to choose from, 5 to 45 min · counts as a session</small><small>${ly?"Last done "+ago(ly.start):"Not done yet"}</small></span><span class="arrow">›</span></button>
    <button class="start" data-kind="yoga" data-act="mobility"><span class="stripe"></span><span><b>Glute Mobility</b><small>${stepsMin(curMob().steps)} min · today: ${esc(curMob().n)} · no session clock</small><small>${last?"Last done "+ago(last):"Not done yet"}</small></span><span class="arrow">›</span></button>
    <p class="small muted" style="margin:0">Glute mobility doesn't count as a session. It helps with sore muscles and keeps your hips mobile.</p>
    <p class="exn" style="margin:4px 0 0;font-weight:600">Short routines</p>
    <div class="alts"><button class="altrow" data-act="flexcheck"><b>Flexibility check · 30 s${NFYoga.flexDueIn(S.settings.flex, Date.now()) ? "" : ` <span class="ysug">Due</span>`}</b><small>How far you reach in a forward fold. Every two weeks.</small></button><button class="altrow" data-act="study"><b>Study break · 5 min</b><small>Neck, shoulders and breathing on your chair. No mat needed.</small></button>${["hips","shoulders","runner","stretch"].map(id => `<button class="altrow" data-act="mob" data-id="${id}"><b>${esc(MOB[id].n)} · ${stepsMin(MOB[id].steps)} min</b><small>${esc(MOB[id].why)}</small></button>`).join("")}</div>
    <button class="secondary" data-act="closesheet">Cancel</button>`);
}
// id: one of MOB; without an id the glute routines take turns
function startMobility(id){
  const r = MOB[id], fl = r ? {n:r.n, steps:r.steps} : curMob();
  startTimer({title:r ? r.n : "Glute Mobility", flow:fl.n, calm:true, prep:true, steps:fl.steps.map(x => Object.assign({c:"yoga"}, x)), onDone:() => {
    S.settings.mob = (S.settings.mob||[]).concat(Date.now()).slice(-300); if(!r) S.settings.mobFlow = ((S.settings.mobFlow||0) + 1) % MOB_FLOWS.length; save();
    if(screen==="home") renderHome();
    toast(r && id!=="hips" ? "Nice stretch. Well done 🧘‍♀️" : "Nice stretch. Your hips say thanks 🧘‍♀️");
  }});
}

/* ================= Beweglichkeits-Check: wie weit kommst du im Vorbeugen? =================
   Alle 14 Tage, 30 Sekunden. Gespeichert in S.settings.flex [{t, v}], Logik in yoga.js (addFlex, flexTrend, flexDueIn). */
const flexChecks = () => NFYoga.flexList(S.settings.flex);
const flexDay = t => new Date(t).toLocaleDateString("en-GB", {day:"numeric", month:"short"});
function flexSheet(err){
  sheet(`<h3>Flexibility check</h3>
    <ol class="hsteps flexsteps">
      <li>Warm up first: march on the spot for a minute.</li>
      <li>Stand with your feet together, knees straight but not locked.</li>
      <li>Breathe out and fold forward slowly. <b>No bouncing.</b></li>
      <li>Hold for three breaths at your furthest point.</li></ol>
    <p class="exn" style="margin:0;font-weight:600">Where do your fingertips reach?</p>
    <div class="flexopts" role="group" aria-label="How far you reach">${NFYoga.FLEX.slice().reverse().map(x => `<button class="flexopt" data-act="flexpick" data-v="${x.v}"><i style="width:${x.v*20}%"></i><span>${esc(x.n)}</span></button>`).join("")}</div>
    ${err ? `<p class="err" role="alert">${esc(err)}</p>` : ""}
    <p class="small muted" style="margin:0">Stop if anything hurts. Compare at the same time of day, warm muscles reach further.</p>
    <button class="secondary" data-act="closesheet">Cancel</button>`);
}
function flexSave(v){
  const r = NFYoga.addFlex(S.settings.flex, v, Date.now());
  if(!r.ok) return flexSheet(r.err);
  S.settings.flex = r.list;
  const fresh = checkBadges(false); save();
  const tr = NFYoga.flexTrend(r.list), d = tr.prev ? tr.last.v - tr.prev.v : 0;
  const head = !tr.prev ? `Your starting point: ${esc(NFYoga.flexName(tr.last.v))}`
    : d > 0 ? `${esc(NFYoga.flexName(tr.prev.v))} → ${esc(NFYoga.flexName(tr.last.v))} 🎉`
    : d === 0 ? `${esc(NFYoga.flexName(tr.last.v))}, same as last time` : `${esc(NFYoga.flexName(tr.last.v))} today`;
  const txt = !tr.prev ? `Check again in ${NFYoga.FLEX_EVERY} days and watch it change. Sessions like “After your run” and “Wind down” stretch exactly these muscles.`
    : d > 0 ? `One step further than on ${flexDay(tr.prev.t)}${d > 1 ? ` (${d} steps)` : ""}. Your yoga is paying off.`
    : d === 0 ? `Flexibility grows slowly. Keep stretching, the next check is in ${NFYoga.FLEX_EVERY} days.`
    : `A bit less than on ${flexDay(tr.prev.t)}. That happens: cold muscles, a long day at the desk. Your best so far is ${esc(NFYoga.flexName(tr.best))}.`;
  if(screen==="home") render();
  sheet(`<h3>${head}</h3><p class="muted" style="margin:0">${txt}</p>${fresh.some(b => b.id==="toes") ? `<p class="hint">New badge: Toes touched ✋</p>` : ""}
    <button class="primary yoga" data-act="closesheet">Done</button>`);
}
/* Bereich im Progress-Tab: aktueller Stand, Verlauf als Stufen, nächster Check */
function flexHtml(){
  const l = flexChecks(), tr = NFYoga.flexTrend(l), due = NFYoga.flexDueIn(l, Date.now());
  const goal = yGoals().includes("toes");
  if(!tr) return `<section class="pblock c-yoga"><h2 class="sec">Flexibility</h2><div class="card"><p style="margin:0">How far can you reach in a forward fold? Do the 30-second check${goal ? " for your goal “Touch your toes”" : ""} and watch it change every two weeks.</p>
    <button class="secondary flexgo" data-act="flexcheck">Start the check</button></div></section>`;
  const pts = l.slice(-12), W0 = 300, H0 = 120, x = i => pts.length===1 ? W0/2 : 16 + i*(W0-32)/(pts.length-1), y = v => H0 - 12 - (v-1)*(H0-24)/4;
  const line = pts.map((c,i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(c.v).toFixed(1)}`).join("");
  return `<section class="pblock c-yoga"><h2 class="sec">Flexibility</h2><div class="card">
    <div class="flexnow"><div><small>Now</small><b>${esc(NFYoga.flexName(tr.last.v))}</b></div><div><small>Since ${flexDay(tr.first.t)}</small><b class="tnum">${tr.gained > 0 ? "+" + tr.gained : tr.gained} ${Math.abs(tr.gained)===1 ? "step" : "steps"}</b></div></div>
    <svg class="flexchart" viewBox="0 0 ${W0} ${H0}" role="img" aria-label="Your flexibility checks: ${pts.map(c => NFYoga.flexName(c.v)).join(", ")}">
      <line x1="0" x2="${W0}" y1="${y(NFYoga.TOES)}" y2="${y(NFYoga.TOES)}" class="toesline"/><text x="${W0-4}" y="${y(NFYoga.TOES)-5}" text-anchor="end">Toes</text>
      <path d="${line}"/>${pts.map((c,i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(c.v).toFixed(1)}" r="4.5"/>`).join("")}</svg>
    <p class="small" style="margin:0">${tr.toes ? "You reached your toes ✋ " : goal ? `Goal: Toes. ${NFYoga.TOES - tr.last.v > 0 ? `${NFYoga.TOES - tr.last.v} ${NFYoga.TOES - tr.last.v===1 ? "step" : "steps"} to go. ` : ""}` : ""}${due ? `Next check in ${due} ${due===1 ? "day" : "days"}.` : "Time for your next check."}</p>
    ${due ? "" : `<button class="secondary flexgo" data-act="flexcheck">Check now</button>`}</div></section>`;
}

/* ================= Weather where you are ================= */
// Your phone's position if you allowed it, otherwise Nova SBE in Carcavelos.
// The position is rounded to about 1 km before it is stored or sent.
let WX = null, wxBusy = false, geoBusy = false;
function wxPos(){ const p = S.settings.wxPos; return S.settings.wxGeo===true && p && isFinite(p.lat) && isFinite(p.lon) ? p : NFRun.WX_HOME; }
const wxPlace = () => wxPos().place || "Here";
function wxLoad(force){
  if(S.settings.wxGeo===true && !geoBusy && (!S.settings.wxPos || Date.now()-(S.settings.wxPos.t||0) > 2*3600e3)) wxLocate(false);
  const pos = wxPos(), here = c => c && c.d && NFRun.samePlace(c.pos, pos);
  if(!force && here(WX) && Date.now()-WX.t < 20*60e3) return;
  try{
    const c = JSON.parse(localStorage.getItem("po-wx")||"null");
    if(here(c) && Date.now()-c.t < 3*3600e3){ WX = c; if(!force && Date.now()-c.t < 20*60e3) return; }
  }catch(e){}
  if(wxBusy || navigator.onLine===false || !window.fetch) return; wxBusy = true;
  fetch(NFRun.wxUrl(pos)).then(r => r.ok ? r.json() : null).then(d => {
    if(d && d.current){ WX = {t:Date.now(), d, pos:{lat:pos.lat, lon:pos.lon}}; try{ localStorage.setItem("po-wx", JSON.stringify(WX)); }catch(e){} wxPaint(); }
  }).catch(() => {}).finally(() => { wxBusy = false; });
}
// ask = the person tapped "use my location" (show what went wrong); otherwise a quiet refresh
function wxLocate(ask){
  if(!navigator.geolocation){ if(ask) toast("This browser can't share your location."); return; }
  geoBusy = true;
  navigator.geolocation.getCurrentPosition(g => {
    geoBusy = false;
    const pos = {lat:Math.round(g.coords.latitude*100)/100, lon:Math.round(g.coords.longitude*100)/100, t:Date.now()}, old = S.settings.wxPos;
    pos.place = old && old.place && NFRun.samePlace(old, pos) ? old.place : "";
    S.settings.wxGeo = true; S.settings.wxPos = pos; save();
    if(!pos.place) wxPlaceLoad(pos);
    wxLoad(true); wxPaint(); wxSeg();
    if(ask) toast("Weather now shows where you are 📍");
  }, e => {
    geoBusy = false;
    if(e && e.code===1){
      S.settings.wxGeo = false; save(); wxLoad(); wxPaint(); wxSeg();
      if(ask) toast(`Location is blocked, so the weather is for ${NFRun.WX_HOME.place}. You can allow it in your browser's site settings.`);
    } else if(ask) toast("Couldn't find your location just now. Please try again.");
  }, {enableHighAccuracy:false, timeout:10000, maximumAge:30*60e3});
}
// Town name for the rounded position (free service without a key); "Here" if it fails
function wxPlaceLoad(pos){
  if(!window.fetch) return;
  fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.lat}&longitude=${pos.lon}&localityLanguage=en`)
    .then(r => r.ok ? r.json() : null).then(d => {
      const n = NFRun.placeName(d), cur = S.settings.wxPos;
      if(n && cur && NFRun.samePlace(cur, pos)){ cur.place = n; save(); wxPaint(); }
    }).catch(() => {});
}
function wxSeg(){ document.querySelectorAll("#wxseg button").forEach(x => x.setAttribute("aria-pressed", (x.dataset.act==="wxhere")===(S.settings.wxGeo===true))); }
function wxCode(c, day){
  if(c===0) return [day?"☀️":"🌙","clear"];
  if(c<=2) return [day?"🌤️":"🌙","partly cloudy"];
  if(c===3) return ["☁️","cloudy"];
  if(c===45 || c===48) return ["🌫️","foggy"];
  if(c>=51 && c<=57) return ["🌦️","drizzle"];
  if(c>=61 && c<=67) return ["🌧️","rain"];
  if(c>=71 && c<=77) return ["🌨️","snow"];
  if(c>=80 && c<=82) return ["🌦️","showers"];
  if(c===85 || c===86) return ["🌨️","snow showers"];
  if(c>=95) return ["⛈️","thunderstorm"];
  return ["🌡️",""];
}
function wxInfo(){
  if(!WX || !WX.d || !WX.d.current || !NFRun.samePlace(WX.pos, wxPos())) return null;
  const c = WX.d.current, code = c.weather_code, [emoji, txt] = wxCode(code, c.is_day!==0);
  const probs = ((WX.d.hourly||{}).precipitation_probability||[]).slice(0,3).filter(x => x!=null);
  const prob = probs.length ? Math.max(...probs) : 0, t = c.temperature_2m, wind = c.wind_speed_10m;
  let v;
  if(code>=95) v = "Thunderstorms, better use the treadmill today ⚡";
  else if(c.precipitation>0.2 || (code>=61 && code<=67) || (code>=80 && code<=82)) v = "It's raining: treadmill or rain jacket ☔";
  else if((code>=71 && code<=77) || code===85 || code===86) v = "Snow, watch out for ice ❄️";
  else if(prob>=60) v = "Rain on the way, better head out soon";
  else if(t<=0) v = "Cold: hat and gloves 🧤";
  else if(t>=26) v = "Warm: drink plenty, go early or in the evening";
  else if(wind>=35) v = "Very windy, it'll be tough 💨";
  else v = "Perfect running weather 👟";
  return {emoji, txt, t, feels:c.apparent_temperature, wind, prob, v};
}
function wxShort(){ const w = wxInfo(); return w ? `${w.emoji} ${esc(wxPlace())} ${Math.round(w.t)}° · ${w.v}` : ""; }
function wxLong(){
  const w = wxInfo(); if(!w) return "";
  return `<b>${w.emoji} ${esc(wxPlace())} ${Math.round(w.t)}°${w.txt?" · "+w.txt:""}</b><span>feels like ${Math.round(w.feels)}° · wind ${Math.round(w.wind)} km/h · rain ${Math.round(w.prob)} %</span><span class="v">${w.v}</span>`;
}
function wxPaint(){ document.querySelectorAll("[data-wx]").forEach(el => { el.innerHTML = el.dataset.wx==="long" ? wxLong() : el.dataset.wx==="plain" ? wxPlain() : wxShort(); el.hidden = !wxInfo(); }); }

/* ================= Begrüßungskarte (passt sich Tag & Situation an) ================= */
const NEXT_TXT = {po:"Lower body with squats, Romanian deadlifts and hip thrusts", oben:"Upper body with lat pulldown, incline press and lateral raises", lauf:"a run, outside or on the treadmill", yoga:"30 minutes of vinyasa flow"};
const TYPE_ICON = {po:"🦵", oben:"💪", lauf:"🏃‍♀️", yoga:"🧘‍♀️"};
function hiShort(){ const h = new Date().getHours(), n = esc(firstName()); const [t, e] = h<5 ? ["Still awake?","🌙"] : h<11 ? ["Good morning","☀️"] : h<14 ? ["Hello","👋"] : h<18 ? ["Hey","💪"] : h<22 ? ["Good evening","🌙"] : ["Still awake?","🌙"]; return !n ? `${t} ${e}` : t.endsWith("?") ? `${t.slice(0,-1)}, ${n}? ${e}` : `${t}, ${n} ${e}`; }
function heroCls(t){ const k = kc(W[t]); return k==="run" ? "run" : k==="yoga" ? "yoga" : ""; }
function startBtn(t, label){ return t==="yoga" ? `<button class="herobtn" data-act="yogaflow">${label}</button>` : `<button class="herobtn" data-act="start" data-t="${t}">${label}</button>`; }
// Workouts on the home screen: the strength workouts of the plan's split, a run and yoga
function startKeys(){
  const p = S.settings.plan, st = [];
  if(p && Array.isArray(p.sessions)) p.sessions.filter(x => x.kind==="s" && W[x.workout]).sort((x,y) => x.day-y.day).forEach(x => { if(!st.includes(x.workout)) st.push(x.workout); });
  return st.length ? [st[0], "lauf", ...st.slice(1), "yoga"] : ORDER.slice();
}
function workoutsSheet(){
  sheet(`<h3>All workouts</h3><p class="muted small">Templates for every split. Once started, you can swap, remove or add exercises.</p>
    <div class="alts">${NFEx.TEMPLATE_ORDER.map(k => `<button class="altrow" data-act="start" data-t="${k}"><b>${esc(W[k].name)}</b><small>${esc(W[k].desc)}</small></button>`).join("")}</div>
    <button class="secondary" data-act="closesheet">Close</button>`);
}

/* ================= Exercise library ================= */
let LIB = {q:"", part:"", eq:"", mode:"browse"};
function inSession(id){ return !!S.active && sessList().some(e => e.id===id || eff(e).id===id); }
const INFO_ICO = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>';
const CK_ICO = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
// Small picture of an exercise (end position of its drawing), else its first letter
function exThumb(e){
  return e && Array.isArray(e.img) && e.img.length && !e.custom
    ? `<span class="lth"><img src="img/ex/${e.id}-${e.img.length}.svg" alt="" loading="lazy"></span>`
    : `<span class="lth lt" aria-hidden="true">${esc(((e && e.n) || "?").charAt(0).toUpperCase())}</span>`;
}
function libListHtml(){
  const res = NFEx.search(LIB.q, {part:LIB.part, eq:LIB.eq, custom:customList()});
  if(!res.length) return `<p class="empty">No exercise found. Create it as your own exercise below.</p>`;
  const mode = LIB.mode, sel = LIB.sel || [];
  let letter = "", h = `<p class="count" aria-live="polite">${res.length} ${res.length===1?"exercise":"exercises"}</p>`;
  res.forEach(e => {
    const L = (e.n.charAt(0) || "#").toUpperCase();
    if(!LIB.q && L!==letter){ letter = L; h += `<p class="lsec" aria-hidden="true">${esc(L)}</p>`; }
    const has = mode==="add" && inSession(e.id), on = mode==="pick" && sel.includes(e.id);
    const act = mode==="pick" ? "libpick" : mode==="add" ? "libadd" : "guide";
    const sub = `${esc(e.part)}${e.eq ? " · " + esc(e.eq) : ""}${e.custom ? " · your exercise" : ""}${has ? " · added" : ""}`;
    h += `<div class="librow2${on?" on":""}"><button type="button" class="lr-main" data-act="${act}" data-ex="${e.id}"${mode==="pick" ? ` aria-pressed="${on}"` : ""}${has ? ` aria-disabled="true"` : ""}>${exThumb(e)}<span class="lr-t"><b>${esc(e.n)}</b><small>${sub}</small></span>${mode==="pick" ? `<span class="lr-ck">${on ? CK_ICO : ""}</span>` : ""}</button>${mode!=="browse" ? `<button type="button" class="lr-info" data-act="libguide" data-ex="${e.id}" aria-label="How to do ${esc(e.n)}">${INFO_ICO}</button>` : ""}</div>`;
  });
  return h;
}
function libSheet(){
  const chips = (list, key, label) => `<div class="libchips" role="group" aria-label="${label}">${["", ...list].map(v => `<button class="lchip" data-act="libfilter" data-k="${key}" data-v="${esc(v)}" aria-pressed="${LIB[key]===v}">${v || "All"}</button>`).join("")}</div>`;
  const pick = LIB.mode==="pick", day = pick && OB.a && OB.a.own && OB.a.own.days[LIB.day];
  sheet(`${pick ? `<div class="libtop"><h3 style="margin:0">Add to ${esc((day && day.name) || "your day")}</h3><button class="primary" id="libdone" data-act="libpickdone">${pickLabel()}</button></div>` : `<h3>${LIB.mode==="add" ? "Add exercise" : "Exercise library"}</h3>`}
    <input class="inp" id="libq" data-in="libq" type="search" enterkeyhint="search" autocomplete="off" placeholder="Search, e.g. row or dumbbell" value="${esc(LIB.q)}" aria-label="Search exercises">
    ${chips(NFEx.PARTS, "part", "Body part")}${chips(NFEx.EQUIP, "eq", "Equipment")}
    <div class="liblist" id="liblist">${libListHtml()}</div>
    <button class="secondary" data-act="libnew">+ Create your own exercise</button>
    <button class="secondary" data-act="closesheet">Close</button>`);
}
function openLibrary(mode){ LIB = {q:"", part:"", eq:"", mode}; libSheet(); }
// Picks exercises for an own day during onboarding: several at once, then back to the day list
function openPicker(i){ const day = OB.a.own.days[i]; LIB = {q:"", part:"", eq:"", mode:"pick", day:i, sel:(day.ex||[]).slice()}; libSheet(); }
const pickLabel = () => { const n = (LIB.sel||[]).length; return n ? `Done (${n})` : "Done"; };
function libNewSheet(err, val){
  err = err || {}; val = val || {};
  const sel = (name, list, label) => `<select class="inp" id="cx-${name}" name="${name}"${err[name]?` aria-invalid="true" aria-describedby="cx-${name}-err"`:""}><option value="">Choose…</option>${list.map(([v,t]) => `<option value="${esc(v)}"${val[name]===v?" selected":""}>${esc(t)}</option>`).join("")}</select><p class="err" id="cx-${name}-err" role="alert">${esc(err[name]||"")}</p>`;
  sheet(`<h3>Your own exercise</h3><p class="muted small">Missing something? Add it here. It shows up in the library and in your progress charts.</p>
    <form id="cx-form" class="cxf" novalidate>
      <label class="f" for="cx-name">Name</label><input class="inp" id="cx-name" name="name" maxlength="40" autocomplete="off" placeholder="e.g. Cossack Squat" value="${esc(val.name||LIB.q||"")}"${err.name?` aria-invalid="true" aria-describedby="cx-name-err"`:""}><p class="err" id="cx-name-err" role="alert">${esc(err.name||"")}</p>
      <label class="f" for="cx-part">Body part</label>${sel("part", NFEx.PARTS.map(x => [x,x]), "Body part")}
      <label class="f" for="cx-eq">Equipment</label>${sel("eq", NFEx.EQUIP.map(x => [x,x]), "Equipment")}
      <label class="f" for="cx-type">How you log it</label>${sel("type", Object.entries(NFEx.TYPES), "Log type")}
      <div class="row2"><button type="button" class="secondary" data-act="libback">Back</button><button class="primary" type="submit">Create</button></div>
    </form>`);
  const first = document.querySelector('#cx-form [aria-invalid="true"]') || (!val.name ? document.getElementById("cx-name") : null);
  if(first) setTimeout(() => { try{ first.focus({preventScroll:true}); }catch(e){} }, 50);
}
function libCreate(form){
  const val = {name:form.name.value, part:form.part.value, eq:form.eq.value, type:form.type.value};
  const v = NFEx.validateCustom(val, customList());
  if(!v.ok){ libNewSheet(v.errors, val); return; }
  const c = NFEx.makeCustom(v.value, "c" + Date.now().toString(36));
  S.settings.custom = customList().concat(c); EXN[c.id] = exFromLib(c); save();
  if(LIB.mode==="add" && S.active){ libAdd(c.id); return; }
  if(LIB.mode==="pick"){ LIB.sel = (LIB.sel||[]).concat(c.id); LIB.q = ""; libSheet(); toast(`${c.n} created and picked`); return; }
  LIB.q = ""; libSheet(); toast(`${c.n} created`);
}
function libAdd(id){
  const a = S.active; if(!a || !EXN[id]) return;
  if(inSession(id)){ toast("Already in this session"); return; }
  a.added = (a.added||[]).concat(id); a.sets[id] = prefilledSets(addedEx(id));
  save(); closeSheet(); renderSession(); toast(`${EXN[id].n} added`);
  setTimeout(() => { const el = document.getElementById(`r-${id}-0`); if(el) el.closest(".card").scrollIntoView({behavior:smoothOk() ? "smooth" : "auto", block:"center"}); }, 60);
}
function removeEx(baseId, added){
  const a = S.active; if(!a) return;
  if(added){ a.added = (a.added||[]).filter(x => x!==baseId); delete a.sets[baseId]; }
  else{ const x = eff(exIn(a.type, baseId)); a.hidden = (a.hidden||[]).concat(baseId); delete a.sets[x.id]; if(a.swap) delete a.swap[baseId]; }
  rest = null; save(); closeSheet(); renderSession();
}
/* One day of the plan (tap on the week strip) */
function planDaySheet(d){
  const p = S.settings.plan; if(!p) return;
  const se = (p.sessions||[]).find(x => x.day===d), today = NFPlan.weekdayIndex(Date.now())===d;
  if(!se){
    sheet(`<p class="eyebrow">${WDAY[(d+1)%7]}</p><h3>Rest day</h3><p class="muted">Recovery is part of training. If you feel like moving, try a short routine:</p>
      <div class="alts">${["hips","glutes","shoulders"].map(id => `<button class="altrow" data-act="mob" data-id="${id}"><b>${esc(MOB[id].n)} · ${stepsMin(MOB[id].steps)} min</b><small>${esc(MOB[id].why)}</small></button>`).join("")}</div>
      <button class="secondary" data-act="closesheet">Close</button>`);
    return;
  }
  const w = W[se.workout] || {}, ad = se.addon && MOB[se.addon.id];
  const list = w.kind==="gym" ? `<ol class="dayex">${w.ex.filter(e => !e.opt).map(e => `<li>${esc(e.n)} <small>${e.s} × ${rangeTxt(e)}</small></li>`).join("")}</ol>` : "";
  sheet(`<p class="eyebrow">${WDAY[(se.day+1)%7]}${today?" · today":""} · ${se.min} min</p><h3>${esc(se.title)}</h3>
    ${w.desc && w.kind!=="gym" ? `<p class="muted small">${esc(w.desc)}</p>` : ""}${list}
    ${ad ? `<p class="small" style="margin:0">Afterwards: <b>${esc(ad.n)}</b> · ${stepsMin(ad.steps)} min</p>` : ""}
    <button class="primary" data-act="start" data-t="${esc(se.workout)}">${today ? "Start now" : "Start anyway"}</button>
    <button class="secondary" data-act="closesheet">Close</button>`);
}
function otherLinks(next){ const o = startKeys().filter(t => t!==next && t!=="yoga"); return `<span class="heroalt">or ${o.map(t => `<button class="linkbtn" data-act="start" data-t="${t}">${W[t].name}</button>`).join(" · ")}</span>`; }
function entryShareSpec(e){
  const ds = new Date(e.start); ds.setHours(0,0,0,0);
  const g = rangeData(ds.getTime(), ds.getTime()+864e5).gains || [];
  const nSets = Object.values(e.sets||{}).reduce((x,a) => x+a.length, 0);
  return summaryShareSpec({e, ups:g.map(x => ({n:x.n, rec:true, chips:[`${fmt(x.to)} kg`]})), nSets, vol:volOf(e), weekCount:stats().thisWeek});
}
function heroHtml(st){
  const now = new Date(), d = now.getDay(), hr = now.getHours();
  const date = now.toLocaleDateString("en-GB", {weekday:"long", day:"numeric", month:"long"});
  const card = (cls, h2, p, btn, alt, extra) => `<section class="hero ${cls||""}"${extra||""}><small>${hiShort()} · ${date}</small><h2>${h2}</h2>${p?`<p>${p}</p>`:""}${btn||""}${alt||""}</section>`;
  const next = st.next, left = Math.max(0, st.goal - st.thisWeek);
  // 1) Training läuft
  if(S.active){
    const a = S.active;
    return card(heroCls(a.type), `${W[a.type].name} in progress`, `⏱ <b class="tnum" data-elapsed>${elapsedTxt(a)}</b> · Keep going, you've got this!`, `<button class="herobtn" data-act="resume">▶ Resume</button>`);
  }
  // 2) Sonntagabend: Rückblick
  const ws = mondayOf(Date.now());
  const md = now.getDate(), lastD = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const mref = md===lastD && hr>=18 ? [now.getFullYear(), now.getMonth()] : md<=3 ? (p => [p.getFullYear(), p.getMonth()])(new Date(now.getFullYear(), now.getMonth()-1, 1)) : null;
  if(mref && S.settings.recapSeen!==mref[0]+"-"+mref[1]){
    const mr = recapData(mref[0], mref[1]), key = mref[0]+"-"+mref[1];
    if(mr.n){
      const bits = [`${mr.n} ${mr.n===1?"session":"sessions"}`]; if(mr.km) bits.push(`${fmt(mr.km)} km`); if(mr.vol) bits.push(`${tons(mr.vol)} moved`);
      return card("big", `Your ${MONTHS[mref[1]]} in review ✨`, `${bits.join(" · ")}. With calendar, strength curve and your muscles.`, `<span class="hplay" aria-hidden="true">▶</span><button class="herobtn" data-act="recap" data-y="${mref[0]}" data-m="${mref[1]}" data-seen="${key}">▶ View review</button>`, "", ` data-act="recap" data-y="${mref[0]}" data-m="${mref[1]}" data-seen="${key}" role="button"`);
    }
  }
  const rws = d===0 && hr>=18 ? ws : (d===1 && hr<12 && S.settings.weekSeen!==ws-WEEK) ? ws-WEEK : null;
  const wr = rws!==null ? rangeData(rws, rws+WEEK) : null;
  if(wr && wr.n){
    const bits = [`${wr.n} ${wr.n===1?"session":"sessions"}`]; if(wr.km) bits.push(`${fmt(wr.km)} km`); if(wr.vol) bits.push(`${fmt(Math.round(wr.vol),0)} kg moved`);
    return card("yoga big", rws===ws ? "Your week in review ✨" : "Your last week in review ✨", `${bits.join(" · ")}. See everything you achieved.`, `<span class="hplay" aria-hidden="true">▶</span><button class="herobtn" data-act="week" data-ws="${rws}" data-seen="${rws}">▶ View review</button>`, "", ` data-act="week" data-ws="${rws}" data-seen="${rws}" role="button"`);
  }
  // 3) Heute schon trainiert
  const todayK = dkey(Date.now()), today = S.history.filter(e => dkey(e.start)===todayK);
  if(today.length){
    const e = today[today.length-1], w = W[e.type];
    const ds = new Date(); ds.setHours(0,0,0,0);
    const gains = rangeData(ds.getTime(), ds.getTime()+864e5).gains || [];
    let what = e.run ? `${e.run.mode==="alster"?LN():"Run"} ${fmt(kmOf(e))} km${num(e.run.min)>0?" in "+hms(num(e.run.min)):""}` : e.yoga ? `Yoga ${fmt(num(e.yoga.min),0)} min` : `${w.name}${e.end-e.start>=3*60000?" in "+durTxt(e.end-e.start):""}`;
    if(gains[0]) what += ` · new record: ${esc(gains[0].n)} ${fmt(gains[0].to)} kg`;
    const tail = left===0 ? "Weekly goal reached! 🏆" : `${left} more ${left===1?"session":"sessions"} this week.`;
    prepShare(entryShareSpec(e));
    return card("gold", "Already trained today 🎉", `${what}. ${tail}`, `<button class="herobtn" data-act="share">📤 Share result</button>`);
  }
  // 4) Sonntag tagsüber: Yoga
  if(d===0) return card("yoga", "Sunday is yoga day 🧘‍♀️", "Up for 30 minutes of vinyasa? Or 10 minutes of glute mobility to unwind.", `<button class="herobtn" data-act="yogaflow">🧘‍♀️ Start yoga</button>`, `<span class="heroalt">or <button class="linkbtn" data-act="mobility">Glute Mobility</button></span>`);
  // 5) Wochenziel schon geschafft
  if(left===0 && st.thisWeek>0) return card("gold", "Weekly goal reached 🏆", `${st.thisWeek} of ${st.goal} sessions. Enjoy your day off, or have a quick stretch.`, `<button class="herobtn" data-act="mobility">🤸‍♀️ Glute Mobility · ${MOB_MIN} min</button>`, `<span class="heroalt">or <button class="linkbtn" data-act="start" data-t="${next}">train anyway</button></span>`);
  // 6) Trainingstag
  if(trainDays()[d]){
    const w = wxInfo();
    const p = next==="lauf" && w ? `${w.emoji} ${esc(wxPlace())} ${Math.round(w.t)}° · ${w.v}. How about a run?` : `Up next: ${NEXT_TXT[next]}.`;
    return card(heroCls(next), `Today is training day ${TYPE_ICON[next]}`, p, startBtn(next, `${TYPE_ICON[next]} Start ${W[next].name}`), otherLinks(next));
  }
  // 7) Montag: neue Woche
  if(d===1) return card("", "New week 💪", `Goal: ${st.goal} sessions. You can rest today or get started already.`, startBtn(next, `${TYPE_ICON[next]} Start ${W[next].name}`), `<span class="heroalt">or <button class="linkbtn" data-act="mobility">${MOB_MIN} min glute mobility</button></span>`);
  // 8) Donnerstag: Muskelkater
  if(d===4) return card("yoga", "Sore? That means it's working 😄", "Take it easy today. 10 minutes of stretching will do your legs good.", `<button class="herobtn" data-act="mobility">🤸‍♀️ Start glute mobility</button>`, `<span class="heroalt">or <button class="linkbtn" data-act="start" data-t="${next}">train after all</button></span>`);
  // 9) Tag vor einem Trainingstag (Dienstag)
  if(trainDays()[(d+1)%7]) return card("yoga", "Tomorrow is training day", "Eat well today, drink plenty and get to bed early 💧", `<button class="herobtn" data-act="mobility">🤸‍♀️ Glute Mobility · ${MOB_MIN} min</button>`, `<span class="heroalt">or <button class="linkbtn" data-act="start" data-t="${next}">train today after all</button></span>`);
  // 10) Sonstiger Ruhetag
  return card("yoga", "Rest day 😌", "Recovery is part of training too.", `<button class="herobtn" data-act="mobility">🤸‍♀️ Glute Mobility · ${MOB_MIN} min</button>`, `<span class="heroalt">or <button class="linkbtn" data-act="start" data-t="${next}">train after all</button></span>`);
}

/* ================= Fotos in der Begrüßungskarte ================= */
let HERO_ROT = null;
function heroPhotos(){
  clearInterval(HERO_ROT);
  const hero = document.querySelector("#app section.hero"); if(!hero) return;
  const go = ps => { if(!ps || !ps.length) ps = CAMPUS_PHOTOS; if(hero.isConnected && !hero.querySelector(".hph")) mountHeroPhotos(hero, ps); };
  defaultPhotos().then(go).catch(() => go(null));
}
function mountHeroPhotos(hero, ps){
  const now = new Date(), doy = Math.floor((now - new Date(now.getFullYear(),0,0))/864e5);
  const n = Math.min(ps.length, 5), start = doy % ps.length;
  const pick = Array.from({length:n}, (_,i) => ps[(start+i) % ps.length]);
  const box = document.createElement("div"); box.className = "hph"; box.setAttribute("aria-hidden", "true");
  box.innerHTML = pick.map((p,i) => `<img src="${p.url}" alt="" class="${i===0?"on":""}" style="animation-name:kb${i%3}${p.pos?`;object-position:${p.pos}`:""}">`).join("") + `<div class="hblur"></div><div class="hov"></div>`;
  hero.prepend(box); hero.classList.add("photo");
  if(n>1){ const dots = document.createElement("div"); dots.className = "hdots"; dots.innerHTML = pick.map((_,i) => `<i class="${i===0?"on":""}"></i>`).join(""); hero.querySelector("h2").before(dots); }
  HERO_STEP = null;
  if(n>1){
    let k = 0;
    const show = j => {
      const im = box.querySelectorAll("img"), ds = hero.querySelectorAll(".hdots i");
      im[k].classList.remove("on"); ds[k].classList.remove("on"); k = ((j % n) + n) % n; im[k].classList.add("on"); ds[k].classList.add("on");
    };
    const tick = () => { if(!box.isConnected){ clearInterval(HERO_ROT); return; } show(k+1); };
    HERO_ROT = setInterval(tick, 10000);
    HERO_STEP = d => { show(k+d); clearInterval(HERO_ROT); HERO_ROT = setInterval(tick, 10000); };
    hero.insertAdjacentHTML("beforeend", `<div class="harr"><button data-act="herostep" data-d="-1" aria-label="Previous photo">‹</button><button data-act="herostep" data-d="1" aria-label="Next photo">›</button></div>`);
  }
}

/* ================= Begrüßung ================= */
const SAYINGS = ["Every session counts, even the short ones.","Strong is the new beautiful. 💪","Your future self will thank you.","Small steps, big impact.","You don't have to be perfect, just consistent.",
  "Today is a good day to get stronger.","Sweat is just glitter for athletes. ✨","You're stronger than you think.","Recovery is part of training too. 😌","One set at a time.",
  "Progress over perfection.","Your loop is waiting for you. 👟","Believe in yourself. 💪","Do it for you, not for anyone else.","Proud of every rep.",
  "Running slowly is still running.","Motivation gets you started, habit keeps you going.","You've already achieved so much.","A little better than yesterday.","Your body can do more than you think."];
const TRAIN_DAYS_DEFAULT = {3:[18,40], 5:[14,0], 6:[10,0]};
// Training days (JS getDay(): Sun = 0) – from the chosen plan, otherwise the old fixed days
function trainDays(){
  const p = S.settings.plan; if(!p || !Array.isArray(p.sessions) || !p.sessions.length) return TRAIN_DAYS_DEFAULT;
  const [hh, mm] = String(S.settings.remTime||"18:00").split(":").map(Number), o = {};
  p.sessions.forEach(s => o[(s.day+1)%7] = [hh||18, mm||0]); return o;
}
function trainedToday(){ const k = dkey(Date.now()); return S.history.some(e => dkey(e.start)===k); }
function greeting(){
  const now = new Date(), h = now.getHours(), d = now.getDay();
  const hi = h<5 ? "Still awake? 🌙" : h<11 ? "Good morning ☀️" : h<14 ? "Hello 👋" : h<18 ? "Hey 💪" : h<22 ? "Good evening 🌙" : "Still awake? 🌙";
  let line;
  if(trainedToday()) line = "Already trained today, really strong! 💪";
  else if(trainDays()[d]) line = "Today is training day. You've got this!";
  else if(d===0) line = "Sunday is yoga day 🧘‍♀️";
  else{ const doy = Math.floor((now - new Date(now.getFullYear(),0,0))/864e5); line = SAYINGS[doy % SAYINGS.length]; }
  return `<p class="greet"><b>${hi}</b><span>${line}</span></p>`;
}

/* ================= Zahl am App-Symbol ================= */
function updateBadge(){
  try{
    if(!("setAppBadge" in navigator)) return;
    const now = new Date(), td = trainDays()[now.getDay()];
    const due = td && !trainedToday() && now.getHours()*60+now.getMinutes() >= td[0]*60+td[1];
    const p = due ? navigator.setAppBadge(1) : navigator.clearAppBadge();
    p && p.catch && p.catch(() => {});
  }catch(e){}
}

/* ================= Teilen ================= */
let SHARE = null;
const THEME_COL = {"":["#000000","#000000"], run:["#005BAA","#003d73"], yoga:["#FC4C01","#d63f00"]};
function strip(h){ const d = document.createElement("div"); d.innerHTML = h; return d.textContent; }
function summaryShareSpec(s){
  const e = s.e, w = W[e.type], k = kc(w), stats = [];
  if(e.yoga){ stats.push(["Yoga", fmt(e.yoga.min,0)+" min"]); stats.push(["Yoga total", S.history.filter(x => x.yoga).length+"×"]); }
  else if(e.run){ stats.push(["Distance", fmt(e.run.km)+" km"]); if(e.run.min) stats.push(["Time", hms(e.run.min)]); if(num(e.run.incline)) stats.push(["Incline", fmt(e.run.incline)+" %"]); else { const p = paceOf(e.run.km, e.run.min); if(p) stats.push(["Pace", mmss(p)]); } }
  else{ if(e.end-e.start>=3*60000) stats.push(["Duration", durTxt(e.end-e.start)]); stats.push(["Sets", String(s.nSets)]); stats.push(["Volume", fmt(Math.round(s.vol),0)+" kg"]); }
  const items = s.ups.slice(0,3).map(u => (u.rec?"🏆 ":"💪 ") + u.n + (u.chips[0] ? ": " + strip(u.chips[0]) : ""));
  if(e.run && e.run.mode==="alster") items.push(`🔁 ${LN()} no. ${S.history.filter(x => x.run && x.run.mode==="alster").length}`);
  const name = e.run ? runName(e.run.mode) : w.name;
  return {key:e.id, col:THEME_COL[k], eyebrow:new Date(e.start).toLocaleDateString("en-GB",{weekday:"long", day:"numeric", month:"long"}),
    title:name+" done", sub:"Great job! "+(e.yoga?"🧘‍♀️":e.run?"🏃‍♀️":"💪"), stats, items:items.slice(0,3), kcal:kcalOn() ? kcalOf(e) : 0,
    foot:`Session ${s.weekCount} of ${S.settings.goal} this week`, text:`${name} done 💪`};
}
function wrapText(x, text, maxW){ const words = String(text).split(" "), lines = []; let l = ""; words.forEach(w => { const t = l ? l+" "+w : w; if(x.measureText(t).width > maxW && l){ lines.push(l); l = w; } else l = t; }); if(l) lines.push(l); return lines; }
function rrect(x, X, Y, w, h, r){ x.beginPath(); x.moveTo(X+r,Y); x.arcTo(X+w,Y,X+w,Y+h,r); x.arcTo(X+w,Y+h,X,Y+h,r); x.arcTo(X,Y+h,X,Y,r); x.arcTo(X,Y,X+w,Y,r); x.closePath(); }
function drawShare(sp){
  const W0 = 1080, H0 = 1350, c = document.createElement("canvas"); c.width = W0; c.height = H0;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, W0*0.5, H0); g.addColorStop(0, sp.col[0]); g.addColorStop(1, sp.col[1]); x.fillStyle = g; x.fillRect(0, 0, W0, H0);
  x.strokeStyle = "rgba(255,255,255,.09)"; x.lineWidth = 90; x.beginPath(); x.arc(W0-40, 130, 260, 0, 7); x.stroke();
  const D = '"Playfair Display",Georgia,serif', B = '"Open Sans",system-ui,-apple-system,sans-serif';
  x.fillStyle = "#fff"; x.globalAlpha = .8;
  x.font = `600 34px ${B}`; x.font = `800 34px ${B}`; x.fillText("NOVA", 80, 120); const nw = x.measureText("NOVA").width; x.font = `italic 700 38px ${D}`; x.fillText("Fit", 84 + nw, 120); x.font = `600 34px ${B}`;
  x.font = `400 40px ${B}`; x.fillText(sp.eyebrow, 80, 178); x.globalAlpha = 1;
  x.font = `700 124px ${D}`; let y = 345;
  wrapText(x, sp.title, 920).slice(0,3).forEach(l => { x.fillText(l, 76, y); y += 132; });
  x.fillStyle = "#ED1B34"; x.fillRect(80, y - 92, 96, 16); x.fillStyle = "#fff";
  x.font = `500 48px ${B}`; x.fillText(sp.sub, 80, y - 4); y += 86;
  const n = Math.max(1, sp.stats.length), gap = 24, bw = (920 - gap*(n-1))/n, bh = 190;
  sp.stats.forEach((st, i) => {
    const bx = 80 + i*(bw+gap);
    x.fillStyle = "rgba(255,255,255,.16)"; rrect(x, bx, y, bw, bh, 0); x.fill();
    x.fillStyle = "#fff"; x.globalAlpha = .75; x.font = `600 30px ${B}`; x.fillText(st[0].toUpperCase(), bx+28, y+56); x.globalAlpha = 1;
    let fs = 80; x.font = `800 ${fs}px ${B}`; while(x.measureText(st[1]).width > bw-56 && fs>36){ fs -= 4; x.font = `800 ${fs}px ${B}`; }
    x.fillText(st[1], bx+28, y+152);
  });
  y += bh + 90;
  if(sp.kcal){ x.font = `600 52px ${B}`; x.fillText(`🔥 about ${fmt(sp.kcal,0)} kcal burned`, 80, y); y += 86; }
  (sp.items||[]).forEach(t => { if(y > H0-190) return; let fs = 44; x.font = `500 ${fs}px ${B}`; while(x.measureText(t).width > 920 && fs>34){ fs -= 2; x.font = `500 ${fs}px ${B}`; } wrapText(x, t, 920).slice(0,2).forEach(l => { x.fillText(l, 80, y); y += 58; }); y += 16; });
  x.globalAlpha = .85; x.font = `500 38px ${B}`; x.fillText("❤️ " + sp.foot, 80, H0-90); x.globalAlpha = 1;
  return c;
}
function prepShare(sp){
  if(!sp || (SHARE && SHARE.key===sp.key && SHARE.blob)) return;
  SHARE = {key:sp.key, text:sp.text, blob:null};
  const go = () => { try{ drawShare(sp).toBlob(b => { if(SHARE && SHARE.key===sp.key) SHARE.blob = b; }, "image/png"); }catch(e){} };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(go, 250));
}
async function doShare(){
  if(!SHARE || !SHARE.blob){ toast("Creating image …"); setTimeout(() => { if(SHARE && SHARE.blob) showShareImg(); }, 900); return; }
  try{
    const file = new File([SHARE.blob], "novafit.png", {type:"image/png"});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{ await navigator.share({files:[file], text:SHARE.text}); return; }catch(e){ if(e && e.name==="AbortError") return; }
    }
  }catch(e){}
  showShareImg();
}
function showShareImg(){
  const url = URL.createObjectURL(SHARE.blob);
  sheet(`<h3>Your image</h3><img src="${url}" alt="Image of your session" style="width:100%;border-radius:14px"><p class="small muted" style="margin:0">Long-press the image to save or share it.</p><a class="secondary dl" href="${url}" download="novafit.png">Download image</a><button class="secondary" data-act="closesheet">Close</button>`);
  if(STORY){ const sc = document.querySelector("#layer .scrim"); if(sc) sc.style.zIndex = 60; }
}

/* ================= Jahresrückblick ================= */
const WDAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function yearData(y){
  const a = new Date(y,0,1).getTime(), b = new Date(y+1,0,1).getTime();
  const H = S.history.filter(e => e.start>=a && e.start<b);
  const r = {y, n:H.length, days:new Set(H.map(e => dkey(e.start))).size, types:{}};
  H.forEach(e => r.types[e.type] = (r.types[e.type]||0)+1);
  r.km = H.reduce((x,e) => x+kmOf(e), 0); r.vol = H.reduce((x,e) => x+volOf(e), 0);
  r.kcal = kcalOn() ? H.reduce((x,e) => x+kcalOf(e), 0) : 0;
  const al = H.filter(e => e.run && e.run.mode==="alster"); r.alster = al.length;
  const alt = al.filter(e => num(e.run.min)>0).map(e => num(e.run.min)); r.bestAl = alt.length ? Math.min(...alt) : 0;
  r.runs = H.filter(e => e.run).length;
  const yo = H.filter(e => e.yoga); r.yoga = yo.length; r.yogaMin = yo.reduce((x,e) => x+num(e.yoga.min), 0);
  r.mob = (S.settings.mob||[]).filter(t => t>=a && t<b).length;
  r.calm = NFYoga.tension(calmEntries().filter(x => x.t>=a && x.t<b));
  const wd = [0,0,0,0,0,0,0]; H.forEach(e => wd[new Date(e.start).getDay()]++);
  r.favDayN = Math.max(...wd); r.favDay = r.n ? wd.indexOf(r.favDayN) : -1;
  const mo = Array(12).fill(0); H.forEach(e => mo[new Date(e.start).getMonth()]++);
  r.bestMonthN = Math.max(...mo); r.bestMonth = mo.indexOf(r.bestMonthN);
  let best = 0, cur = 0; [...new Set(H.map(e => mondayOf(e.start)))].sort((p,q) => p-q).forEach((w,i,arr) => { cur = (i && Math.round((w-arr[i-1])/WEEK)===1) ? cur+1 : 1; best = Math.max(best, cur); });
  r.streak = best;
  const ids = new Set(); H.forEach(e => Object.keys(e.sets||{}).forEach(k => ids.add(k)));
  r.gains = [];
  ids.forEach(id => {
    const ss = H.filter(e => e.sets && e.sets[id] && e.sets[id].length), mk = e => Math.max(...e.sets[id].map(s => num(s.kg)));
    const f = mk(ss[0]), m = Math.max(...ss.map(mk));
    if(f>0 && m>f) r.gains.push({n:EXN[id] ? EXN[id].n : id, from:f, to:m, pct:Math.round((m-f)/f*100)});
  });
  r.gains.sort((p,q) => q.pct-p.pct);
  r.badges = BADGES.filter(x => S.badges && S.badges[x.id]>=a && S.badges[x.id]<b);
  const hrs = H.map(e => new Date(e.start).getHours()); r.avgH = hrs.length ? hrs.reduce((p,q) => p+q, 0)/hrs.length : 12;
  return r;
}
function tons(v){ return (v>=10000 ? fmt(v/1000,0) : fmt(v/1000,1)) + " t"; }
function kmFun(km){
  if(km>=900) return "That's further than Hamburg to Paris!";
  if(km>=290) return "That's further than Hamburg to Berlin.";
  if(km>=240) return "That's Hamburg to Bremen and back.";
  if(km>=66) return "That's further than Hamburg to Lübeck.";
  return "";
}
function yearShown(){ const d = new Date(); return d.getMonth()===11 ? d.getFullYear() : d.getMonth()===0 ? d.getFullYear()-1 : 0; }
function yearCardHtml(){
  const y = yearShown(); if(!y || S.settings.yearSeen===y || !yearData(y).n) return "";
  return `<button class="resume yearcard" data-act="year" data-y="${y}" data-seen="${y}"><div><span>New ✨</span><b>Your ${y}</b></div><span class="go">View</span></button>`;
}
function yearLinkHtml(){
  const d = new Date(), y = d.getMonth()===0 ? d.getFullYear()-1 : d.getFullYear();
  return yearData(y).n ? `<button class="linkbtn yearlink" data-act="year" data-y="${y}">✨ View your ${y} in review ›</button>` : "";
}
function storySlides(r){
  const sl = [], dl = ms => ` style="animation-delay:${ms}ms"`;
  sl.push({c:"s1", h:`<p class="sy-eb">NOVAFit</p><h2 class="sy-big pop">Your ${r.y}</h2><p class="sy-p fadeup"${dl(400)}>Look at everything you achieved ✨</p><p class="sy-hint">Tap to continue</p>`});
  const bars = ALL_W.filter(t => r.types[t]).map(t => `<div class="sbar2"><span>${W[t].name}</span><span class="tr"><i style="width:${Math.max(6, r.types[t]/r.n*100)}%"></i></span><b class="tnum">${r.types[t]}</b></div>`).join("");
  sl.push({c:"s2", h:`<p class="sy-eb">Sessions</p><h2 class="sy-num pop tnum">${r.n}</h2><p class="sy-p">on ${r.days} ${r.days===1?"day":"days"}. ${r.n>=100?"Incredible!":r.n>=50?"What a year!":"Every single one counts."}</p><div class="sy-bars fadeup"${dl(400)}>${bars}</div>`});
  if(r.favDay>=0) sl.push({c:"s3", h:`<p class="sy-eb">Your rhythm</p><h2 class="sy-big pop">${WDAY[r.favDay]}</h2><p class="sy-p">was your favourite training day (${r.favDayN}×).</p><div class="sy-list fadeup"${dl(400)}><p>📅 Strongest month: <b>${MONTHS[r.bestMonth]}</b> with ${r.bestMonthN} ${r.bestMonthN===1?"session":"sessions"}</p>${r.streak>1?`<p>🔥 Longest streak: <b>${r.streak} weeks</b> in a row</p>`:""}<p>${r.avgH<11?"🌅 You're a true early bird.":r.avgH>=17?"🌙 You like training in the evening.":"☀️ You like training during the day."}</p></div>`});
  if(r.runs) sl.push({c:"s4", h:`<p class="sy-eb">Running</p><h2 class="sy-num pop tnum">${fmt(r.km,0)} km</h2><p class="sy-p">is how far you ran. ${kmFun(r.km)}</p><div class="sy-list fadeup"${dl(400)}>${r.alster?`<p>🔁 <b>${r.alster}×</b> your ${esc(LN())}</p>`:""}${r.bestAl?`<p>⏱️ Best ${esc(LN())}: <b class="tnum">${hms(r.bestAl)}</b></p>`:""}</div>`});
  if(r.vol>0) sl.push({c:"s5", h:`<p class="sy-eb">Strength</p><h2 class="sy-num pop tnum">${tons(r.vol)}</h2><p class="sy-p">is what you moved in total. ${volumeLine(r.vol)}</p>${r.gains.length?`<div class="sy-list fadeup"${dl(400)}><p class="sy-sm">Biggest strength gains</p>${r.gains.slice(0,3).map(g => `<p>💪 <b>${esc(g.n)}</b> ${fmt(g.from)} → ${fmt(g.to)} kg <span class="sy-pill">+${g.pct} %</span></p>`).join("")}</div>`:""}`});
  if(r.yoga || r.mob || r.kcal) sl.push({c:"s6", h:`<p class="sy-eb">Body and mind</p>${r.yoga?`<h2 class="sy-num pop tnum">${fmt(r.yogaMin,0)} min</h2><p class="sy-p">of yoga in ${r.yoga} ${r.yoga===1?"session":"sessions"}. Namaste 🧘‍♀️</p>`:`<h2 class="sy-big pop">Kind to yourself</h2>`}<div class="sy-list fadeup"${dl(400)}>${r.mob?`<p>🤸‍♀️ ${r.mob}× glute mobility</p>`:""}${r.calm && r.calm.n>=2 && r.calm.diff>0?`<p>😌 tension <b class="tnum">${fmt(r.calm.before)} → ${fmt(r.calm.after)}</b> after yoga</p>`:""}${r.kcal?`<p>🔥 about <b class="tnum">${fmt(r.kcal,0)} kcal</b> burned</p>`:""}</div>`});
  if(r.badges.length) sl.push({c:"s7", h:`<p class="sy-eb">Badges</p><h2 class="sy-num pop tnum">${r.badges.length}</h2><p class="sy-p">new badges collected.</p><div class="badges sy-badges fadeup"${dl(400)}>${r.badges.map(b => badgeEl(b).replace(/data-act="[^"]*"/g, "")).join("")}</div>`});
  sl.push({c:"s8", end:true, h:`<p class="sy-eb">${r.y}</p><h2 class="sy-big pop">A strong year! 🎉</h2><p class="sy-p fadeup"${dl(400)}>${r.n} ${r.n===1?"session":"sessions"}${r.km?`, ${fmt(r.km,0)} km`:""} and lots of perseverance. Here's to a strong ${r.y+1}!</p><div class="sy-btns fadeup"${dl(700)}><button class="sy-btn" data-act="share">📤 Share</button><button class="sy-btn ghost" data-act="storyclose">Close</button></div>`});
  return sl;
}
function yearShareSpec(r){
  return {key:"y"+r.y, col:THEME_COL[""], eyebrow:"Year in review", title:`My ${r.y}`, sub:"Your training year ✨",
    stats:[["Sessions", String(r.n)], ["Run", fmt(r.km,0)+" km"], ["Moved", tons(r.vol)]],
    items:[r.alster?`🔁 ${r.alster}× ${LN()}`:"", r.gains[0]?`💪 ${r.gains[0].n} +${r.gains[0].pct} %`:"", r.favDay>=0?`📅 Favourite day: ${WDAY[r.favDay]}`:""].filter(Boolean),
    kcal:r.kcal, foot:`${r.days} training days`, text:`My training year ${r.y} ✨`};
}
/* ================= Wochenrückblick als Story ================= */
const TYPE_EMO = {po:"🦵", oben:"💪", lauf:"🏃‍♀️", yoga:"🧘‍♀️"};
function weekRange(ws){ const end = new Date(ws+WEEK-864e5), st = new Date(ws); return `${st.getDate()} ${st.getMonth()!==end.getMonth()?MONTHS[st.getMonth()].slice(0,3)+" ":""}– ${end.getDate()} ${MONTHS[end.getMonth()]}`; }
function weekData(ws){
  const r = rangeData(ws, ws+WEEK), H = S.history.filter(e => e.start>=ws && e.start<ws+WEEK);
  r.ws = ws; r.goal = S.settings.goal; r.cur = ws===mondayOf(Date.now()); r.H = H;
  r.days = Array.from({length:7}, (_,i) => H.filter(e => Math.round((mondayOf(e.start)-ws)/WEEK)===0 && (new Date(e.start).getDay()+6)%7===i));
  const al = H.filter(e => e.run && e.run.mode==="alster"); r.alster = al.length;
  const alt = al.filter(e => num(e.run.min)>0).map(e => num(e.run.min)); r.bestAlW = alt.length ? Math.min(...alt) : 0;
  r.runs = H.filter(e => e.run).length;
  const yo = H.filter(e => e.yoga); r.yoga = yo.length; r.yogaMin = yo.reduce((x,e) => x+num(e.yoga.min), 0);
  r.mob = (S.settings.mob||[]).filter(t => t>=ws && t<ws+WEEK).length;
  r.streak = r.cur ? stats().streak : 0;
  const tips = {}; H.forEach(e => Object.keys(e.sets||{}).forEach(id => { const u = upSuggest(id, e.sets[id], exIn(e.type, id)); if(u) tips[id] = u; else delete tips[id]; }));
  r.tips = Object.entries(tips).map(([id,kg]) => ({n:EXN[id] ? EXN[id].n : id, kg}));
  return r;
}
function weekSlides(r){
  const sl = [], dl = ms => ` style="animation-delay:${ms}ms"`, g = r.goal;
  const msg = r.n>=g ? "Weekly goal reached! 🎉" : r.n>0 ? (r.cur ? "The week isn't over yet." : "Every session counts.") : (r.cur ? "This week is still wide open." : "Rest week. That's part of it too.");
  sl.push({c:"s1", h:`<p class="sy-eb">Weekly review</p><h2 class="sy-big pop">${r.cur?"Your week":"Your week of"}</h2><p class="sy-p fadeup"${dl(300)}>${weekRange(r.ws)}</p><p class="sy-hint">Tap to continue</p>`});
  if(r.n){
    const today = r.cur ? (new Date().getDay()+6)%7 : -1;
    const strip = r.days.map((d,i) => `<div class="wd${d.length?" on":""}${i===today?" today":""}"><span class="wdc">${d.length ? d.map(e => TYPE_EMO[e.type]||"✓").slice(0,2).join("") : ""}</span><small>${WD[i]}</small></div>`).join("");
    sl.push({c:"s2", h:`<p class="sy-eb">Sessions</p><h2 class="sy-num pop tnum">${r.n}<span class="sy-of">/${g}</span></h2><p class="sy-p">${msg}</p><div class="wdstrip fadeup"${dl(400)}>${strip}</div>`});
    const hl = [];
    r.gains.slice(0,3).forEach(x => hl.push(`<p>🏆 <b>${esc(x.n)}</b> new best: ${fmt(x.to)} kg <span class="sy-pill">+${fmt(x.d)} kg</span></p>`));
    if(r.bestAlW && r.bestAlW<=stats().bestAlster+1e-9) hl.push(`<p>⏱️ Fastest ${esc(LN())} ever: <b class="tnum">${hms(r.bestAlW)}</b></p>`);
    r.badges.slice(0,2).forEach(b => hl.push(`<p>🏅 New badge: <b>${esc(b.t)}</b></p>`));
    if(r.badges.length>2) hl.push(`<p>🏅 … and ${r.badges.length-2} more badges</p>`);
    if(r.vol>0 || hl.length) sl.push({c:"s5", h:`<p class="sy-eb">Highlights</p>${r.vol>0?`<h2 class="sy-num pop tnum"${fmt(Math.round(r.vol),0).length>3?' style="font-size:72px"':""}>${fmt(Math.round(r.vol),0)} kg</h2><p class="sy-p">is what you moved this week.</p>`:`<h2 class="sy-big pop">Your wins</h2>`}${hl.length?`<div class="sy-list fadeup"${dl(400)}>${hl.join("")}</div>`:`<p class="sy-p fadeup"${dl(400)} style="opacity:.85">No new records this time, but showing up is the most important part. 💪</p>`}`});
    const msw = muscleSlide(r.H, "week"); if(msw){ msw.c = "s1"; sl.push(msw); }
    if(r.runs) sl.push({c:"s4", h:`<p class="sy-eb">Running</p><h2 class="sy-num pop tnum">${fmt(r.km)} km</h2><p class="sy-p">is how far you ran this week.</p><div class="sy-list fadeup"${dl(400)}>${r.alster?`<p>🔁 <b>${r.alster}×</b> your ${esc(LN())}</p>`:""}${r.bestAlW?`<p>⏱️ Best loop: <b class="tnum">${hms(r.bestAlW)}</b></p>`:""}<p>🗺️ <b class="tnum">${fmt(stats().km,0)} km</b> in total so far</p></div>`});
    if(r.yoga || r.mob || r.kcal) sl.push({c:"s6", h:`<p class="sy-eb">Body and mind</p>${r.yoga?`<h2 class="sy-num pop tnum">${fmt(r.yogaMin,0)} min</h2><p class="sy-p">of yoga this week. Namaste 🧘‍♀️</p>`:`<h2 class="sy-big pop">Kind to yourself</h2>`}<div class="sy-list fadeup"${dl(400)}>${r.mob?`<p>🤸‍♀️ ${r.mob}× glute mobility</p>`:""}${r.kcal?`<p>🔥 about <b class="tnum">${fmt(r.kcal,0)} kcal</b> burned</p>`:""}</div>`});
    if(r.tips.length || r.streak>1) sl.push({c:"s3", h:`<p class="sy-eb">Next week</p>${r.streak>1?`<h2 class="sy-num pop tnum">${r.streak}</h2><p class="sy-p">weeks in a row you reached your goal. 🔥</p>`:`<h2 class="sy-big pop">${r.n>=g?"Keep it going":"There's more in you"}</h2>`}${r.tips.length?`<div class="sy-list fadeup"${dl(400)}><p class="sy-sm">Try next time</p>${r.tips.map(t => `<p>💪 <b>${esc(t.n)}</b> with <b class="tnum">${fmt(t.kg)} kg</b></p>`).join("")}</div>`:""}`});
  }
  const end = r.n>=g ? "Weekly goal reached! 🎉" : r.n>0 ? "Keep it up 💪" : "New week, new chance ❤️";
  const prevBtn = `<button class="sy-btn ghost" data-act="week" data-ws="${r.ws-WEEK}">‹ View previous week</button>`;
  sl.push({c:"s8", end:r.n>=g, h:`<p class="sy-eb">${weekRange(r.ws)}</p><h2 class="sy-big pop">${end}</h2><p class="sy-p fadeup"${dl(300)}>${r.n ? `${r.n} ${r.n===1?"session":"sessions"}${r.km?`, ${fmt(r.km)} km`:""}${r.vol?`, ${fmt(Math.round(r.vol),0)} kg moved`:""}.` : msg}</p><div class="sy-btns fadeup"${dl(600)}>${r.n?`<button class="sy-btn" data-act="share">📤 Share</button>`:""}${prevBtn}${r.cur?"":`<button class="sy-btn ghost" data-act="week" data-ws="${r.ws+WEEK}">Next week ›</button>`}<button class="sy-btn ghost" data-act="storyclose">Close</button></div>`});
  return sl;
}
function weekShareSpec(r){
  const items = [];
  r.gains.slice(0,2).forEach(x => items.push(`🏆 ${x.n}: ${fmt(x.to)} kg`));
  if(r.alster) items.push(`🔁 ${r.alster}× ${LN()}`);
  if(r.yoga) items.push(`🧘‍♀️ ${fmt(r.yogaMin,0)} min Yoga`);
  const stats2 = [["Sessions", `${r.n}/${r.goal}`]];
  if(r.km) stats2.push(["Run", fmt(r.km)+" km"]);
  if(r.vol) stats2.push(["Moved", fmt(Math.round(r.vol),0)+" kg"]);
  return {key:"w"+r.ws, col:THEME_COL[""], eyebrow:weekRange(r.ws), title:"My week", sub:r.n>=r.goal ? "Weekly goal reached! 🎉" : "Your training week ✨",
    stats:stats2, items:items.slice(0,3), kcal:r.kcal, foot:r.streak>1 ? `${r.streak} weeks in a row` : "NOVAFit", text:"My training week ✨"};
}
function openWeek(ws){
  const r = weekData(ws);
  STORY = {kind:"week", slides:weekSlides(r), i:0};
  musicStart("week"); attachPhotos(STORY);
  if(r.n) prepShare(weekShareSpec(r));
  drawStory();
}

/* ================= Story-Musik (wird live in der App erzeugt, keine Datei) ================= */
const SONGS = {
  week:{bpm:84, swing:.12, wave:"triangle", cut:1400, melAt:3, kick:[0,10], snare:[4,12], snareVol:.05,
    chords:[[36,[60,64,67,71]],[33,[57,60,64,67]],[29,[57,60,64,65]],[31,[59,62,67,69]]], arp:[0,1,2,3,2,1,2,3],
    mel:[[[0,76,4],[6,74,2],[8,72,6]],[[0,72,4],[4,71,2],[6,67,8]],[[0,69,4],[4,72,4],[8,76,6]],[[0,74,6],[8,71,4],[12,67,4]]], bells:[72,76,79,84]},
  year:{bpm:110, swing:0, wave:"triangle", cut:2600, melAt:2, kick:[0,4,8,12], snare:[4,12], snareVol:.09,
    chords:[[38,[62,66,69,74]],[33,[61,64,69,73]],[35,[62,66,71,74]],[31,[62,67,71,74]]], arp:[0,2,1,3,2,3,1,2],
    mel:[[[0,78,4],[4,76,2],[6,74,2],[8,76,4],[12,78,4]],[[0,76,6],[6,73,2],[8,69,8]],[[0,74,4],[4,76,4],[8,78,4],[12,81,4]],[[0,79,6],[6,78,2],[8,76,4],[12,74,4]]], bells:[74,78,81,86,90]}
};
SONGS.month = Object.assign({}, SONGS.week, {bpm:92, cut:1800, kick:[0,8,10], snareVol:.06});
let MUS = null;
const mfreq = m => 440*Math.pow(2, (m-69)/12);
function musicGraph(ctx, kind){
  const song = SONGS[kind], master = ctx.createGain(), comp = ctx.createDynamicsCompressor();
  master.gain.value = 0; master.connect(comp); comp.connect(ctx.destination);
  const delay = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain();
  delay.delayTime.value = 60/song.bpm*0.75; fb.gain.value = .3; wet.gain.value = .22;
  delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate*0.5), ctx.sampleRate), d = noise.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
  return {kind, ctx, master, delay, noise, song, step:0, level:0, bell:false};
}
function musicStart(kind){
  if(MUS && MUS.kind===kind){ if(MUS.ctx.state==="suspended") MUS.ctx.resume().catch(() => {}); return; }
  musicStop(true);
  let ctx; try{ ctx = new (window.AudioContext || window.webkitAudioContext)(); }catch(e){ return; }
  MUS = musicGraph(ctx, kind); MUS.next = ctx.currentTime + .15;
  musicVol(); MUS.timer = setInterval(musicTick, 25);
}
function musicVol(){
  if(!MUS) return; const g = MUS.master.gain, t = MUS.ctx.currentTime, off = !!S.settings.storyMute;
  g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(off ? 0 : .7, t + (off ? .15 : 1.2));
}
function musicStop(now){
  if(!MUS) return; const m = MUS; MUS = null; clearInterval(m.timer);
  try{ const t = m.ctx.currentTime, g = m.master.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + (now ? .05 : .8)); }catch(e){}
  setTimeout(() => { try{ m.ctx.close(); }catch(e){} }, now ? 120 : 950);
}
function musicLevel(i, n){
  if(!MUS) return; const last = i===n-1;
  MUS.level = last ? 3 : i===0 ? 0 : i<3 ? 1 : 2;
  if(last && !MUS.bell && MUS.ctx.state==="running"){ MUS.bell = true; const t = MUS.ctx.currentTime + .05; MUS.song.bells.forEach((m,k) => syBell(MUS, mfreq(m), t + k*.09)); }
  if(!last) MUS.bell = false;
}
function musicTick(){
  const M = MUS; if(!M || M.ctx.state!=="running") return;
  const sp = 60/M.song.bpm/4;
  if(M.next < M.ctx.currentTime - .2) M.next = M.ctx.currentTime + .05;
  while(M.next < M.ctx.currentTime + .12){
    musicStep(M, M.step, M.next + (M.step%2 ? M.song.swing*sp : 0), sp);
    M.next += sp; M.step = (M.step+1) % 64;
  }
}
function musicStep(M, st, t, sp){
  const s = M.song, bar = Math.floor(st/16), b = st%16, ch = s.chords[bar], L = M.level;
  if(b===0) syPad(M, ch[1], t, sp*16);
  if(L>=1){
    if(b===0 || b===8) syBass(M, ch[0], t, sp*6);
    if(b%2===0) syPluck(M, ch[1][s.arp[(b/2)%8]] + 12, t, L>=3 ? .1 : .075);
  }
  if(L>=2){
    if(s.kick.includes(b)) syKick(M, t);
    if(s.snare.includes(b)) syNoise(M, t, "bandpass", 1800, s.snareVol, .14);
    if(b%2===0) syNoise(M, t, "highpass", 7000, b%4===0 ? .035 : .02, .05);
  }
  if(L>=s.melAt) (s.mel[bar]||[]).forEach(([q,m,len]) => { if(q===b) syLead(M, m, t, len*sp); });
}
function syVoice(M, type, f, t, dur, peak, a, toDelay, cut){
  const c = M.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
  let node = o; if(cut){ const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = cut; o.connect(lp); node = lp; }
  node.connect(g); g.connect(M.master); if(toDelay) g.connect(M.delay);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t+a); g.gain.exponentialRampToValueAtTime(.0001, t+Math.max(dur, a+.05));
  o.start(t); o.stop(t + Math.max(dur, a+.05) + .05);
}
function syPad(M, notes, t, dur){ notes.forEach(n => { syVoice(M, "triangle", mfreq(n), t, dur, .045, .6, false, M.song.cut); syVoice(M, "sine", mfreq(n)*1.003, t, dur, .032, .8, false); }); }
function syBass(M, n, t, dur){ syVoice(M, "triangle", mfreq(n), t, dur, .16, .02, false, 500); }
function syPluck(M, n, t, v){ syVoice(M, M.song.wave, mfreq(n), t, .55, v, .005, true, 3000); }
function syLead(M, n, t, dur){ syVoice(M, "sine", mfreq(n), t, Math.max(.3, dur), .1, .02, true); syVoice(M, "triangle", mfreq(n+12), t, Math.max(.2, dur*.6), .022, .02, true); }
function syBell(M, f, t){ syVoice(M, "sine", f, t, 2.2, .1, .005, true); syVoice(M, "sine", f*2.76, t, 1.2, .025, .005, true); }
function syKick(M, t){ const c = M.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t+.13); g.gain.setValueAtTime(.45, t); g.gain.exponentialRampToValueAtTime(.0001, t+.28); o.connect(g); g.connect(M.master); o.start(t); o.stop(t+.3); }
function syNoise(M, t, type, f, v, d){ const c = M.ctx, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = M.noise; fl.type = type; fl.frequency.value = f; s.connect(fl); fl.connect(g); g.connect(M.master); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t+d); s.start(t); s.stop(t+d+.02); }
document.addEventListener("visibilitychange", () => { if(!MUS) return; if(document.visibilityState==="hidden") MUS.ctx.suspend().catch(() => {}); else if(STORY) MUS.ctx.resume().catch(() => {}); });

/* ================= Fotos für Rückblicke (nur auf diesem Handy, IndexedDB) ================= */
const PDB = "workout-photos";
function pdb(){ return new Promise((res, rej) => { const r = indexedDB.open(PDB, 1); r.onupgradeneeded = () => r.result.createObjectStore("p", {keyPath:"id"}); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function photosAll(){
  try{ const db = await pdb(); return await new Promise((res, rej) => { const q = db.transaction("p").objectStore("p").getAll(); q.onsuccess = () => res((q.result||[]).sort((a,b) => a.t-b.t)); q.onerror = () => rej(q.error); }); }
  catch(e){ return []; }
}
async function photoTx(fn){ const db = await pdb(); return new Promise((res, rej) => { const tx = db.transaction("p", "readwrite"); fn(tx.objectStore("p")); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }
async function shrinkPhoto(file){
  const url = URL.createObjectURL(file);
  try{
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const sc = Math.min(1, 1400/Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth*sc); c.height = Math.round(img.naturalHeight*sc);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg", .82));
    return blob ? await blob.arrayBuffer() : null;
  }finally{ URL.revokeObjectURL(url); }
}
let PHOTOS = null;
async function photoUrls(){
  if(PHOTOS) return PHOTOS;
  const all = await photosAll();
  PHOTOS = all.map(p => ({id:p.id, url:URL.createObjectURL(new Blob([p.buf], {type:"image/jpeg"}))}));
  return PHOTOS;
}
function photosReset(){ if(PHOTOS) PHOTOS.forEach(p => URL.revokeObjectURL(p.url)); PHOTOS = null; }
async function paintPhotos(){
  const el = document.getElementById("phgrid"); if(!el) return;
  const ps = await photoUrls();
  el.innerHTML = ps.length ? ps.map(p => `<div class="ph"><img src="${p.url}" alt=""><button data-act="phdel" data-id="${p.id}" aria-label="Remove photo">✕</button></div>`).join("") : `<p class="small muted" style="margin:0;grid-column:1/-1">No photos selected yet.</p>`;
  const n = document.getElementById("phcount"); if(n) n.textContent = ps.length ? `${ps.length} ${ps.length===1?"photo":"photos"}` : "";
}
async function addPhotos(files){
  const list = [...files].slice(0, 40); if(!list.length) return;
  toast(list.length===1 ? "Saving photo …" : `Saving ${list.length} photos …`);
  let ok = 0;
  for(const f of list){
    try{ const buf = await shrinkPhoto(f); if(buf){ await photoTx(s => s.put({id:"p"+Date.now()+Math.random().toString(36).slice(2,6), t:Date.now(), buf})); ok++; } }catch(e){}
  }
  photosReset(); paintPhotos();
  toast(ok ? `${ok} ${ok===1?"photo":"photos"} added ❤️` : "That didn't work.");
}
function attachPhotos(st){
  defaultPhotos().then(ps => {
    if(!ps.length || STORY!==st) return;
    const sh = ps.slice().sort(() => Math.random()-.5);
    let j = 0;   // Folien mit Diagrammen (nophoto) bleiben ohne Foto, damit sie lesbar sind
    st.photos = st.slides.map(sl => sl.nophoto ? null : sh[j++ % sh.length]);
    drawStory(true);
  }).catch(() => {});
}

/* ================= Lauf aus Nike Run Club übernehmen (über Kurzbefehl + Zwischenablage) ================= */
function parseRunText(t){
  if(!t) return null; t = String(t);
  const intish = v => /^\d{1,3}([.,\s]\d{3})+$/.test(v) ? +v.replace(/[.,\s]/g, "") : num(v);
  let km = 0, sec = 0;
  const a = t.match(/km\s*=\s*([\d.,]+)/i), b = t.match(/sec\s*=\s*([\d.,\s]+\d)/i);
  if(a) km = num(a[1]); else { const m = t.match(/(\d+(?:[.,]\d+)?)\s*(?:km|kilometer)/i); if(m) km = num(m[1]); }
  if(b) sec = intish(b[1].trim()); else { const m = t.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/); if(m) sec = m[3]!=null ? (+m[1])*3600+(+m[2])*60+(+m[3]) : (+m[1])*60+(+m[2]); }
  if(km>200) km = km/1000;
  if(!(km>0.2 && km<100)) return null;
  return {km:Math.round(km*100)/100, min:sec>0 ? sec/60 : 0};
}
function applyRun(r){
  if(!S.active || !S.active.run) return;
  const run = S.active.run;
  run.km = fmt(r.km, 2);
  if(r.min>0) run.min = hms(r.min);
  if(Math.abs(r.km - alsterKm()) <= 0.6) run.mode = "alster";
  save(); renderSession();
  toast(`Run added: ${fmt(r.km,2)} km${r.min>0?" in "+hms(r.min):""} 🏃‍♀️`);
}
async function nrcPaste(){
  let t = "";
  try{ if(navigator.clipboard && navigator.clipboard.readText) t = await navigator.clipboard.readText(); }catch(e){}
  const r = parseRunText(t);
  if(r){ applyRun(r); return; }
  sheet(`<h3>Paste run</h3><p class="muted small" style="margin:0">No run was found on the clipboard. Long-press the field and choose “Paste”, or run the “Copy run” shortcut first.</p>
    <textarea id="nrctext" placeholder="e.g. WORKOUT-LAUF km=7.41 sec=2551"></textarea>
    <button class="primary run" data-act="nrcuse">Add</button><button class="secondary" data-act="nrchelp">How to set up the shortcut</button><button class="secondary" data-act="closesheet">Cancel</button>`);
}
function nrcHelp(){
  sheet(`<p class="eyebrow">One-time setup · about 5 minutes</p><h3 style="margin:-6px 0 0">Import a run from Nike</h3>
    <p class="small muted" style="margin:0">Nike Run Club saves every run to Apple Health. An iPhone shortcut fetches today's kilometres and time and copies them, and the app pastes them in with one tap.</p>
    <p class="exn" style="margin:0;font-weight:600">Check first</p>
    <ol class="guide"><li>In <b>Nike Run Club</b> → Settings → connect Apple Health, allow “Workouts” and “Walking + Running”.</li></ol>
    <p class="exn" style="margin:0;font-weight:600">Create the shortcut (Shortcuts app → “+”)</p>
    <ol class="guide">
      <li>Name: <b>Copy run</b>.</li>
      <li>Action <b>“Find Health Samples”</b>: type <b>Walking + Running Distance</b>, filter <b>Source = Nike Run Club</b> and <b>Start Date is today</b>, sorted by start date, oldest first.</li>
      <li>Action <b>“Calculate Statistics”</b>: <b>Sum</b> of the samples found. That's the kilometres.</li>
      <li>Action <b>“Get Item from List”</b>: <b>first item</b> of the samples, then <b>“Get Details of Health Sample”</b> → <b>Start Date</b>.</li>
      <li>Again <b>“Get Item from List”</b>: <b>last item</b>, then <b>“Get Details …”</b> → <b>End Date</b>.</li>
      <li>Action <b>“Get Time Between Dates”</b>: between start date and end date, in <b>seconds</b>.</li>
      <li>Action <b>“Text”</b>: <code>WORKOUT-LAUF km=</code><i>[Sum]</i><code> sec=</code><i>[Time Between Dates]</i></li>
      <li>Action <b>“Copy to Clipboard”</b>, optionally <b>“Show Notification”</b>: “Run copied ✓”.</li>
      <li>Add the shortcut via “Share” → <b>“Add to Home Screen”</b>.</li>
    </ol>
    <p class="exn" style="margin:0;font-weight:600">After every run</p>
    <ol class="guide"><li>Tap the <b>“Copy run”</b> shortcut.</li><li>Open this app → <b>Run</b> → <b>“📋 Paste run from Nike”</b> → tap “Paste” when prompted.</li><li>Check it quickly, then <b>Finish session</b>.</li></ol>
    <p class="small muted" style="margin:0">The time counts from the start to the end of the run, so pauses are included. You can correct it if needed. First run: confirm the permission for Health access.</p>
    <button class="secondary" data-act="closesheet">Close</button>`);
}

/* ================= Muskeln: welche Muskeln wurden wie stark trainiert ================= */
/* Welche Muskeln wie viel abbekommen und die Überschrift dazu stecken in muscles.js (NFMuscles), getestet in tests/muscles.test.js.
   Übungen ohne eigenen Eintrag dort nehmen die Muskeln aus der Bibliothek (NFEx, Feld m). */
const muscleLoad = H => NFMuscles.load(H, id => EXN[id] && EXN[id].m);
function bodySvg(view, I){
  const base = "rgba(255,255,255,.16)", sk = "rgba(255,255,255,.08)";
  const c = k => { const v = I[k]||0; return v<=0.02 ? base : `rgba(255,255,255,${(.24+.76*v).toFixed(2)})`; };
  const gl = k => (I[k]||0) >= .85 ? ` filter="url(#mglow)"` : "";
  let s = `<svg class="mbody" viewBox="0 0 110 250" aria-hidden="true"><defs><filter id="mglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  s += `<circle cx="55" cy="16" r="12" fill="${sk}"/><rect x="50" y="27" width="10" height="8" rx="3" fill="${sk}"/>`;
  s += `<rect x="16" y="84" width="9" height="30" rx="4.5" fill="${sk}"/><rect x="85" y="84" width="9" height="30" rx="4.5" fill="${sk}"/>`;
  s += `<ellipse cx="30" cy="44" rx="9" ry="8" fill="${c("shoulders")}"${gl("shoulders")}/><ellipse cx="80" cy="44" rx="9" ry="8" fill="${c("shoulders")}"${gl("shoulders")}/>`;
  if(view==="back"){
    s += `<path d="M38 36 Q55 31 72 36 L68 48 Q55 44 42 48Z" fill="${c("traps")}"/>`;
    s += `<path d="M40 50 Q55 46 70 50 L68 82 Q55 90 42 82Z" fill="${c("back")}"${gl("back")}/>`;
    s += `<path d="M44 86 Q55 92 66 86 L65 100 Q55 104 45 100Z" fill="${c("lowback")}"/>`;
    s += `<rect x="19" y="52" width="11" height="30" rx="5.5" fill="${c("triceps")}"${gl("triceps")}/><rect x="80" y="52" width="11" height="30" rx="5.5" fill="${c("triceps")}"${gl("triceps")}/>`;
    s += `<ellipse cx="45" cy="117" rx="13" ry="15" fill="${c("glutes")}"${gl("glutes")}/><ellipse cx="65" cy="117" rx="13" ry="15" fill="${c("glutes")}"${gl("glutes")}/>`;
    s += `<rect x="33" y="134" width="20" height="50" rx="9" fill="${c("hams")}"${gl("hams")}/><rect x="57" y="134" width="20" height="50" rx="9" fill="${c("hams")}"${gl("hams")}/>`;
    s += `<rect x="35" y="188" width="15" height="42" rx="7" fill="${c("calves")}"${gl("calves")}/><rect x="60" y="188" width="15" height="42" rx="7" fill="${c("calves")}"${gl("calves")}/>`;
  }else{
    s += `<path d="M40 40 Q55 37 54 40 L54 62 Q46 64 40 58Z" fill="${c("chest")}"${gl("chest")}/><path d="M70 40 Q55 37 56 40 L56 62 Q64 64 70 58Z" fill="${c("chest")}"${gl("chest")}/>`;
    s += `<rect x="45" y="66" width="20" height="34" rx="7" fill="${c("core")}"/><path d="M40 64 L44 66 L44 98 L40 96Z" fill="${c("core")}"/><path d="M70 64 L66 66 L66 98 L70 96Z" fill="${c("core")}"/>`;
    s += `<rect x="19" y="52" width="11" height="30" rx="5.5" fill="${c("biceps")}"${gl("biceps")}/><rect x="80" y="52" width="11" height="30" rx="5.5" fill="${c("biceps")}"${gl("biceps")}/>`;
    s += `<path d="M38 104 Q55 98 72 104 L72 112 L38 112Z" fill="${c("adduct")}"/>`;
    s += `<rect x="33" y="114" width="20" height="68" rx="9" fill="${c("quads")}"${gl("quads")}/><rect x="57" y="114" width="20" height="68" rx="9" fill="${c("quads")}"${gl("quads")}/>`;
    s += `<rect x="51" y="118" width="8" height="40" rx="4" fill="${c("adduct")}"/>`;
    s += `<rect x="35" y="188" width="15" height="42" rx="7" fill="${sk}"/><rect x="60" y="188" width="15" height="42" rx="7" fill="${sk}"/>`;
  }
  return s + `</svg>`;
}
function muscleSlide(H, when){
  const M = muscleLoad(H); if(!M.rank.length) return null;
  const dl = ms => ` style="animation-delay:${ms}ms"`;
  const hd = NFMuscles.headline(M, when);
  const hint = hd.hint ? `<p class="sy-p mhint fadeup"${dl(700)}>${hd.hint}</p>` : "";
  const rank = M.rank.slice(0,3).map((r,i) => `<div class="mrk fadeup"${dl(500+i*120)}><b>${i+1}</b><span>${r.n}</span><span class="tnum">${r.pct} %</span><i class="mtr"><i style="width:${Math.round(r.rel*100)}%"></i></i></div>`).join("");
  return {c:"s5", nophoto:true, h:`<p class="sy-eb">Your muscles ${when==="week"?"this week":"in "+when}</p><h2 class="sy-big pop">${hd.title}</h2><p class="sy-p">${hd.text}</p><div class="sy-panel mfig fadeup"${dl(300)}><div class="mfigs"><div>${bodySvg("front", M.I)}<small>front</small></div><div>${bodySvg("back", M.I)}<small>back</small></div></div></div><div class="mrank">${rank}</div>${hint}`};
}

/* ================= Monatsrückblick (Story) ================= */
function isoWeek(t){ const d = new Date(t); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7); const w1 = new Date(d.getFullYear(),0,4); return 1+Math.round(((d-w1)/864e5-3+(w1.getDay()+6)%7)/7); }
function monthData(y, m){
  const a = new Date(y, m, 1).getTime(), b = new Date(y, m+1, 1).getTime();
  const r = recapData(y, m); r.y = y; r.m = m; r.a = a; r.b = b; r.goal = S.settings.goal;
  const H = S.history.filter(e => e.start>=a && e.start<b); r.H = H;
  r.byDay = {}; H.forEach(e => (r.byDay[new Date(e.start).getDate()] = r.byDay[new Date(e.start).getDate()] || []).push(e));
  r.weeks = []; for(let ws = mondayOf(a); ws < b; ws += WEEK){
    const inM = Array.from({length:7}, (_,i) => ws+i*864e5+12*3600e3).filter(t => t>=a && t<b).length; if(inM<4) continue;
    const n = S.history.filter(e => e.start>=ws && e.start<ws+WEEK).length; r.weeks.push({ws, kw:isoWeek(ws+3*864e5), n}); }
  r.weeksOk = r.weeks.filter(w => w.n>=r.goal).length;
  r.gym = H.filter(e => W[e.type].kind==="gym").length; r.runs = H.filter(e => e.run).length; r.yogaN = H.filter(e => e.yoga).length;
  r.mob = (S.settings.mob||[]).filter(t => t>=a && t<b).length;
  r.calm = NFYoga.tension(calmEntries().filter(x => x.t>=a && x.t<b));
  r.breaks = (S.settings.breaks||[]).filter(x => x && x.t>=a && x.t<b).length;
  r.alT = H.filter(e => e.run && e.run.mode==="alster" && num(e.run.min)>0).map(e => ({t:e.start, min:num(e.run.min)}));
  r.alster = H.filter(e => e.run && e.run.mode==="alster").length;
  r.wd = [0,0,0,0,0,0,0]; H.forEach(e => r.wd[(new Date(e.start).getDay()+6)%7]++);
  const hrs = H.map(e => new Date(e.start).getHours()); r.avgH = hrs.length ? hrs.reduce((p,q) => p+q, 0)/hrs.length : 12;
  const gymE = H.filter(e => W[e.type].kind==="gym" && e.end && e.end-e.start>=10*60000); r.avgDur = gymE.length ? gymE.reduce((x,e) => x+(e.end-e.start), 0)/gymE.length/60000 : 0;
  // Kraftkurve: Übung mit dem größten Zuwachs (inkl. letztem Training davor als Startpunkt)
  let best = null;
  const ids = new Set(); H.forEach(e => Object.keys(e.sets||{}).forEach(k => ids.add(k)));
  ids.forEach(id => {
    const mk = e => Math.max(0, ...(e.sets[id]||[]).map(s => num(s.kg)));
    const all = S.history.filter(e => e.start<b && e.sets && e.sets[id] && mk(e)>0);
    const inM = all.filter(e => e.start>=a), before = all.filter(e => e.start<a);
    const pts = (before.length ? [before[before.length-1]] : []).concat(inM).map(e => ({t:e.start, kg:mk(e)}));
    if(pts.length<2) return;
    const f = pts[0].kg, l = Math.max(...pts.map(p => p.kg)), pct = Math.round((l-f)/f*100);
    if(l>f && (!best || pct>best.pct)) best = {id, n:EXN[id] ? EXN[id].n : id, pts, from:f, to:l, pct};
  });
  r.curve = best;
  const p = new Date(y, m-1, 1); r.prev = recapData(p.getFullYear(), p.getMonth()); r.prevM = p.getMonth();
  return r;
}
function lineSvg(pts, opt){
  const w = 260, h = 120, px = 16, py = 24, ys = pts.map(p => p.v), lo = Math.min(...ys), hi = Math.max(...ys), span = hi-lo || 1;
  const X = i => px + (pts.length===1 ? (w-2*px)/2 : i*(w-2*px)/(pts.length-1)), Y = v => opt.down ? py + (v-lo)/span*(h-2*py) : h-py - (v-lo)/span*(h-2*py);
  const d = pts.map((p,i) => `${i?"L":"M"}${X(i).toFixed(1)} ${Y(p.v).toFixed(1)}`).join(" ");
  const area = `${d} L${X(pts.length-1).toFixed(1)} ${h} L${X(0).toFixed(1)} ${h}Z`;
  return `<svg class="mline" viewBox="0 0 ${w} ${h+16}" aria-hidden="true"><g stroke="rgba(255,255,255,.16)"><line x1="0" y1="${py}" x2="${w}" y2="${py}"/><line x1="0" y1="${h/2+4}" x2="${w}" y2="${h/2+4}"/><line x1="0" y1="${h-py}" x2="${w}" y2="${h-py}"/></g>
    <path d="${area}" fill="rgba(255,255,255,.14)"/><path class="mdraw" d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>
    ${pts.map((p,i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${i===pts.length-1?6:4}" fill="#fff"/>`).join("")}
    <g fill="#fff" font-size="11" font-weight="600" font-family="Open Sans,system-ui,sans-serif">${(() => { const y0 = Y(pts[0].v), y1 = Y(pts[pts.length-1].v), up = y1 <= y0; return `<text x="${X(0)}" y="${(up ? y0+20 : y0-10).toFixed(1)}" text-anchor="start">${opt.lab(pts[0].v)}</text><text x="${X(pts.length-1)}" y="${(up ? Math.max(12, y1-12) : y1+20).toFixed(1)}" text-anchor="end">${opt.lab(pts[pts.length-1].v)}</text>`; })()}
    <text x="${px}" y="${h+14}" opacity=".75">${opt.x0}</text><text x="${w-px}" y="${h+14}" text-anchor="end" opacity=".75">${opt.x1}</text></g></svg>`;
}
function monthSlides(r){
  const sl = [], dl = ms => ` style="animation-delay:${ms}ms"`, M = MONTHS[r.m], dd = t => new Date(t).getDate()+"."+(new Date(t).getMonth()+1)+".";
  // 1 Kalender
  const lead = (new Date(r.y, r.m, 1).getDay()+6)%7, days = new Date(r.y, r.m+1, 0).getDate();
  let cells = WD.map(d => `<b>${d[0]}</b>`).join("") + "<span></span>".repeat(lead), k = 0;
  for(let d=1; d<=days; d++){ const l = r.byDay[d]; cells += l ? `<span class="on ${kc(l[0].type)} pop"${dl(400+(k++)*90)}>${d}</span>` : `<span>${d}</span>`; }
  sl.push({c:"s1", nophoto:true, h:`<p class="sy-eb">Your ${M}</p><h2 class="sy-big pop">${r.n} ${r.n===1?"session":"sessions"}</h2><p class="sy-p">on ${r.days} ${r.days===1?"day":"days"}. This is what your month looked like:</p><div class="sy-panel fadeup"${dl(200)}><div class="mcal">${cells}</div><div class="mleg"><span><i></i>Gym</span><span><i class="run"></i>Run</span><span><i class="yoga"></i>Yoga</span></div></div><p class="sy-hint">Tap to continue</p>`});
  // 2 Woche für Woche
  const mx = Math.max(r.goal, ...r.weeks.map(w => w.n))*1.12, bh = 130;
  const bars = r.weeks.map((w,i) => `<div class="mbw"><div class="mb ${w.n>=r.goal?"":"lo"}" style="height:${Math.max(26, w.n/mx*bh)}px;animation-delay:${300+i*120}ms"><em class="tnum">${w.n}</em></div><small>KW ${w.kw}</small></div>`).join("");
  sl.push({c:"s2", nophoto:true, h:`<p class="sy-eb">Weekly goal</p><h2 class="sy-big pop">${r.weeksOk} of ${r.weeks.length} weeks</h2><p class="sy-p">${r.weeksOk===r.weeks.length ? "You reached your goal every week! 🔥" : r.weeksOk ? "you reached your goal. 🔥" : "Next month you'll crack your goal. 💪"}</p><div class="sy-panel fadeup"${dl(200)}><div class="mbars" style="height:${bh+30}px"><i class="mgoal" style="bottom:${19 + r.goal/mx*bh}px"></i>${bars}</div><small class="mcap">Dashed: your goal of ${r.goal} sessions</small></div>`});
  // 3 Mix
  const parts = [["Gym", r.gym, "#ffffff"], ["Running", r.runs, "#9cc6f0"], ["Yoga", r.yogaN, "#ffc3a3"]].filter(x => x[1]>0);
  const tot = parts.reduce((x,p) => x+p[1], 0); let off = 25;
  const arcs = parts.map(p => { const len = p[1]/tot*100, s = `<circle cx="21" cy="21" r="15.9" fill="none" stroke="${p[2]}" stroke-width="6" stroke-dasharray="${len.toFixed(2)} ${(100-len).toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"/>`; off -= len; return s; }).join("");
  const mixT = parts.length>=3 ? "Nicely balanced" : parts.length===2 ? "Good mix" : parts[0] ? `Full ${parts[0][0].toLowerCase()} focus` : "";
  sl.push({c:"s6", nophoto:true, h:`<p class="sy-eb">Your mix</p><h2 class="sy-big pop">${mixT}</h2><div class="sy-panel mdonut fadeup"${dl(250)}><svg viewBox="0 0 42 42" aria-hidden="true"><circle cx="21" cy="21" r="15.9" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="6"/>${arcs}<text x="21" y="24.5" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="10" fill="#fff">${tot}</text></svg><div>${parts.map(p => `<p><i style="background:${p[2]}"></i><b>${p[1]}×</b> ${p[0]}</p>`).join("")}</div></div>${r.mob?`<p class="sy-p fadeup"${dl(500)}>Plus ${r.mob}× glute mobility 🤸‍♀️</p>`:""}`});
  // 4 Kraftkurve
  if(r.curve){
    const c = r.curve, others = r.gains.filter(g => g.n!==c.n).slice(0,2);
    sl.push({c:"s5", nophoto:true, h:`<p class="sy-eb">Getting stronger</p><h2 class="sy-big pop">${esc(c.n)}</h2><p class="sy-p"><b>${fmt(c.from)} → ${fmt(c.to)} kg</b> <span class="sy-pill">+${c.pct} %</span></p><div class="sy-panel fadeup"${dl(250)}>${lineSvg(c.pts.map(p => ({v:p.kg})), {lab:v => fmt(v)+" kg", x0:dd(c.pts[0].t), x1:dd(c.pts[c.pts.length-1].t)})}</div>${others.length?`<p class="sy-p msm fadeup"${dl(600)}>Also: ${others.map(g => `${esc(g.n)} +${fmt(g.d)} kg`).join(" · ")}</p>`:""}`});
  }
  // 5 Laufen
  if(r.runs){
    const al = r.alT;
    const chart = al.length>=2 ? `<div class="sy-panel fadeup"${dl(250)}><small class="mcap" style="margin:0 0 4px">${esc(LN())}</small>${lineSvg(al.map(x => ({v:x.min})), {down:true, lab:v => hms(v), x0:dd(al[0].t), x1:dd(al[al.length-1].t)})}${al[al.length-1].min<al[0].min?`<small class="mcap">${mmss(al[0].min-al[al.length-1].min)} faster than at the start of the month</small>`:""}</div>` : `<div class="sy-list fadeup"${dl(300)}>${r.bestAl?`<p>⏱️ Best Alster loop: <b class="tnum">${hms(r.bestAl)}</b></p>`:""}<p>👟 ${r.runs} ${r.runs===1?"run":"runs"}</p></div>`;
    sl.push({c:"s4", nophoto:true, h:`<p class="sy-eb">Running</p><h2 class="sy-num pop tnum">${fmt(r.km)} km</h2><p class="sy-p">${r.alster?`${r.alster}× your ${esc(LN())} 🔁`:"is how far you ran this month."}</p>${chart}`});
  }
  // 6 Muskeln
  const ms = muscleSlide(r.H, M); if(ms) sl.push(ms);
  // 7 Vormonat
  if(r.prev.n){
    const P = r.prev, row = (lab, a, b, f, unit) => { const d = a-b, up = d>1e-9, same = Math.abs(d)<1e-9; return `<p><span>${lab}</span><span><b class="tnum">${f(a)}${unit||""}</b><span class="${up?"up":"eq"}">${same ? "= same" : (up ? "↑ +" : "↓ ") + f(Math.abs(d))}</span></span></p>`; };
    const rows = [row("Sessions", r.n, P.n, v => fmt(v,0))];
    if(r.km || P.km) rows.push(row("Run", r.km, P.km, v => fmt(v), " km"));
    if(r.vol || P.vol) rows.push(row("Moved", r.vol/1000, P.vol/1000, v => fmt(v,1), " t"));
    if(r.days || P.days) rows.push(row("Trainingstage", r.days, P.days, v => fmt(v,0)));
    const head = r.n>P.n ? "You keep getting better" : r.n===P.n ? "Consistently strong" : "Every month counts";
    sl.push({c:"s3", h:`<p class="sy-eb">${M} vs. ${MONTHS[r.prevM]}</p><h2 class="sy-big pop">${head}</h2><div class="mcmp fadeup"${dl(300)}>${rows.join("")}</div>`});
  }
  // 8 Rhythmus
  const fav = r.wd.indexOf(Math.max(...r.wd)), wmx = Math.max(...r.wd), tod = r.avgH<11 ? "in the morning ☀️" : r.avgH<17 ? "during the day 🌤️" : "in the evening 🌙";
  sl.push({c:"s7", nophoto:true, h:`<p class="sy-eb">Your rhythm</p><h2 class="sy-big pop">${WDAY[(fav+1)%7]}</h2><p class="sy-p">is your favourite day. You mostly train <b>${tod}</b></p><div class="sy-panel fadeup"${dl(250)}><div class="mbars sm" style="height:130px">${r.wd.map((n,i) => `<div class="mbw"><div class="mb ${i===fav?"":"lo"}" style="height:${Math.max(4, n/wmx*96)}px;animation-delay:${300+i*80}ms"></div><small>${WD[i]}</small></div>`).join("")}</div></div>`});
  // 9 Abschluss
  const nx = MONTHS[(r.m+1)%12];
  sl.push({c:"s8", end:true, h:`<p class="sy-eb">${M} ${r.y}</p><h2 class="sy-big pop">What a month ❤️</h2>${r.badges.length?`<p class="sy-p">${r.badges.length} ${r.badges.length===1?"new badge":"new badges"}:</p><div class="badges sy-badges fadeup"${dl(300)}>${r.badges.slice(0,4).map(b => badgeEl(b, true).replace(/data-act="[^"]*"/g, "")).join("")}</div>`:`<p class="sy-p">${r.n} ${r.n===1?"session":"sessions"}${r.km?`, ${fmt(r.km)} km`:""}${r.vol?`, ${fmt(Math.round(r.vol),0)} kg moved`:""}.</p>`}<p class="sy-p fadeup"${dl(500)}>Here's to a strong ${nx}!</p><div class="sy-btns fadeup"${dl(700)}><button class="sy-btn" data-act="share">📤 Share</button>${r.prev.n?`<button class="sy-btn ghost" data-act="recap" data-y="${new Date(r.y, r.m-1, 1).getFullYear()}" data-m="${r.prevM}">‹ View ${MONTHS[r.prevM]}</button>`:""}<button class="sy-btn ghost" data-act="storyclose">Close</button></div>`});
  return sl;
}
function monthShareSpec(r){
  const items = [];
  if(r.curve) items.push(`💪 ${r.curve.n} +${r.curve.pct} %`);
  if(r.alster) items.push(`🔁 ${r.alster}× ${LN()}`);
  const M = muscleLoad(r.H), mt = M.rank[0]; if(mt) items.push(`${NFMuscles.EMOJI[mt.k] || "💪"} ${mt.pct} % for the ${String(mt.n).toLowerCase()}`);
  if(r.calm && r.calm.n>=2 && r.calm.diff>0) items.push(`😌 Tension ${fmt(r.calm.before)} → ${fmt(r.calm.after)} after yoga`);
  else if(r.breaks) items.push(`📚 ${r.breaks} study ${r.breaks===1?"break":"breaks"}`);
  const st2 = [["Sessions", String(r.n)]]; if(r.km) st2.push(["Run", fmt(r.km)+" km"]); if(r.vol) st2.push(["Moved", tons(r.vol)]);
  return {key:"m"+r.y+"-"+r.m, col:THEME_COL[""], eyebrow:`${MONTHS[r.m]} ${r.y}`, title:`My ${MONTHS[r.m]}`, sub:"Your training month ✨", stats:st2, items:items.slice(0,3), kcal:r.kcal, foot:`${r.days} training days`, text:`My training month: ${MONTHS[r.m]} ✨`};
}
function openMonth(y, m){
  const r = monthData(y, m); if(!r.n){ toast(`There were no sessions in ${MONTHS[m]} yet.`); return; }
  STORY = {kind:"month", r, slides:monthSlides(r), i:0};
  musicStart("month"); attachPhotos(STORY);
  prepShare(monthShareSpec(r));
  drawStory();
}
function monthRef(){ const n = new Date(); if(n.getDate()<=7){ const p = new Date(n.getFullYear(), n.getMonth()-1, 1); return [p.getFullYear(), p.getMonth()]; } return [n.getFullYear(), n.getMonth()]; }

let STORY = null;
function openYear(y){
  const r = yearData(y); if(!r.n){ toast(`There are no sessions for ${y} yet.`); return; }
  STORY = {kind:"year", r, slides:storySlides(r), i:0};
  musicStart("year"); attachPhotos(STORY);
  prepShare(yearShareSpec(r));
  drawStory();
}
function drawStory(noFx){
  let el = document.getElementById("story");
  if(!STORY){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("div"); el.id = "story"; el.setAttribute("role","dialog"); el.setAttribute("aria-modal","true"); document.body.appendChild(el); el.addEventListener("click", storyTap); }
  const sl = STORY.slides[STORY.i];
  const ph = STORY.photos && STORY.photos[STORY.i];
  el.className = "story " + sl.c + (ph ? " has-photo" : "");
  el.innerHTML = (ph ? `<div class="sy-bg kb${STORY.i%3}" style="background-image:url('${ph.url}')${ph.pos?`;background-position:${ph.pos}`:""}"></div><div class="sy-tint"></div><div class="sy-shade"></div>` : "") + `<div class="sy-prog">${STORY.slides.map((_,i) => `<i class="${i<STORY.i?"done":i===STORY.i?"on":""}"></i>`).join("")}</div><button class="sy-snd" data-act="storymute" aria-label="${S.settings.storyMute?"Music on":"Music off"}">${S.settings.storyMute?"🔇":"🔊"}</button><button class="sy-x" data-act="storyclose" aria-label="Close">✕</button><div class="sy-in">${sl.h}</div>`;
  if(sl.end && !noFx) confetti(true);
  musicLevel(STORY.i, STORY.slides.length);
}
function storyTap(ev){
  if(MUS && MUS.ctx.state==="suspended") MUS.ctx.resume().then(() => STORY && musicLevel(STORY.i, STORY.slides.length)).catch(() => {});
  if(!STORY || ev.target.closest("[data-act]")) return;
  if(ev.clientX < window.innerWidth/3){ if(STORY.i>0){ STORY.i--; drawStory(); } }
  else if(STORY.i < STORY.slides.length-1){ STORY.i++; drawStory(); }
}
function closeStory(){ STORY = null; drawStory(); musicStop(); }

/* ================= Events ================= */

/* ================= Onboarding: account, questionnaire, plan ================= */
// The account is a local profile: name and email plus a salted PBKDF2 hash of the password.
// Nothing leaves the phone; the password locks the app on this device ("Lock app" in settings).
const PW_ITER = 150000, OB_FAILS = 5, OB_WAIT = 30000;
const KICON = {s:"💪", r:"🏃", y:"🧘"};
const LEVEL_TXT = {beginner:["Beginner","new or returning"], intermediate:["Intermediate","training regularly"], advanced:["Advanced","1+ year consistent"]};
const OB_STEPS = {signup:1, body:2, days:3, mix:4, goals:5, level:6, stmode:7, split:8, owndays:9, plans:10};
const obTotal = () => (OB.a && OB.a.mix && OB.a.mix.s>0) ? (OB.a.stmode==="own" ? 8 : 7) : 5;
const SEX_TXT = {female:"Female", male:"Male", diverse:"Diverse", na:"Prefer not to say"};
let OB = {step:"welcome", mode:"new", a:null, plans:null, fails:0, until:0};
const needsOnboarding = () => !S.settings.profile || !!S.settings.locked;
const firstName = () => ((S.settings.profile && S.settings.profile.name) || "").trim().split(/\s+/)[0];
const b64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

async function hashPassword(pw, salt, iter){
  if(!(window.crypto && crypto.subtle)) throw new Error("nocrypto");
  const s = salt ? unb64(salt) : crypto.getRandomValues(new Uint8Array(16)), it = iter || PW_ITER;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({name:"PBKDF2", salt:s, iterations:it, hash:"SHA-256"}, key, 256);
  return {salt:b64(s), hash:b64(bits), iter:it};
}
function sameHash(a, b){ if(typeof a!=="string" || typeof b!=="string" || a.length!==b.length) return false; let d = 0; for(let i=0; i<a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d===0; }
async function checkPassword(pw){
  const p = S.settings.profile; if(!p || !p.hash) return false;
  try{ const h = await hashPassword(pw, p.salt, p.iter); return sameHash(h.hash, p.hash); }catch(e){ return false; }
}

function defaultAnswers(){
  const old = S.settings.answers;
  if(old && NFPlan.validateAnswers(old).ok) return clone(old);
  const days = Math.min(NFPlan.MAX_DAYS, Math.max(NFPlan.MIN_DAYS, S.settings.goal|0 || 3));
  return {days, mix:NFPlan.rebalanceMix({s:2, r:1, y:0}, days), goals:[], level:"beginner", min:45};
}
function startOnboarding(step, mode){
  OB = Object.assign({}, OB, {step, mode:mode||"new", plans:null});
  if(!OB.a || mode==="edit") OB.a = defaultAnswers();
  closeSheet(); screen = "onboard"; render(); window.scrollTo(0,0);
}
function obGo(step){ OB.step = step; renderOnboard(); window.scrollTo(0,0); }
function finishOnboarding(){ OB.a = null; OB.plans = null; screen = "home"; render(); window.scrollTo(0,0); }

function obHead(back){
  const right = OB.mode==="edit" ? `<button type="button" class="txtbtn" data-act="ob" data-do="cancel">Cancel</button>`
    : (S.history.length && OB_STEPS[OB.step]>1 ? `<button type="button" class="txtbtn" data-act="ob" data-do="skip">Skip for now</button>` : "");
  const left = back ? `<button type="button" class="txtbtn" data-act="ob" data-do="go" data-to="${back}">‹ Back</button>` : NF_MINI;
  const n = OB_STEPS[OB.step];
  return `<div class="ob-top">${left}${right}</div>${n ? `<div class="ob-prog" aria-hidden="true"><i style="width:${n/10*100}%"></i></div>` : ""}`;
}
const obStep = (n, of) => `<p class="ob-step">Step ${n} of ${of}</p>`;
const errEl = (id) => `<p class="err" id="${id}" role="alert" aria-live="polite"></p>`;

function renderOnboard(){
  const a = OB.a || (OB.a = defaultAnswers()), app = $("#app");
  let h = "";
  switch(OB.step){
    case "welcome":
      h = `<section class="ob-hero">${NF_MINI}<h1>Train like<br>you study.</h1></section>
        <p class="lead">Strength, running and yoga in one plan. Built around your goals and your week at Nova.</p>
        <div class="foot"><button class="primary" data-act="ob" data-do="go" data-to="signup">Create account</button>
        <button class="secondary" data-act="ob" data-do="go" data-to="restore">I already have an account</button></div>`;
      break;
    case "signup": {
      const p = S.settings.profile || {};
      h = obHead(S.settings.profile ? "" : "welcome") + `<h2>Create your account</h2>
        <p class="lead">${S.history.length ? "Your training history stays as it is. The account protects it on this phone." : "Your account and training data stay on this phone."}</p>
        <form id="ob-form" data-form="signup" novalidate>
          <label class="f" for="ob-name">Name</label><input class="inp" id="ob-name" name="name" autocomplete="name" maxlength="40" value="${esc(p.name || S.settings.name || "")}" placeholder="Julius" required>${errEl("ob-name-err")}
          <label class="f" for="ob-email">Email</label><input class="inp" id="ob-email" name="email" type="email" autocomplete="email" inputmode="email" maxlength="120" value="${esc(p.email||"")}" placeholder="name@novasbe.pt" required>${errEl("ob-email-err")}
          <label class="f" for="ob-pw">Password</label><input class="inp" id="ob-pw" name="password" type="password" autocomplete="new-password" maxlength="128" placeholder="At least 8 characters" required>
          <p class="ob-hint">At least 8 characters, with a letter and a number.</p>${errEl("ob-pw-err")}
          <div class="foot"><button class="primary" type="submit">Continue</button></div>
        </form>`;
      break;
    }
    case "restore":
      h = obHead("welcome") + `<h2>Welcome back</h2>
        <p class="lead">NOVAFit keeps your account and training on your phone, not on a server. To continue on this phone, load the backup file you created under Settings → Back up.</p>
        <input type="file" id="importf" accept=".json,application/json" hidden>
        <div class="foot"><button class="primary" data-act="import">Load backup file</button>
        <button class="secondary" data-act="ob" data-do="go" data-to="signup">Create a new account instead</button></div>`;
      break;
    case "login": {
      const p = S.settings.profile || {};
      h = `<div class="ob-top">${NF_MINI}</div><h2>Welcome back${firstName() ? ", " + esc(firstName()) : ""}</h2>
        <p class="lead">NOVAFit is locked. Enter the password for <b>${esc(p.email||"")}</b>.</p>
        <form id="ob-form" data-form="login" novalidate>
          <input type="email" name="username" autocomplete="username" value="${esc(p.email||"")}" hidden>
          <label class="f" for="ob-pw">Password</label><input class="inp" id="ob-pw" name="password" type="password" autocomplete="current-password" maxlength="128" required>${errEl("ob-pw-err")}
          <div class="foot"><button class="primary" type="submit">Unlock</button>
          <button type="button" class="skip" data-act="ob" data-do="forgot">Forgot your password?</button></div>
        </form>`;
      break;
    }
    case "body": {
      const b = OB.body || (OB.body = Object.assign({sex:"", age:"", cm:""}, S.settings.body||{}, {kg:S.settings.bodyKg ? String(S.settings.bodyKg) : ""}));
      h = obHead("") + obStep(1, obTotal()) + `<h2>A bit about you</h2>
        <p class="lead">Saved in your profile on this phone. Sex, age, weight and height are used to estimate the calories you burn.</p>
        <label class="f" id="ob-sex-l">Sex</label>
        <div class="opts sexes" role="group" aria-labelledby="ob-sex-l">${Object.entries(SEX_TXT).map(([k,l]) => `<button type="button" class="opt" data-act="ob" data-do="sex" data-v="${k}" aria-pressed="${b.sex===k}">${l}</button>`).join("")}</div>${errEl("ob-sex-err")}
        <form id="ob-form" data-form="body" novalidate>
          <div class="two"><div><label class="f" for="ob-age">Age</label><input class="inp" id="ob-age" name="age" inputmode="numeric" maxlength="3" autocomplete="off" value="${esc(b.age)}" placeholder="21">${errEl("ob-age-err")}</div>
          <div><label class="f" for="ob-kg">Weight (kg)</label><input class="inp" id="ob-kg" name="kg" inputmode="decimal" maxlength="5" autocomplete="off" value="${esc(b.kg)}" placeholder="68">${errEl("ob-kg-err")}</div></div>
          <div class="two"><div><label class="f" for="ob-cm">Height (cm) <span class="muted" style="text-transform:none;letter-spacing:0">optional</span></label><input class="inp" id="ob-cm" name="cm" inputmode="numeric" maxlength="3" autocomplete="off" value="${esc(b.cm==null ? "" : b.cm)}" placeholder="175">${errEl("ob-cm-err")}</div><div></div></div>
          <div class="foot"><button class="primary" type="submit">Continue</button></div>
        </form>`;
      break;
    }
    case "days":
      h = obHead("body") + obStep(2, obTotal()) + `<h2>${firstName() ? "Hi " + esc(firstName()) + ", how" : "How"} often do you want to train?</h2>
        <p class="lead">Sessions per week. You can change this any time.</p>
        <div class="daysel" role="group" aria-label="Sessions per week">${[2,3,4,5,6].map(d => `<button class="opt" data-act="ob" data-do="days" data-v="${d}" aria-pressed="${a.days===d}">${d}</button>`).join("")}</div>
        <p class="lead" aria-live="polite">${{2:"A calm start. Perfect for busy exam weeks.",3:"The sweet spot for steady progress.",4:"Ambitious, with room to recover.",5:"Serious training. Plan your rest days well.",6:"Athlete mode. One rest day per week."}[a.days]||""}</p>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">Continue</button></div>`;
      break;
    case "mix": {
      const t = NFPlan.mixTotal(a.mix);
      h = obHead("days") + obStep(3, obTotal()) + `<h2>What should your week look like?</h2>
        <p class="lead">Split your ${a.days} sessions across the three types.</p>
        <div>${NFPlan.KINDS.map(k => `<div class="mixrow"><span><span aria-hidden="true">${KICON[k]}</span>${NFPlan.KIND_LABEL[k]}</span>
          <div class="stepper"><button data-act="ob" data-do="mix" data-k="${k}" data-d="-1" aria-label="Fewer ${NFPlan.KIND_LABEL[k].toLowerCase()} sessions">−</button><b aria-live="polite">${a.mix[k]}</b><button data-act="ob" data-do="mix" data-k="${k}" data-d="1" aria-label="More ${NFPlan.KIND_LABEL[k].toLowerCase()} sessions">+</button></div></div>`).join("")}</div>
        <p class="total ${t===a.days?"ok":"no"}">${t} of ${a.days} sessions planned</p>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">Continue</button></div>`;
      break;
    }
    case "goals":
      h = obHead("mix") + obStep(4, obTotal()) + `<h2>Pick your goals</h2>
        <p class="lead">Choose up to ${NFPlan.MAX_PER_KIND} for each type of training. Your plan is built around them.</p>
        ${NFPlan.KINDS.filter(k => a.mix[k]>0).map(k => `<p class="gcat"><span aria-hidden="true">${KICON[k]}</span>${NFPlan.KIND_LABEL[k]}<small>${a.goals.filter(id => NFPlan.goalById(id).kind===k).length} / ${NFPlan.MAX_PER_KIND}</small></p><div class="opts">${NFPlan.GOALS[k].map(g => `<button class="opt" data-act="ob" data-do="goal" data-v="${g.id}" aria-pressed="${a.goals.includes(g.id)}">${esc(g.label)}</button>`).join("")}</div>`).join("")}
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">Continue${a.goals.length ? ` (${a.goals.length} ${a.goals.length===1?"goal":"goals"})` : ""}</button></div>`;
      break;
    case "level":
      h = obHead("goals") + obStep(5, obTotal()) + `<h2>Last thing: your level</h2>
        <p class="lead">So the plan starts at the right intensity.</p>
        <div class="opts" role="group" aria-label="Level">${NFPlan.LEVELS.map(l => `<button class="opt" data-act="ob" data-do="level" data-v="${l}" aria-pressed="${a.level===l}">${LEVEL_TXT[l][0]}<small>${LEVEL_TXT[l][1]}</small></button>`).join("")}</div>
        <label class="f">Time per session</label>
        <div class="mins" role="group" aria-label="Time per session">${NFPlan.MINUTES.map(m => `<button class="opt" data-act="ob" data-do="min" data-v="${m}" aria-pressed="${a.min===m}">${m} min</button>`).join("")}</div>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">${a.mix.s>0 ? "Continue" : "Show my plans"}</button></div>`;
      break;
    case "stmode": {
      const n = a.mix.s, rec = NFPlan.splitById(a.split) || NFPlan.recommendSplit(n, a.goals, a.level).split, own = a.stmode==="own";
      const why = a.goals.map(id => NFPlan.goalById(id)).filter(g => g && g.kind==="s").map(g => `“${esc(g.label)}”`)[0];
      h = obHead("level") + obStep(6, obTotal()) + `<h2>How do you want to train strength?</h2>
        <p class="lead">${n} strength ${n===1?"session":"sessions"} a week. Follow our plan, or put it together yourself.</p>
        <div class="splits stmode" role="radiogroup" aria-label="Strength plan">
          <button class="split" role="radio" aria-checked="${!own}" data-act="ob" data-do="stmode" data-v="rec">
            <span class="sp-h"><b>Recommended for you</b><span class="tag">Ready to go</span></span>
            <span class="sp-w">${rec.workouts.map(k => `<i>${esc(NFPlan.WORKOUTS[k].title)}</i>`).join("")}</span>
            <small>${esc(rec.name)}${why ? `, based on your goal ${why}` : ""}. Every exercise already chosen.</small></button>
          <button class="split" role="radio" aria-checked="${own}" data-act="ob" data-do="stmode" data-v="own">
            <span class="sp-h"><b>Build my own</b><span class="tag">Your choice</span></span>
            <small>Pick your split, then decide for each day: take our template or choose every exercise yourself.</small></button>
        </div>
        <p class="note">You can switch later in Menu › My plan. Either way you can swap or add exercises during a workout.</p>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">Continue</button></div>`;
      break;
    }
    case "split": {
      const n = a.mix.s, rec = NFPlan.recommendSplit(n, a.goals, a.level), list = NFPlan.splitsFor(n), own = a.stmode==="own";
      const cur = own ? (a.ownSplit || a.split) : a.split;
      const why = rec.reason==="goal" ? `Best for “${NFPlan.goalById(rec.goal).label}”` : rec.reason==="beginner" ? "Best for beginners" : "Recommended";
      h = obHead("stmode") + obStep(7, obTotal()) + `<h2>${own ? "Choose your split" : "How do you want to split your strength days?"}</h2>
        <p class="lead">${n} strength ${n===1?"session":"sessions"} a week. ${own ? "Next you decide for each day: template or your own exercises." : "Every option trains your whole body over the week. Pick the one that suits you, you can change it any time."}</p>
        <div class="splits" role="radiogroup" aria-label="Strength split">${list.map(sp => `<button class="split" role="radio" aria-checked="${cur===sp.id}" data-act="ob" data-do="split" data-v="${sp.id}">
          <span class="sp-h"><b>${esc(sp.name)}</b>${sp.id===rec.split.id?`<span class="tag">${esc(why)}</span>`:""}</span>
          <span class="sp-w">${sp.workouts.map(k => `<i>${esc(NFPlan.WORKOUTS[k].title)}</i>`).join("")}</span>
          <small>${esc(sp.why)}</small></button>`).join("")}${own ? `<button class="split custom" role="radio" aria-checked="${cur==="custom"}" data-act="ob" data-do="split" data-v="custom">
          <span class="sp-h"><b>Custom split</b></span><small>Name your own ${n===1?"day":"days"}, e.g. Chest &amp; Back or Arms, and choose every exercise.</small></button>` : ""}</div>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">${own ? "Continue" : "Show my plans"}</button></div>`;
      break;
    }
    case "owndays": {
      const days = (a.own && a.own.days) || [], custom = a.own && a.own.split==="custom";
      h = obHead("split") + obStep(8, obTotal()) + `<h2>Set up your days</h2>
        <p class="lead">For each day: take our template or pick the exercises yourself.</p>
        <div class="splits">${days.map((d, i) => {
          const tpl = d.tpl && W[d.tpl], prev = tpl ? tpl.ex.filter(e => !e.opt).map(e => esc(e.n.replace(/ \(.*\)$/, ""))).join(" · ") : "";
          const seg = custom ? "" : `<div class="odseg" role="group" aria-label="${esc(d.name)}: template or own">${[["rec","Recommended"],["own","Choose my own"]].map(([m,l]) => `<button type="button" aria-pressed="${d.mode===m}" data-act="ob" data-do="ownmode" data-i="${i}" data-v="${m}">${l}</button>`).join("")}</div>`;
          const name = custom ? `<label class="f" for="od-n${i}" style="margin:0">Name of day ${i+1}</label><input class="inp" id="od-n${i}" data-in="ownname" data-i="${i}" maxlength="${NFPlan.OWN_NAME_MAX}" value="${esc(d.name)}" placeholder="e.g. Chest &amp; Back">` : "";
          const body = d.mode==="own"
            ? `<div class="od-ex">${(d.ex||[]).map(id => { const e = EXN[id]; return e ? `<div class="oe">${exThumb(e)}<span>${esc(e.n)}</span><button type="button" data-act="ob" data-do="ownrm" data-i="${i}" data-ex="${id}" aria-label="Remove ${esc(e.n)}">×</button></div>` : ""; }).join("")}</div>
               <button type="button" class="od-add" data-act="ob" data-do="ownadd" data-i="${i}">+ ${(d.ex||[]).length ? "Add more exercises" : "Choose exercises"}</button>`
            : `<p class="od-prev">${prev}</p><p class="od-prev" style="font-size:12px">You can still add exercises during the workout.</p>`;
          return `<div class="ownday"><div class="od-h">${custom ? "" : `<b>${esc(d.name)}</b>`}<small>DAY ${i+1}${d.mode==="own" ? ` · ${(d.ex||[]).length} ${(d.ex||[]).length===1?"exercise":"exercises"}` : ""}</small></div>${name}${seg}${body}</div>`;
        }).join("")}</div>
        ${errEl("ob-err")}<div class="foot"><button class="primary" data-act="ob" data-do="next">Show my plans</button></div>`;
      break;
    }
    case "plans":
      h = obHead(a.mix.s>0 ? (a.stmode==="own" ? "owndays" : "split") : "level") + `<h2>Your suggested plans</h2>
        <p class="lead">${LEVEL_TXT[a.level][0]} · ${a.goals.map(id => esc(NFPlan.goalById(id).label)).join(" · ")}</p>
        <div class="plans">${OB.plans.map((p,i) => `<article class="plan${p.best?" best":""}"><header><span aria-hidden="true" style="font-size:20px">${p.best?"🎯":p.id==="easy"?"🌱":"⚖️"}</span><div><b>${esc(p.name)}</b><small>${esc(p.why)} · ${p.days} sessions${p.split ? " · " + esc(p.split.name) : ""}</small></div>${p.best?`<span class="tag">Best match</span>`:""}</header>
          ${p.sessions.map(s => `<div class="ses"><b>${NFPlan.DAY_NAMES[s.day]}</b><span aria-hidden="true">${KICON[s.kind]}</span><span class="st">${esc(s.title)}${s.addon && MOB[s.addon.id] ? `<small class="addon">+ ${esc(MOB[s.addon.id].n.toLowerCase())} ${stepsMin(MOB[s.addon.id].steps)} min</small>` : ""}</span><em>${s.min} min</em></div>`).join("")}
          <button class="${p.best?"primary":"secondary"}" data-act="ob" data-do="choose" data-i="${i}">Choose this plan</button></article>`).join("")}</div>`;
      break;
    case "history": {
      const d = OB.hist;
      h = `<div class="ob-top">${NF_MINI}<button type="button" class="txtbtn" data-act="ob" data-do="go" data-to="done">${d ? "Continue" : "Skip for now"}</button></div>
        <h2>Bring your training history</h2>
        <p class="lead">Already running with Garmin, Strava or another app? Bring your runs into NOVAFit, so your stats, calendar and badges start where you are.</p>
        ${d ? `<div class="hsum done"><b class="tnum">${d.n}</b> ${d.n===1 ? "run" : "runs"} · <b class="tnum">${fmt(d.km)}</b> km added ✓<small>${d.badges ? `${d.badges} ${d.badges===1 ? "badge" : "badges"} unlocked · ` : ""}<button type="button" class="txtbtn" data-act="histundo">Undo</button></small></div>` : ""}
        ${impChooserHtml()}
        <p class="note">Nothing is uploaded: the files are read on this phone. You can do this later too: tap the button top right, then “Import runs from other apps”.</p>
        <div class="foot"><button class="${d ? "primary" : "secondary"}" data-act="ob" data-do="go" data-to="done">${d ? "Continue" : "Skip for now"}</button></div>`;
      break;
    }
    case "done": {
      const p = S.settings.plan;
      h = `<div class="ob-top">${NF_MINI}</div><h2>You're all set${firstName() ? ", " + esc(firstName()) : ""}.</h2>
        <p class="lead">Your plan: <b style="color:var(--ink)">${esc(p ? p.name : "")}</b>. Your weekly goal is now ${p ? p.days : S.settings.goal} sessions, and the home screen shows what's next.</p>
        <p class="note">Tip: install NOVAFit on your home screen and turn on reminders, so it can nudge you on training days.</p>
        <div class="foot"><button class="primary" data-act="ob" data-do="finish">Start training</button></div>`;
      break;
    }
  }
  app.innerHTML = h;
  const f = app.querySelector("input:not([hidden])"); if(f && !f.value) setTimeout(() => { try{ f.focus({preventScroll:true}); }catch(e){} }, 50);
}

function obError(id, msg){
  const el = document.getElementById(id); if(el) el.textContent = msg || "";
  const inp = document.getElementById(id.replace(/-err$/, "")); if(inp) inp.setAttribute("aria-invalid", msg ? "true" : "false");
}

async function obSubmit(form){
  const kind = form.dataset.form, btn = form.querySelector("[type=submit]");
  if(kind==="signup"){
    const v = NFPlan.validateSignup({name:form.name.value, email:form.email.value, password:form.password.value});
    obError("ob-name-err", v.errors.name); obError("ob-email-err", v.errors.email); obError("ob-pw-err", v.errors.password);
    if(!v.ok){ const bad = form.querySelector('[aria-invalid="true"]'); if(bad) bad.focus(); return; }
    btn.disabled = true;
    try{
      const h = await hashPassword(form.password.value);
      S.settings.profile = Object.assign({name:v.value.name, email:v.value.email, created:Date.now()}, h);
      S.settings.name = v.value.name; S.settings.locked = false; save();
      obGo("body");
    }catch(e){ obError("ob-pw-err", "This browser can't store a password securely. Open NOVAFit over https or in Safari or Chrome."); btn.disabled = false; }
  }else if(kind==="body"){
    const b = OB.body || {}, v = NFPlan.validateBody({sex:b.sex, age:form.age.value, kg:form.kg.value, cm:form.cm.value});
    obError("ob-sex-err", v.errors.sex); obError("ob-age-err", v.errors.age); obError("ob-kg-err", v.errors.kg); obError("ob-cm-err", v.errors.cm);
    if(!v.ok){ const bad = form.querySelector('[aria-invalid="true"]'); if(bad) bad.focus(); return; }
    S.settings.body = {sex:v.value.sex, age:v.value.age}; if(v.value.cm) S.settings.body.cm = v.value.cm;
    S.settings.bodyKg = String(v.value.kg); save();
    OB.body = null; obGo("days");
  }else if(kind==="login"){
    const pw = form.password.value;
    if(Date.now() < OB.until){ obError("ob-pw-err", `Too many attempts. Try again in ${Math.ceil((OB.until-Date.now())/1000)} seconds.`); return; }
    if(!pw){ obError("ob-pw-err", "Enter your password"); return; }
    btn.disabled = true;
    if(await checkPassword(pw)){ OB.fails = 0; S.settings.locked = false; save(); finishOnboarding(); return; }
    btn.disabled = false; OB.fails++;
    if(OB.fails >= OB_FAILS){ OB.fails = 0; OB.until = Date.now() + OB_WAIT; obError("ob-pw-err", "Too many attempts. Try again in 30 seconds."); }
    else obError("ob-pw-err", "That password isn't right. Try again.");
    form.password.select();
  }else if(kind==="pwchange"){
    const cur = form.current.value, nw = form.password.value;
    const v = NFPlan.validateSignup({name:"x", email:"x@x.xx", password:nw});
    obError("pw-cur-err", ""); obError("pw-new-err", v.errors.password);
    if(!v.ok) return;
    btn.disabled = true;
    if(!(await checkPassword(cur))){ obError("pw-cur-err", "That password isn't right"); btn.disabled = false; return; }
    Object.assign(S.settings.profile, await hashPassword(nw)); save(); closeSheet(); toast("Password changed");
  }
}

function obAct(b){
  const a = OB.a, d = b.dataset;
  switch(d.do){
    case "go": obGo(d.to); break;
    case "edit": OB.body = null; startOnboarding("body", "edit"); break;
    case "sex":
      (OB.body = OB.body || {}).sex = d.v; obError("ob-sex-err", "");
      document.querySelectorAll('[data-do="sex"]').forEach(x => x.setAttribute("aria-pressed", String(x.dataset.v===d.v)));
      break;
    case "cancel": case "skip": finishOnboarding(); break;
    case "finish": finishOnboarding(); break;
    case "days": a.days = +d.v; a.mix = NFPlan.rebalanceMix(a.mix, a.days); renderOnboard(); break;
    case "mix": a.mix[d.k] = Math.max(0, Math.min(NFPlan.MAX_DAYS, a.mix[d.k] + (+d.d))); renderOnboard(); break;
    case "goal": {
      const i = a.goals.indexOf(d.v);
      if(i>=0) a.goals.splice(i, 1);
      else{
        const g = NFPlan.goalById(d.v), same = a.goals.filter(id => NFPlan.goalById(id).kind===g.kind).length;
        if(same >= NFPlan.MAX_PER_KIND){ obError("ob-err", `You can pick up to ${NFPlan.MAX_PER_KIND} ${NFPlan.KIND_LABEL[g.kind].toLowerCase()} goals. Deselect one first.`); return; }
        if(a.goals.length >= NFPlan.MAX_GOALS){ obError("ob-err", `You can pick up to ${NFPlan.MAX_GOALS} goals`); return; }
        a.goals.push(d.v);
      }
      renderOnboard(); break;
    }
    case "level": a.level = d.v; renderOnboard(); break;
    case "split":
      if(a.stmode==="own"){ a.ownSplit = d.v; if(d.v!=="custom") a.split = d.v; } else a.split = d.v;
      document.querySelectorAll('[data-do="split"]').forEach(x => x.setAttribute("aria-checked", String(x.dataset.v===d.v))); obError("ob-err", ""); break;
    case "stmode": a.stmode = d.v; document.querySelectorAll('[data-do="stmode"]').forEach(x => x.setAttribute("aria-checked", String(x.dataset.v===d.v))); obError("ob-err", ""); break;
    case "ownmode": { const day = a.own && a.own.days[+d.i]; if(day){ day.mode = d.v; renderOnboard(); } break; }
    case "ownrm": { const day = a.own && a.own.days[+d.i]; if(day){ day.ex = (day.ex||[]).filter(x => x!==d.ex); renderOnboard(); } break; }
    case "ownadd": { const day = a.own && a.own.days[+d.i]; if(day) openPicker(+d.i); break; }
    case "min": a.min = +d.v; renderOnboard(); break;
    case "next": {
      // A split only exists with strength sessions; keep the chosen one if it still fits
      if(OB.step==="level"){ if(a.mix.s>0){ if(!NFPlan.validateSplit(a.split, a.mix.s).ok || a.split==null) a.split = NFPlan.recommendSplit(a.mix.s, a.goals, a.level).split.id; } else a.split = null; }
      const r = OB.step==="owndays" || OB.step==="stmode" ? {ok:true} : OB.step==="days" ? NFPlan.validateDays(a.days)
        : OB.step==="mix" ? NFPlan.validateMix(a.mix, a.days)
        : OB.step==="goals" ? NFPlan.validateGoals(a.goals, a.mix)
        : NFPlan.validateAnswers(a);
      if(!r.ok){ obError("ob-err", r.error); return; }
      if(OB.step==="mix") a.goals = a.goals.filter(id => a.mix[NFPlan.goalById(id).kind] > 0);
      if(OB.step==="level" && a.mix.s>0){ if(!a.stmode) a.stmode = "rec"; obGo("stmode"); }
      else if(OB.step==="stmode") obGo("split");
      else if(OB.step==="split" && a.stmode==="own"){
        const sp = a.ownSplit || a.split;
        if(!a.own || a.own.split!==sp || a.own.days.length!==a.mix.s) a.own = {split:sp, days:NFPlan.ownDaysFor(sp, a.mix.s)};
        obGo("owndays");
      }
      else if(OB.step==="owndays"){
        const v = NFPlan.validateOwnDays(a.own && a.own.days, a.mix.s);
        if(!v.ok){ obError("ob-err", v.error); return; }
        const keys = NFPlan.ownDayKeys(a.own.days);
        const spName = a.own.split==="custom" ? "Custom split" : ((NFPlan.splitById(a.own.split)||{}).name || "") + " (your own)";
        OB.plans = NFPlan.suggestPlans(a).map(p => NFPlan.applyOwnDays(p, keys, spName)); obGo("plans");
      }
      else if(OB.step==="level" || OB.step==="split"){ OB.plans = NFPlan.suggestPlans(a); obGo("plans"); }
      else obGo({days:"mix", mix:"goals", goals:"level"}[OB.step]);
      break;
    }
    case "choose": {
      const p = OB.plans[+d.i];
      if(a.stmode==="own" && a.own && a.mix.s>0){
        const keys = NFPlan.ownDayKeys(a.own.days);
        S.settings.ownW = S.settings.ownW || {};
        a.own.days.forEach((x, i) => { if(x.mode==="own") S.settings.ownW[keys[i].workout] = {name:keys[i].title, ex:(x.ex||[]).slice()}; });
        registerOwn();
      }
      S.settings.plan = Object.assign({chosen:Date.now()}, p);
      S.settings.answers = clone(a); S.settings.goal = p.days;
      save(); obGo(OB.mode==="edit" ? "done" : "history"); break;
    }
    case "forgot":
      sheet(`<h3>Forgot your password?</h3><p class="muted">Your account only exists on this phone, so the password can't be reset by email. You can create a new profile instead: your training history stays, only name, email and password are replaced.</p>
        <button class="secondary danger" data-act="ob" data-do="reset">Create a new profile</button><button class="secondary" data-act="closesheet">Cancel</button>`);
      break;
    case "reset": S.settings.profile = null; S.settings.locked = false; save(); startOnboarding("signup", "new"); break;
    case "lock": S.settings.locked = true; save(); closeSheet(); OB.step = "login"; screen = "onboard"; render(); window.scrollTo(0,0); break;
    case "pwsheet":
      sheet(`<h3>Change password</h3><form id="ob-form" class="ob" data-form="pwchange" novalidate style="min-height:0;padding:0">
        <input type="email" name="username" autocomplete="username" value="${esc((S.settings.profile||{}).email||"")}" hidden>
        <label class="f" for="pw-cur">Current password</label><input class="inp" id="pw-cur" name="current" type="password" autocomplete="current-password" maxlength="128">${errEl("pw-cur-err")}
        <label class="f" for="pw-new">New password</label><input class="inp" id="pw-new" name="password" type="password" autocomplete="new-password" maxlength="128">
        <p class="ob-hint">At least 8 characters, with a letter and a number.</p>${errEl("pw-new-err")}
        <div class="foot"><button class="primary" type="submit">Save password</button><button type="button" class="secondary" data-act="closesheet">Cancel</button></div></form>`);
      break;
  }
}
document.addEventListener("submit", ev => { const f = ev.target; if(f && f.id==="ob-form"){ ev.preventDefault(); obSubmit(f); } if(f && f.id==="cx-form"){ ev.preventDefault(); libCreate(f); } });
document.addEventListener("input", ev => { const t = ev.target; if(t && t.closest && t.closest("#ob-form") && t.getAttribute("aria-invalid")==="true") obError(t.id + "-err", ""); });

/* Plan card on the home screen */
function planCardHtml(){
  const p = S.settings.plan;
  if(!p || !Array.isArray(p.sessions)) return `<section class="card plancard"><b>Get your personal plan</b><p class="small muted" style="margin:0">Answer four quick questions and NOVAFit suggests a training week that fits your goals.</p><button class="secondary" data-act="ob" data-do="edit">Create my plan</button></section>`;
  const now = Date.now(), ws = mondayOf(now), today = NFPlan.weekdayIndex(now);
  const done = new Set(S.history.filter(e => e.start>=ws && e.start<ws+WEEK).map(e => NFPlan.weekdayIndex(e.start)));
  const wk = NFPlan.DAY_NAMES.map((n,i) => { const s = p.sessions.find(x => x.day===i);
    return `<button class="wkd ${s?"k-"+s.kind:"pr-rest"}${i===today?" today":""}${done.has(i)?" done":""}" data-act="planday" data-d="${i}" aria-label="${n}: ${s?esc(s.title):"Rest day"}${done.has(i)?", done":""}"><small>${n}</small><i aria-hidden="true">${done.has(i)?"✓":s?KICON[s.kind]:"·"}</i></button>`; }).join("");
  const td = NFPlan.sessionOn(p, now);
  let nx = td && !done.has(today) ? Object.assign({inDays:0}, td) : NFPlan.nextSession(p, now + 864e5);
  if(nx && !(td && !done.has(today))) nx.inDays += 1;
  const when = !nx ? "" : nx.inDays===0 ? "Today" : nx.inDays===1 ? "Tomorrow" : WDAY[(nx.day+1)%7];
  return `<section class="card plancard"><div class="pnext"><div><small>${esc(p.name)} · ${p.days} sessions a week${p.split ? " · " + esc(p.split.name) : ""}</small><b>${when}: ${esc(nx ? nx.title : "")}</b><small>${nx ? nx.min + " min" : ""}${nx && nx.addon && MOB[nx.addon.id] ? ` + ${esc(MOB[nx.addon.id].n.toLowerCase())} ${stepsMin(MOB[nx.addon.id].steps)} min` : ""}</small></div>${nx && nx.inDays===0 ? `<button class="primary" data-act="start" data-t="${esc(nx.workout)}">Start</button>` : ""}</div>
    <div class="wk">${wk}</div><button class="addset" data-act="ob" data-do="edit">Change plan ›</button></section>`;
}

/* Account section in settings */
function accountHtml(){
  const p = S.settings.profile; if(!p) return "";
  return `<div class="card" style="background:var(--bg);border:0"><span class="lbl">Account</span>
    <p style="margin:0"><b>${esc(p.name)}</b><br><span class="small muted">${esc(p.email)} · saved on this phone only</span></p>
    ${S.settings.body ? `<p class="small muted" style="margin:0">${esc(SEX_TXT[S.settings.body.sex]||"")} · ${esc(S.settings.body.age)} years${num(S.settings.bodyKg)>0 ? " · " + fmt(num(S.settings.bodyKg)) + " kg" : ""}${S.settings.body.cm ? " · " + esc(S.settings.body.cm) + " cm" : ""}</p>` : ""}
    <p class="small muted" style="margin:0">Plan: ${esc((S.settings.plan||{}).name || "none yet")}</p>
    <div class="row2"><button class="secondary" data-act="ob" data-do="edit">Edit profile and plan</button><button class="secondary" data-act="ob" data-do="pwsheet">Change password</button></div>
    <button class="secondary" data-act="ob" data-do="lock">Lock app</button></div>`;
}

function render(){
  if(needsOnboarding() && screen!=="onboard"){ screen = "onboard"; OB.step = S.settings.profile ? "login" : (OB.step==="restore" || OB.step==="signup" ? "signup" : "welcome"); }
  else if(screen==="onboard" && S.settings.locked && S.settings.profile) OB.step = "login";
  $("#app").className = screen==="onboard" ? "ob" : "app";
  if(screen==="onboard"){ renderOnboard(); return; }
  if(screen==="session" && !S.active) screen = "home";
  if(screen==="summary" && !summary) screen = "home";
  if(screen==="home") renderHome(); else if(screen==="me") renderMe(); else if(screen==="session") renderSession(); else if(screen==="runplan") renderPlan(); else renderSummary();
  updateBadge();
  keepAwake(screen==="session" && !!S.active);
}

document.addEventListener("click", async ev => {
  const b = ev.target.closest("[data-act]"); if(!b) return;
  const act = b.dataset.act;
  if(act==="scrim"){ if(ev.target===b) closeSheet(); return; }
  switch(act){
    case "start": {
      const t = b.dataset.t;
      if(S.active){
        if(S.active.type===t){ screen = "session"; render(); return; }
        sheet(`<h3>A session is already running</h3><p class="muted">${W[S.active.type].name} is still open. Finish or discard it first.</p>
          <button class="primary" data-act="resume">Continue ${W[S.active.type].name}</button><button class="secondary danger" data-act="discard">Discard</button>`);
        return;
      }
      if(t==="yoga"){ yogaSheet(); break; }
      if(t==="lauf"){ runSheet(); break; }
      closeSheet(); startSession(t); break;
    }
    case "resume": closeSheet(); screen = "session"; render(); window.scrollTo(0,0); break;
    case "home": closeSheet(); screen = "home"; summary = null; render(); window.scrollTo(0,0); break;
    case "tick": {
      tick(b.dataset.ex, +b.dataset.i); updProg();
      // last set of an exercise ticked → fold it into one line shortly after
      const id = b.dataset.ex, a = S.active;
      if(allDone(id) && !(a.unfold||{})[id]) setTimeout(() => { if(screen==="session" && S.active===a && allDone(id)) renderSession(); }, 700);
      break;
    }
    case "rmset": { const arr = S.active.sets[b.dataset.ex]; if(arr && +b.dataset.i < arr.length){ arr.splice(+b.dataset.i, 1); rest = null; save(); renderSession(); } break; }
    case "addset": { const ex = EXN[b.dataset.ex], arr = (S.active.sets[ex.id] = S.active.sets[ex.id]||[]); arr.push(prefill(ex.id, arr.length, arr[arr.length-1])); save(); renderSession(); break; }
    case "openopt": { const base = exIn(S.active.type, b.dataset.ex), x = eff(base); S.active.open[base.id] = true; if(!S.active.sets[x.id]) S.active.sets[x.id] = prefilledSets(x); save(); renderSession(); break; }
    case "closeopt": { const base = exIn(S.active.type, b.dataset.ex), x = eff(base); S.active.open[base.id] = false; delete S.active.sets[x.id]; if(S.active.swap) delete S.active.swap[base.id]; save(); renderSession(); break; }
    case "opentread": S.active.tread = {min:"", km:"", incline:""}; save(); renderSession(); break;
    case "closetread": S.active.tread = null; save(); renderSession(); break;
    case "runout": case "runband": closeSheet(); if(S.active){ if(S.active.type==="lauf"){ screen = "session"; render(); } else toast("Finish your open session first."); break; } startSession("lauf", b.dataset.act==="runband" ? "band" : "out"); break;
    case "runplan": closeSheet(); PLW = S.settings.runPlan ? null : {step:1}; planAll = false; screen = "runplan"; render(); window.scrollTo(0,0); break;
    case "plgoal": PLW = plwDefaults(b.dataset.g); render(); window.scrollTo(0,0); break;
    case "plback": PLW = {step:1}; render(); break;
    case "plper": PLW.perWeek = +b.dataset.n; PLW.days = PLW.days.slice(0, PLW.perWeek); if(PLW.days.length < PLW.perWeek) PLW.days.push([2,0,4,1].find(d => !PLW.days.includes(d))); render(); break;
    case "plday": { const d = +b.dataset.d, i = PLW.days.indexOf(d); if(i>=0){ if(PLW.days.length>1) PLW.days.splice(i, 1); } else { PLW.days.push(d); if(PLW.days.length > PLW.perWeek) PLW.days.shift(); } render(); break; }
    case "plcreate": {
      const w = PLW, tgt = parseMin(w.target), dt = w.date ? new Date(w.date + "T20:00").getTime() : 0;
      if((w.goal==="k10" || w.goal==="alster") && !(tgt>0)){ toast("Enter your target time."); break; }
      if((w.goal==="k10" || w.goal==="hm") && !(dt > Date.now() + 2*WEEK)){ toast("Choose a race day at least 3 weeks away."); break; }
      if(w.days.length < w.perWeek){ toast(`Choose ${w.perWeek} running days.`); break; }
      S.settings.runPlan = {goal:w.goal, target:tgt||0, date:w.goal==="fit" ? 0 : (dt || (w.goal==="alster" ? Date.now() + 8*WEEK : 0)), perWeek:w.perWeek, days:w.days.slice(), created:Date.now()};
      PLW = null; save(); render(); window.scrollTo(0,0); toast("Your running plan is ready"); break;
    }
    case "planedit": { const p = S.settings.runPlan; PLW = Object.assign(plwDefaults(p.goal), {target:p.target ? hms(p.target) : "", perWeek:p.perWeek, days:p.days.slice()}); if(p.date){ const d = new Date(p.date); PLW.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; } render(); window.scrollTo(0,0); break; }
    case "planend": sheet(`<h3>End plan?</h3><p class="muted">Your runs stay saved. You can set a new goal any time.</p><button class="primary run" data-act="planendok">End plan</button><button class="secondary" data-act="closesheet">Cancel</button>`); break;
    case "planendok": delete S.settings.runPlan; PLW = null; save(); closeSheet(); screen = "home"; render(); break;
    case "planall": planAll = !planAll; render(); break;
    case "shotuse": shotUse(); break;
    case "strava": stravaSheet(); break;
    case "stadd": stravaAddSel(); break;
    case "stoff": stravaOff(); break;
    case "impsheet": impSheet(); break;
    case "near": NEAR.err = ""; nearSheet(); break;
    case "nearloc": nearLocate(); break;
    case "nearkm": NEAR.km = +b.dataset.k; NEAR.err = ""; nearSheet(); break;
    case "nearloop": nearLoop(b.dataset.seed==="next", b.dataset.home==="1" || (NEAR.loop && NEAR.loop.home && b.dataset.seed==="next")); break;
    case "nearstart": nearStart(b.dataset.id); break;
    case "histstrava": impStrava(); break;
    case "histrange": if(HI){ HI.range = b.dataset.v; impPreview(); } break;
    case "histunit": if(HI){ HI.miles = b.dataset.v==="mi"; impPreview(); } break;
    case "histwalks": if(HI){ HI.walks = b.checked; impPreview(); } break;
    case "histadd": impAdd(); break;
    case "histundo": impUndo(); break;
    case "histback": HI = null; if(screen==="onboard") closeSheet(); else impSheet(); break;
    case "stauto": { const t = stGet(); if(t){ t.auto = b.dataset.v==="1"; stSet(t); } settingsSheet(); break; }
    case "shotcancel": shotDrop(); closeSheet(); break;
    case "kmalster": { const k = $("#run-km"); S.active.run.km = fmt(alsterKm()); if(k){ k.value = S.active.run.km; k.dispatchEvent(new Event("input", {bubbles:true})); } save(); break; }
    case "runedit": S.active.run.edit = true; save(); renderSession(); setTimeout(() => { const k = $("#run-km"); if(k) k.focus(); }, 50); break;
    case "mode": {
      const r = S.active.run, m = b.dataset.m; if(r.mode===m && !(m==="alster" && r.edit)) return;
      if(m==="alster"){ r.km = fmt(alsterKm(), 2); r.edit = false; }
      if(m==="band" && Math.abs(num(r.km)-alsterKm())<.01) r.km = "";
      r.mode = m; save(); renderSession(); break;
    }
    case "skiprest": rest = null; updateBottom(); break;
    case "finish": {
      const e = buildEntry(), pend = pendingCount(), w = W[S.active.type];
      if(w.kind==="run"){
        if(!(parseMin(S.active.run.min)>0)){ const f = $("#run-min"); if(f){ f.focus(); const l = f.closest(".runtime"); l.classList.remove("shake"); void l.offsetWidth; l.classList.add("shake"); } toast("Enter your time 🙂"); return; }
        finishSession(); return;
      }
      if(pend>0){
        // Safer default: the big button saves only what was ticked; saving untouched sets needs a deliberate second choice
        const done = Object.values(S.active.sets||{}).reduce((n, a) => n + a.filter(isDone).length, 0), list = pendingList();
        sheet(`<h3>${pend} ${pend===1?"set isn't":"sets aren't"} ticked off</h3><p class="muted">${esc(list.slice(0,3).join(", "))}${list.length>3?" and more":""}. ${pend===1?"It still shows":"They still show"} last time's numbers.</p>
          ${done ? `<button class="primary" data-act="finishok">Save the ${done} ${done===1?"set":"sets"} I did</button>` : ""}
          <button class="${done ? "secondary" : "primary"}" data-act="finishall">I did ${done ? `all ${done+pend}` : (pend===1 ? "it" : `all ${pend}`)}, save ${done ? "them all" : (pend===1 ? "it" : "them")}</button>
          <button class="secondary" data-act="closesheet">Keep training</button>`);
        return;
      }
      if(!e.sets && !e.run && !e.tread && !e.yoga){ finishSession(); return; }
      sheet(`<h3>Finish session?</h3><p class="muted">Your numbers are saved and shown as targets for your next ${W[S.active.type].name}.</p>
        <button class="primary ${kc(S.active.type)}" data-act="finishok">Finish and save</button><button class="secondary" data-act="closesheet">Keep training</button>`);
      break;
    }
    case "finishok": finishSession(false); break;
    case "finishall": finishSession(true); break;
    case "discard": sheet(`<h3>Discard session?</h3><p class="muted">Everything you logged in this session will be deleted.</p>
        <button class="secondary danger" data-act="discardok">Yes, discard</button><button class="secondary" data-act="closesheet">Cancel</button>`); break;
    case "sessopts": {
      const w = W[S.active.type];
      sheet(`<h3>Reset ${esc(w.kind==="run" && S.active.run && S.active.run.mode==="band" ? "treadmill run" : w.name)}?</h3>
        <p class="muted">Start over clears everything you've logged in this session and restarts the clock. Delete removes the session completely, nothing is saved.</p>
        <button class="secondary" data-act="restartok">⟲ Start over</button>
        <button class="secondary danger" data-act="discardok">🗑 Delete session</button>
        <button class="secondary" data-act="closesheet">Cancel</button>`);
      break;
    }
    case "restartok": {
      const t = S.active.type, mode = S.active.run && S.active.run.mode==="band" ? "band" : "out";
      S.active = null; rest = null; closeSheet(); startSession(t, mode); toast("Started over"); break;
    }
    case "discardok": S.active = null; rest = null; screen = "home"; save(); closeSheet(); render(); break;
    case "closesheet": closeSheet(); if(screen==="home") renderHome(); break;
    case "hist": histSheet(b.dataset.id); break;
    case "delask": sheet(`<h3>Delete session?</h3><p class="muted">It will be removed from your history and stats.</p>
        <button class="secondary danger" data-act="delok" data-id="${b.dataset.id}">Delete</button><button class="secondary" data-act="closesheet">Cancel</button>`); break;
    case "delok": S.history = S.history.filter(x => x.id!==b.dataset.id); save(); closeSheet(); renderHome(); break;
    case "settings": settingsSheet(""); break;
    case "menu": closeSheet(); screen = screen==="me" ? "home" : "me"; render(); window.scrollTo(0,0); break;
    case "tab": { closeSheet(); TAB = ["today","train","progress"].includes(b.dataset.t) ? b.dataset.t : "today"; try{ sessionStorage.setItem("nf-tab", TAB); }catch(e){} screen = "home"; render(); window.scrollTo(0,0); break; }
    case "setp": settingsSheet(b.dataset.p); break;
    case "ob": obAct(b); break;
    case "menutheme": closeSheet(); S.settings.theme = isDark() ? "light" : "dark"; applyTheme(); save(); render(); break;
    case "goto": {
      closeSheet();
      // calendar, badges and reviews live on the Progress tab
      if(!document.getElementById(b.dataset.id)){ TAB = "progress"; try{ sessionStorage.setItem("nf-tab", TAB); }catch(e){} screen = "home"; render(); }
      const el = document.getElementById(b.dataset.id); if(el) el.scrollIntoView({behavior:smoothOk() ? "smooth" : "auto", block:"start"}); break;
    }
    case "herostep": if(HERO_STEP) HERO_STEP(+b.dataset.d); break;
    case "totop": window.scrollTo({top:0, behavior:smoothOk() ? "smooth" : "auto"}); break;
    case "swap": swapSheet(b.dataset.base); break;
    case "move": moveEx(b.dataset.base, +b.dataset.d); break;
    case "doswap": doSwap(b.dataset.base, b.dataset.id); break;
    case "chart": chartSheet(b.dataset.id); break;
    case "runchart": runChartSheet(b.dataset.k); break;
    case "badge": badgeSheet(b.dataset.id); break;
    case "cal": calOff = Math.min(0, calOff + (+b.dataset.d)); { const c = $("#calcard"); if(c) c.innerHTML = calendarHtml(); } break;
    case "calday": daySheet(b.dataset.k); break;
    case "week": if(b.dataset.seen){ S.settings.weekSeen = +b.dataset.seen; save(); renderHome(); } closeSheet(); openWeek(+b.dataset.ws); break;
    case "recap": if(b.dataset.seen){ S.settings.recapSeen = b.dataset.seen; save(); renderHome(); } closeSheet(); if(STORY) closeStory(); openMonth(+b.dataset.y, +b.dataset.m); break;
    case "rungoals": runGoalsSheet(); break;
    case "wxhere": wxLocate(true); break;
    case "wxhome": S.settings.wxGeo = false; save(); wxSeg(); wxLoad(); wxPaint(); toast(`Weather is for ${NFRun.WX_HOME.place} now.`); break;
    case "rungoalsave": {
      const g = parseMin($("#g-al").value), k = num($("#g-km").value), lp = NFRun.validateLoop($("#g-ln").value, $("#g-lk").value);
      [["g-ln", lp.err.name], ["g-lk", lp.err.km]].forEach(([id, m]) => { $("#"+id+"-err").textContent = m||""; $("#"+id).setAttribute("aria-invalid", m?"true":"false"); });
      if(!lp.ok){ $(lp.err.name ? "#g-ln" : "#g-lk").focus(); break; }
      S.settings.loopName = lp.name; S.settings.loopKm = lp.km;
      if(g>0) S.settings.alsterGoal = g; if(k>0) S.settings.kmGoal = k;
      save(); closeSheet(); renderHome(); break;
    }
    case "warmup": startWarmup(); break;
    case "yogago": primeVoice(); startYoga(); break;
    case "calmpick": { const v = +b.dataset.v, c = CALM; if(!c || !NFYoga.validTension(v)) break; CALM = null; closeSheet(); if(c.stage==="before") primeVoice(); c.cb(v); break; }
    case "calmskip": { const c = CALM; CALM = null; closeSheet(); if(c) c.cb(null); break; }
    case "calmoff": { const c = CALM; CALM = null; S.settings.calmCheck = false; save(); closeSheet(); toast("Okay, no more questions. You can turn it back on on the yoga screen."); if(c) c.cb(null); break; }
    case "calmtoggle": S.settings.calmCheck = !calmOn(); save(); renderSession(); break;
    case "yogalevel": S.settings.yogaLevel = b.dataset.v==="known" ? "known" : "new"; save(); renderSession(); break;
    case "yogavoice": S.settings.yogaVoice = !yVoice(); save(); if(S.settings.yogaVoice){ primeVoice(); say("Voice on. I'll read each pose."); } renderSession(); break;
    case "tmvoice": if(TM){ S.settings.yogaVoice = !yVoice(); save(); TM.spokenI = -1; if(!S.settings.yogaVoice) try{ speechSynthesis.cancel(); }catch(e){} drawTimer(); } break;
    case "flexcheck": flexSheet(); break;
    case "flexpick": flexSave(+b.dataset.v); break;
    case "yogapick": { const id = b.dataset.id; if(!NFYoga.byId(id)) break; S.active.yoga.sid = id; S.settings.yogaSid = id; save(); renderSession(); window.scrollTo({top:0, behavior:"smooth"}); break; }
    case "study": closeSheet(); primeVoice(); startStudyBreak(); break;
    case "warmskip": S.active.warm = true; save(); renderSession(); break;
    case "interval": intervalSheet(b.dataset.target); break;
    case "ivgo": startIntervals(b.dataset.target); break;
    case "tmpause": if(TM){ try{ canSpeak() && speechSynthesis.cancel(); }catch(e){} if(TM.paused){ TM.end = Date.now() + TM.left; TM.paused = false; try{ TM.ac && TM.ac.resume(); }catch(e){} } else { TM.left = TM.end - Date.now(); TM.paused = true; try{ TM.mus && TM.ac && TM.ac.suspend(); }catch(e){} } drawTimer(); } break;
    case "tmmusic": if(TM){ S.settings.yogaMusic = S.settings.yogaMusic===false; save(); if(S.settings.yogaMusic===false) medStop(false); else { try{ TM.ac && TM.ac.resume(); }catch(e){} medStart(); } drawTimer(); } break;
    case "tmskip": if(TM){ TM.end = Date.now(); if(TM.paused){ TM.paused = false; } tickTimer(); } break;
    case "tmstop": finishTimer(false); break;
    case "pushon": enablePush(); break;
    case "hidepush": S.settings.hidePush = true; save(); renderHome(); break;
    case "hideinstall": S.settings.hideInstall = true; save(); renderHome(); break;
    case "themetoggle": S.settings.theme = isDark() ? "light" : "dark"; applyTheme(); save(); renderHome(); break;
    case "theme": S.settings.theme = b.dataset.v; applyTheme(); save();
      document.querySelectorAll("#themeseg button").forEach(x => x.setAttribute("aria-pressed", x.dataset.v===S.settings.theme)); break;
    case "yogaflow": closeSheet(); startSession("yoga"); break;
    case "yogalen": { const sid = ySid(), m = +b.dataset.m; if(sid==="vinyasa") S.settings.yogaLen = m; else S.settings.yogaLens = Object.assign({}, S.settings.yogaLens, {[sid]:m}); save(); renderSession(); break; }
    case "mobility": closeSheet(); startMobility(); break;
    case "mob": closeSheet(); startMobility(b.dataset.id); break;
    case "workouts": workoutsSheet(); break;
    case "library": openLibrary("browse"); break;
    case "addex": openLibrary("add"); break;
    case "libfilter": LIB[b.dataset.k] = b.dataset.v; document.querySelectorAll(`[data-act="libfilter"][data-k="${b.dataset.k}"]`).forEach(x => x.setAttribute("aria-pressed", String(x.dataset.v===b.dataset.v))); { const l = $("#liblist"); if(l) l.innerHTML = libListHtml(); } break;
    case "libadd": if(b.getAttribute("aria-disabled")!=="true") libAdd(b.dataset.ex); break;
    case "libnew": libNewSheet(); break;
    case "libback": libSheet(); break;
    case "libguide": guideSheet(b.dataset.ex, true); break;
    case "libpick": {
      const id = b.dataset.ex, sel = LIB.sel = LIB.sel || [], i = sel.indexOf(id);
      if(i>=0) sel.splice(i, 1);
      else if(sel.length >= NFPlan.OWN_MAX_EX){ toast(`Up to ${NFPlan.OWN_MAX_EX} exercises per day`); break; }
      else sel.push(id);
      const on = sel.includes(id), row = b.closest(".librow2");
      b.setAttribute("aria-pressed", String(on)); if(row) row.classList.toggle("on", on);
      const ck = b.querySelector(".lr-ck"); if(ck) ck.innerHTML = on ? CK_ICO : "";
      const done = $("#libdone"); if(done) done.textContent = pickLabel();
      break;
    }
    case "libpickdone": {
      const day = OB.a && OB.a.own && OB.a.own.days[LIB.day];
      if(day) day.ex = (LIB.sel||[]).slice();
      closeSheet(); if(screen==="onboard") renderOnboard(); break;
    }
    case "planday": planDaySheet(+b.dataset.d); break;
    case "rmex": {
      const a = S.active, id = b.dataset.base, added = !!b.dataset.added, xid = added ? id : eff(exIn(a.type, id)).id;
      if((a.sets[xid]||[]).some(isDone)) sheet(`<h3>Remove ${esc(EXN[xid] ? EXN[xid].n : "exercise")}?</h3><p class="muted">The sets you already checked off for it won't be saved.</p>
        <button class="secondary danger" data-act="rmexok" data-base="${esc(id)}" data-added="${added?1:""}">Remove</button><button class="secondary" data-act="closesheet">Keep it</button>`);
      else removeEx(id, added);
      break;
    }
    case "rmexok": removeEx(b.dataset.base, !!b.dataset.added); break;
    case "guide": guideSheet(b.dataset.ex); break;
    case "exmenu": exMenu(b.dataset); break;
    case "exunfold": S.active.unfold = Object.assign(S.active.unfold||{}, {[b.dataset.ex]:true}); save(); renderSession(); break;
    case "exm": {
      // run the same action the old buttons under each card did
      const go = b.dataset.go, f = document.createElement("button");
      Object.keys(b.dataset).forEach(k => { if(k!=="go" && k!=="act") f.dataset[k] = b.dataset[k]; });
      f.dataset.act = go; f.hidden = true; closeSheet();
      if(go!=="guide" && go!=="swap") { document.body.appendChild(f); f.click(); f.remove(); }
      else setTimeout(() => { document.body.appendChild(f); f.click(); f.remove(); }, 0);
      break;
    }
    case "applyup": { const id = b.dataset.ex, kg = +b.dataset.kg; (S.active && S.active.sets[id]||[]).forEach(x => { if(!isDone(x)) x.kg = fmt(kg); }); save(); renderSession(); toast(`${fmt(kg)} kg entered. You've got this!`); break; }
    case "share": doShare(); break;
    case "year": closeSheet(); if(b.dataset.seen) { S.settings.yearSeen = +b.dataset.seen; save(); } openYear(+b.dataset.y); break;
    case "storymute": S.settings.storyMute = !S.settings.storyMute; save(); if(MUS && MUS.ctx.state==="suspended") MUS.ctx.resume().catch(() => {}); musicVol();
      b.textContent = S.settings.storyMute ? "🔇" : "🔊"; b.setAttribute("aria-label", S.settings.storyMute ? "Music on" : "Music off"); break;
    case "phadd": $("#phfile").click(); break;
    case "phdel": { const id = b.dataset.id; await photoTx(st => st.delete(id)).catch(() => {}); photosReset(); paintPhotos(); break; }
    case "nrcpaste": nrcPaste(); break;
    case "nrchelp": nrcHelp(); break;
    case "nrcuse": { const r = parseRunText($("#nrctext").value); if(!r){ toast("No run found in that text."); break; } closeSheet(); applyRun(r); break; }
    case "storyclose": closeStory(); render(); break;
    case "restsound": S.settings.restSound = b.dataset.v==="1"; save(); if(b.dataset.v==="1"){ restAudio(); restBeep(); }
      document.querySelectorAll("#restsoundseg button").forEach(x => x.setAttribute("aria-pressed", x.dataset.v===b.dataset.v)); break;
    case "kcalshow": S.settings.showKcal = b.dataset.v==="1"; save();
      document.querySelectorAll("#kcalseg button").forEach(x => x.setAttribute("aria-pressed", x.dataset.v===b.dataset.v)); break;
    case "goal": { S.settings.goal = Math.min(7, Math.max(1, S.settings.goal + (+b.dataset.d))); $("#goalv").textContent = S.settings.goal; save(); break; }
    case "day": {
      const i = +b.dataset.i, d = S.settings.remDays;
      S.settings.remDays = d.includes(i) ? d.filter(x => x!==i) : [...d, i];
      b.setAttribute("aria-pressed", S.settings.remDays.includes(i)); save(); break;
    }
    case "ics": {
      if(!S.settings.remDays.length){ toast("Choose at least one day."); return; }
      const r = await offerFile("training-reminders.ics", icsText(), "text/calendar");
      if(r==="ext") toast("Calendar reminders work in the installed app.");
      else if(r==="ok") toast("Open the file and tap “Add”.");
      break;
    }
    case "export": {
      const r = await offerFile(`novafit-backup-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(S), "application/json");
      if(r==="ok") toast("Backup created."); else if(r==="fail") toast("Backup didn't work.");
      break;
    }
    case "import": $("#importf").click(); break;
  }
});
document.addEventListener("change", ev => {
  if(ev.target.id==="phfile"){ const fs = ev.target.files; if(fs && fs.length) addPhotos(fs).then(() => { ev.target.value = ""; }); return; }
  if(ev.target.id!=="importf" || !ev.target.files[0]) return;
  const f = ev.target.files[0], rd = new FileReader();
  rd.onload = () => {
    try{
      const d = JSON.parse(rd.result);
      if(!d || !Array.isArray(d.history)) throw 0;
      S = merge(S, d); addCustomToEXN(); registerOwn(); checkBadges(true); save(); applyTheme(); closeSheet(); screen = "home"; render(); toast(`${d.history.length} sessions loaded.`);
    }catch(e){ toast("That's not a valid backup."); }
  };
  rd.readAsText(f);
});
/* Texterkennung schon beim Antippen laden, während die Fotoauswahl offen ist */
document.addEventListener("pointerdown", ev => { if(ev.target.closest && ev.target.closest(".shotcta") && navigator.onLine!==false) ocrWorker().catch(() => {}); });
document.addEventListener("change", ev => { if(ev.target.id==="runshot"){ const f = ev.target.files && ev.target.files[0]; ev.target.value = ""; runShot(f); } });
document.addEventListener("change", ev => { if(ev.target.classList && ev.target.classList.contains("histin")){ const f = [...(ev.target.files||[])]; ev.target.value = ""; impFiles(f); } });
document.addEventListener("change", ev => { if(ev.target.id==="runfile"){ const f = ev.target.files && ev.target.files[0]; ev.target.value = ""; runFile(f); } });
document.addEventListener("input", ev => {
  const t = ev.target, k = t.dataset.in; if(!k) return;
  if(k==="libq"){ LIB.q = t.value; const l = $("#liblist"); if(l) l.innerHTML = libListHtml(); return; }
  if(k==="ownname"){ const day = OB.a && OB.a.own && OB.a.own.days[+t.dataset.i]; if(day) day.name = t.value; return; }
  if(k==="name"){ S.settings.name = t.value; save(); return; }
  if(k==="bodykg"){ S.settings.bodyKg = t.value.trim(); save(); return; }
  if(k==="bodycm"){ const cm = Math.round(num(t.value)); S.settings.body = S.settings.body || {};
    if(cm>=NFPlan.MIN_CM && cm<=NFPlan.MAX_CM) S.settings.body.cm = cm; else delete S.settings.body.cm; save(); return; }
  if(k==="time"){ S.settings.remTime = t.value || "18:00"; save(); return; }
  if(k==="plw"){ if(t.dataset.f==="target"){ const f = fmtTimeDigits(t.value); if(f!==t.value) t.value = f; } PLW[t.dataset.f] = t.value; if(t.type==="date") render(); return; }
  if(k==="shot"){ if(t.id==="sh-time"){ const f = fmtTimeDigits(t.value); if(f!==t.value) t.value = f; } t.setAttribute("aria-invalid", "false"); const e = t.closest("div").parentNode.querySelector(".err"); if(e) e.textContent = ""; return; }
  if(!S.active) return;
  if(k==="set"){
    const s = S.active.sets[t.dataset.ex][+t.dataset.i]; s[t.dataset.f] = t.value;
    s.ok = filled(s);
    const row = t.closest(".setrow"); row.classList.toggle("done", s.ok); row.classList.remove("pre", "shake");
  }else if(k==="run"){
    if(t.id==="run-min"){ const f = fmtTimeDigits(t.value); if(f!==t.value) t.value = f; }
    S.active.run[t.dataset.f] = t.value;
    const inf = runInfoHtml(), el = $("#runinfo"), wn = $("#runwin"); if(el) el.textContent = inf.line; if(wn && wn.innerHTML!==inf.win) wn.innerHTML = inf.win;
  }else if(k==="tread"){ S.active.tread[t.dataset.f] = t.value; }
  else if(k==="yoga"){ S.active.yoga[t.dataset.f] = t.value; }
  save();
});
document.addEventListener("input", ev => {
  if(!/^iv-/.test(ev.target.id||"")) return;
  const f = num($("#iv-f").value), sl = num($("#iv-s").value), r = num($("#iv-r").value), el = $("#iv-tot");
  if(el) el.textContent = `Duration: ${Math.round((f+sl)*r/60)} min`;
});
document.addEventListener("keydown", ev => { if(ev.key!=="Escape") return; if($("#layer").innerHTML) closeSheet(); else if(STORY){ closeStory(); render(); } });

setInterval(() => {
  document.querySelectorAll("[data-elapsed]").forEach(el => { if(S.active) el.textContent = elapsedTxt(S.active); });
  if(screen==="session") updProg();
  if(rest){
    const left = rest.end - Date.now();
    if(left<=0) restOver();
    else{ const t = $("#restT"), i = $("#restI"); if(t) t.textContent = clock(left); if(i) i.style.width = (left/rest.total*100)+"%"; }
  }
}, 500);

window.addEventListener("pagehide", () => { try{ localStorage.setItem(LS, JSON.stringify(S)); }catch(e){} if(saveTimer){ clearTimeout(saveTimer); flush(); } });


/* ================= Hell / Dunkel ================= */
const root = document.documentElement;
const hostTheme = root.getAttribute("data-theme");
let applying = false;
function isDark(){
  const t = S.settings.theme;
  if(t==="dark") return true; if(t==="light") return false;
  const h = root.getAttribute("data-theme");
  if(h==="dark") return true; if(h==="light") return false;
  return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
}
function applyTheme(){
  applying = true;
  const t = S.settings.theme;
  if(t==="dark" || t==="light") root.setAttribute("data-theme", t);
  else if(hostTheme) root.setAttribute("data-theme", hostTheme); else root.removeAttribute("data-theme");
  applying = false;
  const m = document.querySelector('meta[name="theme-color"]'); if(m) m.setAttribute("content", isDark() ? "#000000" : "#ffffff");
}
try{ new MutationObserver(() => { if(!applying && (S.settings.theme==="dark"||S.settings.theme==="light") && root.getAttribute("data-theme")!==S.settings.theme) applyTheme(); }).observe(root, {attributes:true, attributeFilter:["data-theme"]}); }catch(e){}
try{ matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { applyTheme(); if(screen==="home" && !isTyping()) renderHome(); }); }catch(e){}
/* ================= Push-Benachrichtigungen (OneSignal, nur installierte Version) ================= */
const ONESIGNAL_APP_ID = "94f5491b-178a-43d6-8176-bd21491da60d";   // OneSignal app "NOVAFit"
const inClaude = !!window.claude;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone===true;
let OS = null, push = inClaude ? "claude" : "loading";   // claude | loading | install | unsupported | off | on | denied
function pushState(){
  if(inClaude) return "claude";
  if(isIOS && !standalone) return "install";
  if(!OS) return "loading";
  try{
    if(!OS.Notifications.isPushSupported()) return "unsupported";
    if(OS.Notifications.permissionNative==="denied") return "denied";
    return OS.Notifications.permission && OS.User.PushSubscription.optedIn!==false ? "on" : "off";
  }catch(e){ return "unsupported"; }
}
function refreshPush(){ push = pushState(); document.querySelectorAll("[data-push]").forEach(el => el.innerHTML = pushHtml()); if(screen==="home" && !isTyping() && !$("#layer").innerHTML) renderHome(); }
function pushHtml(){
  switch(push){
    case "on": return `<p class="small" style="margin:0;color:var(--good)">✓ Notifications are on.</p>`;
    case "off": return `<button class="primary" data-act="pushon">Allow notifications</button>`;
    case "denied": return `<p class="small muted" style="margin:0">Notifications are blocked. You can allow them in your iPhone settings under Notifications → NOVAFit.</p>`;
    case "install": return `<p class="small muted" style="margin:0">First add the app to your home screen (Share → Add to Home Screen) and open it from there. Then you can allow notifications.</p>`;
    case "unsupported": return `<p class="small muted" style="margin:0">This device or browser doesn't support notifications.</p>`;
    case "claude": return `<p class="small muted" style="margin:0">Push notifications are available in the installed app.</p>`;
    default: return `<p class="small muted" style="margin:0">Loading…</p>`;
  }
}
function syncTags(){
  if(!OS || push!=="on") return;
  try{
    const last = S.history.length ? S.history[S.history.length-1] : null;
    const st = stats();
    OS.User.addTags({ last_workout: String(last ? Math.floor((last.end||last.start)/1000) : 0), next_name: W[st.next].name });
  }catch(e){}
}
function initPush(){
  if(inClaude || !/^https:/.test(location.href)) { refreshPush(); return; }
  if(isIOS && !standalone){ refreshPush(); return; }
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(async function(OneSignal){
    try{
      await OneSignal.init({ appId: ONESIGNAL_APP_ID, serviceWorkerPath: "OneSignalSDKWorker.js", serviceWorkerParam: { scope: "/" } });
      OS = OneSignal;
      OneSignal.Notifications.addEventListener("permissionChange", () => { refreshPush(); syncTags(); });
      OneSignal.User.PushSubscription.addEventListener("change", () => { refreshPush(); syncTags(); });
    }catch(e){ OS = null; push = "unsupported"; }
    refreshPush(); syncTags();
  });
  const sc = document.createElement("script"); sc.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"; sc.defer = true;
  sc.onerror = () => { push = "unsupported"; refreshPush(); };
  document.head.appendChild(sc);
}
async function enablePush(){
  if(!OS) return;
  try{
    await OS.Notifications.requestPermission();
    if(OS.Notifications.permission){ try{ await OS.User.PushSubscription.optIn(); }catch(e){} }
  }catch(e){}
  refreshPush(); syncTags();
  if(push==="on") toast("Notifications are on.");
}

/* Direktlinks aus Push-Nachrichten: #woche öffnet den Wochenrückblick, #yoga startet Yoga, #studybreak die Lernpause */
function handleHash(){
  const h = location.hash.replace("#","");
  if(!h) return;
  try{ history.replaceState(null, "", location.pathname + location.search); }catch(e){}
  if(h==="woche"){ screen = "home"; render(); openWeek(defaultWeek()); }
  else if(h==="monat"){ screen = "home"; render(); const [y, m] = monthRef(); openMonth(y, m); }
  else if(h==="yoga" && !S.active){ screen = "home"; render(); yogaSheet(); }
  else if(h==="studybreak" && !TM){ screen = S.active ? "session" : "home"; render(); startStudyBreak(); }
  else if(W[h] && Object.prototype.hasOwnProperty.call(W, h)){
    if(S.active){ screen = "session"; render(); }
    else startSession(h);
  }
}
window.addEventListener("hashchange", handleHash);
setTimeout(handleHash, 0);
// Strava: Rückkehr von der Anmeldung, sonst neue Läufe holen; beim Zurückkehren in die App erneut
stConfig().then(async c => { if(await stReturn()) return; if(c) stravaSync(false); });
document.addEventListener("visibilitychange", () => { if(document.visibilityState==="visible" && STRAVA_CFG) stravaSync(false); });
// Older versions: "Glute Day" is now "Lower Body" with new exercises
(function migrate(){
  const pl = S.settings.plan; let ch = false;
  if(pl && Array.isArray(pl.sessions)) pl.sessions.forEach(s => { if(s.title==="Glute Day"){ s.title = "Lower Body"; ch = true; } });
  const o = S.settings.order; if(o && o.po && !o.po.includes("squat")){ delete o.po; ch = true; }
  if(ch) save();
})();
if(!S.badges) checkBadges(true);
applyTheme();
render();
initCloud();
initPush();
if("serviceWorker" in navigator && !window.claude && /^https:|^http:\/\/localhost/.test(location.href)){
  navigator.serviceWorker.register("OneSignalSDKWorker.js", {scope:"/"}).catch(() => {});
}
