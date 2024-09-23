import React, { useState } from 'react';
import { useAuth } from 'src/shared/contexts/index.ts';
import PhoneInput from 'src/frontend/components/auth/PhoneInput.tsx';
import OTPInput from 'src/frontend/components/auth/OTPInput.tsx';
import Button from 'src/frontend/components/ui/Button.tsx';
import Card from 'src/frontend/components/ui/Card.tsx';
import Toast from 'src/frontend/components/ui/Toast.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

const LoginForm: React.FC = React.memo(() => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const { login } = useAuth();

  const handlePhoneSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Assuming there's an API call to request OTP
      await requestOTP(phoneNumber);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await login(phoneNumber, otp);
      Toast.success('Login successful!');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Login to Pollen8</h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Connect with your professional network
      </p>

      {step === 'phone' ? (
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          disabled={isLoading}
        />
      ) : (
        <OTPInput
          length={6}
          onComplete={setOTP}
          disabled={isLoading}
        />
      )}

      <Button
        label={step === 'phone' ? 'Request OTP' : 'Login'}
        onClick={step === 'phone' ? handlePhoneSubmit : handleOTPSubmit}
        disabled={isLoading || (step === 'phone' ? !phoneNumber : !otp)}
        className="w-full mt-4"
      />

      {error && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </Card>
  );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;

// Helper function to request OTP (to be implemented)
const requestOTP = async (phoneNumber: string) => {
  // Implement API call to request OTP
};