import { z } from 'zod';

const envSchema = z.object({
  // Next.js Public
  NEXT_PUBLIC_APP_URL: z.string().url().default('https://contentforge.app'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Secrets
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  
  // Lemon Squeezy (can be optional if not fully configured yet, but good to validate)
  LEMONSQUEEZY_API_KEY: z.string().optional(),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().optional(),
  LEMON_STARTER_MONTHLY_VARIANT_ID: z.string().optional(),
  LEMON_STARTER_YEARLY_VARIANT_ID: z.string().optional(),
  LEMON_PRO_MONTHLY_VARIANT_ID: z.string().optional(),
  LEMON_PRO_YEARLY_VARIANT_ID: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export const env = _env.data;
