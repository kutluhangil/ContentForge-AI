'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/database';

export function useSubscription(userId: string | undefined) {
  const [subscription, setSubscription] = useState<Tables<'subscriptions'> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchSubscription() {
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId!)
        .single();
      setSubscription(data);
      setLoading(false);
    }

    fetchSubscription();
  }, [userId, supabase]);

  const isPro = subscription?.plan_slug === 'pro' && subscription?.status === 'active';
  const isStarter = subscription?.plan_slug === 'starter' && subscription?.status === 'active';
  const isFree = !isPro && !isStarter;

  return { subscription, loading, isPro, isStarter, isFree };
}
