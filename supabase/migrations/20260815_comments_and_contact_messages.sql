-- ============================================================
-- Portfolio: Supabase schema
--   comments         -> public read of approved only, server moderates
--   contact_messages -> server-only; never exposed publicly
--
-- Run this in the Supabase dashboard SQL editor.
-- After running, add SUPABASE_URL + SUPABASE_SECRET_KEY to the
-- Vercel environment (already done).
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1. Comments
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

alter table public.comments enable row level security;

-- Publishable key: read only approved comments.
create policy "public read approved comments"
  on public.comments for select
  to anon, authenticated
  using (status = 'approved');

-- Publishable key: may submit, but only ever as 'pending'.
create policy "public insert pending comments"
  on public.comments for insert
  to anon, authenticated
  with check (status = 'pending');

-- No update/delete policies: approval, rejection, and deletion are
-- performed server-side with the secret key (RLS-bypassing) only.
grant select, insert on public.comments to anon, authenticated;

create index if not exists comments_status_created_idx
  on public.comments (status, created_at desc);

-- ------------------------------------------------------------
-- 2. Contact messages
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

alter table public.contact_messages enable row level security;

-- Intentionally NO grants to anon/authenticated and NO policies:
-- the publishable key can neither read nor write this table.
-- Only the server (secret key) inserts, and only the admin panel
-- (secret key) reads/updates status.

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);
