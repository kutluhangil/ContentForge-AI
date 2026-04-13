import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { transcribeAudio } from '@/lib/transcribe';
import { parsePdf } from '@/lib/pdf';

const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // 25 MB (Whisper limit)
const MAX_PDF_BYTES = 10 * 1024 * 1024;   // 10 MB

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm',
  'audio/ogg', 'audio/flac', 'audio/x-m4a',
];
const ALLOWED_PDF_TYPE = 'application/pdf';

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

    // Write to temp file
    const ext = isPdf ? 'pdf' : file.name.split('.').pop() ?? 'mp3';
    tmpPath = join(tmpdir(), `cf-${randomUUID()}.${ext}`);
    const bytes = await file.arrayBuffer();
    await writeFile(tmpPath, Buffer.from(bytes));

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
