import type { CommunityEvidenceSummary } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/** Proportion of reported outcomes. No decoration, only reported counts. */
export function OutcomeBar({
  community,
  className,
  showLegend = false,
}: {
  community: CommunityEvidenceSummary;
  className?: string;
  showLegend?: boolean;
}) {
  const total = Math.max(1, community.attempts);
  const segments = [
    { key: "positive", value: community.positive, color: "var(--positive)" },
    { key: "neutral", value: community.neutral, color: "var(--neutral)" },
    { key: "negative", value: community.negative, color: "var(--negative)" },
  ];

  return (
    <div className={className}>
      <div
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-strong"
        role="img"
        aria-label={`${community.positive} positive, ${community.neutral} neutral, ${community.negative} negative reports`}
      >
        {segments.map((segment) => (
          <span
            key={segment.key}
            style={{
              width: `${(segment.value / total) * 100}%`,
              backgroundColor: segment.color,
            }}
          />
        ))}
      </div>

      {showLegend && (
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
          {segments.map((segment) => (
            <span key={segment.key} className={cn("inline-flex items-center gap-2")}>
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden
              />
              {segment.value} {segment.key}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
