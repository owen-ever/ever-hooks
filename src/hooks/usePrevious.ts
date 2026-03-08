import { useRef, useEffect } from 'react';

/**
 * 이전 렌더링 사이클의 값을 추적합니다.
 * @param value 추적할 값
 * @returns 이전 값 (초기 렌더링 시 undefined)
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
