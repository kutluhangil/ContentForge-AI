'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { Toggle } from '../ui/Toggle';

const planDefs = [
  {
    key: 'free',
    nameKey: 'free_name',
    price: { monthly: 0, yearly: 0 },
    highlighted: false,
    featureKeys: [
      { key: 'f_free_1', included: true },
      { key: 'f_free_2', included: true },
      { key: 'f_free_3', included: true },
      { key: 'f_free_4', included: false },
      { key: 'f_free_5', included: true },
      { key: 'f_free_6', included: true },
      { key: 'f_free_7', included: false },
      { key: 'f_free_8', included: false },
    ],
  },
  {
    key: 'starter',
    nameKey: 'starter_name',
    price: { monthly: 19, yearly: 15.2 },
    highlighted: true,
    featureKeys: [
      { key: 'f_starter_1', included: true },
      { key: 'f_starter_2', included: true },
      { key: 'f_starter_3', included: true },
      { key: 'f_starter_4', included: true },
      { key: 'f_starter_5', included: true },
      { key: 'f_starter_6', included: true },
      { key: 'f_free_7', included: false },
      { key: 'f_free_8', included: false },
    ],
  },
  {
    key: 'pro',
    nameKey: 'pro_name',
    price: { monthly: 49, yearly: 39.2 },
    highlighted: false,
    featureKeys: [
      { key: 'f_pro_1', included: true },
      { key: 'f_starter_2', included: true },
      { key: 'f_pro_3', included: true },
      { key: 'f_pro_4', included: true },
      { key: 'f_pro_5', included: true },
      { key: 'f_pro_6', included: true },
      { key: 'f_free_7', included: true },
      { key: 'f_free_8', included: true },
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
          {planDefs.map((plan, i) => (
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
                  {t(plan.nameKey as Parameters<typeof t>[0])}
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
                    {t('yearly_billing_note', { monthly: plan.price.monthly })}
                  </p>
                )}
              </div>

              <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                {plan.featureKeys.map((f) => (
                  <li key={f.key} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <Check size={15} className="text-[var(--success)] shrink-0" />
                    ) : (
                      <Minus size={15} className="text-[var(--text-tertiary)] shrink-0" />
                    )}
                    <span className={f.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}>
                      {t(f.key as Parameters<typeof t>[0])}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/register`}
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
