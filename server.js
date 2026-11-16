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
async function addUse(id) {
  counts[id] = (counts[id] || 0) + 1; dirty = true;
  if (UP_URL) { try { await redis(["HINCRBY", KEY, id, 1]); } catch (e) { console.error(e.message); } }
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
