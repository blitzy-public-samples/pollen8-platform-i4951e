import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { LoginForm } from 'src/frontend/components/auth/LoginForm.tsx';
import { useAuth, AuthProvider } from 'src/shared/contexts/index.ts';

// Mock the useAuth hook
jest.mock('src/shared/contexts/index.ts', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('LoginForm component', () => {
  const mockLogin = jest.fn();
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders LoginForm component', () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    expect(getByPlaceholderText('Enter phone number')).toBeInTheDocument();
    expect(getByText('Request OTP')).toBeInTheDocument();
  });

  it('handles phone number input', () => {
    const { getByPlaceholderText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    expect(phoneInput.value).toBe('1234567890');
  });

  it('handles OTP input', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(getByText('Request OTP'));

    await waitFor(() => {
      const otpInput = getByPlaceholderText('Enter OTP') as HTMLInputElement;
      fireEvent.change(otpInput, { target: { value: '123456' } });
      expect(otpInput.value).toBe('123456');
    });
  });

  it('submits form with valid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(getByText('Request OTP'));

    await waitFor(() => {
      const otpInput = getByPlaceholderText('Enter OTP') as HTMLInputElement;
      fireEvent.change(otpInput, { target: { value: '123456' } });
      fireEvent.click(getByText('Login'));
    });

    expect(mockLogin).toHaveBeenCalledWith('1234567890', '123456');
  });

  it('displays error message for invalid inputs', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '123' } });
    fireEvent.click(getByText('Request OTP'));

    await waitFor(() => {
      expect(getByText('Invalid phone number')).toBeInTheDocument();
    });
  });

  it('displays loading state during form submission', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(getByText('Request OTP'));

    await waitFor(() => {
      const otpInput = getByPlaceholderText('Enter OTP') as HTMLInputElement;
      fireEvent.change(otpInput, { target: { value: '123456' } });
      fireEvent.click(getByText('Login'));
    });

    expect(getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('handles successful login and redirection', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    mockUseAuth.mockReturnValue({
      login: mockLogin,
      isAuthenticated: true,
      user: { id: '1', phoneNumber: '1234567890' },
      logout: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<LoginForm />);
    const phoneInput = getByPlaceholderText('Enter phone number') as HTMLInputElement;
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    fireEvent.click(getByText('Request OTP'));

    await waitFor(() => {
      const otpInput = getByPlaceholderText('Enter OTP') as HTMLInputElement;
      fireEvent.change(otpInput, { target: { value: '123456' } });
      fireEvent.click(getByText('Login'));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('integrates with AuthContext', () => {
    const { getByText } = render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
    expect(getByText('Request OTP')).toBeInTheDocument();
  });
});