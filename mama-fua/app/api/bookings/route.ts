import { NextRequest, NextResponse } from "next/server";

// In-memory storage (for demo purposes - in production, use a database)
const bookings: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { name, email, phone, address, planId, weight } = body;

    if (!name || !email || !phone || !address || !planId || !weight) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate weight
    if (weight <= 0) {
      return NextResponse.json(
        { error: "Weight must be greater than 0" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = {
      id: `BK${Date.now()}`,
      name,
      email,
      phone,
      address,
      planId,
      weight,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    bookings.push(booking);

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    bookings,
    total: bookings.length,
  });
}
