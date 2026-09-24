import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices } from "@/lib/services/container";
import type { CreateKnowledgeInput, KnowledgeRecord } from "@/lib/domain/types";

export function useCreateKnowledge() {
  const queryClient = useQueryClient();

  return useMutation<KnowledgeRecord, Error, CreateKnowledgeInput>({
    mutationFn: (input) => getServices().knowledge.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["knowledge-list"] });
      void queryClient.invalidateQueries({ queryKey: ["knowledge-search"] });
      void queryClient.invalidateQueries({ queryKey: ["knowledge-stats"] });
    },
  });
}
