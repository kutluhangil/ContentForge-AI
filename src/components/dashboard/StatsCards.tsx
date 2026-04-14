'use client';

import { motion } from 'framer-motion';
import { Zap, BarChart2, CreditCard, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/Progress';

interface StatsCardsProps {
  totalConversions: number;
  monthConversions: number;
  plan: string;
  usageUsed: number;
  usageLimit: number;
}

const planLabel: Record<string, string> = {
  free: 'Ücretsiz',
  starter: 'Starter',
  pro: 'Pro',
};

export function StatsCards({
  totalConversions,
  monthConversions,
  plan,
  usageUsed,
  usageLimit,
}: StatsCardsProps) {
  const limitDisplay = usageLimit === Number.MAX_SAFE_INTEGER ? '∞' : String(usageLimit);
  const percentage = usageLimit > 0 && usageLimit !== Number.MAX_SAFE_INTEGER
    ? Math.min(100, (usageUsed / usageLimit) * 100)
    : 0;

  const cards = [
    {
      icon: TrendingUp,
      label: 'Toplam Dönüşüm',
      value: totalConversions.toLocaleString('tr-TR'),
      sub: 'tüm zamanlar',
    },
    {
      icon: Zap,
      label: 'Bu Ay',
      value: monthConversions.toLocaleString('tr-TR'),
      sub: 'aktif dönüşüm',
    },
    {
      icon: CreditCard,
      label: 'Plan',
      value: planLabel[plan] ?? plan,
      sub: plan === 'free' ? 'ücretsiz' : 'aktif',
    },
    {
      icon: BarChart2,
      label: 'Kullanım',
      value: `${usageUsed} / ${limitDisplay}`,
      sub: plan === 'pro' ? 'sınırsız' : `%${Math.round(percentage)} kullanıldı`,
      progress: plan !== 'pro' ? { value: usageUsed, max: usageLimit } : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--text-tertiary)] font-medium">{card.label}</span>
              <Icon size={15} className="text-[var(--text-tertiary)]" />
            </div>
            <p
              className="text-2xl font-black text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {card.value}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">{card.sub}</p>
            {card.progress && (
              <div className="mt-3">
                <Progress value={card.progress.value} max={card.progress.max} size="sm" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
