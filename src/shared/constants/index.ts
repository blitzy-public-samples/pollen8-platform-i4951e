// Constants for Pollen8 application

// API base URL
export const API_BASE_URL = "https://api.pollen8.com/v1";

// Maximum number of invite links a user can create
export const MAX_INVITE_LINKS = 5;

// Maximum size of a user's network
export const MAX_NETWORK_SIZE = 500;

// List of available industries
export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing"
];

// List of available interests
export const INTERESTS = [
  "Networking",
  "Entrepreneurship",
  "Innovation",
  "Leadership",
  "Personal Growth"
];

// Error messages
export const ERROR_MESSAGES = {
  INVALID_PHONE: "Invalid phone number format",
  INVALID_OTP: "Invalid OTP. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  UNAUTHORIZED: "Unauthorized access. Please log in again"
};

// Success messages
export const SUCCESS_MESSAGES = {
  INVITE_SENT: "Invite sent successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  NETWORK_JOINED: "Successfully joined the network"
};

// Network value thresholds
export const NETWORK_VALUE_THRESHOLDS = {
  LOW: 10,
  MEDIUM: 50,
  HIGH: 100
};

// Date format
export const DATE_FORMAT = "YYYY-MM-DD";

// Regular expressions
export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Color scheme
export const COLORS = {
  PRIMARY: "#000000",
  SECONDARY: "#FFFFFF",
  ACCENT: "#808080"
};