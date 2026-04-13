import { YoutubeTranscript } from 'youtube-transcript';
import { extractYouTubeId } from '@/lib/utils';

export interface YouTubeTranscriptResult {
  text: string;
  title: string;
  duration: number;
  language: string;
}

function cleanTranscriptText(segments: Array<{ text: string }>): string {
  return segments
    .map((s) => s.text.trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .replace(/\[.*?\]/g, '')  // remove [Music], [Applause] etc.
    .trim();
}

export async function getYouTubeTranscript(
  url: string,
  preferredLang: 'tr' | 'en' = 'en',
): Promise<YouTubeTranscriptResult> {
  const videoId = extractYouTubeId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  let segments: Array<{ text: string; duration: number; offset: number }> = [];
  let usedLanguage = preferredLang;

  // Try preferred language first, then fallback to available
  try {
    segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: preferredLang });
  } catch {
    try {
      // Fallback: try the other language
      const fallbackLang = preferredLang === 'tr' ? 'en' : 'tr';
      segments = await YoutubeTranscript.fetchTranscript(videoId, { lang: fallbackLang });
      usedLanguage = fallbackLang;
    } catch {
      // Last resort: no language preference
      segments = await YoutubeTranscript.fetchTranscript(videoId);
      usedLanguage = 'en';
    }
  }

  if (!segments.length) {
    throw new Error('No transcript available for this video');
  }

  const text = cleanTranscriptText(segments);
  const duration = segments.reduce((sum, s) => sum + (s.duration ?? 0), 0);

  return {
    text,
    title: `YouTube Video (${videoId})`,
    duration: Math.round(duration),
    language: usedLanguage,
  };
}
