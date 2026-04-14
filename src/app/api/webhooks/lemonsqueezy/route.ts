import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';

interface LsSubscriptionAttributes {
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  status: string;
  pause: null | { mode: string; resumes_at: string };
  cancelled: boolean;
  trial_ends_at: string | null;
  billing_anchor: number;
  first_subscription_item: {
    id: number;
    price_id: number;
    quantity: number;
    is_usage_based: boolean;
  };
  urls: { update_payment_method: string };
  renews_at: string;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

interface LsWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: { user_id?: string };
  };
  data: {
    id: string;
    type: string;
    attributes: LsSubscriptionAttributes;
  };
}

function variantIdToPlanSlug(variantId: number): 'free' | 'starter' | 'pro' {
  const starterMonthly = process.env.LEMON_STARTER_MONTHLY_VARIANT_ID;
  const starterYearly = process.env.LEMON_STARTER_YEARLY_VARIANT_ID;
  const proMonthly = process.env.LEMON_PRO_MONTHLY_VARIANT_ID;
  const proYearly = process.env.LEMON_PRO_YEARLY_VARIANT_ID;

  const id = String(variantId);
  if (id === starterMonthly || id === starterYearly) return 'starter';
  if (id === proMonthly || id === proYearly) return 'pro';
  return 'free';
}

function variantIdToBillingCycle(variantId: number): 'monthly' | 'yearly' {
  const starterYearly = process.env.LEMON_STARTER_YEARLY_VARIANT_ID;
  const proYearly = process.env.LEMON_PRO_YEARLY_VARIANT_ID;
  const id = String(variantId);
  return id === starterYearly || id === proYearly ? 'yearly' : 'monthly';
}

function getPeriodStart(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature') ?? '';
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? '';

  if (!verifyWebhookSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: LsWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as LsWebhookPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { event_name, custom_data } = payload.meta;
  const userId = custom_data?.user_id;
  const attrs = payload.data.attributes;
  const lsSubscriptionId = payload.data.id;
  const lsCustomerId = String(attrs.customer_id);

  const supabase = createAdminClient();

  try {
    switch (event_name) {
      case 'subscription_created': {
        if (!userId) break;

        const planSlug = variantIdToPlanSlug(attrs.variant_id);
        const billingCycle = variantIdToBillingCycle(attrs.variant_id);

        await supabase
          .from('subscriptions')
          .upsert(
            {
              user_id: userId,
              ls_subscription_id: lsSubscriptionId,
              ls_customer_id: lsCustomerId,
              plan_slug: planSlug,
              status: 'active',
              billing_cycle: billingCycle,
              current_period_start: new Date().toISOString(),
              current_period_end: attrs.renews_at,
            },
            { onConflict: 'user_id' },
          );

        break;
      }

      case 'subscription_updated': {
        if (!userId) break;

        const planSlug = variantIdToPlanSlug(attrs.variant_id);
        const billingCycle = variantIdToBillingCycle(attrs.variant_id);

        await supabase
          .from('subscriptions')
          .update({
            ls_subscription_id: lsSubscriptionId,
            plan_slug: planSlug,
            billing_cycle: billingCycle,
            current_period_end: attrs.renews_at,
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_cancelled': {
        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancel_at: attrs.ends_at,
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_expired': {
        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: 'expired',
            plan_slug: 'free',
            ls_subscription_id: null,
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_resumed': {
        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            cancel_at: null,
          })
          .eq('user_id', userId);

        break;
      }

      case 'subscription_payment_success': {
        if (!userId) break;

        // Reset usage for new billing period
        const periodStart = getPeriodStart();

        await supabase
          .from('subscriptions')
          .update({ current_period_end: attrs.renews_at })
          .eq('user_id', userId);

        await supabase
          .from('usage')
          .update({ conversions_used: 0 })
          .eq('user_id', userId)
          .eq('period_start', periodStart);

        break;
      }

      case 'subscription_payment_failed': {
        if (!userId) break;

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId);

        break;
      }

      default:
        // Unknown event — log and return OK to avoid retries
        console.log(`[webhook] Unhandled event: ${event_name}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`[webhook] Error processing ${event_name}:`, err);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
