import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]',
              'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
              'rounded-[var(--radius-md)] px-3.5 py-2.75 text-[0.9375rem]',
              'transition-colors duration-[var(--duration-fast)]',
              'outline-none focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_rgba(228,228,231,0.06)]',
              error && 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-[var(--error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'rounded-[var(--radius-md)] px-3.5 py-3 text-[0.9375rem]',
            'transition-colors duration-[var(--duration-fast)] resize-y min-h-[120px]',
            'outline-none focus:border-[var(--border-focus)] focus:shadow-[0_0_0_3px_rgba(228,228,231,0.06)]',
            error && 'border-[var(--error)]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--error)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
