# AgriVoice — Prototype 01 handoff

## What this is

A voice-first community agricultural knowledge archive. The central object is a
**knowledge record**: what a person said, how it was structured, who contributed
it, what the community reported after trying it, and — separately — what
scientific or expert sources say about it.

It is not a chatbot and not an advisory engine. Nothing here claims authority it
does not have.

## Running it

```bash
bun install
bun run dev
```

Demo mode is the default and needs no keys, no database and no external
services. Copy `.env.example` to `.env` only when moving to live mode.

## Modes

| | Demo (default) | Live |
|---|---|---|
| Data | deterministic in-memory corpus, marked demo | your own Supabase project |
| Speech | deterministic demo transcripts, `provider: demo` | Sarvam via `/api/transcribe-audio` |
| Understanding | deterministic rule-based interpretation | Gemini via `/api/structure-knowledge` |

Live mode activates only when `VITE_APP_MODE=live` and both Supabase values are
set (`src/lib/config/runtime.ts`). Live adapters never silently fall back to
demo data — they fail honestly instead.

Microphone capture is real in both modes (`src/hooks/useVoiceCapture.ts`). When
the browser denies or lacks microphone access, every voice surface offers a text
fallback and says so plainly.

## Architecture

```
routes/            pages: /, /search, /record, /explore, /knowledge/$id, /api/*
features/          composed flows (voice query bar, outcome reporting)
components/        presentation (knowledge, evidence, audio, layout)
hooks/             capture + TanStack Query data hooks
lib/services/      use cases; container.ts is the only place that picks providers
lib/repositories/  data access behind one interface (demo | supabase)
lib/domain/        types, labels, community-evidence rules
lib/demo/          deterministic demo corpus
```

Swapping a provider means changing `src/lib/services/container.ts` and nothing
else. UI code depends on interfaces, never on Sarvam, Gemini or Supabase.

## Evidence rules (do not weaken these)

- Community signal is computed from reports only: low / moderate / strong /
  mixed / none, per the thresholds in `lib/domain/community-evidence.ts`.
- Mixed outcomes stay visibly mixed; they are never averaged into a verdict.
- Every community panel carries the disclaimer that community signal is not
  scientific validation.
- Scientific and expert evidence live in a visually separate layer, are labelled
  as demo content where they are demo content, and contain no invented
  citations, DOIs or URLs.
- Safety status is always visible; high-stakes records carry a clear caution.

## Database

`docs/schema.sql` is the reference schema for your own Supabase project:
contributors, knowledge_records, community_reports, evidence_sources,
safety_reviews, with grants, RLS, indexes and a nullable `embedding` column so
semantic search can be added later without a rewrite. Apply it with
`supabase db push` or through the SQL editor, then create the two audio buckets
described at the end of the file.

## Live wiring that remains

1. Implement the Sarvam call in `src/routes/api/transcribe-audio.ts`.
2. Implement the Gemini call in `src/routes/api/structure-knowledge.ts`.
3. Implement `SupabaseKnowledgeRepository` against the schema (it currently
   throws rather than pretending).
4. Add auth and contributor profiles so RLS insert policies apply.

API keys stay server-side; never prefix them with `VITE_`.

## Status after final hardening pass

### WORKING NOW (demo mode, no external services)
- Real microphone capture; `await capture.stop()` resolves with the finished Blob only after `MediaRecorder.onstop` (no stale state, no timeouts). Used by search, record and outcome flows.
- Newly recorded knowledge is genuinely playable: Blob → `AudioStorageService` (session implementation) → `URL.createObjectURL` → `KnowledgeRecord.audioUrl` → `AudioPlayer`. URLs live in `src/lib/audio/session-audio-registry.ts` and are revoked on page hide. Nothing is written to localStorage.
- Canonical query `Mirchi mein keeda lag gaya, kya karu?` → Chilli · Pest pressure · North / Central India · Practical community knowledge · Hindi (transliterated).
- Community signal heuristic with tests (`bun run test`).
- Text fallback whenever the microphone is unavailable.

### REQUIRES LATER LIVE INTEGRATION
- `/api/transcribe-audio` (Sarvam) and `/api/structure-knowledge` (Gemini): 501 placeholders.
- `SupabaseKnowledgeRepository` and `SupabaseAudioStorageService`: LIVE INTEGRATION BOUNDARY — IMPLEMENTATION PENDING.
- Auth + contributor profiles for RLS inserts.

### Live mode
`VITE_APP_MODE=live` always selects live implementations. Missing `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` shows an explicit error banner; the app never silently switches to demo.

### Database
1. Apply `supabase/migrations/001_initial_schema.sql`.
2. Generate Supabase types from the real database.
3. Replace the placeholder `src/integrations/supabase/types.ts` (currently empty; not fabricated).

Storage buckets `knowledge-audio` and `outcome-audio`: private, authenticated contributors upload under their own user-id prefix; no anonymous writes; reads via signed URLs.

### Environment
`.env` is ignored by `.gitignore` (`.env`, `.env.*`, `!.env.example`). If it is still tracked in your clone, run `git rm --cached .env` once.
