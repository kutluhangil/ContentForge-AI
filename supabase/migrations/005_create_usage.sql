-- ============================================================
-- 005_create_usage.sql
-- Aylık kullanım takibi
-- ============================================================

CREATE TABLE public.usage (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start      DATE NOT NULL,
  period_end        DATE NOT NULL,
  conversions_used  INTEGER DEFAULT 0,
  conversions_limit INTEGER NOT NULL DEFAULT 3,  -- Free plan limiti
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, period_start)
);

-- Indexes
CREATE INDEX idx_usage_user_period ON public.usage(user_id, period_start);

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Templates tablosu
-- ============================================================

CREATE TABLE public.templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  description_tr  TEXT,
  description_en  TEXT,
  format          TEXT NOT NULL,
  tone            TEXT NOT NULL,
  custom_prompt   TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_templates_format ON public.templates(format);
CREATE INDEX idx_templates_sort ON public.templates(sort_order);

-- Seed: Temel şablonlar
INSERT INTO public.templates (name_tr, name_en, description_tr, description_en, format, tone, is_premium, sort_order)
VALUES
  ('Profesyonel LinkedIn', 'Professional LinkedIn', 'İş dünyasına yönelik profesyonel ton', 'Professional tone for business audience', 'linkedin', 'professional', false, 1),
  ('Samimi Twitter Thread', 'Casual Twitter Thread', 'Samimi ve eğlenceli thread formatı', 'Casual and engaging thread format', 'twitter_thread', 'casual', false, 2),
  ('Eğitici Blog Özeti', 'Educational Summary', 'Öğretici ve bilgilendirici özet', 'Educational and informative summary', 'blog_summary', 'educational', false, 3),
  ('İlham Verici Newsletter', 'Inspirational Newsletter', 'Motivasyon odaklı newsletter', 'Motivation-focused newsletter', 'newsletter', 'inspirational', true, 4),
  ('Shorts Script (Eğlenceli)', 'Shorts Script (Humorous)', 'Eğlenceli kısa video scripti', 'Fun short-form video script', 'shorts_script', 'humorous', true, 5),
  ('Instagram Carousel', 'Instagram Carousel', 'Görsel carousel içerik planı', 'Visual carousel content plan', 'carousel', 'professional', true, 6);
