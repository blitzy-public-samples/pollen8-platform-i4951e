import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Welcome } from 'src/frontend/pages/Welcome.tsx';
import { AuthProvider, useAuth } from 'src/shared/contexts/index.ts';

// Mock the useAuth hook
jest.mock('src/shared/contexts/index.ts', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Welcome page', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it('renders Welcome page component', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(getByText('POLLEN8')).toBeInTheDocument();
    expect(getByText('GET CONNECTED')).toBeInTheDocument();
  });

  it('displays POLLEN8 animated text', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const animatedText = getByText('POLLEN8');
    expect(animatedText).toHaveClass('animate-fadeIn');
  });

  it('displays GET CONNECTED button', () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = getByText('GET CONNECTED');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('handles phone number input', () => {
    const { getByPlaceholderText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const phoneInput = getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput).toHaveValue('1234567890');
  });

  it('handles VERIFY button click', async () => {
    const mockLogin = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const phoneInput = getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    const verifyButton = getByText('VERIFY');
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('1234567890');
    });
  });

  it('redirects authenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { queryByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(queryByText('POLLEN8')).not.toBeInTheDocument();
  });

  it('displays error for invalid phone number', async () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const phoneInput = getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: 'invalid' } });

    const verifyButton = getByText('VERIFY');
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(getByText('Invalid phone number')).toBeInTheDocument();
    });
  });

  it('shows loading state during authentication', async () => {
    const mockLogin = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      logout: jest.fn(),
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <AuthProvider>
          <Welcome />
        </AuthProvider>
      </MemoryRouter>
    );

    const phoneInput = getByPlaceholderText('Enter your phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    const verifyButton = getByText('VERIFY');
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(getByText('Verifying...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(getByText('VERIFY')).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});