import type { SearchUnderstanding } from "@/lib/domain/types";

/**
 * Shows that AgriVoice does not search raw speech: it structures the question
 * first. This is the middle beat of the voice → knowledge → evidence motif.
 */
export function UnderstandingPanel({ understanding }: { understanding: SearchUnderstanding }) {
  const fields = [
    { label: "Crop", value: understanding.crop },
    { label: "Animal", value: understanding.animal },
    { label: "Problem", value: understanding.problem },
    { label: "Region", value: understanding.region },
    { label: "Intent", value: understanding.intent },
    { label: "Language", value: understanding.language },
  ].filter((field): field is { label: string; value: string } => Boolean(field.value));

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-xs">Understood question</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {understanding.derivedFrom === "voice" ? "From voice" : "From text"}
        </span>
      </div>

      <p className="mt-3 text-base italic leading-relaxed text-foreground">
        “{understanding.query}”
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-border pt-5 sm:grid-cols-3 lg:grid-cols-6">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="label-xs">{field.label}</dt>
            <dd className="mt-1.5 text-sm font-medium text-foreground">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
