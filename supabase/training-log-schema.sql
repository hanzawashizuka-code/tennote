-- ── トレーニングログ & バロメーター ─────────────────────────────

-- トレーニングログ
CREATE TABLE IF NOT EXISTS training_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_at     DATE NOT NULL DEFAULT CURRENT_DATE,
  category      TEXT NOT NULL, -- 'technical' | 'physical' | 'match' | 'mental'
  title         TEXT NOT NULL,
  duration_min  INT,           -- 練習時間（分）
  intensity     INT CHECK (intensity BETWEEN 1 AND 5), -- 強度 1-5
  notes         TEXT,
  -- スコア（任意）
  score_serve       INT CHECK (score_serve BETWEEN 0 AND 100),
  score_forehand    INT CHECK (score_forehand BETWEEN 0 AND 100),
  score_backhand    INT CHECK (score_backhand BETWEEN 0 AND 100),
  score_volley      INT CHECK (score_volley BETWEEN 0 AND 100),
  score_footwork    INT CHECK (score_footwork BETWEEN 0 AND 100),
  score_physical    INT CHECK (score_physical BETWEEN 0 AND 100),
  score_mental      INT CHECK (score_mental BETWEEN 0 AND 100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE training_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "training_logs_select" ON training_logs FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "training_logs_insert" ON training_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "training_logs_update" ON training_logs FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "training_logs_delete" ON training_logs FOR DELETE
  USING (auth.uid() = user_id);

-- インデックス
CREATE INDEX IF NOT EXISTS training_logs_user_date
  ON training_logs(user_id, logged_at DESC);
