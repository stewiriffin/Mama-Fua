"use client";

import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      id: "basic",
      name: "Basic Wash",
      price: 50,
      description: "Standard wash and fold service",
      features: ["Wash & Dry", "Fold", "48-hour turnaround", "Free pickup & delivery"],
      popular: false
    },
    {
      id: "premium",
      name: "Premium Care",
      price: 75,
      description: "Deep cleaning with fabric softener",
      features: ["Wash & Dry", "Iron & Fold", "Fabric Softener", "24-hour turnaround", "Free pickup & delivery"],
      popular: true
    },
    {
      id: "deluxe",
      name: "Deluxe Service",
      price: 100,
      description: "Premium service with special care",
      features: ["Wash & Dry", "Professional Iron & Fold", "Premium Fabric Softener", "Stain Treatment", "Same-day service", "Free pickup & delivery"],
      popular: false
    }
  ];

  const extras = [
    { name: "Express Service (Same Day)", price: "+50%", description: "Priority processing" },
    { name: "Stain Treatment", price: "KES 200", description: "Per stain" },
    { name: "Fabric Softener", price: "KES 50", description: "Per load" },
    { name: "Dry Cleaning", price: "KES 200-500", description: "Per item" },
    { name: "Curtains/Rugs", price: "KES 300-800", description: "Per item" },
    { name: "Bedding Set", price: "KES 400", description: "Per set" }
  ];

  const discounts = [
    { tier: "Weekly", amount: "5%", description: "Book 4+ times per month" },
    { tier: "Monthly", amount: "10%", description: "Book 8+ times per month" },
    { tier: "Bulk", amount: "15%", description: "20kg+ per order" }
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
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/pricing" className="text-emerald-600 font-medium">Pricing</Link>
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
          <h1 className="text-4xl font-bold mb-4">Pricing</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Simple, transparent pricing. Pay only for the weight of your laundry.
          </p>
        </div>
      </section>

      {/* Main Plans */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={`card p-6 ${plan.popular ? 'ring-2 ring-emerald-600' : ''}`}>
                {plan.popular && (
                  <div className="bg-emerald-600 text-white text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <p className="text-3xl font-bold text-emerald-600 mb-6">
                  KES {plan.price}<span className="text-sm font-normal text-gray-500">/kg</span>
                </p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
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

      {/* Extras */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Additional Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extras.map((extra, idx) => (
              <div key={idx} className="card p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-900">{extra.name}</h4>
                  <p className="text-sm text-gray-500">{extra.description}</p>
                </div>
                <span className="font-bold text-emerald-600">{extra.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discounts */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Volume Discounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discounts.map((discount, idx) => (
              <div key={idx} className="card p-6 text-center">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{discount.tier}</h4>
                <p className="text-3xl font-bold text-green-600 mb-2">{discount.amount}</p>
                <p className="text-sm text-gray-500">{discount.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Calculate Your Cost</h2>
          <p className="text-emerald-100 mb-6">Use our calculator to get an instant quote for your laundry.</p>
          <Link href="/#calculator" className="btn bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3">Get Quote</Link>
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
