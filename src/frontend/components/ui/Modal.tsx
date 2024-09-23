import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from 'src/shared/types/index';
import { COLORS } from 'src/shared/constants/index';
import classNames from 'classnames';
import Button from 'src/frontend/components/ui/Button';

const Modal: React.FC<ModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  className,
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const overlayClasses = classNames(
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
    className
  );

  const modalClasses = classNames(
    'bg-white rounded-lg shadow-xl max-w-md w-full mx-4',
    'transform transition-all duration-300',
    isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick} {...props}>
      <div className={modalClasses} onClick={handleContentClick}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <Button
              onClick={onClose}
              variant="text"
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              &times;
            </Button>
          </div>
          <div className="mb-6">{children}</div>
          <div className="flex justify-end">
            <Button onClick={onClose} variant="secondary" className="mr-2">
              Cancel
            </Button>
            <Button onClick={onClose} variant="primary">
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default Modal;