import { useState, useEffect, useRef, useCallback } from 'react';

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseFetchState<T> {
  data: T | null;
  error: Error | null;
  status: FetchStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface UseFetchOptions<T = unknown> extends RequestInit {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

/**
 * HTTP 요청을 수행하고 로딩/에러/데이터 상태를 관리합니다.
 * @param url 요청 URL (null이면 비활성화)
 * @param options fetch 옵션 및 enabled 여부
 * @returns 상태 객체와 refetch 함수
 */
export function useFetch<T = unknown>(
  url: string | null,
  options: UseFetchOptions<T> = {},
): UseFetchState<T> & { refetch: () => void } {
  const { enabled = true, onSuccess, onError, ...fetchOptions } = options;
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    error: null,
    status: 'idle',
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const fetchOptionsRef = useRef(fetchOptions);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
    fetchOptionsRef.current = fetchOptions;
  });

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setState({
      data: null,
      error: null,
      status: 'loading',
      isLoading: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const response = await fetch(url, {
        ...fetchOptionsRef.current,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as T;

      setState({
        data,
        error: null,
        status: 'success',
        isLoading: false,
        isSuccess: true,
        isError: false,
      });

      onSuccessRef.current?.(data);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      const error = err instanceof Error ? err : new Error(String(err));

      setState({
        data: null,
        error,
        status: 'error',
        isLoading: false,
        isSuccess: false,
        isError: true,
      });

      onErrorRef.current?.(error);
    }
  // fetchOptions는 ref로 관리하므로 deps에서 제외 (함수 참조 등 직렬화 불가 값 안전 처리)
  }, [url, enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}
