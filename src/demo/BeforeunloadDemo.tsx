import { useState } from 'react';
import { useBeforeunload } from '@hooks/useBeforeunload';

export default function BeforeunloadDemo() {
  const [isDirty, setIsDirty] = useState(false);
  const [text, setText] = useState('');

  useBeforeunload(isDirty, '저장되지 않은 변경 사항이 있습니다. 정말 나가시겠습니까?');

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setIsDirty(true);
        }}
        placeholder="내용을 입력하면 페이지를 떠날 때 확인 대화상자가 표시됩니다."
        rows={4}
        cols={40}
      />
      <div>
        <button onClick={() => { setIsDirty(false); setText(''); }}>
          저장 (dirty 해제)
        </button>
        <p>변경 감지 중: {isDirty ? '🔴 예' : '🟢 아니오'}</p>
      </div>
    </div>
  );
}
