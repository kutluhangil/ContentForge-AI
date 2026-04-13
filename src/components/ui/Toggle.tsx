'use client';

import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export function Toggle({ checked, onChange, label, disabled = false, size = 'md' }: ToggleProps) {
  return (
    <label className={cn('flex items-center gap-2.5 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative rounded-full transition-colors duration-200 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]',
          size === 'sm' ? 'w-8 h-4' : 'w-10 h-5',
          checked
            ? 'bg-[var(--text-primary)]'
            : 'bg-[var(--bg-elevated)] border border-[var(--border-default)]',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-transform duration-200',
            size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5',
            checked
              ? size === 'sm' ? 'translate-x-4' : 'translate-x-5'
              : 'translate-x-0.5',
          )}
        />
      </button>
      {label && (
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      )}
    </label>
  );
}
