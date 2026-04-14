'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';

interface CurrentPlanCardProps {
  planName: string;
  planSlug: string;
  status: string;
  billingCycle: string | null;
  currentPeriodEnd: string | null;
  cancelAt: string | null;
  usageUsed: number;
  usageLimit: number;
  manageUrl?: string | null;
  onCancel: () => Promise<void>;
}

function statusVariant(status: string): 'success' | 'warning' | 'error' | 'default' {
  switch (status) {
    case 'active': return 'success';
    case 'trialing': return 'info' as 'default';
    case 'past_due': return 'warning';
    case 'cancelled':
    case 'expired': return 'error';
    default: return 'default';
  }
}

export function CurrentPlanCard({
  planName,
  planSlug,
  status,
  billingCycle,
  currentPeriodEnd,
  cancelAt,
  usageUsed,
  usageLimit,
  manageUrl,
  onCancel,
}: CurrentPlanCardProps) {
  const t = useTranslations('billing');
  const [cancelling, setCancelling] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const percentage = usageLimit > 0 ? Math.min(100, (usageUsed / usageLimit) * 100) : 0;
  const isFree = planSlug === 'free';
  const endDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;
  const cancelDate = cancelAt
    ? new Date(cancelAt).toLocaleDateString('tr-TR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  async function handleCancel() {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setCancelling(true);
    try {
      await onCancel();
    } finally {
      setCancelling(false);
      setConfirmed(false);
    }
  }

  return (
    <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-[var(--text-tertiary)] font-medium uppercase tracking-wider mb-1">
            {t('current_plan_label')}
          </p>
          <h2
            className="text-2xl font-black text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {planName}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={statusVariant(status)}>{t(`status_${status}`)}</Badge>
            {billingCycle && (
              <span className="text-xs text-[var(--text-tertiary)]">
                {t(`billing_${billingCycle}`)}
              </span>
            )}
          </div>
        </div>

        {manageUrl && (
          <a
            href={manageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('manage_payment')}
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Usage */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-[var(--text-secondary)]">{t('conversions_used')}</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {usageUsed} / {usageLimit === Number.MAX_SAFE_INTEGER ? '∞' : usageLimit}
          </span>
        </div>
        <Progress value={usageUsed} max={usageLimit} size="md" />
        {percentage >= 80 && (
          <p className="text-xs text-[var(--warning)] mt-1.5">
            {t('usage_warning', { percentage: Math.round(percentage) })}
          </p>
        )}
      </div>

      {/* Renewal / cancellation info */}
      {endDate && !cancelDate && (
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          {t('renews_on', { date: endDate })}
        </p>
      )}
      {cancelDate && (
        <p className="text-xs text-[var(--warning)] mb-4">
          {t('cancels_on', { date: cancelDate })}
        </p>
      )}

      {/* Cancel button — only for active non-free plans */}
      {!isFree && status === 'active' && !cancelAt && (
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <Button
            variant="danger"
            size="sm"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <Loader2 size={14} className="animate-spin" />
            ) : confirmed ? (
              t('confirm_cancel')
            ) : (
              t('cancel_subscription')
            )}
          </Button>
          {confirmed && (
            <button
              onClick={() => setConfirmed(false)}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            >
              {t('nevermind')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
