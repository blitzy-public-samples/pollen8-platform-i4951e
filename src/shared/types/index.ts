// Shared TypeScript type definitions for the Pollen8 application

// User interface
export interface User {
  id: string;
  phoneNumber: string;
  username: string;
  location: string;
  createdAt: Date;
  lastLogin: Date;
}

// Invite interface
export interface Invite {
  id: string;
  userId: string;
  linkName: string;
  linkUrl: string;
  clickCount: number;
  createdAt: Date;
}

// Industry interface
export interface Industry {
  id: string;
  name: string;
}

// Interest interface
export interface Interest {
  id: string;
  name: string;
}

// Connection interface
export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  connectedAt: Date;
}

// NetworkValue interface
export interface NetworkValue {
  id: string;
  userId: string;
  value: number;
  calculatedAt: Date;
}

// IndustryNetwork interface
export interface IndustryNetwork {
  id: string;
  industryId: string;
  name: string;
  createdAt: Date;
}

// Post interface
export interface Post {
  id: string;
  userId: string;
  industryNetworkId: string;
  content: string;
  createdAt: Date;
}

// Generic API response type
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

// ButtonProps interface
export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant: string;
  size: string;
  disabled: boolean;
}

// InputProps interface
export interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

// DropdownProps interface
export interface DropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  placeholder: string;
}

// ModalProps interface
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// CardProps interface
export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// ToastProps interface
export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

// TODO: Review and validate all type definitions to ensure they match the latest database schema and component requirements
// TODO: Add any missing type definitions for newly implemented features or components
// TODO: Ensure that all exported types are properly documented with JSDoc comments for better IDE support