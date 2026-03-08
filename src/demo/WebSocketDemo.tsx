import { useState } from 'react';
import { useWebSocket } from '@hooks/useWebSocket';

export default function WebSocketDemo() {
  const [connected, setConnected] = useState(false);
  const { status, lastMessage, send, disconnect, reconnect } = useWebSocket(
    // 데모 전용 echo 서버 (실제 환경에서 변경 필요)
    connected ? 'wss://echo.websocket.org' : null,
  );

  return (
    <div>
      <p>
        연결 상태:{' '}
        <span
          style={{
            color:
              status === 'open' ? 'green' : status === 'error' ? 'red' : '#888',
          }}
        >
          {status}
        </span>
      </p>
      <p>마지막 메시지: {lastMessage ? JSON.stringify(lastMessage) : '(없음)'}</p>
      <button onClick={() => setConnected(true)}>연결</button>
      <button onClick={() => { disconnect(); setConnected(false); }}>연결 해제</button>
      <button onClick={() => send(JSON.stringify({ hello: 'world' }))}>
        메시지 전송
      </button>
      <button onClick={reconnect}>재연결</button>
    </div>
  );
}
