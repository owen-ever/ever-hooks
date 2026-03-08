import { useBreakpoint } from '@hooks/useBreakpoint';

export default function BreakpointDemo() {
  const breakpoint = useBreakpoint();

  return (
    <div>
      <p>현재 브레이크포인트: <strong>{breakpoint}</strong></p>
      <p>
        {breakpoint === 'xs' && '📱 모바일 소형'}
        {breakpoint === 'sm' && '📱 모바일 대형'}
        {breakpoint === 'md' && '💻 태블릿'}
        {breakpoint === 'lg' && '🖥️ 데스크탑'}
        {breakpoint === 'xl' && '🖥️ 대형 데스크탑'}
        {breakpoint === '2xl' && '🖥️ 초대형 모니터'}
      </p>
      <p style={{ color: '#888', fontSize: 14 }}>창 크기를 조절해보세요</p>
    </div>
  );
}
