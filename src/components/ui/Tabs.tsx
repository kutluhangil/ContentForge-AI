'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'flex gap-0.5 bg-[var(--bg-tertiary)] p-1 rounded-[var(--radius-md)]',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-sm)]',
            'text-sm font-medium transition-all duration-[var(--duration-fast)]',
            activeTab === tab.id
              ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
