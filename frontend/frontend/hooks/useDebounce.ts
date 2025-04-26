// hooks/useDebounce.ts
import { useEffect, useState } from "react";
import { debounce } from "lodash";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const debounced = debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay);

    debounced(value);

    // Cleanup: Cancel debounce on unmount or value change
    return () => {
      debounced.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;