import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/shared/contexts/index.ts';
import { Button } from 'src/frontend/components/ui/Button.tsx';
import { PhoneInput } from 'src/frontend/components/auth/PhoneInput.tsx';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

export const Welcome: React.FC = React.memo(() => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handlePhoneSubmit = async () => {
    setIsSubmitting(true);
    try {
      await login(phoneNumber);
      // Redirect will be handled by the useEffect hook
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Implement error handling and display
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      <h1 className="text-6xl font-bold mb-8 animate-pulse">
        POLLEN<span className="text-gray-500">8</span>
      </h1>

      <p className="text-xl mb-8 text-center max-w-md">
        Welcome to the future of professional networking. Connect, grow, and thrive with Pollen8.
      </p>

      <div className="w-full max-w-md mb-6">
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          disabled={isSubmitting}
          className="mb-4"
        />
      </div>

      <Button
        label="GET CONNECTED"
        onClick={handlePhoneSubmit}
        disabled={isSubmitting || !phoneNumber}
        className={classNames(
          "w-full max-w-md transition-all duration-300 ease-in-out",
          {
            "opacity-50 cursor-not-allowed": isSubmitting || !phoneNumber,
            "hover:bg-gray-800": !isSubmitting && phoneNumber
          }
        )}
      />

      <p className="mt-8 text-sm text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
});

Welcome.displayName = 'Welcome';