"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast, ToastContainer } from "./components/Toast";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
  validateWeight,
} from "./utils/validation";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Home() {
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check for rebook data
  useEffect(() => {
    const rebookData = localStorage.getItem("rebookData");
    if (rebookData) {
      const data = JSON.parse(rebookData);
      setSelectedPlan(data.planId);
      setWeight(data.weight);
      localStorage.removeItem("rebookData");
      // Smooth scroll to calculator
      setTimeout(() => {
        document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const plans = [
    {
      id: "basic",
      name: "Basic Wash",
      price: 50,
      description: "Standard wash and fold service",
      features: ["Wash & Dry", "Fold", "48-hour turnaround"],
      color: "bg-emerald-600",
      icon: "🧺",
    },
    {
      id: "premium",
      name: "Premium Care",
      price: 75,
      description: "Deep cleaning with fabric softener",
      features: ["Wash & Dry", "Iron & Fold", "Fabric Softener", "24-hour turnaround"],
      color: "bg-emerald-700",
      popular: true,
      icon: "✨",
    },
    {
      id: "deluxe",
      name: "Deluxe Service",
      price: 100,
      description: "Premium service with special care",
      features: ["Wash & Dry", "Professional Iron & Fold", "Premium Fabric Softener", "Stain Treatment", "Same-day service"],
      color: "bg-amber-600",
      icon: "👑",
    },
  ];

  const calculateTotal = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return 0;
    return plan.price * weight;
  };

  const handleBookingFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleBookNow = () => {
    if (!selectedPlan || !weight || weight <= 0) {
      return;
    }
    setShowBookingForm(true);
    setSubmitMessage(null);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitMessage(null);

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

    const weightValidation = validateWeight(weight);
    if (!weightValidation.valid) errors.weight = weightValidation.error!;

    if (!selectedPlan) {
      errors.plan = "Please select a service plan";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          planId: selectedPlan,
          weight,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Booking created successfully! Your booking ID is ${data.booking.id}. We'll contact you soon.`);
        // Reset form
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
        setFormErrors({});
        setShowBookingForm(false);
        setSelectedPlan(null);
        setWeight(0);

        // Scroll to top after successful booking
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 500);
      } else {
        toast.error(data.error || "Failed to create booking. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      <div className="min-h-screen bg-white dark:bg-zinc-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-zinc-800 sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                MAMA FUA
              </h1>
            </button>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</Link>
                <Link href="/services" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Services</Link>
                <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</Link>
                <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">FAQ</Link>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</Link>
              </nav>
              <a href="/login" className="btn btn-primary">Login</a>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-emerald-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Fresh, Clean Clothes<br />Delivered to Your Door
              </h2>
              <p className="text-emerald-100 text-lg mb-8">
                Professional laundry service at affordable prices. Fast pickup,
                quality cleaning, and hassle-free delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3"
                >
                  Book Now
                </button>
                <a href="tel:+254700000000" className="btn border border-white/30 hover:bg-white/10 px-8 py-3">
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Choose Your Plan</h3>
              <p className="text-gray-600 dark:text-gray-400">Flexible pricing based on weight</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.id} className={`card overflow-hidden ${plan.popular ? 'ring-2 ring-emerald-600' : ''}`}>
                  {plan.popular && (
                    <div className="bg-emerald-600 text-white text-xs font-medium px-3 py-1">Popular</div>
                  )}
                  <div className={`${plan.color} p-6 text-white`}>
                    <div className="text-4xl mb-2">{plan.icon}</div>
                    <h4 className="text-xl font-semibold">{plan.name}</h4>
                    <p className="text-white/80 text-sm">{plan.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      KES {plan.price}<span className="text-sm font-normal text-gray-500">/kg</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => { setSelectedPlan(plan.id); document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" }); }}
                      className={`w-full py-2.5 rounded-md font-medium text-sm ${
                        plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-900 dark:bg-white dark:text-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Select Plan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section id="calculator" className="py-16 bg-white dark:bg-zinc-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Calculate Your Cost</h3>
              <p className="text-gray-600 dark:text-gray-400">Get an instant quote for your laundry</p>
            </div>

            <div className="card p-6 md:p-8">
              {/* Plan Selection */}
              <div className="mb-10">
                <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Select Your Plan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedPlan === plan.id
                          ? `border-violet-500 bg-gradient-to-r ${plan.color} bg-opacity-10 shadow-lg`
                          : "border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-500"
                      }`}
                    >
                      <div className="text-5xl mb-3">{plan.icon}</div>
                      <div className="font-bold text-slate-900 dark:text-white text-lg">{plan.name}</div>
                      <div className="text-2xl font-bold text-violet-600 mt-2">
                        KES {plan.price}
                        <span className="text-sm text-slate-500">/kg</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Input */}
              <div className="mb-10">
                <label className="block text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Weight of Clothes (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight || ""}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    placeholder="Enter weight in kg"
                    min="0"
                    step="0.5"
                    className="w-full px-6 py-5 text-2xl border-2 border-slate-300 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white dark:bg-slate-700 dark:text-white"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-semibold">
                    kg
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  {[5, 10, 15, 20].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWeight(val)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 hover:from-violet-100 hover:to-indigo-100 dark:hover:from-violet-900/30 dark:hover:to-indigo-900/30 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-700 dark:hover:text-violet-400 transition-all"
                    >
                      {val} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Display */}
              {selectedPlan && weight > 0 && (
                <div className="bg-emerald-600 text-white rounded-lg p-6 mb-6 text-center">
                  <div className="text-sm opacity-90 mb-1">Estimated Total</div>
                  <div className="text-4xl font-bold">KES {calculateTotal()}</div>
                  <div className="text-sm opacity-80 mt-1">{plans.find((p) => p.id === selectedPlan)?.name} • {weight} kg</div>
                </div>
              )}

              {/* Success/Error Message */}
              {submitMessage && (
                <div className={`p-4 rounded-lg mb-4 text-sm ${submitMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {submitMessage.text}
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedPlan || !weight || weight <= 0}
                className="w-full btn btn-primary py-3 text-base"
              >
                Book Your Laundry Service
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-zinc-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Why Choose Us</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: "🚚", title: "Free Pickup & Delivery", description: "We come to your doorstep" },
                { icon: "⏱️", title: "Fast Turnaround", description: "24-48 hour service" },
                { icon: "✨", title: "Quality Guaranteed", description: "Professional cleaning" }
              ].map((feature, idx) => (
                <div key={idx} className="card p-6 text-center">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Get In Touch</h3>
              <p className="text-gray-600 dark:text-gray-400">We're here to help</p>
            </div>

            <div className="card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="tel:+254700000000" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <span className="font-medium text-gray-900">Call Us</span>
                  <span className="text-sm text-gray-500">+254 700 000 000</span>
                </a>
                <a href="mailto:info@mamafua.com" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="font-medium text-gray-900">Email Us</span>
                  <span className="text-sm text-gray-500">info@mamafua.com</span>
                </a>
                <div className="flex flex-col items-center p-4 rounded-lg">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <span className="font-medium text-gray-900">Location</span>
                  <span className="text-sm text-gray-500">Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 text-sm text-gray-500">
              &copy; 2024 MAMA FUA
            </div>
          </div>
        </section>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-emerald-600 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Complete Your Booking</h3>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-white hover:bg-white/20 rounded p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-4">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="John Doe"
                />
              </div>

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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>

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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="+254 700 000 000"
                />
              </div>

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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  placeholder="Enter your full address"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-emerald-50 rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Plan:</span>
                  <span className="font-bold">
                    {plans.find((p) => p.id === selectedPlan)?.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700 font-semibold">Weight:</span>
                  <span className="font-bold">{weight} kg</span>
                </div>
                <div className="flex justify-between border-t-2 border-purple-200 pt-2 mt-2">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    KES {calculateTotal()}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
