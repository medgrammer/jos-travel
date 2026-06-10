do $$
begin
  create type public.site_event_type as enum ('visit', 'click', 'whatsapp_click');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  event_type public.site_event_type not null,
  path text,
  label text,
  target text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists site_events_event_type_created_at_idx
on public.site_events (event_type, created_at desc);

create index if not exists site_events_created_at_idx
on public.site_events (created_at desc);

create table if not exists public.cloud_subscription (
  id boolean primary key default true check (id),
  provider text,
  plan_name text,
  status text not null default 'À renseigner',
  expires_at date,
  notes text,
  updated_at timestamptz not null default now()
);

insert into public.cloud_subscription (id, status)
values (true, 'À renseigner')
on conflict (id) do nothing;

drop trigger if exists cloud_subscription_touch_updated_at on public.cloud_subscription;
create trigger cloud_subscription_touch_updated_at
before update on public.cloud_subscription
for each row execute function private.touch_updated_at();

alter table public.site_events enable row level security;
alter table public.cloud_subscription enable row level security;

drop policy if exists "Admins can read site events" on public.site_events;
create policy "Admins can read site events"
on public.site_events for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can read cloud subscription" on public.cloud_subscription;
create policy "Admins can read cloud subscription"
on public.cloud_subscription for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can create cloud subscription" on public.cloud_subscription;
create policy "Admins can create cloud subscription"
on public.cloud_subscription for insert
to authenticated
with check (private.current_user_is_admin());

drop policy if exists "Admins can update cloud subscription" on public.cloud_subscription;
create policy "Admins can update cloud subscription"
on public.cloud_subscription for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

grant usage on type public.site_event_type to authenticated, service_role;
grant select on public.site_events to authenticated;
grant select, insert, update on public.cloud_subscription to authenticated;
grant select, insert on public.site_events to service_role;
grant select, insert, update on public.cloud_subscription to service_role;
