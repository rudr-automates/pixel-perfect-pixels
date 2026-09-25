/**
 * Browser-session audio registry.
 *
 * Holds object URLs for recordings captured in this tab so demo-mode knowledge
 * records can play the real voice back. Blobs never touch localStorage and the
 * domain model only ever sees `audioUrl: string | null`.
 */
const urls = new Map<string, string>();

function canCreateUrls() {
  return typeof URL !== "undefined" && typeof URL.createObjectURL === "function";
}

/** Registers a Blob under a key and returns its playable object URL. */
export function registerSessionAudio(key: string, blob: Blob): string | null {
  if (!canCreateUrls()) return null;
  revokeSessionAudio(key);
  const url = URL.createObjectURL(blob);
  urls.set(key, url);
  return url;
}

export function getSessionAudio(key: string): string | null {
  return urls.get(key) ?? null;
}

/** Moves a URL from a draft key to its final knowledge-record id. */
export function reassignSessionAudio(fromKey: string, toKey: string) {
  const url = urls.get(fromKey);
  if (!url) return;
  urls.delete(fromKey);
  urls.set(toKey, url);
}

export function revokeSessionAudio(key: string) {
  const url = urls.get(key);
  if (!url) return;
  URL.revokeObjectURL(url);
  urls.delete(key);
}

export function revokeAllSessionAudio() {
  for (const url of urls.values()) URL.revokeObjectURL(url);
  urls.clear();
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", revokeAllSessionAudio);
}
