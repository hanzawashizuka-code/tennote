-- ── Livestreams ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS livestreams (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT        NOT NULL,
  description   TEXT,
  status        TEXT        NOT NULL DEFAULT 'waiting'
                            CHECK (status IN ('waiting', 'live', 'ended')),
  viewer_count  INT         NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ,
  ended_at      TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS livestreams_status_idx    ON livestreams(status);
CREATE INDEX IF NOT EXISTS livestreams_host_id_idx   ON livestreams(host_id);
CREATE INDEX IF NOT EXISTS livestreams_created_at_idx ON livestreams(created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────────
ALTER TABLE livestreams ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read streams
CREATE POLICY "livestreams_public_read"
  ON livestreams FOR SELECT
  USING (true);

-- Authenticated users can create their own streams
CREATE POLICY "livestreams_host_insert"
  ON livestreams FOR INSERT
  WITH CHECK (auth.uid() = host_id);

-- Only the host can update their stream
CREATE POLICY "livestreams_host_update"
  ON livestreams FOR UPDATE
  USING (auth.uid() = host_id);

-- Only the host can delete their stream
CREATE POLICY "livestreams_host_delete"
  ON livestreams FOR DELETE
  USING (auth.uid() = host_id);

-- ── Enable Realtime ───────────────────────────────────────────────────────────
-- Run this in Supabase Dashboard → Table Editor → livestreams → Realtime
-- Or via CLI: supabase realtime enable-extension --schema public
ALTER PUBLICATION supabase_realtime ADD TABLE livestreams;
