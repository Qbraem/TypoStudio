// Studio Typo – kleine Node-server (geen dependencies)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon",
};

// Usage counts for "Trending": how often each built-in design is saved.
// Kept in memory and in a small file; on Render's free plan the file resets on a redeploy.
const COUNTS_FILE = path.join(__dirname, "usage.json");
let counts = {};
try { counts = JSON.parse(fs.readFileSync(COUNTS_FILE, "utf8")); } catch (e) {}
let dirty = false;
setInterval(() => { if (dirty) { dirty = false; fs.writeFile(COUNTS_FILE, JSON.stringify(counts), () => {}); } }, 30000);
const recent = new Map(); // simple abuse protection: max 60 hits per IP per hour
function json(res, code, obj) { res.writeHead(code, { "Content-Type": "application/json", "Cache-Control": "no-store" }); res.end(JSON.stringify(obj)); }

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/trending" && req.method === "GET") {
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([id, n]) => ({ id, n }));
    return json(res, 200, { top });
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
      counts[id] = (counts[id] || 0) + 1; dirty = true;
      json(res, 200, { ok: true });
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
}).listen(PORT, () => console.log("Studio Typo op poort " + PORT));
