import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  const columns = [
    {
      title: t('product'),
      links: [
        { label: t('features'), href: `/${locale}/#features` },
        { label: t('pricing'), href: `/${locale}/pricing` },
        { label: t('changelog'), href: '#' },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: t('about'), href: '#' },
        { label: t('blog'), href: '#' },
        { label: t('contact'), href: '#' },
      ],
    },
    {
      title: t('legal'),
      links: [
        { label: t('terms'), href: '#' },
        { label: t('privacy'), href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <span
              className="font-bold text-lg text-[var(--text-primary)] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              ContentForge
            </span>
            <p className="mt-3 text-sm text-[var(--text-tertiary)] leading-relaxed max-w-[200px]">
              Bir içerik, her platform.
            </p>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-4">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} ContentForge. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
