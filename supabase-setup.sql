-- ============================================================
-- BHAVITHRA FAMILY PORTAL — DATABASE SETUP
-- Copy this entire file and run it in Supabase's SQL Editor.
-- (Project -> SQL Editor -> New Query -> paste this -> Run)
-- ============================================================

-- 1. Create the applications table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  application_id text unique not null,
  name text not null,
  nickname text,
  age text,
  birthday date,
  photo_url text,
  how_know text,
  relationship_pref text,
  why_accept text,
  status text not null default 'Pending',
  role text,
  connection text,
  created_at timestamp with time zone default now()
);

-- 2. Turn on Row Level Security
alter table applications enable row level security;

-- 3. Allow anyone to SUBMIT a new application (the Join Family form)
create policy "Anyone can insert an application"
  on applications for insert
  with check (true);

-- 4. Allow anyone to READ applications.
--    Friends only ever query by exact application_id (their own),
--    or the app filters to status = 'Approved' for the public Members/Tree pages.
--    The admin password itself is enforced in the app, not the database,
--    so this keeps the whole project simple with no extra backend.
create policy "Anyone can read applications"
  on applications for select
  using (true);

-- 5. Allow anyone to UPDATE (used by the Admin page to approve/reject/assign roles).
--    Since this is a simple single-admin hobby project with a password gate
--    in the app itself, we keep the database policy open for simplicity.
create policy "Anyone can update applications"
  on applications for update
  using (true);

-- ============================================================
-- 6. Create a public storage bucket for profile photos
-- Run this part, OR do it visually: Storage -> New Bucket -> name it "photos" -> Public bucket: ON
-- ============================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "Anyone can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'photos');

create policy "Anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
