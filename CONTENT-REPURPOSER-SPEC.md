# 🔄 ContentForge — İçerik Yeniden Kullanım Platformu

## Project Specification Document — Claude Code Implementation Guide

> **Versiyon:** 1.0.0
> **Tarih:** Nisan 2026
> **Tech Lead:** Claude Code (VS Code)
> **Dil Desteği:** Türkçe 🇹🇷 + English 🇬🇧

---

## 1. PROJE ÖZETİ

**ContentForge**, içerik üreticilerinin tek bir kaynaktan (blog yazısı, YouTube videosu, podcast) farklı platformlara uygun formatlarda içerik üretmesini sağlayan bir SaaS platformudur.

### Girdi Kaynakları
- Blog yazısı (URL veya metin yapıştırma)
- YouTube video linki (transkript çıkarma)
- Podcast / ses dosyası yükleme (Whisper ile metin dönüşümü)
- PDF / doküman yükleme

### Çıktı Formatları
- LinkedIn post (profesyonel ton)
- Twitter/X thread (kısa, dikkat çekici)
- Newsletter e-posta formatı
- YouTube Shorts / Reels script
- Instagram carousel metin planı
- Blog özeti / meta description

---

## 2. TEKNOLOJİ MİMARİSİ

### 2.1 Frontend
```
Framework:        Next.js 14 (App Router)
Dil:              TypeScript
Styling:          Tailwind CSS 4 + CSS Variables
Animasyon:        Framer Motion
State:            Zustand
i18n:             next-intl
Form:             React Hook Form + Zod
Icons:            Lucide React
Font:             Satoshi (display) + JetBrains Mono (mono) + DM Sans (body)
```

### 2.2 Backend
```
Runtime:          Node.js 20 LTS
Framework:        Next.js API Routes (frontend ile aynı repo)
AI - Transkript:  OpenAI Whisper API
AI - Dönüşüm:    OpenAI GPT-4o API
Database:         Supabase (PostgreSQL + Auth + Storage + Realtime)
Ödeme:            Lemon Squeezy (checkout overlay + webhooks)
Queue:            BullMQ + Redis (uzun süren dönüşümler için)
Rate Limiting:    Upstash Redis
```

### 2.3 Altyapı (Ubuntu Server + Docker)
```
Sunucu:           Ubuntu Server 24.04 LTS (ev sunucusu)
Container:        Docker + Docker Compose
Reverse Proxy:    Caddy (otomatik SSL)
Process Manager:  Docker healthchecks
CI/CD:            GitHub Actions → SSH deploy
Monitoring:       Uptime Kuma (self-hosted)
```

---

## 3. DEPLOYMENT MİMARİSİ

```
┌─────────────────────────────────────────────────┐
│                UBUNTU SERVER                     │
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │            Docker Compose                  │   │
│  │                                            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │
│  │  │  Next.js  │  │  Redis   │  │  Caddy  │  │   │
│  │  │  App      │  │  Queue   │  │  Proxy  │  │   │
│  │  │  :3000    │  │  :6379   │  │  :443   │  │   │
│  │  └──────────┘  └──────────┘  └─────────┘  │   │
│  │                                            │   │
│  │  ┌──────────┐  ┌──────────────────────┐   │   │
│  │  │  BullMQ  │  │  Uptime Kuma         │   │   │
│  │  │  Worker  │  │  Monitoring  :3001    │   │   │
│  │  └──────────┘  └──────────────────────┘   │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
└──────────────────────┬──────────────────────────┘
                       │
              Caddy Reverse Proxy
                       │
                   İnternet
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    Supabase      OpenAI API    Lemon Squeezy
    (Cloud)       (Whisper+GPT) (Payments)
```

---

## 4. DOSYA YAPISI

```
contentforge/
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD pipeline
├── docker/
│   ├── Dockerfile                     # Next.js production build
│   ├── Dockerfile.worker              # BullMQ worker
│   └── docker-compose.yml             # Tüm servisler
├── public/
│   ├── locales/
│   │   ├── tr/
│   │   │   └── common.json            # Türkçe çeviriler
│   │   └── en/
│   │       └── common.json            # İngilizce çeviriler
│   ├── fonts/                         # Self-hosted fontlar
│   └── og/                            # Open Graph görselleri
├── src/
│   ├── app/
│   │   ├── [locale]/                  # i18n route grupları
│   │   │   ├── layout.tsx             # Root layout (locale)
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── callback/page.tsx  # OAuth callback
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx         # Dashboard layout + sidebar
│   │   │   │   ├── dashboard/page.tsx # Ana dashboard
│   │   │   │   ├── repurpose/
│   │   │   │   │   ├── page.tsx       # Yeni dönüşüm
│   │   │   │   │   └── [id]/page.tsx  # Dönüşüm detay
│   │   │   │   ├── history/page.tsx   # Dönüşüm geçmişi
│   │   │   │   ├── templates/page.tsx # Hazır şablonlar
│   │   │   │   └── settings/
│   │   │   │       ├── page.tsx       # Genel ayarlar
│   │   │   │       ├── billing/page.tsx
│   │   │   │       └── api-keys/page.tsx
│   │   │   └── pricing/page.tsx       # Fiyatlandırma sayfası
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── lemonsqueezy/route.ts  # Ödeme webhook
│   │   │   ├── repurpose/
│   │   │   │   ├── route.ts               # Dönüşüm başlat
│   │   │   │   └── [id]/route.ts          # Dönüşüm durumu
│   │   │   ├── transcribe/route.ts        # Whisper transkript
│   │   │   ├── youtube/route.ts           # YT transkript çekme
│   │   │   └── usage/route.ts             # Kullanım limiti kontrol
│   │   └── middleware.ts                  # Auth + i18n + rate limit
│   ├── components/
│   │   ├── ui/                        # Primitif UI bileşenleri
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── DropdownMenu.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Progress.tsx
│   │   │   └── Toggle.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LocaleSwitcher.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── RecentConversions.tsx
│   │   │   └── UsageBar.tsx
│   │   ├── repurpose/
│   │   │   ├── InputSelector.tsx      # Blog/YT/Podcast seçici
│   │   │   ├── BlogInput.tsx
│   │   │   ├── YouTubeInput.tsx
│   │   │   ├── AudioUploader.tsx
│   │   │   ├── OutputFormatPicker.tsx  # Çıktı format seçimi
│   │   │   ├── ToneSelector.tsx       # Ton/stil seçici
│   │   │   ├── ResultCard.tsx         # Dönüşüm sonucu
│   │   │   ├── ResultEditor.tsx       # Inline düzenleme
│   │   │   └── CopyButton.tsx
│   │   └── billing/
│   │       ├── PlanCard.tsx
│   │       ├── CheckoutButton.tsx
│   │       └── UsageAlert.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts              # Browser client
│   │   │   ├── server.ts              # Server client
│   │   │   ├── admin.ts               # Service role client
│   │   │   └── middleware.ts          # Auth middleware helper
│   │   ├── ai/
│   │   │   ├── openai.ts             # OpenAI client yapılandırma
│   │   │   ├── whisper.ts            # Ses → Metin dönüşümü
│   │   │   ├── repurpose.ts          # Ana dönüşüm motoru
│   │   │   └── prompts/
│   │   │       ├── linkedin.ts        # LinkedIn prompt şablonu
│   │   │       ├── twitter.ts         # Twitter thread prompt
│   │   │       ├── newsletter.ts      # Newsletter prompt
│   │   │       ├── shorts.ts          # YT Shorts script prompt
│   │   │       ├── carousel.ts        # IG carousel prompt
│   │   │       └── summary.ts         # Blog özeti prompt
│   │   ├── payments/
│   │   │   ├── lemonsqueezy.ts        # LS API client
│   │   │   ├── plans.ts              # Plan tanımları
│   │   │   └── webhook-handler.ts     # Webhook işleme
│   │   ├── queue/
│   │   │   ├── connection.ts          # Redis bağlantısı
│   │   │   ├── repurpose-queue.ts     # Dönüşüm kuyruğu
│   │   │   └── worker.ts             # İşçi process
│   │   ├── youtube.ts                 # YT transkript çekme
│   │   ├── rate-limit.ts             # Rate limiting
│   │   ├── usage.ts                  # Kullanım limiti kontrol
│   │   └── utils.ts                  # Yardımcı fonksiyonlar
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useSubscription.ts
│   │   ├── useUsage.ts
│   │   ├── useRepurpose.ts
│   │   └── useToast.ts
│   ├── stores/
│   │   ├── repurpose-store.ts
│   │   └── ui-store.ts
│   ├── types/
│   │   ├── database.ts               # Supabase generated types
│   │   ├── repurpose.ts
│   │   ├── plans.ts
│   │   └── api.ts
│   └── styles/
│       └── globals.css                # Tailwind + CSS variables
├── supabase/
│   ├── migrations/
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_subscriptions.sql
│   │   ├── 003_create_conversions.sql
│   │   ├── 004_create_outputs.sql
│   │   ├── 005_create_usage.sql
│   │   └── 006_rls_policies.sql
│   ├── seed.sql
│   └── config.toml
├── workers/
│   └── repurpose-worker.ts            # Standalone BullMQ worker
├── scripts/
│   ├── setup-env.sh                   # Ortam kurulumu
│   ├── generate-types.sh              # Supabase type gen
│   └── deploy.sh                      # Deploy betiği
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. VERİTABANI ŞEMASI (Supabase / PostgreSQL)

### 5.1 Tablolar

```sql
-- ============================================================
-- 1. PROFILES — Kullanıcı profilleri (Supabase Auth ile bağlantılı)
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

-- ============================================================
-- 2. SUBSCRIPTIONS — Abonelik bilgileri (Lemon Squeezy ile senkron)
-- ============================================================
CREATE TABLE public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ls_subscription_id    TEXT UNIQUE,              -- Lemon Squeezy subscription ID
  ls_customer_id        TEXT,                      -- Lemon Squeezy customer ID
  plan_slug             TEXT NOT NULL DEFAULT 'free'
                        CHECK (plan_slug IN ('free', 'starter', 'pro')),
  status                TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'paused')),
  billing_cycle         TEXT DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 3. CONVERSIONS — Dönüşüm kayıtları
-- ============================================================
CREATE TABLE public.conversions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_type     TEXT NOT NULL CHECK (source_type IN ('blog_url', 'blog_text', 'youtube', 'audio', 'pdf')),
  source_url      TEXT,                             -- Blog URL veya YouTube linki
  source_text     TEXT,                             -- Ham kaynak metin
  source_file_url TEXT,                             -- Supabase Storage dosya URL
  title           TEXT,                             -- İçerik başlığı (otomatik çıkarılır)
  language        TEXT DEFAULT 'tr' CHECK (language IN ('tr', 'en')),
  status          TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message   TEXT,
  processing_time INTEGER,                         -- milisaniye
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. OUTPUTS — Dönüşüm çıktıları (her conversion için birden fazla)
-- ============================================================
CREATE TABLE public.outputs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversion_id   UUID NOT NULL REFERENCES public.conversions(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  format          TEXT NOT NULL
                  CHECK (format IN ('linkedin', 'twitter_thread', 'newsletter', 'shorts_script', 'carousel', 'blog_summary')),
  tone            TEXT DEFAULT 'professional'
                  CHECK (tone IN ('professional', 'casual', 'humorous', 'inspirational', 'educational')),
  content         TEXT NOT NULL,                    -- Oluşturulan çıktı
  content_json    JSONB,                            -- Yapısal veri (thread sırası vs.)
  word_count      INTEGER,
  is_edited       BOOLEAN DEFAULT FALSE,
  edited_content  TEXT,                             -- Kullanıcının düzenlediği versiyon
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. USAGE — Aylık kullanım takibi
-- ============================================================
CREATE TABLE public.usage (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start    DATE NOT NULL,                    -- Ay başlangıcı
  period_end      DATE NOT NULL,                    -- Ay sonu
  conversions_used INTEGER DEFAULT 0,
  conversions_limit INTEGER NOT NULL DEFAULT 3,     -- Free plan limiti
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, period_start)
);

-- ============================================================
-- 6. TEMPLATES — Hazır prompt şablonları
-- ============================================================
CREATE TABLE public.templates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  description_tr  TEXT,
  description_en  TEXT,
  format          TEXT NOT NULL,
  tone            TEXT NOT NULL,
  custom_prompt   TEXT,                             -- Ek prompt talimatları
  is_premium      BOOLEAN DEFAULT FALSE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_conversions_user_id ON public.conversions(user_id);
CREATE INDEX idx_conversions_status ON public.conversions(status);
CREATE INDEX idx_conversions_created ON public.conversions(created_at DESC);
CREATE INDEX idx_outputs_conversion_id ON public.outputs(conversion_id);
CREATE INDEX idx_usage_user_period ON public.usage(user_id, period_start);

-- ============================================================
-- RLS POLİÇELERİ
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own conversions"
  ON public.conversions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversions"
  ON public.conversions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own outputs"
  ON public.outputs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own outputs"
  ON public.outputs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage"
  ON public.usage FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view templates"
  ON public.templates FOR SELECT USING (true);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Yeni kullanıcı → otomatik profil + free subscription + usage kaydı
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.subscriptions (user_id, plan_slug, status)
  VALUES (NEW.id, 'free', 'active');

  INSERT INTO public.usage (user_id, period_start, period_end, conversions_limit)
  VALUES (
    NEW.id,
    date_trunc('month', now())::date,
    (date_trunc('month', now()) + interval '1 month' - interval '1 day')::date,
    3
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at otomatik güncelleme
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

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_conversions_updated_at
  BEFORE UPDATE ON public.conversions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON public.usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### 5.2 Supabase Storage Buckets

```
Bucket: audio-uploads
  - Yol: {user_id}/{conversion_id}/{filename}
  - Max boyut: 50MB
  - İzin verilen tipler: audio/mpeg, audio/wav, audio/mp4, audio/webm

Bucket: documents
  - Yol: {user_id}/{conversion_id}/{filename}
  - Max boyut: 10MB
  - İzin verilen tipler: application/pdf
```

---

## 6. TASARIM SİSTEMİ

### 6.1 Tasarım Felsefesi

**"Obsidian Luxury"** — Koyu tonlarda premium minimalizm. Her element amaca hizmet eder, fazlası yok. Cam efekti (glassmorphism), ince kenarlıklar ve kontrollü ışık oyunları ile derinlik hissi. Her animasyon bir işlev taşır.

### 6.2 Renk Paleti

```css
:root {
  /* ── Arka Plan Katmanları ── */
  --bg-primary:       #0A0A0B;          /* Ana arka plan - neredeyse siyah */
  --bg-secondary:     #111113;          /* Kart / panel arka planı */
  --bg-tertiary:      #1A1A1F;          /* Yükseltilmiş yüzey */
  --bg-elevated:      #222228;          /* Hover / aktif yüzeyler */
  --bg-glass:         rgba(255, 255, 255, 0.03); /* Glassmorphism */

  /* ── Kenarlıklar ── */
  --border-subtle:    rgba(255, 255, 255, 0.06);
  --border-default:   rgba(255, 255, 255, 0.10);
  --border-hover:     rgba(255, 255, 255, 0.16);
  --border-focus:     rgba(255, 255, 255, 0.24);

  /* ── Metin ── */
  --text-primary:     #F5F5F7;          /* Ana başlıklar */
  --text-secondary:   #A1A1AA;          /* Açıklamalar */
  --text-tertiary:    #71717A;          /* Placeholder / devre dışı */
  --text-inverse:     #0A0A0B;          /* Açık butonlarda */

  /* ── Aksan Renk — Beyaz/Gri ── */
  --accent-primary:   #E4E4E7;          /* Beyaz-gri ana aksan */
  --accent-hover:     #FFFFFF;          /* Hover beyaz */
  --accent-muted:     rgba(228, 228, 231, 0.12);

  /* ── Durum Renkleri (minimal) ── */
  --success:          #22C55E;
  --success-muted:    rgba(34, 197, 94, 0.12);
  --warning:          #F59E0B;
  --warning-muted:    rgba(245, 158, 11, 0.12);
  --error:            #EF4444;
  --error-muted:      rgba(239, 68, 68, 0.12);
  --info:             #6366F1;
  --info-muted:       rgba(99, 102, 241, 0.12);

  /* ── Platform Renkleri (badge'ler ve ikonlar için) ── */
  --linkedin:         #0A66C2;
  --twitter:          #1DA1F2;
  --youtube:          #FF0000;
  --instagram:        #E4405F;

  /* ── Gölgeler ── */
  --shadow-sm:        0 1px 2px rgba(0, 0, 0, 0.4);
  --shadow-md:        0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg:        0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-glow:      0 0 40px rgba(228, 228, 231, 0.04);

  /* ── Yarıçaplar ── */
  --radius-sm:        6px;
  --radius-md:        10px;
  --radius-lg:        16px;
  --radius-xl:        24px;
  --radius-full:      9999px;

  /* ── Spacing Sistemi (4px grid) ── */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* ── Transition ── */
  --ease-out:         cubic-bezier(0.16, 1, 0.3, 1);
  --ease-bounce:      cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast:    150ms;
  --duration-normal:  250ms;
  --duration-slow:    400ms;
}
```

### 6.3 Tipografi

```css
/* Font Stack */
--font-display:   'Satoshi', system-ui, sans-serif;
--font-body:      'DM Sans', system-ui, sans-serif;
--font-mono:      'JetBrains Mono', 'Fira Code', monospace;

/* Type Scale */
--text-xs:    0.75rem / 1rem;       /* 12px — badges, labels */
--text-sm:    0.875rem / 1.25rem;   /* 14px — body small */
--text-base:  1rem / 1.5rem;        /* 16px — body */
--text-lg:    1.125rem / 1.75rem;   /* 18px — body large */
--text-xl:    1.25rem / 1.75rem;    /* 20px — heading 5 */
--text-2xl:   1.5rem / 2rem;        /* 24px — heading 4 */
--text-3xl:   1.875rem / 2.25rem;   /* 30px — heading 3 */
--text-4xl:   2.25rem / 2.5rem;     /* 36px — heading 2 */
--text-5xl:   3rem / 1;             /* 48px — heading 1 */
--text-6xl:   3.75rem / 1;          /* 60px — hero */
--text-7xl:   4.5rem / 1;           /* 72px — hero XL */

/* Font Weights */
--weight-regular:   400;
--weight-medium:    500;
--weight-semibold:  600;
--weight-bold:      700;
--weight-black:     900;

/* Letter Spacing */
--tracking-tighter: -0.04em;  /* Büyük başlıklar */
--tracking-tight:   -0.02em;  /* Orta başlıklar */
--tracking-normal:   0;       /* Body text */
--tracking-wide:     0.02em;  /* Küçük etiketler */
--tracking-wider:    0.08em;  /* Uppercase etiketler */
```

### 6.4 Bileşen Tasarım Kalıpları

#### Kartlar (Glassmorphism)
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(20px);
  transition: all var(--duration-normal) var(--ease-out);
}
.card:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-glow);
  transform: translateY(-2px);
}
```

#### Butonlar
```css
/* Primary — Beyaz, minimal */
.btn-primary {
  background: var(--text-primary);
  color: var(--text-inverse);
  font-weight: var(--weight-semibold);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-6);
  transition: all var(--duration-fast) var(--ease-out);
}
.btn-primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

/* Ghost — Şeffaf kenarlık */
.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
}
.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--border-hover);
  background: var(--bg-elevated);
}
```

#### Input Alanları
```css
.input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  transition: border-color var(--duration-fast) var(--ease-out);
}
.input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(228, 228, 231, 0.06);
  outline: none;
}
```

### 6.5 Animasyon Rehberi

```typescript
// Framer Motion — Sayfa geçişleri
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
};

// Kart stagger animasyonu
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};
export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
};

// Dönüşüm işleniyor animasyonu
export const processingPulse = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(228, 228, 231, 0)',
      '0 0 0 8px rgba(228, 228, 231, 0.06)',
      '0 0 0 0 rgba(228, 228, 231, 0)'
    ],
    transition: { duration: 2, repeat: Infinity }
  }
};

// Yazı yazma efekti (sonuç görüntüleme)
export const typewriterEffect = {
  // Sonuç metnini karakter karakter göster
  // requestAnimationFrame ile akıcı render
};

// Navbar scroll efekti
export const navbarScroll = {
  // Scroll > 20px → arka plan blur + kenarlık
  // backdrop-filter: blur(12px)
  // border-bottom: 1px solid var(--border-subtle)
};

// Skeleton loading
export const skeletonShimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--bg-tertiary) 25%,
      var(--bg-elevated) 50%,
      var(--bg-tertiary) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
    border-radius: var(--radius-md);
  }
`;
```

### 6.6 Landing Page Bölüm Tasarımları

```
┌──────────────────────────────────────────────────────────────┐
│  NAVBAR                                                       │
│  Logo (sol) ─── Features | Pricing | Blog ─── [Login] [CTA]  │
│  Şeffaf → scroll ile glassmorphism                            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  HERO SECTION                                                  │
│  ┌─────────────────────────────────────────────┐              │
│  │  Bir İçerik.                                 │              │
│  │  Her Platform.                   (Satoshi 72px, bold)      │
│  │                                               │              │
│  │  Blog, video veya podcast'inizi saniyeler     │              │
│  │  içinde tüm platformlara dönüştürün.          │              │
│  │                                               │              │
│  │  [Ücretsiz Dene →]  [Demo İzle ▶]            │              │
│  │                                               │              │
│  │  ┌─────────────────────────────────────────┐  │              │
│  │  │ DEMO MOCKUP — Input → Output animasyonu │  │              │
│  │  │ Gerçek dönüşüm efekti, typewriter ile   │  │              │
│  │  │ LinkedIn, Twitter çıktıları yazılıyor    │  │              │
│  │  └─────────────────────────────────────────┘  │              │
│  └─────────────────────────────────────────────┘              │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│  LOGOS — "500+ içerik üreticisi güveniyor"                     │
│  Gri tonlarında partner/müşteri logoları (opacity: 0.4)       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  FEATURES — 3 sütun grid                                       │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │ 🎯 Akıllı  │ │ ⚡ Hızlı   │ │ 🌍 İki Dil │                │
│  │ Dönüşüm    │ │ İşleme     │ │ Destek     │                │
│  │            │ │            │ │            │                │
│  │ Her format │ │ 30 saniye  │ │ TR + EN    │                │
│  │ için özel  │ │ içinde     │ │ otomatik   │                │
│  │ ton + stil │ │ sonuç      │ │ içerik     │                │
│  └────────────┘ └────────────┘ └────────────┘                │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│  HOW IT WORKS — 3 adımlı yatay akış                           │
│  [1. Yükle] ──→ [2. Seç] ──→ [3. Al]                         │
│  Animated line connecting steps                                │
├──────────────────────────────────────────────────────────────┤
│  PRICING — Tablo (detay Bölüm 7'de)                           │
├──────────────────────────────────────────────────────────────┤
│  FAQ — Accordion (glassmorphism kartlar)                       │
├──────────────────────────────────────────────────────────────┤
│  CTA — Son çağrı                                              │
│  "İlk 3 dönüşüm ücretsiz. Kredi kartı gerekmez."            │
│  [Hemen Başla →]                                               │
├──────────────────────────────────────────────────────────────┤
│  FOOTER — Minimal, 3 sütun + dil seçici                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. FİYATLANDIRMA & ÖDEME SİSTEMİ

### 7.1 Plan Detayları

| Özellik | Free | Starter ($19/ay) | Pro ($49/ay) |
|---------|------|-------------------|--------------|
| Aylık dönüşüm | 3 | 50 | Sınırsız |
| Çıktı formatları | 3 (LinkedIn, Twitter, Özet) | Tümü (6 format) | Tümü (6 format) |
| Ses yükleme (Whisper) | ❌ | ✅ (10 dk/dosya) | ✅ (60 dk/dosya) |
| YouTube transkript | ✅ (5 dk video) | ✅ (30 dk video) | ✅ (120 dk video) |
| Ton seçenekleri | Sadece Professional | Tümü (5 ton) | Tümü + Özel prompt |
| Dönüşüm geçmişi | 7 gün | 90 gün | Sınırsız |
| Hazır şablonlar | Temel | Tümü | Tümü + Özel oluştur |
| Öncelikli işleme | ❌ | ❌ | ✅ (kuyruk önceliği) |
| API erişimi | ❌ | ❌ | ✅ |
| Yıllık indirim | – | $15.20/ay (%20↓) | $39.20/ay (%20↓) |

### 7.2 Lemon Squeezy Entegrasyonu

```typescript
// Plan yapılandırması — lib/payments/plans.ts
export const PLANS = {
  free: {
    slug: 'free',
    name: { tr: 'Ücretsiz', en: 'Free' },
    price: { monthly: 0, yearly: 0 },
    limits: {
      conversions_per_month: 3,
      max_audio_minutes: 0,
      max_video_minutes: 5,
      available_formats: ['linkedin', 'twitter_thread', 'blog_summary'],
      available_tones: ['professional'],
      history_days: 7,
      priority_queue: false,
      api_access: false,
      custom_prompts: false,
    }
  },
  starter: {
    slug: 'starter',
    name: { tr: 'Starter', en: 'Starter' },
    price: { monthly: 19, yearly: 182.40 },
    ls_variant_id: {
      monthly: 'LEMON_STARTER_MONTHLY_VARIANT_ID',
      yearly: 'LEMON_STARTER_YEARLY_VARIANT_ID',
    },
    limits: {
      conversions_per_month: 50,
      max_audio_minutes: 10,
      max_video_minutes: 30,
      available_formats: ['linkedin', 'twitter_thread', 'newsletter', 'shorts_script', 'carousel', 'blog_summary'],
      available_tones: ['professional', 'casual', 'humorous', 'inspirational', 'educational'],
      history_days: 90,
      priority_queue: false,
      api_access: false,
      custom_prompts: false,
    }
  },
  pro: {
    slug: 'pro',
    name: { tr: 'Pro', en: 'Pro' },
    price: { monthly: 49, yearly: 470.40 },
    ls_variant_id: {
      monthly: 'LEMON_PRO_MONTHLY_VARIANT_ID',
      yearly: 'LEMON_PRO_YEARLY_VARIANT_ID',
    },
    limits: {
      conversions_per_month: Infinity,
      max_audio_minutes: 60,
      max_video_minutes: 120,
      available_formats: ['linkedin', 'twitter_thread', 'newsletter', 'shorts_script', 'carousel', 'blog_summary'],
      available_tones: ['professional', 'casual', 'humorous', 'inspirational', 'educational'],
      history_days: Infinity,
      priority_queue: true,
      api_access: true,
      custom_prompts: true,
    }
  }
} as const;
```

### 7.3 Webhook İşleme Akışı

```
Lemon Squeezy → POST /api/webhooks/lemonsqueezy
  │
  ├── subscription_created → Supabase: subscriptions INSERT + usage UPDATE
  ├── subscription_updated → Supabase: subscriptions UPDATE (plan change)
  ├── subscription_cancelled → Supabase: status='cancelled', cancel_at=period_end
  ├── subscription_expired → Supabase: status='expired', plan_slug='free'
  ├── subscription_resumed → Supabase: status='active'
  ├── subscription_payment_success → Supabase: usage RESET for new period
  └── subscription_payment_failed → Supabase: status='past_due'
```

### 7.4 Kullanım Limiti Kontrolü

```typescript
// lib/usage.ts
export async function checkUsageLimit(userId: string): Promise<{
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  plan: string;
}> {
  // 1. Kullanıcının aktif aboneliğini çek
  // 2. Bu ayki usage kaydını çek (yoksa oluştur)
  // 3. Plan limitlerini karşılaştır
  // 4. Sonuç dön
}

export async function incrementUsage(userId: string): Promise<void> {
  // Atomik artırma: UPDATE usage SET conversions_used = conversions_used + 1
  // WHERE user_id = $1 AND period_start = $2
}
```

---

## 8. AI DÖNÜŞÜM MOTORU

### 8.1 Dönüşüm Pipeline'ı

```
[Kaynak Girdi]
      │
      ├── Blog URL → fetch + HTML-to-text (cheerio/mozilla-readability)
      ├── Blog Metin → doğrudan kullan
      ├── YouTube → yt-dlp veya youtube-transcript-api ile transkript
      ├── Ses Dosyası → OpenAI Whisper API ile transkript
      └── PDF → pdf-parse ile metin çıkarma
      │
      ▼
[Kaynak Metin] (temizlenmiş, normalize edilmiş)
      │
      ▼
[Dönüşüm İsteği]
  ├── Seçilen formatlar (linkedin, twitter, ...)
  ├── Seçilen ton (professional, casual, ...)
  ├── Hedef dil (tr / en)
  └── Özel prompt (varsa, Pro plan)
      │
      ▼
[BullMQ Job] → Redis Queue
      │
      ▼
[Worker] → Her format için OpenAI GPT-4o çağrısı
  │
  ├── Format-spesifik system prompt (lib/ai/prompts/*.ts)
  ├── Kaynak metin (user message olarak)
  ├── Ton ve dil parametreleri
  │
  ├── Paralel işleme: Promise.allSettled([...formatlar])
  │
  └── Sonuçlar → Supabase outputs tablosuna kaydet
      │
      ▼
[Realtime] → Supabase Realtime ile frontend'e bildirim
```

### 8.2 Prompt Şablonu Örneği (LinkedIn)

```typescript
// lib/ai/prompts/linkedin.ts
export function getLinkedInPrompt(language: 'tr' | 'en', tone: string): string {
  const toneMap = {
    professional: language === 'tr' ? 'profesyonel ve bilgilendirici' : 'professional and informative',
    casual: language === 'tr' ? 'samimi ve sohbet havasında' : 'casual and conversational',
    // ...diğer tonlar
  };

  return `You are an expert LinkedIn content creator.

TASK: Transform the provided source content into a compelling LinkedIn post.

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneMap[tone]}

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Start with a strong hook (first 2 lines visible before "see more")
- Use line breaks for readability (short paragraphs)
- Include 3-5 relevant hashtags at the end
- Add a clear call-to-action
- Keep between 150-300 words
- Use emojis sparingly (max 3-4)
- NO markdown formatting — plain text only
- Make it feel authentic, not AI-generated

OUTPUT FORMAT: Return ONLY the LinkedIn post text, nothing else.`;
}
```

### 8.3 YouTube Transkript Çekme

```typescript
// lib/youtube.ts
// İki yöntem:
// 1. youtube-transcript paketini kullan (öncelikli, hızlı)
// 2. Başarısız olursa → yt-dlp ile subtitle çek (Docker'da yüklü)

export async function getYouTubeTranscript(url: string, preferredLang: 'tr' | 'en'): Promise<{
  text: string;
  title: string;
  duration: number; // saniye
  language: string;
}> {
  // 1. Video ID çıkar
  // 2. youtube-transcript ile transkript dene
  // 3. Tercih edilen dilde yoksa, mevcut dilleri dene
  // 4. Başarısız olursa yt-dlp fallback
  // 5. Temizlenmiş metni dön
}
```

---

## 9. ÇOK DİLLİLİK (i18n)

### 9.1 Yapılandırma

```typescript
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // ...diğer yapılandırmalar
});

// i18n/config.ts
export const locales = ['tr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

// URL yapısı:
// contentforge.com/tr/dashboard  (Türkçe)
// contentforge.com/en/dashboard  (İngilizce)
// contentforge.com → /tr'ye yönlendir (varsayılan)
```

### 9.2 Çeviri Dosyası Yapısı

```json
// public/locales/tr/common.json
{
  "nav": {
    "features": "Özellikler",
    "pricing": "Fiyatlandırma",
    "login": "Giriş Yap",
    "signup": "Ücretsiz Başla",
    "dashboard": "Panel"
  },
  "hero": {
    "title_line1": "Bir İçerik.",
    "title_line2": "Her Platform.",
    "subtitle": "Blog, video veya podcast'inizi saniyeler içinde tüm platformlara dönüştürün.",
    "cta_primary": "Ücretsiz Dene",
    "cta_secondary": "Demo İzle"
  },
  "repurpose": {
    "source_label": "Kaynak İçerik",
    "source_blog_url": "Blog URL'si",
    "source_blog_text": "Metin Yapıştır",
    "source_youtube": "YouTube Linki",
    "source_audio": "Ses Dosyası Yükle",
    "source_pdf": "PDF Yükle",
    "formats_label": "Çıktı Formatları",
    "format_linkedin": "LinkedIn Post",
    "format_twitter": "Twitter Thread",
    "format_newsletter": "Newsletter",
    "format_shorts": "Shorts Script",
    "format_carousel": "Carousel Plan",
    "format_summary": "Blog Özeti",
    "tone_label": "Ton",
    "tone_professional": "Profesyonel",
    "tone_casual": "Samimi",
    "tone_humorous": "Eğlenceli",
    "tone_inspirational": "İlham Verici",
    "tone_educational": "Eğitici",
    "generate_btn": "Dönüştür",
    "generating": "İçerik oluşturuluyor...",
    "copy": "Kopyala",
    "copied": "Kopyalandı!",
    "edit": "Düzenle",
    "regenerate": "Yeniden Oluştur"
  },
  "pricing": {
    "title": "Basit ve Şeffaf Fiyatlandırma",
    "subtitle": "İhtiyacınıza uygun planı seçin. İstediğiniz zaman değiştirin.",
    "monthly": "Aylık",
    "yearly": "Yıllık",
    "yearly_save": "%20 tasarruf",
    "free_name": "Ücretsiz",
    "starter_name": "Starter",
    "pro_name": "Pro",
    "per_month": "/ay",
    "current_plan": "Mevcut Plan",
    "upgrade": "Yükselt",
    "start_free": "Ücretsiz Başla"
  },
  "usage": {
    "title": "Kullanım",
    "used_of": "kullanıldı",
    "remaining": "kalan",
    "unlimited": "Sınırsız",
    "limit_reached": "Aylık limitinize ulaştınız",
    "upgrade_prompt": "Daha fazla dönüşüm için planınızı yükseltin."
  },
  "common": {
    "loading": "Yükleniyor...",
    "error": "Bir hata oluştu",
    "retry": "Tekrar Dene",
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil",
    "confirm": "Onayla",
    "back": "Geri",
    "next": "İleri",
    "close": "Kapat"
  }
}
```

```json
// public/locales/en/common.json
{
  "nav": {
    "features": "Features",
    "pricing": "Pricing",
    "login": "Log In",
    "signup": "Start Free",
    "dashboard": "Dashboard"
  },
  "hero": {
    "title_line1": "One Content.",
    "title_line2": "Every Platform.",
    "subtitle": "Transform your blog, video, or podcast into platform-ready content in seconds.",
    "cta_primary": "Try Free",
    "cta_secondary": "Watch Demo"
  }
}
```

---

## 10. API ROUTE DETAYLARI

### 10.1 Route Tablosu

| Yöntem | Yol | Açıklama | Auth |
|--------|-----|----------|------|
| POST | `/api/repurpose` | Yeni dönüşüm başlat | ✅ |
| GET | `/api/repurpose/[id]` | Dönüşüm durumu + sonuçlar | ✅ |
| POST | `/api/transcribe` | Ses dosyası → metin | ✅ |
| POST | `/api/youtube` | YouTube URL → transkript | ✅ |
| GET | `/api/usage` | Kullanım bilgisi | ✅ |
| POST | `/api/webhooks/lemonsqueezy` | Ödeme webhook'ları | HMAC |

### 10.2 Ana Dönüşüm Akışı

```typescript
// POST /api/repurpose
// Request Body:
{
  source_type: 'blog_url' | 'blog_text' | 'youtube' | 'audio' | 'pdf',
  source_url?: string,       // blog_url veya youtube
  source_text?: string,      // blog_text
  source_file?: string,      // audio/pdf — Supabase Storage yolu
  formats: string[],         // ['linkedin', 'twitter_thread', ...]
  tone: string,              // 'professional' | 'casual' | ...
  language: 'tr' | 'en',
  custom_prompt?: string     // Sadece Pro plan
}

// Response (202 Accepted):
{
  conversion_id: string,
  status: 'processing',
  estimated_seconds: number
}

// Ardından client, Supabase Realtime ile conversion durumunu dinler
// VEYA polling: GET /api/repurpose/{conversion_id}
```

---

## 11. DOCKER YAPILANDIRMASI

### 11.1 docker-compose.yml

```yaml
version: '3.9'

services:
  # ── Next.js Uygulaması ──
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: contentforge-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LEMONSQUEEZY_API_KEY=${LEMONSQUEEZY_API_KEY}
      - LEMONSQUEEZY_WEBHOOK_SECRET=${LEMONSQUEEZY_WEBHOOK_SECRET}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - contentforge

  # ── BullMQ Worker ──
  worker:
    build:
      context: .
      dockerfile: docker/Dockerfile.worker
    container_name: contentforge-worker
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    networks:
      - contentforge

  # ── Redis (BullMQ kuyruk) ──
  redis:
    image: redis:7-alpine
    container_name: contentforge-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - contentforge

  # ── Caddy Reverse Proxy ──
  caddy:
    image: caddy:2-alpine
    container_name: contentforge-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/Caddyfile:/etc/caddy/Caddyfile
      - caddy-data:/data
      - caddy-config:/config
    depends_on:
      - app
    networks:
      - contentforge

  # ── Uptime Kuma (Monitoring) ──
  uptime-kuma:
    image: louislam/uptime-kuma:1
    container_name: contentforge-monitor
    restart: unless-stopped
    volumes:
      - uptime-kuma-data:/app/data
    ports:
      - "3001:3001"
    networks:
      - contentforge

volumes:
  redis-data:
  caddy-data:
  caddy-config:
  uptime-kuma-data:

networks:
  contentforge:
    driver: bridge
```

### 11.2 Dockerfile (Next.js)

```dockerfile
# docker/Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

### 11.3 Caddyfile

```
contentforge.app {
  reverse_proxy app:3000
  encode gzip

  header {
    X-Frame-Options DENY
    X-Content-Type-Options nosniff
    Referrer-Policy strict-origin-when-cross-origin
    Strict-Transport-Security "max-age=31536000; includeSubDomains"
  }
}

monitor.contentforge.app {
  reverse_proxy uptime-kuma:3001
}
```

---

## 12. ENVIRONMENT DEĞİŞKENLERİ

```bash
# .env.example

# ── Supabase ──
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ── OpenAI ──
OPENAI_API_KEY=sk-...

# ── Lemon Squeezy ──
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_STORE_ID=...
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_STARTER_MONTHLY=https://xxx.lemonsqueezy.com/checkout/buy/...
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_STARTER_YEARLY=https://xxx.lemonsqueezy.com/checkout/buy/...
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_PRO_MONTHLY=https://xxx.lemonsqueezy.com/checkout/buy/...
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_PRO_YEARLY=https://xxx.lemonsqueezy.com/checkout/buy/...

# ── Redis ──
REDIS_URL=redis://localhost:6379

# ── App ──
NEXT_PUBLIC_APP_URL=https://contentforge.app
NEXT_PUBLIC_DEFAULT_LOCALE=tr
```

---

## 13. GÜVENLİK

### Kontrol Listesi

- [x] Supabase RLS aktif — tüm tablolarda kullanıcı izolasyonu
- [x] Lemon Squeezy webhook HMAC doğrulama
- [x] Rate limiting — Upstash Redis ile IP + user bazlı
- [x] Dosya yükleme validasyonu — tip, boyut, magic bytes kontrolü
- [x] API route'larda auth middleware — her korumalı endpoint'te
- [x] CORS yapılandırması — sadece kendi domain'i
- [x] Environment değişkenleri — asla client'a sızdırma
- [x] CSP (Content Security Policy) — Caddy header'larında
- [x] Input sanitization — Zod schema validation
- [x] SQL injection koruması — Supabase parameterized queries

---

## 14. PERFORMANS OPTİMİZASYONU

- Next.js ISR — Landing page, pricing sayfası statik oluştur
- Edge middleware — Auth kontrolü edge'de
- Image optimization — next/image + WebP
- Font optimization — next/font + self-hosted
- Code splitting — dynamic imports (dashboard bileşenleri)
- Redis caching — Sık kullanılan sorgu sonuçları
- Streaming — Dönüşüm sonuçlarını Supabase Realtime ile aktar
- Bundle analizi — @next/bundle-analyzer ile düzenli kontrol

---

## 15. UYGULAMA ADIMLARI (Claude Code için Sıralı Görevler)

### Faz 1: Temel Altyapı (Gün 1-2)
```
1. Next.js 14 projesi oluştur (App Router, TypeScript)
2. Tailwind CSS 4 yapılandır + CSS variables (Bölüm 6.2)
3. Fontları kur (Satoshi, DM Sans, JetBrains Mono)
4. i18n yapılandırması (next-intl, TR/EN)
5. Supabase client kurulumu (browser + server + admin)
6. Temel dosya yapısını oluştur
7. ESLint + Prettier yapılandırması
```

### Faz 2: Veritabanı & Auth (Gün 2-3)
```
8. Supabase migration dosyalarını oluştur (Bölüm 5)
9. RLS politikalarını yaz
10. Trigger'ları oluştur (yeni kullanıcı → profil + subscription + usage)
11. Supabase Auth yapılandır (Email + Google OAuth)
12. Auth sayfalarını oluştur (login, register, callback)
13. Auth middleware yaz
14. Supabase type generation
```

### Faz 3: UI Bileşenleri (Gün 3-5)
```
15. UI primitiflerini oluştur (Button, Card, Input, Modal, Badge, vb.)
16. Layout bileşenlerini yaz (Navbar, Sidebar, Footer, LocaleSwitcher)
17. Landing page bölümlerini oluştur (Hero, Features, HowItWorks, Pricing, FAQ, CTA)
18. Framer Motion animasyonlarını ekle
19. Dashboard layout + sidebar navigasyon
20. Responsive tasarımı tamamla
```

### Faz 4: Dönüşüm Motoru (Gün 5-7)
```
21. OpenAI client yapılandır
22. Whisper transkript servisini yaz
23. YouTube transkript çekme servisini yaz
24. Blog URL → metin çıkarma servisi
25. AI prompt şablonlarını oluştur (6 format × 5 ton × 2 dil)
26. BullMQ kuyruk sistemi kur
27. Worker process'i yaz
28. Dönüşüm API route'larını oluştur
29. Supabase Realtime entegrasyonu
```

### Faz 5: Ödeme Sistemi (Gün 7-8)
```
30. Lemon Squeezy ürün/variant'ları oluştur
31. Checkout overlay entegrasyonu
32. Webhook handler yaz (subscription events)
33. Kullanım limiti kontrol servisi
34. Billing sayfası (plan yönetimi)
35. Usage bar + limit uyarıları
```

### Faz 6: Dashboard & Dönüşüm UI (Gün 8-10)
```
36. Dashboard ana sayfası (istatistikler, son dönüşümler)
37. Yeni dönüşüm sayfası (InputSelector, FormatPicker, ToneSelector)
38. Dönüşüm sonuç sayfası (ResultCard, CopyButton, Editor)
39. Dönüşüm geçmişi sayfası
40. Şablonlar sayfası
41. Ayarlar sayfaları (profil, billing, API keys)
```

### Faz 7: Docker & Deploy (Gün 10-11)
```
42. Dockerfile'ları oluştur
43. docker-compose.yml yaz
44. Caddyfile yapılandır
45. GitHub Actions CI/CD pipeline
46. Ubuntu server kurulumu + deploy
47. Uptime Kuma monitoring
48. SSL sertifikası (Caddy otomatik)
```

### Faz 8: Test & Polish (Gün 11-12)
```
49. Edge case'leri test et (limit aşımı, hatalı URL, büyük dosya)
50. Error handling ve kullanıcı bildirimleri
51. Loading state'leri ve skeleton UI
52. SEO meta tags + Open Graph
53. Performance audit (Lighthouse)
54. Son animasyon ve geçiş detayları
```

---

## 16. NOTLAR & KARARLAR

### Neden Supabase (Cloud) + Docker (Self-hosted)?
- **Supabase Cloud:** Veritabanı yönetimi, auth, realtime, storage — yönetimi basit, güvenilir
- **Docker (ev sunucusu):** Next.js app + Redis + Worker — maliyet avantajı, tam kontrol
- Bu hibrit yaklaşım hem maliyet hem güvenilirlik açısından optimal

### Neden Lemon Squeezy?
- Merchant of Record (MoR) — vergi, fatura, iade işlemlerini Lemon Squeezy halleder
- Türkiye'den satış için ek vergi yükü yok
- Checkout overlay — kullanıcı sayfadan ayrılmadan ödeme yapabilir
- Webhook'lar güvenilir ve iyi dokümante edilmiş

### Neden BullMQ?
- AI dönüşümleri 10-60 saniye sürebilir → HTTP timeout riski
- Kuyruk sistemi: isteği al → kuyruğa koy → worker işlesin → realtime bildir
- Retry mekanizması: API hatalarında otomatik yeniden deneme
- Pro plan öncelik kuyruğu: `priority: isPro ? 1 : 10`

### Neden next-intl?
- App Router ile tam uyumlu
- Server Components'te çeviri desteği
- URL tabanlı locale (`/tr/`, `/en/`)
- SEO dostu (her dil için ayrı sayfa)

---

*Bu doküman, Claude Code ile VS Code üzerinden adım adım uygulanmak üzere hazırlanmıştır. Her faz bağımsız olarak uygulanabilir ve test edilebilir.*
