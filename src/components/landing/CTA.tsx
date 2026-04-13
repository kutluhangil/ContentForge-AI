'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  const t = useTranslations('cta');
  const locale = useLocale();

  return (
    <section className="py-24 px-6 border-t border-[var(--border-subtle)]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-[var(--radius-xl)] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(228,228,231,0.04) 0%, transparent 70%)',
            }}
          />

          <h2
            className="text-[clamp(1.75rem,5vw,3rem)] font-black tracking-[-0.03em] text-[var(--text-primary)] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">{t('subtitle')}</p>

          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] font-semibold px-8 py-3.5 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_32px_rgba(255,255,255,0.12)] transition-all duration-[var(--duration-fast)] text-base"
          >
            {t('btn')}
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
