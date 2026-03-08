import { useState, useEffect } from 'react';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';

const PAGE_SIZE = 10;

function generateItems(page: number) {
  return Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: (page - 1) * PAGE_SIZE + i + 1,
    text: `아이템 #${(page - 1) * PAGE_SIZE + i + 1}`,
  }));
}

export default function InfiniteScrollDemo() {
  const [items, setItems] = useState(() => generateItems(1));
  const { loaderRef, page, isFetching, setIsFetching, reset } = useInfiniteScroll({
    threshold: 0.5,
  });

  useEffect(() => {
    if (page === 1) return;
    // 실제 환경에서는 API 호출
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateItems(page)]);
      setIsFetching(false);
    }, 800);
  }, [page, setIsFetching]);

  return (
    <div style={{ height: 400, overflowY: 'auto', border: '1px solid #ccc', padding: 8 }}>
      {items.map((item) => (
        <div key={item.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
          {item.text}
        </div>
      ))}
      <div ref={loaderRef} style={{ padding: 8, textAlign: 'center', color: '#888' }}>
        {isFetching ? '불러오는 중...' : '스크롤하여 더 보기'}
      </div>
      <button onClick={() => { reset(); setItems(generateItems(1)); }}>초기화</button>
    </div>
  );
}
