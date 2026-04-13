import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { repurposeQueue } from '@/lib/queue';
import { checkUsageLimit } from '@/lib/usage';
import { parseBlogUrl } from '@/lib/blog';
import { getYouTubeTranscript } from '@/lib/youtube';
import type { OutputFormat } from '@/types/repurpose';

const outputFormats: OutputFormat[] = [
  'linkedin',
  'twitter_thread',
  'newsletter',
  'shorts_script',
  'carousel',
  'blog_summary',
];

const RepurposeSchema = z.object({
  sourceType: z.enum(['blog_url', 'blog_text', 'youtube', 'audio', 'pdf']),
  sourceText: z.string().min(1).max(20_000).optional(),
  sourceUrl: z.string().url().optional(),
  formats: z.array(z.enum(outputFormats as [OutputFormat, ...OutputFormat[]])).min(1).max(6),
  language: z.enum(['tr', 'en']),
  tone: z.enum(['professional', 'casual', 'humorous', 'inspirational', 'educational']),
  customPrompt: z.string().max(500).optional(),
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

    // Check usage limit
    const usage = await checkUsageLimit(user.id);
    if (!usage.allowed) {
      return NextResponse.json(
        {
          error: 'Usage limit reached',
          used: usage.used,
          limit: usage.limit,
          plan: usage.plan,
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const parsed = RepurposeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { sourceType, sourceText, sourceUrl, formats, language, tone, customPrompt } =
      parsed.data;

    // Extract source text based on type
    let resolvedText = '';

    if (sourceType === 'blog_text') {
      if (!sourceText) {
        return NextResponse.json({ error: 'sourceText is required for blog_text' }, { status: 400 });
      }
      resolvedText = sourceText;
    } else if (sourceType === 'blog_url') {
      if (!sourceUrl) {
        return NextResponse.json({ error: 'sourceUrl is required for blog_url' }, { status: 400 });
      }
      const result = await parseBlogUrl(sourceUrl);
      resolvedText = `${result.title}\n\n${result.text}`;
    } else if (sourceType === 'youtube') {
      if (!sourceUrl) {
        return NextResponse.json({ error: 'sourceUrl is required for youtube' }, { status: 400 });
      }
      const result = await getYouTubeTranscript(sourceUrl, language);
      resolvedText = result.text;
    } else if (sourceType === 'audio' || sourceType === 'pdf') {
      // These are handled via /api/transcribe then sourceText is passed
      if (!sourceText) {
        return NextResponse.json(
          { error: 'sourceText is required (use /api/transcribe first for audio/pdf)' },
          { status: 400 },
        );
      }
      resolvedText = sourceText;
    }

    if (!resolvedText.trim()) {
      return NextResponse.json({ error: 'Could not extract source text' }, { status: 422 });
    }

    // Create conversion record
    const { data: conversion, error: conversionError } = await supabase
      .from('conversions')
      .insert({
        user_id: user.id,
        source_type: sourceType,
        source_url: sourceUrl ?? null,
        source_text: resolvedText,
        language,
        status: 'pending',
      })
      .select()
      .single();

    if (conversionError || !conversion) {
      return NextResponse.json({ error: 'Failed to create conversion' }, { status: 500 });
    }

    // Get subscription for priority
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_slug')
      .eq('user_id', user.id)
      .single();

    const isPriority = sub?.plan_slug === 'pro';

    // Enqueue job
    await repurposeQueue.add(
      'repurpose',
      {
        conversionId: conversion.id,
        userId: user.id,
        sourceText: resolvedText,
        sourceType,
        formats,
        language,
        tone,
        customPrompt,
        isPriority,
      },
      { priority: isPriority ? 1 : 10 },
    );

    return NextResponse.json({ id: conversion.id, status: 'pending' }, { status: 202 });
  } catch (err) {
    console.error('[api/repurpose] Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
