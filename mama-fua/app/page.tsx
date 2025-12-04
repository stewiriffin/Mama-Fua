"use client";

import { useState, useEffect } from "react";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
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
      color: "from-blue-500 to-cyan-500",
      icon: "🧺",
    },
    {
      id: "premium",
      name: "Premium Care",
      price: 75,
      description: "Deep cleaning with fabric softener",
      features: [
        "Wash & Dry",
        "Iron & Fold",
        "Fabric Softener",
        "24-hour turnaround",
      ],
      color: "from-purple-500 to-pink-500",
      popular: true,
      icon: "✨",
    },
    {
      id: "deluxe",
      name: "Deluxe Service",
      price: 100,
      description: "Premium service with special care",
      features: [
        "Wash & Dry",
        "Professional Iron & Fold",
        "Premium Fabric Softener",
        "Stain Treatment",
        "Same-day service",
      ],
      color: "from-amber-500 to-orange-500",
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
    setIsSubmitting(true);
    setSubmitMessage(null);

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
        setSubmitMessage({
          type: "success",
          text: `Booking successful! Your booking ID is ${data.booking.id}. We'll contact you soon.`,
        });
        // Reset form
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          address: "",
        });
        setShowBookingForm(false);
        setSelectedPlan(null);
        setWeight(0);
      } else {
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to create booking. Please try again.",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Mama Fua
                </h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Professional Laundry Services
                </p>
              </div>
            </div>
            <a
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Login
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white py-20">
          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 -right-1/4 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Fresh, Clean Clothes
                <br />
                <span className="text-cyan-200">Delivered to Your Door</span>
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
                Professional laundry service at affordable prices. Fast pickup,
                quality cleaning, and hassle-free delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    document
                      .getElementById("calculator")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1"
                >
                  Book Now
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all transform hover:-translate-y-1"
                >
                  How It Works
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-purple-100 text-sm mt-2">
                    Happy Customers
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold">24hr</div>
                  <div className="text-purple-100 text-sm mt-2">
                    Fast Turnaround
                  </div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6">
                  <div className="text-4xl font-bold">100%</div>
                  <div className="text-purple-100 text-sm mt-2">
                    Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get your laundry done in 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative group">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform">
                    <span className="text-3xl">📦</span>
                  </div>
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-3 -right-3 font-bold">
                    1
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    Book Online
                  </h4>
                  <p className="text-gray-600 text-center">
                    Choose your plan, enter weight, and schedule a pickup time
                    that works for you.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform">
                    <span className="text-3xl">✨</span>
                  </div>
                  <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-3 -right-3 font-bold">
                    2
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    We Clean
                  </h4>
                  <p className="text-gray-600 text-center">
                    Our professionals pick up, wash, dry, and fold your clothes
                    with care.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🚚</span>
                  </div>
                  <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center absolute -top-3 -right-3 font-bold">
                    3
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                    Fast Delivery
                  </h4>
                  <p className="text-gray-600 text-center">
                    Receive fresh, clean clothes delivered right to your
                    doorstep.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Flexible pricing based on weight. Pay only for what you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ${
                    plan.popular ? "ring-4 ring-purple-500 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                      MOST POPULAR
                    </div>
                  )}

                  <div
                    className={`bg-gradient-to-r ${plan.color} p-8 text-white text-center`}
                  >
                    <div className="text-6xl mb-4">{plan.icon}</div>
                    <h4 className="text-3xl font-bold mb-2">{plan.name}</h4>
                    <p className="text-white text-opacity-90 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 text-lg">KES/kg</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <svg
                            className="w-5 h-5 text-green-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        document
                          .getElementById("calculator")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black"
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
        <section
          id="calculator"
          className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Calculate Your Cost
              </h3>
              <p className="text-xl text-gray-600">
                Get an instant quote for your laundry
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
              {/* Plan Selection */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
                  Select Your Plan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedPlan === plan.id
                          ? `border-purple-500 bg-gradient-to-r ${plan.color} bg-opacity-10 shadow-lg`
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-4xl mb-3">{plan.icon}</div>
                      <div className="font-bold text-gray-900">{plan.name}</div>
                      <div className="text-2xl font-bold text-purple-600 mt-2">
                        KES {plan.price}
                        <span className="text-sm text-gray-600">/kg</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Input */}
              <div className="mb-8">
                <label className="block text-lg font-bold text-gray-900 mb-4">
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
                    className="w-full px-6 py-4 text-2xl border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-semibold">
                    kg
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {[5, 10, 15, 20].map((val) => (
                    <button
                      key={val}
                      onClick={() => setWeight(val)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-purple-100 hover:to-blue-100 rounded-xl font-semibold text-gray-700 hover:text-purple-700 transition-all"
                    >
                      {val} kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Display */}
              {selectedPlan && weight > 0 && (
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8 transform transition-all duration-500 animate-fade-in">
                  <div className="text-center text-white">
                    <div className="text-lg mb-2 opacity-90">
                      Estimated Total
                    </div>
                    <div className="text-6xl font-bold mb-4">
                      KES {calculateTotal()}
                    </div>
                    <div className="text-sm opacity-90">
                      {plans.find((p) => p.id === selectedPlan)?.name} •{" "}
                      {weight} kg
                    </div>
                  </div>
                </div>
              )}

              {/* Success/Error Message */}
              {submitMessage && (
                <div
                  className={`p-6 rounded-2xl mb-6 ${
                    submitMessage.type === "success"
                      ? "bg-green-100 text-green-800 border-2 border-green-200"
                      : "bg-red-100 text-red-800 border-2 border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {submitMessage.type === "success" ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <p className="font-semibold">{submitMessage.text}</p>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!selectedPlan || !weight || weight <= 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6 rounded-2xl font-bold text-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-1"
              >
                Book Your Laundry Service
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Mama Fua
                </h4>
                <p className="text-gray-400">
                  Professional laundry services delivered to your doorstep.
                </p>
              </div>
              <div>
                <h5 className="font-bold mb-4">Services</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>Wash & Fold</li>
                  <li>Iron & Press</li>
                  <li>Dry Cleaning</li>
                  <li>Stain Treatment</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-4">Company</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>About Us</li>
                  <li>Contact</li>
                  <li>Careers</li>
                  <li>Blog</li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold mb-4">Contact</h5>
                <ul className="space-y-2 text-gray-400">
                  <li>📞 +254 700 000 000</li>
                  <li>📧 info@mamafua.com</li>
                  <li>📍 Nairobi, Kenya</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>© 2024 Mama Fua. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">
                  Complete Your Booking
                </h3>
                <button
                  onClick={() => setShowBookingForm(false)}
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

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
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
  );
}
