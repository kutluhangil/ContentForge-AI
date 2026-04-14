'use client';

import { useRef } from 'react';
import { Link2, FileText, Play, Mic, FileIcon } from 'lucide-react';
import { useRepurposeStore } from '@/stores/repurpose-store';
import { Input } from '@/components/ui/Input';
import type { SourceType } from '@/types/repurpose';

const sources: { type: SourceType; label: string; icon: React.ElementType; placeholder?: string }[] = [
  { type: 'blog_url', label: 'Blog URL', icon: Link2, placeholder: 'https://example.com/blog-post' },
  { type: 'blog_text', label: 'Blog Metin', icon: FileText },
  { type: 'youtube', label: 'YouTube', icon: Play, placeholder: 'https://youtube.com/watch?v=...' },
  { type: 'audio', label: 'Ses Dosyası', icon: Mic },
  { type: 'pdf', label: 'PDF', icon: FileIcon },
];

interface SourceSelectorProps {
  onFileTranscribed?: (text: string) => void;
  transcribing?: boolean;
  setTranscribing?: (v: boolean) => void;
}

export function SourceSelector({ onFileTranscribed, transcribing, setTranscribing }: SourceSelectorProps) {
  const { sourceType, sourceUrl, sourceText, setSourceType, setSourceUrl, setSourceText, setSourceFile } = useRepurposeStore();
  const fileRef = useRef<HTMLInputElement>(null);

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

  const current = sources.find((s) => s.type === sourceType);

  return (
    <div className="space-y-4">
      {/* Source type tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {sources.map((s) => {
          const Icon = s.icon;
          const active = sourceType === s.type;
          return (
            <button
              key={s.type}
              onClick={() => setSourceType(s.type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-[var(--duration-fast)] ${
                active
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon size={13} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Input area */}
      {(sourceType === 'blog_url' || sourceType === 'youtube') && (
        <Input
          label={current?.label}
          placeholder={current?.placeholder}
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          leftIcon={current?.icon && <current.icon size={15} />}
        />
      )}

      {sourceType === 'blog_text' && (
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Blog İçeriği
          </label>
          <textarea
            rows={8}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Blog yazınızın içeriğini buraya yapıştırın..."
            className="w-full px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-hover)] resize-none transition-colors"
          />
          <p className="text-xs text-[var(--text-tertiary)] mt-1">{sourceText.split(/\s+/).filter(Boolean).length} kelime</p>
        </div>
      )}

      {(sourceType === 'audio' || sourceType === 'pdf') && (
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            {sourceType === 'audio' ? 'Ses Dosyası (MP3, M4A, WAV, max 25MB)' : 'PDF Dosyası (max 10MB)'}
          </label>
          <div
            className="flex flex-col items-center justify-center gap-3 px-6 py-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-lg)] cursor-pointer hover:border-[var(--border-hover)] transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {sourceType === 'audio' ? <Mic size={24} className="text-[var(--text-tertiary)]" /> : <FileIcon size={24} className="text-[var(--text-tertiary)]" />}
            <p className="text-sm text-[var(--text-secondary)]">
              {transcribing ? 'Transkript oluşturuluyor...' : 'Dosya seç veya sürükle'}
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
              ✓ Transkript hazır — {sourceText.split(/\s+/).filter(Boolean).length} kelime
            </p>
          )}
        </div>
      )}
    </div>
  );
}
