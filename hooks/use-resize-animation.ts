import { useState, useCallback } from 'react';

interface UseResizeAnimationOptions {
  initialHeight?: number;
  targetHeight?: number;
  duration?: number;
}

export function useResizeAnimation(options: UseResizeAnimationOptions = {}) {
  const {
    initialHeight = 100,
    targetHeight = 99,
    duration = 200
  } = options;

  const [heightPercentage, setHeightPercentage] = useState<number>(initialHeight);

  const triggerResizeAnimation = useCallback(() => {
    // Animate height from initial to target and back to initial
    setHeightPercentage(targetHeight);
    setTimeout(() => {
      setHeightPercentage(initialHeight);
    }, duration);
  }, [initialHeight, targetHeight, duration]);

  const resetHeight = useCallback(() => {
    setHeightPercentage(initialHeight);
  }, [initialHeight]);

  return {
    heightPercentage,
    triggerResizeAnimation,
    resetHeight,
    setHeightPercentage
  };
} 