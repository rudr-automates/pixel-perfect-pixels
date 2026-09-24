/**
 * Runtime configuration.
 *
 * DEMO is the default mode and must work with zero external credentials.
 * LIVE only activates when the required configuration is present; the app never
 * silently fabricates results after a failed live call.
 */

export type AppMode = "demo" | "live";

function readEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value.length > 0 ? value : undefined;
}

const requestedMode = (readEnv("VITE_APP_MODE") ?? "demo").toLowerCase();

export const supabaseConfig = {
  url: readEnv("VITE_SUPABASE_URL") ?? null,
  anonKey: readEnv("VITE_SUPABASE_ANON_KEY") ?? null,
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

/** Live mode requires a configured backend; otherwise we stay honestly in demo. */
export const appMode: AppMode = requestedMode === "live" && isSupabaseConfigured ? "live" : "demo";

export const isDemoMode = appMode === "demo";

export const liveModeUnavailableReason =
  requestedMode === "live" && !isSupabaseConfigured
    ? "Live mode requested but the backend is not configured. Running in demo mode."
    : null;
