import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getYouTubeTranscript } from '@/lib/youtube';

const Schema = z.object({
  url: z.string().url(),
  language: z.enum(['tr', 'en']).default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await getYouTubeTranscript(parsed.data.url, parsed.data.language);

    return NextResponse.json({
      text: result.text,
      title: result.title,
      duration: result.duration,
      language: result.language,
    });
  } catch (err) {
    console.error('[api/youtube] Error:', err);
    const message = err instanceof Error ? err.message : 'Failed to get transcript';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
