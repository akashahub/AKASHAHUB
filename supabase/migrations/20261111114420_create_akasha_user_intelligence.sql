create table if not exists public.ah_auth_directory (
  firebase_uid text primary key,
  email text,
  display_name text,
  photo_url text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  disabled boolean not null default false,
  providers jsonb not null default '[]'::jsonb,
  synced_at timestamptz not null default now()
);

create index if not exists ah_auth_directory_email_idx
  on public.ah_auth_directory (lower(email));

create table if not exists public.ah_user_sessions (
  session_id uuid primary key,
  firebase_uid text not null,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ended_at timestamptz,
  current_path text,
  current_department text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists ah_user_sessions_uid_last_seen_idx
  on public.ah_user_sessions (firebase_uid, last_seen_at desc);

create table if not exists public.ah_user_activity (
  id bigint generated always as identity primary key,
  firebase_uid text not null,
  session_id uuid,
  event_type text not null check (event_type in ('session_start','page_view','department_view','heartbeat','logout')),
  page_path text,
  department text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists ah_user_activity_uid_time_idx
  on public.ah_user_activity (firebase_uid, occurred_at desc);

create index if not exists ah_user_activity_department_time_idx
  on public.ah_user_activity (department, occurred_at desc);

alter table public.ah_auth_directory enable row level security;
alter table public.ah_user_sessions enable row level security;
alter table public.ah_user_activity enable row level security;

revoke all on table public.ah_auth_directory from anon, authenticated;
revoke all on table public.ah_user_sessions from anon, authenticated;
revoke all on table public.ah_user_activity from anon, authenticated;

grant all on table public.ah_auth_directory to service_role;
grant all on table public.ah_user_sessions to service_role;
grant all on table public.ah_user_activity to service_role;
grant usage, select on sequence public.ah_user_activity_id_seq to service_role;
