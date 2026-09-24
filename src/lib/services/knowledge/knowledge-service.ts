import type { KnowledgeRepository } from "../../repositories/knowledge-repository";
import { createKnowledgeInputSchema } from "../../validation/schemas";
import type {
  CreateKnowledgeInput,
  KnowledgeRecord,
  KnowledgeRecordDetail,
  KnowledgeRecordSummary,
  SearchFilters,
} from "../../domain/types";

/** Read/write use cases for the central knowledge record object. */
export class KnowledgeService {
  constructor(private readonly repository: KnowledgeRepository) {}

  list(filters?: SearchFilters): Promise<KnowledgeRecordSummary[]> {
    return this.repository.listRecords(filters);
  }

  detail(id: string): Promise<KnowledgeRecordDetail | null> {
    return this.repository.getRecordDetail(id);
  }

  stats() {
    return this.repository.getCorpusStats();
  }

  create(input: CreateKnowledgeInput): Promise<KnowledgeRecord> {
    const parsed = createKnowledgeInputSchema.parse(input);
    return this.repository.createRecord(parsed);
  }
}
