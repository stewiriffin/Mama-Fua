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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    // Find and update booking
    const bookingIndex = bookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    bookings[bookingIndex].status = status;

    return NextResponse.json({
      success: true,
      message: "Booking status updated successfully",
      booking: bookings[bookingIndex],
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const bookingIndex = bookings.findIndex((b) => b.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    bookings.splice(bookingIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
