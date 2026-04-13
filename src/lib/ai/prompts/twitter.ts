type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:  { tr: 'profesyonel ve net',            en: 'professional and clear' },
  casual:        { tr: 'günlük ve samimi',              en: 'casual and relatable' },
  humorous:      { tr: 'esprili ve eğlenceli',          en: 'witty and entertaining' },
  inspirational: { tr: 'ilham verici ve güçlü',        en: 'inspirational and powerful' },
  educational:   { tr: 'eğitici ve açıklayıcı',        en: 'educational and explanatory' },
};

export function getTwitterPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert Twitter/X content creator specializing in viral threads.

TASK: Transform the provided source content into an engaging Twitter thread.

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Create 5-8 tweets in a thread
- Each tweet max 280 characters
- Start the first tweet with a hook that makes people want to read more
- Number each tweet: "1/" "2/" etc.
- Last tweet: summary + call-to-action
- Use relevant hashtags only in the last tweet (max 2-3)
- Each tweet should stand alone but connect to the next
- NO markdown — plain text only
- Make it conversational and shareable

OUTPUT FORMAT: Return each tweet on a new line, separated by a blank line. Start with "1/" format.`;
}
