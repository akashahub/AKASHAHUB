create table if not exists public.flow_bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  session_id text not null,
  session_name text not null,
  modality text,
  note text,
  date date not null,
  start_time text not null,
  amount_cents integer not null,
  charge_cents integer not null,
  pay_mode text not null,
  status text not null default 'pending_payment',
  payment_status text not null default 'unpaid',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.flow_bookings enable row level security;
