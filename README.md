# AgriVoice — Prototype 01

Voice-first community agricultural knowledge archive. Not a chatbot or advisory engine.

```bash
bun install
bun run dev     # demo mode, no keys needed
bun run test    # community-signal logic tests
bun run build
```

Architecture: routes → features → hooks → services → repositories / provider adapters.
Demo vs live is selected only in `src/lib/services/container.ts`.

See `docs/HANDOFF.md` for what works now vs. what needs live integration,
environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; server-only
`SARVAM_API_KEY`, `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and the migration in
`supabase/migrations/001_initial_schema.sql`.
