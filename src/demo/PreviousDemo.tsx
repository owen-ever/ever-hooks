import { useState } from 'react';
import { usePrevious } from '@hooks/usePrevious';

export default function PreviousDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>현재 값: {count}</p>
      <p>이전 값: {prevCount ?? '없음'}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <button onClick={() => setCount((c) => c - 1)}>-1</button>
    </div>
  );
}
