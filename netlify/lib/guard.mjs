/* NOVAFit · shared protection for the Netlify Functions (strava.mjs, route.mjs)

   1. Same site only: a browser call from another website is refused (Origin / Sec-Fetch-Site).
      Extra origins (e.g. a preview address) can be allowed with ALLOWED_ORIGINS="https://a,https://b".
   2. Rate limit per IP address, so nobody can use up the free Strava or openrouteservice quota.
      The counter lives in the memory of one function instance: it resets when Netlify starts a new
      instance, so it slows down abuse but is not an exact limit.
   3. Small bodies only: the app never sends more than a few hundred bytes.

   This does not replace authentication: the functions hold no user data, they only keep the
   API keys secret and pass requests on. Without the key nobody can call Strava or the route service
   in our name; with these checks nobody can do it from another site or in bulk. */

export const MAX_BODY = 8 * 1024;

const json = (body, status) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
});

/* Is the request coming from our own site? Requests without Origin (same-origin GET, curl) pass
   this check and are left to the rate limit. */
export function sameSite(req, extra) {
  const origin = req.headers.get("origin"), site = req.headers.get("sec-fetch-site");
  if (site === "cross-site") return false;
  if (!origin) return true;
  let own;
  try { own = new URL(req.url).origin; } catch (e) { return false; }
  const allowed = [own].concat(String(extra || "").split(",").map(s => s.trim()).filter(Boolean));
  return allowed.includes(origin);
}

/* Sliding window: at most `limit` requests per `windowMs` per key. Returns seconds to wait, 0 = ok. */
export function makeLimiter(limit, windowMs, now = () => Date.now()) {
  const hits = new Map();
  return function hit(key) {
    const t = now(), from = t - windowMs;
    const list = (hits.get(key) || []).filter(x => x > from);
    if (list.length >= limit) { hits.set(key, list); return Math.max(1, Math.ceil((list[0] + windowMs - t) / 1000)); }
    list.push(t); hits.set(key, list);
    if (hits.size > 5000) for (const k of hits.keys()) { hits.delete(k); if (hits.size <= 4000) break; }   // keep memory small
    return 0;
  };
}

export const clientIp = (req, context) =>
  (context && context.ip) || req.headers.get("x-nf-client-connection-ip") || (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";

/* Runs all checks. Returns a Response to send back (refused), or null when the request may continue. */
export function guard(req, context, limiter) {
  if (!sameSite(req, process.env.ALLOWED_ORIGINS)) return json({ error: "forbidden" }, 403);
  const len = Number(req.headers.get("content-length") || 0);
  if (len > MAX_BODY) return json({ error: "too_large" }, 413);
  const wait = limiter(clientIp(req, context));
  if (wait) {
    const r = json({ error: "rate_limited" }, 429);
    r.headers.set("Retry-After", String(wait));
    return r;
  }
  return null;
}

/* Reads a JSON body, refusing anything larger than MAX_BODY even without a Content-Length header */
export async function readJson(req) {
  const text = await req.text();
  if (text.length > MAX_BODY) throw new Error("too_large");
  return JSON.parse(text);
}
