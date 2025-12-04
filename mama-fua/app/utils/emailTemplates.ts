// Email templates for booking notifications

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  weight: number;
  createdAt: string;
  status: string;
}

const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mama Fua - Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Mama Fua</h1>
              <p style="margin: 8px 0 0; color: #e9d5ff; font-size: 14px;">Professional Laundry Services</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Need help? Contact us:</p>
              <p style="margin: 0; color: #3b82f6; font-size: 14px; font-weight: 600;">
                <a href="mailto:info@mamafua.com" style="color: #3b82f6; text-decoration: none;">info@mamafua.com</a> • +254 700 000 000
              </p>
              <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
                © 2024 Mama Fua - Professional Laundry Services. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export function generateBookingConfirmationEmail(
  booking: Booking,
  planName: string,
  planPrice: number
): string {
  const total = planPrice * booking.weight;

  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">Booking Confirmed! 🎉</h2>

    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${booking.name},<br><br>
      Thank you for choosing Mama Fua! Your booking has been confirmed and we're excited to serve you.
    </p>

    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Booking Details</h3>

      <table width="100%" cellpadding="8" cellspacing="0">
        <tr>
          <td style="color: #6b7280; font-size: 14px;">Booking ID:</td>
          <td style="color: #111827; font-size: 14px; font-weight: 600; font-family: 'Courier New', monospace;">${booking.id}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;">Service Plan:</td>
          <td style="color: #111827; font-size: 14px; font-weight: 600;">${planName}</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;">Weight:</td>
          <td style="color: #111827; font-size: 14px; font-weight: 600;">${booking.weight} kg</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px;">Rate:</td>
          <td style="color: #111827; font-size: 14px; font-weight: 600;">KES ${planPrice}/kg</td>
        </tr>
        <tr>
          <td style="color: #6b7280; font-size: 14px; padding-top: 8px; border-top: 2px solid #9333ea;">Total Amount:</td>
          <td style="color: #9333ea; font-size: 18px; font-weight: 700; padding-top: 8px; border-top: 2px solid #9333ea;">KES ${total.toLocaleString()}</td>
        </tr>
      </table>
    </div>

    <h3 style="margin: 0 0 12px; color: #1f2937; font-size: 18px; font-weight: 600;">What's Next?</h3>

    <ol style="margin: 0 0 24px; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
      <li>Our team will contact you within 24 hours to confirm pickup details</li>
      <li>We'll collect your laundry at the scheduled time</li>
      <li>Your clothes will be cleaned with care using premium products</li>
      <li>We'll deliver them fresh and neatly folded to your doorstep</li>
    </ol>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
        <strong>Important:</strong> Please have your laundry ready for pickup. If you need to reschedule, contact us at least 2 hours in advance.
      </p>
    </div>

    <div style="text-align: center; margin-top: 32px;">
      <a href="tel:+254700000000" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Contact Us Now</a>
    </div>
  `;

  return getBaseTemplate(content);
}

export function generateStatusUpdateEmail(
  booking: Booking,
  newStatus: string,
  customerName: string
): string {
  const statusMessages = {
    pending: {
      title: "Booking Received",
      message: "We've received your booking and will contact you soon to schedule pickup.",
      icon: "⏳",
    },
    processing: {
      title: "Laundry in Progress",
      message: "Your laundry is being cleaned with care. We'll have it ready soon!",
      icon: "🔄",
    },
    completed: {
      title: "Ready for Delivery!",
      message: "Great news! Your laundry is clean, fresh, and ready for delivery.",
      icon: "✅",
    },
    cancelled: {
      title: "Booking Cancelled",
      message: "Your booking has been cancelled as requested. We hope to serve you again soon.",
      icon: "❌",
    },
  };

  const status = statusMessages[newStatus as keyof typeof statusMessages] || statusMessages.pending;

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; font-size: 64px; line-height: 1;">${status.icon}</div>
    </div>

    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; text-align: center;">${status.title}</h2>

    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
      Hi ${customerName},
    </p>

    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
      <p style="margin: 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
        ${status.message}
      </p>
    </div>

    <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-align: center;">Booking ID:</p>
      <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; text-align: center;">${booking.id}</p>
    </div>

    <p style="margin: 0 0 24px; color: #4b5563; font-size: 14px; line-height: 1.6; text-align: center;">
      If you have any questions, feel free to reach out to us anytime!
    </p>

    <div style="text-align: center;">
      <a href="mailto:info@mamafua.com" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Contact Support</a>
    </div>
  `;

  return getBaseTemplate(content);
}

export function generateWelcomeEmail(customerName: string, customerEmail: string): string {
  const content = `
    <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">Welcome to Mama Fua! 👋</h2>

    <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi ${customerName},<br><br>
      Welcome to Mama Fua - your trusted partner for professional laundry services! We're thrilled to have you with us.
    </p>

    <div style="background: linear-gradient(135deg, #f3e8ff 0%, #dbeafe 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px; color: #1f2937; font-size: 18px; font-weight: 600;">Why Choose Mama Fua?</h3>

      <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
        <li><strong>Affordable Prices:</strong> Starting from KES 50/kg</li>
        <li><strong>Fast Turnaround:</strong> Same-day to 48-hour service</li>
        <li><strong>Quality Care:</strong> Premium products and expert handling</li>
        <li><strong>Convenient Delivery:</strong> Pickup and delivery at your doorstep</li>
      </ul>
    </div>

    <h3 style="margin: 0 0 12px; color: #1f2937; font-size: 18px; font-weight: 600;">Get Started</h3>

    <p style="margin: 0 0 24px; color: #4b5563; font-size: 14px; line-height: 1.6;">
      Ready to enjoy fresh, clean clothes? Log in to your dashboard and create your first booking today!
    </p>

    <div style="text-align: center; margin-top: 32px;">
      <a href="https://mamafua.com/login" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Go to Dashboard</a>
    </div>
  `;

  return getBaseTemplate(content);
}

// Function to copy email to clipboard (for manual sending)
export function copyEmailToClipboard(html: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(html);
    return true;
  }
  return false;
}
