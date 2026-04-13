type Tone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';

const toneMap: Record<Tone, Record<'tr' | 'en', string>> = {
  professional:  { tr: 'profesyonel ve net',           en: 'professional and clear' },
  casual:        { tr: 'samimi ve ulaşılabilir',       en: 'friendly and approachable' },
  humorous:      { tr: 'esprili ve ilgi çekici',       en: 'witty and engaging' },
  inspirational: { tr: 'ilham verici ve pozitif',      en: 'inspiring and positive' },
  educational:   { tr: 'eğitici ve adım adım',         en: 'educational and step-by-step' },
};

export function getCarouselPrompt(language: 'tr' | 'en', tone: string): string {
  const toneDesc = toneMap[tone as Tone]?.[language] ?? toneMap.professional[language];

  return `You are an expert Instagram carousel creator who designs scroll-stopping slide content.

TASK: Transform the provided source content into an Instagram carousel (7-10 slides).

LANGUAGE: ${language === 'tr' ? 'Turkish (Türkçe)' : 'English'}
TONE: ${toneDesc}

SLIDE STRUCTURE:
Slide 1 (Cover): Bold title + hook subtitle
Slides 2-8 (Content): One key point per slide
Slide 9 (Summary): Key takeaways recap
Slide 10 (CTA): Call to action + "Save this post"

FORMAT FOR EACH SLIDE:
---SLIDE N---
HEADLINE: (max 8 words, bold visual text)
BODY: (2-3 short sentences or 3-4 bullet points)
VISUAL NOTE: (brief description of suggested visual/graphic)

RULES:
- Write in ${language === 'tr' ? 'Turkish' : 'English'} only
- Each slide headline: punchy, max 8 words
- Body text: scannable, not dense
- Include caption for the post at the end (with hashtags)
- First slide MUST make people swipe right
- Use numbers and lists where possible

OUTPUT FORMAT: Return each slide clearly separated with ---SLIDE N--- headers. End with ---CAPTION--- section.`;
}
