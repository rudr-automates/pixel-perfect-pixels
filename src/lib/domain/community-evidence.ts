import type { CommunityEvidenceSummary, CommunityReport, CommunitySignal } from "./types";

/**
 * Community signal — DEMO HEURISTIC.
 *
 * This summarizes independently reported experience. It is deliberately simple,
 * deterministic and explainable. It is NOT a scientific measure of effectiveness
 * and must always be labelled as community signal in the UI.
 */
export const COMMUNITY_SIGNAL_DISCLAIMER =
  "Community signal summarizes independently reported experience. It does not establish scientific effectiveness.";

const MIXED_UPPER_BOUND = 0.6;

export function summarizeCommunityEvidence(reports: CommunityReport[]): CommunityEvidenceSummary {
  const attempts = reports.length;
  const positive = reports.filter((r) => r.outcome === "positive").length;
  const neutral = reports.filter((r) => r.outcome === "neutral").length;
  const negative = reports.filter((r) => r.outcome === "negative").length;
  const uniqueContributors = new Set(reports.map((r) => r.reporterId)).size;
  const uniqueLocations = new Set(reports.map((r) => r.location)).size;
  const positiveRate = attempts === 0 ? 0 : Math.round((positive / attempts) * 100);

  return {
    attempts,
    positive,
    neutral,
    negative,
    uniqueContributors,
    uniqueLocations,
    positiveRate,
    signal: deriveSignal({ attempts, positive, uniqueContributors, uniqueLocations }),
  };
}

function deriveSignal(input: {
  attempts: number;
  positive: number;
  uniqueContributors: number;
  uniqueLocations: number;
}): CommunitySignal {
  const { attempts, positive, uniqueContributors, uniqueLocations } = input;
  if (attempts === 0) return "none";

  const positiveRate = positive / attempts;

  // Reports that disagree are preserved as "mixed" rather than resolved.
  if (attempts >= 5 && uniqueContributors >= 3 && positiveRate <= MIXED_UPPER_BOUND) {
    return "mixed";
  }

  if (uniqueContributors >= 5 && attempts >= 12 && uniqueLocations >= 3) return "strong";
  if (uniqueContributors >= 3 && attempts >= 5 && uniqueLocations >= 2) return "moderate";
  return "low";
}

export const SIGNAL_LABEL: Record<CommunitySignal, string> = {
  none: "No reports yet",
  low: "Low",
  moderate: "Moderate",
  strong: "Strong",
  mixed: "Mixed",
};
