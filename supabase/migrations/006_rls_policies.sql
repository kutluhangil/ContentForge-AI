-- ============================================================
-- 006_rls_policies.sql
-- Row Level Security politikaları ve yeni kullanıcı trigger'ı
-- ============================================================

-- RLS Aktif Et
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ── Subscriptions ──
CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- ── Conversions ──
CREATE POLICY "Users can view own conversions"
  ON public.conversions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversions"
  ON public.conversions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversions"
  ON public.conversions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversions"
  ON public.conversions FOR DELETE USING (auth.uid() = user_id);

-- ── Outputs ──
CREATE POLICY "Users can view own outputs"
  ON public.outputs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own outputs"
  ON public.outputs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outputs"
  ON public.outputs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ── Usage ──
CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT USING (auth.uid() = user_id);

-- ── Templates (herkese açık okuma) ──
CREATE POLICY "Anyone can view templates"
  ON public.templates FOR SELECT USING (true);

-- ============================================================
-- Yeni kullanıcı → profil + subscription + usage trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Profil oluştur
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Free subscription oluştur
  INSERT INTO public.subscriptions (user_id, plan_slug, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;

  -- Bu ayki usage kaydı oluştur
  INSERT INTO public.usage (
    user_id,
    period_start,
    period_end,
    conversions_limit
  )
  VALUES (
    NEW.id,
    date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month' - interval '1 day')::date,
    3
  )
  ON CONFLICT (user_id, period_start) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Storage Buckets
-- ============================================================

-- Audio yüklemeleri
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-uploads',
  'audio-uploads',
  false,
  52428800,  -- 50MB
  ARRAY['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- PDF yüklemeleri
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,  -- 10MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Users can upload own audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
