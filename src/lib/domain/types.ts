/**
 * AgriVoice domain types.
 *
 * These types are the contract between UI, services and repositories.
 * Provider-specific shapes (Sarvam, Gemini, Supabase rows) must be mapped
 * into these types inside adapters — never leaked into components.
 */

export type ContributorRole =
  | "knowledge_keeper"
  | "farmer"
  | "seed_keeper"
  | "livestock_specialist"
  | "traditional_practitioner"
  | "local_expert"
  | "community_member";

export type ConsentStatus = "granted" | "pending" | "withdrawn";

export interface Contributor {
  id: string;
  displayName: string;
  region: string;
  state: string;
  district: string | null;
  language: string;
  dialect: string | null;
  role: ContributorRole;
  consentStatus: ConsentStatus;
  createdAt: string;
}

export type KnowledgeType =
  | "crop_practice"
  | "pest_management"
  | "seed_practice"
  | "soil_practice"
  | "irrigation_practice"
  | "livestock_practice"
  | "storage_practice"
  | "seasonal_practice";

export type KnowledgeStatus = "draft" | "published" | "archived";
export type VerificationStatus = "unreviewed" | "community_reported" | "expert_reviewed";
export type SafetyStatus = "not_assessed" | "caution" | "restricted";
export type Visibility = "public" | "private";
export type SourceType = "voice_recording" | "text_entry" | "imported";

export interface KnowledgeRecord {
  id: string;
  title: string;
  transcript: string;
  transcriptNote: string | null;
  originalLanguage: string;
  dialect: string | null;
  knowledgeType: KnowledgeType;
  crop: string | null;
  animal: string | null;
  problem: string | null;
  practice: string | null;
  method: string | null;
  season: string | null;
  region: string;
  district: string | null;
  context: string | null;
  audioUrl: string | null;
  contributorId: string;
  visibility: Visibility;
  sourceType: SourceType;
  status: KnowledgeStatus;
  verificationStatus: VerificationStatus;
  safetyStatus: SafetyStatus;
  safetyNote: string | null;
  embedding: number[] | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export type CommunitySignal = "low" | "moderate" | "strong" | "mixed" | "none";

export interface CommunityEvidenceSummary {
  attempts: number;
  positive: number;
  neutral: number;
  negative: number;
  uniqueContributors: number;
  uniqueLocations: number;
  positiveRate: number;
  signal: CommunitySignal;
}

export interface KnowledgeRecordSummary {
  id: string;
  title: string;
  crop: string | null;
  animal: string | null;
  problem: string | null;
  knowledgeType: KnowledgeType;
  region: string;
  language: string;
  contributorName: string;
  contributorRole: ContributorRole;
  safetyStatus: SafetyStatus;
  createdAt: string;
  isDemo: boolean;
  community: CommunityEvidenceSummary;
  externalEvidence: EvidenceRelationship | null;
  externalEvidenceCount: number;
}

export type OutcomeValue = "positive" | "neutral" | "negative";

export interface CommunityReport {
  id: string;
  knowledgeRecordId: string;
  reporterId: string;
  outcome: OutcomeValue;
  notes: string | null;
  audioUrl: string | null;
  location: string;
  createdAt: string;
  isDemo: boolean;
}

export type EvidenceSourceType = "scientific" | "expert" | "institutional" | "community";

export type EvidenceRelationship =
  | "direct_support"
  | "partial_support"
  | "limited_evidence"
  | "no_direct_evidence"
  | "conflicting_evidence"
  | "expert_reviewed";

export type EvidenceLevel = "high" | "moderate" | "limited" | "indicative";

export interface EvidenceSource {
  id: string;
  knowledgeRecordId: string;
  sourceType: EvidenceSourceType;
  title: string;
  publisher: string;
  url: string | null;
  summary: string;
  relationship: EvidenceRelationship;
  evidenceLevel: EvidenceLevel;
  createdAt: string;
  isDemo: boolean;
}

export interface EvidenceAssessment {
  relationship: EvidenceRelationship | null;
  sources: EvidenceSource[];
}

export interface SafetyReview {
  id: string;
  knowledgeRecordId: string;
  status: SafetyStatus;
  reason: string;
  reviewedBy: string | null;
  createdAt: string;
  isDemo: boolean;
}

/** What the system understood from a spoken or typed question. */
export interface SearchUnderstanding {
  query: string;
  crop: string | null;
  animal: string | null;
  problem: string | null;
  region: string | null;
  intent: string;
  language: string;
  derivedFrom: "voice" | "text";
}

export interface SearchFilters {
  crop?: string | undefined;
  animal?: string | undefined;
  region?: string | undefined;
  practice?: string | undefined;
  evidence?: EvidenceRelationship | "community_only" | undefined;
  language?: string | undefined;
}

export interface KnowledgeSearchResult {
  understanding: SearchUnderstanding;
  records: KnowledgeRecordSummary[];
}

export interface SpeechTranscriptionResult {
  transcript: string;
  language: string;
  dialect: string | null;
  durationSeconds: number;
  provider: "demo" | "sarvam";
}

export interface KnowledgeStructureResult {
  title: string;
  knowledgeType: KnowledgeType;
  crop: string | null;
  animal: string | null;
  problem: string | null;
  practice: string | null;
  method: string | null;
  season: string | null;
  region: string;
  context: string | null;
  safetyStatus: SafetyStatus;
  provider: "demo" | "gemini";
}

export interface CreateKnowledgeInput {
  transcript: string;
  originalLanguage: string;
  dialect: string | null;
  structure: KnowledgeStructureResult;
  audioUrl: string | null;
  contributorId: string;
  consentConfirmed: boolean;
}

export interface OutcomeReportInput {
  knowledgeRecordId: string;
  outcome: OutcomeValue;
  notes?: string | null | undefined;
  location: string;
  audioUrl?: string | null | undefined;
}

/** Full detail payload for the knowledge record screen. */
export interface KnowledgeRecordDetail {
  record: KnowledgeRecord;
  contributor: Contributor;
  community: CommunityEvidenceSummary;
  reports: CommunityReport[];
  evidence: EvidenceAssessment;
}
