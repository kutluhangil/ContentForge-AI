import { openai } from '@/lib/openai';
import { createReadStream } from 'fs';

export interface TranscribeResult {
  text: string;
  language: string;
  duration?: number;
}

export async function transcribeAudio(
  filePath: string,
  language?: string,
): Promise<TranscribeResult> {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream(filePath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    language,
  });

  return {
    text: response.text,
    language: response.language ?? language ?? 'unknown',
    duration: response.duration,
  };
}
