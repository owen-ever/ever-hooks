import { useRef, useState, useEffect } from 'react';

/**
 * 요소에 마우스가 올라가 있는지 추적합니다.
 * @returns [ref, isHovered] 튜플
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  React.RefObject<T>,
  boolean,
] {
  const ref = useRef<T>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}
