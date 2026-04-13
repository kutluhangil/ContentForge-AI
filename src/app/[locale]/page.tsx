import { useTranslations } from 'next-intl';

// Placeholder landing page — full implementation in Faz 3
export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        gap: '24px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '13px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
          padding: '6px 16px',
          borderRadius: '9999px',
        }}
      >
        ContentForge — Phase 1 Complete
      </div>

      <h1
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          maxWidth: '700px',
        }}
      >
        One Content.
        <br />
        Every Platform.
      </h1>

      <p
        style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          maxWidth: '500px',
          lineHeight: 1.75,
        }}
      >
        Transform your blog, video, or podcast into platform-ready content in seconds.
        Powered by GPT-4o.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          style={{
            background: 'var(--text-primary)',
            color: 'var(--text-inverse)',
            fontWeight: 600,
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9375rem',
          }}
        >
          Try Free
        </button>
        <button
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            fontWeight: 500,
            padding: '12px 24px',
            borderRadius: '10px',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            fontSize: '0.9375rem',
          }}
        >
          Watch Demo
        </button>
      </div>

      <p
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
          marginTop: '16px',
        }}
      >
        Full UI coming in Faz 3. Foundation infrastructure is ready.
      </p>
    </main>
  );
}
