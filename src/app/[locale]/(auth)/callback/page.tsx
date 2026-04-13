'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    // Handle hash-based OAuth callback
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase.auth]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div className="spinner" />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Giriş yapılıyor...
      </p>
      <style jsx>{`
        .spinner {
          width: 32px;
          height: 32px;
          border: 2px solid var(--border-subtle);
          border-top-color: var(--text-primary);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
