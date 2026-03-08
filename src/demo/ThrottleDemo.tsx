import { useState } from 'react';
import { useThrottleFn } from '@hooks/useThrottle';

export default function ThrottleDemo() {
  const [clickCount, setClickCount] = useState(0);
  const [throttledCount, setThrottledCount] = useState(0);

  const throttledClick = useThrottleFn(() => {
    setThrottledCount((c) => c + 1);
  }, 1000);

  return (
    <div>
      <p>실제 클릭: {clickCount}회</p>
      <p>스로틀된 실행: {throttledCount}회 (1초 간격)</p>
      <button
        onClick={() => {
          setClickCount((c) => c + 1);
          throttledClick();
        }}
      >
        빠르게 클릭!
      </button>
    </div>
  );
}
