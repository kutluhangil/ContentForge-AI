'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% -10%, rgba(228,228,231,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Grid lines */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border-default) 1px, transparent 1px), linear-gradient(90deg, var(--border-default) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-glass)] text-xs font-medium text-[var(--text-secondary)] backdrop-blur-sm">
            <Sparkles size={12} className="text-[var(--text-primary)]" />
            {t('badge')}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3rem,8vw,4.5rem)] leading-none font-black tracking-[-0.04em] text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title_line1')}
          <br />
          <span className="text-[var(--text-secondary)]">{t('title_line2')}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-[var(--text-secondary)] max-w-lg leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            href={`/${locale}/register`}
            className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] font-semibold px-6 py-3 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] transition-all duration-[var(--duration-fast)]"
          >
            {t('cta_primary')}
            <ArrowRight size={16} />
          </Link>
          <button className="inline-flex items-center gap-2 bg-transparent text-[var(--text-secondary)] font-medium px-6 py-3 rounded-[var(--radius-md)] border border-[var(--border-default)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all duration-[var(--duration-fast)]">
            <Play size={14} className="fill-current" />
            {t('cta_secondary')}
          </button>
        </motion.div>

        {/* Demo mockup */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl mt-4"
        >
          <div className="relative rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-[var(--shadow-lg)] overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[rgba(239,68,68,0.5)]" />
                <span className="w-3 h-3 rounded-full bg-[rgba(245,158,11,0.5)]" />
                <span className="w-3 h-3 rounded-full bg-[rgba(34,197,94,0.5)]" />
              </div>
              <div className="flex-1 flex justify-center">
                <span className="text-xs text-[var(--text-tertiary)] font-mono">contentforge.app/repurpose</span>
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-6 grid grid-cols-2 gap-4 min-h-[220px]">
              {/* Input side */}
              <div className="flex flex-col gap-3">
                <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Kaynak</div>
                <div className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-3 border border-[var(--border-subtle)]">
                  <div className="skeleton h-3 w-3/4 mb-2" />
                  <div className="skeleton h-3 w-full mb-2" />
                  <div className="skeleton h-3 w-5/6 mb-2" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-tertiary)]">LinkedIn</span>
                  <span className="text-xs px-2 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-tertiary)]">Twitter</span>
                </div>
              </div>

              {/* Output side */}
              <div className="flex flex-col gap-3">
                <div className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wide">Çıktı</div>
                <div className="space-y-2">
                  {['LinkedIn Post', 'Twitter Thread'].map((fmt, i) => (
                    <div key={fmt} className="bg-[var(--bg-tertiary)] rounded-[var(--radius-md)] p-3 border border-[var(--border-subtle)]">
                      <div className="text-xs text-[var(--text-secondary)] font-medium mb-2">{fmt}</div>
                      <div className="skeleton h-2.5 w-full mb-1.5" style={{ animationDelay: `${i * 0.2}s` }} />
                      <div className="skeleton h-2.5 w-4/5" style={{ animationDelay: `${i * 0.2 + 0.1}s` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
