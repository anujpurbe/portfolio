-- Portfolio: track email-notification outcome per contact message.
-- Existing rows get 'pending' via the column default.
-- Run after the base schema migration (20260815_comments_and_contact_messages.sql).

alter table public.contact_messages
  add column if not exists email_status text not null default 'pending'
  check (email_status in ('pending', 'sent', 'failed'));
