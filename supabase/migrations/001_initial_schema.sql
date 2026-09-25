-- AgriVoice Prototype 01 — initial schema (source: docs/schema.sql)
-- Apply, then regenerate Supabase types from the real database.
-- AgriVoice — Prototype 01 reference schema (apply to your own Supabase project)
-- Order per table: CREATE TABLE -> GRANT -> ENABLE RLS -> POLICIES.

create extension if not exists "pgcrypto";
create extension if not exists "vector"; -- prepared for future semantic search

create type public.contributor_role as enum (
  'knowledge_keeper','farmer','seed_keeper','livestock_specialist',
  'traditional_practitioner','local_expert','community_member');
create type public.consent_status as enum ('granted','pending','withdrawn');
create type public.knowledge_type as enum (
  'crop_practice','pest_management','seed_practice','soil_practice',
  'irrigation_practice','livestock_practice','storage_practice','seasonal_practice');
create type public.knowledge_status as enum ('draft','published','archived');
create type public.verification_status as enum ('unreviewed','community_reported','expert_reviewed');
create type public.safety_status as enum ('not_assessed','caution','restricted');
create type public.visibility_status as enum ('public','private');
create type public.source_type as enum ('voice_recording','text_entry','imported');
create type public.outcome_value as enum ('positive','neutral','negative');
create type public.evidence_source_type as enum ('scientific','expert','institutional','community');
create type public.evidence_relationship as enum (
  'direct_support','partial_support','limited_evidence',
  'no_direct_evidence','conflicting_evidence','expert_reviewed');
create type public.evidence_level as enum ('high','moderate','limited','indicative');

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- contributors -------------------------------------------------------------
create table public.contributors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  display_name text not null,
  region text not null,
  state text, district text,
  language text not null, dialect text,
  role public.contributor_role not null default 'community_member',
  consent_status public.consent_status not null default 'pending',
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());

grant select on public.contributors to anon;
grant select, insert, update on public.contributors to authenticated;
grant all on public.contributors to service_role;
alter table public.contributors enable row level security;

create policy "Contributors are readable" on public.contributors
  for select to anon, authenticated using (true);
create policy "Own contributor profile insert" on public.contributors
  for insert to authenticated with check (auth.uid() = user_id);
create policy "Own contributor profile update" on public.contributors
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create trigger contributors_updated_at before update on public.contributors
  for each row execute function public.set_updated_at();

-- knowledge_records ---------------------------------------------------------
create table public.knowledge_records (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  transcript text not null,
  transcript_note text,
  original_language text not null,
  dialect text,
  knowledge_type public.knowledge_type not null,
  crop text, animal text, problem text, practice text, method text,
  season text, region text not null, district text, context text,
  audio_url text,
  contributor_id uuid not null references public.contributors on delete restrict,
  visibility public.visibility_status not null default 'public',
  source_type public.source_type not null default 'voice_recording',
  status public.knowledge_status not null default 'published',
  verification_status public.verification_status not null default 'unreviewed',
  safety_status public.safety_status not null default 'not_assessed',
  safety_note text,
  embedding vector(768), -- nullable on purpose: never required by Prototype 01
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());

grant select on public.knowledge_records to anon;
grant select, insert, update on public.knowledge_records to authenticated;
grant all on public.knowledge_records to service_role;
alter table public.knowledge_records enable row level security;

create policy "Published records are readable" on public.knowledge_records
  for select to anon, authenticated using (visibility = 'public' and status = 'published');
create policy "Contributors add records" on public.knowledge_records
  for insert to authenticated
  with check (contributor_id in (select id from public.contributors where user_id = auth.uid()));
create policy "Contributors update own records" on public.knowledge_records
  for update to authenticated
  using (contributor_id in (select id from public.contributors where user_id = auth.uid()))
  with check (contributor_id in (select id from public.contributors where user_id = auth.uid()));

create index knowledge_records_crop_idx on public.knowledge_records (crop);
create index knowledge_records_region_idx on public.knowledge_records (region);
create index knowledge_records_text_idx on public.knowledge_records
  using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(transcript,'')));
create trigger knowledge_records_updated_at before update on public.knowledge_records
  for each row execute function public.set_updated_at();

-- community_reports ---------------------------------------------------------
create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  knowledge_record_id uuid not null references public.knowledge_records on delete cascade,
  reporter_id uuid references public.contributors on delete set null,
  outcome public.outcome_value not null,
  notes text, audio_url text,
  location text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());

grant select on public.community_reports to anon;
grant select, insert on public.community_reports to authenticated;
grant all on public.community_reports to service_role;
alter table public.community_reports enable row level security;

create policy "Reports are readable" on public.community_reports
  for select to anon, authenticated using (true);
create policy "People report outcomes" on public.community_reports
  for insert to authenticated
  with check (reporter_id in (select id from public.contributors where user_id = auth.uid()));
create index community_reports_record_idx on public.community_reports (knowledge_record_id);
create trigger community_reports_updated_at before update on public.community_reports
  for each row execute function public.set_updated_at();

-- evidence_sources ----------------------------------------------------------
create table public.evidence_sources (
  id uuid primary key default gen_random_uuid(),
  knowledge_record_id uuid not null references public.knowledge_records on delete cascade,
  source_type public.evidence_source_type not null,
  title text not null, publisher text not null, url text, summary text not null,
  relationship public.evidence_relationship not null,
  evidence_level public.evidence_level not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());

grant select on public.evidence_sources to anon, authenticated;
grant all on public.evidence_sources to service_role;
alter table public.evidence_sources enable row level security;
-- Curated server-side only: no public write path exists.
create policy "Evidence is readable" on public.evidence_sources
  for select to anon, authenticated using (true);
create index evidence_sources_record_idx on public.evidence_sources (knowledge_record_id);
create trigger evidence_sources_updated_at before update on public.evidence_sources
  for each row execute function public.set_updated_at();

-- safety_reviews ------------------------------------------------------------
create table public.safety_reviews (
  id uuid primary key default gen_random_uuid(),
  knowledge_record_id uuid not null references public.knowledge_records on delete cascade,
  status public.safety_status not null,
  reason text not null,
  reviewed_by uuid references auth.users on delete set null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now());

grant select on public.safety_reviews to anon, authenticated;
grant all on public.safety_reviews to service_role;
alter table public.safety_reviews enable row level security;
create policy "Safety reviews are readable" on public.safety_reviews
  for select to anon, authenticated using (true);
create index safety_reviews_record_idx on public.safety_reviews (knowledge_record_id);
create trigger safety_reviews_updated_at before update on public.safety_reviews
  for each row execute function public.set_updated_at();

-- storage -------------------------------------------------------------------
-- Create buckets `knowledge-audio` and `outcome-audio` (public read) in the
-- Supabase dashboard, then add:
--   select policy: bucket_id in ('knowledge-audio','outcome-audio')
--   insert policy (authenticated): same bucket condition.
