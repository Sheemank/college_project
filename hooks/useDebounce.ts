import { useState, useEffect } from 'react';

// A custom hook to debounce a value.
// It will only update the returned value if the input value has not changed for the specified delay.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function that React will run when the component unmounts
    // or when the dependencies (value, delay) change.
    // It clears the timeout, so if the user types again within the delay, the previous timeout is cancelled.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect only if value or delay changes.

  return debouncedValue;
}
