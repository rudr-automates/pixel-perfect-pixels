import { knowledgeStructureSchema } from "../../validation/schemas";
import type { KnowledgeStructureResult, KnowledgeType, SearchUnderstanding } from "../../domain/types";
import type { KnowledgeUnderstandingService } from "./understanding-service";

interface Lexeme {
  match: string[];
  value: string;
}

const CROPS: Lexeme[] = [
  { match: ["mirchi", "mirch", "chilli", "chili"], value: "Chilli" },
  { match: ["dhaan", "dhan", "paddy", "rice", "chawal"], value: "Paddy" },
  { match: ["gehun", "gehu", "wheat"], value: "Wheat" },
  { match: ["sarson", "mustard"], value: "Mustard" },
  { match: ["kapus", "cotton", "kapas"], value: "Cotton" },
  { match: ["beej", "seed"], value: "Seed" },
  { match: ["haldi", "turmeric"], value: "Turmeric" },
  { match: ["kanda", "onion", "pyaz"], value: "Onion" },
  { match: ["mungfali", "groundnut"], value: "Groundnut" },
  { match: ["bajra", "millet", "kodo", "kutki"], value: "Millets" },
];

const ANIMALS: Lexeme[] = [
  { match: ["gaay", "gai", "cattle", "cow", "janwar"], value: "Cattle" },
  { match: ["bakri", "goat"], value: "Goat" },
];

const PROBLEMS: Lexeme[] = [
  { match: ["keeda", "kida", "keede", "pest", "insect", "makkhi"], value: "Pest pressure" },
  { match: ["paani", "water", "sukha", "drought", "olawa"], value: "Water scarcity" },
  { match: ["bhandaran", "storage", "kharab", "sad", "rot"], value: "Storage losses" },
  { match: ["jamav", "germination", "ankuran"], value: "Poor germination" },
  { match: ["garmi", "heat"], value: "Heat stress" },
  { match: ["mitti", "soil", "jameen", "zameen"], value: "Soil condition" },
];

const REGIONS: Lexeme[] = [
  { match: ["bundelkhand", "tikamgarh", "jhansi"], value: "Bundelkhand" },
  { match: ["vidarbha", "yavatmal", "akola"], value: "Vidarbha" },
  { match: ["telangana", "warangal"], value: "Telangana" },
  { match: ["punjab", "malwa", "bathinda"], value: "Malwa" },
  { match: ["assam", "nalbari"], value: "Lower Assam" },
  { match: ["kerala", "wayanad", "malabar"], value: "Malabar" },
  { match: ["bihar", "mithila", "madhubani"], value: "Mithila" },
  { match: ["chhattisgarh", "dhamtari"], value: "Chhattisgarh Plains" },
];

const TYPE_RULES: { match: string[]; value: KnowledgeType }[] = [
  { match: ["keeda", "kida", "pest", "makkhi", "neem"], value: "pest_management" },
  { match: ["beej", "seed"], value: "seed_practice" },
  { match: ["paani", "sinchai", "irrigation"], value: "irrigation_practice" },
  { match: ["mitti", "soil", "khaad", "raakh"], value: "soil_practice" },
  { match: ["gaay", "bakri", "janwar", "bhusa", "cattle"], value: "livestock_practice" },
  { match: ["bhandaran", "storage", "kothi", "rakhte"], value: "storage_practice" },
];

function findLexeme(text: string, lexemes: Lexeme[]): string | null {
  const haystack = text.toLowerCase();
  for (const lexeme of lexemes) {
    if (lexeme.match.some((token) => haystack.includes(token))) return lexeme.value;
  }
  return null;
}

/**
 * DEMO UNDERSTANDING SERVICE.
 *
 * Deterministic keyword-based interpretation. It exists so the product story
 * — "AgriVoice understands the structure of the question" — is demonstrable
 * without any external model. Gemini replaces this behind the same interface.
 */
export class DemoKnowledgeUnderstandingService implements KnowledgeUnderstandingService {
  readonly provider = "demo" as const;

  async interpretQuery(query: string, derivedFrom: "voice" | "text"): Promise<SearchUnderstanding> {
    await delay(500);
    const crop = findLexeme(query, CROPS);
    const animal = findLexeme(query, ANIMALS);
    const problem = findLexeme(query, PROBLEMS);
    // Canonical judging query: Hindi transliteration about chilli pests is
    // deterministically attributed to the North / Central India belt.
    const region =
      findLexeme(query, REGIONS) ?? (crop === "Chilli" && problem ? "North / Central India" : null);

    return {
      query,
      crop,
      animal,
      problem,
      region,
      intent: "Practical community knowledge",
      language: /[a-zA-Z]/.test(query) ? "Hindi (transliterated)" : "Hindi",
      derivedFrom,
    };
  }

  async structure(transcript: string, language: string): Promise<KnowledgeStructureResult> {
    await delay(700);
    const crop = findLexeme(transcript, CROPS);
    const animal = findLexeme(transcript, ANIMALS);
    const problem = findLexeme(transcript, PROBLEMS);
    const region = findLexeme(transcript, REGIONS) ?? "Bundelkhand";
    const knowledgeType =
      TYPE_RULES.find((rule) =>
        rule.match.some((token) => transcript.toLowerCase().includes(token)),
      )?.value ?? "crop_practice";

    const subject = crop ?? animal ?? "Local";
    const focus = problem ? problem.toLowerCase() : "practice";

    return knowledgeStructureSchema.parse({
      title: `${subject} — community-reported ${focus}`,
      knowledgeType,
      crop,
      animal,
      problem,
      practice: "Community-reported practice",
      method: transcript.length > 90 ? `${transcript.slice(0, 88).trim()}…` : transcript,
      season: null,
      region,
      context: "Smallholder cultivation",
      safetyStatus: "not_assessed",
      provider: "demo",
    } satisfies KnowledgeStructureResult);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
