import { summarizeCommunityEvidence } from "../domain/community-evidence";
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
import { demoContributors, demoSessionContributorId } from "../demo/contributors";
import { demoEvidenceSources } from "../demo/evidence";
import { demoKnowledgeRecords } from "../demo/records";
import { demoCommunityReports } from "../demo/reports";
import type { KnowledgeRepository } from "./knowledge-repository";

/**
 * In-memory repository backing DEMO MODE.
 *
 * It holds the seeded prototype corpus plus anything created during the current
 * session (new recordings, new outcome reports), so the full product loop
 * — record → structure → search → trace → report → update — works offline.
 */
export class DemoKnowledgeRepository implements KnowledgeRepository {
  private records: KnowledgeRecord[];
  private reports: CommunityReport[];
  private evidence: EvidenceSource[];
  private contributors: Contributor[];
  private sequence = 0;

  constructor() {
    this.records = [...demoKnowledgeRecords];
    this.reports = [...demoCommunityReports];
    this.evidence = [...demoEvidenceSources];
    this.contributors = [...demoContributors];
  }

  private contributorOf(id: string): Contributor {
    const found = this.contributors.find((c) => c.id === id);
    return found ?? (this.contributors[0] as Contributor);
  }

  private reportsOf(recordId: string): CommunityReport[] {
    return this.reports.filter((r) => r.knowledgeRecordId === recordId);
  }

  private evidenceOf(recordId: string): EvidenceSource[] {
    return this.evidence.filter((e) => e.knowledgeRecordId === recordId);
  }

  private toSummary(record: KnowledgeRecord): KnowledgeRecordSummary {
    const contributor = this.contributorOf(record.contributorId);
    const evidence = this.evidenceOf(record.id);
    return {
      id: record.id,
      title: record.title,
      crop: record.crop,
      animal: record.animal,
      problem: record.problem,
      knowledgeType: record.knowledgeType,
      region: record.region,
      language: record.originalLanguage,
      contributorName: contributor.displayName,
      contributorRole: contributor.role,
      safetyStatus: record.safetyStatus,
      createdAt: record.createdAt,
      isDemo: record.isDemo,
      community: summarizeCommunityEvidence(this.reportsOf(record.id)),
      externalEvidence: evidence[0]?.relationship ?? null,
      externalEvidenceCount: evidence.length,
    };
  }

  private applyFilters(records: KnowledgeRecord[], filters?: SearchFilters): KnowledgeRecord[] {
    if (!filters) return records;
    return records.filter((record) => {
      if (filters.crop && record.crop?.toLowerCase() !== filters.crop.toLowerCase()) return false;
      if (filters.animal && record.animal?.toLowerCase() !== filters.animal.toLowerCase())
        return false;
      if (filters.region && record.region.toLowerCase() !== filters.region.toLowerCase())
        return false;
      if (filters.language && record.originalLanguage.toLowerCase() !== filters.language.toLowerCase())
        return false;
      if (filters.practice && record.knowledgeType !== filters.practice) return false;
      if (filters.evidence) {
        const evidence = this.evidenceOf(record.id);
        if (filters.evidence === "community_only") {
          if (evidence.length > 0) return false;
        } else if (!evidence.some((e) => e.relationship === filters.evidence)) {
          return false;
        }
      }
      return true;
    });
  }

  async listRecords(filters?: SearchFilters): Promise<KnowledgeRecordSummary[]> {
    return this.applyFilters(this.records, filters)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((r) => this.toSummary(r));
  }

  async searchRecords(terms: string[], filters?: SearchFilters): Promise<KnowledgeRecordSummary[]> {
    const candidates = this.applyFilters(this.records, filters);
    if (terms.length === 0) {
      return candidates
        .slice()
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((r) => this.toSummary(r));
    }

    const scored = candidates
      .map((record) => ({ record, score: scoreRecord(record, terms) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.record.createdAt.localeCompare(a.record.createdAt);
      });

    return scored.map((entry) => this.toSummary(entry.record));
  }

  async getRecord(id: string): Promise<KnowledgeRecord | null> {
    return this.records.find((r) => r.id === id) ?? null;
  }

  async getContributor(id: string): Promise<Contributor | null> {
    return this.contributors.find((c) => c.id === id) ?? null;
  }

  async listReports(recordId: string): Promise<CommunityReport[]> {
    return this.reportsOf(recordId)
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async listEvidence(recordId: string): Promise<EvidenceSource[]> {
    return this.evidenceOf(recordId);
  }

  async getRecordDetail(id: string): Promise<KnowledgeRecordDetail | null> {
    const record = await this.getRecord(id);
    if (!record) return null;
    const reports = await this.listReports(id);
    const sources = await this.listEvidence(id);
    return {
      record,
      contributor: this.contributorOf(record.contributorId),
      community: summarizeCommunityEvidence(reports),
      reports,
      evidence: { relationship: sources[0]?.relationship ?? null, sources },
    };
  }

  async createRecord(input: CreateKnowledgeInput): Promise<KnowledgeRecord> {
    const now = new Date().toISOString();
    this.sequence += 1;
    const record: KnowledgeRecord = {
      id: `session-${this.sequence}`,
      title: input.structure.title,
      transcript: input.transcript,
      transcriptNote: "Recorded in this session.",
      originalLanguage: input.originalLanguage,
      dialect: input.dialect,
      knowledgeType: input.structure.knowledgeType,
      crop: input.structure.crop,
      animal: input.structure.animal,
      problem: input.structure.problem,
      practice: input.structure.practice,
      method: input.structure.method,
      season: input.structure.season,
      region: input.structure.region,
      district: null,
      context: input.structure.context,
      audioUrl: input.audioUrl,
      contributorId: input.contributorId || demoSessionContributorId,
      visibility: "public",
      sourceType: "voice_recording",
      status: "published",
      verificationStatus: "unreviewed",
      safetyStatus: input.structure.safetyStatus,
      safetyNote: null,
      embedding: null,
      createdAt: now,
      updatedAt: now,
      isDemo: true,
    };
    this.records = [record, ...this.records];
    return record;
  }

  async addOutcomeReport(input: OutcomeReportInput): Promise<CommunityReport> {
    const report: CommunityReport = {
      id: `${input.knowledgeRecordId}-session-${this.reports.length + 1}`,
      knowledgeRecordId: input.knowledgeRecordId,
      reporterId: demoSessionContributorId,
      outcome: input.outcome,
      notes: input.notes ?? null,
      audioUrl: input.audioUrl ?? null,
      location: input.location,
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    this.reports = [report, ...this.reports];
    return report;
  }

  async getCorpusStats() {
    return {
      records: this.records.length,
      contributors: this.contributors.length,
      reports: this.reports.length,
    };
  }
}

const SEARCHABLE_FIELDS: (keyof KnowledgeRecord)[] = [
  "title",
  "crop",
  "animal",
  "problem",
  "practice",
  "method",
  "region",
  "district",
  "context",
  "transcript",
  "originalLanguage",
  "dialect",
];

const FIELD_WEIGHT: Partial<Record<keyof KnowledgeRecord, number>> = {
  title: 6,
  crop: 5,
  animal: 5,
  problem: 4,
  practice: 3,
  region: 2,
  transcript: 2,
};

function scoreRecord(record: KnowledgeRecord, terms: string[]): number {
  let score = 0;
  for (const term of terms) {
    const needle = term.toLowerCase();
    if (needle.length < 3) continue;
    for (const field of SEARCHABLE_FIELDS) {
      const value = record[field];
      if (typeof value !== "string") continue;
      if (value.toLowerCase().includes(needle)) {
        score += FIELD_WEIGHT[field] ?? 1;
      }
    }
  }
  return score;
}
