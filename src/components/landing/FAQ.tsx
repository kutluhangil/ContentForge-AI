'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqKeys = [
  { q: 'q1', a: 'a1' },
  { q: 'q2', a: 'a2' },
  { q: 'q3', a: 'a3' },
  { q: 'q4', a: 'a4' },
  { q: 'q5', a: 'a5' },
];

export function FAQ() {
  const t = useTranslations('faq');
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2
            className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--text-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
        </motion.div>

        <div className="flex flex-col gap-2">
          {faqKeys.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-left hover:border-[var(--border-hover)] transition-colors duration-[var(--duration-fast)] group"
              >
                <span className="text-sm font-medium text-[var(--text-primary)]">{t(item.q)}</span>
                <span className="shrink-0 text-[var(--text-tertiary)] group-hover:text-[var(--text-secondary)] transition-colors">
                  {openIdx === i ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 text-sm text-[var(--text-secondary)] leading-relaxed border border-t-0 border-[var(--border-subtle)] rounded-b-[var(--radius-lg)] bg-[var(--bg-secondary)]">
                      {t(item.a)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
