import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'src/frontend/components/ui/Input';
import { Button } from 'src/frontend/components/ui/Button';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = React.memo(({ length, onComplete, disabled = false, className }) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(length).fill(null));

  useEffect(() => {
    if (otpDigits.every(digit => digit !== '')) {
      onComplete(otpDigits.join(''));
    }
  }, [otpDigits, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      if (value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && index > 0 && otpDigits[index] === '') {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    const newOtpDigits = [...otpDigits];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtpDigits[i] = pastedData[i];
    }
    
    setOtpDigits(newOtpDigits);
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className={classNames('flex space-x-2', className)} aria-label="OTP Input">
      {otpDigits.map((digit, index) => (
        <Input
          key={index}
          type="text"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
          className="w-12 h-12 text-center text-2xl"
          ref={(el) => (inputRefs.current[index] = el)}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
});

OTPInput.displayName = 'OTPInput';