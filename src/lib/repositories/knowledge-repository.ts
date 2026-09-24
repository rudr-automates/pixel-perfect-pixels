import type {
  Contributor,
  CreateKnowledgeInput,
  CommunityReport,
  EvidenceSource,
  KnowledgeRecord,
  KnowledgeRecordDetail,
  KnowledgeRecordSummary,
  OutcomeReportInput,
  SearchFilters,
} from "../domain/types";

/**
 * The single data-access contract used by every service.
 * Swapping DemoKnowledgeRepository for SupabaseKnowledgeRepository must not
 * require any change in hooks, features or components.
 */
export interface KnowledgeRepository {
  listRecords(filters?: SearchFilters): Promise<KnowledgeRecordSummary[]>;
  searchRecords(terms: string[], filters?: SearchFilters): Promise<KnowledgeRecordSummary[]>;
  getRecordDetail(id: string): Promise<KnowledgeRecordDetail | null>;
  getRecord(id: string): Promise<KnowledgeRecord | null>;
  getContributor(id: string): Promise<Contributor | null>;
  listReports(recordId: string): Promise<CommunityReport[]>;
  listEvidence(recordId: string): Promise<EvidenceSource[]>;
  createRecord(input: CreateKnowledgeInput): Promise<KnowledgeRecord>;
  addOutcomeReport(input: OutcomeReportInput): Promise<CommunityReport>;
  getCorpusStats(): Promise<{ records: number; contributors: number; reports: number }>;
}
