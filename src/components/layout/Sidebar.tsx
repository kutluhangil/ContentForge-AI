'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Repeat2,
  History,
  Bookmark,
  Settings,
  CreditCard,
  Zap,
} from 'lucide-react';

interface NavItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  labelKey: string;
}

export function Sidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const td = useTranslations('dashboard');
  const th = useTranslations('history');
  const tn = useTranslations('nav');

  const navItems: NavItem[] = [
    {
      key: 'dashboard',
      href: `/${locale}/dashboard`,
      icon: <LayoutDashboard size={18} />,
      labelKey: 'panel',
    },
    {
      key: 'repurpose',
      href: `/${locale}/repurpose`,
      icon: <Repeat2 size={18} />,
      labelKey: 'newConversion',
    },
    {
      key: 'history',
      href: `/${locale}/history`,
      icon: <History size={18} />,
      labelKey: 'history',
    },
    {
      key: 'templates',
      href: `/${locale}/templates`,
      icon: <Bookmark size={18} />,
      labelKey: 'templates',
    },
  ];

  const bottomItems: NavItem[] = [
    {
      key: 'settings',
      href: `/${locale}/settings`,
      icon: <Settings size={18} />,
      labelKey: 'settings',
    },
    {
      key: 'billing',
      href: `/${locale}/settings/billing`,
      icon: <CreditCard size={18} />,
      labelKey: 'billing',
    },
  ];

  const labels: Record<string, string> = {
    panel: 'Panel',
    newConversion: 'Yeni Dönüşüm',
    history: 'Geçmiş',
    templates: 'Şablonlar',
    settings: 'Ayarlar',
    billing: 'Fatura',
  };

  function NavLink({ item }: { item: NavItem }) {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)]',
          'text-sm font-medium transition-all duration-[var(--duration-fast)]',
          isActive
            ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
            : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
        )}
      >
        {item.icon}
        {labels[item.labelKey]}
      </Link>
    );
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] h-full">
      {/* Logo */}
      <div className="px-4 h-16 flex items-center border-b border-[var(--border-subtle)]">
        <Link
          href={`/${locale}/dashboard`}
          className="font-bold text-base text-[var(--text-primary)] tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ContentForge
        </Link>
      </div>

      {/* New Conversion CTA */}
      <div className="p-3">
        <Link href={`/${locale}/repurpose`}>
          <button className="w-full flex items-center justify-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors">
            <Zap size={15} />
            Yeni Dönüşüm
          </button>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink key={item.key} item={item} />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 py-3 border-t border-[var(--border-subtle)] flex flex-col gap-0.5">
        {bottomItems.map((item) => (
          <NavLink key={item.key} item={item} />
        ))}
      </div>
    </aside>
  );
}
