'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ── Root ── */
interface DropdownMenuProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  return <div className={cn('relative inline-flex', className)}>{children}</div>;
}

/* ── Trigger ── */
interface DropdownTriggerProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function DropdownTrigger({ children, onClick, className }: DropdownTriggerProps) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}

/* ── Content ── */
interface DropdownContentProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

export function DropdownContent({ open, onClose, children, align = 'end', className }: DropdownContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'absolute z-50 mt-1.5 min-w-[180px] py-1.5',
            'bg-[var(--bg-secondary)] border border-[var(--border-subtle)]',
            'rounded-[var(--radius-md)] shadow-[var(--shadow-lg)]',
            align === 'end' ? 'right-0' : 'left-0',
            'top-full',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Item ── */
interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
}

export function DropdownItem({ children, onClick, danger, disabled, className }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
        'transition-colors duration-[var(--duration-fast)]',
        danger
          ? 'text-[var(--error)] hover:bg-[var(--error-muted)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ── Separator ── */
export function DropdownSeparator() {
  return <div className="my-1.5 border-t border-[var(--border-subtle)]" />;
}
