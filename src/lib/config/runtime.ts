/**
 * Runtime configuration.
 *
 * DEMO is the default mode and must work with zero external credentials.
 * LIVE is used whenever it is requested. If its configuration is missing the
 * app stays in LIVE and exposes an explicit configuration error — it never
 * silently becomes demo, and never fabricates results after a failed live call.
 */

export type AppMode = "demo" | "live";

function readEnv(key: string): string | undefined {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  return value && value.length > 0 ? value : undefined;
}

const requestedMode = (readEnv("VITE_APP_MODE") ?? "demo").toLowerCase();

export const supabaseConfig = {
  url: readEnv("VITE_SUPABASE_URL") ?? null,
  publishableKey: readEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ?? null,
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.publishableKey);

export const appMode: AppMode = requestedMode === "live" ? "live" : "demo";

export const isDemoMode = appMode === "demo";

/** Non-null when live mode was requested but cannot run. Shown in the UI. */
export const liveConfigError: string | null =
  appMode === "live" && !isSupabaseConfigured
    ? "Live mode is selected but VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY are missing. Live data is unavailable; set VITE_APP_MODE=demo to use the demo."
    : null;
