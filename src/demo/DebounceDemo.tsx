import { useState } from 'react';
import { useDebounce } from '@hooks/useDebounce';

export default function DebounceDemo() {
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 500);

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="타이핑하세요..."
      />
      <p>입력값: {input}</p>
      <p>디바운스 값 (500ms): {debouncedInput}</p>
    </div>
  );
}
