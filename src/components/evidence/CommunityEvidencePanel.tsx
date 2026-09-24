import { Info } from "lucide-react";
import { COMMUNITY_SIGNAL_DISCLAIMER } from "@/lib/domain/community-evidence";
import type { CommunityEvidenceSummary } from "@/lib/domain/types";
import { SectionHeading } from "../layout/SectionHeading";
import { SignalBadge } from "../knowledge/SignalBadge";
import { OutcomeBar } from "./OutcomeBar";

export function CommunityEvidencePanel({
  community,
  locations,
}: {
  community: CommunityEvidenceSummary;
  locations: string[];
}) {
  return (
    <section aria-labelledby="community-evidence">
      <SectionHeading index="03" title="Community evidence" />

      {community.attempts === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No one has reported trying this practice yet. If you have, your report becomes the first
          community evidence on this record.
        </p>
      ) : (
        <div className="mt-6 rounded-lg border border-primary/25 bg-[color-mix(in_oklab,var(--primary)_5%,var(--card))] p-6 md:p-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="display text-4xl text-foreground md:text-5xl">
              {community.attempts}
            </span>
            <span className="label-xs">Documented attempts</span>
          </div>

          <OutcomeBar community={community} className="mt-6" showLegend />

          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 md:grid-cols-4">
            <Metric label="Independent contributors" value={String(community.uniqueContributors)} />
            <Metric label="Locations" value={String(community.uniqueLocations)} />
            <Metric label="Positive reporting rate" value={`${community.positiveRate}%`} />
            <div>
              <dt className="label-xs">Community signal</dt>
              <dd className="mt-2">
                <SignalBadge signal={community.signal} />
              </dd>
            </div>
          </dl>

          {locations.length > 0 && (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {locations.slice(0, 8).join(" · ")}
            </p>
          )}

          <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>
              Community signal summarizes reported experience. It is not scientific validation.
              <span className="mt-1 block text-xs">{COMMUNITY_SIGNAL_DISCLAIMER}</span>
            </span>
          </p>

          {community.signal === "mixed" && (
            <p className="mt-4 rounded-md border border-[color:var(--neutral)]/50 bg-background p-4 text-sm leading-relaxed text-foreground">
              Community reports are not fully consistent. Results may vary by context, preparation,
              season, location, or implementation.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-xs">{label}</dt>
      <dd className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</dd>
    </div>
  );
}
