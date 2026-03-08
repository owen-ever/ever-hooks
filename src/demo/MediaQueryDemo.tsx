import { useMediaQuery } from '@hooks/useMediaQuery';

export default function MediaQueryDemo() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div>
      <p>📱 모바일: {isMobile ? '예' : '아니오'}</p>
      <p>🌙 다크 모드: {isDark ? '예' : '아니오'}</p>
      <p>🎬 애니메이션 감소: {isReducedMotion ? '예' : '아니오'}</p>
    </div>
  );
}
