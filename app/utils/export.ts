// CSV Export Utility

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  planId: string;
  weight: number;
  createdAt: string;
  status: string;
}

export function exportToCSV(bookings: Booking[], filename: string = "bookings.csv") {
  // Define CSV headers
  const headers = [
    "Booking ID",
    "Customer Name",
    "Email",
    "Phone",
    "Address",
    "Service Plan",
    "Weight (kg)",
    "Created Date",
    "Status",
  ];

  // Convert bookings to CSV rows
  const rows = bookings.map((booking) => [
    booking.id,
    booking.name,
    booking.email,
    booking.phone,
    `"${booking.address.replace(/"/g, '""')}"`, // Escape quotes in address
    booking.planId,
    booking.weight.toString(),
    new Date(booking.createdAt).toLocaleString(),
    booking.status,
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBookingsSummary(bookings: Booking[], filename: string = "bookings-summary.csv") {
  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    processing: bookings.filter((b) => b.status === "processing").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const csvContent = [
    ["Metric", "Value"],
    ["Total Bookings", stats.totalBookings.toString()],
    ["Pending", stats.pending.toString()],
    ["Processing", stats.processing.toString()],
    ["Completed", stats.completed.toString()],
    ["Cancelled", stats.cancelled.toString()],
  ]
    .map((row) => row.join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
