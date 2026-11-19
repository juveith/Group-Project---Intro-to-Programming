/* NOVAFit · "Make me a loop from here" (Netlify Function)
   Asks openrouteservice for a round trip on foot paths (OpenStreetMap data) that starts and ends where you are.
   Set ORS_API_KEY in Netlify → Site configuration → Environment variables (free key: openrouteservice.org).

   GET                         → {ok:true} when the key is set (the app only shows the button then)
   POST {lat, lon, km, seed}   → {km, coords:[[lon, lat], …]}   seed 1–99 gives a different loop of the same length

   The position is used for this one request only: never stored or logged here. */

import { guard, makeLimiter, readJson } from "../lib/guard.mjs";

const ORS = "https://api.openrouteservice.org/v2/directions/foot-walking/geojson";
const MAX_POINTS = 400;

// At most 20 requests per 10 minutes per IP address: each loop is one request to the free route service
const limiter = makeLimiter(20, 10 * 60 * 1000);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});

// Keep the line light for the phone: at most 400 points, 5 decimals (about 1 m)
function thin(coords) {
  const step = Math.max(1, Math.ceil(coords.length / MAX_POINTS)), out = [];
  for (let i = 0; i < coords.length; i += step) out.push(coords[i]);
  if (out[out.length - 1] !== coords[coords.length - 1]) out.push(coords[coords.length - 1]);
  return out.map(c => [Math.round(c[0] * 1e5) / 1e5, Math.round(c[1] * 1e5) / 1e5]);
}

export default async function handler(req, context) {
  const refused = guard(req, context, limiter);
  if (refused) return refused;
  const key = process.env.ORS_API_KEY;
  if (!key) return json({ error: "not_configured" }, 503);
  if (req.method === "GET") return json({ ok: true });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let b;
  try { b = await readJson(req); } catch (e) { return json({ error: e.message === "too_large" ? "too_large" : "bad_request" }, e.message === "too_large" ? 413 : 400); }
  const lat = Number(b && b.lat), lon = Number(b && b.lon), km = Number(b && b.km), seed = b && b.seed == null ? 1 : Number(b.seed);
  if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180) || !(km >= 2 && km <= 30) || !(Number.isInteger(seed) && seed >= 1 && seed <= 99))
    return json({ error: "bad_request" }, 400);

  let r;
  try {
    r = await fetch(ORS, {
      method: "POST",
      headers: { Authorization: key, "Content-Type": "application/json", Accept: "application/geo+json" },
      body: JSON.stringify({ coordinates: [[lon, lat]], options: { round_trip: { length: Math.round(km * 1000), points: 4, seed } } })
    });
  } catch (e) { return json({ error: "route_error" }, 502); }
  if (r.status === 429) return json({ error: "rate_limited" }, 429);
  let d = null;
  try { d = await r.json(); } catch (e) { d = null; }
  // 404 / 2010: no foot paths near the point (e.g. on the water)
  if (!r.ok) return json({ error: r.status === 404 || (d && d.error && d.error.code === 2010) ? "no_route" : "route_error" }, r.status === 404 ? 404 : 502);
  const f = d && d.features && d.features[0], coords = f && f.geometry && f.geometry.coordinates;
  if (!Array.isArray(coords) || coords.length < 2) return json({ error: "no_route" }, 404);
  const meters = f.properties && f.properties.summary && f.properties.summary.distance;
  return json({ km: Math.round((meters || km * 1000) / 10) / 100, coords: thin(coords) });
}
