import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import { KNOWLEDGE_TYPE_LABEL, ROLE_LABEL } from "@/lib/domain/labels";
import type { KnowledgeRecordSummary } from "@/lib/domain/types";
import { EvidenceBadge, SignalBadge } from "./SignalBadge";
import { OutcomeBar } from "../evidence/OutcomeBar";

export function KnowledgeCard({ record }: { record: KnowledgeRecordSummary }) {
  const { community } = record;

  return (
    <Link
      to="/knowledge/$id"
      params={{ id: record.id }}
      className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-[0_12px_30px_-24px_rgba(18,26,33,0.6)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="label-xs">
          {record.crop ?? record.animal ?? KNOWLEDGE_TYPE_LABEL[record.knowledgeType]}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {record.region}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {record.title}
      </h3>

      {record.problem && (
        <p className="mt-2 text-sm text-muted-foreground">{record.problem}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
          {community.uniqueContributors} contributors
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
          {community.uniqueLocations} locations
        </span>
        <span>{community.attempts} attempts</span>
      </div>

      <OutcomeBar community={community} className="mt-4" />

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <SignalBadge signal={community.signal} />
        <EvidenceBadge relationship={record.externalEvidence} />
      </div>

      <p className="mt-4 border-t border-border pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {record.contributorName} · {ROLE_LABEL[record.contributorRole]}
      </p>
    </Link>
  );
}
