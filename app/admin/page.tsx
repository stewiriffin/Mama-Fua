"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast, ToastContainer } from "../components/Toast";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import { exportToCSV, exportBookingsSummary } from "../utils/export";
import {
  formatPhoneNumber,
  formatCurrency,
  formatRelativeTime,
  formatDate,
} from "../utils/validation";
import {
  RevenueChart,
  BookingStatusChart,
  ActivityTimeline,
  TopCustomers,
} from "../components/StatisticsCharts";
import BookingReceipt from "../components/BookingReceipt";
import { KeyboardShortcutManager, SHORTCUTS } from "../utils/keyboard";
import KeyboardShortcutsModal from "../components/KeyboardShortcutsModal";
import ThemeToggle from "../components/ThemeToggle";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

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

export default function AdminDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingBooking, setDeletingBooking] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [shortcutManager] = useState(() => new KeyboardShortcutManager());
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [processingBulkAction, setProcessingBulkAction] = useState(false);

  useEffect(() => {
    // Check if user is logged in as admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.push("/user");
      return;
    }

    setUser(userData);
    fetchAllBookings();
  }, [router]);

  // Register keyboard shortcuts
  useEffect(() => {
    shortcutManager.register({
      ...SHORTCUTS.HELP,
      action: () => setShowShortcutsModal(true),
    });

    shortcutManager.register({
      ...SHORTCUTS.EXPORT,
      action: () => handleExportCSV(),
    });

    shortcutManager.register({
      ...SHORTCUTS.REFRESH,
      action: () => fetchAllBookings(),
    });

    shortcutManager.register({
      ...SHORTCUTS.SEARCH,
      action: () => document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus(),
    });

    shortcutManager.start();

    return () => {
      shortcutManager.stop();
    };
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const getPlanName = (planId: string) => {
    const plans: Record<string, string> = {
      basic: "Basic Wash",
      premium: "Premium Care",
      deluxe: "Deluxe Service",
    };
    return plans[planId] || planId;
  };

  const getPlanPrice = (planId: string) => {
    const prices: Record<string, number> = {
      basic: 50,
      premium: 75,
      deluxe: 100,
    };
    return prices[planId] || 0;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "basic":
        return "🧺";
      case "premium":
        return "✨";
      case "deluxe":
        return "👑";
      default:
        return "🧺";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-emerald-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "processing":
        return (
          <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "completed":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const calculateRevenue = () => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((total, booking) => {
        return total + getPlanPrice(booking.planId) * booking.weight;
      }, 0);
  };

  const calculateTotalWeight = () => {
    return bookings.reduce((total, booking) => total + booking.weight, 0);
  };

  const getUniqueCustomers = () => {
    const uniqueEmails = new Set(bookings.map((b) => b.email));
    return uniqueEmails.size;
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedBooking) return;

    setUpdatingStatus(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedBooking.id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setBookings(
          bookings.map((b) =>
            b.id === selectedBooking.id ? { ...b, status: newStatus } : b
          )
        );
        setShowStatusModal(false);
        toast.success(`Booking status updated to ${newStatus}!`);
      } else {
        toast.error(data.error || "Failed to update booking status");
      }
    } catch (error) {
      toast.error("An error occurred while updating booking status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }

    setDeletingBooking(bookingId);

    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingId));
        toast.success("Booking deleted successfully!");
      } else {
        toast.error(data.error || "Failed to delete booking");
      }
    } catch (error) {
      toast.error("An error occurred while deleting booking");
    } finally {
      setDeletingBooking(null);
    }
  };

  const handleExportAllCSV = () => {
    const filtered = filteredAndSortedBookings();
    if (filtered.length === 0) {
      toast.warning("No bookings to export");
      return;
    }
    exportToCSV(filtered, `mama-fua-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${filtered.length} bookings to CSV`);
  };

  const handleExportSummary = () => {
    if (bookings.length === 0) {
      toast.warning("No bookings data available");
      return;
    }
    exportBookingsSummary(bookings, `mama-fua-summary-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success("Summary exported successfully");
  };

  const toggleBookingSelection = (bookingId: string) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const toggleSelectAll = () => {
    const currentBookings = filteredAndSortedBookings();
    if (selectedBookings.length === currentBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(currentBookings.map((b) => b.id));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedBookings.length === 0) return;

    setProcessingBulkAction(true);

    try {
      if (bulkAction === "delete") {
        if (!confirm(`Are you sure you want to delete ${selectedBookings.length} bookings? This action cannot be undone.`)) {
          setProcessingBulkAction(false);
          return;
        }

        const deletePromises = selectedBookings.map((id) =>
          fetch(`/api/bookings?id=${id}`, { method: "DELETE" })
        );

        await Promise.all(deletePromises);
        setBookings(bookings.filter((b) => !selectedBookings.includes(b.id)));
        toast.success(`${selectedBookings.length} bookings deleted successfully!`);
      } else {
        // Update status for all selected bookings
        const updatePromises = selectedBookings.map((id) =>
          fetch("/api/bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: bulkAction }),
          })
        );

        await Promise.all(updatePromises);
        setBookings(
          bookings.map((b) =>
            selectedBookings.includes(b.id) ? { ...b, status: bulkAction } : b
          )
        );
        toast.success(`${selectedBookings.length} bookings updated to ${bulkAction}!`);
      }

      setSelectedBookings([]);
      setShowBulkActionsModal(false);
      setBulkAction("");
    } catch (error) {
      toast.error("An error occurred during bulk operation");
    } finally {
      setProcessingBulkAction(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Booking ID", "Customer", "Email", "Phone", "Address", "Plan", "Weight (kg)", "Total (KES)", "Date", "Status"];
    const csvData = filteredAndSortedBookings().map((booking) => [
      booking.id,
      booking.name,
      booking.email,
      booking.phone,
      booking.address,
      getPlanName(booking.planId),
      booking.weight,
      getPlanPrice(booking.planId) * booking.weight,
      new Date(booking.createdAt).toLocaleDateString(),
      booking.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mama-fua-bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAndSortedBookings = () => {
    let filtered = bookings.filter((booking) => {
      const matchesFilter = filter === "all" || booking.status === filter;
      const matchesSearch =
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const bookingDate = new Date(booking.createdAt);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (dateFilter) {
          case "today":
            matchesDate = bookingDate >= today;
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = bookingDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = bookingDate >= monthAgo;
            break;
        }
      }

      return matchesFilter && matchesSearch && matchesDate;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount-desc":
          return (
            getPlanPrice(b.planId) * b.weight -
            getPlanPrice(a.planId) * a.weight
          );
        case "amount-asc":
          return (
            getPlanPrice(a.planId) * a.weight -
            getPlanPrice(b.planId) * b.weight
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-emerald-100 text-sm">{user.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <ThemeToggle />
              <button onClick={() => router.push("/")} className="btn bg-white/20 hover:bg-white/30 text-sm px-4 py-2">Home</button>
              <button onClick={handleLogout} className="btn bg-emerald-700 hover:bg-blue-800 text-sm px-4 py-2">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold">{bookings.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "pending").length}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold">{bookings.filter((b) => b.status === "completed").length}</p>
          </div>
          <div className="card p-4 bg-emerald-600 text-white">
            <p className="text-sm text-emerald-100">Revenue</p>
            <p className="text-2xl font-bold">KES {calculateRevenue().toLocaleString()}</p>
          </div>
        </div>

        {/* Advanced Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart bookings={bookings} getPlanPrice={getPlanPrice} />
          <BookingStatusChart bookings={bookings} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ActivityTimeline bookings={bookings} />
          <TopCustomers bookings={bookings} />
        </div>

        {/* Filters and Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 mb-4 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-slate-50 dark:bg-slate-700 dark:text-white"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter("all")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "all" ? "bg-violet-600 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/30"}`}>
                All
              </button>
              <button onClick={() => setFilter("pending")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "pending" ? "bg-yellow-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"}`}>
                Pending
              </button>
              <button onClick={() => setFilter("processing")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "processing" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-blue-900/30"}`}>
                Processing
              </button>
              <button onClick={() => setFilter("completed")} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === "completed" ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"}`}>
                Completed
              </button>
            </div>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2.5 border-2 border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-700 dark:text-white">
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="amount-desc">High Amount</option>
              <option value="amount-asc">Low Amount</option>
            </select>

            {/* Actions */}
            <button onClick={handleExportCSV} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-500 transition-all flex items-center gap-2">
              {viewMode === "cards" ? (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> Table</>
              ) : (
                <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> Cards</>
              )}
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedBookings.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl shadow-lg p-4 mb-6 animate-slide-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-2">
                  <span className="font-bold">{selectedBookings.length} selected</span>
                </div>
                <button
                  onClick={() => setSelectedBookings([])}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg px-3 py-1 transition-all text-sm"
                >
                  Clear Selection
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setBulkAction("pending");
                    setShowBulkActionsModal(true);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Set Pending
                </button>
                <button
                  onClick={() => {
                    setBulkAction("processing");
                    setShowBulkActionsModal(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Set Processing
                </button>
                <button
                  onClick={() => {
                    setBulkAction("completed");
                    setShowBulkActionsModal(true);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Set Completed
                </button>
                <button
                  onClick={() => {
                    setBulkAction("delete");
                    setShowBulkActionsModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Bookings ({filteredAndSortedBookings().length})
          </h2>
        </div>

        {filteredAndSortedBookings().length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === "all" ? "No bookings found" : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search criteria"
                : `There are no ${filter === "all" ? "" : filter} bookings at the moment.`}
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAndSortedBookings().map((booking) => (
              <div
                key={booking.id}
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border-2 ${
                  selectedBookings.includes(booking.id)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-100 hover:border-purple-300"
                }`}
              >
                {/* Selection Checkbox */}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    checked={selectedBookings.includes(booking.id)}
                    onChange={() => toggleBookingSelection(booking.id)}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Select booking
                  </label>
                </div>

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getPlanIcon(booking.planId)}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {booking.name}
                      </h3>
                      <p className="text-sm text-gray-500">{booking.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border-2 flex items-center gap-1 ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>

                {/* Card Details */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Plan</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {getPlanName(booking.planId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Weight</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {booking.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total</p>
                      <p className="font-bold text-lg text-purple-600">
                        KES {getPlanPrice(booking.planId) * booking.weight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowStatusModal(true);
                    }}
                    className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    disabled={deletingBooking === booking.id}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                  >
                    {deletingBooking === booking.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredAndSortedBookings().length > 0 &&
                          selectedBookings.length === filteredAndSortedBookings().length
                        }
                        onChange={toggleSelectAll}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedBookings().map((booking) => (
                    <tr
                      key={booking.id}
                      className={`transition-colors ${
                        selectedBookings.includes(booking.id)
                          ? "bg-purple-100"
                          : "hover:bg-purple-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={() => toggleBookingSelection(booking.id)}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-900">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.name}
                        </div>
                        <div className="text-sm text-gray-500">{booking.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.phone}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {booking.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl">{getPlanIcon(booking.planId)}</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {getPlanName(booking.planId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {booking.weight} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                        KES {getPlanPrice(booking.planId) * booking.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border-2 inline-flex items-center gap-1 ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                            }}
                            className="text-emerald-600 hover:text-blue-800 font-semibold"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowStatusModal(true);
                            }}
                            className="text-yellow-600 hover:text-yellow-800 font-semibold"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Booking Details</h3>
                  <p className="text-purple-100 text-sm">
                    Complete information for booking {selectedBooking.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <span
                  className={`px-6 py-3 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getStatusColor(
                    selectedBooking.status
                  )}`}
                >
                  {getStatusIcon(selectedBooking.status)}
                  {selectedBooking.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Booking Info */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Booking Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                      <p className="font-mono font-bold text-gray-900">
                        {selectedBooking.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedBooking.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Service Plan</p>
                      <p className="font-semibold text-gray-900">
                        {getPlanIcon(selectedBooking.planId)}{" "}
                        {getPlanName(selectedBooking.planId)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Weight</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.weight} kg
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Customer Info
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.phone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">
                        {selectedBooking.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Pricing Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Rate per kg</span>
                    <span className="font-semibold">
                      KES {getPlanPrice(selectedBooking.planId)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Weight</span>
                    <span className="font-semibold">{selectedBooking.weight} kg</span>
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      KES{" "}
                      {getPlanPrice(selectedBooking.planId) * selectedBooking.weight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowReceiptModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowStatusModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Update Status</h3>
                  <p className="text-yellow-100 text-sm">
                    Change booking status for {selectedBooking.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Current status:{" "}
                <span className="font-bold text-gray-900">
                  {selectedBooking.status.toUpperCase()}
                </span>
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateStatus("pending")}
                  disabled={updatingStatus || selectedBooking.status === "pending"}
                  className="w-full bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {getStatusIcon("pending")}
                  Set as Pending
                </button>
                <button
                  onClick={() => handleUpdateStatus("processing")}
                  disabled={updatingStatus || selectedBooking.status === "processing"}
                  className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {getStatusIcon("processing")}
                  Set as Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus("completed")}
                  disabled={updatingStatus || selectedBooking.status === "completed"}
                  className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {getStatusIcon("completed")}
                  Set as Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={updatingStatus || selectedBooking.status === "cancelled"}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {getStatusIcon("cancelled")}
                  Set as Cancelled
                </button>
              </div>

              <button
                onClick={() => setShowStatusModal(false)}
                className="w-full mt-4 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedBooking && (
        <BookingReceipt
          booking={selectedBooking}
          getPlanName={getPlanName}
          getPlanPrice={getPlanPrice}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <KeyboardShortcutsModal
          shortcuts={shortcutManager.getShortcuts()}
          onClose={() => setShowShortcutsModal(false)}
        />
      )}

      {/* Bulk Actions Confirmation Modal */}
      {showBulkActionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className={`p-6 rounded-t-2xl ${
              bulkAction === "delete"
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-purple-600 to-blue-600"
            } text-white`}>
              <h3 className="text-2xl font-bold mb-2">Confirm Bulk Action</h3>
              <p className="text-sm opacity-90">
                You are about to perform an action on {selectedBookings.length} bookings
              </p>
            </div>

            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {bulkAction === "delete"
                        ? "This will permanently delete the selected bookings. This action cannot be undone."
                        : `This will update the status of ${selectedBookings.length} bookings to "${bulkAction}".`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-2">Selected bookings:</p>
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <ul className="space-y-1">
                    {selectedBookings.slice(0, 10).map((id) => (
                      <li key={id} className="text-sm text-gray-600 font-mono">
                        • {id}
                      </li>
                    ))}
                    {selectedBookings.length > 10 && (
                      <li className="text-sm text-gray-500 italic">
                        ... and {selectedBookings.length - 10} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBulkAction}
                  disabled={processingBulkAction}
                  className={`flex-1 ${
                    bulkAction === "delete"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  } text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg disabled:opacity-50`}
                >
                  {processingBulkAction ? "Processing..." : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setShowBulkActionsModal(false);
                    setBulkAction("");
                  }}
                  disabled={processingBulkAction}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
