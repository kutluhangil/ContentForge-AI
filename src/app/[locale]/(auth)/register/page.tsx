'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="success-icon">✓</div>
          <h2 className="auth-title" style={{ textAlign: 'center' }}>E-postanızı doğrulayın</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{email}</strong> adresine bir doğrulama linki gönderdik.
            E-postanızı kontrol edin.
          </p>
        </div>
        <style jsx>{`
          .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); padding: 24px; }
          .auth-card { width: 100%; max-width: 400px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 40px; display: flex; flex-direction: column; gap: 16px; align-items: center; }
          .success-icon { width: 56px; height: 56px; background: var(--success-muted); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--success); font-size: 1.5rem; font-weight: 700; }
          .auth-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin: 0; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-text">ContentForge</span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">{t('register_title')}</h1>
          <p className="auth-subtitle">{t('register_subtitle')}</p>
        </div>

        <button onClick={handleGoogleLogin} disabled={googleLoading} className="btn-oauth" type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {googleLoading ? tc('loading') : t('google_login')}
        </button>

        <div className="divider"><span>{tc('or')}</span></div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-group">
            <label className="form-label">{t('full_name')}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="form-input"
              placeholder="Adınız Soyadınız"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="ornek@mail.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="En az 8 karakter"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary-full">
            {loading ? tc('loading') : t('register_btn')}
          </button>

          <p className="terms-text">
            {t('agree_prefix')}{' '}
            <Link href="#" className="auth-link">{t('terms')}</Link>
            {' '}ve{' '}
            <Link href="#" className="auth-link">{t('privacy')}</Link>
            {t('agree_suffix')}
          </p>
        </form>

        <p className="auth-switch">
          {t('have_account')}{' '}
          <Link href="./login" className="auth-link">{t('login_link')}</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-primary); padding: 24px; }
        .auth-card { width: 100%; max-width: 400px; background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); padding: 40px; display: flex; flex-direction: column; gap: 20px; }
        .auth-logo { text-align: center; }
        .logo-text { font-family: var(--font-display); font-weight: 700; font-size: 1.25rem; color: var(--text-primary); letter-spacing: -0.02em; }
        .auth-header { text-align: center; }
        .auth-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.02em; margin: 0 0 6px; }
        .auth-subtitle { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }
        .btn-oauth { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; background: transparent; border: 1px solid var(--border-default); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-size: 0.9375rem; font-weight: 500; cursor: pointer; transition: all var(--duration-fast) var(--ease-out); }
        .btn-oauth:hover { border-color: var(--border-hover); background: var(--bg-elevated); }
        .btn-oauth:disabled { opacity: 0.5; cursor: not-allowed; }
        .divider { display: flex; align-items: center; gap: 12px; color: var(--text-tertiary); font-size: 0.8125rem; }
        .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border-subtle); }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .error-banner { background: var(--error-muted); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: var(--radius-md); padding: 12px; font-size: 0.875rem; color: var(--error); }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
        .form-input { width: 100%; background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 11px 14px; color: var(--text-primary); font-size: 0.9375rem; font-family: var(--font-body); transition: border-color var(--duration-fast) var(--ease-out); outline: none; }
        .form-input::placeholder { color: var(--text-tertiary); }
        .form-input:focus { border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(228, 228, 231, 0.06); }
        .btn-primary-full { width: 100%; background: var(--text-primary); color: var(--text-inverse); font-weight: 600; font-size: 0.9375rem; font-family: var(--font-body); padding: 12px; border: none; border-radius: var(--radius-md); cursor: pointer; transition: all var(--duration-fast) var(--ease-out); }
        .btn-primary-full:hover { background: var(--accent-hover); box-shadow: 0 0 20px rgba(255,255,255,0.1); }
        .btn-primary-full:disabled { opacity: 0.5; cursor: not-allowed; }
        .terms-text { font-size: 0.8125rem; color: var(--text-tertiary); text-align: center; line-height: 1.5; }
        .auth-switch { text-align: center; font-size: 0.875rem; color: var(--text-tertiary); margin: 0; }
        .auth-link { color: var(--text-primary); text-decoration: none; font-weight: 500; transition: color var(--duration-fast) var(--ease-out); }
        .auth-link:hover { color: var(--accent-hover); }
      `}</style>
    </div>
  );
}
