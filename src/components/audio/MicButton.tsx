import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  recording: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: "lg" | "md";
  label: string;
}

export function MicButton({ recording, onClick, disabled, size = "lg", label }: MicButtonProps) {
  const dimension = size === "lg" ? "h-28 w-28 md:h-32 md:w-32" : "h-14 w-14";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={recording}
      className={cn(
        "relative grid place-items-center rounded-full border transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        dimension,
        recording
          ? "border-primary bg-primary text-primary-foreground"
          : "border-foreground/15 bg-card text-foreground hover:border-primary hover:text-primary",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {recording && (
        <span className="absolute inset-0 animate-ping rounded-full border border-primary/40" />
      )}
      {recording ? (
        <Square className={size === "lg" ? "h-8 w-8" : "h-5 w-5"} strokeWidth={1.5} />
      ) : (
        <Mic className={size === "lg" ? "h-10 w-10" : "h-5 w-5"} strokeWidth={1.25} />
      )}
    </button>
  );
}
