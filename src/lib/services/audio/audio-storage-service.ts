import {
  reassignSessionAudio,
  registerSessionAudio,
  revokeSessionAudio,
} from "../../audio/session-audio-registry";

export type AudioKind = "knowledge" | "outcome";

export interface StoredAudio {
  /** Key used to track the stored object (draft key in demo, object path in live). */
  key: string;
  url: string | null;
}

/**
 * Audio storage boundary: Blob → storage → URL for `audio_url`.
 * React components call this through the container, never a storage SDK.
 */
export interface AudioStorageService {
  readonly provider: "session" | "supabase";
  store(blob: Blob, kind: AudioKind): Promise<StoredAudio>;
  /** Associates a stored draft with its persisted record id. */
  attach(key: string, recordId: string): void;
  discard(key: string): void;
}

/** DEMO: keeps the real recording as a session object URL. */
export class SessionAudioStorageService implements AudioStorageService {
  readonly provider = "session" as const;

  async store(blob: Blob, kind: AudioKind): Promise<StoredAudio> {
    const key = `${kind}-draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return { key, url: registerSessionAudio(key, blob) };
  }

  attach(key: string, recordId: string) {
    reassignSessionAudio(key, recordId);
  }

  discard(key: string) {
    revokeSessionAudio(key);
  }
}

/**
 * LIVE INTEGRATION BOUNDARY — IMPLEMENTATION PENDING.
 * Will upload to the `knowledge-audio` / `outcome-audio` Supabase Storage buckets.
 */
export class SupabaseAudioStorageService implements AudioStorageService {
  readonly provider = "supabase" as const;

  async store(): Promise<StoredAudio> {
    throw new Error("Supabase audio storage is not implemented yet.");
  }

  attach() {}

  discard() {}
}
