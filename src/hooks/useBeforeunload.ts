import { useEffect, useRef } from 'react';

/**
 * 페이지를 떠나기 전 확인 다이얼로그를 표시합니다.
 * @param enabled 활성화 여부 (기본값: true)
 * @param message 일부 브라우저에서 표시할 메시지 (대부분 무시됨)
 */
export function useBeforeunload(
  enabled = true,
  message = '변경 사항이 저장되지 않을 수 있습니다.',
): void {
  const messageRef = useRef(message);

  useEffect(() => {
    messageRef.current = message;
  }, [message]);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Chrome requires returnValue to be set
      event.returnValue = messageRef.current;
      return messageRef.current;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
