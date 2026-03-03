import { NextRequest, NextResponse } from "next/server";

// Simple in-memory user store (replace with database in production)
const users = [
  {
    id: "1",
    email: "user@example.com",
    password: "user123",
    name: "John Doe",
    role: "user",
  },
  {
    id: "2",
    email: "admin@mamafua.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();

    if (action === "login") {
      // Login
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: "Login successful",
      });
    } else if (action === "register") {
      // Register
      const existingUser = users.find((u) => u.email === email);

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }

      const newUser = {
        id: String(users.length + 1),
        email,
        password,
        name: email.split("@")[0],
        role: "user",
      };

      users.push(newUser);

      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: "Registration successful",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
