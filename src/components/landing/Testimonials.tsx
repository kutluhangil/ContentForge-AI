'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const testimonialKeys = ['t1', 't2', 't3'] as const;

export function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5"
        >
          {testimonialKeys.map((key) => (
            <motion.div
              key={key}
              variants={staggerItem}
              className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] backdrop-blur-[20px] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5 transition-all duration-[250ms]"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-[var(--warning)] text-[var(--warning)]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                &ldquo;{t(`${key}.quote`)}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-xs font-bold text-[var(--text-primary)]">
                  {t(`${key}.name`).split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{t(`${key}.name`)}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{t(`${key}.role`)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
