"use client";

import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      id: "wash-fold",
      title: "Wash & Fold",
      description: "Professional washing and folding service for your everyday laundry needs.",
      price: "KES 50/kg",
      features: [
        "Machine wash with quality detergent",
        "Tumble dry",
        "Neatly folded",
        "48-hour turnaround",
        "Free pickup & delivery"
      ],
      icon: "🧺"
    },
    {
      id: "wash-iron",
      title: "Wash & Iron",
      description: "Complete laundry service with professional ironing for a crisp, clean look.",
      price: "KES 75/kg",
      features: [
        "Machine wash",
        "Professional ironing",
        "Fabric softener included",
        "24-hour turnaround",
        "Free pickup & delivery"
      ],
      icon: "👕"
    },
    {
      id: "dry-clean",
      title: "Dry Cleaning",
      description: "Specialized care for delicate fabrics and formal wear.",
      price: "KES 200-500/item",
      features: [
        "Professional dry cleaning",
        "Stain treatment",
        "Special care for delicates",
        "Same-day service available",
        "Free pickup & delivery"
      ],
      icon: "👔"
    },
    {
      id: "bedding",
      title: "Bedding & Linens",
      description: "Professional cleaning for bed sheets, towels, and other household linens.",
      price: "KES 60/kg",
      features: [
        "Extra sanitization",
        "Professional ironing",
        "Bulk discounts available",
        "48-hour turnaround",
        "Free pickup & delivery"
      ],
      icon: "🛏️"
    },
    {
      id: "curtains",
      title: "Curtains & Rugs",
      description: "Deep cleaning for heavy household items like curtains and rugs.",
      price: "KES 300-800/item",
      features: [
        "Deep cleaning",
        "Stain removal",
        "Professional finishing",
        "3-5 day turnaround",
        "Free pickup & delivery"
      ],
      icon: "🪟"
    },
    {
      id: "express",
      title: "Express Service",
      description: "Same-day service for urgent laundry needs.",
      price: "KES 100/kg",
      features: [
        "Same-day pickup & delivery",
        "Priority processing",
        "Express ironing",
        "Available Mon-Sat",
        "Subject to availability"
      ],
      icon: "⚡"
    }
  ];

  const processSteps = [
    { step: 1, title: "Book", description: "Schedule your pickup online or call us" },
    { step: 2, title: "Pickup", description: "We collect your laundry from your door" },
    { step: 3, title: "Clean", description: "Professional washing and processing" },
    { step: 4, title: "Deliver", description: "Fresh laundry delivered back to you" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">MAMA FUA</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/services" className="text-emerald-600 font-medium">Services</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            </nav>
            <Link href="/login" className="btn btn-primary text-sm">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Professional laundry services tailored to your needs. From everyday wash and fold to specialized dry cleaning.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="card p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                <p className="text-emerald-600 font-bold text-lg mb-4">{service.price}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/#calculator" className="btn btn-primary w-full text-center block">Book Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Book your first laundry service today and experience the convenience.</p>
          <Link href="/#calculator" className="btn btn-primary px-8 py-3">Book Now</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">MAMA FUA</h3>
              <p className="text-sm">Professional laundry services in Nairobi. Fast, reliable, and affordable.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link href="/services" className="block hover:text-white">Services</Link>
                <Link href="/pricing" className="block hover:text-white">Pricing</Link>
                <Link href="/about" className="block hover:text-white">About Us</Link>
                <Link href="/faq" className="block hover:text-white">FAQ</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <p className="text-sm">Phone: +254 700 000 000</p>
              <p className="text-sm">Email: info@mamafua.com</p>
              <p className="text-sm">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            &copy; 2024 MAMA FUA. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
