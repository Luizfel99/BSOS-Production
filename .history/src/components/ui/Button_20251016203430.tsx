/**
 * BSOS Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Follows BSOS design system and accessibility standards.
 */

import React, { forwardRef } from 'react';
import { cn } from './utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: [
    'bg-blue-600 text-white border-blue-600',
    'hover:bg-blue-700 hover:border-blue-700',
    'focus:bg-blue-700 focus:border-blue-700',
    'active:bg-blue-800 active:border-blue-800',
    'disabled:bg-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed',
  ],
  secondary: [
    'bg-cyan-600 text-white border-cyan-600',
    'hover:bg-cyan-700 hover:border-cyan-700',
    'focus:bg-cyan-700 focus:border-cyan-700',
    'active:bg-cyan-800 active:border-cyan-800',
    'disabled:bg-cyan-300 disabled:border-cyan-300 disabled:cursor-not-allowed',
  ],
  outline: [
    'bg-transparent text-blue-600 border-blue-600',
    'hover:bg-blue-50 hover:text-blue-700',
    'focus:bg-blue-50 focus:text-blue-700',
    'active:bg-blue-100',
    'disabled:text-blue-300 disabled:border-blue-300 disabled:cursor-not-allowed',
  ],
  ghost: [
    'bg-transparent text-slate-700 border-transparent',
    'hover:bg-slate-100 hover:text-slate-800',
    'focus:bg-slate-100 focus:text-slate-800',
    'active:bg-slate-200',
    'disabled:text-slate-400 disabled:cursor-not-allowed',
  ],
  destructive: [
    'bg-red-600 text-white border-red-600',
    'hover:bg-red-700 hover:border-red-700',
    'focus:bg-red-700 focus:border-red-700',
    'active:bg-red-800 active:border-red-800',
    'disabled:bg-red-300 disabled:border-red-300 disabled:cursor-not-allowed',
  ],
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
  md: 'px-4 py-2 text-base rounded-md min-h-[40px]',
  lg: 'px-6 py-3 text-lg rounded-lg min-h-[48px]',
};

const LoadingSpinner = ({ size }: { size: ButtonSize }) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  
  return (
    <svg
      className={cn('animate-spin', spinnerSize)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium border transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'touch-target', // From globals.css
          
          // Size styles
          buttonSizes[size],
          
          // Variant styles
          buttonVariants[variant],
          
          // Width styles
          fullWidth && 'w-full',
          
          // Custom className
          className
        )}
        {...props}
      >
        {/* Left Icon or Loading Spinner */}
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : leftIcon ? (
          <span className="mr-2 flex-shrink-0">{leftIcon}</span>
        ) : null}

        {/* Button Text */}
        <span className={cn(isLoading && 'ml-2')}>
          {isLoading && loadingText ? loadingText : children}
        </span>

        {/* Right Icon */}
        {!isLoading && rightIcon && (
          <span className="ml-2 flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';