import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentConversions } from '@/components/dashboard/RecentConversions';
import { PLANS } from '@/types/plans';
import type { PlanSlug } from '@/types/plans';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/tr/login');

  const periodStart = new Date();
  periodStart.setDate(1);
  periodStart.setHours(0, 0, 0, 0);
  const periodStr = periodStart.toISOString().split('T')[0];

  const [
    { count: totalConversions },
    { count: monthConversions },
    { data: sub },
    { data: usage },
    { data: recentRaw },
  ] = await Promise.all([
    supabase.from('conversions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('conversions').select('*', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', periodStart.toISOString()),
    supabase.from('subscriptions').select('plan_slug').eq('user_id', user.id).single(),
    supabase.from('usage').select('conversions_used, conversions_limit').eq('user_id', user.id).eq('period_start', periodStr).single(),
    supabase.from('conversions').select('id, source_type, title, status, created_at, outputs(format)').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const planSlug = (sub?.plan_slug ?? 'free') as PlanSlug;
  const planLimits = PLANS[planSlug].limits.conversions_per_month;
  const usageLimit = planLimits === Infinity ? Number.MAX_SAFE_INTEGER : planLimits;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Günaydın';
    if (h < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? '';

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-black text-[var(--text-primary)]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {greeting()}, {firstName} 👋
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          İşte içerik üretim durumunuz.
        </p>
      </div>

      {/* Stats */}
      <StatsCards
        totalConversions={totalConversions ?? 0}
        monthConversions={monthConversions ?? 0}
        plan={planSlug}
        usageUsed={usage?.conversions_used ?? 0}
        usageLimit={usageLimit}
      />

      {/* Recent Conversions */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Son Dönüşümler
          </h2>
          <Link
            href="history"
            className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Tümünü gör →
          </Link>
        </div>

        <RecentConversions conversions={(recentRaw ?? []) as Parameters<typeof RecentConversions>[0]['conversions']} />
      </div>

      {/* Quick actions */}
      <div className="mt-8 p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Yeni Dönüşüm Başlat</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Blog, YouTube, ses veya PDF'i dönüştür.</p>
        </div>
        <Link
          href="repurpose"
          className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] text-sm font-semibold px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors"
        >
          Başlat →
        </Link>
      </div>
    </div>
  );
}
