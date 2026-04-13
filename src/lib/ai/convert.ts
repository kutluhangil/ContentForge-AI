import { openai } from '@/lib/openai';
import { getLinkedInPrompt } from './prompts/linkedin';
import { getTwitterPrompt } from './prompts/twitter';
import { getNewsletterPrompt } from './prompts/newsletter';
import { getShortsPrompt } from './prompts/shorts';
import { getCarouselPrompt } from './prompts/carousel';
import { getSummaryPrompt } from './prompts/summary';
import type { OutputFormat } from '@/types/repurpose';

const MAX_SOURCE_CHARS = 12_000;

function getSystemPrompt(format: OutputFormat, language: 'tr' | 'en', tone: string): string {
  switch (format) {
    case 'linkedin':       return getLinkedInPrompt(language, tone);
    case 'twitter_thread': return getTwitterPrompt(language, tone);
    case 'newsletter':     return getNewsletterPrompt(language, tone);
    case 'shorts_script':  return getShortsPrompt(language, tone);
    case 'carousel':       return getCarouselPrompt(language, tone);
    case 'blog_summary':   return getSummaryPrompt(language, tone);
  }
}

export interface ConvertOptions {
  sourceText: string;
  format: OutputFormat;
  language: 'tr' | 'en';
  tone: string;
  customPrompt?: string;
}

export interface ConvertResult {
  format: OutputFormat;
  content: string;
  wordCount: number;
}

export async function convertToFormat(options: ConvertOptions): Promise<ConvertResult> {
  const { sourceText, format, language, tone, customPrompt } = options;

  const trimmedSource = sourceText.slice(0, MAX_SOURCE_CHARS);
  const systemPrompt = getSystemPrompt(format, language, tone);

  const userContent = customPrompt
    ? `${trimmedSource}\n\nAdditional instructions: ${customPrompt}`
    : trimmedSource;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content?.trim() ?? '';
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return { format, content, wordCount };
}

export async function convertToFormats(
  formats: OutputFormat[],
  sourceText: string,
  language: 'tr' | 'en',
  tone: string,
  customPrompt?: string,
): Promise<{ results: ConvertResult[]; errors: { format: OutputFormat; error: string }[] }> {
  const settled = await Promise.allSettled(
    formats.map((format) =>
      convertToFormat({ sourceText, format, language, tone, customPrompt }),
    ),
  );

  const results: ConvertResult[] = [];
  const errors: { format: OutputFormat; error: string }[] = [];

  settled.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      results.push(result.value);
    } else {
      errors.push({
        format: formats[i],
        error: result.reason instanceof Error ? result.reason.message : 'Unknown error',
      });
    }
  });

  return { results, errors };
}
