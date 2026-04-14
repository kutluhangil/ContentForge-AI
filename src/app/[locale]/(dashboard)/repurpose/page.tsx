'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRepurposeStore } from '@/stores/repurpose-store';
import { SourceSelector } from '@/components/repurpose/SourceSelector';
import { FormatPicker } from '@/components/repurpose/FormatPicker';
import { ToneSelector } from '@/components/repurpose/ToneSelector';
import { ResultCard } from '@/components/repurpose/ResultCard';
import { UsageAlert } from '@/components/billing/UsageAlert';
import { Button } from '@/components/ui/Button';
import type { PlanSlug } from '@/types/plans';

interface Output {
  id: string;
  format: string;
  content: string;
  word_count: number | null;
  is_edited: boolean;
  edited_content: string | null;
}

interface ConversionResult {
  id: string;
  status: string;
  error_message: string | null;
  outputs: Output[];
}

type PageState = 'idle' | 'transcribing' | 'submitting' | 'polling' | 'done' | 'error';

export default function RepurposePage() {
  const supabase = createClient();
  const store = useRepurposeStore();

  const [pageState, setPageState] = useState<PageState>('idle');
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [plan, setPlan] = useState<PlanSlug>('free');
  const [usageUsed, setUsageUsed] = useState(0);
  const [usageLimit, setUsageLimit] = useState(3);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const periodStart = new Date();
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);

      const [{ data: sub }, { data: usage }] = await Promise.all([
        supabase.from('subscriptions').select('plan_slug').eq('user_id', user.id).single(),
        supabase.from('usage').select('conversions_used, conversions_limit').eq('user_id', user.id).eq('period_start', periodStart.toISOString().split('T')[0]).single(),
      ]);

      if (sub?.plan_slug) setPlan(sub.plan_slug as PlanSlug);
      if (usage) {
        setUsageUsed(usage.conversions_used);
        setUsageLimit(usage.conversions_limit);
      }
    }
    loadPlan();
  }, [supabase]);

  const pollResult = useCallback(async (id: string) => {
    const res = await fetch(`/api/repurpose/${id}`);
    if (!res.ok) return;

    const data = await res.json() as ConversionResult;

    if (data.status === 'completed') {
      setResult(data);
      setPageState('done');
    } else if (data.status === 'failed') {
      setErrorMsg(data.error_message ?? 'Dönüşüm başarısız.');
      setPageState('error');
    } else {
      // Still processing — poll again in 3s
      pollRef.current = setTimeout(() => pollResult(id), 3000);
    }
  }, []);

  useEffect(() => {
    if (conversionId && pageState === 'polling') {
      pollResult(conversionId);
    }
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  }, [conversionId, pageState, pollResult]);

  async function handleSubmit() {
    const { sourceType, sourceUrl, sourceText, selectedFormats, tone, language, customPrompt } = store;

    // Basic validation
    if (sourceType === 'blog_url' || sourceType === 'youtube') {
      if (!sourceUrl.trim()) { setErrorMsg('Lütfen bir URL girin.'); setPageState('error'); return; }
    } else if (sourceType === 'blog_text') {
      if (!sourceText.trim()) { setErrorMsg('Lütfen metin girin.'); setPageState('error'); return; }
    } else if ((sourceType === 'audio' || sourceType === 'pdf') && !sourceText.trim()) {
      setErrorMsg('Önce dosyayı yükleyip transkript oluşturun.'); setPageState('error'); return;
    }

    if (selectedFormats.length === 0) {
      setErrorMsg('En az bir format seçin.'); setPageState('error'); return;
    }

    setPageState('submitting');
    setErrorMsg('');

    const body: Record<string, unknown> = { sourceType, formats: selectedFormats, language, tone, customPrompt: customPrompt || undefined };
    if (sourceType === 'blog_url' || sourceType === 'youtube') body.sourceUrl = sourceUrl;
    else body.sourceText = sourceText;

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { id?: string; error?: string };

      if (!res.ok || !data.id) {
        setErrorMsg(data.error ?? 'Bir hata oluştu.');
        setPageState('error');
        return;
      }

      setConversionId(data.id);
      setPageState('polling');
    } catch {
      setErrorMsg('Bağlantı hatası. Lütfen tekrar deneyin.');
      setPageState('error');
    }
  }

  async function handleSaveEdit(outputId: string, content: string) {
    await supabase.from('outputs').update({ is_edited: true, edited_content: content, content }).eq('id', outputId);
    if (result) {
      setResult({
        ...result,
        outputs: result.outputs.map((o) => o.id === outputId ? { ...o, content, is_edited: true } : o),
      });
    }
  }

  function handleReset() {
    store.reset();
    setResult(null);
    setConversionId(null);
    setPageState('idle');
    setErrorMsg('');
  }

  const isProcessing = pageState === 'submitting' || pageState === 'polling' || pageState === 'transcribing';

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)]">
          <Zap size={20} className="text-[var(--text-secondary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-display)' }}>
            Yeni Dönüşüm
          </h1>
          <p className="text-sm text-[var(--text-tertiary)]">İçeriğinizi tüm platformlar için dönüştürün.</p>
        </div>
      </div>

      {/* Usage Alert */}
      <div className="mb-6">
        <UsageAlert used={usageUsed} limit={usageLimit} plan={plan} />
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {pageState === 'done' && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">
                Sonuçlar — {result.outputs.length} format
              </h2>
              <button onClick={handleReset} className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                ← Yeni dönüşüm
              </button>
            </div>
            {result.outputs.map((o) => (
              <ResultCard
                key={o.id}
                outputId={o.id}
                format={o.format as import('@/types/repurpose').OutputFormat}
                content={o.edited_content ?? o.content}
                wordCount={o.word_count}
                isEdited={o.is_edited}
                onSaveEdit={handleSaveEdit}
              />
            ))}
          </motion.div>
        )}

        {pageState !== 'done' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="space-y-6">
              {/* Source */}
              <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
                <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Kaynak İçerik</h2>
                <SourceSelector
                  transcribing={pageState === 'transcribing'}
                  setTranscribing={(v) => setPageState(v ? 'transcribing' : 'idle')}
                  onFileTranscribed={(text) => store.setSourceText(text)}
                />
              </div>

              {/* Formats */}
              <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
                <FormatPicker plan={plan} />
              </div>

              {/* Tone + Language */}
              <div className="p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)]">
                <ToneSelector />

                {plan === 'pro' && (
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                      Özel Prompt (opsiyonel)
                    </label>
                    <textarea
                      rows={3}
                      value={store.customPrompt}
                      onChange={(e) => store.setCustomPrompt(e.target.value)}
                      placeholder="Ek yönergeler ekleyin... (Pro plan)"
                      className="w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--border-hover)] resize-none"
                      maxLength={500}
                    />
                  </div>
                )}
              </div>

              {/* Error */}
              {(pageState === 'error') && errorMsg && (
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-[var(--radius-lg)] text-sm text-[var(--error)]">
                  <AlertCircle size={15} className="shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Processing status */}
              {isProcessing && (
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] text-sm text-[var(--text-secondary)]">
                  <Loader2 size={15} className="animate-spin text-[var(--text-tertiary)]" />
                  {pageState === 'transcribing' && 'Ses transkript ediliyor...'}
                  {pageState === 'submitting' && 'Görev gönderiliyor...'}
                  {pageState === 'polling' && 'GPT-4o ile dönüşüm yapılıyor...'}
                </div>
              )}

              {/* Submit */}
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isProcessing || usageUsed >= usageLimit}
                className="w-full"
              >
                {isProcessing ? (
                  <><Loader2 size={16} className="animate-spin" /> İşleniyor...</>
                ) : (
                  <><Zap size={16} /> Dönüştür</>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
