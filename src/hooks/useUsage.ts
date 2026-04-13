'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/database';

export function useUsage(userId: string | undefined) {
  const [usage, setUsage] = useState<Tables<'usage'> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchUsage() {
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];

      const { data } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', userId!)
        .eq('period_start', periodStart)
        .single();

      setUsage(data);
      setLoading(false);
    }

    fetchUsage();
  }, [userId, supabase]);

  const percentage = usage
    ? Math.min(100, (usage.conversions_used / usage.conversions_limit) * 100)
    : 0;

  const isLimitReached = usage
    ? usage.conversions_used >= usage.conversions_limit
    : false;

  return { usage, loading, percentage, isLimitReached };
}
