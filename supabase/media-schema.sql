-- ── メディア機能追加 SQL ──────────────────────────────────────

-- postsテーブルにメディア列追加
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_urls  TEXT[]  DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS media_type  TEXT;   -- 'image' | 'video' | NULL

-- messagesテーブルにメディア列追加
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url   TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_type  TEXT;  -- 'image' | 'video' | NULL

-- ── Storage バケット作成 ───────────────────────────────────────

-- フィード投稿用（公開）
INSERT INTO storage.buckets (id, name, public, file_size_limit)
  VALUES ('post-media', 'post-media', true, 52428800)
  ON CONFLICT (id) DO NOTHING;

-- AI動画分析用（非公開）
INSERT INTO storage.buckets (id, name, public, file_size_limit)
  VALUES ('coach-media', 'coach-media', false, 104857600)
  ON CONFLICT (id) DO NOTHING;

-- DM添付用（非公開）
INSERT INTO storage.buckets (id, name, public, file_size_limit)
  VALUES ('dm-media', 'dm-media', false, 52428800)
  ON CONFLICT (id) DO NOTHING;

-- ── Storage ポリシー ──────────────────────────────────────────

-- post-media
CREATE POLICY "post_media_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "post_media_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');
CREATE POLICY "post_media_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'post-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- coach-media
CREATE POLICY "coach_media_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'coach-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "coach_media_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'coach-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- dm-media
CREATE POLICY "dm_media_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dm-media' AND auth.uid() IS NOT NULL);
CREATE POLICY "dm_media_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'dm-media' AND auth.uid() IS NOT NULL);
