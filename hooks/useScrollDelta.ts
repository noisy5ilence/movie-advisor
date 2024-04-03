import { useCallback, useRef } from 'react';

export default function useScrollDelta() {
  const lastKnownScrollPosition = useRef(0);
  const deltaY = useRef(0);

  return {
    delta: deltaY,
    onScroll: useCallback((scroll: React.UIEvent<HTMLDivElement, UIEvent>) => {
      let ticking = false;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const top = (scroll.target as HTMLDivElement).scrollTop;

          deltaY.current = top - lastKnownScrollPosition.current;

          lastKnownScrollPosition.current = top;

          ticking = false;
        });

        ticking = true;
      }
    }, [])
  };
}
