import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/services/container";
import type { KnowledgeRecordDetail, KnowledgeRecordSummary, SearchFilters } from "@/lib/domain/types";

export const knowledgeKeys = {
  detail: (id: string) => ["knowledge-record", id] as const,
  list: (filters: SearchFilters) => ["knowledge-list", filters] as const,
  stats: ["knowledge-stats"] as const,
};

export function useKnowledgeRecord(id: string) {
  return useQuery<KnowledgeRecordDetail | null>({
    queryKey: knowledgeKeys.detail(id),
    queryFn: () => getServices().knowledge.detail(id),
  });
}

export function useKnowledgeList(filters: SearchFilters = {}) {
  return useQuery<KnowledgeRecordSummary[]>({
    queryKey: knowledgeKeys.list(filters),
    queryFn: () => getServices().knowledge.list(filters),
  });
}

export function useCorpusStats() {
  return useQuery({
    queryKey: knowledgeKeys.stats,
    queryFn: () => getServices().knowledge.stats(),
  });
}
