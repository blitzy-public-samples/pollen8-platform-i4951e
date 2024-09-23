import React from 'react';
import { CardProps } from 'src/shared/types/index';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';

export const Card: React.FC<CardProps> = React.memo(({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  // Define base classes for the card
  const baseClasses = 'rounded-lg shadow-md p-4';

  // Define variant classes
  const variantClasses = {
    default: `bg-${COLORS.PRIMARY} text-${COLORS.SECONDARY}`,
    outlined: `bg-${COLORS.SECONDARY} text-${COLORS.PRIMARY} border border-${COLORS.PRIMARY}`,
    elevated: `bg-${COLORS.SECONDARY} text-${COLORS.PRIMARY} shadow-lg`,
  };

  // Combine all classes
  const cardClasses = classNames(
    baseClasses,
    variantClasses[variant],
    className
  );

  // Return the card component
  return (
    <div 
      className={cardClasses} 
      {...props}
      role="article"
      aria-label={`${variant} card`}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';