-- =============================================================================
-- Treasury schema for Supabase
-- Run this once in the Supabase SQL Editor (https://app.supabase.com -> SQL Editor)
-- =============================================================================

-- Enable UUID generation if not already
create extension if not exists "pgcrypto";

-- ---------- Tables ----------

create table if not exists members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  country       text not null,
  country_code  text not null,
  currency      text not null,
  note          text,
  added_at      timestamptz not null default now()
);

create table if not exists transactions (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid not null references members(id) on delete cascade,
  amount       numeric(14,2) not null check (amount >= 0),
  currency     text not null,
  amount_usd   numeric(14,2) not null check (amount_usd >= 0),
  rate_used    numeric(14,6),
  date         timestamptz not null,
  note         text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_transactions_member_id on transactions (member_id);
create index if not exists idx_transactions_date on transactions (date desc);

-- ---------- Row-Level Security ----------
-- Public read (the dashboard view URL is shareable).
-- Only authenticated sessions (the single admin) can write.

alter table members enable row level security;
alter table transactions enable row level security;

-- Members policies
drop policy if exists "members_public_read" on members;
create policy "members_public_read"
  on members for select
  using (true);

drop policy if exists "members_authenticated_write" on members;
create policy "members_authenticated_write"
  on members for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Transactions policies
drop policy if exists "tx_public_read" on transactions;
create policy "tx_public_read"
  on transactions for select
  using (true);

drop policy if exists "tx_authenticated_write" on transactions;
create policy "tx_authenticated_write"
  on transactions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- =============================================================================
-- Single-account constraint:
-- Don't enforce this in SQL. Instead:
--   1. In Supabase Dashboard -> Authentication -> Providers -> Email
--      DISABLE the "Enable Sign Ups" toggle.
--   2. Create exactly ONE user in Authentication -> Users -> "Add user"
--      with your admin email + password.
-- That user becomes the only credential able to sign in. The login page in
-- this app calls signInWithPassword and rejects everything else.
-- =============================================================================
