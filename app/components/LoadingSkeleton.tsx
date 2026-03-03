export function BookingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-300 rounded w-32"></div>
          <div className="h-6 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-gray-300 rounded-xl flex-1"></div>
        <div className="h-10 bg-gray-300 rounded-xl flex-1"></div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        <div className="h-6 w-16 bg-gray-300 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-gray-300 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-40"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-28"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2 flex-1">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-gray-300 rounded-xl"></div>
              <div className="h-12 w-24 bg-gray-300 rounded-xl"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
          <StatsCardSkeleton />
        </div>

        {/* Bookings Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
          <BookingCardSkeleton />
        </div>
      </div>
    </div>
  );
}
