-- ============================================================
-- 002_create_subscriptions.sql
-- Abonelik bilgileri (Lemon Squeezy ile senkron)
-- ============================================================

CREATE TABLE public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ls_subscription_id    TEXT UNIQUE,
  ls_customer_id        TEXT,
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

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_ls_id ON public.subscriptions(ls_subscription_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
