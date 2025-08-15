import "dotenv/config";
import express from "express";
import { Store, Contract } from "./store.js";

const app = express();
app.use(express.json());

const PORT = Number(process.env.CORE_PORT || 9010);

// Get: Contract
app.get("/contracts/:name", (_req, res) => {
  const c = Store.get();
  res.setHeader("ETag", c.version);
  res.json(c);
});

// Receive: Drift report from Receptor (record only/MVP)
app.post("/drift", (req, res) => {
  // For production use, send to persistent storage. Here, console output.
  console.log("[core] drift:", JSON.stringify(req.body));
  res.json({ ok: true });
});

// Note: Contract patch from Receptor (reflected in a small increase in SemVer)
app.post("/contracts/:name/patch", (req, res) => {
  const diff = req.body?.diff as Partial<Contract>;
  if (!diff) return res.status(400).json({ ok: false, error: "diff required" });
  const updated = Store.patch(diff);
  console.log("[core] contract patched ->", updated.version);
  res.json({ ok: true, contract: updated });
});

app.get("/healthz", (_, _res) => _.json({ ok: true }));

app.listen(PORT, () => console.log(`[core] listening :${PORT}`));
