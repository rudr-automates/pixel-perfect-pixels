import type { KnowledgeRepository } from "./knowledge-repository";
import type {
  Contributor,
  CommunityReport,
  CreateKnowledgeInput,
  EvidenceSource,
  KnowledgeRecord,
  KnowledgeRecordDetail,
  KnowledgeRecordSummary,
  OutcomeReportInput,
  SearchFilters,
} from "../domain/types";

/**
 * LIVE MODE data access against your own Supabase project.
 *
 * The schema this maps onto is in `supabase/migrations`. Each method below is
 * an explicit integration point: implement it with the Supabase JS client and
 * map rows into the domain types. Nothing in the UI changes when you do.
 *
 * It intentionally throws rather than falling back to demo data — the product
 * must never silently present fabricated results as live results.
 */
export class SupabaseKnowledgeRepository implements KnowledgeRepository {
  private notImplemented(method: string): never {
    throw new Error(
      `SupabaseKnowledgeRepository.${method} is not implemented yet. See docs/HANDOFF.md.`,
    );
  }

  listRecords(_filters?: SearchFilters): Promise<KnowledgeRecordSummary[]> {
    this.notImplemented("listRecords");
  }

  searchRecords(_terms: string[], _filters?: SearchFilters): Promise<KnowledgeRecordSummary[]> {
    this.notImplemented("searchRecords");
  }

  getRecordDetail(_id: string): Promise<KnowledgeRecordDetail | null> {
    this.notImplemented("getRecordDetail");
  }

  getRecord(_id: string): Promise<KnowledgeRecord | null> {
    this.notImplemented("getRecord");
  }

  getContributor(_id: string): Promise<Contributor | null> {
    this.notImplemented("getContributor");
  }

  listReports(_recordId: string): Promise<CommunityReport[]> {
    this.notImplemented("listReports");
  }

  listEvidence(_recordId: string): Promise<EvidenceSource[]> {
    this.notImplemented("listEvidence");
  }

  createRecord(_input: CreateKnowledgeInput): Promise<KnowledgeRecord> {
    this.notImplemented("createRecord");
  }

  addOutcomeReport(_input: OutcomeReportInput): Promise<CommunityReport> {
    this.notImplemented("addOutcomeReport");
  }

  getCorpusStats(): Promise<{ records: number; contributors: number; reports: number }> {
    this.notImplemented("getCorpusStats");
  }
}
