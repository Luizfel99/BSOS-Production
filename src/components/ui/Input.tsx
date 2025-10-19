/**
 * BSOS Input Component
 * 
 * A flexible input component with variants, sizes, and validation states.
 * Includes support for icons, helper text, and error states.
 */

import React, { forwardRef } from 'react';
import { cn } from './utils/cn';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const inputSizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md min-h-[32px]',
  md: 'px-4 py-2 text-base rounded-md min-h-[40px]',
  lg: 'px-4 py-3 text-lg rounded-lg min-h-[48px]',
};

const inputStates = {
  default: [
    'border-slate-300 bg-white text-slate-900',
    'hover:border-slate-400',
    'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
  ],
  error: [
    'border-red-500 bg-white text-slate-900',
    'hover:border-red-600',
    'focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20',
  ],
  success: [
    'border-green-500 bg-white text-slate-900',
    'hover:border-green-600',
    'focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20',
  ],
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      state = 'default',
      label,
      helperText,
      errorMessage,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const currentState = errorMessage ? 'error' : state;
    const currentHelperText = errorMessage || helperText;

    return (
      <div className={cn('flex flex-col', fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={
              currentHelperText ? (errorMessage ? errorId : helperId) : undefined
            }
            aria-invalid={currentState === 'error'}
            className={cn(
              // Base styles
              'w-full border transition-all duration-200 ease-in-out',
              'placeholder:text-slate-400',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200',
              'focus:outline-none',

              // Size styles
              inputSizes[size],

              // State styles
              inputStates[currentState],

              // Icon padding adjustments
              leftIcon && (size === 'sm' ? 'pl-9' : size === 'lg' ? 'pl-12' : 'pl-10'),
              rightIcon && (size === 'sm' ? 'pr-9' : size === 'lg' ? 'pr-12' : 'pr-10'),

              // Custom className
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {currentHelperText && (
          <p
            id={errorMessage ? errorId : helperId}
            className={cn(
              'mt-1.5 text-sm',
              currentState === 'error' ? 'text-red-600' : 'text-slate-600'
            )}
          >
            {currentHelperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';