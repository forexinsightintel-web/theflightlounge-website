// flights/site/api/search.js — LIVE flight search via Amadeus, server-side.
// Powers The Flight Lounge's OWN results board: the API key/secret live here
// in Vercel env vars (never in the browser). The client calls /api/search and
// we return a clean list of real flights, which the site renders with OUR
// honest verdict on top. Only the "Book" click leaves the site.
//
// Vercel env vars required:
//   AMADEUS_KEY      (API Key from developers.amadeus.com)
//   AMADEUS_SECRET   (API Secret)
//   AMADEUS_ENV      "production" for live fares; anything else = test sandbox
//
// No npm deps — uses the runtime's built-in fetch.

const HOST = (process.env.AMADEUS_ENV === "production")
  ? "https://api.amadeus.com" : "https://test.api.amadeus.com";

let _tok = { value: null, exp: 0 };

async function token() {
  const now = Date.now();
  if (_tok.value && now < _tok.exp - 30000) return _tok.value;
  const r = await fetch(HOST + "/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_KEY,
      client_secret: process.env.AMADEUS_SECRET,
    }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("amadeus_auth_failed");
  _tok = { value: j.access_token, exp: now + (j.expires_in || 1799) * 1000 };
  return _tok.value;
}

const iata = (s) => String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);

module.exports = async function handler(req, res) {
  try {
    if (!process.env.AMADEUS_KEY || !process.env.AMADEUS_SECRET) {
      // not wired yet — client falls back to the live hand-off card
      res.status(200).json({ ok: false, reason: "not_configured", results: [] });
      return;
    }
    const q = req.query || {};
    const origin = iata(q.origin), destination = iata(q.destination);
    const date = String(q.date || "").slice(0, 10);
    const adults = Math.min(9, Math.max(1, parseInt(q.adults || "1", 10) || 1));
    const nonStop = String(q.direct || "") === "1";
    if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ ok: false, reason: "bad_params", results: [] });
      return;
    }
    const tok = await token();
    const p = new URLSearchParams({
      originLocationCode: origin, destinationLocationCode: destination,
      departureDate: date, adults: String(adults),
      currencyCode: "GBP", max: "20",
    });
    if (nonStop) p.set("nonStop", "true");
    const r = await fetch(HOST + "/v2/shopping/flight-offers?" + p.toString(),
      { headers: { Authorization: "Bearer " + tok } });
    const j = await r.json();
    if (!Array.isArray(j.data)) {
      res.status(200).json({ ok: false, reason: "no_data", results: [],
        detail: (j.errors && j.errors[0] && j.errors[0].detail) || null });
      return;
    }
    const carriers = (j.dictionaries && j.dictionaries.carriers) || {};
    const results = j.data.map((o) => {
      const it = o.itineraries[0];
      const segs = it.segments;
      const first = segs[0], last = segs[segs.length - 1];
      return {
        price: Math.round(parseFloat(o.price.grandTotal)),
        airline: first.carrierCode,
        airlineName: carriers[first.carrierCode] || first.carrierCode,
        depart: first.departure.at, arrive: last.arrival.at,
        from: first.departure.iataCode, to: last.arrival.iataCode,
        stops: segs.length - 1,
        duration: it.duration,
      };
    }).sort((a, b) => a.price - b.price).slice(0, 20);
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).json({ ok: true, origin, destination, date, results });
  } catch (e) {
    res.status(200).json({ ok: false, reason: "error",
      message: String(e && e.message || e).slice(0, 120), results: [] });
  }
}
