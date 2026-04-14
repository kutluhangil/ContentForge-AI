'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutTemplate, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { PlanSlug } from '@/types/plans';

const FORMAT_COLORS: Record<string, string> = {
  linkedin: 'var(--linkedin)',
  twitter_thread: 'var(--twitter)',
  newsletter: 'var(--accent)',
  shorts_script: 'var(--youtube)',
  carousel: 'var(--instagram)',
  blog_summary: 'var(--accent)',
};

const FORMAT_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter_thread: 'Twitter',
  newsletter: 'Newsletter',
  shorts_script: 'Shorts',
  carousel: 'Carousel',
};

interface Template {
  id: string;
  name_tr: string;
  name_en: string;
  description_tr: string | null;
  description_en: string | null;
  format: string;
  tone: string;
  is_premium: boolean;
  sort_order: number;
}

export default function TemplatesPage() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] ?? 'tr';
  const t = useTranslations('templates');

  const [templates, setTemplates] = useState<Template[]>([]);
  const [plan, setPlan] = useState<PlanSlug>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: tmpl }, { data: sub }] = await Promise.all([
        supabase.from('templates').select('*').order('sort_order'),
        supabase.from('subscriptions').select('plan_slug').eq('user_id', user.id).single(),
      ]);

      setTemplates((tmpl ?? []) as Template[]);
      if (sub?.plan_slug) setPlan(sub.plan_slug as PlanSlug);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function handleUseTemplate(template: Template) {
    if (template.is_premium && plan === 'free') return;
    // Navigate to repurpose with template pre-filled via query
    router.push(`/${locale}/repurpose?template=${template.id}&format=${template.format}&tone=${template.tone}`);
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
          <LayoutTemplate size={20} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {t('title')}
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="h-36 skeleton rounded-[var(--radius-xl)]" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tmpl, i) => {
            const isLocked = tmpl.is_premium && plan === 'free';
            const color = FORMAT_COLORS[tmpl.format] ?? 'var(--accent)';

            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`relative flex flex-col p-4 bg-[var(--bg-secondary)] border rounded-[var(--radius-xl)] transition-all duration-[var(--duration-fast)] ${
                  isLocked
                    ? 'border-[var(--border-subtle)] opacity-60'
                    : 'border-[var(--border-subtle)] hover:border-[var(--border-hover)] cursor-pointer'
                }`}
                onClick={() => handleUseTemplate(tmpl)}
              >
                {tmpl.is_premium && (
                  <div className="absolute top-3 right-3">
                    {isLocked ? (
                      <Lock size={13} className="text-[var(--text-tertiary)]" />
                    ) : (
                      <span className="text-[10px] font-semibold text-[var(--success)] bg-[rgba(34,197,94,0.12)] px-1.5 py-0.5 rounded">PRO</span>
                    )}
                  </div>
                )}

                <div
                  className="w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center mb-3"
                  style={{ background: `${color}20` }}
                >
                  <span className="text-sm font-bold" style={{ color }}>
                    {FORMAT_LABELS[tmpl.format]?.charAt(0) ?? 'T'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {locale === 'tr' ? tmpl.name_tr : tmpl.name_en}
                </h3>
                <p className="text-xs text-[var(--text-tertiary)] flex-1">
                  {locale === 'tr' ? tmpl.description_tr : tmpl.description_en}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color, background: `${color}18` }}>
                    {FORMAT_LABELS[tmpl.format] ?? t('blog_summary')}
                  </span>
                  {!isLocked && (
                    <button className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                      <Zap size={11} />
                      {t('use')}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
