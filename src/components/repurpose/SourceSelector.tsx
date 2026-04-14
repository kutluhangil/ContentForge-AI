'use client';

import { useRef } from 'react';
import { Link2, FileText, Play, Mic, FileIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRepurposeStore } from '@/stores/repurpose-store';
import { Input } from '@/components/ui/Input';
import type { SourceType } from '@/types/repurpose';

interface SourceSelectorProps {
  onFileTranscribed?: (text: string) => void;
  transcribing?: boolean;
  setTranscribing?: (v: boolean) => void;
}

const SOURCE_ICONS: Record<SourceType, React.ElementType> = {
  blog_url: Link2,
  blog_text: FileText,
  youtube: Play,
  audio: Mic,
  pdf: FileIcon,
};

export function SourceSelector({ onFileTranscribed, transcribing, setTranscribing }: SourceSelectorProps) {
  const { sourceType, sourceUrl, sourceText, setSourceType, setSourceUrl, setSourceText, setSourceFile } = useRepurposeStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('repurpose');

  const sourceTypes: SourceType[] = ['blog_url', 'blog_text', 'youtube', 'audio', 'pdf'];

  const sourceLabelKeys: Record<SourceType, string> = {
    blog_url: 'source_blog_url',
    blog_text: 'source_blog_text',
    youtube: 'source_youtube',
    audio: 'source_audio',
    pdf: 'source_pdf',
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onFileTranscribed || !setTranscribing) return;

    setSourceFile(file);
    setTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json() as { text?: string; error?: string };

      if (data.text) {
        onFileTranscribed(data.text);
      }
    } finally {
      setTranscribing(false);
    }
  }

  const Icon = SOURCE_ICONS[sourceType];

  return (
    <div className="space-y-4">
      {/* Source type tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {sourceTypes.map((st) => {
          const TabIcon = SOURCE_ICONS[st];
          const active = sourceType === st;
          return (
            <button
              key={st}
              onClick={() => setSourceType(st)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-[var(--duration-fast)] ${
                active
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <TabIcon size={13} />
              {t(sourceLabelKeys[st] as Parameters<typeof t>[0])}
            </button>
          );
        })}
      </div>

      {/* Input area */}
      {(sourceType === 'blog_url' || sourceType === 'youtube') && (
        <Input
          label={t(sourceLabelKeys[sourceType] as Parameters<typeof t>[0])}
          placeholder={sourceType === 'blog_url' ? 'https://example.com/blog-post' : 'https://youtube.com/watch?v=...'}
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          leftIcon={<Icon size={15} />}
        />
      )}

      {sourceType === 'blog_text' && (
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            {t('source_blog_text')}
          </label>
          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t('source_label')}
            className="w-full px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-hover)] resize-none transition-colors"
          />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{sourceText.split(/\s+/).filter(Boolean).length} {t('word_count')}</p>
        </div>
      )}

      {(sourceType === 'audio' || sourceType === 'pdf') && (
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            {sourceType === 'audio' ? t('audio_label') : t('pdf_label')}
          </label>
          <div
            className="flex flex-col items-center justify-center gap-3 px-6 py-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)] cursor-pointer hover:border-[var(--border-hover)] transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {sourceType === 'audio' ? <Mic size={24} className="text-[var(--text-tertiary)]" /> : <FileIcon size={24} className="text-[var(--text-tertiary)]" />}
            <p className="text-sm text-[var(--text-secondary)]">
              {transcribing ? t('generating') : t('file_select')}
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={sourceType === 'audio' ? 'audio/*' : 'application/pdf'}
            onChange={handleFileChange}
          />
          {sourceText && (
            <p className="text-xs text-[var(--success)] mt-2">
              ✓ {t('transcript_ready')} — {sourceText.split(/\s+/).filter(Boolean).length} {t('word_count')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
