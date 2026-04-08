export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-200 rounded" />
      </div>

      {/* Banner */}
      <div className="h-16 w-full bg-amber-50 rounded-lg border border-amber-100" />

      {/* Card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
              <div className="h-4 w-1/3 bg-gray-100 rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-gray-200 rounded" />
                <div className="h-8 w-8 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
