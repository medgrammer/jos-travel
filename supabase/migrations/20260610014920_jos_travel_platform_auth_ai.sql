create schema if not exists private;

do $$
begin
  create type public.user_role as enum ('client', 'admin');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  city text,
  country text default 'Cameroun',
  company text,
  trip_interest text,
  role public.user_role not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_settings (
  id boolean primary key default true check (id),
  monthly_credits integer not null default 250 check (monthly_credits >= 0),
  remaining_credits integer not null default 250 check (remaining_credits >= 0),
  updated_at timestamptz not null default now()
);

insert into public.ai_settings (id, monthly_credits, remaining_credits)
values (true, 250, 250)
on conflict (id) do nothing;

create table if not exists public.ai_credit_events (
  id uuid primary key default gen_random_uuid(),
  amount integer not null,
  reason text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function private.touch_updated_at();

drop trigger if exists ai_settings_touch_updated_at on public.ai_settings;
create trigger ai_settings_touch_updated_at
before update on public.ai_settings
for each row execute function private.touch_updated_at();

create or replace function private.current_user_is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function private.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not private.current_user_is_admin() then
    raise exception 'Only admins can change user roles';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;
create trigger profiles_prevent_role_escalation
before update of role on public.profiles
for each row execute function private.prevent_profile_role_escalation();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    city,
    country,
    company,
    trip_interest
  )
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'city', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'country', ''), 'Cameroun'),
    nullif(new.raw_user_meta_data ->> 'company', ''),
    nullif(new.raw_user_meta_data ->> 'trip_interest', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_jos_travel_profile on auth.users;
create trigger on_auth_user_created_jos_travel_profile
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ai_settings enable row level security;
alter table public.ai_credit_events enable row level security;

drop policy if exists "Profiles are visible to owner or admin" on public.profiles;
create policy "Profiles are visible to owner or admin"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id or private.current_user_is_admin());

drop policy if exists "Clients can create their own profile" on public.profiles;
create policy "Clients can create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id and role = 'client');

drop policy if exists "Profiles are editable by owner or admin" on public.profiles;
create policy "Profiles are editable by owner or admin"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id or private.current_user_is_admin())
with check ((select auth.uid()) = id or private.current_user_is_admin());

drop policy if exists "Admins can read AI settings" on public.ai_settings;
create policy "Admins can read AI settings"
on public.ai_settings for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can update AI settings" on public.ai_settings;
create policy "Admins can update AI settings"
on public.ai_settings for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

drop policy if exists "Admins can read credit events" on public.ai_credit_events;
create policy "Admins can read credit events"
on public.ai_credit_events for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can create credit events" on public.ai_credit_events;
create policy "Admins can create credit events"
on public.ai_credit_events for insert
to authenticated
with check (private.current_user_is_admin());

grant usage on schema private to authenticated, service_role;
grant execute on function private.current_user_is_admin() to authenticated, service_role;

grant select, insert, update on public.profiles to authenticated;
grant select, update on public.ai_settings to authenticated;
grant select, insert on public.ai_credit_events to authenticated;
