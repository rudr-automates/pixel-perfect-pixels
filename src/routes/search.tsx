import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/feedback/EmptyState";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { UnderstandingPanel } from "@/components/search/UnderstandingPanel";
import { StaticWaveform } from "@/components/audio/Waveform";
import { VoiceQueryBar } from "@/features/search/VoiceQueryBar";
import { useKnowledgeSearch } from "@/hooks/useKnowledgeSearch";
import type { SearchFilters } from "@/lib/domain/types";

interface SearchParams {
  q?: string;
  crop?: string;
  region?: string;
  from?: "voice" | "text";
}

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === "string" ? search.q : undefined,
    crop: typeof search.crop === "string" ? search.crop : undefined,
    region: typeof search.region === "string" ? search.region : undefined,
    from: search.from === "voice" ? "voice" : search.from === "text" ? "text" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Ask the community — AgriVoice" },
      {
        name: "description",
        content:
          "Ask a question by voice or text. AgriVoice structures the question first, then returns knowledge records with provenance and evidence signals.",
      },
      { property: "og:title", content: "Ask the community — AgriVoice" },
      {
        property: "og:description",
        content:
          "Voice and text search over community knowledge records, with community evidence kept separate from scientific evidence.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const params = Route.useSearch();
  const navigate = useNavigate();
  const query = params.q ?? "";
  const filters: SearchFilters = { crop: params.crop, region: params.region };
  const derivedFrom = params.from ?? "text";
  const search = useKnowledgeSearch(query, filters, derivedFrom);

  const submit = (nextQuery: string, from: "voice" | "text") => {
    void navigate({ to: "/search", search: { ...params, q: nextQuery, from } });
  };

  const clearFilter = (key: "crop" | "region") => {
    void navigate({ to: "/search", search: { ...params, [key]: undefined } });
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[1320px] px-5 py-14 md:px-10 md:py-20">
        <span className="label-xs">Search</span>
        <h1 className="display mt-4 text-4xl text-foreground md:text-5xl">Ask the community</h1>

        <div className="mt-8">
          <VoiceQueryBar initialQuery={query} onSubmit={submit} />
        </div>

        {(params.crop || params.region) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(["crop", "region"] as const).map((key) =>
              params[key] ? (
                <button
                  key={key}
                  type="button"
                  onClick={() => clearFilter(key)}
                  className="rounded-full border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
                >
                  {key}: {params[key]} ✕
                </button>
              ) : null,
            )}
          </div>
        )}

        <div className="mt-10 space-y-8">
          {query.length === 0 && (
            <EmptyState
              title="Start with a question"
              description="Speak or type what you are trying to solve. AgriVoice interprets the crop, the problem and the region before searching the archive."
            />
          )}

          {query.length > 0 && search.isLoading && (
            <div className="rounded-lg border border-border bg-card p-8">
              <span className="label-xs">Understanding</span>
              <StaticWaveform bars={48} className="mt-4" />
              <p className="mt-4 text-sm text-muted-foreground">
                Structuring the question before searching…
              </p>
            </div>
          )}

          {search.isError && (
            <div className="rounded-lg border border-destructive/40 bg-card p-8">
              <span className="label-xs">Search temporarily unavailable</span>
              <p className="mt-3 text-sm text-muted-foreground">
                The search service did not respond. No results are being invented in its place.
              </p>
              <button
                type="button"
                onClick={() => void search.refetch()}
                className="mt-5 rounded-md border border-foreground/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
              >
                Retry
              </button>
            </div>
          )}

          {search.data && (
            <>
              <UnderstandingPanel understanding={search.data.understanding} />

              {search.data.records.length === 0 ? (
                <EmptyState
                  title="We don't have a strong match yet."
                  description="Try another phrase, region, or crop — or record the knowledge you're looking for so the next person finds it."
                />
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <span className="label-xs">
                      {search.data.records.length} knowledge records
                    </span>
                    <span className="label-xs">Compare provenance and evidence</span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {search.data.records.map((record) => (
                      <KnowledgeCard key={record.id} record={record} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
