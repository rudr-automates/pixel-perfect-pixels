import { knowledgeStructureSchema } from "../../validation/schemas";
import type { KnowledgeStructureResult, SearchUnderstanding } from "../../domain/types";
import type { KnowledgeUnderstandingService } from "./understanding-service";

/**
 * LIVE UNDERSTANDING ADAPTER — Gemini.
 *
 * Calls a Supabase Edge Function (`structure-knowledge`) that holds the API key
 * and returns normalized JSON. Provider-specific response shapes are parsed and
 * validated here; nothing Gemini-shaped escapes this file.
 */
export class GeminiKnowledgeUnderstandingService implements KnowledgeUnderstandingService {
  readonly provider = "gemini" as const;

  constructor(private readonly endpoint: string) {}

  private async post<T>(task: string, payload: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ task, ...payload }),
    });
    if (!response.ok) {
      throw new Error(`Understanding service unavailable (${response.status}).`);
    }
    return (await response.json()) as T;
  }

  async interpretQuery(query: string, derivedFrom: "voice" | "text"): Promise<SearchUnderstanding> {
    const data = await this.post<Partial<SearchUnderstanding>>("interpret_query", { query });
    return {
      query,
      crop: data.crop ?? null,
      animal: data.animal ?? null,
      problem: data.problem ?? null,
      region: data.region ?? null,
      intent: data.intent ?? "Practical community knowledge",
      language: data.language ?? "Unknown",
      derivedFrom,
    };
  }

  async structure(transcript: string, language: string): Promise<KnowledgeStructureResult> {
    const data = await this.post<unknown>("structure_knowledge", { transcript, language });
    return knowledgeStructureSchema.parse(data);
  }
}
