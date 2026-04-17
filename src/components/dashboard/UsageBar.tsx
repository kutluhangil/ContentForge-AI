'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';
import type { PlanSlug } from '@/types/plans';

interface UsageBarProps {
  used: number;
  limit: number;
  plan: PlanSlug;
}

export function UsageBar({ used, limit, plan }: UsageBarProps) {
  const locale = useLocale();
  const t = useTranslations('usage');

  const isUnlimited = !Number.isFinite(limit);
  const remaining = isUnlimited ? Infinity : Math.max(0, limit - used);

  return (
    <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-[var(--text-tertiary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{t('title')}</span>
        </div>
        {plan === 'free' && (
          <Link
            href={`/${locale}/settings/billing`}
            className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('upgrade_prompt')}
          </Link>
        )}
      </div>

      {isUnlimited ? (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {used}
          </span>
          <span className="text-sm text-[var(--text-tertiary)]">
            {t('used_of')} {t('unlimited')}
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {used}
            </span>
            <span className="text-sm text-[var(--text-tertiary)]">
              / {limit} {t('used_of')}
            </span>
          </div>
          <Progress value={used} max={limit} size="sm" />
          <p className="text-xs text-[var(--text-tertiary)] mt-2">
            {remaining} {t('remaining')}
          </p>
        </>
      )}
    </div>
  );
}
