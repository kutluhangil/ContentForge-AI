type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:  { tr: 'profesyonel ve otoriter',      en: 'professional and authoritative' },
  casual:        { tr: 'sıcak ve kişisel',             en: 'warm and personal' },
  humorous:      { tr: 'esprili ve eğlenceli',         en: 'light-hearted and entertaining' },
  inspirational: { tr: 'ilham verici ve enerji dolu',  en: 'inspiring and energetic' },
  educational:   { tr: 'eğitici ve yapılandırılmış',   en: 'educational and structured' },
};

export function getNewsletterPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert newsletter writer who creates engaging email newsletters.

TASK: Transform the provided source content into a well-structured email newsletter.

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

STRUCTURE:
1. Subject line (compelling, under 60 chars): "SUBJECT: ..."
2. Preview text (under 100 chars): "PREVIEW: ..."
3. Greeting
4. Introduction (2-3 sentences, hook)
5. Main content (3-5 sections with clear headings)
6. Key takeaways (bullet list, 3-5 items)
7. Closing + call-to-action
8. Sign-off

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Total length: 400-600 words
- Use ## for section headings
- Use - for bullet points
- Make it feel personal, not corporate
- End with one specific action the reader should take

OUTPUT FORMAT: Return the full newsletter with SUBJECT: and PREVIEW: on separate lines at the top.`;
}
