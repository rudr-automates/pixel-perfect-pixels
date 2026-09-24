import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/services/container";
import type { KnowledgeSearchResult, SearchFilters } from "@/lib/domain/types";

export function useKnowledgeSearch(
  query: string,
  filters: SearchFilters,
  derivedFrom: "voice" | "text",
) {
  return useQuery<KnowledgeSearchResult>({
    queryKey: ["knowledge-search", query, filters, derivedFrom],
    enabled: query.trim().length > 0,
    queryFn: () => getServices().search.search(query, filters, derivedFrom),
    staleTime: 60_000,
  });
}
