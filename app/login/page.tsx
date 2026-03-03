"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          action: isLogin ? "login" : "register",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        setMessage({
          type: "success",
          text: data.message,
        });

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin");
          } else {
            router.push("/user");
          }
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Authentication failed",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="py-4">
        <div className="max-w-md mx-auto px-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity mb-4"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3">
              <svg
                className="w-8 h-8 text-white"
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
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mama Fua</h1>
          <p className="text-gray-600">Professional Laundry Services</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setMessage(null);
              }}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                isLogin
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setMessage(null);
              }}
              className={`flex-1 py-2 text-center font-semibold transition-colors ${
                !isLogin
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processing..."
                : isLogin
                ? "Login"
                : "Register"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>User:</strong> user@example.com / user123
              </p>
              <p>
                <strong>Admin:</strong> admin@mamafua.com / admin123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/")}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
