import { useQuantumShare } from '@hooks/useQuantumShare';

export default function QuantumShareDemo() {
  const { status, error, share, isSupported, copyToClipboard } = useQuantumShare();

  return (
    <div>
      <p>Web Share API 지원: {isSupported ? '✅ 예' : '❌ 아니오 (클립보드 폴백)'}</p>
      <p>
        상태:{' '}
        <span style={{ color: status === 'success' ? 'green' : status === 'error' ? 'red' : '#888' }}>
          {status}
        </span>
      </p>
      {error && <p style={{ color: 'red' }}>오류: {error.message}</p>}
      <button
        onClick={() =>
          share({
            title: 'ever-hooks',
            text: 'React Custom Hooks 라이브러리',
            url: 'https://github.com/owen-ever/ever-hooks',
          })
        }
      >
        공유하기
      </button>
      <button onClick={() => copyToClipboard('https://github.com/owen-ever/ever-hooks')}>
        링크 복사
      </button>
    </div>
  );
}
