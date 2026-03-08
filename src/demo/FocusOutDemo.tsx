import { useState } from 'react';
import { useFocusOut } from '@hooks/useFocusOut';

export default function FocusOutDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useFocusOut<HTMLDivElement>({
    onFocusOut: () => setIsOpen(false),
    enabled: isOpen,
  });

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>드롭다운 열기</button>
      {isOpen && (
        <div ref={ref} tabIndex={-1} style={{ border: '1px solid #ccc', padding: 16 }}>
          <p>포커스가 이 영역을 벗어나면 닫힙니다.</p>
          <button>내부 버튼 A</button>
          <button>내부 버튼 B</button>
        </div>
      )}
    </div>
  );
}
