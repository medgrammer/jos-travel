alter table public.ai_settings
  add column if not exists chat_mode text not null default 'ai',
  add column if not exists openai_cost_markup numeric not null default 5;

do $$
begin
  alter table public.ai_settings
    add constraint ai_settings_chat_mode_check check (chat_mode in ('ai', 'human'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.ai_settings
    add constraint ai_settings_openai_cost_markup_check check (openai_cost_markup >= 1);
exception
  when duplicate_object then null;
end $$;

alter table public.cloud_subscription
  add column if not exists billing_cycle text not null default 'monthly',
  add column if not exists amount_xaf integer not null default 0,
  add column if not exists currency text not null default 'XAF',
  add column if not exists last_payment_id uuid;

do $$
begin
  alter table public.cloud_subscription
    add constraint cloud_subscription_billing_cycle_check check (billing_cycle in ('monthly', 'annual'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.cloud_subscription
    add constraint cloud_subscription_amount_xaf_check check (amount_xaf >= 0);
exception
  when duplicate_object then null;
end $$;

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'pawapay',
  deposit_id uuid not null unique,
  payment_type text not null check (payment_type in ('subscription', 'ai_credit')),
  status text not null default 'pending',
  amount_xaf integer not null check (amount_xaf > 0),
  currency text not null default 'XAF',
  billing_cycle text check (billing_cycle in ('monthly', 'annual')),
  credits integer check (credits is null or credits > 0),
  payer_phone text,
  payment_url text,
  return_url text,
  provider_response jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  applied_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists payment_transactions_touch_updated_at on public.payment_transactions;
create trigger payment_transactions_touch_updated_at
before update on public.payment_transactions
for each row execute function private.touch_updated_at();

alter table public.payment_transactions enable row level security;

drop policy if exists "Admins can read payment transactions" on public.payment_transactions;
create policy "Admins can read payment transactions"
on public.payment_transactions for select
to authenticated
using (private.current_user_is_admin());

drop policy if exists "Admins can create payment transactions" on public.payment_transactions;
create policy "Admins can create payment transactions"
on public.payment_transactions for insert
to authenticated
with check (private.current_user_is_admin());

drop policy if exists "Admins can update payment transactions" on public.payment_transactions;
create policy "Admins can update payment transactions"
on public.payment_transactions for update
to authenticated
using (private.current_user_is_admin())
with check (private.current_user_is_admin());

grant select, insert, update on public.payment_transactions to authenticated;
grant select, insert, update on public.payment_transactions to service_role;
