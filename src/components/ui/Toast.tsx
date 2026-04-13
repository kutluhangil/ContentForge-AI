'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Toast as ToastType, ToastType as ToastVariant } from '@/hooks/useToast';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const icons: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={16} />,
  error: <AlertCircle size={16} />,
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
};

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-[rgba(34,197,94,0.2)] bg-[var(--bg-secondary)] text-[var(--success)]',
  error:   'border-[rgba(239,68,68,0.2)] bg-[var(--bg-secondary)] text-[var(--error)]',
  info:    'border-[rgba(99,102,241,0.2)] bg-[var(--bg-secondary)] text-[var(--info)]',
  warning: 'border-[rgba(245,158,11,0.2)] bg-[var(--bg-secondary)] text-[var(--warning)]',
};

interface ToastItemProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export function ToastItem({ toast, onRemove }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 px-4 py-3 rounded-[var(--radius-lg)]',
        'border shadow-[var(--shadow-lg)] backdrop-blur-[12px]',
        'animate-in slide-in-from-right-5 fade-in duration-300',
        variantClasses[toast.type],
      )}
    >
      <span className="shrink-0 mt-0.5">{icons[toast.type]}</span>
      <p className="text-sm font-medium text-[var(--text-primary)] flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 w-[360px] max-w-[calc(100vw-48px)]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}
