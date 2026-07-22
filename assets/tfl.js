/* The Flight Lounge — shared data + behaviour.
   Live fares load from data/deals.json (built by make_flights_site.py from the
   fare collector); falls back to the sample set below if the feed isn't there. */

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
  {c:"LIS", city:"Lisbon", ctry:"Portugal"}, {c:"OPO", city:"Porto", ctry:"Portugal"},
  {c:"FAO", city:"Faro", ctry:"Portugal"}, {c:"BCN", city:"Barcelona", ctry:"Spain"},
  {c:"MAD", city:"Madrid", ctry:"Spain"}, {c:"AGP", city:"Malaga", ctry:"Spain"},
  {c:"PMI", city:"Palma", ctry:"Spain"}, {c:"ALC", city:"Alicante", ctry:"Spain"},
  {c:"IBZ", city:"Ibiza", ctry:"Spain"}, {c:"ROM", city:"Rome", ctry:"Italy"},
  {c:"MIL", city:"Milan", ctry:"Italy"}, {c:"VCE", city:"Venice", ctry:"Italy"},
  {c:"NAP", city:"Naples", ctry:"Italy"}, {c:"CDG", city:"Paris", ctry:"France"},
  {c:"NCE", city:"Nice", ctry:"France"}, {c:"MRS", city:"Marseille", ctry:"France"},
  {c:"AMS", city:"Amsterdam", ctry:"Netherlands"}, {c:"BER", city:"Berlin", ctry:"Germany"},
  {c:"MUC", city:"Munich", ctry:"Germany"}, {c:"PRG", city:"Prague", ctry:"Czechia"},
  {c:"BUD", city:"Budapest", ctry:"Hungary"}, {c:"KRK", city:"Krakow", ctry:"Poland"},
  {c:"ATH", city:"Athens", ctry:"Greece"}, {c:"IST", city:"Istanbul", ctry:"Turkey"},
  {c:"RAK", city:"Marrakesh", ctry:"Morocco"}, {c:"OSL", city:"Oslo", ctry:"Norway"},
  {c:"KEF", city:"Reykjavik", ctry:"Iceland"}, {c:"DXB", city:"Dubai", ctry:"UAE"},
  {c:"NYC", city:"New York", ctry:"USA"}, {c:"JFK", city:"New York JFK", ctry:"USA"},
  {c:"BOS", city:"Boston", ctry:"USA"}, {c:"MIA", city:"Miami", ctry:"USA"},
  {c:"LAX", city:"Los Angeles", ctry:"USA"}, {c:"YYZ", city:"Toronto", ctry:"Canada"},
  {c:"ORK", city:"Cork", ctry:"IE"}, {c:"BKK", city:"Bangkok", ctry:"Thailand"},
  {c:"SIN", city:"Singapore", ctry:"Singapore"}, {c:"DEL", city:"Delhi", ctry:"India"},
];

const AIRLINES = {
  BA:"British Airways", VS:"Virgin Atlantic", U2:"easyJet", FR:"Ryanair", W6:"Wizz Air",
  TP:"TAP Air Portugal", IB:"Iberia", VY:"Vueling", AF:"Air France", KL:"KLM",
  LH:"Lufthansa", LX:"Swiss", OS:"Austrian", SN:"Brussels Airlines", AZ:"ITA Airways",
  EI:"Aer Lingus", FI:"Icelandair", EK:"Emirates", QR:"Qatar Airways", EY:"Etihad",
  TK:"Turkish Airlines", B6:"JetBlue", DL:"Delta", AA:"American Airlines", UA:"United",
  AC:"Air Canada", SQ:"Singapore Airlines", TG:"Thai Airways", AI:"Air India",
  QF:"Qantas", A3:"Aegean", LO:"LOT Polish", DY:"Norwegian", PC:"Pegasus",
  HV:"Transavia", TO:"Transavia France", EW:"Eurowings", D8:"Norwegian Intl",
  AT:"Royal Air Maroc", MS:"EgyptAir",
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

const CITY = Object.fromEntries(AIRPORTS.map(a=>[a.c, a.city.replace(" (all)","")]));
function airlineName(iata){ return AIRLINES[iata] || iata || ""; }
function pctOff(d){ return d.median ? Math.round((1 - d.price/d.median)*100) : 0; }

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
    <img src="https://pics.avs.io/60/60/${iata}.png" alt="${nm}" loading="lazy"
         onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
    <span class="al-fb" style="display:none">${iata}</span></span>`;
}
function routeCodes(code){ return (code||"").split("").map(ch=>`<span>${ch}</span>`).join(""); }

function renderBoard(deals, el){
  if(!el) return;
  if(!deals.length){ el.innerHTML =
    `<div class="board-empty">No fares on that route yet — we're watching it. Try “Anywhere”, or widen to nearby airports.</div>`;
    return; }
  el.innerHTML =
    `<div class="board-hd"><span>From → To</span><span>Flight</span><span>Price</span><span style="text-align:right">Verdict / status</span></div>` +
    deals.map(d=>{
      const v = verdict(d), s = STATUS[d.status]||STATUS.hold, off = pctOff(d);
      const tracking = v.txt==="TRACKING";
      const saveTxt = tracking ? "gathering history" : (off>=8 ? `▼${off}% vs usual` : "watching");
      const saveCls = (tracking || off<8) ? "save watch" : "save";
      return `<div class="brow">
        <span class="route">${routeCodes(d.f)}<span class="arw">→</span>${routeCodes(d.t)}</span>
        <div class="i-flight">${logoImg(d.al)}<span class="fl-txt"><span class="air">${airlineName(d.al)||"&nbsp;"}</span><span class="win">${d.win}${d.dir?"":" · 1 stop"}</span></span></div>
        <div class="i-price"><span class="pr">£${d.price}</span><span class="${saveCls}">${saveTxt}</span></div>
        <div class="i-tags"><span class="vd ${v.cls}">${v.txt}</span><span class="st ${s.cls}"><span class="dot"></span> ${s.txt}</span></div>
      </div>`;
    }).join("");
}

function attachAC(inputEl, panelEl, onPick){
  function render(q){
    q = (q||"").toLowerCase().trim();
    let list = AIRPORTS;
    if(q) list = AIRPORTS.filter(a =>
      a.c.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || (a.ctry||"").toLowerCase().includes(q));
    list = list.slice(0,7);
    panelEl.innerHTML = list.map(a =>
      `<div class="ac-row" data-c="${a.c}"><span class="ac-code">${a.c}</span><span class="ac-city">${a.city}</span><span class="ac-ctry">${a.ctry||""}</span></div>`).join("")
      || `<div class="ac-row ac-none">No match</div>`;
    panelEl.classList.add("show");
  }
  inputEl.addEventListener("focus", ()=>render(inputEl.value));
  inputEl.addEventListener("input", ()=>render(inputEl.value));
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
      ` Prices are real and updating four times a day.`;
    el.style.display = "block";
  }
}

/* ---- shared chrome ---- */
const LOGO_SVG = (id)=>`<svg class="plane" viewBox="0 0 34 34" fill="none" aria-hidden="true">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E7CE83"/><stop offset=".5" stop-color="#C6A24C"/><stop offset="1" stop-color="#8F6F33"/></linearGradient></defs>
  <g transform="translate(6 4.5) rotate(40 12 12)"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="url(#${id})"/></g>
  <g stroke="url(#${id})" stroke-width="2.3" stroke-linecap="round"><line x1="2.5" y1="22" x2="8.5" y2="22"/><line x1="1.5" y1="26.5" x2="10" y2="26.5"/><line x1="4.5" y1="31" x2="12" y2="31"/></g></svg>`;
const NAVITEMS = [["deals.html","Deals"],["how-it-works.html","How it works"],["destinations.html","Destinations"],["pricing.html","Pricing"]];
function renderChrome(active){
  const links = NAVITEMS.map(([h,t])=>`<a href="${h}" class="${active===h?'on':''}">${t}</a>`).join("");
  const hdr = document.getElementById("hdr");
  if(hdr) hdr.innerHTML = `<header><div class="wrap nav">
    <a class="brand" href="index.html"><span class="logo">${LOGO_SVG('gH')}</span><span class="wordmark">THE FLIGHT LOUNGE</span></a>
    <nav class="navlinks">${links}</nav>
    <div class="navcta"><a href="#" class="ghost">Log in</a><a href="pricing.html" class="btn">Join free</a></div>
    <button class="hamb" aria-label="Menu" onclick="document.getElementById('mobnav').classList.toggle('show')"><span></span><span></span><span></span></button>
    </div><div class="mobnav" id="mobnav">${NAVITEMS.map(([h,t])=>`<a href="${h}">${t}</a>`).join("")}<a href="pricing.html">Join free</a></div></header>`;
  const ftr = document.getElementById("ftr");
  if(ftr) ftr.innerHTML = `<footer><div class="wrap"><div class="foot-grid">
    <div style="max-width:300px"><div class="brand" style="margin-bottom:10px;color:#fff"><span class="logo">${LOGO_SVG('gF')}</span><span class="wordmark">THE FLIGHT LOUNGE</span></div>
    <p style="color:#8fa5c4;font-size:13px;margin:0 0 3px;letter-spacing:.02em">Smart Flight Comparison</p>
    <p style="color:#8fa5c4;font-size:14px;margin:8px 0 0">Cheap flights, with the receipts. Honest verdicts and the data edge no other club shows you.</p></div>
    <div class="fcol"><h5>Product</h5><a href="deals.html">The board</a><a href="how-it-works.html">How it works</a><a href="destinations.html">Destinations</a><a href="pricing.html">Pricing</a></div>
    <div class="fcol"><h5>Company</h5><a href="about.html">About</a><a href="faq.html">FAQ</a><a href="#">Contact</a></div>
    <div class="fcol"><h5>Legal</h5><a href="#">Terms</a><a href="#">Privacy</a><a href="#">Affiliate disclosure</a></div></div>
    <div class="fine">theflightlounge.com · © The Flight Lounge. We help you find fares and link you to airlines and travel sites — we don't sell flights or take payment for them, so we're not a travel agent and hold no ATOL. Savings shown against our own 90-day median, never an invented reference price. Self-transfer routes carry the risks we flag on every recommendation. Airline logos are trademarks of their respective owners, shown for identification.</div></div></footer>`;
}
