import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { createClient } from '@supabase/supabase-js';
import { convertToFormats } from '@/lib/ai/convert';
import { QUEUE_NAME } from '@/lib/queue';
import type { RepurposeJobData } from '@/lib/queue';
import type { Database } from '@/types/database';

const redis = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

async function processRepurposeJob(job: Job<RepurposeJobData>): Promise<void> {
  const { conversionId, sourceText, formats, language, tone, customPrompt } = job.data;

  const startedAt = Date.now();

  // Mark conversion as processing
  await supabase
    .from('conversions')
    .update({ status: 'processing' })
    .eq('id', conversionId);

  try {
    await job.updateProgress(10);

    const { results, errors } = await convertToFormats(
      formats,
      sourceText,
      language,
      tone,
      customPrompt,
    );

    await job.updateProgress(80);

    // Save successful outputs
    if (results.length > 0) {
      type DbTone = 'professional' | 'casual' | 'humorous' | 'inspirational' | 'educational';
      const safeTone = tone as DbTone;

      const outputs = results.map((r) => ({
        conversion_id: conversionId,
        user_id: job.data.userId,
        format: r.format,
        tone: safeTone,
        content: r.content,
        word_count: r.wordCount,
        is_edited: false,
      }));

      const { error: insertError } = await supabase.from('outputs').insert(outputs);
      if (insertError) {
        throw new Error(`Failed to save outputs: ${insertError.message}`);
      }
    }

    // Log any format-level errors but don't fail the whole job
    if (errors.length > 0) {
      console.error(
        `[worker] ${conversionId}: ${errors.length} format(s) failed:`,
        errors.map((e) => `${e.format}: ${e.error}`).join(', '),
      );
    }

    const processingTime = Math.round((Date.now() - startedAt) / 1000);

    // Mark conversion complete
    await supabase
      .from('conversions')
      .update({
        status: results.length > 0 ? 'completed' : 'failed',
        processing_time: processingTime,
        error_message: errors.length > 0 ? errors.map((e) => e.error).join('; ') : null,
      })
      .eq('id', conversionId);

    // Increment usage if at least one output succeeded
    if (results.length > 0) {
      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);

      await supabase.rpc('increment_usage', {
        p_user_id: job.data.userId,
        p_period_start: periodStart.toISOString().split('T')[0],
      });
    }

    await job.updateProgress(100);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown processing error';

    await supabase
      .from('conversions')
      .update({
        status: 'failed',
        error_message: errorMessage,
        processing_time: Math.round((Date.now() - startedAt) / 1000),
      })
      .eq('id', conversionId);

    throw err;
  }
}

const worker = new Worker<RepurposeJobData>(QUEUE_NAME, processRepurposeJob, {
  connection: redis,
  concurrency: 3,
  limiter: { max: 10, duration: 60_000 },
});

worker.on('completed', (job) => {
  console.log(`[worker] Job ${job.id} (conversion: ${job.data.conversionId}) completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[worker] Job ${job?.id} failed:`, err.message);
});

worker.on('error', (err) => {
  console.error('[worker] Worker error:', err);
});

console.log('[worker] Repurpose worker started, waiting for jobs...');

process.on('SIGTERM', async () => {
  console.log('[worker] SIGTERM received, closing gracefully...');
  await worker.close();
  process.exit(0);
});
