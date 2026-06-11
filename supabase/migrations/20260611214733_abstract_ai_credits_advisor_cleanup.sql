create index if not exists ai_wallet_transactions_pack_id_idx
on public.ai_wallet_transactions (pack_id);

create index if not exists ai_wallet_transactions_payment_id_idx
on public.ai_wallet_transactions (payment_id);

create index if not exists ai_wallet_transactions_created_by_idx
on public.ai_wallet_transactions (created_by);

create index if not exists ai_credit_events_created_by_idx
on public.ai_credit_events (created_by);

create index if not exists payment_transactions_created_by_idx
on public.payment_transactions (created_by);

drop policy if exists "Admins can read AI user quotas" on public.ai_user_quotas;
