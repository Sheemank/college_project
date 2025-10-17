
import { useState, useEffect, useRef } from 'react';

const useAnimatedCounter = (targetValue: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const startAnimation = (target: HTMLSpanElement) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * targetValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    if (ref.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation(ref.current!);
            observer.current?.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      observer.current.observe(ref.current);
    }

    return () => {
      observer.current?.disconnect();
    };
  }, [targetValue, duration]);

  return { count, ref };
};

export default useAnimatedCounter;
