import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * 값을 스로틀링합니다. limit 시간 내에는 마지막 변경만 반영됩니다.
 * @param value 스로틀할 값
 * @param limit 제한 시간 (ms), 기본값 300ms
 * @returns 스로틀된 값
 */
export function useThrottle<T>(value: T, limit = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const remaining = limit - (now - lastRan.current);

    if (remaining <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      lastRan.current = now;
      setThrottledValue(value);
    } else {
      timerRef.current = setTimeout(() => {
        lastRan.current = Date.now();
        timerRef.current = null;
        setThrottledValue(value);
      }, remaining);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * 함수를 스로틀링합니다.
 * @param fn 스로틀할 함수
 * @param limit 제한 시간 (ms), 기본값 300ms
 * @returns 스로틀된 함수
 */
export function useThrottleFn<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  limit = 300,
): (...args: Parameters<T>) => void {
  const lastRan = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  });

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const remaining = limit - (now - lastRan.current);

      if (remaining <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastRan.current = now;
        fnRef.current(...args);
      } else {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          lastRan.current = Date.now();
          timerRef.current = null;
          fnRef.current(...args);
        }, remaining);
      }
    },
    [limit],
  );
}
