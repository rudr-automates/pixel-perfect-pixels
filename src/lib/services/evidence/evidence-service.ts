import type { KnowledgeRepository } from "../../repositories/knowledge-repository";
import type { EvidenceAssessment } from "../../domain/types";

/** Scientific / expert evidence lookup. Kept separate from community evidence. */
export class EvidenceService {
  constructor(private readonly repository: KnowledgeRepository) {}

  async getEvidence(recordId: string): Promise<EvidenceAssessment> {
    const sources = await this.repository.listEvidence(recordId);
    return { relationship: sources[0]?.relationship ?? null, sources };
  }
}
