/**
 * BSOS Modal Component
 * 
 * A flexible modal dialog component with backdrop, focus management,
 * and accessibility features following ARIA guidelines.
 */

import React, { forwardRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './utils/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      size = 'md',
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      children,
      className,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    // Handle escape key
    useEffect(() => {
      if (!closeOnEscape) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isOpen, onClose, closeOnEscape]);

    // Focus management
    useEffect(() => {
      if (isOpen) {
        // Store the currently focused element
        previousActiveElement.current = document.activeElement;
        
        // Focus the modal
        const modalElement = modalRef.current;
        if (modalElement) {
          // Focus the first focusable element or the modal itself
          const focusableElements = modalElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          } else {
            modalElement.focus();
          }
        }
      } else {
        // Restore focus to the previously focused element
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      }
    }, [isOpen]);

    // Body scroll lock
    useEffect(() => {
      if (isOpen) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
    }, [isOpen]);

    // Handle backdrop click
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && event.target === event.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) {
      return null;
    }

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ zIndex: 1050 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          tabIndex={-1}
          className={cn(
            // Base styles
            'relative bg-white rounded-lg shadow-xl w-full mx-4',
            'transform transition-all duration-300 ease-out',
            'max-h-[90vh] overflow-hidden flex flex-col',
            
            // Size styles
            modalSizes[size],
            
            // Animation styles
            'animate-fade-in',
            
            // Custom className
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              {title && (
                <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors duration-200 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close modal"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    );

    // Render modal in portal
    return typeof document !== 'undefined'
      ? createPortal(modalContent, document.body)
      : null;
  }
);

Modal.displayName = 'Modal';

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6 border-b border-slate-200', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-6', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';