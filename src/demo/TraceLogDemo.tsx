import { useState } from 'react';
import { useTraceLog } from '@hooks/useTraceLog';

export default function TraceLogDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  useTraceLog('count', count, { onlyChanges: true });
  useTraceLog('name', name, { onlyChanges: true });

  return (
    <div>
      <p>브라우저 콘솔에서 변경 추적 로그를 확인하세요.</p>
      <div>
        <button onClick={() => setCount((c) => c + 1)}>count 증가: {count}</button>
      </div>
      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력 (변경 추적)"
        />
      </div>
    </div>
  );
}
