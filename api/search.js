// flights/site/api/search.js — LIVE flight search, server-side.
// Powers The Flight Lounge's OWN results board. Uses your existing (free)
// Travelpayouts token — no new signup. The token stays here in a Vercel env
// var, never in the browser. Client calls /api/search; we return a clean list
// of real fares, which the site renders with OUR honest verdict on top. Only
// the "Book" click leaves the site.
//
// Vercel env var required:
//   TRAVELPAYOUTS_TOKEN   (the same token your fare collector already uses —
//                          find it at travelpayouts.com → Developers → API token)
//
// No npm deps — uses the runtime's built-in fetch.

const iata = (s) => String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);

module.exports = async function handler(req, res) {
  try {
    const TOKEN = process.env.TRAVELPAYOUTS_TOKEN;
    if (!TOKEN) {
      // not wired yet — client falls back to the live hand-off card
      res.status(200).json({ ok: false, reason: "not_configured", results: [] });
      return;
    }
    const q = req.query || {};
    const origin = iata(q.origin), destination = iata(q.destination);
    const date = String(q.date || "").slice(0, 10);
    const direct = String(q.direct || "") === "1";
    if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ ok: false, reason: "bad_params", results: [] });
      return;
    }
    const p = new URLSearchParams({
      origin, destination, departure_at: date,
      currency: "gbp", sorting: "price", one_way: "true",
      direct: direct ? "true" : "false", limit: "30", market: "uk",
    });
    const r = await fetch(
      "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?" + p.toString(),
      { headers: { "X-Access-Token": TOKEN } });
    const j = await r.json();
    if (!j || !Array.isArray(j.data)) {
      res.status(200).json({ ok: false, reason: "no_data", results: [] });
      return;
    }
    const results = j.data.map((o) => {
      const durMin = o.duration_to || o.duration || 0;
      return {
        price: Math.round(o.price),
        airline: String(o.airline || "").toUpperCase(),
        depart: o.departure_at || "",
        from: o.origin_airport || origin,
        to: o.destination_airport || destination,
        stops: o.transfers || 0,
        duration: durMin ? ("PT" + Math.floor(durMin / 60) + "H" + (durMin % 60) + "M") : "",
        flight: o.flight_number || "",
      };
    }).filter((x) => x.price > 0)
      .sort((a, b) => a.price - b.price)
      .slice(0, 20);
    if (!results.length) {
      res.status(200).json({ ok: false, reason: "no_data", results: [] });
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=300");
    res.status(200).json({ ok: true, origin, destination, date, results });
  } catch (e) {
    res.status(200).json({ ok: false, reason: "error",
      message: String((e && e.message) || e).slice(0, 120), results: [] });
  }
};
