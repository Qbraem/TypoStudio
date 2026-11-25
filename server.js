// Studio Typo – kleine Node-server (geen dependencies)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2", ".css": "text/css; charset=utf-8", ".txt": "text/plain; charset=utf-8",
};

// Usage counts for "Trending": how often each built-in design is saved.
// Stored in Upstash Redis when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are set,
// otherwise in memory + a small file (resets on a redeploy on Render's free plan).
const UP_URL = process.env.UPSTASH_REDIS_REST_URL || "", UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";
const KEY = "studiotypo:usage";
async function redis(cmd) {
  const r = await fetch(UP_URL, { method: "POST", headers: { Authorization: "Bearer " + UP_TOKEN, "Content-Type": "application/json" }, body: JSON.stringify(cmd) });
  if (!r.ok) throw new Error("upstash " + r.status);
  return (await r.json()).result;
}
const COUNTS_FILE = path.join(__dirname, "usage.json");
let counts = {};
try { counts = JSON.parse(fs.readFileSync(COUNTS_FILE, "utf8")); } catch (e) {}
let dirty = false;
setInterval(() => { if (dirty) { dirty = false; fs.writeFile(COUNTS_FILE, JSON.stringify(counts), () => {}); } }, 30000);
const dayKey = d => KEY + ":day:" + d.toISOString().slice(0, 10);
async function addUse(id) {
  counts[id] = (counts[id] || 0) + 1; dirty = true;
  if (UP_URL) {
    try { await redis(["HINCRBY", KEY, id, 1]); const dk = dayKey(new Date()); await redis(["HINCRBY", dk, id, 1]); await redis(["EXPIRE", dk, 400 * 86400]); }
    catch (e) { console.error(e.message); }
  }
}
async function hash(key) { if (!UP_URL) return key === KEY ? counts : {}; const flat = await redis(["HGETALL", key]) || []; const o = {}; for (let i = 0; i < flat.length; i += 2) o[flat[i]] = +flat[i + 1]; return o; }

// ---- anonymous events: daily pings (active/new) and a few UI events, per platform ----
const EVENTS = ["active", "new", "help", "paywall", "story"], memEv = {};
const evKey = d => KEY + ":ev:" + d.toISOString().slice(0, 10);
async function addEvent(e, p) {
  const f = e + ":" + p, dk = evKey(new Date());
  memEv[dk] = memEv[dk] || {}; memEv[dk][f] = (memEv[dk][f] || 0) + 1;
  if (UP_URL) { try { await redis(["HINCRBY", dk, f, 1]); await redis(["EXPIRE", dk, 400 * 86400]); await redis(["HINCRBY", KEY + ":ev", f, 1]); } catch (err) { console.error(err.message); } }
}
async function evHash(key) { if (!UP_URL) return memEv[key] || {}; return hash(key); }

// ---- private stats page: /stats?key=STATS_KEY ----
const STATS_KEY = process.env.STATS_KEY || "";
let DESIGNS = [];
try {
  const src = fs.readFileSync(path.join(ROOT, "index.html"), "utf8"), seen = {};
  for (const m of src.matchAll(/D\("([a-z]+\d+)","([^"]+)","([^"]+)"/g)) { const cat = m[2]; seen[cat] = (seen[cat] || 0) + 1; DESIGNS.push({ id: m[1], cat, name: m[3], free: seen[cat] <= 3 }); }
} catch (e) { console.error("stats: cannot read designs", e.message); }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
async function statsPage() {
  const total = await hash(KEY), now = new Date(), days = [];
  for (let i = 0; i < 14; i++) { const d = new Date(now - i * 86400e3); days.push({ d: d.toISOString().slice(0, 10), c: await hash(dayKey(d)), e: await evHash(evKey(d)) }); }
  const evTot = UP_URL ? await hash(KEY + ":ev") : {};
  const ev = (o, e, p) => p ? (o[e + ":" + p] || 0) : (o[e + ":ios"] || 0) + (o[e + ":web"] || 0);
  const users = o => ev(o, "active") + ev(o, "new");
  const today = days[0].e, last7 = days.slice(0, 7);
  const s7 = f => last7.reduce((a, x) => a + f(x.e), 0);
  const umax = Math.max(1, ...days.map(x => users(x.e)));
  const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
  const w7 = {}; days.slice(0, 7).forEach(x => { for (const k in x.c) w7[k] = (w7[k] || 0) + x.c[k]; });
  const byId = Object.fromEntries(DESIGNS.map(d => [d.id, d]));
  const rows = Object.keys(total).map(id => ({ ...(byId[id] || { id, cat: "?", name: id }), n: total[id], w: w7[id] || 0 })).sort((a, b) => b.n - a.n || b.w - a.w);
  const max = rows[0] ? rows[0].n : 1, never = DESIGNS.filter(d => !total[d.id]);
  const cats = {}; rows.forEach(r => { cats[r.cat] = (cats[r.cat] || 0) + r.n; });
  const catRows = Object.entries(cats).sort((a, b) => b[1] - a[1]), cmax = catRows[0] ? catRows[0][1] : 1;
  const dmax = Math.max(1, ...days.map(x => sum(x.c)));
  const tot = sum(total), wk = sum(w7);
  return `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta name=robots content=noindex><title>Studio Typo – stats</title><style>
body{margin:0;background:#16100c;color:#f4e9dc;font:15px/1.4 -apple-system,system-ui,sans-serif;padding:22px 16px 60px;max-width:860px;margin:auto}
h1{font-size:26px;margin:0 0 4px}h2{font-size:15px;text-transform:uppercase;letter-spacing:.08em;color:#e9b77c;margin:30px 0 10px}.sub{color:#a8957f;font-size:13px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:18px}.card{background:#241a14;border-radius:16px;padding:14px}.card b{display:block;font-size:28px}.card span{color:#a8957f;font-size:13px}
table{width:100%;border-collapse:collapse}td{padding:7px 6px;border-bottom:1px solid #2d221b;vertical-align:middle}td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{height:8px;border-radius:5px;background:#f26b50;min-width:2px}.c{color:#a8957f;font-size:12px}.t{font-size:11px;padding:2px 7px;border-radius:9px;background:#3a2b21;color:#e9b77c}.t.f{background:#22382a;color:#9fd8a9}
.days{display:flex;align-items:flex-end;gap:5px;height:90px}.days div{flex:1;background:#e9b77c;border-radius:4px 4px 0 0;position:relative}.days small{position:absolute;bottom:-18px;left:0;right:0;text-align:center;font-size:10px;color:#a8957f}
td.th{width:76px;padding:4px}td.th span{display:block;width:72px;height:46px;border-radius:9px;background:#2d221b center/contain no-repeat}
details{background:#241a14;border-radius:14px;padding:10px 14px}summary{cursor:pointer;color:#e9b77c}@media(max-width:520px){td.bar{display:none}}
.never{columns:2;font-size:13px;color:#cdbba7;margin-top:8px}
</style></head><body><h1>Studio Typo – design stats</h1><div class=sub>Saves per design (web + app), anonymous. Updated ${esc(now.toISOString().slice(0, 16).replace("T", " "))} UTC</div>
<div class=cards><div class=card><b>${tot}</b><span>saves in total</span></div><div class=card><b>${wk}</b><span>saves last 7 days</span></div><div class=card><b>${rows.length}</b><span>designs used</span></div><div class=card><b>${never.length}</b><span>never used (of ${DESIGNS.length})</span></div></div>
<h2>Daily users</h2><div class=cards><div class=card><b>${users(today)}</b><span>users today</span></div><div class=card><b>${Math.round(s7(users) / 7 * 10) / 10}</b><span>avg per day (7 days)</span></div><div class=card><b>${s7(o => ev(o, "new"))}</b><span>new users (7 days)</span></div><div class=card><b>${users(today) ? Math.round(ev(today, "active", "ios") + ev(today, "new", "ios")) : 0}<small style="font-size:14px;color:#a8957f"> iOS</small> · ${ev(today, "active", "web") + ev(today, "new", "web")}<small style="font-size:14px;color:#a8957f"> web</small></b><span>today by platform</span></div></div>
<div class=days style="margin-top:18px">${days.slice().reverse().map(x => { const u = users(x.e), i = ev(x.e, "active", "ios") + ev(x.e, "new", "ios"); return `<div style="height:${Math.max(2, u / umax * 100)}%;background:linear-gradient(#e9b77c ${u ? 100 - i / u * 100 : 100}%,#f26b50 0)" title="${x.d}: ${u} users (${i} iOS)"><small>${x.d.slice(8)}</small></div>`; }).join("")}</div><div class=sub style="margin-top:26px"><span style="color:#f26b50">■</span> iOS app <span style="color:#e9b77c;margin-left:10px">■</span> website · one count per device per day, no personal data</div>
<h2>Actions</h2><table><tr class=c><td></td><td class=n>Today</td><td class=n>7 days</td><td class=n>Total</td></tr>${[["help", "Help (?) opened"], ["paywall", "Paywall shown"], ["story", "Story Builder opened"]].map(([e, l]) => `<tr><td>${l}</td><td class=n>${ev(today, e)}</td><td class=n>${s7(o => ev(o, e))}</td><td class=n><b>${ev(evTot, e)}</b></td></tr>`).join("")}</table>
<h2>Saves, last 14 days</h2><div class=days>${days.slice().reverse().map(x => `<div style="height:${Math.max(2, sum(x.c) / dmax * 100)}%" title="${x.d}: ${sum(x.c)}"><small>${x.d.slice(8)}</small></div>`).join("")}</div>
<h2 style="margin-top:38px">By category</h2><table>${catRows.map(([c, n]) => `<tr><td>${esc(c)}</td><td style="width:50%"><div class=bar style="width:${n / cmax * 100}%"></div></td><td class=n>${n}</td></tr>`).join("")}</table>
<h2>Designs</h2><table><tr class=c><td>#</td><td></td><td>Design</td><td class=bar></td><td class=n>7 days</td><td class=n>Total</td></tr>${rows.map((r, i) => `<tr><td class=c>${i + 1}</td><td class=th><span data-th="${esc(r.id)}"></span></td><td>${esc(r.name)} <span class=t${r.free ? " f" : ""}>${r.free ? "free" : "pro"}</span><div class=c>${esc(r.cat)} · ${esc(r.id)}</div></td><td class=bar style="width:30%"><div class=bar style="width:${r.n / max * 100}%"></div></td><td class=n>${r.w || ""}</td><td class=n><b>${r.n}</b></td></tr>`).join("")}</table>
<h2>Never saved</h2><details><summary>${never.length} designs</summary><div class=never>${never.map(d => `<div>${esc(d.name)} <span class=c>${esc(d.cat)}</span></div>`).join("")}</div></details>
<iframe id=app src="/?statsthumbs" style="position:absolute;width:390px;height:844px;left:-9999px;top:0;border:0" aria-hidden=true></iframe>
<script>
const f=document.getElementById("app");
f.onload=()=>{let n=0;const t=setInterval(async()=>{const w=f.contentWindow;let S=null;try{S=w.eval('SEEDS')}catch(e){}if(!(S&&w.drawExport&&w.ensureFonts)){if(++n>40)clearInterval(t);return}clearInterval(t);
  for(const el of document.querySelectorAll("[data-th]")){const d=S.find(x=>x.id===el.dataset.th);if(!d)continue;try{await w.ensureFonts(d);const c=w.drawExport(d,.16);el.style.backgroundImage="url("+c.toDataURL("image/png")+")"}catch(e){}}},250)};
</script></body></html>`;
}
let cache = { at: 0, top: [] };
async function topUsed() {
  if (Date.now() - cache.at < 60000) return cache.top;
  let all = counts;
  if (UP_URL) { try { const flat = await redis(["HGETALL", KEY]) || []; all = {}; for (let i = 0; i < flat.length; i += 2) all[flat[i]] = +flat[i + 1]; } catch (e) { console.error(e.message); } }
  const top = Object.entries(all).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([id, n]) => ({ id, n }));
  cache = { at: Date.now(), top }; return top;
}
const recent = new Map(); // simple abuse protection: max 60 hits per IP per hour
function json(res, code, obj) { res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" }); res.end(JSON.stringify(obj)); }

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  // the iOS app (capacitor://localhost) calls the Trending API cross-origin
  if (url.pathname.startsWith("/api/")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  }
  if (url.pathname === "/api/trending" && req.method === "GET") {
    topUsed().then(top => json(res, 200, { top, store: UP_URL ? "upstash" : "memory" })).catch(() => json(res, 200, { top: [] }));
    return;
  }
  if (url.pathname === "/api/used" && req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 200) req.destroy(); });
    req.on("end", () => {
      let id = ""; try { id = String(JSON.parse(body).id || ""); } catch (e) {}
      if (!/^[a-z]{1,3}\d{1,3}$/.test(id)) return json(res, 400, { ok: false });
      const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim(), now = Date.now();
      const list = (recent.get(ip) || []).filter(t => now - t < 3600e3);
      if (list.length >= 60) return json(res, 429, { ok: false });
      list.push(now); recent.set(ip, list);
      addUse(id).finally(() => json(res, 200, { ok: true }));
    });
    return;
  }
  if (url.pathname === "/api/ev" && req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 200) req.destroy(); });
    req.on("end", () => {
      let e = "", p = ""; try { const j = JSON.parse(body); e = String(j.e || ""); p = j.p === "ios" ? "ios" : "web"; } catch (err) {}
      if (!EVENTS.includes(e)) return json(res, 400, { ok: false });
      const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim(), now = Date.now();
      const list = (recent.get(ip) || []).filter(t => now - t < 3600e3);
      if (list.length >= 60) return json(res, 429, { ok: false });
      list.push(now); recent.set(ip, list);
      addEvent(e, p).finally(() => json(res, 200, { ok: true }));
    });
    return;
  }
  if (url.pathname === "/stats") {
    if (!STATS_KEY || url.searchParams.get("key") !== STATS_KEY) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Niet gevonden"); }
    statsPage().then(html => { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" }); res.end(html); })
      .catch(e => { res.writeHead(500, { "Content-Type": "text/plain" }); res.end("stats error: " + e.message); });
    return;
  }
  if (url.pathname === "/healthz") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("ok"); }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405); return res.end(); }
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/") rel = "/index.html";
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Niet gevonden"); }
    const ext = path.extname(file).toLowerCase();
    const cache = ext === ".html" || rel === "/sw.js" || ext === ".webmanifest" ? "no-cache" : "public, max-age=604800";
    res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream", "Cache-Control": cache });
    res.end(req.method === "HEAD" ? undefined : data);
  });
}).listen(PORT, () => {
  console.log("Studio Typo op poort " + PORT);
  if (UP_URL) redis(["PING"]).then(r => console.log("Trending storage: Upstash OK (" + r + ")")).catch(e => console.error("Trending storage: Upstash FAILED – " + e.message));
  else console.log("Trending storage: memory (no Upstash env vars)");
});
