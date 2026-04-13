import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ width, height, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width,
        height: height ?? 16,
        ...style,
      }}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 flex flex-col gap-3">
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} width="40%" />
      <div className="flex gap-2 mt-2">
        <Skeleton height={24} width={60} />
        <Skeleton height={24} width={80} />
      </div>
    </div>
  );
}
