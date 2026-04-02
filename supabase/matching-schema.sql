-- ================================================================
-- マッチング機能テーブル
-- ================================================================

-- マッチングプロフィール（練習相手・ペア探し用の追加情報）
create table if not exists public.match_profiles (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  looking_for      text[] default '{}',     -- ['singles','doubles','practice','coach']
  preferred_days   text[] default '{}',     -- ['mon','tue','wed','thu','fri','sat','sun']
  preferred_time   text,                    -- 'morning','afternoon','evening','any'
  preferred_area   text,                    -- 活動エリア
  age_range_min    integer,
  age_range_max    integer,
  gender           text check (gender in ('male','female','other','any')),
  is_visible       boolean default true,    -- マッチング一覧に表示するか
  message          text,                    -- 自己PR
  updated_at       timestamptz default now()
);

-- マッチングリクエスト
create table if not exists public.match_requests (
  id               uuid primary key default gen_random_uuid(),
  from_user_id     uuid not null references public.profiles(id) on delete cascade,
  to_user_id       uuid not null references public.profiles(id) on delete cascade,
  status           text not null default 'pending' check (status in ('pending','accepted','declined')),
  message          text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now(),
  unique(from_user_id, to_user_id)
);

-- 診断結果保存テーブル
create table if not exists public.diagnosis_results (
  user_id          uuid primary key references public.profiles(id) on delete cascade,
  mbti_type        text,                    -- 例: 'ENFP', 'ISTJ'
  play_style       text,                    -- MBTI診断結果
  body_type        text check (body_type in ('straight','wave','natural')),
  color_season     text check (color_season in ('spring','summer','autumn','winter')),
  updated_at       timestamptz default now()
);

-- RLS
alter table public.match_profiles    enable row level security;
alter table public.match_requests    enable row level security;
alter table public.diagnosis_results enable row level security;

-- match_profiles: 公開ユーザーは全員閲覧可、自分だけ編集
create policy "公開マッチングプロフィールは閲覧可"
  on public.match_profiles for select
  using (is_visible = true or auth.uid() = user_id);

create policy "自分のマッチングプロフィールを更新"
  on public.match_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- match_requests: 送受信者だけ閲覧可
create policy "自分のマッチングリクエストを閲覧"
  on public.match_requests for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create policy "マッチングリクエストを送信"
  on public.match_requests for insert
  with check (auth.uid() = from_user_id);

create policy "マッチングリクエストを更新"
  on public.match_requests for update
  using (auth.uid() = to_user_id);

-- diagnosis_results: 自分だけ
create policy "自分の診断結果を管理"
  on public.diagnosis_results for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Realtime有効化
alter publication supabase_realtime add table public.match_requests;
