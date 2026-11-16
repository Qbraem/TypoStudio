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

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
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
