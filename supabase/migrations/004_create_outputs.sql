-- ============================================================
-- 004_create_outputs.sql
-- Dönüşüm çıktıları (her conversion için birden fazla olabilir)
-- ============================================================

CREATE TABLE public.outputs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversion_id   UUID NOT NULL REFERENCES public.conversions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  format          TEXT NOT NULL
                  CHECK (format IN (
                    'linkedin', 'twitter_thread', 'newsletter',
                    'shorts_script', 'carousel', 'blog_summary'
                  )),
  tone            TEXT DEFAULT 'professional'
                  CHECK (tone IN (
                    'professional', 'casual', 'humorous',
                    'inspirational', 'educational'
                  )),
  content         TEXT NOT NULL,
  content_json    JSONB,
  word_count      INTEGER,
  is_edited       BOOLEAN DEFAULT FALSE,
  edited_content  TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_outputs_conversion_id ON public.outputs(conversion_id);
CREATE INDEX idx_outputs_user_id ON public.outputs(user_id);
CREATE INDEX idx_outputs_format ON public.outputs(format);
