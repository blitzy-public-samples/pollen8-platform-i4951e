import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Input } from 'src/frontend/components/ui/Input';

describe('Input component', () => {
  it('renders with default props', () => {
    const { getByRole } = render(<Input />);
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with different input types', () => {
    const types = ['text', 'password', 'email', 'number'];
    types.forEach(type => {
      const { getByTestId } = render(<Input type={type} data-testid={`input-${type}`} />);
      const input = getByTestId(`input-${type}`);
      expect(input).toHaveAttribute('type', type);
    });
  });

  it('displays placeholder text', () => {
    const placeholder = 'Enter your name';
    const { getByPlaceholderText } = render(<Input placeholder={placeholder} />);
    expect(getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it('handles value prop and onChange functionality', () => {
    const handleChange = jest.fn();
    const { getByRole } = render(<Input value="initial" onChange={handleChange} />);
    const input = getByRole('textbox');
    
    expect(input).toHaveValue('initial');
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies disabled state', () => {
    const { getByRole } = render(<Input disabled />);
    const input = getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('displays error state and message', () => {
    const errorMessage = 'This field is required';
    const { getByRole, getByText } = render(<Input error errorMessage={errorMessage} />);
    const input = getByRole('textbox');
    
    expect(input).toHaveClass('error'); // Assuming 'error' class is added for error state
    expect(getByText(errorMessage)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-input';
    const { getByRole } = render(<Input className={customClass} />);
    const input = getByRole('textbox');
    expect(input).toHaveClass(customClass);
  });
});