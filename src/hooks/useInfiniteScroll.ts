import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export interface UseInfiniteScrollReturn {
  loaderRef: React.RefObject<HTMLDivElement>;
  page: number;
  reset: () => void;
  isFetching: boolean;
  setIsFetching: (v: boolean) => void;
}

/**
 * Intersection Observer를 활용한 무한 스크롤 훅입니다.
 * loaderRef를 리스트 하단 sentinel 요소에 연결하세요.
 * @param options threshold, rootMargin, enabled
 * @returns loaderRef, page, reset, isFetching 상태
 */
export function useInfiniteScroll({
  threshold = 0.1,
  rootMargin = '0px',
  enabled = true,
}: UseInfiniteScrollOptions = {}): UseInfiniteScrollReturn {
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  // ref로 관리해 Observer effect 재등록 없이 최신 값 참조
  const isFetchingRef = useRef(isFetching);
  useEffect(() => {
    isFetchingRef.current = isFetching;
  }, [isFetching]);

  const reset = useCallback(() => {
    setPage(1);
    setIsFetching(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const element = loaderRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingRef.current) {
          setPage((prev) => prev + 1);
          setIsFetching(true);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
    // isFetching은 ref로 관리하므로 deps에서 제외
  }, [enabled, threshold, rootMargin]);

  return { loaderRef, page, reset, isFetching, setIsFetching };
}
