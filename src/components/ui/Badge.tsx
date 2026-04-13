import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'linkedin' | 'twitter' | 'youtube' | 'instagram';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:   'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
  success:   'bg-[var(--success-muted)] text-[var(--success)] border border-[rgba(34,197,94,0.15)]',
  warning:   'bg-[var(--warning-muted)] text-[var(--warning)] border border-[rgba(245,158,11,0.15)]',
  error:     'bg-[var(--error-muted)] text-[var(--error)] border border-[rgba(239,68,68,0.15)]',
  info:      'bg-[var(--info-muted)] text-[var(--info)] border border-[rgba(99,102,241,0.15)]',
  linkedin:  'bg-[rgba(10,102,194,0.12)] text-[var(--linkedin)] border border-[rgba(10,102,194,0.2)]',
  twitter:   'bg-[rgba(29,161,242,0.12)] text-[var(--twitter)] border border-[rgba(29,161,242,0.2)]',
  youtube:   'bg-[rgba(255,0,0,0.10)] text-[var(--youtube)] border border-[rgba(255,0,0,0.2)]',
  instagram: 'bg-[rgba(228,64,95,0.10)] text-[var(--instagram)] border border-[rgba(228,64,95,0.2)]',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5',
        'text-xs font-medium rounded-[var(--radius-full)]',
        'whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
