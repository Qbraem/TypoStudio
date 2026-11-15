// Typo Studio – kleine Node-server (geen dependencies, geen betalende API)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const INDEX = fs.readFileSync(path.join(__dirname, "public", "index.html"));

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/healthz") { res.writeHead(200, { "Content-Type": "text/plain" }); return res.end("ok"); }
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
    return res.end(INDEX);
  }
  res.writeHead(404, { "Content-Type": "text/plain" }); res.end("Niet gevonden");
}).listen(PORT, () => console.log("Typo Studio op poort " + PORT));
