import { KNOWLEDGE_TYPE_LABEL } from "@/lib/domain/labels";
import type { KnowledgeRecord } from "@/lib/domain/types";
import { SectionHeading } from "../layout/SectionHeading";

export function TranscriptPanel({ record }: { record: KnowledgeRecord }) {
  return (
    <section aria-labelledby="original-transcript">
      <SectionHeading index="02" title="Original transcript" />
      <blockquote className="mt-6 rounded-lg border border-border bg-card p-6 md:p-8">
        <p className="text-lg leading-relaxed text-foreground">{record.transcript}</p>
        {record.transcriptNote && (
          <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {record.transcriptNote}
          </footer>
        )}
      </blockquote>
      <p className="mt-3 text-xs text-muted-foreground">
        Preserved as spoken. It is not rewritten into polished English.
      </p>
    </section>
  );
}

export function StructuredKnowledge({ record }: { record: KnowledgeRecord }) {
  const fields = [
    { label: "Knowledge type", value: KNOWLEDGE_TYPE_LABEL[record.knowledgeType] },
    { label: "Crop", value: record.crop },
    { label: "Animal", value: record.animal },
    { label: "Problem", value: record.problem },
    { label: "Practice", value: record.practice },
    { label: "Method", value: record.method },
    { label: "Season", value: record.season },
    { label: "Region", value: record.region },
    { label: "Context", value: record.context },
  ].filter((field): field is { label: string; value: string } => Boolean(field.value));

  return (
    <section aria-labelledby="structured-knowledge">
      <SectionHeading
        title="Structured interpretation"
        description="Derived from the original recording. Only fields with actual data are shown."
      />
      <dl className="mt-6 grid gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-2 md:p-8 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="label-xs">{field.label}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{field.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
