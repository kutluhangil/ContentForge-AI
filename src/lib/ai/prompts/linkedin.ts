type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:   { tr: 'profesyonel ve bilgilendirici', en: 'professional and informative' },
  casual:         { tr: 'samimi ve sohbet havasında',   en: 'casual and conversational' },
  humorous:       { tr: 'esprili ve eğlenceli',          en: 'humorous and entertaining' },
  inspirational:  { tr: 'ilham verici ve motive edici',  en: 'inspirational and motivating' },
  educational:    { tr: 'eğitici ve öğretici',           en: 'educational and instructive' },
};

export function getLinkedInPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert LinkedIn content creator.

TASK: Transform the provided source content into a compelling LinkedIn post.

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Start with a strong hook (first 2 lines visible before "see more")
- Use line breaks for readability (short paragraphs, 1-3 sentences each)
- Include 3-5 relevant hashtags at the end
- Add a clear call-to-action
- Keep between 150-300 words
- Use emojis sparingly (max 3-4)
- NO markdown formatting — plain text only
- Make it feel authentic, not AI-generated

OUTPUT FORMAT: Return ONLY the LinkedIn post text, nothing else.`;
}
