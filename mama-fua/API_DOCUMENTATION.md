# Mama Fua API Documentation

## Backend Endpoints

### 1. Get Pricing Plans
**Endpoint:** `GET /api/plans`

**Description:** Retrieves all available laundry service plans with pricing.

**Response:**
```json
{
  "success": true,
  "plans": [
    {
      "id": "basic",
      "name": "Basic Wash",
      "price": 50,
      "description": "Standard wash and fold service",
      "features": ["Wash & Dry", "Fold", "48-hour turnaround"],
      "color": "from-blue-500 to-cyan-500"
    },
    {
      "id": "premium",
      "name": "Premium Care",
      "price": 75,
      "description": "Deep cleaning with fabric softener",
      "features": ["Wash & Dry", "Iron & Fold", "Fabric Softener", "24-hour turnaround"],
      "color": "from-purple-500 to-pink-500",
      "popular": true
    },
    {
      "id": "deluxe",
      "name": "Deluxe Service",
      "price": 100,
      "description": "Premium service with special care",
      "features": [
        "Wash & Dry",
        "Professional Iron & Fold",
        "Premium Fabric Softener",
        "Stain Treatment",
        "Same-day service"
      ],
      "color": "from-amber-500 to-orange-500"
    }
  ]
}
```

---

### 2. Create Booking
**Endpoint:** `POST /api/bookings`

**Description:** Creates a new laundry service booking.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "address": "123 Main Street, Nairobi",
  "planId": "premium",
  "weight": 5
}
```

**Validation:**
- All fields are required
- `weight` must be greater than 0
- `email` must be valid email format
- `planId` must be one of: `basic`, `premium`, or `deluxe`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "booking": {
    "id": "BK1764841054443",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+254700000000",
    "address": "123 Main Street, Nairobi",
    "planId": "premium",
    "weight": 5,
    "createdAt": "2025-12-04T09:37:34.443Z",
    "status": "pending"
  }
}
```

**Error Response (400):**
```json
{
  "error": "All fields are required"
}
```

---

### 3. Get All Bookings
**Endpoint:** `GET /api/bookings`

**Description:** Retrieves all bookings (for admin/management purposes).

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "BK1764841054443",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+254700000000",
      "address": "123 Main Street, Nairobi",
      "planId": "premium",
      "weight": 5,
      "createdAt": "2025-12-04T09:37:34.443Z",
      "status": "pending"
    }
  ],
  "total": 1
}
```

---

## Pricing Information

| Plan | Price per kg | Features |
|------|-------------|----------|
| **Basic Wash** | KES 50/kg | Standard wash & fold, 48-hour turnaround |
| **Premium Care** | KES 75/kg | Deep cleaning, iron & fold, fabric softener, 24-hour turnaround |
| **Deluxe Service** | KES 100/kg | Premium service, stain treatment, same-day service |

---

## Technology Stack

- **Frontend:** Next.js 16, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Storage:** In-memory storage (for demo - replace with database in production)

---

## Development

Run the development server:
```bash
npm run dev
```

Server will be available at:
- Local: http://localhost:3000
- Network: http://[your-ip]:3000

---

## Production Considerations

For production deployment, consider:

1. **Database Integration:** Replace in-memory storage with a database (PostgreSQL, MongoDB, etc.)
2. **Authentication:** Add user authentication and admin dashboard
3. **Payment Integration:** Integrate M-Pesa or other payment gateways
4. **Email Notifications:** Send booking confirmations via email
5. **SMS Notifications:** Send booking updates via SMS
6. **Rate Limiting:** Add rate limiting to prevent abuse
7. **Input Sanitization:** Enhanced input validation and sanitization
8. **Logging:** Implement proper logging and monitoring
