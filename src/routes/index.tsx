import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { KnowledgeCard } from "@/components/knowledge/KnowledgeCard";
import { VoiceQueryBar } from "@/features/search/VoiceQueryBar";
import { useCorpusStats, useKnowledgeList } from "@/hooks/useKnowledgeRecord";

const SAMPLE_QUERIES = [
  "Mirchi mein keeda lag gaya, kya karu?",
  "Beej ko ghar par kaise sambhal kar rakhen?",
  "Dhaan ki kheti mein purana tareeka kya hai?",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriVoice — Ask the community in your own voice" },
      {
        name: "description",
        content:
          "Record local agricultural knowledge by voice, search it in your own language, and trace who contributed it and what others reported.",
      },
      { property: "og:title", content: "AgriVoice — Ask the community in your own voice" },
      {
        property: "og:description",
        content:
          "A voice-first community knowledge archive: preserve the original recording, structure it, and keep community evidence separate from scientific evidence.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const stats = useCorpusStats();
  const recent = useKnowledgeList();

  const goToSearch = (query: string, derivedFrom: "voice" | "text") => {
    void navigate({ to: "/search", search: { q: query, from: derivedFrom } });
  };

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-16 md:px-10 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="label-xs">Voice → Knowledge → Evidence</span>
            <h1 className="display mt-5 text-[13vw] leading-[0.92] text-foreground sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              What are you
              <br />
              looking for?
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Ask the community.
              <br />
              In your language. In your voice.
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {SAMPLE_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => goToSearch(query, "text")}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:border-foreground/30 hover:text-primary"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card px-6 py-12 md:px-10">
            <VoiceQueryBar size="hero" onSubmit={goToSearch} />
            <p className="mt-6 text-center label-xs">or type a question</p>
            <div className="mt-4">
              <VoiceQueryBar size="bar" onSubmit={goToSearch} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-5 md:px-10">
        <div className="grid gap-8 border-y border-border py-10 sm:grid-cols-3">
          <Stat value={stats.data?.records} label="Demo knowledge records" />
          <Stat value={stats.data?.contributors} label="Simulated contributors" />
          <Stat value={stats.data?.reports} label="Demo community reports" />
        </div>
        <p className="mt-4 label-xs">Prototype data — not real AgriVoice usage</p>
      </section>

      <section className="mx-auto w-full max-w-[1320px] px-5 pt-20 md:px-10">
        <SectionHeading
          title="Recent knowledge"
          description="Each record keeps the original voice, the person who contributed it, and what other people reported after trying it."
          action={
            <Link
              to="/explore"
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground hover:text-primary"
            >
              Explore all →
            </Link>
          }
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {recent.isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          {recent.data?.slice(0, 6).map((record) => (
            <KnowledgeCard key={record.id} record={record} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function Stat({ value, label }: { value?: number | undefined; label: string }) {
  return (
    <div>
      <p className="display text-5xl text-foreground">{value ?? "—"}</p>
      <p className="mt-2 label-xs">{label}</p>
    </div>
  );
}
