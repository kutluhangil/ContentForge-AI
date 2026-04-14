'use client';

import { AtSign, Hash, Mail, Video, LayoutGrid, FileText, Lock } from 'lucide-react';
import { useRepurposeStore } from '@/stores/repurpose-store';
import type { OutputFormat } from '@/types/repurpose';
import type { PlanSlug } from '@/types/plans';
import { PLANS } from '@/types/plans';

const formats: { key: OutputFormat; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { key: 'linkedin', label: 'LinkedIn', desc: 'Profesyonel gönderi', icon: AtSign, color: 'var(--linkedin)' },
  { key: 'twitter_thread', label: 'Twitter Thread', desc: '5-8 tweet dizisi', icon: Hash, color: 'var(--twitter)' },
  { key: 'newsletter', label: 'Newsletter', desc: 'E-posta bülteni', icon: Mail, color: 'var(--accent)' },
  { key: 'shorts_script', label: 'Shorts Script', desc: '30-60 sn video', icon: Video, color: 'var(--youtube)' },
  { key: 'carousel', label: 'Carousel', desc: 'Instagram slayt', icon: LayoutGrid, color: 'var(--instagram)' },
  { key: 'blog_summary', label: 'Blog Özeti', desc: 'Markdown format', icon: FileText, color: 'var(--accent)' },
];

interface FormatPickerProps {
  plan?: PlanSlug;
}

export function FormatPicker({ plan = 'free' }: FormatPickerProps) {
  const { selectedFormats, toggleFormat } = useRepurposeStore();
  const availableFormats = PLANS[plan].limits.available_formats;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-medium text-[var(--text-secondary)]">
          Çıktı Formatları
        </label>
        <span className="text-xs text-[var(--text-tertiary)]">
          {selectedFormats.length} / 6 seçili
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {formats.map(({ key, label, desc, icon: Icon, color }) => {
          const isAvailable = availableFormats.includes(key);
          const isSelected = selectedFormats.includes(key);

          return (
            <button
              key={key}
              onClick={() => isAvailable && toggleFormat(key)}
              disabled={!isAvailable}
              className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-lg)] border text-left transition-all duration-[var(--duration-fast)] ${
                !isAvailable
                  ? 'opacity-40 cursor-not-allowed border-[var(--border-subtle)] bg-[var(--bg-secondary)]'
                  : isSelected
                  ? 'border-[var(--border-hover)] bg-[var(--bg-secondary)] shadow-[0_0_0_1px_var(--border-hover)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              <Icon size={16} style={{ color: isSelected ? color : 'var(--text-tertiary)' }} />
              <div className="min-w-0">
                <p className={`text-xs font-medium truncate ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {label}
                </p>
                <p className="text-[10px] text-[var(--text-tertiary)] truncate">{desc}</p>
              </div>
              {!isAvailable && (
                <Lock size={11} className="absolute top-1.5 right-1.5 text-[var(--text-tertiary)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
