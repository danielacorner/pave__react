import { useState, useEffect, useCallback } from 'react';

export const useWindowSize = () => {
  const isClient = typeof window === 'object';

  const getSize = useCallback(
    function getSize() {
      return {
        innerWidth: isClient ? window.innerWidth : undefined,
        innerHeight: isClient ? window.innerHeight : undefined,
      };
    },
    [isClient],
  );

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getSize, isClient]); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
};
