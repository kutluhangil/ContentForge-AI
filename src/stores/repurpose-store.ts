import { create } from 'zustand';
import type { OutputFormat, Tone, Language, SourceType } from '@/types/repurpose';

interface RepurposeState {
  // Input
  sourceType: SourceType;
  sourceUrl: string;
  sourceText: string;
  sourceFile: File | null;

  // Config
  selectedFormats: OutputFormat[];
  tone: Tone;
  language: Language;
  customPrompt: string;

  // Actions
  setSourceType: (type: SourceType) => void;
  setSourceUrl: (url: string) => void;
  setSourceText: (text: string) => void;
  setSourceFile: (file: File | null) => void;
  toggleFormat: (format: OutputFormat) => void;
  setTone: (tone: Tone) => void;
  setLanguage: (language: Language) => void;
  setCustomPrompt: (prompt: string) => void;
  reset: () => void;
}

const initialState = {
  sourceType: 'blog_url' as SourceType,
  sourceUrl: '',
  sourceText: '',
  sourceFile: null,
  selectedFormats: ['linkedin', 'twitter_thread', 'blog_summary'] as OutputFormat[],
  tone: 'professional' as Tone,
  language: 'tr' as Language,
  customPrompt: '',
};

export const useRepurposeStore = create<RepurposeState>((set) => ({
  ...initialState,

  setSourceType: (sourceType) => set({ sourceType, sourceUrl: '', sourceText: '', sourceFile: null }),
  setSourceUrl: (sourceUrl) => set({ sourceUrl }),
  setSourceText: (sourceText) => set({ sourceText }),
  setSourceFile: (sourceFile) => set({ sourceFile }),

  toggleFormat: (format) =>
    set((state) => ({
      selectedFormats: state.selectedFormats.includes(format)
        ? state.selectedFormats.filter((f) => f !== format)
        : [...state.selectedFormats, format],
    })),

  setTone: (tone) => set({ tone }),
  setLanguage: (language) => set({ language }),
  setCustomPrompt: (customPrompt) => set({ customPrompt }),
  reset: () => set(initialState),
}));
