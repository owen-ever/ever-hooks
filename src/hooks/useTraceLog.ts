import { useEffect, useRef } from 'react';

export interface TraceLogEntry {
  timestamp: number;
  name: string;
  value: unknown;
  prevValue: unknown;
  renderCount: number;
}

export interface UseTraceLogOptions {
  enabled?: boolean;
  logger?: (entry: TraceLogEntry) => void;
  onlyChanges?: boolean;
}

/**
 * 값의 변화를 추적하여 디버그 로그를 출력합니다. 개발 시 렌더링 원인 파악에 유용합니다.
 * @param name 추적할 값의 이름
 * @param value 추적할 값
 * @param options enabled, logger, onlyChanges
 */
export function useTraceLog<T>(
  name: string,
  value: T,
  options: UseTraceLogOptions = {},
): void {
  const { enabled = true, logger, onlyChanges = false } = options;

  const prevValueRef = useRef<T | undefined>(undefined);
  const renderCountRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    renderCountRef.current++;
    const prevValue = prevValueRef.current;
    const hasChanged = prevValue !== value;

    if (onlyChanges && !hasChanged) {
      prevValueRef.current = value;
      return;
    }

    const entry: TraceLogEntry = {
      timestamp: Date.now(),
      name,
      value,
      prevValue,
      renderCount: renderCountRef.current,
    };

    if (logger) {
      logger(entry);
    } else {
      const label = hasChanged ? `[TraceLog] 🔄 ${name} changed` : `[TraceLog] ${name}`;
      console.group(label);
      console.log('Value:', value);
      if (hasChanged) console.log('Prev:', prevValue);
      console.log('Render #', renderCountRef.current);
      console.groupEnd();
    }

    prevValueRef.current = value;
  });
}
