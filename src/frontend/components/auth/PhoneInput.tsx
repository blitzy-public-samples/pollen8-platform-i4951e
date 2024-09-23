import React, { useState, useEffect } from 'react';
import { Input } from 'src/frontend/components/ui/Input';
import { Button } from 'src/frontend/components/ui/Button';
import { COLORS, PHONE_REGEX } from 'src/shared/constants/index';
import { formatPhoneNumber, validatePhoneNumber } from 'src/shared/utils/index';
import classNames from 'classnames';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onSubmit: () => void;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = React.memo(({
  value,
  onChange,
  disabled = false,
  onSubmit,
  className
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setError(validatePhoneNumber(newValue) ? '' : 'Invalid phone number');
  };

  const handleSubmit = () => {
    if (validatePhoneNumber(inputValue)) {
      onSubmit();
    } else {
      setError('Please enter a valid phone number');
    }
  };

  useEffect(() => {
    setInputValue(formatPhoneNumber(value));
  }, [value]);

  return (
    <div className={classNames('flex flex-col', className)}>
      <div className="flex">
        <Input
          type="tel"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Enter phone number"
          className="flex-grow mr-2"
          aria-label="Phone number input"
          aria-invalid={!!error}
        />
        <Button
          onClick={handleSubmit}
          disabled={disabled || !!error}
          className="bg-black text-white"
        >
          Submit
        </Button>
      </div>
      {error && (
        <p className="text-red-500 mt-1 text-sm" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = 'PhoneInput';