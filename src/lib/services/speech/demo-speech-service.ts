import { speechTranscriptionSchema } from "../../validation/schemas";
import type { SpeechTranscriptionResult } from "../../domain/types";
import type { SpeechInput, SpeechService } from "./speech-service";

/** The canonical demo question used for the judging flow. */
export const CANONICAL_DEMO_QUERY = "Mirchi mein keeda lag gaya, kya karu?";

const DEMO_RECORD_TRANSCRIPT =
  "Hamare yahan gehun ki katai ke baad bhusa ko bans ke machan par rakhte hain, neeche raakh dal dete hain, isse barsat mein bhusa kharab nahin hota.";

/**
 * DEMO SPEECH SERVICE.
 *
 * Real audio is captured by the browser and preserved in the session, but the
 * transcript is deterministic. Nothing here claims Sarvam performed the
 * transcription — the provider field stays "demo" throughout.
 */
export class DemoSpeechService implements SpeechService {
  readonly provider = "demo" as const;

  async transcribe(input: SpeechInput): Promise<SpeechTranscriptionResult> {
    await delay(650);
    const transcript =
      input.scriptHint === "record" ? DEMO_RECORD_TRANSCRIPT : CANONICAL_DEMO_QUERY;

    return speechTranscriptionSchema.parse({
      transcript,
      language: "Hindi",
      dialect: "Bundeli",
      durationSeconds: input.durationSeconds,
      provider: "demo",
    } satisfies SpeechTranscriptionResult);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
