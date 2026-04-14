'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

interface UsageAlertProps {
  used: number;
  limit: number;
  plan: string;
}

export function UsageAlert({ used, limit, plan }: UsageAlertProps) {
  const locale = useLocale();
  const t = useTranslations('usage');

  const percentage = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  if (percentage < 80) return null;

  const isExhausted = used >= limit;

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-[var(--radius-lg)] border text-sm ${
        isExhausted
          ? 'bg-[rgba(239,68,68,0.08)] border-[rgba(239,68,68,0.2)] text-[var(--error)]'
          : 'bg-[rgba(234,179,8,0.08)] border-[rgba(234,179,8,0.2)] text-[var(--warning)]'
      }`}
    >
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">
          {isExhausted ? t('limit_reached_title') : t('limit_warning_title')}
        </p>
        <p className="text-[var(--text-secondary)] mt-0.5">
          {isExhausted
            ? t('limit_reached_desc', { used, limit })
            : t('limit_warning_desc', { used, limit, percentage: Math.round(percentage) })}
        </p>
        {plan === 'free' && (
          <Link
            href={`/${locale}/settings/billing`}
            className="mt-2 inline-flex items-center text-xs font-semibold underline underline-offset-2 hover:no-underline"
          >
            {t('upgrade_cta')}
          </Link>
        )}
      </div>
    </div>
  );
}
