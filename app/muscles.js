/* NOVAFit · muscles
   Which muscles a set of sessions trained and how much, and the headline for the
   muscle slide in the weekly and monthly reviews.
   Pure functions without any DOM access, so they run in the browser (window.NFMuscles)
   and in Node for the tests in tests/muscles.test.js. */
(function (root) {
  "use strict";

  // How much each exercise works each muscle (1 = main muscle).
  const MAP = {
    squat:{quads:1,glutes:.7,adduct:.3,lowback:.2}, smithsq:{quads:1,glutes:.6,adduct:.3}, gobletsq:{quads:1,glutes:.6,adduct:.3}, legpress:{quads:1,glutes:.5},
    legcurl:{hams:1}, seatcurl:{hams:1}, calf:{calves:1},
    hip:{glutes:1,hams:.3}, smithhip:{glutes:1,hams:.3}, glutebridge:{glutes:1,hams:.2}, dbhip:{glutes:1,hams:.3},
    bulgarian:{glutes:.8,quads:.6,adduct:.2}, split:{glutes:.7,quads:.7,adduct:.2}, revlunge:{glutes:.8,quads:.6},
    rdl:{hams:1,glutes:.7,lowback:.4}, dbrdl:{hams:1,glutes:.7,lowback:.4}, hyper:{glutes:.9,hams:.5,lowback:.4},
    kick:{glutes:1}, kickm:{glutes:1}, abd:{glutes:.9}, add:{adduct:1}, cableadd:{adduct:1},
    lat:{back:1,biceps:.4}, latclose:{back:1,biceps:.4}, latone:{back:1,biceps:.4},
    incl:{chest:1,shoulders:.4,triceps:.4}, inclm:{chest:1,shoulders:.4,triceps:.4}, flatdb:{chest:1,triceps:.4,shoulders:.3},
    lra:{shoulders:1}, lracable:{shoulders:1}, lram:{shoulders:1},
    bic:{biceps:1}, hammer:{biceps:1}, cablecurl:{biceps:1}, tri:{triceps:1}, pushdown:{triceps:1}, ohtri:{triceps:1}
  };
  const NAME = {glutes:"Glutes", hams:"Hamstrings", quads:"Quads", adduct:"Inner thighs", calves:"Calves", back:"Back",
    lowback:"Lower back", chest:"Chest", shoulders:"Shoulders", biceps:"Biceps", triceps:"Triceps", core:"Core"};
  const EMOJI = {glutes:"🍑", hams:"🦵", quads:"🦵", adduct:"🦵", calves:"🦵", back:"💪", lowback:"💪", chest:"💪",
    shoulders:"💪", biceps:"💪", triceps:"💪", core:"🧘‍♀️"};
  const UPPER = ["back", "chest", "shoulders", "biceps", "triceps"];
  const LEGS = ["glutes", "quads", "hams", "adduct", "calves"];
  const TIE = 0.85;   // a second muscle within 85 % of the first shares the headline

  const num = v => { const n = parseFloat(String(v == null ? "" : v).replace(",", ".")); return isFinite(n) ? n : 0; };
  const kmOf = e => (e.run ? num(e.run.km) : 0) + (e.tread ? num(e.tread.km) : 0);

  // Load per muscle: strength sets (weighted by MAP), runs and yoga.
  function load(H) {
    const L = {};
    let sets = 0;
    const add = (m, v) => { L[m] = (L[m] || 0) + v; };
    (H || []).forEach(e => {
      Object.keys(e.sets || {}).forEach(id => {
        const map = MAP[id]; if (!map) return;
        const n = (e.sets[id] || []).filter(s => num(s.r) > 0).length;
        sets += n;
        Object.entries(map).forEach(([m, w]) => add(m, n * w));
      });
      const km = kmOf(e);
      if (km > 0) { const k = Math.min(2, km / 5); add("quads", 2 * k); add("calves", 2 * k); add("hams", 1.2 * k); add("glutes", 1 * k); add("core", .4 * k); }
      if (e.yoga) { const k = Math.min(1.5, Math.max(.5, num(e.yoga.min) / 30)); add("core", 2 * k); add("glutes", 1 * k); add("hams", 1 * k); add("back", .5 * k); add("shoulders", .5 * k); }
    });
    const tot = Object.values(L).reduce((a, b) => a + b, 0), max = Math.max(0, ...Object.values(L));
    const pct = v => tot ? Math.round(v / tot * 100) : 0;
    const rank = Object.entries(L).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1])
      .map(([k, v]) => ({k, n:NAME[k], v, pct:pct(v), rel:max ? v / max : 0}));
    const I = {}; Object.entries(L).forEach(([k, v]) => { I[k] = max ? v / max : 0; });
    I.traps = (I.back || 0) * .5;
    const share = ks => pct(ks.reduce((a, k) => a + (L[k] || 0), 0));
    return {I, rank, tot, sets, upperPct:share(UPPER), legsPct:share(LEGS)};
  }

  // when: "week" or the month's name ("October")
  function headline(M, when) {
    if (!M || !M.rank || !M.rank.length) return null;
    const a = M.rank[0], b = M.rank[1];
    const span = when === "week" ? "this week" : "in " + when;
    const low = r => r.n.toLowerCase();
    let title, text;
    if (b && b.v >= a.v * TIE) {
      title = `${a.n} & ${low(b)} on fire 🔥`;
      text = `${a.pct + b.pct} % of your training ${span} went to your ${low(a)} and ${low(b)} ${EMOJI[a.k]}`;
    } else {
      title = `${a.n} on fire 🔥`;
      text = `${a.pct} % of your training ${span} went to your ${low(a)} ${EMOJI[a.k]}`;
    }
    // A gentle nudge only for the half of the body that was left out
    let hint = "";
    const range = when === "week" ? "this week" : "this month";
    if (M.legsPct < 20) hint = `Your legs got a bit less attention ${range}. Lower body day next time? 🦵`;
    else if (M.sets > 0 && M.upperPct < 15) hint = `Your upper body got a bit less attention ${range}. Upper body day next time? 💪`;
    return {title, text, hint, top:a.k};
  }

  const api = {MAP, NAME, EMOJI, UPPER, LEGS, load, headline};
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NFMuscles = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
