"use client";

import { formatDate, formatCurrency, formatPhoneNumber } from "../utils/validation";

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

interface BookingReceiptProps {
  booking: Booking;
  getPlanName: (planId: string) => string;
  getPlanPrice: (planId: string) => number;
  onClose: () => void;
}

export default function BookingReceipt({ booking, getPlanName, getPlanPrice, onClose }: BookingReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  const rate = getPlanPrice(booking.planId);
  const subtotal = rate * booking.weight;
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;

  return (
    <>
      {/* Screen View */}
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm print:hidden">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">📄 Booking Receipt</h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-8">
            <ReceiptContent
              booking={booking}
              getPlanName={getPlanName}
              rate={rate}
              subtotal={subtotal}
              tax={tax}
              total={total}
            />
          </div>

          <div className="p-6 bg-gray-50 rounded-b-3xl border-t border-gray-200 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Print View */}
      <div className="hidden print:block">
        <ReceiptContent
          booking={booking}
          getPlanName={getPlanName}
          rate={rate}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </div>
    </>
  );
}

function ReceiptContent({
  booking,
  getPlanName,
  rate,
  subtotal,
  tax,
  total,
}: {
  booking: Booking;
  getPlanName: (planId: string) => string;
  rate: number;
  subtotal: number;
  tax: number;
  total: number;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-gray-200 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Mama Fua
        </h1>
        <p className="text-gray-600">Professional Laundry Services</p>
        <p className="text-sm text-gray-500 mt-2">Nairobi, Kenya • info@mamafua.com • +254 700 000 000</p>
      </div>

      {/* Receipt Info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-600">Receipt Number</p>
          <p className="text-lg font-mono font-bold text-gray-900">{booking.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-600">Date</p>
          <p className="text-lg font-bold text-gray-900">{formatDate(booking.createdAt)}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-600 mb-3">CUSTOMER INFORMATION</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-semibold text-gray-900">{booking.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-semibold text-gray-900">{booking.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phone:</span>
            <span className="font-semibold text-gray-900">{formatPhoneNumber(booking.phone)}</span>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-gray-600">Address:</span>
            <span className="font-semibold text-gray-900 text-right max-w-xs">{booking.address}</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <h3 className="text-sm font-bold text-gray-600 mb-3">SERVICES</h3>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Service</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-700">Weight</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Rate</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-3 font-semibold text-gray-900">{getPlanName(booking.planId)}</td>
              <td className="text-center p-3 text-gray-700">{booking.weight} kg</td>
              <td className="text-right p-3 text-gray-700">{formatCurrency(rate)}/kg</td>
              <td className="text-right p-3 font-semibold text-gray-900">{formatCurrency(subtotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-300 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>VAT (16%):</span>
            <span className="font-semibold">{formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Status:</span>
          <span className={`px-4 py-2 rounded-full font-bold text-sm ${
            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
            booking.status === 'processing' ? 'bg-emerald-100 text-blue-800' :
            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6 border-t border-gray-200">
        <p className="font-semibold mb-1">Thank you for choosing Mama Fua!</p>
        <p>For inquiries, please contact us at info@mamafua.com or +254 700 000 000</p>
        <p className="mt-3 text-xs">© 2024 Mama Fua - Professional Laundry Services. All rights reserved.</p>
      </div>
    </div>
  );
}
