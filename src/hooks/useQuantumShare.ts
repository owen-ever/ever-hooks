import { useState, useCallback } from 'react';

export type ShareStatus = 'idle' | 'sharing' | 'success' | 'error' | 'unsupported';

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface UseQuantumShareReturn {
  status: ShareStatus;
  error: Error | null;
  share: (data: ShareData) => Promise<void>;
  isSupported: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

/**
 * Web Share API와 클립보드 복사를 통합한 공유 훅입니다.
 * 브라우저 지원 여부에 따라 자동으로 클립보드 폴백을 제공합니다.
 * @returns share 함수, status, error, isSupported, copyToClipboard
 */
export function useQuantumShare(): UseQuantumShareReturn {
  const [status, setStatus] = useState<ShareStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const isSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const share = useCallback(
    async (data: ShareData) => {
      setStatus('sharing');
      setError(null);

      if (!isSupported) {
        setStatus('unsupported');
        // Fallback: copy URL to clipboard
        if (data.url) {
          try {
            await navigator.clipboard.writeText(data.url);
            setStatus('success');
          } catch (err) {
            const e = err instanceof Error ? err : new Error('Clipboard write failed');
            setError(e);
            setStatus('error');
          }
        }
        return;
      }

      try {
        await navigator.share(data as ShareData & { files?: File[] });
        setStatus('success');
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        const e = err instanceof Error ? err : new Error('Share failed');
        setError(e);
        setStatus('error');
      }
    },
    [isSupported],
  );

  const copyToClipboard = useCallback(async (text: string) => {
    setStatus('sharing');
    setError(null);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('success');
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Clipboard write failed');
      setError(e);
      setStatus('error');
    }
  }, []);

  return { status, error, share, isSupported, copyToClipboard };
}
