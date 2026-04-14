'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Minus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { PlanSlug } from '@/types/plans';

interface Feature {
  label: string;
  included: boolean;
}

interface PlanCardProps {
  planSlug: PlanSlug;
  name: string;
  price: { monthly: number; yearly: number };
  features: Feature[];
  isCurrentPlan: boolean;
  isFeatured?: boolean;
  billing: 'monthly' | 'yearly';
  onUpgrade: (plan: PlanSlug, billing: 'monthly' | 'yearly') => Promise<void>;
}

export function PlanCard({
  planSlug,
  name,
  price,
  features,
  isCurrentPlan,
  isFeatured,
  billing,
  onUpgrade,
}: PlanCardProps) {
  const t = useTranslations('billing');
  const [loading, setLoading] = useState(false);

  const displayPrice = billing === 'yearly' ? price.yearly : price.monthly;

  async function handleClick() {
    if (isCurrentPlan || planSlug === 'free') return;
    setLoading(true);
    try {
      await onUpgrade(planSlug, billing);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative flex flex-col p-6 rounded-[var(--radius-xl)] border transition-all duration-[var(--duration-normal)] ${
        isFeatured
          ? 'border-[var(--border-hover)] bg-[var(--bg-secondary)] shadow-[var(--shadow-glow)]'
          : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
      } ${isCurrentPlan ? 'ring-2 ring-[var(--accent)]' : ''}`}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[var(--text-primary)] text-[var(--text-inverse)] text-xs font-semibold px-3 py-1 rounded-full">
            {t('popular')}
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-[var(--success)] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {t('current_plan')}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">{name}</h3>
        <div className="flex items-end gap-1">
          <span
            className="text-4xl font-black text-[var(--text-primary)] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ${displayPrice}
          </span>
          <span className="text-[var(--text-tertiary)] text-sm mb-1">/ {t('per_month')}</span>
        </div>
        {billing === 'yearly' && price.monthly > 0 && (
          <p className="text-xs text-[var(--success)] mt-1">
            {t('billed_yearly', { total: Math.round(price.yearly * 12) })}
          </p>
        )}
      </div>

      <ul className="flex flex-col gap-2.5 flex-1 mb-6">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-2.5 text-sm">
            {f.included ? (
              <Check size={15} className="text-[var(--success)] shrink-0" />
            ) : (
              <Minus size={15} className="text-[var(--text-tertiary)] shrink-0" />
            )}
            <span className={f.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}>
              {f.label}
            </span>
          </li>
        ))}
      </ul>

      {planSlug === 'free' ? (
        <Button variant="ghost" disabled className="w-full">
          {isCurrentPlan ? t('current_plan') : t('free_plan')}
        </Button>
      ) : (
        <Button
          variant={isFeatured ? 'primary' : 'outline'}
          disabled={isCurrentPlan || loading}
          onClick={handleClick}
          className="w-full"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isCurrentPlan ? (
            t('current_plan')
          ) : (
            t('upgrade_to', { plan: name })
          )}
        </Button>
      )}
    </div>
  );
}
