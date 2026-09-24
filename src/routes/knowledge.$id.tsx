import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { CommunityEvidencePanel } from "@/components/evidence/CommunityEvidencePanel";
import { ScientificEvidencePanel } from "@/components/evidence/ScientificEvidencePanel";
import { ProvenancePanel } from "@/components/knowledge/ProvenancePanel";
import { SafetyCard } from "@/components/knowledge/SafetyCard";
import { StructuredKnowledge, TranscriptPanel } from "@/components/knowledge/StructuredKnowledge";
import { EvidenceBadge, SignalBadge } from "@/components/knowledge/SignalBadge";
import { OutcomeReporting } from "@/features/outcomes/OutcomeReporting";
import { useKnowledgeRecord } from "@/hooks/useKnowledgeRecord";

export const Route = createFileRoute("/knowledge/$id")({
  head: () => ({
    meta: [
      { title: "Knowledge record — AgriVoice" },
      {
        name: "description",
        content:
          "A community knowledge record: original voice, structured interpretation, community evidence, and separately curated scientific or expert evidence.",
      },
      { property: "og:title", content: "Knowledge record — AgriVoice" },
      {
        property: "og:description",
        content:
          "Provenance, original transcript, community outcomes and scientific evidence for one community-reported practice.",
      },
    ],
  }),
  component: KnowledgeRecordPage,
});

function KnowledgeRecordPage() {
  const { id } = Route.useParams();
  const query = useKnowledgeRecord(id);

  if (query.isLoading) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-[1320px] px-5 py-20 md:px-10">
          <div className="h-10 w-2/3 animate-pulse rounded bg-surface-strong" />
          <div className="mt-8 h-64 animate-pulse rounded-lg border border-border bg-card" />
        </div>
      </AppShell>
    );
  }

  if (!query.data) {
    return (
      <AppShell>
        <div className="mx-auto w-full max-w-[1320px] px-5 py-24 md:px-10">
          <span className="label-xs">Not found</span>
          <h1 className="display mt-4 text-4xl text-foreground">This record is unavailable</h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            The knowledge record you opened is not in this prototype archive.
          </p>
          <Link
            to="/search"
            className="mt-6 inline-block rounded-md bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-background"
          >
            Ask the community
          </Link>
        </div>
      </AppShell>
    );
  }

  const { record, contributor, community, reports, evidence } = query.data;
  const locations = Array.from(new Set(reports.map((report) => report.location)));

  return (
    <AppShell>
      <article className="mx-auto w-full max-w-[1320px] px-5 py-14 md:px-10 md:py-20">
        <header className="border-b border-border pb-10">
          <span className="label-xs">Knowledge record</span>
          <h1 className="display mt-4 max-w-4xl text-4xl leading-[1.02] text-foreground md:text-6xl">
            {record.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Community-reported {record.animal ? "livestock" : "agricultural"} practice
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <SignalBadge signal={community.signal} />
            <EvidenceBadge relationship={evidence.relationship} />
            {record.isDemo && (
              <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Prototype data
              </span>
            )}
          </div>
        </header>

        <div className="grid gap-14 pt-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="space-y-16">
            <ProvenancePanel record={record} contributor={contributor} />
            <TranscriptPanel record={record} />
            <StructuredKnowledge record={record} />
            <CommunityEvidencePanel community={community} locations={locations} />
            <ScientificEvidencePanel evidence={evidence} />
            <OutcomeReporting recordId={record.id} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <SafetyCard record={record} />

            <div className="rounded-lg border border-border bg-card p-6">
              <span className="label-xs">Evidence layers</span>
              <ol className="mt-4 space-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                <li>01 — Original community knowledge</li>
                <li>02 — Structured knowledge</li>
                <li className="text-primary">03 — Community evidence</li>
                <li className="text-evidence">04 — Scientific / expert evidence</li>
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                These layers are kept separate. Repetition within a community is not scientific
                validation.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <span className="label-xs">Recent reports</span>
              <ul className="mt-4 space-y-3">
                {reports.slice(0, 4).map((report) => (
                  <li key={report.id} className="text-xs text-muted-foreground">
                    <span className="font-mono uppercase tracking-[0.12em] text-foreground">
                      {report.outcome}
                    </span>{" "}
                    · {report.location}
                    {report.notes && <p className="mt-1 leading-relaxed">{report.notes}</p>}
                  </li>
                ))}
                {reports.length === 0 && (
                  <li className="text-xs text-muted-foreground">No reports yet.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </AppShell>
  );
}
