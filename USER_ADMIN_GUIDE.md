# Mama Fua - User & Admin Guide

## Overview

Mama Fua now includes complete user authentication and dashboard systems for both customers and administrators.

---

## Pages Structure

### 1. **Home Page** (`/`)
- Public landing page
- View pricing plans
- Calculate costs
- Make bookings (without login)
- Login button in header

### 2. **Login Page** (`/login`)
- User authentication
- Registration for new users
- Auto-redirect based on role (user → `/user`, admin → `/admin`)

### 3. **User Dashboard** (`/user`)
- View personal bookings
- Track booking status
- View statistics (Total, Pending, Completed)
- Secure access (login required)

### 4. **Admin Dashboard** (`/admin`)
- View all bookings system-wide
- Search and filter capabilities
- Revenue tracking
- Customer management
- Secure access (admin role required)

---

## Demo Credentials

### User Account
- **Email:** `user@example.com`
- **Password:** `user123`
- **Access:** User Dashboard

### Admin Account
- **Email:** `admin@mamafua.com`
- **Password:** `admin123`
- **Access:** Admin Dashboard

---

## Features

### Authentication System

#### Login
```typescript
POST /api/auth
Body: {
  email: string,
  password: string,
  action: "login"
}
```

#### Register
```typescript
POST /api/auth
Body: {
  email: string,
  password: string,
  action: "register"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "user" // or "admin"
  },
  "message": "Login successful"
}
```

---

## User Dashboard Features

### Statistics Cards
1. **Total Bookings** - All time bookings count
2. **Pending** - Bookings awaiting processing
3. **Completed** - Successfully completed bookings

### Bookings Table
- **Booking ID** - Unique identifier
- **Plan** - Service plan selected
- **Weight** - Clothes weight in kg
- **Total** - Total cost (KES)
- **Date** - Booking date
- **Status** - Current status with color coding
  - 🟡 Pending (Yellow)
  - 🔵 Processing (Blue)
  - 🟢 Completed (Green)
  - 🔴 Cancelled (Red)

### Navigation
- **Home** - Return to main page
- **Logout** - End session

---

## Admin Dashboard Features

### Statistics Cards
1. **Total Bookings** - System-wide booking count
2. **Pending** - Awaiting processing
3. **Completed** - Successfully completed
4. **Revenue** - Total earnings from completed bookings

### Search & Filter
- **Search Bar** - Search by:
  - Customer name
  - Email address
  - Booking ID
- **Status Filters**
  - All bookings
  - Pending only
  - Completed only

### Bookings Management Table
Columns:
- **Booking ID**
- **Customer** (Name + Email)
- **Contact** (Phone + Address)
- **Plan** (Service type)
- **Weight** (in kg)
- **Total** (Cost in KES)
- **Date** (Booking date)
- **Status** (Color-coded badge)

### Features
- View all customer bookings
- Monitor booking statuses
- Track revenue
- Search and filter capabilities
- Full customer contact information

---

## Booking Status Workflow

```
pending → processing → completed
                    ↓
                cancelled
```

**Status Definitions:**
- **Pending** - New booking, awaiting pickup
- **Processing** - Clothes being cleaned
- **Completed** - Service finished, delivered
- **Cancelled** - Booking cancelled

---

## Security Features

### Authentication
- Session-based authentication using localStorage
- Role-based access control (RBAC)
- Auto-redirect on unauthorized access

### Protected Routes
- `/user` - Requires user login
- `/admin` - Requires admin login
- Auto-redirect to `/login` if not authenticated
- Auto-redirect to correct dashboard based on role

### Data Privacy
- Users can only see their own bookings
- Admins can see all bookings
- Passwords not returned in API responses

---

## Integration with Booking System

### How It Works

1. **Guest Booking** (No Login)
   - User fills booking form
   - Booking created with email
   - No user account needed

2. **Logged-in User Booking**
   - User logs in first
   - Email auto-populated from profile
   - Bookings appear in dashboard immediately
   - Can track all past bookings

3. **Admin Monitoring**
   - All bookings visible to admin
   - Can search by customer details
   - Filter by status
   - Track revenue

---

## API Endpoints

### Authentication API
**Endpoint:** `/api/auth`

**Methods:** POST

**Actions:**
- Login: Authenticate existing user
- Register: Create new user account

---

## Technical Implementation

### Frontend
- Next.js 16 with App Router
- TypeScript for type safety
- Client-side routing
- LocalStorage for session management

### State Management
- React useState hooks
- useEffect for data fetching
- useRouter for navigation

### Styling
- Tailwind CSS
- Gradient backgrounds
- Responsive design
- Color-coded status indicators

---

## Future Enhancements

### Recommended Features
1. **Database Integration**
   - Replace in-memory storage with PostgreSQL/MongoDB
   - Persistent user data
   - Secure password hashing (bcrypt)

2. **Enhanced Authentication**
   - JWT tokens
   - Refresh tokens
   - Password reset functionality
   - Email verification

3. **Admin Features**
   - Update booking status
   - Delete bookings
   - Customer management
   - Analytics dashboard
   - Export reports (CSV/PDF)

4. **User Features**
   - Profile management
   - Booking history
   - Cancel booking
   - Rebook previous orders
   - Notifications

5. **Notifications**
   - Email confirmations
   - SMS updates
   - Push notifications
   - Status change alerts

6. **Payment Integration**
   - M-Pesa integration
   - Card payments
   - Payment history
   - Invoice generation

---

## Usage Instructions

### For Customers

1. **First Time User**
   ```
   1. Visit home page (/)
   2. Click "Login" button
   3. Switch to "Register" tab
   4. Enter email and password
   5. Auto-redirected to dashboard
   ```

2. **Making a Booking**
   ```
   Option A - Without Login:
   1. Select plan
   2. Enter weight
   3. Fill booking form
   4. Submit

   Option B - After Login:
   1. Logout and go to home
   2. Select plan
   3. Enter weight
   4. Fill form (use same email)
   5. View in dashboard
   ```

3. **Tracking Bookings**
   ```
   1. Login to account
   2. View dashboard
   3. See all bookings
   4. Check status
   ```

### For Administrators

1. **Access Admin Panel**
   ```
   1. Visit /login
   2. Use admin credentials
   3. Auto-redirected to admin dashboard
   ```

2. **Monitor Bookings**
   ```
   1. View statistics cards
   2. Check pending bookings
   3. Track revenue
   ```

3. **Search Customers**
   ```
   1. Use search bar
   2. Enter name/email/booking ID
   3. Filter by status
   ```

---

## Development

### Running Locally
```bash
cd mama-fua
npm run dev
```

### Testing Authentication
```bash
# Test login
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123","action":"login"}'

# Test registration
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@example.com","password":"password123","action":"register"}'
```

---

## Troubleshooting

### Common Issues

**Can't access dashboard after login**
- Clear localStorage
- Check console for errors
- Verify credentials

**Bookings not showing in user dashboard**
- Ensure booking email matches user email
- Check API response
- Verify booking was created

**Admin can't see all bookings**
- Verify admin role in localStorage
- Check API permissions
- Clear cache and reload

---

## Support

For issues or questions:
- Check API_DOCUMENTATION.md
- Review console logs
- Verify credentials
- Clear browser cache

---

Built with Next.js, TypeScript, and Tailwind CSS
