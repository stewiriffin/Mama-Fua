import { NextResponse } from "next/server";

const plans = [
  {
    id: "basic",
    name: "Basic Wash",
    price: 50,
    description: "Standard wash and fold service",
    features: ["Wash & Dry", "Fold", "48-hour turnaround"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "premium",
    name: "Premium Care",
    price: 75,
    description: "Deep cleaning with fabric softener",
    features: ["Wash & Dry", "Iron & Fold", "Fabric Softener", "24-hour turnaround"],
    color: "from-purple-500 to-pink-500",
    popular: true,
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
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    plans,
  });
}
