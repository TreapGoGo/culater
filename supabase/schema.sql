create extension if not exists "pgcrypto";

create table if not exists public.capsules (
  id uuid primary key default gen_random_uuid(),
  title varchar(30) not null,
  creator_name varchar(10) not null,
  creator_email text not null,
  open_at timestamptz not null,
  status text not null default 'collecting' check (status in ('collecting', 'sealed', 'opened')),
  created_at timestamptz not null default now()
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  capsule_id uuid not null references public.capsules(id) on delete cascade,
  nickname varchar(10) not null,
  email text not null,
  message varchar(200),
  photos text[] not null,
  created_at timestamptz not null default now()
);

create index if not exists capsules_open_at_idx on public.capsules (open_at);
create index if not exists capsules_status_idx on public.capsules (status);
create index if not exists contributions_capsule_id_idx on public.contributions (capsule_id);

alter table public.capsules disable row level security;
alter table public.contributions disable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'capsule-photos',
  'capsule-photos',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read capsule photos" on storage.objects;
create policy "Public can read capsule photos"
on storage.objects
for select
to public
using (bucket_id = 'capsule-photos');

drop policy if exists "Public can upload capsule photos" on storage.objects;
create policy "Public can upload capsule photos"
on storage.objects
for insert
to public
with check (bucket_id = 'capsule-photos');
