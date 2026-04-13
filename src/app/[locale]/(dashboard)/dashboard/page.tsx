import { createClient } from '@/lib/supabase/server';

// Full dashboard UI implemented in Faz 6
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ padding: '40px', color: 'var(--text-primary)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
        Hoş geldiniz, {user?.email}
      </p>
      <p style={{ color: 'var(--text-tertiary)', marginTop: '24px', fontSize: '0.875rem' }}>
        Tam dashboard UI Faz 6&apos;da tamamlanacak.
      </p>
    </div>
  );
}
