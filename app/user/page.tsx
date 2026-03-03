"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast, ToastContainer } from "../components/Toast";
import { DashboardSkeleton } from "../components/LoadingSkeleton";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateWeight,
  formatPhoneNumber,
  formatCurrency,
  formatRelativeTime,
} from "../utils/validation";

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

export default function UserDashboard() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [cancelingBooking, setCancelingBooking] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    planId: "premium",
    weight: 0,
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "user") {
      router.push("/admin");
      return;
    }

    setUser(userData);
    fetchUserBookings(userData.email);
  }, [router]);

  const fetchUserBookings = async (email: string) => {
    try {
      const response = await fetch("/api/bookings");
      const data = await response.json();

      if (data.success) {
        // Filter bookings for current user
        const userBookings = data.bookings.filter(
          (b: Booking) => b.email === email
        );
        setBookings(userBookings);
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
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
      case "processing":
        return "bg-emerald-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700";
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

  const calculateTotalSpent = () => {
    return bookings
      .filter((b) => b.status === "completed")
      .reduce((total, booking) => {
        return total + getPlanPrice(booking.planId) * booking.weight;
      }, 0);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancelingBooking(bookingId);
    // Simulate API call to cancel booking
    setTimeout(() => {
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      setCancelingBooking(null);
      alert("Booking cancelled successfully!");
    }, 1000);
  };

  const handleRebook = (booking: Booking) => {
    // Pre-fill form with booking data
    setBookingForm({
      planId: booking.planId,
      weight: booking.weight,
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      address: booking.address,
    });
    setShowBookingForm(true);
    // Scroll to booking form
    setTimeout(() => {
      document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBookingFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Validate all fields
    const errors: Record<string, string> = {};

    const nameValidation = validateName(bookingForm.name);
    if (!nameValidation.valid) errors.name = nameValidation.error!;

    const emailValidation = validateEmail(bookingForm.email);
    if (!emailValidation.valid) errors.email = emailValidation.error!;

    const phoneValidation = validatePhone(bookingForm.phone);
    if (!phoneValidation.valid) errors.phone = phoneValidation.error!;

    const addressValidation = validateAddress(bookingForm.address);
    if (!addressValidation.valid) errors.address = addressValidation.error!;

    const weightValidation = validateWeight(bookingForm.weight);
    if (!weightValidation.valid) errors.weight = weightValidation.error!;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsSubmittingBooking(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();

      if (response.ok) {
        const bookingId = data.booking.id;

        // Reset form
        setBookingForm({
          planId: "premium",
          weight: 0,
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          address: "",
        });
        setFormErrors({});

        // Refresh bookings
        if (user) {
          await fetchUserBookings(user.email);
        }

        // Hide form and show success
        setShowBookingForm(false);

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Show success toast
        setTimeout(() => {
          toast.success(`Booking created successfully! Your booking ID is ${bookingId}. We'll contact you soon.`);
        }, 300);
      } else {
        toast.error(data.error || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const filteredAndSortedBookings = () => {
    let filtered = bookings;

    // Apply filter
    if (filter !== "all") {
      filtered = filtered.filter((b) => b.status === filter);
    }

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
      <header className="bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => router.push("/")} className="btn btn-secondary text-sm px-4 py-2">Home</button>
              <button onClick={handleLogout} className="btn border border-red-300 text-red-600 hover:bg-red-50 text-sm px-4 py-2">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
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
            <p className="text-sm text-emerald-100">Total Spent</p>
            <p className="text-2xl font-bold">KES {calculateTotalSpent()}</p>
          </div>
        </div>

        {/* New Booking Form */}
        {showBookingForm && (
          <div id="booking-form" className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-200">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Create New Booking
              </h2>
              <p className="text-gray-600">Fill in the details below to book your laundry service</p>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Select Service Plan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "basic", name: "Basic Wash", price: 50, icon: "🧺", color: "from-blue-500 to-cyan-500" },
                    { id: "premium", name: "Premium Care", price: 75, icon: "✨", color: "from-purple-500 to-pink-500" },
                    { id: "deluxe", name: "Deluxe Service", price: 100, icon: "👑", color: "from-amber-500 to-orange-500" },
                  ].map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, planId: plan.id })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        bookingForm.planId === plan.id
                          ? `border-purple-500 bg-gradient-to-r ${plan.color} bg-opacity-10 shadow-xl`
                          : "border-gray-200 hover:border-purple-300 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-5xl mb-3">{plan.icon}</div>
                      <div className="font-bold text-lg text-gray-900">{plan.name}</div>
                      <div className="text-purple-600 font-bold text-2xl mt-2">
                        KES {plan.price}
                        <span className="text-sm text-gray-600">/kg</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Weight of Clothes (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={bookingForm.weight || ""}
                  onChange={handleBookingFormChange}
                  required
                  min="0.5"
                  step="0.5"
                  className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:ring-2 transition-all ${
                    formErrors.weight
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  placeholder="Enter weight in kg"
                />
                {formErrors.weight && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.weight}</p>
                )}
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[5, 10, 15, 20].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, weight: val })}
                      className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-blue-100 rounded-lg font-semibold text-gray-700 hover:text-purple-700 transition-all"
                    >
                      {val} kg
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleBookingFormChange}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
                      formErrors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleBookingFormChange}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
                      formErrors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleBookingFormChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
                    formErrors.phone
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  placeholder="+254 700 000 000"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Pickup Address
                </label>
                <textarea
                  name="address"
                  value={bookingForm.address}
                  onChange={handleBookingFormChange}
                  required
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 transition-all ${
                    formErrors.address
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                  }`}
                  placeholder="Enter your full address"
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>

              {/* Total Display */}
              {bookingForm.weight > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Estimated Total:
                    </span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {formatCurrency(getPlanPrice(bookingForm.planId) * bookingForm.weight)}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking || bookingForm.weight <= 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingBooking ? "Creating Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === "all"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === "pending"
                      ? "bg-yellow-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending ({bookings.filter((b) => b.status === "pending").length})
                </button>
                <button
                  onClick={() => setFilter("processing")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === "processing"
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Processing ({bookings.filter((b) => b.status === "processing").length})
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    filter === "completed"
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Completed ({bookings.filter((b) => b.status === "completed").length})
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            My Bookings ({filteredAndSortedBookings().length})
          </h2>
        </div>

        {filteredAndSortedBookings().length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
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
              {filter === "all" ? "No bookings yet" : `No ${filter} bookings`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "Start your first booking and enjoy our premium laundry service!"
                : `You don't have any ${filter} bookings at the moment.`}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Make Your First Booking
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedBookings().map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-purple-200"
              >
                {/* Booking Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{getPlanIcon(booking.planId)}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {getPlanName(booking.planId)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatRelativeTime(booking.createdAt)}
                      </p>
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

                {/* Booking Details */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Booking ID</p>
                      <p className="font-mono font-bold text-sm text-gray-900">
                        {booking.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Weight</p>
                      <p className="font-bold text-sm text-gray-900">
                        {booking.weight} kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Rate</p>
                      <p className="font-bold text-sm text-gray-900">
                        {formatCurrency(getPlanPrice(booking.planId))}/kg
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                      <p className="font-bold text-lg text-purple-600">
                        {formatCurrency(getPlanPrice(booking.planId) * booking.weight)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  >
                    View Details
                  </button>
                  {booking.status === "completed" && (
                    <button
                      onClick={() => handleRebook(booking)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                    >
                      Rebook
                    </button>
                  )}
                  {booking.status === "pending" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancelingBooking === booking.id}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm disabled:opacity-50"
                    >
                      {cancelingBooking === booking.id ? "Canceling..." : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Booking Details</h3>
                  <p className="text-purple-100 text-sm">
                    Complete information about your booking
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

              {/* Booking Information */}
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
                  Booking Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking ID</p>
                    <p className="font-mono font-bold text-gray-900">
                      {selectedBooking.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Booking Date</p>
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
                      {getPlanIcon(selectedBooking.planId)} {getPlanName(selectedBooking.planId)}
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

              {/* Customer Information */}
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
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                    <p className="font-semibold text-gray-900">{formatPhoneNumber(selectedBooking.phone)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pickup Address</p>
                    <p className="font-semibold text-gray-900">{selectedBooking.address}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Rate per kg</span>
                    <span className="font-semibold text-gray-900">
                      KES {getPlanPrice(selectedBooking.planId)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Weight</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBooking.weight} kg
                    </span>
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      KES {getPlanPrice(selectedBooking.planId) * selectedBooking.weight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedBooking.status === "completed" && (
                  <button
                    onClick={() => {
                      handleRebook(selectedBooking);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Rebook This Order
                  </button>
                )}
                {selectedBooking.status === "pending" && (
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedBooking.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  Close
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
