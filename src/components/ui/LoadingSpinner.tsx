/**
 * BSOS Loading Spinner Component
 * 
 * A customizable loading spinner for async operations and loading states.
 */

import React, { forwardRef } from 'react';
import { cn } from './utils/cn';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  label?: string;
  centered?: boolean;
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const spinnerColors = {
  primary: 'text-blue-600',
  secondary: 'text-cyan-600',
  white: 'text-white',
  current: 'text-current',
};

export const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  (
    {
      size = 'md',
      color = 'primary',
      label = 'Loading...',
      centered = false,
      className,
      ...props
    },
    ref
  ) => {
    const spinner = (
      <svg
        className={cn(
          'animate-spin',
          spinnerSizes[size],
          spinnerColors[color]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="img"
        aria-label={label}
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

    if (centered) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center',
            className
          )}
          {...props}
        >
          {spinner}
          <span className="sr-only">{label}</span>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        {spinner}
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';