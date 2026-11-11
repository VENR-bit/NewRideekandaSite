-- ═══════════════════════════════════════════════════════════════
--  Rideekanda — Monastery Requirements
--  Locking down the `items` and `pledges` tables.
--
--  WHY: the anon key is published in every visitor's browser (it has
--  to be). Until now `items` and `pledges` also granted that key
--  update and delete rights, so anyone who viewed the page could
--  rewrite or erase the requirements list and every pledge. The
--  passcode on the admin screen never protected this — it only chose
--  whether to draw the panel; the database answered regardless.
--
--  AFTER THIS: the anon key can read `items` and nothing else. Every
--  write goes through a function that checks what it is being asked
--  to do, and the admin functions additionally demand a passcode that
--  is verified HERE, not in JavaScript.
--
--  RUN IN THIS ORDER (so the site is never broken mid-change):
--     1. PART A below        — adds the functions. Nothing breaks yet.
--     2. deploy the new site — it starts calling them.
--     3. PART B below        — removes the direct table rights.
--
--  Supabase dashboard → SQL Editor → New query → paste → Run.
--  Safe to re-run.
-- ═══════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────
--  PART A — functions (run first; changes nothing that is working)
-- ───────────────────────────────────────────────────────────────

-- ── 1. The admin passcode, kept in the database ────────────────
-- Not in the JavaScript, where everyone can read it. anon is given
-- no rights on this table at all; only the security-definer function
-- below can see inside it.
create table if not exists public.admin_secret (
  id       integer primary key default 1,
  passcode text    not null,
  constraint admin_secret_one_row check (id = 1)
);
alter table public.admin_secret enable row level security;
revoke all on public.admin_secret from anon, authenticated;

--  >>> CHANGE THIS before running. Use something long; 92424 has been
--  >>> public in a public repository and must not be reused.
insert into public.admin_secret (id, passcode)
  values (1, 'CHANGE-ME-choose-a-long-passphrase')
  on conflict (id) do nothing;

-- Constant-time-ish check. Returns only true/false — never the code.
create or replace function public.admin_ok(p_code text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_secret
    where id = 1 and passcode = coalesce(p_code, '')
  );
$$;

-- ── 2. Making a pledge — the one write the public may do ───────
-- Both halves in one place: the pledge row and the item's running
-- total. Doing them as two separate writes from the browser is what
-- made the update right necessary in the first place.
create or replace function public.make_pledge(
  p_item_id bigint,
  p_name    text,
  p_qty     integer
) returns integer                      -- the item's new pledged total
language plpgsql
security definer
set search_path = public
as $$
declare
  v_qty       integer;
  v_remaining integer;
  v_new       integer;
begin
  select greatest(qty - coalesce(pledged, 0), 0) into v_remaining
    from public.items where id = p_item_id;
  if not found then
    raise exception 'NO_SUCH_ITEM';
  end if;
  if v_remaining <= 0 then
    raise exception 'ALREADY_FULFILLED';
  end if;

  -- never trust the number the browser sent
  v_qty := least(greatest(coalesce(p_qty, 1), 1), v_remaining);

  insert into public.pledges (item_id, name, qty)
  values (p_item_id,
          nullif(left(trim(coalesce(p_name, '')), 80), ''),
          v_qty);

  update public.items
     set pledged = least(coalesce(pledged, 0) + v_qty, qty),
         updated_at = now()
   where id = p_item_id
   returning pledged into v_new;

  return v_new;
end;
$$;

-- ── 3. Admin writes — each one checks the passcode first ───────
create or replace function public.admin_insert_item(p_code text, p_patch jsonb)
returns setof public.items
language plpgsql
security definer
set search_path = public
as $$
declare
  blank public.items;
  row   public.items;
begin
  if not public.admin_ok(p_code) then raise exception 'NOT_AUTHORISED'; end if;
  -- jsonb_populate_record fills anything the patch omits from `blank`,
  -- and casts each value to its real column type for us
  row := jsonb_populate_record(blank, p_patch);
  return query
    insert into public.items
      (en, si, description, price, qty, pledged, category, priority, icon, photo, added_at)
    values
      (row.en, row.si, row.description, coalesce(row.price, 0), coalesce(row.qty, 1),
       coalesce(row.pledged, 0), row.category, coalesce(row.priority, 'routine'),
       coalesce(row.icon, 'bowl'), row.photo, now())
    returning *;
end;
$$;

create or replace function public.admin_update_item(p_code text, p_id bigint, p_patch jsonb)
returns setof public.items
language plpgsql
security definer
set search_path = public
as $$
declare
  cur public.items;
  nxt public.items;
begin
  if not public.admin_ok(p_code) then raise exception 'NOT_AUTHORISED'; end if;
  select * into cur from public.items where id = p_id;
  if not found then raise exception 'NO_SUCH_ITEM'; end if;
  -- anything the patch leaves out keeps its current value
  nxt := jsonb_populate_record(cur, p_patch);
  return query
    update public.items set
      en = nxt.en, si = nxt.si, description = nxt.description,
      price = nxt.price, qty = nxt.qty, pledged = nxt.pledged,
      category = nxt.category, priority = nxt.priority,
      icon = nxt.icon, photo = nxt.photo, updated_at = now()
    where id = p_id
    returning *;
end;
$$;

create or replace function public.admin_delete_item(p_code text, p_id bigint)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_ok(p_code) then raise exception 'NOT_AUTHORISED'; end if;
  delete from public.pledges where item_id = p_id;   -- no orphans left behind
  delete from public.items   where id = p_id;
  return found;
end;
$$;

-- Who pledged what — admin only; this was never readable by the public
-- and stays that way.
create or replace function public.admin_list_pledges(p_code text)
returns table (id bigint, item_id bigint, name text, qty integer, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_ok(p_code) then raise exception 'NOT_AUTHORISED'; end if;
  return query
    select p.id, p.item_id, p.name, p.qty, p.created_at
      from public.pledges p order by p.created_at desc;
end;
$$;

grant execute on function public.make_pledge(bigint, text, integer)        to anon;
grant execute on function public.admin_ok(text)                            to anon;
grant execute on function public.admin_insert_item(text, jsonb)            to anon;
grant execute on function public.admin_update_item(text, bigint, jsonb)    to anon;
grant execute on function public.admin_delete_item(text, bigint)           to anon;
grant execute on function public.admin_list_pledges(text)                  to anon;


-- ───────────────────────────────────────────────────────────────
--  PART B — take away the direct rights
--  Run only AFTER the new site is deployed.
-- ───────────────────────────────────────────────────────────────

-- alter table public.items   enable row level security;
-- alter table public.pledges enable row level security;
--
-- revoke all on public.items   from anon;
-- revoke all on public.pledges from anon;
--
-- -- the public list is meant to be read by everyone; nothing else
-- grant select on public.items to anon;
--
-- -- any policy that previously allowed anonymous writing
-- drop policy if exists "anon can do anything"      on public.items;
-- drop policy if exists "Enable all access for all" on public.items;
-- drop policy if exists "anon can do anything"      on public.pledges;
-- drop policy if exists "Enable all access for all" on public.pledges;
--
-- create policy "anyone may read the list" on public.items
--   for select to anon using (true);
