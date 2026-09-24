import { ExternalLink } from "lucide-react";
import {
  EVIDENCE_LEVEL_LABEL,
  EVIDENCE_RELATIONSHIP_LABEL,
  EVIDENCE_SOURCE_LABEL,
} from "@/lib/domain/labels";
import type { EvidenceAssessment } from "@/lib/domain/types";
import { SectionHeading } from "../layout/SectionHeading";

export function ScientificEvidencePanel({ evidence }: { evidence: EvidenceAssessment }) {
  return (
    <section aria-labelledby="scientific-evidence">
      <SectionHeading index="04" title="Scientific / expert evidence" />

      {evidence.sources.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          No external evidence has been curated for this record yet. Community reports above stand
          on their own and are not a substitute for scientific assessment.
        </p>
      ) : (
        <div className="mt-6 rounded-lg border border-evidence/35 bg-evidence-surface p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="label-xs">External evidence</p>
              <p className="mt-1 font-display text-xl font-semibold uppercase tracking-tight text-evidence">
                {evidence.relationship
                  ? EVIDENCE_RELATIONSHIP_LABEL[evidence.relationship]
                  : "Not assessed"}
              </p>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-evidence">
              {evidence.sources.length} curated sources
            </span>
          </div>

          <ul className="mt-6 space-y-4">
            {evidence.sources.map((source) => (
              <li
                key={source.id}
                className="rounded-md border border-evidence/25 bg-background p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-evidence">
                    {EVIDENCE_SOURCE_LABEL[source.sourceType]}
                  </span>
                  {source.isDemo && (
                    <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                      Demo evidence
                    </span>
                  )}
                </div>

                <h4 className="mt-3 text-base font-semibold text-foreground">{source.title}</h4>

                <dl className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="label-xs">Publisher</dt>
                    <dd className="mt-1 text-sm text-foreground">{source.publisher}</dd>
                  </div>
                  <div>
                    <dt className="label-xs">Relationship</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {EVIDENCE_RELATIONSHIP_LABEL[source.relationship]}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-xs">Evidence level</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {EVIDENCE_LEVEL_LABEL[source.evidenceLevel]}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {source.summary}
                </p>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-evidence hover:underline"
                  >
                    Open source <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                )}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Evidence entries in this prototype are illustrative and marked as demo evidence. No
            citations, identifiers or links are fabricated.
          </p>
        </div>
      )}
    </section>
  );
}
