'use client';

import { useState, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positionClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  function show() {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setVisible(true), 200);
  }

  function hide() {
    clearTimeout(timeout.current);
    setVisible(false);
  }

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium',
            'bg-[var(--bg-elevated)] text-[var(--text-primary)]',
            'border border-[var(--border-default)] rounded-[var(--radius-sm)]',
            'shadow-[var(--shadow-md)] whitespace-nowrap pointer-events-none',
            'animate-in fade-in-0 zoom-in-95 duration-150',
            positionClasses[side],
            className,
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
