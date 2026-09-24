-- ============================================================
-- Reconcile schema + RLS so the write paths work.
--
-- Why: some deployments had tables where the optional moderation
-- columns (ip / user_agent) were missing, or the comments RLS
-- policies weren't applied — so the app's public selects worked
-- but inserts failed with PostgREST 400 (PGRST204 "column does
-- not exist") or 403 (no insert policy). This script is safe to
-- run as-is (idempotent) and is the same one referenced by the
-- admin panel's "Database read problem" banner.
-- ============================================================

-- ------------------------------------------------------------
-- 1. comments
-- ------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 2 and 60),
  comment     text not null check (char_length(trim(comment)) between 3 and 500),
  status      text not null default 'pending'
              check (status in ('pending', 'approved', 'rejected')),
  ip          text,
  created_at  timestamptz not null default now()
);

alter table public.comments
  add column if not exists ip text;

alter table public.comments enable row level security;

-- Publishable key: read only approved comments.
create policy if not exists "public read approved comments"
  on public.comments for select
  to anon, authenticated
  using (status = 'approved');

-- Publishable key: may submit, but only ever as 'pending'.
create policy if not exists "public insert pending comments"
  on public.comments for insert
  to anon, authenticated
  with check (status = 'pending');

-- No update/delete policies: approval, rejection, and deletion are
-- performed server-side with the secret key (RLS-bypassing) only.
grant select, insert on public.comments to anon, authenticated;

create index if not exists comments_status_created_idx
  on public.comments (status, created_at desc);

-- ------------------------------------------------------------
-- 2. contact_messages
-- ------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 2 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text not null check (char_length(trim(subject)) between 3 and 200),
  message     text not null check (char_length(trim(message)) between 10 and 1200),
  status      text not null default 'new'
              check (status in ('new', 'read', 'replied')),
  ip          text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

alter table public.contact_messages
  add column if not exists ip text;

alter table public.contact_messages
  add column if not exists user_agent text;

alter table public.contact_messages
  add column if not exists email_status text not null default 'pending'
  check (email_status in ('pending', 'sent', 'failed'));

alter table public.contact_messages enable row level security;

-- Intentionally NO grants/policies for anon/authenticated: this table is
-- written and read server-side with the secret key only.

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);