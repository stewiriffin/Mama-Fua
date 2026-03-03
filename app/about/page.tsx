"use client";

import Link from "next/link";

export default function AboutPage() {
  const team = [
    {
      name: "Mary Wanjiku",
      role: "Founder & CEO",
      description: "Visionary leader with 10+ years in laundry industry"
    },
    {
      name: "John Otieno",
      role: "Operations Manager",
      description: "Ensures smooth daily operations and quality control"
    },
    {
      name: "Sarah Kamau",
      role: "Customer Service Lead",
      description: "Dedicated to excellent customer experience"
    }
  ];

  const values = [
    {
      title: "Quality",
      description: "We never compromise on the quality of our laundry services.",
      icon: "⭐"
    },
    {
      title: "Reliability",
      description: "We deliver on time, every time. You can count on us.",
      icon: "🤝"
    },
    {
      title: "Convenience",
      description: "Free pickup and delivery makes laundry hassle-free.",
      icon: "🚚"
    },
    {
      title: "Affordability",
      description: "Professional services at competitive, transparent prices.",
      icon: "💰"
    }
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
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/about" className="text-emerald-600 font-medium">About</Link>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900">FAQ</Link>
            </nav>
            <Link href="/login" className="btn btn-primary text-sm">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About MAMA FUA</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Your trusted laundry service in Nairobi, delivering fresh, clean clothes since 2018.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                MAMA FUA was founded in 2018 with a simple mission: to make laundry day stress-free for busy Nairobi residents.
              </p>
              <p className="text-gray-600 mb-4">
                What started as a small family business has grown into one of Nairobi's most trusted laundry services. We combine traditional care with modern technology to deliver exceptional results.
              </p>
              <p className="text-gray-600">
                Today, we serve thousands of happy customers across Nairobi, offering professional laundry services that save you time and deliver spotless results.
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-emerald-600">5000+</p>
                  <p className="text-gray-600 text-sm">Happy Customers</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-600">50,000+</p>
                  <p className="text-gray-600 text-sm">Orders Completed</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-600">6</p>
                  <p className="text-gray-600 text-sm">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-emerald-600">98%</p>
                  <p className="text-gray-600 text-sm">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, idx) => (
              <div key={idx} className="card p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">👤</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 text-sm mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Happy Customers</h2>
          <p className="text-emerald-100 mb-6">Experience the MAMA FUA difference today.</p>
          <Link href="/#calculator" className="btn bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3">Book Now</Link>
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
