'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h1
          className="text-xl font-bold text-[var(--text-primary)] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Bir Şeyler Ters Gitti
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-6">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--text-tertiary)] font-mono mb-6 px-3 py-2 bg-[var(--bg-secondary)] rounded-[var(--radius-md)]">
            Hata kodu: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] font-semibold px-5 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors text-sm"
          >
            Tekrar Dene
          </button>
          <a
            href="/tr"
            className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  );
}
