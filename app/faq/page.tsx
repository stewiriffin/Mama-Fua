"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How does MAMA FUA work?",
      answer: "Simply book your laundry service through our website or app, schedule a pickup time, and we'll collect your laundry from your doorstep. We'll clean it professionally and deliver it back to you fresh and folded."
    },
    {
      question: "What are your pickup and delivery hours?",
      answer: "We offer pickup and delivery from Monday to Saturday, 8:00 AM to 8:00 PM. Sunday deliveries are available for express orders only."
    },
    {
      question: "How do you calculate pricing?",
      answer: "Our pricing is based on the weight of your laundry. The base rate is KES 50/kg for basic wash and fold, KES 75/kg for premium care, and KES 100/kg for deluxe service. Additional services like express delivery have extra charges."
    },
    {
      question: "How long does laundry take?",
      answer: "Standard service takes 48 hours. Premium service takes 24 hours. Express/same-day service is available for an additional 50% charge, subject to availability."
    },
    {
      question: "Do you offer discounts?",
      answer: "Yes! We offer 5% discount for weekly customers (4+ orders/month), 10% for monthly customers (8+ orders/month), and 15% discount for bulk orders (20kg+)."
    },
    {
      question: "What areas do you serve?",
      answer: "We currently serve all areas within Nairobi. Delivery to areas outside Nairobi CBD may incur additional transportation fees."
    },
    {
      question: "What happens if my laundry is damaged?",
      answer: "We take great care with all items. In the rare event of damage, please notify us within 24 hours of delivery. We'll assess the situation and provide appropriate compensation."
    },
    {
      question: "Can I request specific detergent or fabric softener?",
      answer: "Yes, we can accommodate special requests. Please mention any allergies or preferences when placing your order. Additional charges may apply for specialty products."
    },
    {
      question: "How do I pay?",
      answer: "We accept payment via M-Pesa, bank transfer, and cash on delivery. For regular customers, we also offer monthly billing options."
    },
    {
      question: "What if I'm not home during pickup?",
      answer: "You can leave your laundry in a designated safe location (e.g., with a security guard, at your gate). Please specify this when booking or contact our customer service."
    },
    {
      question: "Do you dry clean formal wear and delicates?",
      answer: "Yes, we offer professional dry cleaning for formal wear, suits, dresses, and delicate fabrics. Pricing ranges from KES 200-500 per item depending on the garment."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order status through your dashboard on our website. You'll also receive SMS updates when your laundry is picked up, being processed, and out for delivery."
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
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/faq" className="text-emerald-600 font-medium">FAQ</Link>
            </nav>
            <Link href="/login" className="btn btn-primary text-sm">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-emerald-100 max-w-2xl mx-auto">
            Find answers to common questions about our laundry services.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">Contact us directly and we'll be happy to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+254700000000" className="btn btn-primary">Call Us</a>
            <a href="mailto:info@mamafua.com" className="btn btn-secondary">Email Us</a>
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
