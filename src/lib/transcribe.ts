import { openai } from '@/lib/openai';
import { createReadStream } from 'fs';
import { stat, unlink, readdir } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import { join, dirname, extname, basename } from 'path';

export interface TranscribeResult {
  text: string;
  language: string;
  duration?: number;
}

const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24MB

async function transcribeSingleFile(
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

export async function transcribeAudio(
  filePath: string,
  language?: string,
): Promise<TranscribeResult> {
  const fileStats = await stat(filePath);
  
  if (fileStats.size <= MAX_FILE_SIZE) {
    return transcribeSingleFile(filePath, language);
  }

  // File is too large, chunk it using ffmpeg
  const dir = dirname(filePath);
  const ext = extname(filePath);
  const base = basename(filePath, ext);
  const chunkPattern = join(dir, `${base}_chunk_%03d${ext}`);
  
  await new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions([
        '-f', 'segment',
        '-segment_time', '1200', // 20 minutes
        '-c', 'copy'
      ])
      .output(chunkPattern)
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });

  // Find generated chunks
  const files = await readdir(dir);
  const chunkFiles = files
    .filter(f => f.startsWith(`${base}_chunk_`) && f.endsWith(ext))
    .sort()
    .map(f => join(dir, f));

  if (chunkFiles.length === 0) {
    throw new Error('Failed to chunk audio file.');
  }

  let fullText = '';
  let detectedLanguage = language ?? 'unknown';
  let totalDuration = 0;

  try {
    for (const chunkPath of chunkFiles) {
      const result = await transcribeSingleFile(chunkPath, language);
      fullText += (fullText ? ' ' : '') + result.text;
      if (detectedLanguage === 'unknown' && result.language !== 'unknown') {
        detectedLanguage = result.language;
      }
      totalDuration += result.duration || 0;
    }
  } finally {
    // Cleanup chunks
    for (const chunkPath of chunkFiles) {
      await unlink(chunkPath).catch(() => {});
    }
  }

  return {
    text: fullText,
    language: detectedLanguage,
    duration: totalDuration,
  };
}
