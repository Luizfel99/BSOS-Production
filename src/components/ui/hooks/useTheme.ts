/**
 * Theme Hook
 * 
 * Provides access to the BSOS design system theme configuration
 */

import { theme } from '@/config/theme';

export function useTheme() {
  return theme;
}