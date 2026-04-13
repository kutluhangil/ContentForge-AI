import { createAdminClient } from '@/lib/supabase/admin';
import { PLANS } from '@/types/plans';

function getPeriodStart(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export interface UsageLimitResult {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  plan: string;
}

export async function checkUsageLimit(userId: string): Promise<UsageLimitResult> {
  const supabase = createAdminClient();

  // Get active subscription
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_slug, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .single();

  const planSlug = (sub?.plan_slug ?? 'free') as keyof typeof PLANS;
  const plan = PLANS[planSlug] ?? PLANS.free;
  const limit = plan.limits.conversions_per_month;

  // Get or create usage record for this period
  const periodStart = getPeriodStart();

  const { data: usage } = await supabase
    .from('usage')
    .select('conversions_used')
    .eq('user_id', userId)
    .eq('period_start', periodStart)
    .single();

  const used = usage?.conversions_used ?? 0;
  const resolvedLimit = limit === Infinity ? Number.MAX_SAFE_INTEGER : limit;

  return {
    allowed: used < resolvedLimit,
    used,
    limit: resolvedLimit,
    remaining: Math.max(0, resolvedLimit - used),
    plan: planSlug,
  };
}

export async function incrementUsage(userId: string): Promise<void> {
  const supabase = createAdminClient();
  const periodStart = getPeriodStart();

  await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_period_start: periodStart,
  });
}
