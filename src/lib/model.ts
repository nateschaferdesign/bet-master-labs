export const MODEL = {
  id: "BML-TRUST-1",
  version: "2026.09.02",
  name: "Trust Index",
  updatedAt: "2026-09-02",
  sampleFloor: 150,
  weights: {
    sample: 0.28,
    clv: 0.32,
    units: 0.22,
    hitRate: 0.18,
  },
  captureWindowHours: 24,
  notes:
    "Rank is computed from public timestamps, posted price, and close. Money cannot buy a place on the board.",
} as const;

export type VerifyTier = "audit" | "ticket" | "tracked";

export const TIER_COPY: Record<VerifyTier, { label: string; detail: string }> = {
  audit: {
    label: "Audit",
    detail: "Timestamp, posted price, close, and an independent public source are on file.",
  },
  ticket: {
    label: "Ticket",
    detail: "A public archive or ticket image was submitted and is under or through review.",
  },
  tracked: {
    label: "Tracked",
    detail: "The book is timestamped in public. Sample is still building toward the ranking floor.",
  },
};

export function verifyTier(input: { bets: number; verification: "verified" | "building" }): VerifyTier {
  if (input.verification === "verified" && input.bets >= 150) return "audit";
  if (input.verification === "verified") return "ticket";
  return "tracked";
}

export function trustFormulaCopy() {
  const w = MODEL.weights;
  return `Trust ≈ ${Math.round(w.sample * 100)}% sample + ${Math.round(w.clv * 100)}% close-line value + ${Math.round(w.units * 100)}% units + ${Math.round(w.hitRate * 100)}% settled hit rate. Floor ${MODEL.sampleFloor} bets to rank.`;
}
