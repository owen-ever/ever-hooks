import { useHover } from '@hooks/useHover';

export default function HoverDemo() {
  const [ref, isHovered] = useHover<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{
        padding: 32,
        background: isHovered ? '#4f46e5' : '#e5e7eb',
        color: isHovered ? '#fff' : '#111',
        borderRadius: 8,
        transition: 'all 0.2s',
        cursor: 'pointer',
        display: 'inline-block',
      }}
    >
      {isHovered ? '호버 중! ✨' : '마우스를 올려보세요'}
    </div>
  );
}
