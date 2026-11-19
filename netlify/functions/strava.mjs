/* NOVAFit · Strava connection (Netlify Function)
   Keeps the Strava client secret on the server: the app never sees it.
   Set STRAVA_CLIENT_ID and STRAVA_CLIENT_SECRET in Netlify → Site configuration → Environment variables.

   GET                                   → {clientId}            (public, needed for the Strava login page)
   POST {action:"token", code}           → tokens after the runner allowed access
   POST {action:"refresh", refresh_token}→ new tokens (access tokens expire after 6 hours)
   POST {action:"activities", access_token, after, page} → the runner's activities since `after` (Unix seconds), 100 per page
   POST {action:"deauth", access_token}  → disconnect NOVAFit from Strava

   Tokens are passed through and never stored or logged here. */

import { guard, makeLimiter, readJson } from "../lib/guard.mjs";

const STRAVA = "https://www.strava.com";
const TOKEN_RE = /^[A-Za-z0-9]{20,200}$/;
const CODE_RE = /^[A-Za-z0-9]{10,200}$/;

// At most 120 requests per 10 minutes per IP address: a whole year of runs is up to 20 pages, plus login and refresh
const limiter = makeLimiter(120, 10 * 60 * 1000);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});

// Only what the app needs: tokens, expiry and the first name for "Connected as …"
const pickTokens = t => ({
  access_token: t.access_token, refresh_token: t.refresh_token, expires_at: t.expires_at,
  firstname: t.athlete && t.athlete.firstname || ""
});
const pickActivity = a => ({
  id: a.id, name: a.name, type: a.type, sport_type: a.sport_type, distance: a.distance,
  moving_time: a.moving_time, elapsed_time: a.elapsed_time, start_date: a.start_date, trainer: !!a.trainer
});

async function strava(path, init) {
  const r = await fetch(STRAVA + path, init);
  let body = null;
  try { body = await r.json(); } catch (e) { body = null; }
  return { ok: r.ok, status: r.status, body };
}

// Strava's answer for the app: 401 means "connect again", 429 "too many requests", everything else 502
const fail = r => json({ error: r.status === 401 ? "unauthorized" : r.status === 429 ? "rate_limited" : "strava_error" },
  r.status === 401 || r.status === 429 ? r.status : 502);

export default async function handler(req, context) {
  const refused = guard(req, context, limiter);
  if (refused) return refused;
  const id = process.env.STRAVA_CLIENT_ID, secret = process.env.STRAVA_CLIENT_SECRET;
  if (!id || !secret) return json({ error: "not_configured" }, 503);
  if (req.method === "GET") return json({ clientId: id });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let b;
  try { b = await readJson(req); } catch (e) { return json({ error: e.message === "too_large" ? "too_large" : "bad_request" }, e.message === "too_large" ? 413 : 400); }
  if (!b || typeof b !== "object") return json({ error: "bad_request" }, 400);

  if (b.action === "token" || b.action === "refresh") {
    const isCode = b.action === "token", val = isCode ? b.code : b.refresh_token;
    if (!(isCode ? CODE_RE : TOKEN_RE).test(String(val || ""))) return json({ error: "bad_request" }, 400);
    const form = new URLSearchParams({ client_id: id, client_secret: secret,
      grant_type: isCode ? "authorization_code" : "refresh_token", [isCode ? "code" : "refresh_token"]: val });
    const r = await strava("/oauth/token", { method: "POST", body: form });
    // a wrong or used code is Strava's 400; for the app that means "connect again"
    if (!r.ok) return fail(r.status === 400 ? { status: 401 } : r);
    return json(pickTokens(r.body));
  }

  if (b.action === "activities" || b.action === "deauth") {
    if (!TOKEN_RE.test(String(b.access_token || ""))) return json({ error: "bad_request" }, 400);
    const auth = { Authorization: "Bearer " + b.access_token };
    if (b.action === "deauth") {
      const r = await strava("/oauth/deauthorize", { method: "POST", headers: auth });
      return r.ok || r.status === 401 ? json({ ok: true }) : fail(r);
    }
    const after = Math.floor(Number(b.after) || 0);
    if (after < 0 || after > Date.now() / 1000) return json({ error: "bad_request" }, 400);
    // page: 1, 2, 3 … for a whole year of runs (100 activities per page)
    const page = b.page == null ? 1 : Math.floor(Number(b.page));
    if (!(page >= 1 && page <= 50)) return json({ error: "bad_request" }, 400);
    const r = await strava(`/api/v3/athlete/activities?after=${after}&page=${page}&per_page=100`, { headers: auth });
    if (!r.ok) return fail(r);
    return json({ activities: (Array.isArray(r.body) ? r.body : []).map(pickActivity) });
  }

  return json({ error: "bad_request" }, 400);
}
