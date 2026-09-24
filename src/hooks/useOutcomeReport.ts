import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getServices } from "@/lib/services/container";
import { knowledgeKeys } from "./useKnowledgeRecord";
import type { OutcomeReportInput } from "@/lib/domain/types";
import type { OutcomeSubmissionResult } from "@/lib/services/outcome/outcome-service";

export function useOutcomeReport(recordId: string) {
  const queryClient = useQueryClient();

  return useMutation<OutcomeSubmissionResult, Error, OutcomeReportInput>({
    mutationFn: (input) => getServices().outcome.report(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: knowledgeKeys.detail(recordId) });
      void queryClient.invalidateQueries({ queryKey: ["knowledge-list"] });
      void queryClient.invalidateQueries({ queryKey: ["knowledge-search"] });
    },
  });
}
