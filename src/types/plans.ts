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
