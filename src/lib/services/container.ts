import { appMode } from "../config/runtime";
import { DemoKnowledgeRepository } from "../repositories/demo-knowledge-repository";
import { SupabaseKnowledgeRepository } from "../repositories/supabase-knowledge-repository";
import type { KnowledgeRepository } from "../repositories/knowledge-repository";
import { DemoSpeechService } from "./speech/demo-speech-service";
import { SarvamSpeechService } from "./speech/sarvam-speech-service";
import type { SpeechService } from "./speech/speech-service";
import { DemoKnowledgeUnderstandingService } from "./knowledge/demo-understanding-service";
import { GeminiKnowledgeUnderstandingService } from "./knowledge/gemini-understanding-service";
import type { KnowledgeUnderstandingService } from "./knowledge/understanding-service";
import { KnowledgeSearchService } from "./search/knowledge-search-service";
import { KnowledgeService } from "./knowledge/knowledge-service";
import { EvidenceService } from "./evidence/evidence-service";
import { OutcomeService } from "./outcome/outcome-service";

/**
 * Composition root.
 *
 * This is the only place that knows which implementation is active. Components
 * and hooks depend on the service interfaces, never on a provider.
 */
function createServices() {
  const repository: KnowledgeRepository =
    appMode === "live" ? new SupabaseKnowledgeRepository() : new DemoKnowledgeRepository();

  const speech: SpeechService =
    appMode === "live"
      ? new SarvamSpeechService("/api/public/transcribe-audio")
      : new DemoSpeechService();

  const understanding: KnowledgeUnderstandingService =
    appMode === "live"
      ? new GeminiKnowledgeUnderstandingService("/api/public/structure-knowledge")
      : new DemoKnowledgeUnderstandingService();

  return {
    mode: appMode,
    repository,
    speech,
    understanding,
    knowledge: new KnowledgeService(repository),
    search: new KnowledgeSearchService(repository, understanding),
    evidence: new EvidenceService(repository),
    outcome: new OutcomeService(repository),
  };
}

export type Services = ReturnType<typeof createServices>;

let instance: Services | null = null;

export function getServices(): Services {
  if (!instance) instance = createServices();
  return instance;
}
