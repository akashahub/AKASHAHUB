-- Execute no SQL Editor do projeto Supabase.
-- O bucket permanece privado e os dois e-mails são reforçados nas políticas.
create extension if not exists pgcrypto;

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  storage_path text not null,
  duration int,
  size bigint,
  mime_type text,
  created_at timestamptz default now()
);
create index if not exists videos_user_date_idx on public.videos (user_id, created_at desc);
alter table public.videos enable row level security;

drop policy if exists "select own authorized videos" on public.videos;
drop policy if exists "insert own authorized videos" on public.videos;
drop policy if exists "update own authorized videos" on public.videos;
drop policy if exists "delete own authorized videos" on public.videos;
create policy "select own authorized videos" on public.videos for select using (
  auth.uid() = user_id and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);
create policy "insert own authorized videos" on public.videos for insert with check (
  auth.uid() = user_id and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);
create policy "update own authorized videos" on public.videos for update using (
  auth.uid() = user_id and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
) with check (auth.uid() = user_id);
create policy "delete own authorized videos" on public.videos for delete using (
  auth.uid() = user_id and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);

insert into storage.buckets (id, name, public)
values ('diario-videos', 'diario-videos', false)
on conflict (id) do update set public = false;

-- O primeiro diretório do caminho deve ser o UUID do usuário.
drop policy if exists "diario select own files" on storage.objects;
drop policy if exists "diario insert own files" on storage.objects;
drop policy if exists "diario update own files" on storage.objects;
drop policy if exists "diario delete own files" on storage.objects;
create policy "diario select own files" on storage.objects for select using (
  bucket_id = 'diario-videos' and (storage.foldername(name))[1] = auth.uid()::text
  and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);
create policy "diario insert own files" on storage.objects for insert with check (
  bucket_id = 'diario-videos' and (storage.foldername(name))[1] = auth.uid()::text
  and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);
create policy "diario update own files" on storage.objects for update using (
  bucket_id = 'diario-videos' and (storage.foldername(name))[1] = auth.uid()::text
  and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
) with check (bucket_id = 'diario-videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "diario delete own files" on storage.objects for delete using (
  bucket_id = 'diario-videos' and (storage.foldername(name))[1] = auth.uid()::text
  and lower(auth.jwt()->>'email') in ('srklehn@gmail.com','yanfili.simon@gmail.com')
);
