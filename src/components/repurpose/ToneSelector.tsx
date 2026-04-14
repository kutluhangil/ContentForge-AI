'use client';

import { useRepurposeStore } from '@/stores/repurpose-store';
import type { Tone } from '@/types/repurpose';

const tones: { key: Tone; label: string; emoji: string }[] = [
  { key: 'professional', label: 'Profesyonel', emoji: '💼' },
  { key: 'casual', label: 'Samimi', emoji: '😊' },
  { key: 'humorous', label: 'Esprili', emoji: '😄' },
  { key: 'inspirational', label: 'İlham Verici', emoji: '✨' },
  { key: 'educational', label: 'Eğitici', emoji: '📚' },
];

const languages = [
  { key: 'tr' as const, label: 'Türkçe', flag: '🇹🇷' },
  { key: 'en' as const, label: 'English', flag: '🇬🇧' },
];

export function ToneSelector() {
  const { tone, language, setTone, setLanguage } = useRepurposeStore();

  return (
    <div className="space-y-4">
      {/* Tone */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Ton</label>
        <div className="flex flex-wrap gap-1.5">
          {tones.map((t) => (
            <button
              key={t.key}
              onClick={() => setTone(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-[var(--duration-fast)] ${
                tone === t.key
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">Çıktı Dili</label>
        <div className="flex gap-1.5">
          {languages.map((l) => (
            <button
              key={l.key}
              onClick={() => setLanguage(l.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all duration-[var(--duration-fast)] ${
                language === l.key
                  ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
              }`}
            >
              <span>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
