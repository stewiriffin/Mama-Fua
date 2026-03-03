"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API
    setSubmitted(true);
  };

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
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Get in touch with us.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Phone */}
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-600 mb-2">Call us for immediate assistance</p>
              <a href="tel:+254700000000" className="text-emerald-600 font-medium">+254 700 000 000</a>
              <p className="text-sm text-gray-500 mt-2">Mon-Sat, 8am-8pm</p>
            </div>

            {/* Email */}
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-2">Send us an email anytime</p>
              <a href="mailto:info@mamafua.com" className="text-emerald-600 font-medium">info@mamafua.com</a>
              <p className="text-sm text-gray-500 mt-2">We reply within 24 hours</p>
            </div>

            {/* Location */}
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600 mb-2">Visit our office</p>
              <p className="text-emerald-600 font-medium">Nairobi, Kenya</p>
              <p className="text-sm text-gray-500 mt-2">We deliver citywide</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            {submitted ? (
              <div className="card p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">Thank you for contacting us. We'll get back to you soon.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-primary">Send Another Message</button>
              </div>
            ) : (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-full">Send Message</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Map would be displayed here</p>
          </div>
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
