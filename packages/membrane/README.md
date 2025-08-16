# @synaptix/membrane — Selective Permeability Gateway

**Membrane** is the per-Actor “cell membrane”: it protects and regulates traffic, validates contract adherence, and converts external client protocols into an internal dialogue model. By default it is **passive** (observe-first); optional light interventions can be enabled.

## Responsibilities

- **Selective permeability**: lightweight request/response checks against Core’s contract.
- **Protocol conversion**: normalize incoming calls to your Dialogue model (MVP: passthrough).
- **Passive observation**: forward observations to Receptor (no blocking by default).
- **Immune reaction (optional)**: redact/route/temperature hints for A/C lanes.

## Run

```bash
yarn build:membrane
yarn dev:membrane
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

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Susumu Fujii](https://github.com/sujii)
