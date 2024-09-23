import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { ToastProps } from 'src/shared/types/index';
import { COLORS } from 'src/shared/constants/index';

export const Toast: React.FC<ToastProps> = React.memo(({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const baseClasses = 'fixed bottom-4 right-4 p-4 rounded-md shadow-lg transition-opacity duration-300';
  const typeClasses = {
    'info': `bg-${COLORS.PRIMARY} text-${COLORS.SECONDARY}`,
    'success': `bg-green-500 text-${COLORS.SECONDARY}`,
    'error': `bg-red-500 text-${COLORS.SECONDARY}`,
    'warning': `bg-yellow-500 text-${COLORS.PRIMARY}`
  };

  const toastClasses = classNames(
    baseClasses,
    typeClasses[type],
    { 'opacity-0': !isVisible },
    className
  );

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  if (!isVisible) return null;

  const toastContent = (
    <div className={toastClasses} role="alert">
      <div className="flex items-center">
        <p className="mr-2">{message}</p>
        <button 
          onClick={handleClose}
          className="ml-auto text-sm hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
});

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: ToastProps) => {
    setToasts(prevToasts => [...prevToasts, { ...toast, id: Date.now() }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return { toasts, addToast, removeToast, clearToasts };
};

// Human tasks:
// - Add unit tests for the Toast component and useToast hook
// - Implement animations for smooth appearance and disappearance of toasts
// - Ensure the toast component is responsive on all screen sizes
// - Add support for custom icons or images in toasts
// - Implement a queueing system for multiple toasts
// - Add support for action buttons within toasts (e.g., 'Undo' for certain notifications)
// - Ensure proper contrast ratios for text and background colors in different toast types
// - Implement keyboard accessibility for dismissing toasts
// - Optimize performance for scenarios with multiple simultaneous toasts