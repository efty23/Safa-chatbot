// AI Chatbot Server — powered by Google Gemini (free tier)
require("dotenv").config();
const express = require("express");
const path = require("path");
const { CLIENT } = require("./client-config");

const app = express();
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Rate limit: 20 messages/minute per IP
const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => t > now - 60000);
  if (arr.length >= 20) {
    return res.status(429).json({ error: "Too many messages. Please wait a minute." });
  }
  arr.push(now);
  hits.set(ip, arr);
  next();
}

app.get("/api/config", (req, res) => {
  const { systemPrompt, ...publicConfig } = CLIENT;
  res.json(publicConfig);
});

app.post("/api/chat", rateLimit, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array required" });
    }
    const trimmed = messages.slice(-12).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 2000) }],
    }));

    const model = process.env.MODEL || "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: CLIENT.systemPrompt }] },
        contents: trimmed,
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
      }),
    });

    const data = await response.json();
    if (data.error) {
      console.error("API error:", data.error);
      return res.status(502).json({ error: "AI service error. Try again." });
    }
    const reply = (data.candidates?.[0]?.content?.parts || [])
      .map((p) => p.text || "")
      .join("\n")
      .trim();
    if (!reply) {
      return res.status(502).json({ error: "No response. Try rephrasing." });
    }
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error. Try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Chatbot running on port ${PORT}`);
});
