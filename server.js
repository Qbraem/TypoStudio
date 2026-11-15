// Typo Studio – kleine Node-server (geen dependencies, Node 18+)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const KEY = process.env.ANTHROPIC_API_KEY || "";
const PIN = process.env.APP_PIN || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const INDEX = fs.readFileSync(path.join(__dirname, "public", "index.html"));

// eenvoudige limiet: max 20 generaties per uur per IP
const hits = new Map();
function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter(t => now - t < 3600e3);
  if (list.length >= 20) return true;
  list.push(now); hits.set(ip, list); return false;
}

function send(res, code, body, type = "application/json") {
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => { data += c; if (data.length > 60000) { reject(new Error("too big")); req.destroy(); } });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (req.method === "GET" && url.pathname === "/api/config")
    return send(res, 200, { ai: !!KEY, pin: !!PIN });

  if (req.method === "POST" && url.pathname === "/api/generate") {
    if (!KEY) return send(res, 503, { error: "Geen API-sleutel ingesteld" });
    let body;
    try { body = JSON.parse(await readBody(req)); } catch { return send(res, 400, { error: "Ongeldig verzoek" }); }
    if (PIN && String(body.pin || "") !== PIN) return send(res, 401, { error: "Verkeerde pincode" });
    const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
    if (limited(ip)) return send(res, 429, { error: "Even wachten" });
    const prompt = String(body.prompt || "").slice(0, 20000);
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify({ model: MODEL, max_tokens: 6000, messages: [{ role: "user", content: prompt }] }),
      });
      const j = await r.json();
      if (!r.ok) { console.error("Anthropic", r.status, JSON.stringify(j).slice(0, 300)); return send(res, 502, { error: "AI-fout" }); }
      const text = (j.content || []).filter(c => c.type === "text").map(c => c.text).join("");
      const a = text.indexOf("{"), b = text.lastIndexOf("}");
      if (a < 0 || b < a) return send(res, 502, { error: "Geen JSON terug" });
      return send(res, 200, { result: JSON.parse(text.slice(a, b + 1)) });
    } catch (e) {
      console.error(e); return send(res, 502, { error: "AI-fout" });
    }
  }

  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html"))
    return send(res, 200, INDEX, "text/html; charset=utf-8");
  if (url.pathname === "/healthz") return send(res, 200, "ok", "text/plain");
  send(res, 404, "Niet gevonden", "text/plain");
}).listen(PORT, () => console.log("Typo Studio op poort " + PORT));
