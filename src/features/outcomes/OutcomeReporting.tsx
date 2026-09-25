import { useState } from "react";
import { Check, Mic } from "lucide-react";
import { useOutcomeReport } from "@/hooks/useOutcomeReport";
import { useVoiceCapture } from "@/hooks/useVoiceCapture";
import { getServices } from "@/lib/services/container";
import { OUTCOME_LABEL } from "@/lib/domain/labels";
import type { OutcomeValue } from "@/lib/domain/types";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Waveform } from "@/components/audio/Waveform";
import { cn } from "@/lib/utils";

export function OutcomeReporting({ recordId }: { recordId: string }) {
  const [outcome, setOutcome] = useState<OutcomeValue | null>(null);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const capture = useVoiceCapture();
  const mutation = useOutcomeReport(recordId);

  const recordVoiceNote = async () => {
    if (capture.status !== "recording") {
      await capture.start();
      return;
    }
    const services = getServices();
    const completed = await capture.stop();
    if (completed.audio) {
      try {
        const stored = await services.audioStorage.store(completed.audio, "outcome");
        setVoiceUrl(stored.url);
      } catch {
        setVoiceUrl(null);
      }
    }
    let result;
    try {
      result = await services.speech.transcribe({
        audio: completed.audio,
        durationSeconds: completed.durationSeconds,
        scriptHint: "record",
      });
    } catch {
      capture.reset();
      setShowContext(true);
      return;
    }
    setVoiceNote(result.transcript);
    setNotes((prev) => (prev.length > 0 ? prev : result.transcript));
    setShowContext(true);
    capture.reset();
  };

  const submit = () => {
    if (!outcome) return;
    mutation.mutate({
      knowledgeRecordId: recordId,
      outcome,
      notes: notes.trim().length > 0 ? notes.trim() : null,
      location: location.trim().length > 0 ? location.trim() : "Not specified",
      audioUrl: voiceUrl,
    });
  };

  if (mutation.isSuccess) {
    const { previousAttempts, community } = mutation.data;
    return (
      <section className="rounded-lg border border-primary/30 bg-[color-mix(in_oklab,var(--primary)_6%,var(--card))] p-8">
        <div className="flex items-center gap-2 text-primary">
          <Check className="h-4 w-4" strokeWidth={2} />
          <span className="label-xs text-primary">Outcome recorded</span>
        </div>
        <p className="mt-3 display text-3xl text-foreground">
          {previousAttempts} → {community.attempts} documented attempts
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {community.positiveRate}% positive reporting rate across {community.uniqueContributors}{" "}
          contributors and {community.uniqueLocations} locations. Community signal is recalculated
          from the underlying reports.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="outcome-reporting">
      <SectionHeading
        title="Did you try this practice?"
        description="Reporting what happened — good or bad — is how this record becomes useful to the next person."
      />

      <div className="mt-6 rounded-lg border border-border bg-card p-6 md:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {(["positive", "neutral", "negative"] as OutcomeValue[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setOutcome(value)}
              aria-pressed={outcome === value}
              className={cn(
                "rounded-md border px-5 py-5 text-left transition-colors duration-200",
                outcome === value
                  ? "border-primary bg-[color-mix(in_oklab,var(--primary)_10%,transparent)]"
                  : "border-border hover:border-foreground/30",
              )}
            >
              <span className="display text-lg text-foreground">{OUTCOME_LABEL[value]}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowContext((prev) => !prev)}
            className="rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground/40"
          >
            Add context
          </button>
          <button
            type="button"
            onClick={recordVoiceNote}
            className={cn(
              "inline-flex items-center gap-2 rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors",
              capture.status === "recording"
                ? "border-primary text-primary"
                : "border-border text-foreground hover:border-foreground/40",
            )}
          >
            <Mic className="h-3.5 w-3.5" strokeWidth={1.5} />
            {capture.status === "recording" ? "Stop" : "Report by voice"}
          </button>
          {capture.status === "recording" && (
            <Waveform levels={capture.levels} active className="h-8" />
          )}
        </div>

        {capture.status === "unavailable" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Microphone unavailable — write your report instead.
          </p>
        )}

        {voiceNote && (
          <p className="mt-3 text-xs text-muted-foreground">
            Voice note transcript added below. You can edit it before submitting.
          </p>
        )}

        {showContext && (
          <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label-xs">Note (optional)</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus-visible:border-primary"
                placeholder="What did you observe?"
              />
            </label>
            <label className="block">
              <span className="label-xs">Location</span>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus-visible:border-primary"
                placeholder="District or village"
              />
            </label>
            <div>
              <span className="label-xs">Date</span>
              <p className="mt-2 rounded-md border border-border bg-background p-3 text-sm text-muted-foreground">
                Today
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-5">
          <button
            type="button"
            onClick={submit}
            disabled={!outcome || mutation.isPending}
            className="rounded-md bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mutation.isPending ? "Recording…" : "Submit report"}
          </button>
          <p className="text-xs text-muted-foreground">
            Reports are stored in this prototype session and counted as community evidence.
          </p>
        </div>

        {mutation.isError && (
          <p className="mt-4 text-sm text-destructive">
            {mutation.error.message || "The report could not be saved. Please try again."}
          </p>
        )}
      </div>
    </section>
  );
}
