import { SIGNAL_LABEL } from "@/lib/domain/community-evidence";
import { EVIDENCE_RELATIONSHIP_LABEL, SAFETY_LABEL } from "@/lib/domain/labels";
import type { CommunitySignal, EvidenceRelationship, SafetyStatus } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export function SignalBadge({ signal, className }: { signal: CommunitySignal; className?: string }) {
  const tone: Record<CommunitySignal, string> = {
    strong: "border-primary/45 text-primary",
    moderate: "border-foreground/25 text-foreground",
    mixed: "border-[color:var(--neutral)] text-[color:var(--neutral)]",
    low: "border-border text-muted-foreground",
    none: "border-border text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        tone[signal],
        className,
      )}
    >
      {SIGNAL_LABEL[signal]}
    </span>
  );
}

export function EvidenceBadge({ relationship }: { relationship: EvidenceRelationship | null }) {
  if (!relationship) {
    return (
      <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        No external evidence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-evidence/45 bg-evidence-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-evidence">
      {EVIDENCE_RELATIONSHIP_LABEL[relationship]}
    </span>
  );
}

export function SafetyBadge({ status }: { status: SafetyStatus }) {
  const tone: Record<SafetyStatus, string> = {
    not_assessed: "border-border text-muted-foreground",
    caution: "border-primary/45 text-primary",
    restricted: "border-destructive/50 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]",
        tone[status],
      )}
    >
      Safety · {SAFETY_LABEL[status]}
    </span>
  );
}
