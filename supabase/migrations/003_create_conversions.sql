-- ============================================================
-- 003_create_conversions.sql
-- Dönüşüm kayıtları
-- ============================================================

CREATE TABLE public.conversions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_type     TEXT NOT NULL
                  CHECK (source_type IN ('blog_url', 'blog_text', 'youtube', 'audio', 'pdf')),
  source_url      TEXT,
  source_text     TEXT,
  source_file_url TEXT,
  title           TEXT,
  language        TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message   TEXT,
  processing_time INTEGER,  -- milisaniye
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX idx_conversions_status ON public.conversions(status);
CREATE INDEX idx_conversions_created ON public.conversions(created_at DESC);

CREATE TRIGGER update_conversions_updated_at
  BEFORE UPDATE ON public.conversions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
