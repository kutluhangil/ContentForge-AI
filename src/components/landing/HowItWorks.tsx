'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Upload, Sliders, Download } from 'lucide-react';

const steps = [
  { icon: <Upload size={20} />, titleKey: 'step1_title', descKey: 'step1_desc', num: '01' },
  { icon: <Sliders size={20} />, titleKey: 'step2_title', descKey: 'step2_desc', num: '02' },
  { icon: <Download size={20} />, titleKey: 'step3_title', descKey: 'step3_desc', num: '03' },
];

export function HowItWorks() {
  const t = useTranslations('how_it_works');

  return (
    <section className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)] h-px bg-gradient-to-r from-[var(--border-subtle)] via-[var(--border-default)] to-[var(--border-subtle)]" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative w-16 h-16 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-secondary)] mb-5 z-10">
                {step.icon}
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] flex items-center justify-center text-[9px] font-mono text-[var(--text-tertiary)]">
                  {step.num}
                </span>
              </div>
              <h3
                className="text-base font-semibold text-[var(--text-primary)] mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t(step.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-[200px]">
                {t(step.descKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
