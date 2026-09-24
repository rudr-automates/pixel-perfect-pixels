import type { KnowledgeRepository } from "../../repositories/knowledge-repository";
import { summarizeCommunityEvidence } from "../../domain/community-evidence";
import { outcomeReportInputSchema } from "../../validation/schemas";
import type { CommunityEvidenceSummary, OutcomeReportInput } from "../../domain/types";

export interface OutcomeSubmissionResult {
  previousAttempts: number;
  community: CommunityEvidenceSummary;
}

/** Records an outcome and returns the updated community evidence state. */
export class OutcomeService {
  constructor(private readonly repository: KnowledgeRepository) {}

  async report(input: OutcomeReportInput): Promise<OutcomeSubmissionResult> {
    const parsed = outcomeReportInputSchema.parse(input);
    const before = await this.repository.listReports(parsed.knowledgeRecordId);
    await this.repository.addOutcomeReport(parsed);
    const after = await this.repository.listReports(parsed.knowledgeRecordId);
    return {
      previousAttempts: before.length,
      community: summarizeCommunityEvidence(after),
    };
  }
}
