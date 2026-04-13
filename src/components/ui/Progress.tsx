import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

const variantColors: Record<string, string> = {
  default: 'bg-[var(--accent-primary)]',
  success: 'bg-[var(--success)]',
  warning: 'bg-[var(--warning)]',
  error:   'bg-[var(--error)]',
};

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  className,
}: ProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const autoVariant = percentage >= 90 ? 'error' : percentage >= 70 ? 'warning' : variant;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm text-[var(--text-secondary)]">{label}</span>}
          {showValue && (
            <span className="text-sm text-[var(--text-tertiary)]">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full bg-[var(--bg-elevated)] rounded-[var(--radius-full)] overflow-hidden',
          size === 'sm' ? 'h-1' : 'h-2',
        )}
      >
        <div
          className={cn(
            'h-full rounded-[var(--radius-full)] transition-all duration-500',
            variantColors[autoVariant],
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
