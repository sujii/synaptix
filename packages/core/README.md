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
yarn build:core
yarn dev:core
# defaults to CORE_PORT=9010
```

Another service would typically fetch the contract on startup or periodically:

```typescript
async function getLatestContract() {
  const response = await fetch('http://localhost:9010/contracts/my-actor');
  const contractVersion = response.headers.get('ETag');
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Susumu Fujii](https://github.com/sujii)
