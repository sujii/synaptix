import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());
const PORT = Number(process.env.RECEPTOR_PORT || 9012);
const CORE = process.env.CORE_BASE || "http://localhost:9010";
const DRIFT_TH = Number(process.env.DRIFT_TH || 0.6);

// Simple and lightweight drift detector (lexical + policy + latency)
function sent(s: string) {
  return s.split(/[.!?\n]/).filter(Boolean).length;
}
function meta(s: string) {
  return (s.match(/(like|similar)/g) || []).length;
}
function toks(s: string) {
  return Math.ceil(s.length / 3.5);
}
function jaccardChars(a: string, b: string) {
  const A = new Set(a.split(""));
  const B = new Set(b.split(""));
  const inter = [...A].filter((x) => B.has(x)).length;
  const uni = new Set([...A, ...B]).size || 1;
  return inter / uni;
}
let ewmaLatency = 0;

app.post("/observe", async (req, res) => {
  const o = req.body as any;
  const out = String(o?.res?.output || "");
  const lane = (o?.lane || "A") as "A" | "B" | "C";

  // lexical
  const s = sent(out),
    m = meta(out),
    t = toks(out);
  const lexScore = Math.min(
    1,
    (s > 4 ? 0.34 : 0) + (m > 1 ? 0.33 : 0) + (t > 900 ? 0.33 : 0)
  );

  //policy (deny_hit/rag missing)
  const denyHit = (o?.violations?.res || []).includes("deny_hit");
  const ragPoor = (o?.res?.rag?.length || 0) < (lane === "B" ? 0 : 2);
  const polScore = (denyHit ? 0.6 : 0) + (ragPoor ? 0.4 : 0);

  // latency (EWMA)
  const lt = Number(o?.res?.latencyMs || 0);
  ewmaLatency = ewmaLatency === 0 ? lt : 0.2 * lt + 0.8 * ewmaLatency;
  const latScore =
    ewmaLatency > 3500 ? Math.min(1, (ewmaLatency - 3500) / 3500) : 0;

  // Fusion
  const score = Number(
    (lexScore * 0.4 + polScore * 0.4 + latScore * 0.2).toFixed(3)
  );
  const severe = score >= DRIFT_TH;

  // Report to core (Passive -> Adaptive Material)
  fetch(`${CORE}/drift`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ts: Date.now(),
      lane,
      score,
      facets: { lexScore, polScore, latScore, denyHit, ragPoor, ewmaLatency },
    }),
  }).catch(() => {});

  // Propose a "contract patch candidate" (minimal)
  if (severe) {
    const diff: any = { schema: { response: {} }, policies: { lanes: {} } };
    if (s > 4) diff.schema.response.maxSentences = 4; // Resubmit explicit documentation
    if (m > 1) diff.schema.response.maxMetaphors = 1;
    if (t > 900) diff.schema.response.maxTokens = 900;
    if (ragPoor && lane !== "B")
      diff.policies.lanes = {
        A: { minRag: 2, deny: ["explicit", "non-restrictive"] },
        C: { minRag: 2, deny: ["explicit"] },
      };

    fetch(`${CORE}/contracts/default-actor.chat/patch`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ diff }),
    }).catch(() => {});
  }
  res.json({ ok: true, drift: score, severe });
});

app.get("/healthz", (_req, res) => res.json({ ok: true, ewmaLatency }));
app.listen(PORT, () => console.log(`[receptor] listening :${PORT}`));
