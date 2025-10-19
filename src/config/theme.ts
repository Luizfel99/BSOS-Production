/**
 * BSOS Design System Theme Configuration
 * 
 * Central configuration for the BSOS design system including
 * colors, typography, spacing, and component variants.
 */

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeColors {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  background: {
    primary: string;
    secondary: string;
    card: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    light: string;
    medium: string;
    strong: string;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeTypography {
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTransitions {
  fast: string;
  normal: string;
  slow: string;
}

export interface ThemeZIndex {
  dropdown: number;
  sticky: number;
  fixed: number;
  modalBackdrop: number;
  modal: number;
  popover: number;
  tooltip: number;
  toast: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
  zIndex: ThemeZIndex;
}

// BSOS Color Palette
export const colors: ThemeColors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  background: {
    primary: 'var(--color-background-primary)',
    secondary: 'var(--color-background-secondary)',
    card: 'var(--color-background-card)',
    overlay: 'var(--color-background-overlay)',
  },
  text: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    muted: 'var(--color-text-muted)',
    inverse: 'var(--color-text-inverse)',
  },
  border: {
    light: 'var(--color-border-light)',
    medium: 'var(--color-border-medium)',
    strong: 'var(--color-border-strong)',
  },
};

// Spacing Scale
export const spacing: ThemeSpacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
};

// Typography
export const typography: ThemeTypography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Border Radius
export const borderRadius: ThemeBorderRadius = {
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Shadows
export const shadows: ThemeShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Transitions
export const transitions: ThemeTransitions = {
  fast: '150ms ease-in-out',
  normal: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

// Z-Index Scale
export const zIndex: ThemeZIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

// Complete Theme Object
export const theme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
};

// Component Variants
export const componentVariants = {
  button: {
    size: {
      sm: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.md,
      },
      lg: {
        padding: `${spacing.lg} ${spacing.xl}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.lg,
      },
    },
    variant: {
      primary: {
        backgroundColor: colors.primary[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.primary[500]}`,
        '&:hover': {
          backgroundColor: colors.primary[600],
          borderColor: colors.primary[600],
        },
        '&:focus': {
          outline: `2px solid ${colors.primary[500]}`,
          outlineOffset: '2px',
        },
      },
      secondary: {
        backgroundColor: colors.secondary[500],
        color: colors.text.inverse,
        border: `1px solid ${colors.secondary[500]}`,
        '&:hover': {
          backgroundColor: colors.secondary[600],
          borderColor: colors.secondary[600],
        },
      },
      outline: {
        backgroundColor: 'transparent',
        color: colors.primary[600],
        border: `1px solid ${colors.primary[500]}`,
        '&:hover': {
          backgroundColor: colors.primary[50],
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        border: '1px solid transparent',
        '&:hover': {
          backgroundColor: colors.neutral[100],
        },
      },
    },
  },
  input: {
    size: {
      sm: {
        padding: `${spacing.sm} ${spacing.md}`,
        fontSize: typography.fontSize.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: `${spacing.md} ${spacing.lg}`,
        fontSize: typography.fontSize.base,
        borderRadius: borderRadius.md,
      },
      lg: {
        padding: `${spacing.lg} ${spacing.xl}`,
        fontSize: typography.fontSize.lg,
        borderRadius: borderRadius.lg,
      },
    },
  },
  card: {
    variant: {
      default: {
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.sm,
      },
      elevated: {
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.light}`,
        borderRadius: borderRadius.lg,
        boxShadow: shadows.md,
      },
      outlined: {
        backgroundColor: colors.background.card,
        border: `1px solid ${colors.border.medium}`,
        borderRadius: borderRadius.lg,
        boxShadow: 'none',
      },
    },
  },
};

// BSOS Brand Configuration
export const bsosBrand = {
  colors: {
    primary: 'var(--bsos-primary)',
    secondary: 'var(--bsos-secondary)',
    success: 'var(--bsos-success)',
    warning: 'var(--bsos-warning)',
    error: 'var(--bsos-error)',
  },
  radius: 'var(--bsos-radius)', // rounded-xl (12px)
  shadow: {
    default: 'var(--bsos-shadow)',
    hover: 'var(--bsos-shadow-hover)',
  },
  transition: 'var(--transition-normal)',
};

// Typography Class System
export const typographyClasses = {
  h1: 'text-3xl font-bold text-gray-900 dark:text-white',
  h2: 'text-2xl font-semibold text-gray-800 dark:text-gray-100',
  h3: 'text-xl font-semibold text-gray-800 dark:text-gray-100',
  h4: 'text-lg font-medium text-gray-700 dark:text-gray-200',
  body: 'text-base text-gray-700 dark:text-gray-200',
  bodyLarge: 'text-lg text-gray-700 dark:text-gray-200',
  bodySmall: 'text-sm text-gray-600 dark:text-gray-300',
  caption: 'text-xs text-gray-500 dark:text-gray-400',
  overline: 'text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400',
};

export default theme;