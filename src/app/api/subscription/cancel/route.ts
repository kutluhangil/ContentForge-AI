import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initLemonSqueezy, cancelSubscription } from '@/lib/lemonsqueezy';

export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('ls_subscription_id, status')
      .eq('user_id', user.id)
      .single();

    if (!sub?.ls_subscription_id) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    if (sub.status === 'cancelled') {
      return NextResponse.json({ error: 'Subscription already cancelled' }, { status: 409 });
    }

    initLemonSqueezy();
    await cancelSubscription(sub.ls_subscription_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/subscription/cancel] Error:', err);
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
  }
}
