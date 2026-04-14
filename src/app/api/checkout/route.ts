import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getCheckoutUrl } from '@/lib/lemonsqueezy';
import { PLANS } from '@/types/plans';

const Schema = z.object({
  plan: z.enum(['starter', 'pro']),
  billing: z.enum(['monthly', 'yearly']),
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
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { plan, billing } = parsed.data;
    const planConfig = PLANS[plan];
    const variantId = planConfig.ls_variant_id?.[billing];

    if (!variantId) {
      return NextResponse.json(
        { error: 'Variant ID not configured for this plan' },
        { status: 500 },
      );
    }

    const email = user.email ?? '';
    const checkoutUrl = getCheckoutUrl(variantId, email, user.id);

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error('[api/checkout] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
