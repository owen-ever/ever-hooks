import { useRef, useEffect, useCallback } from 'react';

export interface UseFocusOutOptions {
  onFocusOut: () => void;
  enabled?: boolean;
}

/**
 * 요소 외부로 포커스가 이동할 때 콜백을 호출합니다.
 * @param options onFocusOut 콜백과 enabled 여부
 * @returns ref를 연결할 RefObject
 */
export function useFocusOut<T extends HTMLElement = HTMLElement>({
  onFocusOut,
  enabled = true,
}: UseFocusOutOptions) {
  const ref = useRef<T>(null);
  const onFocusOutRef = useRef(onFocusOut);

  useEffect(() => {
    onFocusOutRef.current = onFocusOut;
  }, [onFocusOut]);

  const handleFocusOut = useCallback((event: FocusEvent) => {
    if (!ref.current) return;
    const relatedTarget = event.relatedTarget as Node | null;
    if (relatedTarget && ref.current.contains(relatedTarget)) return;
    onFocusOutRef.current();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    element.addEventListener('focusout', handleFocusOut);
    return () => {
      element.removeEventListener('focusout', handleFocusOut);
    };
  }, [enabled, handleFocusOut]);

  return ref;
}
