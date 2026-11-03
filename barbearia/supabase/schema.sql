-- Akasha Hub Barbearia SaaS — foundational multi-tenant schema
-- Apply only to a dedicated Supabase project after reviewing environment settings.
-- Never expose the service_role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'trial' check (status in ('trial','active','suspended','cancelled')),
  timezone text not null default 'America/Bahia',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null check (member_role in ('owner','manager','barber','receptionist')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id),
  unique (tenant_id, id)
);

create or replace function public.is_tenant_member(target_tenant uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.tenant_memberships m
    where m.tenant_id = target_tenant and m.user_id = auth.uid()
  );
$$;

create or replace function public.has_tenant_role(target_tenant uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.tenant_memberships m
    where m.tenant_id = target_tenant
      and m.user_id = auth.uid()
      and m.member_role = any(allowed_roles)
  );
$$;

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  notes text,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id)
);
create index if not exists customers_tenant_phone_idx on public.customers(tenant_id, phone);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  duration_minutes integer not null check (duration_minutes between 5 and 600),
  price_cents integer not null check (price_cents >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, id)
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  description text,
  price_cents integer not null check (price_cents >= 0),
  billing_interval text not null default 'month' check (billing_interval in ('week','month','year')),
  usage_policy jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, id)
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null,
  staff_id uuid not null,
  service_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'booked' check (status in ('booked','confirmed','completed','cancelled','no_show')),
  price_cents integer not null check (price_cents >= 0),
  notes text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  unique (tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id),
  foreign key (tenant_id, staff_id) references public.staff(tenant_id, id),
  foreign key (tenant_id, service_id) references public.services(tenant_id, id)
);
create index if not exists appointments_tenant_start_idx on public.appointments(tenant_id, starts_at);
create index if not exists appointments_staff_start_idx on public.appointments(tenant_id, staff_id, starts_at);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid not null,
  plan_id uuid not null,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  status text not null default 'pending' check (status in ('pending','trialing','active','past_due','cancelled','expired')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id),
  foreign key (tenant_id, plan_id) references public.subscription_plans(tenant_id, id)
);
create unique index if not exists subscriptions_provider_id_idx
  on public.subscriptions(provider, provider_subscription_id)
  where provider_subscription_id is not null;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  sku text,
  price_cents integer not null check (price_cents >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, sku)
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  customer_id uuid,
  total_cents integer not null check (total_cents >= 0),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded','failed')),
  created_at timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, customer_id) references public.customers(tenant_id, id)
);

create table if not exists public.sale_items (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  sale_id uuid not null,
  product_id uuid not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  foreign key (tenant_id, sale_id) references public.sales(tenant_id, id) on delete cascade,
  foreign key (tenant_id, product_id) references public.products(tenant_id, id)
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_tenant_created_idx on public.audit_logs(tenant_id, created_at desc);

-- Enable row-level security on every tenant-owned table.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'tenants','tenant_memberships','staff','customers','services',
    'subscription_plans','appointments','subscriptions','products',
    'sales','sale_items','audit_logs'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

drop policy if exists tenant_read_membership on public.tenant_memberships;
create policy tenant_read_membership on public.tenant_memberships
  for select using (user_id = auth.uid());

drop policy if exists tenant_read on public.tenants;
create policy tenant_read on public.tenants
  for select using (public.is_tenant_member(id));

-- Membership provisioning and tenant creation must happen through a trusted
-- server/Edge Function using the service role, never from an unauthenticated client.
do $$
declare table_name text;
begin
  foreach table_name in array array[
    'staff','customers','services','subscription_plans','appointments',
    'subscriptions','products','sales','sale_items','audit_logs'
  ] loop
    execute format('drop policy if exists tenant_member_all on public.%I', table_name);
    execute format(
      'create policy tenant_member_all on public.%I for all using (public.is_tenant_member(tenant_id)) with check (public.is_tenant_member(tenant_id))',
      table_name
    );
  end loop;
end $$;

-- No browser-facing INSERT/UPDATE/DELETE policy is created for tenants or
-- tenant_memberships. Provision those records via a trusted backend only.
