'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, CheckCircle2, XCircle, Loader2, Play, FileText, Link2, Mic, FileIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

interface Output {
  format: string;
}

interface Conversion {
  id: string;
  source_type: string;
  title: string | null;
  status: string;
  created_at: string;
  outputs: Output[];
}

interface RecentConversionsProps {
  conversions: Conversion[];
}

const sourceIcons: Record<string, React.ElementType> = {
  blog_url: Link2,
  blog_text: FileText,
  youtube: Play,
  audio: Mic,
  pdf: FileIcon,
};

const statusConfig: Record<string, { variant: 'success' | 'warning' | 'error' | 'default'; icon: React.ElementType; label: string }> = {
  completed: { variant: 'success', icon: CheckCircle2, label: 'Tamamlandı' },
  processing: { variant: 'default', icon: Loader2, label: 'İşleniyor' },
  pending: { variant: 'default', icon: Clock, label: 'Bekliyor' },
  failed: { variant: 'error', icon: XCircle, label: 'Başarısız' },
};

const formatLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter_thread: 'Twitter',
  newsletter: 'Newsletter',
  shorts_script: 'Shorts',
  carousel: 'Carousel',
  blog_summary: 'Özet',
};

export function RecentConversions({ conversions }: RecentConversionsProps) {
  const locale = useLocale();

  if (conversions.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
        <p className="text-[var(--text-tertiary)] text-sm">Henüz dönüşüm yok.</p>
        <Link
          href={`/${locale}/repurpose`}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--text-primary)] font-medium hover:underline"
        >
          İlk dönüşümü başlat <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {conversions.map((c, i) => {
        const SourceIcon = sourceIcons[c.source_type] ?? FileText;
        const status = statusConfig[c.status] ?? statusConfig.pending;
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link
              href={`/${locale}/history?id=${c.id}`}
              className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] hover:border-[var(--border-hover)] transition-colors group"
            >
              <div className="p-1.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)]">
                <SourceIcon size={14} className="text-[var(--text-tertiary)]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {c.title ?? `${c.source_type.replace('_', ' ')} dönüşümü`}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {c.outputs.slice(0, 3).map((o) => (
                    <span key={o.format} className="text-xs text-[var(--text-tertiary)]">
                      {formatLabels[o.format] ?? o.format}
                    </span>
                  ))}
                  {c.outputs.length > 3 && (
                    <span className="text-xs text-[var(--text-tertiary)]">+{c.outputs.length - 3}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={status.variant}>
                  <StatusIcon
                    size={11}
                    className={c.status === 'processing' ? 'animate-spin' : ''}
                  />
                  {status.label}
                </Badge>
                <span className="text-xs text-[var(--text-tertiary)]">
                  {formatRelativeTime(c.created_at)}
                </span>
                <ArrowRight size={14} className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
