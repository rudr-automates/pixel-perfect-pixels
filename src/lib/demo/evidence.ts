import type { EvidenceSource } from "../domain/types";

/**
 * DEMO EVIDENCE.
 *
 * These entries are illustrative placeholders for the scientific/expert
 * evidence layer. No citations, DOIs or URLs are fabricated: every entry is
 * marked isDemo and carries a null URL so the UI can label it honestly.
 * Real ingestion of external evidence happens in the live stack.
 */
export const demoEvidenceSources: EvidenceSource[] = [
  {
    id: "e-01",
    knowledgeRecordId: "k-01",
    sourceType: "scientific",
    title: "Botanical extracts in horticultural pest management",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Plant-derived preparations are widely studied as part of integrated pest management. Reported effects depend strongly on preparation strength, timing and pest stage.",
    relationship: "partial_support",
    evidenceLevel: "moderate",
    createdAt: "2026-03-14T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-02",
    knowledgeRecordId: "k-01",
    sourceType: "expert",
    title: "Extension note on spray timing for chilli",
    publisher: "Illustrative extension note (demo evidence)",
    url: null,
    summary:
      "Evening application reduces leaf burn risk and improves persistence of foliar sprays in hot conditions.",
    relationship: "expert_reviewed",
    evidenceLevel: "indicative",
    createdAt: "2026-03-14T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-03",
    knowledgeRecordId: "k-01",
    sourceType: "institutional",
    title: "Safety guidance for home-prepared plant extracts",
    publisher: "Illustrative institutional guidance (demo evidence)",
    url: null,
    summary:
      "Concentration of home-prepared extracts is not standardized. Field testing on a small area before wider application is advised.",
    relationship: "limited_evidence",
    evidenceLevel: "limited",
    createdAt: "2026-03-14T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-04",
    knowledgeRecordId: "k-02",
    sourceType: "scientific",
    title: "Ash-based surface treatments against soft-bodied insects",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Physical barrier effects are documented for fine ash layers; evidence on sustained field-scale control is limited.",
    relationship: "limited_evidence",
    evidenceLevel: "limited",
    createdAt: "2026-03-16T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-05",
    knowledgeRecordId: "k-04",
    sourceType: "scientific",
    title: "Hermetic and low-moisture seed storage",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Reducing moisture and oxygen availability in stored seed is consistently associated with lower storage pest damage.",
    relationship: "direct_support",
    evidenceLevel: "high",
    createdAt: "2026-03-06T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-06",
    knowledgeRecordId: "k-05",
    sourceType: "institutional",
    title: "Seed density separation before sowing",
    publisher: "Illustrative extension guidance (demo evidence)",
    url: null,
    summary:
      "Density separation removes poorly filled grain and is a long-standing recommended pre-sowing step.",
    relationship: "direct_support",
    evidenceLevel: "high",
    createdAt: "2026-03-03T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-07",
    knowledgeRecordId: "k-06",
    sourceType: "scientific",
    title: "Alternate wetting and drying in rice systems",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Controlled drying cycles can reduce water use with comparable yields when drying depth is managed carefully.",
    relationship: "partial_support",
    evidenceLevel: "moderate",
    createdAt: "2026-03-04T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-08",
    knowledgeRecordId: "k-11",
    sourceType: "scientific",
    title: "Green manure incorporation and soil nitrogen",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Incorporating legume green manure before flowering is associated with improved soil nitrogen availability.",
    relationship: "direct_support",
    evidenceLevel: "high",
    createdAt: "2026-03-10T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-09",
    knowledgeRecordId: "k-13",
    sourceType: "scientific",
    title: "Residue mulching and soil moisture retention",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Surface residue reduces evaporation losses; magnitude depends on residue quantity and rainfall distribution.",
    relationship: "partial_support",
    evidenceLevel: "moderate",
    createdAt: "2026-03-12T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-10",
    knowledgeRecordId: "k-16",
    sourceType: "institutional",
    title: "Curing and drying practice for turmeric quality",
    publisher: "Illustrative institutional guidance (demo evidence)",
    url: null,
    summary:
      "Boiling followed by controlled drying is an established curing step associated with colour retention.",
    relationship: "direct_support",
    evidenceLevel: "moderate",
    createdAt: "2026-03-01T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-11",
    knowledgeRecordId: "k-19",
    sourceType: "scientific",
    title: "Fermented plant and bran preparations as soil inputs",
    publisher: "Illustrative research summary (demo evidence)",
    url: null,
    summary:
      "Reported effects are inconsistent across studies. Outcomes vary with fermentation time, dilution and soil condition.",
    relationship: "conflicting_evidence",
    evidenceLevel: "limited",
    createdAt: "2026-03-18T00:00:00.000Z",
    isDemo: true,
  },
  {
    id: "e-12",
    knowledgeRecordId: "k-26",
    sourceType: "expert",
    title: "Nursery bed amendments and seedling damping off",
    publisher: "Illustrative extension note (demo evidence)",
    url: null,
    summary:
      "Improved drainage in nursery beds is linked to lower damping-off incidence; the specific role of husk ash is not established.",
    relationship: "no_direct_evidence",
    evidenceLevel: "limited",
    createdAt: "2026-03-24T00:00:00.000Z",
    isDemo: true,
  },
];
