import { useState, useEffect, useRef, useCallback } from 'react';

export type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

export interface UseWebSocketOptions {
  protocols?: string | string[];
  reconnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
}

export interface UseWebSocketReturn<T = unknown> {
  status: WebSocketStatus;
  lastMessage: T | null;
  send: (data: string | ArrayBuffer | Blob) => void;
  disconnect: () => void;
  reconnect: () => void;
}

/**
 * WebSocket 연결을 관리하고 자동 재연결을 지원합니다.
 * @param url WebSocket URL (null이면 연결 안 함)
 * @param options 연결 옵션
 * @returns 상태 및 제어 함수
 */
export function useWebSocket<T = unknown>(
  url: string | null,
  options: UseWebSocketOptions = {},
): UseWebSocketReturn<T> {
  const {
    protocols,
    reconnect = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    onOpen,
    onClose,
    onError,
    onMessage,
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<T | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(reconnect);
  const urlRef = useRef(url);

  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const onErrorRef = useRef(onError);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onOpenRef.current = onOpen;
    onCloseRef.current = onClose;
    onErrorRef.current = onError;
    onMessageRef.current = onMessage;
    shouldReconnectRef.current = reconnect;
    urlRef.current = url;
  });

  // protocols를 ref로 관리해 매 렌더마다 새 배열 참조로 인한 무한 재연결 방지
  const protocolsRef = useRef(protocols);
  useEffect(() => {
    protocolsRef.current = protocols;
  });

  const connect = useCallback(() => {
    if (!urlRef.current) return;
    if (
      wsRef.current?.readyState === WebSocket.OPEN ||
      wsRef.current?.readyState === WebSocket.CONNECTING
    )
      return;

    setStatus('connecting');
    const ws = new WebSocket(urlRef.current, protocolsRef.current);
    wsRef.current = ws;

    ws.onopen = (event) => {
      setStatus('open');
      reconnectAttemptsRef.current = 0;
      onOpenRef.current?.(event);
    };

    ws.onclose = (event) => {
      setStatus('closed');
      onCloseRef.current?.(event);

      if (
        shouldReconnectRef.current &&
        reconnectAttemptsRef.current < maxReconnectAttempts
      ) {
        reconnectAttemptsRef.current++;
        reconnectTimerRef.current = setTimeout(connect, reconnectDelay);
      }
    };

    ws.onerror = (event) => {
      setStatus('error');
      onErrorRef.current?.(event);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as T;
        setLastMessage(parsed);
      } catch {
        setLastMessage(event.data as T);
      }
      onMessageRef.current?.(event);
    };
  }, [maxReconnectAttempts, reconnectDelay]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    wsRef.current?.close();
  }, []);

  const reconnectFn = useCallback(() => {
    disconnect();
    shouldReconnectRef.current = reconnect;
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect, disconnect, reconnect]);

  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    } else {
      console.warn('[useWebSocket] Cannot send — WebSocket is not open');
    }
  }, []);

  useEffect(() => {
    if (!url) return;
    connect();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      wsRef.current?.close();
    };
  }, [url, connect]);

  return { status, lastMessage, send, disconnect, reconnect: reconnectFn };
}
