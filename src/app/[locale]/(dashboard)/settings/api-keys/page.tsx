'use client';

import { useState, useEffect } from 'react';
import { Key, Copy, Check, Eye, EyeOff, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function ApiKeysPage() {
  const supabase = createClient();
  const t = useTranslations('settings');

  const [plan, setPlan] = useState<string>('free');
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('plan_slug')
        .eq('user_id', user.id)
        .single();

      if (sub?.plan_slug) setPlan(sub.plan_slug);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function handleCopy() {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleGenerate() {
    setGenerating(true);
    // In a real implementation this would call a backend API
    // to generate and store the key. For now we generate a placeholder.
    await new Promise((r) => setTimeout(r, 800));
    const key = `cf_${Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join('')}`;
    setApiKey(key);
    setVisible(true);
    setGenerating(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={24} className="animate-spin text-[var(--text-tertiary)]" />
      </div>
    );
  }

  const hasAccess = plan === 'pro';

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
          <Key size={20} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            {t('api_keys_title')}
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">{t('api_keys_desc')}</p>
        </div>
      </div>

      {!hasAccess ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] text-center"
        >
          <AlertCircle size={32} className="mx-auto text-[var(--text-tertiary)] mb-3" />
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">{t('api_keys_pro_only')}</h3>
          <p className="text-sm text-[var(--text-tertiary)] mb-4">{t('api_keys_pro_only_desc')}</p>
          <Badge variant="default">Pro</Badge>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Key display */}
          <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{t('api_keys_your_key')}</h3>
              <Badge variant="success">Active</Badge>
            </div>

            {apiKey ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] font-mono text-sm text-[var(--text-secondary)]">
                  {visible ? apiKey : apiKey.replace(/(?<=^.{6}).(?=.{4}$)/g, '').slice(0, 6) + '••••••••••••••••••••••••••' + apiKey.slice(-4)}
                </div>
                <button
                  onClick={() => setVisible(!visible)}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {copied ? <Check size={16} className="text-[var(--success)]" /> : <Copy size={16} />}
                </button>
              </div>
            ) : (
              <p className="text-sm text-[var(--text-tertiary)]">{t('api_keys_none')}</p>
            )}
          </div>

          {/* Generate / Regenerate */}
          <Button
            variant={apiKey ? 'ghost' : 'primary'}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? (
              <><Loader2 size={16} className="animate-spin" /> {t('api_keys_generating')}</>
            ) : apiKey ? (
              <><RefreshCw size={16} /> {t('api_keys_regenerate')}</>
            ) : (
              <><Key size={16} /> {t('api_keys_generate')}</>
            )}
          </Button>

          {/* Usage notes */}
          <div className="p-4 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-xs text-[var(--text-tertiary)] space-y-1">
            <p>{t('api_keys_note_1')}</p>
            <p>{t('api_keys_note_2')}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
