import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 일정 간격으로 콜백을 실행합니다. delay가 null이면 일시정지됩니다.
 * @param callback 실행할 함수
 * @param delay 실행 간격 (ms), null이면 일시정지
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * 제어 가능한 인터벌 훅.
 * @param callback 실행할 함수
 * @param delay 실행 간격 (ms)
 * @returns { start, stop, reset, isRunning }
 */
export function useControllableInterval(
  callback: () => void,
  delay: number,
): {
  start: () => void;
  stop: () => void;
  reset: () => void;
  isRunning: boolean;
} {
  const savedCallback = useRef(callback);
  const idRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (idRef.current !== null) {
      clearInterval(idRef.current);
      idRef.current = null;
      setIsRunning(false);
    }
  }, []);

  const start = useCallback(() => {
    if (idRef.current !== null) return;
    idRef.current = setInterval(() => savedCallback.current(), delay);
    setIsRunning(true);
  }, [delay]);

  const reset = useCallback(() => {
    stop();
    setTimeout(() => {
      idRef.current = setInterval(() => savedCallback.current(), delay);
      setIsRunning(true);
    }, 0);
  }, [stop, delay]);

  useEffect(() => () => stop(), [stop]);

  return { start, stop, reset, isRunning };
}
