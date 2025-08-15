# Project Code Documentation

Generated on 2025-08-16T01:38:52.011488+0900

## Directives Structure
```
.
├── LICENSE
├── package.json
├── packages
│   ├── core
│   │   ├── package.json
│   │   ├── README.md
│   │   └── src
│   │       ├── index.ts
│   │       └── store.ts
│   ├── membrane
│   │   ├── package.json
│   │   ├── README.md
│   │   └── src
│   │       └── index.ts
│   └── receptor
│       ├── package.json
│       ├── README.md
│       └── src
│           └── index.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── project_code.md
├── README.md
└── tsconfig.json
```

## Table of Index

- [`./README.md`](#--readme-md)
- [`./tsconfig.json`](#--tsconfig-json)
- [`./packages/core/README.md`](#--packages-core-readme-md)
- [`./packages/core/src/index.ts`](#--packages-core-src-index-ts)
- [`./packages/core/src/store.ts`](#--packages-core-src-store-ts)
- [`./packages/core/package.json`](#--packages-core-package-json)
- [`./packages/receptor/README.md`](#--packages-receptor-readme-md)
- [`./packages/receptor/src/index.ts`](#--packages-receptor-src-index-ts)
- [`./packages/receptor/package.json`](#--packages-receptor-package-json)
- [`./packages/membrane/README.md`](#--packages-membrane-readme-md)
- [`./packages/membrane/src/index.ts`](#--packages-membrane-src-index-ts)
- [`./packages/membrane/package.json`](#--packages-membrane-package-json)
- [`./package.json`](#--package-json)

## <a id="--readme-md"></a> ./README.md
```1
# Synaptix

**An adaptive software architecture for building self-regulating, resilient systems inspired by biological life.**

Synaptix is a modular runtime for contract-aware conversational systems. It splits responsibilities into:

- **@synaptix/core** — a Single Source of Truth (SSOT) for contracts (“genetic information”) that governs behavior.
- **@synaptix/membrane** — a selective-permeability gateway per Actor that validates contract adherence, converts protocols, and (optionally) applies light immune reactions.
- **@synaptix/receptor** — a passive observation layer that detects contract drift over time and feeds adaptive signals back to Core.

This monorepo provides a minimal, production-minded scaffold you can run today and evolve later (SSE hot-reload, OTel, advanced detectors, etc.).

---

### What is Synaptix?

Synaptix is not just a collection of libraries; it is an architectural pattern for designing complex software systems that can adapt and evolve. It is the practical implementation of the **SCDD (Structured Collaborative Design and Development)** theory, which treats system design as a living, verifiable contract.

Our goal is to move beyond rigid, brittle systems and create software that behaves like a biological organism: possessing a core genetic identity, a protective boundary, and a sensory system to adapt to its ever-changing environment.

### Core Concepts

The Synaptix ecosystem is modeled after the fundamental components of a living cell:

- 🧬 **The Genetic Code (`@synaptix/core`):** Every system has a central, versioned Single Source of Truth (SSOT) called the **Contract**. This is the system's DNA, defining its invariants, schemas, and policies.

- 🛡️ **The Cell Membrane (`@synaptix/membrane`):** Each service or `Actor` is protected by a membrane. This layer provides **selective permeability**, ensuring all interactions strictly adhere to the genetic Contract, translating external signals into the system's internal language.

- 🧠 **The Sensory System (`@synaptix/receptor`):** The system continuously observes its own behavior and its interaction with the environment. This sensory organ detects **"behavioral drift"**—the subtle, real-world deviation from the static Contract—and feeds this information back to the core, enabling the system to learn and adapt.

### The Adaptive Loop

These components work in a perpetual feedback loop, enabling the system's self-regulation and evolution:

1.  **`@synaptix/core`** distributes the current version of the **Contract**.
2.  **`@synaptix/membrane`** enforces this Contract on all interactions, while sending observational data of real-world traffic to the Receptor.
3.  **`@synaptix/receptor`** analyzes this data, detects drift, and proposes a **Contract Patch** back to the Core.
4.  **`@synaptix/core`** integrates the patch, creating a new version of the Contract, which is then redistributed.

This is the heartbeat of a Synaptix system.

### Getting Started

This repository is a pnpm monorepo.

```bash
# Clone the repository
git clone [repository-url]
cd synaptix

# Install dependencies
pnpm i

# Run all services in development mode
pnpm dev:all
```

## Workspace layout

```
packages/
  core/       # SSOT contracts API
  membrane/   # selective gateway in front of your LLM app
  receptor/   # drift detection & feedback
```

## Design principles

- **SSOT first**: static contract lives in Core and circulates system-wide.
- **Passive before active**: Membrane observes → classifies → signals; interventions are opt-in and minimal.
- **Adaptive loop**: Membrane (signal) → Receptor (drift) → Core (contract patch) → Membrane (new policy).
- **Swap-friendly**: UPSTREAM (your app) remains unchanged; Synaptix wraps around it.

## Environment (excerpt)

See `.env.example`.

- `CORE_PORT`, `MEMBRANE_PORT`, `RECEPTOR_PORT`
- `UPSTREAM_BASE` (your existing /chat endpoint)
- `MEMBRANE_INTERVENE` (0: passive, 1: allow light interventions)
- `DRIFT_TH` (receptor’s drift threshold)

## Roadmap (high level)

- Core: SSE/ETag contract streaming; JSON-Schema + declarative policy DSL; Git/SQLite storage.
- Membrane: multi-provider protocol transforms (OpenAI/Anthropic/Custom Dialogue); OTel spans.
- Receptor: embedding-distribution drift (cosine/EWMA), lightweight style classifier, richer anomaly analytics.
```

## <a id="--tsconfig-json"></a> ./tsconfig.json
```2
{
  "compilerOptions": {
    "target": "ES2022", "module": "ES2022", "moduleResolution": "Bundler",
    "strict": true, "esModuleInterop": true, "skipLibCheck": true,
    "outDir": "dist", "types": ["node"]
  }
}
```

## <a id="--packages-core-readme-md"></a> ./packages/core/README.md
```3
# @synaptix/core — Contract SSOT

**The genetic core of the Synaptix ecosystem. Manages and distributes the versioned Single Source of Truth (SSOT) known as the Contract.**

**Core** stores and serves the canonical contract (“genetic information”) that governs all Actors. It is the single source of truth for invariants (style, limits), protocol schema fragments, and lane policies. It also accepts drift reports and patch proposals to evolve the contract over time.

---

## What it does

- Exposes the **current contract** (versioned).
- Accepts **drift signals** from Receptor.
- Accepts **contract patch proposals**, bumps version, and republishes.

## Role in the Synaptix Ecosystem

`@synaptix/core` is the beating heart of any Resonance system. It is responsible for a single, critical task: safeguarding and distributing the **Contract**. This Contract is the "genetic code" that defines the identity, rules, and structure of the entire system.

All other components, such as `@synaptix/membrane` and `@synaptix/receptor`, look to the Core to understand the system's "ground truth" at any given moment.

## Key Features

- **Contract as SSOT:** Provides a centralized, canonical source for the system's schemas, invariants, and policies.
- **Versioned & Immutable:** Every change to the Contract results in a new, immutable version, ensuring traceability and stable rollouts.
- **API-driven Access:** Exposes a simple API for other services to fetch the current Contract.
- **Adaptive Update Mechanism:** Receives and applies `Contract Patch` proposals from `@synaptix/receptor`, forming the crucial final step in the system's adaptive feedback loop.

## HTTP API (minimal)

- `GET /contracts/:name` → current contract (ETag set to version).
- `POST /drift` → ingest passive drift report (`{ lane, score, facets… }`).
- `POST /contracts/:name/patch` → apply a shallow contract diff; increments semantic version.

## Usage

**Run**

```bash
pnpm --filter @synaptix/core dev
# defaults to CORE_PORT=9010
```

Another service would typically fetch the contract on startup or periodically:

```typescript
async function getLatestContract() {
  const response = await fetch("http://localhost:9010/contracts/my-actor");
  const contractVersion = response.headers.get("ETag");
  const contract = await response.json();

  console.log(`Loaded Contract version: ${contractVersion}`);
  // ... use the contract to configure behavior
}
```

## Configuration

- `CORE_PORT`: HTTP port (default 9010).

## Extensibility (planned)

- **SSE/ETag** streaming for hot-reload.
- **JSON-Schema + declarative policy DSL**.
- **Git/SQLite** backed persistence and version history.
```

## <a id="--packages-core-src-index-ts"></a> ./packages/core/src/index.ts
```4
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
```

## <a id="--packages-core-src-store-ts"></a> ./packages/core/src/store.ts
```5
export type Contract = {
  name: string; // e.g., "default-actor.chat"
  version: string; // semver
  invariants: string[]; // 2nd person = "you", metaphor <= 1, 2-4 reply sentences, etc.
  schema: {
    // Dialogue protocol type fragment (minimum)
    request: { minMsgs: number; maxMsgs: number };
    response: { maxSentences: number; maxMetaphors: number; maxTokens: number };
  };
  policies: {
    lanes: {
      A: { deny: string[]; minRag: number };
      B: { deny: string[]; minRag: number };
      C: { deny: string[]; minRag: number };
    };
  };
};

const initial: Contract = {
  name: "default-actor.chat",
  version: "1.0.0",
  invariants: [
    "Second person = you",
    "Metaphor <= 1",
    "Responses should be 2-4 sentences long",
    "Reference the most recent shared memory at the beginning",
  ],
  schema: {
    request: { minMsgs: 1, maxMsgs: 40 },
    response: { maxSentences: 4, maxMetaphors: 1, maxTokens: 900 },
  },
  policies: {
    lanes: {
      A: { deny: ["explicit", "non-restrictive"], minRag: 2 },
      B: { deny: [], minRag: 0 },
      C: { deny: ["explicit"], minRag: 2 },
    },
  },
};

let current = initial;

export const Store = {
  get: () => current,
  patch: (diff: Partial<Contract>) => {
    // Super simple: shallow-merge + version slightly increased
    current = {
      ...current,
      ...diff,
      policies: { ...(current.policies || {}), ...(diff.policies || {}) },
    } as Contract;
    const [maj, min, patch] = current.version.split(".").map(Number);
    current.version = [maj, min, (patch || 0) + 1].join(".");
    return current;
  },
};
```

## <a id="--packages-core-package-json"></a> ./packages/core/package.json
```6
{
  "name": "@synaptix/core",
  "description": "Contract SSOT: serves versioned behavior/policy specs, ingests drift, and applies contract patches.",
  "author": {
    "name": "Susumu Fujii",
    "url": "https://github.com/sujii"
  },
  "license": "MIT",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "tsx": "^4.15.7",
    "typescript": "^5.5.4"
  }
}
```

## <a id="--packages-receptor-readme-md"></a> ./packages/receptor/README.md
```7
# @synaptix/receptor — Passive Drift Detection & Feedback

**Receptor** is the observability interface for the Synaptix ecosystem. It passively receives post-membrane dialogue traces, measures **contract drift** over time (lexical/policy/latency in the MVP), and feeds adaptive signals back to Core as patch proposals.

## Responsibilities

- **Observe**: receive traffic summaries (`/observe`) from Membrane.
- **Detect drift**: simple composite score (lexical limits, policy hits, latency EWMA).
- **Feedback**: send drift reports to Core; propose minimal contract diffs when thresholds are exceeded.

## Run

```bash
pnpm --filter @synaptix/receptor dev
# RECEPTOR_PORT=9012 CORE_BASE=http://localhost:9010 DRIFT_TH=0.6
```

## Environment

- `RECEPTOR_PORT`: HTTP port (default 9012)
- `CORE_BASE`: Core endpoint for drift & patch
- `DRIFT_TH`: drift threshold to trigger patch proposals

## Endpoints

- `POST /observe` → ingest observation (`{ lane, res.output, rag[], latencyMs… }`); compute drift; POST to Core:

  - `POST /drift` (always)
  - `POST /contracts/:name/patch` (when severe)

## Extensibility (planned)

- **Embedding distribution drift** (cosine/EWMA over sliding windows).
- **Lightweight style classifier** (prompted or tiny model).
- **Analytics & storage** (ClickHouse, OTel metrics).
```

## <a id="--packages-receptor-src-index-ts"></a> ./packages/receptor/src/index.ts
```8
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
```

## <a id="--packages-receptor-package-json"></a> ./packages/receptor/package.json
```9
{
  "name": "@synaptix/receptor",
  "description": "Passive drift detection and feedback loop that turns observations into Core contract updates.",
  "author": {
    "name": "Susumu Fujii",
    "url": "https://github.com/sujii"
  },
  "license": "MIT",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "tsx": "^4.15.7",
    "typescript": "^5.5.4"
  }
}
```

## <a id="--packages-membrane-readme-md"></a> ./packages/membrane/README.md
```10
# @synaptix/membrane — Selective Permeability Gateway

**Membrane** is the per-Actor “cell membrane”: it protects and regulates traffic, validates contract adherence, and converts external client protocols into an internal dialogue model. By default it is **passive** (observe-first); optional light interventions can be enabled.

## Responsibilities

- **Selective permeability**: lightweight request/response checks against Core’s contract.
- **Protocol conversion**: normalize incoming calls to your Dialogue model (MVP: passthrough).
- **Passive observation**: forward observations to Receptor (no blocking by default).
- **Immune reaction (optional)**: redact/route/temperature hints for A/C lanes.

## Run

```bash
pnpm --filter @synaptix/membrane dev
# MEMBRANE_PORT=9011 UPSTREAM_BASE=http://localhost:8787 CORE_BASE=http://localhost:9010 RECEPTOR_BASE=http://localhost:9012
```

## Environment

- `MEMBRANE_PORT`: HTTP port (default 9011)
- `UPSTREAM_BASE`: your existing app (e.g. Actors `/chat`)
- `CORE_BASE`: Core endpoint for contract retrieval
- `RECEPTOR_BASE`: Receptor observation sink
- `MEMBRANE_INTERVENE`: `0` passive (default), `1` allow minimal interventions

## Endpoints

- `POST /chat` → forwards to UPSTREAM, validates/observes, ships report to Receptor.

## Extensibility (planned)

- **Protocol transforms**: OpenAI / Anthropic / Custom Dialogue routers.
- **Hot-reload** via Core SSE/ETag.
- **OpenTelemetry** spans for end-to-end tracing.
```

## <a id="--packages-membrane-src-index-ts"></a> ./packages/membrane/src/index.ts
```11
import "dotenv/config";
import express from "express";
import crypto from "node:crypto";

const app = express();
app.use(express.json());
const PORT = Number(process.env.MEMBRANE_PORT || 9011);
const CORE = process.env.CORE_BASE || "http://localhost:9010";
const RECEPTOR = process.env.RECEPTOR_BASE || "http://localhost:9012";
const UPSTREAM = process.env.UPSTREAM_BASE || "http://localhost:8787";
const INTERVENE = process.env.MEMBRANE_INTERVENE === "1";

type Contract = {
  version: string;
  schema: {
    request: { minMsgs: number; maxMsgs: number };
    response: { maxSentences: number; maxMetaphors: number; maxTokens: number };
  };
  policies: {
    lanes: Record<"A" | "B" | "C", { deny: string[]; minRag: number }>;
  };
};

let cached: { etag?: string; contract?: Contract } = {};

async function fetchContract() {
  const r = await fetch(`${CORE}/contracts/default-actor.chat`);
  if (!r.ok) throw new Error(`core fetch failed: ${r.status}`);
  cached.etag = r.headers.get("ETag") || undefined;
  cached.contract = (await r.json()) as Contract;
}
await fetchContract();

function sentenceCount(s: string) {
  return s.split(/[.!?\n]/).filter(Boolean).length;
}
function metaphorCount(s: string) {
  return (s.match(/(like|similar)/g) || []).length;
}
function tokenEst(s: string) {
  return Math.ceil(s.length / 3.5);
}

function toDialogue(body: any) {
  // Protocol conversion here: OpenAI compatible → Dialogue generic (MVP: transparent)
  return body;
}

app.post("/chat", async (req, res) => {
  const started = Date.now();
  const lane = (req.body?.lane || "A") as "A" | "B" | "C";
  // Lightweight validation based on contract (**Do not block**, only record)
  const msgs = req.body?.messages || [];
  const schema = cached.contract!.schema;
  const reqViolations = [];
  if (msgs.length < schema.request.minMsgs)
    reqViolations.push("too_few_messages");
  if (msgs.length > schema.request.maxMsgs)
    reqViolations.push("too_many_messages");

  // Forward upstream
  const upstream = await fetch(`${UPSTREAM}/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(toDialogue(req.body)),
  });
  const payload = await upstream.json();

  // Passive observation (inspection of response)
  const out = String(payload.output || "");
  const rag = payload.rag || [];
  const respViolations: string[] = [];

  const sCount = sentenceCount(out);
  const mCount = metaphorCount(out);
  const tCount = tokenEst(out);

  if (sCount > schema.response.maxSentences)
    respViolations.push("too_many_sentences");
  if (mCount > schema.response.maxMetaphors)
    respViolations.push("too_many_metaphors");
  if (tCount > schema.response.maxTokens)
    respViolations.push("too_many_tokens");

  const deny = cached.contract!.policies.lanes[lane].deny;
  if (deny.length && new RegExp(deny.join("|"), "i").test(out))
    respViolations.push("deny_hit");

  // Send observations to the Receptor (passive)
  const obs = {
    ts: Date.now(),
    lane,
    req: { userId: req.body?.userId, messages: msgs },
    res: { output: out, rag, latencyMs: Date.now() - started },
    meta: {
      model: "upstream",
      temperature: req.body?.temperature ?? 0.9,
      top_p: req.body?.top_p ?? 0.9,
    },
    violations: { req: reqViolations, res: respViolations },
  };
  fetch(`${RECEPTOR}/observe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(obs),
  }).catch(() => {});

  // Minimal immune response (optional)
  if (INTERVENE && lane !== "B" && respViolations.includes("deny_hit")) {
    return res.json({
      ...payload,
      output:
        "(Adjusted by epidermal system)\n" +
        out.replace(new RegExp(deny.join("|"), "ig"), "[redacted]"),
    });
  }
  return res.json(payload);
});

app.get("/healthz", (_req, res) =>
  res.json({ ok: true, version: cached.etag || "unknown" })
);
app.listen(PORT, () =>
  console.log(`[membrane] listening :${PORT}, upstream=${UPSTREAM}`)
);
```

## <a id="--packages-membrane-package-json"></a> ./packages/membrane/package.json
```12
{
  "name": "@synaptix/membrane",
  "description": "Selective-permeability gateway for Actors: validates against contracts, normalizes protocols, and observes traffic.",
  "author": {
    "name": "Susumu Fujii",
    "url": "https://github.com/sujii"
  },
  "license": "MIT",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "tsx": "^4.15.7",
    "typescript": "^5.5.4"
  }
}
```

## <a id="--package-json"></a> ./package.json
```13
{
  "name": "synaptix",
  "description": "Monorepo for contract-aware conversational systems: Core (SSOT), Membrane (gateway), Receptor (drift feedback).",
  "author": {
    "name": "Susumu Fujii",
    "url": "https://github.com/sujii"
  },
  "license": "MIT",
  "private": true,
  "packageManager": "pnpm@10.14.0",
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:core": "pnpm --filter @synaptix/core dev",
    "dev:membrane": "pnpm --filter @synaptix/membrane dev",
    "dev:receptor": "pnpm --filter @synaptix/receptor dev",
    "dev:all": "concurrently -n core,membrane,receptor -c green,cyan,magenta \"pnpm dev:core\" \"pnpm dev:membrane\" \"pnpm dev:receptor\""
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

