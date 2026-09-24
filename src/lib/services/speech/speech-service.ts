import type { SpeechTranscriptionResult } from "../../domain/types";

export interface SpeechInput {
  audio: Blob | null;
  durationSeconds: number;
  /** Optional hint used by the demo provider to pick a deterministic script. */
  scriptHint?: "search" | "record";
}

export interface SpeechService {
  readonly provider: "demo" | "sarvam";
  transcribe(input: SpeechInput): Promise<SpeechTranscriptionResult>;
}
