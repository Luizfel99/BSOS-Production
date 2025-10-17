/**
 * BSOS Badge Component
 * 
 * A small status descriptor component for labels, counts, and status indicators.
 */

import React, { forwardRef } from 'react';
import { cn } from './utils/cn';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const badgeVariants = {
  default: 'bg-slate-100 text-slate-800 border-slate-200',
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  outline: 'bg-transparent text-slate-600 border-slate-300',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-sm rounded-md',
  lg: 'px-3 py-1.5 text-base rounded-lg',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center font-medium border transition-colors duration-200',
          
          // Size styles
          badgeSizes[size],
          
          // Variant styles
          badgeVariants[variant],
          
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';