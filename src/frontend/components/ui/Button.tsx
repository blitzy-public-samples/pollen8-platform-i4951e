import React from 'react';
import { ButtonProps } from 'src/shared/types/index.ts';
import { COLORS } from 'src/shared/constants/index.ts';
import classNames from 'classnames';

export const Button: React.FC<ButtonProps> = React.memo(({
  label,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  ...rest
}) => {
  // Define base classes for the button using Tailwind CSS
  const baseClasses = 'font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Define variant classes based on the variant prop
  const variantClasses = {
    primary: `bg-${COLORS.PRIMARY} text-${COLORS.SECONDARY} hover:bg-opacity-90 focus:ring-${COLORS.PRIMARY}`,
    secondary: `bg-${COLORS.SECONDARY} text-${COLORS.PRIMARY} border border-${COLORS.PRIMARY} hover:bg-${COLORS.PRIMARY} hover:text-${COLORS.SECONDARY} focus:ring-${COLORS.PRIMARY}`,
    ghost: `bg-transparent text-${COLORS.PRIMARY} hover:bg-${COLORS.PRIMARY} hover:bg-opacity-10 focus:ring-${COLORS.PRIMARY}`,
  };

  // Define size classes based on the size prop
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  // Combine all classes using the classNames utility
  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'opacity-50 cursor-not-allowed': disabled,
    },
    className
  );

  // Return a button element with the combined classes, onClick handler, disabled state, and label
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      aria-disabled={disabled}
    >
      {label}
    </button>
  );
});

Button.displayName = 'Button';