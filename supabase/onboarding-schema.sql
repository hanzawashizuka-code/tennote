-- Add onboarding fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS height_cm INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(5,2);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dominant_hand TEXT CHECK (dominant_hand IN ('right','left'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_playing TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS strengths TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weaknesses TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_short TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_long TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_serve INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_forehand INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_backhand INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_volley INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_footwork INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_physical INT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS initial_mental INT;
