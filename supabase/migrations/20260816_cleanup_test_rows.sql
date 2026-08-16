-- ============================================================
-- Portfolio: one-time admin cleanup
--   Run this in the Supabase dashboard SQL editor.
--   1. Ensures the email_status column exists (idempotent).
--   2. Deletes the contact-form and comment test rows created
--      during development and QA.
-- ============================================================

-- 1. email_status tracking column (safe to run more than once).
alter table public.contact_messages
  add column if not exists email_status text not null default 'pending'
  check (email_status in ('pending', 'sent', 'failed'));

-- 2. Remove contact-form test submissions.
delete from public.contact_messages
  where name ilike 'email delivery test%'
     or name ilike 'diagnostic run%'
     or name ilike 'trim test%'
     or name ilike 'trim length test%'
     or name = 'Final QA Check'
     or name in ('Final E2E Test', 'Real E2E Test', 'Diag Prefix');

-- 3. Remove the pending QA comment.
delete from public.comments
  where name = 'QA Tester'
    and status = 'pending';
