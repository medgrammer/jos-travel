create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  country_name text not null,
  country_code text not null,
  dial_code text not null,
  phone text not null,
  full_phone text not null,
  destination text,
  service text not null,
  message text not null,
  locale text not null default 'fr',
  source text not null default 'contact_form',
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_status_created_at_idx
on public.contact_messages (status, created_at desc);

create index if not exists contact_messages_created_at_idx
on public.contact_messages (created_at desc);

drop trigger if exists contact_messages_touch_updated_at on public.contact_messages;
create trigger contact_messages_touch_updated_at
before update on public.contact_messages
for each row execute function private.touch_updated_at();

alter table public.contact_messages enable row level security;

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
on public.contact_messages for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
on public.contact_messages for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
on public.contact_messages for delete
to authenticated
using (private.current_user_is_admin());

grant select, update, delete on public.contact_messages to authenticated;
grant select, insert, update, delete on public.contact_messages to service_role;
