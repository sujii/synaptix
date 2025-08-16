import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';

const app = express();
app.use(express.json());
const PORT = Number(process.env.MEMBRANE_PORT || 9011);
const CORE = process.env.CORE_BASE || 'http://localhost:9010';
const RECEPTOR = process.env.RECEPTOR_BASE || 'http://localhost:9012';
const UPSTREAM = process.env.UPSTREAM_BASE || 'http://localhost:8787';
const INTERVENE = process.env.MEMBRANE_INTERVENE === '1';

type Contract = {
  version: string;
  schema: {
    request: { minMsgs: number; maxMsgs: number };
    response: { maxSentences: number; maxMetaphors: number; maxTokens: number };
  };
  policies: {
    lanes: Record<'A' | 'B' | 'C', { deny: string[]; minRag: number }>;
  };
};

let cached: { etag?: string; contract?: Contract } = {};

async function fetchContract() {
  const r = await fetch(`${CORE}/contracts/default-actor.chat`);
  if (!r.ok) throw new Error(`core fetch failed: ${r.status}`);
  cached.etag = r.headers.get('ETag') || undefined;
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

app.post('/chat', async (req, res) => {
  const started = Date.now();
  const lane = (req.body?.lane || 'A') as 'A' | 'B' | 'C';
  // Lightweight validation based on contract (**Do not block**, only record)
  const msgs = req.body?.messages || [];
  const schema = cached.contract!.schema;
  const reqViolations = [];
  if (msgs.length < schema.request.minMsgs) reqViolations.push('too_few_messages');
  if (msgs.length > schema.request.maxMsgs) reqViolations.push('too_many_messages');

  // Forward upstream
  const upstream = await fetch(`${UPSTREAM}/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(toDialogue(req.body)),
  });
  const payload: any | unknown = await upstream.json();

  // Passive observation (inspection of response)
  const out = String(payload.output || '');
  const rag = payload.rag || [];
  const respViolations: string[] = [];

  const sCount = sentenceCount(out);
  const mCount = metaphorCount(out);
  const tCount = tokenEst(out);

  if (sCount > schema.response.maxSentences) respViolations.push('too_many_sentences');
  if (mCount > schema.response.maxMetaphors) respViolations.push('too_many_metaphors');
  if (tCount > schema.response.maxTokens) respViolations.push('too_many_tokens');

  const deny = cached.contract!.policies.lanes[lane].deny;
  if (deny.length && new RegExp(deny.join('|'), 'i').test(out)) respViolations.push('deny_hit');

  // Send observations to the Receptor (passive)
  const obs = {
    ts: Date.now(),
    lane,
    req: { userId: req.body?.userId, messages: msgs },
    res: { output: out, rag, latencyMs: Date.now() - started },
    meta: {
      model: 'upstream',
      temperature: req.body?.temperature ?? 0.9,
      top_p: req.body?.top_p ?? 0.9,
    },
    violations: { req: reqViolations, res: respViolations },
  };
  fetch(`${RECEPTOR}/observe`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(obs),
  }).catch(() => {});

  // Minimal immune response (optional)
  if (INTERVENE && lane !== 'B' && respViolations.includes('deny_hit')) {
    return res.json({
      ...payload,
      output: '(Adjusted by epidermal system)\n' + out.replace(new RegExp(deny.join('|'), 'ig'), '[redacted]'),
    });
  }
  return res.json(payload);
});

app.get('/healthz', (_req, res) => res.json({ ok: true, version: cached.etag || 'unknown' }));
app.listen(PORT, () => console.log(`[membrane] listening :${PORT}, upstream=${UPSTREAM}`));
