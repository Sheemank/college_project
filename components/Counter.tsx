import React from 'react';
import useAnimatedCounter from '../hooks/useAnimatedCounter';

interface CounterProps {
  targetValue: number;
  label: string;
  suffix?: string;
}

const Counter: React.FC<CounterProps> = ({ targetValue, label, suffix }) => {
  const { count, ref } = useAnimatedCounter(targetValue);

  return (
    <div className="text-center">
      <span ref={ref} className="text-4xl md:text-5xl font-bold text-indigo-600">
        {count.toLocaleString()}{suffix}
      </span>
      <p className="mt-2 text-slate-500">{label}</p>
    </div>
  );
};

export default Counter;