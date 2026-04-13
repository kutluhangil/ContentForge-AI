-- ============================================================
-- 001_create_profiles.sql
-- Kullanıcı profilleri (Supabase Auth ile bağlantılı)
-- ============================================================

CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  locale          TEXT DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  timezone        TEXT DEFAULT 'Europe/Istanbul',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- updated_at auto-update trigger function (shared)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
