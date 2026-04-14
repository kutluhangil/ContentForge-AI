'use client';

import { useState } from 'react';
import { Check, Copy, Edit3, Save, X, AtSign, Hash, Mail, Video, LayoutGrid, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { OutputFormat } from '@/types/repurpose';

const formatConfig: Record<OutputFormat, { label: string; icon: React.ElementType; variant: 'linkedin' | 'twitter' | 'youtube' | 'instagram' | 'default' }> = {
  linkedin:       { label: 'LinkedIn', icon: AtSign, variant: 'linkedin' },
  twitter_thread: { label: 'Twitter Thread', icon: Hash, variant: 'twitter' },
  newsletter:     { label: 'Newsletter', icon: Mail, variant: 'default' },
  shorts_script:  { label: 'Shorts Script', icon: Video, variant: 'youtube' },
  carousel:       { label: 'Carousel', icon: LayoutGrid, variant: 'instagram' },
  blog_summary:   { label: 'Blog Özeti', icon: FileText, variant: 'default' },
};

interface ResultCardProps {
  outputId: string;
  format: OutputFormat;
  content: string;
  wordCount: number | null;
  isEdited: boolean;
  onSaveEdit?: (outputId: string, content: string) => Promise<void>;
}

export function ResultCard({ outputId, format, content, wordCount, isEdited, onSaveEdit }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [saving, setSaving] = useState(false);

  const config = formatConfig[format];
  const Icon = config.icon;

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!onSaveEdit) return;
    setSaving(true);
    try {
      await onSaveEdit(outputId, editValue);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-[var(--text-secondary)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">{config.label}</span>
          {isEdited && (
            <Badge variant="default" >düzenlendi</Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {wordCount && (
            <span className="text-xs text-[var(--text-tertiary)] mr-2">{wordCount} kelime</span>
          )}

          {!editing && onSaveEdit && (
            <button
              onClick={() => { setEditing(true); setEditValue(content); }}
              className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Düzenle"
            >
              <Edit3 size={14} />
            </button>
          )}

          {editing && (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--success)] hover:bg-[var(--bg-tertiary)] transition-colors"
                title="Kaydet"
              >
                <Save size={14} />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                title="İptal"
              >
                <X size={14} />
              </button>
            </>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            title="Kopyala"
          >
            {copied ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {editing ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={12}
            className="w-full bg-transparent text-sm text-[var(--text-primary)] leading-relaxed resize-none focus:outline-none"
            autoFocus
          />
        ) : (
          <pre className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap font-sans">
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
