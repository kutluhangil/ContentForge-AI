'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Toggle } from '@/components/ui/Toggle';
import { PlanCard } from '@/components/billing/PlanCard';
import { CurrentPlanCard } from '@/components/billing/CurrentPlanCard';
import { PLANS } from '@/types/plans';
import type { PlanSlug } from '@/types/plans';

interface SubData {
  plan_slug: PlanSlug;
  status: string;
  billing_cycle: string | null;
  current_period_end: string | null;
  cancel_at: string | null;
  ls_subscription_id: string | null;
}

interface UsageData {
  conversions_used: number;
  conversions_limit: number;
}

const planFeatures: Record<PlanSlug, { label: string; included: boolean }[]> = {
  free: [
    { label: '3 dönüşüm/ay', included: true },
    { label: 'LinkedIn, Twitter, Özet', included: true },
    { label: 'YouTube (5 dk)', included: true },
    { label: 'Ses yükleme', included: false },
    { label: '7 gün geçmiş', included: true },
    { label: 'API erişimi', included: false },
  ],
  starter: [
    { label: '50 dönüşüm/ay', included: true },
    { label: 'Tüm formatlar (6)', included: true },
    { label: 'YouTube (30 dk)', included: true },
    { label: 'Ses yükleme (10 dk)', included: true },
    { label: '90 gün geçmiş', included: true },
    { label: 'API erişimi', included: false },
  ],
  pro: [
    { label: 'Sınırsız dönüşüm', included: true },
    { label: 'Tüm formatlar (6)', included: true },
    { label: 'YouTube (120 dk)', included: true },
    { label: 'Ses yükleme (60 dk)', included: true },
    { label: 'Sınırsız geçmiş', included: true },
    { label: 'API erişimi + Öncelikli', included: true },
  ],
};

export default function BillingPage() {
  const t = useTranslations('billing');
  const supabase = createClient();

  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [sub, setSub] = useState<SubData | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  }

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const periodStart = new Date();
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);
    const periodStr = periodStart.toISOString().split('T')[0];

    const [{ data: subData }, { data: usageData }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('plan_slug, status, billing_cycle, current_period_end, cancel_at, ls_subscription_id')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('usage')
        .select('conversions_used, conversions_limit')
        .eq('user_id', user.id)
        .eq('period_start', periodStr)
        .single(),
    ]);

    setSub(subData as SubData | null);
    setUsage(usageData);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleUpgrade(plan: PlanSlug, billing: 'monthly' | 'yearly') {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, billing }),
    });

    const data = await res.json() as { url?: string; error?: string };

    if (!res.ok || !data.url) {
      showToast('error', data.error ?? t('checkout_error'));
      return;
    }

    window.location.href = data.url;
  }

  async function handleCancel() {
    const res = await fetch('/api/subscription/cancel', { method: 'POST' });
    const data = await res.json() as { error?: string };

    if (!res.ok) {
      showToast('error', data.error ?? t('cancel_error'));
      return;
    }

    showToast('success', t('cancel_success'));
    await loadData();
  }

  const currentPlan = (sub?.plan_slug ?? 'free') as PlanSlug;
  const planConfig = PLANS[currentPlan];
  const usageLimit =
    planConfig.limits.conversions_per_month === Infinity
      ? Number.MAX_SAFE_INTEGER
      : planConfig.limits.conversions_per_month;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-[var(--radius-lg)] text-sm font-medium shadow-lg ${
            toast.type === 'success'
              ? 'bg-[var(--success)] text-white'
              : 'bg-[var(--error)] text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
            <CreditCard size={20} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-[var(--text-primary)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h1>
            <p className="text-sm text-[var(--text-tertiary)]">{t('subtitle')}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 skeleton rounded-[var(--radius-xl)]" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Plan */}
            <CurrentPlanCard
              planName={planConfig.name.tr}
              planSlug={currentPlan}
              status={sub?.status ?? 'active'}
              billingCycle={sub?.billing_cycle ?? null}
              currentPeriodEnd={sub?.current_period_end ?? null}
              cancelAt={sub?.cancel_at ?? null}
              usageUsed={usage?.conversions_used ?? 0}
              usageLimit={usageLimit}
              onCancel={handleCancel}
            />

            {/* Upgrade Plans */}
            {currentPlan !== 'pro' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-[var(--text-primary)]">
                    {t('available_plans')}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={!yearlyBilling ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}>
                      {t('monthly')}
                    </span>
                    <Toggle checked={yearlyBilling} onChange={setYearlyBilling} />
                    <span className={yearlyBilling ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}>
                      {t('yearly')}
                      <span className="ml-1 text-xs text-[var(--success)]">{t('save_20')}</span>
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {(Object.keys(PLANS) as PlanSlug[]).map((slug) => (
                    <PlanCard
                      key={slug}
                      planSlug={slug}
                      name={PLANS[slug].name.tr}
                      price={PLANS[slug].price}
                      features={planFeatures[slug]}
                      isCurrentPlan={slug === currentPlan}
                      isFeatured={slug === 'starter'}
                      billing={yearlyBilling ? 'yearly' : 'monthly'}
                      onUpgrade={handleUpgrade}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
