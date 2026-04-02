-- ================================================================
-- テニスAIコーチ - Supabase スキーマ
-- Supabase SQL Editorでこのファイルを実行してください
-- ================================================================

create extension if not exists "uuid-ossp";

-- ================================================================
-- PROFILES (auth.usersと1:1)
-- ================================================================
create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  username       text unique not null,
  display_name   text,
  bio            text,
  avatar_url     text,
  skill_level    text check (skill_level in ('beginner','intermediate','advanced','pro')),
  play_style     text,
  location       text,
  referral_code  text unique default upper(substring(gen_random_uuid()::text, 1, 8)),
  referred_by    text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ================================================================
-- SUBSCRIPTIONS
-- ================================================================
create table public.subscriptions (
  id                   text primary key,
  user_id              uuid not null references public.profiles(id) on delete cascade,
  status               text not null,
  plan                 text not null check (plan in ('free','pro','premium')),
  stripe_customer_id   text unique,
  stripe_price_id      text,
  current_period_start timestamptz,
  current_period_end   timestamptz,
  cancel_at_period_end boolean default false,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ================================================================
-- REFERRALS
-- ================================================================
create table public.referrals (
  id             uuid primary key default gen_random_uuid(),
  referrer_id    uuid not null references public.profiles(id) on delete cascade,
  referred_id    uuid not null references public.profiles(id) on delete cascade,
  referral_code  text not null,
  discount_pct   integer not null default 10,
  redeemed_at    timestamptz,
  created_at     timestamptz default now(),
  unique(referred_id)
);

-- ================================================================
-- COACH SESSIONS
-- ================================================================
create table public.coach_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  messages    jsonb not null default '[]',
  title       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ================================================================
-- POSTS
-- ================================================================
create table public.posts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  content     text not null check (char_length(content) <= 1000),
  image_url   text,
  likes_count integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table public.post_likes (
  post_id    uuid not null references public.posts(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- ================================================================
-- DIRECT MESSAGES
-- ================================================================
create table public.conversations (
  id           uuid primary key default gen_random_uuid(),
  participant1 uuid not null references public.profiles(id) on delete cascade,
  participant2 uuid not null references public.profiles(id) on delete cascade,
  last_message_at timestamptz default now(),
  created_at   timestamptz default now(),
  check (participant1 < participant2),
  unique(participant1, participant2)
);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  content         text not null check (char_length(content) <= 2000),
  read_at         timestamptz,
  created_at      timestamptz default now()
);

-- ================================================================
-- EVENTS
-- ================================================================
create table public.events (
  id             uuid primary key default gen_random_uuid(),
  organizer_id   uuid references public.profiles(id) on delete set null,
  title          text not null,
  description    text,
  event_type     text not null check (event_type in ('tournament','practice','clinic')),
  location       text not null,
  starts_at      timestamptz not null,
  ends_at        timestamptz,
  max_entrants   integer,
  entry_fee_jpy  integer not null default 0,
  skill_levels   text[] default '{}',
  stripe_price_id text,
  created_at     timestamptz default now()
);

create table public.event_entries (
  id           uuid primary key default gen_random_uuid(),
  event_id     uuid not null references public.events(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  status       text not null default 'confirmed' check (status in ('confirmed','waitlisted','cancelled')),
  payment_intent_id text,
  created_at   timestamptz default now(),
  unique(event_id, user_id)
);

-- ================================================================
-- TRIGGERS
-- ================================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  insert into public.subscriptions (id, user_id, status, plan)
  values ('free_' || new.id, new.id, 'active', 'free');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();
create trigger posts_updated_at before update on public.posts
  for each row execute procedure public.set_updated_at();
create trigger coach_sessions_updated_at before update on public.coach_sessions
  for each row execute procedure public.set_updated_at();

-- likes カウント用 RPC
create or replace function public.increment_likes(post_id uuid)
returns void language sql as $$
  update public.posts set likes_count = likes_count + 1 where id = post_id;
$$;

create or replace function public.decrement_likes(post_id uuid)
returns void language sql as $$
  update public.posts set likes_count = greatest(0, likes_count - 1) where id = post_id;
$$;

-- ================================================================
-- RLS
-- ================================================================
alter table public.profiles        enable row level security;
alter table public.subscriptions   enable row level security;
alter table public.referrals       enable row level security;
alter table public.coach_sessions  enable row level security;
alter table public.posts           enable row level security;
alter table public.post_likes      enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;
alter table public.events          enable row level security;
alter table public.event_entries   enable row level security;

-- profiles
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- subscriptions
create policy "Users can view their own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);
create policy "Service role manages subscriptions"
  on public.subscriptions for all using (auth.role() = 'service_role');

-- coach_sessions
create policy "Users can CRUD their own coach sessions"
  on public.coach_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- posts
create policy "Posts visible to authenticated users"
  on public.posts for select using (auth.role() = 'authenticated');
create policy "Users can insert their own posts"
  on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can update their own posts"
  on public.posts for update using (auth.uid() = user_id);
create policy "Users can delete their own posts"
  on public.posts for delete using (auth.uid() = user_id);

-- post_likes
create policy "Likes visible to authenticated users"
  on public.post_likes for select using (auth.role() = 'authenticated');
create policy "Users can like posts"
  on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts"
  on public.post_likes for delete using (auth.uid() = user_id);

-- conversations
create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = participant1 or auth.uid() = participant2);
create policy "Authenticated users can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant1 or auth.uid() = participant2);

-- messages
create policy "Participants can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant1 = auth.uid() or c.participant2 = auth.uid())
    )
  );
create policy "Participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.participant1 = auth.uid() or c.participant2 = auth.uid())
    )
  );

-- events
create policy "Events visible to authenticated users"
  on public.events for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create events"
  on public.events for insert with check (auth.uid() = organizer_id);

-- event_entries
create policy "Users can view their own entries"
  on public.event_entries for select using (auth.uid() = user_id);
create policy "Users can enter events"
  on public.event_entries for insert with check (auth.uid() = user_id);

-- referrals
create policy "Users can view their own referrals"
  on public.referrals for select using (auth.uid() = referrer_id or auth.uid() = referred_id);

-- ================================================================
-- REALTIME
-- ================================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.posts;
alter publication supabase_realtime add table public.conversations;

-- ================================================================
-- STORAGE BUCKETS
-- Supabase Dashboard > Storage で作成後にポリシーを設定
-- ================================================================
-- avatars バケット (public)
-- insert policy: auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text
-- select policy: true (public)
-- update policy: (storage.foldername(name))[1] = auth.uid()::text

-- ================================================================
-- サンプルイベントデータ (任意)
-- ================================================================
-- insert into public.events (title, event_type, location, starts_at, entry_fee_jpy, skill_levels) values
--   ('春の初心者テニス大会', 'tournament', '東京都渋谷区・代々木公園テニスコート', now() + interval '14 days', 1500, '{"beginner"}'),
--   ('週末練習会 in 新宿', 'practice', '新宿区・戸山公園テニスコート', now() + interval '7 days', 500, '{"intermediate","advanced"}'),
--   ('プロコーチによるクリニック', 'clinic', '品川区・大崎テニスクラブ', now() + interval '21 days', 3000, '{"beginner","intermediate"}');
