"use client";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  planId: string;
  weight: number;
  status: string;
  createdAt: string;
}

interface StatsProps {
  bookings: Booking[];
  getPlanPrice: (planId: string) => number;
}

export function RevenueChart({ bookings, getPlanPrice }: StatsProps) {
  // Calculate revenue by plan
  const revenueByPlan = bookings
    .filter((b) => b.status === "completed")
    .reduce((acc, booking) => {
      const revenue = getPlanPrice(booking.planId) * booking.weight;
      acc[booking.planId] = (acc[booking.planId] || 0) + revenue;
      return acc;
    }, {} as Record<string, number>);

  const plans = [
    { id: "basic", name: "Basic", color: "bg-emerald-500" },
    { id: "premium", name: "Premium", color: "bg-purple-500" },
    { id: "deluxe", name: "Deluxe", color: "bg-amber-500" },
  ];

  const maxRevenue = Math.max(...Object.values(revenueByPlan), 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Service Plan</h3>
      <div className="space-y-4">
        {plans.map((plan) => {
          const revenue = revenueByPlan[plan.id] || 0;
          const percentage = (revenue / maxRevenue) * 100;

          return (
            <div key={plan.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700">{plan.name}</span>
                <span className="text-sm font-bold text-gray-900">KES {revenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full ${plan.color} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function BookingStatusChart({ bookings }: { bookings: Booking[] }) {
  const statusCounts = bookings.reduce((acc, booking) => {
    acc[booking.status] = (acc[booking.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statuses = [
    { id: "pending", name: "Pending", color: "bg-yellow-500", icon: "⏳" },
    { id: "processing", name: "Processing", color: "bg-emerald-500", icon: "🔄" },
    { id: "completed", name: "Completed", color: "bg-green-500", icon: "✅" },
    { id: "cancelled", name: "Cancelled", color: "bg-red-500", icon: "❌" },
  ];

  const total = bookings.length || 1;

  // Build chart segments
  const buildChartSegments = () => {
    const colors = {
      "bg-yellow-500": "#eab308",
      "bg-emerald-500": "#3b82f6",
      "bg-green-500": "#22c55e",
      "bg-red-500": "#ef4444",
    };

    let offset = 0;
    return statuses.map((status) => {
      const count = statusCounts[status.id] || 0;
      const percentage = (count / total) * 100;
      const color = colors[status.color as keyof typeof colors];

      const strokeDasharray = `${percentage} ${100 - percentage}`;
      const strokeDashoffset = -offset;

      offset += percentage;

      return (
        <circle
          key={status.id}
          cx="50"
          cy="50"
          r="15.915"
          fill="transparent"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      );
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Status Distribution</h3>

      {/* Donut Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="transform -rotate-90" viewBox="0 0 100 100">
            {buildChartSegments()}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {statuses.map((status) => {
          const count = statusCounts[status.id] || 0;
          const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";

          return (
            <div key={status.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <div className={`w-3 h-3 ${status.color} rounded-full`} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-700">{status.name}</div>
                <div className="text-xs text-gray-500">
                  {count} ({percentage}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ActivityTimeline({ bookings }: { bookings: Booking[] }) {
  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const bookingsByDate = last7Days.map(date => {
    const count = bookings.filter(b =>
      b.createdAt.startsWith(date)
    ).length;
    return { date, count };
  });

  const maxCount = Math.max(...bookingsByDate.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">7-Day Activity</h3>
      <div className="flex items-end justify-between gap-2 h-48">
        {bookingsByDate.map((day, index) => {
          const height = (day.count / maxCount) * 100;
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t-lg relative flex items-end" style={{ height: '100%' }}>
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-lg transition-all duration-500 hover:from-purple-700 hover:to-blue-600 cursor-pointer relative group"
                  style={{ height: `${height}%` }}
                >
                  {day.count > 0 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.count}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-600">{dayName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TopCustomers({ bookings }: { bookings: Booking[] }) {
  // Aggregate by customer email
  const customerStats = bookings.reduce((acc, booking) => {
    if (!acc[booking.email]) {
      acc[booking.email] = {
        email: booking.email,
        count: 0,
        totalWeight: 0,
      };
    }
    acc[booking.email].count++;
    acc[booking.email].totalWeight += booking.weight;
    return acc;
  }, {} as Record<string, { email: string; count: number; totalWeight: number }>);

  const topCustomers = Object.values(customerStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (topCustomers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Top Customers</h3>
        <p className="text-gray-500 text-center py-8">No customer data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Top 5 Customers</h3>
      <div className="space-y-3">
        {topCustomers.map((customer, index) => (
          <div
            key={customer.email}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{customer.email}</div>
              <div className="text-xs text-gray-600">
                {customer.count} bookings • {customer.totalWeight}kg total
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
