import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { transcribeAudio } from '@/lib/transcribe';
import { parsePdf } from '@/lib/pdf';
import { rateLimitByUser } from '@/lib/rate-limit';

const MAX_AUDIO_BYTES = 250 * 1024 * 1024; // 250 MB
const MAX_PDF_BYTES = 10 * 1024 * 1024;   // 10 MB

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm',
  'audio/ogg', 'audio/flac', 'audio/x-m4a',
];
const ALLOWED_PDF_TYPE = 'application/pdf';

function verifyFileSignature(buffer: Buffer, type: 'audio' | 'pdf'): boolean {
  if (buffer.length < 4) return false;
  
  if (type === 'pdf') {
    // PDF starts with %PDF (0x25 0x50 0x44 0x46)
    return buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  }
  
  if (type === 'audio') {
    // MP3 (ID3v2 starts with ID3 (0x49 0x44 0x33) or sync frame 0xFF 0xFB / 0xFB / 0xF2)
    const isMp3 = (buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
                  (buffer[0] === 0xFF && (buffer[1] & 0xE0) === 0xE0);
                  
    // WAV starts with RIFF (0x52 0x49 0x46 0x46)
    const isWav = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;
    
    // OGG starts with OggS (0x4F 0x67 0x67 0x53)
    const isOgg = buffer[0] === 0x4F && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53;
    
    // WebM / EBML starts with 0x1A 0x45 0xDF 0xA3
    const isWebm = buffer[0] === 0x1A && buffer[1] === 0x45 && buffer[2] === 0xDF && buffer[3] === 0xA3;
    
    // MP4/M4A has 'ftyp' at offset 4
    let isMp4 = false;
    if (buffer.length >= 8) {
      isMp4 = buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70;
    }
    
    return isMp3 || isWav || isOgg || isWebm || isMp4;
  }
  
  return false;
}

export async function POST(req: NextRequest) {
  let tmpPath: string | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit check
    const rateLimitRes = await rateLimitByUser(user.id, 10, 60); // 10 file upload requests per minute
    if (!rateLimitRes.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const language = (formData.get('language') as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type);
    const isPdf = file.type === ALLOWED_PDF_TYPE;

    if (!isAudio && !isPdf) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: audio (mp3/mp4/wav/webm/ogg/flac/m4a) or PDF' },
        { status: 415 },
      );
    }

    const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_AUDIO_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${Math.round(maxBytes / 1024 / 1024)} MB` },
        { status: 413 },
      );
    }

    // Sanitize extension to prevent path traversal or invalid characters
    let ext = isPdf ? 'pdf' : file.name.split('.').pop() ?? 'mp3';
    ext = ext.replace(/[^a-zA-Z0-9]/g, '');

    tmpPath = join(tmpdir(), `cf-${randomUUID()}.${ext}`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verify magic bytes header
    if (!verifyFileSignature(buffer, isPdf ? 'pdf' : 'audio')) {
      return NextResponse.json(
        { error: 'Invalid file signature. The file content does not match the allowed formats.' },
        { status: 400 },
      );
    }

    await writeFile(tmpPath, buffer);

    if (isAudio) {
      const result = await transcribeAudio(tmpPath, language);
      return NextResponse.json({ text: result.text, language: result.language, duration: result.duration });
    } else {
      const result = await parsePdf(tmpPath);
      return NextResponse.json({ text: result.text, numPages: result.numPages });
    }
  } catch (err) {
    console.error('[api/transcribe] Error:', err);
    const message = err instanceof Error ? err.message : 'Transcription failed';
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (tmpPath) {
      await unlink(tmpPath).catch(() => {});
    }
  }
}
