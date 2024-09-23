import React from 'react';
import { InputProps } from 'src/shared/types/index';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

export const Input: React.FC<InputProps> = React.memo(({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className,
  ...rest
}) => {
  // Define base classes for the input using Tailwind CSS
  const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';

  // Define type-specific classes based on the type prop
  const typeClasses = {
    text: 'text-black',
    password: 'text-black',
    email: 'text-black',
    number: 'text-black',
    // Add more type-specific classes as needed
  };

  // Define state-specific classes
  const stateClasses = {
    default: `border-gray-300 focus:border-${COLORS.PRIMARY} focus:ring-${COLORS.PRIMARY}`,
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
  };

  // Combine all classes using the classNames utility
  const inputClasses = classNames(
    baseClasses,
    typeClasses[type as keyof typeof typeClasses] || typeClasses.text,
    disabled ? stateClasses.disabled : stateClasses.default,
    className
  );

  // Return an input element with the combined classes and props
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={inputClasses}
      {...rest}
    />
  );
});

Input.displayName = 'Input';