import { useEffect, useRef, useState } from "react";
import { AudioLines, Pause, Play } from "lucide-react";
import { formatDuration } from "@/lib/domain/labels";
import { StaticWaveform } from "./Waveform";

type PlayerState = "idle" | "loading" | "playing" | "paused" | "error" | "unavailable";

interface AudioPlayerProps {
  /** A playable URL, or null/demo URI when no audio file is available. */
  src: string | null;
  title?: string;
}

/**
 * Reusable audio surface with explicit states. Demo records carry a `demo://`
 * reference rather than a media file, so the player reports honestly that the
 * audio is unavailable while the transcript stays accessible.
 */
export function AudioPlayer({ src, title = "Original voice" }: AudioPlayerProps) {
  const playable = Boolean(src && !src.startsWith("demo://"));
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>(playable ? "idle" : "unavailable");
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setState(playable ? "idle" : "unavailable");
    setPosition(0);
    setDuration(0);
  }, [playable, src]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state === "playing") {
      audio.pause();
      setState("paused");
      return;
    }
    setState("loading");
    audio
      .play()
      .then(() => setState("playing"))
      .catch(() => setState("error"));
  };

  const progress = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="panel flex items-center gap-4 p-4">
      <button
        type="button"
        onClick={toggle}
        disabled={!playable}
        aria-label={state === "playing" ? "Pause original voice" : "Play original voice"}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-foreground/15 bg-background text-foreground transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
      >
        {state === "playing" ? (
          <Pause className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Play className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="label-xs">{title}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {state === "unavailable" ? "AUDIO UNAVAILABLE" : `${formatDuration(position)} / ${formatDuration(duration)}`}
          </span>
        </div>

        {state === "unavailable" || state === "error" ? (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <AudioLines className="h-4 w-4" strokeWidth={1.5} />
            <span>
              {state === "error"
                ? "Audio could not be played. The transcript below remains available."
                : "Original audio is not attached to this prototype record. Transcript below."}
            </span>
          </div>
        ) : (
          <>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-strong">
              <div
                className="h-full bg-primary transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <StaticWaveform bars={40} className="mt-2 h-6" />
          </>
        )}
      </div>

      {playable && src && (
        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
          onEnded={() => setState("idle")}
          onError={() => setState("error")}
        />
      )}
    </div>
  );
}
