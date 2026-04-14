export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 skeleton rounded-[var(--radius-md)]" />
        <div className="h-4 w-32 skeleton rounded-[var(--radius-md)] mt-2" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 skeleton rounded-[var(--radius-xl)]"
          />
        ))}
      </div>

      {/* Recent conversions */}
      <div className="h-5 w-36 skeleton rounded mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 skeleton rounded-[var(--radius-lg)]" />
        ))}
      </div>
    </div>
  );
}
