import type { KnowledgeRepository } from "../../repositories/knowledge-repository";
import type { KnowledgeSearchResult, SearchFilters, SearchUnderstanding } from "../../domain/types";
import type { KnowledgeUnderstandingService } from "../knowledge/understanding-service";

const STOP_WORDS = new Set([
  "kya",
  "karu",
  "karoon",
  "hai",
  "mein",
  "me",
  "ka",
  "ki",
  "ke",
  "lag",
  "gaya",
  "the",
  "and",
  "for",
  "what",
  "how",
  "should",
  "kaise",
  "kaisa",
]);

/**
 * Understands the question, then retrieves matching knowledge records.
 * Ranking is lexical today; the same method is the insertion point for
 * hybrid lexical + vector retrieval once embeddings exist.
 */
export class KnowledgeSearchService {
  constructor(
    private readonly repository: KnowledgeRepository,
    private readonly understanding: KnowledgeUnderstandingService,
  ) {}

  async search(
    query: string,
    filters: SearchFilters,
    derivedFrom: "voice" | "text" = "text",
  ): Promise<KnowledgeSearchResult> {
    const understanding = await this.understanding.interpretQuery(query, derivedFrom);
    const terms = buildTerms(query, understanding);
    const records = await this.repository.searchRecords(terms, filters);
    return { understanding, records };
  }
}

function buildTerms(query: string, understanding: SearchUnderstanding): string[] {
  const tokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));

  const structured = [
    understanding.crop,
    understanding.animal,
    understanding.problem,
    understanding.region,
  ].filter((value): value is string => Boolean(value));

  return Array.from(new Set([...structured, ...tokens]));
}
