/**
 * useMediaQuery Hook
 * Detects screen width and provides responsive breakpoint utilities
 */

import { useState, useEffect } from 'react';

interface MediaQueryBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  screenWidth: number;
}

export const useMediaQuery = (): MediaQueryBreakpoints => {
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    // Set initial width
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };

    // Set initial value
    updateScreenWidth();

    // Add event listener
    window.addEventListener('resize', updateScreenWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, []);

  return {
    screenWidth,
    isMobile: screenWidth < 768,     // 0 - 767px
    isTablet: screenWidth >= 768 && screenWidth < 1024,  // 768 - 1023px
    isDesktop: screenWidth >= 1024 && screenWidth < 1280, // 1024 - 1279px
    isLargeDesktop: screenWidth >= 1280, // 1280px+
  };
};

// Utility hook for specific breakpoints
export const useBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl') => {
  const { screenWidth } = useMediaQuery();

  const breakpoints = {
    sm: 640,   // Tailwind sm
    md: 768,   // Tailwind md
    lg: 1024,  // Tailwind lg
    xl: 1280,  // Tailwind xl
  };

  return screenWidth >= breakpoints[breakpoint];
};

// Hook for mobile-first responsive design
export const useMobileFirst = () => {
  const { isMobile, isTablet, isDesktop, screenWidth } = useMediaQuery();

  return {
    isMobile,
    isTablet,
    isDesktop,
    isDesktopOrLarger: screenWidth >= 1024,
    isMobileOrTablet: screenWidth < 1024,
    screenWidth,
  };
};