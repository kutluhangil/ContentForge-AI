import type { OutputFormat, Tone } from './repurpose';

export type PlanSlug = 'free' | 'starter' | 'pro';

export interface PlanLimits {
  conversions_per_month: number;
  max_audio_minutes: number;
  max_video_minutes: number;
  available_formats: OutputFormat[];
  available_tones: Tone[];
  history_days: number;
  priority_queue: boolean;
  api_access: boolean;
  custom_prompts: boolean;
}

export interface Plan {
  slug: PlanSlug;
  name: { tr: string; en: string };
  price: { monthly: number; yearly: number };
  ls_variant_id?: { monthly: string; yearly: string };
  limits: PlanLimits;
}

export const PLANS: Record<PlanSlug, Plan> = {
  free: {
    slug: 'free',
    name: { tr: 'Ücretsiz', en: 'Free' },
    price: { monthly: 0, yearly: 0 },
    limits: {
      conversions_per_month: 3,
      max_audio_minutes: 0,
      max_video_minutes: 5,
      available_formats: ['linkedin', 'twitter_thread', 'blog_summary'],
      available_tones: ['professional', 'casual'],
      history_days: 7,
      priority_queue: false,
      api_access: false,
      custom_prompts: false,
    },
  },
  starter: {
    slug: 'starter',
    name: { tr: 'Starter', en: 'Starter' },
    price: { monthly: 19, yearly: 15.2 },
    ls_variant_id: {
      monthly: process.env.LEMON_STARTER_MONTHLY_VARIANT_ID ?? '',
      yearly: process.env.LEMON_STARTER_YEARLY_VARIANT_ID ?? '',
    },
    limits: {
      conversions_per_month: 50,
      max_audio_minutes: 10,
      max_video_minutes: 30,
      available_formats: ['linkedin', 'twitter_thread', 'newsletter', 'shorts_script', 'carousel', 'blog_summary'],
      available_tones: ['professional', 'casual', 'humorous', 'inspirational', 'educational'],
      history_days: 90,
      priority_queue: false,
      api_access: false,
      custom_prompts: false,
    },
  },
  pro: {
    slug: 'pro',
    name: { tr: 'Pro', en: 'Pro' },
    price: { monthly: 49, yearly: 39.2 },
    ls_variant_id: {
      monthly: process.env.LEMON_PRO_MONTHLY_VARIANT_ID ?? '',
      yearly: process.env.LEMON_PRO_YEARLY_VARIANT_ID ?? '',
    },
    limits: {
      conversions_per_month: Infinity,
      max_audio_minutes: 60,
      max_video_minutes: 120,
      available_formats: ['linkedin', 'twitter_thread', 'newsletter', 'shorts_script', 'carousel', 'blog_summary'],
      available_tones: ['professional', 'casual', 'humorous', 'inspirational', 'educational'],
      history_days: Infinity,
      priority_queue: true,
      api_access: true,
      custom_prompts: true,
    },
  },
};
