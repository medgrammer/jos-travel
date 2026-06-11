alter table public.ai_settings
  add column if not exists standard_message_credits integer not null default 10,
  add column if not exists complex_message_credits integer not null default 20,
  add column if not exists advanced_analysis_credits integer not null default 50;

alter table public.ai_settings
  drop column if exists openai_cost_markup;

do $$
begin
  alter table public.ai_settings
    add constraint ai_settings_standard_message_credits_check check (standard_message_credits > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.ai_settings
    add constraint ai_settings_complex_message_credits_check check (complex_message_credits > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.ai_settings
    add constraint ai_settings_advanced_analysis_credits_check check (advanced_analysis_credits > 0);
exception
  when duplicate_object then null;
end $$;

create table if not exists public.ai_credit_packs (
  id text primary key,
  name text not null,
  credits integer not null check (credits > 0),
  price_xaf integer not null check (price_xaf >= 0),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.ai_credit_packs (id, name, credits, price_xaf, sort_order, is_active)
values
  ('starter', 'Pack Starter', 1000, 1000, 10, true),
  ('standard', 'Pack Standard', 5000, 4500, 20, true),
  ('premium', 'Pack Premium', 10000, 8000, 30, true),
  ('business', 'Pack Business', 20000, 15000, 40, true),
  ('enterprise', 'Pack Enterprise', 50000, 35000, 50, true),
  ('corporate', 'Pack Corporate', 100000, 65000, 60, true)
on conflict (id) do update
set name = excluded.name,
    credits = excluded.credits,
    price_xaf = excluded.price_xaf,
    sort_order = excluded.sort_order,
    is_active = excluded.is_active,
    updated_at = now();

create table if not exists public.ai_wallet (
  id boolean primary key default true check (id),
  total_purchased integer not null default 0 check (total_purchased >= 0),
  total_consumed integer not null default 0 check (total_consumed >= 0),
  remaining_credits integer generated always as (total_purchased - total_consumed) stored,
  updated_at timestamptz not null default now(),
  constraint ai_wallet_non_negative_balance check (total_purchased >= total_consumed)
);

insert into public.ai_wallet (id, total_purchased, total_consumed)
select true, greatest(coalesce(ai_settings.remaining_credits, 0), 0), 0
from public.ai_settings
where ai_settings.id = true
on conflict (id) do nothing;

create table if not exists public.ai_wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type text not null check (transaction_type in ('purchase', 'consumption', 'adjustment', 'refund')),
  amount integer not null check (amount <> 0),
  balance_after integer not null check (balance_after >= 0),
  pack_id text references public.ai_credit_packs(id) on delete set null,
  payment_id uuid references public.payment_transactions(id) on delete set null,
  reason text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

insert into public.ai_wallet_transactions (transaction_type, amount, balance_after, reason, metadata)
select
  'adjustment',
  greatest(coalesce(ai_settings.remaining_credits, 0), 0),
  greatest(coalesce(ai_settings.remaining_credits, 0), 0),
  'Initialisation du portefeuille AI_CREDIT',
  '{"source":"migration"}'::jsonb
from public.ai_settings
where ai_settings.id = true
  and greatest(coalesce(ai_settings.remaining_credits, 0), 0) > 0
  and not exists (
    select 1
    from public.ai_wallet_transactions
    where metadata ->> 'source' = 'migration'
  );

create table if not exists public.ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  conversation_id text,
  usage_type text not null check (usage_type in ('standard_message', 'complex_message', 'advanced_analysis')),
  credits_used integer not null check (credits_used > 0),
  message_count integer not null default 1 check (message_count > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_user_quotas (
  user_id uuid primary key references auth.users(id) on delete cascade,
  monthly_quota integer not null default 0 check (monthly_quota >= 0),
  used_this_month integer not null default 0 check (used_this_month >= 0),
  reset_at date,
  updated_at timestamptz not null default now()
);

create index if not exists ai_wallet_transactions_created_at_idx
on public.ai_wallet_transactions (created_at desc);

create index if not exists ai_wallet_transactions_type_created_at_idx
on public.ai_wallet_transactions (transaction_type, created_at desc);

create index if not exists ai_usage_logs_created_at_idx
on public.ai_usage_logs (created_at desc);

create index if not exists ai_usage_logs_conversation_idx
on public.ai_usage_logs (conversation_id);

create index if not exists ai_usage_logs_user_created_at_idx
on public.ai_usage_logs (user_id, created_at desc);

drop trigger if exists ai_credit_packs_touch_updated_at on public.ai_credit_packs;
create trigger ai_credit_packs_touch_updated_at
before update on public.ai_credit_packs
for each row execute function private.touch_updated_at();

drop trigger if exists ai_wallet_touch_updated_at on public.ai_wallet;
create trigger ai_wallet_touch_updated_at
before update on public.ai_wallet
for each row execute function private.touch_updated_at();

drop trigger if exists ai_user_quotas_touch_updated_at on public.ai_user_quotas;
create trigger ai_user_quotas_touch_updated_at
before update on public.ai_user_quotas
for each row execute function private.touch_updated_at();

alter table public.ai_credit_packs enable row level security;
alter table public.ai_wallet enable row level security;
alter table public.ai_wallet_transactions enable row level security;
alter table public.ai_usage_logs enable row level security;
alter table public.ai_user_quotas enable row level security;

drop policy if exists "Admins can read AI credit packs" on public.ai_credit_packs;
create policy "Admins can read AI credit packs"
on public.ai_credit_packs for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can update AI credit packs" on public.ai_credit_packs;
create policy "Admins can update AI credit packs"
on public.ai_credit_packs for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

drop policy if exists "Admins can read AI wallet" on public.ai_wallet;
create policy "Admins can read AI wallet"
on public.ai_wallet for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can update AI wallet" on public.ai_wallet;
create policy "Admins can update AI wallet"
on public.ai_wallet for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

drop policy if exists "Admins can read AI wallet transactions" on public.ai_wallet_transactions;
create policy "Admins can read AI wallet transactions"
on public.ai_wallet_transactions for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can create AI wallet transactions" on public.ai_wallet_transactions;
create policy "Admins can create AI wallet transactions"
on public.ai_wallet_transactions for insert
to authenticated
with check (private.current_user_is_admin());

drop policy if exists "Admins can read AI usage logs" on public.ai_usage_logs;
create policy "Admins can read AI usage logs"
on public.ai_usage_logs for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can create AI usage logs" on public.ai_usage_logs;
create policy "Admins can create AI usage logs"
on public.ai_usage_logs for insert
to authenticated
with check (private.current_user_is_admin());

drop policy if exists "Admins can read AI user quotas" on public.ai_user_quotas;
create policy "Admins can read AI user quotas"
on public.ai_user_quotas for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can manage AI user quotas" on public.ai_user_quotas;
create policy "Admins can manage AI user quotas"
on public.ai_user_quotas for all
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

grant select, update on public.ai_credit_packs to authenticated;
grant select, update on public.ai_wallet to authenticated;
grant select, insert on public.ai_wallet_transactions to authenticated;
grant select, insert on public.ai_usage_logs to authenticated;
grant select, insert, update, delete on public.ai_user_quotas to authenticated;

grant select, insert, update, delete on public.ai_credit_packs to service_role;
grant select, insert, update, delete on public.ai_wallet to service_role;
grant select, insert, update, delete on public.ai_wallet_transactions to service_role;
grant select, insert, update, delete on public.ai_usage_logs to service_role;
grant select, insert, update, delete on public.ai_user_quotas to service_role;
