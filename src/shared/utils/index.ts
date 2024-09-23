import { PHONE_REGEX, DATE_FORMAT, NETWORK_VALUE_THRESHOLDS, API_BASE_URL } from 'src/shared/constants/index.ts';
import { User } from 'src/shared/types/index.ts';
import { format } from 'date-fns';
import { nanoid } from 'nanoid';

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters from the input
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if the cleaned number matches the PHONE_REGEX
  if (PHONE_REGEX.test(cleaned)) {
    // Format the number as +X (XXX) XXX-XXXX
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // If invalid, return the original input
  return phoneNumber;
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  // Test the input phone number against PHONE_REGEX
  return PHONE_REGEX.test(phoneNumber);
}

export function formatDate(date: Date, formatString: string = DATE_FORMAT): string {
  // Use the format function with the provided date and format string
  return format(date, formatString);
}

export function calculateNetworkValue(user: User): number {
  // Calculate base value based on number of connections
  let value = user.connections.length * 10;

  // Apply multipliers for user activity (posts, invites, etc.)
  value += user.posts.length * 5;
  value += user.invites.length * 3;

  // Apply thresholds from NETWORK_VALUE_THRESHOLDS
  if (value > NETWORK_VALUE_THRESHOLDS.HIGH) {
    value *= 1.5;
  } else if (value > NETWORK_VALUE_THRESHOLDS.MEDIUM) {
    value *= 1.2;
  }

  // Return the final calculated value
  return Math.round(value);
}

export function generateInviteLink(userId: string): string {
  // Generate a unique identifier using nanoid
  const uniqueId = nanoid(10);

  // Combine API_BASE_URL, '/invite/', userId, and the unique identifier
  return `${API_BASE_URL}/invite/${userId}/${uniqueId}`;
}

export function truncateText(text: string, maxLength: number): string {
  // Check if the text length is greater than maxLength
  if (text.length > maxLength) {
    // Slice the text to maxLength - 3 and add '...'
    return text.slice(0, maxLength - 3) + '...';
  }

  // If not, return the original text
  return text;
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let lastInvocationTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastInvocationTime >= wait) {
      func(...args);
      lastInvocationTime = now;
    }
  };
}