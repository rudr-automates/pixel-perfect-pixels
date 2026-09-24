import { speechTranscriptionSchema } from "../../validation/schemas";
import type { SpeechTranscriptionResult } from "../../domain/types";
import type { SpeechInput, SpeechService } from "./speech-service";

/**
 * LIVE SPEECH ADAPTER — Sarvam Speech-to-Text.
 *
 * The API key must never reach the browser. This adapter posts the captured
 * audio to a server route (`/api/transcribe-audio`) which holds the key
 * and returns a normalized payload matching `speechTranscriptionSchema`.
 */
export class SarvamSpeechService implements SpeechService {
  readonly provider = "sarvam" as const;

  constructor(private readonly endpoint: string) {}

  async transcribe(input: SpeechInput): Promise<SpeechTranscriptionResult> {
    if (!input.audio) {
      throw new Error("No audio was captured.");
    }

    const body = new FormData();
    body.append("audio", input.audio, "recording.webm");
    body.append("durationSeconds", String(input.durationSeconds));

    const response = await fetch(this.endpoint, { method: "POST", body });
    if (!response.ok) {
      throw new Error(`Speech service unavailable (${response.status}).`);
    }

    const payload = (await response.json()) as unknown;
    return speechTranscriptionSchema.parse(payload);
  }
}
