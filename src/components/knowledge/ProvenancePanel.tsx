import { formatDate, ROLE_LABEL } from "@/lib/domain/labels";
import type { Contributor, KnowledgeRecord } from "@/lib/domain/types";
import { AudioPlayer } from "../audio/AudioPlayer";
import { SectionHeading } from "../layout/SectionHeading";

export function ProvenancePanel({
  record,
  contributor,
}: {
  record: KnowledgeRecord;
  contributor: Contributor;
}) {
  const fields = [
    { label: "Knowledge keeper", value: contributor.displayName },
    { label: "Role", value: ROLE_LABEL[contributor.role] },
    { label: "Region", value: record.region },
    { label: "District", value: record.district },
    { label: "Language", value: record.originalLanguage },
    { label: "Dialect", value: record.dialect },
    { label: "Recorded", value: formatDate(record.createdAt) },
    {
      label: "Source",
      value: record.sourceType === "voice_recording" ? "Original voice recording" : "Text entry",
    },
  ].filter((field) => Boolean(field.value));

  return (
    <section aria-labelledby="provenance">
      <SectionHeading index="01" title="Provenance" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <dl className="grid grid-cols-2 gap-6 rounded-lg border border-border bg-card p-6 sm:grid-cols-3">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="label-xs">{field.label}</dt>
              <dd className="mt-1.5 text-sm text-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-4">
          <AudioPlayer src={record.audioUrl} />
          <p className="text-xs leading-relaxed text-muted-foreground">
            The original spoken contribution is the source of this record. Structured fields below
            are derived from it and can be corrected by the knowledge keeper.
          </p>
        </div>
      </div>
    </section>
  );
}
