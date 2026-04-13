'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { Toggle } from '../ui/Toggle';

const plans = [
  {
    key: 'free',
    nameKey: 'free_name',
    price: { monthly: 0, yearly: 0 },
    highlighted: false,
    features: [
      { label: '3 dönüşüm/ay', included: true },
      { label: '3 format (LinkedIn, Twitter, Özet)', included: true },
      { label: 'YouTube (5 dk video)', included: true },
      { label: 'Ses yükleme', included: false },
      { label: '7 gün geçmiş', included: true },
      { label: 'Temel şablonlar', included: true },
      { label: 'Öncelikli işleme', included: false },
      { label: 'API erişimi', included: false },
    ],
  },
  {
    key: 'starter',
    nameKey: 'starter_name',
    price: { monthly: 19, yearly: 15.2 },
    highlighted: true,
    features: [
      { label: '50 dönüşüm/ay', included: true },
      { label: '6 format (Tümü)', included: true },
      { label: 'YouTube (30 dk video)', included: true },
      { label: 'Ses yükleme (10 dk)', included: true },
      { label: '90 gün geçmiş', included: true },
      { label: 'Tüm şablonlar', included: true },
      { label: 'Öncelikli işleme', included: false },
      { label: 'API erişimi', included: false },
    ],
  },
  {
    key: 'pro',
    nameKey: 'pro_name',
    price: { monthly: 49, yearly: 39.2 },
    highlighted: false,
    features: [
      { label: 'Sınırsız dönüşüm', included: true },
      { label: '6 format (Tümü)', included: true },
      { label: 'YouTube (120 dk video)', included: true },
      { label: 'Ses yükleme (60 dk)', included: true },
      { label: 'Sınırsız geçmiş', included: true },
      { label: 'Tümü + Özel oluştur', included: true },
      { label: 'Öncelikli işleme', included: true },
      { label: 'API erişimi', included: true },
    ],
  },
];

export function Pricing() {
  const t = useTranslations('pricing');
  const locale = useLocale();
  const [yearly, setYearly] = useState(false);

  return (
    <section className="py-24 px-6 border-t border-[var(--border-subtle)]" id="pricing">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">{t('subtitle')}</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3">
            <span className={`text-sm ${!yearly ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
              {t('monthly')}
            </span>
            <Toggle checked={yearly} onChange={setYearly} />
            <span className={`text-sm ${yearly ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
              {t('yearly')}
              <span className="ml-1.5 text-xs text-[var(--success)]">{t('yearly_save')}</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`relative flex flex-col p-6 rounded-[var(--radius-xl)] border transition-all duration-[var(--duration-normal)] ${
                plan.highlighted
                  ? 'border-[var(--border-hover)] bg-[var(--bg-secondary)] shadow-[var(--shadow-glow)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[var(--text-primary)] text-[var(--text-inverse)] text-xs font-semibold px-3 py-1 rounded-full">
                    {t('popular')}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  {t(plan.nameKey)}
                </h3>
                <div className="flex items-end gap-1">
                  <span
                    className="text-4xl font-black text-[var(--text-primary)] tracking-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    ${yearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-[var(--text-tertiary)] text-sm mb-1">{t('per_month')}</span>
                </div>
                {yearly && plan.price.monthly > 0 && (
                  <p className="text-xs text-[var(--success)] mt-1">
                    Yıllık faturalama, aylık ${plan.price.monthly} yerine
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
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

              <Link
                href={plan.key === 'free' ? `/${locale}/register` : `/${locale}/register`}
                className={`w-full flex items-center justify-center py-2.5 rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-[var(--duration-fast)] ${
                  plan.highlighted
                    ? 'bg-[var(--text-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]'
                    : 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                {plan.key === 'free' ? t('start_free') : t('upgrade')}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
