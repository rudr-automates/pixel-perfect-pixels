import type {
  ContributorRole,
  EvidenceLevel,
  EvidenceRelationship,
  EvidenceSourceType,
  KnowledgeType,
  OutcomeValue,
  SafetyStatus,
} from "./types";

export const ROLE_LABEL: Record<ContributorRole, string> = {
  knowledge_keeper: "Knowledge keeper",
  farmer: "Farmer",
  seed_keeper: "Seed keeper",
  livestock_specialist: "Livestock specialist",
  traditional_practitioner: "Traditional practitioner",
  local_expert: "Local expert",
  community_member: "Community member",
};

export const KNOWLEDGE_TYPE_LABEL: Record<KnowledgeType, string> = {
  crop_practice: "Crop practice",
  pest_management: "Pest management",
  seed_practice: "Seed practice",
  soil_practice: "Soil practice",
  irrigation_practice: "Irrigation practice",
  livestock_practice: "Livestock practice",
  storage_practice: "Storage practice",
  seasonal_practice: "Seasonal practice",
};

export const SAFETY_LABEL: Record<SafetyStatus, string> = {
  not_assessed: "Not assessed",
  caution: "Caution",
  restricted: "Restricted",
};

export const EVIDENCE_RELATIONSHIP_LABEL: Record<EvidenceRelationship, string> = {
  direct_support: "Direct support",
  partial_support: "Partial support",
  limited_evidence: "Limited evidence",
  no_direct_evidence: "No direct evidence",
  conflicting_evidence: "Conflicting evidence",
  expert_reviewed: "Expert reviewed",
};

export const EVIDENCE_SOURCE_LABEL: Record<EvidenceSourceType, string> = {
  scientific: "Scientific source",
  expert: "Expert source",
  institutional: "Institutional source",
  community: "Community source",
};

export const EVIDENCE_LEVEL_LABEL: Record<EvidenceLevel, string> = {
  high: "High",
  moderate: "Moderate",
  limited: "Limited",
  indicative: "Indicative",
};

export const OUTCOME_LABEL: Record<OutcomeValue, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};

export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export function formatDuration(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
