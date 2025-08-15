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
