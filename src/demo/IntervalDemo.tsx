import { useState } from 'react';
import { useInterval } from '@hooks/useInterval';

export default function IntervalDemo() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  useInterval(
    () => {
      setCount((c) => c + 1);
    },
    running ? 1000 : null,
  );

  return (
    <div>
      <p>카운터: {count}</p>
      <button onClick={() => setRunning((r) => !r)}>
        {running ? '⏸ 일시정지' : '▶ 시작'}
      </button>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  );
}
