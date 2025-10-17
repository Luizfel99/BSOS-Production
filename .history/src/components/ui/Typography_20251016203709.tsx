/**
 * BSOS Typography Component
 * 
 * A comprehensive typography component for consistent text styling
 * across the BSOS platform with semantic HTML elements.
 */

import React, { forwardRef } from 'react';
import { cn } from './utils/cn';

export type TypographyVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body1' | 'body2' | 'caption' | 'overline'
  | 'display1' | 'display2' | 'display3';

export type TypographyColor = 
  | 'primary' | 'secondary' | 'muted' | 'inverse'
  | 'success' | 'warning' | 'error' | 'inherit';

export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TypographyAlign;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  as?: keyof JSX.IntrinsicElements;
  truncate?: boolean;
  children: React.ReactNode;
}

const typographyVariants = {
  display1: 'text-4xl font-extrabold leading-tight tracking-tight',
  display2: 'text-3xl font-bold leading-tight tracking-tight',
  display3: 'text-2xl font-bold leading-tight',
  h1: 'text-3xl font-bold leading-tight',
  h2: 'text-2xl font-semibold leading-tight',
  h3: 'text-xl font-semibold leading-tight',
  h4: 'text-lg font-semibold leading-normal',
  h5: 'text-base font-semibold leading-normal',
  h6: 'text-sm font-semibold leading-normal',
  body1: 'text-base font-normal leading-normal',
  body2: 'text-sm font-normal leading-normal',
  caption: 'text-xs font-normal leading-normal',
  overline: 'text-xs font-medium leading-normal uppercase tracking-wide',
};

const typographyColors = {
  primary: 'text-slate-900',
  secondary: 'text-slate-700',
  muted: 'text-slate-500',
  inverse: 'text-white',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  inherit: 'text-inherit',
};

const typographyWeights = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const typographyAligns = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

// Default semantic elements for each variant
const defaultElements: Record<TypographyVariant, keyof JSX.IntrinsicElements> = {
  display1: 'h1',
  display2: 'h1',
  display3: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body1',
      color = 'primary',
      align = 'left',
      weight,
      as,
      truncate = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || defaultElements[variant];

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          // Base typography styles
          typographyVariants[variant],
          
          // Color styles
          typographyColors[color],
          
          // Alignment styles
          typographyAligns[align],
          
          // Weight override
          weight && typographyWeights[weight],
          
          // Truncation
          truncate && 'truncate',
          
          // Custom className
          className
        ),
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
export const Heading = forwardRef<HTMLHeadingElement, Omit<TypographyProps, 'variant'> & { level: 1 | 2 | 3 | 4 | 5 | 6 }>(
  ({ level, ...props }, ref) => {
    const variant = `h${level}` as TypographyVariant;
    return <Typography ref={ref} variant={variant} {...props} />;
  }
);

Heading.displayName = 'Heading';

export const Text = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'> & { size?: 'sm' | 'base' }>(
  ({ size = 'base', ...props }, ref) => {
    const variant = size === 'sm' ? 'body2' : 'body1';
    return <Typography ref={ref} variant={variant} {...props} />;
  }
);

Text.displayName = 'Text';

export const Caption = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => {
    return <Typography ref={ref} variant="caption" color="muted" {...props} />;
  }
);

Caption.displayName = 'Caption';

export const Overline = forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
  (props, ref) => {
    return <Typography ref={ref} variant="overline" color="muted" {...props} />;
  }
);

Overline.displayName = 'Overline';