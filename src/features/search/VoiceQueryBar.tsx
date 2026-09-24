import { useState } from "react";
import { Keyboard, Search } from "lucide-react";
import { MicButton } from "@/components/audio/MicButton";
import { Waveform } from "@/components/audio/Waveform";
import { useVoiceCapture } from "@/hooks/useVoiceCapture";
import { getServices } from "@/lib/services/container";
import { formatDuration } from "@/lib/domain/labels";
import { cn } from "@/lib/utils";

type Phase = "idle" | "listening" | "understanding" | "error";

interface VoiceQueryBarProps {
  initialQuery?: string;
  onSubmit: (query: string, derivedFrom: "voice" | "text") => void;
  size?: "hero" | "bar";
}

/**
 * The shared voice control: real microphone capture, then transcription through
 * the active SpeechService. It never talks to a provider directly.
 */
export function VoiceQueryBar({ initialQuery = "", onSubmit, size = "bar" }: VoiceQueryBarProps) {
  const capture = useVoiceCapture();
  const [phase, setPhase] = useState<Phase>("idle");
  const [text, setText] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);

  const recording = capture.status === "recording";

  const handleMic = async () => {
    setError(null);
    if (!recording) {
      setPhase("listening");
      await capture.start();
      return;
    }

    capture.stop();
    setPhase("understanding");
    try {
      const result = await getServices().speech.transcribe({
        audio: capture.audio,
        durationSeconds: capture.seconds,
        scriptHint: "search",
      });
      setText(result.transcript);
      setPhase("idle");
      capture.reset();
      onSubmit(result.transcript, "voice");
    } catch {
      setPhase("error");
      setError("Speech service unavailable. You can type your question instead.");
    }
  };

  const micUnavailable = capture.status === "unavailable";

  return (
    <div className={cn("w-full", size === "hero" ? "text-center" : "")}>
      {size === "hero" ? (
        <div className="flex flex-col items-center gap-5">
          <MicButton
            recording={recording}
            onClick={handleMic}
            size="lg"
            label={recording ? "Stop recording" : "Tap to speak your question"}
          />
          <div className="h-12">
            {recording ? (
              <div className="flex flex-col items-center gap-2">
                <span className="label-xs text-primary">Listening · {formatDuration(capture.seconds)}</span>
                <Waveform levels={capture.levels} active />
              </div>
            ) : phase === "understanding" ? (
              <span className="label-xs">Understanding…</span>
            ) : (
              <span className="label-xs">Tap to speak</span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <MicButton
            recording={recording}
            onClick={handleMic}
            size="md"
            label={recording ? "Stop recording" : "Speak your question"}
          />
          {recording ? (
            <div className="flex flex-1 items-center gap-4">
              <span className="label-xs text-primary">Listening</span>
              <Waveform levels={capture.levels} active className="flex-1" />
              <span className="font-mono text-xs text-muted-foreground">
                {formatDuration(capture.seconds)}
              </span>
            </div>
          ) : phase === "understanding" ? (
            <div className="flex flex-1 items-center gap-4">
              <span className="label-xs">Understanding</span>
              <Waveform levels={capture.levels} tone="muted" className="flex-1" />
            </div>
          ) : (
            <form
              className="flex flex-1 items-center gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (text.trim().length > 0) onSubmit(text.trim(), "text");
              }}
            >
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Ask in your own words…"
                aria-label="Ask the community"
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-85"
              >
                <Search className="h-3.5 w-3.5" strokeWidth={1.75} /> Search
              </button>
            </form>
          )}
        </div>
      )}

      {(micUnavailable || error) && (
        <div className="mt-4 rounded-md border border-border bg-card p-4 text-left">
          <p className="label-xs">
            {micUnavailable ? "Microphone unavailable" : "Speech service unavailable"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? capture.error ?? "You can type your question instead."}
          </p>
          <form
            className="mt-3 flex items-center gap-3 border-t border-border pt-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (text.trim().length > 0) onSubmit(text.trim(), "text");
            }}
          >
            <Keyboard className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type your question"
              aria-label="Type your question"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md border border-foreground/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
