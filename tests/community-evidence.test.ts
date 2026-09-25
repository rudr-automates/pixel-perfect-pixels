import { describe, expect, it } from "bun:test";
import { summarizeCommunityEvidence } from "../src/lib/domain/community-evidence";
import type { CommunityReport } from "../src/lib/domain/types";

function r(i: number, reporter: string, location: string, outcome: "positive" | "neutral" | "negative"): CommunityReport {
  return { id: `r${i}`, reporterId: reporter, location, outcome } as unknown as CommunityReport;
}

describe("summarizeCommunityEvidence", () => {
  it("returns none with no reports", () => {
    expect(summarizeCommunityEvidence([]).signal).toBe("none");
  });
  it("is low under 3 contributors", () => {
    const reports = Array.from({ length: 6 }, (_, i) => r(i, `c${i % 2}`, `l${i % 3}`, "positive"));
    expect(summarizeCommunityEvidence(reports).signal).toBe("low");
  });
  it("is moderate at 3 contributors, 5 attempts, 2 locations", () => {
    const reports = Array.from({ length: 5 }, (_, i) => r(i, `c${i % 3}`, `l${i % 2}`, "positive"));
    const s = summarizeCommunityEvidence(reports);
    expect(s.signal).toBe("moderate");
    expect(s.positiveRate).toBe(100);
  });
  it("is strong at 5 contributors, 12 attempts, 3 locations", () => {
    const reports = Array.from({ length: 12 }, (_, i) => r(i, `c${i % 5}`, `l${i % 3}`, "positive"));
    expect(summarizeCommunityEvidence(reports).signal).toBe("strong");
  });
  it("keeps disagreement visibly mixed", () => {
    const reports = Array.from({ length: 6 }, (_, i) => r(i, `c${i % 3}`, `l${i % 2}`, i % 2 ? "negative" : "positive"));
    expect(summarizeCommunityEvidence(reports).signal).toBe("mixed");
  });
});
