import { ShieldAlert } from "lucide-react";
import { SAFETY_LABEL } from "@/lib/domain/labels";
import type { KnowledgeRecord } from "@/lib/domain/types";

export function SafetyCard({ record }: { record: KnowledgeRecord }) {
  const isSensitive = record.animal !== null || record.safetyStatus !== "not_assessed";

  return (
    <aside className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <span className="label-xs">Safety status</span>
      </div>
      <p className="mt-2 font-display text-xl font-semibold uppercase tracking-tight text-foreground">
        {SAFETY_LABEL[record.safetyStatus]}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {record.safetyNote ??
          "Community-reported practice. Effectiveness and safety may vary by context."}
      </p>
      {isSensitive && (
        <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
          This record is not medical, veterinary, or professional advice.
        </p>
      )}
    </aside>
  );
}
