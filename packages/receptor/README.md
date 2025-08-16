# @synaptix/receptor — Passive Drift Detection & Feedback

**Receptor** is the observability interface for the Synaptix ecosystem. It passively receives post-membrane dialogue traces, measures **contract drift** over time (lexical/policy/latency in the MVP), and feeds adaptive signals back to Core as patch proposals.

## Responsibilities

- **Observe**: receive traffic summaries (`/observe`) from Membrane.
- **Detect drift**: simple composite score (lexical limits, policy hits, latency EWMA).
- **Feedback**: send drift reports to Core; propose minimal contract diffs when thresholds are exceeded.

## Run

```bash
yarn build:receptor
yarn dev:receptor
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Susumu Fujii](https://github.com/sujii)
