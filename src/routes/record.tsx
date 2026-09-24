import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { MicButton } from "@/components/audio/MicButton";
import { Waveform } from "@/components/audio/Waveform";
import { useVoiceCapture } from "@/hooks/useVoiceCapture";
import { useCreateKnowledge } from "@/hooks/useCreateKnowledge";
import { getServices } from "@/lib/services/container";
import { demoSessionContributorId } from "@/lib/demo/contributors";
import { formatDuration } from "@/lib/domain/labels";
import type { KnowledgeStructureResult } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

type Step = "record" | "understand" | "review" | "done";

const STEPS: { key: Step; label: string }[] = [
  { key: "record", label: "Record" },
  { key: "understand", label: "Understand" },
  { key: "review", label: "Review" },
  { key: "done", label: "Confirm" },
];

export const Route = createFileRoute("/record")({
  head: () => ({
    meta: [
      { title: "Record knowledge — AgriVoice" },
      {
        name: "description",
        content:
          "Speak a local practice in your own language. AgriVoice preserves the recording and turns it into a searchable knowledge record you can correct.",
      },
      { property: "og:title", content: "Record knowledge — AgriVoice" },
      {
        property: "og:description",
        content: "Your voice becomes a searchable community knowledge record.",
      },
    ],
  }),
  component: RecordPage,
});

function RecordPage() {
  const navigate = useNavigate();
  const capture = useVoiceCapture();
  const create = useCreateKnowledge();
  const [step, setStep] = useState<Step>("record");
  const [consent, setConsent] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [structure, setStructure] = useState<KnowledgeStructureResult | null>(null);
  const [newRecordId, setNewRecordId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<"voice" | "transcript" | "structure">("voice");

  const services = getServices();
  const recording = capture.status === "recording";

  const handleMic = async () => {
    if (!recording) {
      await capture.start();
      return;
    }
    capture.stop();
    setStep("understand");
    setStage("voice");
    setError(null);

    try {
      const speech = await services.speech.transcribe({
        audio: capture.audio,
        durationSeconds: capture.seconds,
        scriptHint: "record",
      });
      setTranscript(speech.transcript);
      setStage("transcript");
      const structured = await services.understanding.structure(
        speech.transcript,
        speech.language,
      );
      setStructure(structured);
      setStage("structure");
      setStep("review");
    } catch {
      setError("The understanding service is unavailable. Your recording and transcript are kept.");
      setStep("record");
    }
  };

  const confirm = () => {
    if (!structure) return;
    create.mutate(
      {
        transcript,
        originalLanguage: "Hindi",
        dialect: "Bundeli",
        structure,
        audioUrl: null,
        contributorId: demoSessionContributorId,
        consentConfirmed: consent,
      },
      {
        onSuccess: (record) => {
          setNewRecordId(record.id);
          setStep("done");
        },
      },
    );
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-[900px] px-5 py-14 md:px-10 md:py-20">
        <span className="label-xs">Contribute</span>
        <h1 className="display mt-4 text-4xl text-foreground md:text-5xl">Record knowledge</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your voice becomes a searchable knowledge record.
        </p>

        <ol className="mt-10 flex flex-wrap gap-x-8 gap-y-2">
          {STEPS.map((item, index) => (
            <li
              key={item.key}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.14em]",
                STEPS.findIndex((s) => s.key === step) >= index
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {String(index + 1).padStart(2, "0")} {item.label}
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-lg border border-border bg-card p-8 md:p-12">
          {step === "record" && (
            <div className="flex flex-col items-center text-center">
              <MicButton
                recording={recording}
                onClick={handleMic}
                label={recording ? "Stop recording" : "Tap to start recording"}
                disabled={!consent}
              />
              <p className="mt-6 label-xs">
                {recording ? `Recording · ${formatDuration(capture.seconds)}` : "Tap to start"}
              </p>
              {recording && <Waveform levels={capture.levels} active className="mt-4" />}

              {recording && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={capture.pause}
                    className="rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={capture.resume}
                    className="rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={capture.reset}
                    className="rounded-md border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em]"
                  >
                    Restart
                  </button>
                </div>
              )}

              <label className="mt-10 flex max-w-sm items-start gap-3 text-left text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-[color:var(--primary)]"
                />
                I have permission to record and share this knowledge.
              </label>

              {capture.status === "unavailable" && (
                <div className="mt-8 w-full max-w-md rounded-md border border-border p-4 text-left">
                  <p className="label-xs">Microphone unavailable</p>
                  <textarea
                    value={transcript}
                    onChange={(event) => setTranscript(event.target.value)}
                    rows={4}
                    placeholder="Type the knowledge instead"
                    className="mt-3 w-full rounded-md border border-border bg-background p-3 text-sm"
                  />
                  <button
                    type="button"
                    disabled={!consent || transcript.trim().length < 10}
                    onClick={async () => {
                      setStep("understand");
                      const structured = await services.understanding.structure(transcript, "Hindi");
                      setStructure(structured);
                      setStep("review");
                    }}
                    className="mt-3 rounded-md bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-background disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              )}

              {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
            </div>
          )}

          {step === "understand" && (
            <div className="space-y-6">
              <ProcessingStage active={stage === "voice"} done={stage !== "voice"} label="Voice" />
              <ProcessingStage
                active={stage === "transcript"}
                done={stage === "structure"}
                label="Transcript"
                detail={transcript}
              />
              <ProcessingStage active={stage === "structure"} done={false} label="Knowledge structure" />
            </div>
          )}

          {step === "review" && structure && (
            <div>
              <span className="label-xs">Review knowledge</span>
              <h2 className="display mt-3 text-2xl text-foreground">{structure.title}</h2>

              <div className="mt-6">
                <span className="label-xs">Original transcript</span>
                <p className="mt-2 rounded-md border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                  {transcript}
                </p>
              </div>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <EditableField
                  label="Crop"
                  value={structure.crop ?? ""}
                  onChange={(value) => setStructure({ ...structure, crop: value || null })}
                />
                <EditableField
                  label="Problem"
                  value={structure.problem ?? ""}
                  onChange={(value) => setStructure({ ...structure, problem: value || null })}
                />
                <EditableField
                  label="Practice"
                  value={structure.practice ?? ""}
                  onChange={(value) => setStructure({ ...structure, practice: value || null })}
                />
                <EditableField
                  label="Region"
                  value={structure.region}
                  onChange={(value) => setStructure({ ...structure, region: value })}
                />
                <EditableField
                  label="Season"
                  value={structure.season ?? ""}
                  onChange={(value) => setStructure({ ...structure, season: value || null })}
                />
                <EditableField
                  label="Context"
                  value={structure.context ?? ""}
                  onChange={(value) => setStructure({ ...structure, context: value || null })}
                />
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Extraction is not infallible. Correct anything that does not match what you said
                before confirming.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep("record")}
                  className="rounded-md border border-foreground/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
                >
                  Re-record
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={create.isPending}
                  className="rounded-md bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-50"
                >
                  {create.isPending ? "Saving…" : "Confirm knowledge"}
                </button>
              </div>

              {create.isError && (
                <p className="mt-4 text-sm text-destructive">{create.error.message}</p>
              )}
            </div>
          )}

          {step === "done" && newRecordId && (
            <div>
              <div className="flex items-center gap-2 text-primary">
                <Check className="h-4 w-4" strokeWidth={2} />
                <span className="label-xs text-primary">Knowledge added</span>
              </div>
              <h2 className="display mt-4 text-3xl text-foreground">
                {structure?.title ?? "New knowledge record"}
              </h2>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                <li>Original voice preserved in this session</li>
                <li>Structured knowledge created</li>
                <li>Available for community discovery</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/knowledge/$id"
                  params={{ id: newRecordId }}
                  className="rounded-md bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-background"
                >
                  View knowledge record
                </Link>
                <button
                  type="button"
                  onClick={() =>
                    void navigate({
                      to: "/search",
                      search: { q: structure?.crop ?? transcript.slice(0, 24), from: "text" },
                    })
                  }
                  className="rounded-md border border-foreground/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
                >
                  Search this knowledge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function ProcessingStage({
  label,
  active,
  done,
  detail,
}: {
  label: string;
  active: boolean;
  done: boolean;
  detail?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-5 transition-colors duration-300",
        active ? "border-primary/50" : done ? "border-border" : "border-border/60 opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("label-xs", active && "text-primary")}>{label}</span>
        {done && <Check className="h-4 w-4 text-primary" strokeWidth={2} />}
      </div>
      {detail && <p className="mt-3 text-sm leading-relaxed text-foreground">{detail}</p>}
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="label-xs">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus-visible:border-primary"
      />
    </label>
  );
}
