import { useState, useEffect } from 'react';

/**
 * 값 변경을 지연시켜 불필요한 업데이트를 방지합니다.
 * @param value 디바운스할 값
 * @param delay 지연 시간 (ms), 기본값 300ms
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
