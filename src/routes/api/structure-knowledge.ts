import { createFileRoute } from "@tanstack/react-router";

/**
 * Live understanding boundary (Gemini).
 *
 * Contract consumed by `GeminiKnowledgeUnderstandingService`:
 *   POST { task: "interpret_query", query }
 *     200 { crop, animal, problem, region, intent, language }
 *   POST { task: "structure_knowledge", transcript, language }
 *     200 { title, knowledgeType, crop, animal, problem, practice, method,
 *           season, region, context, safetyStatus, provider: "gemini" }
 *
 * GEMINI_API_KEY is read inside the handler and never reaches the browser.
 */
export const Route = createFileRoute("/api/structure-knowledge")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["GEMINI_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "Understanding provider is not configured." },
            { status: 503 },
          );
        }

        const body = (await request.json()) as { task?: string };
        if (body.task !== "interpret_query" && body.task !== "structure_knowledge") {
          return Response.json({ error: "Unknown task." }, { status: 400 });
        }

        // TODO(handoff): prompt Gemini for strict JSON matching the contract
        // above, validate it server-side, then return the normalized object.
        return Response.json(
          { error: "Gemini understanding is not implemented yet." },
          { status: 501 },
        );
      },
    },
  },
});
