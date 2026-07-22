/* The Flight Lounge — shared data + behaviour.
   Live fares load from data/deals.json (built by make_flights_site.py from the
   fare collector); falls back to the sample set below if the feed isn't there. */

/* ============================================================
   AFFILIATE / LINK CONFIG
   Flights: Skyscanner deep-links — trusted UK brand, English/GBP, covers
            EVERY route. Commission switches on once the Skyscanner
            affiliate application (via Impact.com) is approved: add your
            tracking (associateid / impact deep-link wrapper) in bookingUrl().
   Hotels : Booking.com live search — swap hotelUrl() to your approved
            hotel affiliate deep-link once that program clears review.
   ============================================================ */
const TP_MARKER = "753562";   // legacy Travelpayouts id (hotels/future use)
const NEWSLETTER_ENDPOINT = "";           // paste a Formspree/Mailchimp POST URL to go live; blank = mailto fallback
const NEWSLETTER_EMAIL   = "hello@theflightlounge.com";

const AIRPORTS = [
  {c:"LON", city:"London (all)", ctry:"UK", grp:"london"},
  {c:"LHR", city:"London Heathrow", ctry:"UK", grp:"london"},
  {c:"LGW", city:"London Gatwick", ctry:"UK", grp:"london"},
  {c:"STN", city:"London Stansted", ctry:"UK", grp:"london"},
  {c:"LTN", city:"London Luton", ctry:"UK", grp:"london"},
  {c:"MAN", city:"Manchester", ctry:"UK", grp:"nw"},
  {c:"LPL", city:"Liverpool", ctry:"UK", grp:"nw"},
  {c:"LBA", city:"Leeds Bradford", ctry:"UK", grp:"nw"},
  {c:"BHX", city:"Birmingham", ctry:"UK", grp:"mid"},
  {c:"EMA", city:"East Midlands", ctry:"UK", grp:"mid"},
  {c:"BRS", city:"Bristol", ctry:"UK", grp:"sw"},
  {c:"CWL", city:"Cardiff", ctry:"UK", grp:"sw"},
  {c:"EDI", city:"Edinburgh", ctry:"UK", grp:"scot"},
  {c:"GLA", city:"Glasgow", ctry:"UK", grp:"scot"},
  {c:"NCL", city:"Newcastle", ctry:"UK", grp:"ne"},
  {c:"BFS", city:"Belfast", ctry:"UK", grp:"ni"},
  {c:"DUB", city:"Dublin", ctry:"IE", grp:"ie"},
  {c:"ORK", city:"Cork", ctry:"IE", grp:"ie"},
  {c:"LIS", city:"Lisbon", ctry:"Portugal"}, {c:"OPO", city:"Porto", ctry:"Portugal"},
  {c:"FAO", city:"Faro", ctry:"Portugal"}, {c:"BCN", city:"Barcelona", ctry:"Spain"},
  {c:"MAD", city:"Madrid", ctry:"Spain"}, {c:"AGP", city:"Malaga", ctry:"Spain"},
  {c:"PMI", city:"Palma", ctry:"Spain"}, {c:"ALC", city:"Alicante", ctry:"Spain"},
  {c:"IBZ", city:"Ibiza", ctry:"Spain"}, {c:"TFS", city:"Tenerife", ctry:"Spain"},
  {c:"ROM", city:"Rome", ctry:"Italy"}, {c:"FCO", city:"Rome", ctry:"Italy"},
  {c:"MIL", city:"Milan", ctry:"Italy"}, {c:"VCE", city:"Venice", ctry:"Italy"},
  {c:"NAP", city:"Naples", ctry:"Italy"}, {c:"PMO", city:"Palermo", ctry:"Italy"},
  {c:"CTA", city:"Catania", ctry:"Italy"}, {c:"CDG", city:"Paris", ctry:"France"},
  {c:"PAR", city:"Paris", ctry:"France"}, {c:"NCE", city:"Nice", ctry:"France"},
  {c:"MRS", city:"Marseille", ctry:"France"}, {c:"AMS", city:"Amsterdam", ctry:"Netherlands"},
  {c:"BER", city:"Berlin", ctry:"Germany"}, {c:"MUC", city:"Munich", ctry:"Germany"},
  {c:"FRA", city:"Frankfurt", ctry:"Germany"}, {c:"PRG", city:"Prague", ctry:"Czechia"},
  {c:"BUD", city:"Budapest", ctry:"Hungary"}, {c:"KRK", city:"Krakow", ctry:"Poland"},
  {c:"WAW", city:"Warsaw", ctry:"Poland"}, {c:"ATH", city:"Athens", ctry:"Greece"},
  {c:"JTR", city:"Santorini", ctry:"Greece"}, {c:"RHO", city:"Rhodes", ctry:"Greece"},
  {c:"IST", city:"Istanbul", ctry:"Turkey"}, {c:"DLM", city:"Dalaman", ctry:"Turkey"},
  {c:"BJV", city:"Bodrum", ctry:"Turkey"}, {c:"RAK", city:"Marrakesh", ctry:"Morocco"},
  {c:"OSL", city:"Oslo", ctry:"Norway"}, {c:"CPH", city:"Copenhagen", ctry:"Denmark"},
  {c:"ARN", city:"Stockholm", ctry:"Sweden"}, {c:"KEF", city:"Reykjavik", ctry:"Iceland"},
  {c:"GVA", city:"Geneva", ctry:"Switzerland"}, {c:"VIE", city:"Vienna", ctry:"Austria"},
  {c:"SPU", city:"Split", ctry:"Croatia"}, {c:"DBV", city:"Dubrovnik", ctry:"Croatia"},
  {c:"LCA", city:"Larnaca", ctry:"Cyprus"}, {c:"PFO", city:"Paphos", ctry:"Cyprus"},
  {c:"DXB", city:"Dubai", ctry:"UAE"}, {c:"AUH", city:"Abu Dhabi", ctry:"UAE"},
  {c:"NYC", city:"New York", ctry:"USA"}, {c:"JFK", city:"New York JFK", ctry:"USA"},
  {c:"BOS", city:"Boston", ctry:"USA"}, {c:"MIA", city:"Miami", ctry:"USA"},
  {c:"LAX", city:"Los Angeles", ctry:"USA"}, {c:"LAS", city:"Las Vegas", ctry:"USA"},
  {c:"ORL", city:"Orlando", ctry:"USA"}, {c:"YYZ", city:"Toronto", ctry:"Canada"},
  {c:"BKK", city:"Bangkok", ctry:"Thailand"}, {c:"HKT", city:"Phuket", ctry:"Thailand"},
  {c:"SIN", city:"Singapore", ctry:"Singapore"}, {c:"DEL", city:"Delhi", ctry:"India"},
  {c:"CUN", city:"Cancun", ctry:"Mexico"}, {c:"MLE", city:"Maldives", ctry:"Maldives"},
];

const AIRLINES = {
  BA:"British Airways", VS:"Virgin Atlantic", U2:"easyJet", FR:"Ryanair", RK:"Ryanair",
  W6:"Wizz Air", W9:"Wizz Air UK", W4:"Wizz Air Malta", LS:"Jet2",
  TP:"TAP Air Portugal", IB:"Iberia", VY:"Vueling", AF:"Air France", KL:"KLM",
  LH:"Lufthansa", LX:"Swiss", OS:"Austrian", SN:"Brussels Airlines", AZ:"ITA Airways",
  EI:"Aer Lingus", FI:"Icelandair", EK:"Emirates", QR:"Qatar Airways", EY:"Etihad",
  TK:"Turkish Airlines", B6:"JetBlue", DL:"Delta", AA:"American Airlines", UA:"United",
  AC:"Air Canada", SQ:"Singapore Airlines", TG:"Thai Airways", AI:"Air India",
  QF:"Qantas", A3:"Aegean", LO:"LOT Polish", DY:"Norwegian", PC:"Pegasus",
  HV:"Transavia", TO:"Transavia France", EW:"Eurowings", D8:"Norwegian Intl",
  AT:"Royal Air Maroc", MS:"EgyptAir",
};

/* City-name lookup so the board & destination cards never show a raw code.
   Merged over the AIRPORTS-derived map below. */
const CITY_EXTRA = {
  LON:"London", LHR:"London", LGW:"London", STN:"London", LTN:"London",
  MAN:"Manchester", LPL:"Liverpool", LBA:"Leeds Bradford", BHX:"Birmingham",
  EMA:"East Midlands", BRS:"Bristol", CWL:"Cardiff", EDI:"Edinburgh", GLA:"Glasgow",
  NCL:"Newcastle", BFS:"Belfast", ABZ:"Aberdeen", EXT:"Exeter", SOU:"Southampton",
  DUB:"Dublin", ORK:"Cork",
  AGP:"Malaga", ALC:"Alicante", AMS:"Amsterdam", ATH:"Athens", AUH:"Abu Dhabi",
  BCN:"Barcelona", BER:"Berlin", BJV:"Bodrum", BKK:"Bangkok", BOS:"Boston",
  CAI:"Cairo", CUN:"Cancun", DLM:"Dalaman", DPS:"Bali", DXB:"Dubai", FAO:"Faro",
  FCO:"Rome", GVA:"Geneva", HKT:"Phuket", HNL:"Honolulu", IBZ:"Ibiza", IST:"Istanbul",
  JFK:"New York", JTR:"Santorini", KEF:"Reykjavik", LAS:"Las Vegas", LAX:"Los Angeles",
  LCA:"Larnaca", LIS:"Lisbon", MAD:"Madrid", MEL:"Melbourne", MEX:"Mexico City",
  MIA:"Miami", MLE:"Maldives", MRS:"Marseille", NAP:"Naples", NYC:"New York",
  OPO:"Porto", ORL:"Orlando", PAR:"Paris", PFO:"Paphos", PMI:"Palma", PRG:"Prague",
  RAK:"Marrakesh", RHO:"Rhodes", SIN:"Singapore", SYD:"Sydney", TFS:"Tenerife",
  TYO:"Tokyo", VCE:"Venice", VIE:"Vienna", YYZ:"Toronto", ZTH:"Zakynthos",
  MIL:"Milan", OSL:"Oslo", CPH:"Copenhagen", ARN:"Stockholm", WAW:"Warsaw",
  BUD:"Budapest", KRK:"Krakow", SPU:"Split", DBV:"Dubrovnik", PMO:"Palermo",
  CTA:"Catania", OLB:"Olbia", SEA:"Seattle", SFO:"San Francisco", CHI:"Chicago",
  ATL:"Atlanta", DFW:"Dallas", WAS:"Washington", YVR:"Vancouver", HKG:"Hong Kong",
  SGN:"Ho Chi Minh City", HAN:"Hanoi", MNL:"Manila", CPT:"Cape Town", JNB:"Johannesburg",
  NBO:"Nairobi", DEL:"Delhi", BOM:"Mumbai", GOI:"Goa", CMB:"Colombo", AKL:"Auckland",
  PER:"Perth", BNE:"Brisbane", SJO:"San Jose", LIM:"Lima", BOG:"Bogota", SCL:"Santiago",
  EZE:"Buenos Aires", GIG:"Rio de Janeiro", GRU:"Sao Paulo", HAV:"Havana", SJU:"San Juan",
  PUJ:"Punta Cana", MBJ:"Montego Bay", BGI:"Barbados", FRA:"Frankfurt", MUC:"Munich",
  NCE:"Nice", CDG:"Paris",
};

/* sample fares — replaced by the live feed at load when present */
let DEALS = [
  {f:"LON",t:"LIS",al:"TP",price:38,median:120,win:"Nov 2026",dir:true,status:"hold"},
  {f:"LON",t:"BCN",al:"VY",price:30,median:34,win:"Sep 2026",dir:true,status:"hold"},
  {f:"MAN",t:"ROM",al:"W6",price:29,median:49,win:"Sep 2026",dir:true,status:"hold"},
  {f:"LON",t:"AGP",al:"U2",price:33,median:43,win:"Sep 2026",dir:true,status:"hold"},
  {f:"EDI",t:"AMS",al:"KL",price:41,median:79,win:"Oct 2026",dir:true,status:"hold"},
  {f:"LON",t:"NCE",al:"U2",price:47,median:93,win:"Oct 2026",dir:true,status:"hold"},
];

const CITY = Object.assign(
  Object.fromEntries(AIRPORTS.map(a=>[a.c, a.city.replace(" (all)","")])),
  CITY_EXTRA
);
function cityName(iata){ return CITY[iata] || iata || ""; }
function airlineName(iata){ return AIRLINES[iata] || iata || ""; }
function pctOff(d){ return d.median ? Math.round((1 - d.price/d.median)*100) : 0; }

/* ---- current search selection (drives the affiliate deep-links) ---- */
const SEARCH = { depart:"", ret:"", adults:1, children:0, infants:0, tripClass:0 };

/* Month label ("Sep 2026") or feed month ("2026-09") -> a YYYY-MM-DD for the
   booking link. Mid-month (the 15th) gives the widest live availability. */
const _MON = {jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"};
function departDate(d){
  if(d.month && /^\d{4}-\d{2}$/.test(d.month)) return d.month+"-15";
  const m = (d.win||"").match(/([A-Za-z]{3})\s+(\d{4})/);
  if(m && _MON[m[1].toLowerCase()]) return m[2]+"-"+_MON[m[1].toLowerCase()]+"-15";
  return "";
}

/* ---- flight hand-off: Skyscanner deep-link (English/UK, covers every route) ----
   Skyscanner path format: /transport/flights/{origin}/{dest}/{YYMMDD}/?...
   Codes are IATA (city or airport). Missing dest -> "anywhere". */
function _skyDate(d){
  const dep = SEARCH.depart || departDate(d);   // YYYY-MM-DD
  if(!dep || !/^\d{4}-\d{2}-\d{2}$/.test(dep)) return "";
  return dep.slice(2,4) + dep.slice(5,7) + dep.slice(8,10);   // YYMMDD
}
function bookingUrl(d){
  const o = (d.f||"").toLowerCase();
  const t = (d.t||"").toLowerCase() || "anywhere";
  const ymd = _skyDate(d);
  let u = `https://www.skyscanner.net/transport/flights/${o}/${t}/`;
  if(ymd) u += ymd + "/";
  const p = new URLSearchParams({
    adults: String(SEARCH.adults||1),
    cabinclass: SEARCH.tripClass ? "business" : "economy",
    rtn: "0", currency: "GBP", market: "UK", locale: "en-GB"
  });
  if((SEARCH.children||0)>0) p.set("children", String(SEARCH.children));
  if((SEARCH.infants||0)>0) p.set("infants", String(SEARCH.infants));
  return u + "?" + p.toString();
}

/* ---- MONETISED (pending Booking.com approval): per-destination hotels ----
   Booking.com live search now; drop in your Travelpayouts hotel deep-link
   (tp.media/r?...&marker=753562) here once the program clears review. */
function hotelUrl(d){
  const city = cityName(d.t);
  const dep = SEARCH.depart || departDate(d);
  const p = new URLSearchParams({ ss: city, group_adults:"2", no_rooms:"1", group_children:"0" });
  if(dep){
    const din = new Date(dep+"T00:00:00");
    const dout = new Date(din.getTime() + 3*864e5);
    const iso = t => t.toISOString().slice(0,10);
    p.set("checkin", iso(din)); p.set("checkout", iso(dout));
  }
  return "https://www.booking.com/searchresults.html?" + p.toString();
}

const VMAP={STEAL:{cls:"g",txt:"STEAL"},"GOOD PRICE":{cls:"g",txt:"GOOD PRICE"},TYPICAL:{cls:"a",txt:"TYPICAL"},WATCH:{cls:"a",txt:"WATCH"},TRACKING:{cls:"t",txt:"TRACKING"}};
function verdict(d){
  if(d.verdict && VMAP[d.verdict]) return VMAP[d.verdict];
  const off = pctOff(d);
  if(off>=40) return VMAP.STEAL;
  if(off>=22) return VMAP["GOOD PRICE"];
  if(off>=8)  return VMAP.TYPICAL;
  return VMAP.WATCH;
}
const STATUS = {boarding:{cls:"boarding",txt:"BOARDING"},final:{cls:"final",txt:"FINAL CALL"},hold:{cls:"dep",txt:"TRACKING"}};

function logoImg(iata){
  if(!iata) return `<span class="al"><span class="al-fb" style="display:flex">✈</span></span>`;
  const nm = airlineName(iata);
  return `<span class="al" title="${nm}">
    <img src="https://pics.avs.io/120/120/${iata}.png" alt="${nm}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <span class="al-fb" style="display:none">${iata}</span></span>`;
}
function routeCodes(code){ return (code||"").split("").map(ch=>`<span>${ch}</span>`).join(""); }

/* ---- price-history band + buy/hold call (the data edge, made visible) ---- */
function _clamp(x){ return Math.max(2, Math.min(98, x)); }
function priceZone(d){
  const lo=d.low, hi=d.high; if(!(hi>lo)) return "g";
  const pos=(d.price-lo)/(hi-lo)*100;
  return pos<=34?"g":(pos<=66?"a":"r");
}
function priceCall(d){
  // Strong book/hold call only once real history is banked; else honest "tracking".
  if(d.verdict==="TRACKING") return {cls:"t", txt:"Tracking — building its price history"};
  const lo=d.low, hi=d.high, pos=(hi>lo)?(d.price-lo)/(hi-lo)*100:0;
  if(pos<=25 || pctOff(d)>=22) return {cls:"g", txt:"✓ Book now — near its cheapest"};
  if(pos<=55) return {cls:"a", txt:"Fair price — up to you"};
  return {cls:"r", txt:"Hold — pricier than usual"};
}
function isErrorFare(d){ return d.verdict!=="TRACKING" && pctOff(d)>=50; }
function priceBand(d){
  const lo=d.low||d.price, hi=d.high||d.price, med=d.median||d.price, px=d.price;
  if(!(hi>lo)){
    return `<div class="pband flat">Fare's held steady around <b>£${px}</b> so far — no swings yet.</div>`;
  }
  const pos=_clamp((px-lo)/(hi-lo)*100), medpos=_clamp((med-lo)/(hi-lo)*100);
  const zone=priceZone(d), call=priceCall(d);
  return `<div class="pband">
    <div class="pband-row">
      <span class="pband-cap">£${lo}<small>cheapest seen</small></span>
      <div class="pband-track">
        <span class="pband-usual" style="left:${medpos}%" title="Usually £${med}"><i></i><em>usual £${med}</em></span>
        <span class="pband-now z${zone}" style="left:${pos}%"><em>today £${px}</em><i></i></span>
      </div>
      <span class="pband-cap hi">£${hi}<small>highest seen</small></span>
    </div>
    <div class="pband-call c${call.cls}">${call.txt}</div>
  </div>`;
}

function renderBoard(deals, el){
  if(!el) return;
  if(!deals.length){ el.innerHTML =
    `<div class="board-empty">No fares on that route yet — we're watching it. Try “Anywhere”, or widen to nearby airports.</div>`;
    return; }
  el.innerHTML =
    `<div class="board-hd"><span>From → To</span><span>Flight</span><span>Price</span><span style="text-align:right">Verdict / book</span></div>` +
    deals.map(d=>{
      const v = verdict(d), s = STATUS[d.status]||STATUS.hold, off = pctOff(d);
      const tracking = v.txt==="TRACKING";
      const saveTxt = tracking ? "gathering history" : (off>=8 ? `▼${off}% vs our tracked avg` : "watching");
      const saveCls = (tracking || off<8) ? "save watch" : "save";
      const errBadge = isErrorFare(d) ? `<span class="vd err">⚡ ERROR FARE?</span>` : "";
      return `<a class="brow" href="${bookingUrl(d)}" target="_blank" rel="sponsored noopener nofollow" title="Search this ${cityName(d.f)} → ${cityName(d.t)} fare">
        <span class="route">${routeCodes(d.f)}<span class="arw">→</span>${routeCodes(d.t)}</span>
        <div class="i-flight">${logoImg(d.al)}<span class="fl-txt"><span class="air">${airlineName(d.al)||"&nbsp;"}</span><span class="win">${cityName(d.f)} → ${cityName(d.t)} · ${d.win}${d.dir?"":" · 1 stop"}</span></span></div>
        <div class="i-price"><span class="pr">£${d.price}</span><span class="prcap">tracked low · check live</span><span class="${saveCls}">${saveTxt}</span></div>
        <div class="i-tags">${errBadge}<span class="vd ${v.cls}">${v.txt}</span><span class="st ${s.cls}"><span class="dot"></span> ${s.txt}</span><span class="go">Check live price ›</span></div>
        ${priceBand(d)}
      </a>`;
    }).join("");
}

function attachAC(inputEl, panelEl, onPick){
  function render(q){
    q = (q||"").toLowerCase().trim();
    let list = AIRPORTS;
    if(q) list = AIRPORTS.filter(a =>
      a.c.toLowerCase().startsWith(q) || a.city.toLowerCase().includes(q) || (a.ctry||"").toLowerCase().includes(q));
    list = list.slice(0,8);
    panelEl.innerHTML = list.map(a =>
      `<div class="ac-row" data-c="${a.c}"><span class="ac-code">${a.c}</span><span class="ac-city">${a.city}</span><span class="ac-ctry">${a.ctry||""}</span></div>`).join("")
      || `<div class="ac-row ac-none">No match — try a city or 3-letter code</div>`;
    panelEl.classList.add("show");
  }
  inputEl.addEventListener("focus", ()=>render(inputEl.value));
  inputEl.addEventListener("input", ()=>{ inputEl.dataset.code=""; render(inputEl.value); });
  panelEl.addEventListener("mousedown", e=>{
    const row = e.target.closest(".ac-row[data-c]"); if(!row) return;
    const a = AIRPORTS.find(x=>x.c===row.dataset.c);
    inputEl.value = `${a.city} (${a.c})`; inputEl.dataset.code = a.c;
    panelEl.classList.remove("show"); if(onPick) onPick(a);
  });
  inputEl.addEventListener("blur", ()=> setTimeout(()=>panelEl.classList.remove("show"),150));
}
function codeOf(inputEl){
  if(inputEl.dataset.code) return inputEl.dataset.code;
  const v=(inputEl.value||"").toUpperCase();
  const m=v.match(/\(([A-Z]{3})\)/); if(m) return m[1];
  const hit=AIRPORTS.find(a=>a.c===v.trim()||a.city.toUpperCase()===v.trim());
  return hit?hit.c:v.trim().slice(0,3);
}
function searchDeals(from, to, nearby){
  const grp = (AIRPORTS.find(a=>a.c===from)||{}).grp;
  const fromSet = new Set([from]);
  if(nearby && grp) AIRPORTS.filter(a=>a.grp===grp).forEach(a=>fromSet.add(a.c));
  if(from==="LON") ["LHR","LGW","STN","LTN"].forEach(c=>fromSet.add(c));
  return DEALS.filter(d=>{
    const okFrom = fromSet.has(d.f) || (from==="LON" && d.f==="LON");
    const okTo = !to || to==="ANY" || d.t===to || (to==="NYC" && ["JFK","NYC"].includes(d.t));
    return okFrom && okTo;
  }).sort((a,b)=>pctOff(b)-pctOff(a));
}

/* ---- passenger / class popover (the "Who" selector) ---- */
function paxLabel(){
  const n = SEARCH.adults + SEARCH.children + SEARCH.infants;
  const cls = SEARCH.tripClass ? "Business" : "Economy";
  return `${n} ${n===1?"traveller":"travellers"} · ${cls}`;
}
function attachPax(triggerEl, panelEl, onChange){
  function row(key,label,sub,min){
    return `<div class="pax-row"><div><div class="pax-l">${label}</div><div class="pax-s">${sub}</div></div>
      <div class="pax-ctl"><button type="button" class="pax-b" data-k="${key}" data-d="-1" ${SEARCH[key]<=min?'disabled':''}>−</button>
      <span class="pax-n" id="paxn-${key}">${SEARCH[key]}</span>
      <button type="button" class="pax-b" data-k="${key}" data-d="1">+</button></div></div>`;
  }
  function paint(){
    panelEl.innerHTML =
      row("adults","Adults","12+",1) + row("children","Children","2–11",0) + row("infants","Infants","under 2",0) +
      `<div class="pax-cls"><button type="button" class="pax-cb ${SEARCH.tripClass===0?'on':''}" data-c="0">Economy</button>
       <button type="button" class="pax-cb ${SEARCH.tripClass===1?'on':''}" data-c="1">Business</button></div>`;
    if(triggerEl) triggerEl.value = paxLabel();
    if(onChange) onChange();
  }
  triggerEl.addEventListener("focus", ()=>{ panelEl.classList.add("show"); });
  triggerEl.addEventListener("click", ()=>{ panelEl.classList.add("show"); });
  panelEl.addEventListener("click", e=>{
    const b = e.target.closest(".pax-b");
    if(b){ const k=b.dataset.k, dlt=+b.dataset.d;
      SEARCH[k] = Math.max(k==="adults"?1:0, (SEARCH[k]||0)+dlt);
      if(k==="infants") SEARCH.infants = Math.min(SEARCH.infants, SEARCH.adults);
      paint(); return; }
    const c = e.target.closest(".pax-cb");
    if(c){ SEARCH.tripClass = +c.dataset.c; paint(); return; }
  });
  document.addEventListener("mousedown", e=>{
    if(!panelEl.contains(e.target) && e.target!==triggerEl) panelEl.classList.remove("show");
  });
  paint();
}

/* ---- live fare feed ---- */
async function loadLiveDeals(){
  try{
    const r = await fetch("data/deals.json", {cache:"no-store"});
    if(!r.ok) return null;
    const j = await r.json();
    if(j && Array.isArray(j.deals) && j.deals.length){ DEALS = j.deals; return j; }
  }catch(e){}
  return null;
}
function liveBanner(meta){
  const el = document.getElementById("livebanner"); if(!el || !meta) return;
  if(meta.history_building){
    el.innerHTML = `<span class="lb-dot"></span> <b>Live fares, now boarding.</b> ` +
      `Good-price verdicts switch on once we've banked ~2 weeks of history` +
      (meta.days_until_verdicts?` — <b>${meta.days_until_verdicts} days to go.</b>`:``) +
      ` Prices are tracked lows, refreshed through the day — not a live quote until you check.`;
    el.style.display = "block";
  }
}

/* ---- "we found it cheaper" routing feed (built by make_routes.py) ---- */
async function loadRoutes(){
  try{
    const r = await fetch("data/routes.json", {cache:"no-store"});
    if(!r.ok) return null;
    return await r.json();
  }catch(e){ return null; }
}
function renderRoutes(data, el){
  if(!el) return;
  const rep = (data && data.reposition) || [];
  const cat = (data && data.catchment) || [];
  if(!rep.length && !cat.length){
    el.innerHTML = `<div class="er"><span>We're banking the fare history that powers this — real "cheaper way" routes appear here the moment two well-priced legs line up. No invented numbers in the meantime.</span></div>`;
    return;
  }
  let html = "";
  cat.slice(0,3).forEach(c=>{
    const dl = bookingUrl({f:c.alt, t:c.dest, month:c.month});
    html += `<a class="er er-link" href="${dl}" target="_blank" rel="sponsored noopener nofollow">
      <span><span class="lead2">${cityName(c.home)} → ${cityName(c.dest)}</span> · fly from ${cityName(c.alt)} instead</span>
      <span class="amt">£${c.alt_price} <small>save £${Math.round(c.saving)}</small></span></a>`;
  });
  rep.slice(0,4).forEach(r=>{
    const l1 = bookingUrl({f:r.home, t:r.hub, month:r.month});
    const l2 = bookingUrl({f:r.hub, t:r.dest, month:r.month});
    html += `<div class="er">
      <span><span class="lead2">${cityName(r.home)} → ${cityName(r.dest)} via ${cityName(r.hub)}</span> · direct £${r.direct}
        <span class="flag">self-transfer — missed connection unprotected · bags recheck · check entry rules · book <a href="${l1}" target="_blank" rel="sponsored noopener nofollow">leg 1 ›</a> then <a href="${l2}" target="_blank" rel="sponsored noopener nofollow">leg 2 ›</a></span></span>
      <span class="amt">£${r.total} <small>save £${Math.round(r.saving)}</small></span></div>`;
  });
  el.innerHTML = html;
}

/* ============================================================
   LIVE FLIGHT RESULTS — our own board, our verdict, powered by /api/search
   (Amadeus server-side). Only the "Book" click hands off. This is what makes
   TFL a real search, not a forwarder.
   ============================================================ */
function _hm(iso){ const m=String(iso||"").match(/T(\d{2}:\d{2})/); return m?m[1]:""; }
function _dur(iso){
  const m=String(iso||"").match(/PT(?:(\d+)H)?(?:(\d+)M)?/); if(!m) return "";
  return ((m[1]?m[1]+"h ":"")+(m[2]?m[2]+"m":"")).trim();
}
function _niceDate(d){
  try{ return new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"}); }
  catch(e){ return d; }
}
function routeMeta(from,to){
  const d = DEALS.find(x=>x.f===from && x.t===to);
  return d ? {median:d.median, low:d.low, high:d.high} : null;
}
function liveBookUrl(from,to,date){
  const o=(from||"").toLowerCase(), t=(to||"").toLowerCase();
  const ymd = (date&&/^\d{4}-\d{2}-\d{2}$/.test(date)) ? date.slice(2,4)+date.slice(5,7)+date.slice(8,10) : "";
  let u="https://www.skyscanner.net/transport/flights/"+o+"/"+t+"/";
  if(ymd) u+=ymd+"/";
  return u+"?adults="+(SEARCH.adults||1)+"&cabinclass="+(SEARCH.tripClass?"business":"economy")+"&rtn=0&currency=GBP&market=UK&locale=en-GB";
}
async function liveSearch(origin,destination,date,adults,direct){
  try{
    const p=new URLSearchParams({origin:origin,destination:destination,date:date,adults:String(adults||1)});
    if(direct) p.set("direct","1");
    const r=await fetch("/api/search?"+p.toString());
    if(!r.ok) return null;
    return await r.json();
  }catch(e){ return null; }
}
function renderResults(data, el, from, to, date){
  const rs=(data&&data.results)||[];
  if(!rs.length) return false;
  const meta=routeMeta(from,to);
  const book=liveBookUrl(from,to,date);
  const head='<div class="lr-hd"><span class="lr-plane">✈</span> <b>'+rs.length+' live flights</b> · '
    +cityName(from)+' → '+cityName(to)+' · '+_niceDate(date)+'</div>';
  const ctxLine = meta
    ? '<div class="lr-ctx">Our price history says this route is usually <b>£'+meta.median+'</b> (we\'ve seen £'+meta.low+'–£'+meta.high+') — so here\'s our honest read on each fare:</div>'
    : '<div class="lr-ctx">We don\'t verdict-track this exact route yet — but these are real live fares, cheapest first. Book direct with the airline or agent.</div>';
  const rows = rs.map(function(f){
    const dep=_hm(f.depart), arr=_hm(f.arrive), dur=_dur(f.duration);
    const stops=f.stops===0?"Direct":(f.stops+" stop"+(f.stops>1?"s":""));
    var vd="";
    if(meta && meta.median){
      const off=Math.round((1-f.price/meta.median)*100);
      if(off>=40) vd='<span class="vd g">STEAL ▼'+off+'%</span>';
      else if(off>=22) vd='<span class="vd g">GREAT ▼'+off+'%</span>';
      else if(off>=8) vd='<span class="vd a">GOOD ▼'+off+'%</span>';
      else if(off<=-8) vd='<span class="vd r">PRICEY ▲'+Math.abs(off)+'%</span>';
      else vd='<span class="vd t">TYPICAL</span>';
    }
    return '<a class="lrow" href="'+book+'" target="_blank" rel="sponsored noopener nofollow">'
      +'<div class="lr-air">'+logoImg(f.airline)+'<span class="lr-airtxt"><b>'+airlineName(f.airline)+'</b><small>'+stops+(dur?' · '+dur:'')+'</small></span></div>'
      +'<div class="lr-time">'+(dep?'<small>departs</small>'+dep:'<small>time TBC</small>')+'</div>'
      +'<div class="lr-price"><span class="lr-pr">£'+f.price+'</span>'+vd+'</div>'
      +'<div class="lr-book">Check price ›</div>'
      +'</a>';
  }).join("");
  el.innerHTML = head + ctxLine + '<div class="lrows">'+rows+'</div>'
    +'<p class="afx" style="padding:14px 2px 0">Indicative live fares, cheapest first — the airline or agent confirms the final price at checkout. Some links are affiliate links, at no extra cost to you. <a href="affiliate-disclosure.html">How this works</a>.</p>';
  return true;
}

/* ---- newsletter capture ---- */
function wireNewsletter(){
  const f = document.getElementById("nlForm"); if(!f) return;
  f.addEventListener("submit", async e=>{
    e.preventDefault();
    const inp = f.querySelector("input[type=email]"); const email=(inp.value||"").trim();
    const done = ()=>{ f.innerHTML = `<div class="nl-done">✦ You're on the list — deals land in your inbox.</div>`; };
    if(!email) return;
    if(NEWSLETTER_ENDPOINT){
      try{ await fetch(NEWSLETTER_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})}); }catch(_){}
      done();
    } else {
      window.location.href = `mailto:${NEWSLETTER_EMAIL}?subject=Subscribe&body=Add%20me%20to%20the%20deals%20list:%20${encodeURIComponent(email)}`;
      done();
    }
  });
}

/* ---- shared chrome ---- */
const LOGO_SVG = (id)=>`<svg class="plane" viewBox="0 0 34 34" fill="none" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7CE83"/><stop offset=".5" stop-color="#C6A24C"/><stop offset="1" stop-color="#8F6F33"/></linearGradient></defs>
  <g transform="translate(6 4.5) rotate(40 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="url(#${id})"/></g>
  <g stroke="url(#${id})" stroke-width="2.3" stroke-linecap="round"><line x1="2.5" y1="22" x2="8.5" y2="22"/><line x1="1.5" y1="26.5" x2="10" y2="26.5"/><line x1="4.5" y1="31" x2="12" y2="31"/></g></svg>`;
const NAVITEMS = [["deals.html","Deals"],["destinations.html","Destinations"],["city-in-focus.html","City in Focus"],["how-it-works.html","How it works"],["pricing.html","Pricing"]];
function renderChrome(active){
  const links = NAVITEMS.map(([h,t])=>`<a href="${h}" class="${active===h?'on':''}">${t}</a>`).join("");
  const hdr = document.getElementById("hdr");
  if(hdr) hdr.innerHTML = `<header><div class="wrap nav">
    <a class="brand" href="index.html"><span class="logo">${LOGO_SVG('gH')}</span><span class="wordmark">THE FLIGHT LOUNGE</span></a>
    <nav class="navlinks">${links}</nav>
    <div class="navcta"><a href="pricing.html" class="ghost">Log in</a><a href="pricing.html" class="btn">Join free</a></div>
    <button class="hamb" aria-label="Menu" onclick="document.getElementById('mobnav').classList.toggle('show')"><span></span><span></span><span></span></button>
    </div><div class="mobnav" id="mobnav">${NAVITEMS.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}<a href="pricing.html">Join free</a></div></header>`;
  const ftr = document.getElementById("ftr");
  if(ftr) ftr.innerHTML = `<footer><div class="wrap">
    <div class="nl"><div><h4 class="disp">Get the steals before they go</h4><p>Free deal alerts to your inbox — the best fares from your airports, no spam.</p></div>
      <form id="nlForm" class="nl-form"><input type="email" placeholder="you@email.com" aria-label="Email" required><button class="btn" type="submit">Join free</button></form></div>
    <div class="foot-grid">
    <div style="max-width:300px"><div class="brand" style="margin-bottom:10px;color:#fff"><span class="logo">${LOGO_SVG('gF')}</span><span class="wordmark">THE FLIGHT LOUNGE</span></div>
    <p style="color:#8fa5c4;font-size:13px;margin:0 0 3px;letter-spacing:.02em">Smart Flight Comparison</p>
    <p style="color:#8fa5c4;font-size:14px;margin:8px 0 0">Cheap flights, with the receipts. Honest verdicts and the data edge no other club shows you.</p></div>
    <div class="fcol"><h5>Product</h5><a href="deals.html">The board</a><a href="destinations.html">Destinations</a><a href="city-in-focus.html">City in Focus</a><a href="how-it-works.html">How it works</a><a href="pricing.html">Pricing</a></div>
    <div class="fcol"><h5>Company</h5><a href="about.html">About</a><a href="faq.html">FAQ</a><a href="mailto:${NEWSLETTER_EMAIL}">Contact</a></div>
    <div class="fcol"><h5>Legal</h5><a href="#">Terms</a><a href="#">Privacy</a><a href="affiliate-disclosure.html">Affiliate disclosure</a></div></div>
    <div class="fine">theflightlounge.com · © The Flight Lounge. Some links on this site are affiliate links: if you book through them we may earn a commission, at no extra cost to you — it never changes which fare we show or the verdict we give it. We help you find fares and link you to airlines and travel sites — we don't sell flights or take payment for them, so we're not a travel agent and hold no ATOL. Savings shown against our own tracked price history (we are in our first weeks of data), never an invented reference price. Board prices are indicative tracked lows — the airline confirms the final fare at checkout. Self-transfer routes carry the risks we flag on every recommendation. Airline logos are trademarks of their respective owners, shown for identification.</div></div></footer>`;
  wireNewsletter();
}
