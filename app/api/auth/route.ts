import { NextRequest, NextResponse } from "next/server";

// Simple in-memory user store (replace with database in production)
const users = [
  {
    id: "1",
    email: "user@example.com",
    password: "user123",
    name: "John Doe",
    role: "user",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "admin@mamafua.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01",
  },
];

// Simple token generation (in production, use JWT or similar)
const generateToken = (user: typeof users[0]): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};

export async function POST(request: NextRequest) {
  try {
    const { email, password, action, name } = await request.json();

    if (action === "login") {
      // Validate input
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      // Login
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      // Generate token
      const token = generateToken(user);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token,
        message: "Login successful",
      });
    } else if (action === "register") {
      // Validate input
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      // Register
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 400 }
        );
      }

      const newUser = {
        id: String(users.length + 1),
        email: email.toLowerCase(),
        password,
        name: name || email.split("@")[0],
        role: "user",
        createdAt: new Date().toISOString().split("T")[0],
      };

      users.push(newUser);

      // Generate token
      const token = generateToken(newUser);

      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token,
        message: "Account created successfully",
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
