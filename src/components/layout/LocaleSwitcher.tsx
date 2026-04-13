'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  }

  return (
    <div className="flex items-center gap-1 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-full)] p-0.5">
      <Globe size={13} className="text-[var(--text-tertiary)] ml-2" />
      {['tr', 'en'].map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1 rounded-[var(--radius-full)] text-xs font-medium transition-all duration-[var(--duration-fast)] ${
            locale === l
              ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
