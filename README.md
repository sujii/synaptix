# Synaptix

**An adaptive software architecture for building self-regulating, resilient systems inspired by biological life.**

Synaptix is a modular runtime for contract-aware conversational systems. It splits responsibilities into:

- **[`@synaptix/core`](./packages/core)** — a Single Source of Truth (SSOT) for contracts (“genetic information”) that governs behavior.
- **[`@synaptix/membrane`](./packages/membrane)** — a selective-permeability gateway per Actor that validates contract adherence, converts protocols, and (optionally) applies light immune reactions.
- **[`@synaptix/receptor`](./packages/receptor)** — a passive observation layer that detects contract drift over time and feeds adaptive signals back to Core.

This monorepo provides a minimal, production-minded scaffold you can run today and evolve later (SSE hot-reload, OTel, advanced detectors, etc.).

---

### What is Synaptix?

Synaptix is not just a collection of libraries; it is an architectural pattern for designing complex software systems that can adapt and evolve. It is the practical implementation of the **[SCDD (Structured Collaborative Design and Development)](https://github.com/sujii/scdd)** theory, which treats system design as a living, verifiable contract.

Our goal is to move beyond rigid, brittle systems and create software that behaves like a biological organism: possessing a core genetic identity, a protective boundary, and a sensory system to adapt to its ever-changing environment.

### Core Concepts

The Synaptix ecosystem is modeled after the fundamental components of a living cell:

- 🧬 **The Genetic Code ([`@synaptix/core`](./packages/core)):** Every system has a central, versioned Single Source of Truth (SSOT) called the **Contract**. This is the system's DNA, defining its invariants, schemas, and policies.

- 🛡️ **The Cell Membrane ([`@synaptix/membrane`](./packages/membrane)):** Each service or `Actor` is protected by a membrane. This layer provides **selective permeability**, ensuring all interactions strictly adhere to the genetic Contract, translating external signals into the system's internal language.

- 🧠 **The Sensory System ([`@synaptix/receptor`](./packages/receptor)):** The system continuously observes its own behavior and its interaction with the environment. This sensory organ detects **"behavioral drift"**—the subtle, real-world deviation from the static Contract—and feeds this information back to the core, enabling the system to learn and adapt.

### The Adaptive Loop

These components work in a perpetual feedback loop, enabling the system's self-regulation and evolution:

1.  **`@synaptix/core`** distributes the current version of the **Contract**.
2.  **`@synaptix/membrane`** enforces this Contract on all interactions, while sending observational data of real-world traffic to the Receptor.
3.  **`@synaptix/receptor`** analyzes this data, detects drift, and proposes a **Contract Patch** back to the Core.
4.  **`@synaptix/core`** integrates the patch, creating a new version of the Contract, which is then redistributed.

This is the heartbeat of a Synaptix system.

### Getting Started

This repository is a yarn workspaces + trubo monorepo.

```bash
# Clone the repository
git clone [repository-url]
cd synaptix

# Setup yarn/berry
corepack enable
yarn init -2
yarn set version stable

# Install dependencies
yarn install

# Build dist files
yarn build

# Run all services in development mode
yarn dev
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

- [Core](./packages/core): SSE/ETag contract streaming; JSON-Schema + declarative policy DSL; Git/SQLite storage.
- [Membrane](./packages/membrane): multi-provider protocol transforms (OpenAI/Anthropic/Custom Dialogue); OTel spans.
- [Receptor](./packages/receptor): embedding-distribution drift (cosine/EWMA), lightweight style classifier, richer anomaly analytics.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Susumu Fujii](https://github.com/sujii)
