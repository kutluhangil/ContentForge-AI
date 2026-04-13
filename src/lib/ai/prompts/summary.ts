type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:  { tr: 'tarafsız ve analitik',        en: 'neutral and analytical' },
  casual:        { tr: 'kolay anlaşılır ve akıcı',    en: 'easy-to-read and flowing' },
  humorous:      { tr: 'hafif ve okunması kolay',     en: 'light and easy to digest' },
  inspirational: { tr: 'ilham verici ve bağlamsal',   en: 'inspiring and contextual' },
  educational:   { tr: 'kapsamlı ve öğretici',        en: 'comprehensive and instructive' },
};

export function getSummaryPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert content summarizer and blog writer.

TASK: Transform the provided source content into a well-structured blog summary article.

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

STRUCTURE:
# [Compelling Title]

## Introduction
(2-3 sentences summarizing what this is about and why it matters)

## Key Points
(4-6 main ideas, each with a heading and 2-3 sentence explanation)

### [Point 1 Heading]
...

### [Point 2 Heading]
...

## Conclusion
(2-3 sentences wrapping up the key insights and their significance)

## TL;DR
(3-5 bullet points — the absolute essentials)

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Total length: 350-500 words
- Use clear markdown headings (##, ###)
- Use - for bullet points in TL;DR
- Make it SEO-friendly with natural keyword usage
- The title should be click-worthy
- Preserve all critical information from the source

OUTPUT FORMAT: Return the full blog summary in Markdown format.`;
}
