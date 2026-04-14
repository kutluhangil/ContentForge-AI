'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, Search, ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Clock, Play, FileText, Link2, Mic, FileIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { ResultCard } from '@/components/repurpose/ResultCard';
import { Badge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';
import type { OutputFormat } from '@/types/repurpose';

const SOURCE_ICONS: Record<string, React.ElementType> = {
  blog_url: Link2, blog_text: FileText, youtube: Play, audio: Mic, pdf: FileIcon,
};

const FORMAT_OPTIONS = [
  { key: '', label: 'Tümü' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'twitter_thread', label: 'Twitter' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'shorts_script', label: 'Shorts' },
  { key: 'carousel', label: 'Carousel' },
  { key: 'blog_summary', label: 'Blog Özeti' },
];

interface Output {
  id: string;
  format: string;
  content: string;
  word_count: number | null;
  is_edited: boolean;
  edited_content: string | null;
}

interface Conversion {
  id: string;
  source_type: string;
  title: string | null;
  status: string;
  created_at: string;
  processing_time: number | null;
  error_message: string | null;
  outputs: Output[];
}

export default function HistoryPage() {
  const supabase = createClient();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formatFilter, setFormatFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from('conversions')
      .select('id, source_type, title, status, created_at, processing_time, error_message, outputs(id, format, content, word_count, is_edited, edited_content)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data } = await query;
    setConversions((data ?? []) as Conversion[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  async function handleSaveEdit(outputId: string, content: string) {
    await supabase.from('outputs').update({ is_edited: true, edited_content: content, content }).eq('id', outputId);
    setConversions((prev) =>
      prev.map((c) => ({
        ...c,
        outputs: c.outputs.map((o) => o.id === outputId ? { ...o, content, is_edited: true } : o),
      }))
    );
  }

  const filtered = conversions.filter((c) => {
    const matchSearch = !search ||
      (c.title?.toLowerCase().includes(search.toLowerCase())) ||
      c.source_type.includes(search.toLowerCase());
    const matchFormat = !formatFilter ||
      c.outputs.some((o) => o.format === formatFilter);
    return matchSearch && matchFormat;
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
          <History size={20} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Dönüşüm Geçmişi
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">{conversions.length} dönüşüm</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Dönüşüm ara..."
            className="w-full pl-8 pr-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-hover)]"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FORMAT_OPTIONS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFormatFilter(f.key)}
              className={`px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all ${
                formatFilter === f.key
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => <div key={i} className="h-16 skeleton rounded-[var(--radius-lg)]" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-tertiary)] text-sm">
          {search || formatFilter ? 'Sonuç bulunamadı.' : 'Henüz dönüşüm yok.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c, i) => {
            const SourceIcon = SOURCE_ICONS[c.source_type] ?? FileText;
            const isExpanded = expandedId === c.id;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                >
                  <div className="p-1.5 bg-[var(--bg-tertiary)] rounded-[var(--radius-sm)] shrink-0">
                    <SourceIcon size={14} className="text-[var(--text-tertiary)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {c.title ?? `${c.source_type.replace('_', ' ')} dönüşümü`}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                      {formatRelativeTime(c.created_at)} · {c.outputs.length} format
                      {c.processing_time && ` · ${c.processing_time}s`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={c.status === 'completed' ? 'success' : c.status === 'failed' ? 'error' : 'default'}>
                      {c.status === 'completed' && <CheckCircle2 size={11} />}
                      {c.status === 'failed' && <XCircle size={11} />}
                      {(c.status === 'pending' || c.status === 'processing') && <Loader2 size={11} className="animate-spin" />}
                      {c.status === 'completed' ? 'Tamamlandı' : c.status === 'failed' ? 'Başarısız' : 'İşleniyor'}
                    </Badge>
                    {isExpanded ? <ChevronUp size={14} className="text-[var(--text-tertiary)]" /> : <ChevronDown size={14} className="text-[var(--text-tertiary)]" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-3 border-t border-[var(--border-subtle)] pt-4">
                        {c.status === 'failed' && c.error_message && (
                          <p className="text-sm text-[var(--error)] px-3 py-2 bg-[rgba(239,68,68,0.08)] rounded-[var(--radius-md)]">
                            {c.error_message}
                          </p>
                        )}
                        {c.outputs.map((o) => (
                          <ResultCard
                            key={o.id}
                            outputId={o.id}
                            format={o.format as OutputFormat}
                            content={o.edited_content ?? o.content}
                            wordCount={o.word_count}
                            isEdited={o.is_edited}
                            onSaveEdit={handleSaveEdit}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
