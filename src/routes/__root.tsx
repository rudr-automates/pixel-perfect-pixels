import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/layout/AppShell";

function NotFoundComponent() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[60vh] w-full max-w-[1320px] flex-col justify-center px-5 py-24 md:px-10">
        <span className="label-xs">404</span>
        <h1 className="display mt-4 text-5xl text-foreground md:text-6xl">
          This record
          <br />
          does not exist
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page or knowledge record you are looking for is not part of this prototype. You can
          search the community archive instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/search"
            className="rounded-md bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-background"
          >
            Ask the community
          </Link>
          <Link
            to="/"
            className="rounded-md border border-foreground/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="max-w-md">
        <span className="label-xs">Error</span>
        <h1 className="display mt-3 text-3xl text-foreground">This page didn't load</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Something failed while loading this screen. Nothing was fabricated to hide it — you can
          retry or return home.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-foreground px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-foreground/20 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgriVoice — Community knowledge archive" },
      {
        name: "description",
        content:
          "AgriVoice preserves spoken community knowledge, structures it, and keeps community evidence separate from scientific evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Work+Sans:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
