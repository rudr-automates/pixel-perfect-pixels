import type { KnowledgeStructureResult, SearchUnderstanding } from "../../domain/types";

/**
 * Turns free speech/text into structure. Implemented by a deterministic demo
 * provider and, later, by Gemini behind an Edge Function.
 */
export interface KnowledgeUnderstandingService {
  readonly provider: "demo" | "gemini";
  /** Structure a question asked by someone searching. */
  interpretQuery(query: string, derivedFrom: "voice" | "text"): Promise<SearchUnderstanding>;
  /** Structure a contribution into a knowledge record draft. */
  structure(transcript: string, language: string): Promise<KnowledgeStructureResult>;
}
