'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, CreditCard } from 'lucide-react';
import { Button, type ButtonVariant } from '@/components/ui/Button';
import type { PlanSlug } from '@/types/plans';

interface CheckoutButtonProps {
  planSlug: PlanSlug;
  billing: 'monthly' | 'yearly';
  variant?: ButtonVariant;
  label?: string;
  className?: string;
}

export function CheckoutButton({ planSlug, billing, variant = 'primary', label, className }: CheckoutButtonProps) {
  const t = useTranslations('billing');
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planSlug, billing }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  if (planSlug === 'free') return null;

  return (
    <Button
      variant={variant}
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <><Loader2 size={16} className="animate-spin" /> {t('processing')}</>
      ) : (
        <><CreditCard size={16} /> {label || t('upgrade_cta')}</>
      )}
    </Button>
  );
}
