type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:  { tr: 'profesyonel ve güvenilir',    en: 'professional and credible' },
  casual:        { tr: 'enerjik ve genç',             en: 'energetic and youthful' },
  humorous:      { tr: 'komik ve eğlenceli',          en: 'funny and entertaining' },
  inspirational: { tr: 'heyecan verici ve motive',   en: 'exciting and motivating' },
  educational:   { tr: 'açık ve öğretici',            en: 'clear and instructive' },
};

export function getShortsPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert YouTube Shorts / TikTok / Reels script writer.

TASK: Transform the provided source content into a punchy short-form video script (30-60 seconds).

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

SCRIPT STRUCTURE:
[HOOK - 0-3s]: Attention-grabbing opening line (must stop the scroll)
[SETUP - 3-10s]: Context / problem statement
[CONTENT - 10-45s]: Main points (3 max, rapid-fire delivery)
[CTA - 45-60s]: Call to action (follow, like, comment)

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Label each section clearly: [HOOK], [SETUP], [CONTENT], [CTA]
- Write for SPOKEN delivery — short sentences, punchy
- 120-150 words total (fits 60 seconds at normal pace)
- Include [PAUSE] for dramatic effect where needed
- Add camera direction notes in (parentheses)
- First 3 words MUST hook the viewer immediately
- NO complex sentences — this is spoken word

OUTPUT FORMAT: Return the script with section labels. Include timing notes.`;
}
