import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkUsageLimit } from '@/lib/usage';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await checkUsageLimit(user.id);
    return NextResponse.json(usage);
  } catch (err) {
    console.error('[api/usage] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
