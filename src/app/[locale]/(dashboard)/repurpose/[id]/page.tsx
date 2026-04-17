'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Loader2, AlertCircle, FileText, Link2, Play, Mic, FileIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { ResultCard } from '@/components/repurpose/ResultCard';
import { Badge } from '@/components/ui/Badge';
import type { ConversionResult, SourceType, OutputFormat } from '@/types/repurpose';

const SOURCE_ICONS: Record<SourceType, React.ElementType> = {
  blog_url: Link2,
  blog_text: FileText,
  youtube: Play,
  audio: Mic,
  pdf: FileIcon,
};

const SOURCE_LABELS: Record<SourceType, string> = {
  blog_url: 'Blog URL',
  blog_text: 'Blog Text',
  youtube: 'YouTube',
  audio: 'Audio',
  pdf: 'PDF',
};

export default function ConversionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('repurpose');
  const tc = useTranslations('common');
  const supabase = createClient();

  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadConversion() {
      try {
        const res = await fetch(`/api/repurpose/${id}`);
        if (!res.ok) {
          setError(res.status === 404 ? 'Conversion not found' : 'Failed to load');
          return;
        }
        const data = await res.json() as ConversionResult;
        setConversion(data);

        // Poll if still processing
        if (data.status === 'pending' || data.status === 'processing') {
          const interval = setInterval(async () => {
            const poll = await fetch(`/api/repurpose/${id}`);
            if (!poll.ok) return;
            const updated = await poll.json() as ConversionResult;
            setConversion(updated);
            if (updated.status === 'completed' || updated.status === 'failed') {
              clearInterval(interval);
            }
          }, 3000);
          return () => clearInterval(interval);
        }
      } catch {
        setError(tc('error'));
      } finally {
        setLoading(false);
      }
    }
    if (id) loadConversion();
  }, [id, tc]);

  async function handleSaveEdit(outputId: string, content: string) {
    await supabase.from('outputs').update({ is_edited: true, edited_content: content, content }).eq('id', outputId);
    if (conversion) {
      setConversion({
        ...conversion,
        outputs: conversion.outputs.map((o) =>
          o.id === outputId ? { ...o, content, is_edited: true } : o,
        ),
      });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  if (error || !conversion) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-[var(--radius-lg)] text-sm text-[var(--error)]">
          <AlertCircle size={15} className="shrink-0" />
          {error || 'Not found'}
        </div>
      </div>
    );
  }

  const SourceIcon = SOURCE_ICONS[conversion.source_type] || FileText;
  const isProcessing = conversion.status === 'pending' || conversion.status === 'processing';
  const processingSeconds = conversion.processing_time ? Math.round(conversion.processing_time / 1000) : null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Back + Header */}
      <button
        onClick={() => router.push(`/${locale}/history`)}
        className="flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {tc('back')}
      </button>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
            <SourceIcon size={20} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
              {conversion.title || t('untitled')}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--text-tertiary)]">
                {SOURCE_LABELS[conversion.source_type]}
              </span>
              <span className="text-xs text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                {new Date(conversion.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
              {processingSeconds !== null && (
                <>
                  <span className="text-xs text-[var(--text-tertiary)]">·</span>
                  <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                    <Clock size={11} />
                    {processingSeconds}s
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Badge
          variant={
            conversion.status === 'completed' ? 'success' :
            conversion.status === 'failed' ? 'error' : 'default'
          }
        >
          {conversion.status === 'completed' && t('status_completed')}
          {conversion.status === 'failed' && t('status_failed')}
          {isProcessing && t('status_converting')}
        </Badge>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm text-[var(--text-secondary)] mb-6">
          <Loader2 size={15} className="animate-spin text-[var(--text-tertiary)]" />
          {t('status_converting')}
        </div>
      )}

      {/* Error */}
      {conversion.status === 'failed' && conversion.error_message && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-[var(--radius-lg)] text-sm text-[var(--error)] mb-6">
          <AlertCircle size={15} className="shrink-0" />
          {conversion.error_message}
        </div>
      )}

      {/* Outputs */}
      {conversion.outputs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
            {t('results_header')} — {conversion.outputs.length} {t('formats_label').toLowerCase()}
          </h2>
          {conversion.outputs.map((output) => (
            <ResultCard
              key={output.id}
              outputId={output.id}
              format={output.format as OutputFormat}
              content={output.edited_content ?? output.content}
              wordCount={output.word_count}
              isEdited={output.is_edited}
              onSaveEdit={handleSaveEdit}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
