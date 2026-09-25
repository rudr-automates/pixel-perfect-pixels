import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { isDemoMode, liveConfigError } from "@/lib/config/runtime";

const NAV = [
  { to: "/search", label: "Search" },
  { to: "/record", label: "Record" },
  { to: "/explore", label: "Explore" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1320px] items-center justify-between gap-6 px-5 md:px-10">
          <Link to="/" className="group flex items-center gap-3">
            <span className="display text-lg tracking-[0.3em] text-foreground">AGRIVOICE</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
            {isDemoMode && (
              <span className="ml-2 hidden rounded-full border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary sm:inline">
                Demo mode
              </span>
            )}
          </nav>
        </div>
      </header>

      {liveConfigError && (
        <div role="alert" className="border-b border-destructive/40 bg-destructive/10 px-5 py-3 text-center text-sm text-destructive md:px-10">
          {liveConfigError}
        </div>
      )}

      <main className="flex-1">{children}</main>

      <footer className="mt-24 border-t border-border">
        <div className="mx-auto w-full max-w-[1320px] px-5 py-14 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                AgriVoice is not an AI that gives answers. It is infrastructure that helps
                communities preserve, discover and progressively understand knowledge.
              </p>
            </div>

            <div>
              <p className="label-xs">Future channels</p>
              <p className="mt-3 font-mono text-xs leading-6 text-muted-foreground">
                SMARTPHONE
                <br />+ IVR
                <br />+ WEB / API
              </p>
            </div>

            <div>
              <p className="label-xs">Knowledge chain</p>
              <p className="mt-3 font-mono text-xs leading-6 text-muted-foreground">
                COMMUNITY KNOWLEDGE
                <br />↓ COMMUNITY EVIDENCE
                <br />↓ SCIENTIFIC EVIDENCE
                <br />↓ PEOPLE + ORGANIZATIONS
              </p>
            </div>
          </div>

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Prototype 01 · Prototype data · Not real traction figures
          </p>
        </div>
      </footer>
    </div>
  );
}
