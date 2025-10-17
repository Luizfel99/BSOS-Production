/**
 * Responsive Hook
 * 
 * Provides responsive breakpoint detection for BSOS components
 */

import { useState, useEffect } from 'react';

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop' | 'large';
}

const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
  large: 1280,
};

export function useResponsive(): BreakpointState {
  const [breakpointState, setBreakpointState] = useState<BreakpointState>({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    isLarge: false,
    currentBreakpoint: 'mobile',
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      const isMobile = width < breakpoints.tablet;
      const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
      const isDesktop = width >= breakpoints.desktop && width < breakpoints.large;
      const isLarge = width >= breakpoints.large;

      let currentBreakpoint: BreakpointState['currentBreakpoint'] = 'mobile';
      if (isLarge) currentBreakpoint = 'large';
      else if (isDesktop) currentBreakpoint = 'desktop';
      else if (isTablet) currentBreakpoint = 'tablet';

      setBreakpointState({
        isMobile,
        isTablet,
        isDesktop,
        isLarge,
        currentBreakpoint,
      });
    };

    // Set initial state
    updateBreakpoint();

    // Add event listener
    window.addEventListener('resize', updateBreakpoint);

    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpointState;
}