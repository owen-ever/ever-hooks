import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BreakpointConfig {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
}

const DEFAULT_BREAKPOINTS: Required<BreakpointConfig> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

function getBreakpoint(width: number, breakpoints: Required<BreakpointConfig>): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * 현재 화면 너비에 해당하는 브레이크포인트를 반환합니다.
 * @param customBreakpoints 커스텀 브레이크포인트 설정
 * @returns 현재 브레이크포인트 ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 */
export function useBreakpoint(customBreakpoints?: BreakpointConfig): Breakpoint {
  const breakpoints = { ...DEFAULT_BREAKPOINTS, ...customBreakpoints };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window !== 'undefined'
      ? getBreakpoint(window.innerWidth, breakpoints)
      : 'md',
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth, breakpoints));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
    // breakpoints object changes only if customBreakpoints changes; spread is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(customBreakpoints)]);

  return breakpoint;
}
