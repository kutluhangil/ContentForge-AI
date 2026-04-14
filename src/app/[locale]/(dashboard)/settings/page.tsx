'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Globe, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface Profile {
  full_name: string | null;
  email: string;
  locale: 'tr' | 'en';
}

type Section = 'profile' | 'password';

export default function SettingsPage() {
  const supabase = createClient();
  const t = useTranslations('settings');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [section, setSection] = useState<Section>('profile');
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [locale, setLocale] = useState<'tr' | 'en'>('tr');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from('profiles')
        .select('full_name, email, locale')
        .eq('id', user.id)
        .single();

      if (p) {
        setProfile(p as Profile);
        setFullName(p.full_name ?? '');
        setLocale(p.locale);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function handleSaveProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSavingProfile(true);
    await supabase.from('profiles').update({ full_name: fullName, locale }).eq('id', user.id);
    setSavingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  async function handleChangePassword() {
    setPasswordError('');

    if (newPassword.length < 8) {
      setPasswordError(t('error_password_length'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t('error_password_match'));
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    }
  }

  const navItems: { key: Section; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: t('section_profile'), icon: User },
    { key: 'password', label: t('section_password'), icon: Lock },
  ];

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
          <User size={20} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {t('title')}
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">{t('subtitle')}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Nav */}
        <div className="flex flex-col gap-1 w-36 shrink-0">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSection(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-colors ${
                section === key
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)]'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex-1 space-y-3">
            {[1,2,3].map((i) => <div key={i} className="h-12 skeleton rounded-[var(--radius-md)]" />)}
          </div>
        ) : (
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 space-y-4"
          >
            {section === 'profile' && (
              <>
                <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] space-y-4">
                  <Input
                    label={t('full_name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('full_name_placeholder')}
                  />
                  <Input
                    label={t('email')}
                    value={profile?.email ?? ''}
                    disabled
                    hint={t('email_hint')}
                  />

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                      <Globe size={12} className="inline mr-1" />
                      {t('ui_language')}
                    </label>
                    <div className="flex gap-2">
                      {(['tr', 'en'] as const).map((l) => (
                        <button
                          key={l}
                          onClick={() => setLocale(l)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-all ${
                            locale === l
                              ? 'bg-[var(--text-primary)] text-[var(--text-inverse)]'
                              : 'bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
                          }`}
                        >
                          {l === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="w-full"
                >
                  {savingProfile ? (
                    <><Loader2 size={14} className="animate-spin" /> {t('saving')}</>
                  ) : profileSaved ? (
                    <><Check size={14} /> {t('saved')}</>
                  ) : (
                    t('save')
                  )}
                </Button>
              </>
            )}

            {section === 'password' && (
              <>
                <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] space-y-4">
                  <Input
                    label={t('current_password')}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Input
                    label={t('new_password')}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('new_password_placeholder')}
                  />
                  <Input
                    label={t('confirm_password')}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('confirm_password_placeholder')}
                    error={passwordError}
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="w-full"
                >
                  {savingPassword ? (
                    <><Loader2 size={14} className="animate-spin" /> {t('updating')}</>
                  ) : passwordSaved ? (
                    <><Check size={14} /> {t('password_updated')}</>
                  ) : (
                    t('update_password')
                  )}
                </Button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
