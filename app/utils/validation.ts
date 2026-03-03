// Form validation utilities

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email) {
    return { valid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Please enter a valid email address" };
  }

  return { valid: true };
};

export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) {
    return { valid: false, error: "Phone number is required" };
  }

  // Remove spaces, dashes, and parentheses
  const cleanPhone = phone.replace(/[\s\-()]/g, "");

  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: "Please enter a valid phone number (e.g., +254 700 000 000)" };
  }

  return { valid: true };
};

export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name) {
    return { valid: false, error: "Name is required" };
  }

  if (name.length < 2) {
    return { valid: false, error: "Name must be at least 2 characters" };
  }

  if (name.length > 100) {
    return { valid: false, error: "Name must be less than 100 characters" };
  }

  return { valid: true };
};

export const validateAddress = (address: string): { valid: boolean; error?: string } => {
  if (!address) {
    return { valid: false, error: "Address is required" };
  }

  if (address.length < 10) {
    return { valid: false, error: "Please provide a complete address (at least 10 characters)" };
  }

  if (address.length > 500) {
    return { valid: false, error: "Address must be less than 500 characters" };
  }

  return { valid: true };
};

export const validateWeight = (weight: number): { valid: boolean; error?: string } => {
  if (!weight || weight <= 0) {
    return { valid: false, error: "Weight must be greater than 0" };
  }

  if (weight > 1000) {
    return { valid: false, error: "Weight cannot exceed 1000 kg. Please contact us for bulk orders." };
  }

  return { valid: true };
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, error: "Password must be at least 6 characters" };
  }

  return { valid: true };
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If it starts with +254 (Kenya), format it nicely
  if (cleaned.startsWith("+254")) {
    const number = cleaned.substring(4);
    if (number.length === 9) {
      return `+254 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }

  return phone;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return formatDate(dateString);
};
