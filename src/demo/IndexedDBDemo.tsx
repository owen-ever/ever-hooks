import { useState } from 'react';
import { useIndexedDB } from '@hooks/useIndexedDB';

export default function IndexedDBDemo() {
  const { status, getItem, setItem, removeItem, getAllKeys } = useIndexedDB<string>({
    dbName: 'ever-hooks-demo',
    storeName: 'notes',
  });

  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string>('');
  const [keys, setKeys] = useState<IDBValidKey[]>([]);

  if (status !== 'ready') return <p>DB 상태: {status}</p>;

  return (
    <div>
      <div>
        <input placeholder="키" value={key} onChange={(e) => setKey(e.target.value)} />
        <input placeholder="값" value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => setItem(key, value).then(() => setResult('저장 완료'))}>
          저장
        </button>
        <button onClick={() => getItem(key).then((v) => setResult(v ?? '(없음)'))}>
          조회
        </button>
        <button onClick={() => removeItem(key).then(() => setResult('삭제 완료'))}>
          삭제
        </button>
        <button onClick={() => getAllKeys().then((k) => setKeys(k))}>전체 키 조회</button>
      </div>
      {result && <p>결과: {result}</p>}
      {keys.length > 0 && <p>키 목록: {keys.map(String).join(', ')}</p>}
    </div>
  );
}
