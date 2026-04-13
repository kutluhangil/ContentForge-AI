'use client';

import { useState } from 'react';
import type { RepurposeRequest, ConversionResult } from '@/types/repurpose';

export function useRepurpose() {
  const [loading, setLoading] = useState(false);
  const [conversionId, setConversionId] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startConversion(payload: RepurposeRequest): Promise<string | null> {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Dönüşüm başlatılamadı');
      }

      setConversionId(data.conversion_id);
      return data.conversion_id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function fetchResult(id: string): Promise<ConversionResult | null> {
    try {
      const res = await fetch(`/api/repurpose/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Sonuç alınamadı');

      setResult(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      return null;
    }
  }

  function reset() {
    setLoading(false);
    setConversionId(null);
    setResult(null);
    setError(null);
  }

  return { loading, conversionId, result, error, startConversion, fetchResult, reset };
}
