import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useKnowledgeList } from "@/hooks/useKnowledgeRecord";
import type { KnowledgeRecordSummary } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

type FilterKey = "crop" | "animal" | "region" | "language" | "evidence";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore knowledge — AgriVoice" },
      {
        name: "description",
        content:
          "Browse the community knowledge archive by crop, animal, region and evidence: recently added, high community signal, mixed outcomes and curated evidence.",
      },
      { property: "og:title", content: "Explore knowledge — AgriVoice" },
      {
        property: "og:description",
        content: "A knowledge atlas of community-reported practices, grouped by signal and evidence.",
      },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const { data, isLoading } = useKnowledgeList();
  const [active, setActive] = useState<Partial<Record<FilterKey, string>>>({});

  const records = data ?? [];

  const options = useMemo(() => {
    const collect = (pick: (r: KnowledgeRecordSummary) => string | null) =>
      Array.from(new Set(records.map(pick).filter((v): v is string => Boolean(v)))).sort();
    return {
      crop: collect((r) => r.crop),
      animal: collect((r) => r.animal),
      region: collect((r) => r.region),
      language: collect((r) => r.language),
      evidence: ["With curated evidence", "Community only"],
    };
  }, [records]);

  const filtered = records.filter((record) => {
    if (active.crop && record.crop !== active.crop) return false;
    if (active.animal && record.animal !== active.animal) return false;
    if (active.region && record.region !== active.region) return false;
    if (active.language && record.language !== active.language) return false;
    if (active.evidence === "With curated evidence" && record.externalEvidenceCount === 0)
      return false;
    if (active.evidence === "Community only" && record.externalEvidenceCount > 0) return false;
    return true;
  });

  const sections = [
    { title: "Recently added", items: filtered.slice(0, 6) },
    {
      title: "High community signal",
      items: filtered.filter((r) => r.community.signal === "strong").slice(0, 6),
    },
    {
      title: "Mixed outcomes",
      items: filtered.filter((r) => r.community.signal === "mixed").slice(0, 6),
    },
    {
      title: "Research / expert evidence",
      items: filtered.filter((r) => r.externalEvidenceCount > 0).slice(0, 6),
    },
  ];

  const regionCoverage = Object.entries(
    filtered.reduce<Record<string, number>>((acc, record) => {
      acc[record.region] = (acc[record.region] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const maxRegion = Math.max(1, ...regionCoverage.map(([, count]) => count));

  const toggle = (key: FilterKey, value: string) =>
    setActive((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1320px] px-5 py-14 md:px-10 md:py-20">
        <span className="label-xs">Atlas</span>
        <h1 className="display mt-4 text-4xl text-foreground md:text-5xl">Explore knowledge</h1>

        <div className="mt-10 space-y-4 border-y border-border py-6">
          {(Object.keys(options) as FilterKey[]).map((key) => (
            <div key={key} className="flex flex-wrap items-center gap-2">
              <span className="label-xs w-20 shrink-0">{key}</span>
              {options[key].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggle(key, value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs transition-colors",
                    active[key] === value
                      ? "border-primary bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-border bg-card p-6">
          <span className="label-xs">Regional coverage · prototype data</span>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regionCoverage.map(([region, count]) => (
              <div key={region} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-xs text-foreground">{region}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-strong">
                  <span
                    className="block h-full bg-primary/70"
                    style={{ width: `${(count / maxRegion) * 100}%` }}
                  />
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="mt-12">
            <EmptyState
              title="Nothing matches these filters"
              description="Remove a filter, or ask the community directly — the archive grows from what people record."
            />
          </div>
        )}

        <div className="mt-16 space-y-16">
          {sections
            .filter((section) => section.items.length > 0)
            .map((section) => (
              <section key={section.title}>
                <SectionHeading title={section.title} />
                <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((record) => (
                    <KnowledgeCard key={`${section.title}-${record.id}`} record={record} />
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </AppShell>
  );
}
