'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Button } from '../ui/Button';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--border-subtle)] backdrop-blur-[12px] bg-[rgba(10,10,11,0.8)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="font-display font-bold text-lg text-[var(--text-primary)] tracking-tight hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ContentForge
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}/#features`}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('features')}
          </Link>
          <Link
            href={`/${locale}/pricing`}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('pricing')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {isLoggedIn ? (
            <Link href={`/${locale}/dashboard`}>
              <Button size="sm">{t('dashboard')}</Button>
            </Link>
          ) : (
            <>
              <Link href={`/${locale}/login`}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={`/${locale}/register`}>
                <Button size="sm">{t('signup')}</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
