import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from 'src/frontend/components/ui/Button';

describe('Button component', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Button label="Default Button" />);
    const button = getByRole('button');
    expect(button).toHaveTextContent('Default Button');
    expect(button).toHaveClass('btn-primary');
    expect(button).not.toBeDisabled();
  });

  it('renders with custom label', () => {
    const { getByRole } = render(<Button label="Custom Label" />);
    expect(getByRole('button')).toHaveTextContent('Custom Label');
  });

  it('renders with different variants', () => {
    const { getByRole: getPrimary } = render(<Button label="Primary" variant="primary" />);
    const { getByRole: getSecondary } = render(<Button label="Secondary" variant="secondary" />);
    
    expect(getPrimary('button')).toHaveClass('btn-primary');
    expect(getSecondary('button')).toHaveClass('btn-secondary');
  });

  it('renders with different sizes', () => {
    const { getByRole: getSmall } = render(<Button label="Small" size="small" />);
    const { getByRole: getMedium } = render(<Button label="Medium" size="medium" />);
    const { getByRole: getLarge } = render(<Button label="Large" size="large" />);
    
    expect(getSmall('button')).toHaveClass('btn-small');
    expect(getMedium('button')).toHaveClass('btn-medium');
    expect(getLarge('button')).toHaveClass('btn-large');
  });

  it('renders in disabled state', () => {
    const { getByRole } = render(<Button label="Disabled" disabled />);
    expect(getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button label="Clickable" onClick={handleClick} />);
    fireEvent.click(getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    const { getByRole } = render(<Button label="Disabled" onClick={handleClick} disabled />);
    fireEvent.click(getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});