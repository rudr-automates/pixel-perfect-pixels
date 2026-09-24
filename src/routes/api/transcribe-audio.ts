import { createFileRoute } from "@tanstack/react-router";

/**
 * Live speech boundary (Sarvam Speech-to-Text).
 *
 * Contract consumed by `SarvamSpeechService`:
 *   POST multipart/form-data { audio: File, durationSeconds: string }
 *   200  { transcript, language, dialect, durationSeconds, provider: "sarvam" }
 *
 * SARVAM_API_KEY is read inside the handler and never reaches the browser.
 * Demo mode never calls this route.
 */
export const Route = createFileRoute("/api/transcribe-audio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["SARVAM_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "Speech provider is not configured." },
            { status: 503 },
          );
        }

        const form = await request.formData();
        const audio = form.get("audio");
        if (!(audio instanceof File)) {
          return Response.json({ error: "An audio file is required." }, { status: 400 });
        }

        // TODO(handoff): call Sarvam STT with `audio` and map the provider
        // response onto the contract above. Nothing is faked in the meantime.
        return Response.json(
          { error: "Sarvam transcription is not implemented yet." },
          { status: 501 },
        );
      },
    },
  },
});
