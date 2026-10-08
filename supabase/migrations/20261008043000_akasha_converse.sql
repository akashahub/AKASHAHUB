create table if not exists public.akasha_customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.akasha_appointments (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.akasha_customers(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  service text not null,
  objective text,
  channel text,
  note text,
  date date not null,
  start_time text not null,
  end_time text not null,
  status text not null default 'held',
  payment_status text not null default 'unpaid',
  payment_method text,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  mentor_id text default 'yan',
  meeting_type text,
  meeting_link text,
  recording_consent boolean not null default false,
  recording_status text not null default 'pending',
  recording_url text,
  session_credit_cents integer not null default 4500,
  amount_cents integer not null default 4500,
  access_code text,
  refund_status text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists akasha_slot_live
  on public.akasha_appointments (date, start_time)
  where status in ('held', 'pending_payment', 'confirmed');

create table if not exists public.akasha_availability (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time text not null,
  end_time text not null,
  status text not null default 'open',
  mentor_id text default 'yan',
  unique (date, start_time, mentor_id)
);

create table if not exists public.akasha_events (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid,
  name text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

alter table public.akasha_customers enable row level security;
alter table public.akasha_appointments enable row level security;
alter table public.akasha_availability enable row level security;
alter table public.akasha_events enable row level security;
