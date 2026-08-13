-- Portfolio backend schema (Supabase).
-- Run this in the Supabase SQL editor, or via `supabase db push` if you use the
-- Supabase CLI. The app talks to these tables server-side with the service role
-- key (never exposed to the browser), so row-level security is intentionally
-- restrictive.

-- Contact form messages ------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied')),
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists messages_status_idx
  on public.messages (status);
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- Visitor comments (moderated) ----------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  comment text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved')),
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists comments_status_idx
  on public.comments (status);
create index if not exists comments_created_at_idx
  on public.comments (created_at desc);

-- Row-level security: lock everything down. All reads/writes come from the
-- server via the service role key, which bypasses RLS.
alter table public.messages enable row level security;
alter table public.comments enable row level security;
