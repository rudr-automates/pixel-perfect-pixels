import { cn } from "@/lib/utils";

interface WaveformProps {
  levels: number[];
  active?: boolean;
  className?: string;
  tone?: "primary" | "muted";
}

/**
 * The signature waveform motif: voice → knowledge → evidence.
 * Restrained, monochrome bars driven by real amplitude data where available.
 */
export function Waveform({ levels, active = false, className, tone = "primary" }: WaveformProps) {
  return (
    <div
      aria-hidden
      className={cn("flex h-10 items-center gap-[3px]", className)}
      data-active={active}
    >
      {levels.map((level, index) => (
        <span
          key={index}
          className={cn(
            "w-[3px] rounded-full transition-[height] duration-150 ease-out",
            tone === "primary" ? "bg-primary" : "bg-muted-foreground/45",
            active ? "opacity-100" : "opacity-40",
          )}
          style={{ height: `${Math.max(3, level * 40)}px` }}
        />
      ))}
    </div>
  );
}

/** Idle decorative waveform used in headers and empty states. */
export function StaticWaveform({ bars = 32, className }: { bars?: number; className?: string }) {
  const levels = Array.from({ length: bars }, (_, i) => 0.12 + Math.abs(Math.sin(i * 0.7)) * 0.5);
  return <Waveform levels={levels} className={className} tone="muted" />;
}
