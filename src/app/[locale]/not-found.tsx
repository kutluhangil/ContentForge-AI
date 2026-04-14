import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p
          className="text-[8rem] font-black text-[var(--text-primary)] leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-display)', opacity: 0.08 }}
        >
          404
        </p>
        <h1
          className="text-2xl font-bold text-[var(--text-primary)] -mt-8 mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Sayfa Bulunamadı
        </h1>
        <p className="text-sm text-[var(--text-tertiary)] mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          href="/tr"
          className="inline-flex items-center gap-2 bg-[var(--text-primary)] text-[var(--text-inverse)] font-semibold px-6 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--accent-hover)] transition-colors text-sm"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
