'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Target, Zap, Globe } from 'lucide-react';

const features = [
  { icon: <Target size={22} />, titleKey: 'smart_title', descKey: 'smart_desc' },
  { icon: <Zap size={22} />, titleKey: 'fast_title', descKey: 'fast_desc' },
  { icon: <Globe size={22} />, titleKey: 'bilingual_title', descKey: 'bilingual_desc' },
];

export function Features() {
  const t = useTranslations('features');

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">{t('subtitle')}</p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 transition-all duration-[var(--duration-normal)]"
            >
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] mb-5 group-hover:text-[var(--text-primary)] transition-colors">
                {feature.icon}
              </div>
              <h3
                className="text-lg font-semibold text-[var(--text-primary)] mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
