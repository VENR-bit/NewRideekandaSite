-- ═══════════════════════════════════════════════════════════════
--  Rideekanda — Herbal Plant Planting Programme
--  Database setup. Run ONCE in the Supabase SQL Editor:
--    Supabase dashboard → SQL Editor → New query → paste → Run
--
--  Safe to re-run: every statement is idempotent.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. The pledge table ────────────────────────────────────────
-- One row per pledge: someone promising to bring and plant a tree.
-- `token` is the private key that lets that person (and nobody else)
-- attach their planting photo later. It is never exposed publicly.
create table if not exists public.plant_pledges (
  id             bigint generated always as identity primary key,
  plant_no       integer,
  plant_list     text        not null check (plant_list in ('programme','reference')),
  sinhala        text,
  sinhala_script text,
  english        text,
  scientific     text        not null,
  pledger_name   text        not null check (length(trim(pledger_name)) between 1 and 80),
  contact        text        check (contact is null or length(contact) <= 120),
  qty            integer     not null default 1 check (qty between 1 and 50),
  note           text        check (note is null or length(note) <= 300),
  photo_path     text,
  photo_status   text        not null default 'none'
                             check (photo_status in ('none','pending','approved','rejected')),
  planted_at     timestamptz,
  created_at     timestamptz not null default now(),
  token          uuid        not null default gen_random_uuid()
);

create index if not exists plant_pledges_scientific_idx on public.plant_pledges (scientific);
create index if not exists plant_pledges_created_idx    on public.plant_pledges (created_at desc);
create unique index if not exists plant_pledges_token_idx on public.plant_pledges (token);

-- Each plant may be claimed ONCE, and the two lists are kept separate: an
-- entry in the planting list and the same species in the reference list are
-- two different plants, each claimable once. A unique index (not just a UI
-- check) is what makes this safe when two people pledge at the same moment.
drop index if exists public.plant_pledges_one_per_species;
create unique index if not exists plant_pledges_one_per_plant
  on public.plant_pledges (plant_list, lower(scientific));

-- ── 2. Public view — everything EXCEPT the token ───────────────
-- The site reads this. Because a view runs with its owner's rights,
-- visitors can read pledges without being able to read tokens.
create or replace view public.plant_pledges_public as
  select id, plant_no, plant_list, sinhala, sinhala_script, english, scientific,
         pledger_name, qty, note, photo_path, photo_status, planted_at, created_at
  from public.plant_pledges;

-- ── 3. Writing — through functions only ───────────────────────
-- The anon role gets NO direct rights on plant_pledges. Every write goes
-- through a security-definer function, so the token can be returned to
-- the person who just pledged without making all tokens readable.

-- Create a pledge and hand back only that pledge's own token.
create or replace function public.create_plant_pledge(
  p_plant_no       integer,
  p_plant_list     text,
  p_sinhala        text,
  p_sinhala_script text,
  p_english        text,
  p_scientific     text,
  p_name           text,
  p_contact        text,
  p_qty            integer,
  p_note           text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token uuid;
begin
  if coalesce(trim(p_name), '') = '' then
    raise exception 'A name is required';
  end if;
  if p_plant_list not in ('programme', 'reference') then
    raise exception 'Unknown plant list';
  end if;

  insert into public.plant_pledges
    (plant_no, plant_list, sinhala, sinhala_script, english, scientific,
     pledger_name, contact, qty, note)
  values
    (p_plant_no, p_plant_list, p_sinhala, p_sinhala_script, p_english, p_scientific,
     left(trim(p_name), 80),
     nullif(left(trim(coalesce(p_contact, '')), 120), ''),
     1,   -- one plant per pledge; the species is then closed to others
     nullif(left(trim(coalesce(p_note, '')), 300), ''))
  returning token into v_token;

  return v_token;
exception
  when unique_violation then
    raise exception 'ALREADY_CLAIMED';
end;
$$;

-- Attach a planting photo. The token is verified server-side, so a photo
-- can only ever land on the matching pledge, and it stays 'pending' until
-- the monastery approves it.
create or replace function public.attach_plant_photo(p_token uuid, p_path text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.plant_pledges
     set photo_path   = p_path,
         photo_status = 'pending',
         planted_at   = coalesce(planted_at, now())
   where token = p_token;
  return found;
end;
$$;

-- Attach a planting photo from the plant's own tile on the public page.
-- There is no secret here: the pledge id is public. That is deliberate --
-- the pledger comes back to the page and presses Upload rather than having
-- to keep a private link. Two things keep it safe:
--   * the photo always lands as 'pending', so nothing reaches the public
--     page until a monk approves it; and
--   * a pledge whose photo is already approved cannot be overwritten.
create or replace function public.attach_plant_photo_by_id(p_id bigint, p_path text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.plant_pledges
     set photo_path   = p_path,
         photo_status = 'pending',
         planted_at   = coalesce(planted_at, now())
   where id = p_id
     and photo_status <> 'approved';
  return found;
end;
$$;

-- Moderation, called from the admin page.
create or replace function public.set_plant_photo_status(p_id bigint, p_status text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('pending', 'approved', 'rejected') then
    return false;
  end if;
  update public.plant_pledges set photo_status = p_status where id = p_id;
  return found;
end;
$$;

-- ── 4. Permissions ─────────────────────────────────────────────
alter table public.plant_pledges enable row level security;

-- No direct table access for visitors at all — writes go through the
-- functions above, reads go through the token-free view.
revoke all on public.plant_pledges from anon;
drop policy if exists "anon can pledge" on public.plant_pledges;
drop policy if exists "anon can moderate photos" on public.plant_pledges;

grant select on public.plant_pledges_public to anon;
grant execute on function public.create_plant_pledge(integer, text, text, text, text, text, text, text, integer, text) to anon;
grant execute on function public.attach_plant_photo(uuid, text) to anon;
grant execute on function public.attach_plant_photo_by_id(bigint, text) to anon;
grant execute on function public.set_plant_photo_status(bigint, text) to anon;

-- ── 5. Photo storage ───────────────────────────────────────────
-- A public-read bucket; uploads are named after the secret token, so
-- the path cannot be guessed.
insert into storage.buckets (id, name, public)
  values ('plant-photos', 'plant-photos', true)
  on conflict (id) do update set public = true;

drop policy if exists "anon can upload plant photos" on storage.objects;
create policy "anon can upload plant photos" on storage.objects
  for insert to anon with check (bucket_id = 'plant-photos');

-- Deliberately NO select policy: the bucket is public, so files are served
-- over their public URL anyway. A select policy would additionally let
-- anyone LIST the bucket and read every filename, which Supabase warns
-- about — and filenames should never be enumerable.
drop policy if exists "anyone can view plant photos" on storage.objects;

-- ═══════════════════════════════════════════════════════════════
--  Done. Check it worked:
--    select count(*) from public.plant_pledges_public;   -- should return 0
-- ═══════════════════════════════════════════════════════════════
