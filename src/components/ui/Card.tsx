import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, glass = false, padding = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)]',
          glass && 'backdrop-blur-[20px] bg-[var(--bg-glass)]',
          hover && [
            'transition-all duration-[var(--duration-normal)] cursor-pointer',
            'hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5',
          ],
          paddingClasses[padding],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
