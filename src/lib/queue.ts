import { Queue, QueueEvents } from 'bullmq';
import { redis } from '@/lib/redis';
import type { OutputFormat } from '@/types/repurpose';

export const QUEUE_NAME = 'repurpose';

export interface RepurposeJobData {
  conversionId: string;
  userId: string;
  sourceText: string;
  sourceType: string;
  formats: OutputFormat[];
  language: 'tr' | 'en';
  tone: string;
  customPrompt?: string;
  isPriority: boolean;
}

export const repurposeQueue = new Queue<RepurposeJobData>(QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export const repurposeQueueEvents = new QueueEvents(QUEUE_NAME, {
  connection: redis,
});
