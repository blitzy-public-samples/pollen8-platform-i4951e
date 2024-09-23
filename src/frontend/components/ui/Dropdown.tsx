import React, { useState, useRef, useEffect } from 'react';
import { DropdownProps } from 'src/shared/types/index';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';
import { useOnClickOutside } from 'src/shared/hooks/index';

export const Dropdown: React.FC<DropdownProps> = React.memo(({
  options,
  selectedOption,
  onSelect,
  placeholder = 'Select an option',
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const baseClasses = 'relative inline-block text-left';
  const toggleClasses = classNames(
    'inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black',
    {
      'opacity-50 cursor-not-allowed': disabled,
    }
  );
  const optionsClasses = 'origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none';

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={classNames(baseClasses, className)} ref={dropdownRef}>
      <div>
        <button
          type="button"
          className={toggleClasses}
          onClick={toggleDropdown}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
        >
          <span>{selectedOption || placeholder}</span>
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={optionsClasses} role="listbox">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                className={classNames(
                  'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                  {
                    'bg-gray-100 text-gray-900': option === selectedOption,
                  }
                )}
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={option === selectedOption}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';